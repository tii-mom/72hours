# Capital Evidence Index

This directory stores generated launch, remediation, and rehearsal evidence. It is intentionally excluded from active Codex context by `.codexignore`.

Open only the snapshot needed for the task.

## Snapshots

| Snapshot | Purpose | Status |
| --- | --- | --- |
| `production-2026-04-26T02-59-38Z/` | Production infrastructure snapshot after public website, production API Worker, production Indexer Worker, Neon schema migration, TON RPC key, and Telegram alert target were configured. | Infrastructure present; mainnet signing disabled; Indexer writes disabled. |
| `remediation-2026-04-26T05-01-01-905Z/` | Latest local remediation evidence bundle. | Pass; production network gate still expected to fail without external production inputs. |
| `remediation-2026-04-26T03-53-42-937Z/` | Earlier 2026-04-26 remediation evidence bundle. | Pass. |
| `remediation-2026-04-25T12-24-45-977Z/` | 2026-04-25 remediation bundle with API-mode portfolio smoke. | Pass. |
| `remediation-2026-04-25T06-17-04-750Z/` | Initial remediation evidence bundle. | Pass. |
| `testnet-remediated-2026-04-25T06-33-53Z/` | Remediated TON testnet deployment, getter verification, Reserve deposit, RewardPool payout rehearsal, and sandbox redemption proof. | Pass; real 72-day redeem transaction still pending. |

## Context Rule

For normal coding tasks, read `docs/CODEX_CONTEXT.md` instead of these files. For audit or launch tasks, read this index first, then open a single snapshot README and only the specific command output file needed.
