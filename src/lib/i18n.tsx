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
        welcomeCTA: '🚀 Try it Free Now',
        welcomeCTALogin: 'Already have an account? Log in',

        // Auth
        authRegister: 'Sign Up',
        authLogin: 'Log In',
        authFirstName: 'First name',
        authLastName: 'Last name',
        authPhone: 'Phone number',
        authEmail: 'Email',
        authPassword: 'Password',
        authRegisterBtn: 'Create Free Account',
        authLoginBtn: 'Log In',
        authHaveAccount: 'Already have an account?',
        authNoAccount: "Don't have an account?",
        authSuccessTitle: 'Welcome to Vibepick!',
        authSuccessSub: 'Your account is ready. Let\'s build your first website.',
        authLogout: 'Log out',
        authGreeting: 'Hi',

        // Problem Section
        problemTitle1: 'Your competition already has their website.',
        problemTitle2: 'Are you still "thinking about it"?',
        problemBody1: 'Every day without a professional website, you lose clients who end up buying from someone else. Not because you\'re worse. But because they can\'t find you.',
        problemBody2: 'Agencies know this. That\'s why they charge $2,000 to $5,000 for a site you could have ready in the next 5 minutes.',

        // Benefits
        benefitsTag: 'Why Vibepick Works',
        benefitsTitle: 'Results that speak for themselves',
        benefitsItems: [
            { title: 'Websites that turn visitors into buyers', desc: 'Vibepick doesn\'t generate pretty websites. It generates websites that sell. Every prompt is designed with conversion principles that transform curious visitors into real customers.' },
            { title: 'Designed for YOUR business, not just anyone', desc: 'When you describe your business, Vibepick analyzes your niche, your audience and your style to create something only you could have. No templates. No generics.' },
            { title: 'The same technology top agencies use', desc: 'The best digital agencies already use AI to design high-performance websites. The difference is they charge thousands. You do it yourself, now.' },
            { title: 'In 2 minutes, not 2 months', desc: 'While others spend weeks waiting for sketches and quotes, you already have your prompt ready to copy and paste. The time you save is worth more than any investment.' },
        ],

        // Why Vibepick
        whyTag: 'The Vibepick Difference',
        whyTitle: 'Why choose Vibepick?',
        whyItems: [
            { title: 'Built by conversion specialists', desc: 'Behind Vibepick are experts in high-performance websites — the ones that transform traffic into real revenue. Conversion engineers.' },
            { title: 'Access that was once exclusive', desc: 'Professional AI prompts for agency-level websites are a well-kept secret. Vibepick puts them in your hands. No middlemen. No waiting. No excuses.' },
            { title: 'Your first impression defines everything', desc: '75% of people judge a business\'s credibility by its website. What does yours say? Or worse — what does NOT having one say?' },
        ],

        // FAQ
        faqTag: 'Common Questions',
        faqTitle: 'Frequently Asked Questions',
        faqItems: [
            { q: 'What exactly is Vibepick?', a: 'It\'s an AI system that generates professional prompts to create high-performance websites. You describe your business, Vibepick does the rest.' },
            { q: 'Do I need to know how to code?', a: 'No. If you can describe your business in one sentence, you already know everything you need. Vibepick translates your vision into perfect technical instructions.' },
            { q: 'Can I try it before paying?', a: 'Yes. You get 2 completely free generations to see the quality for yourself. No credit card. No commitment.' },
            { q: 'Why not just use ChatGPT?', a: 'You can. But writing a prompt that actually generates a website that converts requires understanding design, UX, copywriting and web architecture. Vibepick condenses all of that into one click.' },
            { q: 'How good is it compared to an agency?', a: 'Vibepick prompts are designed with the same methodologies agencies charge $2,000–$5,000 for. They take weeks. You take minutes.' },
            { q: 'What do I do after generating my prompt?', a: 'Copy it and paste it into any AI builder: Lovable, Bolt, v0, or AntiGravity AI Studio. In seconds you\'ll have your website ready.' },
        ],

        // CTA Final
        ctaFinalText: 'Create your first website for free',

        // Paywall
        paywallHint: 'You\'ve seen what Vibepick can do',
        paywallTitle: 'Unlimited websites.',
        paywallDesc: 'Generate all the prompts you need. No limits. No restrictions. Less than a coffee per month.',
        paywallBonus: 'Monthly class: strategies to sell websites to businesses and clients',
        paywallCTA: 'Unlock Unlimited Access',
        paywallWhatsApp: '¿Questions? Talk to us',
        paywallCancel: 'Cancel anytime. No contracts.',

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
        welcomeCTA: '🚀 Pruébalo Gratis Ahora',
        welcomeCTALogin: '¿Ya tienes cuenta? Inicia sesión',

        // Auth
        authRegister: 'Registrarse',
        authLogin: 'Iniciar Sesión',
        authFirstName: 'Nombre',
        authLastName: 'Apellido',
        authPhone: 'Teléfono',
        authEmail: 'Correo electrónico',
        authPassword: 'Contraseña',
        authRegisterBtn: 'Crear Cuenta Gratis',
        authLoginBtn: 'Iniciar Sesión',
        authHaveAccount: '¿Ya tienes cuenta?',
        authNoAccount: '¿No tienes cuenta?',
        authSuccessTitle: '¡Bienvenido a Vibepick!',
        authSuccessSub: 'Tu cuenta está lista. Vamos a crear tu primer sitio web.',
        authLogout: 'Cerrar sesión',
        authGreeting: 'Hola',

        // Problem Section
        problemTitle1: 'Tu competencia ya tiene su sitio web.',
        problemTitle2: '¿Tú sigues "pensándolo"?',
        problemBody1: 'Cada día sin un sitio web profesional, pierdes clientes que terminan comprándole a alguien más. No porque seas peor. Sino porque no te encuentran.',
        problemBody2: 'Las agencias lo saben. Por eso cobran $2,000 a $5,000 USD por un sitio que podrías tener listo en los próximos 5 minutos.',

        // Benefits
        benefitsTag: 'Por qué funciona',
        benefitsTitle: 'Resultados que hablan por sí solos',
        benefitsItems: [
            { title: 'Sitios que convierten visitantes en compradores', desc: 'Vibepick no genera sitios bonitos. Genera sitios que venden. Cada prompt está diseñado con principios de conversión que transforman curiosos en clientes reales.' },
            { title: 'Diseñado para TU negocio, no para cualquiera', desc: 'Cuando describes tu negocio, Vibepick analiza tu nicho, tu audiencia y tu estilo para crear algo que solo tú podrías tener. No plantillas. No genéricos.' },
            { title: 'La misma tecnología que usan las agencias top', desc: 'Las mejores agencias digitales ya usan IA para diseñar sitios de alto rendimiento. La diferencia es que ellas cobran miles. Tú lo haces tú mismo, ahora.' },
            { title: 'En 2 minutos, no en 2 meses', desc: 'Mientras otros pasan semanas esperando bocetos y presupuestos, tú ya tienes tu prompt listo para copiar y pegar. El tiempo que ahorras vale más que cualquier inversión.' },
        ],

        // Why Vibepick
        whyTag: 'La Diferencia Vibepick',
        whyTitle: '¿Por qué elegir Vibepick?',
        whyItems: [
            { title: 'Creado por especialistas en conversión', desc: 'Detrás de Vibepick hay expertos en sitios web de alto rendimiento — los que transforman tráfico en ingresos reales. Ingenieros de conversión.' },
            { title: 'Acceso que antes era exclusivo', desc: 'Los prompts profesionales de IA para sitios web de agencia son un secreto bien guardado. Vibepick los pone en tus manos. Sin intermediarios. Sin esperas. Sin excusas.' },
            { title: 'Tu primera impresión define todo', desc: 'El 75% de las personas juzga la credibilidad de un negocio por su sitio web. ¿Qué dice el tuyo sobre ti? O peor — ¿qué dice no tener uno?' },
        ],

        // FAQ
        faqTag: 'Preguntas Comunes',
        faqTitle: 'Preguntas Frecuentes',
        faqItems: [
            { q: '¿Qué es Vibepick exactamente?', a: 'Es un sistema de IA que genera prompts profesionales para crear sitios web de alto rendimiento. Tú describes tu negocio, Vibepick hace el resto.' },
            { q: '¿Necesito saber programar?', a: 'No. Si puedes describir tu negocio en una frase, ya sabes todo lo que necesitas. Vibepick traduce tu visión en instrucciones técnicas perfectas.' },
            { q: '¿Puedo probarlo antes de pagar?', a: 'Sí. Tienes 2 generaciones completamente gratis para que veas la calidad por ti mismo. Sin tarjeta. Sin compromiso.' },
            { q: '¿Por qué no simplemente usar ChatGPT?', a: 'Puedes. Pero escribir un prompt que realmente genere un sitio web que convierta requiere entender diseño, UX, copywriting y arquitectura web. Vibepick condensa todo eso en un clic.' },
            { q: '¿Qué tan bueno es comparado con una agencia?', a: 'Los prompts de Vibepick están diseñados con las mismas metodologías que usan agencias que cobran $2,000–$5,000 USD. Ellas tardan semanas. Tú tardas minutos.' },
            { q: '¿Qué hago después de generar mi prompt?', a: 'Cópialo y pégalo en cualquier constructor IA: Lovable, Bolt, v0, o AntiGravity AI Studio. En segundos tendrás tu sitio web listo.' },
        ],

        // CTA Final
        ctaFinalText: 'Crea tu primer sitio web gratis',

        // Paywall
        paywallHint: 'Ya viste lo que Vibepick puede hacer',
        paywallTitle: 'Sitios web ilimitados.',
        paywallDesc: 'Genera todos los prompts que necesites. Sin límites. Sin restricciones. Menos que un café al mes.',
        paywallBonus: 'Clase mensual: estrategias para vender sitios web a empresas y clientes',
        paywallCTA: 'Desbloquear Acceso Ilimitado',
        paywallWhatsApp: '¿Preguntas? Habla con nosotros',
        paywallCancel: 'Cancela cuando quieras. Sin contratos.',

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
