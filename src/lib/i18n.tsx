import { createContext, useContext, useState } from 'react'
import { motion } from 'framer-motion'

type Lang = 'en' | 'es'

/* ─────────────────────────────────────────────
   All translatable strings
───────────────────────────────────────────── */
const translations = {
    en: {
        // Welcome Screen
        welcomeTitle1: 'Your professional website',
        welcomeTitle2: 'ready today',
        welcomeSubtitle: 'Forget the stress of designing from scratch or paying thousands to an agency. Just tell us what your business is about: think it, write it, and launch your website in minutes.',
        welcomeCTA: 'Build my site in 2 minutes',
        welcomeCTALogin: 'Already have an account? Log in',

        // Auth
        authRegister: 'Start Free',
        authLogin: 'Log In',
        authFirstName: 'First name',
        authLastName: 'Last name',
        authPhone: 'WhatsApp number',
        authEmail: 'Email',
        authPassword: 'Password (min. 6 chars)',
        authRegisterBtn: 'Create Account & Start',
        authLoginBtn: 'Log In',
        authHaveAccount: 'Already have an account?',
        authNoAccount: "Don't have an account?",
        authSuccessTitle: 'Welcome to Vibepick!',
        authSuccessSub: 'Your account is ready. Let\'s build your first website.',
        authLogout: 'Log out',
        authGreeting: 'Hi',

        // Problem Section
        problemTitle1: 'Building a website used to be a nightmare.',
        problemTitle2: 'But your competition already has theirs.',
        problemBody1: 'You face complicated builders where nothing fits, or you resign yourself to paying $1,200 to an agency that will take weeks. Meanwhile, you keep losing clients online.',
        problemBody2: 'What if you could skip the boring part? Straight to the final result: a page that looks incredible and brings clients on autopilot.',

        // Benefits
        benefitsTag: 'Why it works',
        benefitsTitle: 'From your idea to the screen, no middlemen',
        benefitsItems: [
            { title: 'Zero technical barriers', desc: 'If you can describe it, you already have it. No code. No tutorials. No frustration.' },
            { title: 'Built to sell', desc: "It's not a pretty page. It's a client-capturing machine. Every section has a purpose." },
            { title: 'From idea to link in minutes', desc: 'Today you can say "here\'s my site." No weeks. No agency. No waiting.' },
            { title: 'Secure from the first prompt', desc: '90% of AI-built sites have vulnerabilities. Vibepick prompts include web security best practices so your business is protected from day one.' },
        ],

        // Why Vibepick
        whyTag: 'The Vibepick Difference',
        whyTitle: 'Why choose Vibepick?',
        whyItems: [
            { title: 'Real conversion engineering', desc: "Not a pretty builder. The result of years optimizing sites that actually sell." },
            { title: 'What agencies charge $1,200 for — in minutes', desc: 'No middlemen. No waiting. You in control.' },
            { title: 'Your first impression is worth millions', desc: '75% of people decide if they trust you based on your website. Is yours closing deals — or driving them away?' },
            { title: 'Security that Vibecoding doesn\'t give you', desc: 'AI makes pretty sites. But pretty isn\'t secure. Vibepick prompts include web security layers that protect your business and your clients\' data from day one.' },
        ],

        // FAQ
        faqTag: 'Common Questions',
        faqTitle: 'Frequently Asked Questions',
        faqItems: [
            { q: 'What exactly is Vibepick?', a: "It's the missing piece any AI needs to build a website that actually works. You describe, Vibepick turns your idea into perfect instructions. Zero guesswork." },
            { q: 'Do I need to know how to code?', a: 'Not at all. If you can describe your business in one sentence — which you already do every day — you know everything you need. The technical part is our problem.' },
            { q: 'Can I try it before paying?', a: '2 completely free generations. No credit card. No catch. Use them and judge for yourself. Most people decide after the first one.' },
            { q: 'Why not just use ChatGPT?', a: "ChatGPT doesn't know UX, conversion copywriting, or web architecture. Vibepick condensed years of that into a system. It's like comparing a top chef vs. Googling recipes." },
            { q: 'How good is it compared to an agency?', a: 'Agencies charge $1,200–$5,000 and take weeks. Vibepick uses the same methodologies — in minutes and at a fraction of the cost. The difference: you\'re in control.' },
            { q: 'What do I do after generating my prompt?', a: 'Copy and paste it into Lovable, Bolt, v0, or AntiGravity AI Studio. In seconds your site comes to life. No code. No complications. Just results.' },
            { q: 'Will my AI-built site be secure?', a: "That's the question nobody's asking — and they should be. Most AI-built sites are vulnerable: no proper HTTPS, no form validation, no data protection. Vibepick prompts are designed to include these security layers. Your business deserves a site that doesn't just look good — it protects your clients too." },
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
        downloadZip: 'Download Project (ZIP)',
        unlockPremium: 'Unlock Premium Strategy 🔒',
        premiumLockedMsg: 'You reached your free limit. To copy the high-conversion framework and export your images, please upgrade.',
        unlockPowerFull: 'Unlock the full power: Downloading the ZIP gives you this ultra-optimized prompt alongside all your uploaded images. Drop it into any AI code developer and watch the AI magically make your website ready for you, respecting 100% of your visual identity.',

        // Bottom section
        pasteInto: 'Paste into',
        pasteIntoSuffix: ', or any AI builder',
        keepScrolling: 'Keep scrolling',
        requestAdvisory: 'Request 1:1 Advisory',
        madeBy: 'Made with',
        byDaniel: 'by Daniel Díaz',
        followUs: 'Follow us on social media for more value:',
    },

    es: {
        // Welcome Screen
        welcomeTitle1: 'Tu sitio web profesional',
        welcomeTitle2: 'listo hoy mismo',
        welcomeSubtitle: 'Olvídate del estrés de diseñar desde cero o pagar miles a una agencia. Solo cuéntanos de qué va tu negocio: piénsalo, escríbelo y lanza tu sitio web en cuestión de minutos.',
        welcomeCTA: 'Crear mi sitio en 2 minutos',
        welcomeCTALogin: '¿Ya tienes cuenta? Inicia sesión',

        // Auth
        authRegister: 'Empezar Gratis',
        authLogin: 'Entrar',
        authFirstName: '¿Cuál es tu nombre?',
        authLastName: 'Tu apellido',
        authPhone: 'Número de WhatsApp',
        authEmail: 'Correo electrónico',
        authPassword: 'Crea una contraseña (mín. 6 letras/números)',
        authRegisterBtn: 'Crear cuenta y empezar',
        authLoginBtn: 'Ingresar a mi cuenta',
        authHaveAccount: '¿Ya tienes una cuenta?',
        authNoAccount: '¿Es tu primera vez aquí?',
        authSuccessTitle: '¡Bienvenido a Vibepick!',
        authSuccessSub: 'Tu cuenta está lista. Vamos a crear tu primer sitio web.',
        authLogout: 'Cerrar sesión',
        authGreeting: 'Hola',

        // Problem Section
        problemTitle1: 'Hacer una página web solía ser una pesadilla.',
        problemTitle2: 'Pero tu competencia ya tiene la suya.',
        problemBody1: 'Te enfrentas a constructores complicados donde nada cuadra, o te resignas a pagarle $1,200 USD a una agencia que tardará semanas. Mientras tanto, sigues perdiendo clientes en internet.',
        problemBody2: '¿Y si pudieras saltarte la parte aburrida? Directo al resultado final: una página que se ve increíble y trae clientes en automático.',

        // Benefits
        benefitsTag: 'Por qué funciona',
        benefitsTitle: 'De la idea a tu pantalla, sin intermediarios',
        benefitsItems: [
            { title: 'Cero barrera técnica', desc: 'Si puedes describirlo, ya lo tienes. Sin código. Sin tutoriales. Sin frustraciones.' },
            { title: 'Diseñado para vender', desc: 'No es una página bonita. Es una máquina de capturar clientes. Cada sección tiene un propósito.' },
            { title: 'De idea a enlace en minutos', desc: 'Hoy mismo puedes decir "aquí está mi página". Sin semanas. Sin agencia. Sin esperas.' },
            { title: 'Seguro desde el primer prompt', desc: 'El 90% de los sitios creados con IA tienen vulnerabilidades. Los prompts de Vibepick incluyen buenas prácticas de seguridad web para que tu negocio esté protegido desde el día uno.' },
        ],

        // Why Vibepick
        whyTag: 'La Diferencia Vibepick',
        whyTitle: '¿Por qué elegir Vibepick?',
        whyItems: [
            { title: 'Ingeniería de conversión real', desc: 'No es un constructor bonito. Es el resultado de años optimizando sitios que realmente venden.' },
            { title: 'Lo que las agencias cobran $1,200 por hacer — tú lo haces en minutos', desc: 'Sin intermediarios. Sin esperas. Tú en control.' },
            { title: 'Tu primera impresión vale millones', desc: 'El 75% de la gente decide si confía en ti por tu sitio web. ¿El tuyo está cerrando ventas o ahuyentando clientes?' },
            { title: 'Seguridad que el Vibecoding no te da', desc: 'La IA puede hacer sitios bonitos. Pero bonito no significa seguro. Vibepick genera prompts que contemplan seguridad web, protegiendo tu negocio y la data de tus clientes desde el día uno.' },
        ],

        // FAQ
        faqTag: 'Preguntas Comunes',
        faqTitle: 'Preguntas Frecuentes',
        faqItems: [
            { q: '¿Qué es Vibepick exactamente?', a: 'Es el sistema que le falta a cualquier IA para crear un sitio web que realmente funcione. Tú describes, Vibepick convierte tu idea en instrucciones perfectas. Cero conjeturas.' },
            { q: '¿Necesito saber programar?', a: 'Para nada. Si puedes describir tu negocio en una frase — lo cual ya haces todos los días — ya sabes todo lo que necesitas. Lo técnico es nuestro problema.' },
            { q: '¿Puedo probarlo antes de pagar?', a: '2 generaciones completamente gratis. Sin tarjeta. Sin trampa. Úsalos y juzga tú mismo. La mayoría no necesita más de uno para decidir.' },
            { q: '¿Por qué no simplemente usar ChatGPT?', a: 'ChatGPT no sabe de UX, ni de copy de conversión, ni de arquitectura web. Vibepick condensó años de eso en un sistema. Es como comparar un chef profesional con buscar recetas en Google.' },
            { q: '¿Qué tan bueno es comparado con una agencia?', a: 'Las agencias cobran $1,200–$5,000 USD y tardan semanas. Vibepick usa las mismas metodologías — en minutos y por una fracción del precio. La diferencia es que tú tienes el control.' },
            { q: '¿Qué hago después de generar mi prompt?', a: 'Lo copias y pegas en Lovable, Bolt, v0 o AntiGravity AI Studio. En segundos tu sitio toma vida. Sin código. Sin complicaciones. Solo resultado.' },
            { q: '¿Mi sitio web será seguro si lo hago con IA?', a: 'Esa es la pregunta que nadie está haciendo — y deberían. La mayoría de sitios creados con IA son vulnerables: sin HTTPS correcto, sin validación de formularios, sin protección de datos. Los prompts de Vibepick están diseñados para incluir estas capas de seguridad. Tu negocio merece un sitio que no solo se vea bien, sino que proteja a tus clientes.' },
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
        downloadZip: 'Descargar Proyecto (ZIP)',
        unlockPremium: 'Desbloquear Estrategia Premium 🔒',
        premiumLockedMsg: 'Alcanzaste el límite gratuito. Para copiar la estructura de conversión de alto rendimiento y exportar imágenes, adquiere Ilimitado.',
        unlockPowerFull: 'Desbloquea el poder total: Al descargar el Proyecto ZIP, obtendrás este prompt ultra-optimizado junto a todas las imágenes y logos que subiste. Sube este archivo ZIP directamente a cualquiera de los desarrolladores de código con IA y observa cómo la IA, por arte de magia, hace tu sitio web listo para ti respetando al 100% tu identidad visual.',

        // Bottom section
        pasteInto: 'Pégalo en',
        pasteIntoSuffix: ', o en cualquier IA',
        keepScrolling: 'Seguir bajando',
        requestAdvisory: 'Solicitar Asesoría 1:1',
        madeBy: 'Hecho con',
        byDaniel: 'por Daniel Díaz',
        followUs: 'Síguenos en nuestras redes sociales para más valor:',
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
