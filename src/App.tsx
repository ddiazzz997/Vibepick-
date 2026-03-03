import { useState, useMemo, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import VibeCard, {
  CleanMockup, BoldMockup, WarmMockup,
  PlayfulMockup, LuxuryMockup, VibrantMockup,
} from './components/VibeCard'
import SectionBuilder from './components/SectionBuilder'
import PromptOutput from './components/PromptOutput'
import { generatePrompt } from './lib/generatePrompt'
import { useLang, LangToggle } from './lib/i18n'
import CodeRain from './components/CodeRain'
import Logo from './components/Logo'
import { SplineScene } from "@/components/ui/splite"
import { Spotlight } from "@/components/ui/spotlight"
import { useAuth } from './context/AuthContext'
import AuthModal from './components/AuthModal'
import ProblemSection from './components/ProblemSection'
import BenefitsSection from './components/BenefitsSection'
import WhyVibepick from './components/WhyVibepick'
import FAQ from './components/FAQ'
import PaywallModal from './components/PaywallModal'

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
          <motion.div
            className="absolute inset-0 rounded-xl bg-[var(--accent)]/20"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
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

/* ── App ── */
export default function App() {
  const { lang, t } = useLang()
  const { user, profile, isLoading, setShowAuth, signOut, incrementPromptCount } = useAuth()

  const [showPlatform, setShowPlatform] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)
  const [desc, setDesc] = useState('')
  const [niche, setNiche] = useState('')
  const [customNiche, setCustomNiche] = useState('')
  const [vibe, setVibe] = useState<string | null>(null)
  const [sections, setSections] = useState<string[]>(['Hero', 'Social Proof', 'Features', 'Footer'])
  const [cta, setCta] = useState('')

  const formRef = useRef<HTMLDivElement>(null)
  const effectiveNiche = customNiche || niche

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

  /* Handle auth success → go to platform */
  const handleAuthSuccess = useCallback(() => {
    setShowPlatform(true)
  }, [])

  /* Handle CTA clicks → open auth or go to platform */
  const handleCTAClick = useCallback(() => {
    if (user) {
      setShowPlatform(true)
    } else {
      setShowAuth(true)
    }
  }, [user, setShowAuth])

  /* Handle prompt copy → check usage */
  const handlePromptCopy = useCallback(async () => {
    if (!user || !profile) return
    if (profile.is_pro) return
    const newCount = await incrementPromptCount()
    if (newCount >= 2) {
      setShowPaywall(true)
    }
  }, [user, profile, incrementPromptCount])

  if (isLoading) return null

  return (
    <>
      <LangToggle />
      <AuthModal onSuccess={handleAuthSuccess} />
      <PaywallModal show={showPaywall} />

      <AnimatePresence>
        {showPlatform ? (
          /* ════════════════════════════════════════════
             PLATFORM VIEW (after auth)
          ════════════════════════════════════════════ */
          <motion.div
            key="platform"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen relative bg-black"
          >
            <CodeRain />
            <div className="relative z-10">
              {/* Platform Header */}
              <header className="relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                  }} />
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg)] to-transparent" />
                </div>

                <div className="relative z-10 pt-20 pb-6 px-5">
                  <div className="max-w-xl mx-auto text-center">
                    {/* User header */}
                    {user && profile && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="fixed top-4 left-4 z-[140] flex items-center gap-3"
                      >
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--surface-raised)] border border-[var(--border)]">
                          <div className="w-7 h-7 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-xs font-bold">
                            {profile.first_name[0]}
                          </div>
                          <span className="text-sm text-white font-medium">{t.authGreeting}, {profile.first_name}</span>
                          <button
                            onClick={signOut}
                            className="text-xs text-[var(--text-dim)] hover:text-white ml-2 cursor-pointer bg-transparent border-none transition-colors"
                          >
                            {t.authLogout}
                          </button>
                        </div>
                      </motion.div>
                    )}

                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, type: 'spring', stiffness: 300 }}
                      className="mx-auto flex justify-center mb-8 w-full"
                    >
                      <Logo className="h-14 md:h-16" />
                    </motion.div>

                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05] mb-4"
                    >
                      <span className="text-white">{t.buildYour}</span>{' '}
                      <span className="shimmer-text bg-clip-text text-transparent"
                        style={{
                          backgroundImage: 'linear-gradient(90deg, #0066ff, #0ea5e9, #3b82f6, #06b6d4, #0ea5e9, #0066ff)',
                          backgroundSize: '200% auto',
                        }}
                      >
                        {t.perfectWebsite}
                      </span>
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="text-base text-[var(--text-muted)] max-w-md mx-auto leading-relaxed mb-8"
                    >
                      {t.heroSubtitle.split('\n').map((line, i) => (
                        <span key={i}>{line}{i === 0 && <br className="hidden sm:block" />}</span>
                      ))}
                    </motion.p>
                  </div>
                </div>
              </header>

              {/* Platform form */}
              <main ref={formRef} className="max-w-xl mx-auto px-5 pb-24">
                <div className="relative flex flex-col gap-14">
                  <div className="absolute top-8 bottom-8 left-[48px] w-px bg-gradient-to-b from-transparent via-[var(--accent)]/30 to-transparent z-0 hidden sm:block" />
                  <div className="absolute top-8 bottom-8 left-[36px] w-px bg-gradient-to-b from-transparent via-[var(--accent)]/30 to-transparent z-0 sm:hidden" />

                  {/* 1 — Describe */}
                  <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.55 }} className="glass-panel">
                    <Step n={1} title={t.step1Title} />
                    <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder={t.step1Placeholder} rows={3} className="input-glow" />
                  </motion.section>

                  {/* 2 — Niche */}
                  <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.55 }} className="glass-panel">
                    <Step n={2} title={t.step2Title} sub={t.step2Sub} />
                    <div className="flex flex-wrap gap-2.5 mb-4">
                      {t.niches.map((n, i) => {
                        const isSelected = niche === n.label
                        return (
                          <motion.button key={n.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: 0.025 * i }}
                            onClick={() => { setNiche(n.label); setCustomNiche('') }}
                            whileHover={{ y: -3, scale: 1.04, transition: { type: 'spring', stiffness: 500, damping: 20 } }}
                            whileTap={{ scale: 0.93 }}
                            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-medium cursor-pointer transition-all duration-300
                              ${isSelected
                                ? 'bg-white/10 border-white/20 text-white shadow-[0_0_20px_rgba(255,255,255,0.05),inset_0_1px_0_rgba(255,255,255,0.1)]'
                                : 'bg-[var(--surface-raised)] border-[var(--border)] text-[var(--text-muted)] hover:text-white hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.25)]'
                              }`}
                          >
                            <motion.span className="text-base" animate={isSelected ? { scale: [1, 1.3, 1], rotate: [0, -10, 10, 0] } : {}} transition={{ duration: 0.4 }}>
                              {n.emoji}
                            </motion.span>
                            {n.label}
                          </motion.button>
                        )
                      })}
                    </div>
                    <input type="text" value={customNiche} onChange={(e) => { setCustomNiche(e.target.value); setNiche('') }} placeholder={t.step2Placeholder} className="input-glow" />
                  </motion.section>

                  {/* 3 — Vibe */}
                  <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.55 }} className="glass-panel">
                    <Step n={3} title={t.step3Title} sub={t.step3Sub} />
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {vibes.map((v, i) => (
                        <motion.div key={v.id} initial={{ opacity: 0, y: 20, scale: 0.92 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.07 * i, ease: [0.25, 0.1, 0.25, 1] }}>
                          <VibeCard id={v.id} label={v.label} selected={vibe === v.id} onClick={() => setVibe(v.id)}>
                            {v.mockup}
                          </VibeCard>
                        </motion.div>
                      ))}
                    </div>
                  </motion.section>

                  {/* 4 — Sections */}
                  <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.55 }} className="glass-panel">
                    <Step n={4} title={t.step4Title} sub={t.step4Sub} />
                    <SectionBuilder selected={sections} onChange={setSections} />
                  </motion.section>

                  {/* 5 — CTA */}
                  <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.55 }} className="glass-panel">
                    <Step n={5} title={t.step5Title} sub={t.step5Sub} />
                    <input type="text" value={cta} onChange={(e) => setCta(e.target.value)} placeholder={t.step5Placeholder} className="input-glow" />
                  </motion.section>

                  {/* Output */}
                  <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.55 }} className="glass-panel">
                    <PromptOutput prompt={prompt} onCopy={handlePromptCopy} />
                  </motion.section>

                  {/* Paste hint */}
                  <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center space-y-6 py-4">
                    <p className="text-base text-[var(--text-muted)] font-medium">
                      {t.pasteInto} <span className="text-white">Lovable</span>, <span className="text-white">Bolt</span>, <span className="text-white">AntiGravity AI Studio</span>, <span className="text-white">v0</span>{t.pasteIntoSuffix}
                    </p>
                    <div className="rainbow-strip mx-auto w-4/5" />
                    <p className="text-xs text-[var(--text-dim)] uppercase tracking-[0.2em] font-semibold">{t.keepScrolling}</p>
                    <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} className="flex justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accent)]"><path d="M12 5v14" /><path d="m19 12-7 7-7-7" /></svg>
                    </motion.div>
                  </motion.div>

                  {/* Banner + Advisory */}
                  <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.6 }} className="text-center pt-4 pb-2">
                    <div className="group inline-block rounded-2xl overflow-hidden border-2 border-[var(--border)] hover:border-[var(--accent)]/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,102,255,0.15)]">
                      <img src="/images/antigravity-banner.png" alt="Daniel Díaz — AntiGravity AI" className="w-full max-w-md transition-transform duration-500 group-hover:scale-[1.03]" />
                    </div>
                    <div className="mt-5">
                      <a href="https://api.whatsapp.com/send?phone=573233194440&text=Hola%20Daniel%2C%20vengo%20de%20tu%20web.%20Estoy%20listo%20para%20implementar%20sistemas%20de%20IA%20en%20mi%20negocio%20y%20quiero%20aplicar%20para%20tu%20asesor%C3%ADa%201%3A1.%20%C2%BFC%C3%A1les%20son%20los%20siguientes%20pasos%3F" target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--accent)] text-white font-semibold text-sm hover:brightness-110 transition-all duration-200 shadow-[0_4px_24px_rgba(0,102,255,0.3)] hover:shadow-[0_6px_32px_rgba(0,102,255,0.45)] cursor-pointer border-none no-underline">
                        {t.requestAdvisory}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7" /><path d="M7 7h10v10" /></svg>
                      </a>
                    </div>
                  </motion.section>

                  <motion.footer initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="text-center pt-6 pb-10">
                    <p className="text-sm text-[var(--text-dim)]">{t.madeBy} <span className="text-cyan-400">&#x1F499;</span> {t.byDaniel}</p>
                  </motion.footer>
                </div>
              </main>
            </div>
          </motion.div>
        ) : (
          /* ════════════════════════════════════════════
             LANDING PAGE (single page with robot + sections)
          ════════════════════════════════════════════ */
          <motion.div
            key="landing"
            className="min-h-screen relative bg-black"
          >
            <CodeRain />
            <div className="relative z-10">

              {/* ── HERO with 3D Robot ── */}
              <section className="relative overflow-hidden min-h-screen">
                {/* Background effects */}
                <motion.div className="absolute inset-0 z-0"
                  animate={{ opacity: [0.6, 0.8, 0.6] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ background: 'radial-gradient(circle at 70% 50%, rgba(0, 119, 255, 0.15) 0%, rgba(0, 60, 180, 0.05) 50%, transparent 100%)' }}
                />
                <motion.div className="absolute inset-0 z-0"
                  animate={{ opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                  style={{ background: 'radial-gradient(circle at 30% 30%, rgba(14, 165, 233, 0.1) 0%, transparent 60%)' }}
                />
                <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#0077ff" />

                <div className="flex flex-col md:flex-row h-screen items-center relative z-10 max-w-[1400px] mx-auto">
                  {/* Left: Copy + CTA */}
                  <div className="flex-1 p-5 md:p-12 flex flex-col justify-center items-center md:items-start text-center md:text-left z-20">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }} className="mb-6 md:mb-10">
                      <Logo className="h-16 md:h-24 text-3xl md:text-5xl" />
                    </motion.div>

                    <motion.h1
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.7 }}
                      className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-4 md:mb-5"
                    >
                      <span className="text-white">{t.welcomeTitle1}</span>
                      <br />
                      <span className="bg-clip-text text-transparent shimmer-text"
                        style={{
                          backgroundImage: 'linear-gradient(90deg, #0077ff, #0ea5e9, #3b82f6, #06b6d4, #0ea5e9, #0077ff)',
                          backgroundSize: '200% auto',
                        }}
                      >
                        {t.welcomeTitle2}
                      </span>
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.6 }}
                      className="text-base md:text-xl text-neutral-400 max-w-lg leading-relaxed mb-8"
                    >
                      {t.welcomeSubtitle}
                    </motion.p>

                    {/* CTA → opens auth */}
                    <motion.button
                      onClick={handleCTAClick}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1, duration: 0.5, type: 'spring', stiffness: 200 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="group relative overflow-hidden px-8 py-4 sm:px-10 sm:py-5 rounded-full font-bold text-base sm:text-lg text-white bg-[#0077ff] border border-[#0077ff]/50 shadow-[0_0_30px_rgba(0,119,255,0.4)] cursor-pointer transition-all duration-300 hover:shadow-[0_0_50px_rgba(0,119,255,0.6)]"
                    >
                      <motion.div className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                        animate={{ left: ['-100%', '200%'] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                      />
                      <span className="relative z-10 flex items-center gap-2">
                        <motion.span
                          animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                          className="drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                        >
                          🚀
                        </motion.span>
                        {t.welcomeCTA}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                      </span>
                    </motion.button>

                    <motion.button
                      onClick={() => { setShowAuth(true) }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.3, duration: 0.5 }}
                      className="mt-4 text-sm text-neutral-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
                    >
                      {t.welcomeCTALogin}
                    </motion.button>
                  </div>

                  {/* Right: 3D Robot */}
                  <div className="flex-1 relative w-full h-[400px] md:h-screen mt-8 md:mt-0">
                    <SplineScene
                      scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                      className="w-full h-full relative z-[1]"
                    />
                    <div className="absolute inset-0 z-[2] pointer-events-none"
                      style={{
                        background: 'linear-gradient(280deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100%)',
                        mixBlendMode: 'multiply',
                      }}
                    />
                    <div className="absolute inset-0 z-[3] pointer-events-none"
                      style={{
                        background: 'linear-gradient(180deg, rgba(0, 119, 255, 0.08) 0%, rgba(0, 60, 180, 0.12) 50%, rgba(0, 0, 0, 0) 100%)',
                        mixBlendMode: 'screen',
                      }}
                    />
                  </div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
                >
                  <p className="text-xs text-neutral-500 uppercase tracking-widest">{t.keepScrolling}</p>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accent)]"><path d="M12 5v14" /><path d="m19 12-7 7-7-7" /></svg>
                </motion.div>
              </section>

              {/* ── Persuasive Sections ── */}
              <ProblemSection />
              <BenefitsSection />
              <WhyVibepick />
              <FAQ />

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="py-16 px-5 text-center relative max-w-lg mx-auto"
              >
                <div className="absolute inset-x-0 -top-8 -bottom-8 bg-gradient-to-b from-transparent via-[var(--accent)]/5 to-transparent blur-3xl rounded-[100%]" />
                <motion.button
                  onClick={handleCTAClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative overflow-hidden w-full px-10 py-5 rounded-2xl font-bold text-lg text-white bg-[var(--surface)] border border-[var(--accent)]/30 shadow-[0_8px_40px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] hover:border-[var(--accent)]/60 hover:shadow-[0_8px_50px_rgba(0,102,255,0.15),inset_0_1px_0_rgba(255,255,255,0.2)] cursor-pointer transition-all duration-400 group"
                >
                  <motion.div className="absolute top-0 bottom-0 w-[150%] bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
                    animate={{ left: ['-150%', '150%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  />
                  <div className="absolute inset-0 bg-[var(--accent)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    🚀 {t.ctaFinalText}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                  </span>
                </motion.button>
              </motion.section>

              {/* Footer */}
              <motion.footer initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="text-center pt-6 pb-10">
                <p className="text-sm text-[var(--text-dim)]">{t.madeBy} <span className="text-cyan-400">&#x1F499;</span> {t.byDaniel}</p>
              </motion.footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
