import { useEffect, useRef, useState } from 'react'
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

export default function TerminalOverlay({ isOpen, onClose }: TerminalOverlayProps) {
  const [lines, setLines] = useState<TerminalLine[]>([])
  const [inputVal, setInputVal] = useState('')
  const [history, setHistory] = useState<string[]>(() => {
    try { return JSON.parse(sessionStorage.getItem('term-history') ?? '[]') } catch { return [] }
  })
  const [histIdx, setHistIdx] = useState(-1)
  const booted = useRef(false)
  const bodyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      if (!booted.current) {
        setLines(BOOT_LINES)
        booted.current = true
      }
      setTimeout(() => inputRef.current?.focus(), 40)
    }
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
