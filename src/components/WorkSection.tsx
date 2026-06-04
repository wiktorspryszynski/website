import { useLang } from '../context/LanguageContext'
import { t, projects, statusLabel } from '../data/homeContent'

export default function WorkSection() {
  const { lang } = useLang()

  return (
    <section id="work" className="work">
      <h2 className="h2">{t(lang, 'Selected work', 'Wybrane projekty')}</h2>

      {projects.map(proj => (
        <article key={proj.title} className={`proj${proj.small ? ' proj-small' : ''}`}>
          <header className="proj-head">
            <h3 className="proj-title">{proj.title}</h3>
            <span className="proj-status" data-state={proj.status}>
              <i />
              <span>{statusLabel[proj.status][lang]}</span>
            </span>
          </header>
          <p className="proj-desc">{proj.desc[lang]}</p>
          <footer className="proj-foot">
            <span className="proj-stack">{proj.stack}</span>
            {proj.demoUrl ? (
              <span className="proj-links">
                <a className="proj-link" href={proj.sourceUrl} target="_blank" rel="noopener">
                  {t(lang, 'source', 'kod')} ↗
                </a>
                <a className="proj-link accent" href={proj.demoUrl} target="_blank" rel="noopener">
                  {t(lang, 'demo', 'demo')} ↗
                </a>
              </span>
            ) : (
              <a className="proj-link" href={proj.sourceUrl} target="_blank" rel="noopener">
                {t(lang, 'source', 'kod')} ↗
              </a>
            )}
          </footer>
        </article>
      ))}
    </section>
  )
}
