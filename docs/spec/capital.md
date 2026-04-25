# 72H Capital 功能开发文档

Last updated: 2026-04-24

Operations runbook: [`capital-operations-runbook.md`](./capital-operations-runbook.md)

Launch readiness: [`capital-launch-readiness.md`](./capital-launch-readiness.md)

Production launch plan: [`capital-production-launch-plan.md`](./capital-production-launch-plan.md)

Daily operations: [`capital-daily-operations.md`](./capital-daily-operations.md)

Growth backlog: [`capital-growth-backlog.md`](./capital-growth-backlog.md)

## 摘要

`72H Capital` 是 72hours 生态的应用资本席位系统。用户使用 `72H` 参与指定生态应用，获得限量、可验证、可分享的 `Capital Seat` 身份。

这个功能的核心不是普通理财入口，而是让用户用 `72H` 获取自己看好应用的限量资本席位。

英文表达：

`Secure a verified capital seat in the applications you believe in with 72H.`

第一期强调：

- 低门槛进入
- 限量席位
- 高级身份感
- 链上可验证
- 社交传播
- 长期资本参与

## 系统分层

当前实现按四个独立工程推进：

- `../72hours`
  - 官网前端与 Capital 公开页面
  - 当前已实现 `/capital`、`/capital/:slug`、`/capital/me`、`/capital/:slug/:type/:seatNumber`
  - 源码默认 `VITE_CAPITAL_DATA_MODE=preview`，部署环境可通过 `VITE_CAPITAL_DATA_MODE=api` 接入真实 API
- `../72h-capital-api`
  - Capital 只读接口、签名意图入口、索引聚合层
- `../72h-capital-contracts`
  - TON 合约代码、部署配置、规则约束与测试
- `../72h-capital-admin`
  - 运营、风控、AppRewardPool 奖励批次、ReserveVault 赎回状态与审计后台
- `../72h-capital-indexer`
  - Capital 事件摄入、查询缓存和验证视图
- `../72h-capital-shared`
  - Website、API、Admin、Indexer 共享类型和路由契约

当前阶段的边界：

- 官网仓库负责 UI、身份展示、验证页、预览数据和 API 客户端边界
- API 仓库负责把网站当前 view-model 替换成可查询接口
- 合约仓库负责席位数量、阈值、锁定期、不可赎回边界等链上约束
- Admin 仓库负责保护性操作界面，不直接承载公开站点

## 当前实现状态

截至 `2026-04-24`：

- 官网 Capital 路由保持在 Capital 边界内，未重做全站视觉系统。
- 官网默认数据模式为 `preview`，避免未配置环境时误连 API；testnet/staging/production 通过部署环境变量切换 `api`。
- TonConnect 仅在 Capital 路由内懒加载，不挂载到全站外壳。
- API 已支持 testnet Reserve allocation intent，返回标准 72H Jetton wallet `transfer` cell，用户钱包支付 Gas。
- API 已支持提交回填，使用提交 BOC 计算 TON message hash 并生成 testnet explorer transaction 链接。
- API 已增加 Postgres read/write boundary：`H72H_CAPITAL_DB_MODE=postgres` + `DATABASE_URL` 时，公开 Capital 读取、intent 创建/提交/查询、Admin dashboard、RewardPool funding、Reserve mature-lot redeem 支持视图和 audit log 优先使用 Postgres，否则继续 Indexer/local fallback。
- API 已增加 Postgres bootstrap：`npm run db:migrate` 顺序执行 `migrations/*.sql`，`npm run db:seed` 从当前 view-model backfill `capital_apps`、`capital_seats`、localized payload 和 Admin action rows。
- API Admin 已增加配置式认证边界：`H72H_ADMIN_SESSION_SECRET` + PBKDF2 password hash；本地 mock admin 只作为显式开发模式。
- API Admin 敏感操作已要求 `auditReason`、`confirmationText`、`idempotencyKey`、`clientIssuedAt`，并在 Postgres 与本地 fallback 中记录 reason/outcome。
- Admin 前端 token 改为 `sessionStorage`，敏感操作增加角色禁用、二次确认、审计原因输入和管理员签名操作占位。
- Shared 类型已对齐 Admin runtime `mock | staging | production`、audit reason/outcome、admin operation 和 sensitive action request。
- Indexer 路由使用 durable file-backed store；旧的非持久化 seed 出口已移除。
- Indexer 已增加 guarded TON testnet poller，可从 toncenter-compatible `/getTransactions` 读取 ReserveVault/TestJetton/Registry 地址并解码 Jetton `transfer_notification`；poller 支持 `.env.local`、dry-run、不推进 cursor、地址去重和 durable seat/lot/verification projection。
- Indexer 已增加 projection export：`npm run export:postgres-seed -- --format json|sql --out ...`，也可通过 `/v1/indexer/projections` 与 `/v1/indexer/projections/postgres-seed` 导出 durable projections 给 API/DB backfill。
- Contracts 已增加 guarded Reserve rehearsal 脚本，可 dry-run 或显式发送 testnet mint + Jetton transfer，并验证 TestJetton supply、用户/vault Jetton wallet、seat/lot getter。
- `AlphaVault`、`AppRewardPool`、`AdminMultisig` 已从纯文档 scaffold 升级为可编译的最小 Tact 路径，并加入 guarded testnet plan/deploy/verify manifest 路径。
- 第一版链上身份仍不 NFT 化。

