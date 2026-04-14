import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { chatWithAssistant } from '../lib/gemini';
import { Loader2, Paperclip, Send, Check, X, User } from 'lucide-react';

interface AIFieldAssistantProps {
    fieldType: string;
    contextData: Record<string, string>;
    onSelect: (text: string) => void;
    language?: string;
}

type ChatMessage = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    imageBase64?: string;
    finalText?: string;
};

/* ─── Avatar del asistente IA ─── */
const AI_AVATAR_SRC = '/ai-avatar.jpeg';

export function AIFieldAssistant({ fieldType, contextData, onSelect, language = 'es' }: AIFieldAssistantProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [userMessage, setUserMessage] = useState('');
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
    const [userAvatar, setUserAvatar] = useState<string | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.user_metadata?.avatar_url) {
                setUserAvatar(user.user_metadata.avatar_url);
            } else if (user?.user_metadata?.picture) {
                setUserAvatar(user.user_metadata.picture);
            } else {
                const seed = user?.email || 'vibepick-founder';
                setUserAvatar(`https://api.dicebear.com/7.x/notionists/svg?seed=${seed}&backgroundColor=b6e3f4`);
            }
        };
        fetchUser();
    }, []);

    const suggestions = (() => {
        if (fieldType === 'sectionBuilder') {
            return language === 'es' ? [
                "Dime cuál es el nicho y te diré qué secciones necesitas primero.",
                "¿Qué estructura convierte mejor para un sitio SaaS tecnológico?",
                "Sugiere una estructura paso a paso para clínicas médicas.",
                "Estructura óptima para un entrenador personal."
            ] : [
                "Tell me the niche and I'll tell you which sections you need first.",
                "What structure converts best for a tech SaaS site?",
                "Suggest a step-by-step structure for medical clinics.",
                "Optimal structure for a personal trainer."
            ];
        }

        return language === 'es' ? [
            "Soy experto en Vibecoding y herramientas como Google Antigravity o Claude Code.",
            "Ayúdame a mejorar este contexto de mi empresa.",
            "Ayúdame a mejorar el prompt para mi página web.",
            "Ayúdame a estructurar un PRD."
        ] : [
            "Expert in Vibecoding and tools like Google Antigravity or Claude Code.",
            "Help me improve this business context.",
            "Help me improve my website prompt.",
            "Help me structure a PRD."
        ];
    })();

    const getInitialMessage = () => {
        if (language === 'es') {
            switch (fieldType) {
                case 'description':
                    return '¡Hola! Soy tu Ingeniero y Especialista en Marketing. Para construir la página web perfecta, empecemos por lo básico: ¿De qué trata tu negocio o qué es lo que vendes? (Puedes escribirlo o subir un documento/foto).';
                case 'brandVoice':
                    return '¡Hola! Soy tu Diseñador UI/UX. Para elegir la identidad visual correcta, dime: ¿qué estilo te imaginas o qué marcas te sirven de inspiración?';
                case 'offer':
                    return '¡Hola! Soy tu experto en Marketing (Hormozi). ¿Cuál es la oferta principal o la acción clave que quieres que tus clientes realicen aquí?';
                default: return '¡Hola! ¿En qué te puedo ayudar hoy?';
            }
        } else {
            switch (fieldType) {
                case 'description': return 'Hi! I am your Product Manager. To build the perfect website, let\'s start with the basics: What exactly do you sell or do?';
                case 'brandVoice': return 'Hi! I am your UI/UX Designer. What kind of visual style are you looking for?';
                case 'offer': return 'Hi! I am your Direct Response Marketer. What is the main offer or action you want users to take?';
                default: return 'Hello! How can I help you?';
            }
        }
    };

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const interval = setInterval(() => {
                setCurrentSuggestionIndex((prev) => (prev + 1) % suggestions.length);
            }, 8000);
            return () => clearInterval(interval);
        }
    }, [isOpen, messages.length]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setImageBase64(ev.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const parseFinalText = (text: string) => {
        const match = text.match(/<FINAL_TEXT>([\s\S]*?)<\/FINAL_TEXT>/);
        if (match && match[1]) {
            const beforeText = text.replace(/<FINAL_TEXT>[\s\S]*?<\/FINAL_TEXT>/, '').trim();
            return { conversational: beforeText, finalContent: match[1].trim() };
        }
        return { conversational: text, finalContent: null };
    };

    const handleSubmit = async () => {
        if (!userMessage.trim() && !imageBase64) return;

        const newUserMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: userMessage,
            imageBase64: imageBase64 || undefined
        };

        let newMessages = [...messages];
        if (messages.length === 0) {
            newMessages.push({
                id: Date.now().toString() + '-init',
                role: 'assistant',
                content: getInitialMessage()
            });
        }
        newMessages.push(newUserMsg);
        setMessages(newMessages);
        setUserMessage('');
        setImageBase64(null);
        setLoading(true);

        try {
            const history = newMessages.map(msg => {
                const parts: any[] = [{ text: msg.content }];
                if (msg.imageBase64) {
                    const mimeType = msg.imageBase64.match(/:(.*?);/)?.[1] || 'image/jpeg';
                    const base64Data = msg.imageBase64.split(',')[1];
                    if (base64Data) {
                        parts.push({ inlineData: { data: base64Data, mimeType } });
                    }
                }
                return { role: msg.role === 'user' ? 'user' : 'model', parts };
            });

            const result = await chatWithAssistant(fieldType, history as any, contextData, language);
            const { conversational, finalContent } = parseFinalText(result);

            if (finalContent) {
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    role: 'assistant',
                    content: conversational || '¡Todo listo!',
                    finalText: finalContent
                }]);
            } else {
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    role: 'assistant',
                    content: result
                }]);
            }
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                content: language === 'es' ? 'Hubo un error de conexión con la IA. ¿Podemos intentarlo de nuevo?' : 'Connection error. Can we try again?'
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <>
            {/* ─── Keyframes inyectados inline ─── */}
            <style>{`
                @keyframes orbit-spin {
                    0%   { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes orbit-spin-reverse {
                    0%   { transform: rotate(0deg); }
                    100% { transform: rotate(-360deg); }
                }
                @keyframes avatar-pulse-glow {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(0,119,255,0.5), 0 0 20px rgba(0,119,255,0.3); }
                    50%      { box-shadow: 0 0 0 6px rgba(0,119,255,0), 0 0 35px rgba(0,119,255,0.5); }
                }
                @keyframes galaxy-shift {
                    0%   { background-position: 0% 50%; }
                    50%  { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes badge-float {
                    0%, 100% { transform: translateY(0px); }
                    50%      { transform: translateY(-2px); }
                }
                @keyframes float-medium {
                    0%, 100% { transform: translateY(0px); }
                    50%      { transform: translateY(-5px); }
                }
                .orbit-ring-1 {
                    animation: orbit-spin 4s linear infinite;
                }
                .orbit-ring-2 {
                    animation: orbit-spin-reverse 6s linear infinite;
                }
                .ai-avatar-glow {
                    animation: avatar-pulse-glow 2.5s ease-in-out infinite;
                }
                .atmosphere-bg {
                    background-color: #03060c;
                    background-image: 
                      radial-gradient(150% 90% at 50% 110%, rgba(0,119,255,0.25) 0%, rgba(0,68,255,0.08) 45%, transparent 100%),
                      radial-gradient(80% 50% at 50% 0%, rgba(255,255,255,0.02) 0%, transparent 100%);
                }
                .trigger-badge {
                    animation: badge-float 3s ease-in-out infinite;
                }
                .float-medium {
                    animation: float-medium 4s ease-in-out infinite;
                }
            `}</style>

            <div className="mt-2 flex flex-col items-start w-full">
                {!isOpen ? (
                    /* ─── TRIGGER BUTTON — estilo Minimalista Daniel AI ─── */
                    <button
                        onClick={(e) => { e.preventDefault(); setIsOpen(true); }}
                        className="trigger-badge group flex items-center gap-3 px-4 py-2 rounded-full bg-[#02050A] border-[1.5px] border-blue-500/40 hover:border-blue-400/80 transition-all duration-300 shadow-[0_4px_20px_rgba(0,119,255,0.15)] hover:shadow-[0_6px_25px_rgba(0,119,255,0.3)] focus:outline-none"
                        title={language === 'es' ? 'Pregúntale a Daniel AI' : 'Ask Daniel AI'}
                    >
                        {/* Avatar con Orbitador Cometa (Idéntico al chat interior) */}
                        <div className="relative flex-shrink-0 w-8 h-8">
                            {/* Trazador orbital idéntico al modal */}
                            <div className="absolute inset-[-3px] rounded-full animate-[orbit-spin_4s_linear_infinite]">
                                <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-blue-300 rounded-full shadow-[0_0_8px_1.5px_rgba(0,136,255,0.8)] -translate-x-1/2 -mt-[0.5px]" />
                            </div>

                            {/* Fondo oscurecido con borde */}
                            <div className="absolute inset-[-6px] rounded-full border border-blue-400/5 group-hover:border-blue-400/10 transition-colors" />

                            <img
                                src={AI_AVATAR_SRC}
                                alt="Daniel AI"
                                className="w-full h-full rounded-full object-cover object-top border-2 border-[#02050A] relative z-10"
                            />
                            {/* Dot online */}
                            <span className="absolute bottom-0 xl:bottom-[-2px] right-0 xl:right-[-2px] w-2.5 h-2.5 bg-blue-400 rounded-full border-[1.5px] border-[#02050A] shadow-[0_0_6px_rgba(0,136,255,0.8)] z-20" />
                        </div>

                        {/* Texto Minimalista */}
                        <span className="text-[13px] font-bold tracking-wide text-slate-200 group-hover:text-white transition-colors">
                            Daniel AI
                        </span>
                    </button>
                ) : (
                    /* ─── CHAT MODAL ─── */
                    <div className="w-full mt-2 rounded-2xl shadow-2xl shadow-blue-500/10 flex flex-col relative overflow-hidden z-10 border border-blue-600/25 atmosphere-bg">

                        {/* ──── HEADER MINIMALISTA ──── */}
                        <div className="flex items-center justify-between px-4 py-3.5 relative z-10 bg-[#02050A] border-b border-white/5 shadow-md">
                            <div className="flex items-center gap-3">
                                {/* Avatar pequeño en header */}
                                <div className="relative flex-shrink-0 w-8 h-8">
                                    <img
                                        src={AI_AVATAR_SRC}
                                        alt="Daniel AI"
                                        className="w-full h-full rounded-full object-cover object-top border border-blue-500/30"
                                    />
                                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-blue-400 rounded-full border border-black shadow-[0_0_5px_rgba(0,136,255,1)] z-10" />
                                </div>

                                <div className="flex flex-col leading-tight">
                                    <span className="text-[13.5px] font-semibold text-white/90 tracking-normal">
                                        {language === 'es' ? 'Pregúntale a Daniel AI' : 'Ask Daniel AI'}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => { setIsOpen(false); }}
                                className="text-blue-300/50 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-blue-500/20"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* ──── MENSAJES ──── */}
                        <div
                            ref={chatContainerRef}
                            className="flex flex-col gap-4 p-4 max-h-[350px] min-h-[250px] overflow-y-auto custom-scrollbar"
                            style={{ background: 'transparent' }}
                        >
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full py-6 animate-in fade-in duration-500 relative z-10">

                                    {/* Avatar Grande Animado */}
                                    <div className="relative flex-shrink-0 w-24 h-24 mb-6">
                                        {/* Trazador muy sutil y lento */}
                                        <div className="absolute inset-[-4px] rounded-full animate-[orbit-spin_6s_linear_infinite]">
                                            <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-blue-300 rounded-full shadow-[0_0_10px_2px_rgba(0,136,255,0.8)] -translate-x-1/2" />
                                        </div>

                                        <div className="absolute inset-[-12px] rounded-full border border-blue-400/5" />

                                        <img
                                            src={AI_AVATAR_SRC}
                                            alt="Daniel AI"
                                            className="w-full h-full rounded-full object-cover object-top border-4 border-[#02050A] shadow-[0_0_30px_rgba(0,119,255,0.4)] relative z-10"
                                        />
                                    </div>

                                    {/* Títulos y Sugerencias */}
                                    {fieldType === 'sectionBuilder' ? (
                                        <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 text-center tracking-tight drop-shadow-sm transition-all">
                                            {language === 'es' ? '¿Qué estructura ' : 'What structure '}
                                            <span className="text-blue-500 drop-shadow-[0_0_12px_rgba(0,119,255,0.5)]">
                                                {language === 'es' ? 'armamos hoy?' : 'are we building?'}
                                            </span>
                                        </h3>
                                    ) : (
                                        <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 text-center tracking-tight drop-shadow-sm transition-all">
                                            {language === 'es' ? '¿En qué puedo ' : 'How can I '}
                                            <span className="text-blue-500 drop-shadow-[0_0_12px_rgba(0,119,255,0.5)]">
                                                {language === 'es' ? 'ayudarle?' : 'help you?'}
                                            </span>
                                        </h3>
                                    )}

                                    <div className="h-10 flex items-center justify-center text-center px-4">
                                        <p key={currentSuggestionIndex} className="text-[13px] text-slate-400 font-medium transition-opacity duration-500">
                                            {suggestions[currentSuggestionIndex]}
                                        </p>
                                    </div>

                                    {/* Botones de preguntas (Pills) */}
                                    {fieldType === 'sectionBuilder' ? (
                                        <div className="flex flex-wrap justify-center gap-3 mt-5 max-w-[95%] float-medium" style={{ animationDelay: '0.4s' }}>
                                            <button onClick={() => setUserMessage(language === 'es' ? '¿Cuál es la mejor estructura para un SaaS?' : 'Best structure for SaaS?')} className="px-4 py-2 rounded-full border border-blue-500/20 bg-white/5 backdrop-blur-md text-xs font-medium text-blue-200 hover:bg-blue-500/15 hover:border-blue-400/50 hover:shadow-[0_0_15px_rgba(0,119,255,0.2)] transition-all">
                                                {language === 'es' ? 'Estructura SaaS' : 'SaaS Structure'}
                                            </button>
                                            <button onClick={() => setUserMessage(language === 'es' ? 'Dime el orden ideal de secciones para un restaurante.' : 'Ideal section order for a restaurant.')} className="px-4 py-2 rounded-full border border-blue-500/20 bg-white/5 backdrop-blur-md text-xs font-medium text-blue-200 hover:bg-blue-500/15 hover:border-blue-400/50 hover:shadow-[0_0_15px_rgba(0,119,255,0.2)] transition-all">
                                                {language === 'es' ? 'Orden para Restaurante' : 'Restaurant Layout'}
                                            </button>
                                            <button onClick={() => setUserMessage(language === 'es' ? 'Recomiéndame partes clave para una Inmobiliaria' : 'Key sections for Real Estate')} className="px-4 py-2 rounded-full border border-blue-500/20 bg-white/5 backdrop-blur-md text-xs font-medium text-blue-200 hover:bg-blue-500/15 hover:border-blue-400/50 hover:shadow-[0_0_15px_rgba(0,119,255,0.2)] transition-all">
                                                {language === 'es' ? 'Para Inmobiliarias' : 'For Real Estate'}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap justify-center gap-3 mt-5 max-w-[95%] float-medium" style={{ animationDelay: '0.4s' }}>
                                            <button onClick={() => setUserMessage(language === 'es' ? '¿Cómo consigo mi primer cliente?' : 'How do I get my first client?')} className="px-4 py-2 rounded-full border border-blue-500/20 bg-white/5 backdrop-blur-md text-xs font-medium text-blue-200 hover:bg-blue-500/15 hover:border-blue-400/50 hover:shadow-[0_0_15px_rgba(0,119,255,0.2)] transition-all">
                                                {language === 'es' ? '¿Cómo consigo mi primer cliente?' : 'Get my first client'}
                                            </button>
                                            <button onClick={() => setUserMessage(language === 'es' ? 'Ayúdame a mejorar el prompt para mi página web' : 'Help me improve the prompt for my website')} className="px-4 py-2 rounded-full border border-blue-500/20 bg-white/5 backdrop-blur-md text-xs font-medium text-blue-200 hover:bg-blue-500/15 hover:border-blue-400/50 hover:shadow-[0_0_15px_rgba(0,119,255,0.2)] transition-all">
                                                {language === 'es' ? 'Mejorar mi prompt' : 'Improve my prompt'}
                                            </button>
                                            <button onClick={() => setUserMessage(language === 'es' ? 'Ayúdame a estructurar un PRD' : 'Help me structure a PRD')} className="px-4 py-2 rounded-full border border-blue-500/20 bg-white/5 backdrop-blur-md text-xs font-medium text-blue-200 hover:bg-blue-500/15 hover:border-blue-400/50 hover:shadow-[0_0_15px_rgba(0,119,255,0.2)] transition-all">
                                                {language === 'es' ? 'Estructurar un PRD' : 'Structure a PRD'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                                        {/* Avatar por mensaje */}
                                        <div className="flex-shrink-0">
                                            {msg.role === 'user' ? (
                                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 border border-slate-700 shadow-[0_0_8px_rgba(255,255,255,0.05)] overflow-hidden">
                                                    {userAvatar ? (
                                                        <img src={userAvatar} alt="Tú" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User size={14} />
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="relative w-8 h-8 flex-shrink-0 mt-1">
                                                    <div className="absolute inset-[-3px] rounded-full animate-[orbit-spin_4s_linear_infinite]">
                                                        <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-blue-300 rounded-full shadow-[0_0_8px_1.5px_rgba(0,136,255,0.8)] -translate-x-1/2 -mt-[0.5px]" />
                                                    </div>
                                                    <div className="absolute inset-[-5px] rounded-full border border-blue-400/10" />
                                                    <img
                                                        src={AI_AVATAR_SRC}
                                                        alt="AI"
                                                        className="w-full h-full rounded-full object-cover object-top border-2 border-[#02050A] relative z-10"
                                                    />
                                                    <span className="absolute bottom-[-2px] right-[-2px] w-2.5 h-2.5 bg-blue-400 rounded-full border-[1.5px] border-[#02050A] shadow-[0_0_5px_rgba(0,136,255,1)] z-20" />
                                                </div>
                                            )}
                                        </div>

                                        <div className={`flex flex-col gap-2 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                            <div className={`p-3 rounded-2xl text-[13px] leading-relaxed ${msg.role === 'user'
                                                ? 'bg-slate-800 text-slate-200 rounded-tr-none border border-slate-700/50'
                                                : 'bg-[#071020] border border-blue-600/20 text-slate-300 rounded-tl-none shadow-[0_0_15px_rgba(0,119,255,0.05)]'
                                                }`}>
                                                <p className="whitespace-pre-wrap">{msg.content}</p>
                                                {msg.imageBase64 && (
                                                    <img src={msg.imageBase64} alt="User upload" className="mt-2 rounded-lg max-w-[150px] border border-slate-700" />
                                                )}
                                            </div>

                                            {/* Bloque de texto final generado */}
                                            {msg.finalText && (
                                                <div className="w-full mt-1 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex flex-col gap-3 shadow-[0_0_20px_rgba(0,119,255,0.08)]">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Check size={14} className="text-green-400" />
                                                        <span className="text-xs font-semibold text-green-400">Estructura Generada con Éxito</span>
                                                    </div>
                                                    <div className="text-xs text-slate-300 whitespace-pre-wrap max-h-[150px] overflow-y-auto custom-scrollbar p-2 bg-black/40 rounded-lg border border-slate-800">
                                                        {msg.finalText}
                                                    </div>
                                                    <button
                                                        onClick={() => { onSelect(msg.finalText!); setIsOpen(false); }}
                                                        className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg transition-colors text-[13px] shadow-lg shadow-blue-500/25"
                                                    >
                                                        <Check size={16} />
                                                        {language === 'es' ? 'Aplicar al formulario' : 'Apply to form'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                            {/* Loading */}
                            {loading && (
                                <div className="flex flex-row gap-3">
                                    <div className="relative w-8 h-8 flex-shrink-0 mt-1">
                                        <div className="absolute inset-[-3px] rounded-full animate-[orbit-spin_4s_linear_infinite]">
                                            <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-blue-300 rounded-full shadow-[0_0_8px_1.5px_rgba(0,136,255,0.8)] -translate-x-1/2 -mt-[0.5px]" />
                                        </div>
                                        <div className="absolute inset-[-5px] rounded-full border border-blue-400/10" />
                                        <img
                                            src={AI_AVATAR_SRC}
                                            alt="AI"
                                            className="w-full h-full rounded-full object-cover object-top border-2 border-[#02050A] relative z-10"
                                        />
                                        <span className="absolute bottom-[-2px] right-[-2px] w-2.5 h-2.5 bg-blue-400 rounded-full border-[1.5px] border-[#02050A] shadow-[0_0_5px_rgba(0,136,255,1)] z-20" />
                                    </div>
                                    <div className="p-3 bg-[#071020] border border-blue-600/20 rounded-2xl rounded-tl-none flex items-center gap-2">
                                        <Loader2 className="animate-spin text-blue-400" size={14} />
                                        <span className="text-xs text-slate-400">{language === 'es' ? 'Analizando...' : 'Analyzing...'}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ──── INPUT (Horizonte Atmosférico) ──── */}
                        <div className="relative pt-8 pb-3 px-3 mt-max overflow-visible z-10" style={{ borderTop: 'none', background: 'transparent' }}>
                            {/* Globo curvo */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[250px] rounded-[50%_50%_0_0] border-t-[2.5px] border-white/70 bg-[#040914] shadow-[0_-15px_60px_rgba(0,119,255,0.3)] pointer-events-none" />
                            {imageBase64 && (
                                <div className="relative inline-block mb-3 w-16 h-16 rounded-lg overflow-hidden border border-blue-500/50 shadow-lg">
                                    <img src={imageBase64} alt="Upload preview" className="object-cover w-full h-full" />
                                    <button
                                        onClick={() => setImageBase64(null)}
                                        className="absolute top-1 right-1 bg-black/80 text-white p-0.5 rounded-full hover:bg-red-500 transition-colors"
                                    >
                                        <X size={10} />
                                    </button>
                                </div>
                            )}

                            <div className="relative flex items-end gap-2 bg-[#0a1220] rounded-xl border border-blue-600/20 focus-within:border-blue-500/50 focus-within:shadow-[0_0_15px_rgba(0,119,255,0.1)] transition-all p-1 pl-3">
                                <textarea
                                    value={userMessage}
                                    onChange={(e) => setUserMessage(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={language === 'es' ? 'Responde aquí...' : 'Reply here...'}
                                    className="w-full bg-transparent text-[13px] text-white py-2.5 outline-none resize-none max-h-[100px] min-h-[40px] custom-scrollbar placeholder-slate-600"
                                    rows={1}
                                />

                                <div className="flex items-center gap-1 pb-1 pr-1">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-2 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                        title="Adjuntar Doc/Imagen"
                                    >
                                        <Paperclip size={16} />
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />

                                    <button
                                        onClick={handleSubmit}
                                        disabled={(!userMessage.trim() && !imageBase64) || loading}
                                        className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-blue-500/25"
                                    >
                                        <Send size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-2 text-center text-[10px] text-slate-600">
                                Presiona Enter para enviar · Shift + Enter para salto de línea
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
