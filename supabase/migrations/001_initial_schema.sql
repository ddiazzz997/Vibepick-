-- ═══════════════════════════════════════════════════════════════
-- Vibepick — Initial Schema
-- Migration: 001_initial_schema.sql
-- Run in: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────
-- TABLE: public.users
-- Mirrors auth.users — stores business profile
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT        UNIQUE NOT NULL,
  first_name  TEXT        NOT NULL DEFAULT '',
  last_name   TEXT        NOT NULL DEFAULT '',
  phone       TEXT        NOT NULL DEFAULT '',
  is_pro      BOOLEAN     NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────
-- TABLE: public.user_credits
-- One row per user — tracks available credits
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_credits (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  credits    INT         NOT NULL DEFAULT 3,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────
-- TABLE: public.affiliates
-- One row per affiliate user — referral tracking
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.affiliates (
  id             UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID    NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  referral_code  TEXT    UNIQUE NOT NULL,
  referred_count INT     NOT NULL DEFAULT 0,
  earnings       FLOAT   NOT NULL DEFAULT 0
);

-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE public.users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_credits  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliates    ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────
-- RLS: users
-- ─────────────────────────────────────────
CREATE POLICY "users_select_own"
  ON public.users FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "users_insert_own"
  ON public.users FOR INSERT
  WITH CHECK (id = auth.uid());

CREATE POLICY "users_update_own"
  ON public.users FOR UPDATE
  USING (id = auth.uid());

-- ─────────────────────────────────────────
-- RLS: user_credits
-- ─────────────────────────────────────────
CREATE POLICY "credits_select_own"
  ON public.user_credits FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "credits_insert_own"
  ON public.user_credits FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "credits_update_own"
  ON public.user_credits FOR UPDATE
  USING (user_id = auth.uid());

-- ─────────────────────────────────────────
-- RLS: affiliates
-- ─────────────────────────────────────────
CREATE POLICY "affiliates_select_own"
  ON public.affiliates FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "affiliates_update_own"
  ON public.affiliates FOR UPDATE
  USING (user_id = auth.uid());

-- ═══════════════════════════════════════════════════════════════
-- NOTES
-- ─────────────────────────────────────────
-- • Edge Functions use service_role key → bypass RLS automatically
-- • user_credits.user_id has UNIQUE constraint (one row per user)
-- • affiliates.user_id has UNIQUE constraint (one row per affiliate)
-- • users.id = auth.users.id (same UUID, no separate sequence)
-- ═══════════════════════════════════════════════════════════════
