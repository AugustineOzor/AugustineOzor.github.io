#!/usr/bin/env node
// Builds the portfolio into ./dist.
// 1. Fetches every public repo for the configured GitHub user (falls back to data/repos.snapshot.json).
// 2. Merges it with data/projects.config.json (themes, frameworks, featured write-ups).
// 3. Renders a single self-contained dist/index.html plus projects.json, sitemap.xml and robots.txt.
//
// Usage: node scripts/build.mjs [--offline]
// Optional env: GITHUB_TOKEN (raises the API rate limit; set automatically in GitHub Actions).

import { readFile, writeFile, mkdir, copyFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { loadContent, slugOf } from "./content.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const p = (...s) => path.join(root, ...s);
const readJSON = async (f) => JSON.parse(await readFile(p(f), "utf8"));

const site = await readJSON("data/site.json");
const config = await readJSON("data/projects.config.json");
const offline = process.argv.includes("--offline");
const inline = process.argv.includes("--inline"); // single-file output (used for previews)

// ---------- 1. Fetch ----------
async function fetchRepos(user) {
  const headers = { Accept: "application/vnd.github+json", "User-Agent": "portfolio-build" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const all = [];
  for (let page = 1; page < 20; page++) {
    const res = await fetch(`https://api.github.com/users/${user}/repos?per_page=100&page=${page}&type=owner`, { headers });
    if (!res.ok) throw new Error(`GitHub API ${res.status} ${res.statusText}`);
    const batch = await res.json();
    all.push(...batch);
    if (batch.length < 100) break;
  }
  return all
    .filter((r) => !r.fork && !r.archived && !r.private)
    .map(({ name, description, pushed_at, stargazers_count, homepage, topics, default_branch }) => ({ name, description, pushed_at, stargazers_count, homepage, topics, default_branch }));
}

let repos;
let source = "snapshot";
if (!offline) {
  try {
    repos = await fetchRepos(site.githubUser);
    source = "GitHub API";
    await writeFile(p("data/repos.snapshot.json"), JSON.stringify(repos, null, 1) + "\n");
  } catch (err) {
    console.warn(`! Could not reach GitHub (${err.message}). Using data/repos.snapshot.json.`);
  }
}
if (!repos) repos = await readJSON("data/repos.snapshot.json");

// ---------- 2. Merge ----------
const warnings = [];
const exclude = new Set(config.exclude.map((s) => s.toLowerCase()));
const themeIds = new Set(config.themes.map((t) => t.id));

const projects = repos
  .filter((r) => !exclude.has(r.name.toLowerCase()))
  .map((r) => {
    const c = config.repos[r.name] || {};
    if (!config.repos[r.name]) warnings.push(`Untagged repo "${r.name}": shown under "Other work". Add it to data/projects.config.json.`);
    if (!r.description && !c.summary) warnings.push(`"${r.name}" has no GitHub description. Add one on GitHub or a "summary" in the config.`);
    const theme = themeIds.has(c.theme) ? c.theme : "other";
    return {
      name: r.name,
      slug: slugOf(r.name),
      title: c.title || prettify(r.name),
      summary: c.summary || r.description || "",
      theme,
      frameworks: c.frameworks || [],
      url: `https://github.com/${site.githubUser}/${r.name}`,
      demo: r.homepage || "",
      updated: r.pushed_at || null,
      stars: r.stargazers_count || 0,
      featured: c.featured || 0,
      context: c.context || "",
      problem: c.problem || "",
      approach: c.approach || "",
      deliverables: c.deliverables || [],
    };
  })
  .sort((a, b) => (b.updated || "").localeCompare(a.updated || "") || a.title.localeCompare(b.title));

for (const name of Object.keys(config.repos)) {
  if (!repos.some((r) => r.name === name)) warnings.push(`Configured repo "${name}" was not found on GitHub (renamed or deleted?).`);
}

const themes = [...config.themes];
if (projects.some((x) => x.theme === "other")) themes.push({ id: "other", name: "Other work", blurb: "Recent projects not yet assigned to a focus area." });
const themeName = Object.fromEntries(themes.map((t) => [t.id, t.name]));
const featured = projects.filter((x) => x.featured).sort((a, b) => a.featured - b.featured);

const fwCounts = {};
for (const x of projects) for (const f of x.frameworks) fwCounts[f] = (fwCounts[f] || 0) + 1;
const frameworks = Object.entries(fwCounts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

// ---------- 2b. Case study documents ----------
const { content, warnings: contentWarnings } = await loadContent({
  user: site.githubUser,
  repos: repos.filter((r) => projects.some((x) => x.name === r.name)),
  token: process.env.GITHUB_TOKEN,
  offline: offline || source === "snapshot",
  cacheDir: p("content"),
});
warnings.push(...contentWarnings);

// ---------- 3. Render ----------
function prettify(name) {
  return name.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
}
function esc(s = "") {
  return String(s).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
}
function fmtDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
}
function hash(str) {
  let h = 2166136261;
  for (const ch of str) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
// A small risk-matrix motif, unique per repo, drawn from the repo name.
function matrixSVG(seed) {
  let s = hash(seed);
  const rnd = () => ((s = Math.imul(s ^ (s >>> 15), 2246822507) ^ Math.imul(s ^ (s >>> 13), 3266489909)) >>> 0) / 4294967296;
  const cols = 8, rows = 5, size = 18, gap = 6;
  let cells = "";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Likelihood x impact: cells toward the top-right are more likely to be "hot".
      const heat = (c / (cols - 1)) * 0.55 + ((rows - 1 - r) / (rows - 1)) * 0.45 + (rnd() - 0.5) * 0.5;
      const level = heat > 0.78 ? 3 : heat > 0.52 ? 2 : heat > 0.28 ? 1 : 0;
      cells += `<rect x="${c * (size + gap)}" y="${r * (size + gap)}" width="${size}" height="${size}" rx="2" class="m${level}"/>`;
    }
  }
  const w = cols * (size + gap) - gap, h = rows * (size + gap) - gap;
  return `<svg class="banner-matrix" viewBox="-1 -1 ${w + 2} ${h + 2}" width="${w + 2}" height="${h + 2}" aria-hidden="true" focusable="false">${cells}</svg>`;
}
const fwList = (arr) => (arr.length ? arr.map(esc).join(", ") : "None listed");

const ledgerMax = frameworks.length ? frameworks[0][1] : 1;
const ledgerHTML = frameworks
  .slice(0, 10)
  .map(
    ([name, n], i) => `
        <li><button type="button" class="ledger-row" data-filter-fw="${esc(name)}" aria-pressed="false">
          <span class="ledger-name">${esc(name)}</span>
          <span class="ledger-bar" aria-hidden="true"><span style="--w:${((n / ledgerMax) * 100).toFixed(1)}%;--i:${i}"></span></span>
          <span class="ledger-count">${n}<span class="sr-only"> case studies</span></span>
        </button></li>`
  )
  .join("");

const focusHTML = themes
  .map((t) => {
    const n = projects.filter((x) => x.theme === t.id).length;
    if (!n) return "";
    return `
      <li class="focus-item">
        <h3>${esc(t.name)}</h3>
        <p>${esc(t.blurb)}</p>
        <button type="button" class="text-button" data-filter-theme="${t.id}">View ${n} case ${n === 1 ? "study" : "studies"}</button>
      </li>`;
  })
  .join("");

const featuredHTML = featured
  .map(
    (x) => `
      <article class="case" id="case-${esc(x.name)}">
        <a class="banner" href="#read/${x.slug}">
          <div class="banner-text">
            <span class="banner-area">${esc(themeName[x.theme])}</span>
            <h3 class="banner-title">${esc(x.title)}</h3>
            ${x.context ? `<span class="banner-context">${esc(x.context)}</span>` : ""}
            ${x.frameworks.length ? `<span class="banner-fw">Frameworks: ${esc(x.frameworks.join(", "))}</span>` : ""}
            <span class="banner-cta">Read the case study</span>
          </div>
          ${matrixSVG(x.name)}
        </a>
        <div class="case-body">
          <dl class="case-story">
            <dt>Problem</dt><dd>${esc(x.problem || x.summary)}</dd>
            ${x.approach ? `<dt>Approach</dt><dd>${esc(x.approach)}</dd>` : ""}
            ${x.demo ? `<dt>Demo</dt><dd><a href="${esc(x.demo)}">Live demo</a></dd>` : ""}
            ${x.deliverables.length ? `<dt>Deliverables</dt><dd><ul class="deliverables">${x.deliverables.map((d) => `<li>${esc(d)}</li>`).join("")}</ul></dd>` : ""}
          </dl>
        </div>
      </article>`
  )
  .join("");

const rowsHTML = projects
  .map(
    (x) => `
          <tr data-theme="${x.theme}" data-fw="${esc(x.frameworks.join("|"))}" data-text="${esc((x.title + " " + x.summary + " " + x.frameworks.join(" ")).toLowerCase())}">
            <td class="col-title"><a href="#read/${x.slug}">${esc(x.title)}</a>${x.summary ? `<p>${esc(x.summary)}</p>` : ""}</td>
            <td class="col-area" data-label="Area">${esc(themeName[x.theme])}</td>
            <td class="col-fw" data-label="Frameworks">${fwList(x.frameworks)}</td>
          </tr>`
  )
  .join("");

function readerHTML(x) {
  const c = content[x.name];
  const docs = c?.docs || [];
  const meta = `
    <header class="reader-head">
      <p class="reader-area">${esc(themeName[x.theme])}</p>
      <h1 tabindex="-1">${esc(x.title)}</h1>
      ${x.context ? `<p class="reader-context">${esc(x.context)}</p>` : ""}
      <dl class="reader-meta">
        ${x.frameworks.length ? `<div><dt>Frameworks</dt><dd>${esc(x.frameworks.join(", "))}</dd></div>` : ""}
        <div><dt>Source</dt><dd><a href="${esc(x.url)}" rel="noopener">GitHub repository</a></dd></div>
      </dl>
    </header>`;
  const toc = docs.length > 1
    ? `<nav class="doc-nav" aria-label="Documents in this case study"><h2>In this case study</h2><ol>${docs.map((d, i) => `<li><a href="#read/${x.slug}/${i}">${esc(d.title)}</a></li>`).join("")}</ol></nav>`
    : "";
  const body = docs.length
    ? docs.map((d, i) => `<section class="doc" id="doc-${i}">${docs.length > 1 || i > 0 ? `<h2 class="doc-title">${esc(d.title)}</h2>` : ""}${d.html}</section>`).join("")
    : `<section class="doc">
        ${x.summary ? `<p class="lede">${esc(x.summary)}</p>` : ""}
        ${x.problem ? `<h3>Problem</h3><p>${esc(x.problem)}</p>` : ""}
        ${x.approach ? `<h3>Approach</h3><p>${esc(x.approach)}</p>` : ""}
        ${x.deliverables.length ? `<h3>Deliverables</h3><ul>${x.deliverables.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>` : ""}
        <p class="doc-note">The full write-up is published with the site build. Until then, read it in the <a href="${esc(x.url)}" rel="noopener">GitHub repository</a>.</p>
      </section>`;
  const files = c?.files?.length
    ? `<section class="doc doc-files"><h2 class="doc-title">Supporting files</h2><ul>${c.files.map((f) => `<li><a href="${esc(f.url)}" rel="noopener">${esc(f.path)}</a></li>`).join("")}</ul></section>`
    : "";
  return `<article class="reader-article">${meta}<div class="reader-layout">${toc}<div class="prose">${body}${files}</div></div></article>`;
}

const caseOrder = JSON.stringify(projects.map((x) => ({ slug: x.slug, title: x.title }))).replace(/</g, "\\u003c");
const readerTemplates = inline ? projects.map((x) => `<template id="read-${x.slug}">${readerHTML(x)}</template>`).join("\n") : "";

// ---------- AI governance architecture ----------
const bySlug = Object.fromEntries(projects.map((x) => [x.slug, x]));
const caseLink = (slug, label = "Example") =>
  bySlug[slug] ? `<a class="arch-link" href="#read/${slug}">${label}: ${esc(bySlug[slug].title)}</a>` : "";
const archStages = [
  { fn: "Map", title: "Intake and inventory", text: "Register every AI system with its owner, purpose, data and vendor.", slug: "enterprise-ai-system-inventory" },
  { fn: "Map", title: "Risk classification", text: "Assign the EU AI Act tier and an internal risk rating.", slug: "high-risk-ai-classification-article6-7" },
  { fn: "Measure", title: "Impact and risk assessment", text: "Test for fairness, privacy, security and LLM-specific threats.", slug: "enterprise-ai-risk-assessment" },
  { fn: "Manage", title: "Controls and approval gate", text: "Apply guardrails and human oversight, then make a go or no-go decision.", slug: "responsible-ai-deployment-framework" },
  { fn: "Manage", title: "Deploy and monitor", text: "Track drift, performance, incidents and user feedback in production.", slug: "human-oversight-reliability-ai-security-testing" },
  { fn: "Manage", title: "Review and retire", text: "Reassess on change or schedule, close gaps, decommission safely.", slug: "ai-inventory-governance-gap-assessment" },
];
const archHTML = `
      <figure class="arch" aria-labelledby="arch-caption">
        <div class="arch-layer arch-govern">
          <p class="arch-fn">Govern</p>
          <ul>
            <li>AI governance committee and accountable owners</li>
            <li>Policy, risk appetite and AI literacy</li>
            <li>Regulatory mapping: EU AI Act, ISO/IEC 42001, NIST AI RMF</li>
          </ul>
          ${caseLink("ai-security-programme-charter")}
        </div>
        <p class="arch-connector">Sets policy, risk appetite and approval authority</p>
        <ol class="arch-flow">
          ${archStages
            .map(
              (s, i) => `<li class="arch-stage" style="--n:${i}">
            <span class="arch-step" aria-hidden="true">${i + 1}</span>
            <span class="arch-tag">${s.fn}</span>
            <h3>${s.title}</h3>
            <p>${s.text}</p>
            ${caseLink(s.slug)}
          </li>`
            )
            .join("")}
        </ol>
        <p class="arch-loop">Monitoring findings feed back into reassessment, so the lifecycle runs continuously.</p>
        <p class="arch-connector">Produces evidence at every stage</p>
        <div class="arch-layer arch-assure">
          <p class="arch-fn">Assure</p>
          <ul>
            <li>Evidence and audit trail</li>
            <li>Third-party and AI vendor risk</li>
            <li>Data protection (GDPR)</li>
            <li>Security controls (ISO/IEC 27001, OWASP LLM Top 10)</li>
            <li>Internal audit and certification readiness</li>
          </ul>
          ${caseLink("dataflow-soc2-readiness")}
        </div>
        <figcaption id="arch-caption">AI governance operating model. Stages are grouped by the NIST AI RMF functions: Govern, Map, Measure and Manage.</figcaption>
      </figure>`;

const themeOptions = themes.filter((t) => projects.some((x) => x.theme === t.id)).map((t) => `<option value="${t.id}">${esc(t.name)}</option>`).join("");
const fwOptions = frameworks.map(([f]) => `<option value="${esc(f)}">${esc(f)}</option>`).join("");

const expHTML = site.experience
  .map((e) => `<li><p class="tl-role">${esc(e.role)}, ${esc(e.org)}</p><p class="tl-meta">${esc(e.period)}, ${esc(e.place)}</p>${e.detail ? `<p>${esc(e.detail)}</p>` : ""}</li>`)
  .join("");
const eduHTML = site.education.map((e) => `<li><span>${esc(e.degree)}</span> <span class="muted">${esc(e.school)}, ${esc(e.year)}</span></li>`).join("");
const pubHTML = site.publications
  .map((x) => `<li>${x.url ? `<a href="${esc(x.url)}">${esc(x.title)}</a>` : esc(x.title)} <span class="muted">${esc(x.venue)}</span></li>`)
  .join("");

const contactLinks = [
  site.email && `<li><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></li>`,
  `<li><a href="${esc(site.links.linkedin)}">LinkedIn</a></li>`,
  `<li><a href="${esc(site.links.github)}">GitHub</a></li>`,
  site.links.medium && `<li><a href="${esc(site.links.medium)}">Medium</a></li>`,
].filter(Boolean).join("");

const description = `${site.name}: ${site.role} in ${site.location}. ${site.summary}`;
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  address: { "@type": "PostalAddress", addressLocality: "Doha", addressCountry: "QA" },
  url: site.url,
  sameAs: Object.values(site.links).filter(Boolean),
  ...(site.email ? { email: `mailto:${site.email}` } : {}),
};

const avatarFile = p("public/avatar.jpg");
let AVATAR = "";
try { AVATAR = `data:image/jpeg;base64,${(await readFile(avatarFile)).toString("base64")}`; } catch {}

const tokens = {
  AVATAR,
  TITLE: esc(`${site.name} | ${site.role}`),
  DESCRIPTION: esc(description),
  URL: esc(site.url),
  JSONLD: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
  CSS: await readFile(p("src/styles.css"), "utf8"),
  JS: await readFile(p("src/app.js"), "utf8"),
  NAME: esc(site.name),
  ROLE: esc(site.role),
  LOCATION: esc(site.location),
  HEADLINE: esc(site.headline),
  SUMMARY: esc(site.summary),
  ABOUT: esc(site.about),
  GITHUB: esc(site.links.github),
  LINKEDIN: esc(site.links.linkedin),
  CONTACT_PRIMARY: site.email ? `mailto:${esc(site.email)}` : "#contact",
  PROJECT_COUNT: String(projects.length),
  FRAMEWORK_COUNT: String(frameworks.length),
  LEDGER: ledgerHTML,
  FOCUS: focusHTML,
  FEATURED: featuredHTML,
  ROWS: rowsHTML,
  THEME_OPTIONS: themeOptions,
  FW_OPTIONS: fwOptions,
  EXPERTISE: site.expertise.map((e) => `<li>${esc(e)}</li>`).join(""),
  EXPERIENCE: expHTML,
  CERTS_HELD: site.certifications.held.map((c) => `<li>${esc(c)}</li>`).join(""),
  CERTS_PROGRESS: site.certifications.inProgress.map((c) => `<li>${esc(c)}</li>`).join(""),
  EDUCATION: eduHTML,
  PUBLICATIONS: pubHTML,
  MEMBERSHIPS: esc(site.memberships.join(", ")),
  CONTACT_LINKS: contactLinks,
  CASE_ORDER: caseOrder,
  ARCHITECTURE: archHTML,
  READER_TEMPLATES: readerTemplates,
  YEAR: String(new Date().getUTCFullYear()),
  BUILT: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }),
};

