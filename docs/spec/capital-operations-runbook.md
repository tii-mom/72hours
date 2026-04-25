# 72H Capital Operations Runbook

Last updated: 2026-04-24

This runbook covers the Capital-specific launch and operations path. It does not cover non-Capital website pages or full-site visual work.

## Current Staging Topology

- Website source default: `VITE_CAPITAL_DATA_MODE=preview`.
- Website staging/live API mode requires:
  - `VITE_CAPITAL_DATA_MODE=api`
  - `VITE_CAPITAL_API_BASE_URL=https://72h-capital-api-staging.348421501.workers.dev`
- API Worker:
  - `72h-capital-api-staging`
  - URL: `https://72h-capital-api-staging.348421501.workers.dev`
  - DB mode: Neon Postgres via `DATABASE_URL`
  - Testnet messages: disabled by default with `H72H_ENABLE_TESTNET_TACT_MESSAGES=false`
- Indexer Worker:
  - `72h-capital-indexer-staging`
  - URL: `https://72h-capital-indexer-staging.348421501.workers.dev`
  - Worker-safe dry-run only
  - `H72H_INDEXER_ADMIN_TOKEN` configured as a Worker secret
  - `POST /v1/indexer/poll-once` returns disabled before auth while polling is off
  - Persistent projection still runs through the Node indexer path
- Admin Pages:
  - Project: `72h-capital-admin-staging`
  - URL: `https://72h-capital-admin-staging.pages.dev`
  - Latest staging deployment: `https://8eb2c380.72h-capital-admin-staging.pages.dev`
  - Build and direct Pages asset upload pass.

## Staging Launch Order

Run the automated smoke first:

```bash
npm run capital:smoke:staging
```

Then verify the external surfaces manually when handing staging to another owner.

1. Verify API Worker health:

```bash
curl -sS https://72h-capital-api-staging.348421501.workers.dev/health
```

Required:

- `ok=true`
- `configured=true`
- `dbMode=postgres`
- `adminAuthConfigured=true`
- `counts.apps=3`

2. Verify public Capital reads:

```bash
curl -sS https://72h-capital-api-staging.348421501.workers.dev/v1/capital/apps
curl -sS https://72h-capital-api-staging.348421501.workers.dev/v1/capital/apps/72hours
curl -sS https://72h-capital-api-staging.348421501.workers.dev/v1/capital/me
```

3. Verify disabled intent safety:

```bash
curl -sS -X POST \
  "https://72h-capital-api-staging.348421501.workers.dev/v1/capital/reserve/allocate-intent?locale=en-US" \
  -H "content-type: application/json" \
  --data '{"appSlug":"72hours","seatType":"reserve","seatNumber":18,"walletAddress":"EQCTestWallet","amount":"720"}'
```

Required:

- `uiState.disabled=true`
- `transactionRequest.messages=[]`
- `transactionRequest.scaffold.productionReady=false`

4. Verify Admin API session and dashboard with local bootstrap credentials. Do not print the password or token.

5. Verify Indexer Worker guard:

```bash
curl -sS https://72h-capital-indexer-staging.348421501.workers.dev/health
curl -sS https://72h-capital-indexer-staging.348421501.workers.dev/v1/indexer/status
curl -sS -X POST https://72h-capital-indexer-staging.348421501.workers.dev/v1/indexer/poll-once
```

Required while disabled:

- `POST /v1/indexer/poll-once` returns `403`
- response `status=disabled`
- no toncenter polling is executed

6. Deploy Admin Pages after setting a local Cloudflare token:

```bash
cd /Users/yudeyou/Desktop/72h-capital-admin
CLOUDFLARE_API_TOKEN=<token> npm run cf:deploy:staging
```

The token must have permission to deploy the `72h-capital-admin-staging` Pages project.

Current staging deployment is already published. Re-run this step only when Admin source changes.

## Production Gate

Run the production gate before any deployment enables mainnet wallet signing:

```bash
npm run capital:gate:production
```

The release owner must also confirm:

