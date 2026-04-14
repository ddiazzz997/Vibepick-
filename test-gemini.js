import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const MODELS = [
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash-8b",
    "gemini-1.5-pro",
    "gemini-1.0-pro",
];

async function test() {
    console.log("Testing key ending in...", process.env.VITE_GEMINI_API_KEY.slice(-5));
    const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

    for (const modelName of MODELS) {
        try {
            console.log(`\nTrying model: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hola");
            console.log(`✅ SUCCESS with ${modelName}:`, result.response.text().slice(0, 80));
            break;
        } catch (e) {
            console.log(`❌ FAILED ${modelName}: ${e.message.slice(0, 120)}`);
        }
    }
}
test();
