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

    const { message, color } = useMemo(() => {
        if (score <= 40) return {
            message: isEs ? 'Tu sitio está comenzando 🌱' : 'Your site is starting 🌱',
            color: '#ef4444',
        }
        if (score <= 70) return {
            message: isEs ? '¡Buen progreso! 🔥' : 'Great progress! 🔥',
            color: '#f59e0b',
        }
        if (score <= 90) return {
            message: isEs ? 'Casi listo ⚡ — agrega testimonios' : 'Almost ready ⚡ — add testimonials',
            color: '#0ea5e9',
        }
        return {
            message: isEs ? '✅ Sitio completo — ¡Listo para generar!' : '✅ Site complete — Ready to generate!',
            color: '#10b981',
        }
    }, [score, isEs])

    // Bar gradient
    const barGradient = score <= 40
        ? 'linear-gradient(90deg, #ef4444, #f97316)'
        : score <= 70
            ? 'linear-gradient(90deg, #f97316, #f59e0b)'
            : score <= 90
                ? 'linear-gradient(90deg, #0ea5e9, #3b82f6)'
                : 'linear-gradient(90deg, #10b981, #0ea5e9)'

    // Find next incomplete criterion
    const nextCriterion = criteria.find(c => !c.done)

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 rounded-2xl overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.4) 100%)',
                border: '1px solid rgba(255,255,255,0.07)',
            }}
        >
            {/* Header row */}
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-0.5">
                        {isEs ? 'Completitud del sitio' : 'Site completeness'}
                    </p>
                    <p className="text-sm font-medium" style={{ color }}>
                        {message}
                    </p>
                </div>
                <div className="text-right">
                    <motion.span
                        key={score}
                        initial={{ scale: 1.3 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                        className="text-3xl font-black"
                        style={{ color }}
                    >
                        {score}%
                    </motion.span>
                    <p className="text-xs text-white/30 mt-0.5">
                        {completed}/{total} {isEs ? 'campos' : 'fields'}
                    </p>
                </div>
            </div>

            {/* Progress bar */}
            <div className="px-5 pb-3">
                <div className="relative h-2.5 w-full rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                        className="absolute left-0 top-0 h-full rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                        style={{ background: barGradient, boxShadow: `0 0 12px ${color}80` }}
                    />
                </div>
            </div>

            {/* Criteria pills */}
            <div className="flex flex-wrap gap-1.5 px-5 pb-4">
                {criteria.map((c, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all duration-300"
                        style={{
                            background: c.done ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.04)',
                            border: c.done ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255,255,255,0.07)',
                            color: c.done ? '#10b981' : 'rgba(255,255,255,0.4)',
                        }}
                    >
                        <span>{c.done ? '✓' : '○'}</span>
                        {isEs ? c.labelEs : c.labelEn}
                    </motion.div>
                ))}
            </div>

            {/* Next action hint */}
            {nextCriterion && score < 100 && (
                <div
                    className="px-5 py-2.5 border-t text-xs text-white/40 flex items-center gap-2"
                    style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                >
                    <span className="text-[var(--accent)]">→</span>
                    {isEs
                        ? `Completa: ${nextCriterion.labelEs} (+${nextCriterion.points} puntos)`
                        : `Complete: ${nextCriterion.labelEn} (+${nextCriterion.points} pts)`
                    }
                </div>
            )}
        </motion.div>
    )
}
