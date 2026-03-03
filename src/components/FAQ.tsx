import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../lib/i18n'

export default function FAQ() {
    const { t } = useLang()
    const [open, setOpen] = useState<number | null>(null)

    return (
        <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            className="py-12 px-5"
        >
            <div className="max-w-2xl mx-auto">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <p className="text-xs uppercase tracking-[0.25em] text-[var(--accent)] font-semibold mb-3">
                        {t.faqTag}
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                        {t.faqTitle}
                    </h2>
                </motion.div>

                {/* Accordion */}
                <div className="space-y-3">
                    {t.faqItems.map((item: { q: string; a: string }, i: number) => {
                        const isOpen = open === i
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: 0.08 * i }}
                                className={`rounded-xl overflow-hidden transition-all duration-300 cursor-pointer ${isOpen ? '' : 'hover:bg-white/[0.05] hover:border-[#0077ff]/30 hover:shadow-[0_0_15px_rgba(0,119,255,0.15)]'}`}
                                style={{
                                    background: isOpen
                                        ? 'linear-gradient(135deg, rgba(0,119,255,0.08) 0%, rgba(0,0,0,0.5) 100%)'
                                        : 'rgba(255,255,255,0.03)',
                                    border: `1px solid ${isOpen ? 'rgba(0,119,255,0.5)' : 'rgba(255,255,255,0.05)'}`,
                                    boxShadow: isOpen ? '0 0 25px rgba(0,119,255,0.2)' : 'none',
                                }}
                                onClick={() => setOpen(isOpen ? null : i)}
                            >
                                <button
                                    className="w-full flex items-center justify-between gap-4 px-5 py-5 text-left bg-transparent border-none pointer-events-none"
                                >
                                    <span className={`text-sm md:text-base font-semibold transition-colors duration-300 ${isOpen ? 'text-white' : 'text-neutral-300'}`}>{item.q}</span>
                                    <motion.span
                                        animate={{ rotate: isOpen ? 180 : 0, color: isOpen ? '#0077ff' : '#888' }}
                                        transition={{ duration: 0.3 }}
                                        className="shrink-0"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="m6 9 6 6 6-6" />
                                        </svg>
                                    </motion.span>
                                </button>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <p className="px-5 pb-4 text-sm text-[var(--text-muted)] leading-relaxed">
                                                {item.a}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </motion.section>
    )
}
