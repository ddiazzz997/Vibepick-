import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../lib/i18n'

const AVATAR_COLORS = [
    '#0066ff', '#0ea5e9', '#6366f1', '#8b5cf6', '#06b6d4',
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899',
]
const INITIALS = ['A', 'M', 'J', 'C', 'L', 'D', 'P', 'R', 'S', 'E']
const BASE_COUNT = 1_247

function AnimatedCount({ target }: { target: number }) {
    const [display, setDisplay] = useState(target - 40)

    useEffect(() => {
        let current = target - 40
        const step = () => {
            current += 1
            setDisplay(current)
            if (current < target) requestAnimationFrame(step)
        }
        const raf = requestAnimationFrame(step)
        return () => cancelAnimationFrame(raf)
    }, [target])

    return <span>{display.toLocaleString('es-CO')}</span>
}

export default function SocialProofCounter() {
    const { lang } = useLang()
    const isEs = lang === 'es'
    const [count, setCount] = useState(BASE_COUNT)

    // Increment by 1-3 every 8 seconds to simulate live activity
    useEffect(() => {
        const timer = setInterval(() => {
            setCount(c => c + Math.floor(Math.random() * 3) + 1)
        }, 8000)
        return () => clearInterval(timer)
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-2xl mx-auto px-5 pb-4"
        >
            <div
                className="flex flex-col sm:flex-row items-center justify-center gap-3 px-5 py-3.5 rounded-2xl"
                style={{
                    background: 'linear-gradient(135deg, rgba(0,102,255,0.07) 0%, rgba(0,0,0,0.3) 100%)',
                    border: '1px solid rgba(0,102,255,0.2)',
                    backdropFilter: 'blur(10px)',
                }}
            >
                {/* Avatars */}
                <div className="flex items-center">
                    {AVATAR_COLORS.slice(0, 7).map((color, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1 * i, type: 'spring', stiffness: 400 }}
                            className="w-8 h-8 rounded-full border-2 border-[#070a14] flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                            style={{
                                background: `linear-gradient(135deg, ${color} 0%, ${color}99 100%)`,
                                marginLeft: i > 0 ? '-10px' : '0',
                                zIndex: 10 - i,
                            }}
                        >
                            {INITIALS[i]}
                        </motion.div>
                    ))}
                </div>

                {/* Text */}
                <div className="flex items-center gap-2">
                    {/* Live indicator */}
                    <span className="flex items-center gap-1.5">
                        <motion.span
                            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="block w-2 h-2 rounded-full bg-green-400"
                        />
                        <span className="text-[11px] text-green-400 font-semibold uppercase tracking-wider">
                            {isEs ? 'En vivo' : 'Live'}
                        </span>
                    </span>

                    <span className="text-white/30">·</span>

                    <p className="text-sm text-white/80">
                        <span className="font-extrabold text-white text-base">
                            <AnimatedCount target={count} />
                        </span>
                        {' '}
                        {isEs
                            ? 'negocios ya tienen su sitio profesional ⚡'
                            : 'businesses already have their professional site ⚡'
                        }
                    </p>
                </div>
            </div>
        </motion.div>
    )
}
