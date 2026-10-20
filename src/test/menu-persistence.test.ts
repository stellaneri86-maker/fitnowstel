import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ guard: Symbol("authenticated") }));
vi.mock("@/integrations/supabase/auth-middleware", () => ({ requireSupabaseAuth: mocks.guard }));
vi.mock("@tanstack/react-start", () => ({
  createServerFn: () => {
    let guards: unknown[] = [];
    let validate = (input: unknown): unknown => input;
    const builder = {
      middleware: (value: unknown[]) => { guards = value; return builder; },
      inputValidator: (value: typeof validate) => { validate = value; return builder; },
      handler: (handler: (args: unknown) => Promise<unknown>) => async (args: { data?: unknown; context?: unknown }) => {
        if (guards.includes(mocks.guard) && !args.context) throw new Error("Unauthorized");
        return handler({ ...args, data: args.data === undefined ? undefined : validate(args.data) });
      },
    };
    return builder;
  },
}));

import { createMenu, getAccount, getMenu, listMenus } from "@/lib/menus.functions";

// Exercise handler contracts with verified middleware context, without real credentials.
const invoke = (fn: unknown, args: unknown) => (fn as (args: unknown) => Promise<unknown>)(args);
describe("Private menu persistence", () => {
  it("all private endpoints require authenticated middleware context", async () => {
    for (const fn of [createMenu, listMenus, getMenu, getAccount]) {
      await expect(invoke(fn, {})).rejects.toThrow("Unauthorized");
    }
  });
  it("saves recipes and shopping list under the verified user's ID", async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    const from = vi.fn().mockReturnValue({ insert });
    const result = await invoke(createMenu, { data: { goal: "rapido", restrictions: ["airfryer"], categories: ["Jantar"], user_id: "attacker" }, context: { userId: "verified-owner", supabase: { from } } });
    expect(from).toHaveBeenCalledWith("user_menus");
    expect(insert.mock.calls[0]?.[0]).toMatchObject({ user_id: "verified-owner", objective: "rapido", preferences: ["airfryer", "Jantar"] });
    const saved = insert.mock.calls[0]?.[0];
    expect(saved.meals.length).toBeGreaterThan(0);
    expect(saved.meals[0].steps.length).toBeGreaterThan(0);
    expect(saved.shopping_list.length).toBeGreaterThan(0);
    expect(result).toMatchObject({ saved: true });
  });
  it("never reports success when storage rejects the cardápio", async () => {
    const from = vi.fn().mockReturnValue({ insert: vi.fn().mockResolvedValue({ error: { message: "denied" } }) });
    await expect(invoke(createMenu, { data: { goal: "rapido", restrictions: [], categories: ["Jantar"] }, context: { userId: "owner", supabase: { from } } })).rejects.toThrow("Não foi possível salvar");
  });
  it("history reads are scoped to the verified user", async () => {
    const chain = { select: vi.fn(), eq: vi.fn(), order: vi.fn(), range: vi.fn().mockResolvedValue({ data: [], count: 0, error: null }) };
    chain.select.mockReturnValue(chain); chain.eq.mockReturnValue(chain); chain.order.mockReturnValue(chain);
    await invoke(listMenus, { data: { page: 0 }, context: { userId: "owner", supabase: { from: () => chain } } });
    expect(chain.eq).toHaveBeenCalledWith("user_id", "owner");
    expect(chain.range).toHaveBeenCalledWith(0, 11);
  });
});