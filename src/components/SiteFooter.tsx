import { useLang } from '../context/LanguageContext'

interface SiteFooterProps {
  onTerminalOpen: () => void
}

export default function SiteFooter({ onTerminalOpen }: SiteFooterProps) {
  const { lang } = useLang()

  return (
    <footer className="bottom">
      <span>© Wiktor Spryszyński, 2026</span>
      <span className="bottom-mid">{lang === 'pl' ? 'Gdańsk · 54.35°N, 18.65°E' : 'Gdańsk · 54.35°N, 18.65°E'}</span>
      <span>
        <button className="term-toggle" type="button" onClick={onTerminalOpen}>
          <kbd>`</kbd>
        </button>
      </span>
    </footer>
  )
}