当前 TON testnet 部署：

| 合约 | 地址 |
| --- | --- |
| `TestJetton72H` | `kQCxm_w2ynPHIm0k4NyFpfxj1rUlnwGgejBiI0m9Q7R10mYi` |
| `CapitalRegistry` | `kQBARc6Ef43_v75iZ9PSluSbWzAbVe2s38a0zHsd1hAo_tH-` |
| `ReserveVault(72hours)` | `kQBcO6e9MTgjKJ1ODqz65XzWI4cxKok4qhJPaFQmeqkUEjxA` |
| `ReserveVault(wan)` | `kQDa7rBz4n1_wMEHeZd4QPa1RHU18ZndQtFlP2OILYAOw5y8` |
| `ReserveVault(multi-millionaire)` | `kQDlkTOaViRGyXZ0pHYanqmy_hv1lw85WLfWCaFQEpdiC1xF` |

当前 TON testnet planned 地址（尚未发送部署交易，manifest `sent=false`）：

| 合约 | Planned 地址 |
| --- | --- |
| `AdminMultisig` | `kQB2k3ren0GJvnLTTpXJCHLg845n1QQ6V16W5pxZ8uuDabgN` |
| `AppRewardPool` | `kQA4E-7__ODIV0TgUMdTmHuxwYLG7YbgNTbHjhoy12xKFtLE` |
| `AlphaVault(72hours)` | `kQDFl4jq6rA5GWvjrlxTUh_axP7iAPNprybBUSr9wp6Y2f0U` |
| `AlphaVault(wan)` | `kQComvaxsnSYnOqItw3LyCXAj9oZZrjzpvIUgq1Xw49Nytkt` |
| `AlphaVault(multi-millionaire)` | `kQD0RNANT-2RLagZc0QeV9s10rsTn_VXvAR5LgGfomX2be_3` |

当前 testnet 验证结果：

