# 72H V2 Jetton Development Spec

> Historical/void note (2026-04-30): references to the old Jetton address in this spec identify the legacy pre-V2 contract being replaced. The current official V2 Jetton master is `EQBGIzEDvvKObStrcVb6i5Z1-8uYZYtUrYzF2rFZU7xUAXVg`.


Status: draft for development, audit, deployment, and wallet risk review
Created: 2026-04-27

## 1. Purpose

72H V2 is a replacement mainnet Jetton for the existing 72H token. The goal is to fix the operational and wallet-risk issues seen on the old deployment by shipping a more standard, verifiable, and wallet-friendly TON Jetton.

The V2 token contract must stay minimal. It must only implement standard Jetton issuance and transfer behavior. Old-holder replacement will be handled by snapshot-based manual airdrop, not by V2 token logic or a migration contract.

## 2. Problems To Fix From Old Deployment

The legacy pre-V2 mainnet 72H token address being replaced was:

```text
EQDvE0ffdwvOhILjRJKFd2bIU9t5H9bG3-SKRidqavZjRsw8
```

Known issues:

- Wallet risk labels appeared in OKX Wallet, including suspected honeypot, imitation risk, low liquidity, and mint mechanism risk.
- Chain getters indicate `mintable=false` and `admin_address=null`, but wallet risk systems still flagged the token.
- The deployed master source and exact compiler/build artifacts are not available in this repository as a complete verification package.
- The token source is not verified on public indexers.
- Holder count, liquidity, and distribution transparency are weak.
- Project social and metadata indexing are incomplete across wallet and DEX systems.

V2 must solve these issues by using a recognizable standard implementation, preserving complete build evidence, verifying source/code hash immediately after deployment, and publishing clear allocation addresses.

## 3. Design Principles

- The token contract is not the business system.
- The Jetton master and wallet must be as standard as possible.
- The token must not contain trading controls.
- The token must not contain app, reward, vault, sale, vesting, or migration logic.
- Supply must be fixed after deployment.
- All deployment artifacts must be reproducible.
- All allocation addresses must be public and labeled.
- Old-holder replacement must be handled as an off-chain snapshot and manual V2 airdrop operation.
- V2 contract development scope must only include the new token issuance contract and its deployment/verification tooling.

## 4. Token Parameters

Recommended V2 parameters:

| Field | Value |
| --- | --- |
| Name | `72H` or `72H V2` |
| Symbol | `72H` |
| Decimals | `9` |
| Total supply | `100,000,000,000 72H` |
| Raw total supply | `100000000000000000000` |
| Network | TON mainnet |
| Mint status after launch | closed |
| Admin after launch | null, burned, or permanently disabled |
| Old-holder replacement | Snapshot-based manual V2 airdrop |

Name decision:

- Use `72H` if the project wants V2 to fully replace the old token and avoid fragmenting branding.
- Use `72H V2` during the replacement period if wallets and DEX listings need to distinguish old and new contracts.

The final name must be consistent across metadata, website, DEX listing, wallet submissions, and replacement announcement.

## 5. Required Jetton Master Behavior

The Jetton master must support the standard getter and wallet derivation behavior:

- `get_jetton_data`
- `get_wallet_address`

After final mint closure, `get_jetton_data()` must return:

```text
total_supply = 100000000000000000000
mintable = false
admin_address = null or permanently disabled address
jetton_content = verified metadata cell
jetton_wallet_code = verified standard wallet code
```

The master must not expose any active post-launch mint path.

## 6. Required Jetton Wallet Behavior

The Jetton wallet must support standard wallet behavior:

- `transfer`
- `internal_transfer`
- `burn`
- `burn_notification`
- `transfer_notification`
- `excesses`
- `get_wallet_data`

Transfers must be permissionless. A normal holder must be able to transfer V2 tokens to any valid address without owner approval.

## 7. Forbidden Token Logic

The V2 Jetton master and wallet must not include:

- Buy tax
- Sell tax
- Transfer tax
- Blacklist
- Whitelist-only transfers
- Trading pause
- Global transfer pause
- Max sell amount
- Max wallet amount
- Anti-bot trading blocks
- DEX-specific sell restrictions
- Owner-controlled balance edits
- Owner-controlled forced transfer
- Owner-controlled burn from user wallets
- Upgrade logic controlled by a single admin
- Hidden mint route after mint closure
- App reward logic
- Old token migration logic
- Vault redemption logic
- Vesting logic

