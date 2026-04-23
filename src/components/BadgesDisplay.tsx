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
  /** Shown in the unlock toast subtitle */
  rewardEs: string
  rewardEn: string
}

const ALL_BADGES: Badge[] = [
  {
    id: 'first_site',
    emoji: '🚀',
    nameEs: 'Primer Sitio',
    nameEn: 'First Site',
    descEs: 'Generaste tu primer prompt',
    descEn: 'Generated your first prompt',
    rewardEs: '+2 créditos bonus',
    rewardEn: '+2 bonus credits',
    color: '#0066ff',
  },
  {
    id: 'complete_profile',
    emoji: '⭐',
    nameEs: 'Perfil Completo',
    nameEn: 'Complete Profile',
    descEs: 'Completaste tu sitio al 100%',
    descEn: 'Your site reached 100%',
    rewardEs: 'Sitio de máxima calidad',
    rewardEn: 'Maximum quality site',
    color: '#60a5fa',
  },
  {
    id: 'power_user',
    emoji: '⚡',
    nameEs: 'Power User',
    nameEn: 'Power User',
    descEs: '3+ prompts generados',
    descEn: '3+ prompts generated',
    rewardEs: 'Eres un experto',
    rewardEn: 'You\'re an expert',
    color: '#3b82f6',
  },
  {
    id: 'social_master',
    emoji: '🌐',
    nameEs: 'Social Master',
    nameEn: 'Social Master',
    descEs: 'Agregaste 3+ redes sociales',
    descEn: 'Added 3+ social networks',
    rewardEs: 'Presencia digital completa',
    rewardEn: 'Complete digital presence',
    color: '#0ea5e9',
  },
  {
    id: 'branding_pro',
    emoji: '🎨',
    nameEs: 'Branding Pro',
    nameEn: 'Branding Pro',
    descEs: 'Subiste logo + imagen del negocio',
    descEn: 'Uploaded logo + business image',
    rewardEs: 'Marca profesional lista',
    rewardEn: 'Professional brand ready',
    color: '#0066ff',
  },
  {
    id: 'testimonial_king',
    emoji: '👑',
    nameEs: 'Rey de Testimonios',
    nameEn: 'Testimonial King',
    descEs: 'Agregaste 3+ testimonios',
    descEn: 'Added 3+ testimonials',
    rewardEs: 'Prueba social activada',
    rewardEn: 'Social proof activated',
    color: '#38bdf8',
  },
  {
    id: 'pro_member',
    emoji: '💎',
    nameEs: 'Miembro Pro',
    nameEn: 'Pro Member',
    descEs: 'Actualizaste a Vibepick Pro',
    descEn: 'Upgraded to Vibepick Pro',
    rewardEs: 'Prompts ilimitados desbloqueados',
    rewardEn: 'Unlimited prompts unlocked',
    color: '#0066ff',
  },
  {
    id: 'referrer',
    emoji: '🤝',
    nameEs: 'Embajador',
    nameEn: 'Ambassador',
    descEs: 'Referiste a tu primer amigo',
    descEn: 'Referred your first friend',
    rewardEs: '+5 créditos de referido',
    rewardEn: '+5 referral credits',
    color: '#0ea5e9',
  },
]

const LS_BADGES_KEY = 'vp_badges'

