# Remediated Testnet Deployment Evidence

Status: deployment, getter verification, Reserve deposit, RewardPool payout rehearsal, Reserve redemption sandbox proof, and Indexer AppRewardPool payout decoding passed; real 72-day testnet redeem transaction still pending.

Generated: 2026-04-25T06:41:42Z
Network: TON testnet
Manifest: `/Users/yudeyou/Desktop/72hours/docs/spec/capital-production-artifacts/evidence/testnet-remediated-2026-04-25T06-33-53Z/testnet.latest.json`

## Commands Run

```bash
cd /Users/yudeyou/Desktop/72h-capital-contracts
npm run typecheck
npm run test
TON_TESTNET_ALLOW_DEPLOY_SEND=true npm run deploy:testnet:send
npm run verify:testnet
TON_TESTNET_ALLOW_REHEARSAL_SEND=true npm run rehearse:testnet:reserve:send
TON_TESTNET_ALLOW_REWARD_REHEARSAL_SEND=true npm run rehearse:testnet:reward:send
npx vitest run tests/reserve-redemption-payout.spec.ts
cd /Users/yudeyou/Desktop/72h-capital-api && npm run check
cd /Users/yudeyou/Desktop/72h-capital-indexer && npm run check && npm run test:poller
cd /Users/yudeyou/Desktop/72hours && npm run lint
cd /Users/yudeyou/Desktop/72hours && npm run build
```

## Result

- Contract typecheck passed.
- Contract tests passed: 43 tests.
- Remediated testnet deploy sent successfully.
- `npm run verify:testnet` passed.
- Reserve deposit rehearsal sent and verified.
- RewardPool funding, claim payout, and finalize rehearsal sent and checked.
- Reserve redemption payout sandbox proof passed.
- API check passed after syncing the remediated testnet ReserveVault/AppRewardPool addresses.
- Indexer check and poller projection tests passed after syncing the remediated testnet watched-address coverage and adding AppRewardPool payout decoding.
- Website lint and build passed; website does not directly hold Vault/Pool addresses.
- RPC returned TonCenter HTTP 429 several times; the scripts retried and completed.

## Deployer

- Deployer wallet: `kQCxJ05yeawVWlsN5SfJ-obajgh2lFffR-O7ebH_s_wqQRIl`
- Governance mode: single-admin testnet authority.

## Deployed Contracts

- TestJetton72H: `kQCxm_w2ynPHIm0k4NyFpfxj1rUlnwGgejBiI0m9Q7R10mYi`
- AdminAuthority: `kQCjQ4J6ihxsqkG95Ew6k-8j-2o9Ydn8NFVHQgxbR1p_zdLe`
- CapitalRegistry: `kQC9e5L3196LgKS-1KIZKryJPkZ8RDdgCkKEsIlOe1vQX_YF`
- Treasury: `kQDh_LPIxN_Iv9CXRHq4PXPaXlIzQVBaWrbhiZu2P-Alyn1F`

## ReserveVaults

| App | ReserveVault | TestJetton wallet |
| --- | --- | --- |
| `72hours` | `kQBLNN8yPjZkJScpdLEHtKWK2SVo1AQdcXRq101quxehCuO-` | `kQDtsxTuF8mD5Q32HGTpTPd9Mi-ddYUE0KHcf1MAdhZdTaKW` |
| `wan` | `kQBqfKlyTlpEzcGOQP9KI1Cm1RB05yaOBxO_4CibuxgyUf5T` | `kQBucjyICFObOniY1lSaJf4C1hdJL2sacY8cb6qp8aBJJUx5` |
| `multi-millionaire` | `kQD1deHkTIB023tn3dryEI0_CIpY2DuBDO1PfUdqHEkUce5b` | `kQC6YtvidvCTfrTiC5PcQ22NSWXbFsnhXjQl8Xo_crblNp3G` |

## AppRewardPools

| App | AppRewardPool | TestJetton wallet |
| --- | --- | --- |
| `72hours` | `kQCm8florP84b0TPy9KzxgRSct8S5-69vzAaptifzTKvlmQD` | `kQDNh0wz36uBJFrYsxS6-B8QwJGlYeVDR2Xr8r0JBDDZ9neh` |
| `wan` | `kQA_kns2TrFNS_45x_CCMRVHc2cxNn0tG79HR1qvlfvCztuU` | `kQCDvHgR_gsi2sWz90vDYz05sun-e7aveV7XD7KObtDqOTKg` |
| `multi-millionaire` | `kQB4JINiTmXFqoG1dZ7QTGsm_UQM2b-BJrYVRGxiv--_HQYY` | `kQCJ_lIL0ljJ0lWGk-7Fz4aHvuEEvKDMVX4qLqeVG9Aq_Gsv` |

## AlphaVaults

Alpha remains closed for v1 production signing. Testnet AlphaVaults are deployed only for verification and future negative-path testing.

