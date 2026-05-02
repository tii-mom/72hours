# 72H Capital v1 Testnet Full Rehearsal Runbook

Last updated: 2026-04-25

Status: runbook only. This document does not approve production launch and must not be treated as evidence by itself.

Safety rule: do not send real transactions from this runbook. Commands below are either read-only, dry-run, or placeholders that must be copied into a controlled operator console only after the release owner replaces all `<...>` values and explicitly approves the send.

## Scope

This rehearsal proves the full v1 path on TON testnet before mainnet signing is enabled:

- Wallet, test TON, and test 72H readiness.
- Reserve allocation into the app `ReserveVault`.
- Reserve 72-day maturity and redemption simulation.
- AppRewardPool funding injection and reward claim rehearsal.
- Alpha allocation lifecycle rehearsal.
- Indexer, API, Admin, and website verification.
- Failure rollback and evidence archive.

Primary target repos:

- Website: `/Users/yudeyou/Desktop/72hours`
- Contracts: `/Users/yudeyou/Desktop/72h-capital-contracts`
- API: `/Users/yudeyou/Desktop/72h-capital-api`
- Indexer: `/Users/yudeyou/Desktop/72h-capital-indexer`
- Admin: `/Users/yudeyou/Desktop/72h-capital-admin`

## Non-Negotiable Guardrails

- Use testnet only.
- Keep `H72H_ENABLE_MAINNET_TACT_MESSAGES=false`.
- Keep production deploys and production databases out of scope.
- Never reuse a real user wallet, production admin wallet, or mainnet mnemonic.
- Do not paste mnemonic, API keys, session tokens, or database URLs into this artifact.
- Use `--send` only in the controlled operator step, never during documentation review.
- Every send step must have a tx hash, operator, timestamp, wallet address, before/after getter snapshot, and rollback decision recorded.
- Reward funding must come from an approved reward funding source, not Reserve principal.
- Reserve principal must remain in the same app `ReserveVault` and mature-lot redemption must be simulated or verified against that same contract.

## Rehearsal Variables

Create an operator-local `.env.rehearsal.local` or shell session. Do not commit it.

```bash
export REHEARSAL_ID="testnet-full-<YYYYMMDD-HHMM>"
export CAPITAL_APP_SLUG="72hours"
export CAPITAL_SEAT_TYPE="reserve"
export CAPITAL_RESERVE_AMOUNT_72H="720"
export CAPITAL_ALPHA_AMOUNT_72H="72000"
export CAPITAL_REWARD_AMOUNT_72H="720"

export CAPITAL_API_BASE_URL="<staging-or-local-api-url>"
export CAPITAL_INDEXER_BASE_URL="<staging-or-local-indexer-url>"
export CAPITAL_ADMIN_BASE_URL="<staging-or-local-admin-url>"
export CAPITAL_WEBSITE_BASE_URL="<staging-or-local-website-url>"

export TESTNET_OPERATOR_WALLET="<testnet-wallet-address>"
export TESTNET_EXPLORER_TX_URL="https://testnet.tonviewer.com/transaction/<tx-hash>"
export EVIDENCE_DIR="/Users/yudeyou/Desktop/72hours/docs/spec/capital-production-artifacts/evidence/${REHEARSAL_ID}"
```

Create the evidence directory:

```bash
mkdir -p "$EVIDENCE_DIR"/{contracts,api,indexer,admin,website,screenshots,rollback}
```

## Preparation Checklist

1. Confirm repo status and do not revert unrelated local changes.

```bash
cd /Users/yudeyou/Desktop/72hours
git status --short

cd /Users/yudeyou/Desktop/72h-capital-contracts
git status --short

cd /Users/yudeyou/Desktop/72h-capital-api
git status --short

cd /Users/yudeyou/Desktop/72h-capital-indexer
git status --short

cd /Users/yudeyou/Desktop/72h-capital-admin
git status --short
```

2. Install and build without deployment.

```bash
cd /Users/yudeyou/Desktop/72h-capital-contracts
npm install
npm run tact:build
npm run plan:testnet
npm run plan:testnet:addresses

cd /Users/yudeyou/Desktop/72h-capital-api
npm install
npm run check

cd /Users/yudeyou/Desktop/72h-capital-indexer
npm install
npm run check
npm run test:poller

cd /Users/yudeyou/Desktop/72h-capital-admin
npm install
npm run build

cd /Users/yudeyou/Desktop/72hours
npm install
npm run lint
npm run build
```

