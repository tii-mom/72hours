# 72H Capital Growth Backlog

Last updated: 2026-04-24

These items are approved for post-launch execution but do not block the Reserve production path.

## Share Card Service

- Generate share cards in `zh-CN` and `en-US`.
- Ratios:
  - X / Telegram: `1200x675`.
  - WeChat feed: `1080x1440`.
  - Square: `1080x1080`.
- Public fields only: app, seat type, seat number, tier, status, wallet alias, verification URL.
- Never render amount, reward, full wallet address, or private notes.
- Cache cards by `appSlug + seatType + seatNumber + locale + ratio + updatedAt`.

## Identity And Badge Configuration

- Admin-configurable tiers and badges.
- Badge source of truth stays in API/DB, not website literals.
- Badge unlock events must be derived from seat state, lot maturity, alpha completion, and verified credentials.

## Leaderboard

- Defer until Reserve and Indexer are stable.
- Do not rank by private amount unless user explicitly opts in.
- Safe first leaderboard: seat scarcity, completion status, verified app participation.

## Invites

- Defer until Reserve flow is stable.
- Invite codes must be idempotent and wallet-bound.
- No referral payout until legal and tokenomics review is complete.

## NFT Identity

- Defer until rules stabilize.
- First NFT should be non-transferable identity, not a tradable asset.
- Minting must not be required for verification.

## Data Dashboard

- TVL, Reserve occupancy, Alpha occupancy.
- ReserveVault redemption age.
- AppRewardPool reward cycle status.
- Intent lifecycle health.
- Indexer lag.
- Admin action audit feed.
