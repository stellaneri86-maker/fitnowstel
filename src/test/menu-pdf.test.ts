import { describe, expect, it } from "vitest";
import { buildListPdf, listPdfContent, type PlanForPdf } from "@/lib/menu-pdf";

describe("shopping list PDF", () => {
  it("exports every shopping item grouped by its original sector", () => {
    const plan: PlanForPdf = {
      meals: [],
      list: [
        { id: "produce", label: "Hortifruti", emoji: "", items: ["Tomate", "Cenoura"] },
        { id: "grains", label: "Grãos", emoji: "", items: ["Arroz integral"] },
      ],
    };

    expect(listPdfContent(plan)).toEqual([
      { label: "Hortifruti", items: ["Tomate", "Cenoura"] },
      { label: "Grãos", items: ["Arroz integral"] },
    ]);
    const pdf = buildListPdf(plan, "Alimentação Saudável");
    expect(pdf.output().startsWith("%PDF-")).toBe(true);
    expect(pdf.output()).toContain("Tomate");
    expect(pdf.output()).toContain("Cenoura");
    expect(pdf.output()).toContain("Arroz integral");
  });
});