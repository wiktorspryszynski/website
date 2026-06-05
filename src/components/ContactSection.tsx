import { useRef, useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { EmailIcon, GithubIcon, LinkedInIcon, FileIcon } from './LinkRow'
import T from './T'

const EMAIL = 'spryszynskiwiktor@gmail.com'

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      return true
    } catch { return false }
  }
}

interface ContactSectionProps {
  onCopy: (msg: string) => void
}

export default function ContactSection({ onCopy }: ContactSectionProps) {
  const { lang } = useLang()
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const resumeHref = lang === 'pl' ? '/_CV_Wiktor_Spryszynski.pdf' : '/_CV_Wiktor_Spryszynski_ENG.pdf'

  async function handleCopy() {
    const ok = await copyText(EMAIL)
    if (ok) {
      setCopied(true)
      onCopy(EMAIL + ' copied')
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setCopied(false), 1800)
    } else {
      onCopy("couldn′t copy")
    }
  }

  return (
    <section id="contact" className="contact">
      <h2 className="h2"><T en="Get in touch" pl="Napisz" /></h2>
      <p className="contact-tag">
        <T en="The fastest way is email. I read everything." pl="Najszybciej przez email. Czytam wszystko." />
      </p>

      <div className="cta-buttons">
        <div className="cta-split">
          <button
            className={`cta-split-main${copied ? ' copied' : ''}`}
            type="button"
            onClick={handleCopy}
          >
            <span className="cta-btn-icon"><EmailIcon /></span>
            <span className="cta-btn-body">
              <span className="cta-btn-label">email</span>
              <span className="cta-btn-val">{EMAIL}</span>
            </span>
            <span className="cta-btn-cta" data-cta="copy">
              {copied ? <>✓ <T en="copied" pl="skopiowano" /></> : <T en="copy" pl="skopiuj" />}
            </span>
          </button>
          <a
            className="cta-split-side"
            href={`mailto:${EMAIL}`}
            aria-label="Open in mail app"
            title="Open in mail app"
          ><T en="open" pl="otwórz" /></a>
        </div>

        <div className="cta-row">
          <a className="cta-btn" href="https://github.com/wiktorspryszynski" target="_blank" rel="noopener">
            <span className="cta-btn-icon"><GithubIcon /></span>
            <span className="cta-btn-body">
              <span className="cta-btn-label">github</span>
              <span className="cta-btn-val">@wiktorspryszynski</span>
            </span>
            <span className="cta-btn-cta" data-cta="external">↗</span>
          </a>
          <a className="cta-btn" href="https://www.linkedin.com/in/wiktor-spryszynski/" target="_blank" rel="noopener">
            <span className="cta-btn-icon"><LinkedInIcon /></span>
            <span className="cta-btn-body">
              <span className="cta-btn-label">linkedin</span>
              <span className="cta-btn-val">in/wiktor-spryszynski</span>
            </span>
            <span className="cta-btn-cta" data-cta="external">↗</span>
          </a>
          <div className="cta-split">
            <a className="cta-split-main" href={resumeHref} target="_blank" rel="noopener">
              <span className="cta-btn-icon"><FileIcon /></span>
              <span className="cta-btn-body">
                <span className="cta-btn-label"><T en="résumé" pl="cv" /></span>
                <span className="cta-btn-val"><T en="PDF, one page" pl="PDF, jedna strona" /></span>
              </span>
              <span className="cta-btn-cta" data-cta="external">↗</span>
            </a>
            <a
              className="cta-split-side"
              href={resumeHref}
              download
              aria-label="Download résumé"
              title="Download résumé"
            ><T en="save" pl="pobierz" /></a>
          </div>
        </div>
      </div>
    </section>
  )
}
