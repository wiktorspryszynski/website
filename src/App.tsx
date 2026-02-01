import { useEffect } from 'react';
import './styles.css';

function App() {
  useEffect(() => {
    // Lights animation script
    const container = document.getElementById('lights');
    if (!container) return;

    const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduceMotion = mqReduced.matches;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    container.appendChild(canvas);

    let width = 0, height = 0, dpr = Math.max(1, window.devicePixelRatio || 1);
    function resize() {
      const rect = container?.getBoundingClientRect();
      if (!rect || !ctx) return;
      width = Math.floor(rect.width);
      height = Math.floor(rect.height);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    const pointer = { x: width * 0.5, y: height * 0.4 };
    let isDown = false;
    let grabbedIdx: number | null = null;

    window.addEventListener('pointermove', (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    });

    function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

    // 4 orbs: independent drift + motion and repulsion parameters
    const baseRadius = Math.min(window.innerWidth, window.innerHeight);
    function rand(a: number, b: number){ return a + Math.random() * (b - a); }
    const orbs = Array.from({ length: 4 }).map((_, i) => ({
      x: rand(0.2 * width, 0.8 * width),
      y: rand(0.2 * height, 0.8 * height),
      vx: rand(-0.2, 0.2),
      vy: rand(-0.2, 0.2),
      freqX: rand(0.4, 0.9),   // Hz (after time scaling)
      freqY: rand(0.3, 0.8),
      phaseX: rand(0, Math.PI * 2),
      phaseY: rand(0, Math.PI * 2),
      baseSpeed: 0.9 + i * 0.25, // px na klatkę (większa widoczność ruchu)
      repulseStrength: 2.2 - i * 0.3, // siła odpychania (mniej dla większych orbów)
      radius: baseRadius * (0.11 - i * 0.015),
      color: i % 2 === 0 ? 'rgba(124,92,255,' : 'rgba(0,212,255,'
    }));

    // Register grab events after initializing orbs
    window.addEventListener('pointerdown', () => {
      isDown = true;
      const grabRadius = 120;
      let best = { idx: null as number | null, dist: Infinity };
      for (let i = 0; i < orbs.length; i++) {
        const o = orbs[i];
        const d = Math.hypot(o.x - pointer.x, o.y - pointer.y);
        if (d < best.dist) best = { idx: i, dist: d };
      }
      grabbedIdx = best.dist < grabRadius ? best.idx : null;
    });
    window.addEventListener('pointerup', () => { isDown = false; grabbedIdx = null; });
    window.addEventListener('pointercancel', () => { isDown = false; grabbedIdx = null; });

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';
      for (const o of orbs) {
        const cx = o.x, cy = o.y;
        const r = o.radius;
        const g = ctx.createRadialGradient(cx, cy, r * 0.05, cx, cy, r);
        g.addColorStop(0.0, o.color + '0.45)');
        g.addColorStop(0.35, o.color + '0.20)');
        g.addColorStop(1.0, o.color + '0.00)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    }

    function update(now: number) {
      const t = now * 0.001; // seconds
      // const influence = 140;  // cursor influence radius
      const speedScale = reduceMotion ? 0.4 : 1.0; // gentler movement with reduced motion, but still visible
      for (let i = 0; i < orbs.length; i++) {
        const o = orbs[i];
        // Target velocity (direction from sine pseudo-noise)
        const nx = Math.sin(t * o.freqX + o.phaseX) + Math.sin(t * o.freqX * 0.5 + o.phaseY) * 0.5;
        const ny = Math.cos(t * o.freqY + o.phaseY) + Math.cos(t * o.freqY * 0.6 + o.phaseX) * 0.5;
        const len = Math.hypot(nx, ny) || 1;
        const dvx = (nx / len) * o.baseSpeed * speedScale;
        const dvy = (ny / len) * o.baseSpeed * speedScale;
        // Velocity smoothing
        o.vx = lerp(o.vx, dvx, 0.04);
        o.vy = lerp(o.vy, dvy, 0.04);

        // Grabbing an orb with the cursor: attract to cursor position
        if (isDown && grabbedIdx === i) {
          o.x = lerp(o.x, pointer.x, 0.45);
          o.y = lerp(o.y, pointer.y, 0.45);
          // Velocity damping to maintain control
          o.vx *= 0.5;
          o.vy *= 0.5;
        } else {
          // Repulsion by cursor
          /*
          const dx = o.x - pointer.x;
          const dy = o.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist > 0 && dist < influence) {
            const force = (1 - dist / influence) * o.repulseStrength;
            o.vx += (dx / dist) * force;
            o.vy += (dy / dist) * force;
          }
          */

          // Motion integration
          o.x += o.vx;
          o.y += o.vy;
        }
      }
    }

    // Always run the animation; scale intensity under reduced motion
    const raf = window.requestAnimationFrame ? (cb: FrameRequestCallback) => window.requestAnimationFrame(cb) : (cb: FrameRequestCallback) => setTimeout(() => cb(performance.now()), 16);
    function loop(now: number) {
      update(now);
      draw();
      raf(loop);
    }
    raf(loop);

    // Update setting when system preference changes
    if (typeof mqReduced.addEventListener === 'function') {
      mqReduced.addEventListener('change', (e) => { reduceMotion = e.matches; });
    } else if (typeof mqReduced.addListener === 'function') {
      mqReduced.addListener((e) => { reduceMotion = e.matches; });
    }
  }, []);

  useEffect(() => {
    // Email popover interactions: toggle, copy-to-clipboard, and outside-click close
    const toggleBtn = document.getElementById('email-toggle') as HTMLButtonElement | null;
    const pop = document.getElementById('email-popover') as HTMLDivElement | null;
    const social = toggleBtn ? toggleBtn.closest('.social') : null;
    const emailSpan = document.getElementById('email-value');
    const copyBtn = document.getElementById('copy-email');
    if (!toggleBtn || !pop || !emailSpan || !copyBtn || !social) return;

    function positionPopover() {
      const tb = toggleBtn?.getBoundingClientRect();
      const sb = social?.getBoundingClientRect();
      const left = Math.round(tb!.left - sb!.left);
      const top = Math.round(tb!.bottom - sb!.top + 10);
      pop!.style.left = left + 'px';
      pop!.style.top = top + 'px';
    }

    function openPop() {
      positionPopover();
      pop!.hidden = false;
      toggleBtn?.setAttribute('aria-expanded', 'true');
    }
    function closePop() {
      pop!.hidden = true;
      toggleBtn?.setAttribute('aria-expanded', 'false');
    }
    function togglePop() { pop!.hidden ? openPop() : closePop(); }

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePop();
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (pop!.hidden) return;
      const target = e.target as Node;
      if (!target) return;
      if (!pop!.contains(target) && target !== toggleBtn && !toggleBtn.contains(target)) {
        closePop();
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !pop!.hidden) closePop();
    });

    // Reposition on resize while open
    window.addEventListener('resize', () => { if (!pop!.hidden) positionPopover(); });
    // Copy email to clipboard with quick feedback
    copyBtn.addEventListener('click', async () => {
      const email = emailSpan.textContent || '';
      try {
        await navigator.clipboard.writeText(email);
        copyBtn.setAttribute('aria-label', 'Skopiowano!');
        copyBtn.title = 'Skopiowano!';
        setTimeout(() => {
          copyBtn.setAttribute('aria-label', 'Kopiuj email');
          copyBtn.title = 'Kopiuj';
        }, 1200);
      } catch (_) {
        // Fallback: select and copy via execCommand if needed (best-effort)
        const range = document.createRange();
        range.selectNodeContents(emailSpan);
        const sel = window.getSelection();
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(range);
          document.execCommand('copy');
          sel.removeAllRanges();
        }
      }
    });
  }, []);

  return (
    <>
      <div id="lights" aria-hidden="true"></div>
      <header role="banner">
        <div className="container header-bar">
          <div className="brand" aria-label="Wiktor Spryszyński">
            <div className="name-and-surname">Wiktor Spryszyński</div>
          </div>
        </div>
      </header>

      <main className="container" id="main" role="main">
        <section className="hero" aria-labelledby="hero-title">
          <h1 id="hero-title">Cześć! Tworzę projekty webowe i eksperymenty.</h1>
          <p>Na tej stronie znajdziesz moje realizacje — od estetycznych interfejsów po małe, pomysłowe mini-projekty. Kliknij kartę, aby zobaczyć szczegóły.</p>
          <div className="social social-bar" aria-label="Linki społecznościowe">
            <a href="https://www.linkedin.com/in/wiktor-spryszynski" target="_blank" rel="noopener" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                <defs>
                  <linearGradient id="grad-li" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--accent)" />
                    <stop offset="100%" stopColor="var(--green)" />
                  </linearGradient>
                </defs>
                <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#grad-li)" />
                <text x="12" y="15" textAnchor="middle" fontFamily="Segoe UI, Arial, sans-serif" fontSize="11" fontWeight="700" fill="#0f1115">in</text>
              </svg>
            </a>
            <a href="https://github.com/wiktorspryszynski" target="_blank" rel="noopener" aria-label="GitHub">
              <svg viewBox="0 0 16 16" role="img" aria-hidden="true">
                <defs>
                  <linearGradient id="grad-gh" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--accent)" />
                    <stop offset="100%" stopColor="var(--green)" />
                  </linearGradient>
                </defs>
                <path fill="url(#grad-gh)" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.31 6.57 5.49 7.62.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38C13.69 14.57 16 11.54 16 8c0-4.42-3.58-8-8-8z"/>
              </svg>
            </a>
            <button id="email-toggle" type="button" aria-label="Pokaż email" aria-haspopup="dialog" aria-expanded="false" aria-controls="email-popover">
              <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                <defs>
                  <linearGradient id="grad-at" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--accent)" />
                    <stop offset="100%" stopColor="var(--green)" />
                  </linearGradient>
                </defs>
                <text x="12" y="20" textAnchor="middle" fontFamily="Segoe UI, Arial, sans-serif" fontSize="22" fontWeight="500" fill="url(#grad-at)">@</text>
              </svg>
            </button>

            <div className="email-popover" id="email-popover" role="dialog" aria-label="Adres email" hidden>
              <span className="email-text" id="email-value">spryszynskiwiktor@gmail.com</span>
              <button className="icon-btn" id="copy-email" type="button" aria-label="Kopiuj email" title="Kopiuj">
                <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20">
                  <path fill="currentColor" d="M16 1H6C4.9 1 4 1.9 4 3v12h2V3h10V1zm3 4H10c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h9c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H10V7h9v14z"/>
                </svg>
              </button>
              <a className="icon-btn" id="send-email" href="mailto:spryszynskiwiktor@gmail.com" aria-label="Wyślij email" title="Wyślij">
                <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20">
                  <path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/>
                </svg>
              </a>
            </div>
          </div>
        </section>

        <section aria-labelledby="projects-title" id="projekty">
          <h2 className="section-title" id="projects-title">Projekty</h2>
          <div className="grid">
            <a className="card" href="glass.html" aria-label="Projekt Glassmorphism UI">
              <h3>Glassmorphism UI</h3>
              <p>Szklane panele, miękkie światło i nowoczesna estetyka.</p>
              <div className="tags">
                <span className="tag">UI</span>
                <span className="tag">CSS</span>
              </div>
            </a>

            <a className="card" href="valentine.html" aria-label="Projekt Walentynkowy">
              <h3>Walentynkowy projekt</h3>
              <p>Romantyczny motyw i subtelne animacje — lekki, przyjemny eksperyment.</p>
              <div className="tags">
                <span className="tag">Animacje</span>
                <span className="tag">HTML</span>
              </div>
            </a>

            <div className="card" aria-label="Projekt w przygotowaniu">
              <h3>Portfolio API</h3>
              <p>Integracja z prostym API do pobierania projektów dynamicznie.</p>
              <div className="tags">
                <span className="tag">JavaScript</span>
                <span className="tag">API</span>
              </div>
            </div>

            <div className="card" aria-label="Projekt w przygotowaniu">
              <h3>Mini-gra przeglądarkowa</h3>
              <p>Krótka gra logiczna z czystym DOM i responsywnym sterowaniem.</p>
              <div className="tags">
                <span className="tag">Game</span>
                <span className="tag">Canvas</span>
              </div>
            </div>
            <div className="card work-in-progress-card" aria-label="Sekcja w trakcie budowy" style={{border: '2px dashed var(--border)'}}>
              <h3>👷 Section under construction 🚧🚧</h3>
              <p>Sekcja projektów jest obecnie w trakcie budowy. Wróć wkrótce!</p>
              <div className="tags">
                <span className="tag">Wkrótce</span>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="contact-title" id="kontakt" style={{marginTop: '28px'}}>
          <h2 className="section-title" id="contact-title">Kontakt</h2>
          <p>Masz pytanie lub pomysł na współpracę? Napisz wiadomość — chętnie odpowiem.</p>
          <div className="actions">
            <a className="btn" href="mailto:spryszynskiwiktor@gmail.com" aria-label="Wyślij wiadomość email">Wyślij email</a>
            <a className="btn" href="#" aria-label="Zobacz profil GitHub">GitHub</a>
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
