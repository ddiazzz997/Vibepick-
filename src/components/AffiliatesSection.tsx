import { motion } from 'framer-motion'
import { useLang } from '../lib/i18n'

interface AffiliatesSectionProps {
    onCTAClick: () => void
}

const tiers = [
    {
        emoji: '🤝',
        nameEs: 'Afiliado',
        nameEn: 'Affiliate',
        condition: '1–10 referidos/mes',
        commission: '20%',
        commissionLabel: 'recurrente',
        color: '#60a5fa',
        glow: 'rgba(96,165,250,0.15)',
    },
    {
        emoji: '🥈',
        nameEs: 'Silver',
        nameEn: 'Silver',
        condition: '11–50 referidos/mes',
        commission: '30%',
        commissionLabel: 'recurrente',
        color: '#e2e8f0',
        glow: 'rgba(226,232,240,0.12)',
        featured: true,
    },
    {
        emoji: '🏆',
        nameEs: 'Gold Closer',
        nameEn: 'Gold Closer',
        condition: '51+ referidos/mes',
        commission: '40%',
        commissionLabel: '+ bonos',
        color: '#fbbf24',
        glow: 'rgba(251,191,36,0.15)',
    },
]

const benefits = [
    { icon: '💸', textEs: 'Comisión recurrente mensual mientras el cliente siga pagando', textEn: 'Monthly recurring commission while the client keeps paying' },
    { icon: '🎯', textEs: 'Materiales de venta listos: video demo, scripts de WhatsApp, landing page', textEn: 'Ready-made sales materials: demo video, WhatsApp scripts, landing page' },
    { icon: '📊', textEs: 'Dashboard de seguimiento de tus referidos en tiempo real', textEn: 'Real-time referral tracking dashboard' },
    { icon: '🚀', textEs: 'Sin cap de ingresos — a más cierres, más ganas', textEn: 'No income cap — the more you close, the more you earn' },
]

export default function AffiliatesSection({ onCTAClick }: AffiliatesSectionProps) {
    const { lang } = useLang()
    const isEs = lang === 'es'

    return (
        <section id="afiliados" className="py-20 px-5 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(251,191,36,0.04) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(0,102,255,0.06) 0%, transparent 60%)' }}
            />

            <div className="max-w-5xl mx-auto relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-14"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
                        style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)' }}>
                        <span className="text-sm">💰</span>
                        <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">
                            {isEs ? 'Programa de Afiliados' : 'Affiliate Program'}
                        </span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4">
                        {isEs ? 'Gana dinero refiriendo clientes' : 'Earn money by referring clients'}
                    </h2>
                    <p className="text-white/50 text-base max-w-lg mx-auto">
                        {isEs
                            ? 'Conviértete en un Closer Digital de Vibepick. Gana comisión recurrente cada mes sin límite de ingresos.'
                            : 'Become a Vibepick Digital Closer. Earn recurring monthly commissions with no income cap.'
                        }
                    </p>
                </motion.div>

                {/* Commission tiers */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-14">
                    {tiers.map((tier, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="relative text-center rounded-2xl p-6"
                            style={{
                                background: tier.featured
                                    ? 'linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0.5) 100%)'
                                    : 'linear-gradient(160deg, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0.4) 100%)',
                                border: `1px solid ${tier.glow.replace('0.15', '0.3').replace('0.12', '0.25')}`,
                                boxShadow: tier.featured ? `0 0 30px ${tier.glow}` : 'none',
                                transform: tier.featured ? 'scale(1.03)' : 'scale(1)',
                            }}
                        >
                            <div className="text-4xl mb-3">{tier.emoji}</div>
                            <h3 className="text-lg font-bold mb-1" style={{ color: tier.color }}>
                                {isEs ? tier.nameEs : tier.nameEn}
                            </h3>
                            <p className="text-xs text-white/40 mb-4">{tier.condition}</p>
                            <div className="text-4xl font-black mb-1" style={{ color: tier.color }}>
                                {tier.commission}
                            </div>
                            <p className="text-xs font-semibold text-white/60">{tier.commissionLabel}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Benefits grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                    {benefits.map((b, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            className="flex items-start gap-4 p-4 rounded-2xl"
                            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
                        >
                            <span className="text-2xl shrink-0">{b.icon}</span>
                            <p className="text-sm text-white/65 leading-relaxed">
                                {isEs ? b.textEs : b.textEn}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* CTA block */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-center"
                >
                    <motion.button
                        onClick={onCTAClick}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.96 }}
                        className="relative overflow-hidden inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-base text-white cursor-pointer border-none transition-all duration-300"
                        style={{
                            background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%)',
                            boxShadow: '0 4px 25px rgba(251,191,36,0.35)',
                        }}
                    >
                        <motion.div
                            className="absolute top-0 bottom-0 w-1/2 bg-white/20 skew-x-12"
                            animate={{ left: ['-100%', '200%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
                        />
                        <span className="relative z-10 flex items-center gap-2">
                            💰 {isEs ? 'Quiero ser Closer Digital →' : 'I want to be a Digital Closer →'}
                        </span>
                    </motion.button>

                    <p className="text-xs text-white/30 mt-4">
                        {isEs
                            ? 'Escríbenos por WhatsApp y te enviamos el kit completo de afiliados'
                            : 'Message us on WhatsApp and we\'ll send you the complete affiliate kit'
                        }
                    </p>

                    <motion.a
                        href="https://api.whatsapp.com/send?phone=573233194440&text=Hola%20Daniel%2C%20quiero%20unirme%20al%20programa%20de%20afiliados%20de%20Vibepick%20%F0%9F%92%B0"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-green-400 hover:text-green-300 transition-colors no-underline"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                            <path d="M12 2C6.486 2 2 6.486 2 12c0 1.89.518 3.656 1.416 5.168L2 22l4.932-1.391A9.944 9.944 0 0012 22c5.514 0 10-4.486 10-10S17.514 2 12 2zm0 18c-1.71 0-3.306-.45-4.688-1.234l-.336-.2-3.478.98.939-3.39-.222-.347A7.947 7.947 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                        </svg>
                        {isEs ? 'Contactar por WhatsApp' : 'Contact via WhatsApp'}
                    </motion.a>
                </motion.div>
            </div>
        </section>
    )
}
