import { useCallback, useEffect, useRef, useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { t } from '../data/homeContent'
import { colorJson } from '../utils/colorJson'
import T from './T'

interface FetchState {
  statusState: 'loading' | 'ok' | 'err'
  statusText: string
  bodyHtml: string
  metaText: string
  urlText: string
  spinning: boolean
}

function localFallback() {
  const now = new Date()
  return {
    ok: true,
    data: {
      time_utc: now.toISOString(),
      timezone: 'Europe/Warsaw',
      location: { city: 'Gdańsk', lat: 54.35, lon: 18.65 },
      open_to_work: true,
      coffee_today: Math.floor(Math.random() * 4) + 1,
    },
    _meta: { source: 'stub', latency_ms: 0 },
  }
}

export default function FetcherWidget() {
  const { lang } = useLang()
  const [state, setState] = useState<FetchState>({
    statusState: 'loading',
    statusText: '…',
    bodyHtml: '<span class="dim">// connecting…</span>',
    metaText: t(lang, 'awaiting response', 'oczekiwanie'),
    urlText: '/api/now (stub)',
    spinning: false,
  })
  const spinTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const refreshRef = useRef<HTMLButtonElement>(null)
  const endpoint = ''

  const fetchOnce = useCallback(async () => {
    setState(s => ({
      ...s,
      statusState: 'loading',
      statusText: '…',
      bodyHtml: '<span class="dim">// requesting…</span><span class="cursor"></span>',
      urlText: endpoint || '/api/now (stub)',
      spinning: true,
    }))

    if (spinTimerRef.current) clearTimeout(spinTimerRef.current)

    const t0 = performance.now()
    try {
      let data: unknown
      if (endpoint) {
        const res = await fetch(endpoint, { headers: { accept: 'application/json' } })
        const ct = res.headers.get('content-type') || ''
        data = ct.includes('application/json') ? await res.json() : { raw: await res.text() }
        if (!res.ok) throw Object.assign(new Error('HTTP ' + res.status), { httpStatus: res.status, data })
      } else {
        await new Promise(r => setTimeout(r, 360 + Math.random() * 260))
        data = localFallback()
      }
      const ms = Math.max(1, Math.round(performance.now() - t0))
      if (data && typeof data === 'object' && '_meta' in data) {
        (data as { _meta: { latency_ms: number } })._meta.latency_ms = ms
      }
      setState(s => ({
        ...s,
        statusState: 'ok',
        statusText: '200',
        bodyHtml: colorJson(data),
        metaText: `${ms}ms · ${endpoint ? 'live' : 'stub'}`,
      }))
    } catch (err) {
      const ms = Math.max(1, Math.round(performance.now() - t0))
      const errMsg = err instanceof Error ? err.message : String(err)
      setState(s => ({
        ...s,
        statusState: 'err',
        statusText: 'ERR',
        bodyHtml: colorJson({ ok: false, error: errMsg }),
        metaText: `${ms}ms · failed`,
      }))
    } finally {
      spinTimerRef.current = setTimeout(() => {
        setState(s => ({ ...s, spinning: false }))
      }, 900)
    }
  }, [])

  useEffect(() => {
    fetchOnce()
    return () => { if (spinTimerRef.current) clearTimeout(spinTimerRef.current) }
  }, [fetchOnce])

  // Trigger CSS animation restart by toggling class
  const prevSpinning = useRef(false)
  useEffect(() => {
    const btn = refreshRef.current
    if (!btn) return
    if (state.spinning && !prevSpinning.current) {
      btn.classList.remove('spinning')
      void btn.offsetWidth
      btn.classList.add('spinning')
    } else if (!state.spinning) {
      btn.classList.remove('spinning')
    }
    prevSpinning.current = state.spinning
  }, [state.spinning])

  return (
    <aside className="fetcher" aria-label="Live API demo">
      <header className="fetcher-head">
        <span className="fetcher-method">GET</span>
        <span className="fetcher-url">{state.urlText}</span>
        <span className="fetcher-status" data-state={state.statusState}>
          <i className="fetcher-status-dot" />
          <span className="fetcher-status-text">{state.statusText}</span>
        </span>
      </header>
      <pre
        className="fetcher-body"
        dangerouslySetInnerHTML={{ __html: state.bodyHtml }}
      />
      <footer className="fetcher-foot">
        <span className="dim">{state.metaText}</span>
        <button
          className="fetcher-refresh"
          ref={refreshRef}
          onClick={fetchOnce}
          aria-label="Refresh"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 12a9 9 0 0 1 15.6-6.2L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-15.6 6.2L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
          <span><T en="refresh" pl="odśwież" /></span>
        </button>
      </footer>
    </aside>
  )
}
