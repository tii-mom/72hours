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

## 72H Capital local integration

The website source defaults to `VITE_CAPITAL_DATA_MODE=preview` so an unconfigured public build does not call a Capital API by accident. Testnet, staging, and production deployments should opt into API mode through environment variables after the Capital service is live.

For local Capital development, run the API service first:

```bash
cd ../72h-capital-api
npm install
npm run dev
```

Then run this website:

```bash
npm run dev
```

During local dev, Vite proxies `/v1/capital/*` to `http://localhost:3001` by default.
You can override that with `VITE_CAPITAL_PROXY_TARGET`.
TonConnect defaults to `/tonconnect-manifest.json`; override it with `VITE_TONCONNECT_MANIFEST_URL` if your public manifest is hosted elsewhere.

To run against a live Capital API, set:

```bash
VITE_CAPITAL_DATA_MODE=api VITE_CAPITAL_API_BASE_URL=/v1/capital npm run dev
```

## Production build

Run the full production build:

```bash
npm run build
```

This does two things:
- Cleans `dist/`, then builds the SPA bundle
- Generates localized static HTML entry files, canonical metadata, and `sitemap.xml`

Cloudflare Pages headers define the production CSP in `public/_headers`; keep external API, image, font, and wallet bridge origins in sync with deployed integrations. Production scripts are limited to same-origin Vite assets plus the hashed theme bootstrap in `index.html`; do not reintroduce inline script handlers or broad script origins for launch fixes.

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
- Capital pages use local public data by default; API mode is opt-in per deployment with `VITE_CAPITAL_DATA_MODE=api`
- TonConnect is wired only for wallet connection and session display in this repo; seat allocation, redemption, and yield claim signing still depend on the live contract and intent flow
