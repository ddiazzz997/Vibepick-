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
  { labelEs: 'Características', labelEn: 'Features', href: '#caracteristicas', id: 'caracteristicas' },
  { labelEs: 'Cómo funciona', labelEn: 'How it works', href: '#como-funciona', id: 'como-funciona' },
  { labelEs: 'Precios', labelEn: 'Pricing', href: '#precios', id: 'precios' },
  { labelEs: 'FAQ', labelEn: 'FAQ', href: '#faq', id: 'faq' },
]

function scrollToSection(href: string) {
  const id = href.replace('#', '')
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } else {
    // Section may not have the id yet — graceful fallback
    window.location.hash = href
  }
}

export default function Navbar({ onCTAClick, onLoginClick, isLoggedIn }: NavbarProps) {
  const { lang } = useLang()
  const isEs = lang === 'es'
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')

  // Scroll detection
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

  // Active section via IntersectionObserver
  useEffect(() => {
    const sectionIds = navLinks.map((l) => l.id)
    const observers: IntersectionObserver[] = []

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id)
        },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed top-0 left-0 right-0 z-[200] transition-all duration-300"
        style={{
          background: scrolled
            ? 'rgba(5, 2, 12, 0.94)'
            : 'rgba(5, 2, 12, 0.55)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: scrolled
            ? '1px solid rgba(0, 102, 255, 0.12)'
            : '1px solid rgba(255,255,255,0.04)',
          boxShadow: scrolled
            ? '0 4px 30px rgba(0,0,0,0.5), 0 1px 0 rgba(0,102,255,0.08)'
            : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <a
            href="#caracteristicas"
            onClick={(e) => { e.preventDefault(); scrollToSection('#caracteristicas') }}
            className="flex items-center shrink-0 cursor-pointer"
          >
            <Logo className="h-8" />
          </a>

          {/* Nav links — desktop */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id
              return (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer bg-transparent border-none"
                  style={{
                    color: isActive ? '#ffffff' : 'rgba(255,255,255,0.5)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive)(e.currentTarget.style.color = 'rgba(255,255,255,0.85)')
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)(e.currentTarget.style.color = 'rgba(255,255,255,0.5)')
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  {isEs ? link.labelEs : link.labelEn}

                  {/* Active indicator dot — simple opacity, no layoutId */}
                  <span
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full transition-opacity duration-300"
                    style={{
                      background: 'var(--accent)',
                      opacity: isActive ? 1 : 0,
                    }}
                  />
                </button>
              )
            })}
          </div>

          {/* Right: Lang + Auth + CTA */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <LangToggle />
            </div>

            {!isLoggedIn && (
              <button
                onClick={onLoginClick}
                className="hidden md:block px-4 py-2 text-sm font-medium rounded-xl border transition-all duration-200 cursor-pointer bg-transparent"
                style={{
                  color: 'rgba(255,255,255,0.65)',
                  borderColor: 'rgba(255,255,255,0.09)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ffffff'
                  e.currentTarget.style.borderColor = 'rgba(0,102,255,0.3)'
                  e.currentTarget.style.background = 'rgba(0,102,255,0.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                {isEs ? 'Iniciar sesión' : 'Sign in'}
              </button>
            )}

            {/* CTA */}
            <motion.button
              onClick={onCTAClick}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="relative overflow-hidden px-4 py-2 sm:px-5 rounded-xl text-sm font-bold text-white cursor-pointer border-none"
              style={{
                background: 'linear-gradient(135deg, #0066ff 0%, #0ea5e9 100%)',
                boxShadow: '0 4px 20px rgba(0,102,255,0.35)',
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
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </span>
            </motion.button>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer bg-transparent border-none"
              aria-label="Menu"
            >
              <motion.span animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }} className="block w-5 h-0.5 bg-white rounded-full" />
              <motion.span animate={menuOpen ? { opacity: 0 } : { opacity: 1 }} className="block w-5 h-0.5 bg-white rounded-full" />
              <motion.span animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }} className="block w-5 h-0.5 bg-white rounded-full" />
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
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden"
              style={{
                borderTop: '1px solid rgba(0,102,255,0.08)',
                background: 'rgba(2, 2, 15, 0.98)',
              }}
            >
              <div className="flex flex-col px-5 py-4 gap-1">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.id
                  return (
                    <button
                      key={link.href}
                      onClick={() => { scrollToSection(link.href); setMenuOpen(false) }}
                      className="w-full text-left px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer bg-transparent border-none"
                      style={{
                        color: isActive ? '#ffffff' : 'rgba(255,255,255,0.6)',
                        background: isActive ? 'rgba(0,102,255,0.07)' : 'transparent',
                      }}
                    >
                      {isActive && <span className="mr-2 text-[var(--accent)]">·</span>}
                      {isEs ? link.labelEs : link.labelEn}
                    </button>
                  )
                })}
                <div className="flex items-center justify-between mt-2 pt-3"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <LangToggle />
                  {!isLoggedIn && (
                    <button
                      onClick={() => { onLoginClick(); setMenuOpen(false) }}
                      className="px-4 py-2 text-sm font-medium rounded-xl border transition-all duration-200 cursor-pointer bg-transparent"
                      style={{ color: 'rgba(255,255,255,0.65)', borderColor: 'rgba(255,255,255,0.09)' }}
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

      {/* Spacer */}
      <div className="h-16" />
    </>
  )
}
