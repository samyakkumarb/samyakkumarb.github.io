/* "The next dive": a five-act animated story (pool → studies → sea trials → polar → scale),
   plus ambient sea creatures in the deep zones. Pure SVG + CSS animation; JS only switches acts. */
(function () {
  "use strict";

  const href = (to) => {
    const m = String(to).match(/^\/(projects|research)\/(.+)$/);
    if (!m) return to;
    return `${m[1] === "research" ? "paper" : "project"}.html?p=${encodeURIComponent(m[2])}`;
  };

  /* ---------- shared defs ---------- */
  const DEFS = `<defs>
    <linearGradient id="nd-auvbody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe08a"/><stop offset=".55" stop-color="#fbbf24"/><stop offset="1" stop-color="#d97706"/></linearGradient>
    <symbol id="nd-auv" viewBox="0 0 120 40">
      <path d="M16 12 L8 2 H15 L28 12Z M16 28 L8 38 H15 L28 28Z" fill="#f59e0b" stroke="#7a4a00" stroke-width=".8"/>
      <path d="M14 12 H92 C106 12 116 16 116 20 C116 24 106 28 92 28 H14 C9 28 6 24 6 20 C6 16 9 12 14 12Z" fill="url(#nd-auvbody)" stroke="#7a4a00" stroke-width="1"/>
      <rect x="0" y="15" width="6" height="10" rx="2" fill="#334155"/>
      <rect x="50" y="7" width="14" height="5" rx="1.5" fill="#f59e0b" stroke="#7a4a00" stroke-width=".6"/>
      <path d="M34 13 V27 M74 13 V27" stroke="#92400e" stroke-width=".8" opacity=".45"/>
      <circle cx="108" cy="20" r="2.6" fill="#fffbe0"/>
    </symbol>
    <linearGradient id="nd-pool" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fe0f0"/><stop offset=".5" stop-color="#2fb3cf"/><stop offset="1" stop-color="#1786a8"/></linearGradient>
    <pattern id="nd-tiles" width="34" height="34" patternUnits="userSpaceOnUse"><path d="M34 0H0V34" fill="none" stroke="#e8fbff" stroke-width="1.4"/></pattern>
    <pattern id="nd-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#93c5fd" stroke-opacity=".12" stroke-width="1"/></pattern>
    <pattern id="nd-grid5" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M100 0H0V100" fill="none" stroke="#93c5fd" stroke-opacity=".22" stroke-width="1"/></pattern>
    <linearGradient id="nd-dawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#27406b"/><stop offset=".45" stop-color="#c2708a"/><stop offset=".8" stop-color="#f6a877"/><stop offset="1" stop-color="#fde2b8"/></linearGradient>
    <linearGradient id="nd-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a6f96"/><stop offset=".35" stop-color="#174d74"/><stop offset="1" stop-color="#071f38"/></linearGradient>
    <radialGradient id="nd-sun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff3c4"/><stop offset=".45" stop-color="#ffd38a"/><stop offset="1" stop-color="#ffb46b" stop-opacity="0"/></radialGradient>
    <linearGradient id="nd-night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#030816"/><stop offset="1" stop-color="#0d1f45"/></linearGradient>
    <linearGradient id="nd-under" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f4a63"/><stop offset=".4" stop-color="#082d44"/><stop offset="1" stop-color="#030f1c"/></linearGradient>
    <linearGradient id="nd-ice" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".35" stop-color="#dff3fb"/><stop offset="1" stop-color="#8fcde6"/></linearGradient>
    <linearGradient id="nd-aur1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#34f5a4" stop-opacity="0"/><stop offset=".55" stop-color="#34f5a4" stop-opacity=".7"/><stop offset="1" stop-color="#34f5a4" stop-opacity="0"/></linearGradient>
    <linearGradient id="nd-aur2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a78bfa" stop-opacity="0"/><stop offset=".6" stop-color="#a78bfa" stop-opacity=".6"/><stop offset="1" stop-color="#a78bfa" stop-opacity="0"/></linearGradient>
    <linearGradient id="nd-fan" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#5eead4" stop-opacity=".55"/><stop offset="1" stop-color="#5eead4" stop-opacity="0"/></linearGradient>
    <linearGradient id="nd-deep" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b3a63"/><stop offset="1" stop-color="#031426"/></linearGradient>
    <filter id="nd-blur" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="9"/></filter>
    <filter id="nd-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
  </defs>`;

  const auv = (x, y, w = 120, cls = "") => `<use href="#nd-auv" class="${cls}" x="${x - w / 2}" y="${y - w / 6}" width="${w}" height="${w / 3}"/>`;
  const wave = (y, amp, len, fill, cls, depth = 26) => {
    // a wave strip 2 screens wide so it can scroll seamlessly by one wavelength multiple
    let d = `M0 ${y}`;
    for (let x = 0; x < 1600; x += len) d += ` q ${len / 4} ${-amp} ${len / 2} 0 t ${len / 2} 0`;
    return `<path class="${cls}" d="${d} V${y + depth} H0Z" fill="${fill}"/>`;
  };
  const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  /* ---------- act 1: pool / wave basin ---------- */
  const POOL = (() => {
    let rope = "";
    for (let x = 10, i = 0; x < 800; x += 22, i++) rope += `<circle cx="${x}" cy="74" r="7" fill="${["#ef4444", "#f8fafc", "#2563eb"][i % 3]}" stroke="#0b3b4f" stroke-opacity=".3"/>`;
    let caus = "";
    const r = rng(7);
    for (let i = 0; i < 9; i++) {
      const x = r() * 760, y = 110 + r() * 300;
      caus += `<path class="caus" style="--d:${(r() * 4).toFixed(2)}s" d="M${x} ${y} q 30 -14 60 0 t 60 0" fill="none" stroke="#e9fcff" stroke-width="3" stroke-linecap="round" opacity=".0"/>`;
    }
    let bub = "";
    for (let i = 0; i < 7; i++) bub += `<circle class="bub" style="--d:${(i * 0.45).toFixed(2)}s;--x:${(r() * 30 - 15).toFixed(0)}px" cx="0" cy="0" r="${(2 + r() * 3).toFixed(1)}" fill="none" stroke="#f0fdff" stroke-width="1.2"/>`;
    return `<g class="act" data-act="pool">
      <rect width="800" height="520" fill="url(#nd-pool)"/>
      <rect y="70" width="800" height="450" fill="url(#nd-tiles)" opacity=".28"/>
      <rect x="0" y="440" width="800" height="80" fill="#0e6f8f" opacity=".35"/>
      ${caus}
      <rect width="800" height="66" fill="#d9f7fc"/>
      <g class="surf">${wave(66, 6, 80, "#e6fbff", "", 10)}</g>
      <g class="rope">${rope}</g>
      <g class="lap"><g class="lap-flip">${auv(400, 300, 150)}<g transform="translate(325 300)">${bub}</g></g></g>
      <g class="tag"><rect x="28" y="22" width="268" height="26" rx="13" fill="#063b4f" opacity=".6"/><text x="44" y="40">POOL TEST · CONTROLLED WATER</text></g>
    </g>`;
  })();

  /* ---------- act 2: higher studies (blueprint) ---------- */
  const STUDY = `<g class="act" data-act="study">
      <rect width="800" height="520" fill="#081a36"/>
      <rect width="800" height="520" fill="url(#nd-grid)"/><rect width="800" height="520" fill="url(#nd-grid5)"/>
      <g class="bp" fill="none" stroke="#93c5fd" stroke-width="2" stroke-linejoin="round">
        <path class="draw" style="--len:1400;--d:.1s" d="M190 230 H560 C620 230 660 245 660 260 C660 275 620 290 560 290 H190 C170 290 160 275 160 260 C160 245 170 230 190 230Z"/>
        <path class="draw" style="--len:300;--d:.6s" d="M200 230 L170 190 H196 L240 230 M200 290 L170 330 H196 L240 290"/>
        <path class="draw" style="--len:200;--d:.8s" d="M380 230 V214 H430 V230 M300 232 V288 M480 232 V288"/>
        <path class="draw thin" style="--len:520;--d:1s" d="M160 352 H660 M160 344 V360 M660 344 V360"/>
      </g>
      <text class="bp-t" style="--d:1.3s" x="410" y="380" text-anchor="middle">L ≈ 1.6 m · 5 DOF</text>
      <g class="callout" style="--d:1.5s"><path d="M405 222 L430 150 H500" class="draw thin" style="--len:160;--d:1.5s"/><text x="508" y="155">IMU · DEPTH</text></g>
      <g class="callout" style="--d:1.8s"><path d="M520 288 L560 420 H620" class="draw thin" style="--len:200;--d:1.8s"/><text x="628" y="425">DVL</text></g>
      <g class="callout" style="--d:2.1s"><path d="M640 252 L700 190" class="draw thin" style="--len:100;--d:2.1s"/><text x="672" y="180">SONAR</text></g>
      <g class="callout" style="--d:2.4s"><path d="M250 288 L210 430 H150" class="draw thin" style="--len:210;--d:2.4s"/><text x="64" y="435">PLANNER</text></g>
      <path class="fan2" d="M660 260 L780 200 A135 135 0 0 1 780 320Z" fill="#93c5fd" opacity=".12"/>
      <text class="eq" x="40" y="70">x̂ₖ = x̂ₖ₋ + Kₖ ( zₖ − H x̂ₖ₋ )</text>
      <text class="eq eq2" x="40" y="100">a* = argmax  I( map ; z | a )</text>
      <g class="tag"><rect x="540" y="30" width="230" height="26" rx="13" fill="#1e3a8a" opacity=".6"/><text x="556" y="48">MS / PhD · FROM 2027</text></g>
    </g>`;

  /* ---------- act 3: real sea trials ---------- */
  const SEA = `<g class="act" data-act="sea">
      <rect width="800" height="240" fill="url(#nd-dawn)"/>
      <circle class="sun" cx="610" cy="236" r="90" fill="url(#nd-sun)"/>
      <g class="cloud" fill="#ffe3d0" opacity=".55"><ellipse cx="200" cy="96" rx="70" ry="12"/><ellipse cx="240" cy="86" rx="40" ry="11"/></g>
      <g class="cloud c2" fill="#ffd9c2" opacity=".4"><ellipse cx="520" cy="120" rx="90" ry="10"/></g>
      <rect y="232" width="800" height="288" fill="url(#nd-sea)"/>
      <g class="rays-sea" fill="#fde2b8" opacity=".08"><path d="M560 240 L460 520 H520Z"/><path d="M640 240 L640 520 H700Z"/></g>
      <g class="deploy">
        <line class="cable" x1="150" y1="150" x2="150" y2="196" stroke="#1f2937" stroke-width="1.6"/>
        <g class="dv">${auv(150, 200, 96)}</g>
      </g>
      <ellipse class="splash" cx="150" cy="236" rx="40" ry="7" fill="none" stroke="#f8fafc" stroke-width="2.5"/>
      <g class="ship">
        <path d="M80 214 H330 L312 244 H104Z" fill="#f8fafc" stroke="#1f2937" stroke-width="1.2"/>
        <path d="M80 214 H330 L326 222 H84Z" fill="#b91c1c"/>
        <rect x="196" y="176" width="86" height="38" rx="3" fill="#f1f5f9" stroke="#1f2937" stroke-width="1.2"/>
        <rect x="206" y="184" width="66" height="10" rx="2" fill="#1e3a5f"/>
        <rect x="226" y="150" width="30" height="26" fill="#e2e8f0" stroke="#1f2937" stroke-width="1.2"/>
        <path d="M241 150 V118 M241 126 L258 132" stroke="#1f2937" stroke-width="2"/>
        <path d="M96 214 L130 146 L162 146 L176 214" fill="none" stroke="#f59e0b" stroke-width="5" stroke-linejoin="round"/>
      </g>
      <g class="wv w3">${wave(234, 6, 100, "#3a86ad", "", 16)}</g>
      <g class="wv w2" opacity=".9">${wave(240, 7, 140, "#2a73a0", "", 18)}</g>
      <g class="wv w1" opacity=".75">${wave(248, 8, 200, "#1f6690", "", 20)}</g>
      <g class="gps"><rect x="560" y="30" width="200" height="26" rx="13" fill="#0b1f3a" opacity=".55"/>
        <text class="g-on" x="576" y="48">GPS ● LOCKED</text><text class="g-off" x="576" y="48">GPS ✕ · INS + DVL</text></g>
      <g class="tag"><rect x="28" y="22" width="258" height="26" rx="13" fill="#04192e" opacity=".55"/><text x="44" y="40">OPEN SEA · CURRENTS · WAVES</text></g>
    </g>`;

  /* ---------- act 4: polar robotics ---------- */
  const POLAR = (() => {
    const r = rng(42);
    let stars = "";
    for (let i = 0; i < 40; i++) stars += `<circle class="star" style="--d:${(r() * 3).toFixed(2)}s" cx="${(r() * 800).toFixed(0)}" cy="${(r() * 120).toFixed(0)}" r="${(0.6 + r() * 1.2).toFixed(1)}" fill="#fff"/>`;
    // ice: flat top at ~132, jagged underside (keel) between 170 and 235
    const pts = [];
    for (let x = 0; x <= 800; x += 40) pts.push([x, Math.round(176 + r() * 42 + (x > 320 && x < 480 ? 22 : 0))]);
    const under = pts.map(([x, y]) => `${x},${y}`).join(" ");
    const ice = `M0 128 L120 126 L260 132 L420 124 L560 130 L800 126 V${pts[pts.length - 1][1]} L${pts.slice().reverse().map(([x, y]) => `${x} ${y}`).join(" L")} Z`;
    const mapLine = pts.map(([x, y]) => `${x},${y + 8}`).join(" ");
    let snow = "";
    for (let i = 0; i < 22; i++) snow += `<circle class="flake" style="--d:${(r() * 9).toFixed(2)}s;--t:${(7 + r() * 6).toFixed(1)}s" cx="${(r() * 800).toFixed(0)}" cy="${(240 + r() * 60).toFixed(0)}" r="${(0.8 + r() * 1.4).toFixed(1)}" fill="#e0f7ff"/>`;
    return `<g class="act" data-act="polar">
      <rect width="800" height="140" fill="url(#nd-night)"/>
      ${stars}
      <g filter="url(#nd-blur)"><path class="aur a1" d="M-60 90 C120 10 240 120 400 40 S680 90 860 20 V110 C680 160 520 70 400 120 S120 70 -60 140Z" fill="url(#nd-aur1)"/>
      <path class="aur a2" d="M-60 60 C140 110 300 0 460 70 S700 20 860 80 V120 C700 70 560 140 420 100 S160 130 -60 110Z" fill="url(#nd-aur2)"/></g>
      <rect y="128" width="800" height="392" fill="url(#nd-under)"/>
      <g class="shafts" fill="#c8f1ff"><path d="M190 200 L150 520 H250Z"/><path d="M455 230 L420 520 H520Z"/><path d="M660 200 L640 520 H730Z"/></g>
      <path class="icesheet" d="${ice}" fill="url(#nd-ice)" stroke="#bfe6f5" stroke-width="1"/>
      <g class="cracks" stroke="#5eead4" stroke-width="1.6" fill="none"><path d="M190 128 L196 150 L188 176"/><path d="M455 125 L448 160 L458 200"/><path d="M660 128 L668 158 L662 190"/></g>
      <polyline class="mapped" points="${mapLine}" fill="none" stroke="#5eead4" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      ${snow}
      <g class="glide"><path class="sfan" d="M450 330 L370 240 Q450 220 530 240Z" fill="url(#nd-fan)"/>${auv(400, 330, 130)}<circle cx="450" cy="330" r="3" fill="#fffbe0" filter="url(#nd-soft)"/></g>
      <g class="compass" transform="translate(712 440)"><circle r="30" fill="#04131f" stroke="#7dd3fc" stroke-opacity=".5"/><text y="-16" text-anchor="middle">N</text><g class="needle"><path d="M0 -20 L5 0 L0 20 L-5 0Z" fill="#f87171"/><path d="M0 0 L5 0 L0 20 L-5 0Z" fill="#e2e8f0"/></g></g>
      <g class="tag"><rect x="28" y="22" width="250" height="26" rx="13" fill="#04131f" opacity=".7"/><text x="44" y="40">UNDER ICE · NO GPS · MAG ✕</text></g>
    </g>`;
  })();

  /* ---------- act 5: bigger scale ---------- */
  const SCALE = (() => {
    const fleet = [[300, 250], [420, 200], [420, 310], [540, 255]];
    const links = [[0, 1], [0, 2], [1, 3], [2, 3], [1, 2]]
      .map(([a, b], i) => `<line class="link" style="--d:${i * 0.3}s" x1="${fleet[a][0]}" y1="${fleet[a][1]}" x2="${fleet[b][0]}" y2="${fleet[b][1]}"/>`)
      .join("");
    const pings = fleet.map(([x, y], i) => `<circle class="ping" style="--d:${i * 0.7}s" cx="${x}" cy="${y}" r="30"/>`).join("");
    const subs = fleet.map(([x, y], i) => `<g class="fl" style="--d:${i * 0.6}s">${auv(x, y, 78)}</g>`).join("");
    let lat = "";
    for (let i = 1; i < 6; i++) lat += `<path d="M0 ${i * 90} Q400 ${i * 90 - 40} 800 ${i * 90}"/>`;
    for (let i = 1; i < 8; i++) lat += `<path d="M${i * 100} 0 Q${i * 100 + (i - 4) * 18} 260 ${i * 100} 520"/>`;
    return `<g class="act" data-act="scale">
      <rect width="800" height="520" fill="url(#nd-deep)"/>
      <g fill="none" stroke="#7dd3fc" stroke-opacity=".1">${lat}</g>
      <path class="route" d="M40 440 C160 380 160 300 260 290 S420 380 520 330 S700 140 770 90" fill="none" stroke="#fbbf24" stroke-width="2.5" stroke-dasharray="7 9" stroke-linecap="round"/>
      <g class="ship-s" transform="translate(28 430)"><path d="M0 8 H40 L34 18 H6Z" fill="#f8fafc"/><rect x="14" y="0" width="14" height="8" fill="#e2e8f0"/></g>
      <g class="ice-s" fill="#e0f2fe" opacity=".85"><path d="M730 60 L790 52 L800 84 L748 96Z"/><path d="M700 98 L736 92 L742 112 L706 116Z"/></g>
      <g class="links" stroke="#5eead4" stroke-width="1.4" stroke-dasharray="3 5">${links}</g>
      <g class="pings" fill="none" stroke="#5eead4" stroke-width="1.5">${pings}</g>
      <g class="fleet">${subs}</g>
      <g class="tag"><rect x="28" y="30" width="276" height="26" rx="13" fill="#031426" opacity=".7"/><text x="44" y="48">MULTI-VEHICLE · LONG MISSIONS</text></g>
      <g class="tag"><rect x="552" y="476" width="220" height="26" rx="13" fill="#031426" opacity=".7"/><text x="568" y="494">SEA → POLAR EXPEDITIONS</text></g>
    </g>`;
  })();

  /* ---------- ambient sea life in the deep zones ---------- */
  const FISH = (() => {
    let s = "";
    const r = rng(3);
    for (let i = 0; i < 11; i++) {
      const x = (i % 4) * 34 + r() * 14, y = Math.floor(i / 4) * 22 + r() * 10;
      s += `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)})"><path class="fish" style="--d:${(r() * 1.2).toFixed(2)}s" d="M0 6 Q10 -2 22 6 Q10 14 0 6Z M22 6 L30 0 L30 12Z"/></g>`;
    }
    return `<svg class="cr-fish" viewBox="-4 -4 150 80" aria-hidden="true"><g fill="currentColor">${s}</g></svg>`;
  })();
  const JELLY = (hue) => `<svg class="cr-jelly" viewBox="0 0 60 120" aria-hidden="true" style="--h:${hue}">
      <g class="bell"><path d="M4 30 Q4 2 30 2 Q56 2 56 30 Q46 26 38 31 Q30 26 22 31 Q14 26 4 30Z" fill="currentColor" fill-opacity=".35" stroke="currentColor" stroke-width="1.5"/></g>
      <g class="tent" fill="none" stroke="currentColor" stroke-width="1.2" stroke-opacity=".7"><path d="M14 30 Q8 60 16 90 T14 116"/><path d="M26 31 Q32 62 24 92 T28 118"/><path d="M36 31 Q30 60 38 88 T34 114"/><path d="M47 30 Q52 58 44 86 T48 110"/></g>
    </svg>`;
  const ANGLER = `<svg class="cr-angler" viewBox="0 0 140 90" aria-hidden="true">
      <path d="M118 50 Q120 30 92 22 Q60 14 34 34 Q22 44 8 36 L14 52 L6 68 Q24 60 34 66 Q62 86 96 74 Q118 66 118 50Z" fill="#0b1324" stroke="#334155" stroke-width="1"/>
      <path d="M100 30 Q112 6 130 10" fill="none" stroke="#475569" stroke-width="1.6"/>
      <circle class="lure" cx="130" cy="10" r="4.5" fill="#fde68a"/>
      <circle cx="104" cy="42" r="3" fill="#94a3b8"/>
      <path d="M110 58 L104 54 L100 60 L95 55 L90 62" fill="none" stroke="#cbd5e1" stroke-width="1.2"/>
    </svg>`;

  function addCritters() {
    const put = (zone, html) => {
      const z = document.querySelector(`.zone[data-zone="${zone}"]`);
      if (!z) return null;
      const lane = document.createElement("div");
      lane.className = `critters cr-${zone}`;
      lane.setAttribute("aria-hidden", "true");
      lane.innerHTML = html;
      z.prepend(lane);
      return lane;
    };
    const lanes = [
      put("twilight", `<div class="cr-school s1">${FISH}</div><div class="cr-school s2">${FISH}</div>`),
      put("midnight", `<div class="cr-jel j1">${JELLY("#7dd3fc")}</div><div class="cr-jel j2">${JELLY("#c4b5fd")}</div>`),
      put("abyss", `<div class="cr-ang">${ANGLER}</div><div class="cr-jel j3">${JELLY("#5eead4")}</div>`),
    ].filter(Boolean);
    if (!("IntersectionObserver" in window)) return lanes.forEach((l) => l.classList.add("is-live"));
    const io = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle("is-live", e.isIntersecting)));
    lanes.forEach((l) => io.observe(l));
  }

  /* ---------- render ---------- */
  window.renderNext = function (N, { set, head, esc, arr }) {
    addCritters();
    if (!N || !arr(N.acts).length) return;
    const acts = arr(N.acts);
    const emph = (t) =>
      esc(t).replace(/(higher studies|real sea trials|larger scale|[Pp]olar robotics)/g, "<mark>$1</mark>");
    const builds = (b) =>
      arr(b).length
        ? `<p class="nd-builds">Builds on ${arr(b).map((l) => `<a href="${esc(href(l.to))}">${esc(l.label)}</a>`).join('<span aria-hidden="true"> · </span>')}</p>`
        : "";
    const words = String(N.quote || "").split(/\s+/).map((w, i) => `<span style="--i:${i}">${esc(w)}</span>`).join(" ");
    set(
      "next-body",
      `${head("The next dive", "What I want to do next")}
      <p class="nd-lead" data-reveal>${emph(N.lead || "")}</p>
      <div class="nd" data-act="${esc(acts[0].key)}">
        <div class="nd-stage" aria-hidden="true">
          <svg class="nd-svg" viewBox="0 0 800 520" preserveAspectRatio="xMidYMid slice">${DEFS}${POOL}${STUDY}${SEA}${POLAR}${SCALE}</svg>
          <div class="nd-hud">${acts.map((a, i) => `<span data-act="${esc(a.key)}">${String(i + 1).padStart(2, "0")}</span>`).join("")}</div>
        </div>
        <ol class="nd-chapters">
          ${acts
            .map(
              (a) => `<li class="nd-ch" data-act="${esc(a.key)}">
              <div class="nd-kicker">${esc(a.kicker)}</div>
              <h3>${esc(a.title)}</h3>
              <p>${esc(a.text)}</p>
              ${builds(a.buildsOn)}
            </li>`,
            )
            .join("")}
        </ol>
      </div>
      ${N.quote ? `<blockquote class="nd-quote" data-reveal><p>${words}</p></blockquote>` : ""}`,
    );

    const nd = document.querySelector(".nd");
    const chs = [...nd.querySelectorAll(".nd-ch")];
    const activate = (key) => {
      if (nd.dataset.act === key && nd.classList.contains("started")) return;
      nd.dataset.act = key;
      nd.classList.add("started");
      chs.forEach((c) => c.classList.toggle("on", c.dataset.act === key));
      // restart the active act's one-shot animations (blueprint drawing, sheet slide-in)
      const g = nd.querySelector(`.act[data-act="${key}"]`);
      if (g) { g.classList.remove("play"); void g.getBoundingClientRect(); g.classList.add("play"); }
    };
    activate(acts[0].key);
    if (!("IntersectionObserver" in window)) { nd.classList.add("live"); return; }
    // a chapter becomes active as it crosses the middle band of the viewport
    const chIO = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && activate(e.target.dataset.act)),
      // on phones the scene is pinned over the top half, so read chapters lower down
      { rootMargin: window.matchMedia("(max-width: 760px)").matches ? "-60% 0px -30% 0px" : "-45% 0px -45% 0px" },
    );
    chs.forEach((c) => chIO.observe(c));
    new IntersectionObserver((es) => es.forEach((e) => nd.classList.toggle("live", e.isIntersecting))).observe(nd);
  };
})();
