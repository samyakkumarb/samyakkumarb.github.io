# Samyak Kumar — portfolio (GitHub Pages)

A light, static version of the portfolio for marine robotics and AUV research. It is plain HTML, CSS and JavaScript: no framework, no build step and no npm on GitHub Pages.

**Live:** https://samyakkumarb.github.io

## What's here

| Path | What it is |
|---|---|
| `index.html` | Single long page: hero (sonar display) → About → stats → Research & publications → AUV fleet → Projects → Experience → Education → Skills → Contact |
| `project.html?p=<slug>` | Project write-up: specs, results, pipeline, sections, gallery with lightbox, related work |
| `paper.html?p=<slug>` | Publication breakdown with BibTeX |
| `assets/js/content.js` | **Generated.** All the text (`window.SITE`), pulled from `~/Website/src/content/*.ts` |
| `assets/js/links.js` | Hand-edited: GitHub repo for each project (public repos only) and the CV filename |
| `assets/js/common.js` | Theme toggle, header, ocean background, scroll reveals, card tilt, Ctrl/⌘+K search |
| `assets/js/home.js`, `detail.js` | Page renderers |
| `assets/css/style.css`, `print.css` | Light and dark ocean themes, plus a clean print view |
| `projects/<slug>/*.webp` | Project images (copied by the sync script) |
| `Samyak_Kumar_CV.pdf` | The CV behind every "CV" button |
| `tools/sync-content.mjs` | Copies content and images over from the original React site |

Features: light theme by default with a saved dark toggle; an animated sonar hero; marine snow and bubbles that move away from the cursor; scroll reveals and count-up numbers; a timeline that draws itself as you scroll; tilt cards; Ctrl/⌘+K (or `/`) search; one-click BibTeX copy; and a print stylesheet. Animations are switched off for visitors who have `prefers-reduced-motion` set.

## Updating content

The text lives in the original site (`~/Website/src/content/*.ts`). After editing it there, run:

```bash
cd ~/Website_github
node tools/sync-content.mjs          # or: node tools/sync-content.mjs /path/to/Website
```

This rewrites `assets/js/content.js` and `sitemap.xml`, and copies or removes images in `projects/`. It only *reads* `~/Website`, and it uses the esbuild already installed in `~/Website/node_modules`.

Other edits:
- **CV:** replace `Samyak_Kumar_CV.pdf` (keep the filename).
- **GitHub button on a project:** add `"<project-slug>": "<repo-name>"` to `assets/js/links.js` once the repo is public.
- **Photo:** `assets/img/headshot.webp`. **Social preview:** `assets/img/og-card.png` (1200×630).

## Preview locally

```bash
cd ~/Website_github
python3 -m http.server 8000      # open http://localhost:8000
```

## Deploy to GitHub Pages (samyakkumarb.github.io)

1. On GitHub: **+ → New organization → Free**, and name it `samyakkumarb`.
2. In that organisation, create a **public** repo named exactly `samyakkumarb.github.io` (leave it empty).
3. Push this folder:
   ```bash
   cd ~/Website_github
   git add -A && git commit -m "Portfolio site"
   git remote add origin git@github.com:samyakkumarb/samyakkumarb.github.io.git
   git push -u origin main
   ```
4. Repo **Settings → Pages → Build and deployment → Source: Deploy from a branch → `main` / `(root)`**.
5. After about a minute the site is live at https://samyakkumarb.github.io.

The site is about 6 MB in total. GitHub Pages allows 1 GB per site, so there is plenty of room.
