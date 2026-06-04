import { useRef } from 'react'
import { useLang } from '../context/LanguageContext'
import { t } from '../data/homeContent'
import LinkGrid from './LinkGrid'
import FetcherWidget from './FetcherWidget'

interface HeroSectionProps {
  onWwwClick: (rect: DOMRect) => void
  onPronounceClick: (rect: DOMRect) => void
  onCopy: (msg: string) => void
}

export default function HeroSection({ onWwwClick, onPronounceClick, onCopy }: HeroSectionProps) {
  const { lang } = useLang()
  const wwwRef = useRef<HTMLSpanElement>(null)
  const pronounceRef = useRef<HTMLSpanElement>(null)

  function handleWwwClick() {
    if (wwwRef.current) onWwwClick(wwwRef.current.getBoundingClientRect())
  }
  function handleWwwKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleWwwClick() }
  }
  function handlePronounceClick(e: React.MouseEvent) {
    e.stopPropagation()
    if (pronounceRef.current) onPronounceClick(pronounceRef.current.getBoundingClientRect())
  }
  function handlePronounceKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handlePronounceClick(e as unknown as React.MouseEvent) }
  }

  return (
    <section id="top" className="hero">
      <div className="hero-meta">
        <span>{t(lang, 'Gdańsk, PL', 'Gdańsk, PL')}</span>
        <span className="dot-sep">·</span>
        <span>
          <i className="ok" />
          {t(lang, 'Open to work, May 2026', 'Dostępny od maja 2026')}
        </span>
      </div>

      <h1 className="name">
        <span className="name-line">
          <span
            className="egg"
            data-egg="www"
            tabIndex={0}
            role="button"
            aria-label="W"
            ref={wwwRef}
            onClick={handleWwwClick}
            onKeyDown={handleWwwKey}
          >Wiktor</span>
        </span>
        <span className="name-line">
          <span
            className="egg"
            data-egg="pronounce"
            tabIndex={0}
            role="button"
            aria-label="Pronunciation"
            ref={pronounceRef}
            onClick={handlePronounceClick}
            onKeyDown={handlePronounceKey}
          >Spryszy<span className="ws">ń</span>ski</span>
          <span className="period">.</span>
        </span>
      </h1>

      <p className="tag">
        {t(
          lang,
          'Full-stack engineer. I build small, careful software end-to-end — from schema to the last hover state.',
          'Full-stack engineer. Robię małe, staranne oprogramowanie od bazy po ostatni stan hover.'
        )}
      </p>

      <div className="hero-row">
        <LinkGrid onCopy={onCopy} />
        <FetcherWidget />
      </div>
    </section>
  )
}