3. Verify current testnet deployment manifest.

```bash
cd /Users/yudeyou/Desktop/72h-capital-contracts
npm run verify:testnet | tee "$EVIDENCE_DIR/contracts/verify-testnet.txt"
cp deployments/testnet.latest.json "$EVIDENCE_DIR/contracts/testnet.latest.json"
```

Required evidence:

- `TestJetton72H`, `CapitalRegistry`, `AdminMultisig`, `Treasury`.
- `ReserveVaults` and `ReserveVaultJettonWallets` for `72hours`, `wan`, and `multi-millionaire`.
- `AlphaVaults` and `AlphaVaultJettonWallets`, or a clear note that planned Alpha addresses are not active.
- Getter snapshots for owner, registry/treasury, Jetton master, app id, seat cap, next seat, next lot, and total principal.

## Wallet And Test Coins

Use one testnet-only operator wallet and one optional observer wallet.

Checklist:

- Wallet network is TON testnet.
- Wallet address matches `TESTNET_OPERATOR_WALLET`.
- Wallet has enough test TON for deploy/rehearsal gas.
- Test 72H is testnet-only and minted by the test runner or faucet process.
- Wallet balance screenshots are saved without exposing seed phrase or private key.

Read-only balance capture:

```bash
curl -sS "<toncenter-testnet-getAddressBalance-url-for-${TESTNET_OPERATOR_WALLET}>" \
  | tee "$EVIDENCE_DIR/contracts/operator-ton-balance.before.json"
```

Reserve dry-run that prints the planned mint/transfer payload and sends nothing:

```bash
cd /Users/yudeyou/Desktop/72h-capital-contracts
TON_TESTNET_REHEARSAL_APP="$CAPITAL_APP_SLUG" \
TON_TESTNET_REHEARSAL_AMOUNT_72H="$CAPITAL_RESERVE_AMOUNT_72H" \
TON_TESTNET_REHEARSAL_WALLET_ADDRESS="$TESTNET_OPERATOR_WALLET" \
npm run rehearse:testnet:reserve \
  | tee "$EVIDENCE_DIR/contracts/reserve-dry-run.before-send.txt"
```

Operator-only placeholder for funding the test wallet. Do not execute from this runbook:

```bash
# PLACEHOLDER ONLY - requires release owner approval.
# Send test TON from faucet to $TESTNET_OPERATOR_WALLET.
# Mint test 72H to $TESTNET_OPERATOR_WALLET if the controlled rehearsal step requires it.
# Record faucet tx hash: <test-ton-tx-hash>
# Record test 72H mint tx hash: <test-72h-mint-tx-hash>
```

## Reserve Allocation

Objective: allocate one Reserve lot for `CAPITAL_APP_SLUG`, prove it increments the vault lot ledger, seat mapping, total principal, and ReserveVault Jetton wallet balance.

Pre-send read-only snapshot:

```bash
cd /Users/yudeyou/Desktop/72h-capital-contracts
npm run verify:testnet | tee "$EVIDENCE_DIR/contracts/reserve-verify.before.txt"
```

Controlled send placeholder. Do not execute during documentation review:

```bash
# PLACEHOLDER ONLY - controlled operator console.
# Preconditions:
# - release owner approved send
# - $TESTNET_OPERATOR_WALLET is testnet-only
# - TON_TESTNET_ALLOW_REHEARSAL_SEND=true is intentionally set for this one command
# - app, amount, and wallet match the dry-run evidence
#
# cd /Users/yudeyou/Desktop/72h-capital-contracts
# TON_TESTNET_ALLOW_REHEARSAL_SEND=true \
# TON_TESTNET_REHEARSAL_APP="$CAPITAL_APP_SLUG" \
# TON_TESTNET_REHEARSAL_AMOUNT_72H="$CAPITAL_RESERVE_AMOUNT_72H" \
# TON_TESTNET_REHEARSAL_WALLET_ADDRESS="$TESTNET_OPERATOR_WALLET" \
# npm run rehearse:testnet:reserve:send \
#   | tee "$EVIDENCE_DIR/contracts/reserve-send.txt"
```

Post-send verification:

```bash
cd /Users/yudeyou/Desktop/72h-capital-contracts
npm run verify:testnet | tee "$EVIDENCE_DIR/contracts/reserve-verify.after.txt"
```

