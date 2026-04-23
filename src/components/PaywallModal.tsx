import { motion } from 'framer-motion'
import { useLang } from '../lib/i18n'

interface PaywallModalProps {
  show: boolean
  /** Called when the user clicks the primary upgrade CTA.
   *  Squad 3 (Growth Engineering) will wire this to Lemon Squeezy checkout.
   *  Until then, falls back to WhatsApp if undefined. */
  onUpgrade?: () => void
}

const WHATSAPP_URL =
  'https://api.whatsapp.com/send?phone=573233194440&text=Hola%20Daniel%2C%20quiero%20suscribirme%20a%20Vibepick%20Pro%20por%20%249%2Fmes.%20%C2%BFC%C3%B3mo%20procedo%3F'

const WHATSAPP_QUESTIONS_URL =
  'https://api.whatsapp.com/send?phone=573233194440&text=Hola%2C%20tengo%20preguntas%20sobre%20Vibepick%20Pro.'

export default function PaywallModal({ show, onUpgrade }: PaywallModalProps) {
  const { t, lang } = useLang()
  const spanish = lang === 'es'

  if (!show) return null

  const handleCTA = () => {
    if (onUpgrade) {
      onUpgrade()
    } else {
      window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-[300] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" />

      {/* Card */}
      <motion.div
        className="relative z-10 w-full max-w-sm mx-4"
        initial={{ scale: 0.88, opacity: 0, y: 28 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24, delay: 0.08 }}
      >
        {/* Animated Pink/Teal conic border */}
        <div className="relative rounded-2xl p-[1.5px] overflow-hidden">
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                'conic-gradient(from 0deg, #0066ff, #60a5fa, #0ea5e9, #38bdf8, #3b82f6, #0066ff)',
            }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          />

          {/* Inner card */}
          <div
            className="relative rounded-2xl p-8 text-center"
            style={{
              background:
                'linear-gradient(160deg, rgba(8, 4, 20, 0.99) 0%, rgba(0,0,0,0.99) 100%)',
            }}
          >
            {/* Top badge */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold mb-5"
              style={{
                background: 'rgba(0,102,255,0.12)',
                border: '1px solid rgba(0,102,255,0.3)',
                color: '#60a5fa',
              }}
            >
              ✦ {t.paywallHint}
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-2xl sm:text-3xl font-extrabold text-white mb-2 leading-tight"
            >
              {t.paywallTitle}
            </motion.h2>

            {/* Price */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45, type: 'spring', stiffness: 220 }}
              className="mb-5"
            >
              <span className="text-5xl font-black text-white">$9</span>
              <span className="text-sm ml-1" style={{ color: 'var(--text-muted)' }}>/mes</span>
              <p className="text-[11px] mt-1.5" style={{ color: 'rgba(255,255,255,0.25)' }}>
                Prompts ilimitados · Sin contratos · Cancela cuando quieras
              </p>
            </motion.div>

            {/* Value items */}
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="text-left space-y-2 mb-6"
            >
              {[
                { icon: '✦', text: spanish ? 'Prompts ilimitados' : 'Unlimited prompts', color: '#0066ff' },
                { icon: '✦', text: spanish ? 'Todas las secciones desbloqueadas' : 'All sections unlocked', color: '#0ea5e9' },
                { icon: '✦', text: spanish ? 'Exportación de proyecto completa' : 'Full project export', color: '#0066ff' },
                { icon: '✦', text: spanish ? 'Soporte directo por WhatsApp' : 'Direct WhatsApp support', color: '#0ea5e9' },
              ].map((item) => (
                <li key={item.text} className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  <span className="text-[10px] shrink-0" style={{ color: item.color }}>{item.icon}</span>
                  {item.text}
                </li>
              ))}
            </motion.ul>

            {/* CTA button */}
            <motion.button
              onClick={handleCTA}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative w-full py-4 rounded-xl text-white font-bold text-sm cursor-pointer border-none overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #0066ff 0%, #0ea5e9 100%)',
                boxShadow: '0 4px 28px rgba(0,102,255,0.4)',
              }}
            >
              {/* Light sweep */}
              <motion.div
                className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                animate={{ left: ['-100%', '200%'] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
              />
              <span className="relative z-10">🚀 {t.paywallCTA}</span>
            </motion.button>

            {/* Secondary link */}
            <motion.a
              href={WHATSAPP_QUESTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85 }}
              className="inline-block mt-4 text-xs no-underline transition-colors duration-200"
              style={{ color: 'var(--text-dim)' }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'var(--accent)')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'var(--text-dim)')}
            >
              {t.paywallWhatsApp}
            </motion.a>

            {/* Micro-copy */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.95 }}
              className="text-[10px] mt-3 opacity-40"
              style={{ color: 'var(--text-dim)' }}
            >
              {t.paywallCancel}
            </motion.p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

