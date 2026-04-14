import { useEffect, useRef } from 'react'
import { sheets } from '../lib/sheets'

interface TrackerConfig {
    email: string
    name: string
}

/**
 * Tracks how long the user spends on the platform.
 * - Saves to Google Sheets on page unload (via sendBeacon)
 * - Also saves every 5 minutes as a heartbeat
 */
export function useSessionTracker(user: TrackerConfig | null, promptCount: number) {
    const promptRef = useRef<number>(0)

    // Acumulador de tiempo activo (synced vs unsynced)
    const unsyncedMsRef = useRef<number>(0)
    const lastActiveRef = useRef<number>(Date.now())
    const isWorkingRef = useRef<boolean>(document.visibilityState === 'visible')

    // Idle tracking
    const IDLE_TIMEOUT_MS = 60 * 1000 // 1 minute sin interactuar = Inactivo
    const idleTimerRef = useRef<any>(null)

    // Keep prompt count in sync via ref (to avoid stale closure)
    useEffect(() => { promptRef.current = promptCount }, [promptCount])

    useEffect(() => {
        if (!user) return

        unsyncedMsRef.current = 0
        lastActiveRef.current = Date.now()
        isWorkingRef.current = document.visibilityState === 'visible'

        // Sumar lo que iba contando si estaba activo
        const accumulate = () => {
            if (isWorkingRef.current) {
                const now = Date.now()
                // Si la diferencia es irrazonablemente alta (> 1 hora de golpe por algún sleep state suspendido) lo capamos.
                const diff = Math.min(now - lastActiveRef.current, 60 * 60 * 1000)
                unsyncedMsRef.current += diff
                lastActiveRef.current = now
            }
        }

        const goIdle = () => {
            if (!isWorkingRef.current) return
            accumulate()
            isWorkingRef.current = false
        }

        const becomeActive = () => {
            if (document.visibilityState !== 'visible') return
            if (!isWorkingRef.current) {
                isWorkingRef.current = true
                lastActiveRef.current = Date.now()
            }
            // Resetear el timer de irse a AFK
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
            idleTimerRef.current = setTimeout(goIdle, IDLE_TIMEOUT_MS)
        }

        const buildAndSendPayload = (isBeacon: boolean = false) => {
            accumulate()

            const minutesToSync = unsyncedMsRef.current / 60000
            // Solo mandamos si es >= 1 min o es un cierre inminente (beacon > 0.1)
            if (minutesToSync < (isBeacon ? 0.1 : 1)) return

            const payload = {
                email: user.email,
                name: user.name,
                sessionStart: new Date(Date.now() - unsyncedMsRef.current).toISOString(),
                duration: Number(minutesToSync.toFixed(2)),
                promptsGenerated: promptRef.current,
            }

            if (isBeacon) {
                sheets.saveSessionBeacon(payload)
            } else {
                sheets.saveSession(payload)
            }

            // Reset tras enviar
            unsyncedMsRef.current = 0
            promptRef.current = 0
            lastActiveRef.current = Date.now() // el nuevo inicio de tracking para el sig. chunk
        }

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                goIdle()
                buildAndSendPayload(true)
            } else {
                becomeActive()
            }
        }

        const handleUnload = () => {
            goIdle()
            buildAndSendPayload(true)
        }

        // Heartbeat cada 3 minutos
        const interval = setInterval(() => {
            buildAndSendPayload(false)
        }, 3 * 60 * 1000)

        // Eventos que mantienen al usuario "activo"
        const activityEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll']
        const onActivity = () => becomeActive()

        activityEvents.forEach(e => window.addEventListener(e, onActivity, { passive: true }))
        window.addEventListener('beforeunload', handleUnload)
        document.addEventListener('visibilitychange', handleVisibilityChange)

        // Init idle timer por primera vez
        becomeActive()

        return () => {
            handleUnload()
            clearInterval(interval)
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
            activityEvents.forEach(e => window.removeEventListener(e, onActivity))
            window.removeEventListener('beforeunload', handleUnload)
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [user?.email]) // re-run only when user email changes
}
