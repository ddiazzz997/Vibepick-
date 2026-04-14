import { motion } from 'framer-motion'
import { useLang } from '../lib/i18n'

interface CreditsBadgeProps {
    credits: number
    isPro: boolean
}

export default function CreditsBadge({ credits, isPro }: CreditsBadgeProps) {
    const { lang } = useLang()
    const isEs = lang === 'es'

    const isLow = !isPro && credits <= 1
    const color = isPro ? '#10b981' : isLow ? '#ef4444' : '#0066ff'

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{
                background: `${color}12`,
                border: `1px solid ${color}30`,
            }}
        >
            {/* Icon */}
            {isPro ? (
                <span className="text-xs">⚡</span>
            ) : (
                <motion.span
                    animate={isLow ? { scale: [1, 1.2, 1] } : {}}
                    transition={isLow ? { duration: 1, repeat: Infinity } : {}}
                    className="text-xs"
                >
                    🎫
                </motion.span>
            )}

            {/* Text */}
            <span className="text-xs font-bold" style={{ color }}>
                {isPro
                    ? (isEs ? 'PRO ∞' : 'PRO ∞')
                    : `${credits} ${isEs ? 'créditos' : 'credits'}`
                }
            </span>
        </motion.div>
    )
}
