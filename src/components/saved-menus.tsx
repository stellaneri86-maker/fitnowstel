import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ArrowLeft, ArrowRight, BookOpen, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getMenu, listMenus } from "@/lib/menus.functions";
import type { generatePlan, Goal, MealCategory, Restriction } from "@/lib/menu-data";

const mealSchema = z.object({ name: z.string(), time: z.number(), category: z.enum(["Café da manhã", "Almoço", "Lanche da tarde", "Jantar"]), description: z.string(), goals: z.array(z.enum(["saudavel", "economia", "rapido", "lowcarb"])), tags: z.array(z.enum(["vegetariano", "sem-lactose", "sem-gluten", "airfryer"])), ingredients: z.array(z.object({ name: z.string(), section: z.enum(["hortifruti", "proteinas", "mercearia", "laticinios"]) })), steps: z.array(z.string()) });
const listSchema = z.array(z.object({ id: z.enum(["hortifruti", "proteinas", "mercearia", "laticinios"]), label: z.string(), emoji: z.string(), items: z.array(z.string()) }));
const goalLabels: Record<string, string> = { saudavel: "Alimentação Saudável", economia: "Economizar Dinheiro", rapido: "Rápido e Prático", lowcarb: "Low Carb / Fitness" };
export function SavedMenus({ userId, onSelect }: { userId: string; onSelect: (plan: ReturnType<typeof generatePlan>, goal: Goal, restrictions: Restriction[], categories: MealCategory[]) => void }) {
  const [page, setPage] = useState(0);
  const [opening, setOpening] = useState<string | null>(null);
  const fetchMenus = useServerFn(listMenus);
  const fetchMenu = useServerFn(getMenu);
  const query = useQuery({ queryKey: ["menus", userId, page], queryFn: () => fetchMenus({ data: { page } }) });
  async function open(id: string) {
    setOpening(id);
    try {
      const row = await fetchMenu({ data: { id } });
      const meals = z.array(mealSchema).parse(row.meals);
      const list = listSchema.parse(row.shopping_list);
      const goal = z.enum(["saudavel", "economia", "rapido", "lowcarb"]).parse(row.objective);
      const restrictions = (row.preferences ?? []).filter((value): value is Restriction => ["vegetariano", "sem-lactose", "sem-gluten", "airfryer"].includes(value));
      const categories = (row.preferences ?? []).filter((value): value is MealCategory => ["Café da manhã", "Almoço", "Lanche da tarde", "Jantar"].includes(value));
      onSelect({ meals, list }, goal, restrictions, categories.length ? categories : [...new Set(meals.map((m) => m.category))]);
    } catch { toast.error("Não foi possível abrir este cardápio. Ele pode usar um formato antigo."); }
    finally { setOpening(null); }
  }
  return <div className="space-y-6"><h2 className="font-display text-2xl font-semibold md:text-3xl">Meus Cardápios Salvos</h2>
    {query.isPending ? <p role="status" className="flex items-center gap-2"><LoaderCircle className="size-4 animate-spin" />Carregando cardápios…</p> : query.isError ? <div><p role="alert">Não foi possível carregar seus cardápios.</p><Button className="mt-3" onClick={() => query.refetch()}>Tentar novamente</Button></div> : !query.data.rows.length ? <p className="py-8 text-muted-foreground">Você ainda não tem cardápios salvos.</p> : <>
      <div className="grid gap-4 sm:grid-cols-2">{query.data.rows.map((menu) => <article key={menu.id} className="glass rounded-lg p-5"><div className="mb-3 flex items-center gap-2 text-sm text-primary"><BookOpen className="size-4" /><time dateTime={menu.created_at}>{new Date(menu.created_at).toLocaleString("pt-BR")}</time></div><h3 className="font-semibold">{goalLabels[menu.objective] ?? menu.objective}</h3><p className="mt-2 text-sm text-muted-foreground">{menu.preferences?.join(" · ") || "Sem restrições"}</p><Button variant="outline" className="mt-4" disabled={opening !== null} onClick={() => open(menu.id)}>{opening === menu.id && <LoaderCircle className="animate-spin" />}Abrir cardápio<ArrowRight /></Button></article>)}</div>
      <div className="flex items-center justify-between gap-3"><Button variant="ghost" disabled={page === 0} onClick={() => setPage((p) => p - 1)}><ArrowLeft />Anterior</Button><span className="text-sm">{page + 1} / {Math.ceil(query.data.count / 12)}</span><Button variant="ghost" disabled={(page + 1) * 12 >= query.data.count} onClick={() => setPage((p) => p + 1)}>Próxima<ArrowRight /></Button></div>
    </>}
  </div>;
}