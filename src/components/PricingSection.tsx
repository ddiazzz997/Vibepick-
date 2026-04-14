import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../lib/i18n'

interface PricingSectionProps {
    onCTAClick: () => void
}

const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accent)] shrink-0">
        <path d="M20 6 9 17l-5-5" />
    </svg>
)

const CrossIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/20 shrink-0">
        <path d="M18 6 6 18M6 6l12 12" />
    </svg>
)

export default function PricingSection({ onCTAClick }: PricingSectionProps) {
    const { lang } = useLang()
    const isEs = lang === 'es'
    const [annual, setAnnual] = useState(false)

    const discount = annual ? 0.7 : 1
    const proPriceMonthly = 9
    const agencyPriceMonthly = 29
    const proPrice = Math.round(proPriceMonthly * discount)
    const agencyPrice = Math.round(agencyPriceMonthly * discount)

    const plans = [
        {
            id: 'free',
            labelEs: 'Gratis',
            labelEn: 'Free',
            price: 0,
            perEs: 'para siempre',
            perEn: 'forever',
            featured: false,
            borderColor: 'rgba(255,255,255,0.07)',
            ctaStyleClass: 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white',
            ctaTextEs: 'Comenzar gratis',
            ctaTextEn: 'Start free',
            featuresEs: [
                { text: '2 prompts completos', ok: true },
                { text: 'Export ZIP del proyecto', ok: true },
                { text: 'Daniel AI (limitado)', ok: true },
                { text: 'Historial de proyectos', ok: false },
                { text: 'Templates PRO', ok: false },
                { text: 'Multi-cliente', ok: false },
            ],
            featuresEn: [
                { text: '2 complete prompts', ok: true },
                { text: 'Project ZIP export', ok: true },
                { text: 'Daniel AI (limited)', ok: true },
                { text: 'Project history', ok: false },
                { text: 'PRO templates', ok: false },
                { text: 'Multi-client', ok: false },
            ],
        },
        {
            id: 'pro',
            labelEs: 'Pro',
            labelEn: 'Pro',
            price: proPrice,
            perEs: '/mes',
            perEn: '/mo',
            featured: true,
            badgeEs: '⭐ Más popular',
            badgeEn: '⭐ Most popular',
            borderColor: 'rgba(0,102,255,0.5)',
            glowColor: 'rgba(0,102,255,0.15)',
            ctaStyleClass: 'text-white font-bold shadow-[0_4px_20px_rgba(0,102,255,0.4)] hover:shadow-[0_6px_30px_rgba(0,102,255,0.6)] hover:brightness-110',
            ctaStyle: { background: 'linear-gradient(135deg, #0066ff 0%, #0ea5e9 100%)' },
            ctaTextEs: 'Empezar ahora →',
            ctaTextEn: 'Start now →',
            featuresEs: [
                { text: 'Prompts ilimitados', ok: true },
                { text: 'Export ZIP del proyecto', ok: true },
                { text: 'Daniel AI ilimitado', ok: true },
                { text: 'Historial de 10 proyectos', ok: true },
                { text: 'Templates PRO exclusivos', ok: true },
                { text: 'Multi-cliente', ok: false },
            ],
            featuresEn: [
                { text: 'Unlimited prompts', ok: true },
                { text: 'Project ZIP export', ok: true },
                { text: 'Unlimited Daniel AI', ok: true },
                { text: '10-project history', ok: true },
                { text: 'Exclusive PRO templates', ok: true },
                { text: 'Multi-client', ok: false },
            ],
        },
        {
            id: 'agency',
            labelEs: 'Agencia',
            labelEn: 'Agency',
            price: agencyPrice,
            perEs: '/mes',
            perEn: '/mo',
            featured: false,
            borderColor: 'rgba(148,163,184,0.2)',
            ctaStyleClass: 'bg-white/5 border border-white/20 text-white hover:bg-white/10',
            ctaTextEs: 'Escalar mi agencia',
            ctaTextEn: 'Scale my agency',
            featuresEs: [
                { text: 'Todo lo de Pro', ok: true },
                { text: '20 clientes / proyectos', ok: true },
                { text: 'White-label del prompt', ok: true },
                { text: 'Soporte prioritario', ok: true },
                { text: 'Comisión afiliado mejorada', ok: true },
                { text: 'Dashboard multi-cliente', ok: true },
            ],
            featuresEn: [
                { text: 'Everything in Pro', ok: true },
                { text: '20 clients / projects', ok: true },
                { text: 'Prompt white-label', ok: true },
                { text: 'Priority support', ok: true },
                { text: 'Enhanced affiliate commission', ok: true },
                { text: 'Multi-client dashboard', ok: true },
            ],
        },
    ]

    return (
        <section id="precios" className="py-20 px-5 relative overflow-hidden">
            {/* Background glow */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(0,102,255,0.07) 0%, transparent 70%)' }}
            />

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <p className="text-xs uppercase tracking-[0.25em] text-[var(--accent)] font-semibold mb-3">
                        {isEs ? 'Planes y Precios' : 'Plans & Pricing'}
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4">
                        {isEs ? 'Invierte en resultados' : 'Invest in results'}
                    </h2>
                    <p className="text-white/50 text-base max-w-md mx-auto">
                        {isEs
                            ? 'Empieza gratis y escala cuando lo necesites. Sin sorpresas, sin letra chica.'
                            : 'Start free and scale when you need it. No surprises, no fine print.'
                        }
                    </p>
                </motion.div>

                {/* Annual / Monthly toggle */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center justify-center gap-4 mb-10"
                >
                    <span className="text-sm text-white/60">{isEs ? 'Mensual' : 'Monthly'}</span>
                    <button
                        onClick={() => setAnnual(!annual)}
                        className="relative w-12 h-6 rounded-full cursor-pointer border-none transition-colors duration-300"
                        style={{ background: annual ? 'var(--accent)' : 'rgba(255,255,255,0.1)' }}
                    >
                        <motion.span
                            animate={{ left: annual ? '24px' : '2px' }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md block"
                        />
                    </button>
                    <span className="flex items-center gap-2 text-sm">
                        <span className="text-white/60">{isEs ? 'Anual' : 'Annual'}</span>
                        {annual && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="px-2 py-0.5 rounded-full text-[11px] font-bold text-white"
                                style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}
                            >
                                -30%
                            </motion.span>
                        )}
                    </span>
                </motion.div>

                {/* Plans grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: plan.featured ? -8 : 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="relative flex flex-col rounded-3xl overflow-hidden"
                            style={{
                                background: plan.featured
                                    ? 'linear-gradient(160deg, rgba(0,80,200,0.25) 0%, rgba(0,0,0,0.6) 100%)'
                                    : 'linear-gradient(160deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.4) 100%)',
                                border: `1px solid ${plan.borderColor}`,
                                boxShadow: plan.featured ? `0 0 40px ${plan.glowColor || 'transparent'}` : 'none',
                                transform: plan.featured ? 'scale(1.02)' : 'scale(1)',
                            }}
                        >
                            {/* Badge */}
                            {plan.badgeEs && (
                                <div className="absolute -top-0 left-0 right-0 flex justify-center">
                                    <div
                                        className="px-4 py-1 text-xs font-bold text-white rounded-b-xl"
                                        style={{ background: 'linear-gradient(90deg, #0066ff, #0ea5e9)' }}
                                    >
                                        {isEs ? plan.badgeEs : plan.badgeEn}
                                    </div>
                                </div>
                            )}

                            {/* Plan content */}
                            <div className="flex flex-col flex-1 p-6 pt-8">
                                {/* Plan name */}
                                <h3 className="text-lg font-bold text-white mb-1">
                                    {isEs ? plan.labelEs : plan.labelEn}
                                </h3>

                                {/* Price */}
                                <div className="flex items-end gap-1 mb-5">
                                    {plan.price === 0 ? (
                                        <span className="text-4xl font-black text-white">
                                            {isEs ? 'Gratis' : 'Free'}
                                        </span>
                                    ) : (
                                        <>
                                            <span className="text-xl text-white/50 mb-2">$</span>
                                            <motion.span
                                                key={plan.price}
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-4xl font-black text-white"
                                            >
                                                {plan.price}
                                            </motion.span>
                                            <span className="text-white/50 mb-1 text-sm">
                                                {isEs ? plan.perEs : plan.perEn}
                                            </span>
                                        </>
                                    )}
                                </div>

                                {/* Features */}
                                <ul className="flex flex-col gap-3 flex-1 mb-6">
                                    {(isEs ? plan.featuresEs : plan.featuresEn).map((f, j) => (
                                        <li key={j} className="flex items-center gap-2.5 text-sm">
                                            {f.ok ? <CheckIcon /> : <CrossIcon />}
                                            <span className={f.ok ? 'text-white/80' : 'text-white/30 line-through'}>
                                                {f.text}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA */}
                                <motion.button
                                    onClick={onCTAClick}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className={`w-full py-3.5 rounded-2xl text-sm font-bold cursor-pointer border-none transition-all duration-300 ${plan.ctaStyleClass}`}
                                    style={plan.ctaStyle}
                                >
                                    {isEs ? plan.ctaTextEs : plan.ctaTextEn}
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Fine print */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="text-center text-xs text-white/30 mt-8"
                >
                    {isEs
                        ? '✓ Sin tarjeta de crédito requerida · ✓ Cancela cuando quieras · ✓ Soporte en español'
                        : '✓ No credit card required · ✓ Cancel anytime · ✓ Spanish & English support'
                    }
                </motion.p>
            </div>
        </section>
    )
}
