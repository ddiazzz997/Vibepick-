import { useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import VibeCard, {
  CleanMockup, BoldMockup, WarmMockup,
  PlayfulMockup, LuxuryMockup, VibrantMockup,
} from './components/VibeCard'
import SectionBuilder from './components/SectionBuilder'
import PromptOutput from './components/PromptOutput'
import { generatePrompt } from './lib/generatePrompt'
import { useLang, LangToggle } from './lib/i18n'
import WelcomeScreen from './components/WelcomeScreen'
import CodeRain from './components/CodeRain'
import Logo from './components/Logo'

/* ── Animation variants ── */
const sectionVariants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

/* ── Step header ── */
function Step({ n, title, sub }: { n: number; title: string; sub?: string }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-8 h-8 shrink-0">
          {/* Animated glow background */}
          <motion.div
            className="absolute inset-0 rounded-xl bg-[var(--accent)]/20"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* The rainbow border box */}
          <span className="relative z-10 rainbow-border flex items-center justify-center w-full h-full rounded-xl bg-black text-[var(--accent)] text-sm font-bold shadow-[0_0_15px_rgba(0,119,255,0.4)]">
            <motion.span
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {n}
            </motion.span>
          </span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          {title}
        </h2>
      </div>
      {sub && <p className="text-sm text-[var(--text-muted)] ml-11 mt-1">{sub}</p>}
    </div>
  )
}


/* ── Floating orb component for hero ── */
function Orb({ size, color, x, y, delay, duration }: {
  size: number; color: string; x: string; y: string; delay: number; duration: number
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size, height: size,
        left: x, top: y,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: `blur(${size * 0.4}px)`,
      }}
      animate={{
        x: [0, 20, -15, 10, 0],
        y: [0, -25, 10, -10, 0],
        scale: [1, 1.1, 0.95, 1.05, 1],
        opacity: [0.6, 0.9, 0.5, 0.8, 0.6],
      }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  )
}

