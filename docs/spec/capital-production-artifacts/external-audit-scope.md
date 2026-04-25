# 72H Capital v1 External Audit Scope

Status: draft audit handoff package.
Last updated: 2026-04-25

This document is the external smart-contract audit handoff scope for 72H Capital v1. It reflects the current state across:

- `/Users/yudeyou/Desktop/72h-capital-contracts`
- `/Users/yudeyou/Desktop/72h-capital-api`
- `/Users/yudeyou/Desktop/72h-capital-indexer`
- `/Users/yudeyou/Desktop/72h-capital-shared`
- `/Users/yudeyou/Desktop/72h-capital-admin`
- `/Users/yudeyou/Desktop/72hours`

## Audit Objective

Review whether the 72H Capital v1 TON contract boundary can safely support the intended first production release:

- Reserve first: users allocate official mainnet `72H` Jetton into an app-specific `ReserveVault`.
- Reserve principal stays in the same vault and can be partially or fully redeemed from that same vault after a 72-day lot lock.
- Rewards are separated from principal and funded through app-scoped reward pools.
- Alpha is higher-risk, 72-week, non-redeemable principal; Alpha should remain closed until explicitly approved after Reserve stabilizes.
- Admin/governance can register apps, bind vaults, pause/resume sensitive paths, and fund rewards, without being able to rewrite completed seat history or drain Reserve principal.

The audit should evaluate both the current deployable Tact contracts and the TypeScript business models/encoders that define intended production behavior. Any mismatch between Tact behavior and the TypeScript rulebook should be treated as an audit finding or launch blocker.

## In Scope

Primary contract sources:

- `/Users/yudeyou/Desktop/72h-capital-contracts/contracts/AdminMultisig.tact`
- `/Users/yudeyou/Desktop/72h-capital-contracts/contracts/CapitalRegistry.tact`
- `/Users/yudeyou/Desktop/72h-capital-contracts/contracts/ReserveVault.tact`
- `/Users/yudeyou/Desktop/72h-capital-contracts/contracts/AlphaVault.tact`
- `/Users/yudeyou/Desktop/72h-capital-contracts/contracts/AppRewardPool.tact`
- `/Users/yudeyou/Desktop/72h-capital-contracts/contracts/Treasury.tact`
- `/Users/yudeyou/Desktop/72h-capital-contracts/contracts/TestJetton.tact` for testnet compatibility only.

Supporting contract models and payload encoders:

- `/Users/yudeyou/Desktop/72h-capital-contracts/src/contracts/*.ts`
- `/Users/yudeyou/Desktop/72h-capital-contracts/src/config/capital.constants.ts`
- `/Users/yudeyou/Desktop/72h-capital-contracts/src/encoding/tactMessageCells.ts`
- `/Users/yudeyou/Desktop/72h-capital-contracts/src/encoding/transactionPayloadScaffolds.ts`
- `/Users/yudeyou/Desktop/72h-capital-contracts/src/types/*.ts`
- `/Users/yudeyou/Desktop/72h-capital-contracts/src/utils/capital-lifecycle.ts`

Deployment, verification, and rehearsals:

- `/Users/yudeyou/Desktop/72h-capital-contracts/scripts/deploy-testnet.ts`
- `/Users/yudeyou/Desktop/72h-capital-contracts/scripts/deploy.ts`
- `/Users/yudeyou/Desktop/72h-capital-contracts/scripts/plan-mainnet-tonconnect-deploy.ts`
- `/Users/yudeyou/Desktop/72h-capital-contracts/scripts/verify-testnet.ts`
- `/Users/yudeyou/Desktop/72h-capital-contracts/scripts/rehearse-testnet-reserve.ts`
- `/Users/yudeyou/Desktop/72h-capital-contracts/deployments/*.json`

Integration boundaries to inspect for unsafe assumptions:

- API intent generation and submission tracking in `/Users/yudeyou/Desktop/72h-capital-api/src/routes/capital.ts`.
- API admin sensitive actions, auth, audit logging, and idempotency in `/Users/yudeyou/Desktop/72h-capital-api/src/routes/admin.ts` and `migrations/*.sql`.
- Indexer TON poller, event decoding, idempotency, and projection writes in `/Users/yudeyou/Desktop/72h-capital-indexer/src/ton/*` and `/Users/yudeyou/Desktop/72h-capital-indexer/src/store/*`.
- Shared route/type contracts in `/Users/yudeyou/Desktop/72h-capital-shared/src`.
- Website production gate and launch artifacts in `/Users/yudeyou/Desktop/72hours/scripts/capital-production-gate.mjs` and `/Users/yudeyou/Desktop/72hours/docs/spec/capital-production-artifacts`.

## Out of Scope

