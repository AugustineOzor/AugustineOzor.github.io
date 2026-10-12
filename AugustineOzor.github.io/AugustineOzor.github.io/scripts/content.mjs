// Fetches every Markdown document in a repo and renders it with GitHub's own
// Markdown API, so tables, task lists and diagrams look the way they do on GitHub.
// Results are cached in content/<repo>.json and reused while the repo is unchanged.

import { readFile, writeFile, mkdir } from "node:fs/promises";

const SKIP = /(^|\/)(LICENSE|CONTRIBUTING|CODE_OF_CONDUCT|SECURITY|CHANGELOG)(\.md)?$/i;
const MAX_DOCS = 15;
const MAX_HTML = 400_000; // per repo, keeps the page fast

export function slugOf(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function api(token) {
  const headers = { Accept: "application/vnd.github+json", "User-Agent": "portfolio-build", "X-GitHub-Api-Version": "2022-11-28" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return async (path, opts = {}) => {
    const res = await fetch(`https://api.github.com${path}`, { ...opts, headers: { ...headers, ...(opts.headers || {}) } });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${path}`);
    return res;
  };
}

const prettyFile = (p) => {
  const base = p.split("/").pop().replace(/\.md$/i, "");
  return /^readme$/i.test(base) ? "Overview" : base.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
};
const dirOf = (p) => (p.includes("/") ? p.slice(0, p.lastIndexOf("/") + 1) : "");
function resolvePath(from, rel) {
  const parts = (dirOf(from) + rel).split("/");
  const out = [];
  for (const part of parts) {
    if (part === "..") out.pop();
    else if (part !== "." && part !== "") out.push(part);
  }
  return out.join("/");
}
const ghSlug = (text) =>
  text.toLowerCase().replace(/<[^>]+>/g, "").replace(/&[a-z#0-9]+;/g, "").replace(/[^\p{L}\p{N}\s-]/gu, "").trim().replace(/\s/g, "-");
const decode = (s) => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
const escHTML = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ---------- Markdown pre-processing ----------
function preprocess(md, ctx) {
  const { user, repo, branch, path, docIndexByPath, slug } = ctx;
  const images = [];
  const diagrams = [];

  // Keep Mermaid diagrams out of the renderer and restore them as <pre class="mermaid">.
  md = md.replace(/^(```|~~~)\s*mermaid\s*\n([\s\S]*?)^\1\s*$/gm, (_, f, src) => {
    diagrams.push(src);
    return `\nMERMAIDBLOCK${diagrams.length - 1}\n`;
  });

  const imageURL = (u) => {
    if (/^(https?:)?\/\//i.test(u) || u.startsWith("data:")) return u;
    return `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${resolvePath(path, u.replace(/^\.\//, ""))}`;
  };
  const linkURL = (u) => {
    if (/^(https?:|mailto:|#)/i.test(u)) return u;
    const [target, anchor] = u.split("#");
    const resolved = resolvePath(path, decodeURIComponent(target));
    if (resolved in docIndexByPath) return `#read/${slug}/${docIndexByPath[resolved]}${anchor ? `/${anchor}` : ""}`;
    return `https://github.com/${user}/${repo}/${/\.[a-z0-9]+$/i.test(resolved) ? "blob" : "tree"}/${branch}/${resolved}`;
  };
  const placeholder = (u) => {
    images.push(imageURL(u));
    return `https://img.placeholder.invalid/${images.length - 1}`;
  };

  md = md.replace(/!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?((?:\s+"[^"]*")?)\s*\)/g, (_, alt, u, t) => `![${alt}](${placeholder(u)}${t})`);
  md = md.replace(/(<img\b[^>]*\bsrc=")([^"]+)(")/gi, (_, a, u, b) => a + placeholder(u) + b);
  md = md.replace(/(?<!!)\[([^\]]*)\]\(\s*<?([^)\s>]+)>?((?:\s+"[^"]*")?)\s*\)/g, (_, text, u, t) => `[${text}](${linkURL(u)}${t})`);
  md = md.replace(/(<a\b[^>]*\bhref=")([^"]+)(")/gi, (_, a, u, b) => a + linkURL(u) + b);
  return { md, images, diagrams };
}

// ---------- HTML post-processing ----------
function postprocess(html, { images, diagrams, docIndex, slug }) {
  html = html.replace(/https:\/\/img\.placeholder\.invalid\/(\d+)/g, (_, i) => images[+i]);
  // GitHub rewrites images through its proxy; point them back at the original URL.
  html = html.replace(/<img\b[^>]*\bdata-canonical-src="([^"]+)"[^>]*>/gi, (tag, src) => tag.replace(/\bsrc="[^"]*"/, `src="${src}"`));
  html = html.replace(/<a\b[^>]*>\s*(<img\b[^>]*>)\s*<\/a>/gi, "$1");
  html = html.replace(/<img\b/gi, '<img loading="lazy" decoding="async"');
  html = html.replace(/<p>\s*MERMAIDBLOCK(\d+)\s*<\/p>/g, (_, i) => `<pre class="mermaid">${escHTML(diagrams[+i])}</pre>`);
  // Heading permalinks from GitHub are noise on a portfolio page.
  html = html.replace(/<a\b[^>]*\bclass="anchor"[^>]*>[\s\S]*?<\/a>/gi, "");
  html = html.replace(/<div class="markdown-heading"[^>]*>([\s\S]*?)<\/div>/gi, "$1");
  // Demote headings one level (the reader owns h1/h2) and give them stable ids.
  html = html.replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_, n, inner) => {
    const level = Math.min(+n + 1, 6);
    return `<h${level} id="d${docIndex}-${ghSlug(inner)}"${n === "1" ? " data-h1" : ""}>${inner}</h${level}>`;
  });
  html = html.replace(/href="#(?!read\/)([^"]+)"/g, (_, a) => `href="#read/${slug}/${docIndex}/${a.replace(/^user-content-/, "")}"`);
  html = html.replace(/<table\b/gi, '<div class="table-scroll"><table').replace(/<\/table>/gi, "</table></div>");
  html = html.replace(/<a\b(?![^>]*\bhref="#)([^>]*\bhref="https?:)/gi, '<a rel="noopener"$1');
  return html;
}

function firstH1(md) {
  const m = md.match(/^#\s+(.+)$/m) || md.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return m ? decode(m[1].replace(/<[^>]+>/g, "").replace(/[*_`]/g, "").trim()) : "";
}
const stripFirstH1 = (html) => html.replace(/<h2 id="d\d+-[^"]*" data-h1>[\s\S]*?<\/h2>/, "");

export async function loadContent({ user, repos, token, offline, cacheDir }) {
  await mkdir(cacheDir, { recursive: true });
  const gh = api(token);
  const out = {};
  const warnings = [];

  for (const repo of repos) {
    const cacheFile = `${cacheDir}/${repo.name}.json`;
    let cached = null;
    try { cached = JSON.parse(await readFile(cacheFile, "utf8")); } catch {}
    if (offline || (cached && cached.pushed_at && cached.pushed_at === repo.pushed_at)) {
      if (cached) out[repo.name] = cached;
      continue;
    }
    try {
      const branch = repo.default_branch || "main";
      const tree = await (await gh(`/repos/${user}/${repo.name}/git/trees/${encodeURIComponent(branch)}?recursive=1`)).json();
      const blobs = (tree.tree || []).filter((t) => t.type === "blob" && !t.path.startsWith(".github/") && !/(^|\/)\./.test(t.path));
      const mdPaths = blobs
        .map((t) => t.path)
        .filter((p) => /\.md$/i.test(p) && !SKIP.test(p))
        .sort((a, b) => {
          const rank = (p) => (/^readme\.md$/i.test(p) ? 0 : /sources\.md$/i.test(p) ? 3 : /readme\.md$/i.test(p) ? 1 : 2);
          return rank(a) - rank(b) || a.split("/").length - b.split("/").length || a.localeCompare(b);
        })
        .slice(0, MAX_DOCS);
      const docIndexByPath = Object.fromEntries(mdPaths.map((p, i) => [p, i]));
      const slug = slugOf(repo.name);
      const docs = [];
      let total = 0;
      for (const [i, p] of mdPaths.entries()) {
        const raw = await (await gh(`/repos/${user}/${repo.name}/contents/${p.split("/").map(encodeURIComponent).join("/")}?ref=${encodeURIComponent(branch)}`, { headers: { Accept: "application/vnd.github.raw" } })).text();
        const pre = preprocess(raw, { user, repo: repo.name, branch, path: p, docIndexByPath, slug });
        const rendered = await (await gh(`/markdown`, { method: "POST", body: JSON.stringify({ text: pre.md, mode: "gfm", context: `${user}/${repo.name}` }) })).text();
        let html = postprocess(rendered, { ...pre, docIndex: i, slug });
        const title = (i === 0 ? "Overview" : firstH1(raw)) || prettyFile(p);
        html = stripFirstH1(html);
        total += html.length;
        if (total > MAX_HTML) { warnings.push(`"${repo.name}": stopped after ${docs.length} documents to keep the page fast.`); break; }
        docs.push({ path: p, title, html });
      }
      const files = blobs
        .filter((t) => !/\.md$/i.test(t.path))
        .slice(0, 40)
        .map((t) => ({ path: t.path, url: `https://github.com/${user}/${repo.name}/blob/${branch}/${t.path.split("/").map(encodeURIComponent).join("/")}` }));
      const entry = { pushed_at: repo.pushed_at, docs, files };
      await writeFile(cacheFile, JSON.stringify(entry));
      out[repo.name] = entry;
    } catch (err) {
      warnings.push(`Could not load documents for "${repo.name}" (${err.message})${cached ? "; using cached copy" : ""}.`);
      if (cached) out[repo.name] = cached;
    }
  }
  return { content: out, warnings };
}
