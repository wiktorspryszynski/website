import { useEffect, useState } from 'react'
import { useLang } from '../context/LanguageContext'
import type { Lang } from '../context/LanguageContext'

export default function NavBar() {
  const { lang, setLang } = useLang()
  const [sigVisible, setSigVisible] = useState(false)

  useEffect(() => {
    const heroName = document.querySelector<HTMLElement>('.name')
    if (!heroName) return
    const obs = new IntersectionObserver(
      ([entry]) => setSigVisible(!entry.isIntersecting),
      { threshold: 0 }
    )
    obs.observe(heroName)
    return () => obs.disconnect()
  }, [])

  return (
    <header className="top">
      <div className="top-inner">
        <button
          className={`sig${sigVisible ? ' sig-show' : ''}`}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
        >
          <span>Wiktor</span>
          <span className="sig-last">Spryszyński</span>
        </button>
        <nav className="nav">
          <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>{lang === 'pl' ? 'O mnie' : 'About'}</button>
          <button onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}>{lang === 'pl' ? 'Projekty' : 'Work'}</button>
          <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>{lang === 'pl' ? 'Kontakt' : 'Contact'}</button>
          <span className="lang" role="group" aria-label="Language">
            <button
              data-lang="en"
              className={lang === 'en' ? 'active' : ''}
              onClick={() => setLang('en' as Lang)}
            >
              EN
            </button>
            <span className="lang-sep">/</span>
            <button
              data-lang="pl"
              className={lang === 'pl' ? 'active' : ''}
              onClick={() => setLang('pl' as Lang)}
            >
              PL
            </button>
          </span>
        </nav>
      </div>
    </header>
  )
}
