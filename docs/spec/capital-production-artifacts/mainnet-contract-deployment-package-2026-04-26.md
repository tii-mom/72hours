# 72H Capital Mainnet Contract Deployment Package

Status: generated deployment plan, not deployed evidence.
Generated: 2026-04-26T04:57:52.818Z

This package was generated from `/Users/yudeyou/Desktop/72h-capital-contracts` with:

```bash
npm run plan:mainnet:tonconnect
```

Generated files:

- `/Users/yudeyou/Desktop/72h-capital-contracts/deployments/mainnet.tonconnect.json`
- `/Users/yudeyou/Desktop/72h-capital-contracts/deployments/mainnet-deploy.html`

Mainnet signing must remain disabled until these planned addresses are actually deployed, getter evidence is attached, the remediated audit and legal artifacts are complete, and `npm run capital:gate:production` passes without `--skip-network`.

## Addresses

| Component | App | Address |
| --- | --- | --- |
| AdminAuthority | global | `EQCjQ4J6ihxsqkG95Ew6k-8j-2o9Ydn8NFVHQgxbR1p_zWlU` |
| CapitalRegistry | global | `EQC9e5L3196LgKS-1KIZKryJPkZ8RDdgCkKEsIlOe1vQX02P` |
| ReserveVault | 72hours | `EQAUMyjNfWsO59Dtof6SYU06q7XVoE9uKH8ZQSZX0QvhRNKl` |
| ReserveVault | wan | `EQC3nbivC7_iqdCEBJ-5PDzI4gyz9ytF-BJmgeTimrAi70qq` |
| ReserveVault | multi-millionaire | `EQBPkl46BiuEifiurq6hGtjjXjeooGp8tjDpNuMHZOsxZN5v` |
| AppRewardPool | 72hours | `EQCRZu-RjCTPK7DL5q8hVD1-9FN4UE0lIbILi-YgHBuSQ0wr` |
| AppRewardPool | wan | `EQAVZqKSLamdNARoQzYK_SDS_Gkr_Wg83z-NdWaeOKD6Fra4` |
| AppRewardPool | multi-millionaire | `EQB9PmfGy_2BWj4RJW0b67iaGmvrPFth88HwnWI7HWbJP_1Z` |
| AlphaVault | 72hours | `EQB6X068UH5fqETc7Tk0IrxPBCqI8Hsmg_wC5BzE21UPi6jq` |
| AlphaVault | wan | `EQBCeUNyTbZSLdQ5aZl-ROiZ_gXDqILb59Npwh7uikWnk_qr` |
| AlphaVault | multi-millionaire | `EQAzVQLvyrbQds7btOST69nrIqqPqp-R3MlsFHIFyUgHLLCk` |

## Code Hashes

| Contract type | Code hash |
| --- | --- |
| AdminAuthority | `2d4e92e675bb9de0359d6ce292395f2322c98101a0866b539f5448120a274355` |
| CapitalRegistry | `41f4be144e5a9cd0947007cc4dd9a49ceddccbc32cb43eeb98c5b151a01e7b78` |
| ReserveVault | `8d7cccc2a4408de75b3ef88aae111375aa244bb066df44b5be0db33cdb5fa924` |
| AppRewardPool | `7dae5f4c2ae52500af9f49400998c4cdaf8b3c9179d34bef72ce97a3359af982` |
| AlphaVault | `6e92b9711d04a296f8dbbfad01cbe1cfa63076caa9ad051b40614313c61a9240` |

## Init Parameters

- Admin wallet: `EQCxJ05yeawVWlsN5SfJ-obajgh2lFffR-O7ebH_s_wqQamv`
- 72H Jetton master: `EQBGIzEDvvKObStrcVb6i5Z1-8uYZYtUrYzF2rFZU7xUAXVg`
- Registry: `EQC9e5L3196LgKS-1KIZKryJPkZ8RDdgCkKEsIlOe1vQX02P`
- ReserveVault app ids: `72hours=1`, `wan=2`, `multi-millionaire=3`
- AppRewardPool app ids: `72hours=1`, `wan=2`, `multi-millionaire=3`
- AlphaVault reward pools:
  - `72hours`: `EQCRZu-RjCTPK7DL5q8hVD1-9FN4UE0lIbILi-YgHBuSQ0wr`
  - `wan`: `EQAVZqKSLamdNARoQzYK_SDS_Gkr_Wg83z-NdWaeOKD6Fra4`
  - `multi-millionaire`: `EQB9PmfGy_2BWj4RJW0b67iaGmvrPFth88HwnWI7HWbJP_1Z`

## Production Gate Env Draft

These values are deploy-plan values only. Replace every `REQUIRES_OFFICIAL...` value with the real getter result after mainnet deployment.

