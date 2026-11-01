# Stefano Valenza

Static Astro site about beer, published on GitHub Pages: https://lucas-puerari.github.io/stefano-valenza/

Code and docs are in English; site copy and articles are in Italian.

## Develop

Requires Node.js 24.

```sh
make install   # dependencies + git hooks
make dev       # http://localhost:4321/
make ci        # lint, test, type check, build (same as CI)
```

## Edit content

- **Site copy**: `content/pages/*.md` (`site.md` for shared labels, `home.md`, `about.md`, `collaborations.md`). Edit the Italian values, keep the field names.
- **Articles**: add `content/articles/<slug>.md`:

```md
---
title: "Una birra da raccontare"
description: "Breve descrizione."
date: 2026-03-02
type: review        # review | guide | story
draft: true         # hidden in production until removed or false
---

Testo dell'articolo in Markdown.
```

Images go in `public/images/`. Before launch, replace the placeholders in `site.md` (VAT number) and set `prototype: false`.

## Contribute

1. Branch from `main` as `type/short-slug` (e.g. `content/new-review`).
2. Commit with [Conventional Commits](https://www.conventionalcommits.org/) (e.g. `content: add new review`). Hooks check this locally.
3. Open a PR, fill in the template, and use a Conventional Commit title.
4. When `build` and `conventions` pass, squash-merge. The merge deploys to GitHub Pages.

Allowed types: `feat`, `fix`, `docs`, `content`, `refactor`, `style`, `test`, `chore`, `ci`, `perf`, `build`.

`main` is protected: no direct pushes, PRs only, squash merge only.
