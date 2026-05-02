# 72H Bot Presale Warmup / Waitlist Runbook

Status: BOT-only early reservation / warmup waitlist. No purchase, payment, wallet connection request, signature, claim route, new contract, or receipt/intent route is enabled here.

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
- optional draw/export fields after an operator-imported result exists: `drawStatus`, `winningTier`, `winningTierLabel`, `rewardAmount72H`, `payoutStatus`, `payoutTx`
- `rewardStatus`, `rewardTxHash`, `rewardAwardedAt`
- `saleReminderOptIn`, `userSegment`, `communityTasks`
- `contractEvidence` and `lotteryEvidence` with explicit no-new-contract payout notes

Default statuses:

- `whitelistStatus = registered_pending_review`
- `lotteryCodeCount` starts at `1` after reservation success.
- Walletless reservations are allowed for the Bot-only reservation phase and are held before draw/payout review: `lotteryEligible = false`, `lotteryStatus = ineligible_pending_wallet`, `walletVerificationStatus = missing`, `drawReviewStatus = held`.
- Records with a unique wallet, if imported/tested by operators, are marked `lotteryEligible = true`, `lotteryStatus = eligible_pending_draw`, `walletVerificationStatus = verified_unique`.
- `rewardStatus = not_awarded`
- `walletDedupeStatus = unique_wallet_reserved | wallet_not_provided`

Duplicate wallet across Telegram users returns `409 wallet_already_reserved`. The public Mini App copy does not ask users to connect a wallet during P0; this path remains for operator/test coverage and later review workflows.

## Deterministic lottery draw

First-version draw is off-chain and transparent; it does not create a contract, claim route, user-paid gas flow, payment route, or automatic transfer.

Rules:

- Prize tiers: 一等奖 / 二等奖 / 三等奖 / 参与奖.
- Each lottery code is one ticket.
- The public seed is `TON block hash + activity id + draw time`; the script uses it for deterministic shuffling.
- One Telegram user can win at most one major prize.
- Participation rewards are assigned to non-major eligible users and randomized in the `10-200 72H` range.
- Output is a review/export file only. Operators must manually transfer from the official/private prize wallet and later fill payout evidence; the script never sends chain transactions.

Local export:

```bash
npm run telegram:sales-admin:readonly -- --base-url https://72h.lol --limit 500 > sales-admin.json
npm run telegram:lottery:draw -- --input sales-admin.json --activity-id early-access-1 --ton-block-hash <public-ton-block-hash> --draw-time 2026-05-05T09:00:00.000Z --output lottery-draw.json
```

## Endpoints

- `GET /api/telegram/presale-status`: public mode/runtime status; purchase stays disabled unless explicitly allowed in env.
- `GET /api/telegram/presale-reservations`: authenticated Mini App/user reservation lookup.
- `POST /api/telegram/presale-reservations`: authenticated off-chain warmup/waitlist reservation.
- `GET /api/telegram/sales-admin`: read-only reservation list. Preferred auth is `H72H_SALES_ADMIN_READONLY_SECRET` with request header `x-72h-sales-admin-readonly-secret`; legacy Telegram webhook secret headers remain accepted only for compatibility.
- `POST /api/telegram/sales-admin`: disabled (`presale_admin_writes_disabled`).
- `POST /api/telegram/presale-intents` and `/presale-receipts`: still disabled.

## Verification

Run:

```bash
npm run test:telegram-presale
npm run lint
npm run check:i18n
npm run build
```

Cloudflare Pages preview setup for read-only admin smoke:

```bash
# Do not paste the secret into docs, logs, or chat.
npx wrangler pages secret put H72H_SALES_ADMIN_READONLY_SECRET --project-name 72hours
# Redeploy a new preview after setting/updating the preview secret.
```

Smoke read access with the secret only from a local shell environment:

```bash
H72H_SALES_ADMIN_READONLY_SECRET=<local-secret-value> npm run telegram:sales-admin:readonly -- --base-url <preview-url> --limit 1
```

If the preview still returns `401 admin_secret_required`, the Pages preview deployment has no matching `H72H_SALES_ADMIN_READONLY_SECRET`; set it in Cloudflare Pages preview secrets and deploy a fresh preview. The route remains read-only; POST must keep returning `503 presale_admin_writes_disabled`.


## P0 Telegram growth copy surfaces

- Bot webhook `/start` now uses early-reservation wording: reserve +1, valid invite +1, community share task +2, transparent off-chain draw, official wallet payout.
- Bot buttons: `立即预约`, `我的抽奖码`, `邀请好友`, `分享任务`, `官方群`, `安全提醒`, `人工跟进`.
- Mini App `/bot/presale` copy is reservation-only and does not ask users to connect a wallet, pay, sign, or claim.
- Invite codes default to `u{telegramUserId}`; username is stored only as `inviteAlias` for display/debugging.
- Community announcement and admin Q&A drafts live at `docs/artifacts/telegram-growth-p0-community-copy.md`.
