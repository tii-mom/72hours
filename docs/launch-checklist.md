# 72hours Launch Checklist

Use this checklist before sending production traffic to the Cloudflare Pages deployment.

## 0. Ownership Gate

- [ ] Confirm the global website thread owns Layout, non-Capital pages, SEO, CSP, static assets, release checks, and deployment configuration.
- [ ] Confirm the Capital thread owns contracts, indexer, API, admin, TonConnect transaction flows, and Capital financial-risk copy.
- [ ] Confirm no Capital API, RPC, wallet bridge, or explorer domain has been added without a matching CSP/header review.
- [ ] Confirm `VITE_CAPITAL_DATA_MODE=api` is enabled only in environments where the Capital API is live and monitored.
- [ ] Confirm non-Capital routes do not load TonConnect, wallet runtime, or Capital API clients in the initial page load.

## 1. Build Gate

- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Run `QA_BASE_URL=<preview-url> node scripts/mobile-qa.mjs`.
- [ ] Confirm `dist/_redirects` exists.
- [ ] Confirm `dist/_headers` exists.
- [ ] Confirm `dist/404.html` and `dist/en/404.html` exist.
- [ ] Confirm `dist/sitemap.xml` exists and includes both Chinese and English routes.
- [ ] Confirm Vite does not warn about an oversized initial bundle.
- [ ] Confirm `dist/index.html` preloads only public-site essentials and does not preload `tonconnect` or `motion`.

## 2. Capital Integration Handoff

The Capital thread must return these items before the global release owner enables API mode or updates production headers:

- [ ] Capital API base URL for testnet, staging, and production.
- [ ] TON RPC provider domains and API key handling plan.
- [ ] Wallet bridge/frame domains required by TonConnect.
- [ ] TonConnect manifest production URL and connected official domain.
- [ ] Explorer URL pattern for testnet and production transactions.
- [ ] Public Capital route list, including any new verification or identity routes.
- [ ] Final Capital risk wording for Reserve, Alpha, yield release, redemption queue, and verification pages.
- [ ] Contract addresses, network labels, and pause/emergency status surfaces that may be displayed publicly.
- [ ] Admin/API auth domain requirements, if any browser-visible endpoint is used.
- [ ] Monitoring and rollback signals for API, indexer, and transaction confirmation failures.

## 3. Cloudflare Pages Preview

- [ ] Deploy a preview build from the current branch.
- [ ] Open `/`, `/ecosystem`, `/greenbook`, `/join`, `/learn`, `/hours`, `/contact`, `/legal/privacy`.
- [ ] Open `/en`, `/en/ecosystem`, `/en/greenbook`, `/en/join`, `/en/learn`, `/en/hours`, `/en/contact`, `/en/legal/privacy`.
- [ ] Open `/capital`, `/capital/me`, `/capital/multi-millionaire`, `/capital/72hours`, and `/capital/wan`.
- [ ] Open `/en/capital`, `/en/capital/me`, `/en/capital/multi-millionaire`, `/en/capital/72hours`, and `/en/capital/wan`.
- [ ] Open an invalid Chinese path and confirm it returns the 404 page with HTTP `404`.
- [ ] Open an invalid English path under `/en/*` and confirm it returns the English 404 page with HTTP `404`.
- [ ] Confirm `pages.dev` preview URLs send `X-Robots-Tag: noindex`.

## 4. SEO And Sharing

- [ ] Inspect built HTML for `title`, `description`, `canonical`, `hreflang`, `og:*`, and `twitter:*`.
- [ ] Confirm Chinese pages use Chinese canonical paths without `/en`.
- [ ] Confirm English pages use `/en/*` canonical paths.
- [ ] Confirm 404 pages send `robots: noindex, nofollow`.
- [ ] Confirm public Capital routes are present in `sitemap.xml` only when intended for indexing.
- [ ] Confirm Capital verification routes use `noindex, nofollow` and never expose private amounts, yield, or full addresses.
- [ ] Validate `sitemap.xml` in Google Search Console or an XML validator.
- [ ] Paste `/greenbook`, `/en/greenbook`, `/ecosystem`, and `/en/ecosystem` into Telegram/X/WeChat and check preview cards.

## 5. Mobile Device QA

- [ ] iPhone Safari.
- [ ] Android Chrome.
- [ ] WeChat in-app browser.
- [ ] Telegram in-app browser.
- [ ] X in-app browser.
- [ ] Confirm no page-level horizontal overflow.
- [ ] Confirm primary CTA visibility on `/join` and `/en/join`.
- [ ] Confirm Green Book copy/share/export actions work on real devices.
- [ ] Confirm Capital wallet connection and rejection flows work in mobile wallet browsers before enabling API mode.
- [ ] Confirm non-Capital pages remain usable when wallet extensions or in-app browser bridges are unavailable.

## 6. Cloudflare Production Settings

- [ ] Confirm production custom domain is attached.
- [ ] Confirm apex and `www` routing policy.
- [ ] Confirm TLS is active.
- [ ] Confirm `_redirects` and `_headers` are included in the deployed assets.
- [ ] Confirm Web Analytics or request logging is enabled.
- [ ] Confirm rollback target is available in Cloudflare Pages.
- [ ] Confirm production environment variables include only approved Capital API/manifest values.
- [ ] Confirm CSP `connect-src`, `frame-src`, `img-src`, and `manifest-src` match the approved Capital handoff domains.

## 7. Post-Launch Watch

- [ ] Watch 404 volume for 24-48 hours.
- [ ] Watch browser console and request failures on core pages.
- [ ] Watch mobile LCP/CLS/INP for homepage, ecosystem, and Green Book.
- [ ] Watch Capital API failures, stale intent states, transaction confirmation delays, and indexer lag.
- [ ] Keep the previous deployment available for rollback.
