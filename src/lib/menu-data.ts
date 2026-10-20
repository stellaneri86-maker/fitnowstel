export type Goal = "saudavel" | "economia" | "rapido" | "lowcarb";
export type Restriction = "vegetariano" | "sem-lactose" | "sem-gluten" | "airfryer";
export type Section = "hortifruti" | "proteinas" | "mercearia" | "laticinios";

export interface Ingredient { name: string; section: Section }
export interface Meal {
  name: string; time: number; category: "Café da manhã" | "Almoço" | "Jantar" | "Lanche";
  description: string; goals: Goal[]; tags: Restriction[]; ingredients: Ingredient[];
}

const h = (name: string): Ingredient => ({ name, section: "hortifruti" });
const p = (name: string): Ingredient => ({ name, section: "proteinas" });
const m = (name: string): Ingredient => ({ name, section: "mercearia" });
const l = (name: string): Ingredient => ({ name, section: "laticinios" });

// tags = restrições que o prato ATENDE
export const MEALS: Meal[] = [
  { name: "Frango grelhado com legumes", time: 25, category: "Almoço", description: "Peito de frango, abobrinha, cenoura e azeite.", goals: ["saudavel", "lowcarb"], tags: ["sem-lactose", "sem-gluten"], ingredients: [p("Peito de frango"), h("Abobrinha"), h("Cenoura"), m("Azeite")] },
  { name: "Frango crocante na airfryer", time: 20, category: "Jantar", description: "Sobrecoxa temperada com páprica, alho e limão.", goals: ["rapido", "lowcarb", "economia"], tags: ["sem-lactose", "sem-gluten", "airfryer"], ingredients: [p("Sobrecoxa de frango"), h("Alho"), h("Limão"), m("Páprica defumada")] },
  { name: "Omelete de espinafre", time: 10, category: "Café da manhã", description: "Ovos, espinafre, tomate e cebola.", goals: ["rapido", "lowcarb", "saudavel", "economia"], tags: ["vegetariano", "sem-lactose", "sem-gluten"], ingredients: [p("Ovos"), h("Espinafre"), h("Tomate"), h("Cebola")] },
  { name: "Arroz, feijão e ovo", time: 30, category: "Almoço", description: "Clássico econômico com salada de alface e tomate.", goals: ["economia"], tags: ["vegetariano", "sem-lactose", "sem-gluten"], ingredients: [m("Arroz"), m("Feijão carioca"), p("Ovos"), h("Alface"), h("Tomate")] },
  { name: "Macarrão ao sugo com manjericão", time: 20, category: "Jantar", description: "Massa, molho de tomate caseiro e parmesão.", goals: ["economia", "rapido"], tags: ["vegetariano"], ingredients: [m("Macarrão"), h("Tomate"), h("Manjericão"), l("Queijo parmesão")] },
  { name: "Bowl de grão-de-bico", time: 15, category: "Almoço", description: "Grão-de-bico, pepino, tomate, cebola roxa e tahine.", goals: ["saudavel", "rapido"], tags: ["vegetariano", "sem-lactose", "sem-gluten"], ingredients: [m("Grão-de-bico cozido"), h("Pepino"), h("Tomate"), h("Cebola roxa"), m("Tahine")] },
  { name: "Tilápia na airfryer com brócolis", time: 18, category: "Jantar", description: "Filé de tilápia com limão e brócolis no vapor.", goals: ["saudavel", "lowcarb", "rapido"], tags: ["sem-lactose", "sem-gluten", "airfryer"], ingredients: [p("Filé de tilápia"), h("Brócolis"), h("Limão"), m("Azeite")] },
  { name: "Patinho moído com abobrinha", time: 20, category: "Almoço", description: "Carne moída refogada com abobrinha e cheiro-verde.", goals: ["lowcarb", "economia"], tags: ["sem-lactose", "sem-gluten"], ingredients: [p("Patinho moído"), h("Abobrinha"), h("Cebola"), h("Cheiro-verde")] },
  { name: "Overnight oats com banana", time: 5, category: "Café da manhã", description: "Aveia, iogurte natural, banana e mel.", goals: ["saudavel", "rapido", "economia"], tags: ["vegetariano"], ingredients: [m("Aveia em flocos"), l("Iogurte natural"), h("Banana"), m("Mel")] },
  { name: "Batata-doce e tofu na airfryer", time: 20, category: "Jantar", description: "Cubos de batata-doce e tofu com shoyu sem glúten.", goals: ["saudavel", "rapido"], tags: ["vegetariano", "sem-lactose", "sem-gluten", "airfryer"], ingredients: [h("Batata-doce"), p("Tofu firme"), m("Shoyu sem glúten")] },
  { name: "Salada caprese com frango", time: 12, category: "Lanche", description: "Tomate, muçarela de búfala, manjericão e frango desfiado.", goals: ["lowcarb", "rapido"], tags: ["sem-gluten"], ingredients: [h("Tomate"), l("Muçarela de búfala"), h("Manjericão"), p("Peito de frango")] },
  { name: "Legumes assados na airfryer", time: 15, category: "Jantar", description: "Berinjela, pimentão e cebola com ervas.", goals: ["saudavel", "lowcarb", "economia", "rapido"], tags: ["vegetariano", "sem-lactose", "sem-gluten", "airfryer"], ingredients: [h("Berinjela"), h("Pimentão"), h("Cebola"), m("Ervas finas")] },
  { name: "Quinoa com legumes e ovo", time: 20, category: "Almoço", description: "Quinoa, cenoura, ervilha e ovo cozido.", goals: ["saudavel"], tags: ["vegetariano", "sem-lactose", "sem-gluten"], ingredients: [m("Quinoa"), h("Cenoura"), m("Ervilha"), p("Ovos")] },
  { name: "Sopa de lentilha", time: 30, category: "Jantar", description: "Lentilha, cenoura, salsão e cominho.", goals: ["economia", "saudavel"], tags: ["vegetariano", "sem-lactose", "sem-gluten"], ingredients: [m("Lentilha"), h("Cenoura"), h("Salsão"), m("Cominho")] },
  { name: "Wrap de atum", time: 8, category: "Lanche", description: "Tortilha, atum, alface e cream cheese.", goals: ["rapido", "economia"], tags: [], ingredients: [m("Tortilha"), m("Atum em lata"), h("Alface"), l("Cream cheese")] },
];

