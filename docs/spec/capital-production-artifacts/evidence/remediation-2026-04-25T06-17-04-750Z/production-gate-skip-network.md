# production-gate-skip-network

cwd: /Users/yudeyou/Desktop/72hours
command: node scripts/capital-production-gate.mjs --skip-network
startedAt: 2026-04-25T06:17:20.448Z
finishedAt: 2026-04-25T06:17:20.468Z
exitCode: 1
expectedExitCodes: 1
ok: true

## stdout
```

```

## stderr
```
{
  "ok": false,
  "message": "Capital production gate failed. Fix every listed field before enabling mainnet signing.",
  "networkChecksSkipped": true,
  "errors": [
    {
      "code": "missing-env",
      "field": "CAPITAL_PRODUCTION_API_BASE_URL",
      "message": "CAPITAL_PRODUCTION_API_BASE_URL is required."
    },
    {
      "code": "missing-env",
      "field": "CAPITAL_PRODUCTION_INDEXER_BASE_URL",
      "message": "CAPITAL_PRODUCTION_INDEXER_BASE_URL is required."
    },
    {
      "code": "missing-env",
      "field": "CAPITAL_TONCONNECT_MANIFEST_URL",
      "message": "CAPITAL_TONCONNECT_MANIFEST_URL is required."
    },
    {
      "code": "missing-env",
      "field": "CAPITAL_MAINNET_RPC_URL",
      "message": "CAPITAL_MAINNET_RPC_URL is required."
    },
    {
      "code": "missing-env",
      "field": "CAPITAL_MAINNET_EXPLORER_TX_URL_PATTERN",
      "message": "CAPITAL_MAINNET_EXPLORER_TX_URL_PATTERN is required."
    },
    {
      "code": "missing-env",
      "field": "TON_MAINNET_72H_JETTON_MASTER_ADDRESS",
      "message": "TON_MAINNET_72H_JETTON_MASTER_ADDRESS is required."
    },
    {
      "code": "missing-env",
      "field": "TON_MAINNET_ADMIN_ADDRESS",
      "message": "TON_MAINNET_ADMIN_ADDRESS is required."
    },
    {
      "code": "missing-env",
      "field": "H72H_CAPITAL_DB_MODE",
      "message": "H72H_CAPITAL_DB_MODE is required."
    },
    {
      "code": "missing-env",
      "field": "DATABASE_URL",
      "message": "DATABASE_URL is required."
    },
    {
      "code": "missing-env",
      "field": "H72H_TELEGRAM_BOT_TOKEN",
      "message": "H72H_TELEGRAM_BOT_TOKEN is required."
    },
    {
      "code": "missing-env",
      "field": "H72H_TELEGRAM_ALERT_CHAT_ID",
      "message": "H72H_TELEGRAM_ALERT_CHAT_ID is required."
    },
    {
      "code": "missing-env",
      "field": "CAPITAL_MONITORING_OWNER",
      "message": "CAPITAL_MONITORING_OWNER is required."
    },
    {
      "code": "missing-env",
      "field": "CAPITAL_ROLLBACK_APPROVAL_OWNER",
      "message": "CAPITAL_ROLLBACK_APPROVAL_OWNER is required."
    },
    {
      "code": "missing-env",
      "field": "CAPITAL_TONCONNECT_BRIDGE_ORIGINS",
      "message": "CAPITAL_TONCONNECT_BRIDGE_ORIGINS is required."
    },
    {
      "code": "missing-env",
      "field": "CAPITAL_CSP_CONNECT_SRC",
      "message": "CAPITAL_CSP_CONNECT_SRC is required."
    },
    {
      "code": "missing-env",
      "field": "CAPITAL_CSP_FRAME_SRC",
      "message": "CAPITAL_CSP_FRAME_SRC is required."
    },
    {
      "code": "missing-env",
      "field": "CAPITAL_CSP_IMG_SRC",
      "message": "CAPITAL_CSP_IMG_SRC is required."
    },
    {
      "code": "missing-env",
      "field": "CAPITAL_CSP_MANIFEST_SRC",
      "message": "CAPITAL_CSP_MANIFEST_SRC is required."
    },
    {
      "code": "missing-env",
      "field": "CAPITAL_AUDIT_REPORT_PATH",
      "message": "CAPITAL_AUDIT_REPORT_PATH is required."
    },
    {
      "code": "missing-env",
      "field": "CAPITAL_LEGAL_APPROVAL_PATH",
      "message": "CAPITAL_LEGAL_APPROVAL_PATH is required."
    },
    {
      "code": "missing-env",
      "field": "CAPITAL_TESTNET_REHEARSAL_ARTIFACT_PATH",
      "message": "CAPITAL_TESTNET_REHEARSAL_ARTIFACT_PATH is required."
    },
    {
      "code": "missing-env",
      "field": "CAPITAL_RESERVE_VAULT_REDEMPTION_VERIFICATION_PATH",
      "message": "CAPITAL_RESERVE_VAULT_REDEMPTION_VERIFICATION_PATH is required."
    },
    {
      "code": "missing-env",
      "field": "CAPITAL_APP_REWARD_POOL_POLICY_PATH",
      "message": "CAPITAL_APP_REWARD_POOL_POLICY_PATH is required."
    },
    {
      "code": "missing-env",
      "field": "TON_MAINNET_RESERVE_VAULT_ADDRESS_72HOURS",
      "message": "TON_MAINNET_RESERVE_VAULT_ADDRESS_72HOURS is required."
    },
    {
      "code": "missing-env",
      "field": "TON_MAINNET_RESERVE_VAULT_JETTON_WALLET_ADDRESS_72HOURS",
      "message": "TON_MAINNET_RESERVE_VAULT_JETTON_WALLET_ADDRESS_72HOURS is required."
    },
    {
      "code": "missing-env",
      "field": "TON_MAINNET_APP_REWARD_POOL_ADDRESS_72HOURS",
      "message": "TON_MAINNET_APP_REWARD_POOL_ADDRESS_72HOURS is required."
    },
    {
      "code": "missing-env",
      "field": "TON_MAINNET_APP_REWARD_POOL_JETTON_WALLET_ADDRESS_72HOURS",
      "message": "TON_MAINNET_APP_REWARD_POOL_JETTON_WALLET_ADDRESS_72HOURS is required."
    },
    {
      "code": "missing-env",
      "field": "TON_MAINNET_ALPHA_VAULT_ADDRESS_72HOURS",
      "message": "TON_MAINNET_ALPHA_VAULT_ADDRESS_72HOURS is required."
    },
    {
      "code": "missing-env",
      "field": "TON_MAINNET_RESERVE_VAULT_ADDRESS_WAN",
      "message": "TON_MAINNET_RESERVE_VAULT_ADDRESS_WAN is required."
    },
    {
      "code": "missing-env",
      "field": "TON_MAINNET_RESERVE_VAULT_JETTON_WALLET_ADDRESS_WAN",
      "message": "TON_MAINNET_RESERVE_VAULT_JETTON_WALLET_ADDRESS_WAN is required."
    },
    {
      "code": "missing-env",
      "field": "TON_MAINNET_APP_REWARD_POOL_ADDRESS_WAN",
      "message": "TON_MAINNET_APP_REWARD_POOL_ADDRESS_WAN is required."
    },
    {
      "code": "missing-env",
      "field": "TON_MAINNET_APP_REWARD_POOL_JETTON_WALLET_ADDRESS_WAN",
      "message": "TON_MAINNET_APP_REWARD_POOL_JETTON_WALLET_ADDRESS_WAN is required."
    },
    {
      "code": "missing-env",
      "field": "TON_MAINNET_ALPHA_VAULT_ADDRESS_WAN",
      "message": "TON_MAINNET_ALPHA_VAULT_ADDRESS_WAN is required."
    },
    {
      "code": "missing-env",
      "field": "TON_MAINNET_RESERVE_VAULT_ADDRESS_MULTI_MILLIONAIRE",
      "message": "TON_MAINNET_RESERVE_VAULT_ADDRESS_MULTI_MILLIONAIRE is required."
    },
    {
      "code": "missing-env",
      "field": "TON_MAINNET_RESERVE_VAULT_JETTON_WALLET_ADDRESS_MULTI_MILLIONAIRE",
      "message": "TON_MAINNET_RESERVE_VAULT_JETTON_WALLET_ADDRESS_MULTI_MILLIONAIRE is required."
    },
    {
      "code": "missing-env",
      "field": "TON_MAINNET_APP_REWARD_POOL_ADDRESS_MULTI_MILLIONAIRE",
      "message": "TON_MAINNET_APP_REWARD_POOL_ADDRESS_MULTI_MILLIONAIRE is required."
    },
    {
      "code": "missing-env",
      "field": "TON_MAINNET_APP_REWARD_POOL_JETTON_WALLET_ADDRESS_MULTI_MILLIONAIRE",
      "message": "TON_MAINNET_APP_REWARD_POOL_JETTON_WALLET_ADDRESS_MULTI_MILLIONAIRE is required."
    },
    {
      "code": "missing-env",
      "field": "TON_MAINNET_ALPHA_VAULT_ADDRESS_MULTI_MILLIONAIRE",
      "message": "TON_MAINNET_ALPHA_VAULT_ADDRESS_MULTI_MILLIONAIRE is required."
    }
  ]
}
```
