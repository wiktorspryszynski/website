import { useRef, useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { t } from '../data/homeContent'

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      return true
    } catch { return false }
  }
}

export function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="4.5" width="19" height="15" rx="1.5"/>
      <path d="M3 6l9 6 9-6"/>
    </svg>
  )
}

export function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
      <path d="M9 18c-4.51 2-5-2-7-2"/>
    </svg>
  )
}

export function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  )
}

export function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2.5H6.5A1.5 1.5 0 0 0 5 4v16a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 20V7.5z"/>
      <path d="M14 2.5V7.5h5"/>
      <path d="M9 13h6M9 16.5h6M9 9.5h2"/>
    </svg>
  )
}

type Action =
  | { type: 'external'; href: string }
  | { type: 'download'; href: string }
  | { type: 'copy'; text: string; onResult: (msg: string) => void }

export interface LinkRowProps {
  icon: React.ReactNode
  label: string
  value: string
  action: Action
  aside?: React.ReactNode
}

export default function LinkRow({ icon, label, value, action, aside }: LinkRowProps) {
  const { lang } = useLang()
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  async function handleCopy() {
    if (action.type !== 'copy') return
    const ok = await copyText(action.text)
    if (ok) {
      setCopied(true)
      action.onResult(action.text + ' copied')
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setCopied(false), 1800)
    } else {
      action.onResult("couldn′t copy")
    }
  }

  const ctaText = action.type === 'copy'
    ? (copied ? `✓ ${t(lang, 'copied', 'skopiowano')}` : t(lang, 'copy', 'skopiuj'))
    : action.type === 'download' ? '↓' : '↗'

  const inner = (
    <>
      <span className="icn" aria-hidden="true">{icon}</span>
      <span className="link-row-label">{label}</span>
      <span className="link-row-value">{value}</span>
      <span className="link-row-cta" data-cta={action.type}>{ctaText}</span>
    </>
  )

  const row = action.type === 'copy' ? (
    <button className={`link-row${copied ? ' copied' : ''}`} type="button" onClick={handleCopy}>
      {inner}
    </button>
  ) : (
    <a
      className="link-row"
      href={action.href}
      {...(action.type === 'external' ? { target: '_blank', rel: 'noopener' } : {})}
      {...(action.type === 'download' ? { download: true } : {})}
    >
      {inner}
    </a>
  )

  return <>{row}{aside}</>
}
