/* Shared behaviour for every page: theme, header, ocean backdrop, reveals, tilt, Ctrl+K palette. */
(function () {
  "use strict";

  const S = window.SITE || {};
  const L = window.SITE_LINKS || { repos: {} };
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const lowPower = (navigator.hardwareConcurrency || 4) <= 4 || window.innerWidth < 700;

  /* ---------------- helpers ---------------- */
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const arr = (x) => (Array.isArray(x) ? x : x == null || x === "" ? [] : [x]);
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const ICONS = {
    search: '<path d="m21 21-4.3-4.3"/><circle cx="11" cy="11" r="7"/>',
    arrow: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
    back: '<path d="M19 12H5"/><path d="m11 18-6-6 6-6"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    ext: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/>',
    file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h6"/>',
    download: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    github:
      '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
    linkedin:
      '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    quote: '<path d="M7 7h4v4c0 3-2 5-4 6"/><path d="M14 7h4v4c0 3-2 5-4 6"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    left: '<path d="m15 18-6-6 6-6"/>',
    right: '<path d="m9 18 6-6-6-6"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    cap: '<path d="M22 9 12 4 2 9l10 5 10-5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
    paper: '<path d="M6 3h9l5 5v13H6z"/><path d="M14 3v6h6"/><path d="M9 13h7M9 17h5"/>',
    wave: '<path d="M2 12c2.5-3 5-3 7.5 0s5 3 7.5 0 3.5-2 5-1"/><path d="M2 17c2.5-3 5-3 7.5 0s5 3 7.5 0 3.5-2 5-1"/>',
    sub: '<path d="M3 13c0-2.8 4-5 9-5s9 2.2 9 5-4 5-9 5-9-2.2-9-5z"/><path d="M10 8V5h4v3"/><circle cx="8" cy="13" r="1"/><circle cx="12" cy="13" r="1"/>',
    code: '<path d="m8 8-4 4 4 4"/><path d="m16 8 4 4-4 4"/><path d="m14 4-4 16"/>',
    hash: '<path d="M5 9h14M5 15h14M10 3 8 21M16 3l-2 18"/>',
    award: '<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 7 5-3 5 3-1.5-7"/>',
    mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4"/>',
    users: '<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0"/><path d="M16 4a4 4 0 0 1 0 8M22 21a7 7 0 0 0-4-6.3"/>',
    book: '<path d="M4 4h6a3 3 0 0 1 3 3v14a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a3 3 0 0 0-3 3v14a2 2 0 0 1 2-2h7z"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    signal: '<path d="M2 20h.01M7 20v-4M12 20v-8M17 20V8M22 4v16"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    alert: '<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>',
    sun: '<circle cx="12" cy="12" r="4"/>',
    printer: '<path d="M6 9V2h12v7"/><rect x="2" y="9" width="20" height="9" rx="2"/><path d="M6 14h12v8H6z"/>',
  };
  const icon = (name, cls = "") =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;

  const repoUrl = (slug) => (L.repos && L.repos[slug] ? `${L.github}/${L.repos[slug]}` : null);
  const thumbOf = (src) => String(src).replace(/\.webp$/, "-thumb.webp");

  /* ---------------- toast & clipboard ---------------- */
  let toastTimer;
  function toast(msg) {
    let t = $(".toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "toast";
      t.setAttribute("role", "status");
      t.setAttribute("aria-live", "polite");
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  }
  async function copyText(text, msg = "Copied to clipboard") {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch { /* ignore */ }
      ta.remove();
    }
    toast(msg);
  }

  /* ---------------- BibTeX ---------------- */
  function bibtex(p) {
    const year = (String(p.venue || "").match(/(19|20)\d{2}/) || [""])[0];
    const first = String(p.authors || "").split(",")[0].trim().split(/\s+/)[0] || "paper";
    const word = String(p.title || "").split(/\s+/).find((w) => w.length > 3) || "x";
    const key = `${first}${year}${word}`.toLowerCase().replace(/[^a-z0-9]/g, "");
    const authors = String(p.authors || "").split(",").map((a) => a.trim()).filter(Boolean).join(" and ");
    const ieee = arr(p.links).find((l) => /ieeexplore/i.test(l.href));
    const lines = [
      `  title     = {${p.title}}`,
      authors && `  author    = {${authors}}`,
      p.venue && `  booktitle = {${p.venue}}`,
      year && `  year      = {${year}}`,
      ieee && `  url       = {${ieee.href}}`,
    ].filter(Boolean);
    return `@inproceedings{${key},\n${lines.join(",\n")}\n}`;
  }

  /* ---------------- theme ---------------- */
  function setTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("theme", t); } catch { /* private mode */ }
    const btn = $(".theme-toggle");
    if (btn) btn.setAttribute("aria-label", t === "dark" ? "Switch to light theme" : "Switch to dark theme");
    document.dispatchEvent(new CustomEvent("themechange", { detail: t }));
  }
  const currentTheme = () => document.documentElement.getAttribute("data-theme") || "light";
  function toggleTheme() {
    const next = currentTheme() === "dark" ? "light" : "dark";
    if (document.startViewTransition && !reduceMotion) document.startViewTransition(() => setTheme(next));
    else setTheme(next);
  }

  /* ---------------- header chrome ---------------- */
  const NAV = [
    ["about", "About"],
    ["research", "Research"],
    ["fleet", "AUVs"],
    ["projects", "Projects"],
    ["experience", "Experience"],
    ["education", "Education"],
    ["skills", "Skills"],
    ["contact", "Contact"],
  ];

  function buildHeader() {
    const onHome = !!document.getElementById("home");
    const base = onHome ? "" : "index.html";
    const header = document.createElement("header");
    header.className = "site-header";
    header.innerHTML = `
      <div class="container header-inner">
        <a class="brand" href="${base || "#home"}" aria-label="Samyak Kumar — home">
          <svg class="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="16" cy="16" r="14.5" fill="none" stroke="var(--accent)" stroke-width="1.4"/>
            <circle cx="16" cy="16" r="9" fill="none" stroke="var(--accent)" stroke-opacity=".45" stroke-width="1"/>
            <circle cx="16" cy="16" r="3.6" fill="none" stroke="var(--accent)" stroke-opacity=".35" stroke-width="1"/>
            <g class="sweep"><path d="M16 16 L16 1.5 A14.5 14.5 0 0 1 26.3 5.8 Z" fill="var(--accent)" fill-opacity=".28"/><line x1="16" y1="16" x2="16" y2="1.5" stroke="var(--accent)" stroke-width="1.4"/></g>
            <circle cx="16" cy="16" r="1.8" fill="var(--accent)"/>
          </svg>
          <span class="brand-name">Samyak Kumar</span>
        </a>
        <nav class="nav" aria-label="Sections">
          ${NAV.map(([id, label]) => `<a href="${base}#${id}" data-nav="${id}">${label}</a>`).join("")}
        </nav>
        <div class="header-actions">
          <button class="search-btn" type="button" data-open-palette aria-label="Search (Ctrl+K)">
            ${icon("search")}<span class="label">Search</span><kbd>${/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl"} K</kbd>
          </button>
          <button class="icon-btn theme-toggle" type="button" aria-label="Toggle theme">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
              <mask id="moon-mask"><rect x="-4" y="-4" width="32" height="32" fill="#fff"/><circle class="moon-cut" cx="24" cy="0" r="7" fill="#000"/></mask>
              <circle class="core" cx="12" cy="12" r="5" fill="currentColor" stroke="none" mask="url(#moon-mask)"/>
              <g class="sun-rays"><path d="M12 1.5v2.2M12 20.3v2.2M4.6 4.6l1.5 1.5M17.9 17.9l1.5 1.5M1.5 12h2.2M20.3 12h2.2M4.6 19.4l1.5-1.5M17.9 6.1l1.5-1.5"/></g>
            </svg>
          </button>
          <a class="btn btn-primary btn-sm header-cv" href="${esc(L.cv)}" target="_blank" rel="noopener">${icon("file")}CV</a>
          <button class="icon-btn menu-btn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="drawer">${icon("menu")}</button>
        </div>
      </div>`;
    const drawer = document.createElement("div");
    drawer.className = "drawer";
    drawer.id = "drawer";
    drawer.innerHTML =
      NAV.map(([id, label]) => `<a href="${base}#${id}">${label}</a>`).join("") +
      `<a href="${esc(L.cv)}" target="_blank" rel="noopener">Download CV</a>`;
    const progress = document.createElement("div");
    progress.className = "progress";
    progress.setAttribute("aria-hidden", "true");

    document.body.prepend(progress, header, drawer);

    $(".theme-toggle", header).addEventListener("click", toggleTheme);
    setTheme(currentTheme());

    const menuBtn = $(".menu-btn", header);
    const closeDrawer = () => {
      drawer.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.innerHTML = icon("menu");
    };
    menuBtn.addEventListener("click", () => {
      const open = !drawer.classList.contains("open");
      drawer.classList.toggle("open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.innerHTML = icon(open ? "close" : "menu");
    });
    $$("a", drawer).forEach((a) => a.addEventListener("click", closeDrawer));
    document.addEventListener("keydown", (e) => e.key === "Escape" && closeDrawer());

    // scroll-driven chrome: header background, progress bar, ocean depth
    const root = document.documentElement;
    let ticking = false;
    const onScroll = () => {
      ticking = false;
      const max = Math.max(1, root.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      header.classList.toggle("scrolled", window.scrollY > 12);
      root.style.setProperty("--progress", p.toFixed(4));
      root.style.setProperty("--depth", p.toFixed(3));
    };
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    onScroll();

    // active section in the nav
    if (onHome) {
      const links = new Map($$("[data-nav]", header).map((a) => [a.dataset.nav, a]));
      const sections = NAV.map(([id]) => document.getElementById(id)).filter(Boolean);
      const spy = () => {
        const y = window.scrollY + window.innerHeight * 0.35;
        let current = null;
        for (const s of sections) if (s.offsetTop <= y) current = s.id;
        links.forEach((a, id) => a.classList.toggle("active", id === current));
      };
      window.addEventListener("scroll", () => requestAnimationFrame(spy), { passive: true });
      spy();
    }
  }

  /* ---------------- ocean backdrop: marine snow + bubbles ---------------- */
  function buildOcean() {
    const ocean = document.createElement("div");
    ocean.className = "ocean";
    ocean.setAttribute("aria-hidden", "true");
    ocean.innerHTML = '<div class="caustics"></div><canvas id="ocean-canvas"></canvas>';
    document.body.prepend(ocean);

    const canvas = $("#ocean-canvas", ocean);
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1.25 : 2);
    let W = 0, H = 0, parts = [], rgb = "10,110,130", running = true, last = 0, scrollV = 0, lastY = window.scrollY;
    const mouse = { x: -9999, y: -9999 };

    const readColor = () => {
      rgb = getComputedStyle(document.documentElement).getPropertyValue("--particle").trim() || rgb;
    };
    const make = (anyY) => {
      const bubble = Math.random() < 0.09;
      return {
        x: Math.random() * W,
        y: anyY ? Math.random() * H : H + 10,
        r: bubble ? 1.8 + Math.random() * 3.2 : 0.5 + Math.random() * 1.5,
        vy: bubble ? 0.35 + Math.random() * 0.5 : 0.06 + Math.random() * 0.22,
        a: bubble ? 0.28 + Math.random() * 0.25 : 0.14 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
        sway: 0.15 + Math.random() * 0.4,
        bubble,
        dx: 0,
        dy: 0,
      };
    };
    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.round(Math.min(150, Math.max(36, (W * H) / 13000)) * (lowPower ? 0.55 : 1));
      while (parts.length < target) parts.push(make(true));
      parts.length = target;
    };
    const draw = (t) => {
      ctx.clearRect(0, 0, W, H);
      for (const p of parts) {
        ctx.beginPath();
        const x = p.x + p.dx + Math.sin(t * 0.0006 + p.phase) * 6 * p.sway;
        const y = p.y + p.dy;
        if (p.bubble) {
          ctx.arc(x, y, p.r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${rgb},${p.a})`;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(x - p.r * 0.35, y - p.r * 0.35, p.r * 0.28, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb},${p.a * 0.8})`;
          ctx.fill();
        } else {
          ctx.arc(x, y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb},${p.a})`;
          ctx.fill();
        }
      }
    };
    const step = (t) => {
      if (!running) return;
      const dt = Math.min(48, t - (last || t)) / 16.67;
      last = t;
      const sy = window.scrollY;
      scrollV = scrollV * 0.9 + (sy - lastY) * 0.1;
      lastY = sy;
      for (const p of parts) {
        p.y -= (p.vy + Math.max(-2, Math.min(4, scrollV * 0.06)) * (p.bubble ? 1 : 0.6)) * dt;
        // cursor pushes particles away, then they ease back
        const mx = mouse.x - (p.x + p.dx), my = mouse.y - (p.y + p.dy);
        const d2 = mx * mx + my * my;
        if (d2 < 120 * 120) {
          const d = Math.sqrt(d2) || 1;
          const f = (1 - d / 120) * 2.2;
          p.dx -= (mx / d) * f * dt;
          p.dy -= (my / d) * f * dt;
        }
        p.dx *= 0.95;
        p.dy *= 0.95;
        if (p.y < -12) Object.assign(p, make(false));
        if (p.y > H + 14) p.y = -10;
      }
      draw(t);
      requestAnimationFrame(step);
    };

    readColor();
    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("themechange", () => { readColor(); if (reduceMotion) draw(0); });
    if (finePointer) {
      window.addEventListener("pointermove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
      document.addEventListener("pointerleave", () => { mouse.x = mouse.y = -9999; });
    }
    if (reduceMotion) {
      draw(0);
      window.addEventListener("resize", () => draw(0));
      return;
    }
    document.addEventListener("visibilitychange", () => {
      running = !document.hidden;
      if (running) { last = 0; requestAnimationFrame(step); }
    });
    requestAnimationFrame(step);
  }

  /* ---------------- reveal on scroll, counters ---------------- */
  function countUp(el) {
    const target = parseFloat(el.dataset.count);
    if (!isFinite(target)) return;
    if (reduceMotion) { el.textContent = el.dataset.count; return; }
    const dur = 1400;
    const t0 = performance.now();
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(target * e);
      if (k < 1) requestAnimationFrame(tick);
      else el.textContent = el.dataset.count;
    };
    requestAnimationFrame(tick);
  }

  let revealObserver;
  function observeReveals(root = document) {
    const els = $$("[data-reveal], [data-count], .step, .role", root);
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => { el.classList.add("in"); if (el.dataset.count) countUp(el); });
      return;
    }
    revealObserver =
      revealObserver ||
      new IntersectionObserver(
        (entries) => {
          for (const en of entries) {
            if (!en.isIntersecting) continue;
            en.target.classList.add("in");
            if (en.target.dataset.count) countUp(en.target);
            revealObserver.unobserve(en.target);
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
      );
    els.forEach((el) => revealObserver.observe(el));
  }

  /* ---------------- tilt cards ---------------- */
  function enableTilt(root = document) {
    if (!finePointer || reduceMotion) return;
    $$("[data-tilt]", root).forEach((card) => {
      if (card.dataset.tiltOn) return;
      card.dataset.tiltOn = "1";
      if (!$(".glare", card)) card.insertAdjacentHTML("beforeend", '<span class="glare" aria-hidden="true"></span>');
      let raf = 0;
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 7}deg) rotateY(${(px - 0.5) * 9}deg) translateY(-4px)`;
          card.style.setProperty("--mx", `${px * 100}%`);
          card.style.setProperty("--my", `${py * 100}%`);
        });
      });
      card.addEventListener("pointerleave", () => {
        cancelAnimationFrame(raf);
        card.style.transform = "";
      });
    });
  }

  /* ---------------- command palette (Ctrl/⌘+K) ---------------- */
  function buildPalette() {
    const onHome = !!document.getElementById("home");
    const base = onHome ? "" : "index.html";
    const items = [];
    const sectionLabels = { home: "Top of page", ...Object.fromEntries(NAV) };
    for (const [id, label] of Object.entries(sectionLabels))
      items.push({ group: "Sections", title: label, sub: "Jump to section", icon: "hash", href: `${base}#${id}` });
    arr(S.papers).forEach((p) =>
      items.push({ group: "Publications", title: p.title, sub: p.venue || "Paper", icon: "paper", href: `paper.html?p=${encodeURIComponent(p.slug)}`, keys: arr(p.keywords).join(" ") }),
    );
    arr(S.auvs).forEach((a) =>
      items.push({ group: "AUVs", title: a.name, sub: a.tagline, icon: "sub", href: `project.html?p=${encodeURIComponent(a.project || a.slug)}` }),
    );
    arr(S.projectCatalog).forEach((p) =>
      items.push({ group: "Projects", title: p.title, sub: `${p.category} · ${p.org || ""}`, icon: "code", href: `project.html?p=${encodeURIComponent(p.slug)}`, keys: arr(p.stack).join(" ") }),
    );
    const c = S.contact || {};
    const actions = [
      { title: "Download CV (PDF)", icon: "download", href: L.cv, ext: true },
      c.emailPersonal && { title: "Copy email address", sub: c.emailPersonal, icon: "mail", run: () => copyText(c.emailPersonal, "Email copied") },
      { title: "Toggle light / dark theme", icon: "eye", run: toggleTheme },
      c.githubUrl && { title: "GitHub profile", sub: c.githubUrl.replace("https://", ""), icon: "github", href: c.githubUrl, ext: true },
      c.linkedin && { title: "LinkedIn profile", sub: "linkedin.com", icon: "linkedin", href: c.linkedin, ext: true },
      { title: "Print this page", icon: "printer", run: () => window.print() },
    ].filter(Boolean);
    actions.forEach((a) => items.push({ group: "Actions", ...a }));

    const el = document.createElement("div");
    el.className = "palette";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-label", "Search the site");
    el.innerHTML = `
      <div class="palette-box">
        <div class="palette-input">${icon("search")}<input type="text" placeholder="Search sections, papers, projects…" aria-label="Search" autocomplete="off" spellcheck="false" role="combobox" aria-expanded="true" aria-controls="palette-list"/><kbd>Esc</kbd></div>
        <ul class="palette-list" id="palette-list" role="listbox"></ul>
        <div class="palette-foot"><span><kbd>↑</kbd> <kbd>↓</kbd> navigate</span><span><kbd>↵</kbd> open</span><span><kbd>Esc</kbd> close</span></div>
      </div>`;
    document.body.appendChild(el);
    const input = $("input", el);
    const list = $(".palette-list", el);
    let shown = [], sel = 0, lastFocus = null;

    const score = (it, q) => {
      if (!q) return 1;
      const hay = `${it.title} ${it.sub || ""} ${it.group} ${it.keys || ""}`.toLowerCase();
      const words = q.toLowerCase().split(/\s+/).filter(Boolean);
      let s = 0;
      for (const w of words) {
        const i = hay.indexOf(w);
        if (i < 0) return 0;
        s += it.title.toLowerCase().includes(w) ? 3 : 1;
        if (i === 0) s += 1;
      }
      return s;
    };
    const render = () => {
      const q = input.value.trim();
      shown = items.map((it) => [it, score(it, q)]).filter(([, s]) => s > 0);
      if (q) shown.sort((a, b) => b[1] - a[1]);
      shown = shown.map(([it]) => it).slice(0, 40);
      sel = Math.min(sel, Math.max(0, shown.length - 1));
      if (!shown.length) {
        list.innerHTML = `<li class="palette-empty">No results for “${esc(q)}”</li>`;
        return;
      }
      let html = "", group = "";
      shown.forEach((it, i) => {
        if (!q && it.group !== group) {
          group = it.group;
          html += `<li class="palette-group" role="presentation">${esc(group)}</li>`;
        }
        html += `<li class="palette-item" role="option" id="pi-${i}" data-i="${i}" aria-selected="${i === sel}">
          <span class="pi-ic">${icon(it.icon)}</span><span><div class="pi-t">${esc(it.title)}</div>${it.sub ? `<div class="pi-s">${esc(it.sub)}</div>` : ""}</span></li>`;
      });
      list.innerHTML = html;
      input.setAttribute("aria-activedescendant", `pi-${sel}`);
    };
    const highlight = () => {
      $$(".palette-item", list).forEach((li) => li.setAttribute("aria-selected", String(+li.dataset.i === sel)));
      const cur = $(`#pi-${sel}`, list);
      if (cur) cur.scrollIntoView({ block: "nearest" });
      input.setAttribute("aria-activedescendant", `pi-${sel}`);
    };
    const choose = (it) => {
      if (!it) return;
      close();
      if (it.run) return it.run();
      if (it.ext) return window.open(it.href, "_blank", "noopener");
      const url = new URL(it.href, location.href);
      if (url.pathname === location.pathname && url.search === location.search && url.hash) {
        const target = document.getElementById(url.hash.slice(1));
        if (target) {
          target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
          history.replaceState(null, "", url.hash);
          return;
        }
      }
      location.href = it.href;
    };
    const open = () => {
      lastFocus = document.activeElement;
      el.classList.add("open");
      input.value = "";
      sel = 0;
      render();
      setTimeout(() => input.focus(), 10);
      document.body.style.overflow = "hidden";
    };
    const close = () => {
      el.classList.remove("open");
      document.body.style.overflow = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };

    input.addEventListener("input", () => { sel = 0; render(); });
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(shown.length - 1, sel + 1); highlight(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(0, sel - 1); highlight(); }
      else if (e.key === "Enter") { e.preventDefault(); choose(shown[sel]); }
      else if (e.key === "Tab") e.preventDefault();
    });
    list.addEventListener("click", (e) => {
      const li = e.target.closest(".palette-item");
      if (li) choose(shown[+li.dataset.i]);
    });
    list.addEventListener("mousemove", (e) => {
      const li = e.target.closest(".palette-item");
      if (li && +li.dataset.i !== sel) { sel = +li.dataset.i; highlight(); }
    });
    el.addEventListener("click", (e) => { if (e.target === el) close(); });
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        el.classList.contains("open") ? close() : open();
      } else if (e.key === "Escape" && el.classList.contains("open")) close();
      else if (e.key === "/" && !el.classList.contains("open") && !/input|textarea|select/i.test(document.activeElement.tagName)) {
        e.preventDefault();
        open();
      }
    });
    $$("[data-open-palette]").forEach((b) => b.addEventListener("click", open));
  }

  /* ---------------- footer ---------------- */
  function buildFooter() {
    const c = S.contact || {};
    const f = document.createElement("footer");
    f.className = "site-footer";
    f.innerHTML = `
      <div class="container footer-inner">
        <span>© ${new Date().getFullYear()} Samyak Kumar · Naval Architecture &amp; Ocean Engineering, IIT Madras</span>
        <span style="display:flex;gap:18px;flex-wrap:wrap">
          ${c.githubUrl ? `<a href="${esc(c.githubUrl)}" target="_blank" rel="noopener">GitHub</a>` : ""}
          ${c.linkedin ? `<a href="${esc(c.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>` : ""}
          <a href="${esc(L.cv)}" target="_blank" rel="noopener">CV</a>
          <a href="${document.getElementById("home") ? "#home" : "index.html"}">Back to surface ↑</a>
        </span>
      </div>`;
    document.body.appendChild(f);
  }

  /* open collapsed details before printing so nothing is hidden on paper */
  window.addEventListener("beforeprint", () => $$("details:not([open])").forEach((d) => { d.dataset.printOpened = "1"; d.open = true; }));
  window.addEventListener("afterprint", () => $$("details[data-print-opened]").forEach((d) => { d.open = false; delete d.dataset.printOpened; }));

  /* ---------------- expose & boot ---------------- */
  window.UI = { esc, arr, $, $$, icon, toast, copyText, bibtex, repoUrl, thumbOf, observeReveals, enableTilt, reduceMotion, finePointer, lowPower };

  document.documentElement.classList.add("js");
  document.addEventListener("DOMContentLoaded", () => {
    buildOcean();
    buildHeader();
    buildFooter();
    buildPalette();
    document.dispatchEvent(new Event("ui:ready"));
    observeReveals();
    enableTilt();
  });
})();