- Website visual design and marketing pages, except where copy or UI can cause unsafe wallet actions.
- Social sharing, card image generation, nicknames, SEO, and non-critical display data.
- Any secret values, mnemonics, production database credentials, Cloudflare tokens, or local `.env*` files.
- Production mainnet deployment execution. The auditor should review deployment artifacts and scripts, but should not receive signing material.

## Key Security Assumptions

- Mainnet must use the official `72H` Jetton master: `EQDvE0ffdwvOhILjRJKFd2bIU9t5H9bG3-SKRidqavZjRsw8`.
- `TestJetton72H` is testnet-only and must never appear in mainnet manifests, API env, website config, or production TonConnect payloads.
- Users pay TON gas from their own wallets.
- Reserve principal is custodied by the relevant app `ReserveVault`; no off-chain liquidity queue may substitute for same-contract redemption.
- Reward funds are held separately in `AppRewardPool`; rewards may be zero and must never be paid from Reserve principal.
- Admin/governance is currently owner-accepted single-admin / 1 signature. This is a known governance risk and must be explicitly called out in the audit report.
- Admin/API pause state, contract pause state where implemented, and public CTA state must agree before wallet signing is enabled.
- Indexer/API projections are not the source of truth for custody. They are read models and must reconcile against chain state.
- `H72H_ENABLE_MAINNET_TACT_MESSAGES` must remain `false` until audited contracts, mainnet addresses, production artifacts, and an internal mainnet rehearsal are complete.

## Contract List

| Contract | Intended v1 role | Current notes for audit |
| --- | --- | --- |
| `AdminMultisig` / `AdminAuthority` | Single-admin privileged operation registry, replay metadata, emergency pause scopes. | Not a v1 production funds path. The Reserve gray launch does not claim on-chain governance or multisig execution. Auditor should treat single-admin operation as an accepted launch risk. |
| `CapitalRegistry` | App registry, vault binding, deterministic seat counters, owner-to-seat identity. | Reserve owner lookup is now app-scoped. The owner-only compatibility getter is deprecated and production paths must not depend on it. |
| `ReserveVault` | App-specific Reserve allocation vault, lot accounting, 72-day lock, same-contract principal redemption. | Current Tact path validates the configured official vault Jetton wallet, creates pending redemptions, dispatches Jetton payout, finalizes successful payouts, and clears pending state on bounce. |
| `AlphaVault` | App-specific 72-week non-redeemable Alpha vault with 7-week settlement metadata. | Alpha remains closed for v1 production signing. Principal redemption remains rejected. Auditor should verify disabled production intent paths and future Alpha risk boundaries. |
| `AppRewardPool` | App-scoped reward custody and claims, separate from principal. | Current Tact path validates the configured official pool Jetton wallet, records reward funding, uses reward-per-weight accounting, rejects Alpha claims for v1, and pays Reserve reward claims through pending payout/finalize/bounce retry. |
| `Treasury` | Legacy accounting scaffold for distribution batches. | Not the v1 reward path, but still present in build/deploy artifacts. Auditor should confirm whether it is excluded from production or safely inert. |
| `TestJetton72H` | Testnet-only Jetton rehearsal boundary. | Must be reviewed for testnet correctness and for safeguards preventing mainnet reuse. Not a production contract. |

## Business Rules To Validate

- Supported first-batch app slugs: `72hours`, `wan`, `multi-millionaire`.
- Reserve cap: 72 seats per app.
- Alpha cap: 9 seats per app.
- Reserve minimum first allocation: `720 72H`.
- Reserve lock: 72 days per independent lot.
- Reserve top-ups create independent lots.
- Reserve partial redemption is allowed only for matured lots.
- Reserve full redemption transitions the seat to historical but does not release the seat number.
- A later qualifying Reserve allocation by the same owner can reactivate the same seat.
- Alpha thresholds: `72hours = 72,000 72H`, `wan = 72,000 72H`, `multi-millionaire = 720,000 72H`.
- Alpha duration: 72 weeks.
- Alpha settlement cadence: 7 weeks.
- Alpha principal is non-redeemable before and after completion.
- Reserve reward weight is 1; Alpha reward weight is 10.
- Reward claims may be zero and must not imply fixed APY or guaranteed yield.

## Priority Risk Points

