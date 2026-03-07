# Salim Ahmed — Portfolio (Astro)

Content-driven portfolio built with Astro.

## Stack

- Astro
- Astro Content Collections
- Markdown project entries (`src/content/projects/*.md`)
- Markdown blog entries (`src/content/blog/*.md`)

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Content Workflow

To add a new project, create a new Markdown file in `src/content/projects/` with frontmatter that matches the schema in `src/content.config.ts`.

Example:

```md
---
title: Example Project
description: One clear sentence about the project.
image: /assets/images/example.png
imageAlt: Example project preview
technologies:
	- label: Python
		key: python
	- label: Git
	- label: GitHub
links:
	- label: Repository
		url: https://github.com/your/repo
order: 99
---
```

Projects are rendered automatically on the homepage.

## Blog Workflow

Add new posts by creating Markdown files in `src/content/blog/`.

Each post should include frontmatter:

```md
---
title: Post title
excerpt: Short summary for cards and meta description.
publishedAt: 2026-03-07
tags:
	- astro
draft: false
---
```

Posts render automatically on the homepage Blog section, `/blog`, and `/blog/[slug]`.

![Portfolio OG Preview](./public/assets/images/og-preview.png)
