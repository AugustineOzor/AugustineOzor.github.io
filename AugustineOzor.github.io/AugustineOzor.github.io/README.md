# augustineozor.github.io

Personal portfolio for Augustine Ozor, AI Governance & Cybersecurity GRC. A static site built from my public GitHub repositories, with no framework and no dependencies.

## How it works

`scripts/build.mjs` fetches every public, non-fork repo from the GitHub API, merges it with the curated content in `data/`, and renders `dist/index.html` (plus `projects.json`, `sitemap.xml`, `robots.txt` and the Open Graph image).

Case studies are readable on the site itself. `scripts/content.mjs` collects every Markdown file in each repo (README first, then subfolder documents), renders it through GitHub's own Markdown API so tables and Mermaid diagrams match GitHub, and writes one page per case study to `dist/read/<repo>.html`. Visitors open them at `#read/<repo>` without leaving the site; a document menu, previous/next links and a link to the source repo are included. Rendered documents are cached in `content/` and only refetched when a repo changes.

| File | What to edit it for |
| --- | --- |
| `data/site.json` | Name, headline, email, links, certifications, experience, education |
| `data/projects.config.json` | Focus areas, each repo's title, area and frameworks, the featured write-ups, and repos to hide |
| `src/template.html`, `src/styles.css`, `src/app.js` | Layout, design and behaviour |

New repos appear automatically under **Other work** until you give them an entry in `projects.config.json`. The build prints a warning for any repo that is untagged or has no description.

## Run locally

Requires Node 18 or newer. Fetching documents makes several GitHub API calls per repo, so set a token locally to avoid the 60-requests-per-hour anonymous limit: `export GITHUB_TOKEN=<a personal access token with public read access>`. GitHub Actions provides one automatically.

```bash
npm run build          # fetch repos from GitHub and build into dist/
npm run build:offline  # build from data/repos.snapshot.json, no network
npm run preview        # serve dist/ at http://localhost:8080 (needed: case pages load over HTTP)
node scripts/build.mjs --inline   # single-file build with every case study embedded
```

## Update

- **Add a project:** push the repo to GitHub, then add an entry to `data/projects.config.json` with its `title`, `theme` and `frameworks`.
- **Feature a project:** add `"featured": 1`–`6` plus `context`, `problem`, `approach` and `deliverables`.
- **Hide a project:** add its name to `exclude`.

## Deploy

1. Create a public repo named **`AugustineOzor.github.io`** and push this folder to `main`.
2. In the repo, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` builds and deploys on every push, once a day, and on demand from the Actions tab.

The site is then live at https://augustineozor.github.io.
