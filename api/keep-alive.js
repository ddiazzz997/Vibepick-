/**
 * Vercel Serverless Function — Supabase Keep-Alive
 *
 * Objetivo: Prevenir que Supabase pause el proyecto por inactividad.
 * El plan gratuito pausa proyectos tras 7 días sin actividad.
 * Esta función se ejecuta automáticamente via cron (ver vercel.json).
 *
 * Cron configurado: diariamente a las 09:00 UTC
 */

export default async function handler(req, res) {
    // Permitir ejecución manual via GET o automática via cron
    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const supabaseUrl =
        process.env.VITE_SUPABASE_URL ||
        process.env.SUPABASE_URL ||
        'https://ttchpzlsjkazuqhpmazv.supabase.co'

    const supabaseKey =
        process.env.VITE_SUPABASE_ANON_KEY ||
        process.env.SUPABASE_ANON_KEY ||
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0Y2hwemxzamthenVxaHBtYXp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0ODkwMjAsImV4cCI6MjA4ODA2NTAyMH0.uxpuIjFkphgnD4bmK6F88c7hjsH_plzxVFTa12VjEZU'

    const ts = new Date().toISOString()

    try {
        // Ping ligero: consulta REST API root — suficiente para marcar actividad
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
            method: 'GET',
            headers: {
                apikey: supabaseKey,
                Authorization: `Bearer ${supabaseKey}`,
            },
        })

        const ok = response.status === 200 || response.status === 404 // 404 = sin tablas expuestas = igualmente activo

        console.log(`[keep-alive] ${ts} — Supabase status: ${response.status} — ok: ${ok}`)

        return res.status(200).json({
            ok,
            supabaseStatus: response.status,
            timestamp: ts,
            message: ok
                ? 'Supabase activo. Proyecto protegido contra pausa.'
                : `Respuesta inesperada de Supabase: ${response.status}`,
        })
    } catch (err) {
        console.error(`[keep-alive] ${ts} — Error:`, err.message)
        return res.status(500).json({
            ok: false,
            error: err.message,
            timestamp: ts,
        })
    }
}
