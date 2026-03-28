import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, ChevronDown, ChevronUp, Download, Lock, Sparkles } from 'lucide-react'
import { countWords } from '../lib/generatePrompt'
import { useLang } from '../lib/i18n'

interface Props {
  prompt: string
  isLocked?: boolean
  onUnlock?: () => void
  onExportZip?: () => void
  onCopy?: () => void
}

export default function PromptOutput({ prompt, isLocked, onUnlock, onExportZip, onCopy }: Props) {
  const { t } = useLang()
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [isZipping, setIsZipping] = useState(false)
  const words = countWords(prompt)

  const handleCopy = async () => {
    if (isLocked) {
      onUnlock?.()
      return
    }
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
    onCopy?.()
    setTimeout(() => setCopied(false), 2500)
  }

  const handleZip = async () => {
    if (isLocked) {
      onUnlock?.()
      return
    }
    if (onExportZip) {
      setIsZipping(true)
      await onExportZip()
      setIsZipping(false)
    }
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
            className={`overflow-hidden relative ${isLocked ? 'pointer-events-none select-none' : ''}`}
          >
            <pre
              className={`p-5 text-[13px] font-mono text-[var(--text-muted)] leading-[1.75] whitespace-pre-wrap prompt-scroll overflow-y-auto transition-all duration-500`}
              style={{ maxHeight: expanded ? 480 : 160 }}
            >
              {isLocked ? (
                <>
                  <div className="opacity-100">{prompt.substring(0, prompt.length * 0.15)}</div>
                  <div className="blur-[4px] opacity-40 select-none pb-20">{prompt.substring(prompt.length * 0.15, prompt.length * 0.4)}</div>
                </>
              ) : (
                prompt
              )}
            </pre>

            {/* The Lock Blur Cover */}
            {isLocked && (
              <div className="absolute bottom-0 inset-x-0 h-[60%] bg-gradient-to-t from-[#03060d] via-[#03060d]/80 to-transparent flex flex-col items-center justify-end pb-8 z-10">
                <p className="text-xs text-center text-[var(--text-muted)] px-8 max-w-sm">{t.premiumLockedMsg}</p>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* Fade overlay for normal collapse */}
        {!expanded && !isLocked && (
          <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-[#03060d] to-transparent pointer-events-none z-10" />
        )}

        {/* Toggle */}
        <motion.button
          onClick={() => setExpanded(!expanded)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20
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

      {/* Action Buttons */}
      {isLocked ? (
        <motion.button
          onClick={onUnlock}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2.5 cursor-pointer border border-[#FFB800]/50 bg-[#FFB800]/10 text-[#FFB800] shadow-[0_4px_20px_rgba(255,184,0,0.15)] hover:bg-[#FFB800]/20 hover:shadow-[0_8px_30px_rgba(255,184,0,0.25)] hover:border-[#FFB800] transition-all duration-300"
        >
          <Lock size={16} /> {t.unlockPremium}
        </motion.button>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              onClick={handleCopy}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                flex-1 py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2.5
                cursor-pointer border transition-all duration-300
                ${copied
                  ? 'bg-green-500/10 border-green-500/30 text-green-400'
                  : 'bg-[var(--surface-raised)] border-[var(--border)] text-white hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)]'
                }
              `}
            >
              {copied ? (
                <><motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500 }}><Check size={16} /></motion.span>{t.copied}</>
              ) : (
                <><Copy size={16} /> {t.copyPrompt}</>
              )}
            </motion.button>

            <motion.button
              onClick={handleZip}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2.5 cursor-pointer border transition-all duration-300 bg-white border-white text-black shadow-[0_4px_20px_rgba(255,255,255,0.15)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.25)] hover:brightness-105"
            >
              {isZipping ? (
                <div className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
              ) : (
                <><Download size={16} /> {t.downloadZip}</>
              )}
            </motion.button>
          </div>

          <div className="px-4 py-3.5 rounded-xl border border-[#0077ff]/30 bg-[#0077ff]/5 flex items-start gap-3">
            <div className="mt-0.5 text-[#0077ff] shrink-0">
              <Sparkles size={18} />
            </div>
            <p className="text-[13px] leading-relaxed text-[var(--text-muted)]">
              {t.unlockPowerFull}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