- `TestJetton72H` active，初始 supply 为 `0`。
- 三个 `ReserveVault` 均 active。
- `CapitalRegistry` 已绑定三组 ReserveVault。
- 每个 ReserveVault 已校验 `owner`、`registry`、`jettonMaster`、vault Jetton wallet、`appId`、最低门槛、初始 seat/lot 状态和 principal。
- Reserve rehearsal 已在 testnet 真实执行一次：mint `720 72H` 测试 Jetton 到测试钱包，再通过 Jetton transfer 进入 `ReserveVault(72hours)`。
- testnet rehearsal 链上 getter 已验证：`Registry seat=1`、`ReserveVault seat=1`、`lot=1`、`principal=720000000000`、vault Jetton balance=`720000000000`、TestJetton total supply=`720000000000`。
- Indexer testnet poller 默认不会运行；本地 `.env.local` 已配置 testnet 地址并保持 `H72H_TON_DRY_RUN=true`，真实轮询需要显式设置 `H72H_TON_TESTNET_POLL_ENABLED=true`，生产 ingest 还需要把 dry-run 改为 `false`。
- Indexer 已 ingest 该 testnet Reserve event，生成 `72hours:reserve:1` durable seat、reserve lot、portfolio entry 和公开 verification view；RPC 过程中出现过 TonCenter `429`，脚本重试/部分地址错误不影响已接收事件。
- Indexer 已生成 projection export JSON 与 SQL：`.data/capital-projection-export.json`、`.data/capital-postgres-seed.sql`。
- API Admin 本地运行验证通过：无审计 body 的敏感操作返回 `400`，带审计 body 的操作可执行并写入 audit reason。
- 官网 `VITE_CAPITAL_DATA_MODE=api npm run build` 已通过；TonConnect 仍只在 Capital 路由边界懒加载。
- Cloudflare staging 已按全新项目创建，不复用旧 `72h-api-staging`：
  - `72h-capital-api-staging`
  - `72h-capital-indexer-staging`
  - `72h-capital-admin-staging`
- 当前 Cloudflare staging API 已接入 Neon Postgres 主读：
  - `https://72h-capital-api-staging.348421501.workers.dev/health`
  - `https://72h-capital-indexer-staging.348421501.workers.dev/health`
  - `72h-capital-api-staging` 已配置 `DATABASE_URL`、`H72H_ADMIN_SESSION_SECRET`、`H72H_ADMIN_EMAIL`、`H72H_ADMIN_PASSWORD_HASH` 等 Worker bindings。
  - `GET /v1/capital/apps`、`GET /v1/capital/apps/:slug`、`GET /v1/capital/me`、`GET /v1/capital/identities/:slug/:type/:seatNumber` 已从 Neon 读取 localized payload。
  - `POST /v1/capital/reserve/allocate-intent`、`GET /v1/capital/intents/:intentId`、`POST /v1/capital/intents/:intentId/submission` 已在远程 staging 验证通过；当前保持 wallet-disabled、无 sendable TonConnect messages。
  - `POST /v1/admin/capital/session`、`GET /v1/admin/capital/dashboard`、`GET /v1/admin/capital/intents/recent` 已在远程 staging 验证通过。
  - 远程 health 当前返回 `configured=true`、`counts.apps=3`、`counts.seats=8`，并返回 `counts.intents`。
  - Cloudflare Worker admin PBKDF2 hash 使用 `100000` 次迭代；更高迭代数会被 Workers WebCrypto 拒绝。
  - Worker 侧仍保持 `H72H_ENABLE_TESTNET_TACT_MESSAGES=false`，不会在 staging 对外开放真实钱包发送 intent。
- 当前 Cloudflare staging Indexer 已部署 Worker-safe 入口：
  - `GET /health` 返回 `indexerRuntime=cloudflare-worker-staging`、poll settings 和 watched address count。
  - `GET /v1/indexer/status` 返回 `workerSafe=true`、`persistence=disabled`。
  - `POST /v1/indexer/poll-once` 当前因 `H72H_TON_TESTNET_POLL_ENABLED=false` 返回 `403 status=disabled`，不会误触发 toncenter 轮询。
  - Indexer Worker 暂不导入 Node file store / Postgres writer；持久化 projection 仍通过 Node indexer 命令和 API DB seed 边界完成。
- 当前 Cloudflare staging Admin：
  - `72h-capital-admin-staging.pages.dev` 项目已存在，Admin build 通过。
  - Pages direct upload 需要 `/pages/assets/*` 临时 upload JWT 和自定义 `Authorization: Bearer <upload_jwt>` header；当前 Cloudflare MCP wrapper 不支持该 header，因此本线程未完成 Pages 资产上传。
  - 如需立即发布 Admin Pages，需要本地 `CLOUDFLARE_API_TOKEN` 后运行 `npm run cf:deploy:staging`，或使用支持自定义 Authorization header 的部署工具。