/* ── App ── */
export default function App() {
  const { lang, t } = useLang()

  const [showWelcome, setShowWelcome] = useState(true)
  const [desc, setDesc] = useState('')
  const [niche, setNiche] = useState('')
  const [customNiche, setCustomNiche] = useState('')
  const [vibe, setVibe] = useState<string | null>(null)
  const [sections, setSections] = useState<string[]>(['Hero', 'Social Proof', 'Features', 'Footer'])
  const [cta, setCta] = useState('')

  const formRef = useRef<HTMLDivElement>(null)
  const effectiveNiche = customNiche || niche

  // Build vibes from translations
  const vibes = [
    { id: 'clean', label: t.vibes[0].label, mockup: <CleanMockup /> },
    { id: 'bold', label: t.vibes[1].label, mockup: <BoldMockup /> },
    { id: 'warm', label: t.vibes[2].label, mockup: <WarmMockup /> },
    { id: 'playful', label: t.vibes[3].label, mockup: <PlayfulMockup /> },
    { id: 'luxury', label: t.vibes[4].label, mockup: <LuxuryMockup /> },
    { id: 'vibrant', label: t.vibes[5].label, mockup: <VibrantMockup /> },
  ]

  const prompt = useMemo(
    () =>
      generatePrompt({
        description: desc + (effectiveNiche ? ` (${effectiveNiche})` : ''),
        niche: effectiveNiche,
        vibe,
        sections,
        cta,
        lang,
      }),
    [desc, effectiveNiche, vibe, sections, cta, lang],
  )

  return (
    <>
      <LangToggle />

      {/* Welcome splash screen with 3D robot */}
      <AnimatePresence>
        {showWelcome && <WelcomeScreen onEnter={() => setShowWelcome(false)} />}
      </AnimatePresence>

      <div className="min-h-screen relative bg-black">
        <CodeRain />

        <div className="relative z-10">

          {/* ════════════════════════════════════════════
          HERO — full-width with animated orbs
          ════════════════════════════════════════════ */}
          <header className="relative overflow-hidden">
            {/* Animated background orbs */}
            <div className="absolute inset-0 overflow-hidden">
              <Orb size={400} color="rgba(0,102,255,0.15)" x="10%" y="-10%" delay={0} duration={18} />
              <Orb size={300} color="rgba(14,165,233,0.12)" x="65%" y="5%" delay={2} duration={22} />
              <Orb size={200} color="rgba(59,130,246,0.10)" x="80%" y="60%" delay={4} duration={16} />
              <Orb size={250} color="rgba(0,102,255,0.08)" x="-5%" y="50%" delay={1} duration={20} />

              {/* Grid overlay for texture */}
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `
                linear-gradient(var(--accent) 1px, transparent 1px),
                linear-gradient(90deg, var(--accent) 1px, transparent 1px)
              `,
                  backgroundSize: '60px 60px',
                }}
              />

              {/* Bottom fade into page bg */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg)] to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 pt-24 pb-20 px-5">
              <div className="max-w-xl mx-auto text-center">
                {/* Central Logo (Replaces profile image) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1, type: 'spring', stiffness: 300 }}
                  className="mx-auto flex justify-center mb-8 sm:mb-10 w-full"
                >
                  <Logo className="h-16 md:h-20" />
                </motion.div>

                {/* Heading */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.05] mb-5"
                >
                  <span className="text-white">{t.buildYour}</span>
                  <br />
                  <span
                    className="shimmer-text bg-clip-text text-transparent"
                    style={{
                      backgroundImage: 'linear-gradient(90deg, #0066ff, #0ea5e9, #3b82f6, #06b6d4, #0ea5e9, #0066ff)',
                      backgroundSize: '200% auto',
                    }}
                  >
                    {t.perfectWebsite}
                  </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                  className="text-base sm:text-lg text-[var(--text-muted)] max-w-md mx-auto leading-relaxed mb-10"
                >
                  {t.heroSubtitle.split('\n').map((line, i) => (
                    <span key={i}>{line}{i === 0 && <br className="hidden sm:block" />}</span>
                  ))}
                </motion.p>

              </div>
            </div>
          </header>

          {/* ════════════════════════════════════════════
          FORM
          ════════════════════════════════════════════ */}
          <main ref={formRef} className="max-w-xl mx-auto px-5 pb-24">
            <div className="relative flex flex-col gap-14">
              {/* Vertical Timeline Line */}
              <div className="absolute top-8 bottom-8 left-[48px] w-px bg-gradient-to-b from-transparent via-[var(--accent)]/30 to-transparent z-0 hidden sm:block" />
              <div className="absolute top-8 bottom-8 left-[36px] w-px bg-gradient-to-b from-transparent via-[var(--accent)]/30 to-transparent z-0 sm:hidden" />

              {/* 1 — Describe */}
              <motion.section
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55 }}
                className="glass-panel"
              >
                <Step n={1} title={t.step1Title} />
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder={t.step1Placeholder}
                  rows={3}
                  className="input-glow"
                />
              </motion.section>

              {/* 2 — Niche */}
              <motion.section
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55 }}
                className="glass-panel"
              >
                <Step n={2} title={t.step2Title} sub={t.step2Sub} />
                <div className="flex flex-wrap gap-2.5 mb-4">
                  {t.niches.map((n, i) => {
                    const isSelected = niche === n.label
                    return (
                      <motion.button
                        key={n.label}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: 0.025 * i }}
                        onClick={() => { setNiche(n.label); setCustomNiche('') }}
                        whileHover={{
                          y: -3,
                          scale: 1.04,
                          transition: { type: 'spring', stiffness: 500, damping: 20 },
                        }}
                        whileTap={{ scale: 0.93 }}
                        className={`
                      flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-medium
                      cursor-pointer transition-all duration-200
                      ${isSelected
                            ? 'bg-[var(--accent)]/15 border-[var(--accent)]/50 text-white shadow-[0_0_28px_rgba(0,102,255,0.15)]'
                            : 'bg-[var(--surface-raised)] border-[var(--border)] text-[var(--text-muted)] hover:text-white hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.25)]'
                          }
                    `}
                      >
                        <motion.span
                          className="text-base"
                          animate={isSelected ? { scale: [1, 1.3, 1], rotate: [0, -10, 10, 0] } : {}}
                          transition={{ duration: 0.4 }}
                        >
                          {n.emoji}
                        </motion.span>
                        {n.label}
                      </motion.button>
                    )
                  })}
                </div>
                <input
                  type="text"
                  value={customNiche}
                  onChange={(e) => { setCustomNiche(e.target.value); setNiche('') }}
                  placeholder={t.step2Placeholder}
                  className="input-glow"
                />
              </motion.section>

              {/* 3 — Vibe */}
              <motion.section
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55 }}
                className="glass-panel"
              >
                <Step n={3} title={t.step3Title} sub={t.step3Sub} />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {vibes.map((v, i) => (
                    <motion.div
                      key={v.id}
                      initial={{ opacity: 0, y: 20, scale: 0.92 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.07 * i, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      <VibeCard
                        id={v.id}
                        label={v.label}
                        selected={vibe === v.id}
                        onClick={() => setVibe(v.id)}
                      >
                        {v.mockup}
                      </VibeCard>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* 4 — Sections */}
              <motion.section
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55 }}
                className="glass-panel"
              >
                <Step n={4} title={t.step4Title} sub={t.step4Sub} />
                <SectionBuilder selected={sections} onChange={setSections} />
              </motion.section>

              {/* 5 — CTA */}
              <motion.section
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55 }}
                className="glass-panel"
              >
                <Step n={5} title={t.step5Title} sub={t.step5Sub} />
                <input
                  type="text"
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  placeholder={t.step5Placeholder}
                  className="input-glow"
                />
              </motion.section>

              {/* Output */}
              <motion.section
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55 }}
                className="glass-panel"
              >
                <PromptOutput prompt={prompt} />
              </motion.section>

              {/* ── Paste hint + rainbow transition strip ── */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center space-y-6 py-4"
              >
                <p className="text-base text-[var(--text-muted)] font-medium">
                  {t.pasteInto} <span className="text-white">Lovable</span>, <span className="text-white">Bolt</span>, <span className="text-white">AntiGravity AI Studio</span>, <span className="text-white">v0</span>{t.pasteIntoSuffix}
                </p>

                {/* Rainbow glow strip */}
                <div className="rainbow-strip mx-auto w-4/5" />

                <p className="text-xs text-[var(--text-dim)] uppercase tracking-[0.2em] font-semibold">
                  {t.keepScrolling}
                </p>

                {/* Animated down arrow */}
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="flex justify-center"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accent)]">
                    <path d="M12 5v14" /><path d="m19 12-7 7-7-7" />
                  </svg>
                </motion.div>
              </motion.div>

              {/* Banner + Advisory CTA */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6 }}
                className="text-center pt-4 pb-2"
              >
                <div className="group inline-block rounded-2xl overflow-hidden border-2 border-[var(--border)] hover:border-[var(--accent)]/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,102,255,0.15)]">
                  <img
                    src="/images/antigravity-banner.png"
                    alt="Daniel Díaz — AntiGravity AI"
                    className="w-full max-w-md transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-5">
                  <a
                    href="https://api.whatsapp.com/send?phone=573233194440&text=Hola%20Daniel%2C%20vengo%20de%20tu%20web.%20Estoy%20listo%20para%20implementar%20sistemas%20de%20IA%20en%20mi%20negocio%20y%20quiero%20aplicar%20para%20tu%20asesor%C3%ADa%201%3A1.%20%C2%BFCu%C3%A1les%20son%20los%20siguientes%20pasos%3F"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--accent)] text-white font-semibold text-sm hover:brightness-110 transition-all duration-200 shadow-[0_4px_24px_rgba(0,102,255,0.3)] hover:shadow-[0_6px_32px_rgba(0,102,255,0.45)] cursor-pointer border-none no-underline"
                  >
                    {t.requestAdvisory}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7" /><path d="M7 7h10v10" /></svg>
                  </a>
                </div>
              </motion.section>

              {/* Footer */}
              <motion.footer
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center pt-6 pb-10"
              >
                <p className="text-sm text-[var(--text-dim)]">
                  {t.madeBy} <span className="text-cyan-400">&#x1F499;</span> {t.byDaniel}
                </p>
              </motion.footer>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