function loadBadges(): string[] {
  try {
    const raw = localStorage.getItem(LS_BADGES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
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
  isPro?: boolean
  referralCount?: number
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
  if (ctx.isPro && !earned.includes('pro_member')) {
    saveBadge('pro_member')
    return 'pro_member'
  }
  if ((ctx.referralCount ?? 0) >= 1 && !earned.includes('referrer')) {
    saveBadge('referrer')
    return 'referrer'
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
  isPro?: boolean
  referralCount?: number
}

export default function BadgesDisplay({
  promptCount,
  siteScore,
  socialCount,
  hasLogo,
  hasAsset,
  testimonialCount,
  isPro = false,
  referralCount = 0,
}: BadgesDisplayProps) {
  const { lang } = useLang()
  const isEs = lang === 'es'
  const earned = loadBadges()

  checkAndUnlockBadges({ promptCount, siteScore, socialCount, hasLogo, hasAsset, testimonialCount, isPro, referralCount })

  const earnedCount = earned.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="mb-6 rounded-2xl overflow-hidden relative"
      style={{
        background: 'linear-gradient(145deg, rgba(0,102,255,0.04) 0%, rgba(2,2,20,0.6) 50%, rgba(14,165,233,0.03) 100%)',
        border: '1px solid rgba(0,102,255,0.12)',
        boxShadow: '0 0 30px rgba(0,102,255,0.04), 0 16px 48px rgba(0,0,0,0.35)',
        padding: '20px 24px 24px',
      }}
    >
      {/* Decorative corner orb */}
      <div
        style={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 120,
          height: 120,
          background: 'radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
            style={{
              background: 'linear-gradient(135deg, rgba(0,102,255,0.15), rgba(14,165,233,0.1))',
              border: '1px solid rgba(0,102,255,0.2)',
              boxShadow: '0 0 12px rgba(0,102,255,0.1)',
            }}
          >
            🏆
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.14em]"
            style={{ color: '#60a5fa' }}>
            {isEs ? 'Tus logros' : 'Your achievements'}
          </p>
        </div>
        <motion.span
          key={earnedCount}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400 }}
          className="text-sm font-bold px-3 py-1 rounded-full"
          style={{
            background: earnedCount > 0
              ? 'linear-gradient(135deg, rgba(0,102,255,0.15), rgba(14,165,233,0.1))'
              : 'rgba(255,255,255,0.04)',
            color: earnedCount > 0 ? '#60a5fa' : 'rgba(255,255,255,0.25)',
            border: earnedCount > 0
              ? '1px solid rgba(0,102,255,0.3)'
              : '1px solid rgba(255,255,255,0.06)',
            boxShadow: earnedCount > 0 ? '0 0 10px rgba(0,102,255,0.1)' : 'none',
          }}
        >
          {earnedCount}/{ALL_BADGES.length}
        </motion.span>
      </div>

      {/* Badge chips */}
      <div className="flex flex-wrap gap-2.5 relative z-10">
        {ALL_BADGES.map((badge, i) => {
          const unlocked = earned.includes(badge.id)
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, type: 'spring', stiffness: 400, damping: 22 }}
              whileHover={{
                scale: 1.08,
                y: -2,
                transition: { duration: 0.2 },
              }}
              className="group relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-300 cursor-default"
              style={{
                background: unlocked
                  ? `linear-gradient(135deg, ${badge.color}18, ${badge.color}0a)`
                  : 'rgba(255,255,255,0.025)',
                border: `1px solid ${unlocked ? `${badge.color}40` : 'rgba(255,255,255,0.06)'}`,
                color: unlocked ? badge.color : 'rgba(255,255,255,0.22)',
                filter: unlocked ? 'none' : 'grayscale(0.8) brightness(0.7)',
                boxShadow: unlocked
                  ? `0 0 16px ${badge.color}15, 0 4px 12px rgba(0,0,0,0.2)`
                  : 'none',
              }}
            >
              <span
                className="text-base"
                style={{
                  filter: unlocked ? 'none' : 'grayscale(1) opacity(0.4)',
                }}
              >
                {badge.emoji}
              </span>
              <span>{isEs ? badge.nameEs : badge.nameEn}</span>

              {/* Lock icon for unearned */}
              {!unlocked && (
                <span className="text-[10px] ml-0.5" style={{ color: 'rgba(255,255,255,0.15)' }}>🔒</span>
              )}

              {/* Tooltip */}
              <div
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2.5 rounded-xl text-[11px] whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 text-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(5,2,15,0.98), rgba(0,20,50,0.98))',
                  border: `1px solid ${unlocked ? badge.color + '35' : 'rgba(0,102,255,0.12)'}`,
                  boxShadow: unlocked
                    ? `0 4px 24px ${badge.color}20, 0 12px 40px rgba(0,0,0,0.5)`
                    : '0 8px 32px rgba(0,0,0,0.5)',
                  color: 'rgba(255,255,255,0.75)',
                  minWidth: '160px',
                }}
              >
                <p className="font-bold mb-0.5" style={{ color: unlocked ? badge.color : 'rgba(96,165,250,0.5)' }}>
                  {unlocked
                    ? (isEs ? badge.descEs : badge.descEn)
                    : (isEs ? '🔒 Aún no desbloqueado' : '🔒 Not yet unlocked')}
                </p>
                {unlocked && (
                  <p style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {isEs ? badge.rewardEs : badge.rewardEn}
                  </p>
                )}
                {/* Tooltip arrow */}
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
                  style={{
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: `6px solid ${unlocked ? badge.color + '35' : 'rgba(0,102,255,0.12)'}`,
                  }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

/* ── Particle burst for toast ── */
const PARTICLES = Array.from({ length: 8 }, (_, i) => ({
  angle: (i / 8) * 360,
  distance: 32 + Math.random() * 16,
}))

interface BadgeToastProps {
  badgeId: string | null
  onDismiss: () => void
}

export function BadgeToast({ badgeId, onDismiss }: BadgeToastProps) {
  const { lang } = useLang()
  const isEs = lang === 'es'
  const badge = ALL_BADGES.find((b) => b.id === badgeId)

  return (
    <AnimatePresence>
      {badge && (
        <motion.div
          initial={{ opacity: 0, y: 64, scale: 0.88 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 64, scale: 0.88 }}
          transition={{ type: 'spring', stiffness: 380, damping: 22 }}
          onClick={onDismiss}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[500] cursor-pointer"
        >
          {/* Burst particles */}
          {PARTICLES.map((p, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full pointer-events-none"
              style={{ background: badge.color, originX: '50%', originY: '50%' }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
                y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
                opacity: 0,
                scale: 0,
              }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: 0.05 }}
            />
          ))}

          {/* Toast card */}
          <div
            className="flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(5,2,15,0.98) 0%, rgba(10,5,25,0.98) 100%)',
              border: `1.5px solid ${badge.color}50`,
              boxShadow: `0 0 40px ${badge.color}25, 0 16px 40px rgba(0,0,0,0.6)`,
            }}
          >
            <motion.span
              animate={{ scale: [1, 1.35, 0.95, 1.1, 1], rotate: [0, 12, -10, 5, 0] }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
              className="text-3xl shrink-0"
            >
              {badge.emoji}
            </motion.span>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{ color: badge.color }}>
                {isEs ? '¡Logro desbloqueado!' : 'Achievement Unlocked!'}
              </p>
              <p className="text-sm font-bold text-white leading-tight mt-0.5">
                {isEs ? badge.nameEs : badge.nameEn}
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>
                {isEs ? badge.rewardEs : badge.rewardEn}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
