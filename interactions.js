// ---------------- language switcher ----------------
(function lang() {
  const btns = document.querySelectorAll(".lang button");
  function apply(l) {
    document.documentElement.setAttribute("data-lang", l);
    btns.forEach((b) => b.classList.toggle("active", b.dataset.lang === l));
    document.querySelectorAll("[data-en]").forEach((el) => {
      const v = el.getAttribute("data-" + l);
      if (v != null) el.innerHTML = v;
    });
    try { localStorage.setItem("lang", l); } catch (e) {}
  }
  btns.forEach((b) => b.addEventListener("click", () => apply(b.dataset.lang)));
  let saved = null;
  try { saved = localStorage.getItem("lang"); } catch (e) {}
  apply(saved || "en");
})();

// ---------------- toast ----------------
const toast = (function () {
  let el = null;
  let timer = null;
  function show(text) {
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.innerHTML = '<span class="toast-dot"></span>' + text;
    requestAnimationFrame(() => el.classList.add("show"));
    clearTimeout(timer);
    timer = setTimeout(() => el.classList.remove("show"), 1800);
  }
  return { show };
})();

// ---------------- copy-email ----------------
(function copyEmail() {
  async function doCopy(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        return true;
      } catch (e2) {
        return false;
      }
    }
  }
  document.querySelectorAll('[data-action="copy-email"]').forEach((el) => {
    el.addEventListener("click", async (e) => {
      if (e.target.closest(".contact-side")) return;
      e.preventDefault();
      const value = el.getAttribute("data-value") || "";
      const ok = await doCopy(value);
      if (ok) {
        el.classList.add("copied");
        toast.show(value + " copied");
        setTimeout(() => el.classList.remove("copied"), 1800);
      } else {
        toast.show("couldn\u2032t copy");
      }
    });
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        el.click();
      }
    });
  });
})();

