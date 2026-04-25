# 72H Capital v1 Contract Audit Report

Status: no-go for production mainnet signing.
Date: 2026-04-25.
Auditor: Codex local contract/security review. This is not an independently signed external audit certificate.

## Scope

Reviewed against `docs/spec/capital-production-artifacts/external-audit-scope.md`.

Primary scope covered:

- `/Users/yudeyou/Desktop/72h-capital-contracts/contracts/*.tact`
- `/Users/yudeyou/Desktop/72h-capital-contracts/src/contracts/*.ts`
- `/Users/yudeyou/Desktop/72h-capital-contracts/src/config/capital.constants.ts`
- `/Users/yudeyou/Desktop/72h-capital-contracts/src/encoding/*.ts`
- `/Users/yudeyou/Desktop/72h-capital-contracts/src/types/*.ts`
- `/Users/yudeyou/Desktop/72h-capital-contracts/scripts/{deploy-testnet.ts,deploy.ts,plan-mainnet-tonconnect-deploy.ts,verify-testnet.ts,rehearse-testnet-reserve.ts}`
- `/Users/yudeyou/Desktop/72h-capital-contracts/deployments/*.json`
- `/Users/yudeyou/Desktop/72h-capital-api/src/routes/{capital.ts,admin.ts}`
- `/Users/yudeyou/Desktop/72h-capital-api/src/repositories/capital-repository.ts`
- `/Users/yudeyou/Desktop/72h-capital-api/migrations/*.sql`
- `/Users/yudeyou/Desktop/72h-capital-indexer/src/ton/*`
- `/Users/yudeyou/Desktop/72h-capital-indexer/src/store/*`
- `/Users/yudeyou/Desktop/72h-capital-shared/src`
- `/Users/yudeyou/Desktop/72hours/scripts/capital-production-gate.mjs`
- `/Users/yudeyou/Desktop/72hours/src/lib/capital-intents.ts`

## Executive Decision

Production mainnet launch must remain blocked. The current codebase is suitable for controlled testnet rehearsal only. The core production invariants in the audit scope are not enforced on-chain:

- Reserve redemption does not return Jettons to users.
- Reward claims are unauthenticated, placeholder-priced, and do not pay Jettons.
- The vault Jetton wallet validation is tied to `TestJetton72HWallet` code, not proven compatible with the official mainnet `72H` Jetton.
- `AdminMultisig` is not the owner/executor of the production contracts in the mainnet plan and does not execute governed payloads.
- Registry seat identity is not app-scoped, causing cross-app seat collisions.

## Version And Artifact Snapshot

Git snapshot:

- `/Users/yudeyou/Desktop/72hours`: `70dd0b2bce75f412eadfddc68647dd69764927b4` on `refs/heads/codex/public-site-release-shell`.
- `/Users/yudeyou/Desktop/72h-capital-contracts`: no `.git` metadata present in the local checkout.
- `/Users/yudeyou/Desktop/72h-capital-api`: no `.git` metadata present in the local checkout.
- `/Users/yudeyou/Desktop/72h-capital-indexer`: no `.git` metadata present in the local checkout.
- `/Users/yudeyou/Desktop/72h-capital-shared`: no `.git` metadata present in the local checkout.
- `/Users/yudeyou/Desktop/72h-capital-admin`: no `.git` metadata present in the local checkout.

Artifact gap: exact commit hashes for the sibling repos could not be produced from local metadata. Treat this as an audit handoff gap before any signed external audit.

Compiled code BOC SHA-256:

| Contract | SHA-256 |
| --- | --- |
| `AdminMultisig` | `1b4fe35e62a21f02b1a4cd532a07cdcfc1d72a6a5e4b469043e606c2a0e9df24` |
| `CapitalRegistry` | `aabb5d4a0bfa1effde67fad00c223a14775a22c30af297dac8142c976b9e46fe` |
| `ReserveVault` | `00bbf0fa5d8afe2106365821bda528e05a4c5b9269bc0578e8f4e3ad9edb056e` |
| `AlphaVault` | `7367d33322d3b8ebb0ea452dc806f853682a2dc081a36ce693c2220976e08b3c` |
| `AppRewardPool` | `8c38f213f5fa28c130fcbca0dba1128ad909755afe96ee4432e2f2573a5eefbc` |
| `Treasury` | `742ed5366bc3d85d22ce6eaed588dfe53fd922d2c8d75e674c402880a18bfbdc` |
| `TestJetton72H` | `eb64e24b4616325ab5928233295ee67cffbd4e806b2c1b66589ccba1e00ad604` |

