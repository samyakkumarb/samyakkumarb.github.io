/* Renders project.html?p=<slug> and paper.html?p=<slug>. */
(function () {
  "use strict";

  document.addEventListener("ui:ready", () => {
    const S = window.SITE || {};
    const { esc, arr, $, $$, icon, copyText, bibtex, repoUrl, thumbOf, reduceMotion } = window.UI;
    const page = document.body.dataset.page;
    const slug = new URLSearchParams(location.search).get("p");
    const root = document.getElementById("detail");
    const ME = /Samyak/i;

    const chips = (xs, cls = "chip") => `<ul class="chips">${arr(xs).map((x) => `<li class="${cls}">${esc(x)}</li>`).join("")}</ul>`;
    const bullets = (xs) => (arr(xs).length ? `<ul class="bullets">${arr(xs).map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` : "");
    const paras = (xs) => arr(xs).map((p) => `<p>${esc(p)}</p>`).join("");
    const setMeta = (title, desc) => {
      document.title = `${title} — Samyak Kumar`;
      const m = $('meta[name="description"]');
      if (m && desc) m.setAttribute("content", desc);
    };
    const notFound = (what, back) => {
      setMeta("Not found", "");
      root.innerHTML = `<div class="container not-found"><div class="eyebrow" style="justify-content:center">Signal lost</div><h1>No ${what} here</h1>
        <p>That link doesn’t match anything on this site.</p><a class="btn btn-primary" href="${back}">${icon("back")}Back</a></div>`;
    };

    const sectionsOut = []; // [{id, title, html}]
    const add = (id, title, html) => html && sectionsOut.push({ id, title, html });
    const layout = () => `
      <div class="detail-layout">
        <nav class="toc" aria-label="On this page"><h2>On this page</h2><ol>${sectionsOut
          .map((s) => `<li><a href="#${esc(s.id)}">${esc(s.title)}</a></li>`)
          .join("")}</ol></nav>
        <div class="article">${sectionsOut
          .map((s) => `<section id="${esc(s.id)}" data-reveal><h2>${esc(s.title)}</h2>${s.html}</section>`)
          .join("")}</div>
      </div>`;
    const pager = (list, idx, hrefOf, titleOf) => {
      const prev = list[idx - 1], next = list[idx + 1];
      if (!prev && !next) return "";
      return `<nav class="pager" aria-label="More">
        ${prev ? `<a class="card" href="${hrefOf(prev)}"><div class="k">${icon("left")}Previous</div><div class="t">${esc(titleOf(prev))}</div></a>` : "<span></span>"}
        ${next ? `<a class="card next" href="${hrefOf(next)}"><div class="k">Next${icon("right")}</div><div class="t">${esc(titleOf(next))}</div></a>` : "<span></span>"}
      </nav>`;
    };

    /* ================= project ================= */
    if (page === "project") {
      const list = arr(S.projectCatalog);
      const idx = list.findIndex((p) => p.slug === slug);
      if (idx < 0) return notFound("project", "index.html#projects");
      const p = list[idx];
      setMeta(p.title, p.summary || p.tagline);
      const imgs = arr(p.images);
      const repo = repoUrl(p.slug);
      const auv = arr(S.auvs).find((a) => a.slug === p.relatedAuv || a.project === p.slug);
      const paper = arr(S.papers).find((x) => x.slug === p.relatedPaper);

      add("overview", "Overview", paras(p.overview) || `<p>${esc(p.summary)}</p>`);
      if (arr(p.specs).length)
        add("glance", "At a glance", `<div class="card specs-wrap"><table class="specs"><tbody>${arr(p.specs)
          .map((s) => `<tr><th scope="row">${esc(s.label)}</th><td>${esc(s.value)}</td></tr>`)
          .join("")}</tbody></table></div>`);
      if (arr(p.results).length)
        add("results", "Key results", `<div class="results">${arr(p.results)
          .map((r) => `<div class="card result"><div class="v">${esc(r.value)}</div><div class="l">${esc(r.label)}</div>${r.note ? `<span class="n">${esc(r.note)}</span>` : ""}</div>`)
          .join("")}</div>`);
      if (arr(p.pipeline).length)
        add("pipeline", p.pipelineTitle || "Pipeline", `<ol class="pipeline">${arr(p.pipeline)
          .map((s, i) => `<li class="card step" style="--d:${i * 0.12}s"><h3>${esc(s.title)}</h3><p>${esc(s.detail)}</p></li>`)
          .join("")}</ol>`);
      arr(p.sections).forEach((s, i) =>
        add(s.id || `s${i}`, s.title, paras(s.paragraphs) + bullets(s.bullets) + (arr(s.equations).length ? `<div class="equations">${arr(s.equations).map(esc).join("\n")}</div>` : "")),
      );
      if (imgs.length > 1)
        add("gallery", "Gallery", `<div class="gallery">${imgs
          .map((im, i) => `<figure data-lb="${i}" tabindex="0" role="button" aria-label="Open image: ${esc(im.alt)}"><img src="${esc(thumbOf(im.src))}" alt="${esc(im.alt)}" loading="lazy" decoding="async" width="480" height="360"/><figcaption>${esc(im.caption || "")}</figcaption></figure>`)
          .join("")}</div>`);
      const related = [
        paper && { k: "Paper", t: paper.title, href: `paper.html?p=${encodeURIComponent(paper.slug)}` },
        ...arr(p.relatedProjects)
          .map((sl) => list.find((x) => x.slug === sl))
          .filter(Boolean)
          .map((x) => ({ k: x.category, t: x.title, href: `project.html?p=${encodeURIComponent(x.slug)}` })),
      ].filter(Boolean);
      if (related.length)
        add("related", "Related", `<div class="related">${related.map((r) => `<a class="card" href="${r.href}"><div class="k">${esc(r.k)}</div><div class="t">${esc(r.t)}</div></a>`).join("")}</div>`);

      const meta = [
        ["Organisation", p.org],
        ["Role", p.role],
        ["Period", p.period],
        auv && ["Vehicle", auv.name],
      ].filter((m) => m && m[1]);

      root.innerHTML = `
        <div class="container">
          <div class="crumbs"><a href="index.html#projects">${icon("back")}All projects</a><span>/</span><span>${esc(p.category)}</span></div>
          <header class="detail-head hero-anim">
            <div class="eyebrow">${esc(p.category)} project</div>
            <h1>${esc(p.title)}</h1>
            ${p.tagline ? `<p class="detail-tagline">${esc(p.tagline)}</p>` : ""}
            ${meta.length ? `<div class="detail-meta">${meta.map(([k, v]) => `<div><span class="k">${esc(k)}</span><span class="v">${esc(v)}</span></div>`).join("")}</div>` : ""}
            ${chips(p.stack, "chip chip-outline chip-mono")}
            <div class="detail-actions">
              ${repo ? `<a class="btn btn-primary" href="${esc(repo)}" target="_blank" rel="noopener">${icon("github")}View code on GitHub</a>` : ""}
              ${paper ? `<a class="btn btn-ghost" href="paper.html?p=${encodeURIComponent(paper.slug)}">${icon("paper")}Related paper</a>` : ""}
              ${imgs.length > 1 ? `<a class="btn btn-ghost" href="#gallery">${icon("eye")}Gallery (${imgs.length})</a>` : ""}
            </div>
          </header>
          ${imgs[0] ? `<figure class="detail-hero" data-lb="0" style="margin:0 0 46px"><img src="${esc(imgs[0].src)}" alt="${esc(imgs[0].alt)}" fetchpriority="high"/></figure>` : ""}
          ${layout()}
          ${pager(list, idx, (x) => `project.html?p=${encodeURIComponent(x.slug)}`, (x) => x.title)}
        </div>`;
      initLightbox(imgs);
    }

    /* ================= paper ================= */
    if (page === "paper") {
      const list = arr(S.papers);
      const idx = list.findIndex((p) => p.slug === slug);
      if (idx < 0) return notFound("paper", "index.html#research");
      const p = list[idx];
      setMeta(p.title, p.summary);
      const authors = String(p.authors || "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean)
        .map((x) => (ME.test(x) ? `<b style="color:var(--text)">${esc(x)}</b>` : esc(x)))
        .join(", ");

      add("summary", "Summary", `<p>${esc(p.summary)}</p>`);
      arr(p.sections).forEach((s, i) => add(s.id || `s${i}`, s.title, paras(s.paragraphs)));
      if (arr(p.pipeline).length)
        add("method", p.pipelineTitle || "Method", `<ol class="pipeline">${arr(p.pipeline)
          .map((s, i) => `<li class="card step" style="--d:${i * 0.12}s"><h3>${esc(s.title)}</h3><ul>${arr(s.bullets).map((b) => `<li>${esc(b)}</li>`).join("")}</ul>${s.detail ? `<p>${esc(s.detail)}</p>` : ""}</li>`)
          .join("")}</ol>`);
      if (arr(p.contributions).length) add("contributions", "Contributions", bullets(p.contributions));
      if (arr(p.outcomes).length) add("outcomes", p.outcomesTitle || "Results", bullets(p.outcomes));
      const relatedProjects = arr(S.projectCatalog).filter((x) => x.relatedPaper === p.slug);
      if (relatedProjects.length)
        add("related", "Related projects", `<div class="related">${relatedProjects
          .map((x) => `<a class="card" href="project.html?p=${encodeURIComponent(x.slug)}"><div class="k">${esc(x.category)}</div><div class="t">${esc(x.title)}</div></a>`)
          .join("")}</div>`);
      add("cite", "Cite", `<div class="equations" id="bib">${esc(bibtex(p))}</div><div style="margin-top:12px"><button class="btn btn-ghost btn-sm" type="button" id="copy-bib">${icon("copy")}Copy BibTeX</button></div>`);

      root.innerHTML = `
        <div class="container">
          <div class="crumbs"><a href="index.html#research">${icon("back")}Publications</a><span>/</span><span>Paper ${esc(p.index || idx + 1)}</span></div>
          <header class="detail-head hero-anim">
            <div class="pub-meta">${p.venue ? `<span class="pub-venue">${esc(p.venue)}</span>` : ""}${p.role ? `<span class="pub-role">${esc(p.role)}</span>` : ""}</div>
            <h1>${esc(p.title)}</h1>
            ${authors ? `<p class="detail-tagline" style="font-size:1rem">${authors}</p>` : ""}
            ${chips(p.keywords, "chip chip-outline chip-mono")}
            <div class="detail-actions">
              ${arr(p.links).map((l, i) => `<a class="btn ${i === 0 ? "btn-primary" : "btn-ghost"}" href="${esc(l.href)}" target="_blank" rel="noopener">${icon(/code|github/i.test(l.label + l.href) ? "github" : "ext")}${esc(l.label)}</a>`).join("")}
              <button class="btn btn-ghost" type="button" id="cite-top">${icon("quote")}Cite</button>
            </div>
          </header>
          ${layout()}
          ${pager(list, idx, (x) => `paper.html?p=${encodeURIComponent(x.slug)}`, (x) => x.title)}
        </div>`;
      const cp = () => copyText(bibtex(p), "BibTeX copied");
      $("#copy-bib").addEventListener("click", cp);
      $("#cite-top").addEventListener("click", cp);
    }

    /* ---------------- TOC scroll-spy ---------------- */
    const tocLinks = $$(".toc a");
    if (tocLinks.length) {
      const secs = tocLinks.map((a) => document.getElementById(a.getAttribute("href").slice(1))).filter(Boolean);
      const spy = () => {
        const y = window.scrollY + window.innerHeight * 0.3;
        let cur = secs[0] && secs[0].id;
        for (const s of secs) if (s.offsetTop <= y) cur = s.id;
        tocLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${cur}`));
      };
      window.addEventListener("scroll", () => requestAnimationFrame(spy), { passive: true });
      spy();
    }
    if (location.hash) {
      const t = document.getElementById(location.hash.slice(1));
      if (t) setTimeout(() => t.scrollIntoView(), 30);
    }

    /* ---------------- lightbox ---------------- */
    function initLightbox(images) {
      if (!images.length) return;
      const lb = document.createElement("div");
      lb.className = "lightbox";
      lb.setAttribute("role", "dialog");
      lb.setAttribute("aria-modal", "true");
      lb.setAttribute("aria-label", "Image viewer");
      lb.innerHTML = `
        <button class="lb-btn lb-close" type="button" aria-label="Close">${icon("close")}</button>
        ${images.length > 1 ? `<button class="lb-btn lb-prev" type="button" aria-label="Previous image">${icon("left")}</button><button class="lb-btn lb-next" type="button" aria-label="Next image">${icon("right")}</button>` : ""}
        <figure><img alt=""/><figcaption></figcaption></figure>`;
      document.body.appendChild(lb);
      const img = $("img", lb), cap = $("figcaption", lb);
      let i = 0, lastFocus = null;
      const show = (k) => {
        i = (k + images.length) % images.length;
        const im = images[i];
        img.src = im.src;
        img.alt = im.alt || "";
        cap.innerHTML = `<span class="count">${i + 1} / ${images.length}</span>${esc(im.caption || "")}`;
        if (!reduceMotion) img.animate([{ opacity: 0.2 }, { opacity: 1 }], { duration: 250 });
      };
      const open = (k) => {
        lastFocus = document.activeElement;
        show(k);
        lb.classList.add("open");
        document.body.style.overflow = "hidden";
        $(".lb-close", lb).focus();
      };
      const close = () => {
        lb.classList.remove("open");
        document.body.style.overflow = "";
        if (lastFocus) lastFocus.focus();
      };
      $(".lb-close", lb).addEventListener("click", close);
      const pv = $(".lb-prev", lb), nx = $(".lb-next", lb);
      if (pv) pv.addEventListener("click", () => show(i - 1));
      if (nx) nx.addEventListener("click", () => show(i + 1));
      lb.addEventListener("click", (e) => { if (e.target === lb || e.target.tagName === "FIGURE") close(); });
      document.addEventListener("keydown", (e) => {
        if (!lb.classList.contains("open")) return;
        if (e.key === "Escape") close();
        else if (e.key === "ArrowLeft") show(i - 1);
        else if (e.key === "ArrowRight") show(i + 1);
      });
      let sx = null;
      lb.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
      lb.addEventListener("touchend", (e) => {
        if (sx == null) return;
        const dx = e.changedTouches[0].clientX - sx;
        if (Math.abs(dx) > 50) show(i + (dx < 0 ? 1 : -1));
        sx = null;
      });
      $$("[data-lb]").forEach((el) => {
        el.addEventListener("click", () => open(+el.dataset.lb));
        el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(+el.dataset.lb); } });
      });
    }
  });
})();