当前主网边界：

- 主网管理员地址：`UQCxJ05yeawVWlsN5SfJ-obajgh2lFffR-O7ebH_s_wqQfRq`
- 主网 `72H` Jetton master：`EQDvE0ffdwvOhILjRJKFd2bIU9t5H9bG3-SKRidqavZjRsw8`
- 链上校验：TON Center `getTokenData` 返回 `contract_type=jetton_master`、`decimals=9`、`mintable=false`、总供应 `100,000,000,000 72H`
- 主网 Capital 合约尚未启用。
- 主网开放前必须完成审计、单管理员签名权限确认、ReserveVault 本金托管、生产数据库、索引器、监控和法律文案审校。

## 1. 核心命名

功能名：

- `72H Capital`

身份系统：

- `Capital Identity`

用户身份：

- `Capital Member`

投资动作：

- `Allocation`
- 中文：资本配置

稳定型配置：

- `Principal-custodied Reserve Seat`
- 中文：优先储备配置

风险型配置：

- `High-conviction Alpha Seat`
- 中文：Alpha 配置

身份载体：

- `Capital Seat`
- 中文：资本席位

分享卡：

- `Capital Identity Card`

公开验证：

- `Verified Capital Identity`

## 2. 第一批开放应用

第一期开放 3 个应用：

- `multi-millionaire`
- `72hours`
- `WAN`

每个应用开放：

- `72` 个 Reserve Seats
- `9` 个 Alpha Seats

第一期总席位：

- Reserve：`216`
- Alpha：`27`
- 总计：`243` 个 Capital Seats

## 3. 席位规则

每个应用、每种席位独立编号。

Reserve 示例：

- `WAN Reserve Seat #01 / 72`
- `72hours Prime Reserve Seat #18 / 72`
- `multi-millionaire Large Reserve Seat #72 / 72`

Alpha 示例：

- `WAN Alpha Seat #1 / 9`
- `72hours Strategic Alpha Seat #3 / 9`
- `multi-millionaire Prime Alpha Seat #1 / 9`

通用规则：

- 每个钱包每个应用最多 1 个 Reserve Seat
- 每个钱包每个应用最多 1 个 Alpha Seat
- Reserve 与 Alpha 可同时持有
- 编号按链上成功配置顺序生成
- 席位编号永久保留
- 席位不可转让
- 第一期不 NFT 化
- 后续可升级为不可转让身份 NFT

## 4. Reserve Seat 规则

Reserve 类型：

- `Principal-custodied Reserve Seat`

定位：

- 本金由 `ReserveVault` 托管
- 本金锁定 `72 天`
- 到期后从同一 `ReserveVault` 合约赎回

席位数量：

- 每个应用 `72` 个

最低门槛：

- `720 72H`

锁定期：

- `72 天`

本金赎回规则：

- 72 天后可从同一 `ReserveVault` 合约申请赎回
- 支持部分赎回
- 按最早到期批次优先赎回
- 未满 72 天的批次不可赎回
- 全部赎回后席位状态变为 `Historical`
- 重新配置大于等于 `720 72H` 后，原席位恢复 `Active`
- Reserve 赎回后席位永不释放
- 不使用独立排队赎回模型或外部兑付资金池模型

追加规则：

- 允许追加
- 每次追加金额形成独立锁定批次
- 每个追加批次单独计算 72 天锁定期
- 追加不改变席位编号
- 追加后评级可升级

奖励规则：

- Reserve 奖励每 `7 天` 可领取一次
- 奖励统一以 `72H` 发放
- 奖励来自 `AppRewardPool`
- 奖励可以为 `0`
- 奖励不来自 Reserve 本金
- 领取 Gas 用户承担

Reserve 风险文案：

