import { createContext, useContext, useEffect, useState } from 'react'

export type Lang = 'en' | 'pl'

interface LanguageContextValue {
  lang: Lang
  setLang: (l: Lang) => void
}

const LanguageContext = createContext<LanguageContextValue>({ lang: 'en', setLang: () => {} })

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try { return (localStorage.getItem('lang') as Lang) || 'en' } catch { return 'en' }
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-lang', lang)
  }, [lang])

  function setLang(l: Lang) {
    setLangState(l)
    try { localStorage.setItem('lang', l) } catch {}
  }

  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>
}

export const useLang = () => useContext(LanguageContext)
