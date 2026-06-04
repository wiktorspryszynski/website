import { useRef, useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { t } from '../data/homeContent'

const EMAIL = 'spryszynskiwiktor@gmail.com'

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
    } catch {
      return false
    }
  }
}

interface LinkGridProps {
  onCopy: (msg: string) => void
}

export default function LinkGrid({ onCopy }: LinkGridProps) {
  const { lang } = useLang()
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const resumeHref = lang === 'pl' ? '/_CV_Wiktor_Spryszynski.pdf' : '/_CV_Wiktor_Spryszynski_ENG.pdf'

  async function handleEmailClick(e: React.MouseEvent) {
    e.preventDefault()
    const ok = await copyText(EMAIL)
    if (ok) {
      setCopied(true)
      onCopy(EMAIL + ' copied')
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setCopied(false), 1800)
    } else {
      onCopy("couldn′t copy")
    }
  }

  return (
    <ul className="links">
      <li>
        <a
          className={`link${copied ? ' copied' : ''}`}
          data-action="copy-email"
          href={`mailto:${EMAIL}`}
          onClick={handleEmailClick}
          tabIndex={0}
        >
          <span className="icn" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2.5" y="4.5" width="19" height="15" rx="1.5"/>
              <path d="M3 6l9 6 9-6"/>
            </svg>
          </span>
          <span className="link-label">{t(lang, 'email', 'email')}</span>
          <span className="link-val">{EMAIL}</span>
        </a>
      </li>
      <li>
        <a className="link" href="https://github.com/wiktorspryszynski" target="_blank" rel="noopener">
          <span className="icn" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
              <path d="M9 18c-4.51 2-5-2-7-2"/>
            </svg>
          </span>
          <span className="link-label">github</span>
          <span className="link-val">@wiktorspryszynski</span>
        </a>
      </li>
      <li>
        <a className="link" href="https://www.linkedin.com/in/wiktor-spryszynski/" target="_blank" rel="noopener">
          <span className="icn" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/>
              <rect x="2" y="9" width="4" height="12"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
          </span>
          <span className="link-label">linkedin</span>
          <span className="link-val">in/wiktor-spryszynski</span>
        </a>
      </li>
      <li>
        <a className="link" href={resumeHref} download>
          <span className="icn" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2.5H6.5A1.5 1.5 0 0 0 5 4v16a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 20V7.5z"/>
              <path d="M14 2.5V7.5h5"/>
              <path d="M9 13h6M9 16.5h6M9 9.5h2"/>
            </svg>
          </span>
          <span className="link-label">{t(lang, 'résumé', 'cv')}</span>
          <span className="link-val">PDF, 1 page</span>
        </a>
      </li>
    </ul>
  )
}
