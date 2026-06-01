// Three.js hero scene: a slowly rotating, displaced wireframe icosahedron
// with a faint glow halo, plus a starfield. Mouse parallaxes the camera.
(function () {
  const mount = document.getElementById("hero-canvas");
  if (!mount || !window.THREE) return;
  const THREE = window.THREE;

  const w = () => mount.clientWidth;
  const h = () => mount.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, w() / h(), 0.1, 100);
  camera.position.set(0, 0, 7);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w(), h());
  renderer.setClearColor(0x000000, 0);
  mount.appendChild(renderer.domElement);

  // Geometry: icosahedron, subdivided
  const geom = new THREE.IcosahedronGeometry(2.2, 4);
  const positionAttr = geom.attributes.position;
  const original = positionAttr.array.slice(0);

  // Wireframe material
  const mat = new THREE.MeshBasicMaterial({
    color: 0xf4f1ea,
    wireframe: true,
    transparent: true,
    opacity: 0.55,
  });
  const mesh = new THREE.Mesh(geom, mat);
  scene.add(mesh);

  // Inner glow sphere
  const glowGeom = new THREE.IcosahedronGeometry(1.9, 2);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xff3d00,
    transparent: true,
    opacity: 0.12,
    wireframe: false,
  });
  const glow = new THREE.Mesh(glowGeom, glowMat);
  scene.add(glow);

  // Outer faint shell
  const shellGeom = new THREE.IcosahedronGeometry(2.7, 1);
  const shellMat = new THREE.MeshBasicMaterial({
    color: 0x7b3aed,
    wireframe: true,
    transparent: true,
    opacity: 0.18,
  });
  const shell = new THREE.Mesh(shellGeom, shellMat);
  scene.add(shell);

  // Starfield
  const starCount = 1200;
  const starsGeom = new THREE.BufferGeometry();
  const starsPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const r = 20 + Math.random() * 30;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    starsPos[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
    starsPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    starsPos[i * 3 + 2] = r * Math.cos(phi);
  }
  starsGeom.setAttribute("position", new THREE.BufferAttribute(starsPos, 3));
  const starsMat = new THREE.PointsMaterial({
    color: 0xf4f1ea,
    size: 0.04,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.85,
  });
  const stars = new THREE.Points(starsGeom, starsMat);
  scene.add(stars);

  // Mouse parallax
  const target = { x: 0, y: 0 };
  const eased = { x: 0, y: 0 };

  // Drag-to-spin state
  let isDragging = false;
  let lastX = 0, lastY = 0;
  let dragRotX = 0, dragRotY = 0;
  let velX = 0, velY = 0;

  function isHeroDraggable(e) {
    if (e.target.closest("a, button, input, textarea, .nav, .term-overlay, .term-hint, .lang-switch")) return false;
    if (window.scrollY > window.innerHeight * 0.8) return false;
    return true;
  }

  window.addEventListener("pointerdown", (e) => {
    if (!isHeroDraggable(e)) return;
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    velX = 0; velY = 0;
    document.body.classList.add("dragging-orb");
    // Also kill any in-flight selection that the click might have started.
    if (window.getSelection) {
      const sel = window.getSelection();
      if (sel && sel.removeAllRanges) sel.removeAllRanges();
    }
  });
  window.addEventListener("pointermove", (e) => {
    if (isDragging) {
      const dx = (e.clientX - lastX) * 0.006;
      const dy = (e.clientY - lastY) * 0.006;
      dragRotY += dx;
      dragRotX += dy;
      velX = dx;
      velY = dy;
      lastX = e.clientX;
      lastY = e.clientY;
      // Defensive: prevent default to suppress drag-selection.
      if (e.cancelable) e.preventDefault();
    } else {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    }
  });
  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    document.body.classList.remove("dragging-orb");
  }
  window.addEventListener("pointerup", endDrag);
  window.addEventListener("pointercancel", endDrag);
  window.addEventListener("blur", endDrag);

  // Hint cursor for the hero area
  document.addEventListener("pointermove", (e) => {
    if (isDragging) return;
    if (isHeroDraggable(e)) document.body.style.cursor = "grab";
    else if (document.body.style.cursor === "grab") document.body.style.cursor = "";
  });

  // Resize
  function onResize() {
    camera.aspect = w() / h();
    camera.updateProjectionMatrix();
    renderer.setSize(w(), h());
  }
  window.addEventListener("resize", onResize);

  // Animate: noisy displacement of icosahedron vertices
  const clock = new THREE.Clock();
  function noise(x, y, z, t) {
    // cheap pseudo-noise from sines
    return (
      Math.sin(x * 1.3 + t * 0.7) * 0.5 +
      Math.sin(y * 1.7 - t * 0.5) * 0.3 +
      Math.sin(z * 1.1 + t * 0.9) * 0.4
    );
  }

  function tick() {
    const t = clock.getElapsedTime();
    // displace
    for (let i = 0; i < positionAttr.count; i++) {
      const ox = original[i * 3 + 0];
      const oy = original[i * 3 + 1];
      const oz = original[i * 3 + 2];
      const n = noise(ox, oy, oz, t * 0.35);
      const s = 1 + 0.08 * n;
      positionAttr.array[i * 3 + 0] = ox * s;
      positionAttr.array[i * 3 + 1] = oy * s;
      positionAttr.array[i * 3 + 2] = oz * s;
    }
    positionAttr.needsUpdate = true;

    mesh.rotation.y = t * 0.12 + dragRotY;
    mesh.rotation.x = t * 0.06 + dragRotX;
    shell.rotation.y = -t * 0.08 + dragRotY * 0.6;
    shell.rotation.z = t * 0.05;
    glow.rotation.y = t * 0.18 + dragRotY * 0.4;

    // momentum decay when released
    if (!isDragging) {
      dragRotY += velX;
      dragRotX += velY;
      velX *= 0.94;
      velY *= 0.94;
    }

    stars.rotation.y = t * 0.01;

    // parallax camera
    eased.x += (target.x - eased.x) * 0.05;
    eased.y += (target.y - eased.y) * 0.05;
    camera.position.x = eased.x * 0.6;
    camera.position.y = -eased.y * 0.4;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
})();
