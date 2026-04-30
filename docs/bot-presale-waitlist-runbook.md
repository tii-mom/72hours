# 72H Bot Presale Warmup / Waitlist Runbook

Status: BOT-only warmup/waitlist. No purchase route is enabled here, no new contract is required, and receipt/intent routes remain disabled.

## Presale modes

`H72H_PRESALE_MODE` accepts:

- `warmup` (default): collect off-chain reservations and channel intent.
- `waitlist`: collect off-chain waitlist records.
- `sale_ready`: recognized but clamped to `waitlist` unless `H72H_ALLOW_SALE_MODES=true`.
- `sale_live`: recognized but clamped to `waitlist` unless `H72H_ALLOW_SALE_MODES=true`.
- `paused`: returns paused mode metadata; purchase is still disabled.

For this BOT-only phase, do not set `H72H_ALLOW_SALE_MODES=true`.

## Storage

Uses the existing Cloudflare KV binding:

- preferred: `H72H_BOT_SALES_KV`
- fallback: `BOT_SALES_KV`

Reservation writes:

- `reservation:user:{telegramUserId}` — idempotent user record.
- `reservation:wallet:{lowercaseWallet}` — wallet de-duplication index.
- `reservation:{createdAt}:{reservationId}` — chronological admin/list index.
- `event:{createdAt}:{eventId}` — sales signal event.

## Reservation fields

Public/admin reservation records include:

- `presaleMode`, `requestedPresaleMode`, `botOnly`, `purchaseEnabled`
- `telegramUserId`, `username`
- `walletAddress`, `walletDedupeStatus`
- `desiredAllocation72H`
- `source`, `channelSource`, `referral`
- `whitelistStatus`
- `lotteryEligible`, `lotteryStatus`
- `rewardStatus`, `rewardTxHash`, `rewardAwardedAt`
- `saleReminderOptIn`, `userSegment`, `communityTasks`
- `contractEvidence` and `lotteryEvidence` with explicit no-new-contract payout notes

Default statuses:

- `whitelistStatus = pending_review`
- `lotteryEligible = true`
- `lotteryStatus = eligible_pending_draw`
- `rewardStatus = not_awarded`
- `walletDedupeStatus = unique_wallet_reserved | wallet_not_provided`

Duplicate wallet across Telegram users returns `409 wallet_already_reserved`.

## Endpoints

- `GET /api/telegram/presale-status`: public mode/runtime status; purchase stays disabled unless explicitly allowed in env.
- `GET /api/telegram/presale-reservations`: authenticated Mini App/user reservation lookup.
- `POST /api/telegram/presale-reservations`: authenticated off-chain warmup/waitlist reservation.
- `GET /api/telegram/sales-admin`: admin-secret read-only reservation list.
- `POST /api/telegram/sales-admin`: disabled (`presale_admin_writes_disabled`).
- `POST /api/telegram/presale-intents` and `/presale-receipts`: still disabled.

## Verification

Run:

```bash
npm run test:telegram-presale
npm run lint
npm run build
```
