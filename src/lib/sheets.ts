// ── Vibepick — Google Sheets API Layer ──────────────────
// Replace VITE_SHEETS_WEBHOOK_URL in .env.local with your deployed Apps Script URL

const WEBHOOK = (import.meta as any).env?.VITE_SHEETS_WEBHOOK_URL as string | undefined

async function post(data: object): Promise<any> {
    if (!WEBHOOK) { console.warn('VITE_SHEETS_WEBHOOK_URL not set'); return { success: false, error: 'No webhook URL' } }
    try {
        const res = await fetch(WEBHOOK, {
            method: 'POST',
            redirect: 'follow',
            body: JSON.stringify(data),
        })
        return await res.json()
    } catch (err) {
        console.error('Sheets POST error:', err)
        return { success: false, error: String(err) }
    }
}

async function get(params: Record<string, string>): Promise<any> {
    if (!WEBHOOK) return { success: false, error: 'No webhook URL' }
    try {
        const url = new URL(WEBHOOK)
        Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
        const res = await fetch(url.toString(), { redirect: 'follow' })
        return await res.json()
    } catch (err) {
        console.error('Sheets GET error:', err)
        return { success: false, error: String(err) }
    }
}

export interface SheetUser {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    isPro: boolean
    sessionCount: number
    totalMinutes: number
}

export const sheets = {
    register: (firstName: string, lastName: string, email: string, phone: string) =>
        post({ action: 'register', firstName, lastName, email, phone }),

    login: (email: string) =>
        post({ action: 'login', email }),

    saveSession: (payload: {
        email: string; name: string; sessionStart: string;
        duration: number; promptsGenerated: number
    }) => post({ action: 'session', ...payload }),

    saveSessionBeacon: (payload: {
        email: string; name: string; sessionStart: string;
        duration: number; promptsGenerated: number
    }) => {
        if (!WEBHOOK) return
        const body = JSON.stringify({ action: 'session', ...payload })
        if (navigator.sendBeacon) {
            navigator.sendBeacon(WEBHOOK, new Blob([body], { type: 'text/plain' }))
        }
    },

    getDashboard: () => get({ action: 'dashboard' }),

    upgradeToPro: (email: string) =>
        post({ action: 'upgradeToPro', email }),
}
