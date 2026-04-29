# 72H Capital Production Owner Inputs

Last updated: 2026-04-25

This file lists the exact owner-supplied inputs required before `npm run capital:gate:production` can pass for the public frontend/API launch. Mainnet user signing remains disabled by default with `CAPITAL_MAINNET_SIGNING_ENABLED=false`; the stricter signing inputs below are required only before flipping that value to `true`. Do not paste secrets into git or chat. Store secrets only in the production Cloudflare project, the production database provider, or a local ignored `.env.production.local` used for one-time gate execution.

## Required Production URLs

| Field | How to get it | Example shape |
| --- | --- | --- |
| `CAPITAL_PRODUCTION_API_BASE_URL` | Deploy `72h-capital-api-production` on Cloudflare Workers and copy its production URL. | `https://72h-capital-api-production.<account>.workers.dev` |
| `CAPITAL_PRODUCTION_INDEXER_BASE_URL` | Deploy `72h-capital-indexer-production` on Cloudflare Workers and copy its production URL. | `https://72h-capital-indexer-production.<account>.workers.dev` |
| `CAPITAL_TONCONNECT_MANIFEST_URL` | Publish `tonconnect-manifest.json` on the official website domain. | `https://72hours.72h.lol/tonconnect-manifest.json` |
| `CAPITAL_MAINNET_RPC_URL` | Use the selected mainnet TON RPC provider. The provided TonAPI key should be stored as a secret, not embedded in this URL. | `https://tonapi.io/v2/jsonRPC` |
| `CAPITAL_MAINNET_EXPLORER_TX_URL_PATTERN` | Pick the production explorer and include `{tx}` where tx hash goes. | `https://tonviewer.com/transaction/{tx}` |

## Required Frontend Secrets

Set these as Cloudflare secrets, not committed files:

- `H72H_MAINNET_RPC_API_KEY`: production TonAPI key. You provided the current value out of band; store it only as a Worker secret.
- `H72H_TON_RPC_API_KEY`: Indexer TonAPI key, usually the same provider key unless you intentionally split quotas.
- `H72H_TELEGRAM_BOT_TOKEN`: Telegram bot token from BotFather.
- `H72H_TELEGRAM_ALERT_CHAT_ID`: numeric chat id for the production alert channel.
- Cloudflare deployment token.

How to create the Telegram alert bot:

1. Open Telegram and message `@BotFather`.
2. Run `/newbot`, choose a display name and username, and copy the token.
3. Add the bot to the production alert group/channel.
4. Send one normal message in that chat.
5. Call `https://api.telegram.org/bot<token>/getUpdates` locally and copy the numeric `chat.id`.
6. Set `H72H_TELEGRAM_BOT_TOKEN` and `H72H_TELEGRAM_ALERT_CHAT_ID` as Cloudflare secrets for the monitoring Worker or the API/Indexer component that sends alerts.

## Required Mainnet Addresses For Signing

The frontend gate requires only the official public 72H Jetton master. The remaining addresses are signing-gate inputs and must be supplied before `CAPITAL_MAINNET_SIGNING_ENABLED=true`.

| Field | How to get it |
| --- | --- |
| `TON_MAINNET_72H_JETTON_MASTER_ADDRESS` | Verify the official 72H Jetton master. Must be `EQBGIzEDvvKObStrcVb6i5Z1-8uYZYtUrYzF2rFZU7xUAXVg`. |
| `TON_MAINNET_ADMIN_ADDRESS` | Owner-controlled production admin wallet address. |
| `TON_MAINNET_RESERVE_VAULT_ADDRESS_72HOURS` | Deploy audited ReserveVault for `72hours`; verify getter output and deployment tx. |
| `TON_MAINNET_RESERVE_VAULT_JETTON_WALLET_ADDRESS_72HOURS` | After ReserveVault deploy, call the official 72H Jetton master wallet getter for that vault address; set the vault with `SetVaultJettonWallet` and attach evidence. |
| `TON_MAINNET_APP_REWARD_POOL_ADDRESS_72HOURS` | Deploy audited AppRewardPool for `72hours`; verify owner/app binding. |
| `TON_MAINNET_APP_REWARD_POOL_JETTON_WALLET_ADDRESS_72HOURS` | After AppRewardPool deploy, call the official 72H Jetton master wallet getter for that pool address; set the pool with `SetPoolJettonWallet` and attach evidence. |
| `TON_MAINNET_ALPHA_VAULT_ADDRESS_72HOURS` | Deploy audited AlphaVault for `72hours`; verify owner/app/reward-pool binding. |
| `TON_MAINNET_RESERVE_VAULT_ADDRESS_WAN` | Same for `wan`. |
| `TON_MAINNET_RESERVE_VAULT_JETTON_WALLET_ADDRESS_WAN` | Same for `wan`. |
| `TON_MAINNET_APP_REWARD_POOL_ADDRESS_WAN` | Same for `wan`. |
| `TON_MAINNET_APP_REWARD_POOL_JETTON_WALLET_ADDRESS_WAN` | Same for `wan`. |
| `TON_MAINNET_ALPHA_VAULT_ADDRESS_WAN` | Same for `wan`. |
| `TON_MAINNET_RESERVE_VAULT_ADDRESS_MULTI_MILLIONAIRE` | Same for `multi-millionaire`. |
| `TON_MAINNET_RESERVE_VAULT_JETTON_WALLET_ADDRESS_MULTI_MILLIONAIRE` | Same for `multi-millionaire`. |
| `TON_MAINNET_APP_REWARD_POOL_ADDRESS_MULTI_MILLIONAIRE` | Same for `multi-millionaire`. |
| `TON_MAINNET_APP_REWARD_POOL_JETTON_WALLET_ADDRESS_MULTI_MILLIONAIRE` | Same for `multi-millionaire`. |
| `TON_MAINNET_ALPHA_VAULT_ADDRESS_MULTI_MILLIONAIRE` | Same for `multi-millionaire`. |

## Required Signing Secrets And Artifact Paths

Use the templates in `docs/spec/capital-production-artifacts/` and replace them with real signed evidence before `CAPITAL_MAINNET_SIGNING_ENABLED=true`.

- `DATABASE_URL`
- `CAPITAL_AUDIT_REPORT_PATH`
- `CAPITAL_LEGAL_APPROVAL_PATH`
- `CAPITAL_TESTNET_REHEARSAL_ARTIFACT_PATH`
- `CAPITAL_RESERVE_VAULT_REDEMPTION_VERIFICATION_PATH`
- `CAPITAL_APP_REWARD_POOL_POLICY_PATH`

## Required CSP / TonConnect Inputs

| Field | How to get it |
| --- | --- |
| `CAPITAL_TONCONNECT_BRIDGE_ORIGINS` | Copy the official wallet bridge/frame origins from TonConnect-supported wallets used in production QA. |
| `CAPITAL_CSP_CONNECT_SRC` | Include production API, Indexer, RPC, explorer, and TonConnect bridge origins. |
| `CAPITAL_CSP_FRAME_SRC` | Include TonConnect wallet frame origins. |
| `CAPITAL_CSP_IMG_SRC` | Include explorer/image origins needed by public pages. |
| `CAPITAL_CSP_MANIFEST_SRC` | Include the official website origin that serves TonConnect manifest. |

## Gate Commands

Local structure check without hitting production services:

```bash
npm run capital:gate:production -- --skip-network
```

Full production gate after production URLs are live:

```bash
npm run capital:gate:production
```

Mainnet signing remains disabled until the full production gate passes and the owner signs off on the gray launch.
