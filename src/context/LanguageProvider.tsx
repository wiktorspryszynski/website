import { useEffect, useState } from 'react'
import { LanguageContext } from './LanguageContext'
import type { Lang } from './LanguageContext'

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const param = new URLSearchParams(window.location.search).get('lang')
    if (param === 'pl' || param === 'en') return param
    try { return (localStorage.getItem('lang') as Lang) || 'en' } catch { return 'en' }
  })

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.has('lang')) {
      params.delete('lang')
      const next = params.size ? `?${params}` : window.location.pathname
      window.history.replaceState(null, '', next)
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-lang', lang)
  }, [lang])

  function setLang(l: Lang) {
    setLangState(l)
    try { localStorage.setItem('lang', l) } catch { /* ignore */ }
  }

  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>
}
