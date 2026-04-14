/**
 * useCredits — Vibepick Credit System
 *
 * Credits are stored in localStorage. On registration, the user
 * receives 3 welcome credits. Each prompt generation costs 1 credit.
 * Pro users have unlimited credits (no deduction).
 *
 * Credit events:
 *  - New account:            +3 welcome credits
 *  - Complete profile (100%) +2 bonus credits (called externally)
 *  - Referral link used:     +5 credits (future)
 *  - Generate prompt:        -1 credit
 */

import { useState, useEffect, useCallback } from 'react'

const LS_KEY_CREDITS = 'vp_credits'
const WELCOME_CREDITS = 3

function loadCredits(): number {
    try {
        const raw = localStorage.getItem(LS_KEY_CREDITS)
        return raw !== null ? parseInt(raw, 10) : -1 // -1 = not initialized
    } catch {
        return 0
    }
}

function saveCredits(n: number) {
    localStorage.setItem(LS_KEY_CREDITS, String(Math.max(0, n)))
}

export function useCredits(isLoggedIn: boolean, isPro: boolean) {
    const [credits, setCredits] = useState<number>(0)
    const [showCreditModal, setShowCreditModal] = useState(false)
    const [initialized, setInitialized] = useState(false)

    // Load on mount
    useEffect(() => {
        if (!isLoggedIn) {
            setCredits(0)
            setInitialized(false)
            return
        }
        const stored = loadCredits()
        if (stored === -1) {
            // First time — give welcome credits
            saveCredits(WELCOME_CREDITS)
            setCredits(WELCOME_CREDITS)
        } else {
            setCredits(stored)
        }
        setInitialized(true)
    }, [isLoggedIn])

    /**
     * Attempt to spend 1 credit. Returns true if allowed, false if gate needed.
     * Pro users always return true (unlimited).
     */
    const spendCredit = useCallback((): boolean => {
        if (isPro) return true
        if (!isLoggedIn) return false

        const current = loadCredits()
        if (current <= 0) {
            setShowCreditModal(true)
            return false
        }
        const next = current - 1
        saveCredits(next)
        setCredits(next)
        return true
    }, [isPro, isLoggedIn])

    /**
     * Add credits (e.g., for completing profile, referrals).
     */
    const addCredits = useCallback((amount: number) => {
        const current = loadCredits()
        const next = current + amount
        saveCredits(next)
        setCredits(next)
    }, [])

    /**
     * Reset credits (on logout).
     */
    const resetCredits = useCallback(() => {
        localStorage.removeItem(LS_KEY_CREDITS)
        setCredits(0)
        setInitialized(false)
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