If any operational control is required, it belongs in a separate business contract, not in the Jetton token contract.

## 8. Implementation Requirement

Use a widely recognized standard TON Jetton implementation.

Acceptable implementation options:

- A canonical or well-known open-source TON Jetton master/wallet implementation.
- A minimal Tact or FunC implementation that exactly follows standard Jetton message and getter behavior.

The implementation must be reproducible:

- Pin compiler version.
- Pin package manager version.
- Pin dependency versions.
- Commit source code.
- Commit deployment scripts.
- Store generated master and wallet BOC files.
- Record master code hash and wallet code hash.
- Record all init parameters.
- Record metadata URI and content hash.

Do not reuse any file named or documented as test-only for mainnet token issuance.

## 9. Metadata Requirement

Metadata must be finalized before deployment.

Required fields:

```json
{
  "name": "72H",
  "symbol": "72H",
  "decimals": "9",
  "description": "72H is the native token of the 72-hour TON game and sale ecosystem.",
  "image": "ipfs://...",
  "website": "https://...",
  "telegram": "https://t.me/...",
  "twitter": "https://x.com/...",
  "social": ["https://...", "https://..."]
}
```

Metadata rules:

- Use immutable IPFS/Arweave content where possible.
- Avoid changing logo, symbol, and description after launch.
- Website must publish the V2 contract address and old contract address.
- Website must publish replacement instructions and allocation addresses.
- Metadata image must be clean, square, and consistent with wallet listing rules.

## 10. Allocation Model

Do not distribute supply into many unknown contracts to reduce risk labels. Use a small number of public, labeled addresses.

Recommended allocation table:

| Category | Suggested holder | Notes |
| --- | --- | --- |
| Old-holder airdrop | Multisig/deployer airdrop wallet | Sends V2 manually from the approved snapshot |
| DEX liquidity | LP wallet / DEX pool | Public pool address and seed amount |
| Team | Multisig vesting or lock contract | Public vesting schedule |
| Ecosystem rewards | RewardPool contract | Public funding and claim rules |
| Reserve | Multisig cold wallet or lock contract | Public policy and signers |
| Market operations | Multisig wallet | Limited float, public purpose |

Every allocation must have:

- Address
- Label
- Amount
- Percentage
- Lock status
- Unlock schedule, if any
- Admin signer policy

## 11. Snapshot-Based Manual Airdrop

Because the old token has a small holder set and no new holder addresses are expected, V2 replacement should use a holder snapshot and manual airdrop instead of a migration contract.

Snapshot evidence:

- Human-readable snapshot: `/Users/yudeyou/Desktop/72hours/docs/spec/capital-production-artifacts/72h-old-token-holder-snapshot-2026-04-27.md`
- Raw JSON snapshot: `/Users/yudeyou/Desktop/72hours/docs/spec/capital-production-artifacts/72h-old-token-holder-snapshot-2026-04-27.json`
- Old Jetton master: `EQDvE0ffdwvOhILjRJKFd2bIU9t5H9bG3-SKRidqavZjRsw8`
- Snapshot holder count: `20`

Manual airdrop rules:

1. Classify every snapshot address before airdrop: user, project, DEX pool, treasury, or other contract.
2. Exclude DEX pool and project-controlled inventory from user compensation unless the team explicitly approves otherwise.
3. Send V2 only from the approved airdrop wallet or multisig.
4. Preserve a transaction hash for every V2 airdrop transfer.
5. Publish an airdrop completion table with owner address, V2 amount, and transaction hash.
6. Publish that post-snapshot old-token buyers are not included unless the team decides otherwise.

This manual airdrop process is an operations task. It must not add any logic to the V2 Jetton master or wallet.

## 12. Locking And Reward Contracts

If team, reward, reserve, or ecosystem allocations need contracts, deploy them separately from the V2 token.

Each contract must be:

- Source verified.
- Labeled publicly.
- Limited to its own purpose.
- Pausable only if needed for that business flow, not token transfers.
- Covered by audit or internal review.

These contracts must not control user token transfers outside their own custody.

## 13. Testnet Rehearsal