// ---------------- easter egg: WWW ----------------
(function wwwEgg() {
  const target = document.querySelector('[data-egg="www"]');
  if (!target) return;

  let stage = null;
  let visitorBase = 31415 + Math.floor(Math.random() * 800);

  function buildStage() {
    stage = document.createElement("div");
    stage.className = "www-stage";
    stage.innerHTML = `
      <div class="www-window" role="dialog" aria-label="Web 1.0 easter egg">
        <div class="www-titlebar">
          <span>★ wiktor's homepage — Netscape Navigator 3.0</span>
          <button class="www-titlebar-x" aria-label="close">×</button>
        </div>
        <div class="www-content">
          <div class="www-marquee">
            <div class="www-marquee-track">
              <span class="star">★</span><span>welcome to my homepage</span>
              <span class="star">★</span><span>best viewed in 800×600</span>
              <span class="star">★</span><span>under construction</span>
              <span class="star">★</span><span>sign my guestbook</span>
              <span class="star">★</span><span>this site is HOT</span>
              <span class="star">★</span>
            </div>
          </div>
          <div class="www-body">
            <h3>W &middot; W &middot; W</h3>
            <div>You are visitor number:</div>
            <div class="www-counter" id="www-counter">0000000</div>
            <div class="www-tag">page last updated <b>May 14, 1996</b></div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(stage);
    stage.querySelector(".www-titlebar-x").addEventListener("click", hide);
    stage.addEventListener("click", (e) => {
      if (e.target === stage) hide();
    });
  }

  function rollCounter(el, final) {
    const digits = String(final).padStart(7, "0");
    let i = 0;
    const tick = () => {
      const partial = digits.split("").map((d, idx) => idx < i ? d : Math.floor(Math.random() * 10)).join("");
      el.textContent = partial;
      i++;
      if (i <= digits.length) setTimeout(tick, 80);
      else el.textContent = digits;
    };
    tick();
  }

  function packets() {
    const r = target.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const count = 9;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      p.className = "www-packet";
      p.textContent = ["www", "W", "://", "http", "W", "www.", "://", "W", "www"][i % 9];
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const dist = 200 + Math.random() * 160;
      p.style.left = cx + "px";
      p.style.top = cy + "px";
      p.style.setProperty("--dx", Math.cos(angle) * dist + "px");
      p.style.setProperty("--dy", Math.sin(angle) * dist + "px");
      p.style.animationDelay = (i * 30) + "ms";
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1700);
    }
  }

  function show() {
    if (!stage) buildStage();
    packets();
    requestAnimationFrame(() => stage.classList.add("show"));
    const counter = stage.querySelector("#www-counter");
    visitorBase++;
    rollCounter(counter, visitorBase);
  }
  function hide() {
    if (!stage) return;
    stage.classList.remove("show");
  }

  target.addEventListener("click", show);
  target.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(); }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && stage && stage.classList.contains("show")) hide();
  });
})();

// ---------------- easter egg: pronunciation ----------------
(function pronounceEgg() {
  const target = document.querySelector('[data-egg="pronounce"]');
  if (!target) return;

  let pop = null;
  let synthVoice = null;

  function pickVoice() {
    if (!("speechSynthesis" in window)) return;
    const voices = window.speechSynthesis.getVoices();
    synthVoice = voices.find((v) => /pl(-|_)?PL/i.test(v.lang)) ||
                 voices.find((v) => /^pl/i.test(v.lang)) ||
                 null;
  }
  if ("speechSynthesis" in window) {
    pickVoice();
    window.speechSynthesis.addEventListener("voiceschanged", pickVoice);
  }

  function build() {
    pop = document.createElement("div");
    pop.className = "pron-pop";
    pop.innerHTML = `
      <div class="pron-header">
        <span class="pron-flag" aria-hidden="true"><span></span><span></span></span>
        polish pronunciation
      </div>
      <div class="pron-row">
        <span class="lab">ipa</span>
        <span class="val">[ spr<em>ɨ</em>ˈʂɨɲski ]</span>
        <button class="pron-play" data-mode="ipa" aria-label="play">▶</button>
      </div>
      <div class="pron-row">
        <span class="lab">say it</span>
        <span class="val">sprih–<em>SHIN</em>–skee</span>
        <button class="pron-play" data-mode="easy" aria-label="play">▶</button>
      </div>
      <div class="pron-row">
        <span class="lab">tip</span>
        <span class="val" style="font-size:11px;color:var(--muted);">ń sounds like the <em style="color:var(--accent);">ni</em> in "onion"</span>
      </div>
    `;
    document.body.appendChild(pop);
    pop.querySelectorAll(".pron-play").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        speak(btn);
      });
    });
    setTimeout(() => {
      document.addEventListener("click", outsideClose, { once: true });
    }, 0);
  }

  function outsideClose(e) {
    if (!pop) return;
    if (pop.contains(e.target) || target.contains(e.target)) {
      setTimeout(() => document.addEventListener("click", outsideClose, { once: true }), 0);
      return;
    }
    hide();
  }

  function position() {
    if (!pop) return;
    const r = target.getBoundingClientRect();
    const popW = pop.offsetWidth;
    let left = r.left;
    const maxLeft = window.innerWidth - popW - 16;
    if (left > maxLeft) left = maxLeft;
    if (left < 16) left = 16;
    pop.style.left = left + "px";
    pop.style.top = (r.bottom + 14) + "px";
  }

  function speak(btn) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance("Wiktor Spryszyński");
    if (synthVoice) {
      u.voice = synthVoice;
      u.lang = synthVoice.lang;
    } else {
      u.lang = "pl-PL";
    }
    u.rate = 0.92;
    u.pitch = 1;
    btn.classList.add("playing");
    u.onend = u.onerror = () => btn.classList.remove("playing");
    window.speechSynthesis.speak(u);
    setTimeout(() => btn.classList.remove("playing"), 2200);
  }

  function show() {
    if (!pop) build();
    position();
    requestAnimationFrame(() => pop.classList.add("show"));
  }
  function hide() {
    if (!pop) return;
    pop.classList.remove("show");
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }

  target.addEventListener("click", (e) => {
    e.stopPropagation();
    if (pop && pop.classList.contains("show")) hide();
    else show();
  });
  target.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(); }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && pop && pop.classList.contains("show")) hide();
  });
  window.addEventListener("resize", position);
  window.addEventListener("scroll", position, { passive: true });
})();

// ---------------- live fetcher ----------------
(function fetcher() {
  const root = document.getElementById("fetcher");
  if (!root) return;
  const bodyEl = document.getElementById("fetcher-body");
  const metaEl = document.getElementById("fetcher-meta");
  const statusEl = root.querySelector(".fetcher-status");
  const statusText = root.querySelector(".fetcher-status-text");
  const urlEl = root.querySelector(".fetcher-url");
  const refreshBtn = document.getElementById("fetcher-refresh");

  function setStatus(state, text) {
    statusEl.setAttribute("data-state", state);
    statusText.textContent = text;
  }

  function colorJSON(obj) {
    const json = JSON.stringify(obj, null, 2);
    return json
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/("(?:[^"\\]|\\.)*")(\s*:)/g, '<span class="k">$1</span>$2')
      .replace(/:\s*("(?:[^"\\]|\\.)*")/g, ': <span class="s">$1</span>')
      .replace(/:\s*(-?\d+(?:\.\d+)?(?:e[+-]?\d+)?)/gi, ': <span class="n">$1</span>')
      .replace(/:\s*(true|false|null)\b/g, ': <span class="b">$1</span>');
  }

  function localFallback() {
    const now = new Date();
    return {
      ok: true,
      data: {
        time_utc: now.toISOString(),
        timezone: "Europe/Warsaw",
        location: { city: "Gdańsk", lat: 54.35, lon: 18.65 },
        open_to_work: true,
        coffee_today: Math.floor(Math.random() * 4) + 1
      },
      _meta: { source: "stub", latency_ms: 0 }
    };
  }

  async function fetchOnce() {
    const endpoint = (root.getAttribute("data-endpoint") || "").trim();
    setStatus("loading", "…");
    bodyEl.innerHTML = '<span class="dim">// requesting…</span><span class="cursor"></span>';
    refreshBtn.classList.remove("spinning");
    void refreshBtn.offsetWidth;
    refreshBtn.classList.add("spinning");
    if (urlEl) urlEl.textContent = endpoint || "/api/now (stub)";

    const t0 = performance.now();
    try {
      let data;
      let httpStatus = 200;
      if (endpoint) {
        const res = await fetch(endpoint, { headers: { accept: "application/json" } });
        httpStatus = res.status;
        const ct = res.headers.get("content-type") || "";
        data = ct.includes("application/json") ? await res.json() : { raw: await res.text() };
        if (!res.ok) throw Object.assign(new Error("HTTP " + httpStatus), { httpStatus, data });
      } else {
        await new Promise((r) => setTimeout(r, 360 + Math.random() * 260));
        data = localFallback();
      }
      const ms = Math.max(1, Math.round(performance.now() - t0));
      if (data && data._meta) data._meta.latency_ms = ms;
      bodyEl.innerHTML = colorJSON(data);
      setStatus("ok", "200");
      metaEl.innerHTML = `${ms}ms · ${endpoint ? "live" : "stub"}`;
    } catch (err) {
      const ms = Math.max(1, Math.round(performance.now() - t0));
      bodyEl.innerHTML = colorJSON({ ok: false, error: String(err && err.message || err), httpStatus: err && err.httpStatus });
      setStatus("err", "ERR");
      metaEl.innerHTML = `${ms}ms · failed`;
    } finally {
      setTimeout(() => refreshBtn.classList.remove("spinning"), 900);
    }
  }

  refreshBtn && refreshBtn.addEventListener("click", fetchOnce);
  fetchOnce();
})();

// ---------------- terminal ----------------
(function terminal() {
  const overlay = document.getElementById("term");
  const body = document.getElementById("term-body");
  const input = document.getElementById("term-input");
  const closeBtn = document.getElementById("term-close");
  const toggle = document.getElementById("term-toggle");
  const redDot = document.querySelector("#term .term-head .dots span:nth-child(1)");
  if (!overlay || !body || !input) return;

  let history = [];
  let histIdx = -1;
  const printedBoot = { done: false };

  function open() {
    overlay.classList.add("open");
    if (!printedBoot.done) { boot(); printedBoot.done = true; }
    setTimeout(() => input.focus(), 40);
  }
  function close() {
    overlay.classList.remove("open");
    input.blur();
  }
  toggle && toggle.addEventListener("click", open);
  closeBtn && closeBtn.addEventListener("click", close);
  if (redDot) {
    redDot.setAttribute("role", "button");
    redDot.setAttribute("aria-label", "Close terminal");
    redDot.setAttribute("title", "close");
    redDot.addEventListener("click", close);
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "`" || e.key === "~") {
      if (document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) {
        if (!overlay.classList.contains("open")) return;
      }
      e.preventDefault();
      overlay.classList.contains("open") ? close() : open();
    } else if (e.key === "Escape" && overlay.classList.contains("open")) {
      close();
    }
  });

  function print(text, cls) {
    const line = document.createElement("div");
    line.className = "term-line " + (cls || "out");
    line.textContent = text;
    body.appendChild(line);
    body.scrollTop = body.scrollHeight;
  }
  function printHtml(html, cls) {
    const line = document.createElement("div");
    line.className = "term-line " + (cls || "out");
    line.innerHTML = html;
    body.appendChild(line);
    body.scrollTop = body.scrollHeight;
  }

  function boot() {
    print("type `help` for commands.", "dim");
    print("");
  }

  const commands = {
    help() {
      [
        ["help", "this list"],
        ["whoami", "about me"],
        ["ls", "list projects"],
        ["cat resume", "resume summary"],
        ["stack", "tech"],
        ["contact", "links"],
        ["hire", "the important one"],
        ["coffee", "pour me one"],
        ["clear", "clear the terminal"],
        ["exit", "close"],
      ].forEach(([c, d]) => printHtml(`  <span style="color:var(--ok)">${c.padEnd(12)}</span><span style="color:var(--muted)">${d}</span>`));
    },
    whoami() {
      print("wiktor spryszynski");
      print("full-stack engineer, gdansk, pl.", "dim");
      print("open to work, may 2026.", "dim");
    },
    ls() {
      printHtml("  <span style='color:var(--ok)'>nom-nom/</span>            pwa · in progress");
      printHtml("  <span style='color:var(--ok)'>flight-scope/</span>       live tracker · ~80%");
      printHtml("  <span style='color:var(--ok)'>spotify-recommender/</span> archived");
      printHtml("  <span style='color:var(--ok)'>wiktorspryszynski/</span>   readme bot");
    },
    "ls projects"() { commands.ls(); },
    stack() {
      print("shipped: php, javascript, react, sql, html/css", "");
      print("side: typescript, python, fastapi, postgres, redis, deck.gl", "");
    },
    contact() {
      printHtml("github   <a style='color:var(--accent)' target='_blank' href='https://github.com/wiktorspryszynski'>github.com/wiktorspryszynski</a>");
      printHtml("linkedin <a style='color:var(--accent)' target='_blank' href='https://www.linkedin.com/in/wiktor-spryszynski/'>linkedin.com/in/wiktor-spryszynski</a>");
      printHtml("email    <a style='color:var(--accent)' href='mailto:spryszynskiwiktor@gmail.com'>spryszynskiwiktor@gmail.com</a>");
    },
    "cat resume"() {
      print("wiktor spryszynski / full-stack engineer / gdansk, pl");
      print("");
      print("experience", "dim");
      print("  saas startup, 3 people, ~1.5y — php, js, react");
      print("  hospital indoor nav, 3 people, 3mo — react native, 3d, dijkstra");
      print("");
      print("now: building flight-scope and nom-nom.", "dim");
    },
    hire() {
      print("opening mail…");
      setTimeout(() => {
        window.location.href = "mailto:spryszynskiwiktor@gmail.com?subject=Let%27s%20talk&body=Hi%20Wiktor%2C";
      }, 350);
    },
    "sudo hire"() {
      printHtml("<span style='color:var(--accent)'>permission granted.</span>");
      setTimeout(() => {
        window.location.href = "mailto:spryszynskiwiktor@gmail.com?subject=URGENT%3A%20Let%27s%20talk&body=Hi%20Wiktor%2C";
      }, 350);
    },
    coffee() {
      [
        "    ( (",
        "     ) )",
        "  .-----.",
        "  |     |]",
        "  `-----'",
      ].forEach((l) => print(l));
      print("on it.", "dim");
    },
    clear() { body.innerHTML = ""; },
    exit() { close(); },
  };

  function run(raw) {
    const cmd = raw.trim().toLowerCase();
    print(raw, "cmd");
    if (!cmd) return;
    history.push(raw); histIdx = history.length;
    if (commands[cmd]) {
      commands[cmd]();
    } else if (cmd.startsWith("cd ")) {
      print("you can\u2032t cd. this is a portfolio.", "dim");
    } else if (cmd === "rm -rf /") {
      print("nice try.", "err");
    } else {
      printHtml(`<span style='color:var(--accent)'>command not found:</span> ${escapeHtml(cmd)} — try <span style='color:var(--ok)'>help</span>`);
    }
  }
  function escapeHtml(s) { return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])); }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const v = input.value;
      input.value = "";
      run(v);
    } else if (e.key === "ArrowUp") {
      if (history.length === 0) return;
      histIdx = Math.max(0, histIdx - 1);
      input.value = history[histIdx] || "";
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      histIdx = Math.min(history.length, histIdx + 1);
      input.value = history[histIdx] || "";
      e.preventDefault();
    }
  });
})();
