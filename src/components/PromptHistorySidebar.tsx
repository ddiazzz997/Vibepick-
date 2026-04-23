import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { usePromptHistory, type PromptHistoryItem } from '../hooks/usePromptHistory'

function relativeDate(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime()
    const mins  = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days  = Math.floor(diff / 86400000)
    if (mins  <  1) return 'Ahora mismo'
    if (mins  < 60) return `Hace ${mins} min`
    if (hours < 24) return `Hace ${hours}h`
    if (days  <  7) return `Hace ${days}d`
    return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

interface Props {
    onSelect:    (item: PromptHistoryItem) => void
    onNewSession: () => void
    selectedId?: string
    isOpen?:     boolean
}

export default function PromptHistorySidebar({ onSelect, onNewSession, selectedId, isOpen = true }: Props) {
    const { user } = useAuth()
    const { history, loading, loadHistory } = usePromptHistory()

    useEffect(() => {
        if (user?.id) loadHistory(user.id)
    }, [user?.id, loadHistory])

    if (!user) return null

    return (
        <aside style={{
            width:        isOpen ? '240px' : '0px',
            minWidth:     isOpen ? '240px' : '0px',
            height:       '100vh',
            position:     'sticky',
            top:          0,
            display:      'flex',
            flexDirection:'column',
            background:   'rgba(5,8,16,0.95)',
            borderRight:  isOpen ? '1px solid rgba(255,255,255,0.07)' : 'none',
            fontFamily:   "'Inter', sans-serif",
            overflow:     'hidden',
            opacity:      isOpen ? 1 : 0,
            transition:   'width 0.25s ease, min-width 0.25s ease, opacity 0.25s ease',
            zIndex:       10,
        }}>
            {/* Header */}
            <div style={{ padding: '16px 12px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <button
                    onClick={onNewSession}
                    style={{
                        width:        '100%',
                        padding:      '8px 12px',
                        borderRadius: '8px',
                        background:   'rgba(0,102,255,0.12)',
                        border:       '1px solid rgba(0,102,255,0.25)',
                        color:        '#60a5fa',
                        fontSize:     '0.78rem',
                        fontWeight:   600,
                        cursor:       'pointer',
                        display:      'flex',
                        alignItems:   'center',
                        gap:          '6px',
                        fontFamily:   'inherit',
                        transition:   'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,102,255,0.22)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,102,255,0.12)')}
                >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Nueva sesión
                </button>
            </div>

            {/* History list */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 6px' }}>
                {loading && (
                    <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.72rem', textAlign: 'center', padding: '20px 0' }}>
                        Cargando…
                    </p>
                )}

                {!loading && history.length === 0 && (
                    <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.72rem', textAlign: 'center', padding: '20px 8px', lineHeight: 1.5 }}>
                        Tus prompts generados aparecerán aquí
                    </p>
                )}

                {history.map(item => {
                    const isActive = item.id === selectedId
                    return (
                        <button
                            key={item.id}
                            onClick={() => onSelect(item)}
                            style={{
                                width:        '100%',
                                textAlign:    'left',
                                padding:      '9px 10px',
                                borderRadius: '7px',
                                background:   isActive ? 'rgba(0,102,255,0.15)' : 'transparent',
                                border:       isActive ? '1px solid rgba(0,102,255,0.2)' : '1px solid transparent',
                                cursor:       'pointer',
                                marginBottom: '2px',
                                display:      'block',
                                fontFamily:   'inherit',
                                transition:   'background 0.12s',
                            }}
                            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                        >
                            <p style={{
                                color:     isActive ? '#93c5fd' : 'rgba(255,255,255,0.75)',
                                fontSize:  '0.78rem',
                                fontWeight: 500,
                                margin:    0,
                                overflow:  'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}>
                                {item.description}
                            </p>
                            <p style={{
                                color:    'rgba(255,255,255,0.25)',
                                fontSize: '0.68rem',
                                margin:   '3px 0 0',
                            }}>
                                {relativeDate(item.created_at)}
                            </p>
                        </button>
                    )
                })}
            </div>
        </aside>
    )
}
