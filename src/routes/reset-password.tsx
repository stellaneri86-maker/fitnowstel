import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { passwordSchema } from "@/lib/account-validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Redefinir senha — FitNow" }, { name: "description", content: "Redefina sua senha de acesso ao FitNow." }, { property: "og:title", content: "Redefinir senha — FitNow" }, { property: "og:description", content: "Recupere o acesso à sua conta FitNow." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: ResetPassword,
});
function ResetPassword() {
  const [recovery, setRecovery] = useState(false);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const isRecovery = new URLSearchParams(window.location.hash.slice(1)).get("type") === "recovery";
    setRecovery(isRecovery);
    // The auth client processes the recovery fragment before getUser resolves.
    void supabase.auth.getUser().then(({ data, error }) => { setRecovery(isRecovery && !!data.user && !error); setReady(true); }).catch(() => setReady(true));
  }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage("");
    const fields = new FormData(event.currentTarget);
    const parsed = passwordSchema.safeParse(fields.get("password"));
    if (!parsed.success) { setMessage(parsed.error.issues[0]?.message ?? "Senha inválida."); return; }
    if (parsed.data !== fields.get("confirmation")) { setMessage("As senhas não coincidem."); return; }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: parsed.data });
      if (error) { setMessage("Não foi possível redefinir. Solicite um novo link."); return; }
      setDone(true);
    } catch { setMessage("Não foi possível redefinir. Tente novamente."); }
    finally { setBusy(false); }
  }
  return <main className="grid min-h-svh place-items-center bg-cream p-5"><div className="w-full max-w-md space-y-5">
    <Link to="/" className="font-display text-2xl text-primary">FitNow</Link><h1 className="font-display text-3xl">Redefinir senha</h1>
    {!ready ? <p>Validando link…</p> : done ? <><p role="status">Senha atualizada.</p><Button asChild><Link to="/">Voltar ao FitNow</Link></Button></> : !recovery ? <><p role="alert">Link inválido ou expirado. Solicite um novo link em “Esqueci minha senha”.</p><Button asChild><Link to="/">Voltar ao FitNow</Link></Button></> : <form onSubmit={submit} className="grid gap-4"><label className="grid gap-2">Nova senha<Input name="password" type="password" autoComplete="new-password" minLength={8} maxLength={128} required /></label><label className="grid gap-2">Confirmar senha<Input name="confirmation" type="password" autoComplete="new-password" required maxLength={128} /></label>{message && <p role="alert" className="text-destructive">{message}</p>}<Button disabled={busy}>Salvar nova senha</Button></form>}
  </div></main>;
}