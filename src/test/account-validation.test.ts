import { describe, expect, it } from "vitest";
import { menuInputSchema, signupSchema } from "@/lib/account-validation";

describe("FitNow account and menu input", () => {
  it("requires the name requested at signup", () => {
    expect(signupSchema.safeParse({ name: "", email: "test@example.com", password: "abcdefgh" }).success).toBe(false);
    expect(signupSchema.parse({ name: " Stella ", email: "stella@example.com", password: "abcdefgh" }).name).toBe("Stella");
  });
  it("requires an email and password for signup", () => {
    expect(signupSchema.safeParse({ name: "Stella", email: "invalid", password: "abcdefgh" }).success).toBe(false);
    expect(signupSchema.safeParse({ name: "Stella", email: "stella@example.com", password: "" }).success).toBe(false);
  });
  it("accepts the selected objective, restrictions and meals without allowing a caller-selected owner", () => {
    const result = menuInputSchema.parse({ goal: "rapido", restrictions: ["airfryer"], categories: ["Jantar"], user_id: "another-user" });
    expect(result).toEqual({ goal: "rapido", restrictions: ["airfryer"], categories: ["Jantar"] });
  });
  it("requires at least one meal category to generate", () => {
    expect(menuInputSchema.safeParse({ goal: "saudavel", restrictions: [], categories: [] }).success).toBe(false);
  });
});