Required evidence:

- Reserve tx hash and explorer URL.
- `ReserveVault($CAPITAL_APP_SLUG)` state is active.
- New or updated owner seat from `getGetSeatByOwner`.
- New lot id from `getGetNextLotId - 1`.
- Lot owner, lot seat, lot amount, principal by seat.
- `getGetTotalPrincipal72H` increased by `CAPITAL_RESERVE_AMOUNT_72H`.
- ReserveVault Jetton wallet balance increased by the allocation amount.
- Registry seat agrees with ReserveVault seat.

## Reserve Maturity And Redemption Simulation

Objective: rehearse the maturity and same-contract redeem boundary without bypassing the 72-day rule on a production-like contract.

Preferred path: use getter evidence plus a dry-run redemption payload if the contract exposes mature test lots. If time control is unavailable on the deployed testnet contract, record a simulation note and attach local/unit evidence instead of forcing chain state.

Read-only maturity getter placeholders:

```bash
cd /Users/yudeyou/Desktop/72h-capital-contracts

# PLACEHOLDER ONLY - replace with concrete getter script once available.
# Query ReserveVault($CAPITAL_APP_SLUG):
# - lot owner
# - lot seat
# - lot amount
# - lot locked_at or unlock/maturity timestamp
# - redeemed amount
# - redeemable amount
# Save output to:
# "$EVIDENCE_DIR/contracts/reserve-lot-maturity.getters.json"
```

Redemption intent payload dry-run through API:

```bash
curl -sS -X POST "$CAPITAL_API_BASE_URL/v1/capital/reserve/redeem-intent?locale=en-US" \
  -H "content-type: application/json" \
  --data '{
    "appSlug": "'"$CAPITAL_APP_SLUG"'",
    "seatType": "reserve",
    "seatNumber": <reserve-seat-number>,
    "walletAddress": "'"$TESTNET_OPERATOR_WALLET"'",
    "amount": "'"$CAPITAL_RESERVE_AMOUNT_72H"'",
    "lotId": "<reserve-lot-id>"
  }' \
  | tee "$EVIDENCE_DIR/api/reserve-redeem-intent.dry-run.json"
```

Controlled redemption placeholder. Do not execute from this runbook:

```bash
# PLACEHOLDER ONLY - controlled operator console.
# Send Reserve redeem request only if:
# - lot is mature according to same ReserveVault getters
# - redeem amount <= redeemable lot amount
# - owner wallet is $TESTNET_OPERATOR_WALLET
# - release owner approved send
#
# Record redeem tx hash: <reserve-redeem-tx-hash>
# Save post-redeem getters:
# "$EVIDENCE_DIR/contracts/reserve-redeem.after.json"
```

Required evidence:

- If no mature lot exists: explicit `not sent` note, current maturity timestamp, expected mature time, and local simulation proof.
- If a mature lot exists: tx hash, same ReserveVault address, redeemed amount, updated `redeemedAmount`, ReserveVault Jetton wallet balance decrease, and user wallet test 72H balance increase.
- API redeem intent must not return a sendable transaction for immature lots.

## AppRewardPool Funding Injection

Objective: prove the admin funding path updates RewardPool balance, persists an audit row, and does not touch Reserve principal.

Admin session placeholder:

```bash
# PLACEHOLDER ONLY - use an operator-local password/MFA prompt.
# export CAPITAL_ADMIN_SESSION="<admin-session-token>"
```

Find pool id from Admin dashboard:

```bash
curl -sS "$CAPITAL_API_BASE_URL/v1/admin/capital/dashboard?locale=en-US" \
  -H "authorization: Bearer $CAPITAL_ADMIN_SESSION" \
  | tee "$EVIDENCE_DIR/admin/dashboard.before-reward-funding.json"
```

Funding injection through Admin API. This is a database/admin action, not a chain transaction:

