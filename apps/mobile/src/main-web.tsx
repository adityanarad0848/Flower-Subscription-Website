import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import DesktopLanding from './app/components/DesktopLanding'
import { AuthProvider } from './app/context/auth'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <DesktopLanding />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
)
