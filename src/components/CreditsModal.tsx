import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../lib/i18n'

interface CreditsModalProps {
    show: boolean
    credits: number
    onClose?: () => void
    onUpgrade: () => void
}

const FeatureRow = ({ text }: { text: string }) => (
    <li className="flex items-center gap-2.5 text-sm text-white/75">
        <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold"
            style={{ background: 'rgba(0,102,255,0.2)', color: '#60a5fa' }}>✓</span>
        {text}
    </li>
)

export default function CreditsModal({ show, credits, onClose, onUpgrade }: CreditsModalProps) {
    const { lang } = useLang()
    const isEs = lang === 'es'

    const proFeatures = isEs
        ? ['Prompts ilimitados', 'Daniel AI sin límite', 'Historial de proyectos', 'Templates PRO exclusivos', 'Exportación ZIP completa']
        : ['Unlimited prompts', 'Unlimited Daniel AI', 'Project history', 'Exclusive PRO templates', 'Full ZIP export']

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="fixed inset-0 z-[400] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/70 backdrop-blur-xl"
                        onClick={onClose}
                    />

                    {/* Card */}
                    <motion.div
                        className="relative z-10 w-full max-w-sm"
                        initial={{ scale: 0.88, opacity: 0, y: 24 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.88, opacity: 0, y: 24 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                    >
                        {/* Animated gradient border */}
                        <div className="relative rounded-3xl p-[2px] overflow-hidden">
                            <motion.div
                                className="absolute inset-0"
                                style={{ background: 'conic-gradient(from 0deg, #0066ff, #06b6d4, #3b82f6, #8b5cf6, #0066ff)' }}
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                            />

                            <div
                                className="relative rounded-3xl overflow-hidden"
                                style={{ background: 'linear-gradient(160deg, #060c1e 0%, #020408 100%)' }}
                            >
                                {/* Top accent line */}
                                <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, transparent, #0066ff, #0ea5e9, transparent)' }} />

                                <div className="p-7 text-center">

                                    {/* Emoji + status */}
                                    <motion.div
                                        animate={{ rotate: [-5, 5, -5, 0], scale: [1, 1.1, 1] }}
                                        transition={{ duration: 0.6, delay: 0.2 }}
                                        className="text-5xl mb-4 block"
                                    >
                                        {credits === 0 ? '⚡' : '🚀'}
                                    </motion.div>

                                    {/* Credit badge */}
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
                                        style={{ background: 'rgba(0,102,255,0.12)', border: '1px solid rgba(0,102,255,0.25)' }}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#0066ff] animate-pulse" />
                                        <span className="text-xs font-semibold text-[#60a5fa]">
                                            {credits === 0
                                                ? (isEs ? 'Sin créditos disponibles' : 'No credits left')
                                                : `${credits} ${isEs ? 'créditos restantes' : 'credits remaining'}`
                                            }
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h2 className="text-2xl font-extrabold text-white mb-2">
                                        {credits === 0
                                            ? (isEs ? 'Tus créditos se agotaron' : 'Your credits ran out')
                                            : (isEs ? 'Desbloquea el potencial total' : 'Unlock full potential')
                                        }
                                    </h2>
                                    <p className="text-sm text-white/50 mb-6">
                                        {credits === 0
                                            ? (isEs ? 'Actualiza a Pro para seguir creando sin límites' : 'Upgrade to Pro to keep creating without limits')
                                            : (isEs ? 'Pro te da acceso ilimitado a todo Vibepick' : 'Pro gives you unlimited access to all of Vibepick')
                                        }
                                    </p>

                                    {/* Price */}
                                    <div className="mb-6">
                                        <div className="flex items-end justify-center gap-1 mb-1">
                                            <span className="text-white/40 text-lg mb-1">$</span>
                                            <span className="text-5xl font-black text-white">9</span>
                                            <span className="text-white/40 text-sm mb-1.5">{isEs ? '/mes' : '/mo'}</span>
                                        </div>
                                        <p className="text-xs text-white/30">
                                            {isEs ? '≈ menos que un café al día ☕' : '≈ less than a coffee a day ☕'}
                                        </p>
                                    </div>

                                    {/* Features */}
                                    <ul className="text-left space-y-2.5 mb-7 px-2">
                                        {proFeatures.map((f, i) => <FeatureRow key={i} text={f} />)}
                                    </ul>

                                    {/* CTA */}
                                    <motion.a
                                        href="https://api.whatsapp.com/send?phone=573233194440&text=Hola%20Daniel%2C%20quiero%20suscribirme%20a%20Vibepick%20Pro%20por%20%249%2Fmes.%20%C2%BFC%C3%B3mo%20procedo%3F"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={onUpgrade}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="relative block w-full py-4 rounded-2xl text-white font-bold text-sm no-underline text-center cursor-pointer overflow-hidden transition-all duration-300"
                                        style={{
                                            background: 'linear-gradient(135deg, #0052cc 0%, #0ea5e9 100%)',
                                            boxShadow: '0 4px 25px rgba(0,102,255,0.4)',
                                        }}
                                    >
                                        <motion.div
                                            className="absolute top-0 bottom-0 w-2/3 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12"
                                            animate={{ left: ['-100%', '200%'] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
                                        />
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            🚀 {isEs ? 'Activar Vibepick Pro ahora' : 'Activate Vibepick Pro now'}
                                        </span>
                                    </motion.a>

                                    {/* Dismiss */}
                                    {onClose && (
                                        <button
                                            onClick={onClose}
                                            className="mt-4 text-xs text-white/25 hover:text-white/50 transition-colors cursor-pointer bg-transparent border-none"
                                        >
                                            {isEs ? 'Ahora no' : 'Not now'}
                                        </button>
                                    )}

                                    {/* Trust line */}
                                    <p className="text-[10px] text-white/20 mt-3">
                                        {isEs ? '✓ Sin tarjeta de crédito · ✓ Cancela cuando quieras' : '✓ No credit card · ✓ Cancel anytime'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