`A Principal-custodied Reserve Seat has a 72-day lock-up. Principal is custodied in the same ReserveVault and can be redeemed from that contract after maturity; rewards come from AppRewardPool, may be 0, and never come from principal.`

中文：

`Principal-custodied Reserve Seat 锁定期为 72 天。本金由同一 ReserveVault 托管，到期后可从该合约申请赎回；奖励来自 AppRewardPool，可为 0，且不来自本金。`

## 5. Alpha Seat 规则

Alpha 类型：

- `High-conviction Alpha Seat`

定位：

- 高风险、长期、高确信资本身份
- 本金不可赎回
- 可能损失全部本金
- 奖励权重高于 Reserve

席位数量：

- 每个应用 `9` 个

锁定和承诺周期：

- `72 周`

赎回规则：

- Alpha 本金不可赎回
- 无退出机制
- 不提供本金赎回按钮
- 用户可领取已结算奖励
- 用户可追加配置
- 追加不改变席位编号
- 席位编号永久保留
- 席位永不释放

72 周后：

- Alpha Seat 升级为 `Completed Alpha Seat`
- 获得 `Completed Alpha Mandate` Credential
- 获得专属卡片视觉升级
- 本金仍不可赎回

奖励规则：

- Alpha 奖励每 `7 周` 结算一次
- 奖励统一以 `72H` 发放
- 奖励来自 `AppRewardPool`
- Alpha 奖励权重高于 Reserve
- Alpha 奖励可以为 `0`
- 领取 Gas 用户承担

Alpha 门槛：

| 应用 | Alpha 最低门槛 |
| --- | ---: |
| `72hours` | `72,000 72H` |
| `WAN` | `72,000 72H` |
| `multi-millionaire` | `720,000 72H` |

Alpha 风险文案：

`A High-conviction Alpha Seat is a 72-week long-term high-risk allocation. Alpha principal is non-redeemable once allocated and may result in partial or total principal loss; reward weight is higher than Reserve, but rewards may be 0.`

中文：

`High-conviction Alpha Seat 是 72 周长期高风险配置。本金一经配置不支持赎回，并可能产生部分或全部本金损失；奖励权重高于 Reserve，但奖励可为 0。`

Alpha 二次确认文案：

`I understand Alpha principal is non-redeemable.`

中文：

`我已理解 Alpha 本金不可赎回。`

## 6. 720 等级体系

等级作为席位评级，不替代席位身份。

Reserve 等级：

| 等级 | 名称 | 条件 |
| --- | --- | ---: |
| Select | `Select Reserve Seat` | >= `720 72H` |
| Prime | `Prime Reserve Seat` | >= `7,200 72H` |
| Strategic | `Strategic Reserve Seat` | >= `72,000 72H` |
| Large | `Large Reserve Seat` | >= `720,000 72H` |

Alpha 等级按应用门槛倍数计算：

| 等级 | 名称 | 条件 |
| --- | --- | ---: |
| Prime | `Prime Alpha Seat` | >= `1x` 应用 Alpha 门槛 |
| Strategic | `Strategic Alpha Seat` | >= `10x` 应用 Alpha 门槛 |
| Large | `Large Alpha Seat` | >= `100x` 应用 Alpha 门槛 |

示例：

- `WAN Strategic Alpha Seat`：`WAN` Alpha 门槛为 `72,000 72H`，Strategic 条件为 `720,000 72H`
- `multi-millionaire Strategic Alpha Seat`：`multi-millionaire` Alpha 门槛为 `720,000 72H`，Strategic 条件为 `7,200,000 72H`

## 7. 身份状态

Reserve 状态：

- `Available`：席位可获取
- `Locked`：存在未满 72 天的配置批次
- `Active`：当前持有有效配置
- `Matured`：存在可赎回批次
- `Redeemable`：存在已到期且可从 `ReserveVault` 赎回的本金批次
- `Historical`：已全部赎回，但身份保留

Alpha 状态：

- `Available`：席位可获取
- `Active`：当前有效
- `Completed`：72 周周期完成
- `Hidden`：用户隐藏展示，仅前端展示状态