Compiled package SHA-256:

| Contract | SHA-256 |
| --- | --- |
| `AdminMultisig` | `80b3e3ea2074eeeeaaabb633d8c86e9041beaef881ee0342b30bc1688be2f1ea` |
| `CapitalRegistry` | `e46b5f3251c2d0c0f164f402689dd916dabaf0b2d57665d417a421604e813488` |
| `ReserveVault` | `190ec2372c067cb57dd295e5ea8dc94a7fc443a0412a0d644fc4bfbabe588942` |
| `AlphaVault` | `31e85fb6fbc14c9a4ef280458583a6c685f8af846df0c388c6d7d02f93188a1e` |
| `AppRewardPool` | `684c91e15b877c1060bc56734cbe74e97c69cb1cbb3fa0708533edfa731fd6f2` |
| `Treasury` | `5e61620ab8f6f9a22208fdc7f90652054920457f132ead3cb2c9f26e0e79613a` |
| `TestJetton72H` | `8ffe9c9901c05faa7f494be595b8831a560cc04874f05b6c885a5d8262acbd9a` |

Official mainnet `72H` Jetton check:

- Address checked: `EQDvE0ffdwvOhILjRJKFd2bIU9t5H9bG3-SKRidqavZjRsw8`.
- TonAPI response on 2026-04-25 reported `symbol=72H`, `decimals=9`, `mintable=false`, `interfaces=["jetton_master"]`, `total_supply="100000000000000000000"`.
- Source URL: `https://tonapi.io/v2/jettons/EQDvE0ffdwvOhILjRJKFd2bIU9t5H9bG3-SKRidqavZjRsw8`.

## Verification Performed

Passed:

- `npm run tact:build` in `/Users/yudeyou/Desktop/72h-capital-contracts`.
- `npm run typecheck` in `/Users/yudeyou/Desktop/72h-capital-contracts`.
- `npm run test` in `/Users/yudeyou/Desktop/72h-capital-contracts`: 3 files, 41 tests passed.
- `npm run lint` in `/Users/yudeyou/Desktop/72h-capital-api`.
- `npm run lint` in `/Users/yudeyou/Desktop/72h-capital-indexer`.
- `npm run typecheck` in `/Users/yudeyou/Desktop/72h-capital-shared`.
- `npm run lint` in `/Users/yudeyou/Desktop/72h-capital-admin`.
- `npm run plan:mainnet:tonconnect` generated `/Users/yudeyou/Desktop/72h-capital-contracts/deployments/mainnet.tonconnect.json` with the approved mainnet Jetton master and `H72H_ENABLE_MAINNET_TACT_MESSAGES=false`.

Warnings and blocked checks:

- `npm run tact:build` emitted Node `MaxListenersExceededWarning`; build still completed.
- `npm run capital:gate:production -- --skip-network` failed as expected because production env and artifact paths are absent.
- `git status` could not run on this machine because the Xcode license has not been accepted; sibling repos also lack `.git` metadata.

## Findings

### P0-01: Reserve redemption only mutates accounting and never pays Jettons

Evidence:

- `/Users/yudeyou/Desktop/72h-capital-contracts/contracts/ReserveVault.tact:74` through `:105` handles `RecordPrincipalRedeem`.
- The handler updates `lotRedeemedById`, `principalBySeat`, and `totalPrincipal72H`, but sends no `JettonTransfer` from the vault-owned Jetton wallet back to the user.
- The contract header also states Jetton payout dispatch is not complete at `/Users/yudeyou/Desktop/72h-capital-contracts/contracts/ReserveVault.tact:12`.

Impact:

Users can sign a "redeem" request that reduces contract accounting while their official `72H` Jettons remain in the vault Jetton wallet. This violates the primary v1 requirement that mature Reserve principal is redeemable from the same vault.

Required remediation:

- Implement actual Jetton payout dispatch to the owner wallet for matured principal.
- Add bounce/failure accounting so state is not finalized unless the Jetton transfer succeeds or is safely recoverable.
- Add tests and rehearsal evidence proving user wallet balance increases and vault Jetton wallet balance decreases by the redeemed amount.

