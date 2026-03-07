# Portfolio Content Update Guide (Astro)

This project is now content-driven with Astro. The easiest way to add projects is by creating Markdown files.

## Where To Edit

- Projects content: `src/content/projects/*.md`
- Projects schema (required fields): `src/content.config.ts`
- Homepage rendering: `src/pages/index.astro`
- Global styles: `src/styles/global.css`

## Add A New Project

1. Duplicate any file in `src/content/projects/`.
2. Rename it, for example: `new-tool.md`.
3. Update frontmatter fields:

```md
---
title: New Tool
description: One sentence describing what it does.
image: /assets/images/new-tool.png
imageAlt: New Tool preview
technologies:
  - label: Python
    key: python
  - label: FastAPI
    key: fastapi
  - label: Git
  - label: GitHub
links:
  - label: Repository
    url: https://github.com/username/new-tool
order: 6
---
```

4. Save the file. Astro picks it up automatically.

## Tags + Filtering Rules

- If a technology should be filterable, include a `key` that matches one of the About section filter keys.
- If a technology is display-only, omit `key` (example: `Git`, `GitHub`).
- Keep keys consistent (`python`, `fastapi`, `django`, etc.) so filtering works correctly.

## Images

- Put local images in `public/assets/images/`.
- Use paths like `/assets/images/your-image.png` in project frontmatter.

## Useful Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```
