-- ═══════════════════════════════════════════════════════════════
-- Vibepick — Auth Trigger: Auto-create user profile
-- Migration: 002_auth_trigger.sql
-- Run in: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- Auto-creates a row in public.users + public.user_credits
-- every time a new user registers via Supabase Auth.
-- SECURITY DEFINER = runs with owner privileges (bypasses RLS).

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name, phone, is_pro)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    false
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_credits (user_id, credits)
  VALUES (NEW.id, 3)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
