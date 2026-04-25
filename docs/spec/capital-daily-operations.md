# 72H Capital Daily Operations

Last updated: 2026-04-24

## Daily Checks

- Run staging smoke before every Capital release: `npm run capital:smoke:staging`.
- Run production gate before any mainnet signing change: `npm run capital:gate:production`.
- Check API health: app count, seat count, intent count, DB mode, admin auth configured.
- Check Indexer health: enabled flag, dry-run flag, watched address count, latest poll status.
- Check Admin dashboard: recent intents, Reserve mature lots, AppRewardPool funding events, audit log.
- Check stale intents: investigate any abnormal increase.
- Check chain event lag: compare latest on-chain tx timestamp with latest indexed `chain_events.created_at`.
- Check public verification pages: confirm no full wallet address, amount, or reward is exposed.
- Check Reserve mature-lot support cases: confirm no redeemable principal issue stays unresolved without an owner and note.
- Check AppRewardPool funding: confirm every funding event has an audit log, approved source, and no ReserveVault principal dependency.
- Check Alpha lifecycle: confirm Alpha stays closed until Reserve stability gate passes; when open, confirm active/completed counts and copy are accurate.
- Check emergency pause state before enabling any wallet signing window.

## Customer Support Categories

- Wallet connection failed.
- Wallet transaction rejected.
- Transaction submitted but pending.
- Intent stale or failed.
- Reserve lot not visible after chain confirmation.
- Reserve mature-lot redeem failed or not yet available.
- Reward not claimable yet.
- Public verification page mismatch.
- App paused or signing temporarily unavailable.

## Support Response Rules

- Never ask users for seed phrases or private keys.
- Ask for wallet short address, intent id, tx hash, app slug, seat type, and seat number.
- Do not disclose allocation amount or reward on public channels.
- Escalate any suspected duplicated seat, unexpected redemption, or unknown contract address immediately.
- For Reserve mature-lot redeem issues, confirm maturity, same ReserveVault target, and already-redeemed state before advising the user to retry.
- For Alpha questions, state plainly that Alpha principal is non-redeemable and rewards may be 0.

## Operational Metrics

- TVL by app.
- Reserve occupancy by app.
- Alpha occupancy by app.
- Reserve mature-lot redeemable count and oldest support-case age.
- AppRewardPool balance and funding-event count by app.
- Alpha lifecycle count by status: `closed`, `open`, `active`, `completed`.
- Intent counts by status: `preview`, `pending`, `confirmed`, `failed`, `stale`.
- Indexer lag.
- API error rate.
- Admin failed login count.
- Contract pause status.

## Incident Actions

- Website issue: switch website deployment back to preview mode.
- API issue: disable signing env flags and keep reads available where safe.
- Indexer issue: disable polling, keep API reads from last known DB state.
- Alerting compromise: rotate Telegram bot token, remove unknown chat admins, and disable notification writes until the new alert channel is verified.
- Contract issue: use admin-wallet emergency pause; do not ask users to sign Reserve redeem, reward claim, or Alpha actions until triaged.

## Shift Handoff

- Record environment, deployment id, operator, and check time.
- List open incidents, paused apps, disabled signing flags, and status-copy owner.
- List RewardPool funding events completed today with pool id and audit id, not secret values.
- List Reserve mature-lot support cases that need follow-up.
- List Alpha lifecycle changes or confirm no Alpha state change.
