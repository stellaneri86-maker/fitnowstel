import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { UserRound, LogOut, BookOpen, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AuthDialog } from "@/components/auth-dialog";
import { SavedMenus } from "@/components/saved-menus";
import { useAccount } from "@/components/account-provider";
import { supabase } from "@/integrations/supabase/client";
import { createMenu, getAccount } from "@/lib/menus.functions";
import { Apple, PiggyBank, Timer, Dumbbell, Check, Copy, RotateCcw, Clock, ArrowRight, ArrowLeft, Sparkles, Leaf, X, ChefHat, ShoppingBasket } from "lucide-react";
import { generatePlan, MEAL_CATEGORIES, type Goal, type Meal, type MealCategory, type Restriction } from "@/lib/menu-data";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FitNow — Cardápio semanal inteligente e lista de compras express" },
      { name: "description", content: "Escolha seu objetivo, selecione as refeições e receba um cardápio inteligente com receita passo a passo e lista de compras separada por setor." },
      { property: "og:title", content: "FitNow — Planeje sua semana e faça mercado em minutos" },
      { property: "og:description", content: "Cardápio inteligente com receitas passo a passo, lista de compras e histórico salvo na sua conta." },
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
  const { user, loading: accountLoading } = useAccount();
  const queryClient = useQueryClient();
  const saveMenu = useServerFn(createMenu);
  const fetchAccount = useServerFn(getAccount);
  const profile = useQuery({ queryKey: ["profile", user?.id], queryFn: () => fetchAccount(), enabled: !!user });
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [view, setView] = useState<"planner" | "history">("planner");
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [cats, setCats] = useState<MealCategory[]>([...MEAL_CATEGORIES]);
  const [restr, setRestr] = useState<Restriction[]>([]);
  const [plan, setPlan] = useState<ReturnType<typeof generatePlan> | null>(null);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const [openMeal, setOpenMeal] = useState<Meal | null>(null);

  useEffect(() => {
    if (!user) { setPlan(null); setStep((current) => current === 3 ? 2 : current); setView("planner"); setOpenMeal(null); setProfileOpen(false); setChecked(new Set()); }
  }, [user?.id]);

  useEffect(() => {
    if (!openMeal) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenMeal(null); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [openMeal]);

  const toggleRestr = (id: Restriction | "nenhuma") => {
    if (id === "nenhuma") return setRestr([]);
    setRestr((r) => (r.includes(id) ? r.filter((x) => x !== id) : [...r, id]));
  };
  const toggleCat = (c: MealCategory) => setCats((list) => (list.includes(c) ? list.filter((x) => x !== c) : [...list, c]));
  const allSelected = cats.length === MEAL_CATEGORIES.length;
  const generate = async () => {
    if (!goal || !cats.length || saving || accountLoading) return;
    if (!user) { setAuthOpen(true); return; }
    setSaving(true);
    try {
      const result = await saveMenu({ data: { goal, restrictions: restr, categories: cats } });
      setPlan(result.plan); setChecked(new Set()); setStep(3);
      if (result.saved) { toast.success("Cardápio salvo na sua conta."); void queryClient.invalidateQueries({ queryKey: ["menus", user.id] }); }
    } catch { toast.error("Não foi possível gerar e salvar. Confira sua conexão e tente novamente."); }
    finally { setSaving(false); }
  };
  const logout = async () => {
    setSigningOut(true);
    try {
      await queryClient.cancelQueries(); queryClient.clear();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      reset(); setView("planner"); setProfileOpen(false);
    } catch { toast.error("Não foi possível sair. Tente novamente."); }
    finally { setSigningOut(false); }
  };
  const reset = () => { setStep(1); setGoal(null); setCats([...MEAL_CATEGORIES]); setRestr([]); setPlan(null); setOpenMeal(null); };
  const copy = async () => {
    if (!plan) return;
    const text = plan.list.map((s) => `${s.emoji} ${s.label}\n${s.items.map((i) => `- ${i}`).join("\n")}`).join("\n\n");
    try { await navigator.clipboard.writeText(`Lista de Compras — FitNow\n\n${text}`);
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    } catch { toast.error("Não foi possível copiar a lista neste navegador."); }
  };
  const toggleItem = (i: string) => setChecked((s) => { const n = new Set(s); if (n.has(i)) { n.delete(i); } else { n.add(i); } return n; });

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative flex min-h-svh flex-col">
        <img src={heroImg} alt="Mesa com vegetais frescos, grãos e ingredientes saudáveis" width={1920} height={1088} className="absolute inset-0 size-full object-cover" />
        <div className="hero-overlay absolute inset-0" />
        <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center gap-2 px-5 py-6 font-display text-lg font-semibold text-on-dark">
          <span className="glass grid size-9 place-items-center rounded-xl text-primary-foreground"><Leaf className="size-5" /></span>
          FitNow
          <div className="ml-auto flex flex-wrap items-center justify-end gap-2 font-sans text-sm">
            {user ? <><Button variant="secondary" onClick={() => { setView("history"); document.getElementById("app")?.scrollIntoView({ behavior: "smooth" }); }}><BookOpen /><span className="hidden sm:inline">Meus Cardápios</span></Button><Button variant="secondary" aria-label="Meu perfil" onClick={() => setProfileOpen(true)}><UserRound /><span className="hidden sm:inline max-w-32 truncate">{profile.data?.full_name || "Perfil"}</span></Button><Button variant="secondary" onClick={logout} disabled={signingOut || saving}><LogOut />Sair</Button></> : <Button variant="secondary" disabled={accountLoading} onClick={() => setAuthOpen(true)}><UserRound />{accountLoading ? "Aguarde…" : "Entrar / Cadastrar"}</Button>}
          </div>
        </header>
        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-5 pb-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-foreground"><Sparkles className="size-4" /> Planejamento gratuito</span>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-on-dark md:text-6xl">Planeje sua semana e faça mercado em minutos com o FitNow.</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-on-dark/85">Escolha seu objetivo, selecione as refeições desejadas, defina suas preferências e receba um cardápio inteligente com receita passo a passo e lista de compras separada por setor.</p>
          <button onClick={() => document.getElementById("app")?.scrollIntoView({ behavior: "smooth" })} className="btn-primary mt-10 px-8 py-4 text-lg">Criar Cardápio Grátis <ArrowRight className="size-5" /></button>
        </div>
      </section>

      {/* WIZARD */}
      <section id="app" className="bg-cream scroll-mt-0">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-5">
          <div className="mb-8 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Cardápios">
            <Button role="tab" aria-selected={view === "planner"} variant={view === "planner" ? "default" : "outline"} disabled={saving} onClick={() => setView("planner")}><ChefHat />Criar cardápio</Button>
            <Button role="tab" aria-selected={view === "history"} variant={view === "history" ? "default" : "outline"} disabled={saving || accountLoading} onClick={() => user ? setView("history") : setAuthOpen(true)}><BookOpen />Meus Cardápios Salvos</Button>
          </div>
          {view === "history" && user ? <SavedMenus key={user.id} userId={user.id} onSelect={(savedPlan, savedGoal, restrictions, categories) => { setPlan(savedPlan); setGoal(savedGoal); setRestr(restrictions); setCats(categories); setChecked(new Set()); setStep(3); setView("planner"); }} /> : <>
          <div className="mb-8 flex items-center justify-center gap-2 md:gap-4">
            {["Objetivo", "Refeições & Preferências", "Resultado"].map((label, i) => (
              <div key={label} className="flex items-center gap-2 md:gap-4">
                <div className={`flex items-center gap-2 text-sm font-medium ${step >= i + 1 ? "text-foreground" : "text-muted-foreground"}`}>
                  <span className={`grid size-8 place-items-center rounded-full transition-colors ${step >= i + 1 ? "bg-primary text-primary-foreground" : "bg-muted"} ${step === i + 1 ? "ring-4 ring-primary/20" : ""}`}>{step > i + 1 ? <Check className="size-4" /> : i + 1}</span>
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
                <h2 className="font-display text-2xl font-semibold md:text-3xl">Refeições e preferências</h2>
                <p className="mt-1 text-muted-foreground">Escolha quais refeições entram no plano e marque suas restrições.</p>

                <h3 className="mt-6 mb-3 flex items-center gap-2 text-sm font-semibold"><ChefHat className="size-4 text-primary" /> Refeições desejadas</h3>
                <div className="flex flex-wrap gap-3">
                  {MEAL_CATEGORIES.map((c) => (
                    <button key={c} onClick={() => toggleCat(c)} className={`chip ${cats.includes(c) ? "is-active" : ""}`}>
                      {cats.includes(c) && <Check className="size-4" />}{c}
                    </button>
                  ))}
                  <button onClick={() => setCats(allSelected ? [] : [...MEAL_CATEGORIES])} className={`chip ${allSelected ? "is-active" : ""}`}>
                    {allSelected && <Check className="size-4" />}Selecionar Todas
                  </button>
                </div>

                <h3 className="mt-8 mb-3 flex items-center gap-2 text-sm font-semibold"><Leaf className="size-4 text-primary" /> Restrições ou preferências</h3>
                <div className="flex flex-wrap gap-3">
                  {RESTRICTIONS.map((r) => {
                    const active = r.id === "nenhuma" ? restr.length === 0 : restr.includes(r.id);
                    return (
                      <button key={r.id} onClick={() => toggleRestr(r.id)} className={`chip ${active ? "is-active" : ""}`}>
                        {active && <Check className="size-4" />}{r.label}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-10 flex flex-col-reverse justify-between gap-3 sm:flex-row">
                  <Button variant="ghost" onClick={() => setStep(1)} disabled={saving} className="btn-ghost h-auto"><ArrowLeft className="size-4" /> Voltar</Button>
                  <Button onClick={generate} disabled={!cats.length || saving || accountLoading} className="btn-primary h-auto whitespace-normal">{saving ? <LoaderCircle className="size-4 animate-spin" /> : <Sparkles className="size-4" />}{saving ? "Gerando e salvando…" : "Gerar Meu Cardápio Express"}</Button>
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
                  <p className="mt-8 rounded-2xl bg-muted p-6 text-center text-muted-foreground">Nenhum prato atende todas essas escolhas ao mesmo tempo. Tente remover alguma restrição ou incluir mais refeições.</p>
                ) : (
                  <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
                    <div>
                      <h3 className="mb-4 font-semibold">Refeições da semana <span className="text-sm font-normal text-muted-foreground">— toque em um prato para ver a receita</span></h3>
                      <div className="grid gap-3">
                        {plan.meals.map((meal, i) => (
                          <button key={meal.name} onClick={() => setOpenMeal(meal)} className="meal-card animate-in fade-in slide-in-from-bottom-3" style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}>
                            <div className="flex items-start justify-between gap-3">
                              <h4 className="font-semibold">{meal.name}</h4>
                              <span className="shrink-0 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">{meal.category}</span>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">{meal.description}</p>
                            <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary"><Clock className="size-3.5" /> {meal.time} min · Ver receita</p>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-4 flex items-center justify-between font-semibold"><span className="inline-flex items-center gap-2"><ShoppingBasket className="size-4 text-primary" /> Lista de compras</span> <span className="text-sm font-normal text-muted-foreground">{checked.size}/{plan.list.reduce((a, s) => a + s.items.length, 0)} no carrinho</span></h3>
                      <div className="glass grid gap-4 rounded-2xl p-4 md:p-5">
                        {plan.list.map((s) => (
                          <div key={s.id}>
                            <h4 className="mb-2 text-sm font-semibold">{s.emoji} {s.label}</h4>
                            <ul className="grid gap-1">
                              {s.items.map((item) => {
                                const done = checked.has(item);
                                return (
                                  <li key={item}>
                                    <button onClick={() => toggleItem(item)} className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-secondary/60">
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
          </>}
        </div>
      </section>

      <footer className="bg-cream py-10 text-center text-sm text-muted-foreground">FitNow · Planeje melhor, compre mais rápido.</footer>
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
      <Dialog open={profileOpen && !!user} onOpenChange={setProfileOpen}><DialogContent className="w-[calc(100%-2rem)] rounded-lg bg-cream"><DialogTitle className="font-display text-2xl">Meu perfil</DialogTitle><DialogDescription>Sua conta FitNow</DialogDescription>{profile.isPending ? <p>Carregando…</p> : profile.isError ? <p role="alert">Não foi possível carregar seu perfil.</p> : <dl className="grid gap-4"><div><dt className="text-sm text-muted-foreground">Nome</dt><dd className="break-words font-semibold">{profile.data?.full_name || "Não informado"}</dd></div><div><dt className="text-sm text-muted-foreground">E-mail</dt><dd className="break-all">{profile.data?.email || user?.email}</dd></div></dl>}<Button variant="outline" disabled={signingOut || saving} onClick={logout}><LogOut />Sair da conta</Button></DialogContent></Dialog>

      {/* MODAL DA RECEITA */}
      {openMeal && (
        <div className="modal-backdrop animate-in fade-in duration-200" onClick={() => setOpenMeal(null)} role="dialog" aria-modal="true" aria-label={`Receita: ${openMeal.name}`}>
          <div className="modal-card animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">{openMeal.category}</span>
                <h3 className="mt-2 font-display text-2xl font-semibold">{openMeal.name}</h3>
                <p className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary"><Clock className="size-4" /> {openMeal.time} min de preparo</p>
              </div>
              <button onClick={() => setOpenMeal(null)} aria-label="Fechar receita" className="grid size-9 shrink-0 place-items-center rounded-full bg-muted transition-colors hover:bg-secondary"><X className="size-4" /></button>
            </div>

            <h4 className="mt-6 mb-2 text-sm font-semibold">Ingredientes</h4>
            <ul className="grid gap-1.5 sm:grid-cols-2">
              {openMeal.ingredients.map((ing) => (
                <li key={ing.name} className="flex items-center gap-2 text-sm"><span className="size-1.5 shrink-0 rounded-full bg-primary" />{ing.name}</li>
              ))}
            </ul>

            <h4 className="mt-6 mb-2 text-sm font-semibold">Modo de preparo</h4>
            <ol className="grid gap-3">
              {openMeal.steps.map((s, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">{i + 1}</span>
                  <span className="pt-0.5">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
