import { createContext, useContext, useState } from 'react'
import { motion } from 'framer-motion'

type Lang = 'en' | 'es'

/* ─────────────────────────────────────────────
   All translatable strings
───────────────────────────────────────────── */
const translations = {
    en: {
        // Welcome Screen
        welcomeTitle1: 'Build your',
        welcomeTitle2: 'Website',
        welcomeSubtitle: 'Generate agency-level prompts for high-converting websites. Powered by AI.',
        welcomeCTA: '🚀 Try it free for 7 days',

        // Hero
        buildYour: 'Build your',
        perfectWebsite: 'perfect website',
        heroSubtitle: 'Choose your style. Pick your sections.\nGet a ready-to-paste prompt for any AI builder.',

        // Niches
        niches: [
            { label: 'Web Design Agency', emoji: '🎨' },
            { label: 'AI / Automation', emoji: '🤖' },
            { label: 'Dentist', emoji: '🦷' },
            { label: 'SaaS Product', emoji: '💻' },
            { label: 'Real Estate', emoji: '🏠' },
            { label: 'Personal Trainer', emoji: '💪' },
            { label: 'Restaurant', emoji: '🍽️' },
            { label: 'E-commerce', emoji: '🛒' },
            { label: 'Photographer', emoji: '📷' },
            { label: 'Law Firm', emoji: '⚖️' },
            { label: 'Marketing Agency', emoji: '📈' },
            { label: 'Coaching', emoji: '🎯' },
        ],

        // Vibes
        vibes: [
            { id: 'clean', label: 'Clean & Modern' },
            { id: 'bold', label: 'Bold & Dark' },
            { id: 'warm', label: 'Warm & Earthy' },
            { id: 'playful', label: 'Playful & Soft' },
            { id: 'luxury', label: 'Luxury & Elegant' },
            { id: 'vibrant', label: 'Vibrant & Gradient' },
        ],

        // Steps
        step1Title: "What's the website for?",
        step1Placeholder: 'e.g. A landing page for my dental practice in Manchester that offers teeth whitening and cosmetic dentistry...',
        step2Title: 'What type of business?',
        step2Sub: 'Pick one or type your own below',
        step2Placeholder: 'Or type something else...',
        step3Title: 'Pick a style',
        step3Sub: 'This shapes the whole look and feel',
        step4Title: 'Build your page',
        step4Sub: 'Add sections and drag to reorder them',
        step5Title: 'What should the button say?',
        step5Sub: 'The main action you want visitors to take',
        step5Placeholder: 'e.g. Book a Free Consultation, Get a Quote, Start Free Trial',

        // SectionBuilder
        yourPage: 'Your page — drag to reorder',
        addSections: 'Add sections',
        sectionMeta: {
            'Hero': { desc: 'Headline, CTA & image' },
            'Social Proof': { desc: 'Client logos & trust' },
            'Features': { desc: 'Benefits grid' },
            'How It Works': { desc: '3-step process' },
            'Testimonials': { desc: 'Customer reviews' },
            'Pricing': { desc: 'Plan comparison' },
            'FAQ': { desc: 'Common questions' },
            'Contact Form': { desc: 'Get in touch' },
            'Newsletter': { desc: 'Email signup' },
            'Stats': { desc: 'Key numbers' },
            'CTA Banner': { desc: 'Final push' },
            'Footer': { desc: 'Links & socials' },
        } as Record<string, { desc: string }>,
        sectionNames: {
            'Hero': 'Hero',
            'Social Proof': 'Social Proof',
            'Features': 'Features',
            'How It Works': 'How It Works',
            'Testimonials': 'Testimonials',
            'Pricing': 'Pricing',
            'FAQ': 'FAQ',
            'Contact Form': 'Contact Form',
            'Newsletter': 'Newsletter',
            'Stats': 'Stats',
            'CTA Banner': 'CTA Banner',
            'Footer': 'Footer',
        } as Record<string, string>,

        // PromptOutput
        yourPrompt: 'Your prompt',
        words: 'words',
        collapse: 'Collapse',
        expand: 'Expand',
        copied: 'Copied — paste it into your AI builder',
        copyPrompt: 'Copy Prompt',

        // Bottom section
        pasteInto: 'Paste into',
        pasteIntoSuffix: ', or any AI builder',
        keepScrolling: 'Keep scrolling',
        requestAdvisory: 'Request 1:1 Advisory',
        madeBy: 'Made with',
        byDaniel: 'by Daniel Díaz',
    },

    es: {
        // Welcome Screen
        welcomeTitle1: 'Crea tu',
        welcomeTitle2: 'Sitio Web',
        welcomeSubtitle: 'Genera prompts de nivel agencia para crear sitios web que convierten. Impulsado por inteligencia artificial.',
        welcomeCTA: '🚀 Pruébalo por 7 días gratis',

        // Hero
        buildYour: 'Construye tu',
        perfectWebsite: 'sitio web perfecto',
        heroSubtitle: 'Elige tu estilo. Selecciona tus secciones.\nObtén un prompt listo para pegar en cualquier constructor de IA.',

        // Niches
        niches: [
            { label: 'Agencia de Diseño Web', emoji: '🎨' },
            { label: 'IA / Automatización', emoji: '🤖' },
            { label: 'Dentista', emoji: '🦷' },
            { label: 'Producto SaaS', emoji: '💻' },
            { label: 'Bienes Raíces', emoji: '🏠' },
            { label: 'Entrenador Personal', emoji: '💪' },
            { label: 'Restaurante', emoji: '🍽️' },
            { label: 'E-commerce', emoji: '🛒' },
            { label: 'Fotógrafo', emoji: '📷' },
            { label: 'Bufete de Abogados', emoji: '⚖️' },
            { label: 'Agencia de Marketing', emoji: '📈' },
            { label: 'Coaching', emoji: '🎯' },
        ],

        // Vibes
        vibes: [
            { id: 'clean', label: 'Limpio y Moderno' },
            { id: 'bold', label: 'Audaz y Oscuro' },
            { id: 'warm', label: 'Cálido y Natural' },
            { id: 'playful', label: 'Alegre y Suave' },
            { id: 'luxury', label: 'Lujoso y Elegante' },
            { id: 'vibrant', label: 'Vibrante y Degradado' },
        ],

        // Steps
        step1Title: '¿Para qué es el sitio web?',
        step1Placeholder: 'Ej. Una página de aterrizaje para mi clínica dental en Bogotá que ofrece blanqueamiento y odontología estética...',
        step2Title: '¿Qué tipo de negocio?',
        step2Sub: 'Elige uno o escribe el tuyo a continuación',
        step2Placeholder: 'O escribe algo diferente...',
        step3Title: 'Elige un estilo',
        step3Sub: 'Esto define toda la apariencia y sensación',
        step4Title: 'Construye tu página',
        step4Sub: 'Agrega secciones y arrástralas para reordenarlas',
        step5Title: '¿Qué debe decir el botón?',
        step5Sub: 'La acción principal que quieres que realicen los visitantes',
        step5Placeholder: 'Ej. Reserva una Consulta Gratis, Obtén un Presupuesto, Empieza Gratis',

        // SectionBuilder
        yourPage: 'Tu página — arrastra para reordenar',
        addSections: 'Agregar secciones',
        sectionMeta: {
            'Hero': { desc: 'Título, CTA e imagen' },
            'Social Proof': { desc: 'Logos de clientes y confianza' },
            'Features': { desc: 'Cuadrícula de beneficios' },
            'How It Works': { desc: 'Proceso en 3 pasos' },
            'Testimonials': { desc: 'Reseñas de clientes' },
            'Pricing': { desc: 'Comparación de planes' },
            'FAQ': { desc: 'Preguntas frecuentes' },
            'Contact Form': { desc: 'Ponte en contacto' },
            'Newsletter': { desc: 'Suscripción al correo' },
            'Stats': { desc: 'Números clave' },
            'CTA Banner': { desc: 'Impulso final' },
            'Footer': { desc: 'Enlace y redes sociales' },
        } as Record<string, { desc: string }>,
        sectionNames: {
            'Hero': 'Hero',
            'Social Proof': 'Prueba Social',
            'Features': 'Características',
            'How It Works': 'Cómo Funciona',
            'Testimonials': 'Testimonios',
            'Pricing': 'Precios',
            'FAQ': 'Preguntas Frecuentes',
            'Contact Form': 'Formulario de Contacto',
            'Newsletter': 'Boletín',
            'Stats': 'Estadísticas',
            'CTA Banner': 'Banner CTA',
            'Footer': 'Pie de Página',
        } as Record<string, string>,

        // PromptOutput
        yourPrompt: 'Tu prompt',
        words: 'palabras',
        collapse: 'Colapsar',
        expand: 'Expandir',
        copied: 'Copiado — pégalo en tu constructor de IA',
        copyPrompt: 'Copiar Prompt',

        // Bottom section
        pasteInto: 'Pégalo en',
        pasteIntoSuffix: ', o en cualquier IA',
        keepScrolling: 'Seguir bajando',
        requestAdvisory: 'Solicitar Asesoría 1:1',
        madeBy: 'Hecho con',
        byDaniel: 'por Daniel Díaz',
    },
}

