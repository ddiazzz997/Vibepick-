import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { LangProvider } from './lib/i18n'
import { AuthProvider } from './context/AuthContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LangProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </LangProvider>
  </React.StrictMode>,
)
