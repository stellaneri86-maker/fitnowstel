export type Goal = "saudavel" | "economia" | "rapido" | "lowcarb";
export type Restriction = "vegetariano" | "sem-lactose" | "sem-gluten" | "airfryer";
export type Section = "hortifruti" | "proteinas" | "mercearia" | "laticinios";
export type MealCategory = "Café da manhã" | "Almoço" | "Lanche da tarde" | "Jantar";

export interface Ingredient { name: string; section: Section }
export interface Meal {
  name: string; time: number; category: MealCategory;
  description: string; goals: Goal[]; tags: Restriction[];
  ingredients: Ingredient[]; steps: string[];
}

const h = (name: string): Ingredient => ({ name, section: "hortifruti" });
const p = (name: string): Ingredient => ({ name, section: "proteinas" });
const m = (name: string): Ingredient => ({ name, section: "mercearia" });
const l = (name: string): Ingredient => ({ name, section: "laticinios" });

// tags = restrições que o prato ATENDE
export const MEALS: Meal[] = [
  {
    name: "Frango grelhado com legumes", time: 25, category: "Almoço",
    description: "Peito de frango, abobrinha, cenoura e azeite.",
    goals: ["saudavel", "lowcarb"], tags: ["sem-lactose", "sem-gluten"],
    ingredients: [p("Peito de frango"), h("Abobrinha"), h("Cenoura"), m("Azeite")],
    steps: [
      "Tempere o peito de frango com sal, pimenta e um fio de azeite.",
      "Corte a abobrinha em meias-luas e a cenoura em rodelas finas.",
      "Aqueça uma frigideira antiaderente em fogo médio-alto e grelhe o frango por 6 a 7 minutos de cada lado.",
      "Na mesma frigideira, salteie os legumes por 5 minutos até ficarem al dente.",
      "Fatie o frango, sirva sobre os legumes e regue com mais um fio de azeite.",
    ],
  },
  {
    name: "Frango crocante na airfryer", time: 20, category: "Jantar",
    description: "Sobrecoxa temperada com páprica, alho e limão.",
    goals: ["rapido", "lowcarb", "economia"], tags: ["sem-lactose", "sem-gluten", "airfryer"],
    ingredients: [p("Sobrecoxa de frango"), h("Alho"), h("Limão"), m("Páprica defumada")],
    steps: [
      "Tempere as sobrecoxas com alho amassado, suco de limão, páprica e sal.",
      "Deixe marinar por 10 minutos (ou desde a véspera, se puder).",
      "Preaqueça a airfryer a 200 °C por 3 minutos.",
      "Disponha as sobrecoxas com a pele para cima e asse por 18 a 20 minutos, virando na metade do tempo.",
      "Sirva com gomos de limão.",
    ],
  },
  {
    name: "Omelete de espinafre", time: 10, category: "Café da manhã",
    description: "Ovos, espinafre, tomate e cebola.",
    goals: ["rapido", "lowcarb", "saudavel", "economia"], tags: ["vegetariano", "sem-lactose", "sem-gluten"],
    ingredients: [p("Ovos"), h("Espinafre"), h("Tomate"), h("Cebola")],
    steps: [
      "Bata os ovos com um garfo, com sal e pimenta.",
      "Refogue a cebola picada em fogo médio até murchar.",
      "Junte o espinafre e o tomate em cubos e cozinhe por 2 minutos.",
      "Despeje os ovos batidos, tampe e cozinhe em fogo baixo por 3 minutos.",
      "Dobre ao meio e sirva quente.",
    ],
  },
  {
    name: "Arroz, feijão e ovo", time: 30, category: "Almoço",
    description: "Clássico econômico com salada de alface e tomate.",
    goals: ["economia"], tags: ["vegetariano", "sem-lactose", "sem-gluten"],
    ingredients: [m("Arroz"), m("Feijão carioca"), p("Ovos"), h("Alface"), h("Tomate")],
    steps: [
      "Cozinhe o arroz em água fervente com sal por cerca de 15 minutos.",
      "Aqueça o feijão já cozido e acerte o sal.",
      "Frite os ovos em uma frigideira com um fio de óleo.",
      "Monte o prato com arroz, feijão e o ovo por cima.",
      "Acompanhe com salada de alface e tomate temperada com azeite e limão.",
    ],
  },
  {
    name: "Macarrão ao sugo com manjericão", time: 20, category: "Jantar",
    description: "Massa, molho de tomate caseiro e parmesão.",
    goals: ["economia", "rapido"], tags: ["vegetariano"],
    ingredients: [m("Macarrão"), h("Tomate"), h("Manjericão"), l("Queijo parmesão")],
    steps: [
      "Cozinhe o macarrão em água fervente com sal até ficar al dente.",
      "Refogue o tomate picado com alho e azeite até desmanchar.",
      "Tempere o molho com sal e folhas de manjericão rasgadas.",
      "Escorra a massa e misture ao molho ainda quente.",
      "Finalize com parmesão ralado na hora.",
    ],
  },
  {
    name: "Bowl de grão-de-bico", time: 15, category: "Almoço",
    description: "Grão-de-bico, pepino, tomate, cebola roxa e tahine.",
    goals: ["saudavel", "rapido"], tags: ["vegetariano", "sem-lactose", "sem-gluten"],
    ingredients: [m("Grão-de-bico cozido"), h("Pepino"), h("Tomate"), h("Cebola roxa"), m("Tahine")],
    steps: [
      "Escorra e enxágue o grão-de-bico cozido.",
      "Pique o pepino, o tomate e a cebola roxa em cubos.",
      "Misture tudo em uma tigela grande.",
      "Regue com tahine diluído em limão e um pouco de água.",
      "Tempere com sal e sirva frio ou em temperatura ambiente.",
    ],
  },
  {
    name: "Tilápia na airfryer com brócolis", time: 18, category: "Jantar",
    description: "Filé de tilápia com limão e brócolis no vapor.",
    goals: ["saudavel", "lowcarb", "rapido"], tags: ["sem-lactose", "sem-gluten", "airfryer"],
    ingredients: [p("Filé de tilápia"), h("Brócolis"), h("Limão"), m("Azeite")],
    steps: [
      "Tempere os filés com sal, limão e um fio de azeite.",
      "Preaqueça a airfryer a 180 °C.",
      "Asse os filés por 10 a 12 minutos, sem virar.",
      "Enquanto isso, cozinhe o brócolis no vapor por 5 minutos.",
      "Sirva o peixe sobre o brócolis com mais limão por cima.",
    ],
  },
  {
    name: "Patinho moído com abobrinha", time: 20, category: "Almoço",
    description: "Carne moída refogada com abobrinha e cheiro-verde.",
    goals: ["lowcarb", "economia"], tags: ["sem-lactose", "sem-gluten"],
    ingredients: [p("Patinho moído"), h("Abobrinha"), h("Cebola"), h("Cheiro-verde")],
    steps: [
      "Refogue a cebola picada em azeite até dourar.",
      "Junte o patinho moído e frite até perder a cor rosada.",
      "Adicione a abobrinha em cubos e cozinhe por 8 minutos, mexendo de vez em quando.",
      "Acerte o sal e finalize com cheiro-verde picado.",
    ],
  },
  {
    name: "Overnight oats com banana", time: 5, category: "Café da manhã",
    description: "Aveia, iogurte natural, banana e mel.",
    goals: ["saudavel", "rapido", "economia"], tags: ["vegetariano"],
    ingredients: [m("Aveia em flocos"), l("Iogurte natural"), h("Banana"), m("Mel")],
    steps: [
      "Misture a aveia com o iogurte natural em um pote com tampa.",
      "Adicione metade da banana amassada e mexa bem.",
      "Leve à geladeira durante a noite (ou por pelo menos 4 horas).",
      "Na hora de servir, cubra com rodelas de banana e fios de mel.",
    ],
  },
  {
    name: "Batata-doce e tofu na airfryer", time: 20, category: "Jantar",
    description: "Cubos de batata-doce e tofu com shoyu sem glúten.",
    goals: ["saudavel", "rapido"], tags: ["vegetariano", "sem-lactose", "sem-gluten", "airfryer"],
    ingredients: [h("Batata-doce"), p("Tofu firme"), m("Shoyu sem glúten")],
    steps: [
      "Corte a batata-doce e o tofu em cubos de tamanho parecido.",
      "Tempere tudo com shoyu e um fio de azeite.",
      "Preaqueça a airfryer a 200 °C.",
      "Asse por 18 minutos, sacudindo a cesta na metade do tempo.",
      "Sirva com mais shoyu à parte.",
    ],
  },
  {
    name: "Salada caprese com frango", time: 12, category: "Lanche da tarde",
    description: "Tomate, muçarela de búfala, manjericão e frango desfiado.",
    goals: ["lowcarb", "rapido"], tags: ["sem-gluten"],
    ingredients: [h("Tomate"), l("Muçarela de búfala"), h("Manjericão"), p("Peito de frango")],
    steps: [
      "Cozinhe o peito de frango em água com sal por 15 minutos e desfie (ou use sobras).",
      "Fatie o tomate e a muçarela de búfala.",
      "Monte o prato alternando tomate, muçarela e folhas de manjericão.",
      "Distribua o frango desfiado por cima.",
      "Regue com azeite, sal e pimenta-do-reino.",
    ],
  },
  {
    name: "Legumes assados na airfryer", time: 15, category: "Jantar",
    description: "Berinjela, pimentão e cebola com ervas.",
    goals: ["saudavel", "lowcarb", "economia", "rapido"], tags: ["vegetariano", "sem-lactose", "sem-gluten", "airfryer"],
    ingredients: [h("Berinjela"), h("Pimentão"), h("Cebola"), m("Ervas finas")],
    steps: [
      "Corte a berinjela, o pimentão e a cebola em pedaços grandes.",
      "Tempere com azeite, sal e ervas finas.",
      "Preaqueça a airfryer a 200 °C.",
      "Asse por 12 a 15 minutos, sacudindo a cesta na metade do tempo.",
      "Sirva como prato principal ou acompanhamento.",
    ],
  },
  {
    name: "Quinoa com legumes e ovo", time: 20, category: "Almoço",
    description: "Quinoa, cenoura, ervilha e ovo cozido.",
    goals: ["saudavel"], tags: ["vegetariano", "sem-lactose", "sem-gluten"],
    ingredients: [m("Quinoa"), h("Cenoura"), m("Ervilha"), p("Ovos")],
    steps: [
      "Cozinhe os ovos por 10 minutos e reserve.",
      "Refogue a cenoura ralada e a ervilha em azeite.",
      "Junte a quinoa e o dobro do volume em água; cozinhe por 12 minutos.",
      "Acerte o sal e desligue quando a quinoa estiver soltinha.",
      "Sirva com o ovo cozido em rodelas por cima.",
    ],
  },
  {
    name: "Sopa de lentilha", time: 30, category: "Jantar",
    description: "Lentilha, cenoura, salsão e cominho.",
    goals: ["economia", "saudavel"], tags: ["vegetariano", "sem-lactose", "sem-gluten"],
    ingredients: [m("Lentilha"), h("Cenoura"), h("Salsão"), m("Cominho")],
    steps: [
      "Refogue a cenoura e o salsão picados em azeite.",
      "Junte a lentilha lavada, o cominho e água até cobrir tudo.",
      "Cozinhe em fogo médio por 25 minutos, até a lentilha amolecer.",
      "Acerte o sal e bata metade da sopa no liquidificador, se quiser mais cremosidade.",
      "Sirva quente com um fio de azeite.",
    ],
  },
  {
    name: "Wrap de atum", time: 8, category: "Lanche da tarde",
    description: "Tortilha, atum, alface e cream cheese.",
    goals: ["rapido", "economia"], tags: [],
    ingredients: [m("Tortilha"), m("Atum em lata"), h("Alface"), l("Cream cheese")],
    steps: [
      "Escorra o atum e tempere com limão e sal.",
      "Espalhe uma camada de cream cheese sobre a tortilha.",
      "Distribua o atum e folhas de alface rasgadas.",
      "Enrole bem apertado e corte ao meio na diagonal.",
      "Se preferir, toste 2 minutos de cada lado em uma frigideira quente.",
    ],
  },
];

