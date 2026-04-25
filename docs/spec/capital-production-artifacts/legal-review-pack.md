# 72H Capital Legal Review Pack

Last updated: 2026-04-25

Status: draft for legal review. Not a production approval.

Scope: 72H Capital v1 simplified launch, with Reserve principal-custody flow first and Alpha closed until Reserve is stable. This pack identifies public pages, copy surfaces, risk disclosures, prohibited terms, approval templates, and the pre-launch legal checklist required before `CAPITAL_LEGAL_APPROVAL_PATH` can point at a signed artifact.

Primary sources reviewed:

- `docs/spec/capital.md`
- `docs/spec/capital-production-launch-plan.md`
- `docs/spec/capital-launch-readiness.md`
- `docs/spec/capital-production-owner-inputs.md`
- `src/content/capital.ts`
- `src/content/legal.ts`
- `src/pages/Capital.tsx`
- `src/pages/CapitalApp.tsx`
- `src/pages/CapitalIdentity.tsx`
- `src/pages/CapitalVerify.tsx`
- `src/components/capital/CapitalIntentConsole.tsx`
- `src/content/route-meta.ts`
- `src/lib/capital-query.ts`

Official reference watchpoints checked on 2026-04-25:

- [SEC Division of Corporation Finance statement on crypto asset offerings and registrations](https://www.sec.gov/newsroom/speeches-statements/cf-crypto-securities-041025-offerings-registrations-securities-crypto-asset-markets): counsel should evaluate whether any Capital rights, restrictions, smart-contract rights, fees, audits, or holder rights require securities-law analysis or registration/disclosure treatment.
- [CFTC digital asset fraud warning](https://www.cftc.gov/LearnAndProtect/digitalassetfrauds) and [FTC cryptocurrency scam guidance](https://consumer.ftc.gov/articles/what-know-about-cryptocurrency-scams): public copy should avoid risk-free, guaranteed-return, profit, or urgent scarcity framing.
- [OFAC FAQ 560](https://ofac.treasury.gov/faqs/560): sanctions obligations can apply equally to digital-currency transactions, so eligibility and restricted-person handling need owner/legal approval.
- [IRS digital assets page](https://www.irs.gov/filing/digital-assets): tax reporting and user tax-responsibility wording should be reviewed before live reward, redemption, or broker-like flows.

## V1 Simplified Model For Approval

72H Capital v1 is a wallet-bound, non-transferable Capital Seat identity system for selected 72H ecosystem applications. It is not positioned as a generic savings, deposit, investment advisory, securities, or guaranteed-yield product.

Launch posture:

- Open Reserve first, preferably as gray launch / invite-only.
- Keep Alpha closed until Reserve has operated stably through a monitored period.
- Keep wallet signing disabled until production gate, audit, legal approval, and one internal mainnet rehearsal pass.
- Public verification proves application, seat type, sequence, state, wallet alias, date, and transaction reference only.
- Public verification must not show allocation amount, reward amount, loss amount, full wallet address, or private portfolio notes.

Reserve baseline:

- Product label: `Principal-custodied Reserve Seat`.
- Minimum: `720 72H`.
- Supply: `72 Reserve Seats` per app, `216` total across `multi-millionaire`, `72hours`, and `WAN`.
- Lock: `72 days` per lot.
- Principal: custodied by the app-specific `ReserveVault`.
- Redemption: mature principal may be requested from the same `ReserveVault` after maturity.
- Rewards: from `AppRewardPool`; rewards may be `0` and must never come from Reserve principal.
- Fees: user wallet pays TON network fees / gas.

Alpha baseline:

- Product label: `High-conviction Alpha Seat`.
- Minimum: `72,000 72H` for `72hours` and `WAN`; `720,000 72H` for `multi-millionaire`.
- Supply: `9 Alpha Seats` per app, `27` total.
- Duration: `72 weeks`.
- Principal: non-redeemable once allocated.
- Loss: partial or total principal loss is possible.
- Rewards: higher reward weight than Reserve, from `AppRewardPool`, may be `0`.
- Launch status: not open for v1 public mainnet launch unless separately approved.

## Pages And Copy Surfaces Requiring Legal Review

| Surface | Route / source | What legal must review | Required decision |
| --- | --- | --- | --- |
| Capital overview | `/capital`, `src/content/capital.ts`, `src/pages/Capital.tsx` | Hero claim, first-release numbers, Reserve and Alpha descriptions, risk disclosure blocks, review allocation total / seat holder metrics, app summaries, risk bands, wallet panel copy. | Approve / revise / block. |
| App detail pages | `/capital/multi-millionaire`, `/capital/72hours`, `/capital/wan`, `src/pages/CapitalApp.tsx` | App-specific summaries, status labels, risk bands, reward source summaries, Reserve/Alpha seat cards, thresholds, duration, redemption rules, action boundary wording, policy note. | Approve per app and per seat type. |
| Intent preparation panel | Capital action panel, `src/components/capital/CapitalIntentConsole.tsx`, `src/lib/capital-intents.ts` | Wallet connection requirement, request record wording, network/gas wording, transaction review wording, disabled signing reasons, BOC / explorer tracking labels. | Approve operational/legal boundary before signing opens. |
| My Capital portfolio | `/capital/me`, `src/pages/CapitalIdentity.tsx`, `src/content/capital.ts` | Private position and reward labels, Reserve lot status, Alpha cycle status, credential wording, invite metrics, redeem / reward request boundary. | Approve private account-style wording and no-guarantee treatment. |
| Public verification pages | `/capital/:slug/:type/:seatNumber`, `src/pages/CapitalVerify.tsx` | Public identity claims, public metric set, wallet alias, transaction reference, risk note, no amount/reward/loss exposure. | Approve privacy boundary and public verification copy. |
| Legal pages | `/legal/privacy`, `/legal/terms`, `/legal/disclaimer`, `src/content/legal.ts` | Existing non-investment, no-return, risk-assumption, third-party, privacy, and terms wording; whether Capital-specific terms/disclaimer addendum is required. | Approve existing pages or require Capital addendum. |
| External app links | WAN, 72hours, waitlist links | Whether linked destinations need matching risk copy, eligibility restrictions, or jurisdiction notices. | Approve link policy and required notices. |
| Admin / ops public incident copy | Launch plan status copy | Pause, indexer delay, Reserve mature-lot redeem support, reward delay, resolution, and rollback public status wording. | Approve incident/status copy before production. |

## Current Copy Scan And Applied Changes

Scan date: 2026-04-25.

Applied conservative public-copy changes:

- Replaced launch-facing verbs such as `Secure` / `Claim` with `Review` / `Request` on Capital seat surfaces.
- Replaced `Review TVL` with `Review allocation total` / `核对配置总量`.
- Replaced `Capital members` with `Seat holders` / `席位持有人`.
- Replaced `Claimable reward` with `Available reward record` / `可用奖励记录`.
- Replaced `Settled reward` with `Recorded reward` / `已记录奖励`.
- Replaced `Reward claim every 7 days` with `Reward request window every 7 days` / `每 7 天奖励请求窗口`.
- Replaced WAN `revenue share` wording with `operating revenue routing` / `运营收入路由`.
- Replaced public Reserve `principal protection` wording with `principal-first handling` / `本金优先处理`.
- Replaced public route metadata `yield data` / `收益数据` with `reward data` / `奖励数据`.
- Changed Alpha public status to closed for v1 and disabled the Alpha request CTA until separate approval.

Current scan result for reviewed Capital route copy:

- No public Capital page copy currently uses APY, APR, ROI, guaranteed return, fixed yield, dividend, interest, investment, securities, fund, deposit, risk-free, instant redemption, or revenue-share wording as an affirmative product claim.
- Internal technical/data surfaces have been renamed from `yield.*` to `reward.*` across the public website, shared package, API, Indexer, and contracts TypeScript models. The legacy `/yield/claim-intent` API path is retained only as a 410 migration boundary and does not generate a production payload.
- `Large Reserve Seat` and `Large Alpha Seat` replace the prior institutional tier labels and remain subject to final legal approval as neutral size/tier labels.
- Existing `/legal/privacy`, `/legal/terms`, and `/legal/disclaimer` are generic site docs. They still require explicit Capital approval or a Capital-specific addendum before `CAPITAL_LEGAL_APPROVAL_PATH` can be final.
- Jurisdiction, eligibility, sanctions, KYC, and tax positions remain owner/legal inputs and are not complete in this pack.

## Specific Copy Items For Review

Legal should explicitly approve or rewrite the following public concepts.

Core labels:

- `72H Capital`
- `Capital Seat`
- `Capital Identity`
- `Capital Member`
- `Seat holder`
- `Verified Capital Identity`
- `Principal-custodied Reserve Seat`
- `High-conviction Alpha Seat`
- `Capital Identity Card`
- `ReserveVault`
- `AppRewardPool`

Seat and scarcity claims:

- `243 limited seats across 3 applications`
- `72 Reserve Seats per app`
- `9 Alpha Seats per app`
- `First release`
- `Remaining seats`
- `Latest issued`
- `wallet-bound seat numbers`
- `non-transferable`

Reserve wording:

- `Principal-first capital entry`
- `72-day lock-up`
- `lot-based top-ups`
- `redemption only after maturity`
- `Mature principal is redeemed from the same ReserveVault`
- `Reserve identity stays even after full principal redemption`
- `Rewards may be 0 and never come from principal`

Alpha wording:

- `Scarce, longer-duration, higher-risk capital identity`
- `72-week mandate`
- `Principal is non-redeemable`
- `Partial or total principal loss is possible`
- `Higher reward weight`
- `Rewards may be 0`
- `Completed Alpha upgrades identity status after week 72`
- `Alpha closed for v1`

Metrics and dashboard labels:

- `Review allocation total`
- `Seat holders`
- `Available reward record`
- `Recorded reward`
- `Reward request window every 7 days`
- `Reward settlement every 7 weeks`
- `Operating surface / moderate beta`
- `Alpha status`
- `Closed for v1`
- `High beta / scarce identity`
- `Core surface / discretionary risk`

Conservative label changes have already been applied in source. Legal should confirm whether these replacement labels are approved or require further revision.

## Required Risk Disclosure Points

These points must appear in approved public copy wherever the relevant action is available.

General:

- 72H Capital copy is informational and operational, not investment, financial, tax, legal, securities, or accounting advice.
- No appreciation, yield, return, airdrop, allocation, reward, eligibility, liquidity, redemption timing, availability, or outcome is guaranteed.
- 72H token value, ecosystem usage, protocol rules, contract behavior, chain conditions, and third-party service availability can change.
- Users are responsible for wallet security, transaction review, network fees, and jurisdictional eligibility.
- Smart contract, indexer, API, wallet, RPC, explorer, bridge, database, and third-party dependency failures may delay or prevent actions.
- Public verification does not prove financial performance, account balance, PnL, suitability, or future eligibility.

Reserve:

- Reserve has a 72-day lot lock.
- Reserve principal is held by the app-specific ReserveVault.
- Mature Reserve principal may be requested from the same ReserveVault after maturity, subject to contract state, availability, and network conditions.
- Reserve rewards come from AppRewardPool, may be 0, are not guaranteed, and never come from Reserve principal.
- Top-ups may create new lock lots and do not reset or change the original seat number.
- Gas/network fees are paid by the user wallet and are not controlled by 72hours.
- Redemption support must not be described as instant or guaranteed at a specific clock time unless the contract and operations actually support that claim.

Alpha:

- Alpha must remain closed for v1 public launch unless a separate signed Alpha approval exists.
- Alpha is higher risk than Reserve.
- Alpha uses a 72-week duration / mandate.
- Alpha principal is non-redeemable once allocated.
- Partial or total principal loss is possible.
- Alpha rewards may be 0 and are not guaranteed.
- Higher reward weight must not be described as higher expected return, fixed return, priority payment, dividend, interest, or profit share.
- Completed Alpha is an identity / credential status only and does not unlock principal redemption.

Privacy and public identity:

- Public verification must omit allocation amount, reward value, loss value, full wallet address, and private notes.
- Wallet aliases / shortened wallet strings should not be marketed as anonymity or privacy guarantees.
- If analytics, error logging, wallet metadata, RPC calls, TonConnect, or third-party fonts are used, privacy policy coverage must remain accurate.

Operational:

- Before signing opens, copy must clearly state actions are review-only or unavailable for wallet signing.
- If mainnet signing opens, copy must require users to review target address, amount, payload, network, gas, and explorer status before sending.
- Pause, indexer delay, failed submission, stale status, redeem support, and reward delay copy must be approved before launch.

## Prohibited Terms And Claims

Do not use these terms or equivalent claims in public Capital copy unless legal explicitly approves the exact wording and required context.

Investment / securities positioning:

- `investment`
- `invest`
- `investor`
- `security`
- `share`
- `equity`
- `stock`
- `fund`
- `portfolio management`
- `asset management`
- `wealth management`
- `financial product`
- `deposit`
- `savings`
- `staking product`
- `fixed income`
- `bond`
- `dividend`
- `interest`
- `profit share`
- `revenue share` unless tied to an approved AppRewardPool policy and risk disclosure

Return guarantees:

- `guaranteed`
- `risk-free`
- `principal guaranteed`
- `principal protection`
- `capital protected`
- `insured`
- `fixed return`
- `fixed yield`
- `guaranteed reward`
- `guaranteed APY`
- `APR`
- `APY`
- `ROI`
- `passive income`
- `stable income`
- `earn`
- `yield` as a marketing promise
- `profit`
- `win`
- `moon`
- `pump`

Redemption and liquidity overclaims:

- `instant redemption`
- `always redeemable`
- `liquid`
- `cash out anytime`
- `withdraw anytime`
- `no lock`
- `guaranteed exit`
- `guaranteed maturity payment`

Eligibility and scarcity overclaims:

- `approved investor`
- `qualified investor`
- `institutional product`
- `exclusive investment opportunity`
- `private placement`
- `allocation guaranteed`
- `seat guarantees access`
- `seat guarantees rewards`
- `seat guarantees future eligibility`

Chinese prohibited equivalents:

- `投资`
- `投资人`
- `证券`
- `股权`
- `股份`
- `基金`
- `理财`
- `存款`
- `储蓄`
- `固定收益`
- `分红`
- `利息`
- `保本`
- `本金保护`
- `刚兑`
- `无风险`
- `稳赚`
- `保证收益`
- `固定收益率`
- `年化`
- `APY`
- `APR`
- `ROI`
- `被动收入`
- `躺赚`
- `收益承诺`
- `随时赎回`
- `即时赎回`
- `流动性保证`
- `包赚`
- `稳赚不赔`

Preferred alternatives:

- Use `allocation` / `配置` only when paired with risk and non-advisory context.
- Use `reward` / `奖励` only when paired with `may be 0` and no-guarantee context.
- Use `capital identity` / `资本身份` for identity positioning.
- Use `seat` / `席位` for non-transferable identity capacity.
- Use `review amount` / `核对金额` instead of performance or return terms.
- Use `principal-first handling` / `本金优先处理` instead of principal protection terms.
- Use `request redemption after maturity` / `到期后申请赎回` instead of instant withdrawal language.

## Suggested Approval Conclusion Template

Use this only after legal review is complete. Replace all bracketed fields.

```md
# 72H Capital Legal Approval

Status: approved for [Reserve gray launch / Reserve public launch / Alpha launch / limited staging only].

Approver:
Legal reviewer:
Business owner:
Approval date:
Approved version / commit:
Approved routes:

- /capital
- /capital/multi-millionaire
- /capital/72hours
- /capital/wan
- /capital/me
- /capital/:slug/:type/:seatNumber
- /legal/privacy
- /legal/terms
- /legal/disclaimer

Approved product scope:

- Reserve: [approved / approved with changes / not approved]
- Alpha: [approved / approved with changes / not approved]
- Wallet signing: [approved / not approved]
- Public verification: [approved / approved with changes / not approved]

Required conditions:

- Reserve copy states 72-day lock, same-ReserveVault mature redemption, user-paid gas, rewards may be 0, and rewards never come from principal.
- Alpha copy states 72-week duration, non-redeemable principal, partial or total principal loss possible, higher reward weight, and rewards may be 0.
- Alpha is displayed as closed for v1 unless this approval expressly covers Alpha launch.
- Public verification omits allocation amount, reward amount, loss amount, full wallet address, and private notes.
- Existing legal pages are approved or Capital-specific addendum is published.
- Jurisdiction / eligibility restrictions are published where required.
- Prohibited terms scan passed.

Jurisdiction / restriction notes:

- [Insert approved notes.]

Open legal conditions:

- [None / list conditions.]

Conclusion:

[72H Capital v1 Reserve gray launch copy is approved for production after the other production gates pass. This approval does not cover Alpha launch, new reward policy language, new jurisdictions, or material product changes unless separately approved.]
```

## Pre-Launch Legal Checklist

Legal approval cannot be treated as complete until every item below is checked or explicitly waived in writing.

Copy review:

- [ ] `/capital` overview approved in Chinese and English.
- [ ] All three app pages approved in Chinese and English.
- [ ] `/capital/me` portfolio wording approved, including `Available reward record`, private position records, Reserve lot status, Alpha cycles, credentials, and invite metrics.
- [ ] Public verification wording approved, including wallet alias and transaction reference treatment.
- [ ] Intent console and wallet signing / disabled-signing states approved.
- [ ] Pause, indexer delay, reward delay, redeem support, failed submission, and resolution status copy approved.
- [ ] Existing `/legal/privacy`, `/legal/terms`, `/legal/disclaimer` approved for Capital or Capital addendum published.

Risk disclosures:

- [ ] Reserve pages state 72-day lock.
- [ ] Reserve pages state principal is custodied in app-specific ReserveVault.
- [ ] Reserve pages state mature principal is redeemed from the same ReserveVault.
- [ ] Reserve pages state AppRewardPool rewards may be 0.
- [ ] Reserve pages state rewards never come from Reserve principal.
- [ ] Reserve pages state user wallet pays network fees.
- [ ] Alpha pages state 72-week duration.
- [ ] Alpha pages state principal is non-redeemable.
- [ ] Alpha pages state partial or total principal loss is possible.
- [ ] Alpha pages state rewards may be 0.
- [ ] Alpha pages state higher reward weight is not a guaranteed or expected return.
- [ ] Alpha pages state Alpha is closed for v1 unless a separate Alpha launch approval is signed.

Forbidden claims:

- [ ] English prohibited terms scan completed.
- [ ] Chinese prohibited terms scan completed.
- [ ] Any unavoidable flagged term has documented legal approval and surrounding risk context.
- [ ] No public page uses APY/APR/ROI, guaranteed return, principal protection, fixed yield, dividend, interest, investment, securities, fund, deposit, risk-free, instant redemption, revenue share, or equivalent claims.
- [ ] Legacy `/yield/claim-intent` remains a 410-only migration boundary and no public or production payload uses `yield.*` intent naming.

Privacy and data:

- [ ] Public verification does not show allocation amount, reward amount, loss amount, full wallet address, or private notes.
- [ ] Wallet alias / shortened wallet copy is approved and not described as anonymity.
- [ ] Privacy policy reflects third-party resources, wallet/RPC/bridge interactions, logs, and contact channels used in production.

Launch scope:

- [ ] Legal has approved whether launch is invite-only Reserve gray launch or public Reserve launch.
- [ ] Alpha remains blocked unless separately approved.
- [ ] Alpha request CTA remains disabled in public production unless separately approved.
- [ ] Jurisdiction restrictions, user eligibility notes, and geo/access restrictions are approved.
- [ ] Sanctions screening / restricted-person handling is approved or explicitly waived for the launch scope.
- [ ] Tax responsibility and reporting-position wording is approved.
- [ ] AppRewardPool funding policy approved and separate from ReserveVault principal.
- [ ] ReserveVault redemption verification approved for each app.
- [ ] External audit report is available and reviewed for legal blockers.

Production gate:

- [ ] `CAPITAL_LEGAL_APPROVAL_PATH` points to the final signed approval artifact, not this draft.
- [ ] The final signed approval references the approved commit/version.
- [ ] The production gate has legal approval, audit report, testnet rehearsal, Reserve redemption verification, and AppRewardPool policy artifact paths.
- [ ] No mainnet signing is enabled before legal approval, audit approval, production gate, and internal mainnet rehearsal pass.

## Material Change Triggers

Legal must re-review before launch or continued operation if any of these change:

- Reserve lock duration, redemption mechanics, ReserveVault custody model, or same-contract redemption guarantee.
- Alpha duration, principal treatment, loss language, reward cadence, or launch status.
- Seat supply, transferability, NFT status, secondary market, resale, or seat assignment rules.
- AppRewardPool funding sources, reward calculation, reward terminology, or reward distribution policy.
- Jurisdiction availability, user eligibility, sanctions, KYC, tax, or compliance position.
- Public verification data fields, privacy treatment, wallet display, or transaction/explorer exposure.
- Any movement from review-only / disabled signing to live mainnet signing.
- Any use of prohibited investment, yield, return, guarantee, or redemption language.
