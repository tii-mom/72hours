# 72H Capital v1 Remediation Re-Audit Handoff

Status: remediation handoff draft, not production approval.
Date: 2026-04-25

This document summarizes the implementation work completed after the `capital-audit-report-2026-04-25.md` No-Go review. It is intended as the input package for a fresh external re-audit. It must not be used as the final `CAPITAL_AUDIT_REPORT_PATH` for production launch.

## Production Decision Boundary

- Reserve is the only intended v1 launch path.
- Alpha production allocation and Alpha reward claim remain disabled.
- No on-chain governance or multisig execution is claimed for v1.
- Reserve principal remains in the app-specific `ReserveVault`.
- Rewards are funded separately through app-specific `AppRewardPool` contracts.
- Mainnet signing remains disabled until a new audit report, full testnet rehearsal, production artifacts, and internal mainnet rehearsal are complete.

## Remediation Summary

| Original finding | Remediation status | Primary files |
| --- | --- | --- |
| P0: Reserve redeem did not return Jetton principal. | Implemented pending redemption, Jetton payout dispatch, finalize-on-success, and bounce retry. | `/Users/yudeyou/Desktop/72h-capital-contracts/contracts/ReserveVault.tact`, `/Users/yudeyou/Desktop/72h-capital-contracts/src/contracts/ReserveVault.ts`, `/Users/yudeyou/Desktop/72h-capital-contracts/tests/capital-rules.spec.ts` |
| P0: RewardPool claim was unauthenticated and had no payout. | Implemented funding-only-from-pool-wallet, reward-per-weight accounting, owner-checked Reserve claims, pending payout, finalize, and bounce retry. Alpha claims are closed for v1. | `/Users/yudeyou/Desktop/72h-capital-contracts/contracts/AppRewardPool.tact`, `/Users/yudeyou/Desktop/72h-capital-contracts/src/contracts/AppRewardPool.ts`, `/Users/yudeyou/Desktop/72h-capital-contracts/tests/capital-rules.spec.ts` |
| P0: Mainnet Jetton wallet validation depended on test wallet assumptions. | Vault and pool now store official Jetton wallet addresses and reject notifications from any other sender. Production gate requires official wallet evidence after deploy. | `/Users/yudeyou/Desktop/72h-capital-contracts/contracts/ReserveVault.tact`, `/Users/yudeyou/Desktop/72h-capital-contracts/contracts/AppRewardPool.tact`, `/Users/yudeyou/Desktop/72hours/scripts/capital-production-gate.mjs`, `/Users/yudeyou/Desktop/72hours/.env.production.example` |
| P0: AdminMultisig was described as governance but not wired as execution authority. | v1 launch model now explicitly excludes on-chain governance execution. Production docs/gate treat it as non-core. | `/Users/yudeyou/Desktop/72hours/docs/spec/capital-production-launch-plan.md`, `/Users/yudeyou/Desktop/72hours/docs/spec/capital-production-owner-inputs.md`, `/Users/yudeyou/Desktop/72hours/docs/spec/capital-production-artifacts/legal-review-pack.md` |
| P0: Registry owner key was not app-scoped. | Reserve owner lookup is app-scoped; compatibility getter is deprecated and production paths must not depend on owner-only lookup. | `/Users/yudeyou/Desktop/72h-capital-contracts/contracts/CapitalRegistry.tact`, `/Users/yudeyou/Desktop/72h-capital-contracts/src/contracts/CapitalRegistry.ts`, `/Users/yudeyou/Desktop/72h-capital-contracts/tests/capital-rules.spec.ts` |

## Integration Remediation

- Public and API naming moved from `yield` to `reward`.
- `/v1/capital/reward/claim-intent` is the production route.
- Legacy `/v1/capital/yield/claim-intent` returns `410` and does not generate a sendable production payload.
- Reserve redeem intent now requires an explicit `lotId`.
- Alpha allocate and Alpha reward claim fail closed in v1 production.
- Website copy keeps Alpha closed and avoids fixed-return language.
- `Institutional Reserve/Alpha Seat` labels were replaced with `Large Reserve/Alpha Seat`.

## Known Design Constraints For Re-Audit

- The RewardPool cannot synchronously call Registry getters inside Tact. Eligibility is enforced by a local seat-owner mirror registered by the owner/Registry boundary and then checked against `sender()`. The auditor should review whether this mirror is acceptable for v1 or requires a stricter cross-contract protocol.
- Vault and pool official Jetton wallet addresses are set after deployment because the official wallet address depends on the deployed contract address. Production artifacts must include the official master getter evidence and the follow-up `SetVaultJettonWallet` / `SetPoolJettonWallet` transactions.
- Pending payout finalization currently accepts explicit owner/admin finalization paths in addition to Jetton excess handling. The auditor should confirm the finalization event model is sufficient and cannot finalize failed payouts incorrectly.
- Single-admin risk is accepted only for Reserve gray launch. This is an operational risk, not a claim of decentralized governance.

## Verification Already Run Locally

The previous local verification passed after remediation:

- `/Users/yudeyou/Desktop/72h-capital-contracts`: `npm run tact:build`, `npm run typecheck`, `npm run test`, `npm run build`.
- `/Users/yudeyou/Desktop/72h-capital-shared`: `npm run build`, `npm run typecheck`.
- `/Users/yudeyou/Desktop/72h-capital-api`: `npm run check`.
- `/Users/yudeyou/Desktop/72h-capital-indexer`: `npm run check`, `npm run test:poller`.
- `/Users/yudeyou/Desktop/72h-capital-admin`: `npm run build`.
- `/Users/yudeyou/Desktop/72hours`: `npm run lint`, `npm run build`.
- `/Users/yudeyou/Desktop/72hours`: `node scripts/capital-production-gate.mjs --skip-network` fails as expected while production artifacts and real addresses are missing.

Run `npm run capital:collect-remediation-evidence` from `/Users/yudeyou/Desktop/72hours` to regenerate the local evidence log.

## Re-Audit Must Confirm

- Reserve redemption actually pays out official 72H Jetton and only finalizes successful payout.
- Failed or bounced Reserve payout clears pending state and allows retry without double debit.
- RewardPool cannot pay from Reserve principal.
- RewardPool funding and claim math cannot exceed available reward custody.
- Wrong Jetton wallet senders are rejected.
- Wrong seat owner, wrong app, wrong seat type, and Alpha v1 claim paths are rejected.
- App-scoped Registry lookup prevents cross-app seat collisions.
- API cannot produce sendable production payloads when signing is disabled, app is paused, Alpha is closed, or legacy yield route is used.
- Indexer projections remain read-only views and reconcile with contract-owned Jetton wallets and getters.

## Required Evidence Still Missing

- Fresh external audit report after this remediation.
- Fresh testnet deployment using the remediated contracts.
- Full testnet Reserve deposit -> maturity simulation -> redemption payout artifact.
- Full testnet RewardPool funding -> Reserve reward claim payout artifact.
- Official testnet/mainnet Jetton wallet getter evidence for each Vault and Pool.
- Production Cloudflare/API/Indexer/Admin URLs and health checks.
- Production Telegram alert test.
- Final rollback owner and monitoring owner sign-off.

## Production Status

No-Go for production mainnet signing until the missing evidence above is complete and a new signed audit report replaces the historical No-Go report.
