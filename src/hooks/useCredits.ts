/**
 * useCredits — Vibepick Credit System (Supabase backend)
 *
 * Credits are stored in public.user_credits. Local state is kept in
 * sync via optimistic updates; every mutation is persisted to Supabase
 * in the background so spendCredit() remains synchronous.
 *
 * Credit events:
 *  - New account:            +3 welcome credits (auto-inserted if row missing)
 *  - Complete profile (100%) +2 bonus credits (called externally via addCredits)
 *  - Referral link used:     +5 credits (via Edge Function referral-credit)
 *  - Generate prompt:        -1 credit
 *  - Pro users:              unlimited (spendCredit always returns true)
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'

const WELCOME_CREDITS = 3

// ── Internal helper: persist credits to DB (fire-and-forget) ─
function syncCredits(userId: string, value: number): void {
    supabase
        .from('user_credits')
        .update({ credits: value, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .then(() => { /* background — no action needed on success */ })
}

// ── Hook ──────────────────────────────────────────────────────
// Public interface IDÉNTICA a la versión anterior.
export function useCredits(isLoggedIn: boolean, isPro: boolean) {
    const [credits,         setCredits]         = useState<number>(0)
    const [showCreditModal, setShowCreditModal]  = useState(false)
    const [initialized,     setInitialized]      = useState(false)

    // userId en ref para que los callbacks lo lean sin re-crear closures
    const userIdRef = useRef<string | null>(null)

    // ── Cargar créditos desde Supabase al hacer login ──────────
    useEffect(() => {
        if (!isLoggedIn) {
            setCredits(0)
            setInitialized(false)
            userIdRef.current = null
            return
        }

        let cancelled = false

        async function loadFromDB() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user || cancelled) return

            userIdRef.current = user.id

            const { data, error } = await supabase
                .from('user_credits')
                .select('credits')
                .eq('user_id', user.id)
                .single()

            if (cancelled) return

            if (error || !data) {
                // Primera vez — insertar créditos de bienvenida
                const { error: insertError } = await supabase
                    .from('user_credits')
                    .insert({ user_id: user.id, credits: WELCOME_CREDITS })

                if (!cancelled && !insertError) {
                    setCredits(WELCOME_CREDITS)
                    setInitialized(true)
                }
            } else {
                setCredits((data as { credits: number }).credits)
                setInitialized(true)
            }
        }

        loadFromDB()
        return () => { cancelled = true }
    }, [isLoggedIn])

    // ── spendCredit: síncrono + sync a DB en background ───────
    const spendCredit = useCallback((): boolean => {
        if (isPro)       return true
        if (!isLoggedIn) return false

        if (credits <= 0) {
            setShowCreditModal(true)
            return false
        }

        const next = credits - 1
        setCredits(next)                          // optimistic

        const uid = userIdRef.current
        if (uid) syncCredits(uid, next)           // background sync

        return true
    }, [isPro, isLoggedIn, credits])

    // ── addCredits: para completar perfil, referidos, etc. ────
    const addCredits = useCallback((amount: number) => {
        const next = credits + amount
        setCredits(next)                          // optimistic

        const uid = userIdRef.current
        if (uid) syncCredits(uid, next)           // background sync
    }, [credits])

    // ── resetCredits: al cerrar sesión ────────────────────────
    const resetCredits = useCallback(() => {
        setCredits(0)
        setInitialized(false)
        userIdRef.current = null
    }, [])

    return {
        credits,
        initialized,
        showCreditModal,
        setShowCreditModal,
        spendCredit,
        addCredits,
        resetCredits,
    }
}