- Website production uses `VITE_CAPITAL_DATA_MODE=api` only after the production API is healthy and monitored.
- Website production `VITE_CAPITAL_API_BASE_URL` points to the production API, never staging.
- Production API keeps `H72H_ENABLE_MAINNET_TACT_MESSAGES=false` until audited contracts, production database writes, indexer projection, reward pool funding, Telegram alerting, and one internal mainnet rehearsal are complete.
- Production Indexer starts with polling disabled or dry-run mode, then moves to Postgres writes only after watched addresses and lag alarms are verified.
- Telegram production alert delivery is verified in the owner-approved alert chat.
- ReserveVault mainnet getters prove principal custody and same-contract mature-lot redemption for every app.
- AppRewardPool mainnet funding policy and operator roles are approved.
- Alpha remains closed until Reserve has run stably through the agreed monitoring window.

No-go means keep the website in preview mode or deploy API mode with wallet signing disabled.

## Testnet Wallet-Send Enablement

Do not enable wallet-send intents until all checks pass:

- ReserveVault testnet verification passes.
- TestJetton master and ReserveVault addresses match API Worker vars.
- Indexer dry-run sees expected watched addresses.
- Admin dashboard and audit log are usable.
- User-facing copy does not mention mock, scaffold, or development state.

Only then update API Worker:

- `H72H_ENABLE_TESTNET_TACT_MESSAGES=true`

After enabling:

- create one Reserve allocation intent on staging
- confirm it returns a non-empty TonConnect transaction request
- send with a test wallet only
- verify txHash/explorer link
- verify indexer projection updates
- verify API verification page shows the same seat data

## Production Preconditions

Production must not be opened until all items are complete:

- Rotate all secrets that appeared in chat or local logs.
- Use a production Postgres database or production Neon branch.
- Configure production Cloudflare Workers/Pages projects separately from staging.
- Configure Telegram alerting for the production owner channel.
- Deploy audited TON mainnet contracts.
- Configure the single-admin wallet, signature threshold, and emergency pause authority.
- Verify ReserveVault principal custody and same-contract redemption getters.
- Keep Alpha closed until Reserve principal-custody flow is stable.
- Complete legal/risk wording review.
- Enable monitoring and alerting.
- Prepare rollback steps and emergency pause copy.

## Mainnet Launch Order

1. Deploy production API in read-only mode.
2. Deploy production Indexer in read-only / dry-run mode.
3. Deploy production Admin with login and read-only dashboard.
4. Deploy Website with Capital routes in API mode.
5. Open Reserve principal-custody test allocation for internal wallets only.
6. Open Reserve public principal-custody allocation.
7. Observe at least one full Reserve principal-custody operational cycle.
8. Open Alpha only after Reserve principal-custody operations are stable.

## Daily Operating Checks

Run these checks every operating day and during the first 30 minutes after each release:

- API: `/health` returns configured production metadata, expected app count, DB mode, and admin auth state.
- Public reads: `/v1/capital/apps`, one app detail route, one identity route, and `/v1/capital/me` return without leaking full wallet addresses, private amounts, or reward amounts on public pages.
- Intent lifecycle: count `pending`, `submitted`, `confirmed`, `failed`, and `stale` intents; investigate abnormal growth in `pending` or `stale`.
- Indexer: health/status, latest poll time, watched address count, latest indexed chain event, and chain-to-DB lag.
- Reserve: occupied seats by app, mature lots by app, redeemable lots, oldest unresolved support case, and same-contract redemption availability.
- RewardPool: balance by pool, last funding event, funding audit row, and reward claim availability. Funding is additive and must never draw from Reserve principal.
- Alpha: allocation closed/open flag, active/completed counts, lifecycle milestones, and public copy consistency.
- Admin: failed login count, active sessions, sensitive action audit rows, and idempotency conflicts.
- Pause state: public app status, contract pause status where available, and Admin/API pause state agree.

Record the date, operator, environment, and any action taken in the internal ops log.

## RewardPool Funding

RewardPool funding is an operational funding event, not a reward distribution run.

Pre-check:

- Confirm the target pool id, app, network, current balance, and funding amount.
- Confirm source wallet/account approval outside the public website.
- Confirm the funding does not use ReserveVault principal.
- Confirm the operator has `treasury` or `admin` role.
- Prepare an `auditReason`, exact confirmation text equal to the pool id, and a fresh `idempotencyKey`.

Admin API action:

```bash
curl -sS -X POST "$CAPITAL_API_BASE_URL/v1/admin/capital/reward-pools/$POOL_ID/funding-events" \
  -H "content-type: application/json" \
  -H "authorization: Bearer $CAPITAL_ADMIN_SESSION" \
  --data '{
    "amount": "7200",
    "currency": "72H",
    "source": "ops-funding",
    "auditReason": "Fund AppRewardPool for approved launch window",
    "confirmationText": "'"$POOL_ID"'",
    "idempotencyKey": "'"$IDEMPOTENCY_KEY"'",
    "clientIssuedAt": "'"$(date -u +%Y-%m-%dT%H:%M:%SZ)"'"
  }'
```

