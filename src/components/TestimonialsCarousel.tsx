import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../lib/i18n'

const testimonials = [
    {
        nameEs: 'Ana Martínez',
        nameEn: 'Ana Martinez',
        roleEs: 'Coach de Negocios',
        roleEn: 'Business Coach',
        textEs: 'En 3 minutos tenía un sitio que mis amigos pensaron que costó $2,000. El prompt es tan detallado que Bolt lo construyó perfecto a la primera.',
        textEn: 'In 3 minutes I had a site my friends thought cost $2,000. The prompt is so detailed that Bolt built it perfectly on the first try.',
        avatar: '👩‍💼',
        color: '#ec4899',
    },
    {
        nameEs: 'Carlos Rodríguez',
        nameEn: 'Carlos Rodriguez',
        roleEs: 'Dueño de Restaurante',
        roleEn: 'Restaurant Owner',
        textEs: 'Con Daniel AI resolví todas mis dudas. Me sugirió el copy exacto para mi negocio. Nunca fue tan fácil tener presencia online.',
        textEn: 'With Daniel AI I solved all my questions. It suggested the exact copy for my business. Having an online presence was never this easy.',
        avatar: '👨‍🍳',
        color: '#f59e0b',
    },
    {
        nameEs: 'María López',
        nameEn: 'Maria Lopez',
        roleEs: 'Fotógrafa Profesional',
        roleEn: 'Professional Photographer',
        textEs: 'Probé Wix, Squarespace y nada me convencía. Con Vibepick describí mi estilo y listo — sitio profesional sin tocar código.',
        textEn: 'I tried Wix, Squarespace and nothing convinced me. With Vibepick I described my style and done — professional site without touching code.',
        avatar: '📸',
        color: '#8b5cf6',
    },
    {
        nameEs: 'Andrés Gómez',
        nameEn: 'Andres Gomez',
        roleEs: 'Agencia de Marketing',
        roleEn: 'Marketing Agency',
        textEs: 'Uso Vibepick para crear landing pages para mis clientes. Lo que antes tomaba 1 semana ahora lo hago en 10 minutos.',
        textEn: 'I use Vibepick to create landing pages for my clients. What used to take 1 week now takes me 10 minutes.',
        avatar: '🚀',
        color: '#0066ff',
    },
    {
        nameEs: 'Sofía Herrera',
        nameEn: 'Sofia Herrera',
        roleEs: 'Tienda de Ropa Online',
        roleEn: 'Online Clothing Store',
        textEs: 'Mi sitio se ve más profesional que marcas que llevan años. El sistema de secciones es genial — arrastras y listo.',
        textEn: 'My site looks more professional than brands that have been around for years. The section system is great — drag and done.',
        avatar: '👗',
        color: '#10b981',
    },
    {
        nameEs: 'Diego Fernández',
        nameEn: 'Diego Fernandez',
        roleEs: 'Entrenador Personal',
        roleEn: 'Personal Trainer',
        textEs: 'Invertí $0 y ahora recibo clientes por WhatsApp desde mi sitio. La integración de redes sociales es perfecta.',
        textEn: 'I invested $0 and now I receive clients via WhatsApp from my site. The social media integration is perfect.',
        avatar: '💪',
        color: '#06b6d4',
    },
]

export default function TestimonialsCarousel() {
    const { lang } = useLang()
    const isEs = lang === 'es'
    const [active, setActive] = useState(0)

    // Auto-advance every 5s
    useEffect(() => {
        const timer = setInterval(() => {
            setActive(prev => (prev + 1) % testimonials.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    const t = testimonials[active]

    return (
        <section className="py-20 px-5 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,102,255,0.05) 0%, transparent 65%)' }}
            />

            <div className="max-w-3xl mx-auto relative z-10">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <p className="text-xs uppercase tracking-[0.25em] text-[var(--accent)] font-semibold mb-3">
                        {isEs ? 'Casos de Éxito' : 'Success Stories'}
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                        {isEs ? 'Lo que dicen nuestros usuarios' : 'What our users say'}
                    </h2>
                </motion.div>

                {/* Testimonial Card */}
                <div className="relative min-h-[220px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active}
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            transition={{ duration: 0.4, ease: 'easeInOut' }}
                            className="rounded-3xl p-8 text-center"
                            style={{
                                background: 'linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.4) 100%)',
                                border: `1px solid ${t.color}25`,
                            }}
                        >
                            {/* Quote mark */}
                            <div className="text-5xl mb-4 opacity-20" style={{ color: t.color }}>"</div>

                            {/* Text */}
                            <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-6 italic">
                                {isEs ? t.textEs : t.textEn}
                            </p>

                            {/* Author */}
                            <div className="flex items-center justify-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                                    style={{ background: `${t.color}20`, border: `1px solid ${t.color}40` }}
                                >
                                    {t.avatar}
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-white">{isEs ? t.nameEs : t.nameEn}</p>
                                    <p className="text-xs text-white/40">{isEs ? t.roleEs : t.roleEn}</p>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Dots */}
                <div className="flex justify-center gap-2 mt-6">
                    {testimonials.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActive(i)}
                            className="cursor-pointer bg-transparent border-none p-0"
                        >
                            <motion.div
                                animate={{
                                    width: i === active ? 24 : 8,
                                    backgroundColor: i === active ? testimonials[i].color : 'rgba(255,255,255,0.2)',
                                }}
                                transition={{ duration: 0.3 }}
                                className="h-2 rounded-full"
                            />
                        </button>
                    ))}
                </div>
            </div>
        </section>
    )
}
