import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { type TerminalLine, runCommand } from '../utils/terminalCommands'

interface TerminalOverlayProps {
  isOpen: boolean
  onClose: () => void
}

const BOOT_LINES: TerminalLine[] = [
  { text: "type `help` for commands.", cls: 'dim' },
  { text: '', cls: 'out' },
]

const CONFETTI_COLORS = ['#ff0', '#f0f', '#0ff', '#f80', '#0f8', '#f44']

function MatrixEffect({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const W = canvas.offsetWidth
    const H = canvas.offsetHeight
    canvas.width = W
    canvas.height = H

    const FS = 14
    const cols = Math.floor(W / FS)
    const drops = Array.from({ length: cols }, () => Math.random() * -40)
    const CHARS = 'アイウエオカキクケコサシスセソ0123456789ABCDEF<>{}[]|/\\'

    const draw = () => {
      ctx.fillStyle = 'rgba(10,10,11,0.08)'
      ctx.fillRect(0, 0, W, H)
      ctx.font = `${FS}px monospace`
      drops.forEach((y, i) => {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)]
        ctx.fillStyle = '#aaffaa'
        ctx.fillText(char, i * FS, y * FS)
        ctx.fillStyle = '#00c41a'
        ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], i * FS, (y - 1) * FS)
        if (y * FS > H && Math.random() > 0.975) drops[i] = 0
        drops[i] += 0.6
      })
    }

    const interval = setInterval(draw, 40)
    const timeout = setTimeout(() => { clearInterval(interval); onDone() }, 4000)
    return () => { clearInterval(interval); clearTimeout(timeout) }
  }, [onDone])

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 10 }} />
}

function PartyEffect({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3500)
    return () => clearTimeout(t)
  }, [onDone])

  const [pieces] = useState(() =>
    Array.from({ length: 60 }, (_, i) => {
      const fromLeft = i < 30
      return {
        id: i,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        left: fromLeft ? Math.random() * 30 : 70 + Math.random() * 30,
        delay: Math.random() * 0.5,
        duration: 1.2 + Math.random() * 1,
        size: 6 + Math.random() * 6,
        rotate: Math.random() * 360,
        circle: Math.random() > 0.5,
      }
    })
  )

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 10 }}>
      {pieces.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          bottom: '-10px',
          left: `${p.left}%`,
          width: p.size,
          height: p.size,
          background: p.color,
          borderRadius: p.circle ? '50%' : '2px',
          animation: `term-confetti ${p.duration}s ${p.delay}s ease-out forwards`,
          transform: `rotate(${p.rotate}deg)`,
        }} />
      ))}
    </div>
  )
}

export default function TerminalOverlay({ isOpen, onClose }: TerminalOverlayProps) {
  const [lines, setLines] = useState<TerminalLine[]>(BOOT_LINES)
  const [inputVal, setInputVal] = useState('')
  const [history, setHistory] = useState<string[]>(() => {
    try { return JSON.parse(sessionStorage.getItem('term-history') ?? '[]') } catch { return [] }
  })
  const [histIdx, setHistIdx] = useState(-1)
  const [effect, setEffect] = useState<'matrix' | 'party' | null>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const clearEffect = useCallback(() => setEffect(null), [])

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 40)
  }, [isOpen])

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [lines])

  function submitCommand(raw: string) {
    const cmdLine: TerminalLine = { text: raw, cls: 'cmd' }
    const result = runCommand(raw)

    if (result.special === 'clear') {
      setLines(BOOT_LINES)
      return
    }
    if (result.special === 'exit') {
      onClose()
      return
    }

    setLines(prev => [...prev, cmdLine, ...result.lines])

    if (raw.trim()) {
      setHistory(h => {
        const next = [...h, raw]
        sessionStorage.setItem('term-history', JSON.stringify(next))
        return next
      })
      setHistIdx(-1)
    }

    if (result.special === 'hire') {
      setTimeout(() => {
        window.location.href = "mailto:spryszynskiwiktor@gmail.com?subject=Let%27s%20talk&body=Hi%20Wiktor%2C"
      }, 350)
    }
    if (result.special === 'sudo-hire') {
      setTimeout(() => {
        window.location.href = "mailto:spryszynskiwiktor@gmail.com?subject=URGENT%3A%20Let%27s%20talk&body=Hi%20Wiktor%2C"
      }, 350)
    }
    if (result.special === 'matrix') setEffect('matrix')
    if (result.special === 'party')  setEffect('party')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const val = inputVal
      setInputVal('')
      submitCommand(val)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length === 0) return
      const idx = histIdx === -1 ? history.length - 1 : Math.max(0, histIdx - 1)
      setHistIdx(idx)
      setInputVal(history[idx] || '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (histIdx === -1) return
      const idx = histIdx + 1
      if (idx >= history.length) {
        setHistIdx(-1)
        setInputVal('')
      } else {
        setHistIdx(idx)
        setInputVal(history[idx] || '')
      }
    }
  }

  return createPortal(
    <div id="term" className={`term-overlay${isOpen ? ' open' : ''}`} aria-hidden={!isOpen}>
      <div className="term-window" role="dialog" aria-label="Terminal">
        {effect === 'matrix' && <MatrixEffect onDone={clearEffect} />}
        {effect === 'party'  && <PartyEffect  onDone={clearEffect} />}
        <div className="term-head">
          <div className="dots">
            <span onClick={onClose} role="button" aria-label="Close terminal" title="close" />
            <span />
            <span />
          </div>
          <div className="title">~ %</div>
          <button id="term-close" className="x" aria-label="Close" onClick={onClose}>esc</button>
        </div>
        <div className="term-body" ref={bodyRef}>
          {lines.map((line, i) =>
            line.html ? (
              <div key={i} className={`term-line ${line.cls}`} dangerouslySetInnerHTML={{ __html: line.text }} />
            ) : (
              <div key={i} className={`term-line ${line.cls}`}>{line.text}</div>
            )
          )}
        </div>
        <div className="term-input-row">
          <span className="prompt">~ %</span>
          <input
            ref={inputRef}
            type="text"
            autoComplete="off"
            spellCheck={false}
            autoCapitalize="off"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </div>,
    document.body
  )
}
