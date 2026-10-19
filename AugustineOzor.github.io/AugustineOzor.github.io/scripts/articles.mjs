// Knowledge articles: Markdown files in /articles with a JSON front-matter block.
// A small, dependency-free Markdown renderer covers what the articles use:
// headings, paragraphs (line breaks kept), bullet and numbered lists, bold, italic, links and inline code.
import { readFile, readdir } from "node:fs/promises";

const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function inline(s) {
  let out = esc(s);
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  out = out.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" rel="noopener">$1</a>');
  out = out.replace(/\*\*([^*]+?)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*\w])\*([^*\n]+?)\*(?!\w)/g, "$1<em>$2</em>");
  return out;
}

export function renderMarkdown(md) {
  const blocks = md.replace(/\r/g, "").split(/\n\s*\n/);
  const html = [];
  for (const raw of blocks) {
    const block = raw.replace(/\s+$/, "");
    if (!block.trim()) continue;
    const lines = block.split("\n");
    const h = block.trim().match(/^(#{1,6})\s+(.+)$/);
    if (h && lines.length === 1) {
      const level = Math.min(h[1].length + 0, 4) < 2 ? 2 : Math.min(h[1].length, 4);
      html.push(`<h${level}>${inline(h[2].replace(/^\*\*(.+)\*\*$/, "$1"))}</h${level}>`);
      continue;
    }
    if (lines.every((l) => /^\s*[-*•]\s+/.test(l))) {
      html.push(`<ul>${lines.map((l) => `<li>${inline(l.replace(/^\s*[-*•]\s+/, ""))}</li>`).join("")}</ul>`);
      continue;
    }
    if (lines.every((l) => /^\s*\d+[.)]\s+/.test(l))) {
      html.push(`<ol>${lines.map((l) => `<li>${inline(l.replace(/^\s*\d+[.)]\s+/, ""))}</li>`).join("")}</ol>`);
      continue;
    }
    html.push(`<p>${lines.map((l) => inline(l.trim())).join("<br>")}</p>`);
  }
  // Merge lists that were split by blank lines.
  return html.join("\n").replace(/<\/ul>\n<ul>/g, "").replace(/<\/ol>\n<ol>/g, "");
}

export async function loadArticles(dir) {
  let files = [];
  try { files = (await readdir(dir)).filter((f) => f.endsWith(".md")); } catch { return []; }
  const items = [];
  for (const f of files) {
    const src = await readFile(`${dir}/${f}`, "utf8");
    const m = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!m) continue;
    const meta = JSON.parse(m[1]);
    const body = m[2].trim();
    const words = body.split(/\s+/).length;
    items.push({
      ...meta,
      slug: "article-" + f.replace(/\.md$/, ""),
      minutes: Math.max(1, Math.ceil(words / 220)),
      html: renderMarkdown(body),
    });
  }
  return items.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}
