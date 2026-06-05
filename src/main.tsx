import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/home.css'
import App from './App.tsx'

console.log(
  '%c██╗    ██╗███████╗\n',
  '%c██║    ██║██╔════╝\n',
  '%c██║ █╗ ██║███████╗\n',
  '%c██║███╗██║╚════██║\n',
  '%c╚███╔███╔╝███████║\n',
  '%c ╚══╝╚══╝ ╚══════╝',
  'color:#f472b6;font-family:monospace',
  'color:#a78bfa;font-family:monospace',
  'color:#60a5fa;font-family:monospace',
  'color:#34d399;font-family:monospace',
  'color:#fbbf24;font-family:monospace',
  'color:#fb923c;font-family:monospace',
)
console.log(
  `\nhello :]\n\nlooking for more easter eggs?\ntry pressing %c\`%c on the site\n`,
  'background:#000;color:#fff;padding:1px 4px;border-radius:2px;font-family:monospace',
  '',
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
