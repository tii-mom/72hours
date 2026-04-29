# OKX Wallet 72H Token Risk Appeal Pack

> Historical/void note (2026-04-30): this appeal targets the legacy pre-V2 Jetton address only. It is preserved as historical evidence and must not be used as the current official 72H contract. Current V2 Jetton master: `EQBGIzEDvvKObStrcVb6i5Z1-8uYZYtUrYzF2rFZU7xUAXVg`.


Prepared: 2026-04-25

## Token

- Chain: TON mainnet
- Token name: 72H
- Symbol: 72H
- Jetton master: `EQDvE0ffdwvOhILjRJKFd2bIU9t5H9bG3-SKRidqavZjRsw8`
- Raw address: `0:ef1347df770bce8482e34492857766c853db791fd6c6dfe48a46276a6af66346`
- Official website: `https://72h.lol`
- Telegram: `https://t.me/the72h`
- X: `https://x.com/taichi2077`
- Metadata URI: `https://ivory-keen-perch-796.mypinata.cloud/ipfs/bafkreicxqvsbn3vpy3i4f2566e2r3vlhyrhouffw6ybp4ul724w2wi5prm`
- Token image: `https://ivory-keen-perch-796.mypinata.cloud/ipfs/bafybeibemybd7siczri554viwx2hyap62ashksjkgtzl4upa5kgxufenna`

## Current OKX Risk State

OKX token page:

`https://web3.okx.com/zh-hans/token/ton/EQDvE0ffdwvOhILjRJKFd2bIU9t5H9bG3-SKRidqavZjRsw8`

Fetched from OKX SSR state on 2026-04-25T08:05:54Z:

- `riskControlLevel`: `4`
- `riskLevel`: `4`
- Tags: `honeypot`, `lowLiquidity`
- Risk issue count: high risk `2`, middle risk `2`
- Liquidity shown by OKX: about `$183.75`
- OKX did not populate official website, Telegram, or X in its social media fields, although the official metadata URI contains those fields.

## Chain Evidence Against Mint Risk

TonAPI:

`https://tonapi.io/v2/jettons/EQDvE0ffdwvOhILjRJKFd2bIU9t5H9bG3-SKRidqavZjRsw8`

Observed:

- `interfaces`: `["jetton_master"]`
- `mintable`: `false`
- `total_supply`: `100000000000000000000`
- Decimals: `9`
- User-facing total supply: `100,000,000,000 72H`
- `holders_count`: `20`
- `code_hash`: `ihcNl8kAZ+PFzxeTVK4vslYlmEd1jWy11N76Uey4mKA=`
- `data_hash`: `d8ipVjZBBNPDUoENnDZBGb0UI1qeLD2QkRLTesc/jtk=`

TON Center:

`https://toncenter.com/api/v3/jetton/masters?address=EQDvE0ffdwvOhILjRJKFd2bIU9t5H9bG3-SKRidqavZjRsw8`

Observed:

- `mintable`: `false`
- `admin_address`: `null`
- `total_supply`: `100000000000000000000`
- `jetton_content.decimals`: `9`
- Metadata is indexed and valid.
- Metadata includes `website`, `telegram`, and `social`.

Conclusion:

The token is not currently mintable and has no admin address. The "mint mechanism" warning appears inconsistent with the current chain state. If OKX's scanner is detecting the historical initial mint event, that should not be treated as a live mint permission because the master now reports `mintable=false` and `admin_address=null`.

## Liquidity Evidence

DexScreener:

`https://api.dexscreener.com/latest/dex/tokens/EQDvE0ffdwvOhILjRJKFd2bIU9t5H9bG3-SKRidqavZjRsw8`

Observed on 2026-04-25:

- DEX: STON.fi
- Pair: `EQBx2wB0duhc82ZsM2BJ8XThjdc6ej0dmyq3-N7zkojSOjtC`
- Pair URL: `https://dexscreener.com/ton/eqbx2wb0duhc82zsm2bj8xthjdc6ej0dmyq3-n7zkojsojtc`
- Quote token: USDt
- Price: about `$0.003078`
- Liquidity: about `$184.35`
- 24h transactions: buys `2`, sells `0`
- 24h volume: about `$1.30`

