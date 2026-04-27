/// <reference types="vite/client" />
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Turnstile } from '@marsidev/react-turnstile'
import { useAuth } from '../context/AuthContext'

const TURNSTILE_SITE_KEY = import.meta.env.DEV
    ? '1x00000000000000000000AA'
    : (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined)

// Only enforce CAPTCHA when a real Cloudflare Turnstile key is configured
const TURNSTILE_ENABLED = !!TURNSTILE_SITE_KEY && TURNSTILE_SITE_KEY !== 'your_turnstile_site_key_here'

interface AuthModalProps { onSuccess: () => void }

export default function AuthModal({ onSuccess }: AuthModalProps) {
    const { signUp, signIn, showAuth, setShowAuth } = useAuth()

    const [mode, setMode] = useState<'register' | 'login'>('register')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null)

    if (!showAuth) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            if (mode === 'register') {
                const res = await signUp(email, password, { first_name: firstName, last_name: lastName, phone })
                if (res.error) { setError(res.error); setLoading(false) }
                else { setSuccess(true); setTimeout(() => { setShowAuth(false); onSuccess() }, 1800) }
            } else {
                const res = await signIn(email, password)
                if (res.error) { setError(res.error); setLoading(false) }
                else { setLoading(false); setShowAuth(false); onSuccess() }
            }
        } catch {
            setError('Error inesperado. Verifica tu conexión e intenta de nuevo.')
            setLoading(false)
        }
    }

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[200] flex items-center justify-center"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
                <motion.div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAuth(false)} />

                <motion.div
                    className="relative z-10 w-full max-w-md mx-4"
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                    <AnimatePresence mode="wait">
                        {success ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                                className="relative rounded-2xl p-10 text-center overflow-hidden backdrop-blur-xl"
                                style={{ background: 'linear-gradient(135deg,rgba(0,102,255,.15),rgba(0,0,0,.6))', border: '1px solid rgba(0,102,255,.3)', boxShadow: '0 0 60px rgba(0,102,255,.2)' }}
                            >
                                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [.5, 1, .5] }} transition={{ duration: 2, repeat: Infinity }} className="text-6xl mb-4">🚀</motion.div>
                                <h2 className="text-2xl font-bold text-white mb-2">¡Bienvenido a bordo!</h2>
                                <p className="text-white/60 text-sm">Tu cuenta ha sido creada. Redirigiendo…</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="form"
                                className="rounded-2xl p-8 overflow-hidden backdrop-blur-md border border-[var(--accent)]/30"
                                style={{ background: 'linear-gradient(180deg, rgba(10,15,30,0.2), rgba(0,0,0,0.4))' }}
                                animate={{
                                    boxShadow: [
                                        '0 25px 60px rgba(0,0,0,0.5), 0 0 15px rgba(0,102,255,0.1)',
                                        '0 25px 60px rgba(0,0,0,0.5), 0 0 45px rgba(0,102,255,0.4)',
                                        '0 25px 60px rgba(0,0,0,0.5), 0 0 15px rgba(0,102,255,0.1)'
                                    ]
                                }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            >
                                {/* Tabs */}
                                <div className="flex rounded-xl overflow-hidden mb-6 border border-white/5">
                                    {(['register', 'login'] as const).map((m) => (
                                        <button key={m} onClick={() => { setMode(m); setError(''); setTurnstileToken(null) }}
                                            className={`flex-1 py-3 text-sm font-semibold transition-all duration-200 cursor-pointer border-none
                        ${mode === m ? 'bg-[var(--accent)] text-white' : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'}`}
                                        >
                                            {m === 'register' ? 'Crear cuenta' : 'Iniciar sesión'}
                                        </button>
                                    ))}
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <AnimatePresence mode="wait">
                                        {mode === 'register' && (
                                            <motion.div key="reg-fields"
                                                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                                className="space-y-4 overflow-hidden"
                                            >
                                                <div className="grid grid-cols-2 gap-3">
                                                    <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
                                                        placeholder="Nombre" required className="input-glow text-sm" />
                                                    <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                                                        placeholder="Apellido" required className="input-glow text-sm" />
                                                </div>
                                                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                                                    placeholder="Teléfono (WhatsApp)" required className="input-glow text-sm" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                                        placeholder="Correo electrónico" required className="input-glow text-sm" />

                                    <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                                        placeholder="Contraseña (mín. 6 caracteres)" required minLength={6}
                                        className="input-glow text-sm" />

                                    {mode === 'login' && (
                                        <p className="text-xs text-white/40 text-center">
                                            Ingresa el correo y contraseña con los que te registraste
                                        </p>
                                    )}

                                    {error && (
                                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                                            className="rounded-lg py-2 px-3 bg-red-400/10 flex items-center justify-between gap-2"
                                        >
                                            <p className="text-red-400 text-xs">{error}</p>
                                            {(error.includes('tardando') || error.includes('tardó') || error.includes('conexión') || error.includes('internet') || error.includes('sesión')) && (
                                                <button type="button" onClick={() => { setError(''); setLoading(false) }}
                                                    className="text-[10px] font-semibold text-red-300 underline cursor-pointer bg-transparent border-none shrink-0">
                                                    Reintentar
                                                </button>
                                            )}
                                        </motion.div>
                                    )}

                                    {mode === 'register' && TURNSTILE_ENABLED && (
                                        <Turnstile
                                            siteKey={TURNSTILE_SITE_KEY!}
                                            onSuccess={(token) => setTurnstileToken(token)}
                                            onError={() => setTurnstileToken(null)}
                                            onExpire={() => setTurnstileToken(null)}
                                            options={{ theme: 'dark', size: 'flexible' }}
                                        />
                                    )}

                                    <motion.button type="submit" disabled={loading || (mode === 'register' && TURNSTILE_ENABLED && !turnstileToken)}
                                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                        className="w-full py-3.5 rounded-xl bg-[var(--accent)] text-white font-bold text-sm
                      hover:brightness-110 transition-all duration-200 cursor-pointer border-none
                      shadow-[0_4px_24px_rgba(0,102,255,.3)] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                                    >
                                        <motion.div className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                                            animate={{ left: ['-100%', '200%'] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }} />
                                        <span className="relative z-10">
                                            {loading
                                                ? (mode === 'register' ? 'Creando tu cuenta…' : 'Entrando…')
                                                : mode === 'register' ? 'Crear mi cuenta gratis' : 'Entrar'}
                                        </span>
                                    </motion.button>

                                    {loading && mode === 'register' && (
                                        <p className="text-center text-xs text-white/40 mt-1">
                                            Esto puede tardar hasta 30 segundos en redes lentas
                                        </p>
                                    )}
                                </form>

                                <p className="text-center text-xs text-white/30 mt-5">
                                    {mode === 'register' ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
                                    <button onClick={() => { setMode(mode === 'register' ? 'login' : 'register'); setError(''); setTurnstileToken(null) }}
                                        className="text-[var(--accent)] hover:underline cursor-pointer bg-transparent border-none font-medium"
                                    >
                                        {mode === 'register' ? 'Inicia sesión' : 'Regístrate'}
                                    </button>
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