```bash
export POOL_ID="<reward-pool-id-from-dashboard>"
export IDEMPOTENCY_KEY="${REHEARSAL_ID}-reward-funding-${POOL_ID}"

curl -sS -X POST "$CAPITAL_API_BASE_URL/v1/admin/capital/reward-pools/$POOL_ID/funding-events?locale=en-US" \
  -H "content-type: application/json" \
  -H "authorization: Bearer $CAPITAL_ADMIN_SESSION" \
  --data '{
    "amount": "'"$CAPITAL_REWARD_AMOUNT_72H"'",
    "currency": "72H",
    "source": "testnet-rehearsal-reward-source",
    "auditReason": "Inject AppRewardPool funding for testnet full rehearsal",
    "confirmationText": "'"$POOL_ID"'",
    "idempotencyKey": "'"$IDEMPOTENCY_KEY"'",
    "clientIssuedAt": "'"$(date -u +%Y-%m-%dT%H:%M:%SZ)"'"
  }' \
  | tee "$EVIDENCE_DIR/admin/reward-funding-injection.json"
```

Post-check:

```bash
curl -sS "$CAPITAL_API_BASE_URL/v1/admin/capital/dashboard?locale=en-US" \
  -H "authorization: Bearer $CAPITAL_ADMIN_SESSION" \
  | tee "$EVIDENCE_DIR/admin/dashboard.after-reward-funding.json"
```

Required evidence:

- RewardPool balance increased by `CAPITAL_REWARD_AMOUNT_72H`.
- `reward_funding_events` row exists.
- `admin_audit_logs` row exists with the idempotency key.
- Duplicate request with the same idempotency key returns `409` or equivalent idempotency protection.
- ReserveVault total principal and ReserveVault Jetton wallet balance are unchanged by reward funding.

## Reward Claim

Objective: prove a user reward claim request can be built and indexed without drawing from Reserve principal.

Claim intent dry-run:

```bash
curl -sS -X POST "$CAPITAL_API_BASE_URL/v1/capital/reward/claim-intent?locale=en-US" \
  -H "content-type: application/json" \
  --data '{
    "appSlug": "'"$CAPITAL_APP_SLUG"'",
    "seatType": "reserve",
    "seatNumber": <reserve-seat-number>,
    "walletAddress": "'"$TESTNET_OPERATOR_WALLET"'",
    "amount": "<claimable-reward-72h>"
  }' \
  | tee "$EVIDENCE_DIR/api/reward-claim-intent.dry-run.json"
```

Controlled claim placeholder. Do not execute from this runbook:

```bash
# PLACEHOLDER ONLY - controlled operator console.
# Send reward claim only if:
# - claimable reward is positive
# - RewardPool balance covers the claim
# - ReserveVault principal is unchanged in pre-check getters
# - release owner approved send
#
# Record claim tx hash or admin/event id: <reward-claim-id>
# Save post-claim evidence:
# "$EVIDENCE_DIR/api/reward-claim.after.json"
```

Indexer manual event placeholder if chain decoding is not yet promoted for RewardPool:

```bash
curl -sS -X POST "$CAPITAL_INDEXER_BASE_URL/v1/indexer/events" \
  -H "content-type: application/json" \
  --data '{
    "eventId": "reward-claim:'"$REHEARSAL_ID"':<claim-id>",
    "eventType": "capital.reward.claimed",
    "appSlug": "'"$CAPITAL_APP_SLUG"'",
    "seatType": "reserve",
    "seatNumber": <reserve-seat-number>,
    "walletAddress": "'"$TESTNET_OPERATOR_WALLET"'",
    "txHash": "<reward-claim-tx-or-event-id>",
    "payload": {
      "amountDisplay": "<claimable-reward-72h> 72H",
      "claimId": "<claim-id>"
    }
  }' \
  | tee "$EVIDENCE_DIR/indexer/reward-claim-ingest.json"
```

Required evidence:

- RewardPool balance decreases only by the claimed reward.
- ReserveVault total principal is unchanged.
- Reward claim appears in API portfolio/admin views.
- Indexer projection includes `rewardClaims`.

## Alpha Flow

Objective: rehearse Alpha allocation intent, AlphaVault getter boundary, projection, and public copy. Alpha principal is non-redeemable.

Read-only AlphaVault verification:

```bash
cd /Users/yudeyou/Desktop/72h-capital-contracts
npm run verify:testnet | tee "$EVIDENCE_DIR/contracts/alpha-verify.before.txt"
```

Alpha allocation intent dry-run:

```bash
curl -sS -X POST "$CAPITAL_API_BASE_URL/v1/capital/alpha/allocate-intent?locale=en-US" \
  -H "content-type: application/json" \
  --data '{
    "appSlug": "'"$CAPITAL_APP_SLUG"'",
    "seatType": "alpha",
    "seatNumber": <alpha-seat-number>,
    "walletAddress": "'"$TESTNET_OPERATOR_WALLET"'",
    "amount": "'"$CAPITAL_ALPHA_AMOUNT_72H"'"
  }' \
  | tee "$EVIDENCE_DIR/api/alpha-allocate-intent.dry-run.json"
```

