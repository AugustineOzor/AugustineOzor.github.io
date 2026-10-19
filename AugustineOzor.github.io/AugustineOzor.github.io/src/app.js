// ---- Page views: each section group behaves as its own page (#/projects, #/cloud, ...) ----
window.__views = (() => {
  const VIEWS = ["home", "projects", "cloud", "labs", "articles", "about"];
  const ANCHOR_VIEW = { top: "home", focus: "home", architecture: "home", work: "projects", register: "projects", "projects-title": "projects", cloud: "cloud", labs: "labs", articles: "articles", about: "about", "about-title": "about" };
  const name = document.title.split(" | ")[0];
  const TITLES = { home: document.title, projects: `Projects and case studies | ${name}`, cloud: `Cloud engineering | ${name}`, labs: `Security labs | ${name}`, articles: `Knowledge articles | ${name}`, about: `About | ${name}` };
  const sections = [...document.querySelectorAll("main > [data-view]")];
  const navLinks = [...document.querySelectorAll("[data-nav]")];
  let current = null, pending = null, restoreY = null;
  function show(v) {
    current = v;
    let first = true;
    for (const s of sections) {
      const vs = s.dataset.view.split(" ");
      const on = vs.includes("all") || vs.includes(v);
      s.hidden = !on;
      s.classList.toggle("view-first", on && first && !vs.includes("all"));
      if (on && !vs.includes("all")) first = false;
    }
    navLinks.forEach((a) => a.setAttribute("aria-current", String(a.dataset.nav === v)));
    document.title = TITLES[v] || TITLES.home;
  }
  function scrollToId(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView();
    return !!el;
  }
  function handle() {
    const h = location.hash;
    let v = current || "home", anchor = null;
    if (!h || h === "#" || h === "#/") v = "home";
    else if (h.startsWith("#/")) { const x = h.slice(2); v = VIEWS.includes(x) ? x : "home"; }
    else { anchor = decodeURIComponent(h.slice(1)); if (ANCHOR_VIEW[anchor]) v = ANCHOR_VIEW[anchor]; }
    const changed = v !== current;
    show(v);
    if (anchor && scrollToId(anchor)) return;
    if (pending) { const id = pending; pending = null; if (scrollToId(id)) return; }
    if (restoreY != null) { const y = restoreY; restoreY = null; window.scrollTo(0, y); return; }
    if (changed) window.scrollTo(0, 0);
  }
  return {
    handle,
    get current() { return current; },
    hashFor: (v) => (v === "home" ? "#/" : `#/${v}`),
    setRestore: (y) => { restoreY = y; },
    go(view, anchorId) {
      if (current === view) { if (anchorId) scrollToId(anchorId); return; }
      pending = anchorId || null;
      location.hash = view === "home" ? "#/" : `#/${view}`;
    },
  };
})();

