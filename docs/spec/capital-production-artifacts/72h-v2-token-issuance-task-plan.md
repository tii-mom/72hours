# 72H V2 Token Issuance Task Plan

Status: draft execution plan
Created: 2026-04-27

## Scope

This plan only covers the new 72H V2 Jetton issuance work:

- New standard Jetton master contract
- New standard Jetton wallet contract
- Metadata
- Build reproducibility
- Testnet rehearsal
- Mainnet deployment
- Source/code verification
- Wallet and DEX submission materials

Out of scope:

- Old token contract changes
- Old token burn
- Old-to-new migration contract
- App reward contracts
- Vault contracts
- Lockup contracts
- Capital product contracts
- Manual airdrop execution after V2 deployment

The old-token holder snapshot has already been saved separately for later operations:

- `/Users/yudeyou/Desktop/72hours/docs/spec/capital-production-artifacts/72h-old-token-holder-snapshot-2026-04-27.md`
- `/Users/yudeyou/Desktop/72hours/docs/spec/capital-production-artifacts/72h-old-token-holder-snapshot-2026-04-27.json`

## Phase 1: Implementation Choice

Tasks:

- Select the standard TON Jetton implementation to use.
- Confirm language and toolchain: FunC or Tact.
- Pin compiler version.
- Pin dependency versions.
- Confirm source license.
- Confirm source verification path supported by target explorers/indexers.

Acceptance:

- Implementation is standard, minimal, and recognizable.
- No test-only Jetton source is used.
- No tax, blacklist, pause, whitelist, sell limit, or custom transfer restriction exists.

## Phase 2: V2 Token Source

Tasks:

- Add V2 Jetton master source.
- Add V2 Jetton wallet source.
- Add deployment wrapper/scripts.
- Add metadata builder.
- Add code hash export script.
- Add getter verification script.

Required token behavior:

- `get_jetton_data`
- `get_wallet_address`
- Standard wallet `transfer`
- Standard wallet `burn`
- Standard transfer notification and excess handling
- Fixed supply after deployment
- Closed mint after initial distribution
- Null or permanently disabled admin after launch

Acceptance:

- V2 source builds cleanly.
- Unit tests cover master getter, wallet getter, transfer, burn, mint closure, and disabled admin state.
- No forbidden token logic exists.

## Phase 3: Metadata

Tasks:

- Finalize name and symbol.
- Finalize description.
- Finalize logo.
- Upload immutable metadata JSON and image.
- Record metadata URI and content hash.
- Ensure official website points to the new V2 contract after deployment.

Acceptance:

- Metadata JSON is stable.
- Metadata has name, symbol, decimals, description, image, website, Telegram, and X/Twitter.
- Image URL resolves publicly.
- Metadata URL resolves publicly.

## Phase 4: Reproducible Build Package

Tasks:

- Record compiler version.
- Record package manager version.
- Commit dependency lockfile.
- Generate master BOC.
- Generate wallet BOC.
- Record master code hash.
- Record wallet code hash.
- Record init parameters.
- Record build command.

Acceptance:

- A clean checkout can reproduce the same master and wallet code hashes.
- Build artifacts are stored in the deployment evidence folder.

## Phase 5: Testnet Rehearsal

Tasks:

- Deploy V2 on TON testnet.
- Mint full test supply.
- Close mint.
- Verify `mintable=false`.
- Verify `admin_address=null` or permanently disabled.
- Transfer between normal wallets.
- Burn from a normal wallet.
- Query `get_wallet_address` for sample wallets.
- Query `get_wallet_data` for sample wallets.
- Create a small test liquidity pool if practical.
- Run test buy and sell if practical.

Acceptance:

- Testnet transactions are recorded.
- Getter evidence is saved.
- Transfer and burn succeed.
- No post-closure mint succeeds.

## Phase 6: Mainnet Deployment

Tasks:

- Freeze final source, metadata, and build package.
- Deploy V2 master.
- Mint the exact total supply once.
- Close mint.
- Disable or null admin.
- Query post-launch `get_jetton_data`.
- Query sample `get_wallet_address`.
- Record deployment, mint, and close-mint transaction hashes.

Acceptance:

- Total supply is `100000000000000000000`.
- `mintable=false`.
- `admin_address=null` or permanently disabled.
- Code hashes match the reproducible build package.

## Phase 7: Liquidity And Trading Evidence

Tasks:

- Create official V2 DEX pool.
- Seed initial liquidity.
- Record pool address.
- Run a small buy transaction.
- Run a small sell transaction.
- Record transaction hashes.
- Confirm chart/indexer visibility.

Acceptance:

- DEX pool is public.
- Buy succeeds.
- Sell succeeds.
- Liquidity amount is documented.

## Phase 8: Verification And Listing Materials

Tasks:

- Submit source/code verification where supported.
- Prepare wallet submission package.
- Prepare DEX/indexer submission package.
- Publish official contract address.
- Publish allocation table.
- Publish old-token replacement announcement.

Required submission materials:

- Project name
- Token name and symbol
- V2 Jetton master address
- Metadata URI
- Website
- Telegram
- X/Twitter
- Logo URL
- Source verification URL
- Master code hash
- Wallet code hash
- Total supply proof
- Mint closed proof
- Admin disabled proof
- DEX pool URL
- Buy transaction proof
- Sell transaction proof
- Allocation table URL
- Contact handle

Acceptance:

- OKX/Tonviewer/Tonkeeper/STON.fi submission package is complete.
- Website identifies V2 as the only official 72H token contract.

## Phase 9: Handoff To Manual Airdrop Operations

Tasks:

- Provide final V2 master address to operations.
- Provide official V2 airdrop wallet address to operations.
- Provide old-holder snapshot paths to operations.
- Provide recommended airdrop CSV format.
- Provide post-airdrop evidence format.

Acceptance:

- Contract engineering work is complete.
- Manual airdrop can proceed without adding or changing token contract logic.
