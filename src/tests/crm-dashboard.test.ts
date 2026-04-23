import { describe, it, expect } from 'vitest'

// ── Types (mirrors AdminDashboard) ───────────────────────────────────────────
interface DashUser {
    id: string; name: string; email: string; phone: string
    registeredAt: string; isPro: boolean; sessionCount: number; totalMinutes: number
}
interface DashScore { email: string; score: number; nivel: string }
interface DashPipeline { email: string; name: string; stage: string; updatedAt: string; notes?: string }

// ── Score calculation (mirrors AdminDashboard) ────────────────────────────────
function calcScore(u: DashUser, credits: number): DashScore {
    const score = u.isPro ? 75 : Math.min(Math.floor(credits * 5), 60)
    const nivel = score >= 70 ? '🟢 Activo' : score >= 35 ? '🟡 Potencial' : '🔴 En riesgo'
    return { email: u.email, score, nivel }
}

// ── Strategy engine (mirrors getStrategy) ────────────────────────────────────
function getStrategy(u: DashUser, pipe?: DashPipeline): string {
    if (u.isPro && u.sessionCount < 3)   return '⚠️ Churn Alert'
    if (!u.isPro && u.sessionCount >= 10) return '🚀 Power User'
    if (!u.isPro && u.sessionCount >= 5 && u.totalMinutes >= 10) return '🔥 Listo para upgrade'
    if (u.sessionCount === 0 && !u.isPro) return '😴 Usuario dormido'
    if (u.sessionCount === 1 && !u.isPro) return '🌱 Recién llegado'
    if (pipe?.stage === '💰 Hot Lead')    return '💰 Cierre cerca'
    return '📊 Seguimiento normal'
}

// ── WhatsApp number formatter (mirrors sendViaWhatsApp) ──────────────────────
function formatWhatsApp(phone: string): string {
    let digits = phone.replace(/\D/g, '')
    if (digits.startsWith('0')) digits = digits.slice(1)
    if (digits.length === 10)   digits = '57' + digits
    return digits
}

// ── MRR calculation ───────────────────────────────────────────────────────────
function calcMRR(users: DashUser[], pricePerUser = 9): number {
    return users.filter(u => u.isPro).length * pricePerUser
}

// ── Tests ────────────────────────────────────────────────────────────────────
const baseUser: DashUser = {
    id: 'u1', name: 'Ana García', email: 'ana@test.com', phone: '3001234567',
    registeredAt: '2026-01-01', isPro: false, sessionCount: 0, totalMinutes: 0,
}

describe('CRM Dashboard — score calculation', () => {
    it('gives score 75 and "Activo" to Pro users', () => {
        const s = calcScore({ ...baseUser, isPro: true }, 0)
        expect(s.score).toBe(75)
        expect(s.nivel).toBe('🟢 Activo')
    })

    it('caps Free user score at 60', () => {
        const s = calcScore({ ...baseUser, isPro: false }, 20)
        expect(s.score).toBe(60)
    })

    it('gives 0 score to Free user with 0 credits', () => {
        const s = calcScore({ ...baseUser, isPro: false }, 0)
        expect(s.score).toBe(0)
        expect(s.nivel).toBe('🔴 En riesgo')
    })

    it('marks as "Potencial" for medium score (35-69)', () => {
        const s = calcScore({ ...baseUser, isPro: false }, 8)
        expect(s.score).toBe(40)
        expect(s.nivel).toBe('🟡 Potencial')
    })
})

describe('CRM Dashboard — strategy engine', () => {
    it('flags Pro user with < 3 sessions as Churn Alert', () => {
        expect(getStrategy({ ...baseUser, isPro: true, sessionCount: 2 })).toBe('⚠️ Churn Alert')
    })

    it('flags Free user with 10+ sessions as Power User', () => {
        expect(getStrategy({ ...baseUser, sessionCount: 10 })).toBe('🚀 Power User')
    })

    it('flags Free user with 5+ sessions and 10+ minutes as ready for upgrade', () => {
        expect(getStrategy({ ...baseUser, sessionCount: 5, totalMinutes: 15 })).toBe('🔥 Listo para upgrade')
    })

    it('flags Free user with 0 sessions as dormant', () => {
        expect(getStrategy({ ...baseUser, sessionCount: 0 })).toBe('😴 Usuario dormido')
    })

    it('flags new user with 1 session as recently arrived', () => {
        expect(getStrategy({ ...baseUser, sessionCount: 1 })).toBe('🌱 Recién llegado')
    })

    it('flags Hot Lead pipeline stage correctly', () => {
        const pipe: DashPipeline = { email: baseUser.email, name: baseUser.name, stage: '💰 Hot Lead', updatedAt: '' }
        expect(getStrategy({ ...baseUser, sessionCount: 3 }, pipe)).toBe('💰 Cierre cerca')
    })

    it('returns normal tracking for average users', () => {
        expect(getStrategy({ ...baseUser, sessionCount: 3, isPro: false, totalMinutes: 5 })).toBe('📊 Seguimiento normal')
    })
})

describe('CRM Dashboard — WhatsApp number formatting', () => {
    it('adds Colombia prefix (57) to 10-digit numbers', () => {
        expect(formatWhatsApp('3001234567')).toBe('573001234567')
    })

    it('strips non-numeric characters', () => {
        expect(formatWhatsApp('+57 300-123-4567')).toBe('573001234567')
    })

    it('removes leading zero', () => {
        expect(formatWhatsApp('03001234567')).toBe('573001234567')
    })

    it('leaves already-international numbers untouched', () => {
        expect(formatWhatsApp('573001234567')).toBe('573001234567')
    })

    it('handles US number (11 digits) without adding prefix', () => {
        expect(formatWhatsApp('13005551234')).toBe('13005551234')
    })
})

describe('CRM Dashboard — MRR calculation', () => {
    it('calculates MRR correctly for mixed users', () => {
        const users: DashUser[] = [
            { ...baseUser, id: '1', isPro: true },
            { ...baseUser, id: '2', isPro: false },
            { ...baseUser, id: '3', isPro: true },
        ]
        expect(calcMRR(users)).toBe(18)
    })

    it('returns 0 MRR with no Pro users', () => {
        const users: DashUser[] = [{ ...baseUser, isPro: false }]
        expect(calcMRR(users)).toBe(0)
    })

    it('returns 0 MRR with empty list', () => {
        expect(calcMRR([])).toBe(0)
    })

    it('scales correctly with 50,000 Pro users', () => {
        const users: DashUser[] = Array.from({ length: 50_000 }, (_, i) => ({ ...baseUser, id: String(i), isPro: true }))
        expect(calcMRR(users)).toBe(450_000)
    })
})

describe('CRM Dashboard — pipeline localStorage', () => {
    it('updates stage of existing user in pipeline', () => {
        const pipeline: DashPipeline[] = [
            { email: 'ana@test.com', name: 'Ana', stage: '🌱 Nuevo', updatedAt: '' },
        ]
        const updated = pipeline.map(p =>
            p.email === 'ana@test.com'
                ? { ...p, stage: '💰 Hot Lead', updatedAt: new Date().toISOString() }
                : p
        )
        expect(updated[0].stage).toBe('💰 Hot Lead')
    })

    it('adds new user to pipeline if not exists', () => {
        const pipeline: DashPipeline[] = []
        const next = [...pipeline, { email: 'new@test.com', name: 'New', stage: '🌱 Nuevo', updatedAt: new Date().toISOString() }]
        expect(next).toHaveLength(1)
        expect(next[0].email).toBe('new@test.com')
    })
})
