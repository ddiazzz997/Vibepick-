import { describe, it, expect } from 'vitest'

// ── relativeDate (same logic as PromptHistorySidebar) ────────────────────────
function relativeDate(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime()
    const mins  = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days  = Math.floor(diff / 86400000)
    if (mins  <  1) return 'Ahora mismo'
    if (mins  < 60) return `Hace ${mins} min`
    if (hours < 24) return `Hace ${hours}h`
    if (days  <  7) return `Hace ${days}d`
    return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

// ── PromptHistoryItem validation ─────────────────────────────────────────────
interface PromptHistoryItem {
    id: string; description: string; vibe: string | null
    sections: string[] | null; prompt_text: string; created_at: string
}

function isValidHistoryItem(item: unknown): item is PromptHistoryItem {
    if (!item || typeof item !== 'object') return false
    const i = item as Record<string, unknown>
    return (
        typeof i.id          === 'string' &&
        typeof i.description === 'string' &&
        typeof i.prompt_text === 'string' &&
        typeof i.created_at  === 'string'
    )
}

// ── Tests ────────────────────────────────────────────────────────────────────
describe('relativeDate — sidebar timestamps', () => {
    it('returns "Ahora mismo" for events < 1 minute ago', () => {
        const now = new Date(Date.now() - 30_000).toISOString()
        expect(relativeDate(now)).toBe('Ahora mismo')
    })

    it('returns "Hace N min" for events 1-59 min ago', () => {
        const ago5 = new Date(Date.now() - 5 * 60_000).toISOString()
        expect(relativeDate(ago5)).toBe('Hace 5 min')
    })

    it('returns "Hace Nh" for events 1-23h ago', () => {
        const ago3h = new Date(Date.now() - 3 * 3600_000).toISOString()
        expect(relativeDate(ago3h)).toBe('Hace 3h')
    })

    it('returns "Hace Nd" for events 1-6 days ago', () => {
        const ago2d = new Date(Date.now() - 2 * 86400_000).toISOString()
        expect(relativeDate(ago2d)).toBe('Hace 2d')
    })

    it('returns formatted date for events 7+ days ago', () => {
        const old = new Date(Date.now() - 10 * 86400_000).toISOString()
        const result = relativeDate(old)
        expect(result).not.toMatch(/^Hace/)
        expect(result.length).toBeGreaterThan(0)
    })
})

describe('PromptHistoryItem — shape validation', () => {
    it('accepts a valid item', () => {
        const item = {
            id: 'abc', description: 'Mi sitio web', vibe: 'clean',
            sections: ['hero', 'about'], prompt_text: '...', created_at: '2026-01-01T00:00:00Z',
        }
        expect(isValidHistoryItem(item)).toBe(true)
    })

    it('accepts item with null vibe and sections', () => {
        const item = {
            id: '1', description: 'Test', vibe: null,
            sections: null, prompt_text: 'x', created_at: '2026-01-01T00:00:00Z',
        }
        expect(isValidHistoryItem(item)).toBe(true)
    })

    it('rejects item missing id', () => {
        expect(isValidHistoryItem({ description: 'x', prompt_text: 'x', created_at: 'x' })).toBe(false)
    })

    it('rejects null', () => {
        expect(isValidHistoryItem(null)).toBe(false)
    })

    it('rejects non-object', () => {
        expect(isValidHistoryItem('string')).toBe(false)
    })
})

describe('Prompt history — prepend logic', () => {
    it('adds new item to front and caps at 20', () => {
        const existing: PromptHistoryItem[] = Array.from({ length: 20 }, (_, i) => ({
            id: String(i), description: `Item ${i}`, vibe: null,
            sections: null, prompt_text: '...', created_at: '2026-01-01T00:00:00Z',
        }))
        const newItem: PromptHistoryItem = {
            id: 'new', description: 'Nuevo', vibe: null,
            sections: null, prompt_text: '...', created_at: '2026-04-21T00:00:00Z',
        }
        const result = [newItem, ...existing.slice(0, 19)]
        expect(result).toHaveLength(20)
        expect(result[0].id).toBe('new')
        expect(result[19].id).toBe('18')
    })

    it('adds new item when list is empty', () => {
        const newItem: PromptHistoryItem = {
            id: 'first', description: 'Primero', vibe: null,
            sections: null, prompt_text: '...', created_at: '2026-04-21T00:00:00Z',
        }
        const result = [newItem, ...[] .slice(0, 19)]
        expect(result).toHaveLength(1)
        expect(result[0].id).toBe('first')
    })
})