Before mainnet, run a full testnet rehearsal.

Required testnet checks:

- Deploy V2 master and wallet.
- Mint full test supply.
- Close mint.
- Confirm `mintable=false`.
- Confirm `admin_address=null` or disabled.
- Transfer between normal wallets.
- Burn from a normal wallet.
- Add test DEX liquidity if available.
- Buy from pool.
- Sell into pool.
- Verify getters.
- Export transaction hashes.
- Export screenshots from Tonviewer/TonAPI/TonCenter where useful.

## 14. Mainnet Deployment Sequence

Recommended order:

1. Freeze source code and metadata.
2. Create reproducible build package.
3. Compile master and wallet.
4. Record compiler, dependency, and code hashes.
5. Deploy V2 master.
6. Mint total supply once.
7. Close mint.
8. Re-query `get_jetton_data`.
9. Verify `mintable=false`.
10. Verify `admin_address=null` or disabled.
11. Transfer the old-holder airdrop allocation to the approved airdrop wallet or multisig.
12. Create DEX liquidity pool.
13. Run small buy and sell tests.
14. Deploy or fund vesting/reward/reserve addresses if they are already approved and independently verified.
15. Publish contract and allocation table.
16. Submit verification/listing materials to wallets and DEXs.
17. Announce old-token replacement and V2 official contract address.

## 15. Verification Package

Create a final verification folder containing:

- Token source files.
- Compiler version.
- Dependency lockfile.
- Build command.
- Deploy command.
- Master BOC.
- Wallet BOC.
- Master code hash.
- Wallet code hash.
- Metadata JSON.
- Metadata content hash.
- Deployer wallet.
- Deployment transaction hash.
- Mint transaction hash.
- Close-mint transaction hash.
- `get_jetton_data` snapshot after close-mint.
- `get_wallet_address` sample snapshots.
- DEX pool address.
- Buy test transaction hash.
- Sell test transaction hash.
- Old-holder snapshot file.
- Airdrop transaction table after manual distribution.
- Allocation table.

## 16. Wallet And DEX Submission Materials

Prepare a public submission package for OKX Wallet, Tonviewer, Tonkeeper, STON.fi, DeDust, DexScreener, and other indexers.

Required materials:

- Project name
- Token name and symbol
- New V2 Jetton master address
- Old Jetton master address
- Replacement announcement URL
- Official website
- Telegram
- X/Twitter
- Logo URL
- Metadata URI
- Source verification URL
- Master code hash
- Wallet code hash
- Total supply proof
- Mint closed proof
- Admin disabled proof
- DEX pool URL
- Liquidity proof
- Buy transaction proof
- Sell transaction proof
- Allocation table URL
- Contact email or Telegram handle

## 17. OKX Risk Review Positioning

Use this position in wallet appeals:

```text
72H V2 is a newly deployed standard TON Jetton replacing the legacy 72H token.
The V2 Jetton is fixed supply, non-mintable after deployment, source-verifiable, and does not contain blacklist, tax, pause, whitelist, or sell-restriction logic.
Old-holder replacement is handled by a fixed snapshot and manual V2 airdrop because the old holder set is small and stable.
All allocation, liquidity, airdrop, reward, and reserve addresses are publicly labeled.
```

## 18. Acceptance Criteria

V2 is ready for public replacement only when all criteria are met:

- Source code is committed.
- Build is reproducible.
- Master and wallet code hashes are recorded.
- Metadata is immutable and correct.
- Mainnet master is deployed.
- Total supply equals expected supply.
- Mint is closed.
- Admin is null or permanently disabled.
- Normal transfer succeeds.
- Burn succeeds.
- DEX buy succeeds.
- DEX sell succeeds.
- Old-holder snapshot is finalized.
- Manual airdrop transaction table is complete before public replacement is marked finished.
- Allocation table is public.
- Wallet/DEX submission package is complete.

## 19. Recommended Decision

Proceed with V2 only if the team accepts that the token contract itself must remain simple. For this phase, contract development should only cover the new V2 Jetton issuance contract and its deployment/verification tooling. Old-holder replacement is handled by snapshot-based manual airdrop outside the token contract.

This is the cleanest path to a token that is easier for OKX Wallet, Tonviewer, Tonkeeper, DEX indexers, and users to understand.
