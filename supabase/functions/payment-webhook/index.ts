// Supabase Edge Function — Lemon Squeezy payment webhook
// Deploy: supabase functions deploy payment-webhook
// Required env vars (set in Supabase dashboard):
//   LEMONSQUEEZY_WEBHOOK_SECRET
//   SUPABASE_URL  (auto-injected by Supabase)
//   SUPABASE_SERVICE_ROLE_KEY

import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const WEBHOOK_SECRET = Deno.env.get('LEMONSQUEEZY_WEBHOOK_SECRET') ?? ''
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

function hexToBytes(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2)
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16)
    }
    return bytes
}

async function verifySignature(body: string, signature: string): Promise<boolean> {
    if (!WEBHOOK_SECRET || !signature) return false
    try {
        const key = await crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(WEBHOOK_SECRET),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['verify']
        )
        return await crypto.subtle.verify(
            'HMAC',
            key,
            hexToBytes(signature),
            new TextEncoder().encode(body)
        )
    } catch {
        return false
    }
}

serve(async (req: Request) => {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 })
    }

    const body = await req.text()
    const signature = req.headers.get('X-Signature') ?? ''

    const isValid = await verifySignature(body, signature)
    if (!isValid) {
        return new Response('Invalid signature', { status: 401 })
    }

    let payload: {
        meta: {
            event_name: string
            custom_data?: { userId?: string }
        }
    }

    try {
        payload = JSON.parse(body)
    } catch {
        return new Response('Invalid JSON', { status: 400 })
    }

    const { event_name, custom_data } = payload.meta
    const userId = custom_data?.userId

    if (!userId) {
        return new Response('Missing userId in custom_data', { status: 400 })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    if (event_name === 'subscription_created') {
        const { error } = await supabase
            .from('users')
            .update({ is_pro: true })
            .eq('id', userId)
        if (error) {
            console.error('subscription_created update failed:', error)
            return new Response('DB error', { status: 500 })
        }
    } else if (event_name === 'subscription_cancelled') {
        const { error } = await supabase
            .from('users')
            .update({ is_pro: false })
            .eq('id', userId)
        if (error) {
            console.error('subscription_cancelled update failed:', error)
            return new Response('DB error', { status: 500 })
        }
    }
    // Other events are acknowledged but ignored

    return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    })
})
