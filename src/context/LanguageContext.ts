import { createContext, useContext } from 'react'

export type Lang = 'en' | 'pl'

interface LanguageContextValue {
  lang: Lang
  setLang: (l: Lang) => void
}

export const LanguageContext = createContext<LanguageContextValue>({ lang: 'en', setLang: () => {} })

export const useLang = () => useContext(LanguageContext)
