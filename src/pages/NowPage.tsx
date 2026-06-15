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
          <p>This page is a work in progress. Check back soon.</p>
        </div>
      </div>
    </main>
  )
}
