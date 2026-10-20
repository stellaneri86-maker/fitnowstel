import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Apple, PiggyBank, Timer, Dumbbell, Check, Copy, RotateCcw, Clock, ArrowRight, ArrowLeft, Sparkles, Leaf } from "lucide-react";
import { generatePlan, type Goal, type Restriction } from "@/lib/menu-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cardápio & Compra Express — cardápio semanal e lista de compras" },
      { name: "description", content: "Escolha seu objetivo e preferências e receba um cardápio semanal com lista de compras separada por setor." },
      { property: "og:title", content: "Cardápio & Compra Express" },
      { property: "og:description", content: "Planeje sua semana e faça mercado em minutos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const GOALS: { id: Goal; title: string; desc: string; icon: typeof Apple }[] = [
  { id: "saudavel", title: "Alimentação Saudável", desc: "Foco em nutrientes e equilíbrio", icon: Apple },
  { id: "economia", title: "Economizar Dinheiro", desc: "Ingredientes acessíveis e rendimento", icon: PiggyBank },
  { id: "rapido", title: "Rápido e Prático", desc: "Refeições de até 20 minutos", icon: Timer },
  { id: "lowcarb", title: "Low Carb / Fitness", desc: "Foco em proteínas e vegetais", icon: Dumbbell },
];
const RESTRICTIONS: { id: Restriction | "nenhuma"; label: string }[] = [
  { id: "vegetariano", label: "Vegetariano" },
  { id: "sem-lactose", label: "Sem Lactose" },
  { id: "sem-gluten", label: "Sem Glúten" },
  { id: "airfryer", label: "Uso exclusivo de Airfryer" },
  { id: "nenhuma", label: "Sem restrições" },
];