Controlled Alpha send placeholder. Do not execute from this runbook:

```bash
# PLACEHOLDER ONLY - controlled operator console.
# Send Alpha allocation only if:
# - AlphaVault($CAPITAL_APP_SLUG) is active and verified
# - amount >= app Alpha threshold
# - operator accepts Alpha principal is non-redeemable
# - release owner approved send
#
# Record Alpha tx hash: <alpha-allocate-tx-hash>
# Save post-Alpha getter output:
# "$EVIDENCE_DIR/contracts/alpha-verify.after.json"
```

Manual projection placeholder if Alpha chain decoding is not yet promoted:

```bash
curl -sS -X POST "$CAPITAL_INDEXER_BASE_URL/v1/indexer/events" \
  -H "content-type: application/json" \
  --data '{
    "eventId": "alpha:'"$REHEARSAL_ID"':<alpha-seat-number>",
    "eventType": "capital.alpha.position.allocated",
    "appSlug": "'"$CAPITAL_APP_SLUG"'",
    "seatType": "alpha",
    "seatNumber": <alpha-seat-number>,
    "walletAddress": "'"$TESTNET_OPERATOR_WALLET"'",
    "txHash": "<alpha-allocate-tx-hash>",
    "payload": {
      "amountDisplay": "'"$CAPITAL_ALPHA_AMOUNT_72H"' 72H",
      "positionId": "'"$CAPITAL_APP_SLUG"':alpha:<alpha-seat-number>"
    }
  }' \
  | tee "$EVIDENCE_DIR/indexer/alpha-position-ingest.json"
```

Required evidence:

- Alpha intent is disabled or dry-run unless testnet signing is explicitly enabled.
- If AlphaVault is inactive, record `not sent` and attach planned address/getter skip evidence.
- If sent, AlphaVault seat/position state updates and principal is recorded as non-redeemable.
- Website and API copy state 72-week duration, settlement cadence, reward may be 0, and principal is non-redeemable.

## Indexer Verification

Worker status:

```bash
curl -sS "$CAPITAL_INDEXER_BASE_URL/health" \
  | tee "$EVIDENCE_DIR/indexer/health.json"

curl -sS "$CAPITAL_INDEXER_BASE_URL/v1/indexer/status" \
  | tee "$EVIDENCE_DIR/indexer/status.json"
```

Dry-run poll placeholder:

```bash
# If poll-once is disabled, the expected result is 403 with status=disabled.
curl -sS -X POST "$CAPITAL_INDEXER_BASE_URL/v1/indexer/poll-once" \
  -H "authorization: Bearer <indexer-admin-token-if-enabled>" \
  | tee "$EVIDENCE_DIR/indexer/poll-once.json"
```

Node testnet poller placeholder for controlled local projection:

```bash
cd /Users/yudeyou/Desktop/72h-capital-indexer

# Dry-run decode only.
H72H_TON_TESTNET_POLL_ENABLED=true \
H72H_TON_DRY_RUN=true \
H72H_TON_RESERVE_VAULT_ADDRESS="<reserve-vault-address>" \
H72H_TON_REGISTRY_ADDRESS="<capital-registry-address>" \
H72H_TON_72H_JETTON_MASTER_ADDRESS="<test-jetton-master-address>" \
npm run ton:testnet:poll \
  | tee "$EVIDENCE_DIR/indexer/ton-testnet-poll.dry-run.txt"
```

Projection export:

```bash
curl -sS "$CAPITAL_INDEXER_BASE_URL/v1/indexer/projections" \
  | tee "$EVIDENCE_DIR/indexer/projections.json"

curl -sS "$CAPITAL_INDEXER_BASE_URL/v1/indexer/projections?format=sql" \
  | tee "$EVIDENCE_DIR/indexer/projections.sql"
```

Required evidence:

- Watched addresses include the rehearsed ReserveVault and related registry/Jetton addresses.
- Reserve lot, RewardPool funding, reward claim, Alpha position, and principal redeem records are present or explicitly marked `not applicable`.
- Duplicate event ingestion is idempotent.
- Postgres write mode, if enabled, writes to the rehearsal/staging database only.

