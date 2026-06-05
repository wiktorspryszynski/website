import { useEffect, useState } from 'react'
import { useLang } from '../context/LanguageContext'
import type { Lang } from '../context/LanguageContext'
import T from './T'

const NavButton = ({ scrollTo, en, pl }: { scrollTo: string; en: string; pl: string }) => (
  <button onClick={() => document.getElementById(scrollTo)?.scrollIntoView({ behavior: 'smooth' })}>
    <T en={en} pl={pl} />
  </button>
)

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
          <NavButton scrollTo="about"   en="About"   pl="O mnie" />
          <NavButton scrollTo="work"    en="Work"    pl="Projekty" />
          <NavButton scrollTo="contact" en="Contact" pl="Kontakt" />
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
