/**
 * Claude AI Client — Calls Vercel Serverless Function /api/chat-ai
 *
 * Flujo simplísimo:
 * ┌──────────────┐    POST /api/chat-ai    ┌──────────────────┐    POST     ┌──────────┐
 * │   Browser    │  ─────────────────────► │  Vercel Function │ ─────────► │  Claude  │
 * │  (NO tiene   │                         │  (TIENE la API   │            │   API    │
 * │   API key)   │  ◄───────────────────── │   key segura)    │ ◄───────── │          │
 * └──────────────┘      JSON response      └──────────────────┘  response  └──────────┘
 *
 * Tú subes a GitHub → Vercel deploya → la función funciona con tu clave
 * que pusiste en Vercel Dashboard → Environment Variables.
 */

interface ClaudeMessage {
    role: 'user' | 'assistant'
    content: string
}

/**
 * Chat with Daniel AI (Claude-powered, role-based)
 *
 * Cada fieldType activa un "cerebro" diferente de Daniel AI:
 *   - "description"    → 🔧 Ingeniero y Especialista en Marketing
 *   - "brandVoice"     → 🎨 Diseñador UI/UX
 *   - "offer"          → 💰 Experto en Marketing Directo (Hormozi)
 *   - "sectionBuilder" → 🏗️ Arquitecto Web
 *
 * TODOS usan la MISMA API key. No se confunden porque cada
 * conversación tiene su propio system prompt aislado.
 */
export const chatWithAssistant = async (
    fieldType: string,
    history: { role: 'user' | 'model'; parts: any[] }[],
    contextData: Record<string, string>,
    language: string = 'es'
): Promise<string> => {
    try {
        // Convertir formato Gemini → formato Claude
        const messages: ClaudeMessage[] = history.map(msg => ({
            role: msg.role === 'model' ? 'assistant' as const : 'user' as const,
            content: msg.parts
                .filter((p: any) => p.text)
                .map((p: any) => p.text)
                .join('\n'),
        })).filter(m => m.content.trim() !== '')

        if (messages.length === 0) {
            return language === 'es'
                ? 'No recibí tu mensaje. ¿Podrías intentarlo de nuevo?'
                : 'I didn\'t receive your message. Could you try again?'
        }

        // Llamar a la Vercel Serverless Function
        const response = await fetch('/api/chat-ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fieldType,
                messages,
                contextData,
                language,
            }),
        })

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}))
            console.error('API error:', response.status, errData)
            return language === 'es'
                ? 'Hubo un error de conexión con la IA. ¿Podemos intentarlo de nuevo?'
                : 'Connection error. Can we try again?'
        }

        const data = await response.json()

        if (data?.error) {
            console.error('Server returned error:', data.error)
            return language === 'es'
                ? 'Hubo un error al procesar tu mensaje. Intenta nuevamente.'
                : 'Error processing your message. Please try again.'
        }

        return data?.text?.trim() || (language === 'es'
            ? 'No pude generar una respuesta.'
            : 'Could not generate a response.')
    } catch (err) {
        console.error('Claude client error:', err)
        return language === 'es'
            ? 'Hubo un error al procesar tu mensaje. Intenta nuevamente.'
            : 'Error processing your message. Please try again.'
    }
}
