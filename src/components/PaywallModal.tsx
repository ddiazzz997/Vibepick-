import { motion } from 'framer-motion'
import { useLang } from '../lib/i18n'

interface PaywallModalProps {
    show: boolean
}

export default function PaywallModal({ show }: PaywallModalProps) {
    const { t } = useLang()

    if (!show) return null

    return (
        <motion.div
            className="fixed inset-0 z-[300] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            {/* Blurred backdrop — no click to close */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" />

            {/* Card */}
            <motion.div
                className="relative z-10 w-full max-w-sm mx-4"
                initial={{ scale: 0.85, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.1 }}
            >
                {/* Animated rainbow border */}
                <div className="relative rounded-2xl p-[2px] overflow-hidden">
                    <motion.div
                        className="absolute inset-0"
                        style={{
                            background: 'conic-gradient(from 0deg, #0066ff, #06b6d4, #3b82f6, #8b5cf6, #0066ff)',
                            backgroundSize: '200% 200%',
                        }}
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    />

                    {/* Inner card */}
                    <div className="relative rounded-2xl p-8 text-center"
                        style={{
                            background: 'linear-gradient(180deg, rgba(5, 10, 25, 0.99) 0%, rgba(0, 0, 0, 0.99) 100%)',
                        }}
                    >
                        {/* Sparkle */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-xs text-[var(--text-muted)] mb-4"
                        >
                            ✨ {t.paywallHint}
                        </motion.p>

                        {/* Title */}
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-2xl sm:text-3xl font-extrabold text-white mb-2"
                        >
                            {t.paywallTitle}
                        </motion.h2>

                        {/* Price */}
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }} className="mb-5">
                            <span className="text-5xl font-black text-white">$9</span>
                            <span className="text-base text-[var(--text-muted)]"> /mes</span>
                            <p className="text-xs text-white/30 mt-1">Prompts ilimitados · Cancela cuando quieras</p>
                        </motion.div>

                        {/* Value items */}
                        <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
                            className="text-left space-y-1.5 mb-6 text-xs text-white/60">
                            {['✅ Prompts ilimitados', '✅ Todas las secciones desbloqueadas', '✅ Exportación de proyecto completa', '✅ Soporte directo por WhatsApp'].map(item => (<li key={item}>{item}</li>
                            ))}
                        </motion.ul>

                        {/* CTA button */}
                        <motion.a
                            href="https://api.whatsapp.com/send?phone=573233194440&text=Hola%20Daniel%2C%20quiero%20suscribirme%20a%20Vibepick%20Pro%20por%20%247%2Fmes.%20%C2%BFC%C3%B3mo%20procedo%3F"
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="relative block w-full py-4 rounded-xl bg-[var(--accent)] text-white font-bold text-sm
                cursor-pointer border-none no-underline text-center
                shadow-[0_4px_30px_rgba(0,102,255,0.4)] hover:shadow-[0_6px_40px_rgba(0,102,255,0.6)]
                transition-shadow duration-300 overflow-hidden"
                        >
                            {/* Pulsing glow */}
                            <motion.div
                                className="absolute inset-0 rounded-xl"
                                animate={{
                                    boxShadow: [
                                        '0 0 10px rgba(0,102,255,0.3)',
                                        '0 0 30px rgba(0,102,255,0.5)',
                                        '0 0 10px rgba(0,102,255,0.3)',
                                    ],
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            {/* Light sweep */}
                            <motion.div
                                className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                                animate={{ left: ['-100%', '200%'] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                            />
                            <span className="relative z-10">🚀 {t.paywallCTA}</span>
                        </motion.a>

                        {/* WhatsApp secondary */}
                        <motion.a
                            href="https://api.whatsapp.com/send?phone=573233194440&text=Hola%2C%20tengo%20preguntas%20sobre%20Vibepick%20Pro."
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9 }}
                            className="inline-block mt-4 text-xs text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors no-underline"
                        >
                            {t.paywallWhatsApp}
                        </motion.a>

                        {/* Micro-copy */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="text-[10px] text-[var(--text-dim)] mt-3 opacity-60"
                        >
                            {t.paywallCancel}
                        </motion.p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}
