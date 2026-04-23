import { useCallback } from 'react'
import { AnimatePresence, motion, Reorder } from 'framer-motion'
import {
  Sparkles, Users, LayoutGrid, ListOrdered, MessageSquareQuote,
  DollarSign, HelpCircle, Mail, Send, BarChart3,
  Megaphone, PanelBottom, GripVertical, X, Plus,
  ChevronUp, ChevronDown,
} from 'lucide-react'
import { useLang } from '../lib/i18n'
import { AIFieldAssistant } from './AIFieldAssistant'

const ALL_SECTIONS = [
  'Hero', 'Social Proof', 'Features', 'How It Works', 'Testimonials',
  'Pricing', 'FAQ', 'Contact Form', 'Newsletter', 'Stats', 'CTA Banner', 'Footer',
]

const sectionIcons: Record<string, React.ReactNode> = {
  'Hero': <Sparkles size={15} />,
  'Social Proof': <Users size={15} />,
  'Features': <LayoutGrid size={15} />,
  'How It Works': <ListOrdered size={15} />,
  'Testimonials': <MessageSquareQuote size={15} />,
  'Pricing': <DollarSign size={15} />,
  'FAQ': <HelpCircle size={15} />,
  'Contact Form': <Mail size={15} />,
  'Newsletter': <Send size={15} />,
  'Stats': <BarChart3 size={15} />,
  'CTA Banner': <Megaphone size={15} />,
  'Footer': <PanelBottom size={15} />,
}

interface Props {
  selected: string[]
  onChange: (s: string[]) => void
}

export default function SectionBuilder({ selected, onChange }: Props) {
  const { t, lang } = useLang()
  const available = ALL_SECTIONS.filter((s) => !selected.includes(s))

  const moveItem = useCallback((from: number, to: number) => {
    if (to < 0 || to >= selected.length) return
    const next = [...selected]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(next)
  }, [selected, onChange])

  return (
    <div className="space-y-6">
      {/* ── Selected / active layout ── */}
      {selected.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-2.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 pulse" />
              {t.yourPage}
            </p>
          </div>
          <Reorder.Group
            axis="y"
            values={selected}
            onReorder={onChange}
            className="space-y-2 rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-2.5 list-none m-0"
          >
            {selected.map((name, i) => {
              const icon = sectionIcons[name] || <LayoutGrid size={15} />
              const desc = t.sectionMeta[name]?.desc || ''
              return (
                <Reorder.Item
                  key={name}
                  value={name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, scale: 0.95 }}
                  whileDrag={{
                    scale: 1.03,
                    boxShadow: '0 8px 32px rgba(0,102,255,0.2), 0 4px 16px rgba(14,165,233,0.15)',
                    zIndex: 50,
                  }}
                  transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  className="flex items-center gap-3 px-3.5 py-3 rounded-xl select-none
                    cursor-grab active:cursor-grabbing transition-all duration-200
                    bg-[var(--surface-raised)] border border-[var(--border)]
                    hover:bg-[var(--surface-hover)] hover:border-[var(--border-hover)]
                    hover:shadow-[0_4px_20px_rgba(0,102,255,0.08)]"
                >
                  <GripVertical size={14} className="text-[var(--text-dim)] shrink-0" />
                  <span className="text-[var(--accent)] shrink-0">{icon}</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-[14px] font-semibold text-white">{t.sectionNames[name] || name}</span>
                    <span className="text-xs text-[var(--text-dim)] ml-2.5 hidden sm:inline">{desc}</span>
                  </div>
                  {/* Mobile up/down buttons */}
                  <div className="flex flex-col gap-0.5 sm:hidden shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); moveItem(i, i - 1) }}
                      disabled={i === 0}
                      className="w-6 h-6 rounded flex items-center justify-center bg-transparent border-none
                        text-[var(--text-dim)] disabled:opacity-20 active:text-[var(--accent)] cursor-pointer"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); moveItem(i, i + 1) }}
                      disabled={i === selected.length - 1}
                      className="w-6 h-6 rounded flex items-center justify-center bg-transparent border-none
                        text-[var(--text-dim)] disabled:opacity-20 active:text-[var(--accent)] cursor-pointer"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--text-dim)] tabular-nums shrink-0 w-5 text-center bg-[var(--bg)] rounded-md py-0.5">{i + 1}</span>
                  <motion.button
                    whileHover={{ scale: 1.15, rotate: 90 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={(e) => { e.stopPropagation(); onChange(selected.filter((s) => s !== name)) }}
                    className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center
                      text-[var(--text-dim)] hover:text-red-400 hover:bg-red-400/10
                      transition-colors cursor-pointer bg-transparent border-none"
                  >
                    <X size={12} />
                  </motion.button>
                </Reorder.Item>
              )
            })}
          </Reorder.Group>
        </div>
      )}

      {/* ── Available sections to add ── */}
      {available.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-3">
            {t.addSections}
          </p>
          <div className="flex flex-wrap gap-2.5">
            <AnimatePresence>
              {available.map((name, i) => {
                const icon = sectionIcons[name] || <LayoutGrid size={15} />
                return (
                  <motion.button
                    key={name}
                    initial={{ opacity: 0, scale: 0.85, y: 6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.85, y: -6 }}
                    transition={{ duration: 0.25, delay: i * 0.03 }}
                    whileHover={{
                      scale: 1.06,
                      y: -3,
                      transition: { type: 'spring', stiffness: 500, damping: 20 },
                    }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => onChange([...selected, name])}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                      bg-[var(--surface-raised)] border border-[var(--border)]
                      text-[var(--text-muted)] text-[13px] font-medium
                      hover:border-[var(--accent)]/40 hover:text-white hover:bg-[var(--surface-hover)]
                      hover:shadow-[0_4px_20px_rgba(236,72,153,0.1),0_2px_12px_rgba(20,184,166,0.06)]
                      transition-all cursor-pointer"
                  >
                    <Plus size={13} className="text-[var(--accent)]" />
                    <span className="text-[var(--accent)]/70">{icon}</span>
                    {t.sectionNames[name] || name}
                  </motion.button>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* ── Daniel AI (Section Assistant) ── */}
      <div className="mt-6 flex justify-start">
        <AIFieldAssistant
          fieldType="sectionBuilder"
          contextData={{ module: 'sectionBuilder' }}
          onSelect={() => { }}
          language={lang}
        />
      </div>
    </div>
  )
}
