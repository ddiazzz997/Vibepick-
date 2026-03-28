import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatWithAssistant } from '../lib/gemini';
import { Sparkles, Loader2, Paperclip, Send, Check, X, User, Bot } from 'lucide-react';

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

export function AIFieldAssistant({ fieldType, contextData, onSelect, language = 'es' }: AIFieldAssistantProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [userMessage, setUserMessage] = useState('');
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getRoleLabel = () => {
        switch (fieldType) {
            case 'description': return 'Software Engineer & Product Manager';
            case 'brandVoice': return 'Sr. UI/UX Designer';
            case 'offer': return 'Direct Response Marketer (Hormozi)';
            default: return 'Experto IA';
        }
    };

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
            setMessages([{
                id: Date.now().toString(),
                role: 'assistant',
                content: getInitialMessage()
            }]);
        }
    }, [isOpen]);

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

        const newMessages = [...messages, newUserMsg];
        setMessages(newMessages);
        setUserMessage('');
        setImageBase64(null);
        setLoading(true);

        try {
            // Format history for Gemini API
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
        <div className="mt-2 flex flex-col items-start w-full">
            {!isOpen ? (
                <button
                    onClick={(e) => { e.preventDefault(); setIsOpen(true); }}
                    className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 hover:bg-fuchsia-500/30 hover:border-fuchsia-400 transition-all shadow-[0_0_10px_rgba(217,70,239,0.15)] focus:outline-none"
                >
                    <Sparkles size={14} className="animate-pulse" />
                    {language === 'es' ? 'Consultoría con Experto IA' : 'Consult AI Expert'}
                </button>
            ) : (
                <div className="w-full mt-2 bg-[#0a0f1a] border border-fuchsia-500/30 rounded-xl shadow-2xl flex flex-col relative overflow-hidden z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between p-3 border-b border-fuchsia-500/20 bg-fuchsia-950/20">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-fuchsia-500/20">
                                <Sparkles size={12} className="text-white" />
                            </div>
                            <span className="text-xs uppercase font-bold tracking-wider text-fuchsia-400">
                                {getRoleLabel()}
                            </span>
                        </div>
                        <button onClick={() => { setIsOpen(false); }} className="text-slate-500 hover:text-slate-200 transition-colors p-1">
                            <X size={16} />
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div
                        ref={chatContainerRef}
                        className="flex flex-col gap-4 p-4 max-h-[350px] overflow-y-auto custom-scrollbar bg-black/40"
                    >
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-slate-800 text-slate-300' : 'bg-fuchsia-900/50 text-fuchsia-400 border border-fuchsia-500/30'}`}>
                                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                                </div>

                                <div className={`flex flex-col gap-2 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`p-3 rounded-2xl text-[13px] leading-relaxed ${msg.role === 'user' ? 'bg-slate-800 text-slate-200 rounded-tr-none' : 'bg-[#121826] border border-fuchsia-500/10 text-slate-300 rounded-tl-none'}`}>
                                        <p className="whitespace-pre-wrap">{msg.content}</p>
                                        {msg.imageBase64 && (
                                            <img src={msg.imageBase64} alt="User upload" className="mt-2 rounded-lg max-w-[150px] border border-slate-700" />
                                        )}
                                    </div>

                                    {/* Final Text Block Action */}
                                    {msg.finalText && (
                                        <div className="w-full mt-1 bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-xl p-4 flex flex-col gap-3 shadow-[0_0_15px_rgba(217,70,239,0.05)]">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Check size={14} className="text-green-400" />
                                                <span className="text-xs font-semibold text-green-400">Estructura Generada con Éxito</span>
                                            </div>
                                            <div className="text-xs text-slate-300 whitespace-pre-wrap max-h-[150px] overflow-y-auto custom-scrollbar p-2 bg-black/40 rounded-lg border border-slate-800">
                                                {msg.finalText}
                                            </div>
                                            <button
                                                onClick={() => { onSelect(msg.finalText!); setIsOpen(false); }}
                                                className="w-full flex justify-center items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-medium px-4 py-2 rounded-lg transition-colors text-[13px] shadow-lg shadow-green-500/20"
                                            >
                                                <Check size={16} />
                                                {language === 'es' ? 'Aplicar al formulario' : 'Apply to form'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div >
                        ))
                        }

                        {
                            loading && (
                                <div className="flex flex-row gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-fuchsia-900/50 text-fuchsia-400 border border-fuchsia-500/30 flex items-center justify-center">
                                        <Bot size={14} />
                                    </div>
                                    <div className="p-3 bg-[#121826] border border-fuchsia-500/10 rounded-2xl rounded-tl-none flex items-center gap-2">
                                        <Loader2 className="animate-spin text-fuchsia-400" size={14} />
                                        <span className="text-xs text-slate-400">Analizando...</span>
                                    </div>
                                </div>
                            )
                        }
                    </div >

                    {/* Input Area */}
                    < div className="p-3 bg-[#0a0f1a] border-t border-fuchsia-500/20" >
                        {imageBase64 && (
                            <div className="relative inline-block mb-3 w-16 h-16 rounded-lg overflow-hidden border border-fuchsia-500/50 shadow-lg">
                                <img src={imageBase64} alt="Upload preview" className="object-cover w-full h-full" />
                                <button
                                    onClick={() => setImageBase64(null)}
                                    className="absolute top-1 right-1 bg-black/80 text-white p-0.5 rounded-full hover:bg-red-500 transition-colors"
                                >
                                    <X size={10} />
                                </button>
                            </div>
                        )}

                        <div className="relative flex items-end gap-2 bg-[#121826] rounded-xl border border-slate-800 focus-within:border-fuchsia-500/50 transition-colors p-1 pl-3">
                            <textarea
                                value={userMessage}
                                onChange={(e) => setUserMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={language === 'es' ? 'Responde aquí...' : 'Reply here...'}
                                className="w-full bg-transparent text-[13px] text-white py-2.5 outline-none resize-none max-h-[100px] min-h-[40px] custom-scrollbar"
                                rows={1}
                            />

                            <div className="flex items-center gap-1 pb-1 pr-1">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-2 text-slate-400 hover:text-fuchsia-400 hover:bg-fuchsia-500/10 rounded-lg transition-colors"
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
                                    disabled={!userMessage.trim() && !imageBase64 || loading}
                                    className="p-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-fuchsia-500/20"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="mt-2 text-center text-[10px] text-slate-500">
                            Presiona Enter para enviar. Shift + Enter para salto de línea.
                        </div>
                    </div >
                </div >
            )}
        </div >
    );
}
