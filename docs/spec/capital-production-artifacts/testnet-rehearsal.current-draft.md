# Capital Testnet Rehearsal Current Draft

Status: current local draft evidence, not a final production approval artifact.

Generated: 2026-04-24T23:47:45.717Z
Manifest: /Users/yudeyou/Desktop/72h-capital-contracts/deployments/testnet.latest.json
Network: testnet

## Remediation Evidence Update

Updated: 2026-04-25T06:17:04.750Z

Local remediation evidence was regenerated after the ReserveVault/AppRewardPool/Registry fixes:

- Evidence index: `/Users/yudeyou/Desktop/72hours/docs/spec/capital-production-artifacts/evidence/remediation-2026-04-25T06-17-04-750Z/README.md`
- Re-audit handoff: `/Users/yudeyou/Desktop/72hours/docs/spec/capital-production-artifacts/capital-remediation-reaudit-handoff-2026-04-25.md`

Result:

- `72h-capital-contracts`: `npm run tact:build`, `npm run typecheck`, `npm run test`, and `npm run build` passed.
- Contract tests: 42 passed.
- `72h-capital-shared`: typecheck passed.
- `72h-capital-api`: check passed.
- `72h-capital-indexer`: check and poller tests passed.
- `72h-capital-admin`: build passed.
- `72hours`: lint and build passed.
- Production gate with `--skip-network` failed as expected because real production URLs, wallet addresses, artifact paths, Telegram alert config, owners, and deployment evidence are still missing.

This update is local engineering evidence only. It does not replace the required fresh testnet deployment and full on-chain rehearsal for the remediated contracts.

## Remediated Testnet Deployment

Updated: 2026-04-25T06:41:42Z

The remediated contracts were deployed to TON testnet and getter verification passed.

- Evidence index: `/Users/yudeyou/Desktop/72hours/docs/spec/capital-production-artifacts/evidence/testnet-remediated-2026-04-25T06-33-53Z/README.md`
- Manifest copy: `/Users/yudeyou/Desktop/72hours/docs/spec/capital-production-artifacts/evidence/testnet-remediated-2026-04-25T06-33-53Z/testnet.latest.json`
- Source manifest: `/Users/yudeyou/Desktop/72h-capital-contracts/deployments/testnet.latest.json`

Commands run:

```bash
cd /Users/yudeyou/Desktop/72h-capital-contracts
TON_TESTNET_ALLOW_DEPLOY_SEND=true npm run deploy:testnet:send
npm run verify:testnet
```

Result:

- Deploy completed with `sent=true`.
- `npm run verify:testnet` passed.
- Registry, ReserveVault, AppRewardPool, and AlphaVault getter verification passed.
- ReserveVault and AppRewardPool TestJetton wallet addresses were checked against TestJetton master getter evidence.
- TonCenter returned HTTP 429 several times; scripts retried and completed.

This is stronger than the previous draft because AppRewardPool is now deployed and verified. It still does not complete the full rehearsal until Reserve deposit/redeem payout and RewardPool fund/claim payout are executed or separately evidenced.

## Remediated User-Flow Rehearsal

Updated: 2026-04-25T06:55:00Z

Reserve deposit and RewardPool funding/claim were run against the remediated `72hours` testnet contracts.

Evidence index:

- `/Users/yudeyou/Desktop/72hours/docs/spec/capital-production-artifacts/evidence/testnet-remediated-2026-04-25T06-33-53Z/README.md`

Commands run:

```bash
cd /Users/yudeyou/Desktop/72h-capital-contracts
TON_TESTNET_ALLOW_REHEARSAL_SEND=true npm run rehearse:testnet:reserve:send
TON_TESTNET_ALLOW_REWARD_REHEARSAL_SEND=true npm run rehearse:testnet:reward:send
```

Results:

- Reserve deposit passed: Registry seat `1`, ReserveVault seat `1`, lot `1`, principal `720000000000`, Vault Jetton wallet balance `720000000000`.
- RewardPool payout/finalize passed for query `1000001001`: total funded `144000000000`, total claimed `72000000000`.
- A second test funding cycle remains in the `72hours` AppRewardPool as available test reward balance: `72000000000`.
- TonCenter returned HTTP 429 several times; scripts retried and completed.

Reserve redemption proof update:

- Local sandbox Reserve redemption payout proof is complete: `/Users/yudeyou/Desktop/72hours/docs/spec/capital-production-artifacts/evidence/testnet-remediated-2026-04-25T06-33-53Z/reserve-redemption-payout-sandbox-proof.md`.
- The deployed testnet vault uses a real 72-day lock, so the real mature-lot testnet redemption transaction is still pending unless a dedicated test-only short-lock deployment is approved.

Still pending:

- Real 72-day testnet Reserve redemption transaction. Same-day sandbox payout proof is complete, but the deployed testnet Vault uses the production 72-day lock.

API/Indexer/website reconciliation update:

- API remediated testnet env/config sync is complete.
- Indexer remediated testnet watched-address sync is complete.
- Indexer AppRewardPool payout decoder is complete for `ClaimReward`, `FinalizeRewardClaim`, and payout Jetton `Transfer` evidence.
- Website requires no direct Vault/Pool address sync.
- API check, Indexer check, Indexer poller tests, Website lint, and Website build passed.

