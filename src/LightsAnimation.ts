class LightsAnimation {
  private container: HTMLElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private width: number = 0;
  private height: number = 0;
  private dpr: number = Math.max(1, window.devicePixelRatio || 1);
  private pointer: { x: number; y: number } = { x: 0, y: 0 };
  private isDown: boolean = false;
  private grabbedIdx: number | null = null;
  private reduceMotion: boolean = false;
  private orbs: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    freqX: number;
    freqY: number;
    phaseX: number;
    phaseY: number;
    baseSpeed: number;
    repulseStrength: number;
    radius: number;
    color: string;
  }> = [];
  private rafId: number | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    container.appendChild(this.canvas);

    const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.reduceMotion = mqReduced.matches;

    this.resize();
    window.addEventListener('resize', this.resize.bind(this));

    window.addEventListener('pointermove', this.handlePointerMove.bind(this));
    window.addEventListener('pointerdown', this.handlePointerDown.bind(this));
    window.addEventListener('pointerup', this.handlePointerUp.bind(this));
    window.addEventListener('pointercancel', this.handlePointerUp.bind(this));

    if (typeof mqReduced.addEventListener === 'function') {
      mqReduced.addEventListener('change', this.handleMotionChange.bind(this));
    } else if (typeof mqReduced.addListener === 'function') {
      mqReduced.addListener(this.handleMotionChange.bind(this));
    }

    this.initializeOrbs();
  }

  private resize = () => {
    const rect = this.container.getBoundingClientRect();
    if (!rect || !this.ctx) return;
    this.width = Math.floor(rect.width);
    this.height = Math.floor(rect.height);
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  };

  private handlePointerMove = (e: PointerEvent) => {
    this.pointer.x = e.clientX;
    this.pointer.y = e.clientY;
  };

  private handlePointerDown = () => {
    this.isDown = true;
    const grabRadius = 120;
    let best = { idx: null as number | null, dist: Infinity };
    for (let i = 0; i < this.orbs.length; i++) {
      const o = this.orbs[i];
      const d = Math.hypot(o.x - this.pointer.x, o.y - this.pointer.y);
      if (d < best.dist) best = { idx: i, dist: d };
    }
    this.grabbedIdx = best.dist < grabRadius ? best.idx : null;
  };

  private handlePointerUp = () => {
    this.isDown = false;
    this.grabbedIdx = null;
  };

  private handleMotionChange = (e: MediaQueryListEvent) => {
    this.reduceMotion = e.matches;
  };

  private initializeOrbs() {
    const baseRadius = Math.min(window.innerWidth, window.innerHeight);
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    this.orbs = Array.from({ length: 4 }).map((_, i) => ({
      x: rand(0.2 * this.width, 0.8 * this.width),
      y: rand(0.2 * this.height, 0.8 * this.height),
      vx: rand(-0.2, 0.2),
      vy: rand(-0.2, 0.2),
      freqX: rand(0.4, 0.9),
      freqY: rand(0.3, 0.8),
      phaseX: rand(0, Math.PI * 2),
      phaseY: rand(0, Math.PI * 2),
      baseSpeed: 0.5 + i * 0.25,
      repulseStrength: 2.2 - i * 0.3,
      radius: baseRadius * (0.11 - i * 0.015),
      color: i % 2 === 0 ? 'rgba(124,92,255,' : 'rgba(0,212,255,'
    }));
  }

  private lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
  }

  private constrainOrbPosition(o: { x: number; y: number; vx: number; vy: number; radius: number }) {
    const offscreenAllowance = 120;
    const edgePaddingX = Math.min(o.radius * 0.4, this.width * 0.35);
    const edgePaddingY = Math.min(o.radius * 0.4, this.height * 0.35);
    const minX = edgePaddingX - offscreenAllowance;
    const maxX = this.width - edgePaddingX + offscreenAllowance;
    const minY = edgePaddingY - offscreenAllowance;
    const maxY = this.height - edgePaddingY + offscreenAllowance;

    if (o.x < minX) {
      o.x = minX;
      o.vx = Math.abs(o.vx) * 0.8;
    } else if (o.x > maxX) {
      o.x = maxX;
      o.vx = -Math.abs(o.vx) * 0.8;
    }

    if (o.y < minY) {
      o.y = minY;
      o.vy = Math.abs(o.vy) * 0.8;
    } else if (o.y > maxY) {
      o.y = maxY;
      o.vy = -Math.abs(o.vy) * 0.8;
    }
  }

  private draw() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.globalCompositeOperation = 'lighter';
    for (const o of this.orbs) {
      const cx = o.x, cy = o.y;
      const r = o.radius;
      const g = this.ctx.createRadialGradient(cx, cy, r * 0.05, cx, cy, r);
      g.addColorStop(0.0, o.color + '0.45)');
      g.addColorStop(0.35, o.color + '0.20)');
      g.addColorStop(1.0, o.color + '0.00)');
      this.ctx.fillStyle = g;
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.globalCompositeOperation = 'source-over';
  }

  private update(now: number) {
    const t = now * 0.001;
    const speedScale = this.reduceMotion ? 0.4 : 1.0;
    for (let i = 0; i < this.orbs.length; i++) {
      const o = this.orbs[i];
      const nx = Math.sin(t * o.freqX + o.phaseX) + Math.sin(t * o.freqX * 0.5 + o.phaseY) * 0.5;
      const ny = Math.cos(t * o.freqY + o.phaseY) + Math.cos(t * o.freqY * 0.6 + o.phaseX) * 0.5;
      const len = Math.hypot(nx, ny) || 1;
      const dvx = (nx / len) * o.baseSpeed * speedScale;
      const dvy = (ny / len) * o.baseSpeed * speedScale;
      o.vx = this.lerp(o.vx, dvx, 0.04);
      o.vy = this.lerp(o.vy, dvy, 0.04);

      if (this.isDown && this.grabbedIdx === i) {
        o.x = this.lerp(o.x, this.pointer.x, 0.45);
        o.y = this.lerp(o.y, this.pointer.y, 0.45);
        o.vx *= 0.5;
        o.vy *= 0.5;
      } else {
        o.x += o.vx;
        o.y += o.vy;
      }

      this.constrainOrbPosition(o);
    }
  }

  private loop = (now: number) => {
    this.update(now);
    this.draw();
    this.rafId = window.requestAnimationFrame ? window.requestAnimationFrame(this.loop) : setTimeout(() => this.loop(performance.now()), 16);
  };

  public start() {
    this.loop(performance.now());
  }

  public stop() {
    if (this.rafId !== null) {
      if (window.cancelAnimationFrame) {
        window.cancelAnimationFrame(this.rafId);
      } else {
        clearTimeout(this.rafId);
      }
      this.rafId = null;
    }
  }
}

export default LightsAnimation;
