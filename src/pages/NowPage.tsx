import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Arrow from '../components/Arrow'

export default function NowPage() {
  useEffect(() => {
    document.title = 'Now - Wiktor Spryszyński'
    return () => { document.title = 'Wiktor Spryszyński' }
  }, [])

  return (
    <main className="now-page">
      <div className="now-inner">
        <Link to="/" className="now-back"><Arrow direction="left" /> back</Link>
        <h1 className="now-title">Now</h1>
        <p className="now-meta">Updated June 2026 · Gdańsk, Poland</p>
        <div className="now-body">
          <p>
            A snapshot of what has my attention right now — inspired by{' '}
            <a className="now-link" href="https://nownownow.com/about" target="_blank" rel="noopener noreferrer">
              Derek Sivers' /now page<Arrow />
            </a>.
          </p>

          <section className="now-section">
            <h2 className="now-label">Building</h2>
            <p>
              Polishing v2 of this site — the Three.js orb, the terminal, and a pile of small
              interactions. Next up is wiring a real backend so the API showcase and the visitor
              counter stop being mock-ups.
            </p>
          </section>

          <section className="now-section">
            <h2 className="now-label">Learning</h2>
            <ul className="now-list">
              <li>Going deeper on TypeScript and clean, boring-on-purpose architecture.</li>
              <li>Python &amp; FastAPI on the backend, with PostgreSQL and Redis.</li>
              <li>Docker for repeatable environments, and Deck.gl for data-heavy visuals.</li>
            </ul>
          </section>

          <section className="now-section">
            <h2 className="now-label">Open to</h2>
            <p>
              Interesting full-stack work and collaborations. If something here resonates,{' '}
              <Link to="/#contact" className="now-link">get in touch</Link>.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