STON.fi asset API:

`https://api.ston.fi/v1/assets/EQDvE0ffdwvOhILjRJKFd2bIU9t5H9bG3-SKRidqavZjRsw8`

Observed:

- `community`: `true`
- `blacklisted`: `false`
- `deprecated`: `false`
- Tags: `no_liquidity`, `asset:liquidity:no`

Conclusion:

The low-liquidity warning is currently factually supported. Remediation should be done by increasing the STON.fi pool liquidity above OKX's threshold. A practical minimum is more than `$5,000`; a more stable target is `$10,000+`.

## Holder Distribution Evidence

TonAPI holders endpoint:

`https://tonapi.io/v2/jettons/EQDvE0ffdwvOhILjRJKFd2bIU9t5H9bG3-SKRidqavZjRsw8/holders?limit=100&offset=0`

Observed:

- Holder count: `20`
- Largest owner: `0:46639e8963d832d55faf9e7c8ea46a095cb580726dcb28d01d97d38a4a1b827b`
- Largest balance: `95,000,000,000 72H`
- Largest balance share: `95%`
- Second-largest owner: `0:2e6b74719a925e291388ed42a4d238c7330501c0134b9832bbfb50b6b2fc31f5`
- Second-largest balance share: about `4.481653954%`

Conclusion:

Holder concentration is a separate distribution risk and should not be confused with a live mint mechanism. If the 95% allocation is intended as a reserve, lock, burn, or treasury allocation, the project should publish the exact purpose and preferably move it to an identifiable multisig, timelock, or public reserve address.

## Remediation Plan

1. Ask OKX to remove or correct the "mint mechanism" warning because both TonAPI and TON Center report `mintable=false` and `admin_address=null`.
2. Ask OKX to re-index the token metadata and official links from the metadata URI.
3. Add STON.fi liquidity to exceed `$5,000`, preferably `$10,000+`.
4. Execute and publish a small buy test and sell test on STON.fi, then provide both transaction hashes to OKX to address the honeypot warning.
5. Submit token verification/listing updates to Tonkeeper `ton-assets` and STON.fi.
6. Publish a holder distribution explanation for the 95% address and, if controlled, move reserve tokens to a verifiable reserve/multisig/timelock address.

## Chinese Appeal Draft

主题：申请复核 TON 主网 72H Jetton 风险标签，特别是“存在增发机制/疑似貔貅币”误判

您好，OKX Wallet 安全团队：

我们是 TON 主网 72H Jetton 项目方，申请复核代币风险检测结果。

代币信息：

- Chain: TON mainnet
- Token name / symbol: 72H
- Jetton master: `EQDvE0ffdwvOhILjRJKFd2bIU9t5H9bG3-SKRidqavZjRsw8`
- Raw address: `0:ef1347df770bce8482e34492857766c853db791fd6c6dfe48a46276a6af66346`
- OKX token page: `https://web3.okx.com/zh-hans/token/ton/EQDvE0ffdwvOhILjRJKFd2bIU9t5H9bG3-SKRidqavZjRsw8`
- Official website: `https://72h.lol`
- Telegram: `https://t.me/the72h`
- X: `https://x.com/taichi2077`

目前 OKX Wallet 显示该代币存在高风险，包括疑似貔貅币、仿冒、低流动性和存在增发机制等。我们请求重点复核“存在增发机制”这一项，因为当前链上状态不支持该结论：

- TonAPI: `https://tonapi.io/v2/jettons/EQDvE0ffdwvOhILjRJKFd2bIU9t5H9bG3-SKRidqavZjRsw8`
- TON Center: `https://toncenter.com/api/v3/jetton/masters?address=EQDvE0ffdwvOhILjRJKFd2bIU9t5H9bG3-SKRidqavZjRsw8`

两处主网索引均显示：

- `mintable=false`
- `admin_address=null`
- `total_supply=100000000000000000000`
- `decimals=9`
- 用户可读总量为 `100,000,000,000 72H`

因此，该 Jetton 当前不存在可继续增发的管理员权限。若风控系统检测到了部署初期的一次性初始 mint 事件，请不要将其等同于当前仍存在增发权限。我们请求将“存在增发机制”标签改为通过或重新检测。

