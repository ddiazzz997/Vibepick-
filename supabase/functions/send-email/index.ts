// Supabase Edge Function — transactional email via Resend
// Deploy: supabase functions deploy send-email
// Required env vars (set in Supabase dashboard):
//   RESEND_API_KEY

import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'

const RESEND_URL = 'https://api.resend.com/emails'
const FROM = 'Vibepick <noreply@vibepick.com>'

interface EmailPayload {
    to: string
    subject: string
    text: string
}

serve(async (req: Request) => {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 })
    }

    const apiKey = Deno.env.get('RESEND_API_KEY')
    if (!apiKey) {
        return new Response('RESEND_API_KEY not configured', { status: 500 })
    }

    let payload: EmailPayload
    try {
        payload = await req.json()
    } catch {
        return new Response('Invalid JSON', { status: 400 })
    }

    const { to, subject, text } = payload
    if (!to || !subject || !text) {
        return new Response('Missing required fields: to, subject, text', { status: 400 })
    }

    const res = await fetch(RESEND_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from: FROM, to: [to], subject, text }),
    })

    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        console.error('Resend error:', err)
        return new Response(JSON.stringify({ error: err }), {
            status: res.status,
            headers: { 'Content-Type': 'application/json' },
        })
    }

    const data = await res.json()
    return new Response(JSON.stringify({ ok: true, id: data.id }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    })
})