### P0-02: Reward claims are unauthenticated, placeholder-priced, and do not pay Jettons

Evidence:

- `/Users/yudeyou/Desktop/72h-capital-contracts/contracts/AppRewardPool.tact:54` through `:80` accepts `ClaimReward`.
- The caller supplies only `seatType`, `seatNumber`, and `weight`; no owner, registry proof, signature, or seat ownership check exists.
- Claim amount is `availableRewards72H / 100` at `/Users/yudeyou/Desktop/72h-capital-contracts/contracts/AppRewardPool.tact:66` through `:69`.
- No Jetton transfer is sent to the claimant; the header states payout dispatch and registry eligibility are incomplete at `/Users/yudeyou/Desktop/72h-capital-contracts/contracts/AppRewardPool.tact:10`.

Impact:

Any address can claim against any valid-looking seat number. If payout is later added naively to `sender()`, claims become stealable. Even before payout, an attacker can drain the pool's accounting and block legitimate claims.

Required remediation:

- Bind claims to Registry-authenticated app, seat type, seat number, and owner.
- Replace the synthetic `1%` formula with audited reward-per-weight accounting.
- Dispatch Jetton payouts and handle insufficient pool/bounce behavior.
- Add negative tests for nonexistent seats, wrong app, wrong owner, duplicate claims, and cadence violations.

### P0-03: Mainnet Jetton wallet validation is derived from test-token wallet code

Evidence:

- `ReserveVault` computes the expected Jetton wallet with `initOf TestJetton72HWallet(self.jettonMaster, myAddress())` at `/Users/yudeyou/Desktop/72h-capital-contracts/contracts/ReserveVault.tact:149` through `:152`.
- `AppRewardPool` uses the same pattern at `/Users/yudeyou/Desktop/72h-capital-contracts/contracts/AppRewardPool.tact:94` through `:96`.
- `AlphaVault` uses the same pattern at `/Users/yudeyou/Desktop/72h-capital-contracts/contracts/AlphaVault.tact:207` through `:210`.
- Mainnet planning injects the official master at `/Users/yudeyou/Desktop/72h-capital-contracts/scripts/plan-mainnet-tonconnect-deploy.ts:185` through `:188`.

Impact:

The official `72H` Jetton master is a separate mainnet contract. A Jetton wallet address is a function of the master, owner, and wallet code. Unless the official master uses exactly the same wallet code as `TestJetton72HWallet`, the vaults will reject legitimate official Jetton transfer notifications or accept only the local test-wallet address model.

Required remediation:

- Do not hard-code test wallet code for production validation.
- Either configure verified official vault Jetton wallet addresses at deployment or prove and pin the official wallet code hash used for address derivation.
- Add a mainnet read-only rehearsal that compares each vault getter with the official master `get_wallet_address(vault)` result.

### P0-04: Planned governance is single EOA ownership; `AdminMultisig` is metadata-only

Evidence:

- `AdminMultisig.ExecuteOperation` only marks operations executed and records nonce at `/Users/yudeyou/Desktop/72h-capital-contracts/contracts/AdminMultisig.tact:87` through `:101`; it sends no governed payload.
- The contract header states arbitrary outbound payload execution is not complete at `/Users/yudeyou/Desktop/72h-capital-contracts/contracts/AdminMultisig.tact:8`.
- Mainnet planning initializes `CapitalRegistry`, `ReserveVault`, `AppRewardPool`, and `AlphaVault` owners directly with `TON_MAINNET_ADMIN_ADDRESS`, not the `AdminMultisig` address, at `/Users/yudeyou/Desktop/72h-capital-contracts/scripts/plan-mainnet-tonconnect-deploy.ts:212` through `:225`.

Impact:

The deployed `AdminAuthority` cannot govern the scoped contracts. Privileged ownership remains a single externally controlled admin wallet. This is a known governance risk in the scope, but the additional mismatch is that the multisig/admin contract is not actually in the execution path.

Required remediation:

- Decide explicitly whether v1 ships with single-admin EOA or contract-owned governance.
- If contract-owned governance is intended, make scoped contracts owned by the governance contract and implement audited payload execution, replay domain separation, and signer rotation.
- If single-admin EOA is accepted for gray launch, remove misleading multisig claims from production artifacts and require written owner risk acceptance plus strict launch limits.

### P0-05: `CapitalRegistry` Reserve owner mapping is not app-scoped

Evidence:

