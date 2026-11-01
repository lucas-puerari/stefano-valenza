# Stefano Valenza — static site

An Astro site with Markdown content and automatic deployment to GitHub Pages. No database or CMS required. Project documentation and code are in English; the website and articles are in Italian.

## UI stack

The site uses **Tailwind CSS v4** for layout utilities, **daisyUI v5** for ready-made UI components (navbar, hero, cards, badges, buttons, breadcrumbs, stats, footer), and **Tailwind Typography** for Markdown prose. Astro generates static HTML; there is no client-side framework. A small script closes the native mobile menu after navigation, on outside click, or on Escape. `src/styles/global.css` defines only fonts and the flat, shadow-free, dark-burgundy `stefano` daisyUI theme (with contemporary sans-serif typography and restrained rounded corners). Use daisyUI component classes plus Tailwind utilities for new UI; do not add custom UI components or component-specific CSS. Keep visible copy in `content/pages/`, not in page markup. Test interactive UI with keyboard and assistive technology before launch.

## Develop locally

Requires Node.js 24 and npm. Clone the repository, then run:

```sh
make install   # npm ci + installs the git hooks in .githooks/
make dev
```

`make install` (any `npm ci`/`npm install`) sets `core.hooksPath` to `.githooks/`, which enables:

- `pre-commit`: blocks commits on `main` and runs `make lint test`.
- `commit-msg`: rejects commit subjects that are not Conventional Commits.
- `pre-push`: rejects pushes to `main`.

Hooks give fast feedback only; CI and branch protection are the real enforcement (hooks can be bypassed with `--no-verify`).

| Command      | What it does                                   |
| ------------ | ---------------------------------------------- |
| `make lint`  | ESLint (TypeScript, Astro, scripts)            |
| `make test`  | Unit tests (`node --test`)                     |
| `make check` | Astro type checks                              |
| `make build` | Production build into `dist/`                  |
| `make ci`    | Everything CI runs: lint, test, check, build   |

Open the URL shown in the terminal (usually `http://localhost:4321/`). Changes to Markdown files and site code appear automatically in the browser. Check the production build with:

```sh
make ci
npm run preview
```

`dist/` contains generated files; do not edit or commit it. Local URLs use `/`; GitHub Pages URLs automatically include the repository name where needed.

## Edit site copy

All public-facing text is in Italian and lives in Markdown files outside `src/`:

- `content/pages/home.md`: homepage hero, articles section headings, empty state. The text **below** the `---` frontmatter is the hero introduction; edit it using Markdown.
- `content/pages/about.md`: about-section heading and introduction. The text below the frontmatter is the section body; Markdown links and paragraphs are supported. Optionally add both `portrait: "/images/stefano.jpg"` and an Italian `portraitAlt` after placing a real photo in `public/images/`.
- `content/pages/collaborations.md`: collaboration and contact section. Add both `contactEmail` (a real address) and `contactLabel` to show a contact button; omit both until an address is available.
- `content/pages/site.md`: site name, homepage browser title and breadcrumb label (`homePageTitle`, currently `Home`), descriptions, navigation (including `mobileMenuLabel`), footer (including `vatDisplay`), article labels, and other shared text. These values live between the `---` lines at the top of the file (YAML frontmatter); quote text containing `:` or other YAML-special characters.

Keep the English field names unchanged, edit the Italian values, then check the result with `npm run dev`. Missing required fields or invalid YAML cause the build to fail instead of silently publishing broken content. Use a branch and PR for these edits, just as you would for articles.

The homepage shows the latest articles and links to the full `/articles/` archive, which groups articles by type without requiring JavaScript. The collaboration section has no public contact button until a real email address is provided. `prototype: true` in `content/pages/site.md` adds `noindex, nofollow` to all pages, including production, so this demo is not intentionally submitted for indexing. Replace placeholder text (including the `00000000000` VAT number), check legal/privacy details and real URLs, then set `prototype: false` when ready to launch.

## Write an article

Add a Markdown file at `content/articles/article-slug.md` (use a short, lowercase filename with hyphens). For example:

