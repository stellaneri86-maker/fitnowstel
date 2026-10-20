GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
GRANT SELECT, INSERT, DELETE ON public.user_menus TO authenticated;
GRANT ALL ON public.user_menus TO service_role;
REVOKE ALL ON public.profiles, public.user_menus FROM anon;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_menus ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, updated_at)
  VALUES (NEW.id, NEW.email, left(trim(NEW.raw_user_meta_data->>'full_name'),100), now())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
INSERT INTO public.profiles (id, email, full_name, updated_at)
SELECT id, email, left(trim(raw_user_meta_data->>'full_name'),100), now() FROM auth.users
ON CONFLICT (id) DO NOTHING;