- App/owner keying: confirm the new app-scoped Reserve owner maps are used by production paths and that the deprecated owner-only getter cannot cause cross-app seat collisions.
- Redemption payout: confirm `ReserveVault.tact` only finalizes after a real official `72H` Jetton payout and that bounce/failure retry cannot double debit or double pay.
- Principal custody isolation: any admin, treasury, reward, or pause path must be unable to drain or repurpose Reserve principal.
- RewardPool claim math: confirm reward-per-weight accounting, pool-balance caps, Reserve owner checks, and v1 Alpha claim rejection. The current implementation uses a local seat-owner mirror rather than synchronous Registry getter calls; this must be explicitly reviewed.
- Alpha non-redeemability: all direct and indirect redemption/top-up/completion paths must preserve irreversible principal risk.
- Admin replay and target binding: operation id, nonce, target, scope, and payload hash must prevent replay across contracts, apps, chains, and deployments.
- Single-admin governance: one compromised admin key can pause, bind, or fund depending on final wiring. Auditor should recommend mitigations or launch limits.
- Jetton wallet assumptions: vaults derive expected Jetton wallet addresses using the configured master; audit must ensure mainnet official Jetton wallet derivation and notification validation are compatible.
- Tact/TS divergence: production behavior is partly in TS state machines and partly in Tact shells. The launch must not claim TS-only invariants are enforced on-chain unless they are actually implemented.
- Mainnet/testnet separation: manifests, env vars, TonConnect payloads, and API flags must not mix testnet mock Jetton addresses with mainnet.
- Indexer trust boundary: API/admin UI must not treat unconfirmed or stale indexer projections as custody truth.
- Event completeness: required events for allocation, top-up, redemption, reward funding/claim, Alpha settlement/completion, pause/unpause, and seat status changes must be sufficient for reconciliation.
- Gas/bounce failure behavior: internal Registry callbacks and Jetton transfer notifications must remain safe under failed sends, insufficient TON value, duplicate notifications, and bounced messages.
- Integer units: all `72H` amounts use 9 decimals; conversions between display amounts, Jetton atomic units, and TON native gas must be tested for off-by-scale errors.

## Suggested Audit Test Cases

Reserve and Registry:

- Allocate exactly `720 72H`; verify seat assignment, lot creation, principal balance, lock timestamp, Registry seat counter, and owner lookup.
- Reject first Reserve allocation below `720 72H`.
- Top up an existing Reserve seat below `720 72H`; verify independent lot creation and unchanged seat number.
- Allocate Reserve for the same wallet across all three apps; verify no cross-app seat collision.
- Fill 72 Reserve seats for one app; verify the 73rd allocation is rejected and other apps remain unaffected.
- Attempt redemption before lot maturity; verify rejection and unchanged accounting.
- Partially redeem a matured lot; verify lot redeemed amount, remaining principal, total principal, and no underflow.
- Fully redeem all matured lots; verify historical status in the intended Registry model and seat number is not recycled.
- Reallocate after historical status; verify same owner gets the same seat reactivated only where intended.
- Attempt redemption by a non-owner; verify rejection.
- Attempt redemption with amount greater than lot remaining amount; verify rejection.
- Verify actual Jetton payout dispatch; accounting-only redemption should fail production readiness.

Alpha:

- Allocate Alpha at exact app-specific thresholds for all apps.
- Reject Alpha below threshold, especially `multi-millionaire` below `720,000 72H`.
- Fill 9 Alpha seats for one app; verify the 10th is rejected.
- Top up an active Alpha seat; verify principal increases and completion timestamp does not reset unless explicitly intended.
- Attempt Alpha principal redemption before completion, after completion, and through malformed payloads; all must fail.
- Settle cycles only after each 7-week boundary; reject early, duplicate, skipped, or past-completion cycles.
- Mark completed only after 72 weeks; verify completion is terminal and does not unlock principal.

Rewards:

- Fund RewardPool for an app without affecting ReserveVault principal.
- Reject reward claims for non-existent seats, wrong seat type, wrong weight, or wrong app.
- Enforce Reserve 7-day and Alpha 7-week claim cadence.
- Verify reward-per-weight accounting, claim debt, and cadence behavior.
- Verify reward claim payout dispatch and insufficient-pool behavior.

Governance and pause:

- Non-admin cannot register apps, bind vaults, settle Alpha, set emergency state, or execute governed operations.
- Operation id/nonce/target/payload hash cannot be replayed across apps, contracts, or chains.
- Cancelled or executed operations cannot be executed again.
- Emergency pause blocks intended writes without rewriting history or blocking safe reads.
- Admin signer configuration, threshold, and future rotation path are explicit and test-covered.

Encoding and integration:

- Decode every TonConnect payload from `tactMessageCells.ts` and verify opcode, field order, app id, address, amount, forward TON value, and query id.
- Confirm API intent output never includes sendable mainnet messages unless production audit gates and `H72H_ENABLE_MAINNET_TACT_MESSAGES=true` are satisfied.
- Submit duplicate intent/submission payloads and verify idempotency.
- Poll confirmed TON transactions through Indexer and reconcile API projection with on-chain getters.
- Fuzz invalid app ids, malformed addresses, zero/negative amounts, oversized amounts, stale query ids, and duplicate Jetton notifications.