- `reserveSeatByOwner` is keyed only by `Address` at `/Users/yudeyou/Desktop/72h-capital-contracts/contracts/CapitalRegistry.tact:35`.
- `AssignReserveSeat` returns early for an owner already present at `/Users/yudeyou/Desktop/72h-capital-contracts/contracts/CapitalRegistry.tact:71` through `:73`.
- TS lifecycle keys are app-scoped, for example `formatCapitalOwnerStorageKey(app, owner)` at `/Users/yudeyou/Desktop/72h-capital-contracts/src/types/lifecycle.ts:82`.

Impact:

The same wallet cannot be represented correctly across `72hours`, `wan`, and `multi-millionaire`. A deposit into a second app can assign local state in that app's `ReserveVault` while the Registry refuses to record the second app seat.

Required remediation:

- Key Registry Reserve identity by `(appId, owner)` and expose getters that include `appId`.
- Add tests for the same owner allocating across all three apps.
- Add migration or redeploy guidance because existing registry state cannot be safely reinterpreted.

### P1-01: ReserveVault and Registry can diverge when the Registry callback bounces or fails

Evidence:

- `ReserveVault.getOrAssignSeat` writes local seat state and increments `nextSeatNumber` before sending `AssignReserveSeat` to Registry at `/Users/yudeyou/Desktop/72h-capital-contracts/contracts/ReserveVault.tact:113` through `:127`.
- No bounced-message handler reconciles failed Registry callbacks.
- Registry rejects callbacks from any sender other than the bound vault at `/Users/yudeyou/Desktop/72h-capital-contracts/contracts/CapitalRegistry.tact:67` through `:69`.

Impact:

A misbound Registry, unsupported app ID, insufficient message value, or bounce can leave ReserveVault state committed while Registry state is missing or stale. API/indexer consumers will disagree about the seat source of truth.

Required remediation:

- Make seat assignment atomic or explicitly two-phase.
- Add bounce handlers and failure state.
- Test unbound registry, wrong app, insufficient TON, and duplicate notification paths.

### P1-02: Pause state is not enforced by contracts or API intent generation

Evidence:

- Admin pause/resume writes `capital_apps.status` at `/Users/yudeyou/Desktop/72h-capital-api/src/repositories/capital-repository.ts:734` through `:794`.
- Intent generation prepares sendable testnet transactions in `buildPreparedTactTransaction` without checking app pause state at `/Users/yudeyou/Desktop/72h-capital-api/src/routes/capital.ts:416` through `:489`.
- `ReserveVault`, `AlphaVault`, and `AppRewardPool` contain no pause flag or pause checks on sensitive write paths.

Impact:

Admin/API pause state, contract pause state, and public CTA state can disagree. If message gates are enabled, paused apps can still generate wallet-signable requests.

Required remediation:

- Add fail-closed API checks before returning `transactionRequest`.
- Add contract-level pause gates for allocation, redemption, reward claim, and Alpha settlement where required.
- Add production gate checks for all pause/signing flags.

### P1-03: API redemption intent is hard-coded to `lotId=1`

Evidence:

- `/Users/yudeyou/Desktop/72h-capital-api/src/routes/capital.ts:478` through `:485` returns `RecordPrincipalRedeem` with `lotId: 1`.
- The request body has no mature lot selection and no on-chain getter lookup before preparing the payload.

Impact:

Any wallet with a different matured lot receives an invalid or unintended redemption payload. This also cannot support partial redemption across multiple matured lots.

Required remediation:

- Require lot selection from a reconciled on-chain source.
- Verify owner, maturity, remaining amount, and app before producing a wallet message.
- Include query IDs/idempotency so accidental duplicate submissions cannot double-redeem.

### P1-04: Indexer Reserve projections are not authenticated enough for production read models

Evidence:

- The poller decodes any `transfer_notification` body found in watched account in/out messages at `/Users/yudeyou/Desktop/72h-capital-indexer/src/ton/testnet-poller.ts:257` through `:323`.
- It does not verify that the notification source is the vault's official Jetton wallet or that the destination is the expected vault.
- When metadata is missing, app and seat can come from configured defaults at `/Users/yudeyou/Desktop/72h-capital-indexer/src/ton/testnet-poller.ts:288` through `:290`.
- The generated Tact Reserve forward payload is binary app/action data, not the text/JSON metadata decoded by `/Users/yudeyou/Desktop/72h-capital-indexer/src/ton/jetton.ts:76` through `:95`.

