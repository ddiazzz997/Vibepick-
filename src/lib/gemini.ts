import { GoogleGenerativeAI } from '@google/generative-ai';

// @ts-ignore
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;
if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
}

const getHormoziBrunsonContext = (fieldType: string) => {
    switch (fieldType) {
        case 'description':
            return `ROLE: Lead Software Engineer, Product Manager & Elite Sales Copywriter.
FRAMEWORK: 'Hook, Story, Offer' by Russell Brunson + High-End Web Development Architecture.
TASK: Expand the user's brief context into a comprehensive, highly-structured "Website PRD & Business Context".
INSTRUCTIONS:
1. Extract and infer the precise Business Context (What they sell, where they operate physically/virtually, target audience).
2. Recommend the exact Tech Stack & UI Requirements for a premium modern site (e.g., HTML, TypeScript, Tailwind, aggressive use of Framer Motion for scroll effects, glassmorphism, 3D elements, precise animations).
3. Establish the core marketing angle and tone (Hormozi style).
Do NOT ask questions. Deduce the best possible structure from their input and return the FINAL, ready-to-use comprehensive description text that they can inject into a master prompt.`;

        case 'offer':
            return `ROLE: Direct Response Marketer & Alex Hormozi (100M Offers).
FRAMEWORK: 'Grand Slam Offer'. High perceived value, low perceived effort, high likelihood of achievement, low time delay.
TASK: The user is answering "What is your main Call to Action or Offer?". Generate 3 irresistible, highly-converting CTA examples.
EXAMPLE STYLE: "Reserva tu consultoría gratuita de 15 min hoy. Si no duplicamos tus prospectos en 30 días, te devuelvo tu dinero."`;

        case 'audience':
            return `ROLE: Market Researcher & Russell Brunson (DotCom Secrets).
FRAMEWORK: 'Dream Customer'. Focus on core desires (wealth, health, relationships) and their false beliefs/pain points.
TASK: The user is answering "Who is your target audience?". Generate 3 hyper-segmented audience profile examples.
EXAMPLE STYLE: "Dueños de restaurantes en México que facturan más de $5k/mes pero están exhaustos trabajando 14 horas al día y buscan sistematizar."`;

        case 'brandVoice':
            return `ROLE: Senior Frontend Developer & UI/UX Specialist.
FRAMEWORK: High-converting UX psychology and Brunson's 'Attractive Character'.
TASK: The user is answering "What is the design style and brand voice?". Generate 3 professional UI/UX design direction examples.
EXAMPLE STYLE: "Minimalista y futurista, con fondo oscuro (Dark Mode), acentos en neón azul, tipografía sans-serif gruesa y animaciones suaves para máxima retención."`;

        default:
            return `ROLE: Elite Business Strategist. Generate 3 brilliant marketing examples.`;
    }
};

export const chatWithAssistant = async (
    fieldType: string,
    history: { role: 'user' | 'model'; parts: any[] }[],
    contextData: Record<string, string>,
    language: string = 'es'
): Promise<string> => {
    if (!genAI) {
        console.warn("Gemini API key is missing.");
        return "Para usar la IA, configura la API key en Vercel.";
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        let contextString = Object.entries(contextData)
            .filter(([_, val]) => val.trim() !== '')
            .map(([key, val]) => `${key}: ${val}`)
            .join('\n');

        const systemPrompt = `
      You are an elite expert interacting with a user in a website builder chat.
      YOUR EXPERTISE IS DEEPLY ROOTED IN ALEX HORMOZI AND RUSSELL BRUNSON FRAMEWORKS.
      
      YOUR SPECIFIC ROLE FOR THIS FIELD ("${fieldType}"):
      ${getHormoziBrunsonContext(fieldType)}
      
      CURRENT OVERALL WEBSITE CONTEXT:
      ${contextString || 'None provided yet.'}
      
      CONVERSATION RULES:
      1. You are advising the user in a step-by-step conversational manner. Do NOT ask all your questions at once. Ask ONE thing at a time like a real consultant.
      2. If you don't have enough context yet, boldly but politely ask the user a short question to extract it.
      3. For the 'description' field, you MUST extract: What they sell, where they operate (digital/country), and their core product/offer.
      4. ONCE YOU HAVE ENOUGH CONTEXT: You must generate the final, perfect, highly-persuasive text for this field.
      5. To output the final text, you MUST wrap it perfectly in <FINAL_TEXT> ... </FINAL_TEXT> tags. 
         Before the tag, say something short like "¡Genial! Ya tengo todo el contexto necesario. Aquí tienes la estructura sólida:".
      6. Do NOT use markdown labels if it's the final text to be pasted, keep it highly professional.
      
      Language: ${language === 'es' ? 'Spanish' : 'English'}.
    `;

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: "SYSTEM INSTRUCTIONS (DO NOT REPLY TO THIS):\n" + systemPrompt }]
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I will act as the consultant, ask questions one by one if needed, and eventually wrap the final output in <FINAL_TEXT>...</FINAL_TEXT>." }]
                },
                ...history.slice(0, -1) // All but last
            ],
        });

        const lastMessage = history[history.length - 1];
        const result = await chat.sendMessage(lastMessage.parts);
        const response = result.response;
        return response.text().trim();
    } catch (error) {
        console.error("Error generating assistant chat response:", error);
        return "Hubo un error al procesar tu mensaje. Intenta nuevamente.";
    }
};
