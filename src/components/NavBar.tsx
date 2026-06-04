import { useLang } from '../context/LanguageContext'
import type { Lang } from '../context/LanguageContext'

export default function NavBar() {
  const { lang, setLang } = useLang()

  return (
    <header className="top">
      <a className="sig" href="#top" aria-label="Top">
        <span>Wiktor</span>
        <span className="sig-last">Spryszyński</span>
      </a>
      <nav className="nav">
        <a href="#work">{lang === 'pl' ? 'Projekty' : 'Work'}</a>
        <a href="#about">{lang === 'pl' ? 'O mnie' : 'About'}</a>
        <a href="#contact">{lang === 'pl' ? 'Kontakt' : 'Contact'}</a>
        <span className="lang" role="group" aria-label="Language">
          <button
            data-lang="en"
            className={lang === 'en' ? 'active' : ''}
            onClick={() => setLang('en' as Lang)}
          >EN</button>
          <span className="lang-sep">/</span>
          <button
            data-lang="pl"
            className={lang === 'pl' ? 'active' : ''}
            onClick={() => setLang('pl' as Lang)}
          >PL</button>
        </span>
      </nav>
    </header>
  )
}
