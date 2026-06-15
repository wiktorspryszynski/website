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
          <NavButton scrollTo="work"    en="Projects"    pl="Projekty" />
          <NavButton scrollTo="contact" en="Contact" pl="Kontakt" />
          <button
            className="lang"
            aria-label={`Switch to ${lang === 'en' ? 'Polish' : 'English'}`}
            onClick={() => setLang((lang === 'en' ? 'pl' : 'en') as Lang)}
          >
            <span className={lang === 'en' ? 'active' : ''}>EN</span>
            <span className="lang-sep">/</span>
            <span className={lang === 'pl' ? 'active' : ''}>PL</span>
          </button>
        </nav>
      </div>
    </header>
  )
}