```md
---
title: "Una birra da raccontare"
description: "Una breve descrizione dell'articolo."
date: 2026-03-02
type: review
brewery: "Nome del birrificio"
style: "Pils"
draft: true
---

Qui inizia il testo. Puoi usare **grassetto**, link e titoli `##`.
```

Required fields: `title`, `description`, `date` (`YYYY-MM-DD`), and `type` (`review`, `guide`, or `story`). Optional fields: `brewery`, `style`, `cover`, `coverAlt`, and `draft`. Field names and type values are in English, but titles, descriptions, and article text should be in Italian. Type values are translated into Italian on the site.

With `draft: true`, an article is visible and marked as a draft in the local development server (`npm run dev`), but excluded from production builds (`npm run build`, `npm run preview`, and GitHub Pages). Remove `draft` or set it to `false` to publish. See `content/articles/sample-review.md` for an example draft.

To add a cover, save the image in `public/images/` and provide both fields:

```yaml
cover: "/images/article-slug.jpg"
coverAlt: "Bicchiere di birra sul tavolo"
```

Use your own or appropriately licensed images, preferably compressed. For images **inside the article body**, place them alongside the Markdown file and reference them with a relative path, e.g. `![Descrizione](./foto.jpg)`. Astro processes them at build time. Do not use absolute `/images/` paths inside Markdown: they would break on a GitHub Pages project URL with a subpath.

You can also edit Markdown files directly on GitHub, create a branch, and open a PR without using a terminal. Use the local development server for immediate visual previews.

## From draft to publication

1. Create a branch named `type/short-slug`, for example `git switch -c content/new-review`. Allowed types: `feat`, `fix`, `docs`, `content`, `refactor`, `style`, `test`, `chore`, `ci`, `perf`, and `build`. Use lowercase letters, numbers, and hyphens in the slug.
2. Write and preview with `npm run dev`; keep `draft: true` until the article is ready.
3. Set `draft: false`, run `make ci`, then commit with a [Conventional Commit](https://www.conventionalcommits.org/), for example `git add content/articles && git commit -m "content: add new review" && git push -u origin content/new-review`. Every commit in a PR, including subsequent fixes, must use `type: short description` or `type(scope): short description`.
4. Open a pull request targeting `main` and fill in `.github/PULL_REQUEST_TEMPLATE.md`: summary, checked change type, verification, and publishing notes. The **PR title must also be a Conventional Commit** (for example `content: add new review`). Two required checks run: **conventions** (branch name, every commit, PR title, template; re-runs when you edit the title or description) and **build** (lint, tests, types, production build). PRs **never deploy**.
5. After review and passing **build** and **conventions** checks, squash-merge into `main` (the PR title becomes the commit message on `main`). Only this merge triggers the build and, if lint, tests, and build pass, the deploy to GitHub Pages. Direct pushes to `main` are blocked by GitHub branch protection.

## Configure GitHub Pages (once)

1. Push the initial repository (including `package-lock.json`) to GitHub. This one-time bootstrap must happen before protection can be enabled on the empty repository.
2. Select **GitHub Actions** as the source in **Settings → Pages → Build and deployment**. Make sure Actions are enabled under **Settings → Actions → General**.
3. Protect `main` in **Settings → Branches**: require a PR and the passing **build** and **conventions** checks, apply the protection to administrators, require linear history, and allow squash merges only. This repository is configured with those settings; verify them before editing repository governance.
4. After a PR merges, the `push` workflow deploys the site. The default URL is `https://USER.github.io/REPO/`, or `https://USER.github.io/` for a `USER.github.io` repository.

For a custom domain, configure it in **Settings → Pages** and set the `SITE_URL` variable in **Settings → Secrets and variables → Actions → Variables** to the full URL, e.g. `https://beer.example/`. `SITE_URL` can also override the automatically detected GitHub Pages URL. It applies to both PR builds and deployments.

The deploy job runs only on a `push` to protected `main` after the build succeeds. CI conventions block PR merges; branch protection is what blocks direct pushes. Repository administrators can change protection settings, so restrict admin access appropriately.
