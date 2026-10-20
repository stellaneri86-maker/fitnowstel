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

export const getDishImage = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ dish: z.string().min(1).max(120) }).parse(input))
  .handler(async ({ data }) => {
    const query = `${data.dish} food`;
    const unsplashKey = process.env["UNSPLASH_ACCESS_KEY"];
    if (unsplashKey) {
      try {
        const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape&content_filter=high`, {
          headers: { Authorization: `Client-ID ${unsplashKey}`, "Accept-Version": "v1" },
        });
        if (res.ok) {
          const json = (await res.json()) as { results?: { urls?: { regular?: string } }[] };
          const url = json.results?.[0]?.urls?.regular;
          if (url) return { url, source: "unsplash" as const };
        }
      } catch { /* segue para a fonte alternativa */ }
    }
    try {
      const res = await fetch(`https://api.openverse.org/v1/images/?q=${encodeURIComponent(query)}&page_size=5&license_type=all&filter_dead=false`, {
        headers: { "User-Agent": "FitNow/1.0" },
      });
      if (!res.ok) return { url: null, source: null };
      const json = (await res.json()) as { results?: { url?: string }[] };
      const url = json.results?.[0]?.url ?? null;
      return { url, source: url ? ("openverse" as const) : null };
    } catch {
      return { url: null, source: null };
    }
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