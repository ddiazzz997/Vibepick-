import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface VibeCardProps {
  id: string
  label: string
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}

export default function VibeCard({ label, selected, onClick, children }: VibeCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{
        y: -5,
        scale: 1.03,
        transition: { type: 'spring', stiffness: 400, damping: 18 },
      }}
      whileTap={{ scale: 0.96 }}
      animate={selected ? { scale: [1, 1.04, 1] } : {}}
      transition={selected ? { duration: 0.35 } : undefined}
      className={`
        relative flex flex-col rounded-2xl overflow-hidden cursor-pointer text-left w-full
        border-2 transition-all duration-300 group
        ${selected
          ? 'border-[var(--accent)] shadow-[0_0_40px_rgba(0,102,255,0.25),0_0_80px_rgba(0,102,255,0.08)]'
          : 'border-[var(--border)] hover:border-[var(--border-hover)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
        }
      `}
    >
      {selected && (
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: -90 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 18 }}
          className="absolute top-2.5 right-2.5 z-20 w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center shadow-[0_2px_16px_rgba(0,102,255,0.5)]"
        >
          <Check size={13} strokeWidth={3} className="text-white" />
        </motion.div>
      )}

      {/* Mockup — fixed aspect ratio so all cards are identical height */}
      <div className="relative w-full aspect-[5/4] overflow-hidden transition-transform duration-500 group-hover:scale-[1.03]">
        {children}
        {/* Shine overlay on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(255,255,255,0.03) 100%)',
          }}
        />
      </div>

      {/* Label */}
      <div className={`
        px-3 py-2.5 text-center text-[13px] font-semibold transition-all duration-300
        ${selected
          ? 'text-white bg-[var(--accent)]/10'
          : 'text-[var(--text-muted)] bg-[var(--surface-raised)] group-hover:text-white group-hover:bg-[var(--surface-hover)]'
        }
      `}>
        {label}
      </div>
    </motion.button>
  )
}

/*
  Each mockup is a miniature website preview.
  All use the same internal padding/sizing for consistency.
  The aspect-[5/4] on the parent clips them all identically.
*/

function Nav({ bg, logo, links, border }: { bg: string; logo: string; links: string; border: string }) {
  return (
    <div className="flex items-center justify-between px-3 py-1.5" style={{ background: bg, borderBottom: `1px solid ${border}` }}>
      <div className="w-6 h-1.5 rounded-sm" style={{ background: logo }} />
      <div className="flex gap-1.5">
        {[1, 2, 3].map(i => <div key={i} className="w-4 h-1 rounded-full" style={{ background: links }} />)}
      </div>
    </div>
  )
}

function Hero({ bg, heading, sub, btnBg, btnText }: { bg: string; heading: string; sub: string; btnBg: string; btnText: string }) {
  return (
    <div className="px-3 pt-3 pb-2" style={{ background: bg }}>
      <div className="w-[70%] h-2 rounded-sm mb-1.5" style={{ background: heading }} />
      <div className="w-[90%] h-1 rounded-full mb-0.5" style={{ background: sub }} />
      <div className="w-[60%] h-1 rounded-full mb-2" style={{ background: sub }} />
      <div className="w-10 h-3 rounded-sm flex items-center justify-center" style={{ background: btnBg }}>
        <div className="w-5 h-1 rounded-full" style={{ background: btnText }} />
      </div>
    </div>
  )
}

function Cards({ bg, cardBg, cardBorder, accent }: { bg: string; cardBg: string; cardBorder: string; accent: string }) {
  return (
    <div className="flex gap-1.5 px-3 pb-2 flex-1" style={{ background: bg }}>
      {[1, 2, 3].map(i => (
        <div key={i} className="flex-1 rounded p-1.5" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
          <div className="w-3 h-3 rounded-sm mb-1" style={{ background: accent }} />
          <div className="w-full h-0.5 rounded-full mb-0.5" style={{ background: cardBorder }} />
          <div className="w-2/3 h-0.5 rounded-full" style={{ background: cardBorder }} />
        </div>
      ))}
    </div>
  )
}

