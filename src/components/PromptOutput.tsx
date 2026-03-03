import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { countWords } from '../lib/generatePrompt'
import { useLang } from '../lib/i18n'

interface Props {
  prompt: string
  onCopy?: () => void
}

export default function PromptOutput({ prompt, onCopy }: Props) {
  const { t } = useLang()
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const words = countWords(prompt)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
    onCopy?.()
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse" />
          <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-widest">{t.yourPrompt}</span>
        </div>
        <span className="text-xs font-mono text-[var(--text-muted)]">{words} {t.words}</span>
      </div>

      {/* Preview box */}
      <div className="relative rounded-2xl border border-[var(--border)] bg-[#03060d] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.5),inset_0_2px_10px_rgba(0,0,0,0.4)]">
        <AnimatePresence initial={false}>
          <motion.div
            animate={{ height: expanded ? 'auto' : 160 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <pre
              className="p-5 text-[13px] font-mono text-[var(--text-muted)] leading-[1.75] whitespace-pre-wrap prompt-scroll overflow-y-auto"
              style={{ maxHeight: expanded ? 480 : 160 }}
            >
              {prompt}
            </pre>
          </motion.div>
        </AnimatePresence>

        {/* Fade overlay */}
        {!expanded && (
          <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-[#03060d] to-transparent pointer-events-none" />
        )}

        {/* Toggle */}
        <motion.button
          onClick={() => setExpanded(!expanded)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10
            flex items-center gap-1.5 px-4 py-1.5 rounded-full
            bg-[var(--bg)] border border-[var(--border)]
            text-[11px] font-medium text-[var(--text-muted)]
            hover:text-white hover:border-[#444] hover:bg-[var(--surface)]
            transition-all duration-200 cursor-pointer"
        >
          {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          {expanded ? t.collapse : t.expand}
        </motion.button>
      </div>

      {/* Copy button */}
      <motion.button
        onClick={handleCopy}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          w-full py-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2.5
          cursor-pointer border transition-all duration-300
          ${copied
            ? 'bg-green-500/10 border-green-500/30 text-green-400 shadow-[0_0_30px_rgba(34,197,94,0.15)]'
            : 'bg-white border-white text-black shadow-[0_4px_20px_rgba(255,255,255,0.15)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.25)] hover:brightness-105'
          }
        `}
      >
        {copied ? (
          <>
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500 }}>
              <Check size={16} />
            </motion.span>
            {t.copied}
          </>
        ) : (
          <><Copy size={16} /> {t.copyPrompt}</>
        )}
      </motion.button>
    </div>
  )
}
