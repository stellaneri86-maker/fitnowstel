import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Json } from "@/integrations/supabase/types";
import { menuInputSchema } from "./account-validation";
import { generatePlan } from "./menu-data";

export const createMenu = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => menuInputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const plan = generatePlan(data.goal, data.restrictions, data.categories);
    if (!plan.meals.length) return { plan, saved: false };
    const { error } = await context.supabase.from("user_menus").insert({
      user_id: context.userId, objective: data.goal,
      preferences: [...data.restrictions, ...data.categories],
      meals: JSON.parse(JSON.stringify(plan.meals)) as Json,
      shopping_list: JSON.parse(JSON.stringify(plan.list)) as Json,
    });
    if (error) throw new Error("Não foi possível salvar seu cardápio. Tente novamente.");
    return { plan, saved: true };
  });

export const getAccount = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.from("profiles").select("full_name, email").eq("id", context.userId).maybeSingle();
    if (error) throw new Error("Não foi possível carregar seu perfil.");
    return data;
  });

export const listMenus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ page: z.number().int().min(0).max(100000) }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: rows, error, count } = await context.supabase.from("user_menus")
      .select("id, objective, preferences, created_at", { count: "exact" })
      .eq("user_id", context.userId).order("created_at", { ascending: false }).order("id", { ascending: false }).range(data.page * 12, data.page * 12 + 11);
    if (error) throw new Error("Não foi possível carregar seus cardápios.");
    return { rows: rows ?? [], count: count ?? 0 };
  });

export const getMenu = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase.from("user_menus").select("*").eq("user_id", context.userId).eq("id", data.id).single();
    if (error) throw new Error("Cardápio indisponível.");
    return row;
  });