export const SECTIONS: { id: Section; label: string; emoji: string }[] = [
  { id: "hortifruti", label: "Hortifrúti", emoji: "🥦" },
  { id: "proteinas", label: "Proteínas / Açougue", emoji: "🥩" },
  { id: "mercearia", label: "Mercearia / Despensa", emoji: "🛒" },
  { id: "laticinios", label: "Laticínios e Outros", emoji: "🧀" },
];

export function generatePlan(goal: Goal, restrictions: Restriction[], seed = Math.random()) {
  const eligible = MEALS.filter((meal) => restrictions.every((r) => meal.tags.includes(r)));
  const scored = eligible
    .map((meal, i) => ({ meal, score: (meal.goals.includes(goal) ? 10 : 0) + (goal === "rapido" && meal.time <= 20 ? 3 : 0) + ((Math.sin((i + 1) * 9301 * seed) + 1) * 2) }))
    .sort((a, b) => b.score - a.score);
  const meals = scored.slice(0, 5).map((s) => s.meal);
  const map = new Map<string, Ingredient>();
  meals.forEach((meal) => meal.ingredients.forEach((ing) => map.set(ing.name, ing)));
  const list = SECTIONS.map((s) => ({ ...s, items: [...map.values()].filter((i) => i.section === s.id).map((i) => i.name).sort() })).filter((s) => s.items.length);
  return { meals, list };
}
