import { useState, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { projects, statusLabel } from '../data/homeContent'
import type { Project, Screenshot } from '../data/homeContent'
import T from './T'
import TechTag from './TechTag'
import { useLang } from '../context/LanguageContext'
import { TbBrandGithub, TbNotebook } from 'react-icons/tb'
import Arrow from './Arrow'
import ProjBtn from './ProjBtn'

const GALLERY_MAX_W = 600
const GALLERY_MAX_H = 360

function Lightbox({ screenshots, idx, onChange, onClose }: { screenshots: Screenshot[]; idx: number; onChange: (i: number) => void; onClose: () => void }) {
  const prev = (e: React.MouseEvent) => { e.stopPropagation(); onChange((idx - 1 + screenshots.length) % screenshots.length) }
  const next = (e: React.MouseEvent) => { e.stopPropagation(); onChange((idx + 1) % screenshots.length) }

  useEffect(() => {
    const saved = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = saved }
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onChange((idx - 1 + screenshots.length) % screenshots.length)
      if (e.key === 'ArrowRight') onChange((idx + 1) % screenshots.length)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, onChange, screenshots.length, idx])

  return createPortal(
    <div className="lightbox-overlay" onClick={e => { e.stopPropagation(); onClose() }}>
      <button className="lightbox-close" onClick={e => { e.stopPropagation(); onClose() }} aria-label="Close">✕</button>
      <div className="lightbox-content" onClick={e => e.stopPropagation()}>
        <img src={screenshots[idx].src} alt="" className="lightbox-img" key={idx} />
        {screenshots.length > 1 && (
          <div className="lightbox-nav">
            <button className="lightbox-arrow lightbox-arrow-prev" onClick={prev} aria-label="Previous"><Arrow direction="left" size={24} /></button>
            <button className="lightbox-arrow lightbox-arrow-next" onClick={next} aria-label="Next"><Arrow direction="right" size={24} /></button>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

function ScreenshotGallery({ screenshots }: { screenshots: Screenshot[] }) {
  const [idx, setIdx] = useState(0)
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  const prev = useCallback((e: React.MouseEvent) => { e.stopPropagation(); setIdx(i => (i - 1 + screenshots.length) % screenshots.length) }, [screenshots.length])
  const next = useCallback((e: React.MouseEvent) => { e.stopPropagation(); setIdx(i => (i + 1) % screenshots.length) }, [screenshots.length])
  const open = useCallback((e: React.MouseEvent, i: number) => { e.stopPropagation(); setIdx(i); setLightboxIdx(i) }, [])
  const close = useCallback(() => setLightboxIdx(null), [])

  if (screenshots.length < 3) {
    return (
      <>
        <div className="proj-gallery-row">
          {screenshots.map((s, i) => {
            const scale = Math.min(GALLERY_MAX_W / s.width, GALLERY_MAX_H / s.height, 1)
            return <img key={i} src={s.src} alt="" className="proj-screenshot proj-screenshot-clickable" style={{ width: Math.round(s.width * scale), height: Math.round(s.height * scale) }} onClick={e => open(e, i)} />
          })}
        </div>
        {lightboxIdx !== null && <Lightbox screenshots={screenshots} idx={idx} onChange={setIdx} onClose={close} />}
      </>
    )
  }

  const s = screenshots[idx]
  const scale = Math.min(GALLERY_MAX_W / s.width, GALLERY_MAX_H / s.height, 1)

  return (
    <>
      <div className="proj-gallery">
        <div className="proj-gallery-stage">
          <button className="proj-gallery-arrow left" onClick={prev} aria-label="Previous"><Arrow direction="left" /></button>
          <img src={s.src} alt="" className="proj-screenshot proj-screenshot-clickable" style={{ width: Math.round(s.width * scale), height: Math.round(s.height * scale) }} onClick={e => open(e, idx)} />
          <button className="proj-gallery-arrow right" onClick={next} aria-label="Next"><Arrow direction="right" /></button>
        </div>
        <div className="proj-gallery-dots">
          {screenshots.map((_, i) => (
            <button
              key={i}
              className={`proj-gallery-dot${i === idx ? ' active' : ''}`}
              onClick={e => { e.stopPropagation(); setIdx(i) }}
              aria-label={`Screenshot ${i + 1}`}
            />
          ))}
        </div>
      </div>
      {lightboxIdx !== null && <Lightbox screenshots={screenshots} idx={idx} onChange={setIdx} onClose={close} />}
    </>
  )
}

function ExpandContent({ proj }: { proj: Project }) {
  const { lang } = useLang()
  return (
    <div className="proj-expand">
      {proj.screenshots && <ScreenshotGallery screenshots={proj.screenshots} />}
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
      <ProjBtn href={proj.modelUrl} optional blur>
        <TbNotebook size={13} /><T en="view model" pl="zobacz model" />
      </ProjBtn>
      <ProjBtn href={proj.sourceUrl} optional blur>
        <TbBrandGithub size={13} /><T en="source" pl="kod" />
      </ProjBtn>
      <ProjBtn href={proj.demoUrl} optional blur className="proj-btn-demo">
        demo <Arrow size={12} />
      </ProjBtn>
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