let html = await readFile(p("src/template.html"), "utf8");
html = html.replace(/\{\{([A-Z_]+)\}\}/g, (m, key) => {
  if (!(key in tokens)) throw new Error(`Unknown template token ${m}`);
  return tokens[key];
});

await mkdir(p("dist"), { recursive: true });
await writeFile(p("dist/index.html"), html);
await writeFile(p("dist/projects.json"), JSON.stringify({ generated: new Date().toISOString(), source, themes, projects }, null, 2));
await writeFile(p("dist/robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);
await writeFile(
  p("dist/sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${site.url}/</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url>\n</urlset>\n`
);
await writeFile(p("dist/.nojekyll"), "");
if (!inline) {
  await mkdir(p("dist/read"), { recursive: true });
  for (const x of projects) await writeFile(p(`dist/read/${x.slug}.html`), readerHTML(x));
}
for (const f of await readdir(p("public"))) await copyFile(p("public", f), p("dist", f));

const withDocs = projects.filter((x) => content[x.name]?.docs?.length).length;
console.log(`Case study pages with full documents: ${withDocs}/${projects.length}${inline ? " (inlined)" : ""}.`);
console.log(`Built ${projects.length} projects (${featured.length} featured, ${frameworks.length} frameworks) from ${source}.`);
for (const w of warnings) console.warn(`! ${w}`);