| App | AlphaVault | TestJetton wallet |
| --- | --- | --- |
| `72hours` | `kQC4DsAl5pk5BWd41eZqZcs91MVJFt96MQARm0s0wLFZTtZM` | `kQCVTvh0bUKhPTC9hVowoXJNe7-CvkjT7pQ04zRKHgUVQCsY` |
| `wan` | `kQBQHba8T6A6F-pN8VmfU1u14XcsIntn4cVgujCoD1MZJfX2` | `kQDDw0W-Yzq6WqXP-08OaCxA3v6UZVwc_GOfKUsEayRphLj9` |
| `multi-millionaire` | `kQBCj5KTlqvkoCk1jcfQZi35rAQaNm_-yjjzB9-GP07CVlr7` | `kQBAoGnZcNBIqzbk5uTYPawgqjJpNNGPGbRe396Wfm12VDlE` |

## Verified Invariants

- Manifest `sent=true`.
- All listed contracts are active.
- Registry owner and seat caps match expected values.
- Registry app-to-ReserveVault bindings match the manifest.
- Each ReserveVault owner, registry, Jetton master, app id, minimum allocation, next seat, next lot, total principal, and configured Jetton wallet were verified.
- Each ReserveVault configured Jetton wallet matches the TestJetton master `get_wallet_address(vault)` evidence.
- Each AppRewardPool owner, Jetton master, app id, available reward accounting, funded/claimed accounting, reward-per-weight, weight, and configured Jetton wallet were verified.
- Each AppRewardPool configured Jetton wallet matches the TestJetton master `get_wallet_address(pool)` evidence.
- AlphaVaults are active and getter verification passed.

## Reserve Deposit Rehearsal

Command:

```bash
TON_TESTNET_ALLOW_REHEARSAL_SEND=true npm run rehearse:testnet:reserve:send
```

Result:

- App: `72hours`.
- Registry seat: `1`.
- ReserveVault seat: `1`.
- Lot: `1`.
- Lot amount: `720000000000` atomic units.
- Principal by seat: `720000000000`.
- Total principal: `720000000000`.
- User Jetton balance after deposit: `0`.
- ReserveVault Jetton wallet balance after deposit: `720000000000`.
- TestJetton total supply after deposit: `1440000000000`.

## RewardPool Funding And Claim Rehearsal

Command:

```bash
TON_TESTNET_ALLOW_REWARD_REHEARSAL_SEND=true npm run rehearse:testnet:reward:send
```

Result:

- App: `72hours`.
- Registered Reserve reward seat: `reserve #1`.
- Reward claim query finalized: `1000001001`.
- User Jetton balance after payout/finalize: `72000000000`.
- AppRewardPool Jetton wallet balance after the second test funding cycle: `72000000000`.
- AppRewardPool available rewards after the second test funding cycle: `72000000000`.
- AppRewardPool total funded: `144000000000`.
- AppRewardPool total claimed: `72000000000`.

Note: the reward rehearsal was run twice while developing the finalize step. The first claim payout was finalized and is reflected in `totalClaimed=72000000000`. The second test funding remains in the pool as available test reward balance.

## Remaining Rehearsal Work

- Reserve deposit against the remediated `72hours` ReserveVault is complete.
- Reserve redemption payout local sandbox proof is complete: `/Users/yudeyou/Desktop/72hours/docs/spec/capital-production-artifacts/evidence/testnet-remediated-2026-04-25T06-33-53Z/reserve-redemption-payout-sandbox-proof.md`.
- Real testnet maturity/redemption payout transaction remains pending because the deployed vault uses the real 72-day lot lock.
- Register the Reserve seat in `AppRewardPool` is complete for `72hours`.
- Fund `AppRewardPool` with test 72H is complete for `72hours`.
- Run Reserve reward claim payout proof is complete for `72hours`.
- Run Indexer/API/website reconciliation against this manifest.

## API / Indexer / Website Reconciliation

Completed checks:

- API staging config now points at the remediated testnet ReserveVault and AppRewardPool addresses.
- API README documents `/v1/capital/reward/claim-intent`; legacy `/yield/claim-intent` remains a 410-only migration boundary.
- Website holds no direct Vault/Pool address config and continues to consume API/Indexer data.
- Indexer can project manual `capital.reward.claimed` events and includes AppRewardPool addresses in watched raw coverage.
- Indexer AppRewardPool decoder now recognizes `ClaimReward`, `FinalizeRewardClaim`, and payout Jetton `Transfer` messages.
- TON testnet poller dry-run can decode AppRewardPool payout messages into reward-claim events when app/seat defaults are configured.
- `72h-capital-api`: `npm run check` passed.
- `72h-capital-indexer`: `npm run check` and `npm run test:poller` passed; poller tests now include 6 tests.
- `72hours`: `npm run lint` and `npm run build` passed.

Remaining reconciliation risk:

- Finalize messages do not contain amount or wallet fields, so the live poller uses the AppRewardPool payout Jetton transfer as the claim projection source. Finalize is decoded as typed evidence, but it is not enough by itself to create a full claim projection.
