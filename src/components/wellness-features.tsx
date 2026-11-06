import { useState } from "react";
import { Activity, ArrowRight, Check, Clock, Copy, Dumbbell, HeartHandshake, Leaf, MessageCircle, MoveUpRight, Send, ShieldCheck, StretchHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import workoutImage from "@/assets/home-workout.jpg";

const WORKOUTS = {
  Cardio: [
    { name: "Marcha no lugar", dose: "1 minuto", detail: "Alterne os passos e movimente os braços, sem saltar." },
    { name: "Passos laterais", dose: "1 minuto", detail: "Dê um passo para cada lado em um ritmo confortável." },
    { name: "Elevação de joelhos", dose: "30 segundos", detail: "Eleve um joelho de cada vez, sem impacto e com o tronco ereto." },
  ],
  Força: [
    { name: "Sentar e levantar", dose: "8 repetições", detail: "Use uma cadeira firme, encostada na parede. Levante devagar e sente com controle." },
    { name: "Flexão na parede", dose: "8 repetições", detail: "Apoie as mãos na parede, flexione os cotovelos e retorne lentamente." },
    { name: "Elevação de panturrilhas", dose: "10 repetições", detail: "Com apoio em uma parede, eleve os calcanhares e desça devagar." },
  ],
  Alongamento: [
    { name: "Mobilidade de ombros", dose: "30 segundos", detail: "Faça círculos pequenos com os ombros, sem forçar." },
    { name: "Alongamento de panturrilha", dose: "20 segundos por lado", detail: "Apoie as mãos na parede e leve um pé para trás, mantendo o calcanhar no chão." },
    { name: "Alongamento lateral", dose: "20 segundos por lado", detail: "Eleve um braço e incline suavemente o tronco para o lado oposto." },
  ],
};
type Focus = keyof typeof WORKOUTS;
const FOCUSES = [
  { name: "Cardio" as const, icon: Activity },
  { name: "Força" as const, icon: Dumbbell },
  { name: "Alongamento" as const, icon: StretchHorizontal },
];

export function WellnessFeatures() {
  const [dialog, setDialog] = useState<"personal" | "workout" | null>(null);
  const [focus, setFocus] = useState<Focus>("Cardio");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(`Olá! Gostaria de falar com um personal do FitNow.\n\n${message.trim()}`);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  };

  return (
    <>
      <section id="bem-estar" className="scroll-mt-6 border-y border-border bg-secondary/50">
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
          <div className="mb-8 flex items-center gap-2 text-sm font-semibold text-primary"><Leaf className="size-4" /> BEM-ESTAR FITNOW</div>
          <div className="grid gap-8 md:grid-cols-[1fr_1.1fr] md:items-center">
            <div>
              <h2 className="font-display text-3xl font-semibold leading-tight md:text-4xl">Seu próximo passo<br />para uma vida ativa.</h2>
              <p className="mt-4 max-w-md text-muted-foreground">Alimente-se bem, movimente o corpo e encontre apoio para cuidar de você.</p>
              <div className="mt-7 flex flex-col items-start gap-3">
                <Button size="lg" className="h-auto max-w-full gap-3 whitespace-normal px-5 py-3.5" onClick={() => setDialog("workout")}><Dumbbell /> Monte seu Treino em Casa <ArrowRight /></Button>
                <Button variant="outline" size="lg" className="glass h-auto max-w-full whitespace-normal px-5 py-3.5" onClick={() => setDialog("personal")}><MessageCircle /> Falar com o Personal <MoveUpRight /></Button>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg">
              <img src={workoutImage} alt="Mulher fazendo alongamento em casa sobre um tapete de exercícios" width={1280} height={768} loading="lazy" className="aspect-[5/3] w-full object-cover" />
              <div className="glass absolute bottom-3 left-3 flex max-w-[calc(100%-1.5rem)] items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"><HeartHandshake className="size-4 shrink-0 text-primary" /> Movimento que cabe na sua rotina</div>
            </div>
          </div>
          <div className="mt-12 border-t border-border pt-8">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-2"><h3 className="font-display text-xl font-semibold">Parcerias que fazem bem</h3><span className="text-xs text-muted-foreground">Espaços disponíveis para futuras parcerias</span></div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { icon: Dumbbell, label: "Academias & movimento" },
                { icon: Leaf, label: "Alimentação & saúde" },
                { icon: HeartHandshake, label: "Bem-estar & comunidade" },
              ].map(({ icon: Icon, label }) => <div key={label} className="glass flex min-h-24 items-center gap-3 rounded-lg px-5 py-4"><Icon className="size-6 shrink-0 text-primary/70" /><div><p className="text-sm font-semibold">{label}</p><p className="mt-1 text-xs text-muted-foreground">Sua marca aqui</p></div></div>)}
            </div>
          </div>
        </div>
      </section>

      <Button onClick={() => setDialog("personal")} className="fixed bottom-4 right-4 z-30 h-12 gap-2 rounded-full border border-primary-foreground/30 px-4 shadow-lg md:bottom-6 md:right-6" aria-label="Falar com o Personal"><MessageCircle className="size-5" /><span className="hidden sm:inline">Falar com o Personal</span></Button>

      <Dialog open={dialog !== null} onOpenChange={(open) => { if (!open) setDialog(null); }}>
        <DialogContent className="glass max-h-[85svh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-lg bg-background/95 p-5 sm:p-7">
          {dialog === "personal" ? <>
            <span className="grid size-11 place-items-center rounded-lg bg-secondary text-primary"><MessageCircle className="size-5" /></span>
            <DialogTitle className="pr-5 font-display text-2xl">Falar com o Personal</DialogTitle>
            <DialogDescription>Prepare sua dúvida sobre exercícios e hábitos saudáveis.</DialogDescription>
            <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-xs font-medium"><ShieldCheck className="size-4 shrink-0 text-primary" /> Contato demonstrativo · nenhum envio será realizado</div>
            <label htmlFor="personal-message" className="text-sm font-semibold">Qual é a sua dúvida?</label>
            <Textarea id="personal-message" rows={4} maxLength={1500} value={message} placeholder="Quero começar a treinar em casa. Por onde posso começar?" onChange={(event) => { setMessage(event.target.value); setCopied(false); setCopyError(false); }} />
            <p className="text-xs text-muted-foreground">O canal do profissional parceiro ainda não foi definido. Dúvidas nutricionais específicas devem ser orientadas por nutricionista.</p>
            <Button disabled={!message.trim()} onClick={copyMessage} className="h-auto whitespace-normal py-3">{copied ? <Check /> : <Copy />}{copied ? "Mensagem copiada" : "Copiar mensagem para contato"}</Button>
            {copied && <p role="status" className="text-sm text-primary">Mensagem copiada. Nenhuma mensagem foi enviada.</p>}
            {copyError && <p role="alert" className="text-sm text-destructive">Não foi possível copiar. Selecione e copie o texto da sua dúvida.</p>}
          </> : <>
            <span className="grid size-11 place-items-center rounded-lg bg-secondary text-primary"><Dumbbell className="size-5" /></span>
            <DialogTitle className="pr-5 font-display text-2xl">Monte seu Treino em Casa</DialogTitle>
            <DialogDescription>Um momento de movimento, no seu ritmo.</DialogDescription>
            <div className="grid grid-cols-3 gap-2" role="group" aria-label="Foco do treino">
              {FOCUSES.map(({ name, icon: Icon }) => <Button key={name} aria-pressed={focus === name} variant={focus === name ? "default" : "outline"} onClick={() => setFocus(name)} className="h-auto min-w-0 flex-col gap-1 px-1 py-3 text-xs sm:text-sm"><Icon />{name}</Button>)}
            </div>
            <div className="flex items-center justify-between gap-2 border-b border-border pb-3"><h3 className="font-semibold">{focus} em casa</h3><span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="size-3.5" /> Sem equipamentos de academia</span></div>
            <ol className="grid gap-5" aria-live="polite">
              {WORKOUTS[focus].map((exercise, i) => <li key={exercise.name} className="flex gap-3"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-secondary text-sm font-semibold text-primary">{i + 1}</span><div><h4 className="text-sm font-semibold">{exercise.name}</h4><p className="mt-0.5 text-xs font-semibold text-primary">{exercise.dose}</p><p className="mt-1 text-sm text-muted-foreground">{exercise.detail}</p></div></li>)}
            </ol>
            <p className="border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">Sugestões gerais, não um treino personalizado. Descanse entre exercícios e pare se sentir dor, tontura ou falta de ar. Em caso de condição de saúde ou lesão, consulte um profissional antes de começar.</p>
            <Button variant="outline" className="h-auto whitespace-normal py-3" onClick={() => setDialog("personal")}><MessageCircle /> Tirar dúvidas com o Personal</Button>
          </>}
        </DialogContent>
      </Dialog>
    </>
  );
}