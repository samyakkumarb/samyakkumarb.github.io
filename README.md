# Samyak Kumar — portfolio (GitHub Pages)

A light, static version of the portfolio for marine robotics and AUV research. It is plain HTML, CSS and JavaScript: no framework, no build step and no npm on GitHub Pages.

**Live:** https://samyakkumarb.github.io/

## What's here

| Path | What it is |
|---|---|
| `index.html` | Single long page: hero (sonar display) → About → stats → Research & publications → AUV fleet → Projects → Experience → Education → Skills → Contact |
| `project.html?p=<slug>` | Project write-up: specs, results, pipeline, sections, gallery with lightbox, related work |
| `paper.html?p=<slug>` | Publication breakdown with BibTeX |
| `assets/js/content.js` | **Generated.** All the text (`window.SITE`), pulled from `~/Website/src/content/*.ts` |
| `assets/js/links.js` | Hand-edited: GitHub repo for each project (public repos only) and the CV filename |
| `assets/js/common.js` | Floating name/CV/search pills, depth gauge (the nav), ocean background, scroll reveals, card tilt, Ctrl/⌘+K search |
| `assets/js/home.js`, `detail.js` | Page renderers |
| `assets/css/style.css`, `print.css` | Depth-zone colours (surface → seabed), plus a clean print view |
| `projects/<slug>/*.webp` | Project images (copied by the sync script) |
| `Samyak_Kumar_CV.pdf` | The CV behind every "CV" button |
| `tools/sync-content.mjs` | Copies content and images over from the original React site |

Features: the home page is a dive. Each section is a depth zone (surface, sunlit, twilight, midnight, abyss, seabed) whose water colour darkens as you scroll, and a depth gauge with a descending AUV replaces the menu (a depth chip and zone list on small screens). The page ends with "The next dive", an ascent back to the surface: a scroll-driven five-act animated scene (pool tests → higher studies → real sea trials → polar robotics → bigger scale) pinned beside the text, built from inline SVG and CSS (`assets/js/next.js`). Fish, jellyfish and an anglerfish drift through the deep zones. Also an animated sonar hero; light rays near the surface; bubbles that turn into marine snow and bioluminescent sparkles with depth, all moving away from the cursor; scroll reveals and count-up numbers; a timeline that draws itself as you scroll; tilt cards; Ctrl/⌘+K (or `/`) search; one-click BibTeX copy; and a print stylesheet. Animations are switched off for visitors who have `prefers-reduced-motion` set.

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

## Deploy

Repo: `samyakkumarb/samyakkumarb.github.io` (in the `samyakkumarb` organization). Pages deploys from `main` / root, so to update the live site:

```bash
git add -A && git commit -m "Update" && git push
```

The site is about 6 MB in total. GitHub Pages allows 1 GB per site, so there is plenty of room.
