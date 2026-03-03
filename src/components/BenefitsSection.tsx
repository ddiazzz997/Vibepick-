import { motion } from 'framer-motion'
import { useLang } from '../lib/i18n'

const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
}

const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: (i: number) => ({
        opacity: 1, y: 0, scale: 1,
        transition: { duration: 0.6, delay: 0.15 * i, ease: [0.25, 0.1, 0.25, 1] },
    }),
}

const icons = ['⚡', '🎯', '🧠', '🚀']

export default function BenefitsSection() {
    const { t } = useLang()

    return (
        <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            className="py-12 px-5"
        >
            <div className="max-w-4xl mx-auto">
                {/* Section heading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-14"
                >
                    <p className="text-xs uppercase tracking-[0.25em] text-[var(--accent)] font-semibold mb-3">
                        {t.benefitsTag}
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                        {t.benefitsTitle}
                    </h2>
                </motion.div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {t.benefitsItems.map((item: { title: string; desc: string }, i: number) => (
                        <motion.div
                            key={i}
                            custom={i}
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            whileHover={{
                                scale: 1.02,
                                borderColor: 'rgba(0, 119, 255, 0.5)',
                                boxShadow: '0 0 20px rgba(0, 119, 255, 0.2)',
                                transition: { duration: 0.3 }
                            }}
                            className="group relative rounded-2xl p-6 overflow-hidden cursor-default"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0.6) 100%)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
                            }}
                        >
                            {/* Hover glow */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                style={{ background: 'radial-gradient(circle at 50% 50%, rgba(0,119,255,0.15) 0%, transparent 70%)' }}
                            />

                            <div className="relative z-10">
                                <motion.span
                                    className="text-3xl block mb-4"
                                    whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                                    transition={{ duration: 0.4 }}
                                >
                                    {icons[i]}
                                </motion.span>
                                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    )
}
