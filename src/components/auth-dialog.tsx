import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Leaf, LoaderCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { emailSchema, signupSchema } from "@/lib/account-validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function AuthDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const changeMode = (next: typeof mode) => { setMode(next); setError(""); setNotice(""); };
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setNotice(""); setBusy(true);
    const fields = new FormData(event.currentTarget);
    try {
      const email = emailSchema.parse(fields.get("email"));
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
        if (error) throw error;
        setNotice("Se esse e-mail estiver cadastrado, você receberá um link para redefinir a senha.");
      } else if (mode === "signup") {
        const values = signupSchema.parse({ email, password: fields.get("password"), name: fields.get("name") });
        const { data, error } = await supabase.auth.signUp({ email: values.email, password: values.password, options: { data: { full_name: values.name }, emailRedirectTo: window.location.origin } });
        if (error) throw error;
        if (data.session) onOpenChange(false);
        else setNotice("Confira seu e-mail para confirmar o cadastro. Depois, entre na sua conta para gerar o cardápio.");
      } else {
        const password = z.string().min(1, "Informe sua senha.").max(128).parse(fields.get("password"));
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onOpenChange(false);
      }
    } catch (err) {
      if (err instanceof z.ZodError) setError(err.issues[0]?.message ?? "Confira os campos.");
      else {
        const message = err instanceof Error ? err.message : "";
        setError(message.includes("Invalid login") ? "E-mail ou senha incorretos." : message.includes("Email not confirmed") ? "Confirme seu e-mail antes de entrar." : message.includes("already registered") ? "Este e-mail já possui uma conta." : message.includes("rate limit") ? "Muitas tentativas. Aguarde alguns minutos." : "Não foi possível concluir. Confira sua conexão e tente novamente.");
      }
    } finally { setBusy(false); }
  }
  return <Dialog open={open} onOpenChange={(next) => { if (!busy) { onOpenChange(next); setError(""); setNotice(""); } }}>
    <DialogContent className="max-h-[90svh] w-[calc(100%-2rem)] overflow-y-auto rounded-lg bg-cream p-6 sm:p-8">
      <div className="flex items-center gap-2 font-display text-2xl text-primary"><Leaf />FitNow</div>
      <DialogTitle className="font-display text-2xl">{mode === "signup" ? "Crie sua conta" : mode === "forgot" ? "Recuperar senha" : "Bem-vinda ao FitNow"}</DialogTitle>
      <DialogDescription>{mode === "signup" ? "Seu nome e sua conta" : mode === "forgot" ? "E-mail da sua conta" : "Entre na sua conta"}</DialogDescription>
      {mode !== "forgot" && <div className="grid grid-cols-2 gap-1 rounded-md bg-secondary p-1"><Button variant={mode === "login" ? "default" : "ghost"} disabled={busy} onClick={() => changeMode("login")}>Entrar</Button><Button variant={mode === "signup" ? "default" : "ghost"} disabled={busy} onClick={() => changeMode("signup")}>Cadastrar</Button></div>}
      <form onSubmit={submit} className="grid gap-4">
        {mode === "signup" && <label className="grid gap-2 text-sm font-medium">Nome<Input name="name" autoComplete="name" required maxLength={100} className="h-11 bg-background" /></label>}
        <label className="grid gap-2 text-sm font-medium">E-mail<Input name="email" type="email" autoComplete="email" required maxLength={255} className="h-11 bg-background" /></label>
        {mode !== "forgot" && <label className="grid gap-2 text-sm font-medium">Senha<Input name="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} required minLength={mode === "signup" ? 8 : 1} maxLength={128} placeholder={mode === "signup" ? "Pelo menos 8 caracteres" : ""} className="h-11 bg-background" /></label>}
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        {notice && <p role="status" className="rounded-md bg-secondary p-3 text-sm">{notice}</p>}
        <Button type="submit" disabled={busy} className="h-11">{busy && <LoaderCircle className="animate-spin" />}{mode === "signup" ? "Criar conta" : mode === "forgot" ? "Enviar link" : "Entrar na conta"}</Button>
      </form>
      <Button variant="link" disabled={busy} onClick={() => changeMode(mode === "forgot" ? "login" : "forgot")}>{mode === "forgot" ? "Voltar para entrar" : "Esqueci minha senha"}</Button>
    </DialogContent>
  </Dialog>;
}