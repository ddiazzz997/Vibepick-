export interface PromptInputs {
  description: string
  niche: string
  vibe: string | null
  sections: string[]
  cta: string
  lang?: 'en' | 'es'
  siteLang?: string          // Language for the GENERATED website (e.g. 'Spanish', 'English')
  whatsapp?: string          // WhatsApp number in international format (e.g. 573001234567)
  instagram?: string         // Instagram URL
  facebook?: string          // Facebook URL
  tiktok?: string            // TikTok URL
  linkedin?: string          // LinkedIn URL
  customLink?: string        // Custom Website / Link URL
  logoAnnotation?: string    // Text annotation for logo image
  logoDataUrl?: string       // Base64 image data for the logo
  clientLogos?: Array<{ dataUrl: string; annotation: string }> // Client logos / Testimonials
  assets?: Array<{ dataUrl: string; annotation: string }> // Images with annotations
  inspirations?: Array<{ dataUrl: string; annotation: string }> // Inspiration screenshot dataUrls
  testimonials?: Array<{ name: string; role: string; text: string; photo?: string }> // Real customer testimonials
}

/*
  Vibe prompts — intentionally concise.
  We give the AI a *direction* not a spec sheet.
*/
const vibePrompts: Record<string, { en: string; es: string }> = {
  'clean': {
    en: `Design style: Clean and modern. Lots of whitespace, soft shadows, light backgrounds, rounded corners. Feels like a premium SaaS product. Professional but approachable. Think Linear or Notion.`,
    es: `Estilo de diseño: Limpio y moderno. Mucho espacio en blanco, sombras suaves, fondos claros, esquinas redondeadas. Se siente como un producto SaaS premium. Profesional pero accesible. Piensa en Linear o Notion.`,
  },
  'bold': {
    en: `Design style: Bold and high-impact. Dark background with strong accent colors. Big typography, confident layout, striking contrast. Feels like a tech startup that means business. Think Vercel or Stripe.`,
    es: `Estilo de diseño: Audaz y de alto impacto. Fondo oscuro con colores de acento fuertes. Tipografía grande, diseño seguro, contraste llamativo. Se siente como una startup tecnológica que va en serio. Piensa en Vercel o Stripe.`,
  },
  'warm': {
    en: `Design style: Warm and inviting. Soft earth tones, cream/off-white backgrounds, rounded shapes. Feels friendly, trustworthy, and human. Think of a premium wellness or lifestyle brand.`,
    es: `Estilo de diseño: Cálido y acogedor. Tonos tierra suaves, fondos crema/blanquecinos, formas redondeadas. Se siente amigable, confiable y humano. Piensa en una marca premium de bienestar o estilo de vida.`,
  },
  'playful': {
    en: `Design style: Playful and colorful. Bright accent colors, rounded everything, fun micro-interactions. Feels energetic and creative without being childish. Think Figma or Notion.`,
    es: `Estilo de diseño: Alegre y colorido. Colores de acento brillantes, todo redondeado, micro-interacciones divertidas. Se siente enérgico y creativo sin ser infantil. Piensa en Figma o Notion.`,
  },
  'luxury': {
    en: `Design style: Elegant and luxurious. Dark or cream backgrounds, serif headings, lots of breathing room, gold or muted accent tones. Feels like a high-end editorial magazine. Think Apple or Aesop.`,
    es: `Estilo de diseño: Elegante y lujoso. Fondos oscuros o crema, títulos en serif, mucho espacio, tonos dorados o acentos sutiles. Se siente como una revista editorial de alta gama. Piensa en Apple o Aesop.`,
  },
  'vibrant': {
    en: `Design style: Vibrant with gradients. Bold color gradients on hero and CTAs, dark base, glowing accents. Feels cutting-edge and energetic. Think a modern AI startup.`,
    es: `Estilo de diseño: Vibrante con degradados. Gradientes de colores audaces en el hero y CTAs, base oscura, acentos brillantes. Se siente de vanguardia y enérgico. Piensa en una startup de IA moderna.`,
  },
}

const sectionPrompts: Record<string, { en: string; es: string }> = {
  'Hero': {
    en: `Hero — Big bold headline (8 words max), one-line description underneath, and a prominent call-to-action button. Add an image, mockup, or illustration on the right side.`,
    es: `Hero — Titular grande y audaz (máximo 8 palabras), una línea de descripción debajo, y un botón de llamada a la acción prominente. Agrega una imagen, mockup o ilustración en el lado derecho.`,
  },
  'Social Proof': {
    en: `Social proof — A row of recognizable logos in an infinite horizontal auto-scrolling marquee (very slow: 35-40 second full cycle). Logos must be displayed in GRAYSCALE by default (CSS filter: grayscale(100%)) and smoothly transition to full color on hover. Include a prominent credibility counter above: 'Trusted by 2,347+ businesses worldwide'. Use realistic, industry-appropriate company logos. The logos section is NOT just decoration — it is the #1 trust builder on the page.`,
    es: `Prueba social — Una fila de logos reconocibles en un marquee de desplazamiento horizontal automático infinito (muy lento: ciclo completo de 35-40 segundos). Los logos deben mostrarse en ESCALA DE GRISES por defecto (CSS filter: grayscale(100%)) y transicionar suavemente a color completo al hover. Incluye un contador de credibilidad prominente arriba: 'Más de 2,347 empresas confían en nosotros'. Usa logos de empresas realistas y apropiados para la industria. La sección de logos NO es solo decoración — es el constructor de confianza #1 de la página.`,
  },
  'Features': {
    en: `Features — A grid of 3-6 benefit cards. Each has an icon, short title, and one-sentence description. Focus on what the customer gets, not technical features.`,
    es: `Características — Una cuadrícula de 3-6 tarjetas de beneficios. Cada una tiene un ícono, título corto y una descripción de una oración. Enfócate en lo que obtiene el cliente, no en características técnicas.`,
  },
  'How It Works': {
    en: `How it works — 3 simple numbered steps showing the customer journey. Each step has a title and short description. Connect them visually.`,
    es: `Cómo funciona — 3 pasos numerados simples que muestran el recorrido del cliente. Cada paso tiene un título y descripción corta. Conéctalos visualmente.`,
  },
  'Testimonials': {
    en: `Testimonials — 2-3 customer quotes with names, titles, and photos. Make them feel real and specific.`,
    es: `Testimonios — 2-3 citas de clientes con nombres, cargos y fotos. Hazlos sentir reales y específicos.`,
  },
  'Pricing': {
    en: `Pricing — 2-3 pricing tiers side by side. Each shows the plan name, price, feature list, and a button. Highlight the best-value option.`,
    es: `Precios — 2-3 planes de precios lado a lado. Cada uno muestra el nombre del plan, precio, lista de características y un botón. Resalta la opción de mejor valor.`,
  },
  'FAQ': {
    en: `FAQ — 5-6 common questions in an expandable accordion. Practical, real questions that this niche would actually get.`,
    es: `Preguntas frecuentes — 5-6 preguntas comunes en un acordeón expandible. Preguntas prácticas y reales que realmente recibiría este nicho.`,
  },
  'Contact Form': {
    en: `Contact form — Name, email, and message fields with a submit button. Clean and simple.`,
    es: `Formulario de contacto — Campos de nombre, correo electrónico y mensaje con un botón de enviar. Limpio y sencillo.`,
  },
  'Newsletter': {
    en: `Newsletter signup — A short compelling line with an inline email input and subscribe button.`,
    es: `Suscripción al boletín — Una línea corta y atractiva con un campo de correo electrónico en línea y botón de suscribirse.`,
  },
  'Stats': {
    en: `Stats bar — 3-4 impressive numbers (like "10,000+ customers" or "99% satisfaction"). Big bold numbers with labels.`,
    es: `Barra de estadísticas — 3-4 números impresionantes (como "10,000+ clientes" o "99% de satisfacción"). Números grandes y audaces con etiquetas.`,
  },
  'CTA Banner': {
    en: `Bottom CTA — A full-width section near the end with a bold headline and the main call-to-action button. Last push before the footer.`,
    es: `CTA inferior — Una sección de ancho completo cerca del final con un titular audaz y el botón principal de llamada a la acción. Último impulso antes del pie de página.`,
  },
  'Footer': {
    en: `Footer — Logo, navigation links in columns, social media icons, and copyright text. Clean and organized.`,
    es: `Pie de página — Logo, enlaces de navegación en columnas, íconos de redes sociales y texto de copyright. Limpio y organizado.`,
  },
}

