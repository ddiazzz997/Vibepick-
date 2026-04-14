import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AdminDashboard from './components/AdminDashboard'
import Logo from './components/Logo'

// ── Contraseña de acceso admin ──────────────────────────
const ADMIN_PASSWORD = 'vibepick2026'
const SESSION_KEY = 'vp_admin_session'

function checkSession(): boolean {
    try {
        return sessionStorage.getItem(SESSION_KEY) === ADMIN_PASSWORD
    } catch { return false }
}

function saveSession() {
    try { sessionStorage.setItem(SESSION_KEY, ADMIN_PASSWORD) } catch { }
}

function clearSession() {
    try { sessionStorage.removeItem(SESSION_KEY) } catch { }
}

// ── Login Screen ─────────────────────────────────────────
function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
    const [pw, setPw] = useState('')
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [showPw, setShowPw] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setTimeout(() => {
            if (pw === ADMIN_PASSWORD) {
                saveSession()
                onSuccess()
            } else {
                setError(true)
                setLoading(false)
                setTimeout(() => setError(false), 1500)
            }
        }, 600)
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center relative overflow-hidden"
            style={{ background: '#050810', fontFamily: "'Inter', sans-serif" }}
        >
            {/* Ambient blobs */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    style={{
                        position: 'absolute', top: '-10%', left: '30%',
                        width: '500px', height: '500px',
                        background: 'radial-gradient(circle, rgba(0,102,255,0.12) 0%, transparent 70%)',
                        borderRadius: '50%', filter: 'blur(40px)',
                    }}
                />
                <div
                    style={{
                        position: 'absolute', bottom: '-10%', right: '20%',
                        width: '400px', height: '400px',
                        background: 'radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)',
                        borderRadius: '50%', filter: 'blur(40px)',
                    }}
                />
                {/* Grid overlay */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'linear-gradient(rgba(0,102,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,102,255,0.03) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                style={{
                    width: '100%', maxWidth: '400px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '24px',
                    padding: '40px 36px',
                    position: 'relative',
                    backdropFilter: 'blur(20px)',
                }}
            >
                {/* Glow top border */}
                <div style={{
                    position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                    width: '60%', height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(0,102,255,0.6), transparent)',
                }} />

                {/* Logo */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
                    <Logo className="h-10" />
                </div>

                {/* Title */}
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <h1 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px' }}>
                        Panel de Administración
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
                        Acceso restringido · Solo personal autorizado
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Password field */}
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            display: 'flex', alignItems: 'center',
                            background: 'rgba(255,255,255,0.04)',
                            border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'}`,
                            borderRadius: '12px',
                            padding: '0 16px',
                            transition: 'border-color 0.2s',
                        }}>
                            {/* Lock icon */}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            <input
                                type={showPw ? 'text' : 'password'}
                                value={pw}
                                onChange={e => setPw(e.target.value)}
                                placeholder="Contraseña de acceso"
                                autoFocus
                                id="admin-password"
                                style={{
                                    flex: 1, background: 'transparent', border: 'none', outline: 'none',
                                    color: 'white', fontSize: '0.9rem', padding: '14px 12px',
                                    fontFamily: 'inherit',
                                }}
                            />
                            {/* Toggle show */}
                            <button
                                type="button"
                                onClick={() => setShowPw(v => !v)}
                                style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: 'rgba(255,255,255,0.3)', padding: '4px',
                                    display: 'flex', alignItems: 'center',
                                }}
                            >
                                {showPw ? (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '6px', paddingLeft: '4px' }}
                                >
                                    Contraseña incorrecta
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Submit button */}
                    <motion.button
                        type="submit"
                        disabled={loading || !pw}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            width: '100%',
                            padding: '14px',
                            borderRadius: '12px',
                            border: 'none',
                            cursor: loading || !pw ? 'not-allowed' : 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            fontFamily: 'inherit',
                            color: 'white',
                            background: loading
                                ? 'rgba(0,102,255,0.4)'
                                : 'linear-gradient(135deg, #0066ff 0%, #0ea5e9 100%)',
                            opacity: !pw ? 0.5 : 1,
                            transition: 'opacity 0.2s, background 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                        }}
                    >
                        {loading ? (
                            <>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                                    style={{
                                        width: '16px', height: '16px',
                                        border: '2px solid rgba(255,255,255,0.3)',
                                        borderTopColor: 'white',
                                        borderRadius: '50%',
                                    }}
                                />
                                Verificando…
                            </>
                        ) : (
                            <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                    <polyline points="10 17 15 12 10 7" />
                                    <line x1="15" y1="12" x2="3" y2="12" />
                                </svg>
                                Ingresar al Panel
                            </>
                        )}
                    </motion.button>
                </form>

                {/* Footer note */}
                <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.7rem', textAlign: 'center', marginTop: '24px' }}>
                    La sesión se mantiene hasta cerrar el tab
                </p>
            </motion.div>
        </div>
    )
}

// ── AdminApp root ─────────────────────────────────────────
export default function AdminApp() {
    const [authed, setAuthed] = useState(checkSession)

    const handleLogout = () => {
        clearSession()
        setAuthed(false)
    }

    return (
        <AnimatePresence mode="wait">
            {!authed ? (
                <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <AdminLogin onSuccess={() => setAuthed(true)} />
                </motion.div>
            ) : (
                <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {/* Top bar with logo + logout */}
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0,
                        height: '60px',
                        background: 'rgba(5,8,16,0.95)',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0 24px',
                        zIndex: 100,
                        backdropFilter: 'blur(12px)',
                        fontFamily: "'Inter', sans-serif",
                    }}>
                        <Logo className="h-8" />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            {/* CRM badge */}
                            <span style={{
                                fontSize: '0.7rem', fontWeight: 700,
                                color: '#0ea5e9',
                                background: 'rgba(14,165,233,0.1)',
                                border: '1px solid rgba(14,165,233,0.2)',
                                padding: '4px 10px', borderRadius: '20px',
                                letterSpacing: '0.08em', textTransform: 'uppercase',
                            }}>
                                CRM · Admin
                            </span>
                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                style={{
                                    background: 'rgba(239,68,68,0.1)',
                                    border: '1px solid rgba(239,68,68,0.2)',
                                    color: '#f87171',
                                    padding: '6px 14px',
                                    borderRadius: '8px',
                                    fontSize: '0.78rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    fontFamily: 'inherit',
                                    transition: 'background 0.2s',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.2)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
                            >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                                Cerrar sesión
                            </button>
                        </div>
                    </div>
                    {/* Dashboard with top padding for navbar */}
                    <div style={{ paddingTop: '60px' }}>
                        <AdminDashboard />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