(() => {
  const root = document.documentElement;

  // ---- Theme toggle ----
  const toggle = document.getElementById("theme-toggle");
  const isDark = () => root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  const syncToggle = () => { toggle.setAttribute("aria-label", isDark() ? "Switch to light mode" : "Switch to dark mode"); toggle.title = isDark() ? "Light mode" : "Dark mode"; };
  toggle.addEventListener("click", () => {
    root.dataset.theme = isDark() ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
    syncToggle();
  });
  syncToggle();

  // ---- Colour palette ----
  const swatches = [...document.querySelectorAll("[data-palette-set]")];
  const syncPalette = () => {
    const current = root.dataset.palette || "teal";
    swatches.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.paletteSet === current)));
  };
  swatches.forEach((b) => b.addEventListener("click", () => {
    const p = b.dataset.paletteSet;
    if (p === "teal") delete root.dataset.palette; else root.dataset.palette = p;
    try { localStorage.setItem("palette", p); } catch (e) {}
    syncPalette();
  }));
  syncPalette();

  // ---- Register filters ----
  const q = document.getElementById("f-q");
  const themeSel = document.getElementById("f-theme");
  const fwSel = document.getElementById("f-fw");
  const clearBtn = document.getElementById("f-clear");
  const count = document.getElementById("result-count");
  const empty = document.getElementById("empty");
  const rows = [...document.querySelectorAll("#register-body tr")];
  const ledgerButtons = [...document.querySelectorAll("[data-filter-fw]")];
  const total = rows.length;

  function apply() {
    const text = q.value.trim().toLowerCase();
    const theme = themeSel.value;
    const fw = fwSel.value;
    let shown = 0;
    for (const row of rows) {
      const match =
        (!theme || row.dataset.theme === theme) &&
        (!fw || row.dataset.fw.split("|").includes(fw)) &&
        (!text || row.dataset.text.includes(text));
      row.hidden = !match;
      if (match) shown++;
    }
    const filtered = Boolean(text || theme || fw);
    clearBtn.hidden = !filtered;
    empty.hidden = shown > 0;
    count.textContent = filtered
      ? `Showing ${shown} of ${total} projects`
      : `Showing all ${total} projects`;
    for (const b of ledgerButtons) b.setAttribute("aria-pressed", String(b.dataset.filterFw === fw));
  }

  function clearAll() {
    q.value = ""; themeSel.value = ""; fwSel.value = "";
    apply();
    q.focus();
  }

  function goToRegister() {
    window.__views.go("projects", "register");
    document.getElementById("register-title").setAttribute("tabindex", "-1");
    document.getElementById("register-title").focus({ preventScroll: true });
  }

  q.addEventListener("input", apply);
  themeSel.addEventListener("change", apply);
  fwSel.addEventListener("change", apply);
  clearBtn.addEventListener("click", clearAll);
  document.querySelectorAll("[data-clear]").forEach((b) => b.addEventListener("click", clearAll));

  for (const b of ledgerButtons) {
    b.addEventListener("click", () => {
      const fw = b.dataset.filterFw;
      fwSel.value = fwSel.value === fw ? "" : fw;
      themeSel.value = ""; q.value = "";
      apply();
      if (fwSel.value) goToRegister();
    });
  }
  document.querySelectorAll("[data-filter-theme]").forEach((b) =>
    b.addEventListener("click", () => {
      themeSel.value = b.dataset.filterTheme;
      fwSel.value = ""; q.value = "";
      apply();
      goToRegister();
    })
  );
})();

