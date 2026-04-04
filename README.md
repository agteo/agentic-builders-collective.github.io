# Agentic Builders Collective Website

This repository contains the public website for the Agentic Builders Collective — a Singapore community of builders exploring agentic coding with Claude Code, Codex, Antigravity, and beyond.

## Philosophy: GitHub as CMS

This site intentionally uses **GitHub as its content management system**. All data lives in YAML and Markdown files that are version-controlled, reviewable, and contributed via Pull Requests.

> **Why?** Because we're the Agentic Builders Collective. Contributing to this site should itself be an exercise in using GitHub and AI coding tools — or learning how to with your agent's help.

### How to contribute content

| Page | What to add | File to edit | How |
|------|-------------|--------------|-----|
| `/community` | Your profile | `src/content/people/people.yaml` | Add YAML entry, submit PR |
| `/showcase` | Your project | `src/content/showcase/*.md` | Create Markdown file, submit PR |
| `/resources` | Links/tools | `src/content/resources/resources.yaml` | Add YAML entry, submit PR |
| `/events` | Event details | `src/content/events/*.md` | Create Markdown file, submit PR |
| `/blog` | Blog posts | `src/content/blog/*.md` | Create Markdown file, submit PR |
| `/articles` | External articles | `src/content/articles/articles.yaml` | Add YAML entry, submit PR |

**Don't know Git?** Ask Claude/Codex/Cursor to help you: *"Help me submit a PR to add my profile to this YAML file."*

## Stack

- **Astro** — static site framework
- **Astro Content Collections** — typed content and data loading
- **YAML/Markdown** — human-readable, version-controlled data
- **GitHub Pages** — free static hosting
- **No database** — by design (see Philosophy above)

## Getting started

```sh
pnpm install
pnpm dev
```

Open `http://localhost:4321/` during development.

## Content model

All content lives in `src/content/`:

- `src/content/people/people.yaml` — Community member profiles
- `src/content/organisers/organisers.yaml` — Event organizers
- `src/content/showcase/*.md` — Project showcases
- `src/content/resources/resources.yaml` — Links and resources
- `src/content/articles/articles.yaml` — External articles
- `src/content/blog/*.md` — Blog posts
- `src/content/events/*.md` — Event listings
- `src/content/faq/faq.yaml` — Homepage FAQ

See `docs/content-model.md` for field-level guidance and example frontmatter.

## Available scripts

```sh
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm check    # Type check with Astro
```

## GitHub Pages deployment

This repo deploys to GitHub Pages via [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml).

Canonical URL: `https://agentic-builders-collective.github.io/`

To deploy:

1. Go to `Settings` -> `Pages` on GitHub
2. Set `Source` to `GitHub Actions`
3. Push to `main` to trigger deployment

## Notes

- `logo-generator/` is a Git submodule for logo and brand experiments
- The site uses a **terminal/CLI aesthetic** — single font size (1rem), monospace fonts, minimal hierarchy via color/bold rather than size
- Design principle: *"Make it look like a CLI"*
