import { z } from "zod";

export const emailSchema = z.string().trim().email("Informe um e-mail válido.").max(255);
export const passwordSchema = z.string().min(8, "A senha deve ter pelo menos 8 caracteres.").max(128);
export const signupSchema = z.object({ email: emailSchema, password: passwordSchema, name: z.string().trim().min(1, "Informe seu nome.").max(100) });
export const menuInputSchema = z.object({
  goal: z.enum(["saudavel", "economia", "rapido", "lowcarb"]),
  restrictions: z.array(z.enum(["vegetariano", "sem-lactose", "sem-gluten", "airfryer"])).max(4),
  categories: z.array(z.enum(["Café da manhã", "Almoço", "Lanche da tarde", "Jantar"])).min(1).max(4),
});