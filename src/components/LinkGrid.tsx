import { useLang } from '../context/LanguageContext'
import { t } from '../data/homeContent'
import LinkRow, { EmailIcon, GithubIcon, LinkedInIcon, FileIcon } from './LinkRow'

const EMAIL = 'spryszynskiwiktor@gmail.com'

interface LinkGridProps {
  onCopy: (msg: string) => void
}

export default function LinkGrid({ onCopy }: LinkGridProps) {
  const { lang } = useLang()
  const resumeHref = lang === 'pl' ? '/_CV_Wiktor_Spryszynski.pdf' : '/_CV_Wiktor_Spryszynski_ENG.pdf'

  return (
    <ul className="links">
      <li>
        <LinkRow
          icon={<EmailIcon />}
          label={t(lang, 'email', 'email')}
          value={EMAIL}
          action={{ type: 'copy', text: EMAIL, onResult: onCopy }}
          aside={
            <a className="link-row-aside" href={`mailto:${EMAIL}`} aria-label="Open in mail app" title="Open in mail app">{t(lang, 'open', 'otwórz')}</a>
          }
        />
      </li>
      <li>
        <LinkRow
          icon={<GithubIcon />}
          label="github"
          value="@wiktorspryszynski"
          action={{ type: 'external', href: 'https://github.com/wiktorspryszynski' }}
        />
      </li>
      <li>
        <LinkRow
          icon={<LinkedInIcon />}
          label="linkedin"
          value="in/wiktor-spryszynski"
          action={{ type: 'external', href: 'https://www.linkedin.com/in/wiktor-spryszynski/' }}
        />
      </li>
      <li>
        <LinkRow
          icon={<FileIcon />}
          label={t(lang, 'résumé', 'cv')}
          value="PDF, 1 page"
          action={{ type: 'external', href: resumeHref }}
          aside={
            <a className="link-row-aside" href={resumeHref} download aria-label="Download résumé" title="Download résumé">{t(lang, 'save', 'pobierz')}</a>
          }
        />
      </li>
    </ul>
  )
}
