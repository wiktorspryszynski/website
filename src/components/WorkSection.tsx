import { projects, statusLabel } from '../data/homeContent'
import T from './T'

export default function WorkSection() {
  return (
    <section id="work" className="work">
      <h2 className="h2"><T en="Selected work" pl="Wybrane projekty" /></h2>

      {projects.map(proj => (
        <article key={proj.title} className={`proj${proj.small ? ' proj-small' : ''}`}>
          <header className="proj-head">
            <h3 className="proj-title">{proj.title}</h3>
            <span className="proj-status" data-state={proj.status}>
              <i />
              <T en={statusLabel[proj.status].en} pl={statusLabel[proj.status].pl} />
            </span>
          </header>
          <p className="proj-desc"><T en={proj.desc.en} pl={proj.desc.pl} /></p>
          <footer className="proj-foot">
            <span className="proj-stack">{proj.stack}</span>
            {proj.demoUrl ? (
              <span className="proj-links">
                <a className="proj-link" href={proj.sourceUrl} target="_blank" rel="noopener">
                  <T en="source" pl="kod" /> ↗
                </a>
                <a className="proj-link accent" href={proj.demoUrl} target="_blank" rel="noopener">
                  demo ↗
                </a>
              </span>
            ) : (
              <a className="proj-link" href={proj.sourceUrl} target="_blank" rel="noopener">
                <T en="source" pl="kod" /> ↗
              </a>
            )}
          </footer>
        </article>
      ))}
    </section>
  )
}