Impact:

The indexer can create wrong or spoofed read-model projections. It also cannot derive actual seat number from the current chain event without calling contract getters or consuming authoritative contract events.

Required remediation:

- Verify watched role, message source, message destination, and official Jetton wallet address.
- Decode the actual Tact forward payload or emit explicit contract events.
- Reconcile with contract getters before writing production projections.

### P1-05: Mainnet deployment signing page loads unpinned third-party JavaScript

Evidence:

- `/Users/yudeyou/Desktop/72h-capital-contracts/scripts/plan-mainnet-tonconnect-deploy.ts:120` loads `https://unpkg.com/@tonconnect/ui@latest/dist/tonconnect-ui.min.js`.
- The generated page is used to submit mainnet deployment batches.

Impact:

The signing surface depends on mutable third-party code at execution time. A CDN compromise, package compromise, or unexpected package update can alter the deployment transaction shown to the admin wallet.

Required remediation:

- Vendor or pin an exact audited TonConnect UI asset with SRI.
- Prefer a reproducible local/offline signer script that prints message hashes for independent verification.
- Require two-person review of all deployment BOCs and state init hashes before signing.

### P1-06: Public API and read models fall back to local/mock data on Postgres read/write failures

Evidence:

- Intent writes fall back from Postgres to file store at `/Users/yudeyou/Desktop/72h-capital-api/src/routes/capital.ts:706` through `:708`.
- Public reads fall back from Postgres to Indexer/local mock data at `/Users/yudeyou/Desktop/72h-capital-api/src/routes/capital.ts:749`, `:762` through `:764`, and `:865` through `:868`.
- Postgres write failures return `undefined` for non-sensitive intent writes at `/Users/yudeyou/Desktop/72h-capital-api/src/repositories/capital-repository.ts:363` through `:365`.

Impact:

In production, database or indexer failure can silently downgrade custody views and intent tracking to stale local data. That is unsafe if the UI presents these projections near wallet actions.

Required remediation:

- In production mode, fail closed for wallet-signable actions when Postgres or indexer reconciliation is unavailable.
- Clearly mark read-only fallback views as stale/non-authoritative.
- Add production tests that simulate DB outage and confirm signing stays disabled.

### P1-07: Alpha yield settlement and claim paths are accounting-only

Evidence:

- `SettleAlphaCycle` lets owner/treasury add settled yield metadata at `/Users/yudeyou/Desktop/72h-capital-contracts/contracts/AlphaVault.tact:104` through `:134`.
- `ClaimAlphaYield` records claimed yield but sends no Jettons at `/Users/yudeyou/Desktop/72h-capital-contracts/contracts/AlphaVault.tact:136` through `:152`.
- Alpha registry callback protocol is marked incomplete at `/Users/yudeyou/Desktop/72h-capital-contracts/contracts/AlphaVault.tact:11` through `:14`.

Impact:

Alpha must remain closed. The contract records admin-declared yield and user claims without reward custody or payout enforcement.

Required remediation:

- Keep Alpha disabled until yield custody, settlement proof, registry identity, and payout mechanics are implemented and audited.

### P2-01: Production gate is strong on required artifacts but misses several launch-critical flags

Evidence:

- `/Users/yudeyou/Desktop/72hours/scripts/capital-production-gate.mjs:20` through `:42` lists required env fields.
- It checks the approved mainnet Jetton master and non-Postgres DB mode at `/Users/yudeyou/Desktop/72hours/scripts/capital-production-gate.mjs:186` through `:239`.
- It does not require `H72H_ENABLE_MAINNET_TACT_MESSAGES=false` before rehearsal, does not require mock admin disabled, and does not validate API/indexer fail-closed behavior.

Impact:

The gate catches many missing artifacts, but it is not sufficient by itself to prevent premature signing or unsafe operational mode.

Required remediation:

- Add explicit checks for mainnet signing flags, mock admin flags, testnet mock Jetton absence, indexer write mode, and API fail-closed mode.

### P2-02: Treasury is a legacy synthetic accounting scaffold and must stay out of production

Evidence:

