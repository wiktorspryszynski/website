import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface WwwEggProps {
  isOpen: boolean
  anchorRect: DOMRect | null
  onClose: () => void
}

function spawnPackets(rect: DOMRect) {
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const labels = ['www', 'W', '://', 'http', 'W', 'www.', '://', 'W', 'www']
  for (let i = 0; i < 9; i++) {
    const p = document.createElement('div')
    p.className = 'www-packet'
    p.textContent = labels[i % 9]
    const angle = (Math.PI * 2 * i) / 9 + (Math.random() - 0.5) * 0.4
    const dist = 200 + Math.random() * 160
    p.style.left = cx + 'px'
    p.style.top = cy + 'px'
    p.style.setProperty('--dx', Math.cos(angle) * dist + 'px')
    p.style.setProperty('--dy', Math.sin(angle) * dist + 'px')
    p.style.animationDelay = (i * 30) + 'ms'
    document.body.appendChild(p)
    setTimeout(() => p.remove(), 1700)
  }
}

function rollCounter(el: HTMLElement, final: number) {
  const digits = String(final).padStart(7, '0')
  let i = 0
  const tick = () => {
    const partial = digits.split('').map((d, idx) =>
      idx < i ? d : String(Math.floor(Math.random() * 10))
    ).join('')
    el.textContent = partial
    i++
    if (i <= digits.length) setTimeout(tick, 80)
    else el.textContent = digits
  }
  tick()
}

export default function WwwEgg({ isOpen, anchorRect, onClose }: WwwEggProps) {
  const [visitorBase] = useState(() => 31415 + Math.floor(Math.random() * 800))
  const visitorRef = useRef(visitorBase)
  const counterRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && anchorRect) {
      spawnPackets(anchorRect)
      visitorRef.current++
      if (counterRef.current) rollCounter(counterRef.current, visitorRef.current)
    }
  }, [isOpen, anchorRect])

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === stageRef.current) onClose()
  }

  return createPortal(
    <div
      ref={stageRef}
      className={`www-stage${isOpen ? ' show' : ''}`}
      onClick={handleBackdropClick}
    >
      <div className="www-window" role="dialog" aria-label="Web 1.0 easter egg">
        <div className="www-titlebar">
          <span>★ wiktor's homepage — Netscape Navigator 3.0</span>
          <button className="www-titlebar-x" aria-label="close" onClick={onClose}>×</button>
        </div>
        <div className="www-content">
          <div className="www-marquee">
            <div className="www-marquee-track">
              <span className="star">★</span><span>welcome to my homepage</span>
              <span className="star">★</span><span>best viewed in 800×600</span>
              <span className="star">★</span><span>under construction</span>
              <span className="star">★</span><span>sign my guestbook</span>
              <span className="star">★</span><span>this site is HOT</span>
              <span className="star">★</span>
            </div>
          </div>
          <div className="www-body">
            <h3>W &middot; W &middot; W</h3>
            <div>You are visitor number:</div>
            <div className="www-counter" ref={counterRef}>0000000</div>
            <div className="www-tag">page last updated <b>May 14, 1996</b></div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