export const MEAL_CATEGORIES: MealCategory[] = ["Café da manhã", "Almoço", "Lanche da tarde", "Jantar"];

export const SECTIONS: { id: Section; label: string; emoji: string }[] = [
  { id: "hortifruti", label: "Hortifrúti", emoji: "🥦" },
  { id: "proteinas", label: "Proteínas / Açougue", emoji: "🥩" },
  { id: "mercearia", label: "Mercearia / Despensa", emoji: "🛒" },
  { id: "laticinios", label: "Laticínios e Outros", emoji: "🧀" },
];

export function generatePlan(goal: Goal, restrictions: Restriction[], categories: MealCategory[], seed = Math.random()) {
  const eligible = MEALS.filter(
    (meal) => categories.includes(meal.category) && restrictions.every((r) => meal.tags.includes(r)),
  );
  const scored = eligible
    .map((meal, i) => ({ meal, score: (meal.goals.includes(goal) ? 10 : 0) + (goal === "rapido" && meal.time <= 20 ? 3 : 0) + ((Math.sin((i + 1) * 9301 * seed) + 1) * 2) }))
    .sort((a, b) => b.score - a.score);
  // Garante ao menos um prato por refeição escolhida, depois completa até 6
  const picked = new Map<string, Meal>();
  for (const cat of categories) {
    const best = scored.find((s) => s.meal.category === cat && !picked.has(s.meal.name));
    if (best) picked.set(best.meal.name, best.meal);
  }
  for (const s of scored) {
    if (picked.size >= 6) break;
    picked.set(s.meal.name, s.meal);
  }
  const meals = [...picked.values()];
  const map = new Map<string, Ingredient>();
  meals.forEach((meal) => meal.ingredients.forEach((ing) => map.set(ing.name, ing)));
  const list = SECTIONS.map((s) => ({ ...s, items: [...map.values()].filter((i) => i.section === s.id).map((i) => i.name).sort() })).filter((s) => s.items.length);
  return { meals, list };
}
