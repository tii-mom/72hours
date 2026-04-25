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
- [ ] Run `npm run capital:smoke:staging` before any Capital staging handoff.
- [ ] Run `npm run capital:gate:production -- --skip-network` after production secrets/artifact paths are assembled.
- [ ] Run `npm run capital:gate:production` before enabling mainnet Capital signing.
- [ ] Run `QA_BASE_URL=<preview-url> node scripts/mobile-qa.mjs`.
- [ ] Confirm `dist/_redirects` exists.
- [ ] Confirm `dist/_headers` exists.
- [ ] Confirm `dist/404.html` and `dist/en/404.html` exist.
- [ ] Confirm `dist/sitemap.xml` exists and includes both Chinese and English routes.
- [ ] Confirm Vite does not warn about an oversized initial bundle.
- [ ] Confirm `dist/index.html` preloads only public-site essentials and does not preload `tonconnect` or `motion`.

## 2. Capital Integration Handoff

The Capital thread must return these items before the global release owner enables API mode or updates production headers:

- [ ] Capital production API base URL: `CAPITAL_PRODUCTION_API_BASE_URL`.
- [ ] Capital production Indexer base URL: `CAPITAL_PRODUCTION_INDEXER_BASE_URL`.
- [ ] Capital staging smoke output from `npm run capital:smoke:staging`.
- [ ] Official mainnet 72H Jetton master: `TON_MAINNET_72H_JETTON_MASTER_ADDRESS`.
- [ ] Mainnet ReserveVault addresses for `72hours`, `wan`, and `multi-millionaire`.
- [ ] Mainnet AppRewardPool addresses for `72hours`, `wan`, and `multi-millionaire`.
- [ ] Mainnet AlphaVault addresses for `72hours`, `wan`, and `multi-millionaire`.
- [ ] Audit report path: `CAPITAL_AUDIT_REPORT_PATH`.
- [ ] Legal approval artifact path: `CAPITAL_LEGAL_APPROVAL_PATH`.
- [ ] Testnet rehearsal artifact path: `CAPITAL_TESTNET_REHEARSAL_ARTIFACT_PATH`.
- [ ] ReserveVault same-contract redemption verification path: `CAPITAL_RESERVE_VAULT_REDEMPTION_VERIFICATION_PATH`.
- [ ] AppRewardPool policy path: `CAPITAL_APP_REWARD_POOL_POLICY_PATH`.
- [ ] TON RPC provider URL and secret handling: `CAPITAL_MAINNET_RPC_URL` plus provider API key secret.
- [ ] TonConnect manifest production URL and connected official domain: `CAPITAL_TONCONNECT_MANIFEST_URL`.
- [ ] TonConnect bridge/frame origins: `CAPITAL_TONCONNECT_BRIDGE_ORIGINS`.
- [ ] Explorer URL pattern for production transactions: `CAPITAL_MAINNET_EXPLORER_TX_URL_PATTERN` with `{tx}` placeholder.
- [ ] CSP source lists for API, Indexer, RPC, explorer, wallet frame/bridge, image, and manifest origins: `CAPITAL_CSP_CONNECT_SRC`, `CAPITAL_CSP_FRAME_SRC`, `CAPITAL_CSP_IMG_SRC`, `CAPITAL_CSP_MANIFEST_SRC`.
- [ ] Production DB mode flag and database secret: `H72H_CAPITAL_DB_MODE=postgres` and `DATABASE_URL`.
- [ ] Telegram alert bot secrets: `H72H_TELEGRAM_BOT_TOKEN` and `H72H_TELEGRAM_ALERT_CHAT_ID`.
- [ ] Monitoring and rollback owners: `CAPITAL_MONITORING_OWNER` and `CAPITAL_ROLLBACK_APPROVAL_OWNER`.
- [ ] Public Capital route list, including any new verification or identity routes.
- [ ] Final Capital risk wording for Reserve principal custody/redemption, Alpha non-redeemable principal, AppRewardPool rewards, and verification pages.
- [ ] Contract addresses, network labels, and pause/emergency status surfaces that may be displayed publicly.
- [ ] Admin/API auth domain requirements, if any browser-visible endpoint is used.
- [ ] Monitoring and rollback signals for API, indexer, and transaction confirmation failures.
- [ ] RewardPool funding runbook confirmation: approved source, operator role, audit log, and no Reserve principal dependency.
- [ ] Pause/resume runbook confirmation for Admin/API state, contract state, website status copy, and verification pages.
- [ ] Reserve mature-lot principal redeem support flow confirmation for same-contract ReserveVault redemption.
- [ ] Alpha lifecycle gate confirmation: Alpha closed at Reserve launch and opened only after Reserve stability approval.
- [ ] Secret rotation confirmation for any token, password, session secret, RPC key, or deployment credential exposed in chat/logs/local files.
- [ ] Public status copy approved for investigating, paused, indexer-delay, Reserve mature-lot redeem support, and resolved states.
- [ ] Confirm the go-live gate does not require Reserve initial liquidity; funding policy and reward-pool controls are separate owner decisions.

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
- [ ] Confirm Capital verification routes use `noindex, nofollow` and never expose private amounts, rewards, or full addresses.
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
- [ ] Confirm website production is not pointed at staging Capital API.
- [ ] Confirm production Capital API keeps mainnet signing disabled until production gate passes and launch owner approves.
- [ ] Confirm production Indexer starts in disabled or dry-run mode before write mode is enabled.
- [ ] Confirm production Telegram alerts can reach the owner channel.
- [ ] Confirm rollback deployment with `VITE_CAPITAL_DATA_MODE=preview` is available.

## 7. Capital Production Gate

- [ ] `npm run capital:gate:production` passes.
- [ ] API `/health` is healthy against production database.
- [ ] Staging smoke was run after the last Capital code/config change.
- [ ] ReserveVault mainnet addresses and same-contract mature-lot redeem getters are verified for each app.
- [ ] AppRewardPool address, funding source, and funding audit path are verified.
- [ ] Emergency pause authority and Admin pause/resume path are verified.
- [ ] Indexer watched addresses, latest poll, and DB projection checks are verified.
- [ ] Website Capital pages show final risk copy for Reserve, Alpha, AppRewardPool, and verification pages.
- [ ] Alpha allocation remains closed unless a separate Alpha opening approval has been recorded.
- [ ] Incident response owner, rollback owner, and public status owner are assigned.

## 8. Post-Launch Watch

- [ ] Watch 404 volume for 24-48 hours.
- [ ] Watch browser console and request failures on core pages.
- [ ] Watch mobile LCP/CLS/INP for homepage, ecosystem, and Green Book.
- [ ] Watch Capital API failures, stale intent states, transaction confirmation delays, and indexer lag.
- [ ] Watch RewardPool funding/audit consistency and claim availability.
- [ ] Watch Reserve mature-lot redeem support cases and same-contract redeem failures.
- [ ] Watch app pause/resume state consistency across Website, API, Admin, and contracts.
- [ ] Keep the previous deployment available for rollback.
