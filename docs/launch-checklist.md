# 72hours Launch Checklist

Use this checklist before sending production traffic to the Cloudflare Pages deployment.

## 1. Build Gate

- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Confirm `dist/_redirects` exists.
- [ ] Confirm `dist/_headers` exists.
- [ ] Confirm `dist/404.html` and `dist/en/404.html` exist.
- [ ] Confirm `dist/sitemap.xml` exists and includes both Chinese and English routes.

## 2. Cloudflare Pages Preview

- [ ] Deploy a preview build from the current branch.
- [ ] Open `/`, `/ecosystem`, `/greenbook`, `/join`, `/learn`, `/hours`, `/contact`, `/legal/privacy`.
- [ ] Open `/en`, `/en/ecosystem`, `/en/greenbook`, `/en/join`, `/en/learn`, `/en/hours`, `/en/contact`, `/en/legal/privacy`.
- [ ] Open an invalid Chinese path and confirm it returns the 404 page with HTTP `404`.
- [ ] Open an invalid English path under `/en/*` and confirm it returns the English 404 page with HTTP `404`.
- [ ] Confirm `pages.dev` preview URLs send `X-Robots-Tag: noindex`.

## 3. SEO And Sharing

- [ ] Inspect built HTML for `title`, `description`, `canonical`, `hreflang`, `og:*`, and `twitter:*`.
- [ ] Confirm Chinese pages use Chinese canonical paths without `/en`.
- [ ] Confirm English pages use `/en/*` canonical paths.
- [ ] Confirm 404 pages send `robots: noindex, nofollow`.
- [ ] Validate `sitemap.xml` in Google Search Console or an XML validator.
- [ ] Paste `/greenbook`, `/en/greenbook`, `/ecosystem`, and `/en/ecosystem` into Telegram/X/WeChat and check preview cards.

## 4. Mobile Device QA

- [ ] iPhone Safari.
- [ ] Android Chrome.
- [ ] WeChat in-app browser.
- [ ] Telegram in-app browser.
- [ ] X in-app browser.
- [ ] Confirm no page-level horizontal overflow.
- [ ] Confirm primary CTA visibility on `/join` and `/en/join`.
- [ ] Confirm Green Book copy/share/export actions work on real devices.

## 5. Cloudflare Production Settings

- [ ] Confirm production custom domain is attached.
- [ ] Confirm apex and `www` routing policy.
- [ ] Confirm TLS is active.
- [ ] Confirm `_redirects` and `_headers` are included in the deployed assets.
- [ ] Confirm Web Analytics or request logging is enabled.
- [ ] Confirm rollback target is available in Cloudflare Pages.

## 6. Post-Launch Watch

- [ ] Watch 404 volume for 24-48 hours.
- [ ] Watch browser console and request failures on core pages.
- [ ] Watch mobile LCP/CLS/INP for homepage, ecosystem, and Green Book.
- [ ] Keep the previous deployment available for rollback.