Post-check:

- `reward_pools` balance is updated.
- A `reward_funding_events` row exists.
- An `admin_audit_logs` row exists with the same idempotency key.
- Public copy still says rewards may be 0 and never come from Reserve principal.
- If a duplicate request returns `409`, do not retry with a new idempotency key until the original audit result is understood.

## Pause And Resume

Use pause when wallet signing, contract state, indexing, reward funding, or user-facing copy may be unsafe.

Pause order:

1. Pause the affected app through Admin/API.
2. Disable wallet-signing flags if the issue affects transaction creation.
3. Keep public read and verification pages online where safe.
4. Publish a status notice.
5. Preserve logs, tx hashes, audit rows, and DB snapshots.

Admin API pause:

```bash
curl -sS -X POST "$CAPITAL_API_BASE_URL/v1/admin/capital/apps/$APP_SLUG/pause" \
  -H "content-type: application/json" \
  -H "authorization: Bearer $CAPITAL_ADMIN_SESSION" \
  --data '{
    "auditReason": "Pause Capital app while incident is triaged",
    "confirmationText": "'"$APP_SLUG"'",
    "idempotencyKey": "'"$IDEMPOTENCY_KEY"'",
    "clientIssuedAt": "'"$(date -u +%Y-%m-%dT%H:%M:%SZ)"'"
  }'
```

Resume order:

1. Root cause is known or the unsafe condition is removed.
2. API, Indexer, Admin, and contract pause states agree.
3. One internal intent/read verification passes.
4. Incident owner approves resume.
5. Resume the app and publish a resolved status update.

Admin API resume:

```bash
curl -sS -X POST "$CAPITAL_API_BASE_URL/v1/admin/capital/apps/$APP_SLUG/resume" \
  -H "content-type: application/json" \
  -H "authorization: Bearer $CAPITAL_ADMIN_SESSION" \
  --data '{
    "auditReason": "Resume Capital app after incident clearance",
    "confirmationText": "'"$APP_SLUG"'",
    "idempotencyKey": "'"$IDEMPOTENCY_KEY"'",
    "clientIssuedAt": "'"$(date -u +%Y-%m-%dT%H:%M:%SZ)"'"
  }'
```

## Reserve Mature-Lot Principal Redeem Support

Reserve support is user assistance for same-contract mature-lot redemption. Operators do not process a queue and do not custody user keys.

Collect from the user:

- App slug.
- Seat type and seat number.
- Wallet short address or public address in a private support channel.
- Intent id if available.
- Transaction hash or explorer link.
- Screenshot of the wallet error only if it does not expose seed phrases or private keys.

Triage:

- Confirm the seat exists and belongs to the reported wallet in the private admin/support view.
- Confirm the lot maturity timestamp has passed.
- Confirm the lot is marked redeemable and has not already been redeemed.
- Confirm the redeem intent targets the same ReserveVault that received the principal.
- Confirm any wallet error is gas, network, wallet bridge, paused-contract, or already-redeemed state.

Response rules:

- Never ask for seed phrases, private keys, remote-control access, or signed blank transactions.
- Do not disclose private allocation amounts or reward data in public channels.
- If same-contract getter data conflicts with API/Indexer state, pause new redeem signing for the affected app and open an incident.
- If a transaction is confirmed on-chain but not visible in the product, escalate as Indexer lag or projection mismatch.

## Alpha Lifecycle

Alpha remains closed for production launch until Reserve is stable.

Lifecycle states:

- `closed`: no public allocation signing; copy may explain Alpha is not open.
- `open`: audited AlphaVault, approved copy, monitoring, and Admin status are live.
- `active`: allocation exists and the 72-week mandate is in progress.
- `completed`: lifecycle completion is indexed and the public credential can show `Completed Alpha Mandate`.

Operational checks before opening Alpha:

- AlphaVault address and getters are verified for every app.
- Public copy states Alpha principal is non-redeemable and may result in partial or total loss.
- RewardPool policy states Alpha rewards may be 0 and are not paid from Reserve principal.
- Indexer can project allocation, add, settlement, claim, and completion events.
- Admin can pause/resume Alpha app participation without affecting Reserve verification pages.