Deployment and environment:

- Build with `npm run tact:build`, `npm run typecheck`, and `npm run test` in `72h-capital-contracts`.
- Verify `plan:mainnet:tonconnect` output uses only official mainnet `72H` Jetton and mainnet addresses.
- Verify production gate rejects missing artifacts, testnet/staging URLs, wrong Jetton master, duplicated role addresses, invalid Telegram alert configuration, missing owners, and non-Postgres DB mode.
- Verify deployment manifests do not contain mnemonics, API keys, database URLs, or other secrets.

## Artifacts To Provide To Auditor

Code and dependency snapshots:

- Exact Git commit hashes for every sibling repo listed at the top of this document.
- `package-lock.json`, `package.json`, `tact.config.json`, and `tsconfig*.json` from `72h-capital-contracts`.
- Full `contracts/`, `src/`, `scripts/`, `tests/`, and `docs/` directories from `72h-capital-contracts`.
- Relevant API, Indexer, Shared, Admin, and Website files listed in the scope above.

Build outputs:

- Fresh output from `npm run tact:build`.
- Fresh output from `npm run typecheck`.
- Fresh output from `npm run test`.
- Generated `build/tact/**` ABI, `.code.boc`, `.pkg`, `.fc`, `.fif`, `.ts`, and generated Markdown files for scoped contracts.
- Hashes of generated BOC/package artifacts that are intended for deployment.

Deployment and network artifacts:

- `deployments/testnet.latest.json` and timestamped testnet manifests.
- `deployments/mainnet.example.json`.
- `deployments/mainnet.tonconnect.json` or its final replacement.
- Mainnet planned address derivation output for all contracts.
- Final production mainnet addresses for Admin, Registry, ReserveVaults, AlphaVaults, and AppRewardPools.
- Official mainnet `72H` Jetton verification evidence from a TON RPC/explorer showing master address, decimals, mintability, and total supply.

Rehearsal and verification evidence:

- Final `verify:testnet` output.
- Final Reserve allocation/redeem rehearsal output, including tx hashes and getter snapshots.
- Final RewardPool funding/claim rehearsal output once implemented.
- Final Alpha allocation/settlement/completion negative-path rehearsal before Alpha opens.
- Indexer projection export JSON/SQL and reconciliation notes.
- API intent payload samples for Reserve allocate, Reserve redeem, Alpha allocate, and reward claim.
- TonConnect request samples and decoded cell field table.

Operational and product artifacts:

- `/Users/yudeyou/Desktop/72hours/docs/spec/capital.md`
- `/Users/yudeyou/Desktop/72hours/docs/spec/capital-production-launch-plan.md`
- `/Users/yudeyou/Desktop/72hours/docs/spec/capital-launch-readiness.md`
- `/Users/yudeyou/Desktop/72hours/docs/spec/capital-operations-runbook.md`
- `/Users/yudeyou/Desktop/72hours/docs/spec/capital-production-artifacts/testnet-rehearsal.current-draft.md`
- Final replacements for:
  - `CAPITAL_AUDIT_REPORT_PATH`
  - `CAPITAL_LEGAL_APPROVAL_PATH`
  - `CAPITAL_TESTNET_REHEARSAL_ARTIFACT_PATH`
  - `CAPITAL_RESERVE_VAULT_REDEMPTION_VERIFICATION_PATH`
  - `CAPITAL_APP_REWARD_POOL_POLICY_PATH`

Redacted production configuration:

- Production gate input list with secrets redacted.
- Cloudflare Worker/Pages project names and environment names.
- CSP allowlist for API, Indexer, TonConnect manifest, wallet bridges, RPC, and explorer.
- Admin governance policy and owner acceptance of single-admin risk.
- Pause/resume and rollback runbook for website/API/Indexer/Admin/contract incident states.

## Explicit Launch Blockers For Auditor Awareness

- External audit is not complete.
- Current remediation has not been independently re-audited.
- Fresh testnet deployment with the remediated contracts is not complete.
- Reserve redemption payout and RewardPool claim payout still need full testnet transaction evidence.
- Official Vault/Pool Jetton wallet getter evidence and post-deploy wallet-setting transactions are still missing.
- AppRewardPool eligibility uses a local seat-owner mirror instead of a synchronous Registry getter protocol; auditor must approve or require redesign.
- Alpha production allocation and Alpha reward claim remain closed for v1.
- Admin multisig does not yet execute arbitrary governed payloads.
- Testnet has active Reserve rehearsal evidence, but `AdminMultisig`, `AppRewardPool`, and `AlphaVault` were still planned/uninitialized in the current testnet draft.
- Mainnet signing must remain disabled until the audit report, remediation evidence, final artifacts, production gate, and internal mainnet rehearsal all pass.
