import { motion } from 'framer-motion'
import { useLang } from '../lib/i18n'

const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
}

const stepVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.5, delay: 0.15 * i, ease: "easeOut" }
    })
}

export default function HowItWorks() {
    const { lang } = useLang()
    const isEs = lang === 'es'

    const steps = [
        {
            num: "01",
            title: isEs ? "Piénsalo" : "Think it",
            desc: isEs ? "Cuéntanos de qué trata tu negocio en lenguaje natural. No necesitas jerga técnica." : "Tell us what your business is about in natural language. No technical jargon needed.",
            icon: "💡"
        },
        {
            num: "02",
            title: isEs ? "Escríbelo" : "Write it",
            desc: isEs ? "Nuestra IA analiza tu nicho y te entrega la instrucción paso a paso (prompt) perfecta y optimizada." : "Our AI analyzes your niche and gives you the perfect, optimized step-by-step instruction (prompt).",
            icon: "✍️"
        },
        {
            num: "03",
            title: isEs ? "Lánzalo" : "Launch it",
            desc: isEs ? "Copia el resultado en constructores como Lovable, Bolt o v0, y mira cómo tu web cobra vida al instante." : "Copy the result into builders like Lovable, Bolt, or v0, and watch your website come to life instantly.",
            icon: "🚀"
        }
    ]

    return (
        <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            className="py-16 px-5 relative"
        >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--surface-raised)]/30 to-transparent pointer-events-none" />

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <p className="text-xs uppercase tracking-[0.25em] text-[var(--accent)] font-semibold mb-3">
                        {isEs ? "El Proceso" : "The Process"}
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                        {isEs ? "3 pasos para tu sitio web vendedor" : "3 steps to your high-converting website"}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting line for desktop */}
                    <div className="hidden md:block absolute top-[45px] left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent z-0" />

                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            custom={i}
                            variants={stepVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="relative z-10 flex flex-col items-center text-center group"
                        >
                            <div className="w-24 h-24 rounded-3xl bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-center mb-6 shadow-xl group-hover:border-[var(--accent)]/50 group-hover:shadow-[0_0_30px_rgba(0,119,255,0.2)] transition-all duration-300 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <span className="text-4xl relative z-10 group-hover:scale-110 transition-transform duration-300">{step.icon}</span>
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full border border-white/10 bg-black flex items-center justify-center text-[10px] font-bold text-[var(--accent)] z-20">
                                    {step.num}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-sm">
                                {step.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    )
}
