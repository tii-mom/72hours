# 72H Capital Launch Readiness

Last updated: 2026-04-24

Status: staging/testnet rehearsal ready, not production/mainnet ready.

## Summary

The Capital system can currently support controlled staging validation:

- Website Capital routes build in API mode.
- API staging reads Neon Postgres and supports disabled intent lifecycle plus protected Admin reads/actions.
- Indexer staging exposes Worker-safe health/status/poll guard endpoints.
- ReserveVault testnet rehearsal has been verified.
- Admin app builds and can talk to the staging API.
- Admin Pages staging is deployed.
- Staging smoke verification is automated with `npm run capital:smoke:staging`.
- Production launch defaults and owner gates are documented in `capital-production-launch-plan.md`.

Production/mainnet launch is blocked until the P0 items below are complete.

## P0 Blockers

- Mainnet contracts are not production-ready.
- External contract audit is not complete.
- Production governance is single-admin, but the security risk is accepted by owner decision.
- AppRewardPool funding policy and ReserveVault same-contract redemption verification are not finalized.
- `AdminMultisig`, `AppRewardPool`, and `AlphaVault` remain planned/uninitialized on testnet.
- Production Cloudflare Workers/Pages projects are not established separately from staging.
- Production secrets are missing and staging secrets exposed in prior local/chat context must be rotated.
- The Cloudflare token used for staging deployment has appeared in chat context and must be rotated before any production use.
- API wallet-send remains intentionally disabled with `H72H_ENABLE_TESTNET_TACT_MESSAGES=false`.
- Indexer Worker remains non-persistent and dry-run only; durable production projection still needs a persistence design.
- Production website API mode requires final API URL, wallet bridge domains, RPC domains, explorer URLs, TonConnect manifest, risk wording, and pause/status policy.

## P1 Blockers

- Production Telegram alerting is not complete; owner chat and delivery test are still required.
- Admin multisig operation status is not connected to real chain execution.
- API still needs live submission confirmation against deployed contracts and indexer projections.
- Indexer Postgres write path is guarded and not enabled in Worker runtime.
- Website production CSP/header review is still pending for Capital API, wallet, RPC, explorer, image/font, and manifest domains.
- Testnet wallet-send enablement still requires a controlled internal wallet rehearsal after enabling real Tact messages.

## P2 Gaps

- Admin app-level controls, notices, and protected parameter mutation flows are not complete.
- Production alerting and rollback automation are not implemented.
- SEO/social card QA for Capital routes still needs final browser verification on deployed URLs.
- Mobile wallet rejection and in-app browser edge cases need QA.

## Current Staging Verification

API:

- `https://72h-capital-api-staging.348421501.workers.dev/health`
- public reads use Neon Postgres.
- intent lifecycle works but returns wallet-disabled transaction requests.
- Admin session/dashboard/recent-intents work.

Indexer:

- `https://72h-capital-indexer-staging.348421501.workers.dev/health`
- `tokenConfigured=true`
- `enabled=false`
- `dryRun=true`
- `watchedAddressCount=5`
- `POST /v1/indexer/poll-once` returns `403 status=disabled`.

Admin:

- local build passes.
- Pages project exists as `72h-capital-admin-staging`.
- Pages staging URL is live: `https://72h-capital-admin-staging.pages.dev`.
- Latest deployment URL: `https://8eb2c380.72h-capital-admin-staging.pages.dev`.

Smoke gate:

- Command: `npm run capital:smoke:staging`
- Verifies API health, Neon/Postgres mode, app list, app detail, public verification route, disabled wallet intent, intent lookup, Indexer guard state, and Admin Pages asset availability.
- Expected staging intent boundary: `uiState.disabled=true`, wallet messages length `0`, and `productionReady=false`.

## Required Inputs From Owner

- Production Cloudflare deployment token or interactive Wrangler login.
- Production database decision and production `DATABASE_URL`.
- Production Telegram bot token, alert chat id, and owner delivery test.
- Official mainnet 72H Jetton master contract address: `EQBGIzEDvvKObStrcVb6i5Z1-8uYZYtUrYzF2rFZU7xUAXVg`.
- ReserveVault mainnet addresses, redemption getter verification, and AppRewardPool funding policy.
- Final legal/risk copy approval.

## Production Defaults Chosen

- Monitoring: Telegram bot alerting to the production owner chat.
- Roles: `owner`, `admin`, `reward-operator`, `operator`, `risk-reviewer`, `viewer`.
- Governance: single admin wallet, 1 required signature.
- Admin wallet: `UQCxJ05yeawVWlsN5SfJ-obajgh2lFffR-O7ebH_s_wqQfRq`.
- Reserve principal custody: user principal remains in each app ReserveVault and is redeemed from that same contract after maturity.
- Mainnet Jetton master: `EQBGIzEDvvKObStrcVb6i5Z1-8uYZYtUrYzF2rFZU7xUAXVg`.
- Jetton verification: `contract_type=jetton_master`, `decimals=9`, `mintable=false`, total supply `100,000,000,000 72H`.
- Launch mode: Reserve gray launch first; Alpha remains closed until Reserve stabilizes.

## Go / No-Go Rule

- Staging/testnet rehearsal: Go.
- Public testnet wallet-send: Go only after intentionally enabling `H72H_ENABLE_TESTNET_TACT_MESSAGES=true` and completing one internal wallet rehearsal.
- Mainnet Reserve: No-go until all P0 blockers are closed.
- Mainnet Alpha: No-go until Reserve mainnet has operated stably through at least one monitored cycle.