Do not publish Alpha copy that suggests principal redemption, guaranteed rewards, or any guaranteed return.

## Emergency Stop

If any issue affects wallet signing, settlement, indexing, or Admin actions:

1. Set `H72H_ENABLE_TESTNET_TACT_MESSAGES=false` or production equivalent.
2. Disable public CTA through API/admin configuration.
3. Keep verification pages online for already-created seats.
4. Pause Admin sensitive operations unless required for incident response.
5. Publish a short status notice through the website Capital area.
6. Preserve logs, tx hashes, audit rows, and database snapshots.

## Incident Response

Severity:

- `SEV1`: signing or contract issue can create loss, wrong recipient, duplicated seat, wrong vault, or unauthorized admin action.
- `SEV2`: confirmed chain event is not projected, users cannot redeem mature Reserve lots, or RewardPool funding/audit state is inconsistent.
- `SEV3`: degraded reads, delayed status, UI copy mismatch, or non-critical Admin dashboard issue.

First 15 minutes:

- Assign one incident owner.
- Freeze risky actions: pause affected app and disable signing flags if needed.
- Capture current deployment ids, env flags, relevant tx hashes, intent ids, audit ids, and DB snapshot time.
- Post public status copy if users are affected.

Stabilization:

- Prefer read-only mode over full outage when verification pages are accurate.
- Keep support responses narrow: acknowledge impact, state what is paused, and avoid promises about rewards or timing.
- Rotate secrets immediately if there is any chance of exposure.
- Reopen only after a replayed smoke/gate path and incident-owner approval.

## Rollback To Preview Mode

Use preview mode when the website/API integration is unsafe but the public website should remain available.

Rollback steps:

1. Deploy website with `VITE_CAPITAL_DATA_MODE=preview`.
2. Remove or ignore production `VITE_CAPITAL_API_BASE_URL` for the website deployment.
3. Keep API and Admin online for operators if they are not the source of the incident.
4. Disable wallet-signing flags on the API.
5. Keep Capital verification pages online only if they do not depend on unsafe live reads.
6. Confirm `/capital`, `/capital/me`, and app pages render preview data and do not create sendable TonConnect messages.
7. Publish status copy explaining that live Capital actions are temporarily paused.

Exit rollback only after staging smoke, production gate, and one production read/signing rehearsal pass.

## Secret Rotation

Rotate before any production launch:

- `DATABASE_URL`
- `H72H_TELEGRAM_BOT_TOKEN`
- `H72H_TELEGRAM_ALERT_CHAT_ID`
- TON RPC API key
- Cloudflare deployment token
- any mnemonic-derived deployment credentials

Never commit `.env.local`, bootstrap JSON passwords, mnemonics, or token values.

Rotation procedure:

1. Generate the replacement secret locally or in the provider console.
2. Set it on the target Cloudflare Worker/Page project only.
3. Deploy or restart the affected runtime.
4. Verify health and one authenticated operation where appropriate.
5. Revoke the old secret.
6. Add an audit note with the secret name, environment, operator, and timestamp, but never the value.

Rotate immediately after exposure in chat, shell history, logs, screenshots, support tickets, or shared docs.

## Public Status Copy

Use short, factual copy. Do not mention internal credentials, exploit hypotheses, private amounts, or unverified causes.

Investigating:

> Capital actions for [app] are temporarily paused while we investigate a transaction/status issue. Existing public verification pages remain available where accurate. Do not retry transactions until the status is updated.

Paused for safety:

> Capital actions for [app] are paused as a safety measure. Reserve principal remains governed by the relevant ReserveVault contract. We will update this notice when signing is available again.

Indexer delay:

> Some Capital transactions may take longer to appear in the product. If your wallet shows a confirmed transaction, keep the transaction hash and wait for the next status update.

Reserve mature-lot redeem support:

> Reserve mature-lot redemption remains a same-contract wallet action from the original ReserveVault. If your lot is mature and the wallet action fails, contact support privately with the app, seat number, wallet address, and transaction hash.

Resolved:

> Capital actions for [app] have resumed after verification. Users may continue from the product interface. Existing transactions can be checked from their wallet or explorer link.

## Daily Staging Checks

- API `/health`
- Indexer `/health`
- Admin login
- Admin dashboard
- Recent intents
- Disabled wallet-send guard
- Indexer poll guard
- Website Capital API-mode build
