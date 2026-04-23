# 72hours Site

72hours 的官网源码，基于 `Vite + React + Tailwind CSS`。

## Local development

Prerequisites:
- Node.js 20+
- npm

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

The dev server listens on [http://localhost:3000](http://localhost:3000).

## Production build

Run the full production build:

```bash
npm run build
```

This does two things:
- Builds the SPA bundle into `dist/`
- Generates localized static HTML entry files, canonical metadata, and `sitemap.xml`

Preview the production build:

```bash
npm run preview
```

Vite preview listens on [http://localhost:4173](http://localhost:4173) by default.

## Checks

Type-check the project:

```bash
npm run lint
```

## Notes

- Chinese is the default public path space, for example `/greenbook`
- English lives under `/en/*`, for example `/en/greenbook`
- Legacy `?lang=` URLs are normalized into canonical locale paths at runtime