const promptText = {
  en: {
    buildMe: 'Build me a beautiful, complete, high-conversion, single-page website.',
    whatFor: "**What it's for:**",
    placeholder: '[Describe your website/business here]',
    businessType: '**Type of business:**',
    mainButton: '**Main button text:**',
    defaultCta: 'Get Started',
    defaultVibe: 'Choose the best design style based on the type of website described. Make it look premium and modern.',
    colorPalette: "Pick a color palette that feels right for this type of business. Don't overthink it — just choose colors that look great together and fit the vibe.",
    pageSections: '**Page sections (build them in this order):**',
    defaultSections: 'Choose the best sections for this type of website. Always include a hero and footer.',
    important: '**Important:**',
    responsive: '- Make it fully responsive (looks great on phone and desktop)',
    realText: "- Use real, realistic placeholder text — not lorem ipsum. Write copy that actually fits this business.",
    animations: '- Add smooth, subtle animations (fade in on scroll, hover effects on buttons and cards)',
    ctaPosition: '- The call-to-action button should appear above the fold and repeat near the bottom',
    cleanCode: '- Keep the code clean and production-ready. Single page, no routing.',
    techStack: '- Use React with Tailwind CSS',
    conversionTitle: '**Conversion optimization:**',
    conversionCopy: '- Write ALL copy from the customer\'s benefit perspective, NOT from product features. The headline must answer "What do I gain?" in 8 words max.',
    conversionUrgency: '- Include natural urgency or scarcity elements where appropriate (e.g. "Only 5 spots left this month", "Limited availability").',
    conversionTestimonials: '- Testimonials must include specific results with numbers (e.g. "I increased my sales by 43% in 60 days — María G."). Never use vague praise.',
    conversionCtaRepeat: '- Repeat the main CTA button at least 3 times throughout the page: in the hero, mid-page, and at the bottom.',
    conversionAnchoring: '- If there are pricing tiers, show the most expensive option first to create price anchoring so the middle option feels like a deal.',
    conversionRiskReversal: '- Include a risk-reversal element near the CTA (e.g. "30-day money-back guarantee", "No credit card required", "Cancel anytime").',
    premiumTitle: '**Premium design & color psychology:**',
    premiumColorPsychology: '__INDUSTRY_COLOR__',
    premiumTheme: '__INDUSTRY_THEME__',
    premiumTypography: '**MANDATORY FONTS (do not use system fonts or browser defaults):**\n__INDUSTRY_TYPO__\n- Add the @import URL from Google Fonts at the TOP of your CSS/Tailwind config. Set font-family on html/body and override all h1-h3 headings explicitly. Do not let the framework override these fonts.',
    premiumGlass: '- Use glassmorphism on cards (semi-transparent background + subtle 1px white border at 10% opacity + backdrop-blur) and a sticky navbar with backdrop-blur.',
    premiumAnimations: '- Use stagger animations: elements appear in cascade (one after another with 100-150ms delay). Stats/numbers must animate counting up when visible. The main CTA button should have a subtle pulsing glow/shadow behind it.',
    premiumGradient: '- The main headline should use gradient text (gradient on the text itself, not the background). Use animated subtle gradients on the hero section and CTA buttons.',
    premiumScroll: '- Enable smooth scroll across the entire page. Add a logo scroller with infinite horizontal loop for the social proof section.',
    imagesTitle: '**Photography & Visual Assets:**',
    imagesContext: '- Use highly relevant, professional-quality images that match the exact industry and vibe perfectly (e.g., Unsplash source URLs). NO generic, random, or unrelated stock photos. The visual assets MUST accurately represent the business described.',
    visualExpTitle: '**Premium visual experience (mandatory):**',
    visualExpBackground: '- Add a full-page dynamic background animation using HTML5 Canvas (Vanilla JS, no libraries). Position it behind all content (z-index: -1, pointer-events: none). Use Perlin or Simplex noise for organic, natural movement — NEVER Math.random(). Use at least 2-3 layers at different speeds and opacities to create cinematic depth. The animation must react subtly to the mouse cursor (soft magnetic repulsion with inertia) and shift gently as the user scrolls. Particle/element colors must be derived from the brand palette, not generic white. Must run at 60fps using requestAnimationFrame. Use filter: blur(60-100px) on large asymmetric shapes to create immersive aurora glow pools of light rather than small discrete particles. Use globalCompositeOperation = screen or color-dodge to blend overlapping colors into luminous highlights. Target opacity: 15-25% for the main glow shapes (NOT 8-10% — that is too invisible). The background must be FELT, not just technically present. Think aurora borealis, not TV static.',
    visualExpBgAdapt: '__INDUSTRY_BG__',
    visualExpCards: '- Feature, Pricing, and Testimonial cards MUST have animated gradient borders — not static borders. Use a CSS pseudo-element (::before) with a rotating conic-gradient in brand colors behind the card. The gradient must rotate slowly and continuously (minimum 4-second cycle). On hover: the border glows brighter, rotation speeds up, and a soft expanded shadow appears. Card background must use glassmorphism (semi-transparent + backdrop-blur). Border-radius: minimum 16px. Do NOT apply animated borders to every single element — only key cards. If everything glows, nothing stands out.',
    visualExpImages: '- Images must have a scroll-triggered reveal animation (clip-path or mask wipe, not just fade-in). On hover, apply a subtle 3D perspective tilt effect or smooth zoom. Add a single diagonal shimmer/shine sweep that crosses the image once when it becomes visible.',
    visualExpButtons: '- The main CTA button must have a continuously pulsing glow/aura behind it (a soft shadow that breathes in and out). On hover: scale up slightly + shadow expands + gradient shifts. On click: a ripple wave expands from the click point. Secondary buttons should have a subtle border shimmer on hover.',
    neuroTitle: '**Neuromarketing & persuasive copywriting:**',
    neuroNarrative: '- Structure the ENTIRE page as an emotional narrative arc (PASO): start the Hero with the desired Outcome ("Imagine..."), then introduce the Pain the visitor faces today, Agitate that pain subtly ("Every day without this, you lose..."), present the Solution (your product/service as the bridge), and close with social Proof + final CTA. Each section must flow into the next like a story, not feel like isolated blocks.',
    neuroFuturePacing: '- Use future pacing in the Hero subtitle and final CTA section. Make the visitor visualize their life AFTER using the product: "Imagine waking up to...", "Picture your business with...", "What if you could...". This activates the same brain regions as lived experience.',
    neuroPowerWords: '- Naturally integrate power words throughout the copy: "exclusive", "effortless", "proven", "transform", "unlock", "guaranteed", "instant", "discover". These must feel organic and spontaneous — NEVER forced or desperate. The tone must sound like a confident expert who knows their value, not a salesperson begging for attention.',
    neuroTribal: '- Use belonging language for social proof: "Join the 2,347 entrepreneurs who already..." instead of "We have 2,347 clients". The visitor must feel they are joining an exclusive group, not just buying something.',
    neuroSpecificity: '- NEVER use round numbers. Always use specific, credible figures: "2,347 businesses" not "2,000+", "43% increase" not "significant increase", "in 47 days" not "in about a month". Specific numbers trigger the brain\'s credibility bias.',
    neuroMicroCopy: '- ALL CTA button text must be in first person from the visitor\'s perspective: "Yes, I want this →" not "Buy now", "Start my free trial" not "Sign up", "Send me the guide" not "Download", "Let\'s talk about my project" not "Contact us". The visitor must feel the button is THEIR decision, not a command.',
    polishTitle: '**Cinematic polish & micro-interactions:**',
    polishEntrance: '__INDUSTRY_PRELOADER__',
    polishScrollBar: '- Add a thin scroll progress bar at the very top of the page (2-3px height, brand accent color) that fills from left to right as the user scrolls down. This activates the psychological desire to complete (people want to reach 100%).',
    polishCursor: '__INDUSTRY_CURSOR__',
    polishNavActive: '- The sticky navbar must highlight the currently visible section as the user scrolls. The active link should have a subtle accent underline or color change that transitions smoothly between sections.',
    mobileTitle: '**Mobile conversion optimization:**',
    mobileStickyBar: '- On mobile devices, add a sticky CTA bar fixed to the bottom of the screen that is always visible while scrolling. It must contain the main CTA button. This ensures the visitor never has to search for how to take action.',
    mobileFloatingBtn: '- Add a floating circular contact button (WhatsApp icon or chat icon) fixed to the bottom-right corner on all devices. It must have a subtle pulse animation to attract attention without being intrusive. On click, open the WhatsApp API or contact form.',
    mobileTouchTargets: '- All interactive elements must have minimum 44x44px touch targets on mobile. Testimonials and feature cards must become swipeable horizontal carousels on mobile screens instead of stacked grids.',
    metaTitle: '**SEO & Social sharing:**',
    metaTags: '- Include proper meta tags: title tag, meta description, Open Graph tags (og:title, og:description, og:image) so the URL displays a beautiful preview when shared on WhatsApp, social media, or messaging apps. Generate a favicon that matches the brand colors. Use semantic HTML5 elements (header, nav, main, section, footer).',
    themeTitle: '**Intelligent theme selection:**',
    themeLogic: '- Choose the base theme (dark or light) based on industry psychology: dark themes for tech/AI/SaaS, luxury/fashion, creative/design, and fitness/sports (feels innovative, exclusive, powerful). Light/warm themes for health/wellness, education, food/restaurants, and family/children businesses (feels clean, trustworthy, approachable). If the business does not clearly fit these, analyze its energy and choose accordingly.',
    flowTitle: '**Section flow & transitions:**',
    flowTransitions: '- Sections must NOT feel like disconnected boxes stacked vertically. Add smooth visual transitions between sections: subtle background color gradients that blend from one section to the next, SVG wave or curve dividers instead of hard lines, and gentle shifts in the Canvas background intensity. The Hero section background animation should be more prominent (opacity ~20%) and gradually decrease as the user scrolls deeper into the page (~10% at bottom). The entire page must feel like ONE continuous flowing experience, not isolated blocks.',
    agencyTitle: '**CRITICAL — Agency-level creative direction (this overrides generic patterns):**',
    agencyAsymmetry: '- DO NOT build a symmetric, template-like page. Break visual symmetry intentionally like a $50K agency would: Hero layout must be asymmetric (text taking 55-65% width, visual element bleeding off the edge or overlapping sections). Feature cards must use a Bento Grid layout with VARIED sizes (one large 2x1 card, two small 1x1 cards, one tall 1x2 card) — NEVER a uniform grid of identical cards. This is the #1 indicator of a human-designed vs AI-generated site.',
    agencyTypography: '- Hero headline must be MASSIVE: minimum 72-96px on desktop, 36-44px on mobile. Use font-weight 800-900. The headline must dominate the viewport and radiate confidence. Small, timid headlines scream "template". Big, bold headlines scream "premium agency". This is non-negotiable.',
    agencyCopyVoice: '- Write ALL copy with PERSONALITY and ATTITUDE — as a confident expert, not a corporate brochure. NEVER use generic phrases like "Welcome to [Brand]", "Your trusted partner", "Empowering businesses", "Solutions for your needs". Instead write punchy, direct, slightly provocative: "Your competitors already have a website that sells. Do you?", "Stop leaving money on the table", "Built for those who refuse to blend in". The copy must feel like a human with charisma wrote it, not an algorithm.',
    agencyTextRotator: '- The Hero headline MUST include a text rotator/cycling animation: one key word in the headline should automatically alternate between 3-4 relevant words with a smooth transition (fade, slide-up, or typewriter). For example: "We build [websites | brands | empires | futures]" where the bracketed word changes every 2-3 seconds. This single element instantly makes any page feel custom-built.',
    agencyWhitespace: '- Use GENEROUS whitespace. Section vertical padding must be at least 120px on desktop (80px on mobile). The more empty space, the more premium and expensive the site feels. DO NOT fill every pixel. Let elements breathe. White space is not wasted space — it is a luxury signal that communicates confidence and quality.',
    agencyMotion: '- Motion must be CHOREOGRAPHED, not generic. Elements must enter from specific directions (headlines from left, images from right, cards staggering upward). Headlines should reveal word-by-word or line-by-line with slight delay — not the entire block fading in at once. Each animation must feel intentional and directed, like a film scene, not a template default.',
    agencyPersonality: '- Add HUMAN personality touches: a witty micro-copy line in the footer that is unique and relevant to the specific business described (NOT a generic phrase — invent something original based on the brand\'s personality and industry), decorative oversized numbers ("01", "02", "03") behind step/process sections at 3-5% opacity as design accents, a subtle grain or noise texture overlay on the hero section for editorial depth, and ensure each CTA button has slightly different copy (not the same text repeated). These details are what make a visitor think "a real designer made this".',
    antiAiTitle: '**Eliminate AI-generated patterns (mandatory):**',
    antiAiIcons: '- DO NOT use generic icon packs (Lucide, Heroicons) with the same checkmark/lightning/shield/gear on every card. Instead, use a CURATED set of icons with consistent stroke weight and visual style that matches the brand, or use stylized typographic numbers, mini-illustrations, or custom-designed SVG icons. If using an icon library, select unique and unexpected icons — never the top-5 most-used ones.',
    antiAiAlignment: '- DO NOT center-align everything. Mix text alignments intentionally: Hero text should be left-aligned (more powerful and editorial), section headings can be left-aligned with a small accent line or decorative element, and only specific elements (like a final CTA or a stat counter) should be centered. Alignment variety creates visual rhythm and breaks the template pattern.',
    antiAiBgAlternate: '- Alternate background colors between sections to create visual rhythm: one section with the base color, the next with a subtle tint (2-4% shift), the next with a contrasting or inverted tone, then back. This creates distinct "scenes" and guides the eye through the page. NEVER use the exact same background for every section.',
    antiAiGrouping: '- Do NOT always group elements in sets of 3. Adapt the quantity to the content: 4 feature cards in a Bento Grid, 2 prominent testimonials with generous space, 5 process steps if the business requires it, or even a single large featured testimonial. The number must serve the content, not a template rule.',
    antiAiTestimonials: '- Testimonials must NOT be 3 identical cloned cards. Vary their presentation: make one testimonial a large featured pull-quote with oversized quotation marks and a full-width layout, and place 1-2 smaller quotes beside or below it. Or use completely different visual treatments for each. The layout must feel intentionally designed, not copy-pasted.',
    antiAiFooter: '- For a single-page website, the footer must be MINIMAL and elegant: logo, a short brand tagline, anchor links to sections on the same page, social media icons, and copyright. DO NOT create 4-5 columns of dead links to pages that don\'t exist (About Us, Blog, Careers, Terms). A bloated footer with non-functional links is the hallmark of a generated template.',
    antiAiNames: '- Testimonial names must be FULL, realistic, and culturally appropriate: "Alejandra Martínez, CEO de Lumina Digital" not "María G.". Include a specific (invented but credible) company name and job title. Generic initials ("John D.", "Ana L.") instantly reveal the site was AI-generated.',
    antiAiShadows: '- Use HIERARCHICAL shadows, not one uniform box-shadow for everything. Cards get soft, wide-spread shadows (subtle depth). Buttons get colored shadows matching their own background color. Images get deeper, more dramatic shadows. Modals/overlays get the heaviest shadow. This depth variation creates realistic dimensionality.',
    antiAiTypoTuning: '- Fine-tune typography details: Hero headlines need tight line-height (1.05-1.15) and slight negative letter-spacing (-0.02em) for premium density. Body text needs comfortable line-height (1.6-1.8) for readability. Any UPPERCASE labels or subtitles need expanded letter-spacing (0.1-0.15em) for editorial elegance. These micro-adjustments are invisible individually but collectively transform the feel from amateur to professional.',
    antiAiLearnMore: '- NEVER use generic link text like "Learn More", "Read More", "See More", "Click Here". Every link and secondary action must have specific, benefit-oriented copy: "See how it works →", "Explore the results", "Discover the method", "Read the full story". Generic link text is lazy and kills conversions.',
    antiAiButtons: '- CTA buttons must NOT be generic pill/capsule shapes with centered text. Design COMPOUND buttons with internal structure: text aligned to one side + a separate circular container with an arrow icon (→) on the other side. On hover: the circle expands to fill the entire button width, text color inverts, and the arrow slides forward. For secondary buttons: use a wipe fill effect where a background color fills from left to right on hover. Every button must have at least TWO visual states with distinct transitions. Single-color-change hovers are the hallmark of templates.',
    antiAiImageTreatment: '- Images must NOT all have the same generic border-radius: 8px treatment. Apply varied EDITORIAL treatments: use CSS clip-path for asymmetric masks (polygon shapes, rounded on 3 corners + sharp on 1), let hero images bleed off the edge of the viewport (negative margin or absolute positioning extending past the container), overlap images slightly with adjacent text blocks or cards for editorial depth. Each major image should have a different visual treatment. Uniform image styling is a dead giveaway of AI generation.',
    antiAiStructure: '- Add subtle MICRO-BORDERS (1px lines at 5-8% opacity, white in dark themes, black in light themes) to create architectural structure — the Vercel/Linear effect. Use them as: thin horizontal dividers between sections (replacing padding-only separation), vertical separators inside compound cards or feature grids, and thin border lines around the navbar. These barely-visible structural lines create a sense of Swiss precision that subconsciously communicates extreme attention to detail. Do NOT overuse — 3-5 strategic micro-borders across the entire page is enough.',
    antiAiHovers: '- Hover effects must be MULTI-LAYERED, not just color changes. Implement at least 3 different hover patterns across the page: (1) MAGNETIC BUTTONS — the CTA button tilts slightly toward the cursor position (2-4px max displacement using JS mousemove), creating a pulled sensation. (2) TEXT LINKS with animated underlines — the underline draws itself from left to right on hover (width: 0 to 100% with transition), not appearing instantly. (3) CARDS that lift and expand shadow — on hover, cards translate upward 4-8px with an expanding, softened shadow below. These varied hover patterns make the site feel handcrafted and responsive.',
    antiAiGradients: '- NEVER use basic 2-color linear gradients (e.g. from-blue-500 to-purple-500). They are the #1 visual fingerprint of AI-generated sites. Instead use MESH GRADIENTS: layer 3-4 radial-gradient() declarations at different positions (top-left, bottom-right, center) with overlapping semi-transparent brand colors, combined with a subtle CSS noise/grain texture overlay (using a tiny repeating SVG pattern at 3-5% opacity). For glowing accents behind sections or cards, use large radial gradients (400-600px) with high blur — creating organic, luminous pools of color. The result should feel like light refracting through glass, not a Photoshop gradient bar.',
    copyFrameworks: '- Apply proven copywriting FRAMEWORKS to each section — this is what separates $50K agency copy from generic AI text: HERO uses PAS (Problem-Agitate-Solution) — the headline states the visitor\'s core problem in maximum 8 words, the subtitle agitates the consequence of NOT solving it, and the CTA presents the brand as the solution. FEATURES use BAB (Before-After-Bridge) — each card briefly shows life BEFORE (the pain or inefficiency), life AFTER (the transformation), and the product/service as the BRIDGE. HOW IT WORKS uses the 4Ps (Promise-Picture-Proof-Push) — promise the outcome, paint a vivid picture of success, add a mini proof point, then push to the next step. TESTIMONIALS must include specific measurable results (Increased revenue 43% in 47 days) — NEVER vague praise (Great service!). The FINAL CTA section uses FUTURE PACING — describe how the visitor\'s life FEELS after they take action, creating the emotional pull of an already-achieved result (Imagine opening your inbox tomorrow to 12 new client inquiries). These frameworks ensure every word serves a psychological conversion purpose, not just filling space.',
    sectionHierarchy: '- Follow a CONVERSION-OPTIMIZED section hierarchy regardless of the order the user lists them. The psychologically proven order is: (1) Hero — grab attention with PAS. (2) Social Proof/Logos — establish instant credibility right after the hook. (3) Features/Benefits — build desire by showing transformation. (4) How It Works — reduce perceived complexity with 3 clear steps. (5) Testimonials — deepen trust with specific numerical results. (6) Stats/Numbers — trigger authority bias with specific figures. (7) Pricing — present the offer ONLY after value is fully established. (8) FAQ — eliminate the last remaining objections. (9) Final CTA — emotional close with Future Pacing. (10) Footer — minimal, clean, human. If the user provides sections in a different order, REORDER them to follow this conversion hierarchy. This mirrors the AIDA psychological journey (Attention → Interest → Desire → Action) and is proven to maximize one-page conversions.',
    cardAnimationVariety: '- Feature, pricing, and service cards must each have a DIFFERENT animation and hover effect — never the same animation repeated across all cards on a page. Mix these patterns randomly: (A) Card slides up from bottom with opacity fade + on hover lifts 8px with expanded soft shadow. (B) Card reveals with a horizontal clip-path wipe from left + on hover the border gradient rotates faster and glows. (C) Card scales from 95% to 100% with a slight blur-to-sharp transition + on hover a diagonal shimmer sweeps across. (D) Card flips in subtly from a 5-degree X-axis rotation + on hover the background shifts from solid to a translucent glassmorphism. (E) Card fades in with a staggered delay based on its grid position (first card 0ms, second 150ms, third 300ms) + on hover a subtle 3D perspective tilt follows the cursor. Choose a DIFFERENT combination for each card. This variety is what makes a page feel handcrafted by a creative team, not stamped out by an algorithm.',
    conversionMicroCopy: '- Add persuasive MICRO-COPY directly adjacent to every CTA button — these small text elements are proven to increase conversions by 20-30%: below the primary CTA add a reassurance line (No credit card required • Cancel anytime • 2-minute setup), below the pricing CTA add a risk-reversal (30-day money-back guarantee, no questions asked), near the contact form add a response-time promise (We respond within 2 hours during business days). Additionally, add a CONTAINMENT BOX around the final CTA section — a subtle bordered container (1px border at 10% opacity with slight background tint) that visually isolates the CTA from surrounding content, focusing the visitor\'s eye on the action. These micro-copy elements and visual containment are the invisible conversion architecture that separates 2% conversion pages from 8% conversion pages.',
    layoutRandomization: '- CRITICAL: Even within the same industry, every generated website must look UNIQUE. Achieve this by randomizing these layout decisions on each generation: (1) Hero layout — alternate between text-left/image-right, text-center/image-behind, and text-right/image-left layouts. (2) Feature grid — alternate between Bento Grid (mixed sizes), 3-column uniform grid with one featured card spanning full width at top, and a 2-column alternating text+image zigzag layout. (3) Testimonial display — alternate between large single testimonial with photo, carousel of 3 testimonials, and grid of 2 testimonials side by side. (4) Color accent placement — shift the primary accent usage between different sections on each generation. Never generate the same visual arrangement twice for the same industry. A real agency would NEVER deliver identical layouts to two clients in the same industry.',
    typoTitle: '**Industry-adaptive typography (mandatory):**',
    typoSystem: '- Select Google Font pairings based on the business energy: for tech/AI/SaaS use geometric sans-serifs (Space Grotesk, Sora, Outfit, or Manrope for headlines + Inter or DM Sans for body); for luxury/fashion use elegant serifs (Playfair Display, Cormorant, or DM Serif Display for headlines + Lato or Nunito Sans for body); for health/wellness use soft rounded fonts (Nunito, Quicksand, or Plus Jakarta Sans for headlines + Rubik for body); for food/restaurants use warm serif or friendly sans (Bitter, Playfair Display, or Poppins for headlines + Source Sans Pro for body); for finance/legal use authoritative serifs (Libre Baskerville, IBM Plex Serif, or Merriweather for headlines + IBM Plex Sans for body); for creative/design use display/experimental fonts (Space Grotesk, Unbounded, or Cabinet Grotesk for headlines + General Sans for body); for fitness/sports use bold condensed fonts (Oswald, Bebas Neue, or Archivo Black for headlines + Montserrat for body); for education use friendly rounded fonts (Nunito, Fredoka, or Baloo 2 for headlines + Quicksand for body). If the business does not match these categories, analyze its core tone (serious, playful, elegant, bold, warm) and select the closest matching pairing.',
    cursorTitle: '**Industry-adaptive creative cursor (mandatory):**',
    cursorSystem: '- The custom cursor must NOT be a generic circle for every site. Adapt the cursor style to the business energy: for tech/AI use a crosshair dot with trailing data-particles that fade; for luxury/fashion use a thin elegant ring (1px, no fill) that expands smoothly on hover; for health/wellness use a slightly irregular organic blob shape with a gentle breathing animation; for food/hospitality use a warm-toned dot with a candlelight-like glow halo; for finance/legal use a precise small dot with a separate thin geometric ring (controlled, exact); for creative/design use a dot that leaves a brief paint-stroke trail fading in 0.3 seconds; for fitness/sports use a bold dot that emits energy pulse ripples every 2 seconds; for architecture/real estate use a diamond shape (square rotated 45°) instead of a circle. If the business does not fit these categories, analyze its energy and choose the closest matching cursor style. The cursor must always expand or morph when hovering over interactive elements.',
  },
  es: {
    buildMe: 'Constrúyeme un sitio web de una sola página, hermoso y completo.',
    whatFor: '**Para qué es:**',
    placeholder: '[Describe tu sitio web/negocio aquí]',
    businessType: '**Tipo de negocio:**',
    mainButton: '**Texto del botón principal:**',
    defaultCta: 'Comenzar',
    defaultVibe: 'Elige el mejor estilo de diseño según el tipo de sitio web descrito. Hazlo ver premium y moderno.',
    colorPalette: 'Elige una paleta de colores que se sienta adecuada para este tipo de negocio. No lo pienses demasiado — solo elige colores que se vean bien juntos y encajen con la vibra.',
    pageSections: '**Secciones de la página (constrúyelas en este orden):**',
    defaultSections: 'Elige las mejores secciones para este tipo de sitio web. Siempre incluye un hero y un pie de página.',
    important: '**Importante:**',
    responsive: '- Hazlo completamente responsive (que se vea perfecto en móvil y escritorio)',
    realText: '- Usa texto de ejemplo realista — no lorem ipsum. Escribe contenido que realmente encaje con este negocio.',
    animations: '- Agrega animaciones suaves y sutiles (aparición al hacer scroll, efectos hover en botones y tarjetas)',
    ctaPosition: '- El botón de llamada a la acción debe aparecer arriba del pliegue y repetirse cerca del final',
    cleanCode: '- Mantén el código limpio y listo para producción. Una sola página, sin enrutamiento.',
    techStack: '- Usa React con Tailwind CSS',
    conversionTitle: '**Optimización de conversión:**',
    conversionCopy: '- Escribe TODO el copy desde el beneficio del cliente, NO desde las características del producto. El headline debe responder "¿Qué gano yo?" en máximo 8 palabras.',
    conversionUrgency: '- Incluye elementos naturales de urgencia o escasez donde sea apropiado (ej: "Solo 5 lugares disponibles este mes", "Disponibilidad limitada").',
    conversionTestimonials: '- Los testimonios deben incluir resultados específicos con números (ej: "Aumenté mis ventas un 43% en 60 días — María G."). Nunca uses elogios vagos.',
    conversionCtaRepeat: '- Repite el botón CTA principal al menos 3 veces a lo largo de la página: en el hero, a mitad de página y al final.',
    conversionAnchoring: '- Si hay planes de precios, muestra primero la opción más cara para generar anclaje de precio, haciendo que la opción intermedia se sienta como una ganga.',
    conversionRiskReversal: '- Incluye un elemento de reversión de riesgo cerca del CTA (ej: "Garantía de 30 días", "Sin tarjeta de crédito requerida", "Cancela cuando quieras").',
    premiumTitle: '**Diseño premium y psicología del color:**',
    premiumColorPsychology: '__INDUSTRY_COLOR__',
    premiumTheme: '__INDUSTRY_THEME__',
    premiumTypography: '**FUENTES OBLIGATORIAS (no uses fuentes del sistema o defaults del navegador):**\n__INDUSTRY_TYPO__\n- Agrega la URL @import de Google Fonts en la parte SUPERIOR de tu CSS/config de Tailwind. Establece font-family en html/body y sobrescribe todos los encabezados h1-h3 explícitamente. No dejes que el framework sobrescriba estas fuentes.',
    premiumGlass: '- Usa glassmorphism en tarjetas (fondo semi-transparente + borde sutil de 1px blanco al 10% de opacidad + backdrop-blur) y navbar sticky con backdrop-blur.',
    premiumAnimations: '- Usa animaciones stagger: los elementos aparecen en cascada (uno tras otro con 100-150ms de delay). Los números/stats deben animarse contando hacia arriba al ser visibles. El botón CTA principal debe tener un glow/sombra brillante pulsante sutil detrás.',
    premiumGradient: '- El headline principal debe usar texto con gradiente (el gradiente va en el texto mismo, no en el fondo). Usa gradientes animados sutiles en la sección hero y en los botones CTA.',
    premiumScroll: '- Habilita smooth scroll en toda la página. Agrega un scroller de logos con loop horizontal infinito para la sección de prueba social.',
    imagesTitle: '**Fotografía y Recursos Audiovisuales:**',
    imagesContext: '- Usa imágenes de calidad profesional altamente relevantes que coincidan perfectamente con la industria y la vibra exacta (ej. URLs de origen de Unsplash). NINGUNA foto de stock genérica, aleatoria o sin relación. Los recursos visuales DEBEN representar fielmente el negocio descrito.',
    visualExpTitle: '**Experiencia visual premium (obligatorio):**',
    visualExpBackground: '- Agrega una animación dinámica de fondo a página completa usando HTML5 Canvas (Vanilla JS, sin librerías). Posíciónala detrás de todo el contenido (z-index: -1, pointer-events: none). Usa Perlin o Simplex noise para movimiento orgánico y natural — NUNCA Math.random(). Usa al menos 2-3 capas a diferentes velocidades y opacidades para crear profundidad cinematográfica. La animación debe reaccionar sutilmente al cursor del mouse (repulsión magnética suave con inercia) y cambiar suavemente mientras el usuario hace scroll. Los colores de las partículas/elementos deben derivarse de la paleta de marca, no blanco genérico. Debe correr a 60fps usando requestAnimationFrame. Usa filter: blur(60-100px) en formas asimétricas grandes para crear auras de luz inmersivas en lugar de partículas discretas pequeñas. Usa globalCompositeOperation = screen o color-dodge para mezclar colores superpuestos en reflejos luminosos. Opacidad objetivo: 15-25% para las formas de brillo principales (NO 8-10% — eso es demasiado invisible). El fondo debe SENTIRSE, no solo estar técnicamente presente. Piensa en aurora boreal, no en estática de TV.',
    visualExpBgAdapt: '__INDUSTRY_BG__',
    visualExpCards: '- Las tarjetas de Características, Precios y Testimonios DEBEN tener bordes animados con gradiente — no bordes estáticos. Usa un pseudo-elemento CSS (::before) con un conic-gradient rotatorio en colores de marca detrás de la tarjeta. El gradiente debe rotar lenta y continuamente (mínimo 4 segundos por ciclo). Al hover: el borde brilla más, la rotación se acelera, y aparece una sombra expandida suave. El fondo de la tarjeta debe usar glassmorphism (semi-transparente + backdrop-blur). Border-radius: mínimo 16px. NO apliques bordes animados a absolutamente todos los elementos — solo a tarjetas clave. Si todo brilla, nada destaca.',
    visualExpImages: '- Las imágenes deben tener una animación de revelación activada por scroll (clip-path o mask wipe, no solo fade-in). Al hover, aplica un efecto sutil de inclinación 3D con perspectiva o un zoom suave. Agrega un único barrido diagonal de destello/brillo (shimmer) que cruce la imagen una vez al hacerse visible.',
    visualExpButtons: '- El botón CTA principal debe tener un glow/aura pulsante continuo detrás (una sombra suave que respira hacia adentro y afuera). Al hover: escala ligeramente hacia arriba + la sombra se expande + el gradiente cambia. Al click: una onda ripple se expande desde el punto de clic. Los botones secundarios deben tener un shimmer sutil en el borde al hover.',
    neuroTitle: '**Neuromarketing y copywriting persuasivo:**',
    neuroNarrative: '- Estructura TODA la página como un arco narrativo emocional (PASO): comienza el Hero con el Resultado deseado ("Imagina..."), luego introduce el Dolor que enfrenta el visitante hoy, Agita ese dolor sutilmente ("Cada día sin esto, pierdes..."), presenta la Solución (tu producto/servicio como puente), y cierra con Prueba social + CTA final. Cada sección debe fluir hacia la siguiente como una historia, no sentirse como bloques aislados.',
    neuroFuturePacing: '- Usa future pacing en el subtítulo del Hero y en la sección de CTA final. Haz que el visitante visualice su vida DESPUÉS de usar el producto: "Imagina despertar y...", "Visualiza tu negocio con...", "¿Qué pasaría si pudieras...?". Esto activa las mismas regiones cerebrales que la experiencia vivida.',
    neuroPowerWords: '- Integra naturalmente palabras de poder en todo el copy: "exclusivo", "sin esfuerzo", "comprobado", "transforma", "desbloquea", "garantizado", "instantáneo", "descubre". Deben sentirse orgánicas y espontáneas — NUNCA forzadas ni desesperadas. El tono debe sonar como un experto seguro que conoce su valor, no como un vendedor rogando por atención.',
    neuroTribal: '- Usa lenguaje de pertenencia para la prueba social: "Únete a los 2,347 emprendedores que ya..." en vez de "Tenemos 2,347 clientes". El visitante debe sentir que se une a un grupo exclusivo, no que simplemente está comprando algo.',
    neuroSpecificity: '- NUNCA uses números redondos. Siempre usa cifras específicas y creíbles: "2,347 negocios" no "2,000+", "43% de aumento" no "aumento significativo", "en 47 días" no "en aproximadamente un mes". Los números específicos activan el sesgo de credibilidad del cerebro.',
    neuroMicroCopy: '- TODOS los textos de botones CTA deben estar en primera persona desde la perspectiva del visitante: "Sí, lo quiero →" no "Comprar", "Comenzar mi prueba gratis" no "Registrarse", "Envíame la guía" no "Descargar", "Hablemos de mi proyecto" no "Contáctanos". El visitante debe sentir que el botón es SU decisión, no una orden.',
    polishTitle: '**Pulimiento cinematográfico y micro-interacciones:**',
    polishEntrance: '__INDUSTRY_PRELOADER__',
    polishScrollBar: '- Agrega una barra delgada de progreso de scroll en la parte superior de la página (2-3px de alto, color de acento de marca) que se llena de izquierda a derecha conforme el usuario hace scroll. Esto activa el deseo psicológico de completar (la gente quiere llegar al 100%).',
    polishCursor: '__INDUSTRY_CURSOR__',
    polishNavActive: '- La navbar sticky debe resaltar la sección actualmente visible conforme el usuario hace scroll. El enlace activo debe tener un subrayado de acento sutil o cambio de color que transicione suavemente entre secciones.',
    mobileTitle: '**Optimización de conversión móvil:**',
    mobileStickyBar: '- En dispositivos móviles, agrega una barra CTA sticky fija en la parte inferior de la pantalla que sea siempre visible al hacer scroll. Debe contener el botón CTA principal. Esto asegura que el visitante nunca tenga que buscar cómo tomar acción.',
    mobileFloatingBtn: '- Agrega un botón circular flotante de contacto (ícono de WhatsApp o chat) fijo en la esquina inferior derecha en todos los dispositivos. Debe tener una animación de pulso sutil para atraer atención sin ser intrusivo. Al click, abre la API de WhatsApp o el formulario de contacto.',
    mobileTouchTargets: '- Todos los elementos interactivos deben tener áreas de toque mínimas de 44x44px en móvil. Los testimonios y tarjetas de características deben convertirse en carruseles horizontales deslizables en pantallas móviles en vez de grids apilados.',
    metaTitle: '**SEO y compartibilidad social:**',
    metaTags: '- Incluye meta tags apropiados: title tag, meta description, Open Graph tags (og:title, og:description, og:image) para que al compartir el URL en WhatsApp, redes sociales o apps de mensajería muestre un preview profesional y hermoso. Genera un favicon acorde a los colores de marca. Usa elementos semánticos de HTML5 (header, nav, main, section, footer).',
    themeTitle: '**Selección inteligente de tema:**',
    themeLogic: '- Elige el tema base (oscuro o claro) según la psicología de la industria: temas oscuros para tech/IA/SaaS, lujo/moda, creativos/diseño, y fitness/deportes (se siente innovador, exclusivo, poderoso). Temas claros/cálidos para salud/bienestar, educación, alimentos/restaurantes, y negocios familiares/infantiles (se siente limpio, confiable, accesible). Si el negocio no encaja claramente, analiza su energía y elige acorde.',
    flowTitle: '**Flujo y transiciones entre secciones:**',
    flowTransitions: '- Las secciones NO deben sentirse como cajas desconectadas apiladas verticalmente. Agrega transiciones visuales suaves entre secciones: gradientes de color de fondo sutiles que se mezclan de una sección a la siguiente, divisores con ondas SVG o curvas orgánicas en lugar de líneas duras, y cambios suaves en la intensidad del fondo Canvas. La animación de fondo del Hero debe ser más prominente (opacidad ~20%) y disminuir gradualmente conforme el usuario hace scroll hacia abajo (~10% al fondo). Toda la página debe sentirse como UNA experiencia continua y fluida, no bloques aislados.',
    agencyTitle: '**CRÍTICO — Dirección creativa nivel agencia (esto anula patrones genéricos):**',
    agencyAsymmetry: '- NO construyas una página simétrica tipo template. Rompe la simetría visual intencionalmente como lo haría una agencia de $50K: el layout del Hero debe ser asimétrico (texto ocupando 55-65% del ancho, elemento visual cortándose al borde o superponiéndose entre secciones). Las tarjetas de Features deben usar un layout Bento Grid con tamaños VARIADOS (una tarjeta grande 2x1, dos pequeñas 1x1, una alta 1x2) — NUNCA una cuadrícula uniforme de tarjetas idénticas. Este es el indicador #1 de un sitio diseñado por humanos vs generado por IA.',
    agencyTypography: '- El headline del Hero debe ser MASIVO: mínimo 72-96px en desktop, 36-44px en móvil. Usa font-weight 800-900. El titular debe dominar el viewport y radiar confianza. Los titulares pequeños y tímidos gritan "template". Los titulares grandes y audaces gritan "agencia premium". Esto es innegociable.',
    agencyCopyVoice: '- Escribe TODO el copy con PERSONALIDAD y ACTITUD — como un experto seguro, no como un folleto corporativo. NUNCA uses frases genéricas como "Bienvenido a [Marca]", "Tu socio de confianza", "Potenciando negocios", "Soluciones para tus necesidades". En su lugar escribe de forma directa, punzante, ligeramente provocadora: "¿Tus competidores ya tienen un sitio que vende. Y tú?", "Deja de regalar dinero", "Hecho para quienes se niegan a pasar desapercibidos". El copy debe sentirse como si lo hubiera escrito un humano con carisma, no un algoritmo.',
    agencyTextRotator: '- El headline del Hero DEBE incluir un text rotator/animación cíclica: una palabra clave del titular debe alternar automáticamente entre 3-4 palabras relevantes con una transición suave (fade, slide-up, o typewriter). Por ejemplo: "Construimos [sitios web | marcas | imperios | futuros]" donde la palabra entre corchetes cambia cada 2-3 segundos. Este único elemento hace instantáneamente que cualquier página se sienta construida a medida.',
    agencyWhitespace: '- Usa espacio en blanco GENEROSO. El padding vertical de las secciones debe ser al menos 120px en desktop (80px en móvil). Cuanto más espacio vacío, más premium y costoso se siente el sitio. NO llenes cada pixel. Deja que los elementos respiren. El espacio vacío no es espacio desperdiciado — es una señal de lujo que comunica confianza y calidad.',
    agencyMotion: '- El movimiento debe estar COREOGRAFIADO, no ser genérico. Los elementos deben entrar desde direcciones específicas (titulares desde la izquierda, imágenes desde la derecha, tarjetas escalonadas hacia arriba). Los headlines deben revelarse palabra por palabra o línea por línea con ligero delay — no todo el bloque apareciendo de golpe. Cada animación debe sentirse intencional y dirigida, como una escena de película, no un default de template.',
    agencyPersonality: '- Agrega toques de PERSONALIDAD humana: una línea de micro-copy ingeniosa en el footer que sea única y relevante para el negocio específico descrito (NO una frase genérica — inventa algo original basado en la personalidad e industria de la marca), números decorativos enormes ("01", "02", "03") detrás de las secciones de pasos/proceso al 3-5% de opacidad como acentos de diseño, una textura sutil de grano o ruido superpuesta en la sección hero para profundidad editorial, y asegúrate de que cada botón CTA tenga copy ligeramente diferente (no el mismo texto repetido). Estos detalles son los que hacen que un visitante piense "un diseñador real hizo esto".',
    antiAiTitle: '**Eliminar patrones de IA (obligatorio):**',
    antiAiIcons: '- NO uses packs de íconos genéricos (Lucide, Heroicons) con el mismo checkmark/rayo/escudo/engranaje en cada tarjeta. En su lugar, usa un conjunto CURADO de íconos con grosor de trazo y estilo visual consistente que coincida con la marca, o usa números tipográficos estilizados, mini-ilustraciones, o íconos SVG personalizados. Si usas una librería de íconos, selecciona íconos únicos e inesperados — nunca los 5 más usados.',
    antiAiAlignment: '- NO cent alineas todo. Mezcla alineaciones de texto intencionalmente: el texto del Hero debe estar alineado a la izquierda (más poderoso y editorial), los títulos de sección pueden ir a la izquierda con una pequeña línea de acento o elemento decorativo, y solo ciertos elementos específicos (como un CTA final o un contador de stats) deben estar centrados. La variedad de alineación crea ritmo visual y rompe el patrón de template.',
    antiAiBgAlternate: '- Alterna colores de fondo entre secciones para crear ritmo visual: una sección con el color base, la siguiente con un tinte sutil (2-4% de cambio), la siguiente con un tono contrastante o invertido, luego de vuelta. Esto crea "escenas" distintas y guía el ojo a través de la página. NUNCA uses exactamente el mismo fondo para todas las secciones.',
    antiAiGrouping: '- NO agrumes siempre los elementos en grupos de 3. Adapta la cantidad al contenido: 4 tarjetas de features en un Bento Grid, 2 testimonios prominentes con espacio generoso, 5 pasos de proceso si el negocio lo requiere, o incluso un solo testimonio grande destacado. El número debe servir al contenido, no a una regla de template.',
    antiAiTestimonials: '- Los testimonios NO deben ser 3 tarjetas idénticas clonadas. Varía su presentación: haz un testimonio como una cita destacada grande (pull-quote) con comillas enormes decorativas y layout de ancho completo, y coloca 1-2 citas más pequeñas al lado o debajo. O usa tratamientos visuales completamente diferentes para cada uno. El layout debe sentirse diseñado intencionalmente, no copiado y pegado.',
    antiAiFooter: '- Para un sitio web de una sola página, el footer debe ser MINIMALISTA y elegante: logo, un tagline corto de marca, enlaces ancla a secciones de la misma página, íconos de redes sociales, y copyright. NO crees 4-5 columnas de links muertos a páginas que no existen (Nosotros, Blog, Carreras, Términos). Un footer inflado con links no funcionales es la marca de un template generado.',
    antiAiNames: '- Los nombres en testimonios deben ser COMPLETOS, realistas y culturalmente apropiados: "Alejandra Martínez, CEO de Lumina Digital" no "María G.". Incluye un nombre de empresa específico (inventado pero creíble) y un cargo laboral. Las iniciales genéricas ("John D.", "Ana L.") revelan instantáneamente que el sitio fue generado por IA.',
    antiAiShadows: '- Usa sombras JERÁRQUICAS, no un mismo box-shadow uniforme para todo. Las tarjetas llevan sombras suaves y amplias (profundidad sutil). Los botones llevan sombras de color que coinciden con su propio color de fondo. Las imágenes llevan sombras más profundas y dramáticas. Los modals/overlays llevan la sombra más pesada. Esta variación de profundidad crea dimensionalidad realista.',
    antiAiTypoTuning: '- Ajusta los detalles tipográficos: los headlines del Hero necesitan line-height apretado (1.05-1.15) y letter-spacing ligeramente negativo (-0.02em) para densidad premium. El texto de cuerpo necesita line-height cómodo (1.6-1.8) para legibilidad. Cualquier label o subtítulo en MAYÚSCULAS necesita letter-spacing expandido (0.1-0.15em) para elegancia editorial. Estos micro-ajustes son invisibles individualmente pero colectivamente transforman la sensación de amateur a profesional.',
    antiAiLearnMore: '- NUNCA uses texto de enlace genérico como "Ver más", "Leer más", "Saber más", "Haz clic aquí". Cada enlace y acción secundaria debe tener copy específico orientado al beneficio: "Descubre cómo funciona →", "Explora los resultados", "Conoce el método", "Lee la historia completa". El texto de enlace genérico es perezoso y mata las conversiones.',
    antiAiButtons: '- Los botones CTA NO deben ser formas genéricas de cápsula/pill con texto centrado. Diseña botones COMPUESTOS con estructura interna: texto alineado a un lado + un contenedor circular separado con un ícono de flecha (→) al otro lado. Al hover: el círculo se expande para llenar todo el ancho del botón, el color del texto se invierte, y la flecha se desliza hacia adelante. Para botones secundarios: usa un efecto wipe fill donde un color de fondo se llena de izquierda a derecha al hover. Cada botón debe tener al menos DOS estados visuales con transiciones distintas. Los hovers de cambio de color único son el sello de los templates.',
    antiAiImageTreatment: '- Las imágenes NO deben tener todas el mismo tratamiento genérico de border-radius: 8px. Aplica tratamientos EDITORIALES variados: usa CSS clip-path para máscaras asimétricas (formas de polígono, redondeada en 3 esquinas + afilada en 1), deja que las imágenes del hero se corten al borde del viewport (margin negativo o posición absoluta extendiéndose más allá del contenedor), superpón imágenes ligeramente con bloques de texto o tarjetas adyacentes para profundidad editorial. Cada imagen importante debe tener un tratamiento visual diferente. El estilo uniforme de imágenes delata que fue generado por IA.',
    antiAiStructure: '- Agrega MICRO-BORDES sutiles (líneas de 1px al 5-8% de opacidad, blancas en temas oscuros, negras en temas claros) para crear estructura arquitectónica — el efecto Vercel/Linear. Úsalos como: divisores horizontales delgados entre secciones (reemplazando la separación solo con padding), separadores verticales dentro de tarjetas compuestas o grids de features, y líneas de borde delgadas alrededor del navbar. Estas líneas estructurales apenas visibles crean una sensación de precisión suiza que subconscientemente comunica atención extrema al detalle. NO abuses — 3-5 micro-bordes estratégicos en toda la página es suficiente.',
    antiAiHovers: '- Los efectos hover deben ser MULTI-CAPA, no solo cambios de color. Implementa al menos 3 patrones de hover diferentes en toda la página: (1) BOTONES MAGNÉTICOS — el botón CTA se inclina ligeramente hacia la posición del cursor (máximo 2-4px de desplazamiento usando JS mousemove), creando una sensación de atracción. (2) LINKS DE TEXTO con underlines animados — el subrayado se dibuja de izquierda a derecha al hover (width: 0 a 100% con transition), no apareciendo instantáneamente. (3) TARJETAS que se elevan y expanden sombra — al hover, las tarjetas se trasladan hacia arriba 4-8px con una sombra expandida y suavizada debajo. Estos patrones de hover variados hacen que el sitio se sienta artesanal y responsivo.',
    antiAiGradients: '- NUNCA uses gradientes lineales básicos de 2 colores (ej: from-blue-500 to-purple-500). Son la huella visual #1 de sitios generados por IA. En su lugar usa MESH GRADIENTS: superpón 3-4 declaraciones radial-gradient() en diferentes posiciones (arriba-izquierda, abajo-derecha, centro) con colores de marca semi-transparentes superpuestos, combinados con una textura sutil de ruido/grano CSS (usando un pequeño patrón SVG repetido al 3-5% de opacidad). Para acentos brillantes detrás de secciones o tarjetas, usa gradientes radiales grandes (400-600px) con alto blur — creando manchas de color orgánicas y luminosas. El resultado debe sentirse como luz refractándose a través de vidrio, no una barra de gradiente de Photoshop.',
    copyFrameworks: '- Aplica FRAMEWORKS de copywriting probados a cada sección — esto es lo que separa el copy de agencia de $50K del texto genérico de IA: el HERO usa PAS (Problema-Agitación-Solución) — el headline declara el problema central del visitante en máximo 8 palabras, el subtítulo agita la consecuencia de NO resolverlo, y el CTA presenta la marca como la solución. Los FEATURES usan BAB (Antes-Después-Puente) — cada tarjeta muestra brevemente la vida ANTES (el dolor o ineficiencia), la vida DESPUÉS (la transformación), y el producto/servicio como el PUENTE. CÓMO FUNCIONA usa las 4Ps (Promesa-Imagen-Prueba-Empujón) — promete el resultado, pinta una imagen vívida del éxito, agrega un mini punto de prueba, luego empuja al siguiente paso. Los TESTIMONIOS deben incluir resultados específicos medibles (Aumentamos ingresos 43% en 47 días) — NUNCA elogios vagos (¡Gran servicio!). El CTA FINAL usa FUTURE PACING — describe cómo SE SIENTE la vida del visitante después de tomar acción, creando la atracción emocional de un resultado ya logrado (Imagina abrir tu bandeja de entrada mañana con 12 nuevas consultas de clientes). Estos frameworks aseguran que cada palabra sirve un propósito psicológico de conversión, no solo llenar espacio.',
    sectionHierarchy: '- Sigue una jerarquía de secciones OPTIMIZADA PARA CONVERSIÓN sin importar el orden en que el usuario las liste. El orden psicológicamente probado es: (1) Hero — captura atención con PAS. (2) Prueba Social/Logos — establece credibilidad instantánea justo después del gancho. (3) Features/Beneficios — construye deseo mostrando la transformación. (4) Cómo Funciona — reduce la complejidad percibida con 3 pasos claros. (5) Testimonios — profundiza confianza con resultados numéricos específicos. (6) Stats/Números — activa el sesgo de autoridad con cifras específicas. (7) Pricing — presenta la oferta SOLO después de que el valor esté completamente establecido. (8) FAQ — elimina las últimas objeciones restantes. (9) CTA Final — cierre emocional con Future Pacing. (10) Footer — mínimo, limpio, humano. Si el usuario proporciona secciones en un orden diferente, REORDÉNALAS para seguir esta jerarquía de conversión. Esto refleja el viaje psicológico AIDA (Atención → Interés → Deseo → Acción) y está probado para maximizar conversiones en páginas de una sola página.',
    cardAnimationVariety: '- Las tarjetas de features, pricing y servicios deben tener cada una una animación y efecto hover DIFERENTE — nunca la misma animación repetida en todas las tarjetas de una página. Mezcla estos patrones aleatoriamente: (A) La tarjeta se desliza desde abajo con fade de opacidad + al hover se eleva 8px con sombra suave expandida. (B) La tarjeta se revela con un clip-path wipe horizontal desde la izquierda + al hover el gradiente del borde rota más rápido y brilla. (C) La tarjeta escala de 95% a 100% con una transición sutil de blur a nítido + al hover un shimmer diagonal barre la superficie. (D) La tarjeta hace un flip sutil desde una rotación de 5 grados en el eje X + al hover el fondo cambia de sólido a glassmorphism translúcido. (E) La tarjeta aparece con fade y un delay escalonado según su posición en la cuadrícula (primera 0ms, segunda 150ms, tercera 300ms) + al hover un tilt 3D con perspectiva sutil sigue al cursor. Elige una combinación DIFERENTE para cada tarjeta. Esta variedad es lo que hace que una página se sienta artesanalmente diseñada por un equipo creativo, no estampada por un algoritmo.',
    conversionMicroCopy: '- Agrega MICRO-COPY persuasivo directamente adyacente a cada botón CTA — estos pequeños elementos de texto están probados para aumentar conversiones en 20-30%: debajo del CTA principal agrega una línea de seguridad (Sin tarjeta de crédito • Cancela cuando quieras • Configuración en 2 minutos), debajo del CTA de pricing agrega una reversión de riesgo (Garantía de devolución de 30 días, sin preguntas), cerca del formulario de contacto agrega una promesa de tiempo de respuesta (Respondemos en menos de 2 horas en días hábiles). Adicionalmente, agrega una CAJA DE CONTENCIÓN alrededor de la sección del CTA final — un contenedor con borde sutil (1px de borde al 10% de opacidad con un tinte de fondo ligero) que aísla visualmente el CTA del contenido circundante, enfocando la mirada del visitante en la acción. Estos elementos de micro-copy y contención visual son la arquitectura invisible de conversión que separa las páginas con 2% de conversión de las páginas con 8%.',
    layoutRandomization: '- CRÍTICO: Incluso dentro de la misma industria, cada sitio web generado debe verse ÚNICO. Logra esto randomizando estas decisiones de layout en cada generación: (1) Layout del Hero — alterna entre texto-izquierda/imagen-derecha, texto-centro/imagen-detrás, y texto-derecha/imagen-izquierda. (2) Grid de features — alterna entre Bento Grid (tamaños mixtos), grid uniforme de 3 columnas con una tarjeta destacada ocupando el ancho completo arriba, y un layout zigzag de 2 columnas alternando texto+imagen. (3) Presentación de testimonios — alterna entre un testimonio grande individual con foto, carrusel de 3 testimonios, y grid de 2 testimonios lado a lado. (4) Ubicación del acento de color — desplaza el uso del acento primario entre diferentes secciones en cada generación. Nunca generes el mismo arreglo visual dos veces para la misma industria. Una agencia real NUNCA entregaría layouts idénticos a dos clientes de la misma industria.',
    typoTitle: '**Tipografía adaptativa por industria (obligatorio):**',
    typoSystem: '- Selecciona emparejamientos de Google Fonts según la energía del negocio: para tech/IA/SaaS usa sans-serif geométricas (Space Grotesk, Sora, Outfit, o Manrope para títulos + Inter o DM Sans para cuerpo); para lujo/moda usa serif elegantes (Playfair Display, Cormorant, o DM Serif Display para títulos + Lato o Nunito Sans para cuerpo); para salud/bienestar usa fuentes redondeadas suaves (Nunito, Quicksand, o Plus Jakarta Sans para títulos + Rubik para cuerpo); para alimentos/restaurantes usa serif cálido o sans amigable (Bitter, Playfair Display, o Poppins para títulos + Source Sans Pro para cuerpo); para finanzas/legal usa serif autoritativo (Libre Baskerville, IBM Plex Serif, o Merriweather para títulos + IBM Plex Sans para cuerpo); para creativos/diseño usa fuentes display/experimentales (Space Grotesk, Unbounded, o Cabinet Grotesk para títulos + General Sans para cuerpo); para fitness/deportes usa fuentes condensadas bold (Oswald, Bebas Neue, o Archivo Black para títulos + Montserrat para cuerpo); para educación usa fuentes redondeadas amigables (Nunito, Fredoka, o Baloo 2 para títulos + Quicksand para cuerpo). Si el negocio no coincide con estas categorías, analiza su tono central (serio, juguetón, elegante, audaz, cálido) y selecciona el emparejamiento más cercano.',
    cursorTitle: '**Cursor creativo adaptativo por industria (obligatorio):**',
    cursorSystem: '- El cursor personalizado NO debe ser un círculo genérico para cada sitio. Adapta el estilo del cursor a la energía del negocio: para tech/IA usa un punto crosshair con partículas de datos que se desvanecen como trail; para lujo/moda usa un anillo fino elegante (1px, sin relleno) que se expande suavemente al hover; para salud/bienestar usa una forma blob orgánica ligeramente irregular con animación de respiración suave; para alimentos/hospitalidad usa un punto de tono cálido con un halo de brillo tipo luz de vela; para finanzas/legal usa un punto pequeño preciso con un anillo geométrico fino separado (controlado, exacto); para creativos/diseño usa un punto que deja un breve rastro de pincelada que se desvanece en 0.3 segundos; para fitness/deportes usa un punto audaz que emite pulsos de energía tipo ondas cada 2 segundos; para arquitectura/bienes raíces usa una forma de diamante (cuadrado rotado 45°) en vez de círculo. Si el negocio no encaja en estas categorías, analiza su energía y elige el estilo de cursor más cercano. El cursor siempre debe expandirse o transformarse al pasar sobre elementos interactivos.',
  },
}

