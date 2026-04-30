# 72H Telegram Sales Bot

Status: production warmup / waitlist only. Real purchase, payment, signing, manual transfer instructions, purchase intents, and receipt confirmation are closed on the public site; `POST /api/telegram/presale-intents` and `POST /api/telegram/presale-receipts` intentionally fail closed with HTTP 503 (`presale_route_disabled`).

This bot is currently a Telegram Mini App waitlist and sales-signal assistant for 72H early access. It is not a payment surface, not a free-text transaction generator, and not a live presale router. Any deterministic transaction path must stay outside natural language handling and must not be re-enabled without the production gate in `docs/presale-functions-disabled-2026-04-30.md`.

## Architecture

- Telegram sends webhook updates to `POST /api/telegram/webhook`.
- `functions/_shared/telegram-security.js` validates the Telegram `secret_token` header.
- `functions/_shared/telegram-api.js` wraps Telegram Bot API calls.
- `functions/_shared/presale-runtime.js` resolves public presale configuration from env.
- `functions/_shared/presale-chain.js` reads public PresaleVault getters and buyer purchase totals when `H72H_TON_RPC_URL` is configured.
- `functions/_shared/presale-ton.js` contains deterministic TON `BuyPresale` payload helpers, but payload-serving routes are disabled in production warmup.
- `functions/_shared/sales-signals.js` extracts deterministic sales signals from chat text and Mini App actions: intent, amount band, objections, urgency, source hints, follow-up priority, and operator suggestions.
- `GET /api/telegram/presale-status` exposes public config and a read-only chain snapshot when getter reads are available.
- `POST /api/telegram/presale-events` stores Mini App tacit-knowledge events after Telegram initData validation.
- `POST /api/telegram/presale-intents` is disabled in production warmup and returns HTTP 503 (`presale_route_disabled`).
- `POST /api/telegram/presale-receipts` is disabled in production warmup and returns HTTP 503 (`presale_route_disabled`).
- `POST /api/telegram/presale-reservations` is the only user write path for the waitlist; it requires Telegram initData or the configured bot secret and must remain non-transactional.
- `GET /api/telegram/sales-admin` is a secret-protected read-only reservation list for operators; `POST /api/telegram/sales-admin` remains disabled and must not mutate records.
- `functions/_shared/telegram-alerts.js` sends optional operator alerts for human support and non-transactional warmup signals when configured.
- `src/pages/BotPresale.tsx` is the Telegram Mini App shell and wallet surface.
- `scripts/telegram-set-webhook.mjs` configures Telegram `setWebhook` with `secret_token`.

The bot logs structured sales signals to Cloudflare logs, writes them to `H72H_BOT_SALES_KV` when that KV binding is configured, and sends operational alerts to `H72H_TELEGRAM_ALERT_CHAT_ID` when configured.

## Commands

- `/start`: introduces the bot and shows buttons for Buy 72H, Presale Status, How it works, and Human support.
- `/buy`: shows the guarded warmup/waitlist entry. Real purchase remains disabled; it must not present payment, signing, manual-transfer, or receipt-confirmation instructions.
- `/status`: shows env/config status, PresaleVault, Jetton Master, feature flag state, getter availability, and live chain snapshot when available.
- `/help`: explains the safe transaction boundary.
- `/human`: records a human-support event and alerts `H72H_TELEGRAM_ALERT_CHAT_ID` when configured.

Free text is classified into:

- `buy_intent`
- `wallet_help`
- `price_question`
- `risk_question`
- `referral_question`
- `human_support`
- `unknown`

The classifier also derives structured sales fields when possible:

- `amountTon` and `amountBand`
- `intentStrength`
- `followUpPriority`
- `objections`: trust/contract safety, wallet connection, price/stage, timing, source/referral
- `urgency`
- `sourceHint`
- `operatorSuggestion`

Free text never creates a transaction payload. These fields only support routing, FAQ, risk prompts, operator alerts, and tacit-knowledge review.

## Presale Runtime

Mainnet addresses:

- Jetton Master: `EQBGIzEDvvKObStrcVb6i5Z1-8uYZYtUrYzF2rFZU7xUAXVg`
- PresaleVault: `EQCj56OaGFtIBgdtQjIacb7s1jlEy93vh-93PU07MDR1vpE9`

Rules:

- Total presale cap: `4,500,000,000 72H`
- Stage cap: `1,500,000,000 72H`
- Wallet cap: `7,200,000 72H`
- Stage 0 maps to contract stage 1: `1 TON = 10,072 72H`
- Stage 1 maps to contract stage 2: `1 TON = 7,200 72H`
- Stage 2 maps to contract stage 3: `1 TON = 3,500 72H`
- TON-only V1
- Active state and current contract stage are controlled on-chain by the admin.

The runtime calls PresaleVault getters only when `H72H_TON_RPC_URL` is configured. When getter reads are unavailable it says `disabled` or `unavailable`, never fabricates sold, funded, active, or stage data.

PresaleVault getters currently wired for read-only status:

- `isActive`
- `getCurrentStage`
- `getStageCap72H`
- `getTotalCap72H`
- `getFunded72H`
- `getSold72H`
- `getSaleProceedsTon`
- `getWithdrawnTon`
- `getSoldByStage`
- `getPurchasedByBuyer`

## Environment

Cloudflare secrets:

