import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface RetentionPopupProps {
    sessionCount: number
    totalMinutes: number
    isPro: boolean
    firstName: string
}

/**
 * Retention strategy popup:
 * - Shows on 3rd+ session OR after 10+ cumulative minutes
 * - Only for non-Pro users
 */
export default function RetentionPopup({ sessionCount, totalMinutes, isPro, firstName }: RetentionPopupProps) {
    const [visible, setVisible] = useState(false)
    const [dismissed, setDismissed] = useState(false)

    const shouldShow = !isPro && !dismissed && (sessionCount >= 3 || totalMinutes >= 10)

    useEffect(() => {
        if (!shouldShow) return
        // Delay 30 seconds after entering the platform
        const timer = setTimeout(() => setVisible(true), 30_000)
        return () => clearTimeout(timer)
    }, [shouldShow])

    const whatsappMsg = encodeURIComponent(
        `Hola! Soy ${firstName} y he estado usando Vibepick. Me interesa saber más sobre el plan Pro 🚀`
    )

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-4"
                >
                    <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setVisible(false); setDismissed(true) }} />

                    <motion.div
                        initial={{ y: 60, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 60, opacity: 0, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                        className="relative z-10 w-full max-w-sm rounded-3xl overflow-hidden"
                        style={{
                            background: 'linear-gradient(135deg, #0a0f1e 0%, #050810 100%)',
                            border: '1px solid rgba(0,102,255,0.3)',
                            boxShadow: '0 0 80px rgba(0,102,255,0.2), 0 40px 80px rgba(0,0,0,0.6)',
                        }}
                    >
                        {/* Glow top bar */}
                        <div style={{ height: 3, background: 'linear-gradient(90deg,#0066ff,#0ea5e9,#0066ff)', backgroundSize: '200% auto', animation: 'shimmer 2s linear infinite' }} />

                        <div className="p-7">
                            <button onClick={() => { setVisible(false); setDismissed(true) }}
                                className="absolute top-4 right-4 text-white/30 hover:text-white/70 bg-transparent border-none cursor-pointer text-xl leading-none"
                            >×</button>

                            {/* Icon */}
                            <motion.div
                                animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.8, repeat: Infinity }}
                                className="text-4xl mb-4"
                            >🔥</motion.div>

                            <h3 className="text-xl font-extrabold text-white mb-1">
                                {firstName}, ¡eres de los nuestros!
                            </h3>
                            <p className="text-white/50 text-sm mb-5 leading-relaxed">
                                {sessionCount >= 3
                                    ? `Llevas ${sessionCount} visitas a Vibepick. Los usuarios como tú merecen más.`
                                    : `Llevas ${Math.round(totalMinutes)} minutos creando sitios. Eso dice mucho de ti.`
                                }
                            </p>

                            {/* Offer box */}
                            <div className="rounded-2xl p-4 mb-5 text-center"
                                style={{ background: 'rgba(0,102,255,0.08)', border: '1px solid rgba(0,102,255,0.2)' }}
                            >
                                <p className="text-xs text-blue-400 uppercase tracking-widest font-semibold mb-1">Oferta exclusiva</p>
                                <p className="text-3xl font-black text-white">30% OFF</p>
                                <p className="text-sm text-white/60 mt-0.5">Plan Pro — prompts ilimitados</p>
                            </div>

                            {/* CTAs */}
                            <a
                                href={`https://wa.me/1234567890?text=${whatsappMsg}`}
                                target="_blank" rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-white text-sm mb-3 no-underline"
                                style={{ background: '#25D366' }}
                                onClick={() => { setVisible(false); setDismissed(true) }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 2C6.486 2 2 6.486 2 12c0 1.89.518 3.656 1.416 5.168L2 22l4.932-1.391A9.944 9.944 0 0012 22c5.514 0 10-4.486 10-10S17.514 2 12 2zm0 18c-1.71 0-3.306-.45-4.688-1.234l-.336-.2-3.478.98.939-3.39-.222-.347A7.947 7.947 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" /></svg>
                                Quiero el 30% OFF
                            </a>

                            <button onClick={() => { setVisible(false); setDismissed(true) }}
                                className="w-full py-2.5 rounded-xl text-white/40 text-xs hover:text-white/70 transition-colors cursor-pointer bg-transparent border-none"
                            >
                                No me interesa por ahora
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
