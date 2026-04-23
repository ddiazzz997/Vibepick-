import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../lib/i18n'

const testimonials = [
  {
    nameEs: 'Ana Martínez',
    nameEn: 'Ana Martinez',
    roleEs: 'Coach de Negocios',
    roleEn: 'Business Coach',
    textEs: 'En 8 minutos tenía una landing que mis clientes pensaron costó $1,200. El prompt fue tan detallado que v0 la construyó perfecta a la primera sin ningún error.',
    textEn: 'In 8 minutes I had a landing my clients thought cost $1,200. The prompt was so detailed that v0 built it perfectly on the first try with zero errors.',
    avatar: '👩‍💼',
    result: '+3 clientes en la primera semana',
    resultEn: '+3 clients in the first week',
    color: '#0066ff',
  },
  {
    nameEs: 'Andrés Gómez',
    nameEn: 'Andres Gomez',
    roleEs: 'Agencia de Marketing Digital',
    roleEn: 'Digital Marketing Agency',
    textEs: 'Uso Vibepick para crear landing pages para todos mis clientes. Lo que antes tomaba 1 semana y $800 ahora lo hago en 10 minutos. Ya recuperé la inversión el primer día.',
    textEn: 'I use Vibepick to build landing pages for all my clients. What used to take 1 week and $800 now takes 10 minutes. I recovered my investment on day one.',
    avatar: '🚀',
    result: '10x más rápido que antes',
    resultEn: '10x faster than before',
    color: '#0ea5e9',
  },
  {
    nameEs: 'María López',
    nameEn: 'Maria Lopez',
    roleEs: 'Fotógrafa Profesional',
    roleEn: 'Professional Photographer',
    textEs: 'Probé Wix, Squarespace y nada. Con Vibepick describí mi estilo "minimalista oscuro con galería impactante" y el prompt generó exactamente eso. Sin tocar código.',
    textEn: 'I tried Wix, Squarespace and nothing worked. With Vibepick I described my style and the prompt generated exactly that. Without touching code.',
    avatar: '📸',
    result: 'Sitio listo sin tocar código',
    resultEn: 'Site ready without touching code',
    color: '#3b82f6',
  },
  {
    nameEs: 'Carlos Rodríguez',
    nameEn: 'Carlos Rodriguez',
    roleEs: 'Dueño de Restaurante',
    roleEn: 'Restaurant Owner',
    textEs: 'No sé nada de tecnología pero con el asistente AI resolví todo. Me sugirió el copy exacto, las secciones que necesitaba y hasta los colores. Resultados inmediatos.',
    textEn: 'I know nothing about tech but with the AI assistant I solved everything. It suggested exact copy, the sections I needed and even the colors. Immediate results.',
    avatar: '👨‍🍳',
    result: '+40% reservas ese mes',
    resultEn: '+40% bookings that month',
    color: '#60a5fa',
  },
  {
    nameEs: 'Sofía Herrera',
    nameEn: 'Sofia Herrera',
    roleEs: 'Tienda de Ropa Online',
    roleEn: 'Online Clothing Store',
    textEs: 'Mi sitio se ve más profesional que marcas con 5 años en el mercado. El sistema de secciones drag-and-drop es genial — personalizas el orden y listo.',
    textEn: 'My site looks more professional than brands with 5 years in the market. The drag-and-drop section system is amazing — you customize the order and done.',
    avatar: '👗',
    result: 'Mejor que marcas establecidas',
    resultEn: 'Better than established brands',
    color: '#38bdf8',
  },
  {
    nameEs: 'Diego Fernández',
    nameEn: 'Diego Fernandez',
    roleEs: 'Entrenador Personal',
    roleEn: 'Personal Trainer',
    textEs: 'Invertí $0 y en 3 días recibí 5 consultas desde mi sitio. La integración con WhatsApp y redes fue perfecta. El ROI es imposible de ignorar.',
    textEn: 'I invested $0 and in 3 days received 5 inquiries from my site. The WhatsApp and social integration was perfect. The ROI is impossible to ignore.',
    avatar: '💪',
    result: '5 consultas en 3 días',
    resultEn: '5 inquiries in 3 days',
    color: '#0284c7',
  },
]