export function CleanMockup() {
  return (
    <div className="w-full h-full flex flex-col" style={{ background: '#fff' }}>
      <Nav bg="#fff" logo="#2563eb" links="#cbd5e1" border="#f1f5f9" />
      <Hero bg="#fff" heading="#1e293b" sub="#e2e8f0" btnBg="#2563eb" btnText="#fff" />
      <Cards bg="#f8fafc" cardBg="#fff" cardBorder="#e2e8f0" accent="#dbeafe" />
    </div>
  )
}

export function BoldMockup() {
  return (
    <div className="w-full h-full flex flex-col" style={{ background: '#09090b' }}>
      <Nav bg="#09090b" logo="#fafafa" links="#52525b" border="#27272a" />
      <Hero bg="#09090b" heading="#fafafa" sub="#3f3f46" btnBg="#fafafa" btnText="#09090b" />
      <Cards bg="#09090b" cardBg="#18181b" cardBorder="#27272a" accent="#a78bfa" />
    </div>
  )
}

export function WarmMockup() {
  return (
    <div className="w-full h-full flex flex-col" style={{ background: '#faf8f5' }}>
      <Nav bg="#faf8f5" logo="#b45309" links="#d4c5a9" border="#e8e0d4" />
      <Hero bg="#faf8f5" heading="#78350f" sub="#d6cbb8" btnBg="#b45309" btnText="#faf8f5" />
      <Cards bg="#f5f0e3" cardBg="#faf8f5" cardBorder="#e8dcc8" accent="#fde68a" />
    </div>
  )
}

export function PlayfulMockup() {
  return (
    <div className="w-full h-full flex flex-col" style={{ background: '#fefce8' }}>
      <Nav bg="#fefce8" logo="#8b5cf6" links="#c4b5fd" border="#fde68a" />
      <Hero bg="#fefce8" heading="#6d28d9" sub="#e9d5ff" btnBg="#8b5cf6" btnText="#fff" />
      <Cards bg="#fefce8" cardBg="#f5f3ff" cardBorder="#e9d5ff" accent="#ddd6fe" />
    </div>
  )
}

export function LuxuryMockup() {
  return (
    <div className="w-full h-full flex flex-col" style={{ background: '#0c0a09' }}>
      <Nav bg="#0c0a09" logo="#d4a574" links="#44403c" border="#1c1917" />
      <Hero bg="#0c0a09" heading="#fafaf9" sub="#292524" btnBg="#d4a574" btnText="#0c0a09" />
      <Cards bg="#0c0a09" cardBg="#1c1917" cardBorder="#292524" accent="#d4a574" />
    </div>
  )
}

export function VibrantMockup() {
  return (
    <div className="w-full h-full flex flex-col" style={{ background: '#0f0320' }}>
      <div className="flex items-center justify-between px-3 py-1.5" style={{ borderBottom: '1px solid #1e0a3e', background: '#0f0320' }}>
        <div className="w-6 h-1.5 rounded-sm" style={{ background: 'linear-gradient(90deg, #7c3aed, #ec4899)' }} />
        <div className="flex gap-1.5">
          {[1, 2, 3].map(i => <div key={i} className="w-4 h-1 rounded-full" style={{ background: '#4c1d95' }} />)}
        </div>
      </div>
      <div className="px-3 pt-3 pb-2" style={{ background: '#0f0320' }}>
        <div className="w-[70%] h-2 rounded-sm mb-1.5" style={{ background: 'linear-gradient(90deg, #c4b5fd, #f9a8d4)' }} />
        <div className="w-[90%] h-1 rounded-full mb-0.5" style={{ background: '#2e1065' }} />
        <div className="w-[60%] h-1 rounded-full mb-2" style={{ background: '#2e1065' }} />
        <div className="w-12 h-3 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(90deg, #7c3aed, #ec4899, #f97316)' }}>
          <div className="w-5 h-1 rounded-full bg-white" />
        </div>
      </div>
      <div className="flex gap-1.5 px-3 pb-2 flex-1" style={{ background: '#0f0320' }}>
        {['#7c3aed', '#ec4899', '#f97316'].map((c, i) => (
          <div key={i} className="flex-1 rounded p-1.5" style={{ background: '#1a0536', border: `1px solid ${c}33` }}>
            <div className="w-3 h-3 rounded-sm mb-1" style={{ background: `${c}44` }} />
            <div className="w-full h-0.5 rounded-full" style={{ background: '#2e1065' }} />
          </div>
        ))}
      </div>
    </div>
  )
}
