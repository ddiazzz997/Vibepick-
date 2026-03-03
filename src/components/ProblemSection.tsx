import { motion } from 'framer-motion'
import { useLang } from '../lib/i18n'

export default function ProblemSection() {
    const { t } = useLang()

    return (
        <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8 }}
            className="py-12 px-5 relative overflow-hidden"
        >
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255, 50, 50, 0.06) 0%, transparent 60%)' }}
            />

            <div className="max-w-2xl mx-auto text-center relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4"
                >
                    {t.problemTitle1}
                    <br />
                    <span className="text-[var(--accent)]">{t.problemTitle2}</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.25 }}
                    className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed mb-6"
                >
                    {t.problemBody1}
                </motion.p>

                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed"
                >
                    {t.problemBody2}
                </motion.p>

                {/* Divider strip */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="mt-10 h-px w-1/2 mx-auto bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent"
                />
            </div>
        </motion.section>
    )
}