不允许 Alpha 出现：

- `Redeemable`
- `Withdrawable`
- `Matured for principal redemption`

## 8. 用户 Gas 规则

所有链上操作 Gas 由用户承担：

- 参与配置
- 追加配置
- 领取奖励
- Reserve 赎回
- 重新激活
- 后续可能的身份 NFT 铸造

前端提示：

`Network fees are paid by the user wallet.`

中文：

`链上网络费用由用户钱包自行承担。`

## 9. Capital Identity Card

用户完成配置后自动生成身份卡。

卡片默认展示：

- 应用名称
- 席位类型
- 席位编号
- 席位评级
- 当前状态
- 钱包短地址或昵称
- 获取时间
- 验证链接
- 72H Capital 标识
- 应用品牌视觉

默认不展示：

- 具体配置金额
- 当前奖励金额
- 当前亏损金额
- 钱包完整地址

卡片标题示例：

- `WAN Prime Reserve Seat #07 / 72`
- `72hours Strategic Alpha Seat #3 / 9`
- `multi-millionaire Prime Alpha Seat #1 / 9`
- `multi-millionaire Completed Alpha Seat #1 / 9`

卡片状态展示：

- `Active Capital Identity`
- `Historical Capital Identity`
- `Completed Alpha Mandate`

卡片语言：

- 主标题英文
- 副标题中文
- 适合 X、Telegram、微信传播

## 10. 验证页

每张卡片有公开验证页。

路径建议：

- `/capital/:app/:type/:seatNumber`
- 示例：`/capital/wan/alpha/3`

验证页展示：

- `Verified Capital Identity`
- 应用名
- 席位类型
- 编号
- 状态
- 钱包短地址
- 获取时间
- 当前评级
- 链上交易哈希
- 风险说明
- 进入应用 Capital 页按钮

验证页不展示：

- 用户具体配置金额
- 奖励金额
- 亏损金额

## 11. 邀请传播

第一期邀请只给身份权益，不给金融返佣。

规则：

- 分享卡带邀请链接
- 被邀请人完成配置后，邀请人获得影响力认证
- 邀请不返还 `72H`
- 邀请不提高奖励权重
- 邀请不改变席位奖励权
- 邀请可进入排行榜
- 排行榜不显示金额

Credential：

- `Capital Network I`：邀请 3 人完成配置
- `Capital Network II`：邀请 9 人完成配置
- `Capital Network III`：邀请 72 人完成配置

防刷要求：

- 同钱包不计入
- 异常设备或 IP 行为需标记
- 批量刷邀请可人工剔除
- 邀请数据不直接驱动金融奖励

## 12. Credential 系统

第一期 Credential：

- `First Allocation`
- `Reserve Mandate`
- `Alpha Mandate`
- `Prime Allocation`
- `Strategic Mandate`
- `Large Mandate`
- `Completed Alpha Mandate`
- `72H Tenure Verified`
- `Capital Network I`
- `Capital Network II`
- `Capital Network III`
- `Portfolio Mandate`

Credential 只用于：

- 身份展示
- 分享卡视觉
- Portfolio 展示
- 排行榜
- 后续权限参考

不直接承诺：

- 奖励提升
- 空投
- 返佣
- 本金保障

## 13. 页面需求

新增主页面：

- `/capital`

页面模块：

- 第一批应用总览
- Reserve / Alpha 说明
- 每个应用席位剩余数量
- 每个应用 TVL
- 当前参与人数
- 风险等级
- 进入配置按钮
- 我的席位入口

应用详情页：

- `/capital/multi-millionaire`
- `/capital/72hours`
- `/capital/wan`

详情页模块：

- 应用简介
- Reserve Seat 卡片
- Alpha Seat 卡片
- 剩余席位
- 门槛
- 锁定或承诺周期
- 奖励来源
- 风险说明
- 最近席位编号
- 配置按钮
- 分享样例

我的资本页：

- `/capital/me`

展示：

