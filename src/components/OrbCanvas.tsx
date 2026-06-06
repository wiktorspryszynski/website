import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { SPIKES_ENABLED } from '../config/features'

export default function OrbCanvas() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const w = () => mount.clientWidth
    const h = () => mount.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, w() / h(), 0.1, 100)
    camera.position.set(0, 0, 8)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w(), h())
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // Inner sphere — displaced wireframe
    const geom = new THREE.IcosahedronGeometry(2.0, 3)
    const posAttr = geom.attributes.position as THREE.BufferAttribute
    const posArr = posAttr.array as Float32Array
    const original = posArr.slice(0)

    const mat = new THREE.LineBasicMaterial({ color: 0xebe9e3, transparent: true, opacity: 0.12 })
    const edgeMesh = new THREE.LineSegments(new THREE.WireframeGeometry(geom), mat)
    scene.add(edgeMesh)

    // Outer shell
    const shellGeom = new THREE.IcosahedronGeometry(2.7, 1)
    const shellMat = new THREE.LineBasicMaterial({ color: 0xebe9e3, transparent: true, opacity: 0.05 })
    const shell = new THREE.LineSegments(new THREE.WireframeGeometry(shellGeom), shellMat)
    scene.add(shell)

    // Stars
    const starCount = 220
    const starsGeom = new THREE.BufferGeometry()
    const starsPos = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      const r = 14 + Math.random() * 18
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      starsPos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      starsPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      starsPos[i * 3 + 2] = r * Math.cos(phi)
    }
    starsGeom.setAttribute('position', new THREE.BufferAttribute(starsPos, 3))
    const starsMat = new THREE.PointsMaterial({ color: 0xebe9e3, size: 0.025, sizeAttenuation: true, transparent: true, opacity: 0.45 })
    const stars = new THREE.Points(starsGeom, starsMat)
    scene.add(stars)

    const target = { x: 0, y: 0 }
    const eased = { x: 0, y: 0 }
    let isDragging = false
    let lastX = 0, lastY = 0
    let dragRotX = 0, dragRotY = 0
    let velX = 0, velY = 0

    let spikeStartTime = -999
    let pointerDownX = 0, pointerDownY = 0
    let hasDragged = false

    function isClickOnOrb(clientX: number, clientY: number): boolean {
      const offX = window.innerWidth > 880 ? 2.2 : 0
      const center = new THREE.Vector3(offX, 0, 0)
      const edge = new THREE.Vector3(offX + 2.7, 0, 0)
      center.project(camera)
      edge.project(camera)
      const cx = (center.x * 0.5 + 0.5) * window.innerWidth
      const cy = (-center.y * 0.5 + 0.5) * window.innerHeight
      const r = Math.abs((edge.x * 0.5 + 0.5) * window.innerWidth - cx)
      return (clientX - cx) ** 2 + (clientY - cy) ** 2 < r * r
    }

    function isHeroArea(e: PointerEvent) {
      const el = e.target as Element | null
      if (el?.closest('a, button, input, textarea, .top, .term-overlay, .nav, .lang, .fetcher, .pron-pop, .www-window, .links, .contact-list, .proj, .name .egg')) return false
      if (window.scrollY > window.innerHeight * 0.7) return false
      return true
    }

    const handlePointerDown = (e: PointerEvent) => {
      if (!isHeroArea(e)) return
      isDragging = true
      lastX = e.clientX; lastY = e.clientY
      pointerDownX = e.clientX; pointerDownY = e.clientY
      hasDragged = false
      velX = 0; velY = 0
      document.body.classList.add('dragging-orb')
      window.getSelection()?.removeAllRanges()
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (isDragging) {
        const dx = (e.clientX - lastX) * 0.006
        const dy = (e.clientY - lastY) * 0.006
        dragRotY += dx; dragRotX += dy
        velX = dx; velY = dy
        lastX = e.clientX; lastY = e.clientY
        if (SPIKES_ENABLED) {
          const totalMove = Math.abs(e.clientX - pointerDownX) + Math.abs(e.clientY - pointerDownY)
          if (totalMove > 6) hasDragged = true
        }
        if (e.cancelable) e.preventDefault()
      } else {
        target.x = (e.clientX / window.innerWidth - 0.5) * 2
        target.y = (e.clientY / window.innerHeight - 0.5) * 2
      }
    }

    const endDrag = (e: PointerEvent) => {
      if (!isDragging) return
      isDragging = false
      document.body.classList.remove('dragging-orb')
      if (SPIKES_ENABLED && !hasDragged && isHeroArea(e) && isClickOnOrb(e.clientX, e.clientY)) spikeStartTime = timer.getElapsed()
    }

    const handlePointerMoveCursor = (e: PointerEvent) => {
      if (isDragging) return
      if (isHeroArea(e)) document.body.style.cursor = 'grab'
      else if (document.body.style.cursor === 'grab') document.body.style.cursor = ''
    }

    const endDragBlur = () => { isDragging = false; document.body.classList.remove('dragging-orb') }

    let lastScrollY = window.scrollY
    const handleScroll = () => {
      const dy = window.scrollY - lastScrollY
      velY += dy * 0.00004
      lastScrollY = window.scrollY
    }

    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', endDrag)
    window.addEventListener('pointercancel', endDrag)
    window.addEventListener('blur', endDragBlur)
    window.addEventListener('scroll', handleScroll)
    document.addEventListener('pointermove', handlePointerMoveCursor)

    const onResize = () => {
      camera.aspect = w() / h()
      camera.updateProjectionMatrix()
      renderer.setSize(w(), h())
      const offX = window.innerWidth > 880 ? 2.2 : 0
      edgeMesh.position.x = offX
      shell.position.x = offX
    }
    onResize()
    window.addEventListener('resize', onResize)

    const timer = new THREE.Timer()

    function noise(x: number, y: number, z: number, t: number) {
      return (
        Math.sin(x * 1.3 + t * 0.7) * 0.5 +
        Math.sin(y * 1.7 - t * 0.5) * 0.3 +
        Math.sin(z * 1.1 + t * 0.9) * 0.4
      )
    }

    const beatHashes = [
      [7.3, 4.1, 9.7],
      [3.1, 8.7, 2.3],
      [5.9, 1.3, 6.7],
      [9.1, 3.7, 4.9],
    ]

    function rebuildEdges() {
      const elapsed = timer.getElapsed()
      const spikeAge = elapsed - spikeStartTime
      const spikeEnvelope = SPIKES_ENABLED && spikeAge < 2.2
        ? Math.abs(Math.sin(spikeAge * 11)) * Math.exp(-spikeAge * 2.8)
        : 0

      const beatIndex = Math.floor(spikeAge * 11 / Math.PI) % beatHashes.length
      const [ha, hb, hc] = SPIKES_ENABLED && spikeEnvelope > 0 ? beatHashes[beatIndex] : beatHashes[0]

      for (let i = 0; i < posAttr.count; i++) {
        const ox = original[i * 3]
        const oy = original[i * 3 + 1]
        const oz = original[i * 3 + 2]
        const t = elapsed * 0.25
        const n = noise(ox, oy, oz, t)
        const perVertex = Math.pow(Math.abs(Math.sin(ox * ha + oy * hb + oz * hc)), 5)
        const s = 1 + 0.05 * n + spikeEnvelope * perVertex * 2.2
        posArr[i * 3] = ox * s
        posArr[i * 3 + 1] = oy * s
        posArr[i * 3 + 2] = oz * s
      }
      posAttr.needsUpdate = true
      geom.computeVertexNormals()
      const newWireGeom = new THREE.WireframeGeometry(geom)
      edgeMesh.geometry.dispose()
      edgeMesh.geometry = newWireGeom
    }

    let animId: number
    let frame = 0

    function tick() {
      timer.update()
      const t = timer.getElapsed()
      if (frame % 3 === 0) rebuildEdges()
      frame++

      edgeMesh.rotation.y = t * 0.06 + dragRotY
      edgeMesh.rotation.x = t * 0.03 + dragRotX
      shell.rotation.y = -t * 0.04 + dragRotY * 0.5
      shell.rotation.z = t * 0.02

      if (!isDragging) {
        dragRotY += velX; dragRotX += velY
        velX *= 0.94; velY *= 0.94
      }

      stars.rotation.y = t * 0.005
      eased.x += (target.x - eased.x) * 0.04
      eased.y += (target.y - eased.y) * 0.04
      camera.position.x = eased.x * 0.5
      camera.position.y = -eased.y * 0.3
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
      animId = requestAnimationFrame(tick)
    }
    animId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', endDrag)
      window.removeEventListener('pointercancel', endDrag)
      window.removeEventListener('blur', endDragBlur)
      document.removeEventListener('pointermove', handlePointerMoveCursor)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', onResize)
      document.body.classList.remove('dragging-orb')
      if (document.body.style.cursor === 'grab') document.body.style.cursor = ''
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div id="orb" className="orb" aria-hidden="true" ref={mountRef} />
}
