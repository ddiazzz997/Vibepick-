import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../lib/i18n'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

interface AffiliatesSectionProps {
    onCTAClick: () => void
}

interface AffiliateRow {
    referral_code: string
    referred_count: number
    earnings: number
}

const benefits = [
    {
        title: 'Ingresos que no se detienen',
        titleEn: 'Income that never stops',
        desc: 'Cada mes que tu referido pague, tú ganas. Sin trabajo extra. Literalmente en piloto automático.',
        descEn: 'Every month your referral pays, you earn. No extra work. Literally on autopilot.',
    },
    {
        title: 'Un referido. Ganancias para siempre.',
        titleEn: 'One referral. Earnings forever.',
        desc: 'No es un bono único. Es una renta mensual que crece con cada persona que recomiendas.',
        descEn: "Not a one-time bonus. It's monthly recurring income that grows with every referral.",
    },
    {
        title: 'Vibepick se vende solo',
        titleEn: 'Vibepick sells itself',
        desc: 'Te damos el script, el video y la landing. Tú solo mandas el link. Nosotros cerramos.',
        descEn: 'We give you the script, video, and landing. You send the link. We close.',
    },
    {
        title: 'Sin techo. Tú pones el límite.',
        titleEn: 'No ceiling. You set the limit.',
        desc: '¿10 referidos? Bien. ¿50? Mucho mejor. No hay límite de ingresos, no hay jefe.',
        descEn: '10 referrals? Good. 50? Even better. No income cap, no boss.',
    },
]

