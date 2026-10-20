import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AccountContext = createContext<{ user: User | null; loading: boolean }>({ user: null, loading: true });
export const useAccount = () => useContext(AccountContext);

export function AccountProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const queryClient = useQueryClient();
  useEffect(() => {
    let active = true;
    let transition = false;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!["SIGNED_IN", "SIGNED_OUT", "USER_UPDATED", "PASSWORD_RECOVERY"].includes(event)) return;
      transition = true;
      if (!active) return;
      setUser(session?.user ?? null);
      setLoading(false);
      if (event === "SIGNED_OUT") { void queryClient.cancelQueries(); queryClient.clear(); }
      else void queryClient.invalidateQueries();
      void router.invalidate();
    });
    void supabase.auth.getUser().then(({ data }) => {
      if (active && !transition) { setUser(data.user); setLoading(false); }
    }).catch(() => { if (active) setLoading(false); });
    return () => { active = false; subscription.unsubscribe(); };
  }, [router, queryClient]);
  return <AccountContext.Provider value={{ user, loading }}>{children}</AccountContext.Provider>;
}