(() => {
  const root = document.documentElement;

  // ---- Theme toggle ----
  const toggle = document.getElementById("theme-toggle");
  const isDark = () => root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  const syncToggle = () => toggle.setAttribute("aria-label", isDark() ? "Switch to light theme" : "Switch to dark theme");
  toggle.addEventListener("click", () => {
    root.dataset.theme = isDark() ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
    syncToggle();
  });
  syncToggle();

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
      ? `Showing ${shown} of ${total} case studies`
      : `Showing all ${total} case studies`;
    for (const b of ledgerButtons) b.setAttribute("aria-pressed", String(b.dataset.filterFw === fw));
  }

  function clearAll() {
    q.value = ""; themeSel.value = ""; fwSel.value = "";
    apply();
    q.focus();
  }

  function goToRegister() {
    document.getElementById("register").scrollIntoView();
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
    const i = order.findIndex((c) => c.slug === slug);
    const prev = order[i - 1], next = order[i + 1];
    pager.innerHTML =
      (prev ? `<a class="prev" href="#read/${prev.slug}"><span>Previous case study</span><strong></strong></a>` : "") +
      (next ? `<a class="next" href="#read/${next.slug}"><span>Next case study</span><strong></strong></a>` : "");
    if (prev) pager.querySelector(".prev strong").textContent = prev.title;
    if (next) pager.querySelector(".next strong").textContent = next.title;
  }

  function markCurrentDoc(doc) {
    body.querySelectorAll(".doc-nav a").forEach((a, i) => a.setAttribute("aria-current", String(String(i) === String(doc ?? 0))));
  }

  async function open(slug, doc, anchor) {
    if (!document.body.classList.contains("is-reading")) homeScroll = window.scrollY;
    if (current !== slug) {
      let html;
      try { html = await load(slug); }
      catch { html = `<p class="doc-note">This case study could not be loaded. <a href="#work">Return to the case studies</a>.</p>`; }
      body.innerHTML = html;
      current = slug;
      renderPager(slug);
      const h1 = body.querySelector("h1");
      document.title = `${h1 ? h1.textContent : "Case study"} | ${homeTitle.split(" | ")[0]}`;
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
    document.title = homeTitle;
    const target = location.hash && document.getElementById(location.hash.slice(1));
    if (target) target.scrollIntoView();
    else window.scrollTo(0, homeScroll);
  }

  function route() {
    const m = location.hash.match(/^#read\/([a-z0-9-]+)(?:\/(\d+))?(?:\/(.+))?$/);
    if (m) open(m[1], m[2], m[3]);
    else close();
  }

  backBtn.addEventListener("click", () => {
    location.hash = "";
    history.replaceState(null, "", location.pathname + location.search);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("is-reading")) backBtn.click();
  });
  window.addEventListener("hashchange", route);
  route();
})();