const INTERVAL = 4000

export default function TestimonialsCarousel() {
  const { lang } = useLang()
  const isEs = lang === 'es'
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1)
  const activeRef = useRef(active)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const dragStartX = useRef(0)

  activeRef.current = active

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      const next = (activeRef.current + 1) % testimonials.length
      setDirection(1)
      setActive(next)
    }, INTERVAL)
  }

  useEffect(() => {
    startTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const goTo = (index: number, dir: number) => {
    setDirection(dir)
    setActive(index)
    startTimer()
  }

  const t = testimonials[active]

  const variants = {
    enter: { opacity: 0, x: direction > 0 ? 50 : -50 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: direction > 0 ? -50 : 50 },
  }

  return (
    <section className="py-20 px-5 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 60%, rgba(0,102,255,0.04) 0%, rgba(14,165,233,0.03) 40%, transparent 70%)',
        }}
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
          <p className="text-xs uppercase tracking-[0.28em] font-semibold mb-3"
            style={{ color: 'var(--accent)' }}>
            {isEs ? 'Casos de Éxito Reales' : 'Real Success Stories'}
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            {isEs ? 'Resultados que hablan solos' : 'Results that speak for themselves'}
          </h2>
          <p className="text-sm mt-3" style={{ color: 'var(--text-muted)' }}>
            {isEs
              ? 'Más de 1,200 sitios generados este mes con Vibepick'
              : 'Over 1,200 sites generated this month with Vibepick'}
          </p>
        </motion.div>

        {/* Card */}
        <div
          className="relative min-h-[260px]"
          onMouseDown={(e) => { dragStartX.current = e.clientX }}
          onMouseUp={(e) => {
            const diff = dragStartX.current - e.clientX
            if (diff > 50) goTo((active + 1) % testimonials.length, 1)
            else if (diff < -50) goTo((active - 1 + testimonials.length) % testimonials.length, -1)
          }}
          onTouchStart={(e) => { dragStartX.current = e.touches[0].clientX }}
          onTouchEnd={(e) => {
            const diff = dragStartX.current - e.changedTouches[0].clientX
            if (diff > 40) goTo((active + 1) % testimonials.length, 1)
            else if (diff < -40) goTo((active - 1 + testimonials.length) % testimonials.length, -1)
          }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={active}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="rounded-3xl p-8"
              style={{
                background: 'linear-gradient(160deg, rgba(255,255,255,0.035) 0%, rgba(0,0,0,0.45) 100%)',
                border: `1px solid ${t.color}22`,
              }}
            >
              <div className="text-5xl mb-3 leading-none font-serif opacity-25"
                style={{ color: t.color }}>"
              </div>

              <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-5 italic">
                {isEs ? t.textEs : t.textEn}
              </p>

              {/* Result pill */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-5"
                style={{
                  background: `${t.color}15`,
                  border: `1px solid ${t.color}35`,
                  color: t.color,
                }}>
                <span>✦</span>
                {isEs ? t.result : t.resultEn}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0"
                  style={{ background: `${t.color}18`, border: `1px solid ${t.color}35` }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{isEs ? t.nameEs : t.nameEn}</p>
                  <p className="text-xs" style={{ color: 'var(--text-dim)' }}>{isEs ? t.roleEs : t.roleEn}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-3 mt-6">
          {testimonials.map((item, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > active ? 1 : -1)}
              className="cursor-pointer bg-transparent border-none p-1"
            >
              <motion.div
                animate={{
                  width: i === active ? 28 : 7,
                  backgroundColor: i === active ? item.color : 'rgba(255,255,255,0.15)',
                }}
                transition={{ duration: 0.3 }}
                className="h-1.5 rounded-full"
              />
            </button>
          ))}
        </div>

        {/* Autoplay progress bar */}
        <div className="mt-4 max-w-xs mx-auto h-px rounded-full overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.06)' }}>
          <motion.div
            key={active}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: INTERVAL / 1000, ease: 'linear' }}
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${t.color}, var(--accent-2))` }}
          />
        </div>
      </div>
    </section>
  )
}
