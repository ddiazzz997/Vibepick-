import { useLang } from '../lib/i18n'

// SVG logos inline — no external dependencies, no flicker, no 404s
const LOGOS_ROW_1 = [
  {
    name: 'Vercel',
    svg: (
      <svg viewBox="0 0 4438 1000" fill="currentColor" aria-label="Vercel">
        <path d="M2219 0L4438 1000H0L2219 0z" />
      </svg>
    ),
  },
  {
    name: 'Supabase',
    svg: (
      <svg viewBox="0 0 109 113" fill="none" aria-label="Supabase">
        <path d="M63.7 110.3c-2.7 3.4-8.2 1.5-8.2-2.8V62.6H3.8c-4 0-6-4.7-3.3-7.6L45.3 2.7c2.7-3.4 8.2-1.5 8.2 2.8v44.9H105c4 0 6 4.7 3.3 7.6L63.7 110.3z" fill="url(#sb-grad)" />
        <defs>
          <linearGradient id="sb-grad" x1="53" y1="0" x2="53" y2="113" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3ECF8E" />
            <stop offset="1" stopColor="#1B8F5A" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    name: 'Framer',
    svg: (
      <svg viewBox="0 0 14 21" fill="currentColor" aria-label="Framer">
        <path d="M0 0h14v7H7L0 0zM0 7h7l7 7H0V7zM0 14h7l-7 7v-7z" />
      </svg>
    ),
  },
  {
    name: 'Notion',
    svg: (
      <svg viewBox="0 0 100 100" fill="currentColor" aria-label="Notion">
        <path d="M6 4.8C9.5 7.6 10.8 7.4 17.3 7l54.4-3.3c1.3 0 0.1-1.3-0.4-1.5L60.6 0.6C58.4 0.1 55.4 0 52.9 0.4l-43 3.1C7.7 3.8 6.5 4.4 6 4.8zm2.3 8.6v52.8c0 2.9 1.4 3.9 4.7 3.7l58.4-3.4c3.3-0.2 3.7-2.4 3.7-5V10.5c0-2.5-1-3.8-3.2-3.6L12 10.3c-2.4 0.2-3.7 1.5-3.7 3.1zm57.5 2.8c0.4 1.6 0 3.2-1.6 3.4l-2.6 0.5v38.9c-2.3 1.2-4.4 1.9-6.1 1.9-2.8 0-3.5-0.9-5.5-3.6L34.4 34.4V58l5.5 1.2s0 3.2-4.4 3.2L23 63c-0.4-0.8 0-2.8 1.4-3.2l3.6-1V26.2l-5-0.4c-0.4-1.6 0.6-3.9 3.2-4.1l12.3-0.8 17.5 26.8V23.1l-4.6-0.5c-0.4-2 1-3.4 2.6-3.6l12.8-0.8z" />
      </svg>
    ),
  },
  {
    name: 'Linear',
    svg: (
      <svg viewBox="0 0 100 100" fill="currentColor" aria-label="Linear">
        <path d="M1.22 51.88a50 50 0 0 0 46.9 46.9L1.22 51.88zM0 44.04L55.96 100A50 50 0 0 0 100 55.96L0 44.04zM4.45 29.14l66.41 66.41A50 50 0 0 0 95.55 70.86L4.45 29.14zM17.26 11.85l70.89 70.89A50 50 0 0 0 95.55 70.86L4.45 29.14zM29.14 4.45A50 50 0 0 0 4.45 29.14L29.14 4.45z" />
      </svg>
    ),
  },
  {
    name: 'Figma',
    svg: (
      <svg viewBox="0 0 38 57" fill="none" aria-label="Figma">
        <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE" />
        <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 0 1-19 0z" fill="#0ACF83" />
        <path d="M19 0v19h9.5a9.5 9.5 0 0 0 0-19H19z" fill="#FF7262" />
        <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E" />
        <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF" />
      </svg>
    ),
  },
  {
    name: 'Pinecone',
    svg: (
      <svg viewBox="0 0 100 100" fill="none" aria-label="Pinecone">
        <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="4" />
        <path d="M50 20 L50 80 M35 35 L65 65 M65 35 L35 65" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Arc',
    svg: (
      <svg viewBox="0 0 100 100" fill="none" aria-label="Arc">
        <path d="M50 10 C25 10 10 28 10 50 C10 72 25 90 50 90 C75 90 90 72 90 50" stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none" />
        <circle cx="90" cy="50" r="6" fill="currentColor" />
      </svg>
    ),
  },
]

// Second row has the same logos in reverse order for visual variety
const LOGOS_ROW_2 = [...LOGOS_ROW_1].reverse()

interface LogoItemProps {
  name: string
  svg: React.ReactNode
}

function LogoItem({ name, svg }: LogoItemProps) {
  return (
    <div
      className="flex items-center gap-2.5 px-6 py-2 select-none"
      style={{ minWidth: 'max-content' }}
    >
      <div
        className="w-5 h-5 opacity-40 text-white transition-opacity duration-300"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {svg}
      </div>
      <span
        className="text-sm font-semibold tracking-wide"
        style={{ color: 'rgba(255,255,255,0.25)' }}
      >
        {name}
      </span>
    </div>
  )
}

export default function TrustBanner() {
  const { lang } = useLang()
  const isEs = lang === 'es'

  return (
    <section className="py-12 relative overflow-hidden">
      {/* Fade edges */}
      <div
        className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, #000000 0%, transparent 100%)',
        }}
      />
      <div
        className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to left, #000000 0%, transparent 100%)',
        }}
      />

      {/* Label */}
      <p className="text-center text-xs uppercase tracking-[0.3em] mb-6 relative z-20"
        style={{ color: 'rgba(255,255,255,0.18)' }}>
        {isEs ? 'Construido para trabajar con las mejores herramientas' : 'Built to work with the best tools'}
      </p>

      {/* Row 1 — moves left */}
      <div className="overflow-hidden mb-3">
        <div className="marquee-left">
          {/* Duplicate for seamless loop */}
          {LOGOS_ROW_1.map((logo) => (
            <LogoItem key={`r1a-${logo.name}`} name={logo.name} svg={logo.svg} />
          ))}
          {LOGOS_ROW_1.map((logo) => (
            <LogoItem key={`r1b-${logo.name}`} name={logo.name} svg={logo.svg} />
          ))}
        </div>
      </div>

      {/* Row 2 — moves right */}
      <div className="overflow-hidden">
        <div className="marquee-right">
          {LOGOS_ROW_2.map((logo) => (
            <LogoItem key={`r2a-${logo.name}`} name={logo.name} svg={logo.svg} />
          ))}
          {LOGOS_ROW_2.map((logo) => (
            <LogoItem key={`r2b-${logo.name}`} name={logo.name} svg={logo.svg} />
          ))}
        </div>
      </div>

      {/* Subtle divider glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(236,72,153,0.2), rgba(20,184,166,0.2), transparent)',
        }}
      />
    </section>
  )
}
