import { useState } from 'react'
import { projects, statusLabel } from '../data/homeContent'
import type { Project } from '../data/homeContent'
import T from './T'
import TechTag from './TechTag'
import { useLang } from '../context/LanguageContext'
import { SiGithub } from 'react-icons/si'

function ExpandContent({ proj }: { proj: Project }) {
  const { lang } = useLang()
  return (
    <div className="proj-expand">
      {proj.screenshot && (
        <img src={proj.screenshot} alt={`${proj.title} screenshot`} className="proj-screenshot" />
      )}
      {proj.longDesc && (
        <p className="proj-long-desc">{proj.longDesc[lang]}</p>
      )}
      {proj.features && (
        <ul className="proj-features">
          {proj.features[lang].map(f => <li key={f}>{f}</li>)}
        </ul>
      )}
    </div>
  )
}

function CardLinks({ proj }: { proj: Project }) {
  return (
    <span className="proj-btns">
      {proj.modelUrl && (
        <a
          className="proj-btn"
          href={proj.modelUrl}
          target="_blank"
          rel="noopener"
          onClick={e => e.stopPropagation()}
        >
          <T en="view model" pl="zobacz model" />
        </a>
      )}
      {proj.sourceUrl && (
        <a
          className="proj-btn"
          href={proj.sourceUrl}
          target="_blank"
          rel="noopener"
          onClick={e => e.stopPropagation()}
        >
          <SiGithub size={12} /><T en="source" pl="kod" />
        </a>
      )}
      {proj.demoUrl && (
        <a
          className="proj-btn proj-btn-demo"
          href={proj.demoUrl}
          target="_blank"
          rel="noopener"
          onClick={e => e.stopPropagation()}
        >
          demo ↗
        </a>
      )}
    </span>
  )
}

export default function WorkSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [closingId, setClosingId] = useState<string | null>(null)

  const close = () => {
    if (!expandedId) return
    setClosingId(expandedId)
    setExpandedId(null)
  }

  const toggle = (title: string) => {
    if (expandedId === title) {
      close()
    } else {
      setClosingId(null)
      setExpandedId(title)
    }
  }

  const handleAnimationEnd = (title: string) => {
    if (closingId === title) setClosingId(null)
  }

  const anyActive = expandedId ?? closingId

  return (
    <section id="work" className="work">
      <div className="work-head">
        <h2 className="h2"><T en="Personal projects" pl="Moje projekty" /></h2>
        <span className="proj-hint">click to expand</span>
      </div>

      {anyActive && (
        <div
          className={`proj-spotlight-overlay${closingId ? ' closing' : ''}`}
          onClick={close}
        />
      )}

      {projects.map(proj => {
        const isExpanded = expandedId === proj.title
        const isClosing = closingId === proj.title
        const spotlightClass = isExpanded
          ? ' proj-spotlight-active'
          : isClosing
            ? ' proj-spotlight-closing'
            : anyActive ? ' proj-dimmed' : ''

        return (
          <article
            key={proj.title}
            className={`proj${proj.small ? ' proj-small' : ''}${spotlightClass}`}
            onClick={() => toggle(proj.title)}
            onAnimationEnd={() => handleAnimationEnd(proj.title)}
          >
            <h3 className="proj-title">
              {proj.icon && <img src={proj.icon} alt="" className="proj-icon" />}
              <span className="proj-title-text">{proj.title}</span>
              <span className="proj-status" data-state={proj.status}>
                <i />
                <T en={statusLabel[proj.status].en} pl={statusLabel[proj.status].pl} />
              </span>
            </h3>
            <p className="proj-desc"><T en={proj.desc.en} pl={proj.desc.pl} /></p>
            <footer className="proj-foot">
              <span className="proj-stack">{proj.stack.map(t => <TechTag key={t} name={t} />)}</span>
              <CardLinks proj={proj} />
            </footer>
            {(isExpanded || isClosing) && <ExpandContent proj={proj} />}
            {isExpanded && (
              <button
                className="proj-close"
                onClick={e => { e.stopPropagation(); close() }}
                aria-label="Close"
              >✕</button>
            )}
          </article>
        )
      })}
    </section>
  )
}
