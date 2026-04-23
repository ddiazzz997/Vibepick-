/// <reference types="vite/client" />

const RESEND_URL = 'https://api.resend.com/emails'
const FROM = 'Vibepick <noreply@vibepick.com>'

async function send(to: string, subject: string, text: string): Promise<void> {
    const apiKey = import.meta.env.VITE_RESEND_API_KEY
    if (!apiKey) {
        console.warn('[email] VITE_RESEND_API_KEY not set — skipping email')
        return
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
        throw new Error(`Resend error ${res.status}: ${JSON.stringify(err)}`)
    }
}

/** Triggered right after registration.
 *  Template: "Tu primer sitio en 5 minutos" */
export async function sendWelcomeEmail(to: string, firstName: string): Promise<void> {
    const subject = `${firstName}, tu primer sitio en 5 minutos 🚀`
    const text = `Hola ${firstName},

¡Bienvenido a Vibepick!

Estás a solo unos clics de tener tu sitio web listo. Así empiezas:

1. Describe tu negocio en el generador de prompts
2. Copia el prompt y pégalo en tu herramienta favorita de IA
3. Comparte tu sitio con el mundo

Tienes 3 créditos de bienvenida disponibles. ¡Úsalos hoy!

→ https://vibepick.com

Si tienes dudas, responde este correo y te ayudamos.

El equipo de Vibepick`

    await send(to, subject, text)
}

/** Triggered for users who registered but didn't generate a prompt in 3 days.
 *  Template: "¿Bloqueado? Te ayudamos" */
export async function sendReEngageEmail(to: string, firstName: string): Promise<void> {
    const subject = `${firstName}, ¿bloqueado? Te ayudamos 🤝`
    const text = `Hola ${firstName},

Notamos que aún no has generado tu primer prompt en Vibepick.

Es normal sentirse bloqueado al principio. Aquí van 3 tips rápidos:

• Sé específico: "Soy fotógrafo de bodas en Bogotá para parejas millennials"
• Incluye tu diferenciador: ¿Qué te hace único vs tu competencia?
• No tiene que ser perfecto: el prompt es un punto de partida, no el resultado final

¿Necesitas inspiración? Tenemos ejemplos reales en:
→ https://vibepick.com/#ejemplos

Tienes créditos esperándote. ¡Vamos!

El equipo de Vibepick`

    await send(to, subject, text)
}

/** Triggered on day 7 to nudge free users toward Pro.
 *  Template: "Usuarios Pro generaron 4x más esta semana" */
export async function sendUpgradeEmail(to: string, firstName: string): Promise<void> {
    const subject = `${firstName}, los usuarios Pro generaron 4x más esta semana 📈`
    const text = `Hola ${firstName},

Esta semana los usuarios Vibepick Pro generaron en promedio 4 veces más prompts que los usuarios gratuitos.

¿Por qué? Porque con créditos ilimitados experimentan sin miedo.

Con Vibepick Pro ($9/mes) obtienes:

✅ Prompts ilimitados — experimenta sin límites
✅ Todas las secciones desbloqueadas
✅ Exportación completa del proyecto
✅ Soporte directo por WhatsApp

Cancela cuando quieras. Sin contratos.

→ https://vibepick.com (actualiza desde tu panel)

El equipo de Vibepick`

    await send(to, subject, text)
}
