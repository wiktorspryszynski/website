import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface PronunciationPopProps {
  isOpen: boolean
  anchorRect: DOMRect | null
  onClose: () => void
}

export default function PronunciationPop({ isOpen, anchorRect, onClose }: PronunciationPopProps) {
  const popRef = useRef<HTMLDivElement>(null)
  const [synthVoice, setSynthVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [playingBtn, setPlayingBtn] = useState<string | null>(null)
  const [pos, setPos] = useState({ left: 0, top: 0 })

  useEffect(() => {
    if (!('speechSynthesis' in window)) return
    function pickVoice() {
      const voices = window.speechSynthesis.getVoices()
      const v = voices.find(v => /pl(-|_)?PL/i.test(v.lang)) ||
                voices.find(v => /^pl/i.test(v.lang)) || null
      setSynthVoice(v)
    }
    pickVoice()
    window.speechSynthesis.addEventListener('voiceschanged', pickVoice)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', pickVoice)
  }, [])

  useEffect(() => {
    if (!isOpen || !anchorRect || !popRef.current) return
    const popW = popRef.current.offsetWidth || 360
    let left = anchorRect.left
    const maxLeft = window.innerWidth - popW - 16
    if (left > maxLeft) left = maxLeft
    if (left < 16) left = 16
    setPos({ left, top: anchorRect.bottom + 14 })
  }, [isOpen, anchorRect])

  useEffect(() => {
    if (!isOpen) return
    function reposition() {
      if (!anchorRect || !popRef.current) return
      const popW = popRef.current.offsetWidth || 360
      let left = anchorRect.left
      const maxLeft = window.innerWidth - popW - 16
      if (left > maxLeft) left = maxLeft
      if (left < 16) left = 16
      setPos({ left, top: anchorRect.bottom + 14 })
    }
    window.addEventListener('resize', reposition)
    window.addEventListener('scroll', reposition, { passive: true })
    return () => {
      window.removeEventListener('resize', reposition)
      window.removeEventListener('scroll', reposition)
    }
  }, [isOpen, anchorRect])

  useEffect(() => {
    if (!isOpen) return
    function handleOutside(e: MouseEvent) {
      if (!popRef.current) return
      if (popRef.current.contains(e.target as Node)) return
      onClose()
    }
    setTimeout(() => document.addEventListener('click', handleOutside), 0)
    return () => document.removeEventListener('click', handleOutside)
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setPlayingBtn(null)
    }
  }, [isOpen])

  function speak(mode: string) {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance('Wiktor Spryszyński')
    if (synthVoice) {
      u.voice = synthVoice
      u.lang = synthVoice.lang
    } else {
      u.lang = 'pl-PL'
    }
    u.rate = 0.92
    u.pitch = 1
    setPlayingBtn(mode)
    u.onend = () => setPlayingBtn(null)
    u.onerror = () => setPlayingBtn(null)
    window.speechSynthesis.speak(u)
    setTimeout(() => setPlayingBtn(null), 2200)
  }

  return createPortal(
    <div
      ref={popRef}
      className={`pron-pop${isOpen ? ' show' : ''}`}
      style={{ left: pos.left, top: pos.top }}
    >
      <div className="pron-header">
        <span className="pron-flag" aria-hidden="true"><span /><span /></span>
        polish pronunciation
      </div>
      <div className="pron-row">
        <span className="lab">ipa</span>
        <span className="val">[ spr<em>ɨ</em>ˈʂɨɲski ]</span>
        <button className={`pron-play${playingBtn === 'ipa' ? ' playing' : ''}`} onClick={() => speak('ipa')} aria-label="play">▶</button>
      </div>
      <div className="pron-row">
        <span className="lab">say it</span>
        <span className="val">sprih–<em>SHIN</em>–skee</span>
        <button className={`pron-play${playingBtn === 'easy' ? ' playing' : ''}`} onClick={() => speak('easy')} aria-label="play">▶</button>
      </div>
      <div className="pron-row">
        <span className="lab">tip</span>
        <span className="val" style={{ fontSize: 11, color: 'var(--muted)' }}>
          ń sounds like the <em style={{ color: 'var(--accent)', fontStyle: 'normal' }}>ni</em> in "onion"
        </span>
      </div>
    </div>,
    document.body
  )
}
