# 72H Capital Production Launch Plan

Last updated: 2026-04-26

Status: production engineering guardrails prepared; production launch remains blocked until owner-supplied external gates are complete.

## Engineering Defaults

- Environment split: independent Cloudflare projects `72h-capital-api-production` and `72h-capital-indexer-production`; a production Admin UI is optional and not required for the public website launch.
- Database: separate production Postgres database; do not reuse staging credentials or staging branches.
- Region: Singapore by default, matching the current database region.
- Monitoring: Telegram bot alerting to the owner-approved production alert chat.
- Governance policy: single administrator wallet with 1 required signature.
- Admin wallet: `UQCxJ05yeawVWlsN5SfJ-obajgh2lFffR-O7ebH_s_wqQfRq`.
- Emergency pause: controlled by the administrator wallet.
- Reserve principal custody: user principal stays in each app ReserveVault and is redeemed from that same contract after maturity.
- Opening order: Reserve principal-custody flow first, Alpha later.
- Mainnet 72H Jetton Master Address: `EQBGIzEDvvKObStrcVb6i5Z1-8uYZYtUrYzF2rFZU7xUAXVg`.
- Jetton verification: TON Center `getTokenData` reports `contract_type=jetton_master`, `decimals=9`, `mintable=false`, and total supply `100,000,000,000 72H`.
- Current generated contract package: `/Users/yudeyou/Desktop/72hours/docs/spec/capital-production-artifacts/mainnet-contract-deployment-package-2026-04-26.md`.

## Production Secrets

Set these only as Cloudflare Worker/Page secrets or deployment environment variables.

- API: `DATABASE_URL`, `H72H_MAINNET_RPC_API_KEY`, `H72H_TELEGRAM_BOT_TOKEN`, `H72H_TELEGRAM_ALERT_CHAT_ID`.
- Indexer: `DATABASE_URL`, `H72H_TON_RPC_API_KEY`, `H72H_TELEGRAM_BOT_TOKEN`, `H72H_TELEGRAM_ALERT_CHAT_ID`.
- Website Pages: `VITE_CAPITAL_DATA_MODE`, `VITE_CAPITAL_API_BASE_URL`, `VITE_TONCONNECT_MANIFEST_URL`.

## Required Owner Inputs

These cannot be completed by code:

- Production database URL and owner.
- ReserveVault mainnet addresses and redemption getter verification.
- AppRewardPool mainnet addresses and reward funding policy.
- AlphaVault mainnet addresses.
- External smart contract audit report.
- Legal/risk copy approval.
- Testnet rehearsal artifact bundle with tx hashes, getter snapshots, and operator notes.
- Decision to run invite-only Reserve gray launch or public Reserve launch.
- Monitoring owner, rollback approval owner, and public status owner for the launch window.

## Production Gate Inputs

Run the executable gate from the website repo before frontend production launch and again before enabling mainnet signing:

```bash
npm run capital:gate:production -- --skip-network
npm run capital:gate:production
```

`--skip-network` validates local inputs without calling production services. The full command also checks API and Indexer `/health` responses report production readiness.

Required production gate variables:

- Frontend/API launch mode: `CAPITAL_MAINNET_SIGNING_ENABLED=false`. This is the default while mainnet user signing remains closed.
- URLs: `CAPITAL_PRODUCTION_API_BASE_URL`, `CAPITAL_PRODUCTION_INDEXER_BASE_URL`, `CAPITAL_TONCONNECT_MANIFEST_URL`, `CAPITAL_MAINNET_RPC_URL`.
- Explorer: `CAPITAL_MAINNET_EXPLORER_TX_URL_PATTERN` with a `{tx}` placeholder.
- TonConnect bridge/frame origins: `CAPITAL_TONCONNECT_BRIDGE_ORIGINS`.
- CSP source lists: `CAPITAL_CSP_CONNECT_SRC`, `CAPITAL_CSP_FRAME_SRC`, `CAPITAL_CSP_IMG_SRC`, `CAPITAL_CSP_MANIFEST_SRC`.
- Public mainnet token: `TON_MAINNET_72H_JETTON_MASTER_ADDRESS`.
- Alerts/owners: `H72H_TELEGRAM_BOT_TOKEN`, `H72H_TELEGRAM_ALERT_CHAT_ID`, `CAPITAL_MONITORING_OWNER`, `CAPITAL_ROLLBACK_APPROVAL_OWNER`.

Additional variables required before enabling mainnet signing with `CAPITAL_MAINNET_SIGNING_ENABLED=true`:

- Contracts: `TON_MAINNET_ADMIN_ADDRESS`, and per-app `TON_MAINNET_RESERVE_VAULT_ADDRESS_*`, `TON_MAINNET_APP_REWARD_POOL_ADDRESS_*`, `TON_MAINNET_ALPHA_VAULT_ADDRESS_*`.
- Artifacts: `CAPITAL_AUDIT_REPORT_PATH`, `CAPITAL_LEGAL_APPROVAL_PATH`, `CAPITAL_TESTNET_REHEARSAL_ARTIFACT_PATH`, `CAPITAL_RESERVE_VAULT_REDEMPTION_VERIFICATION_PATH`, `CAPITAL_APP_REWARD_POOL_POLICY_PATH`.
- Database: `H72H_CAPITAL_DB_MODE=postgres`, `DATABASE_URL`.

