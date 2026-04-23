/**
 * Supabase Edge Function — referral-credit
 *
 * Endpoint: POST /functions/v1/referral-credit
 * Body:     { referral_code: string, new_user_id: string }
 *
 * Flujo:
 *  1. Busca el dueño del referral_code en la tabla affiliates
 *  2. Suma +5 créditos al dueño en user_credits
 *  3. Incrementa referred_count en affiliates
 *  4. Responde { success: true }
 *
 * Nota: usa service_role → bypass RLS. El JWT verificado garantiza
 *       que solo usuarios autenticados pueden invocar esta función.
 */

import { serve }         from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient }  from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
    // ── Preflight ───────────────────────────────────────────
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // ── Parse body ──────────────────────────────────────
        const { referral_code, new_user_id } = await req.json() as {
            referral_code: string
            new_user_id:   string
        }

        if (!referral_code || !new_user_id) {
            return new Response(
                JSON.stringify({ success: false, error: 'referral_code y new_user_id son requeridos' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // ── Cliente con service_role (bypass RLS) ────────────
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
        )

        // ── 1. Buscar dueño del referral_code ────────────────
        const { data: affiliate, error: affiliateError } = await supabase
            .from('affiliates')
            .select('id, user_id, referred_count')
            .eq('referral_code', referral_code)
            .single()

        if (affiliateError || !affiliate) {
            return new Response(
                JSON.stringify({ success: false, error: 'Código de referido no encontrado' }),
                { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const ownerId = affiliate.user_id as string

        // Evitar auto-referido
        if (ownerId === new_user_id) {
            return new Response(
                JSON.stringify({ success: false, error: 'No puedes usar tu propio código de referido' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // ── 2. Obtener créditos actuales del dueño ───────────
        const { data: creditsRow, error: creditsError } = await supabase
            .from('user_credits')
            .select('credits')
            .eq('user_id', ownerId)
            .single()

        if (creditsError || !creditsRow) {
            return new Response(
                JSON.stringify({ success: false, error: 'No se encontraron créditos del usuario referente' }),
                { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const newCredits = (creditsRow.credits as number) + 5

        // ── 3. Sumar +5 créditos al dueño ────────────────────
        const { error: updateCreditsError } = await supabase
            .from('user_credits')
            .update({
                credits:    newCredits,
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', ownerId)

        if (updateCreditsError) {
            return new Response(
                JSON.stringify({ success: false, error: 'Error al actualizar créditos' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // ── 4. Incrementar referred_count ────────────────────
        const { error: updateAffiliateError } = await supabase
            .from('affiliates')
            .update({ referred_count: (affiliate.referred_count as number) + 1 })
            .eq('id', affiliate.id)

        if (updateAffiliateError) {
            // No fatal: créditos ya sumados, solo log
            console.error('Error incrementando referred_count:', updateAffiliateError.message)
        }

        // ── Respuesta exitosa ────────────────────────────────
        return new Response(
            JSON.stringify({ success: true }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (err) {
        return new Response(
            JSON.stringify({ success: false, error: 'Error interno del servidor' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
