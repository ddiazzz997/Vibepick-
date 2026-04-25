import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
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
import HowItWorks from './components/HowItWorks'
import FAQ from './components/FAQ'
import PaywallModal from './components/PaywallModal'
import { AIFieldAssistant } from './components/AIFieldAssistant'
import AdminApp from './AdminApp'
import RetentionPopup from './components/RetentionPopup'
import { useSessionTracker } from './hooks/useSessionTracker'
import Navbar from './components/Navbar'
import SocialProofCounter from './components/SocialProofCounter'
import PricingSection from './components/PricingSection'
import SiteProgressBar from './components/SiteProgressBar'
import CreditsModal from './components/CreditsModal'
import AffiliatesSection from './components/AffiliatesSection'
import { useCredits } from './hooks/useCredits'
import { usePromptHistory } from './hooks/usePromptHistory'
import PromptHistorySidebar from './components/PromptHistorySidebar'
import UserProfileCard from './components/UserProfileCard'
import TestimonialsCarousel from './components/TestimonialsCarousel'
import BadgesDisplay from './components/BadgesDisplay'
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
  const { user, profile, isLoading, setShowAuth, signOut, incrementPromptCount, fullUser } = useAuth()

  // ── Admin dashboard ─────────────────────────────────
  const isAdmin = new URLSearchParams(window.location.search).get('admin') === 'vibepick2026'

  const [showPlatform, setShowPlatform] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Auto-enter platform when a valid session is detected (page refresh, return visit, etc.)
  useEffect(() => {
    if (!isLoading && user) setShowPlatform(true)
  }, [user, isLoading])

  // ── Credits system ───────────────────────────────────
  const isPro = profile?.is_pro ?? false
  const {
    credits,
    showCreditModal,
    setShowCreditModal,
    spendCredit,
  } = useCredits(!!user, isPro)

  // ── Prompt history ───────────────────────────────────
  const { savePrompt } = usePromptHistory()
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | undefined>()

  const [desc, setDesc] = useState('')
  const [niche, setNiche] = useState('')
  const [customNiche, setCustomNiche] = useState('')
  const [vibe, setVibe] = useState<string | null>(null)
  const [customVibe, setCustomVibe] = useState('')
  const vibeSuggestions = ['Vibrante', 'Neón', 'Minimalista', 'Cálido', 'Tecnológico', 'Elegante', 'Futurista', 'Orgánico']
  const [sections, setSections] = useState<string[]>(['Hero', 'Social Proof', 'Features', 'Footer'])
  const [cta, setCta] = useState('')
  // Step 6 — Contact & Socials
  const [whatsappCode, setWhatsappCode] = useState('+1')
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [instagram, setInstagram] = useState('')
  const [facebook, setFacebook] = useState('')
  const [tiktok, setTiktok] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [customLinks, setCustomLinks] = useState<string[]>([''])
  // Step 7 — Site Language
  const [siteLang, setSiteLang] = useState('Español')
  // Step 8 — Asset Uploads
  const [logoDataUrl, setLogoDataUrl] = useState('')
  const [logoAnnotation, setLogoAnnotation] = useState('')
  const [assets, setAssets] = useState<Array<{ dataUrl: string; annotation: string; isVideo?: boolean }>>([{ dataUrl: '', annotation: '', isVideo: false }])
  const [inspirations, setInspirations] = useState<Array<{ dataUrl: string; annotation: string }>>([{ dataUrl: '', annotation: '' }])
  // Step 8b — Testimonials
  const [testimonials, setTestimonials] = useState<Array<{ name: string; role: string; text: string; photo: string }>>([{ name: '', role: '', text: '', photo: '' }])

  const formRef = useRef<HTMLDivElement>(null)
  const effectiveNiche = customNiche || niche
  const effectiveVibe = customVibe || vibe

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
        vibe: effectiveVibe,
        sections,
        cta,
        lang,
        siteLang: siteLang || undefined,
        whatsapp: whatsappNumber ? whatsappCode.replace('+', '') + whatsappNumber : undefined,
        instagram: instagram || undefined,
        facebook: facebook || undefined,
        tiktok: tiktok || undefined,
        linkedin: linkedin || undefined,
        customLinks: customLinks.filter(l => l.trim() !== ''),
        logoDataUrl: logoDataUrl || undefined,
        logoAnnotation: logoAnnotation || undefined,
        assets,
        inspirations,
        testimonials,
      }),
    [desc, effectiveNiche, effectiveVibe, sections, cta, lang, siteLang, whatsappCode, whatsappNumber, instagram, facebook, tiktok, linkedin, customLinks, logoDataUrl, logoAnnotation, assets, inspirations, testimonials],
  )

  /* Handle image paste */
  const handlePasteImage = useCallback((callback: (dataUrl: string) => void) => (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const dataUrl = ev.target?.result as string;
            callback(dataUrl);
          };
          reader.readAsDataURL(file);
          e.preventDefault();
        }
      }
    }
  }, []);

  /* Handle auth success → go to platform */
  const handleAuthSuccess = useCallback(() => {
    setShowPlatform(true)
  }, [])

  // ── Session tracker (fires when user is authenticated) ──
  const trackerUser = fullUser ? { email: fullUser.email, name: `${fullUser.firstName} ${fullUser.lastName}` } : null
  useSessionTracker(trackerUser, profile?.prompt_count ?? 0)

  /* Handle CTA clicks → open auth or go to platform */
  const handleCTAClick = useCallback(() => {
    if (user) {
      setShowPlatform(true)
    } else {
      setShowAuth(true)
    }
  }, [user, setShowAuth])

  /* Handle prompt copy → credit-gated */
  const isLocked = Boolean(user && !isPro && credits <= 0)

  const handlePromptCopy = useCallback(async () => {
    if (!user) return
    if (!isPro) {
      const allowed = spendCredit()
      if (!allowed) return
      await incrementPromptCount()
    }
    if (desc.trim()) {
      await savePrompt(user.id, {
        description: desc,
        vibe: effectiveVibe || undefined,
        sections,
        prompt_text: prompt,
      })
    }
  }, [user, isPro, spendCredit, incrementPromptCount, desc, effectiveVibe, sections, prompt, savePrompt])

  const handleExportZip = useCallback(async () => {
    try {
      const filesToExport: { path: string; contents: string | Blob; isBase64Image?: boolean }[] = []
      filesToExport.push({ path: 'project_instructions.md', contents: prompt })

      const addImageObj = (dataUrl: string, path: string) => {
        if (!dataUrl || !dataUrl.startsWith('data:')) return
        const arr = dataUrl.split(',')
        if (arr.length < 2) return
        const b64 = arr[1]
        filesToExport.push({ path, contents: b64, isBase64Image: true })
      }

      addImageObj(logoDataUrl, 'public/logo.png')
      assets.forEach((a, i) => addImageObj(a.dataUrl, `public/asset_${i + 1}.png`))
      testimonials.forEach((t, i) => { if (t.photo) addImageObj(t.photo, `public/testimonial_${i + 1}.jpg`) })
      inspirations.forEach((insp, i) => addImageObj(insp.dataUrl, `design_references/inspiration_${i + 1}.png`))

      // ATTEMPT FILE SYSTEM ACCESS API
      if ('showDirectoryPicker' in window) {
        try {
          const dirHandle = await (window as any).showDirectoryPicker({
            mode: 'readwrite',
            startIn: 'desktop'
          });

          const projectDir = await dirHandle.getDirectoryHandle(`proyecto_vibepick_${new Date().getTime()}`, { create: true });

          const writeHandle = async (parentHandle: any, pathParts: string[], fileEntry: any) => {
            let currentDir = parentHandle;
            for (let i = 0; i < pathParts.length - 1; i++) {
              currentDir = await currentDir.getDirectoryHandle(pathParts[i], { create: true });
            }
            const fileName = pathParts[pathParts.length - 1];
            const fileHandle = await currentDir.getFileHandle(fileName, { create: true });
            const writable = await fileHandle.createWritable();

            if (fileEntry.isBase64Image) {
              const byteString = atob(fileEntry.contents as string);
              const ab = new ArrayBuffer(byteString.length);
              const ia = new Uint8Array(ab);
              for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
              }
              const blob = new Blob([ab], { type: 'image/png' });
              await writable.write(blob);
            } else {
              await writable.write(fileEntry.contents);
            }
            await writable.close();
          }

          for (const fileItem of filesToExport) {
            const parts = fileItem.path.split('/');
            await writeHandle(projectDir, parts, fileItem);
          }

          if (!user || !profile || profile.is_pro) return
          if (!isPro) {
            const allowed = spendCredit()
            if (!allowed) return
            await incrementPromptCount()
          }
          return; // SUCCESS!

        } catch (fsError: any) {
          if (fsError.name === 'AbortError') return;
          console.warn('File System API failed, falling back to ZIP', fsError);
        }
      }

      // FALLBACK TO JSZIP
      const JSZip = (await import('jszip')).default
      const fileSaver = await import('file-saver')
      const saveAs = fileSaver.saveAs || fileSaver.default?.saveAs || fileSaver.default

      const zip = new JSZip()
      for (const fileItem of filesToExport) {
        if (fileItem.isBase64Image) {
          zip.file(fileItem.path, fileItem.contents as string, { base64: true })
        } else {
          zip.file(fileItem.path, fileItem.contents as string)
        }
      }

      const blob = await zip.generateAsync({ type: 'blob' })
      saveAs(blob, `proyecto_vibepick_${new Date().getTime()}.zip`)

      if (!user || !profile || profile.is_pro) return
      await incrementPromptCount()
    } catch (err) {
      console.error('Error generating export', err)
    }
  }, [prompt, logoDataUrl, assets, testimonials, inspirations, user, profile, incrementPromptCount])

  if (isLoading) return null

  // ── Admin panel ─────────────────────────────────────
  if (isAdmin) return <AdminApp />

  return (
    <>
      {/* Retention popup for power users */}
      {user && profile && (
        <RetentionPopup
          sessionCount={fullUser?.sessionCount ?? 0}
          totalMinutes={fullUser?.totalMinutes ?? 0}
          isPro={profile.is_pro}
          firstName={profile.first_name}
        />
      )}
      {showPlatform && <LangToggle />}

      {/* ── Fixed UI: sidebar toggle + user profile (fuera del motion.div para que position:fixed funcione) ── */}
      {showPlatform && (
        <>
          <button
            onClick={() => setSidebarOpen(v => !v)}
            style={{
              position:     'fixed',
              left:         sidebarOpen ? '244px' : '0px',
              top:          '50%',
              transform:    'translateY(-50%)',
              background:   'rgba(0,102,255,0.15)',
              border:       '1px solid rgba(0,102,255,0.3)',
              borderRadius: sidebarOpen ? '8px 0 0 8px' : '0 8px 8px 0',
              zIndex:       150,
              width:        '28px',
              height:       '52px',
              cursor:       'pointer',
              display:      'flex',
              alignItems:   'center',
              justifyContent: 'center',
              color:        'rgba(96,165,250,0.9)',
              transition:   'left 0.25s ease, border-radius 0.25s ease, background 0.15s',
              padding:      0,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,102,255,0.28)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,102,255,0.15)')}
            aria-label={sidebarOpen ? 'Cerrar historial' : 'Abrir historial'}
          >
            {sidebarOpen ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            )}
          </button>

          {user && profile && (
            <UserProfileCard
              firstName={profile.first_name}
              lastName={profile.last_name}
              email={user.email}
              credits={credits}
              isPro={isPro}
              onSignOut={() => {
                signOut()
                setShowPlatform(false)
              }}
            />
          )}
        </>
      )}

      <AuthModal onSuccess={handleAuthSuccess} />
      <PaywallModal show={showPaywall} />
      <CreditsModal
        show={showCreditModal}
        credits={credits}
        onClose={() => setShowCreditModal(false)}
        onUpgrade={() => setShowCreditModal(false)}
      />

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

            <div className="relative z-10 flex">
              {/* Sidebar */}
              <PromptHistorySidebar
                onSelect={(item) => {
                  setDesc(item.description)
                  setSelectedHistoryId(item.id)
                }}
                onNewSession={() => {
                  setDesc('')
                  setSelectedHistoryId(undefined)
                }}
                selectedId={selectedHistoryId}
                isOpen={sidebarOpen}
              />
              <div className="flex-1 min-w-0">
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
                {/* ── Site Progress Bar ── */}
                <SiteProgressBar
                  desc={desc}
                  niche={effectiveNiche}
                  vibe={effectiveVibe}
                  sections={sections}
                  cta={cta}
                  whatsappNumber={whatsappNumber}
                  logoDataUrl={logoDataUrl}
                  assetUrl={assets[0]?.dataUrl || ''}
                  testimonialText={testimonials[0]?.text || ''}
                />
                <BadgesDisplay
                  promptCount={profile?.prompt_count ?? 0}
                  siteScore={(() => {
                    let s = 0
                    if (desc.trim().length > 10) s += 20
                    if (effectiveNiche) s += 15
                    if (effectiveVibe) s += 15
                    if (sections.length >= 4) s += 10
                    if (cta.trim().length > 2) s += 10
                    if (whatsappNumber.length > 5) s += 10
                    if (logoDataUrl) s += 10
                    if (assets[0]?.dataUrl) s += 5
                    if (testimonials[0]?.text?.trim().length > 5) s += 5
                    return s
                  })()}
                  socialCount={[instagram, facebook, tiktok, linkedin].filter(v => v.trim()).length}
                  hasLogo={!!logoDataUrl}
                  hasAsset={!!(assets[0]?.dataUrl)}
                  testimonialCount={testimonials.filter(t => t.text.trim().length > 5).length}
                />
                <div className="relative flex flex-col gap-14">
                  <div className="absolute top-8 bottom-8 left-[48px] w-px bg-gradient-to-b from-transparent via-[var(--accent)]/30 to-transparent z-0 hidden sm:block" />
                  <div className="absolute top-8 bottom-8 left-[36px] w-px bg-gradient-to-b from-transparent via-[var(--accent)]/30 to-transparent z-0 sm:hidden" />

                  {/* 1 — Describe */}
                  <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.55 }} className="glass-panel">
                    <Step n={1} title={t.step1Title} />
                    <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder={t.step1Placeholder} rows={3} className="input-glow" />
                    <AIFieldAssistant fieldType="description" contextData={{ niche: effectiveNiche, vibe: effectiveVibe || '' }} onSelect={setDesc} language={lang} />
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

                    {/* Custom Vibe Bubbles */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {vibeSuggestions.map((sug) => (
                        <button
                          key={sug}
                          onClick={() => {
                            const newVibe = customVibe ? `${customVibe}, ${sug}` : sug
                            setCustomVibe(newVibe)
                            setVibe(null)
                          }}
                          className="px-3 py-1 text-[11px] font-medium tracking-wider uppercase rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white/70 hover:text-white transition-all duration-200 cursor-pointer"
                        >
                          + {sug}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={customVibe}
                      onChange={(e) => { setCustomVibe(e.target.value); setVibe(null) }}
                      placeholder={lang === 'es' ? 'O escribe tu estilo: ej. vibrante, cálido, tecnológico y neón...' : 'Or type your style: e.g. vibrant, warm, tech, neon...'}
                      className="input-glow mb-2"
                    />

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {vibes.map((v, i) => (
                        <motion.div key={v.id} initial={{ opacity: 0, y: 20, scale: 0.92 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.07 * i, ease: [0.25, 0.1, 0.25, 1] }}>
                          <VibeCard id={v.id} label={v.label} selected={vibe === v.id && !customVibe} onClick={() => { setVibe(v.id); setCustomVibe('') }}>
                            {v.mockup}
                          </VibeCard>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-6 flex justify-start">
                      <AIFieldAssistant fieldType="brandVoice" contextData={{ description: desc, niche: effectiveNiche }} onSelect={(v) => { setCustomVibe(v); setVibe(null) }} language={lang} />
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
                    <AIFieldAssistant fieldType="offer" contextData={{ description: desc, niche: effectiveNiche }} onSelect={setCta} language={lang} />
                  </motion.section>

                  {/* 6 — Contact & Socials */}
                  <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.55 }} className="glass-panel">
                    <Step n={6} title={lang === 'es' ? 'Contacto y Redes Sociales' : 'Contact & Social Media'} sub={lang === 'es' ? 'Los enlaces se generarán funcionales y con los logos originales de cada red.' : 'Links will be generated functional with each network\'s original logos.'} />
                    <div className="flex flex-col gap-2.5">

                      {/* WhatsApp */}
                      <motion.div whileHover={{ scale: 1.01 }} className="flex items-center gap-0 rounded-xl border border-[var(--border)] overflow-hidden bg-[#25D366]/5 hover:border-[#25D366]/40 transition-colors duration-200" style={{ borderLeft: '3px solid #25D366' }}>
                        <div className="flex items-center justify-center w-14 h-14 shrink-0" style={{ background: 'rgba(37,211,102,0.08)' }}>
                          <svg width="26" height="26" viewBox="0 0 24 24" fill="#25D366" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                            <path d="M12 2C6.486 2 2 6.486 2 12c0 1.89.518 3.656 1.416 5.168L2 22l4.932-1.391A9.944 9.944 0 0012 22c5.514 0 10-4.486 10-10S17.514 2 12 2zm0 18c-1.71 0-3.306-.45-4.688-1.234l-.336-.2-3.478.98.939-3.39-.222-.347A7.947 7.947 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                          </svg>
                        </div>
                        <div className="flex-1 pr-3">
                          <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: '#25D366' }}>WhatsApp</p>
                          <div className="flex items-center gap-1">
                            {/* Country code */}
                            <select
                              value={whatsappCode}
                              onChange={(e) => setWhatsappCode(e.target.value)}
                              className="bg-[#25D366]/10 border border-[#25D366]/20 rounded-lg text-xs text-white font-mono px-1.5 py-1 outline-none cursor-pointer"
                              style={{ minWidth: '78px' }}
                            >
                              {[
                                { c: '+1', f: '🇺🇸' }, { c: '+52', f: '🇲🇽' }, { c: '+57', f: '🇨🇴' },
                                { c: '+54', f: '🇦🇷' }, { c: '+55', f: '🇧🇷' }, { c: '+56', f: '🇨🇱' },
                                { c: '+51', f: '🇵🇪' }, { c: '+593', f: '🇪🇨' }, { c: '+58', f: '🇻🇪' },
                                { c: '+34', f: '🇪🇸' }, { c: '+44', f: '🇬🇧' }, { c: '+49', f: '🇩🇪' },
                                { c: '+33', f: '🇫🇷' }, { c: '+39', f: '🇮🇹' }, { c: '+81', f: '🇯🇵' },
                                { c: '+86', f: '🇨🇳' }
                              ].map(({ c, f }) => (
                                <option key={c} value={c} className="bg-[#0a0e1a]">{f} {c}</option>
                              ))}
                            </select>
                            <input
                              type="tel"
                              value={whatsappNumber}
                              onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, ''))}
                              placeholder={lang === 'es' ? 'Número local (ej: 3001234567)' : 'Local number (e.g. 3051234567)'}
                              className="flex-1 bg-transparent text-sm text-white placeholder-[var(--text-dim)] outline-none border-none font-mono"
                            />
                          </div>
                        </div>
                      </motion.div>


                      {/* Instagram */}
                      <motion.div whileHover={{ scale: 1.01 }} className="flex items-center gap-0 rounded-xl border border-[var(--border)] overflow-hidden bg-[#E1306C]/5 hover:border-[#E1306C]/40 transition-colors duration-200" style={{ borderLeft: '3px solid #E1306C' }}>
                        <div className="flex items-center justify-center w-14 h-14 shrink-0" style={{ background: 'rgba(225,48,108,0.08)' }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                              <linearGradient id="ig-grad" x1="0" y1="24" x2="24" y2="0" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#f09433" />
                                <stop offset="25%" stopColor="#e6683c" />
                                <stop offset="50%" stopColor="#dc2743" />
                                <stop offset="75%" stopColor="#cc2366" />
                                <stop offset="100%" stopColor="#bc1888" />
                              </linearGradient>
                            </defs>
                            <rect x="2" y="2" width="20" height="20" rx="5.5" stroke="url(#ig-grad)" strokeWidth="1.8" fill="none" />
                            <circle cx="12" cy="12" r="4.2" stroke="url(#ig-grad)" strokeWidth="1.8" fill="none" />
                            <circle cx="17.5" cy="6.5" r="1.1" fill="url(#ig-grad)" />
                          </svg>
                        </div>
                        <div className="flex-1 pr-3">
                          <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: '#E1306C' }}>Instagram</p>
                          <input
                            type="url"
                            value={instagram}
                            onChange={(e) => setInstagram(e.target.value)}
                            placeholder="https://instagram.com/tu_perfil"
                            className="w-full bg-transparent text-sm text-white placeholder-[var(--text-dim)] outline-none border-none"
                          />
                        </div>
                      </motion.div>

                      {/* Facebook */}
                      <motion.div whileHover={{ scale: 1.01 }} className="flex items-center gap-0 rounded-xl border border-[var(--border)] overflow-hidden bg-[#1877F2]/5 hover:border-[#1877F2]/40 transition-colors duration-200" style={{ borderLeft: '3px solid #1877F2' }}>
                        <div className="flex items-center justify-center w-14 h-14 shrink-0" style={{ background: 'rgba(24,119,242,0.08)' }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
                            <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.024 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.514c-1.491 0-1.956.93-1.956 1.874v2.278h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
                          </svg>
                        </div>
                        <div className="flex-1 pr-3">
                          <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: '#1877F2' }}>Facebook</p>
                          <input
                            type="url"
                            value={facebook}
                            onChange={(e) => setFacebook(e.target.value)}
                            placeholder="https://facebook.com/tu_pagina"
                            className="w-full bg-transparent text-sm text-white placeholder-[var(--text-dim)] outline-none border-none"
                          />
                        </div>
                      </motion.div>

                      {/* TikTok */}
                      <motion.div whileHover={{ scale: 1.01 }} className="flex items-center gap-0 rounded-xl border border-[var(--border)] overflow-hidden bg-white/5 hover:border-white/20 transition-colors duration-200" style={{ borderLeft: '3px solid #ffffff' }}>
                        <div className="flex items-center justify-center w-14 h-14 shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
                          </svg>
                        </div>
                        <div className="flex-1 pr-3">
                          <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5 text-white/60">TikTok</p>
                          <input
                            type="url"
                            value={tiktok}
                            onChange={(e) => setTiktok(e.target.value)}
                            placeholder="https://tiktok.com/@tu_usuario"
                            className="w-full bg-transparent text-sm text-white placeholder-[var(--text-dim)] outline-none border-none"
                          />
                        </div>
                      </motion.div>

                      {/* LinkedIn */}
                      <motion.div whileHover={{ scale: 1.01 }} className="flex items-center gap-0 rounded-xl border border-[var(--border)] overflow-hidden bg-[#0A66C2]/5 hover:border-[#0A66C2]/40 transition-colors duration-200" style={{ borderLeft: '3px solid #0A66C2' }}>
                        <div className="flex items-center justify-center w-14 h-14 shrink-0" style={{ background: 'rgba(10,102,194,0.08)' }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="#0A66C2" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                        </div>
                        <div className="flex-1 pr-3">
                          <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: '#0A66C2' }}>LinkedIn</p>
                          <input
                            type="url"
                            value={linkedin}
                            onChange={(e) => setLinkedin(e.target.value)}
                            placeholder="https://linkedin.com/in/tu_perfil"
                            className="w-full bg-transparent text-sm text-white placeholder-[var(--text-dim)] outline-none border-none"
                          />
                        </div>
                      </motion.div>

                      {/* Custom Links — múltiples */}
                      {customLinks.map((link, idx) => (
                        <motion.div
                          key={idx}
                          whileHover={{ scale: 1.01 }}
                          className="flex items-center gap-0 rounded-xl border border-[var(--border)] overflow-hidden bg-white/5 hover:border-white/20 transition-colors duration-200"
                          style={{ borderLeft: '3px solid #64748B' }}
                        >
                          <div
                            className="flex items-center justify-center w-14 h-14 shrink-0"
                            style={{ background: 'rgba(255,255,255,0.05)' }}
                          >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                            </svg>
                          </div>
                          <div className="flex-1 pr-2">
                            <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: '#94A3B8' }}>
                              {lang === 'es'
                                ? idx === 0 ? 'Otro Enlace' : `Enlace ${idx + 1}`
                                : idx === 0 ? 'Other Link' : `Link ${idx + 1}`}
                            </p>
                            <input
                              type="url"
                              value={link}
                              onChange={(e) => {
                                const updated = [...customLinks]
                                updated[idx] = e.target.value
                                setCustomLinks(updated)
                              }}
                              placeholder="https://tudominio.com"
                              className="w-full bg-transparent text-sm text-white placeholder-[var(--text-dim)] outline-none border-none"
                            />
                          </div>
                          {idx > 0 && (
                            <button
                              onClick={() => setCustomLinks(prev => prev.filter((_, i) => i !== idx))}
                              className="mr-2 text-slate-600 hover:text-red-400 transition-colors p-1 rounded"
                              title={lang === 'es' ? 'Eliminar enlace' : 'Remove link'}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            </button>
                          )}
                        </motion.div>
                      ))}

                      {/* Botón "+" para agregar nuevo enlace — máximo 5 */}
                      {customLinks.length < 5 && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setCustomLinks(prev => [...prev, ''])}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-slate-700 hover:border-slate-500 bg-transparent text-slate-500 hover:text-slate-300 text-xs font-medium transition-all duration-200 cursor-pointer w-full justify-center"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                          {lang === 'es' ? 'Agregar otro enlace' : 'Add another link'}
                        </motion.button>
                      )}

                    </div>
                    <AIFieldAssistant fieldType="contact" contextData={{ niche: effectiveNiche }} onSelect={() => {}} language={lang} />
                  </motion.section>


                  {/* 7 — Site Language */}
                  <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.55 }} className="glass-panel">
                    <Step n={7} title={lang === 'es' ? 'Idioma del sitio web' : 'Website Language'} sub={lang === 'es' ? '¿En qué idioma se generará todo el contenido del sitio?' : 'In what language should the entire site content be generated?'} />
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                      {['Español', 'English', 'Portuguese', 'French', 'Italian', 'German'].map((l) => (
                        <motion.button key={l} onClick={() => { setSiteLang(l) }}
                          whileHover={{ y: -2, scale: 1.03 }} whileTap={{ scale: 0.95 }}
                          className={`px-4 py-2.5 rounded-xl border text-sm font-medium cursor-pointer transition-all duration-200
                            ${siteLang === l ? 'bg-white/10 border-white/20 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]' : 'bg-[var(--surface-raised)] border-[var(--border)] text-[var(--text-muted)] hover:text-white hover:border-[var(--border-hover)]'}`}>
                          {l}
                        </motion.button>
                      ))}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={['Español', 'English', 'Portuguese', 'French', 'Italian', 'German'].includes(siteLang) ? '' : siteLang}
                        onChange={(e) => setSiteLang(e.target.value)}
                        placeholder={lang === 'es' ? 'Otro idioma (ej: Catalan, Japanese, Arabic…)' : 'Other language (e.g. Catalan, Japanese, Arabic…)'}
                        className="input-glow text-sm"
                      />
                    </div>
                  </motion.section>

                  {/* 8 — Asset Uploads */}
                  <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.55 }} className="glass-panel">
                    <Step n={8} title={lang === 'es' ? 'Tus Recursos Visuales' : 'Your Visual Assets'} sub={lang === 'es' ? 'Sube tu logo e imágenes + descríbelas. El prompt incluirá las anotaciones para que el IA sepa cómo usarlas.' : 'Upload your logo and images + describe them. The prompt will include annotations so the AI knows how to use them.'} />
                    <div className="flex flex-col gap-5">

                      {/* Logo */}
                      <div className="flex flex-col gap-3">
                        <label className="text-sm font-semibold text-white flex items-center gap-2">
                          {lang === 'es' ? '🎨 Logo' : '🎨 Logo'}
                          <span className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-medium transition-all duration-200 ${logoDataUrl ? 'border-green-500/40 bg-green-500/10 text-green-400' : 'border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-muted)] hover:text-white hover:border-[var(--border-hover)]'}`}>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                const reader = new FileReader()
                                reader.onload = (ev) => {
                                  const dataUrl = ev.target?.result as string
                                  setLogoDataUrl(dataUrl)
                                }
                                reader.readAsDataURL(file)
                              }
                            }} />
                            📤 {logoDataUrl ? (lang === 'es' ? 'Logo cargado ✓' : 'Logo loaded ✓') : (lang === 'es' ? 'Subir foto del logo' : 'Upload logo image')}
                          </span>
                        </label>
                        {logoDataUrl && (
                          <div className="relative inline-block w-fit mb-2">
                            <img src={logoDataUrl} alt="Logo" className="h-16 w-auto rounded-lg border border-[var(--border)] object-contain bg-white/5 p-1" />
                            <button onClick={() => setLogoDataUrl('')} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center cursor-pointer border-none shadow-md hover:bg-red-600 transition-colors">×</button>
                          </div>
                        )}
                        <textarea
                          rows={2}
                          onPaste={handlePasteImage((dataUrl) => setLogoDataUrl(dataUrl))}
                          value={logoAnnotation}
                          onChange={(e) => setLogoAnnotation(e.target.value)}
                          placeholder={lang === 'es' ? '✏️ Describe tu logo en breve (ej: Logo blanco, minimalista) o usa Ctrl+V para pegar imagen aquí...' : '✏️ Describe your logo briefly (e.g. White minimalist) or press Ctrl+V to paste image...'}
                          className="w-full bg-[var(--surface)] text-white border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors resize-none placeholder:text-[var(--text-dim)]"
                        />
                      </div>



                      {/* Images & Videos — dynamic */}
                      {assets.map((_, i) => {
                        const isVid = assets[i]?.dataUrl?.startsWith('data:video');
                        return (
                          <div key={i} className="relative">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs text-[var(--text-muted)] font-medium">
                                {lang === 'es' ? `📸 Recurso (Imagen/Video) ${i + 1}` : `📸 Asset (Image/Video) ${i + 1}`}
                              </p>
                              {assets.length > 1 && (
                                <button
                                  onClick={() => setAssets(assets.filter((_, idx) => idx !== i))}
                                  className="text-[10px] text-red-400/70 hover:text-red-400 transition-colors cursor-pointer bg-transparent border-none"
                                >
                                  {lang === 'es' ? '✕ Eliminar' : '✕ Remove'}
                                </button>
                              )}
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer mb-2">
                              <span className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-medium transition-all duration-200 ${assets[i]?.dataUrl ? 'border-green-500/40 bg-green-500/10 text-green-400' : 'border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-muted)] hover:text-white hover:border-[var(--border-hover)]'
                                }`}>
                                📤 {assets[i]?.dataUrl ? (lang === 'es' ? 'Recurso cargado ✓' : 'Asset loaded ✓') : (lang === 'es' ? 'Subir Imagen/Video' : 'Upload Image/Video')}
                              </span>
                              <input type="file" accept="image/*,video/mp4,video/webm" className="hidden" onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (!file) return

                                if (file.size > 15 * 1024 * 1024) {
                                  alert(lang === 'es' ? 'El archivo es demasiado grande. Selecciona algo menor a 15MB.' : 'File too large. Choose under 15MB.');
                                  return;
                                }

                                const reader = new FileReader()
                                reader.onload = (ev) => {
                                  const dataUrl = ev.target?.result as string
                                  const updated = [...assets]
                                  updated[i] = { ...updated[i], dataUrl, isVideo: file.type.startsWith('video/') }
                                  setAssets(updated)
                                }
                                reader.readAsDataURL(file)
                              }} />
                            </label>
                            {assets[i]?.dataUrl && (
                              <div className="relative mb-2 inline-block">
                                {isVid ? (
                                  <video src={assets[i].dataUrl} controls className="h-20 w-auto rounded-lg border border-[var(--border)] object-cover bg-black" />
                                ) : (
                                  <img src={assets[i].dataUrl} alt={`Asset ${i + 1}`} className="h-20 w-auto rounded-lg border border-[var(--border)] object-cover bg-white/5" />
                                )}
                                <button onClick={() => { const u = [...assets]; u[i] = { ...u[i], dataUrl: '', isVideo: false }; setAssets(u) }} className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center cursor-pointer border-none shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10">×</button>
                              </div>
                            )}
                            <textarea
                              onPaste={handlePasteImage((dataUrl) => {
                                const updated = [...assets]
                                updated[i] = { ...updated[i], dataUrl }
                                setAssets(updated)
                              })}
                              value={assets[i]?.annotation || ''}
                              onChange={(e) => {
                                const updated = [...assets]
                                updated[i] = { ...updated[i], annotation: e.target.value }
                                setAssets(updated)
                              }}
                              placeholder={lang === 'es'
                                ? `¿Qué es? (o usa Ctrl+V para pegar foto aquí)`
                                : `What is this? (or press Ctrl+V to paste)`}
                              rows={2} className="input-glow text-sm" />
                          </div>
                        );
                      })}
                      {/* Add media button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        onClick={() => setAssets([...assets, { dataUrl: '', annotation: '', isVideo: false }])}
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-dashed border-[var(--border)] text-[var(--text-muted)] hover:text-white hover:border-[var(--border-hover)] text-xs font-medium transition-all duration-200 cursor-pointer bg-transparent"
                      >
                        <span className="text-base leading-none">＋</span>
                        {lang === 'es' ? 'Agregar Imagen / Video' : 'Add Image / Video'}
                      </motion.button>

                      {/* Testimonials — dynamic */}
                      <div className="pt-2">
                        <p className="text-xs text-[var(--text-muted)] mb-3 font-medium">
                          {lang === 'es' ? '💬 Testimonios de Clientes' : '💬 Customer Testimonials'}
                        </p>
                        <div className="flex flex-col gap-4">
                          {testimonials.map((t_item, i) => (
                            <div key={i} className="bg-white/3 border border-white/8 rounded-xl p-3.5 flex flex-col gap-2.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]/70">
                                  {lang === 'es' ? `Testimonio ${i + 1}` : `Testimonial ${i + 1}`}
                                </span>
                                {testimonials.length > 1 && (
                                  <button
                                    onClick={() => setTestimonials(testimonials.filter((_, idx) => idx !== i))}
                                    className="text-[10px] text-red-400/70 hover:text-red-400 transition-colors cursor-pointer bg-transparent border-none"
                                  >
                                    {lang === 'es' ? '✕ Eliminar' : '✕ Remove'}
                                  </button>
                                )}
                              </div>

                              {/* Photo row */}
                              <div className="flex items-center gap-3">
                                {/* Avatar preview or placeholder */}
                                <div className="relative shrink-0">
                                  {t_item.photo ? (
                                    <div className="relative">
                                      <img src={t_item.photo} alt="foto" className="w-14 h-14 rounded-full object-cover border-2 border-[var(--accent)]/40 bg-white/5" />
                                      <button
                                        onClick={() => { const u = [...testimonials]; u[i] = { ...u[i], photo: '' }; setTestimonials(u) }}
                                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center cursor-pointer border-none"
                                      >×</button>
                                    </div>
                                  ) : (
                                    <div className="w-14 h-14 rounded-full border border-dashed border-[var(--border)] bg-white/3 flex items-center justify-center text-[var(--text-dim)] text-xl">
                                      👤
                                    </div>
                                  )}
                                </div>
                                {/* Upload / paste button */}
                                <label
                                  onPaste={handlePasteImage((dataUrl) => { const u = [...testimonials]; u[i] = { ...u[i], photo: dataUrl }; setTestimonials(u) })}
                                  className="flex-1 cursor-pointer"
                                >
                                  <span className={`flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg border text-xs font-medium transition-all duration-200 ${t_item.photo ? 'border-green-500/40 bg-green-500/10 text-green-400' : 'border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-muted)] hover:text-white hover:border-[var(--border-hover)]'
                                    }`}>
                                    📸 {t_item.photo ? (lang === 'es' ? 'Foto cargada ✓' : 'Photo loaded ✓') : (lang === 'es' ? 'Subir foto (o Ctrl+V)' : 'Upload photo (or Ctrl+V)')}
                                  </span>
                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (!file) return
                                    const reader = new FileReader()
                                    reader.onload = (ev) => { const u = [...testimonials]; u[i] = { ...u[i], photo: ev.target?.result as string }; setTestimonials(u) }
                                    reader.readAsDataURL(file)
                                  }} />
                                </label>
                              </div>

                              {/* Name + Role */}
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  value={t_item.name}
                                  onChange={(e) => { const u = [...testimonials]; u[i] = { ...u[i], name: e.target.value }; setTestimonials(u) }}
                                  placeholder={lang === 'es' ? '👤 Nombre completo' : '👤 Full name'}
                                  className="input-glow text-sm py-2 px-3"
                                />
                                <input
                                  type="text"
                                  value={t_item.role}
                                  onChange={(e) => { const u = [...testimonials]; u[i] = { ...u[i], role: e.target.value }; setTestimonials(u) }}
                                  placeholder={lang === 'es' ? '💼 Cargo / Empresa' : '💼 Role / Company'}
                                  className="input-glow text-sm py-2 px-3"
                                />
                              </div>
                              <textarea
                                value={t_item.text}
                                onChange={(e) => { const u = [...testimonials]; u[i] = { ...u[i], text: e.target.value }; setTestimonials(u) }}
                                placeholder={lang === 'es' ? '✍️ Escribe el testimonio aquí…' : '✍️ Write the testimonial here…'}
                                rows={2}
                                className="input-glow text-sm"
                              />
                            </div>
                          ))}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                          onClick={() => setTestimonials([...testimonials, { name: '', role: '', text: '', photo: '' }])}
                          className="flex items-center justify-center gap-2 w-full mt-3 py-2.5 rounded-xl border border-dashed border-[var(--border)] text-[var(--text-muted)] hover:text-white hover:border-[var(--border-hover)] text-xs font-medium transition-all duration-200 cursor-pointer bg-transparent"
                        >
                          <span className="text-base leading-none">＋</span>
                          {lang === 'es' ? 'Agregar testimonio' : 'Add testimonial'}
                        </motion.button>
                      </div>
                    </div>
                    <AIFieldAssistant
                      fieldType="assets"
                      contextData={{ description: desc, niche: effectiveNiche }}
                      onSelect={() => {}}
                      onSelectField={(field, text) => {
                        if (field === 'logo') {
                          setLogoAnnotation(text)
                        } else if (field.startsWith('asset_')) {
                          const idx = parseInt(field.split('_')[1], 10) - 1
                          setAssets(prev => {
                            const updated = [...prev]
                            if (updated[idx]) updated[idx] = { ...updated[idx], annotation: text }
                            return updated
                          })
                        } else if (field.startsWith('testimonial_')) {
                          const parts = field.split('_')
                          const idx = parseInt(parts[1], 10)
                          const subfield = parts[2] as 'name' | 'role' | 'text'
                          setTestimonials(prev => {
                            const updated = [...prev]
                            if (updated[idx]) updated[idx] = { ...updated[idx], [subfield]: text }
                            return updated
                          })
                        }
                      }}
                      language={lang}
                    />
                  </motion.section>

                  {/* 9 — Inspiration */}
                  <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.55 }} className="glass-panel">
                    <Step n={9} title={lang === 'es' ? 'Referencias de Inspiración' : 'Inspiration References'} sub={lang === 'es' ? 'Sube capturas de sitios web que te gusten. Bolt/v0 analizarán su estilo visual y diseño.' : 'Upload screenshots of websites you love. Bolt/v0 will analyze their visual style and layout.'} />
                    <div className="flex flex-col gap-3">
                      {inspirations.map((insp, i) => (
                        <div key={`insp-${i}`} className="relative border-b border-white/5 pb-4 mb-1 last:border-0">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-[var(--text-muted)] font-medium">
                              {lang === 'es' ? `📸 Referencia ${i + 1}` : `📸 Reference ${i + 1}`}
                            </p>
                            {inspirations.length > 1 && (
                              <button
                                onClick={() => setInspirations(inspirations.filter((_, idx) => idx !== i))}
                                className="text-[10px] text-red-400/70 hover:text-red-400 transition-colors cursor-pointer bg-transparent border-none"
                              >
                                {lang === 'es' ? '✕ Eliminar' : '✕ Remove'}
                              </button>
                            )}
                          </div>
                          <label className="flex items-center gap-3 cursor-pointer mb-2">
                            <span className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-medium transition-all duration-200 ${insp.dataUrl ? 'border-green-500/40 bg-green-500/10 text-green-400' : 'border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-muted)] hover:text-white hover:border-[var(--border-hover)]'
                              }`}>
                              {insp.dataUrl ? (lang === 'es' ? 'Ref cargada ✓' : 'Ref loaded ✓') : (lang === 'es' ? 'Subir Captura' : 'Upload Screenshot')}
                            </span>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (!file) return
                              const reader = new FileReader()
                              reader.onload = (ev) => {
                                const dataUrl = ev.target?.result as string
                                const updated = [...inspirations]
                                updated[i].dataUrl = dataUrl
                                setInspirations(updated)
                              }
                              reader.readAsDataURL(file)
                            }} />
                          </label>
                          {insp.dataUrl && (
                            <div className="relative mb-2 inline-block">
                              <img src={insp.dataUrl} alt={`Inspiration ${i + 1}`} className="h-20 w-auto rounded-lg border border-[var(--border)] object-cover bg-white/5" />
                              <button onClick={() => { const u = [...inspirations]; u[i].dataUrl = ''; setInspirations(u) }} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center cursor-pointer border-none shadow-md">×</button>
                            </div>
                          )}
                          <textarea
                            onPaste={handlePasteImage((dataUrl) => {
                              const updated = [...inspirations]
                              updated[i].dataUrl = dataUrl
                              setInspirations(updated)
                            })}
                            value={insp.annotation || ''}
                            onChange={(e) => {
                              const updated = [...inspirations]
                              updated[i].annotation = e.target.value
                              setInspirations(updated)
                            }}
                            placeholder={lang === 'es'
                              ? `¿Qué te gusta de esta captura? (o pega imagen con Ctrl+V)`
                              : `What do you like here? (or Ctrl+V to paste)`}
                            rows={1} className="input-glow text-sm" />
                        </div>
                      ))}

                      {/* Botón para agregar más inspiraciones */}
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        onClick={() => setInspirations([...inspirations, { dataUrl: '', annotation: '' }])}
                        className="flex items-center justify-center gap-2 w-full mt-1 py-4 hover:border-blue-500/40 hover:bg-blue-500/10 rounded-xl border border-dashed border-[var(--border)] text-[var(--scrollbar-thumb)] hover:text-white hover:border-[var(--border-hover)] text-xs font-medium transition-all duration-200 cursor-pointer bg-transparent"
                      >
                        <span className="text-base leading-none text-blue-400">＋</span>
                        <span className="text-blue-300">
                          {lang === 'es' ? 'Agregar más fotos de referencia' : 'Add another reference photo'}
                        </span>
                      </motion.button>
                    </div>
                    <AIFieldAssistant
                      fieldType="inspiration"
                      contextData={{ niche: effectiveNiche, description: desc }}
                      onSelect={() => {}}
                      onSelectField={(field, text) => {
                        if (field.startsWith('inspiration_')) {
                          const idx = parseInt(field.split('_')[1], 10) - 1
                          setInspirations(prev => {
                            const updated = [...prev]
                            if (updated[idx]) updated[idx] = { ...updated[idx], annotation: text }
                            return updated
                          })
                        }
                      }}
                      language={lang}
                    />
                  </motion.section>

                  {/* Output */}
                  <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.55 }} className="glass-panel">
                    <PromptOutput
                      prompt={prompt}
                      isLocked={isLocked}
                      onUnlock={() => setShowPaywall(true)}
                      onCopy={handlePromptCopy}
                      onExportZip={handleExportZip}
                      onSave={user ? handlePromptCopy : undefined}
                    />
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
                    <div className="flex flex-col items-center gap-5 mb-8">
                      <p className="text-base font-bold text-white tracking-wide uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{t.followUs}</p>
                      <div className="flex items-center justify-center gap-6">
                        {[
                          { href: "https://www.instagram.com/danieldiaz.ia/", color: "hover:text-[#E1306C] hover:border-[#E1306C]/50 hover:bg-[#E1306C]/10 hover:drop-shadow-[0_0_15px_rgba(225,48,108,0.8)]", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> },
                          { href: "https://www.tiktok.com/@danieldiaz.ia", color: "hover:text-white hover:border-white/50 hover:bg-white/10 hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" /></svg> },
                          { href: "https://www.linkedin.com/in/daniel-d%C3%ADaz-b36680187/", color: "hover:text-[#0A66C2] hover:border-[#0A66C2]/50 hover:bg-[#0A66C2]/10 hover:drop-shadow-[0_0_15px_rgba(10,102,194,0.8)]", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg> },
                          { href: "https://www.facebook.com/profile.php?id=61577966199810", color: "hover:text-[#1877F2] hover:border-[#1877F2]/50 hover:bg-[#1877F2]/10 hover:drop-shadow-[0_0_15px_rgba(24,119,242,0.8)]", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg> }
                        ].map((s, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.1, y: 20 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true, margin: "50px" }}
                            transition={{ delay: i * 0.15 + 0.3, type: "spring", stiffness: 200, damping: 12 }}
                          >
                            <a
                              href={s.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex items-center justify-center w-12 h-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white/90 cursor-pointer shadow-[0_4px_15px_rgba(0,0,0,0.5)] transition-all duration-300 ${s.color}`}
                            >
                              <motion.div
                                whileHover={{ scale: 1.25, rotate: [-10, 10, -10, 0] }}
                                animate={{ y: [0, -3, 0], scale: [1, 1.05, 1], filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'] }}
                                transition={{ repeat: Infinity, duration: 3, delay: i * 0.3, ease: "easeInOut" }}
                              >
                                {s.icon}
                              </motion.div>
                            </a>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <a href="https://danieldiaz.com" target="_blank" rel="noopener noreferrer" className="block w-fit mx-auto group">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-white/10 bg-[#000000]/40 backdrop-blur-md shadow-[0_0_20px_rgba(0,119,255,0.05)] group-hover:bg-[#000000]/60 group-hover:border-[#0077ff]/30 group-hover:shadow-[0_0_25px_rgba(0,119,255,0.2)] transition-all duration-300"
                      >
                        <span className="text-[11px] font-bold text-white/50 tracking-widest uppercase">{t.madeBy}</span>
                        <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}>💙</motion.span>
                        <span className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:from-blue-400 group-hover:to-cyan-300 transition-all duration-300">{t.byDaniel}</span>
                      </motion.div>
                    </a>
                  </motion.footer>
                </div>
              </main>
              </div>{/* flex-1 */}
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
              {/* ── Navbar ── */}
              <Navbar
                onCTAClick={handleCTAClick}
                onLoginClick={() => setShowAuth(true)}
                isLoggedIn={!!user}
              />

              {/* ── HERO with 3D Robot ── */}
              <section id="caracteristicas" className="relative overflow-hidden min-h-screen">
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
                          backgroundImage: 'linear-gradient(90deg, #ffffff, #88b0ff, #0077ff, #88b0ff, #ffffff)',
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
                    <div className="relative group/cta inline-block pt-2">
                      {/* Pulse glow shadow */}
                      <div className="absolute -inset-1 bg-[var(--accent)] rounded-3xl blur-xl opacity-20 group-hover/cta:opacity-40 transition-opacity duration-700 pointer-events-none pulse" />

                      <motion.button
                        onClick={handleCTAClick}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1, duration: 0.5, type: 'spring', stiffness: 200 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative overflow-hidden px-8 py-4 sm:px-10 sm:py-5 rounded-2xl font-extrabold text-base sm:text-lg text-white bg-[var(--accent)] hover:brightness-110 shadow-[0_4px_20px_rgba(0,119,255,0.4)] hover:shadow-[0_8px_30px_rgba(0,119,255,0.6)] cursor-pointer transition-all duration-300 border-none"
                      >
                        <span className="relative z-10 flex items-center gap-3">
                          {t.welcomeCTA}
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover/cta:translate-x-1"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                        </span>
                      </motion.button>
                    </div>

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

              {/* ── Social Proof Counter ── */}
              <SocialProofCounter />

              {/* ── Persuasive Sections ── */}
              <ProblemSection />
              <div id="como-funciona"><HowItWorks /></div>
              <TestimonialsCarousel />
              <div id="caracteristicas-detalle"><BenefitsSection /></div>
              <WhyVibepick />
              <PricingSection onCTAClick={handleCTAClick} />
              <AffiliatesSection onCTAClick={handleCTAClick} />
              <div id="faq"><FAQ /></div>

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
                <div className="flex flex-col items-center gap-5 mb-8">
                  <p className="text-base font-bold text-white tracking-wide uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{t.followUs}</p>
                  <div className="flex items-center justify-center gap-6">
                    {[
                      { href: "https://www.instagram.com/danieldiaz.ia/", color: "hover:text-[#E1306C] hover:border-[#E1306C]/50 hover:bg-[#E1306C]/10 hover:drop-shadow-[0_0_15px_rgba(225,48,108,0.8)]", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> },
                      { href: "https://www.tiktok.com/@danieldiaz.ia", color: "hover:text-white hover:border-white/50 hover:bg-white/10 hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" /></svg> },
                      { href: "https://www.linkedin.com/in/daniel-d%C3%ADaz-b36680187/", color: "hover:text-[#0A66C2] hover:border-[#0A66C2]/50 hover:bg-[#0A66C2]/10 hover:drop-shadow-[0_0_15px_rgba(10,102,194,0.8)]", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg> },
                      { href: "https://www.facebook.com/profile.php?id=61577966199810", color: "hover:text-[#1877F2] hover:border-[#1877F2]/50 hover:bg-[#1877F2]/10 hover:drop-shadow-[0_0_15px_rgba(24,119,242,0.8)]", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg> }
                    ].map((s, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.1, y: 20 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true, margin: "50px" }}
                        transition={{ delay: i * 0.15 + 0.3, type: "spring", stiffness: 200, damping: 12 }}
                      >
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center justify-center w-12 h-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white/90 cursor-pointer shadow-[0_4px_15px_rgba(0,0,0,0.5)] transition-all duration-300 ${s.color}`}
                        >
                          <motion.div
                            whileHover={{ scale: 1.25, rotate: [-10, 10, -10, 0] }}
                            animate={{ y: [0, -3, 0], scale: [1, 1.05, 1], filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'] }}
                            transition={{ repeat: Infinity, duration: 3, delay: i * 0.3, ease: "easeInOut" }}
                          >
                            {s.icon}
                          </motion.div>
                        </a>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <a href="https://danieldiaz.com" target="_blank" rel="noopener noreferrer" className="block w-fit mx-auto group">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-white/10 bg-[#000000]/40 backdrop-blur-md shadow-[0_0_20px_rgba(0,119,255,0.05)] group-hover:bg-[#000000]/60 group-hover:border-[#0077ff]/30 group-hover:shadow-[0_0_25px_rgba(0,119,255,0.2)] transition-all duration-300"
                  >
                    <span className="text-[11px] font-bold text-white/50 tracking-widest uppercase">{t.madeBy}</span>
                    <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}>💙</motion.span>
                    <span className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:from-blue-400 group-hover:to-cyan-300 transition-all duration-300">{t.byDaniel}</span>
                  </motion.div>
                </a>
              </motion.footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
