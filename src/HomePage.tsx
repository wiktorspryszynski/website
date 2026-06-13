import { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { LanguageProvider } from './context/LanguageProvider'
import { BACKEND_EXISTS } from './config/features'
import NavBar from './components/NavBar'
import OrbCanvas from './components/OrbCanvas'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import WorkSection from './components/WorkSection'
import ContactSection from './components/ContactSection'
import SiteFooter from './components/SiteFooter'
import TerminalOverlay from './components/TerminalOverlay'
import WwwEgg from './components/WwwEgg'
import PronunciationPop from './components/PronunciationPop'
import Toast from './components/Toast'

export default function HomePage() {
  const [termOpen, setTermOpen] = useState(false)
  const [wwwOpen, setWwwOpen] = useState(false)
  const [wwwAnchorRect, setWwwAnchorRect] = useState<DOMRect | null>(null)
  const [pronounceOpen, setPronounceOpen] = useState(false)
  const [pronounceAnchorRect, setPronounceAnchorRect] = useState<DOMRect | null>(null)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const openTerm = useCallback(() => setTermOpen(true), [])
  const closeTerm = useCallback(() => setTermOpen(false), [])

  function handleWwwClick(rect: DOMRect) {
    setWwwAnchorRect(rect)
    setWwwOpen(true)
  }

  function handlePronounceClick(rect: DOMRect) {
    setPronounceAnchorRect(rect)
    setPronounceOpen(prev => !prev)
  }

  function dismissToast() {
    setToastMsg(null)
  }

  // Backtick toggles terminal; Escape closes overlays
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === '`' || e.key === '~') {
        const active = document.activeElement
        if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
          if (!termOpen) return
        }
        e.preventDefault()
        setTermOpen(prev => !prev)
      } else if (e.key === 'Escape') {
        if (termOpen) { setTermOpen(false); return }
        if (wwwOpen) { setWwwOpen(false); return }
        if (pronounceOpen) { setPronounceOpen(false); return }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [termOpen, wwwOpen, pronounceOpen])

  const SITE_URL = 'https://spryszynski.pl'
  const TITLE = 'Wiktor Spryszyński - Full-Stack Developer'
  const DESCRIPTION = 'Full-stack developer based in Gdańsk, Poland. Building web apps with React, TypeScript and FastAPI.'

  return (
    <LanguageProvider>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta name="author" content="Wiktor Spryszyński" />
        <link rel="canonical" href={SITE_URL} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:image" content={`${SITE_URL}/project-preview.svg`} />
        <meta property="og:site_name" content="Wiktor Spryszyński" />
        <meta property="og:locale" content="en_US" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content={`${SITE_URL}/project-preview.svg`} />
      </Helmet>
      <OrbCanvas />
      <NavBar />
      <main>
        <HeroSection
          onWwwClick={handleWwwClick}
          onPronounceClick={handlePronounceClick}
          onCopy={setToastMsg}
        />
        <AboutSection />
        <WorkSection />
        <ContactSection onCopy={setToastMsg} />
      </main>
      <SiteFooter onTerminalOpen={openTerm} />
      <TerminalOverlay isOpen={termOpen} onClose={closeTerm} />
      {BACKEND_EXISTS && <WwwEgg isOpen={wwwOpen} anchorRect={wwwAnchorRect} onClose={() => setWwwOpen(false)} />}
      <PronunciationPop isOpen={pronounceOpen} anchorRect={pronounceAnchorRect} onClose={() => setPronounceOpen(false)} />
      <Toast message={toastMsg} onDismiss={dismissToast} />
    </LanguageProvider>
  )
}