- 我的 Capital Seats
- Active 席位
- Historical 席位
- Completed Alpha Seat
- 可领取奖励
- Reserve 锁定批次
- Alpha 结算周期
- 我的 Credential
- 我的分享卡
- 邀请数据

生态页改造：

- 现有应用卡片增加 `Capital Seat` 入口
- 只对开放应用显示
- 未开放应用显示 `Capital coming soon`

## 14. 前端交互流程

Reserve 配置流程：

1. 用户进入应用 Capital 页面
2. 选择 `Reserve Seat`
3. 查看剩余席位和规则
4. 输入配置金额，最低 `720 72H`
5. 确认 72 天锁定、本金由 ReserveVault 托管、到期从同一合约赎回、Gas 自付
6. 连接 TON 钱包
7. 发起链上交易
8. 交易成功后获得编号
9. 生成 Capital Identity Card
10. 提供分享入口

Reserve 赎回流程：

1. 用户进入 My Capital
2. 查看 Reserve 批次
3. 选择已满 72 天批次
4. 申请部分或全部赎回
5. 从同一 `ReserveVault` 合约发起本金赎回
6. 合约校验到期批次和可赎回本金
7. 全部本金赎回后席位变为 Historical

Alpha 配置流程：

1. 用户进入应用 Capital 页面
2. 选择 `Alpha Seat`
3. 查看 9 个席位剩余数量
4. 输入配置金额
5. 校验应用 Alpha 门槛
6. 展示高风险说明
7. 二次确认本金不可赎回
8. 连接 TON 钱包
9. 发起链上交易
10. 交易成功后获得编号
11. 生成 Capital Identity Card

Alpha 页面禁止出现：

- 赎回按钮
- 退出按钮
- 本金到期提示

## 15. 后台管理需求

后台必须支持：

- 应用开放/关闭
- Reserve 开放/关闭
- Alpha 开放/关闭
- 设置 Reserve 席位数
- 设置 Alpha 席位数
- 设置 Reserve 门槛
- 设置 Alpha 门槛
- 设置 Reserve 锁定期
- 设置 Alpha 周期
- 设置奖励领取周期
- 设置奖励结算周期
- 配置 AppRewardPool 奖励批次
- 设置 Reserve / Alpha 奖励权重
- 查看 ReserveVault 本金赎回状态
- 暂停配置
- 暂停赎回
- 暂停领取奖励
- 修改风险等级
- 修改奖励来源文案
- 修改卡片主题
- 发布应用公告
- 查看操作日志

关键操作必须：

- 管理员签名确认
- 写入审计日志
- 保留变更记录
- 前端展示更新时间

## 16. 合约需求

第一期建议合约：

- `CapitalRegistry`
- `ReserveVault`
- `AlphaVault`
- `AppRewardPool`
- `AdminMultisig`

`CapitalRegistry` 负责：

- 应用注册
- 席位编号
- 用户席位状态
- Reserve / Alpha 席位上限
- 每钱包每应用每类型唯一性
- 席位状态记录

`ReserveVault` 负责：

- Reserve 配置
- 追加配置
- 批次锁定
- 72 天到期判断
- 部分赎回
- 到期本金赎回
- 奖励领取
- 事件日志

`AlphaVault` 负责：

- Alpha 配置
- Alpha 追加
- 门槛校验
- 本金不可赎回约束
- 7 周奖励结算
- 72 周 Completed 状态
- 奖励领取
- 事件日志

`AppRewardPool` 负责：

- 接收应用奖励资金
- 按 Reserve / Alpha 权重分配奖励
- 记录奖励批次
- 明确奖励可为 `0`
- 不接收或动用 Reserve 本金
- 支持受控管理员操作

`AdminMultisig` 负责：

- 参数调整
- 暂停功能
- 奖励分配确认
- 紧急处理

合约必须约束：

- 席位数量
- 门槛
- 每钱包唯一席位
- Reserve 锁定期
- Alpha 本金不可赎回
- 用户 Gas 自付
- 暂停开关
- 管理员不能随意转走用户本金

