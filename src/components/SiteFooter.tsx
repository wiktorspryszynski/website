import { useEffect, useRef, useState } from 'react'
import { useLang } from '../context/LanguageContext'

const GLOW_STYLE = 'white' // 'green' | 'cyan' | 'white' | 'blink'

interface SiteFooterProps {
  onTerminalOpen: () => void
}

export default function SiteFooter({ onTerminalOpen }: SiteFooterProps) {
  const { lang } = useLang()
  const btnRef = useRef<HTMLButtonElement>(null)
  const [glowed, setGlowed] = useState(false)

  useEffect(() => {
    if (glowed || !btnRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setGlowed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(btnRef.current)
    return () => observer.disconnect()
  }, [glowed])

  return (
    <footer className="site-footer">
      <div className="bottom">
        <span>© Wiktor Spryszyński, 2026</span>
        <span className="bottom-mid">{lang === 'pl' ? 'Gdańsk · 54.35°N, 18.65°E' : 'Gdańsk, Poland · 54.35°N, 18.65°E'}</span>
        <span>
          <button
            ref={btnRef}
            className={`term-toggle${glowed ? ` term-glow-${GLOW_STYLE}` : ''}`}
            type="button"
            onClick={onTerminalOpen}
          >
            <span className="term-hit">tty</span><kbd>`</kbd>
          </button>
        </span>
      </div>
    </footer>
  )
}
