import { jsPDF } from "jspdf";
import type { Meal } from "./menu-data";

export interface PlanForPdf {
  meals: Meal[];
  list: { id: string; label: string; emoji: string; items: string[] }[];
}

// Paleta Fit Natural
const GREEN_DARK: [number, number, number] = [27, 67, 50]; // #1B4332
const GREEN_MAIN: [number, number, number] = [46, 125, 50]; // #2E7D32
const GREEN_SOFT: [number, number, number] = [232, 245, 233]; // #E8F5E9
const CREAM: [number, number, number] = [245, 240, 232]; // #F5F0E8
const MUTED: [number, number, number] = [90, 110, 95];

type Plan = ReturnType<typeof structuredClone<PlanForPdf>>;

interface DocCtx {
  doc: jsPDF;
  y: number;
}

function newDoc(subtitle: string): DocCtx {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const width = doc.internal.pageSize.getWidth();
  doc.setFillColor(...GREEN_DARK);
  doc.rect(0, 0, width, 26, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("FitNow", 14, 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(subtitle, 14, 19);
  return { doc, y: 36 };
}

function ensureSpace(ctx: DocCtx, needed: number) {
  const height = ctx.doc.internal.pageSize.getHeight();
  if (ctx.y + needed > height - 14) {
    footer(ctx.doc);
    ctx.doc.addPage();
    ctx.y = 18;
  }
}

function footer(doc: jsPDF) {
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text("FitNow · Planeje melhor, compre mais rápido.", width / 2, height - 7, { align: "center" });
}

function wrap(doc: jsPDF, text: string, maxWidth: number): string[] {
  return doc.splitTextToSize(text, maxWidth) as string[];
}

/** Conteúdo textual do PDF de receitas (puro, para testes). */
export function recipesPdfContent(plan: Plan) {
  return plan.meals.map((meal) => ({
    title: meal.name,
    meta: `${meal.category} · ${meal.time} min`,
    description: meal.description,
    ingredients: meal.ingredients.map((i) => i.name),
    steps: meal.steps,
  }));
}

/** Conteúdo textual do PDF da lista de compras (puro, para testes). */
export function listPdfContent(plan: Plan) {
  return plan.list.map((section) => ({
    label: section.label,
    items: section.items,
  }));
}

export function buildRecipesPdf(plan: Plan, subtitle: string): jsPDF {
  const ctx = newDoc(`Cardápio Express · ${subtitle}`);
  const { doc } = ctx;
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxWidth = pageWidth - 28;

  recipesPdfContent(plan).forEach((meal, idx) => {
    ensureSpace(ctx, 30);
    // Cabeçalho do prato
    doc.setFillColor(...GREEN_SOFT);
    doc.roundedRect(14, ctx.y - 6, pageWidth - 28, 12, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...GREEN_DARK);
    doc.text(wrap(doc, meal.title, maxWidth - 40), 18, ctx.y + 1.5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...GREEN_MAIN);
    doc.text(meal.meta, pageWidth - 18, ctx.y + 1.5, { align: "right" });
    ctx.y += 12;

    doc.setFontSize(9.5);
    doc.setTextColor(...MUTED);
    const desc = wrap(doc, meal.description, maxWidth);
    ensureSpace(ctx, desc.length * 4.5);
    doc.text(desc, 18, ctx.y);
    ctx.y += desc.length * 4.5 + 3;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...GREEN_MAIN);
    ensureSpace(ctx, 6);
    doc.text("Ingredientes", 18, ctx.y);
    ctx.y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(40, 40, 40);
    meal.ingredients.forEach((ing) => {
      ensureSpace(ctx, 5);
      doc.setFillColor(...GREEN_MAIN);
      doc.circle(19.5, ctx.y - 1.2, 0.7, "F");
      doc.text(wrap(doc, ing, maxWidth - 8), 23, ctx.y);
      ctx.y += 4.6;
    });
    ctx.y += 2;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...GREEN_MAIN);
    ensureSpace(ctx, 6);
    doc.text("Modo de preparo", 18, ctx.y);
    ctx.y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(40, 40, 40);
    meal.steps.forEach((step, i) => {
      const lines = wrap(doc, step, maxWidth - 10);
      ensureSpace(ctx, lines.length * 4.6 + 1);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...GREEN_MAIN);
      doc.text(`${i + 1}.`, 18, ctx.y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(40, 40, 40);
      doc.text(lines, 24, ctx.y);
      ctx.y += lines.length * 4.6 + 1.4;
    });

    if (idx < plan.meals.length - 1) {
      ctx.y += 3;
      ensureSpace(ctx, 6);
      doc.setDrawColor(...CREAM);
      doc.setLineWidth(0.6);
      doc.line(14, ctx.y, pageWidth - 14, ctx.y);
      ctx.y += 7;
    }
  });

  footer(doc);
  return doc;
}

export function buildListPdf(plan: Plan, subtitle: string): jsPDF {
  const ctx = newDoc(`Lista de Compras · ${subtitle}`);
  const { doc } = ctx;
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxWidth = pageWidth - 28;

  listPdfContent(plan).forEach((section) => {
    ensureSpace(ctx, 16);
    doc.setFillColor(...GREEN_SOFT);
    doc.roundedRect(14, ctx.y - 5.5, pageWidth - 28, 10, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...GREEN_DARK);
    doc.text(section.label, 18, ctx.y + 1);
    ctx.y += 11;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    section.items.forEach((item) => {
      ensureSpace(ctx, 6);
      doc.setDrawColor(...GREEN_MAIN);
      doc.setLineWidth(0.35);
      doc.rect(18, ctx.y - 3.4, 3.6, 3.6);
      doc.text(wrap(doc, item, maxWidth - 12), 25, ctx.y);
      ctx.y += 5.6;
    });
    ctx.y += 5;
  });

  footer(doc);
  return doc;
}

function deliverFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

export function downloadRecipesPdf(plan: Plan, subtitle: string) {
  const doc = buildRecipesPdf(plan, subtitle);
  deliverFile(doc.output("blob"), "fitnow-receitas.pdf");
}

export function downloadListPdf(plan: Plan, subtitle: string) {
  const doc = buildListPdf(plan, subtitle);
  deliverFile(doc.output("blob"), "fitnow-lista-de-compras.pdf");
}