```bash
TON_MAINNET_72H_JETTON_MASTER_ADDRESS=EQBGIzEDvvKObStrcVb6i5Z1-8uYZYtUrYzF2rFZU7xUAXVg
TON_MAINNET_ADMIN_ADDRESS=EQCxJ05yeawVWlsN5SfJ-obajgh2lFffR-O7ebH_s_wqQamv
TON_MAINNET_RESERVE_VAULT_ADDRESS_72HOURS=EQAUMyjNfWsO59Dtof6SYU06q7XVoE9uKH8ZQSZX0QvhRNKl
TON_MAINNET_RESERVE_VAULT_JETTON_WALLET_ADDRESS_72HOURS=REQUIRES_OFFICIAL_JETTON_MASTER_GET_WALLET_ADDRESS_AFTER_DEPLOY
TON_MAINNET_RESERVE_VAULT_ADDRESS_WAN=EQC3nbivC7_iqdCEBJ-5PDzI4gyz9ytF-BJmgeTimrAi70qq
TON_MAINNET_RESERVE_VAULT_JETTON_WALLET_ADDRESS_WAN=REQUIRES_OFFICIAL_JETTON_MASTER_GET_WALLET_ADDRESS_AFTER_DEPLOY
TON_MAINNET_RESERVE_VAULT_ADDRESS_MULTI_MILLIONAIRE=EQBPkl46BiuEifiurq6hGtjjXjeooGp8tjDpNuMHZOsxZN5v
TON_MAINNET_RESERVE_VAULT_JETTON_WALLET_ADDRESS_MULTI_MILLIONAIRE=REQUIRES_OFFICIAL_JETTON_MASTER_GET_WALLET_ADDRESS_AFTER_DEPLOY
TON_MAINNET_APP_REWARD_POOL_ADDRESS_72HOURS=EQCRZu-RjCTPK7DL5q8hVD1-9FN4UE0lIbILi-YgHBuSQ0wr
TON_MAINNET_APP_REWARD_POOL_JETTON_WALLET_ADDRESS_72HOURS=REQUIRES_OFFICIAL_JETTON_MASTER_GET_WALLET_ADDRESS_AFTER_DEPLOY
TON_MAINNET_APP_REWARD_POOL_ADDRESS_WAN=EQAVZqKSLamdNARoQzYK_SDS_Gkr_Wg83z-NdWaeOKD6Fra4
TON_MAINNET_APP_REWARD_POOL_JETTON_WALLET_ADDRESS_WAN=REQUIRES_OFFICIAL_JETTON_MASTER_GET_WALLET_ADDRESS_AFTER_DEPLOY
TON_MAINNET_APP_REWARD_POOL_ADDRESS_MULTI_MILLIONAIRE=EQB9PmfGy_2BWj4RJW0b67iaGmvrPFth88HwnWI7HWbJP_1Z
TON_MAINNET_APP_REWARD_POOL_JETTON_WALLET_ADDRESS_MULTI_MILLIONAIRE=REQUIRES_OFFICIAL_JETTON_MASTER_GET_WALLET_ADDRESS_AFTER_DEPLOY
TON_MAINNET_ALPHA_VAULT_ADDRESS_72HOURS=EQB6X068UH5fqETc7Tk0IrxPBCqI8Hsmg_wC5BzE21UPi6jq
TON_MAINNET_ALPHA_VAULT_ADDRESS_WAN=EQBCeUNyTbZSLdQ5aZl-ROiZ_gXDqILb59Npwh7uikWnk_qr
TON_MAINNET_ALPHA_VAULT_ADDRESS_MULTI_MILLIONAIRE=EQAzVQLvyrbQds7btOST69nrIqqPqp-R3MlsFHIFyUgHLLCk
```

## Required Getter Evidence

For every ReserveVault and AppRewardPool:

- Call official 72H Jetton master `get_wallet_address(contract_address)`.
- Record the resulting Jetton wallet address.
- Set the contract-side official wallet if required by the audited deployment path.
- Attach the setter transaction hash.
- Attach post-set getter snapshots proving the stored official wallet equals the Jetton master getter result.

For Registry:

- Attach registered app getter evidence for `72hours`, `wan`, and `multi-millionaire`.
- Attach app-scoped ReserveVault binding evidence for all three apps.

For ReserveVault:

- Attach owner, registry, app id, Jetton master, official vault wallet, pause state, and redemption getter snapshots.

For AppRewardPool:

- Attach owner, registry, app id, Jetton master, official pool wallet, total funded, total claimed, available rewards, and pause state.

## Still Blocking Production

- This package has not been signed on mainnet in this workspace.
- Official Vault/Pool Jetton wallet addresses are still unknown until mainnet deployment and getter calls.
- Reward claim must remain closed until all three AppRewardPools are deployed, funded per policy, indexed, audited, and verified.
- `npm run capital:gate:production` must pass without `--skip-network`.