## API Verification

Health and public reads:

```bash
curl -sS "$CAPITAL_API_BASE_URL/health" \
  | tee "$EVIDENCE_DIR/api/health.json"

curl -sS "$CAPITAL_API_BASE_URL/v1/capital/apps?locale=en-US" \
  | tee "$EVIDENCE_DIR/api/apps.json"

curl -sS "$CAPITAL_API_BASE_URL/v1/capital/apps/$CAPITAL_APP_SLUG?locale=en-US" \
  | tee "$EVIDENCE_DIR/api/app-${CAPITAL_APP_SLUG}.json"

curl -sS "$CAPITAL_API_BASE_URL/v1/capital/me?locale=en-US&wallet=$TESTNET_OPERATOR_WALLET" \
  | tee "$EVIDENCE_DIR/api/me.json"
```

Identity and verification reads:

```bash
curl -sS "$CAPITAL_API_BASE_URL/v1/capital/identities/$CAPITAL_APP_SLUG/reserve/<reserve-seat-number>?locale=en-US" \
  | tee "$EVIDENCE_DIR/api/verification-reserve.json"
```

Required evidence:

- API reports `configured=true`, expected environment, DB mode, and admin auth configured.
- Public reads do not leak private amounts or full wallet-sensitive fields.
- `/v1/capital/identities/:slug/:type/:seatNumber` returns the localized public verification payload for the rehearsed seat.
- Reserve page shows principal custody and 72-day lot maturity copy.
- Alpha page shows non-redeemable principal and 72-week duration copy.
- Intent responses are sendable only when the testnet signing flag was deliberately enabled.

## Admin Verification

```bash
curl -sS "$CAPITAL_API_BASE_URL/v1/admin/capital/dashboard?locale=en-US" \
  -H "authorization: Bearer $CAPITAL_ADMIN_SESSION" \
  | tee "$EVIDENCE_DIR/admin/dashboard.final.json"

curl -sS "$CAPITAL_API_BASE_URL/v1/admin/capital/intents/recent?locale=en-US" \
  -H "authorization: Bearer $CAPITAL_ADMIN_SESSION" \
  | tee "$EVIDENCE_DIR/admin/recent-intents.final.json"
```

Required evidence:

- Reward pool balance and funding row are visible.
- Reserve custody rows are view-only.
- Recent intents include reserve allocate, reserve redeem dry-run, Alpha allocate dry-run, and reward claim dry-run where applicable.
- Audit logs exist for every sensitive admin action.
- App pause/resume controls require role and explicit confirmation.

## Website Verification

Run the staging smoke from the website repo:

```bash
cd /Users/yudeyou/Desktop/72hours
CAPITAL_API_BASE_URL="$CAPITAL_API_BASE_URL" \
CAPITAL_INDEXER_BASE_URL="$CAPITAL_INDEXER_BASE_URL" \
CAPITAL_ADMIN_URL="$CAPITAL_ADMIN_BASE_URL" \
npm run capital:smoke:staging \
  | tee "$EVIDENCE_DIR/website/capital-staging-smoke.txt"
```

Browser/manual screenshots to archive:

- Capital overview.
- App page for `$CAPITAL_APP_SLUG`.
- Reserve intent surface before wallet connection.
- Reserve verification page for the rehearsed seat.
- Portfolio page for `TESTNET_OPERATOR_WALLET`.
- Alpha intent surface.
- Admin dashboard RewardPool section.
- Admin Reserve custody section.

Use an isolated browser profile for any automation, never the default browser profile. Stop only the process started for the rehearsal.

Required evidence:

- Website points to the rehearsal API, not production.
- No `mock`, `scaffold`, or development wording appears in user-facing rehearsal pages unless the page is intentionally in preview mode.
- Wallet UI clearly shows testnet context.
- Risk copy matches v1 policy.

## Failure And Rollback

Trigger rollback immediately if any condition is true:

- Wrong network or mainnet wallet appears.
- Sendable transaction is generated while signing should be disabled.
- Reserve principal changes during reward funding or reward claim.
- Reserve redeem is possible before maturity.
- Indexer writes to the wrong database or wrong environment.
- Admin sensitive action succeeds without audit row or idempotency key.
- Public website points to staging when testing production, or production when rehearsing staging/testnet.
- Any tx or getter result cannot be reconciled with API/Admin/Indexer state.

