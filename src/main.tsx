import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { LangProvider } from './lib/i18n'
import { AuthProvider } from './context/AuthContext'

class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { error: Error | null }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props)
        this.state = { error: null }
    }

    static getDerivedStateFromError(error: Error) {
        return { error }
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error('[Vibepick] App crash:', error, info)
    }

    render() {
        if (this.state.error) {
            return (
                <div style={{
                    minHeight: '100vh',
                    background: '#000',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    color: '#fff',
                    textAlign: 'center',
                }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
                    <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
                        Vibepick no pudo cargar
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 24, maxWidth: 400 }}>
                        Ocurrió un error al iniciar la aplicación. Por favor recarga la página.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            background: '#0066ff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 12,
                            padding: '12px 28px',
                            fontSize: 15,
                            fontWeight: 600,
                            cursor: 'pointer',
                            marginBottom: 16,
                        }}
                    >
                        Recargar página
                    </button>
                    <details style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, maxWidth: 500 }}>
                        <summary style={{ cursor: 'pointer', marginBottom: 8 }}>Detalles del error</summary>
                        <pre style={{ textAlign: 'left', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                            {this.state.error.message}
                        </pre>
                    </details>
                </div>
            )
        }
        return this.props.children
    }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ErrorBoundary>
            <LangProvider>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </LangProvider>
        </ErrorBoundary>
    </React.StrictMode>,
)
