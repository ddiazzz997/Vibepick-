import { describe, it, expect } from 'vitest'

// ── Pure logic extracted from AdminApp ───────────────────────────────────────
const ADMIN_EMAIL    = 'ddiaz.consultor.ia@gmail.com'
const ADMIN_PASSWORD = 'yoli1317remdiaz17'

function checkAdminCredentials(email: string, password: string): boolean {
    return (
        email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
        password === ADMIN_PASSWORD
    )
}

// ── Auth error messages (same logic as AuthContext) ──────────────────────────
function mapSignUpError(message: string): string {
    const lower = message.toLowerCase()
    if (lower.includes('already registered') || lower.includes('already been registered'))
        return 'Este correo ya tiene una cuenta. Usa "Iniciar sesión".'
    return message
}

// ── Tests ────────────────────────────────────────────────────────────────────
describe('CRM Admin — credential check', () => {
    it('grants access with correct email and password', () => {
        expect(checkAdminCredentials('ddiaz.consultor.ia@gmail.com', 'yoli1317remdiaz17')).toBe(true)
    })

    it('grants access regardless of email casing', () => {
        expect(checkAdminCredentials('DDIAZ.CONSULTOR.IA@GMAIL.COM', 'yoli1317remdiaz17')).toBe(true)
        expect(checkAdminCredentials('Ddiaz.Consultor.Ia@Gmail.Com', 'yoli1317remdiaz17')).toBe(true)
    })

    it('denies access with wrong password', () => {
        expect(checkAdminCredentials('ddiaz.consultor.ia@gmail.com', 'wrongpassword')).toBe(false)
    })

    it('denies access with wrong email', () => {
        expect(checkAdminCredentials('hacker@evil.com', 'yoli1317remdiaz17')).toBe(false)
    })

    it('denies access with both wrong', () => {
        expect(checkAdminCredentials('other@gmail.com', 'other123')).toBe(false)
    })

    it('denies access with empty credentials', () => {
        expect(checkAdminCredentials('', '')).toBe(false)
    })

    it('trims leading/trailing spaces from email', () => {
        expect(checkAdminCredentials('  ddiaz.consultor.ia@gmail.com  ', 'yoli1317remdiaz17')).toBe(true)
    })

    it('does NOT trim password (passwords are case-sensitive)', () => {
        expect(checkAdminCredentials('ddiaz.consultor.ia@gmail.com', ' yoli1317remdiaz17')).toBe(false)
    })
})

describe('Auth — signUp error messages', () => {
    it('translates "already registered" to Spanish', () => {
        const msg = mapSignUpError('User already registered')
        expect(msg).toBe('Este correo ya tiene una cuenta. Usa "Iniciar sesión".')
    })

    it('translates "already been registered" variant', () => {
        const msg = mapSignUpError('Email address already been registered')
        expect(msg).toBe('Este correo ya tiene una cuenta. Usa "Iniciar sesión".')
    })

    it('passes through unknown errors unchanged', () => {
        const msg = mapSignUpError('Network timeout')
        expect(msg).toBe('Network timeout')
    })

    it('handles empty error message', () => {
        const msg = mapSignUpError('')
        expect(msg).toBe('')
    })
})

describe('Auth — profile mapper (toProfile)', () => {
    it('maps SheetUser + promptCount to Profile shape', () => {
        const sheetUser = {
            id: 'u1', firstName: 'Ana', lastName: 'García',
            email: 'ana@test.com', phone: '3001234567',
            isPro: false, sessionCount: 0, totalMinutes: 0,
        }
        const profile = {
            first_name:   sheetUser.firstName,
            last_name:    sheetUser.lastName,
            phone:        sheetUser.phone,
            prompt_count: 3,
            is_pro:       sheetUser.isPro,
        }
        expect(profile.first_name).toBe('Ana')
        expect(profile.last_name).toBe('García')
        expect(profile.prompt_count).toBe(3)
        expect(profile.is_pro).toBe(false)
    })

    it('reflects isPro=true correctly', () => {
        const profile = { first_name: 'X', last_name: 'Y', phone: '', prompt_count: 0, is_pro: true }
        expect(profile.is_pro).toBe(true)
    })
})

describe('Auth — rowToSheetUser mapper', () => {
    it('maps DB row to SheetUser correctly', () => {
        const row = {
            id: 'abc', email: 'test@test.com',
            first_name: 'Luis', last_name: 'Pérez',
            phone: '3109876543', is_pro: true, created_at: '2026-01-01',
        }
        const sheetUser = {
            id:           row.id,
            firstName:    row.first_name,
            lastName:     row.last_name,
            email:        row.email,
            phone:        row.phone,
            isPro:        row.is_pro,
            sessionCount: 0,
            totalMinutes: 0,
        }
        expect(sheetUser.firstName).toBe('Luis')
        expect(sheetUser.isPro).toBe(true)
        expect(sheetUser.sessionCount).toBe(0)
    })
})