/* ─────────────────────────────────────────────
   Context
───────────────────────────────────────────── */
interface LangContextType {
    lang: Lang
    t: typeof translations['en']
    toggle: () => void
}

const LangContext = createContext<LangContextType>({
    lang: 'es',
    t: translations['es'],
    toggle: () => { },
})

export function LangProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLang] = useState<Lang>('es')
    const toggle = () => setLang((l) => (l === 'es' ? 'en' : 'es'))
    return (
        <LangContext.Provider value={{ lang, t: translations[lang], toggle }}>
            {children}
        </LangContext.Provider>
    )
}

export function useLang() {
    return useContext(LangContext)
}

/* ─────────────────────────────────────────────
   Round toggle button — fixed top-right
───────────────────────────────────────────── */
export function LangToggle() {
    const { lang, toggle } = useLang()
    return (
        <motion.button
            onClick={toggle}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
            title={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
            className="fixed top-4 right-4 z-[150] w-12 h-12 rounded-full
        bg-[var(--surface-raised)] border border-[var(--border)]
        flex items-center justify-center
        text-xs font-bold text-white tracking-wide
        shadow-[0_4px_20px_rgba(0,0,0,0.4)]
        hover:border-[var(--accent)]/60
        hover:shadow-[0_0_20px_rgba(0,102,255,0.3)]
        transition-all duration-200 cursor-pointer"
            style={{ userSelect: 'none' }}
        >
            <motion.span
                key={lang}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
            >
                {lang === 'es' ? 'EN' : 'ES'}
            </motion.span>
        </motion.button>
    )
}