Rollback order:

1. Disable wallet signing flags.

```bash
# API env update placeholder:
# H72H_ENABLE_TESTNET_TACT_MESSAGES=false
# H72H_ENABLE_MAINNET_TACT_MESSAGES=false
```

2. Pause affected app through Admin/API.

```bash
export IDEMPOTENCY_KEY="${REHEARSAL_ID}-pause-${CAPITAL_APP_SLUG}"

curl -sS -X POST "$CAPITAL_API_BASE_URL/v1/admin/capital/apps/$CAPITAL_APP_SLUG/pause?locale=en-US" \
  -H "content-type: application/json" \
  -H "authorization: Bearer $CAPITAL_ADMIN_SESSION" \
  --data '{
    "auditReason": "Pause after failed testnet full rehearsal check",
    "confirmationText": "'"$CAPITAL_APP_SLUG"'",
    "idempotencyKey": "'"$IDEMPOTENCY_KEY"'",
    "clientIssuedAt": "'"$(date -u +%Y-%m-%dT%H:%M:%SZ)"'"
  }' \
  | tee "$EVIDENCE_DIR/rollback/app-pause.json"
```

3. Disable Indexer polling/writes.

```bash
# Indexer env update placeholder:
# H72H_TON_TESTNET_POLL_ENABLED=false
# H72H_INDEXER_POSTGRES_WRITE_ENABLED=false
```

4. Keep read-only API/Admin/website pages online if they are accurate; otherwise redeploy website in preview mode.

```bash
cd /Users/yudeyou/Desktop/72hours
# Placeholder build/deploy packet:
# VITE_CAPITAL_DATA_MODE=preview npm run build
# <deploy preview-mode site>
```

5. Preserve evidence before retrying.

```bash
cp -R "$EVIDENCE_DIR" "$EVIDENCE_DIR.rollback-copy"
```

Rollback exit criteria:

- Root cause has an owner.
- Signing flags are disabled or deliberately re-enabled by written approval.
- API, Admin, Indexer, and website agree on app status.
- Reserve principal and RewardPool balances reconcile.
- One dry-run reserve intent and one public read pass after the fix.

## Evidence Archive

At the end of the rehearsal, create an index:

```bash
cat > "$EVIDENCE_DIR/README.md" <<'EOF'
# 72H Capital Testnet Full Rehearsal Evidence

- Rehearsal ID:
- Date:
- Operator:
- Release owner:
- App slug:
- Testnet operator wallet:
- Reserve tx:
- Reserve redeem tx or simulation note:
- Reward funding event:
- Reward claim tx or event:
- Alpha tx or simulation note:
- Indexer projection export:
- API/Admin/Website screenshots:
- Rollback actions:
- Final decision: pass / fail / partial
EOF
```

Archive:

```bash
cd "$(dirname "$EVIDENCE_DIR")"
tar -czf "${REHEARSAL_ID}.tar.gz" "$REHEARSAL_ID"
shasum -a 256 "${REHEARSAL_ID}.tar.gz" | tee "${REHEARSAL_ID}.sha256"
```

Required final artifact update:

```bash
# After evidence review, copy the signed summary into:
# /Users/yudeyou/Desktop/72hours/docs/spec/capital-production-artifacts/testnet-rehearsal.current-draft.md
#
# Production gate variable:
# CAPITAL_TESTNET_REHEARSAL_ARTIFACT_PATH="/Users/yudeyou/Desktop/72hours/docs/spec/capital-production-artifacts/evidence/${REHEARSAL_ID}/README.md"
```

## Final Pass Criteria

The rehearsal passes only when all are true:

- Contracts verify on testnet.
- Wallet/test coin setup is testnet-only and fully evidenced.
- Reserve allocation is either successfully sent and reconciled, or intentionally dry-run with a documented send blocker.
- Reserve maturity/redeem path is proven by same-contract getter evidence or explicitly simulated with no premature redeem possible.
- AppRewardPool funding is injected through the audited admin path and does not touch Reserve principal.
- Reward claim is dry-run or sent only from RewardPool availability and appears in projection/API views.
- Alpha flow is dry-run or sent with non-redeemable principal copy and state verified.
- Indexer projection, API reads, Admin views, and website pages all agree.
- Rollback plan was tested at least through API pause or documented as not needed.
- Evidence archive is complete, hashed, and reviewed by the release owner.
