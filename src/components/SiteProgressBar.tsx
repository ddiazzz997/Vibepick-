import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../lib/i18n'

interface SiteProgressBarProps {
    desc: string
    niche: string
    vibe: string | null
    sections: string[]
    cta: string
    whatsappNumber: string
    logoDataUrl: string
    assetUrl: string
    testimonialText: string
}

interface CriterionItem {
    labelEs: string
    labelEn: string
    done: boolean
    points: number
}

export default function SiteProgressBar({
    desc,
    niche,
    vibe,
    sections,
    cta,
    whatsappNumber,
    logoDataUrl,
    assetUrl,
    testimonialText,
}: SiteProgressBarProps) {
    const { lang } = useLang()
    const isEs = lang === 'es'

    const criteria: CriterionItem[] = useMemo(() => [
        { labelEs: 'Descripción del negocio', labelEn: 'Business description', done: desc.trim().length > 10, points: 20 },
        { labelEs: 'Nicho seleccionado', labelEn: 'Niche selected', done: !!niche, points: 15 },
        { labelEs: 'Estilo visual', labelEn: 'Visual style', done: !!vibe, points: 15 },
        { labelEs: 'Secciones del sitio', labelEn: 'Site sections', done: sections.length >= 4, points: 10 },
        { labelEs: 'Call to Action', labelEn: 'Call to Action', done: cta.trim().length > 2, points: 10 },
        { labelEs: 'WhatsApp de contacto', labelEn: 'WhatsApp contact', done: whatsappNumber.length > 5, points: 10 },
        { labelEs: 'Logo subido', labelEn: 'Logo uploaded', done: !!logoDataUrl, points: 10 },
        { labelEs: 'Imagen del negocio', labelEn: 'Business image', done: !!assetUrl, points: 5 },
        { labelEs: 'Testimonios', labelEn: 'Testimonials', done: testimonialText.trim().length > 5, points: 5 },
    ], [desc, niche, vibe, sections, cta, whatsappNumber, logoDataUrl, assetUrl, testimonialText])

    const score = useMemo(() =>
        criteria.filter(c => c.done).reduce((sum, c) => sum + c.points, 0),
        [criteria]
    )

    const completed = criteria.filter(c => c.done).length
    const total = criteria.length

    const { message, emoji } = useMemo(() => {
        if (score <= 40) return {
            message: isEs ? 'Tu sitio está comenzando' : 'Your site is starting',
            emoji: '🌱',
        }
        if (score <= 70) return {
            message: isEs ? '¡Buen progreso!' : 'Great progress!',
            emoji: '🔥',
        }
        if (score <= 90) return {
            message: isEs ? 'Casi listo — agrega testimonios' : 'Almost ready — add testimonials',
            emoji: '⚡',
        }
        return {
            message: isEs ? 'Sitio completo — ¡Listo para generar!' : 'Site complete — Ready to generate!',
            emoji: '✅',
        }
    }, [score, isEs])

    // Always use blue palette gradients
    const barGradient = score <= 40
        ? 'linear-gradient(90deg, #0066ff, #3b82f6)'
        : score <= 70
            ? 'linear-gradient(90deg, #0066ff, #0ea5e9)'
            : score <= 90
                ? 'linear-gradient(90deg, #0ea5e9, #38bdf8)'
                : 'linear-gradient(90deg, #0066ff, #0ea5e9, #38bdf8)'

    const accentColor = '#0066ff'
    const accentLight = '#60a5fa'

    // Find next incomplete criterion
    const nextCriterion = criteria.find(c => !c.done)

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 rounded-2xl overflow-hidden relative"
            style={{
                background: 'linear-gradient(145deg, rgba(0,102,255,0.06) 0%, rgba(2,2,20,0.7) 40%, rgba(0,102,255,0.03) 100%)',
                border: '1px solid rgba(0,102,255,0.18)',
                boxShadow: '0 0 40px rgba(0,102,255,0.06), 0 20px 60px rgba(0,0,0,0.4)',
            }}
        >
            {/* Subtle animated corner glow */}
            <div
                style={{
                    position: 'absolute',
                    top: -40,
                    right: -40,
                    width: 180,
                    height: 180,
                    background: 'radial-gradient(circle, rgba(0,102,255,0.12) 0%, transparent 70%)',
                    pointerEvents: 'none',
                    zIndex: 0,
                }}
            />

            {/* Header row */}
            <div className="flex items-center justify-between px-6 pt-5 pb-2 relative z-10">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-1"
                        style={{ color: accentLight }}
                    >
                        {isEs ? 'Completitud del sitio' : 'Site completeness'}
                    </p>
                    <div className="flex items-center gap-2">
                        <motion.span
                            animate={{ scale: [1, 1.15, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            className="text-lg"
                        >
                            {emoji}
                        </motion.span>
                        <p className="text-base font-semibold text-white/80">
                            {message}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <motion.span
                        key={score}
                        initial={{ scale: 1.4 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                        className="text-4xl font-black"
                        style={{
                            background: `linear-gradient(135deg, ${accentColor}, ${accentLight})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            filter: 'drop-shadow(0 0 12px rgba(0,102,255,0.4))',
                        }}
                    >
                        {score}%
                    </motion.span>
                    <p className="text-xs font-medium mt-0.5" style={{ color: 'rgba(96,165,250,0.6)' }}>
                        {completed}/{total} {isEs ? 'campos' : 'fields'}
                    </p>
                </div>
            </div>

            {/* Progress bar */}
            <div className="px-6 pb-4 pt-1 relative z-10">
                <div className="relative h-3 w-full rounded-full overflow-hidden"
                    style={{ background: 'rgba(0,102,255,0.08)', border: '1px solid rgba(0,102,255,0.1)' }}
                >
                    <motion.div
                        className="absolute left-0 top-0 h-full rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                        style={{
                            background: barGradient,
                            boxShadow: `0 0 16px rgba(0,102,255,0.5), 0 0 4px rgba(0,102,255,0.8)`,
                        }}
                    />
                    {/* Shimmer overlay on bar */}
                    <motion.div
                        className="absolute top-0 h-full w-1/3 rounded-full"
                        style={{
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                        }}
                        animate={{ left: ['-33%', '133%'] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                    />
                </div>
            </div>

            {/* Criteria pills */}
            <div className="flex flex-wrap gap-2 px-6 pb-5 relative z-10">
                {criteria.map((c, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.04 }}
                        whileHover={{ scale: 1.05, y: -1 }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300"
                        style={{
                            background: c.done
                                ? 'linear-gradient(135deg, rgba(0,102,255,0.12), rgba(14,165,233,0.08))'
                                : 'rgba(255,255,255,0.03)',
                            border: c.done
                                ? '1px solid rgba(0,102,255,0.35)'
                                : '1px solid rgba(255,255,255,0.06)',
                            color: c.done ? '#60a5fa' : 'rgba(255,255,255,0.3)',
                            boxShadow: c.done ? '0 0 12px rgba(0,102,255,0.1)' : 'none',
                        }}
                    >
                        <span style={{
                            color: c.done ? '#0ea5e9' : 'rgba(255,255,255,0.2)',
                            fontWeight: 700,
                        }}>
                            {c.done ? '✓' : '○'}
                        </span>
                        {isEs ? c.labelEs : c.labelEn}
                    </motion.div>
                ))}
            </div>

            {/* Next action hint */}
            {nextCriterion && score < 100 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="px-6 py-3 flex items-center gap-2.5 relative z-10"
                    style={{
                        borderTop: '1px solid rgba(0,102,255,0.1)',
                        background: 'linear-gradient(90deg, rgba(0,102,255,0.04), transparent)',
                    }}
                >
                    <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="text-sm"
                        style={{ color: accentColor }}
                    >
                        →
                    </motion.span>
                    <span className="text-xs font-medium" style={{ color: 'rgba(96,165,250,0.7)' }}>
                        {isEs
                            ? `Completa: ${nextCriterion.labelEs}`
                            : `Complete: ${nextCriterion.labelEn}`
                        }
                    </span>
                    <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto"
                        style={{
                            background: 'rgba(0,102,255,0.12)',
                            color: accentLight,
                            border: '1px solid rgba(0,102,255,0.2)',
                        }}
                    >
                        +{nextCriterion.points} pts
                    </span>
                </motion.div>
            )}
        </motion.div>
    )
}