export default function AffiliatesSection({ onCTAClick }: AffiliatesSectionProps) {
    const { lang } = useLang()
    const isEs = lang === 'es'
    const { user } = useAuth()

    const [affiliate, setAffiliate] = useState<AffiliateRow | null>(null)
    const [loadingAffiliate, setLoadingAffiliate] = useState(false)
    const [copied, setCopied] = useState(false)

    const referralLink = affiliate
        ? `https://vibepick.com/ref/${affiliate.referral_code}`
        : ''

    const handleCopy = useCallback(async () => {
        if (!referralLink) return
        await navigator.clipboard.writeText(referralLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }, [referralLink])

    useEffect(() => {
        if (!user) return
        const fetchOrCreateAffiliate = async () => {
            setLoadingAffiliate(true)
            const { data: existing } = await supabase
                .from('affiliates')
                .select('referral_code, referred_count, earnings')
                .eq('user_id', user.id)
                .single()
            if (existing) {
                setAffiliate(existing as AffiliateRow)
            } else {
                const referral_code = user.id.replace(/-/g, '').slice(0, 8)
                const { data: created } = await supabase
                    .from('affiliates')
                    .insert({ user_id: user.id, referral_code, referred_count: 0, earnings: 0 })
                    .select('referral_code, referred_count, earnings')
                    .single()
                if (created) setAffiliate(created as AffiliateRow)
            }
            setLoadingAffiliate(false)
        }
        fetchOrCreateAffiliate()
    }, [user])

    return (
        <section id="afiliados" className="py-28 px-5 relative overflow-hidden">
            {/* Soft radial glow — barely visible, no color overwhelm */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.03) 0%, transparent 70%)' }}
            />

            <div className="max-w-2xl mx-auto relative z-10">

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center mb-6"
                >
                    <div
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                        <span className="text-xs">💰</span>
                        <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">
                            {isEs ? 'Programa de Afiliados' : 'Affiliate Program'}
                        </span>
                    </div>
                </motion.div>

                {/* Headline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.05 }}
                    className="text-center mb-14"
                >
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
                        {isEs
                            ? <>Gana dinero<br /><span style={{ color: '#a3e635' }}>sin vender.</span></>
                            : <>Earn money<br /><span style={{ color: '#a3e635' }}>without selling.</span></>
                        }
                    </h2>
                    <p className="text-white/40 text-base max-w-sm mx-auto leading-relaxed">
                        {isEs
                            ? 'Recomienda Vibepick. Gana el 20% cada mes que tu referido pague. Para siempre.'
                            : 'Recommend Vibepick. Earn 20% every month your referral pays. Forever.'}
                    </p>
                </motion.div>

                {/* Commission hero — elegant, minimal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="relative rounded-3xl mb-14 overflow-hidden"
                    style={{
                        background: 'linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.6) 100%)',
                        border: '1px solid rgba(255,255,255,0.08)',
                    }}
                >
                    {/* Top accent line */}
                    <motion.div
                        className="absolute top-0 left-0 right-0 h-px"
                        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(163,230,53,0.5) 50%, transparent 100%)' }}
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    />

                    <div className="py-14 px-8 text-center">
                        <p className="text-xs font-semibold text-white/30 uppercase tracking-[0.2em] mb-4">
                            {isEs ? 'Tu comisión recurrente' : 'Your recurring commission'}
                        </p>

                        {/* The number */}
                        <div className="flex items-center justify-center gap-2 mb-5">
                            <motion.span
                                className="text-[7rem] sm:text-[9rem] font-black leading-none"
                                style={{ color: '#a3e635', lineHeight: 1 }}
                                animate={{ opacity: [0.9, 1, 0.9] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                20%
                            </motion.span>
                        </div>

                        {/* Supporting stats */}
                        <div className="flex items-center justify-center gap-6 text-sm text-white/35">
                            <span>recurrente</span>
                            <span className="w-px h-3 bg-white/15" />
                            <span>cada mes</span>
                            <span className="w-px h-3 bg-white/15" />
                            <span>por siempre</span>
                        </div>

                    </div>
                </motion.div>

                {/* Benefits — clean vertical list, emotionally driven */}
                <div className="space-y-5 mb-14">
                    {benefits.map((b, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -12 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: i * 0.08 }}
                            className="flex gap-4 items-start"
                        >
                            {/* Left accent line */}
                            <div className="shrink-0 mt-1 w-0.5 h-10 rounded-full"
                                style={{ background: 'linear-gradient(to bottom, rgba(163,230,53,0.6), transparent)' }} />
                            <div>
                                <p className="text-white font-semibold text-base leading-snug mb-1">
                                    {isEs ? b.title : b.titleEn}
                                </p>
                                <p className="text-white/40 text-sm leading-relaxed">
                                    {isEs ? b.desc : b.descEn}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Affiliate dashboard (logged-in) */}
                {user && (
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-12 rounded-2xl p-6"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                        <h3 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">
                            {isEs ? 'Tu panel de afiliado' : 'Your affiliate dashboard'}
                        </h3>

                        {loadingAffiliate ? (
                            <p className="text-white/30 text-sm">{isEs ? 'Cargando…' : 'Loading…'}</p>
                        ) : affiliate ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-xl p-4 text-center"
                                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                        <p className="text-3xl font-black text-white">{affiliate.referred_count}</p>
                                        <p className="text-xs text-white/30 mt-1">{isEs ? 'Referidos' : 'Referrals'}</p>
                                    </div>
                                    <div className="rounded-xl p-4 text-center"
                                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                        <p className="text-3xl font-black" style={{ color: '#a3e635' }}>${affiliate.earnings.toFixed(2)}</p>
                                        <p className="text-xs text-white/30 mt-1">{isEs ? 'Ganancias' : 'Earnings'}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-white/30 mb-2">{isEs ? 'Tu link único' : 'Your unique link'}</p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 rounded-xl px-4 py-3 text-sm text-white/50 font-mono truncate"
                                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                            {referralLink}
                                        </div>
                                        <motion.button
                                            onClick={handleCopy}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="shrink-0 px-4 py-3 rounded-xl text-sm font-semibold cursor-pointer border-none"
                                            style={{
                                                background: copied ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.06)',
                                                border: `1px solid ${copied ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.1)'}`,
                                                color: copied ? '#4ade80' : 'rgba(255,255,255,0.6)',
                                            }}
                                        >
                                            {copied ? (isEs ? '✓ Copiado' : '✓ Copied') : (isEs ? 'Copiar' : 'Copy')}
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-white/30 text-sm">
                                {isEs ? 'No se pudo cargar tu panel.' : 'Could not load your panel.'}
                            </p>
                        )}
                    </motion.div>
                )}

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-center"
                >
                    <motion.button
                        onClick={onCTAClick}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        className="relative overflow-hidden inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-base cursor-pointer border-none"
                        style={{
                            background: '#a3e635',
                            color: '#000',
                            boxShadow: '0 4px 32px rgba(163,230,53,0.25)',
                        }}
                    >
                        <motion.div
                            className="absolute top-0 bottom-0 w-1/2 bg-white/20 skew-x-12"
                            animate={{ left: ['-100%', '200%'] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
                        />
                        <span className="relative z-10">
                            {isEs ? 'Quiero empezar a ganar →' : 'I want to start earning →'}
                        </span>
                    </motion.button>

                    <p className="text-xs text-white/25 mt-4 mb-3">
                        {isEs
                            ? 'Escríbenos por WhatsApp y te enviamos el kit completo de afiliados'
                            : "Message us on WhatsApp and we'll send you the complete affiliate kit"}
                    </p>

                    <motion.a
                        href="https://api.whatsapp.com/send?phone=573233194440&text=Hola%20Daniel%2C%20quiero%20unirme%20al%20programa%20de%20afiliados%20de%20Vibepick%20%F0%9F%92%B0"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.04 }}
                        className="inline-flex items-center gap-2 text-sm font-medium text-green-400 hover:text-green-300 transition-colors no-underline"
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
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