function Index() {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [restr, setRestr] = useState<Restriction[]>([]);
  const [plan, setPlan] = useState<ReturnType<typeof generatePlan> | null>(null);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  const toggle = (id: Restriction | "nenhuma") => {
    if (id === "nenhuma") return setRestr([]);
    setRestr((r) => (r.includes(id) ? r.filter((x) => x !== id) : [...r, id]));
  };
  const generate = () => { if (!goal) return; setPlan(generatePlan(goal, restr)); setChecked(new Set()); setStep(3); };
  const reset = () => { setStep(1); setGoal(null); setRestr([]); setPlan(null); };
  const copy = async () => {
    if (!plan) return;
    const text = plan.list.map((s) => `${s.emoji} ${s.label}\n${s.items.map((i) => `- ${i}`).join("\n")}`).join("\n\n");
    await navigator.clipboard.writeText(`Lista de Compras — Cardápio & Compra Express\n\n${text}`);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };
  const toggleItem = (i: string) => setChecked((s) => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; });

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center gap-2 px-5 py-6 font-display text-lg font-semibold">
        <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Leaf className="size-5" /></span>
        Cardápio & Compra Express
      </header>

      <section className="hero-bg">
        <div className="mx-auto max-w-4xl px-5 pb-20 pt-12 text-center md:pt-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground"><Sparkles className="size-4" /> Grátis, sem cadastro</span>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">Planeje sua semana e faça mercado em <em className="text-primary">minutos.</em></h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">Escolha seu objetivo, defina suas preferências e receba um cardápio inteligente com a lista de compras separada por setor.</p>
          <button onClick={() => document.getElementById("app")?.scrollIntoView({ behavior: "smooth" })} className="btn-primary mt-10 px-8 py-4 text-lg">Criar Cardápio Grátis <ArrowRight className="size-5" /></button>
        </div>
      </section>

      <section id="app" className="mx-auto max-w-6xl scroll-mt-6 px-4 py-16 md:px-5">
        <div className="mb-8 flex items-center justify-center gap-2 md:gap-4">
          {["Objetivo", "Preferências", "Resultado"].map((label, i) => (
            <div key={label} className="flex items-center gap-2 md:gap-4">
              <div className={`flex items-center gap-2 text-sm font-medium ${step >= i + 1 ? "text-foreground" : "text-muted-foreground"}`}>
                <span className={`grid size-8 place-items-center rounded-full transition-colors ${step > i + 1 ? "bg-primary text-primary-foreground" : step === i + 1 ? "bg-primary text-primary-foreground ring-4 ring-primary/20" : "bg-muted"}`}>{step > i + 1 ? <Check className="size-4" /> : i + 1}</span>
                <span className="hidden sm:inline">{label}</span>
              </div>
              {i < 2 && <span className={`h-0.5 w-8 rounded md:w-16 ${step > i + 1 ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <div className="panel">
          {step === 1 && (
            <div key="s1" className="animate-in fade-in slide-in-from-right-6 duration-500">
              <h2 className="font-display text-2xl font-semibold md:text-3xl">Qual é o seu objetivo?</h2>
              <p className="mt-1 text-muted-foreground">Selecione uma opção principal.</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {GOALS.map((g) => (
                  <button key={g.id} onClick={() => setGoal(g.id)} className={`choice-card ${goal === g.id ? "is-active" : ""}`}>
                    <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-secondary text-primary"><g.icon className="size-6" /></span>
                    <span><span className="block font-semibold">{g.title}</span><span className="text-sm text-muted-foreground">{g.desc}</span></span>
                    {goal === g.id && <Check className="ml-auto size-5 shrink-0 text-primary" />}
                  </button>
                ))}
              </div>
              <div className="mt-8 flex justify-end"><button disabled={!goal} onClick={() => setStep(2)} className="btn-primary">Continuar <ArrowRight className="size-4" /></button></div>
            </div>
          )}

          {step === 2 && (
            <div key="s2" className="animate-in fade-in slide-in-from-right-6 duration-500">
              <h2 className="font-display text-2xl font-semibold md:text-3xl">Restrições ou preferências</h2>
              <p className="mt-1 text-muted-foreground">Selecione quantas quiser.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {RESTRICTIONS.map((r) => {
                  const active = r.id === "nenhuma" ? restr.length === 0 : restr.includes(r.id);
                  return (
                    <button key={r.id} onClick={() => toggle(r.id)} className={`chip ${active ? "is-active" : ""}`}>
                      {active && <Check className="size-4" />}{r.label}
                    </button>
                  );
                })}
              </div>
              <div className="mt-10 flex flex-col-reverse justify-between gap-3 sm:flex-row">
                <button onClick={() => setStep(1)} className="btn-ghost"><ArrowLeft className="size-4" /> Voltar</button>
                <button onClick={generate} className="btn-primary"><Sparkles className="size-4" /> Gerar Meu Cardápio Express</button>
              </div>
            </div>
          )}

          {step === 3 && plan && (
            <div key="s3" className="animate-in fade-in zoom-in-95 duration-500">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <h2 className="font-display text-2xl font-semibold md:text-3xl">Seu Cardápio Express</h2>
                  <p className="mt-1 text-muted-foreground">{GOALS.find((g) => g.id === goal)?.title}{restr.length ? " · " + restr.map((r) => RESTRICTIONS.find((x) => x.id === r)?.label).join(", ") : ""}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button onClick={copy} disabled={!plan.list.length} className="btn-primary">{copied ? <><Check className="size-4" /> Copiado!</> : <><Copy className="size-4" /> Copiar Lista de Compras</>}</button>
                  <button onClick={reset} className="btn-ghost"><RotateCcw className="size-4" /> Refazer Planejamento</button>
                </div>
              </div>

              {plan.meals.length === 0 ? (
                <p className="mt-8 rounded-2xl bg-muted p-6 text-center text-muted-foreground">Nenhum prato atende todas essas restrições ao mesmo tempo. Tente remover alguma preferência.</p>
              ) : (
                <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
                  <div>
                    <h3 className="mb-4 font-semibold">Refeições da semana</h3>
                    <div className="grid gap-3">
                      {plan.meals.map((meal, i) => (
                        <article key={meal.name} className="meal-card animate-in fade-in slide-in-from-bottom-3" style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}>
                          <div className="flex items-start justify-between gap-3">
                            <h4 className="font-semibold">{meal.name}</h4>
                            <span className="shrink-0 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">{meal.category}</span>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{meal.description}</p>
                          <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary"><Clock className="size-3.5" /> {meal.time} min</p>
                        </article>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-4 flex items-center justify-between font-semibold">Lista de compras <span className="text-sm font-normal text-muted-foreground">{checked.size}/{plan.list.reduce((a, s) => a + s.items.length, 0)} no carrinho</span></h3>
                    <div className="grid gap-4 rounded-2xl bg-muted/60 p-4 md:p-5">
                      {plan.list.map((s) => (
                        <div key={s.id}>
                          <h4 className="mb-2 text-sm font-semibold">{s.emoji} {s.label}</h4>
                          <ul className="grid gap-1">
                            {s.items.map((item) => {
                              const done = checked.has(item);
                              return (
                                <li key={item}>
                                  <button onClick={() => toggleItem(item)} className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-card">
                                    <span className={`grid size-5 shrink-0 place-items-center rounded-md border-2 transition-colors ${done ? "border-primary bg-primary text-primary-foreground" : "border-input bg-card"}`}>{done && <Check className="size-3" />}</span>
                                    <span className={`transition-all ${done ? "text-muted-foreground line-through" : ""}`}>{item}</span>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      <footer className="py-10 text-center text-sm text-muted-foreground">Cardápio & Compra Express · Planeje melhor, compre mais rápido.</footer>
    </div>
  );
}
