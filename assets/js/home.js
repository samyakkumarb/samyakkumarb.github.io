/* Renders index.html from window.SITE and runs the hero sonar. */
(function () {
  "use strict";

  document.addEventListener("ui:ready", () => {
    const S = window.SITE || {};
    const L = window.SITE_LINKS || {};
    const { esc, arr, $, $$, icon, copyText, bibtex, thumbOf, reduceMotion } = window.UI;

    const set = (id, html) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    };
    const head = (eyebrow, title, lead) =>
      `<div data-reveal><div class="eyebrow">${esc(eyebrow)}</div><h2 class="section-title">${esc(title)}</h2>${
        lead ? `<p class="section-lead">${esc(lead)}</p>` : ""
      }</div>`;
    const chips = (xs, cls = "chip") => `<ul class="chips">${arr(xs).map((x) => `<li class="${cls}">${esc(x)}</li>`).join("")}</ul>`;
    const ticks = (xs) => `<ul class="ticks">${arr(xs).map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
    const projectBySlug = (slug) => arr(S.projectCatalog).find((p) => p.slug === slug);
    const ME = /Samyak/i;

    /* ---------------- hero ---------------- */
    const home = S.home || {};
    const edu = S.education || {};
    const papers = arr(S.papers);
    const contact = S.contact || {};
    const [first, ...rest] = String(home.title || "Samyak Kumar").split(" ");
    const venues = [...new Set(papers.map((p) => p.venue).filter(Boolean))];
    set(
      "hero-text",
      `
      <div class="hero-badge"><span class="dot"></span>${esc(home.badge || "Marine robotics · AUVs")}</div>
      <h1>${esc(first)} <span class="accent">${esc(rest.join(" "))}</span></h1>
      <p class="typed" aria-label="${esc(home.subtitle || "")}"><span class="prompt" aria-hidden="true">&gt;</span><span class="typed-text" aria-hidden="true"></span><span class="caret" aria-hidden="true"></span></p>
      <p class="hero-lead">${esc(home.lead || "")}</p>
      <div class="hero-ctas">
        <a class="btn btn-primary" href="#research">${icon("paper")}Research &amp; publications</a>
        <a class="btn btn-ghost" href="#projects">${icon("sub")}Projects</a>
        <a class="btn btn-ghost" href="${esc(L.cv)}" target="_blank" rel="noopener">${icon("download")}CV</a>
      </div>
      <ul class="hero-facts">
        ${edu.degree ? `<li>${icon("cap")}${esc(edu.degree.school || "")}</li>` : ""}
        ${papers.length ? `<li>${icon("paper")}${papers.length} paper${papers.length > 1 ? "s" : ""}${venues.length === 1 ? ` · ${esc(venues[0])}` : ""}</li>` : ""}
        ${edu.degree && edu.degree.graduation ? `<li>${icon("calendar")}${esc(edu.degree.graduation)}</li>` : ""}
      </ul>`,
    );

    // typed role line — phrases come from the subtitle and identity line
    const phrases = [
      ...String(home.subtitle || "").split(/\s+·\s+/),
      ...String(home.identityLine || "").split(/\s+·\s+/),
    ].filter(Boolean);
    const typedEl = $(".typed-text");
    if (typedEl && phrases.length) {
      if (reduceMotion) typedEl.textContent = phrases[0];
      else {
        let pi = 0, ci = 0, del = false;
        const tick = () => {
          const word = phrases[pi];
          ci += del ? -1 : 1;
          typedEl.textContent = word.slice(0, ci);
          let wait = del ? 28 : 55 + Math.random() * 40;
          if (!del && ci >= word.length) { del = true; wait = 2100; }
          else if (del && ci <= 0) { del = false; pi = (pi + 1) % phrases.length; wait = 380; }
          setTimeout(tick, wait);
        };
        setTimeout(tick, 900);
      }
    }

    /* ---------------- about ---------------- */
    const about = S.about || {};
    const positions = arr(about.positions);
    set(
      "about-body",
      `${head("About", "Marine robotics, from hull to autonomy")}
      <div class="about-grid">
        <div class="prose" data-reveal>
          ${arr(about.intro).map((p, i) => `<p class="${i === 0 ? "lede" : ""}">${esc(p)}</p>`).join("")}
          ${about.focus ? `<p>${esc(about.focus)}</p>` : ""}
          ${about.mavlab ? `<p>${esc(about.mavlab)}</p>` : ""}
          ${arr(about.mavlabEmphasis).length ? `<ul class="emphasis-list">${arr(about.mavlabEmphasis).map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
          ${about.belief ? `<p>${esc(about.belief)}</p>` : ""}
          ${arr(about.intersection).length ? `<p style="margin-bottom:10px"><strong>Working at the intersection of</strong></p>${chips(about.intersection)}` : ""}
        </div>
        <aside>
          ${positions.length ? `<div class="card side-card" data-reveal style="--d:.1s"><h3>Positions</h3><ul class="positions">${positions
            .map((p) => `<li><div class="pos-role">${esc(p.role)}</div><div class="pos-org">${esc(p.org)}</div></li>`)
            .join("")}</ul></div>` : ""}
          ${arr(edu.researchInterests).length ? `<div class="card side-card" data-reveal style="--d:.2s"><h3>Research interests</h3>${chips(edu.researchInterests, "chip chip-outline")}</div>` : ""}
        </aside>
      </div>
      <div class="vision-grid">
        ${about.careerVision ? `<div class="card vision-card" data-reveal><h3>${esc(about.careerVision.title)}</h3><p>${esc(about.careerVision.lead)}</p>${ticks(about.careerVision.bullets)}</div>` : ""}
        ${about.futurePlans ? `<div class="card vision-card" data-reveal style="--d:.1s"><h3>${esc(about.futurePlans.title)}</h3><p>${esc(about.futurePlans.target)}</p>${chips(about.futurePlans.focus)}</div>` : ""}
      </div>`,
    );

    /* ---------------- stats ---------------- */
    const stats = arr(S.stats);
    if (stats.length)
      set(
        "stats-body",
        `<div class="card stats" data-reveal>${stats
          .map(
            (s) => `<div class="stat"><div class="stat-value" data-count="${esc(s.value)}">${reduceMotion ? esc(s.value) : "0"}</div>
              <div class="stat-label">${esc(s.label)}</div><div class="stat-detail">${esc(s.detail || "")}</div></div>`,
          )
          .join("")}</div>`,
      );

    /* ---------------- research & publications ---------------- */
    const R = S.research || {};
    const envIcons = ["signal", "alert", "eye"];
    const authorsHtml = (a) =>
      String(a || "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean)
        .map((x) => (ME.test(x) ? `<b>${esc(x)}</b>` : esc(x)))
        .join(", ");
    set(
      "research-body",
      `${head("Research", "Research & publications")}
      <div class="research-intro">
        <div data-reveal><p class="prose" style="margin-bottom:16px">${esc(R.overview || "")}</p>
          <ul class="env-list">${arr(R.environmentBullets).map((b, i) => `<li>${icon(envIcons[i % 3])}${esc(b)}</li>`).join("")}</ul>
        </div>
        <div data-reveal style="--d:.1s">
          <ul class="themes">${arr(R.themes).map((t, i) => `<li class="theme"><span class="n">${String(i + 1).padStart(2, "0")}</span><span>${esc(t)}</span></li>`).join("")}</ul>
        </div>
      </div>
      ${papers.length ? `<div class="subhead" data-reveal><h3>Publications</h3><span class="hint">${papers.length} peer-reviewed</span></div>
      <div class="pubs">${papers
        .map(
          (p, i) => `
        <article class="card pub${ME.test(String(p.authors || "").split(",")[0]) ? " first-author" : ""}" data-reveal style="--d:${i * 0.08}s">
          <div class="pub-index" aria-hidden="true">${esc(p.index || String(i + 1).padStart(2, "0"))}</div>
          <div>
            <div class="pub-meta">${p.venue ? `<span class="pub-venue">${esc(p.venue)}</span>` : ""}${p.role ? `<span class="pub-role">${esc(p.role)}</span>` : ""}</div>
            <h4><a href="paper.html?p=${encodeURIComponent(p.slug)}">${esc(p.title)}</a></h4>
            ${p.authors ? `<div class="authors">${authorsHtml(p.authors)}</div>` : ""}
            <p class="pub-summary">${esc(p.summary || "")}</p>
            ${chips(p.keywords, "chip chip-outline chip-mono")}
            <div class="pub-actions">
              ${arr(p.links)
                .map((l) => `<a class="btn btn-ghost btn-sm" href="${esc(l.href)}" target="_blank" rel="noopener">${icon(/code|github/i.test(l.label + l.href) ? "github" : "ext")}${esc(l.label)}</a>`)
                .join("")}
              <button class="btn btn-ghost btn-sm btn-cite" type="button" data-cite="${i}">${icon("quote")}Cite (BibTeX)</button>
              <a class="btn btn-primary btn-sm" href="paper.html?p=${encodeURIComponent(p.slug)}">Read the breakdown ${icon("arrow")}</a>
            </div>
          </div>
        </article>`,
        )
        .join("")}</div>` : ""}`,
    );
    $$("[data-cite]").forEach((b) => b.addEventListener("click", () => copyText(bibtex(papers[+b.dataset.cite]), "BibTeX copied")));

    /* ---------------- AUV fleet ---------------- */
    const SENS = S.SENSORS || {};
    set(
      "fleet-body",
      `${head("AUV fleet", "Three vehicles, three research questions", "Each vehicle is built around a different problem: acoustic perception, robust navigation in GPS-denied water, and autonomous docking with seabed survey.")}
      <div class="fleet">${arr(S.auvs)
        .map((a, i) => {
          const proj = projectBySlug(a.project) || {};
          const img = arr(proj.images)[0];
          const sensors = [...arr(a.sensors).map((s) => (SENS[s] ? SENS[s].name : s)), ...arr(a.extras)];
          const href = `project.html?p=${encodeURIComponent(a.project || a.slug)}`;
          return `
          <a class="card auv" href="${href}" data-reveal style="--d:${i * 0.1}s;color:inherit">
            <div class="auv-media">
              ${img ? `<img src="${esc(thumbOf(img.src))}" alt="${esc(img.alt || a.name)}" loading="lazy" decoding="async" width="640" height="480"/>` : ""}
              <span class="shade"></span><span class="auv-name">${esc(a.name)}</span>
            </div>
            <div class="auv-body">
              <div class="auv-tagline">${esc(a.tagline)}</div>
              <p class="auv-desc">${esc(a.description)}</p>
              ${chips(a.focus)}
              ${sensors.length ? `<div class="auv-sensors"><b>SENSORS ›</b> ${sensors.map(esc).join(" · ")}</div>` : ""}
              <span class="more-link">Explore the build ${icon("arrow")}</span>
            </div>
          </a>`;
        })
        .join("")}</div>`,
    );

    /* ---------------- projects ---------------- */
    const projects = arr(S.projectCatalog);
    const cats = [...new Set(projects.map((p) => p.category))];
    const catLabel = (c) => (S.CATEGORY_LABEL && S.CATEGORY_LABEL[c]) || c;
    const placeholder = (seed) => {
      // a little sonar fan drawn as SVG for projects without images
      const arcs = [0.35, 0.55, 0.75, 0.95].map((r) => `<path d="M${200 - 180 * r} 230 A ${180 * r} ${180 * r} 0 0 1 ${200 + 180 * r} 230" fill="none" stroke="currentColor" stroke-opacity=".28"/>`).join("");
      const blips = Array.from({ length: 7 }, (_, k) => {
        const ang = Math.PI * (0.15 + ((seed * 7 + k * 13) % 70) / 100);
        const r = 60 + ((seed * 31 + k * 47) % 110);
        return `<circle cx="${(200 - Math.cos(ang) * r).toFixed(1)}" cy="${(230 - Math.sin(ang) * r).toFixed(1)}" r="${2 + (k % 3)}" fill="currentColor" fill-opacity="${0.35 + (k % 4) * 0.15}"/>`;
      }).join("");
      return `<svg class="placeholder" viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="400" height="250" fill="currentColor" fill-opacity=".05"/>${arcs}<path d="M200 230 L60 90 A 198 198 0 0 1 340 90 Z" fill="currentColor" fill-opacity=".06"/>${blips}</svg>`;
    };
    set(
      "projects-body",
      `${head("Projects", "Selected projects", "Vehicles, research software and tools. Each one has a full write-up with figures, and a link to the code where the repository is public.")}
      <div class="filters" role="group" aria-label="Filter projects" data-reveal>
        <button class="filter" type="button" data-filter="*" aria-pressed="true">All<span class="count">${projects.length}</span></button>
        ${cats.map((c) => `<button class="filter" type="button" data-filter="${esc(c)}" aria-pressed="false">${esc(catLabel(c))}<span class="count">${projects.filter((p) => p.category === c).length}</span></button>`).join("")}
      </div>
      <div class="projects">${projects
        .map((p, i) => {
          const img = arr(p.images)[0];
          return `
          <a class="card project" href="project.html?p=${encodeURIComponent(p.slug)}" data-cat="${esc(p.category)}" data-tilt data-reveal style="--d:${(i % 3) * 0.08}s">
            <div class="project-media">
              ${img ? `<img src="${esc(thumbOf(img.src))}" alt="${esc(img.alt || p.title)}" loading="lazy" decoding="async" width="640" height="400"/>` : placeholder(i + 1)}
              <span class="cat">${esc(catLabel(p.category))}</span>
            </div>
            <div class="project-body">
              <h3>${esc(p.title)}</h3>
              <div class="org">${esc([p.org, p.period].filter(Boolean).join(" · "))}</div>
              <p class="tagline">${esc(p.tagline || p.summary || "")}</p>
              ${chips(arr(p.stack).slice(0, 4), "chip chip-outline chip-mono")}
              <span class="more-link">Read more ${icon("arrow")}</span>
            </div>
          </a>`;
        })
        .join("")}</div>`,
    );
    $$("[data-filter]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const f = btn.dataset.filter;
        $$("[data-filter]").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
        $$(".project").forEach((card) => {
          const show = f === "*" || card.dataset.cat === f;
          card.classList.toggle("hide", !show);
          if (show && !reduceMotion) {
            card.animate([{ opacity: 0, transform: "translateY(14px) scale(.98)" }, { opacity: 1, transform: "none" }], { duration: 450, easing: "cubic-bezier(.22,1,.36,1)" });
          }
        });
      }),
    );

    /* ---------------- experience ---------------- */
    set(
      "experience-body",
      `${head("Experience", "Research & engineering experience")}
      <div class="timeline">${arr(S.experience)
        .map(
          (r) => `
        <article class="role">
          <span class="role-node" aria-hidden="true"></span>
          <div class="card role-card" data-reveal>
            <div class="role-head">
              <div><h3>${esc(r.title)}</h3><div class="org">${esc(r.org)}</div></div>
              ${r.period ? `<span class="period">${esc(r.period)}</span>` : ""}
            </div>
            ${r.intro ? `<p class="role-intro">${esc(r.intro)}</p>` : ""}
            ${arr(r.sections).length ? `<details>
              <summary><span class="open-label">Show details · ${arr(r.sections).map((s) => esc(s.heading)).slice(0, 3).join(" · ")}${arr(r.sections).length > 3 ? " …" : ""}</span><span class="close-label">Hide details</span>${icon("down")}</summary>
              <div class="role-sections">${arr(r.sections)
                .map((s) => `<div><h4>${esc(s.heading)}</h4><ul>${arr(s.bullets).map((b) => `<li>${esc(b)}</li>`).join("")}</ul></div>`)
                .join("")}</div>
            </details>` : ""}
          </div>
        </article>`,
        )
        .join("")}</div>`,
    );
    // the timeline line draws as you scroll through it
    const tl = $(".timeline");
    if (tl) {
      const upd = () => {
        const r = tl.getBoundingClientRect();
        const p = (window.innerHeight * 0.6 - r.top) / r.height;
        tl.style.setProperty("--p", Math.max(0, Math.min(1, p)).toFixed(3));
      };
      if (reduceMotion) tl.style.setProperty("--p", "1");
      else {
        window.addEventListener("scroll", () => requestAnimationFrame(upd), { passive: true });
        upd();
      }
    }

    /* ---------------- education & honours ---------------- */
    const itemList = (xs) =>
      `<ul class="items">${arr(xs)
        .map((x) => `<li><div class="t">${esc(x.title || x.role)}</div>${x.org ? `<div class="s">${esc(x.org)}</div>` : ""}${x.detail ? `<div class="d">${esc(x.detail)}</div>` : ""}</li>`)
        .join("")}</ul>`;
    const eduCard = (title, ic, body, d = 0, wide = false) =>
      body ? `<div class="card edu-card${wide ? " edu-wide" : ""}" data-reveal style="--d:${d}s"><h3>${icon(ic)}${esc(title)}</h3>${body}</div>` : "";
    const deg = edu.degree || {};
    set(
      "education-body",
      `${head("Education", "Education & honours")}
      <div class="card edu-hero" data-reveal>
        <div class="edu-logo">${icon("cap")}</div>
        <div><h3>${esc(deg.title || "")}</h3><div class="school">${esc(deg.school || "")}</div></div>
        ${deg.graduation ? `<span class="period">${esc(deg.graduation)}</span>` : ""}
      </div>
      <div class="edu-grid">
        ${eduCard("Awards & honours", "award", arr(edu.awards).length && itemList(edu.awards))}
        ${eduCard("Conferences", "mic", arr(edu.conferences).length && itemList(edu.conferences), 0.08)}
        ${eduCard("Leadership", "users", arr(edu.leadership).length && itemList(edu.leadership))}
        ${eduCard("Events", "calendar", arr(edu.events).length && itemList(edu.events), 0.08)}
        ${eduCard("Relevant coursework", "book", arr(edu.coursework).length && chips(edu.coursework, "chip chip-outline"), 0, true)}
      </div>`,
    );

    /* ---------------- skills ---------------- */
    const SK = S.skills || {};
    let groups = arr(SK.groups);
    if (!groups.length)
      groups = Object.entries(SK)
        .filter(([k, v]) => Array.isArray(v) && v.every((x) => typeof x === "string"))
        .map(([k, v]) => ({ label: k.replace(/^\w/, (c) => c.toUpperCase()), items: v }));
    set(
      "skills-body",
      `${head("Skills", "Skills & expertise")}
      ${groups.length ? `<div class="card skill-groups" data-reveal>${groups
        .map((g) => `<div class="skill-row"><h3>${esc(g.label || g.title)}</h3>${chips(g.items)}</div>`)
        .join("")}</div>` : ""}
      <div class="expertise">${arr(SK.expertise)
        .map(
          (e, i) => `<div class="card exp-card" data-reveal style="--d:${(i % 3) * 0.07}s"><h3><span class="n">${String(i + 1).padStart(2, "0")}</span>${esc(e.title)}</h3>${ticks(e.bullets)}</div>`,
        )
        .join("")}</div>`,
    );

    /* ---------------- the next dive: five-act animated story ---------------- */
    if (window.renderNext) window.renderNext(S.next, { set, head, esc, arr });

    /* ---------------- contact ---------------- */
    const linkCard = (k, v, href, ic, ext) =>
      `<a class="contact-link" href="${esc(href)}"${ext ? ' target="_blank" rel="noopener"' : ""}><span class="ic">${icon(ic)}</span><span><div class="k">${esc(k)}</div><div class="v">${esc(v)}</div></span></a>`;
    const fp = about.futurePlans;
    set(
      "contact-body",
      `<div class="card contact" data-reveal="scale">
        <div class="seabed-mark">▲ 0 m · back at the surface</div>
        <div class="eyebrow" style="justify-content:center">Contact</div>
        <h2>Let’s talk about the ocean.</h2>
        <p>${fp && fp.target ? `Currently looking for: ${esc(fp.target)}. ` : ""}I’m happy to discuss research, collaborations or underwater robots.</p>
        <div class="contact-links">
          ${contact.emailPersonal ? linkCard("Email", contact.emailPersonal, `mailto:${contact.emailPersonal}`, "mail") : ""}
          ${contact.emailInstitute ? linkCard("Institute email", contact.emailInstitute, `mailto:${contact.emailInstitute}`, "cap") : ""}
          ${contact.linkedin ? linkCard("LinkedIn", "samyak-kumar", contact.linkedin, "linkedin", true) : ""}
          ${contact.githubUrl ? linkCard("GitHub", contact.githubUser || "GitHub", contact.githubUrl, "github", true) : ""}
          ${linkCard("Curriculum vitae", "Download PDF", L.cv, "download", true)}
        </div>
        <div class="ascend" style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
          ${contact.emailPersonal ? `<button class="btn btn-ghost btn-sm" type="button" id="copy-email">${icon("copy")}Copy email address</button>` : ""}
          <a class="btn btn-primary btn-sm" href="#home" data-ascend>Back to the surface ↑</a>
        </div>
      </div>`,
    );
    const ce = document.getElementById("copy-email");
    if (ce) ce.addEventListener("click", () => copyText(contact.emailPersonal, "Email copied"));

    initSonar(S);

    // honour a #section deep link now that content exists
    if (location.hash) {
      const t = document.getElementById(location.hash.slice(1));
      if (t) setTimeout(() => t.scrollIntoView(), 30);
    }
  });

  /* ================= hero sonar (PPI display) ================= */
  function initSonar(S) {
    const { reduceMotion, lowPower } = window.UI;
    const canvas = document.getElementById("sonar-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const readout = document.getElementById("sonar-bearing");
    let size = 0, dpr = 1, rgb = "10,127,145", textColor = "#5f7a8d", running = true, visible = true;
    const names = (S.auvs || []).map((a) => a.name);
    const rand = (a, b) => a + Math.random() * (b - a);

    // contacts sit outside the portrait (inner radius ≈ 0.46 R)
    const contacts = [];
    const makeContacts = () => {
      contacts.length = 0;
      const n = 10;
      for (let i = 0; i < n; i++) {
        contacts.push({
          ang: (i / n) * Math.PI * 2 + rand(-0.25, 0.25),
          r: rand(0.58, 0.93),
          size: rand(1.6, 3.4),
          life: 0,
          label: i % 3 === 0 && i / 3 < names.length ? names[i / 3] : null,
          drift: rand(-0.00004, 0.00004),
        });
      }
    };
    const readColors = () => {
      const cs = getComputedStyle(canvas);
      rgb = cs.getPropertyValue("--sonar").trim() || rgb;
      textColor = cs.getPropertyValue("--text-3").trim() || textColor;
    };
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      size = Math.max(200, r.width);
      dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 2);
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const TAU = Math.PI * 2;
    let sweep = -Math.PI / 2, last = 0, pingT = 0;

    const frame = (t) => {
      const c = size / 2, R = size * 0.47, inner = R * 0.47;
      const dt = last ? Math.min(50, t - last) : 16;
      last = t;
      const prev = sweep;
      sweep = (sweep + dt * 0.0011) % TAU;
      ctx.clearRect(0, 0, size, size);

      // range rings + cross hairs
      ctx.lineWidth = 1;
      for (let i = 1; i <= 4; i++) {
        const rr = inner + ((R - inner) * i) / 4;
        ctx.beginPath();
        ctx.arc(c, c, rr, 0, TAU);
        ctx.strokeStyle = `rgba(${rgb},${i === 4 ? 0.5 : 0.16})`;
        ctx.setLineDash(i === 4 ? [] : [2, 5]);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      for (let k = 0; k < 4; k++) {
        const a = (k * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(c + Math.cos(a) * inner, c + Math.sin(a) * inner);
        ctx.lineTo(c + Math.cos(a) * R, c + Math.sin(a) * R);
        ctx.moveTo(c - Math.cos(a) * inner, c - Math.sin(a) * inner);
        ctx.lineTo(c - Math.cos(a) * R, c - Math.sin(a) * R);
        ctx.strokeStyle = `rgba(${rgb},0.1)`;
        ctx.stroke();
      }
      // bearing ticks
      for (let d = 0; d < 360; d += 5) {
        const a = (d * Math.PI) / 180 - Math.PI / 2;
        const len = d % 30 === 0 ? 9 : 4;
        ctx.beginPath();
        ctx.moveTo(c + Math.cos(a) * R, c + Math.sin(a) * R);
        ctx.lineTo(c + Math.cos(a) * (R + len), c + Math.sin(a) * (R + len));
        ctx.strokeStyle = `rgba(${rgb},${d % 30 === 0 ? 0.6 : 0.3})`;
        ctx.stroke();
      }
      ctx.font = `500 ${Math.max(9, size * 0.021)}px "JetBrains Mono", monospace`;
      ctx.fillStyle = textColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let d = 0; d < 360; d += 90) {
        const a = (d * Math.PI) / 180 - Math.PI / 2;
        ctx.fillText(String(d).padStart(3, "0"), c + Math.cos(a) * (R + 20), c + Math.sin(a) * (R + 20));
      }

      // sweep wedge (trailing glow)
      const trail = 0.9;
      if (ctx.createConicGradient) {
        const g = ctx.createConicGradient(sweep - trail, c, c);
        g.addColorStop(0, `rgba(${rgb},0)`);
        g.addColorStop(trail / TAU, `rgba(${rgb},0.32)`);
        g.addColorStop(trail / TAU + 0.0001, `rgba(${rgb},0)`);
        g.addColorStop(1, `rgba(${rgb},0)`);
        ctx.beginPath();
        ctx.moveTo(c, c);
        ctx.arc(c, c, R, sweep - trail, sweep);
        ctx.closePath();
        ctx.fillStyle = g;
        ctx.fill();
      } else {
        for (let k = 0; k < 12; k++) {
          ctx.beginPath();
          ctx.moveTo(c, c);
          ctx.arc(c, c, R, sweep - (trail * (k + 1)) / 12, sweep - (trail * k) / 12);
          ctx.closePath();
          ctx.fillStyle = `rgba(${rgb},${0.028 * (12 - k) / 12 * 3})`;
          ctx.fill();
        }
      }
      ctx.beginPath();
      ctx.moveTo(c + Math.cos(sweep) * inner, c + Math.sin(sweep) * inner);
      ctx.lineTo(c + Math.cos(sweep) * R, c + Math.sin(sweep) * R);
      ctx.strokeStyle = `rgba(${rgb},0.85)`;
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.lineWidth = 1;

      // outgoing ping ring
      pingT = (pingT + dt) % 2600;
      const pk = pingT / 2600;
      ctx.beginPath();
      ctx.arc(c, c, inner + (R - inner) * pk, 0, TAU);
      ctx.strokeStyle = `rgba(${rgb},${0.45 * (1 - pk)})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.lineWidth = 1;

      // contacts light up as the beam passes, then fade
      const crossed = (a) => {
        const norm = (x) => ((x % TAU) + TAU) % TAU;
        const p = norm(prev), s = norm(sweep), q = norm(a);
        return p <= s ? q > p && q <= s : q > p || q <= s;
      };
      for (const ct of contacts) {
        ct.ang += ct.drift * dt;
        if (crossed(ct.ang)) ct.life = 1;
        ct.life = Math.max(0, ct.life - dt * 0.00032);
        if (ct.life <= 0) continue;
        const x = c + Math.cos(ct.ang) * ct.r * R;
        const y = c + Math.sin(ct.ang) * ct.r * R;
        ctx.beginPath();
        ctx.arc(x, y, ct.size + (1 - ct.life) * 3, 0, TAU);
        ctx.fillStyle = `rgba(${rgb},${0.9 * ct.life})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, ct.size + 6 + (1 - ct.life) * 10, 0, TAU);
        ctx.strokeStyle = `rgba(${rgb},${0.35 * ct.life})`;
        ctx.stroke();
        if (ct.label && size > 300) {
          ctx.globalAlpha = ct.life;
          ctx.fillStyle = textColor;
          ctx.textAlign = "left";
          const brg = Math.round((((ct.ang + Math.PI / 2) * 180) / Math.PI + 360) % 360);
          ctx.fillText(`${ct.label} ${String(brg).padStart(3, "0")}°`, x + 10, y - 10);
          ctx.globalAlpha = 1;
          ctx.textAlign = "center";
        }
      }

      if (readout) {
        const brg = Math.round((((sweep + Math.PI / 2) * 180) / Math.PI + 360) % 360);
        readout.textContent = String(brg).padStart(3, "0");
      }
    };

    const loop = (t) => {
      if (!running || !visible) { last = 0; return; }
      frame(t);
      requestAnimationFrame(loop);
    };
    const start = () => { if (running && visible) requestAnimationFrame(loop); };

    readColors();
    resize();
    makeContacts();
    window.addEventListener("resize", () => { resize(); if (reduceMotion) still(); });
    document.addEventListener("themechange", () => { readColors(); if (reduceMotion) still(); });
    const still = () => {
      contacts.forEach((c) => (c.life = 0.8));
      sweep = -Math.PI / 2 + 0.6;
      last = 0;
      frame(0);
    };
    if (reduceMotion) { still(); return; }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([e]) => {
        const was = visible;
        visible = e.isIntersecting;
        if (visible && !was) start();
      }).observe(canvas);
    }
    document.addEventListener("visibilitychange", () => {
      const was = running;
      running = !document.hidden;
      if (running && !was) start();
    });
    start();
  }
})();
