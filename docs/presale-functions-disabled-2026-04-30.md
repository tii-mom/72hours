# Presale Functions Disabled - 2026-04-30

Status: production safety guard / fail-closed.

## Reason

Mainnet `PresaleVault` must not be activated or routed to users. The Telegram presale write/admin Functions were incomplete and blocked normal Cloudflare Pages Functions bundling because they imported storage methods that were not implemented yet.

The safe unblock route is to disable write/admin routes instead of implementing live storage and accidentally exposing a fund-flow-adjacent path.

## Disabled Routes

The following purchase routes intentionally return HTTP 503 with:

```json
{"ok":false,"error":"presale_route_disabled"}
```

- `functions/api/telegram/presale-intents.js`
- `functions/api/telegram/presale-receipts.js`

## Still Allowed

Read-only/status, signal-only, and off-chain reservation routes may continue only if they remain non-transactional and fail closed:

- `GET /api/telegram/presale-status`
- `POST /api/telegram/presale-events`
- `GET/POST /api/telegram/presale-reservations` for authenticated off-chain waitlist records only
- `GET /api/telegram/sales-admin` for secret-protected read-only reservation listing only

Admin writes remain disabled:

```json
{"ok":false,"error":"presale_admin_writes_disabled"}
```

- `POST /api/telegram/sales-admin`

## Required Gate Before Re-enabling

Do not re-enable intents, receipts, admin writes, purchase payloads, or sale storage until all are true:

1. 博士 explicitly approves Presale route work.
2. Contract route is selected and audited.
3. `sales-storage.js` is implemented with idempotency and audit indexes.
4. Admin auth and Telegram initData checks are reviewed.
5. Environment checklist confirms `H72H_PRESALE_ENABLED` is intentionally true.
6. Functions build, website build, lint, and route smoke tests pass.

## Verification

Passed after disabling routes:

```bash
npx wrangler pages functions build functions --outfile /tmp/72hours-functions-worker.mjs
npm run lint
npm run build
```