## Automated Local Verification

Commands run on 2026-04-25 Asia/Shanghai:

```bash
cd /Users/yudeyou/Desktop/72h-capital-contracts
npm run verify:testnet
npm run rehearse:testnet:reserve
```

Result:

- `npm run verify:testnet` passed.
- TestJetton total supply: `720000000000`.
- `ReserveVault(72hours)` verified: next seat `2`, next lot `2`, total principal `720000000000`.
- `ReserveVault(wan)` verified: next seat `1`, next lot `1`, total principal `0`.
- `ReserveVault(multi-millionaire)` verified: next seat `1`, next lot `1`, total principal `0`.
- AlphaVault addresses are still planned/uninitialized on testnet, so getter verification was skipped by the verifier.
- `npm run rehearse:testnet:reserve` passed in dry-run mode and sent no transactions.
- Dry-run confirmed active manifest addresses, derived user/vault Jetton wallets, current balances, vault app/minimum, and planned mint/transfer payloads.
- TonCenter returned HTTP 429 several times; scripts retried and completed.

This is useful engineering evidence, but it is not enough for production by itself. Production still needs a fresh remediated testnet deployment, the full testnet flow covering RewardPool funding/claim, and a signed owner approval artifact.

## Contracts

- TestJetton72H: kQCxm_w2ynPHIm0k4NyFpfxj1rUlnwGgejBiI0m9Q7R10mYi
- AdminMultisig: kQB2k3ren0GJvnLTTpXJCHLg845n1QQ6V16W5pxZ8uuDabgN
- CapitalRegistry: kQBARc6Ef43_v75iZ9PSluSbWzAbVe2s38a0zHsd1hAo_tH-
- Treasury: kQA4E-7__ODIV0TgUMdTmHuxwYLG7YbgNTbHjhoy12xKFtLE
- ReserveVaults: {"72hours":"kQBcO6e9MTgjKJ1ODqz65XzWI4cxKok4qhJPaFQmeqkUEjxA","wan":"kQDa7rBz4n1_wMEHeZd4QPa1RHU18ZndQtFlP2OILYAOw5y8","multi-millionaire":"kQDlkTOaViRGyXZ0pHYanqmy_hv1lw85WLfWCaFQEpdiC1xF"}
- ReserveVaultJettonWallets: {"72hours":"kQD8KAvj11Qw6MD6kTRMCgYZ7fSe0dZBfYlDa6n_U9vyK-XX","wan":"kQAgZyfd3kDm4UN3bDZEMJbxlZ8U9zyCmgKWWENTYBxgpNQq","multi-millionaire":"kQCYXjOFk8YKVnDdN-d5mZnMamdaqMkzuJj-FawXS39boB9z"}
- AlphaVaults: {"72hours":"kQDFl4jq6rA5GWvjrlxTUh_axP7iAPNprybBUSr9wp6Y2f0U","wan":"kQComvaxsnSYnOqItw3LyCXAj9oZZrjzpvIUgq1Xw49Nytkt","multi-millionaire":"kQD0RNANT-2RLagZc0QeV9s10rsTn_VXvAR5LgGfomX2be_3"}
- AlphaVaultJettonWallets: {"72hours":"kQA2g0WudPo78T6XWKRmi1oMH0gkkhtdQpDT9fCSQq6R0Waw","wan":"kQCbuY9VQRHoF122K1Y0N0DYC0bcHHlIu6vG5CPWTGfkYCbr","multi-millionaire":"kQBWBaxWwVDyAaVqPV4735PL5sVQ00mgOH3HrS2ayvl0ZlZt"}
- ReserveVault(72hours): kQBcO6e9MTgjKJ1ODqz65XzWI4cxKok4qhJPaFQmeqkUEjxA
- ReserveVault(wan): kQDa7rBz4n1_wMEHeZd4QPa1RHU18ZndQtFlP2OILYAOw5y8
- ReserveVault(multi-millionaire): kQDlkTOaViRGyXZ0pHYanqmy_hv1lw85WLfWCaFQEpdiC1xF
- AlphaVault(72hours): kQDFl4jq6rA5GWvjrlxTUh_axP7iAPNprybBUSr9wp6Y2f0U
- AlphaVault(wan): kQComvaxsnSYnOqItw3LyCXAj9oZZrjzpvIUgq1Xw49Nytkt
- AlphaVault(multi-millionaire): kQD0RNANT-2RLagZc0QeV9s10rsTn_VXvAR5LgGfomX2be_3

## Required Final Replacement

- Deploy remediated testnet contracts.
- Attach official testnet Jetton wallet getter evidence for each ReserveVault and AppRewardPool.
- Attach `SetVaultJettonWallet` and `SetPoolJettonWallet` transactions.
- Attach verify:testnet output.
- Attach reserve rehearsal dry-run or send output.
- Attach RewardPool funding/claim rehearsal once deployed.
- Attach API/Indexer/Admin/Website JSON outputs and screenshots.
