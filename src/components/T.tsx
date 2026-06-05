import { useLang } from '../context/LanguageContext'

export default function T({ en, pl }: { en: string; pl: string }) {
  const { lang } = useLang()
  return <span key={lang} className="t">{lang === 'pl' ? pl : en}</span>
}