合约不负责：

- 卡片图片生成
- 昵称
- 社交分享
- 排行榜
- 非关键展示数据
- 营销文案

## 17. 链上事件

需要事件：

- `ReserveAllocated`
- `ReserveAdded`
- `ReserveRedeemed`
- `ReserveRewardClaimed`
- `AlphaAllocated`
- `AlphaAdded`
- `AlphaRewardSettled`
- `AlphaRewardClaimed`
- `AlphaCompleted`
- `SeatAssigned`
- `SeatStatusChanged`
- `VaultPaused`
- `VaultUnpaused`

事件用于：

- 官网数据
- 身份验证页
- Portfolio
- 分享卡生成
- 后台审计
- 排行榜

## 18. 数据与 Indexer

需要链上索引服务记录：

- 钱包地址
- 应用 ID
- 席位类型
- 席位编号
- 配置金额
- 有效金额
- 批次锁定时间
- 可赎回时间
- 奖励领取记录
- Alpha 奖励结算记录
- 状态变化
- 交易哈希
- 邀请关系
- Credential

前端展示数据从 Indexer 或 API 获取，不直接全部从链上实时计算。

## 19. 风控与合规

必须避免的表述：

- 绝对保本
- 保证奖励
- 固定 APY
- 稳赚
- 无风险
- 5-10 倍奖励承诺
- 到期必兑付

允许表达：

- 本金由 ReserveVault 托管
- 到期从同一 ReserveVault 赎回
- 高风险配置
- 奖励可为 0
- 本金可能损失
- 链上费用由用户承担

Reserve 强制确认：

- 72 天锁定
- 本金由 ReserveVault 托管
- 到期后从同一 ReserveVault 赎回
- 奖励来自 AppRewardPool，可为 0，且不来自本金
- Gas 自付

Alpha 强制确认：

- 72 周长期配置
- 本金不可赎回
- 可能损失全部本金
- 奖励可为 0
- Gas 自付

## 20. MVP 范围

第一期必须实现：

- `/capital` 页面
- 3 个应用详情页
- TON 钱包连接
- Reserve 配置
- Alpha 配置
- Reserve 批次锁定
- Reserve 到期赎回
- Alpha 本金不可赎回
- 奖励领取
- Capital Identity Card
- 公开验证页
- My Capital 页面
- 邀请链接
- Credential 基础展示
- 后台基础配置
- 链上事件索引
- 风险确认流程

第一期不做：

- NFT 化身份
- 二级市场转让
- 金融返佣
- 固定奖励承诺
- 自动 APY 展示
- 复杂排行榜奖励
- 跨链资产
- 自动做市策略

## 21. 二期规划

二期可加入：

- 不可转让身份 NFT
- 更多应用池
- Completed Alpha 专属视觉
- 更完整排行榜
- 高级卡片主题
- 应用资本榜
- 多资产奖励
- 第三方审计报告展示
- 更细的权限系统
- 应用方后台
- Capital Season 赛季制

## 22. 待最终确认参数

当前不阻塞开发，但后续需要定：

- 分享卡视觉风格
- `multi-millionaire` 的品牌展示素材
- `72H` Jetton 合约地址
- TON 主网/测试网部署顺序
- 管理员签名钱包和应急暂停权限
- 审计方
- ReserveVault 本金托管和赎回参数
- 每个应用 AppRewardPool 奖励来源的真实说明

## 23. 最终用户表达

主标题建议：

`72H Capital`

副标题：

`Secure verified capital seats in selected 72H ecosystem applications.`

中文：

`获取 72H 生态精选应用的可验证资本席位。`

Reserve CTA：

`Claim Reserve Seat`

中文：

`获取 Reserve 席位`

Alpha CTA：

`Claim Alpha Seat`

中文：

`获取 Alpha 席位`

My Capital 标题：

`My Capital Identity`

中文：

`我的资本身份`

卡片底部：

`Verified by 72H Capital`

中文：

`由 72H Capital 验证`