// ─── Industry Profile Resolver ───────────────────────────────────────────────
// Detects the business industry from the niche string and returns concise,
// laser-focused instructions for typography, background, and cursor.
// Only the relevant profile is injected — no multi-industry menus.

interface IndustryProfile {
  typo: { en: string; es: string }
  bg: { en: string; es: string }
  cursor: { en: string; es: string }
  preloader: { en: string; es: string }
  colorHint: { en: string; es: string }
  themeHint: { en: string; es: string }
}

function detectIndustryProfile(niche: string): IndustryProfile {
  const n = niche.toLowerCase()

  const is = (...keywords: string[]) => keywords.some(k => n.includes(k))

  // Tech / AI / SaaS / Software
  if (is('tech', 'ai', 'ia', 'saas', 'software', 'app', 'startup', 'digital', 'platform', 'cloud', 'data', 'automation', 'api', 'celular', 'phone', 'movil', 'móvil', 'electronic', 'electrónic', 'gadget', 'device')) {
    return {
      typo: {
        en: '- Typography: Use Space Grotesk (headlines, weight 700-900) + Inter (body, weight 400-500) from Google Fonts. Geometric, technical, modern — signal innovation and precision.',
        es: '- Tipografía: Usa Space Grotesk (títulos, weight 700-900) + Inter (cuerpo, weight 400-500) de Google Fonts. Geométrica, técnica, moderna — transmite innovación y precisión.',
      },
      colorHint: {
        en: '- Color palette: Deep navy (#0a0e1a) as base, electric blue (#0066ff) as primary accent, cyan (#06b6d4) as secondary accent. These colors signal technology, innovation, and trust. Max 3 main colors + 1 accent.',
        es: '- Paleta de colores: Azul marino profundo (#0a0e1a) como base, azul eléctrico (#0066ff) como acento primario, cian (#06b6d4) como acento secundario. Estos colores transmiten tecnología, innovación y confianza. Máximo 3 colores principales + 1 acento.',
      },
      themeHint: {
        en: '- Use a DARK theme. Tech and digital brands feel innovative, premium, and forward-thinking on dark backgrounds. This is non-negotiable for this type of business.',
        es: '- Usa un tema OSCURO. Las marcas tecnológicas y digitales se ven innovadoras, premium y visionarias sobre fondos oscuros. Esto es innegociable para este tipo de negocio.',
      },
      bg: {
        en: '- Background animation: Flowing neural network nodes connected by thin lines — nodes pulse softly, connections appear and dissolve. Feels like live data intelligence.',
        es: '- Animación de fondo: Nodos de red neuronal conectados por líneas delgadas — los nodos pulsan suavemente, las conexiones aparecen y se disuelven. Se siente como inteligencia de datos en vivo.',
      },
      cursor: {
        en: '- Custom cursor: A sharp crosshair dot (4px) with a faint data-particle trail that fades over 0.5s as the cursor moves. On hover over interactive elements: cursor expands into a scanning circle with a rotating arc. Feels like navigating a live interface.',
        es: '- Cursor personalizado: Un punto crosshair preciso (4px) con un rastro de partículas de datos que se desvanece en 0.5s al mover el cursor. Al hover sobre elementos interactivos: se expande en un círculo de escaneo con un arco giratorio. Se siente como navegar una interfaz en vivo.',
      },
      preloader: {
        en: '- PRELOADER: Use a deep blue/navy full-screen overlay. Center: animated brand logo (scale 0.8 to 1.0, then fade) + a thin horizontal progress bar beneath it. EXIT: clip-path circle expanding from center (cubic-bezier 0.76, 0, 0.24, 1, 0.6s). Feels like a system booting up. HERO entrance: headline scans in character by character (typewriter, 40ms per char), then the visual element fades in from the right.',
        es: '- PRELOADER: Usa un overlay de pantalla completa azul profundo/navy. Centro: logo de marca animado (scale 0.8 a 1.0, luego fade) + barra de progreso horizontal delgada debajo. SALIDA: clip-path círculo expandíiéndose desde el centro (cubic-bezier 0.76, 0, 0.24, 1, 0.6s). Se siente como un sistema encendiéndose. Entrada al HERO: headline escanea carácter por carácter (typewriter, 40ms por carácter), luego el elemento visual aparece desde la derecha.',
      },
    }
  }

  // Luxury / Fashion / Premium
  if (is('lujo', 'luxury', 'fashion', 'moda', 'jewelry', 'joyería', 'premium', 'haute', 'couture', 'perfume', 'reloj', 'watch', 'brand')) {
    return {
      colorHint: {
        en: '- Color palette: Pure black (#000) as base, champagne gold (#c9a84c) as primary accent, ivory (#f5f0e8) as secondary. Communicates exclusivity and timeless luxury.',
        es: '- Paleta: Negro puro (#000) como base, oro champán (#c9a84c) acento primario, marfil (#f5f0e8) secundario. Comunica exclusividad y lujo atemporal.',
      },
      themeHint: {
        en: '- Use a DARK theme. Luxury brands are editorial and cinematic. Light backgrounds feel mass-market for this business type.',
        es: '- Usa un tema OSCURO. Las marcas de lujo son editoriales y cinematográficas. Los fondos claros se asocian al mercado masivo.',
      },
      typo: {
        en: '- Typography: Use Cormorant Garamond (headlines, weight 300-600, italic for accent lines) + Lato (body, weight 300-400) from Google Fonts. Elegant, editorial, refined — feels like a high-end magazine.',
        es: '- Tipografía: Usa Cormorant Garamond (títulos, weight 300-600, italic para líneas de acento) + Lato (cuerpo, weight 300-400) de Google Fonts. Elegante, editorial, refinado — se siente como una revista de alta gama.',
      },
      bg: {
        en: '- Background animation: Slow-moving liquid silk — smooth, mercury-like fluid shapes that drift languidly across the canvas. Almost imperceptible movement. Opacity: 6-10%. Feels like brushed metal or spilled oil.',
        es: '- Animación de fondo: Seda líquida en cámara lenta — formas fluidas suaves tipo mercurio que se desplazan lentamente por el canvas. Movimiento casi imperceptible. Opacidad: 6-10%. Se siente como metal cepillado o aceite derramado.',
      },
      cursor: {
        en: '- Custom cursor: A thin elegant ring (1.5px stroke, no fill, 28px diameter) that moves with smooth inertia. On hover: the ring expands softly to 40px and slightly reduces opacity — like touching crystal. Never a filled dot. Minimalist authority.',
        es: '- Cursor personalizado: Un anillo fino elegante (1.5px de trazo, sin relleno, 28px de diámetro) que se mueve con inercia suave. Al hover: el anillo se expande suavemente a 40px y reduce ligeramente la opacidad — como tocar cristal. Nunca un punto sólido. Autoridad minimalista.',
      },
      preloader: {
        en: '- PRELOADER: Black full-screen overlay with a single gold/cream thin horizontal line that extends from center-left to center-right (1.5s draw animation). EXIT: slow upward slide with cubic-bezier(0.76, 0, 0.24, 1). HERO entrance: large serif headline fades in letter by letter from bottom, image reveals with a diagonal clip-path wipe. Exudes luxury and editorial prestige.',
        es: '- PRELOADER: Overlay de pantalla completa negro con una única línea delgada dorada/crema que se extiende de centro-izquierda a centro-derecha (animación de trazado 1.5s). SALIDA: deslizamiento lento hacia arriba con cubic-bezier(0.76, 0, 0.24, 1). Entrada al HERO: titular serif grande aparece letra por letra desde abajo, imagen se revela con un clip-path diagonal. Transmite lujo y prestigio editorial.',
      },
    }
  }

  // Health / Wellness / Eco / Nature
  if (is('salud', 'health', 'wellness', 'bienestar', 'yoga', 'nutrición', 'nutrition', 'organic', 'orgánico', 'eco', 'natural', 'spa', 'medita', 'fitness', 'psicolog')) {
    return {
      colorHint: {
        en: '- Color palette: Soft sage green (#8fbc8b) or warm teal (#5a9c6e) as primary, cream white (#faf7f2) as background, warm sand (#d4a96a) as accent. Evokes nature, healing, and calm.',
        es: '- Paleta: Verde salvia (#8fbc8b) o teal cálido (#5a9c6e) como primario, blanco crema (#faf7f2) como fondo, arena cálida (#d4a96a) como acento. Evoca naturaleza y sanación.',
      },
      themeHint: {
        en: '- Use a LIGHT theme. Wellness brands signal purity and safety through clean, bright backgrounds. Dark themes feel clinical for this business type.',
        es: '- Usa un tema CLARO. Las marcas de bienestar transmiten pureza y seguridad con fondos brillantes. Los temas oscuros se sienten clínicos para este tipo de negocio.',
      },
      typo: {
        en: '- Typography: Use Plus Jakarta Sans (headlines, weight 600-800) + Nunito (body, weight 400-500) from Google Fonts. Soft, rounded, warm — communicates trust, calm, and human care.',
        es: '- Tipografía: Usa Plus Jakarta Sans (títulos, weight 600-800) + Nunito (cuerpo, weight 400-500) de Google Fonts. Suave, redondeada, cálida — comunica confianza, calma y cuidado humano.',
      },
      bg: {
        en: '- Background animation: Organic floating cells — soft blob shapes that slowly drift and gently morph (no sharp edges). Like watching cells under a microscope or leaves floating in water. Very slow, calming movement.',
        es: '- Animación de fondo: Células orgánicas flotantes — formas blob suaves que se desplazan lentamente y se transforman con suavidad (sin bordes afilados). Como ver células bajo un microscopio o hojas flotando en agua. Movimiento muy lento y calmante.',
      },
      cursor: {
        en: '- Custom cursor: A soft organic blob (slightly irregular, not a perfect circle, ~20px) that breathes — gently expanding and contracting on a 2s rhythm. On hover: the blob shape shifts and brightens slightly. Feels alive, gentle, organic.',
        es: '- Cursor personalizado: Un blob orgánico suave (ligeramente irregular, no un círculo perfecto, ~20px) que respira — se expande y contrae suavemente en un ritmo de 2s. Al hover: la forma del blob cambia y se ilumina ligeramente. Se siente vivo, suave, orgánico.',
      },
      preloader: {
        en: '- PRELOADER: Soft white/cream or brand green overlay. Center: a slowly blooming circular shape (SVG or CSS, from 0 to full size, 1.2s ease-out). EXIT: blob-morph dissolve — the overlay shape morphs into an organic blob and shrinks to nothing. HERO entrance: elements float upward with gentle stagger (120ms delay each). Feels like nature awakening.',
        es: '- PRELOADER: Overlay suave blanco/crema o verde de marca. Centro: una forma circular que florece lentamente (SVG o CSS, de 0 a tamaño completo, 1.2s ease-out). SALIDA: disolución blob-morph — la forma del overlay se transforma en un blob orgánico y se encoge hasta desaparecer. Entrada al HERO: elementos flotan hacia arriba con stagger suave (120ms de delay cada uno). Se siente como la naturaleza despertándose.',
      },
    }
  }

  // Food / Restaurant / Hospitality / Café
  if (is('restauran', 'food', 'comida', 'chef', 'café', 'cafe', 'cocina', 'kitchen', 'gastro', 'bar', 'hotel', 'hospitalidad', 'hospitality', 'bakery', 'panader')) {
    return {
      colorHint: {
        en: '- Color palette: Warm terracotta (#c0613a) as primary, warm cream (#fdf3e3) as background, amber gold (#e8a020) as accent. These colors stimulate appetite and warmth.',
        es: '- Paleta: Terracota cálida (#c0613a) como primario, crema cálida (#fdf3e3) como fondo, dorado ámbar (#e8a020) como acento. Estimulan el apetito y la calidez.',
      },
      themeHint: {
        en: '- Use a WARM, cream or semi-dark theme. Cold or sterile backgrounds kill appetite for food brands.',
        es: '- Usa un tema CÁLIDO, crema o semi-oscuro. Los fondos fríos o estériles matan el apetito para marcas de comida.',
      },
      typo: {
        en: '- Typography: Use Playfair Display (headlines, weight 700-900) + Source Sans Pro (body, weight 400-500) from Google Fonts. Warm, appetizing, editorial — like a premium food magazine.',
        es: '- Tipografía: Usa Playfair Display (títulos, weight 700-900) + Source Sans Pro (cuerpo, weight 400-500) de Google Fonts. Cálido, apetitoso, editorial — como una revista de comida premium.',
      },
      bg: {
        en: '- Background animation: Warm ambient light — soft golden or amber light pools that slowly drift and pulse, like candlelight reflecting on a wall. Very subtle (7-12% opacity). Creates warmth and intimacy.',
        es: '- Animación de fondo: Luz ambiental cálida — suaves manchas de luz dorada o ámbar que se desplazan lentamente y pulsan, como la luz de velas reflejada en una pared. Muy sutil (7-12% de opacidad). Crea calidez e intimidad.',
      },
      cursor: {
        en: '- Custom cursor: A warm-toned filled dot (14px) with a soft candlelight-like glow halo around it (radial gradient, brand warm color, fading out). On hover: the glow expands and intensifies. Welcoming and sensory.',
        es: '- Cursor personalizado: Un punto sólido de tono cálido (14px) con un halo de brillo suave tipo vela a su alrededor (gradiente radial, color cálido de marca, desvaneciéndose). Al hover: el halo se expande e intensifica. Acogedor y sensorial.',
      },
      preloader: {
        en: '- PRELOADER: Warm amber or terracotta overlay. Center: a fork-and-knife or plate icon drawn with SVG stroke animation (1s). EXIT: diagonal wipe — the overlay slides off the viewport diagonally from top-left to bottom-right. HERO entrance: hero food image zooms from 110% to 100% while headline fades in from below. Feels delicious and inviting.',
        es: '- PRELOADER: Overlay cálido ámbar o terracota. Centro: un icono de tenedor-y-cuchillo o plato dibujado con animación de trazo SVG (1s). SALIDA: wipe diagonal — el overlay se desliza fuera del viewport en diagonal de arriba-izquierda a abajo-derecha. Entrada al HERO: imagen hero de comida hace zoom de 110% a 100% mientras el titular aparece desde abajo. Se siente delicioso y acogedor.',
      },
    }
  }

  // Finance / Legal / Consulting / B2B
  if (is('abogado', 'legal', 'law', 'bufete', 'jurídic', 'finanzas', 'finance', 'contab', 'accountin', 'consultor', 'consulting', 'audit', 'bank', 'invest', 'b2b', 'seguro', 'insurance', 'notari')) {
    return {
      colorHint: {
        en: '- Color palette: Deep navy (#0f1c3f) or charcoal as base, silver-blue (#4a6fa5) as accent, warm white as text. Projects authority, trust, and institutional credibility.',
        es: '- Paleta: Azul marino profundo (#0f1c3f) o carbón como base, azul plateado (#4a6fa5) como acento, blanco cálido como texto. Proyecta autoridad y credibilidad institucional.',
      },
      themeHint: {
        en: '- Use a DARK, authoritative theme. Finance and legal firms signal credibility through dark navy or charcoal backgrounds.',
        es: '- Usa un tema OSCURO y autoritario. Las firmas legales y financieras transmiten credibilidad con fondos azul marino o carbón.',
      },
      typo: {
        en: '- Typography: Use Libre Baskerville (headlines, weight 700) + IBM Plex Sans (body, weight 400-500) from Google Fonts. Authoritative, trustworthy, classical — signals expertise and gravitas.',
        es: '- Tipografía: Usa Libre Baskerville (títulos, weight 700) + IBM Plex Sans (cuerpo, weight 400-500) de Google Fonts. Autoritativo, confiable, clásico — transmite experiencia y peso.',
      },
      bg: {
        en: '- Background animation: Slow topographic lines — concentric geometric curves that shift imperceptibly slowly, like contour lines on a map. Precise, structured, controlled. Very low opacity (5-8%). No randomness.',
        es: '- Animación de fondo: Líneas topográficas lentas — curvas geométricas concéntricas que se desplazan imperceptiblemente despacio, como curvas de nivel en un mapa. Preciso, estructurado, controlado. Opacidad muy baja (5-8%). Sin aleatoriedad.',
      },
      cursor: {
        en: '- Custom cursor: A small precise dot (6px, solid) with a separate thin outer ring (1px, 22px diameter, gap between them). Both move together with clean inertia. No organic shapes. On hover: the ring contracts slightly. Controlled, exact, professional.',
        es: '- Cursor personalizado: Un punto pequeño y preciso (6px, sólido) con un anillo exterior fino separado (1px, 22px de diámetro, espacio entre ellos). Ambos se mueven juntos con inercia limpia. Sin formas orgánicas. Al hover: el anillo se contrae ligeramente. Controlado, exacto, profesional.',
      },
      preloader: {
        en: '- PRELOADER: Deep navy or charcoal overlay. Center: firm logotype + a thin precision progress bar (0 to 100%, 1.2s linear). EXIT: clean upward slide (cubic-bezier 0.76, 0, 0.24, 1) — controlled and decisive. HERO entrance: headline fades in from bottom with firm easing, certification badges slide in from the right. Projects authority and reliability.',
        es: '- PRELOADER: Overlay azul marino profundo o gris antracita. Centro: logotipo firme + barra de progreso delgada de precisión (0 a 100%, 1.2s lineal). SALIDA: deslizamiento limpio hacia arriba (cubic-bezier 0.76, 0, 0.24, 1) — controlado y decisivo. Entrada al HERO: titular aparece desde abajo con easing firme, insignias de certificación entran desde la derecha. Proyecta autoridad y confiabilidad.',
      },
    }
  }

  // Creative / Design / Agency / Art
  if (is('diseño', 'design', 'agencia', 'agency', 'creativo', 'creative', 'arte', 'art', 'fotograf', 'photograph', 'branding', 'studio', 'estudio', 'publicidad', 'advertising', 'media')) {
    return {
      colorHint: {
        en: '- Color palette: Choose ONE bold unexpected brand color (e.g. electric orange #ff4d00 or deep magenta #c2185b) against near-black. The palette IS the brand statement.',
        es: '- Paleta: Elige UN color audaz e inesperado (ej. naranja eléctrico #ff4d00 o magenta #c2185b) sobre negro. La paleta ES el statement de la marca.',
      },
      themeHint: {
        en: '- Use a DARK, editorial theme. Creative agencies command premium positioning through dark backgrounds with bold accent colors.',
        es: '- Usa un tema OSCURO y editorial. Las agencias creativas captan posicionamiento premium con fondos oscuros y colores audaces.',
      },
      typo: {
        en: '- Typography: Use Cabinet Grotesk (headlines, weight 800-900) + DM Sans (body, weight 400-500) from Google Fonts (import Cabinet Grotesk via @font-face from Fontshare CDN: fontshare.com). Editorial, opinionated, confident — the typography itself is part of the design statement.',
        es: '- Tipografía: Usa Cabinet Grotesk (títulos, weight 800-900) + DM Sans (cuerpo, weight 400-500) de Google Fonts (importa Cabinet Grotesk vía @font-face desde Fontshare CDN: fontshare.com). Editorial, con opinión, seguro — la tipografía en sí misma es parte del statement de diseño.',
      },
      bg: {
        en: '- Background animation: Generative ink diffusion — paint-like blobs that slowly emerge, grow, interact, and fade. Like dropping ink in water. Uses brand palette colors at low opacity. Artistic, unpredictable movement.',
        es: '- Animación de fondo: Difusión de tinta generativa — blobs tipo pintura que emergen lentamente, crecen, interactuan y se desvanecen. Como verter tinta en agua. Usa colores de la paleta de marca a baja opacidad. Movimiento artístico e impredecible.',
      },
      cursor: {
        en: '- Custom cursor: A dot that leaves a brief paint-stroke trail behind it — 5-7 ghost dots that follow the cursor position and fade out over 0.4s, creating a brushstroke effect. On hover over interactive elements: cursor becomes a circle with a rotating dashed border. Artistic and unexpected.',
        es: '- Cursor personalizado: Un punto que deja un breve rastro de pincelada — 5-7 puntos fantasma que siguen la posición del cursor y se desvanecen en 0.4s, creando un efecto de pincelada. Al hover sobre elementos interactivos: el cursor se convierte en un círculo con borde punteado rotatorio. Artístico e inesperado.',
      },
      preloader: {
        en: '- PRELOADER: Brand-colored overlay (use the primary brand accent). Center: abstract ink splash SVG that draws itself (stroke-dashoffset animation, 1s). EXIT: ink splatter — overlay dissolves outward with an irregular clip-path polygon animation, like paint splattering off a canvas. HERO entrance: headline "paints" in from left with a clip-path reveal, work portfolio images wipe in diagonally. Feels expressive, bold, and unexpected.',
        es: '- PRELOADER: Overlay en el color de acento principal de la marca. Centro: splah de tinta SVG abstracto que se dibuja solo (animación stroke-dashoffset, 1s). SALIDA: salpicadura de tinta — overlay se disuelve hacia afuera con una animación de clip-path poligonal irregular, como pintura salpicando un lienzo. Entrada al HERO: titular se "pinta" desde la izquierda con revelación clip-path, Imágenes de portafolio entran en diagonal. Se siente expresivo, audaz e inesperado.',
      },
    }
  }

  // Fitness / Sports / Gym
  if (is('gym', 'gimnasio', 'fitness', 'deporte', 'sport', 'entrenamiento', 'training', 'crossfit', 'atletismo', 'athlet', 'boxeo', 'boxing', 'personal trainer')) {
    return {
      colorHint: {
        en: '- Color palette: High-contrast black as base, bold red (#e63946) or electric yellow (#ffd60a) as accent, pure white as secondary. Signals power and intensity.',
        es: '- Paleta: Negro de alto contraste como base, rojo audaz (#e63946) o amarillo eléctrico (#ffd60a) como acento, blanco puro como secundario. Transmite poder e intensidad.',
      },
      themeHint: {
        en: '- Use a DARK, high-contrast theme. Fitness brands are built on black backgrounds with intense accent colors — signals strength and results.',
        es: '- Usa un tema OSCURO y de alto contraste. Las marcas de fitness se construyen sobre negro con colores de acento intensos — transmite fuerza y resultados.',
      },
      typo: {
        en: '- Typography: Use Oswald (headlines, weight 700, uppercase with letter-spacing 0.05em) + Montserrat (body, weight 400-600) from Google Fonts. Bold, condensed, powerful — like a sports poster that demands attention.',
        es: '- Tipografía: Usa Oswald (títulos, weight 700, uppercase con letter-spacing 0.05em) + Montserrat (cuerpo, weight 400-600) de Google Fonts. Audaz, condensado, poderoso — como un póster deportivo que exige atención.',
      },
      bg: {
        en: '- Background animation: Energy pulse ripples — concentric circles that expand outward from multiple origin points and fade, like sonar or shockwaves. Fast-paced intervals (1.5s between pulses). Feels energetic and powerful.',
        es: '- Animación de fondo: Pulsos de energía en ondas — círculos concéntricos que se expanden hacia afuera desde múltiples puntos de origen y se desvanecen, como sonar u ondas de choque. Intervalos rápidos (1.5s entre pulsos). Se siente energético y poderoso.',
      },
      cursor: {
        en: '- Custom cursor: A bold filled dot (12px, brand accent color) that emits energy pulse ripples every 2s — rings expanding from the cursor and fading. On hover over interactive elements: a fast ripple burst (3 rings in quick succession). High-energy, dynamic.',
        es: '- Cursor personalizado: Un punto sólido audaz (12px, color de acento de marca) que emite pulsos de energía en ondas cada 2s — anillos que se expanden desde el cursor y se desvanecen. Al hover sobre elementos interactivos: una ráfaga de ondas rápida (3 anillos en rápida sucesión). Alta energía, dinámico.',
      },
      preloader: {
        en: '- PRELOADER: Black overlay with bold red or brand accent color. Center: large uppercase brand name with a POWER-FILL animation (the text fills with white from bottom to top, like a power gauge). EXIT: split vertically — the overlay splits in half and both pieces slam to opposite edges (fast cubic-bezier, 0.4s). HERO entrance: headline SLAMS in from above with heavy impact (transform: translateY(-60px) to 0, with brief overshoot bounce). Maximum energy.',
        es: '- PRELOADER: Overlay negro con rojo audaz o color de acento de marca. Centro: nombre de la marca en mayúsculas grandes con animación POWER-FILL (el texto se llena de blanco de abajo hacia arriba, como un indicador de potencia). SALIDA: split vertical — el overlay se divide a la mitad y ambas piezas se lanzan hacia los bordes opuestos (cubic-bezier rápido, 0.4s). Entrada al HERO: titular IMPACTA desde arriba con gran fuerza (transform: translateY(-60px) a 0, con pequeño rebote de sobreimpulso). Máxima energía.',
      },
    }
  }

  // Education / Academy / Courses
  if (is('educación', 'education', 'academia', 'academy', 'escuela', 'school', 'universidad', 'university', 'course', 'curso', 'tutor', 'aprendizaje', 'learning', 'capacitación', 'training', 'colegio')) {
    return {
      colorHint: {
        en: '- Color palette: Royal blue (#4a6cf7) or teal (#0891b2) as primary, clean white as background, warm yellow (#fbbf24) as accent. Signals clarity and trustworthiness.',
        es: '- Paleta: Azul royal (#4a6cf7) o teal (#0891b2) como primario, blanco limpio como fondo, amarillo cálido (#fbbf24) como acento. Transmite claridad y confianza.',
      },
      themeHint: {
        en: '- Use a LIGHT, clean theme. Education brands thrive on bright backgrounds that signal clarity and accessibility.',
        es: '- Usa un tema CLARO y limpio. Las marcas educativas prosperan con fondos brillantes que transmiten claridad y accesibilidad.',
      },
      typo: {
        en: '- Typography: Use Nunito (headlines, weight 700-800) + Quicksand (body, weight 400-500) from Google Fonts. Friendly, rounded, approachable — communicates clarity, accessibility, and warmth without being childish.',
        es: '- Tipografía: Usa Nunito (títulos, weight 700-800) + Quicksand (cuerpo, weight 400-500) de Google Fonts. Amigable, redondeada, accesible — comunica claridad, accesibilidad y calidez sin ser infantil.',
      },
      bg: {
        en: '- Background animation: Softly floating geometric shapes (circles, triangles, squares) in pastel brand colors at very low opacity (5-8%), rotating slowly. Feels like a friendly, intellectual, safe environment.',
        es: '- Animación de fondo: Formas geométricas flotando suavemente (círculos, triángulos, cuadrados) en colores pastel de la marca a muy baja opacidad (5-8%), rotando lentamente. Se siente como un entorno amigable, intelectual y seguro.',
      },
      cursor: {
        en: '- Custom cursor: A soft rounded dot (16px) in a brand pastel color with a gentle drop shadow. On hover: the dot bounces gently (small keyframe animation, 0.2s) and changes to the brand accent color. Fun, non-intimidating, approachable.',
        es: '- Cursor personalizado: Un punto redondeado suave (16px) en un color pastel de marca con una sombra suave. Al hover: el punto rebota suavemente (pequeña animación de keyframe, 0.2s) y cambia al color de acento de marca. Divertido, no intimidante, accesible.',
      },
      preloader: {
        en: '- PRELOADER: Bright or soft brand-colored overlay. Center: an animated progress bar made of small colorful dots that fill from left to right (playful! not a plain bar). EXIT: overlay bounces upward — slight overshoot (spring easing, cubic-bezier 0.68, -0.6, 0.32, 1.6). HERO entrance: elements pop in with a subtle scale bounce (1.05 to 1.0). Friendly, approachable, welcoming.',
        es: '- PRELOADER: Overlay brillante o suave en color de marca. Centro: barra de progreso animada hecha de puntos de colores que se llenan de izquierda a derecha (juguetona! no una barra plana). SALIDA: overlay rebota hacia arriba — pequeño sobreimpulso (spring easing, cubic-bezier 0.68, -0.6, 0.32, 1.6). Entrada al HERO: elementos aparecen con un sutil rebote de escala (1.05 a 1.0). Amigable, accesible, acogedor.',
      },
    }
  }

  // Architecture / Real Estate / Construction
  if (is('arquitectura', 'architecture', 'bienes raíces', 'real estate', 'inmobiliaria', 'construcción', 'construction', 'diseño interior', 'interior design', 'properti', 'propiedad')) {
    return {
      colorHint: {
        en: '- Color palette: Warm concrete (#b5a99a) or slate grey (#708090) as primary, off-white (#fafaf8) as background, charcoal (#2c2c2c) as text. Communicates permanence and quality.',
        es: '- Paleta: Concreto cálido (#b5a99a) o gris pizarra (#708090) como primario, blanco cálido (#fafaf8) como fondo, carbón (#2c2c2c) como texto. Comunica permanencia y calidad.',
      },
      themeHint: {
        en: '- Use a LIGHT, minimal theme. Architecture and real estate brands communicate quality through negative space and light backgrounds.',
        es: '- Usa un tema CLARO y minimalista. Las marcas de arquitectura comunican calidad a través del espacio negativo y fondos claros.',
      },
      typo: {
        en: '- Typography: Use DM Sans (headlines, weight 700-800) + Source Serif Pro (body, weight 400) from Google Fonts. Clean with an architectural editorial touch — precise, structured, sophisticated.',
        es: '- Tipografía: Usa DM Sans (títulos, weight 700-800) + Source Serif Pro (cuerpo, weight 400) de Google Fonts. Limpio con un toque editorial arquitectónico — preciso, estructurado, sofisticado.',
      },
      bg: {
        en: '- Background animation: Blueprint lines drawing themselves — thin architectural grid lines that appear being drawn in real-time, forming geometric structures and then fading. Precise, structured. Like watching blueprints come alive.',
        es: '- Animación de fondo: Líneas de plano dibujándose solas — líneas de cuadrícula arquitectónica delgadas que aparecen siendo dibujadas en tiempo real, formando estructuras geométricas y luego desvaneciéndose. Preciso, estructurado. Como ver planos cobrar vida.',
      },
      cursor: {
        en: '- Custom cursor: A diamond shape (square rotated 45°, 18px, 1.5px stroke, no fill) instead of a circle. Moves with precise inertia. On hover over interactive elements: fills with a semi-transparent brand color. Geometric, architectural, distinctive.',
        es: '- Cursor personalizado: Una forma de diamante (cuadrado rotado 45°, 18px, 1.5px de trazo, sin relleno) en vez de círculo. Se mueve con inercia precisa. Al hover sobre elementos interactivos: se rellena con un color de marca semi-transparente. Geométrico, arquitectónico, distintivo.',
      },
      preloader: {
        en: '- PRELOADER: White or stone-grey overlay. Center: a thin crosshair grid (like architectural graph paper) that extends outward line by line (SVG stroke animation, 1.5s). EXIT: the overlay slides upward with mechanical precision (linear timing, 0.5s). HERO entrance: content reveals behind a horizontal wipe from left to right. Structured, precise, architectural.',
        es: '- PRELOADER: Overlay blanco o gris piedra. Centro: una cuadrícula de cruceta delgada (como papel cuadriculado arquitectónico) que se extiende hacia afuera línea por línea (animación de trazo SVG, 1.5s). SALIDA: el overlay se desliza hacia arriba con precisión mecánica (timing lineal, 0.5s). Entrada al HERO: el contenido se revela detrás de un wipe horizontal de izquierda a derecha. Estructurado, preciso, arquitectónico.',
      },
    }
  }

  // ─── Fallback — unknown industry ─────────────────────────────────────────
  // Analyze description + niche to pick the closest energy profile.
  // Default to clean geometric — universally premium, never wrong.
  return {
    colorHint: {
      en: '- Color palette: Analyze the business and choose emotionally appropriate colors: bold/energetic (red/orange on dark), trustworthy (blue/slate on white), creative (purple/pink on dark), natural (green on cream). Max 3 colors + 1 accent.',
      es: '- Paleta: Analiza el negocio y elige colores emocionalmente apropiados: audaz/energético (rojo/naranja sobre oscuro), confiable (azul/pizarra sobre blanco), creativo (morado/rosa sobre oscuro), natural (verde sobre crema). Máx. 3 colores + 1 acento.',
    },
    themeHint: {
      en: '- Theme: Infer from the business. Service/professional → light. Tech/luxury/night → dark. Health/education → light and warm. When in doubt: dark with colored accents converts better.',
      es: '- Tema: Infiere del negocio. Servicios/profesional → claro. Tech/lujo/noche → oscuro. Salud/educación → claro y cálido. En caso de duda: oscuro con acentos de color convierte mejor.',
    },
    typo: {
      en: '- Typography: Use Outfit (headlines, weight 700-900) + Inter (body, weight 400-500) from Google Fonts. Clean, versatile, and universally premium — adapt weight and spacing to match the specific business tone (tighter for professional, looser for approachable).',
      es: '- Tipografía: Usa Outfit (títulos, weight 700-900) + Inter (cuerpo, weight 400-500) de Google Fonts. Limpio, versátil y universalmente premium — adapta el peso y el espaciado al tono específico del negocio (más apretado para profesional, más espaciado para accesible).',
    },
    bg: {
      en: '- Background animation: Subtle particle field — small dots (2-3px) in brand colors dispersed across the canvas, connected by thin lines when in proximity. Gentle drifting motion. Adapts to the brand energy through color and speed alone.',
      es: '- Animación de fondo: Campo de partículas sutil — puntos pequeños (2-3px) en colores de marca dispersados por el canvas, conectados por líneas delgadas cuando están en proximidad. Movimiento de deriva suave. Se adapta a la energía de marca solo a través del color y la velocidad.',
    },
    cursor: {
      en: '- Custom cursor: A clean dot (10px, brand primary color) with a larger translucent ring that follows with 0.12s inertia lag. On hover: the ring snaps to the element and fills slightly. A timeless, professional custom cursor that elevates any site.',
      es: '- Cursor personalizado: Un punto limpio (10px, color primario de marca) con un anillo translucido más grande que sigue con 0.12s de inercia. Al hover: el anillo se ajusta al elemento y se rellena ligeramente. Un cursor personalizado atemporal y profesional que eleva cualquier sitio.',
    },
    preloader: {
      en: '- PRELOADER: Brand primary color overlay. Center: brand logo or wordmark animates in (scale 0.7 to 1.0 + opacity 0 to 1, 0.8s ease-out) + thin progress bar below (0 to 100%, 1.2s). EXIT: slides upward with cubic-bezier(0.76, 0, 0.24, 1), 0.7s. HERO entrance: all elements fade and slide in with 80ms stagger per element. Premium, universal, always works.',
      es: '- PRELOADER: Overlay en el color primario de marca. Centro: logo o wordmark de la marca aparece animado (scale 0.7 a 1.0 + opacidad 0 a 1, 0.8s ease-out) + barra de progreso delgada debajo (0 a 100%, 1.2s). SALIDA: se desliza hacia arriba con cubic-bezier(0.76, 0, 0.24, 1), 0.7s. Entrada al HERO: todos los elementos aparecen con fade y slide con 80ms de stagger por elemento. Premium, universal, siempre funciona.',
    },
  }
}

