# 72H Capital Readiness Gap Report - 2026-04-24

Scope audited:

- `/Users/yudeyou/Desktop/72hours`
- `/Users/yudeyou/Desktop/72h-capital-api`
- `/Users/yudeyou/Desktop/72h-capital-admin`
- `/Users/yudeyou/Desktop/72h-capital-contracts`
- `/Users/yudeyou/Desktop/72h-capital-indexer`

Decision: **No-go for production/mainnet operations.** Staging/testnet rehearsal is healthy enough for controlled validation, but production launch remains blocked by contract/audit, owner-supplied secrets and approvals, production infrastructure, indexer persistence, CSP/domain hardening, monitoring, and rollback evidence.

## P0 blockers

1. Mainnet contracts are not cleared for production.
   - `72h-capital-contracts` still documents the current Tact contracts as minimal shells and explicitly calls out missing audited Jetton payout dispatch, full lot ledger behavior, reward claim dispatch, replay/signature model, and production event schema.
   - External smart contract audit report is not present.
   - `AdminAuthority`, `AppRewardPool`, `ReserveVault`, and `AlphaVault` need final deployed-address verification and owner sign-off before enabling mainnet signing.

2. Production gate inputs are missing.
   - `npm run capital:gate:production` fails because required production URLs, mainnet ReserveVault/AppRewardPool/AlphaVault addresses, CSP/manifest/RPC/explorer values, database/admin secrets, redemption verification, reward pool policy, audit report, and legal approval paths are absent from the local environment.
   - The gate now emits structured `code`, `field`, and `message` entries for every missing or invalid input.

3. Production database strategy requires owner-provided credentials.
   - Production is standardized on separate Postgres/Neon with `DATABASE_URL`.
   - `DATABASE_URL` must be set as a Cloudflare secret and must not be committed.
   - API migrations and seed must be run against the production database before enabling website API mode.

4. Production indexer persistence is not ready.
   - `72h-capital-indexer/wrangler.jsonc` production defaults to `H72H_TON_DRY_RUN=true` and `H72H_INDEXER_POSTGRES_WRITE_ENABLED=false`.
   - Worker production can persist only raw observed transactions when explicitly enabled; seat/lot projection remains owned by Node poller/projection writer.
   - No production chain-event write path, projection reconciliation job, cursor policy, or alerting evidence is present.

5. Mainnet signing must remain disabled.
   - API production config has `H72H_ENABLE_MAINNET_TACT_MESSAGES=false`.
   - Website copy and staging smoke confirm current intent responses are wallet-disabled for staging. Mainnet signing should not be enabled until audited contracts, production DB/indexer writes, and one internal mainnet rehearsal are complete.

6. Production Cloudflare estate is not proven live.
   - Separate production Worker/Pages names are configured, but local evidence only proves staging endpoints.
   - Production API/indexer/admin URLs are not provided to the production gate, so health, environment labels, admin reachability, and rollback target cannot be verified.

7. CSP and TonConnect domains are not finalized.
   - `public/_headers` still allows broad `https:`/`wss:` in `connect-src` and broad `https:` in `img-src`/`media-src`.
   - Final production API, indexer, RPC, explorer, TonConnect manifest, bridge/frame, image/font domains need approval before headers are hardened.
   - `public/tonconnect-manifest.json` exists, but the production manifest URL and connected official domain are still owner-gated.

8. Monitoring and rollback are not operationalized.
   - Cloudflare observability is enabled on Workers, but there is no alert policy, SLO, dashboard, incident owner matrix, or tested rollback procedure.
   - Rollback docs exist at runbook/checklist level, but no production rollback target or drill result is recorded.

## Can be completed locally

- Resolve the API production DB mode contradiction once owner picks Postgres or D1.
- Add a stricter production CSP after final domains are supplied.
- Add production gate coverage for DB mode, indexer write enablement, `H72H_ENABLE_MAINNET_TACT_MESSAGES`, and Cloudflare rollback target.
- Add a monitoring/rollback drill checklist with exact Cloudflare commands and expected health outputs.
- Run production dry-runs after production Cloudflare vars/secrets are available.
- Generate and attach local no-secret evidence files for mainnet contract getter verification once contracts are deployed.

## Must be supplied by owner

- External smart contract audit report and remediation sign-off.
- Legal approval for public Capital financial-risk copy.
- Final production DB choice and production `DATABASE_URL` or D1 database id.
- Production Cloudflare deployment token or authenticated deploy channel.
- Production API, indexer, admin, and website URLs.
- Production admin auth policy, MFA/account owner list, and secret rotation confirmation.
- TON mainnet RPC provider/API key and rate-limit plan.
- Final mainnet contract deployment tx hashes and verified addresses for ReserveVaults, AppRewardPools, AdminAuthority, Registry, and AlphaVaults.
- ReserveVault same-contract redemption verification artifact.
- AppRewardPool funding policy and first funding evidence.
- TonConnect production manifest URL, wallet bridge/frame domains, explorer URL patterns, and official connected domain.
- Monitoring owners, escalation channel, alert thresholds, and rollback approval owner.

## Verification run

- `72hours`: `npm run build` passed.
- `72hours`: `npm run capital:smoke:staging` passed against staging API/indexer/admin.
  - API reported `dbMode=postgres`, `networkMode=testnet`, 3 apps, admin auth configured.
  - Staging reserve intent stayed disabled with 0 wallet messages and `productionReady=false`.
  - Indexer reported disabled/dry-run with poll guard active.
  - Admin Pages returned HTTP 200 with built assets.
- `72hours`: `npm run capital:gate:production` failed as expected because production gate inputs are missing.
- `72h-capital-api`: `npm run check` passed.
- `72h-capital-admin`: `npm run build` passed.
- `72h-capital-contracts`: `npm run lint` passed, including Tact check and 41 tests.
- `72h-capital-indexer`: `npm run check && npm run test:poller` passed, including 4 poller/projection tests.

## Files changed by this audit

- Added this report only: `docs/spec/capital-readiness-gap-report-2026-04-24.md`.