The frontend gate intentionally keeps mainnet user signing closed by default. It verifies production API, Indexer, alerting, owner, CSP, manifest, RPC, explorer, and public mainnet token inputs for website launch. The stricter signing gate additionally verifies address, artifact, and database inputs for the v1 simplified model. Neither mode requires Reserve initial liquidity.

Operational gate checks that must be confirmed alongside the executable gate:

- API health reads production database state and not staging.
- Indexer watched addresses are verified and polling starts disabled or dry-run before production writes.
- Telegram production alert delivery is verified before any wallet signing is enabled.
- RewardPool funding and app pause/resume audit paths use production-only secrets.
- RewardPool funding source is approved and separate from ReserveVault principal.
- Reserve mature-lot principal redeem getters are verified against the same ReserveVault per app.
- Rollback deployment with `VITE_CAPITAL_DATA_MODE=preview` is ready.
- Public status copy is approved for pause, indexer delay, Reserve mature-lot redeem support, and resolution.

## Go-Live Sequence

1. Create production database.
2. Run API migrations and seed against production database.
3. Set API production secrets.
4. Deploy `72h-capital-api-production`.
5. Set Indexer production secrets, but keep polling disabled.
6. Deploy `72h-capital-indexer-production`.
7. Deploy website with `VITE_CAPITAL_DATA_MODE=api`.
8. Generate the mainnet TonConnect contract package from `/Users/yudeyou/Desktop/72h-capital-contracts` and compare it with the signed audit target:
   `npm run plan:mainnet:tonconnect`.
9. Deploy audited mainnet contracts from the expected admin wallet.
10. Attach deployment transaction hashes for AdminAuthority, Registry, all ReserveVaults, all AppRewardPools, and all AlphaVaults.
11. Call the official 72H Jetton master getter for every ReserveVault and AppRewardPool address.
12. Set each Vault/Pool official Jetton wallet where required, then attach setter transaction hashes and getter snapshots.
13. Verify Registry app registration and app-scoped ReserveVault bindings.
14. Verify ReserveVault principal-custody and same-contract redemption getters.
15. Keep Reward claim closed until all AppRewardPools have address, official wallet, funding policy, funding proof, claim payout rehearsal, and Indexer/API projection evidence.
16. Enable Indexer polling in dry-run first from the selected block/lt.
17. Enable Indexer Postgres writes after duplicate-event and rollback behavior is verified.
18. Enable Reserve intent signing only after one internal mainnet rehearsal and owner approval.
19. Open Reserve gray launch.
20. Monitor 7-14 days.
21. Expand Reserve.
22. Open Reward claim only after the RewardPool-specific gate passes.
23. Open Alpha only after Reserve and Reward operations are stable and separately approved.

## Rollback Policy

Rollback target is preview mode, not a partially connected production wallet flow.

- Website rollback: redeploy with `VITE_CAPITAL_DATA_MODE=preview`.
- API rollback: disable mainnet signing flags and keep safe reads available.
- Indexer rollback: disable polling or write mode while preserving last known DB state.
- Admin rollback: keep read-only access where safe; disable sensitive writes if auth or audit state is suspect.
- Contract issue: pause the affected app/contract before asking users to retry any wallet action.

Exit rollback only after staging smoke, production gate, and one internal production rehearsal pass.

## CSP Domains To Approve

Do not modify the global CSP until these domains are final:

- Production API Worker host.
- Production Admin host if browser-visible.
- TonConnect manifest host.
- Tonkeeper wallet bridge/frame hosts.
- MyTonWallet bridge/frame host.
- Telegram wallet bridge/frame hosts.
- TON RPC provider host.
- TON explorer host.

Current `_headers` allows broad `https:` in `connect-src`, but production hardening should narrow this after final hostnames are confirmed.

## Legal Copy Baseline

- Reserve uses `Principal-custodied Reserve Seat`; principal is custodied by ReserveVault and redeemable from the same contract after 72 days.
- Reserve copy must state 72-day lot lock, user-paid gas, same-contract ReserveVault redemption after maturity, and AppRewardPool rewards that may be 0 and never come from principal.
- Alpha uses `High-conviction Alpha Seat`; copy must state 72-week duration, principal non-redeemable, higher reward weight, rewards may be 0, and partial or total principal loss possible.

## No-Go Conditions

- Missing audit report.
- Missing mainnet admin address or configured official Jetton master address.
- Missing ReserveVault mainnet address or same-contract redemption verification.
- `H72H_ENABLE_MAINNET_TACT_MESSAGES=true` before internal rehearsal.
- Indexer not writing chain events to production database.
- Admin session without MFA code.
- Website points to staging API.
- Legal/risk copy not approved.
