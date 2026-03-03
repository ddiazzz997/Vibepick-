import { motion } from 'framer-motion'
import { useLang } from '../lib/i18n'

const icons = ['🔬', '🔓', '👁️']

const columnVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.6, delay: 0.2 * i },
    }),
}

export default function WhyVibepick() {
    const { t } = useLang()

    return (
        <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            className="py-12 px-5 relative overflow-hidden"
        >
            {/* Background gradient band */}
            <div className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'linear-gradient(180deg, transparent 0%, rgba(0,102,255,0.03) 30%, rgba(0,102,255,0.03) 70%, transparent 100%)',
                }}
            />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-14"
                >
                    <p className="text-xs uppercase tracking-[0.25em] text-[var(--accent)] font-semibold mb-3">
                        {t.whyTag}
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                        {t.whyTitle}
                    </h2>
                </motion.div>

                {/* 3 Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {t.whyItems.map((item: { title: string; desc: string }, i: number) => (
                        <motion.div
                            key={i}
                            custom={i}
                            variants={columnVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="group relative text-center p-6 rounded-2xl transition-all duration-300 hover:bg-white/[0.01]"
                            style={{ border: '1px solid transparent', transition: 'all 0.3s ease' }}
                            whileHover={{
                                scale: 1.05,
                                borderColor: 'rgba(0, 119, 255, 0.4)',
                                boxShadow: '0 0 25px rgba(0, 119, 255, 0.25)',
                                transition: { duration: 0.3 },
                            }}
                        >
                            <motion.span
                                className="text-4xl block mb-5"
                                whileHover={{ scale: 1.15 }}
                                transition={{ type: 'spring', stiffness: 400 }}
                            >
                                {icons[i]}
                            </motion.span>
                            <h3 className="text-base font-bold text-white mb-3">{item.title}</h3>
                            <p className="text-sm text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    )
}
