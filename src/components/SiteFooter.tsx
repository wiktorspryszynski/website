import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'
import { SiReact, SiTypescript, SiVite, SiThreedotjs } from 'react-icons/si'
const GLOW_STYLE = 'white' // 'green' | 'cyan' | 'white' | 'blink'

const BUILT_WITH = [
  { Icon: SiReact,      tip: 'React 19 — concurrent UI',        color: '#61DAFB' },
  { Icon: SiTypescript, tip: 'TypeScript ~5.9 — strict mode',   color: '#3178C6' },
  { Icon: SiVite,       tip: 'Vite 7 — instant HMR',            color: '#646CFF' },
  { Icon: SiThreedotjs, tip: 'Three.js 0.184 — the orb & stars', color: '#049EF4' },
]

const SITE_LINKS = [
  { label: 'now',           href: '/now',          internal: true  },
  { label: '/humans.txt',   href: '/humans.txt',   internal: false },
  { label: 'legacy v1',     href: '/legacy/v1',    internal: false },
]

interface SiteFooterProps {
  onTerminalOpen: () => void
}

export default function SiteFooter({ onTerminalOpen }: SiteFooterProps) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)
  const [glowed, setGlowed] = useState(false)
  const [linksOpen, setLinksOpen] = useState(false)

  useEffect(() => {
    if (glowed || !btnRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setGlowed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(btnRef.current)
    return () => observer.disconnect()
  }, [glowed])

  useEffect(() => {
    if (!linksOpen) return
    const close = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setLinksOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [linksOpen])

  return (
    <footer className="site-footer">
      <div className="bottom">
        <span id="copyright-wrapper">
          <span id="copyright-name">© Wiktor Spryszyński</span>, <span id="copyright-year">{new Date().getFullYear()}</span>
        </span>

        <span className="bottom-mid">
          Built with
          <Tippy content="love" placement="top"><span className="footer-heart">♥</span></Tippy>
          and
          <span className="footer-icons">
            {BUILT_WITH.map(({ Icon, tip, color }) => (
              <Tippy key={tip} content={tip} placement="top">
                <span
                  className="footer-icon-wrap"
                  style={{ '--icon-color': color } as React.CSSProperties}
                >
                  <Icon size={13} />
                </span>
              </Tippy>
            ))}
          </span>
        </span>

        <span className="footer-right">
          <Tippy content="view commit" placement="top">
            <a
              className="footer-sha"
              href={`https://github.com/wiktorspryszynski/website/commit/${__GIT_SHA__}`}
              target="_blank"
              rel="noreferrer"
            >{__GIT_SHA__}</a>
          </Tippy>

          <div ref={dropRef} className={`footer-drop${linksOpen ? ' open' : ''}`}>
            <button
              className="footer-drop-trigger footer-link"
              onClick={() => setLinksOpen(v => !v)}
              aria-expanded={linksOpen}
            >
              links
            </button>
            {linksOpen && (
              <div className="footer-drop-menu" role="menu">
                {SITE_LINKS.map(({ label, href, internal }) =>
                  internal
                    ? <Link key={href} to={href} className="footer-drop-item" role="menuitem" onClick={() => setLinksOpen(false)}>{label}</Link>
                    : <a key={href} href={href} className="footer-drop-item" role="menuitem" onClick={() => setLinksOpen(false)}>{label}</a>
                )}
              </div>
            )}
          </div>

          <button
            ref={btnRef}
            className={`term-toggle${glowed ? ` term-glow-${GLOW_STYLE}` : ''}`}
            type="button"
            onClick={onTerminalOpen}
          >
            <span className="term-hit">tty</span><kbd>`</kbd>
          </button>
        </span>
      </div>
    </footer>
  )
}