// ─────────────────────────────────────────────────────────────────────────────

export function generatePrompt(inputs: PromptInputs): string {
  const {
    description, niche, vibe, sections, cta, lang = 'en',
    siteLang, whatsapp, instagram, facebook, tiktok, linkedin, customLink,
    logoDataUrl,
    logoAnnotation,
    clientLogos = [],
    assets = [],
    inspirations = [],
    testimonials = []
  } = inputs

  // Resolve industry profile from niche BEFORE building the prompt
  const profile = detectIndustryProfile(niche || description || '')

  // Token replacer: swaps __INDUSTRY_*__ placeholders with precise industry text
  const resolve = (text: string): string =>
    text
      .replace('__INDUSTRY_TYPO__', profile.typo[lang])
      .replace('__INDUSTRY_BG__', profile.bg[lang])
      .replace('__INDUSTRY_CURSOR__', profile.cursor[lang])
      .replace('__INDUSTRY_PRELOADER__', profile.preloader[lang])
      .replace('__INDUSTRY_COLOR__', profile.colorHint[lang])
      .replace('__INDUSTRY_THEME__', profile.themeHint[lang])

  // Proxy object: every property access auto-resolves tokens
  const t = new Proxy(promptText[lang], {
    get(target, prop: string) {
      const val = target[prop as keyof typeof target]
      return typeof val === 'string' ? resolve(val) : val
    },
  })

  const vibeText = vibe && vibe in vibePrompts
    ? vibePrompts[vibe][lang]
    : t.defaultVibe

  const sectionList = sections.length > 0
    ? sections.map((s, i) => `${i + 1}. ${sectionPrompts[s]?.[lang] ?? s}`).join('\n')
    : t.defaultSections

  const lines: string[] = []

  lines.push(t.buildMe)
  lines.push(``)
  lines.push(`${t.whatFor} ${description || t.placeholder}`)
  if (niche) lines.push(`${t.businessType} ${niche}`)
  lines.push(`${t.mainButton} "${cta || t.defaultCta}"`)

  lines.push(``)
  lines.push(vibeText)
  lines.push(``)
  lines.push(t.colorPalette)

  lines.push(``)
  lines.push(t.pageSections)
  lines.push(sectionList)

  lines.push(``)
  lines.push(t.important)
  lines.push(t.responsive)
  lines.push(t.realText)
  lines.push(t.animations)
  lines.push(t.ctaPosition)
  lines.push(t.cleanCode)
  lines.push(t.techStack)

  lines.push(``)
  lines.push(t.conversionTitle)
  lines.push(t.conversionCopy)
  lines.push(t.conversionUrgency)
  lines.push(t.conversionTestimonials)
  lines.push(t.conversionCtaRepeat)
  lines.push(t.conversionAnchoring)
  lines.push(t.conversionRiskReversal)

  lines.push(``)
  lines.push(t.premiumTitle)
  lines.push(t.premiumColorPsychology)
  lines.push(t.premiumTheme)
  lines.push(t.premiumTypography)
  lines.push(t.premiumGlass)
  lines.push(t.premiumAnimations)
  lines.push(t.premiumGradient)
  lines.push(t.premiumScroll)

  lines.push(``)
  lines.push(t.imagesTitle)
  lines.push(t.imagesContext)

  lines.push(``)
  lines.push(t.visualExpTitle)
  lines.push(t.visualExpBackground)
  lines.push(t.visualExpBgAdapt)
  lines.push(t.visualExpCards)
  lines.push(t.visualExpImages)
  lines.push(t.visualExpButtons)

  lines.push(``)
  lines.push(t.neuroTitle)
  lines.push(t.neuroNarrative)
  lines.push(t.neuroFuturePacing)
  lines.push(t.neuroPowerWords)
  lines.push(t.neuroTribal)
  lines.push(t.neuroSpecificity)
  lines.push(t.neuroMicroCopy)

  lines.push(``)
  lines.push(t.polishTitle)
  lines.push(t.polishEntrance)
  lines.push(t.polishScrollBar)
  lines.push(t.polishCursor)
  lines.push(t.polishNavActive)

  lines.push(``)
  lines.push(t.mobileTitle)
  lines.push(t.mobileStickyBar)
  lines.push(t.mobileFloatingBtn)
  lines.push(t.mobileTouchTargets)

  lines.push(``)
  lines.push(t.metaTitle)
  lines.push(t.metaTags)

  lines.push(``)
  lines.push(t.themeTitle)
  lines.push(t.themeLogic)

  lines.push(``)
  lines.push(t.flowTitle)
  lines.push(t.flowTransitions)

  lines.push(``)
  lines.push(t.agencyTitle)
  lines.push(t.agencyAsymmetry)
  lines.push(t.agencyTypography)
  lines.push(t.agencyCopyVoice)
  lines.push(t.agencyTextRotator)
  lines.push(t.agencyWhitespace)
  lines.push(t.agencyMotion)
  lines.push(t.agencyPersonality)

  lines.push(``)
  lines.push(t.antiAiTitle)
  lines.push(t.antiAiIcons)
  lines.push(t.antiAiAlignment)
  lines.push(t.antiAiBgAlternate)
  lines.push(t.antiAiGrouping)
  lines.push(t.antiAiTestimonials)
  lines.push(t.antiAiFooter)
  lines.push(t.antiAiNames)
  lines.push(t.antiAiShadows)
  lines.push(t.antiAiTypoTuning)
  lines.push(t.antiAiLearnMore)
  lines.push(t.antiAiButtons)
  lines.push(t.antiAiImageTreatment)
  lines.push(t.antiAiStructure)
  lines.push(t.antiAiHovers)
  lines.push(t.antiAiGradients)

  lines.push(``)
  lines.push('**World-class conversion architecture:**')
  lines.push(t.copyFrameworks)
  lines.push(t.sectionHierarchy)
  lines.push(t.cardAnimationVariety)
  lines.push(t.conversionMicroCopy)
  lines.push(t.layoutRandomization)

  // ── Site Language ──────────────────────────────────────────────────────────
  if (siteLang) {
    lines.push(``)
    if (lang === 'es') {
      lines.push(`**Idioma del sitio web generado:**`)
      lines.push(`- TODO el contenido del sitio web (textos, botones, menú, footer, testimonios, FAQ, meta tags) debe estar escrito COMPLETAMENTE en ${siteLang}. No uses inglés ni ningún otro idioma. Si el idioma no es español, adapta el tono y las expresiones culturalmente para que suene nativo, no como una traducción.`)
    } else {
      lines.push(`**Website output language:**`)
      lines.push(`- ALL website content (text, buttons, navigation, footer, testimonials, FAQ, meta tags) must be written ENTIRELY in ${siteLang}. Do not mix languages. Adapt idioms, tone, and cultural expressions to feel native — not like a translation.`)
    }
  }

  // ── WhatsApp Integration ──────────────────────────────────────────────────
  if (whatsapp) {
    const waMsg = lang === 'es'
      ? encodeURIComponent(`Hola, vi tu sitio web y me gustaría obtener más información 👋`)
      : encodeURIComponent(`Hi, I saw your website and I'd like to get more information 👋`)
    const waLink = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${waMsg}`
    lines.push(``)
    if (lang === 'es') {
      lines.push(`**Integración de WhatsApp (CRÍTICO — todos los botones deben funcionar):**`)
      lines.push(`- El número de WhatsApp del negocio es: ${whatsapp}`)
      lines.push(`- El enlace de WhatsApp ya generado con mensaje es: ${waLink}`)
      lines.push(`- TODOS los botones CTA principales (hero, mid-page, sticky bar, floating button) deben usar este enlace directamente.`)
      lines.push(`- El botón flotante de WhatsApp (esquina inferior derecha) debe usar este enlace y el mensaje pre-cargado: "Hola, vi tu sitio web y me gustaría obtener más información".`)
      lines.push(`- El mensaje debe sentirse cálido, humano y natural — NO automatizado ni genérico.`)
    } else {
      lines.push(`**WhatsApp Integration (CRITICAL — all buttons must be functional):**`)
      lines.push(`- Business WhatsApp number: ${whatsapp}`)
      lines.push(`- Pre-built WhatsApp link with message: ${waLink}`)
      lines.push(`- ALL primary CTA buttons (hero, mid-page, sticky bar, floating button) must use this link directly.`)
      lines.push(`- The floating WhatsApp button (bottom-right) must use this link with pre-loaded message: "Hi, I saw your website and I'd like to get more information".`)
      lines.push(`- The message must feel warm, human, and natural — NOT automated or generic.`)
    }
  }

  // ── Social Media Links ────────────────────────────────────────────────────
  const hasSocials = instagram || facebook || tiktok || linkedin || customLink
  if (hasSocials) {
    lines.push(``)
    if (lang === 'es') {
      lines.push(`**Redes sociales (íconos funcionales en el footer):**`)
      lines.push(`- Los íconos de redes sociales en el footer deben ser FUNCIONALES con estos enlaces reales:`)
      if (instagram) lines.push(`  · Instagram: ${instagram}`)
      if (facebook) lines.push(`  · Facebook: ${facebook}`)
      if (tiktok) lines.push(`  · TikTok: ${tiktok}`)
      if (linkedin) lines.push(`  · LinkedIn: ${linkedin}`)
      if (customLink) lines.push(`  · Enlace personalizado: ${customLink}`)
      lines.push(`- IMPORTANTE: SOLO muestra los íconos para las redes que SÍ tienen un enlace explícito aquí arriba. Las opciones NO proporcionadas (ej. si falta TikTok o LinkedIn) NO DEBEN aparecer bajo ninguna circunstancia en tu diseño, ni siquiera como íconos ocultos, inactivos o con href="#". Omitelas por completo.`)
      lines.push(`- Al hacer clic, deben abrirse en una nueva pestaña (target="_blank" rel="noopener noreferrer").`)
    } else {
      lines.push(`**Social Media Links (functional icons in footer):**`)
      lines.push(`- Footer social icons must be FUNCTIONAL with these real links:`)
      if (instagram) lines.push(`  · Instagram: ${instagram}`)
      if (facebook) lines.push(`  · Facebook: ${facebook}`)
      if (tiktok) lines.push(`  · TikTok: ${tiktok}`)
      if (linkedin) lines.push(`  · LinkedIn: ${linkedin}`)
      if (customLink) lines.push(`  · Custom Link: ${customLink}`)
      lines.push(`- IMPORTANT: ONLY show icons for networks that DO have an explicit link provided above. Options NOT provided (e.g. if TikTok or LinkedIn is missing) MUST NOT appear under any circumstances in your design, not even as hidden/inactive icons or with href="#". Omit them completely from the HTML.`)
      lines.push(`- All links must open in a new tab (target="_blank" rel="noopener noreferrer").`)
    }
  }

  // ── Intelligent Chat Widget ───────────────────────────────────────────────
  lines.push(``)
  if (lang === 'es') {
    lines.push(`**Widget de contacto inteligente:**`)
    if (whatsapp) {
      lines.push(`- Implementa un botón flotante de WhatsApp (esquina inferior derecha) con el enlace: ${`https://wa.me/${(whatsapp || '').replace(/[^0-9]/g, '')}`}`)
      lines.push(`- El botón debe tener una animación de pulso sutil (caja de sombra respirando cada 2s) para atraer atención sin ser intrusivo.`)
      lines.push(`- Al hacer hover: muestra un pequeño tooltip con el texto: "¡Escríbenos ahora! Respondemos en minutos 🚀" (o equivalente en el idioma del sitio).`)
      lines.push(`- NO ubiques el botón siempre en el mismo lugar — basándote en la industria, colócalo en la esquina inferior ${niche?.toLowerCase().includes('derech') ? 'izquierda' : 'derecha'} para que no tape el contenido clave.`)
    } else {
      lines.push(`- Agrega un botón de chat flotante genérico (ícono de burbuja de chat) que abra un formulario de contacto simple o scroll suave al formulario de contacto.`)
    }
  } else {
    lines.push(`**Intelligent Contact Widget:**`)
    if (whatsapp) {
      lines.push(`- Implement a floating WhatsApp button (bottom-right corner) linking to: ${`https://wa.me/${(whatsapp || '').replace(/[^0-9]/g, '')}`}`)
      lines.push(`- The button must have a subtle pulse animation (breathing box-shadow every 2s) to attract attention without being intrusive.`)
      lines.push(`- On hover: show a small tooltip: "Chat with us! We reply in minutes 🚀" (or equivalent in site language).`)
      lines.push(`- Position it contextually — not always the same corner. Base the position on the page layout to avoid covering key content.`)
    } else {
      lines.push(`- Add a generic floating chat button (chat bubble icon) that smoothly scrolls to the contact form or opens a simple inline contact popup.`)
    }
  }

  // ── Image Assets & Logo ───────────────────────────────────────────────────
  // We explicitly link the provided dataUrls (now in the exported public/ directory)
  // to their filenames and annotations to completely replace placeholders.
  const validAssets = assets.filter(a => a.dataUrl || a.annotation)
  const validClientLogos = clientLogos.filter(a => a.dataUrl || a.annotation)
  const hasAssets = validAssets.length > 0 || logoDataUrl || validClientLogos.length > 0

  if (hasAssets) {
    lines.push(``)
    if (lang === 'es') {
      lines.push(`**RECURSOS VISUALES LOCALES (USO OBLIGATORIO):**`)
      lines.push(`- Te he proporcionado los activos fotográficos y logos reales del cliente dentro de la carpeta \`public/\`. NO uses imágenes de stock de Unsplash ni placeholders genéricos para estos elementos. Debes referenciarlos exactamente con estas rutas en tu código:`)

      if (logoDataUrl) {
        lines.push(`- **LOGO PRINCIPAL**: Archivo \`./public/logo.png\`. ${logoAnnotation ? `(Descripción provista por el cliente: "${logoAnnotation}")` : ''} Úsalo en la navbar (altura: 32-40px) y en el footer.`)
      }

      if (validClientLogos.length > 0) {
        lines.push(`- **LOGOS DE CLIENTES / TESTIMONIOS**: Hay ${validClientLogos.length} imagen(es) de marcas que confían en nosotros.`)
        validClientLogos.forEach((c, i) => {
          lines.push(`  * Archivo \`./public/client_logo_${i + 1}.png\`. ${c.annotation ? `(Descripción: "${c.annotation}")` : ''}`)
        })
        lines.push(`  Úsalos EXCLUSIVAMENTE en la sección de 'Social Proof' o Testimonios.`)
      }

      if (validAssets.length > 0) {
        lines.push(`- **IMÁGENES DE APOYO**:`)
        validAssets.forEach((asset, i) => {
          lines.push(`  * Archivo \`./public/asset_${i + 1}.png\`. ${asset.annotation ? `(Descripción: "${asset.annotation}")` : ''}`)
        })
        lines.push(`  Distribuye estas imágenes donde tengan más impacto visual (ej. Hero, Nosotros, Producto). Tienen un papel fundamental para subir la conversión.`)
      }
    } else {
      lines.push(`**LOCAL VISUAL ASSETS (MANDATORY USE):**`)
      lines.push(`- I have provided the real client photographic assets and logos inside the \`public/\` folder. DO NOT use Unsplash stock images or generic placeholders for these elements. You must reference them exactly with these paths in your code:`)

      if (logoDataUrl) {
        lines.push(`- **MAIN LOGO**: File \`./public/logo.png\`. ${logoAnnotation ? `(Client description: "${logoAnnotation}")` : ''} Use it in the navbar (height: 32-40px) and footer.`)
      }

      if (validClientLogos.length > 0) {
        lines.push(`- **CLIENT / PARTNER LOGOS**: There are ${validClientLogos.length} image(s) representing trusting brands.`)
        validClientLogos.forEach((c, i) => {
          lines.push(`  * File \`./public/client_logo_${i + 1}.png\`. ${c.annotation ? `(Description: "${c.annotation}")` : ''}`)
        })
        lines.push(`  Use them EXCLUSIVELY in the 'Social Proof' or Testimonials section.`)
      }

      if (validAssets.length > 0) {
        lines.push(`- **SUPPORTING IMAGES**:`)
        validAssets.forEach((asset, i) => {
          lines.push(`  * File \`./public/asset_${i + 1}.png\`. ${asset.annotation ? `(Description: "${asset.annotation}")` : ''}`)
        })
        lines.push(`  Position these images where they will have the most visual impact (e.g. Hero, About, Product). They play a vital role in increasing conversions.`)
      }
    }
  }

  // ── Real Testimonials ─────────────────────────────────────────────────────
  const validTestimonials = testimonials.filter(t => t.name || t.text)
  if (validTestimonials.length > 0) {
    lines.push(``)
    if (lang === 'es') {
      lines.push(`**TESTIMONIOS REALES DEL CLIENTE (USA ESTOS EXACTAMENTE):**`)
      lines.push(`- El cliente ha proporcionado los siguientes testimonios reales. Úsalos TAL CUAL en la sección de Testimonios. NO inventes ni alteres los nombres, cargos ni el texto. Preséntelos con el estilo visual que corresponda:`)
      validTestimonials.forEach((t, i) => {
        const name = t.name || `Cliente ${i + 1}`
        const role = t.role ? ` — ${t.role}` : ''
        const text = t.text || ''
        const photo = t.photo ? ` (Foto real del cliente: \`./public/testimonial_${i + 1}.jpg\` — úsala como avatar del testimonio)` : ''
        lines.push(`  ${i + 1}. **${name}${role}**${photo}: "${text}"`)
      })
    } else {
      lines.push(`**REAL CUSTOMER TESTIMONIALS (USE THESE EXACTLY):**`)
      lines.push(`- The client has provided the following real testimonials. Use them EXACTLY AS GIVEN in the Testimonials section. Do NOT invent or alter names, roles, or text. Present them with the appropriate visual style:`)
      validTestimonials.forEach((t, i) => {
        const name = t.name || `Customer ${i + 1}`
        const role = t.role ? ` — ${t.role}` : ''
        const text = t.text || ''
        const photo = t.photo ? ` (Real client photo: \`./public/testimonial_${i + 1}.jpg\` — use it as the testimonial avatar)` : ''
        lines.push(`  ${i + 1}. **${name}${role}**${photo}: "${text}"`)
      })
    }
  }

  // ── Inspiration References ────────────────────────────────────────────────
  const validInspirations = inspirations.filter(insp => insp.dataUrl)
  if (validInspirations.length > 0) {
    lines.push(``)
    if (lang === 'es') {
      lines.push(`**REFERENCIAS DE DISEÑO (Analiza e imita el estilo):**`)
      lines.push(`- Te he proporcionado una carpeta \`design_references/\` con capturas de pantalla de sitios web que el cliente quiere tomar como base visual.`)
      validInspirations.forEach((insp, i) => {
        lines.push(`  * Revisa el archivo \`design_references/inspiration_${i + 1}.png\`. ${insp.annotation ? `Contexto del archivo: ${insp.annotation}` : ''}`)
      })
      lines.push(`- ADAPTA meticulosamente estos patrones visuales (colores, espaciado, sombras, tipografía) a ESTA nueva web. Extrae la esencia premium y modernidad de las referencias.`)
    } else {
      lines.push(`**DESIGN REFERENCES (Analyze and mimic the style):**`)
      lines.push(`- I have provided a \`design_references/\` folder containing screenshots of websites the client wishes to emulate visually.`)
      validInspirations.forEach((insp, i) => {
        lines.push(`  * Review the file \`design_references/inspiration_${i + 1}.png\`. ${insp.annotation ? `Context: ${insp.annotation}` : ''}`)
      })
      lines.push(`- Meticulously ADAPT these visual patterns (colors, spacing, shadows, typography) to THIS new site. Extract the premium essence and modern layout of the references.`)
    }
  }

  // ── Elite Marketing Strategy Layer ───────────────────────────────────────
  lines.push(``)
  if (lang === 'es') {
    lines.push(`**⚡ Estrategia de conversión de élite (frameworks probados por los mejores del mundo):**`)
    lines.push(`- OFERTA IRRESISTIBLE (Alex Hormozi — Value Equation): El héroe de la página debe comunicar una oferta tan obvia que rechazarla se sienta estúpido. Formula: [Alto Valor Percibido] + [Alta Probabilidad de Éxito] + [Bajo Tiempo para Resultado] + [Bajo Riesgo]. Ejemplo: "Consigue tu sitio web profesional en 24h — o te devolvemos el dinero sin preguntas".`)
    lines.push(`- EMBUDO DE COMPROMISOS ESCALONADOS (Russell Brunson — Value Ladder): No pidas el mayor compromiso de entrada. Estructura micro-CTAs que escalen: (1) Micro-compromiso: "Ver cómo funciona →" (no cuesta nada), (2) Compromiso suave: "Obtén una muestra gratis" (bajo riesgo), (3) Compromiso real: el servicio/producto principal. Cada CTA en la página debe corresponder a un escalón diferente.`)
    lines.push(`- PERSUASIÓN POR RECIPROCIDAD (Robert Cialdini): Ofrece PRIMERO algo de valor real sin pedir nada a cambio — una guía, una consulta gratuita, un recurso. Esto activa el principio de reciprocidad: el visitante sentirá la obligación subconsciente de devolver el favor. Menciona esto en una sección de la página.`)
    lines.push(`- STORYTELLING HEROICO (Andrés Bilbao / David Rodríguez): El copy no vende el producto — vende la TRANSFORMACIÓN. El visitante es el héroe, la marca es el guía sabio. Estructura: Así estabas antes → Así es la vida con nosotros → Únete a ellos. Esta narrativa debe atravesar toda la página.`)
    lines.push(`- URGENCIA REAL (no falsa escasez): Crea urgencia basada en consecuencias reales, no en contadores falsos. Ejemplos genuinos: "Cada mes sin un sitio web es dinero que va a tu competencia", "Tomamos solo 5 clientes nuevos por mes para garantizar calidad", "Los precios suben en [próxima_temporada]". La urgencia debe sentirse honesta y creíble.`)
    lines.push(`- PRUEBA SOCIAL ESPECÍFICA: Los testimonios deben incluir métricas reales y específicas (ROI, tiempo ahorrado, ventas aumentadas, clientes ganados). NUNCA elogios vagos. El cerebro confía en los números: "Pasé de 0 a 47 clientes en 3 meses" convierte 10x más que "Excelente servicio".`)
  } else {
    lines.push(`**⚡ Elite Conversion Strategy (frameworks proven by the world's best marketers):**`)
    lines.push(`- GRAND SLAM OFFER (Alex Hormozi — Value Equation): The hero section must communicate an offer so obvious that refusing it feels stupid. Formula: [High Perceived Value] + [High Success Probability] + [Short Time to Result] + [Low Risk]. Example: "Get your professional website in 24h — or your money back, no questions asked".`)
    lines.push(`- COMMITMENT FUNNEL (Russell Brunson — Value Ladder): Never ask for the biggest commitment upfront. Structure micro-CTAs that escalate: (1) Micro-commitment: "See how it works →" (zero cost), (2) Soft commitment: "Get a free sample" (low risk), (3) Real commitment: the main service/product. Each CTA on the page should correspond to a different step.`)
    lines.push(`- RECIPROCITY PERSUASION (Robert Cialdini): Offer something of REAL value first, asking nothing in return — a guide, a free consultation, a resource. This activates the reciprocity principle: the visitor feels a subconscious obligation to give back. Mention this in a section on the page.`)
    lines.push(`- HEROIC STORYTELLING (Spencer Hoff / Brian Tracy): Copy doesn't sell the product — it sells the TRANSFORMATION. The visitor is the hero, the brand is the wise guide. Structure: How you were before → How life is with us → Join them. This narrative should run through the entire page.`)
    lines.push(`- REAL URGENCY (not fake scarcity): Create urgency from real consequences, not fake countdown timers. Genuine examples: "Every month without a website is money going to your competitor", "We take only 5 new clients per month to guarantee quality", "Prices increase next quarter". Urgency must feel honest and believable.`)
    lines.push(`- SPECIFIC SOCIAL PROOF: Testimonials must include real specific metrics (ROI, time saved, sales increased, clients gained). NEVER vague praise. The brain trusts numbers: "Went from 0 to 47 clients in 3 months" converts 10x better than "Great service".`)
  }

  return lines.join('\n').trim()
}

export function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length
}
