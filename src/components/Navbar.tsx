import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from './Logo'
import { LangToggle, useLang } from '../lib/i18n'

interface NavbarProps {
    onCTAClick: () => void
    onLoginClick: () => void
    isLoggedIn: boolean
}

const navLinks = [
    { labelEs: 'Características', labelEn: 'Features', href: '#caracteristicas' },
    { labelEs: 'Cómo funciona', labelEn: 'How it works', href: '#como-funciona' },
    { labelEs: 'Precios', labelEn: 'Pricing', href: '#precios' },
    { labelEs: 'FAQ', labelEn: 'FAQ', href: '#faq' },
]

function scrollToSection(href: string) {
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
}

export default function Navbar({ onCTAClick, onLoginClick, isLoggedIn }: NavbarProps) {
    const { lang } = useLang()
    const isEs = lang === 'es'
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handler, { passive: true })
        return () => window.removeEventListener('scroll', handler)
    }, [])

    // Close mobile menu on resize
    useEffect(() => {
        const handler = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
        window.addEventListener('resize', handler)
        return () => window.removeEventListener('resize', handler)
    }, [])

    return (
        <>
            {/* Navbar */}
            <motion.nav
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                className="fixed top-0 left-0 right-0 z-[200] transition-all duration-300"
                style={{
                    background: scrolled
                        ? 'rgba(7, 10, 20, 0.92)'
                        : 'rgba(7, 10, 20, 0.6)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: scrolled
                        ? '1px solid rgba(0, 119, 255, 0.15)'
                        : '1px solid rgba(255,255,255,0.04)',
                    boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.4)' : 'none',
                }}
            >
                <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between gap-4">

                    {/* Left: Logo */}
                    <a
                        href="#caracteristicas"
                        onClick={(e) => { e.preventDefault(); scrollToSection('#caracteristicas') }}
                        className="flex items-center shrink-0 cursor-pointer"
                    >
                        <Logo className="h-8" />
                    </a>

                    {/* Center: Nav links (desktop) */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <button
                                key={link.href}
                                onClick={() => scrollToSection(link.href)}
                                className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white rounded-xl hover:bg-white/5 transition-all duration-200 cursor-pointer bg-transparent border-none"
                            >
                                {isEs ? link.labelEs : link.labelEn}
                            </button>
                        ))}
                    </div>

                    {/* Right: Lang + Auth + CTA */}
                    <div className="flex items-center gap-2">
                        {/* Lang toggle */}
                        <div className="hidden sm:block">
                            <LangToggle />
                        </div>

                        {/* Login button (desktop) */}
                        {!isLoggedIn && (
                            <button
                                onClick={onLoginClick}
                                className="hidden md:block px-4 py-2 text-sm font-medium text-white/70 hover:text-white rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-200 cursor-pointer bg-transparent"
                            >
                                {isEs ? 'Iniciar sesión' : 'Sign in'}
                            </button>
                        )}

                        {/* CTA button */}
                        <motion.button
                            onClick={onCTAClick}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            className="relative overflow-hidden px-4 py-2 sm:px-5 rounded-xl text-sm font-bold text-white cursor-pointer border-none shadow-[0_4px_20px_rgba(0,102,255,0.35)] transition-all duration-300"
                            style={{
                                background: 'linear-gradient(135deg, #0066ff 0%, #0ea5e9 100%)',
                            }}
                        >
                            <motion.div
                                className="absolute inset-0 bg-white/10"
                                initial={{ x: '-100%', skewX: -15 }}
                                whileHover={{ x: '200%' }}
                                transition={{ duration: 0.5 }}
                            />
                            <span className="relative z-10 flex items-center gap-1.5">
                                {isEs ? 'Crear mi sitio' : 'Build my site'}
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                                </svg>
                            </span>
                        </motion.button>

                        {/* Hamburger (mobile) */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer bg-transparent border-none"
                            aria-label="Menu"
                        >
                            <motion.span
                                animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                                className="block w-5 h-0.5 bg-white rounded-full"
                            />
                            <motion.span
                                animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                                className="block w-5 h-0.5 bg-white rounded-full"
                            />
                            <motion.span
                                animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                                className="block w-5 h-0.5 bg-white rounded-full"
                            />
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="md:hidden overflow-hidden border-t border-white/5"
                            style={{ background: 'rgba(7, 10, 20, 0.98)' }}
                        >
                            <div className="flex flex-col px-5 py-4 gap-1">
                                {navLinks.map((link) => (
                                    <button
                                        key={link.href}
                                        onClick={() => { scrollToSection(link.href); setMenuOpen(false) }}
                                        className="w-full text-left px-4 py-3 text-sm font-medium text-white/70 hover:text-white rounded-xl hover:bg-white/5 transition-all duration-200 cursor-pointer bg-transparent border-none"
                                    >
                                        {isEs ? link.labelEs : link.labelEn}
                                    </button>
                                ))}
                                <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/5">
                                    <LangToggle />
                                    {!isLoggedIn && (
                                        <button
                                            onClick={() => { onLoginClick(); setMenuOpen(false) }}
                                            className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white rounded-xl border border-white/10 hover:bg-white/5 transition-all duration-200 cursor-pointer bg-transparent"
                                        >
                                            {isEs ? 'Iniciar sesión' : 'Sign in'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* Spacer to prevent content from going under navbar */}
            <div className="h-16" />
        </>
    )
}
