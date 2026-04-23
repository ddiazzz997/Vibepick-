import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock framer-motion to avoid animation side-effects in tests
vi.mock('framer-motion', () => ({
    motion: new Proxy({}, {
        get: (_t, tag) => {
            const React = require('react')
            return ({ children, ...props }: any) =>
                React.createElement(tag as string, props, children)
        },
    }),
    AnimatePresence: ({ children }: any) => children,
}))

// Mock Supabase globally
vi.mock('../lib/supabase', () => ({
    supabase: {
        auth: {
            getSession:             vi.fn().mockResolvedValue({ data: { session: null } }),
            signInWithPassword:     vi.fn(),
            signUp:                 vi.fn(),
            signOut:                vi.fn().mockResolvedValue({}),
            onAuthStateChange:      vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
        },
        from: vi.fn().mockReturnValue({
            select:  vi.fn().mockReturnThis(),
            insert:  vi.fn().mockReturnThis(),
            upsert:  vi.fn().mockReturnThis(),
            update:  vi.fn().mockReturnThis(),
            eq:      vi.fn().mockReturnThis(),
            order:   vi.fn().mockReturnThis(),
            limit:   vi.fn().mockReturnThis(),
            single:  vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
    },
}))

// Silence console.error for expected React warnings in tests
vi.spyOn(console, 'error').mockImplementation(() => {})