- `H72H_TELEGRAM_BOT_TOKEN`
- `H72H_TELEGRAM_WEBHOOK_SECRET`
- `H72H_TELEGRAM_ADMIN_IDS`
- `H72H_TELEGRAM_ALERT_CHAT_ID`
- `H72H_BOT_INTENT_SIGNING_SECRET` (reserved; must not imply purchase intents are enabled)
- `H72H_TON_API_KEY`

Plain deployment env:

- `H72H_BOT_PUBLIC_BASE_URL`
- `H72H_BOT_MINIAPP_URL`
- `H72H_PRESALE_ENABLED=false`
- `H72H_PRESALE_NETWORK_MODE=mainnet`
- `H72H_PRESALE_VAULT_ADDRESS`
- `H72H_72H_JETTON_MASTER`
- `H72H_TON_RPC_URL`: toncenter-compatible REST base URL or JSON-RPC endpoint. Getter and verifier code both tolerate `/jsonRPC` endpoints.

Cloudflare binding:

- `H72H_BOT_SALES_KV`: stores non-transactional warmup records such as `reservation:*` and allowed signal events. Historical `intent:*`, `receipt:*`, and admin annotation storage must remain disabled until the safety gate is reopened.

Legacy app-discovery bot env:

- `H72H_TELEGRAM_BOT_SECRET`: still used by `POST /api/telegram/apps` with `x-telegram-bot-secret`.

## Webhook Setup

Set required env locally, then run:

```bash
H72H_TELEGRAM_BOT_TOKEN=... \
H72H_TELEGRAM_WEBHOOK_SECRET=... \
H72H_BOT_PUBLIC_BASE_URL=https://72hours.72h.lol \
node scripts/telegram-set-webhook.mjs
```

To drop old pending updates:

```bash
node scripts/telegram-set-webhook.mjs --drop-pending-updates
```

The script calls Telegram `setWebhook` with:

- `url`: `${H72H_BOT_PUBLIC_BASE_URL}/api/telegram/webhook`
- `secret_token`: `H72H_TELEGRAM_WEBHOOK_SECRET`
- `allowed_updates`: `message`, `callback_query`

## Security Boundaries

- The webhook must reject requests without the Telegram secret header.
- The Bot Token is read only from env and must never be committed.
- The webhook catches per-update failures and returns a generic response without leaking internals.
- Real purchase execution is currently disabled independent of UI copy; production write routes for purchase intents and receipts return HTTP 503.
- Signable TonConnect payloads must not be returned in warmup/waitlist mode. Any future re-enable requires explicit production approval and the fail-closed gate checklist.
- Natural language is only for intent understanding, FAQ, risk prompts, human escalation, and sales signal capture.
- Transaction generation must be deterministic and API-driven.
- Transaction signing must happen in the Mini App through TonConnect.
- Transaction verification must check target address, opcode/queryId, TON amount, success state, and idempotency.
- Receipt verification is not exposed in warmup/waitlist mode; the route returns HTTP 503 until intentionally re-enabled.
- Screenshots, pasted hashes, and user self-report are not proof of purchase.
- Browser automation must use an isolated temp profile and must not close or kill default browser sessions.

## Tacit Knowledge Design

Michael Polanyi's point, "we know more than we can tell", is implemented as behavior-and-context capture rather than asking users to fully explain themselves.

The bot records structured signals from real phrasing and actions:

- entering the buy path
- asking about price or stages
- asking about wallet setup
- asking about risk, safety, audit, or contract addresses
- mentioning referral, KOL, invite, or source
- requesting human help
- sending text that does not fit known categories
- amount hints such as "20 TON"
- urgency phrases such as "today", "now", or "asap"
- hidden objections such as safety doubt, wallet friction, timing uncertainty, or price sensitivity

Each signal should include Telegram user context, chat id, source command/callback/text, classified intent, timestamp, feature-flag state, and later wallet/order context.

Operators can observe high-friction and high-intent users in Telegram through `/human`, high-intent free text, and Mini App buy-interest alerts. Alerts include an operator suggestion, such as confirming amount range, wallet blocker, or trust concern. The bot should learn from:

- repeated buyer questions before conversion
- hesitation and trust markers
- misunderstanding patterns
- referral/KOL source tags
- purchase failure reasons
- human operator notes
- high-intent buyer alerts
- operator follow-up outcomes

This turns implicit sales-floor judgment into structured operational data without letting ambiguity control transactions.

## Phase Plan

Phase 1:

- Webhook, secret validation, Telegram API wrapper, basic commands, inline keyboard, admin alert, env docs, and this spec.
- Read-only or disabled transaction entry only.

Phase 2:

- Telegram Mini App shell.
- TonConnect wallet status.
- Public PresaleVault/Jetton Master/config status.
- Purchase button disabled; warmup/waitlist copy only.

Phase 3:

- Durable waitlist/reservation storage through KV.
- Record Telegram user, optional wallet, desired allocation, source, reminder preference, and warmup status.
- Deterministic purchase intents are disabled in production warmup; the route returns HTTP 503.

Phase 4:

- On-chain transaction verification remains a future/re-enable phase.
- Receipt route is intentionally closed with HTTP 503 during warmup.
- Do not send user receipt confirmations or operator purchase notifications until the production gate is explicitly reopened.

Phase 5:

- Full tacit-knowledge feedback loop.
- Operator labels for question type, failure reason, trust level, hesitation point, and high-intent status.
- Structured exports for sales strategy review.
- Current implementation adds admin-only listing and annotation endpoints plus Mini App event capture.
