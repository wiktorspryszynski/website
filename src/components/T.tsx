import type { ReactNode } from 'react'
import { useLang } from '../context/LanguageContext'

export default function T({ en, pl }: { en: ReactNode; pl: ReactNode }) {
  const { lang } = useLang()
  return <span key={lang} className="t">{lang === 'pl' ? pl : en}</span>
}