- Treasury funding increments internal balance without Jetton receipt at `/Users/yudeyou/Desktop/72h-capital-contracts/contracts/Treasury.tact:69` through `:73`.
- Batch execution subtracts internal balance but sends no Jettons at `/Users/yudeyou/Desktop/72h-capital-contracts/contracts/Treasury.tact:96` through `:121`.
- The header marks it legacy and incomplete at `/Users/yudeyou/Desktop/72h-capital-contracts/contracts/Treasury.tact:1` through `:11`.

Impact:

If included in production artifacts or UI flows, Treasury can imply distributions that did not happen on-chain.

Required remediation:

- Exclude Treasury from v1 production deploy manifests or fully implement and audit real Jetton custody/dispatch.

### P2-03: Contract event surface is insufficient for reconciliation

Evidence:

- The scoped Tact contracts do not emit explicit events for seat assignment, lot creation, redemption, reward funding/claim, Alpha settlement/completion, pause/unpause, or Registry binding.
- The Indexer compensates by decoding Jetton notifications and using defaults.

Impact:

Production reconciliation is fragile and requires getter polling or inference. Missing event fields are already causing seat/app ambiguity.

Required remediation:

- Add an audited event schema or getter-reconciliation protocol.
- Include app ID, owner, seat type, seat number, lot ID, amount, status, and query ID in all relevant events.

### P2-04: Reserve full redemption does not transition seat lifecycle to historical on-chain

Evidence:

- `RecordPrincipalRedeem` reduces principal and lot accounting at `/Users/yudeyou/Desktop/72h-capital-contracts/contracts/ReserveVault.tact:91` through `:105`.
- No status field tracks `locked`, `active`, `matured`, or `historical`.
- TS rules require `fullRedemptionStatus: 'historical'` at `/Users/yudeyou/Desktop/72h-capital-contracts/src/config/capital.constants.ts:27` through `:29`.

Impact:

The product rulebook describes a lifecycle that the chain cannot prove. Reallocation/reactivation semantics remain TS-only.

Required remediation:

- Implement on-chain or explicitly indexed lifecycle state, with tests for full redemption and reactivation.

### P3-01: TestJetton is acceptable for rehearsal but not robust enough for production-like assumptions

Evidence:

- `TestJetton72H` is marked testnet-only at `/Users/yudeyou/Desktop/72h-capital-contracts/contracts/TestJetton.tact:1` through `:12`.
- Transfer and burn flows lack bounce recovery for failed downstream internal transfers.

Impact:

This is acceptable only if it remains testnet-only. It must not be used to infer official mainnet Jetton wallet compatibility without separate proof.

Required remediation:

- Keep all production manifests free of `TestJetton72H`.
- Verify official mainnet Jetton wallet behavior directly.

## Positive Controls Observed

- Reserve first allocation minimum is enforced in `ReserveVault`.
- Reserve lot unlock uses a 72-day duration.
- Reserve per-vault seat cap is 72.
- Alpha app thresholds are implemented as `72,000 72H` and `720,000 72H` for `multi-millionaire`.
- Alpha seat cap is 9 and direct principal redemption always reverts.
- `AppRewardPool` keeps reward accounting separate from Reserve principal.
- Mainnet TonConnect plan uses the approved `72H` Jetton master and writes `H72H_ENABLE_MAINNET_TACT_MESSAGES=false`.
- Production gate rejects missing production artifacts and wrong mainnet Jetton master when env is supplied.

## Remediation Acceptance Criteria

Before any production mainnet signing:

1. Fix all P0 findings and re-run contract audit.
2. Provide exact immutable commit hashes for every repo in scope.
3. Provide fresh `npm run tact:build`, `npm run typecheck`, and `npm run test` output from the final contract commit.
4. Add testnet rehearsals proving:
   - Reserve allocation, top-up, partial redemption, full redemption, and reallocation.
   - Actual Reserve Jetton payout on redemption.
   - RewardPool funding and authenticated reward payout.
   - Cross-app same-owner Reserve allocations.
   - Pause fail-closed behavior across API and contracts.
5. Verify official mainnet `72H` master and derived vault Jetton wallets via live RPC.
6. Replace the unpinned mainnet deploy HTML dependency.
7. Run production gate with real production env and no `--skip-network`.
8. Complete one internal mainnet rehearsal with signing still disabled for public users.

## Final Sign-off

Final auditor sign-off: withheld.

The current contract boundary must not be used for production mainnet user funds. It may be used for controlled testnet rehearsal if clearly labeled as testnet-only and if operators understand that several production behaviors are placeholders.