// ---- Case study reader ----
(() => {
  const reader = document.getElementById("reader");
  const body = document.getElementById("reader-body");
  const pager = document.getElementById("reader-pager");
  const backBtn = document.getElementById("reader-back");
  const order = JSON.parse(document.getElementById("case-order").textContent);
  const homeTitle = document.title;
  let current = null;
  let homeScroll = 0;
  let mermaidReady = null;

  async function load(slug) {
    const tpl = document.getElementById(`read-${slug}`);
    if (tpl) return tpl.innerHTML;
    const res = await fetch(`read/${slug}.html`);
    if (!res.ok) throw new Error(res.status);
    return res.text();
  }

  function loadMermaid() {
    if (!mermaidReady) {
      mermaidReady = new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js";
        s.onload = () => resolve(window.mermaid);
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }
    return mermaidReady;
  }
  async function renderDiagrams() {
    const nodes = [...body.querySelectorAll("pre.mermaid:not([data-processed])")];
    if (!nodes.length) return;
    try {
      const mermaid = await loadMermaid();
      const dark = document.documentElement.dataset.theme === "dark" ||
        (!document.documentElement.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches);
      mermaid.initialize({ startOnLoad: false, securityLevel: "strict", theme: dark ? "dark" : "neutral" });
      await mermaid.run({ nodes });
    } catch (e) { /* diagrams stay as readable source text */ }
  }

  function renderPager(slug) {
    const me = order.find((c) => c.slug === slug);
    const list = order.filter((c) => c.group === (me ? me.group : "project"));
    const i = list.findIndex((c) => c.slug === slug);
    const prev = list[i - 1], next = list[i + 1];
    const noun = me && me.group === "article" ? "article" : "project";
    backBtn.textContent = noun === "article" ? "Back to articles" : "Back to projects";
    pager.innerHTML =
      (prev ? `<a class="prev" href="#read/${prev.slug}"><span>Previous ${noun}</span><strong></strong></a>` : "") +
      (next ? `<a class="next" href="#read/${next.slug}"><span>Next ${noun}</span><strong></strong></a>` : "");
    if (prev) pager.querySelector(".prev strong").textContent = prev.title;
    if (next) pager.querySelector(".next strong").textContent = next.title;
  }

  function markCurrentDoc(doc) {
    body.querySelectorAll(".doc-nav a").forEach((a, i) => a.setAttribute("aria-current", String(String(i) === String(doc ?? 0))));
  }

  let returnTo = null;
  async function open(slug, doc, anchor) {
    if (!document.body.classList.contains("is-reading")) {
      homeScroll = window.scrollY;
      returnTo = window.__views.current ? { hash: window.__views.hashFor(window.__views.current), y: homeScroll } : null;
    }
    if (current !== slug) {
      let html;
      try { html = await load(slug); }
      catch { html = `<p class="doc-note">This project could not be loaded. <a href="#work">Return to the projects</a>.</p>`; }
      body.innerHTML = html;
      current = slug;
      renderPager(slug);
      const h1 = body.querySelector("h1");
      document.title = `${h1 ? h1.textContent : "Project"} | ${homeTitle.split(" | ")[0]}`;
      reader.hidden = false;
      document.body.classList.add("is-reading");
      renderDiagrams();
      if (doc == null && !anchor) {
        window.scrollTo(0, 0);
        h1 && h1.focus({ preventScroll: true });
      }
    }
    markCurrentDoc(doc);
    const target = anchor ? document.getElementById(`d${doc}-${decodeURIComponent(anchor)}`) : doc != null ? document.getElementById(`doc-${doc}`) : null;
    if (target) target.scrollIntoView();
  }

  function close() {
    if (!document.body.classList.contains("is-reading")) return;
    document.body.classList.remove("is-reading");
    reader.hidden = true;
    body.innerHTML = "";
    current = null;
  }

  function route() {
    const m = location.hash.match(/^#read\/([a-z0-9-]+)(?:\/(\d+))?(?:\/(.+))?$/);
    if (m) { open(m[1], m[2], m[3]); return; }
    close();
    window.__views.handle();
  }

  backBtn.addEventListener("click", () => {
    const me = order.find((c) => c.slug === current);
    const fallback = me && me.group === "article" ? "#/articles" : "#/projects";
    const r = returnTo || { hash: fallback, y: 0 };
    returnTo = null;
    window.__views.setRestore(r.y);
    location.hash = r.hash;
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("is-reading")) backBtn.click();
  });
  window.addEventListener("hashchange", route);
  route();
})();

// ---- Header: compact on scroll ----
(() => {
  const body = document.body;
  let ticking = false;
  const update = () => {
    body.classList.toggle("header-compact", window.scrollY > 40);
    ticking = false;
  };
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();

})();

// ---- Knowledge articles: topic filter and "show all" ----
(() => {
  const grid = document.getElementById("art-grid");
  if (!grid) return;
  const cards = [...grid.querySelectorAll(".art-card")];
  const chips = [...document.querySelectorAll("[data-art-cat]")];
  const more = document.getElementById("art-more");
  const initial = +grid.dataset.initial || 9;
  let cat = "", expanded = false;
  function apply() {
    const matching = cards.filter((c) => !cat || c.dataset.cat === cat);
    cards.forEach((c) => (c.hidden = true));
    matching.forEach((c, i) => (c.hidden = !expanded && i >= initial));
    const hiddenCount = matching.length - (expanded ? matching.length : Math.min(initial, matching.length));
    more.parentElement.hidden = hiddenCount <= 0;
    more.textContent = `Show all ${matching.length} articles`;
    chips.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.artCat === cat)));
  }
  chips.forEach((b) => b.addEventListener("click", () => { cat = b.dataset.artCat; expanded = false; apply(); }));
  more.addEventListener("click", () => { expanded = true; apply(); });
  apply();
})();
