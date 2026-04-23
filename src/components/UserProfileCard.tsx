import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface UserProfileCardProps {
  firstName: string
  lastName:  string
  email:     string
  credits:   number
  isPro:     boolean
  onSignOut: () => void
}

export default function UserProfileCard({
  firstName, lastName, email, credits, isPro, onSignOut,
}: UserProfileCardProps) {
  const [open, setOpen] = useState(false)

  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase()

  return (
    <div style={{ position: 'fixed', top: '16px', left: '16px', zIndex: 140, fontFamily: "'Inter', sans-serif" }}>
      {/* Avatar trigger */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display:        'flex',
          alignItems:     'center',
          gap:            '8px',
          padding:        '6px 10px 6px 6px',
          borderRadius:   '40px',
          background:     'rgba(5,8,16,0.85)',
          border:         '1px solid rgba(255,255,255,0.09)',
          cursor:         'pointer',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          transition:     'border-color 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,102,255,0.4)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)')}
      >
        {/* Avatar circle */}
        <div style={{
          width:           '28px',
          height:          '28px',
          borderRadius:    '50%',
          background:      isPro
            ? 'linear-gradient(135deg, #0066ff, #06b6d4)'
            : 'rgba(0,102,255,0.8)',
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          color:           '#fff',
          fontSize:        '0.7rem',
          fontWeight:      700,
          flexShrink:      0,
        }}>
          {initials || '?'}
        </div>

        {/* Name */}
        <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem', fontWeight: 500 }}>
          {firstName}
        </span>

        {/* PRO badge or credits pill */}
        {isPro ? (
          <span style={{
            padding:      '2px 7px',
            borderRadius: '20px',
            background:   'linear-gradient(90deg, rgba(0,102,255,0.25), rgba(6,182,212,0.25))',
            border:       '1px solid rgba(0,102,255,0.35)',
            color:        '#60a5fa',
            fontSize:     '0.65rem',
            fontWeight:   700,
            letterSpacing:'0.04em',
          }}>
            PRO
          </span>
        ) : (
          <span style={{
            padding:      '2px 7px',
            borderRadius: '20px',
            background:   credits > 0 ? 'rgba(0,102,255,0.12)' : 'rgba(239,68,68,0.12)',
            border:       `1px solid ${credits > 0 ? 'rgba(0,102,255,0.25)' : 'rgba(239,68,68,0.25)'}`,
            color:        credits > 0 ? '#93c5fd' : '#fca5a5',
            fontSize:     '0.68rem',
            fontWeight:   600,
          }}>
            {credits} crédito{credits !== 1 ? 's' : ''}
          </span>
        )}

        {/* Chevron */}
        <svg
          width="12" height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            style={{
              position:       'absolute',
              top:            'calc(100% + 8px)',
              right:          0,
              minWidth:       '220px',
              background:     'rgba(5,8,16,0.96)',
              border:         '1px solid rgba(255,255,255,0.08)',
              borderRadius:   '12px',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              overflow:       'hidden',
              boxShadow:      '0 16px 40px rgba(0,0,0,0.5)',
            }}
          >
            {/* User info */}
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width:          '36px',
                  height:         '36px',
                  borderRadius:   '50%',
                  background:     isPro
                    ? 'linear-gradient(135deg, #0066ff, #06b6d4)'
                    : 'rgba(0,102,255,0.7)',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  color:          '#fff',
                  fontSize:       '0.85rem',
                  fontWeight:     700,
                  flexShrink:     0,
                }}>
                  {initials || '?'}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <p style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {firstName} {lastName}
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {email}
                  </p>
                </div>
              </div>
            </div>

            {/* Credits / Plan row */}
            <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>Plan</span>
              {isPro ? (
                <span style={{
                  padding:    '3px 10px',
                  borderRadius:'20px',
                  background: 'linear-gradient(90deg, rgba(0,102,255,0.2), rgba(6,182,212,0.2))',
                  border:     '1px solid rgba(0,102,255,0.3)',
                  color:      '#60a5fa',
                  fontSize:   '0.72rem',
                  fontWeight: 700,
                }}>
                  PRO ✦
                </span>
              ) : (
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
                  Free · <span style={{ color: credits > 0 ? '#93c5fd' : '#fca5a5' }}>{credits} crédito{credits !== 1 ? 's' : ''}</span>
                </span>
              )}
            </div>

            {/* Sign out */}
            <div style={{ padding: '6px' }}>
              <button
                onClick={() => { setOpen(false); onSignOut() }}
                style={{
                  width:        '100%',
                  padding:      '8px 10px',
                  borderRadius: '8px',
                  background:   'transparent',
                  border:       'none',
                  color:        'rgba(255,255,255,0.45)',
                  fontSize:     '0.78rem',
                  cursor:       'pointer',
                  textAlign:    'left',
                  display:      'flex',
                  alignItems:   'center',
                  gap:          '8px',
                  fontFamily:   'inherit',
                  transition:   'background 0.12s, color 0.12s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#fca5a5' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Cerrar sesión
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
