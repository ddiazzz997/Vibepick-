import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../lib/i18n'

interface Badge {
    id: string
    emoji: string
    nameEs: string
    nameEn: string
    descEs: string
    descEn: string
    color: string
}

const ALL_BADGES: Badge[] = [
    { id: 'first_site', emoji: '🚀', nameEs: 'Primer Sitio', nameEn: 'First Site', descEs: 'Generaste tu primer prompt', descEn: 'Generated your first prompt', color: '#0066ff' },
    { id: 'complete_profile', emoji: '⭐', nameEs: 'Perfil Completo', nameEn: 'Complete Profile', descEs: 'Completaste tu sitio al 100%', descEn: 'Your site reached 100%', color: '#fbbf24' },
    { id: 'power_user', emoji: '⚡', nameEs: 'Power User', nameEn: 'Power User', descEs: '3+ prompts generados', descEn: '3+ prompts generated', color: '#8b5cf6' },
    { id: 'social_master', emoji: '🌐', nameEs: 'Social Master', nameEn: 'Social Master', descEs: 'Agregaste 3+ redes sociales', descEn: 'Added 3+ social networks', color: '#10b981' },
    { id: 'branding_pro', emoji: '🎨', nameEs: 'Branding Pro', nameEn: 'Branding Pro', descEs: 'Subiste logo + imagen del negocio', descEn: 'Uploaded logo + business image', color: '#ec4899' },
    { id: 'testimonial_king', emoji: '👑', nameEs: 'Rey de Testimonios', nameEn: 'Testimonial King', descEs: 'Agregaste 3+ testimonios', descEn: 'Added 3+ testimonials', color: '#f59e0b' },
]

const LS_BADGES_KEY = 'vp_badges'

function loadBadges(): string[] {
    try {
        const raw = localStorage.getItem(LS_BADGES_KEY)
        return raw ? JSON.parse(raw) : []
    } catch { return [] }
}

function saveBadge(id: string) {
    const current = loadBadges()
    if (!current.includes(id)) {
        current.push(id)
        localStorage.setItem(LS_BADGES_KEY, JSON.stringify(current))
    }
}

export function checkAndUnlockBadges(ctx: {
    promptCount: number
    siteScore: number
    socialCount: number
    hasLogo: boolean
    hasAsset: boolean
    testimonialCount: number
}): string | null {
    const earned = loadBadges()

    if (ctx.promptCount >= 1 && !earned.includes('first_site')) {
        saveBadge('first_site')
        return 'first_site'
    }
    if (ctx.siteScore >= 100 && !earned.includes('complete_profile')) {
        saveBadge('complete_profile')
        return 'complete_profile'
    }
    if (ctx.promptCount >= 3 && !earned.includes('power_user')) {
        saveBadge('power_user')
        return 'power_user'
    }
    if (ctx.socialCount >= 3 && !earned.includes('social_master')) {
        saveBadge('social_master')
        return 'social_master'
    }
    if (ctx.hasLogo && ctx.hasAsset && !earned.includes('branding_pro')) {
        saveBadge('branding_pro')
        return 'branding_pro'
    }
    if (ctx.testimonialCount >= 3 && !earned.includes('testimonial_king')) {
        saveBadge('testimonial_king')
        return 'testimonial_king'
    }
    return null
}

interface BadgesDisplayProps {
    promptCount: number
    siteScore: number
    socialCount: number
    hasLogo: boolean
    hasAsset: boolean
    testimonialCount: number
}

export default function BadgesDisplay({ promptCount, siteScore, socialCount, hasLogo, hasAsset, testimonialCount }: BadgesDisplayProps) {
    const { lang } = useLang()
    const isEs = lang === 'es'
    const earned = loadBadges()

    // Trigger badge check on render
    checkAndUnlockBadges({ promptCount, siteScore, socialCount, hasLogo, hasAsset, testimonialCount })

    return (
        <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-3">
                {isEs ? 'Tus logros' : 'Your achievements'} ({earned.length}/{ALL_BADGES.length})
            </p>
            <div className="flex flex-wrap gap-2">
                {ALL_BADGES.map((badge) => {
                    const unlocked = earned.includes(badge.id)
                    return (
                        <motion.div
                            key={badge.id}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300"
                            style={{
                                background: unlocked ? `${badge.color}15` : 'rgba(255,255,255,0.03)',
                                border: `1px solid ${unlocked ? `${badge.color}40` : 'rgba(255,255,255,0.06)'}`,
                                color: unlocked ? badge.color : 'rgba(255,255,255,0.2)',
                                filter: unlocked ? 'none' : 'grayscale(1)',
                            }}
                        >
                            <span className="text-sm">{badge.emoji}</span>
                            <span>{isEs ? badge.nameEs : badge.nameEn}</span>

                            {/* Tooltip on hover */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg text-[11px] text-white/80 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50"
                                style={{ background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                {unlocked
                                    ? (isEs ? badge.descEs : badge.descEn)
                                    : (isEs ? '🔒 Aún no desbloqueado' : '🔒 Not yet unlocked')
                                }
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}

/* ── Badge Unlock Toast ── */
interface BadgeToastProps {
    badgeId: string | null
    onDismiss: () => void
}

export function BadgeToast({ badgeId, onDismiss }: BadgeToastProps) {
    const { lang } = useLang()
    const isEs = lang === 'es'
    const badge = ALL_BADGES.find(b => b.id === badgeId)

    return (
        <AnimatePresence>
            {badge && (
                <motion.div
                    initial={{ opacity: 0, y: 60, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 60, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    onClick={onDismiss}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[500] cursor-pointer"
                >
                    <div
                        className="flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl"
                        style={{
                            background: 'linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(20,25,50,0.95) 100%)',
                            border: `2px solid ${badge.color}60`,
                            boxShadow: `0 0 30px ${badge.color}30`,
                        }}
                    >
                        <motion.span
                            animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 0.6 }}
                            className="text-3xl"
                        >
                            {badge.emoji}
                        </motion.span>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: badge.color }}>
                                {isEs ? '¡Logro desbloqueado!' : 'Achievement Unlocked!'}
                            </p>
                            <p className="text-sm font-bold text-white">
                                {isEs ? badge.nameEs : badge.nameEn}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