我们也确认低流动性风险目前是事实：STON.fi / DexScreener 当前池子流动性约 184 美元，低于 5,000 美元阈值。我们会补充流动性，并在完成后请求重新索引。

同时，metadata URI 已包含官网、Telegram 和 X，但 OKX 页面当前未展示这些官方链接，请协助重新索引：

`https://ivory-keen-perch-796.mypinata.cloud/ipfs/bafkreicxqvsbn3vpy3i4f2566e2r3vlhyrhouffw6ybp4ul724w2wi5prm`

metadata 内容包括：

- website: `https://72h.lol`
- telegram: `https://t.me/the72h`
- social: `https://x.com/taichi2077`

我们请求：

1. 复核并移除/修正“存在增发机制”风险标签。
2. 重新检测当前 master contract 的 `mintable=false` 和 `admin_address=null` 状态。
3. 重新索引 token metadata 和官方社媒链接。
4. 对“疑似貔貅币”风险进行复核；如需要，我们可继续提供 STON.fi 小额买入和卖出交易哈希作为可交易证明。
5. 在我们补充流动性后，重新评估低流动性标签。

谢谢。

## English Appeal Draft

Subject: Review request for TON mainnet 72H Jetton risk labels, especially mint-mechanism and honeypot false positives

Hello OKX Wallet Security Team,

We are the project team for the TON mainnet 72H Jetton and would like to request a review of the current risk labels shown in OKX Wallet.

Token information:

- Chain: TON mainnet
- Token name / symbol: 72H
- Jetton master: `EQDvE0ffdwvOhILjRJKFd2bIU9t5H9bG3-SKRidqavZjRsw8`
- Raw address: `0:ef1347df770bce8482e34492857766c853db791fd6c6dfe48a46276a6af66346`
- OKX token page: `https://web3.okx.com/zh-hans/token/ton/EQDvE0ffdwvOhILjRJKFd2bIU9t5H9bG3-SKRidqavZjRsw8`
- Official website: `https://72h.lol`
- Telegram: `https://t.me/the72h`
- X: `https://x.com/taichi2077`

OKX Wallet currently shows high-risk labels for this token. We specifically request a review of the mint-mechanism warning because the current on-chain state does not support that conclusion.

Evidence:

- TonAPI: `https://tonapi.io/v2/jettons/EQDvE0ffdwvOhILjRJKFd2bIU9t5H9bG3-SKRidqavZjRsw8`
- TON Center: `https://toncenter.com/api/v3/jetton/masters?address=EQDvE0ffdwvOhILjRJKFd2bIU9t5H9bG3-SKRidqavZjRsw8`

Both indexers report:

- `mintable=false`
- `admin_address=null`
- `total_supply=100000000000000000000`
- `decimals=9`
- User-facing total supply: `100,000,000,000 72H`

Therefore, the Jetton master currently has no live mint permission and no admin address. If the risk engine detected the one-time initial mint during deployment, please do not treat that historical initial issuance as an active mint mechanism.

We acknowledge that the low-liquidity warning is currently valid. The STON.fi / DexScreener pool currently has approximately 184 USD in liquidity, below the 5,000 USD threshold. We plan to add liquidity and request re-indexing afterward.

The metadata URI already contains official links, but the OKX token page currently does not display the official website, Telegram, or X links. Please re-index the token metadata:

`https://ivory-keen-perch-796.mypinata.cloud/ipfs/bafkreicxqvsbn3vpy3i4f2566e2r3vlhyrhouffw6ybp4ul724w2wi5prm`

Metadata includes:

- website: `https://72h.lol`
- telegram: `https://t.me/the72h`
- social: `https://x.com/taichi2077`

We request:

1. Review and remove/correct the mint-mechanism warning.
2. Re-check the Jetton master state showing `mintable=false` and `admin_address=null`.
3. Re-index token metadata and official social links.
4. Review the honeypot label; if required, we can provide small STON.fi buy and sell transaction hashes as tradability proof.
5. Re-evaluate the low-liquidity warning after additional liquidity is added.

Thank you.
