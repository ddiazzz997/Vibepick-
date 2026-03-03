import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../lib/i18n'

interface AuthModalProps {
    onSuccess: () => void
}

export default function AuthModal({ onSuccess }: AuthModalProps) {
    const { signUp, signIn, showAuth, setShowAuth } = useAuth()
    const { t } = useLang()

    const [mode, setMode] = useState<'register' | 'login'>('register')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    if (!showAuth) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        if (mode === 'register') {
            const res = await signUp(email, password, { first_name: firstName, last_name: lastName, phone })
            if (res.error) {
                setError(res.error)
                setLoading(false)
            } else {
                setSuccess(true)
                setTimeout(() => {
                    setShowAuth(false)
                    onSuccess()
                }, 2000)
            }
        } else {
            const res = await signIn(email, password)
            if (res.error) {
                setError(res.error)
                setLoading(false)
            } else {
                setShowAuth(false)
                onSuccess()
            }
        }
    }

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[200] flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* Overlay */}
                <motion.div
                    className="absolute inset-0 bg-black/70 backdrop-blur-md"
                    onClick={() => setShowAuth(false)}
                />

                {/* Card */}
                <motion.div
                    className="relative z-10 w-full max-w-md mx-4"
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                    <AnimatePresence mode="wait">
                        {success ? (
                            /* ── Success State ── */
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="relative rounded-2xl p-10 text-center overflow-hidden"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.15) 0%, rgba(0, 0, 0, 0.95) 100%)',
                                    border: '1px solid rgba(0, 102, 255, 0.3)',
                                    boxShadow: '0 0 60px rgba(0, 102, 255, 0.2)',
                                }}
                            >
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="text-6xl mb-4"
                                >
                                    🚀
                                </motion.div>
                                <h2 className="text-2xl font-bold text-white mb-2">{t.authSuccessTitle}</h2>
                                <p className="text-[var(--text-muted)] text-sm">{t.authSuccessSub}</p>

                                {/* Glow ring animation */}
                                <motion.div
                                    className="absolute inset-0 rounded-2xl pointer-events-none"
                                    style={{ border: '2px solid rgba(0, 102, 255, 0.5)' }}
                                    animate={{ boxShadow: ['0 0 20px rgba(0,102,255,0.3)', '0 0 60px rgba(0,102,255,0.5)', '0 0 20px rgba(0,102,255,0.3)'] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                            </motion.div>
                        ) : (
                            /* ── Form ── */
                            <motion.div
                                key="form"
                                className="rounded-2xl p-8 overflow-hidden"
                                style={{
                                    background: 'linear-gradient(180deg, rgba(10, 15, 30, 0.98) 0%, rgba(0, 0, 0, 0.98) 100%)',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 102, 255, 0.1)',
                                }}
                            >
                                {/* Tabs */}
                                <div className="flex rounded-xl overflow-hidden mb-6 border border-white/5">
                                    {(['register', 'login'] as const).map((m) => (
                                        <button
                                            key={m}
                                            onClick={() => { setMode(m); setError('') }}
                                            className={`flex-1 py-3 text-sm font-semibold transition-all duration-200 cursor-pointer border-none
                        ${mode === m
                                                    ? 'bg-[var(--accent)] text-white'
                                                    : 'bg-white/5 text-[var(--text-muted)] hover:text-white hover:bg-white/10'
                                                }`}
                                        >
                                            {m === 'register' ? t.authRegister : t.authLogin}
                                        </button>
                                    ))}
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <AnimatePresence mode="wait">
                                        {mode === 'register' && (
                                            <motion.div
                                                key="register-fields"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="space-y-4 overflow-hidden"
                                            >
                                                <div className="grid grid-cols-2 gap-3">
                                                    <input
                                                        type="text"
                                                        value={firstName}
                                                        onChange={(e) => setFirstName(e.target.value)}
                                                        placeholder={t.authFirstName}
                                                        required
                                                        className="input-glow text-sm"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={lastName}
                                                        onChange={(e) => setLastName(e.target.value)}
                                                        placeholder={t.authLastName}
                                                        required
                                                        className="input-glow text-sm"
                                                    />
                                                </div>
                                                <input
                                                    type="tel"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    placeholder={t.authPhone}
                                                    required
                                                    className="input-glow text-sm"
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={t.authEmail}
                                        required
                                        className="input-glow text-sm"
                                    />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder={t.authPassword}
                                        required
                                        minLength={6}
                                        className="input-glow text-sm"
                                    />

                                    {error && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-red-400 text-xs text-center bg-red-400/10 rounded-lg py-2 px-3"
                                        >
                                            {error}
                                        </motion.p>
                                    )}

                                    <motion.button
                                        type="submit"
                                        disabled={loading}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-3.5 rounded-xl bg-[var(--accent)] text-white font-bold text-sm
                      hover:brightness-110 transition-all duration-200 cursor-pointer border-none
                      shadow-[0_4px_24px_rgba(0,102,255,0.3)] hover:shadow-[0_6px_32px_rgba(0,102,255,0.5)]
                      disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                                    >
                                        {/* Light sweep */}
                                        <motion.div
                                            className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                                            animate={{ left: ['-100%', '200%'] }}
                                            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                                        />
                                        <span className="relative z-10">
                                            {loading ? '...' : mode === 'register' ? t.authRegisterBtn : t.authLoginBtn}
                                        </span>
                                    </motion.button>
                                </form>

                                {/* Bottom hint */}
                                <p className="text-center text-xs text-[var(--text-dim)] mt-5">
                                    {mode === 'register' ? t.authHaveAccount : t.authNoAccount}{' '}
                                    <button
                                        onClick={() => { setMode(mode === 'register' ? 'login' : 'register'); setError('') }}
                                        className="text-[var(--accent)] hover:underline cursor-pointer bg-transparent border-none font-medium"
                                    >
                                        {mode === 'register' ? t.authLogin : t.authRegister}
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
