# Telegram Bot App Data

72hours 应用页的信息由 Telegram Bot 更新，不需要后台管理。Bot 写入的数据必须按应用 `slug` 做幂等更新；前端只读取已经审核通过的公开字段。

## Required Payload

```json
{
  "slug": "wan",
  "name": "WAN",
  "oneLineValue": "浏览器优先的安全接入控制台。",
  "chains": ["TON"],
  "appCategories": ["tool"],
  "developmentStage": "new",
  "isInvestable": true,
  "heroImageSrc": "/apps/wan.webp",
  "heroImageAlt": "WAN app hero",
  "externalLink": {
    "label": "进入",
    "url": "https://wan.lat",
    "type": "app",
    "isOfficial": true
  },
  "priority": 2,
  "visibility": "public",
  "updatedBy": "telegram:user-id",
  "updatedAt": "2026-04-26T00:00:00.000Z"
}
```

## Field Rules

| Field | Type | Rule |
| --- | --- | --- |
| `slug` | string | Stable app id. Lowercase kebab-case. |
| `chains` | `TON \| BSC \| BASE \| ETH` array | At least one chain. Used by app filters. |
| `appCategories` | `tool \| game \| social \| capital \| content` array | At least one category. |
| `developmentStage` | `new \| live \| building \| investable` | Drives stage filters and labels. |
| `isInvestable` | boolean | `true` only when the app can accept investment interest. |
| `heroImageSrc` | string | Optional enhancement image. Public image path or reviewed CDN URL. Prefer `/apps/{slug}.webp`. |
| `heroImageAlt` | string | Optional short visual description, no marketing copy. |
| `externalLink.url` | string | Official destination. Must be HTTPS or an internal route beginning with `/`. |
| `visibility` | `public \| hidden` | `hidden` keeps data stored but removes it from the app page. |

## Validation Flow

1. Bot receives a draft update and validates enum fields.
2. Bot verifies `externalLink.url` is official or manually approved.
3. If `heroImageSrc` is provided, Bot checks it is a real image and below the mobile asset budget.
4. Bot writes the record with `updatedBy` and `updatedAt`.
5. Frontend rebuild or content sync reads only public records.

## API Endpoints

`POST /api/telegram/apps`

- Auth: `x-telegram-bot-secret: <H72H_TELEGRAM_BOT_SECRET>`
- Storage: Cloudflare KV binding `APP_DISCOVERY_KV`
- Behavior: validates payload, checks link whitelist, checks image reachability and image content type, then writes `app:{slug}`

`GET /api/apps`

- Returns public app records for the frontend.
- The frontend merges these records over the local content file, so the site still works if the API is unavailable.

Allowed destination hosts:

- `72hours.72h.lol`
- `distribution.72h.lol`
- `wan.lat`
- `t.me`
- `telegram.me`

Allowed remote image hosts:

- `72hours.72h.lol`
- `imagedelivery.net`
- `images.unsplash.com`

Internal images must live under `/apps/` and use `avif`, `webp`, `png`, `jpg`, or `jpeg`.

## 72H Balance Proof Strategy

72H balance proof should use TonAPI as the first source:

- Endpoint: `/v2/accounts/{wallet}/jettons/{tokenContract}`
- Timeout: 6 seconds
- Retry: 2 attempts with short backoff
- Success: compare normalized jetton balance against the required threshold
- Failure: return `manual_review`, keep the user in flow, and send wallet address through Telegram for human verification
- Trace: frontend stores the most recent local verification records and best-effort posts each result to `POST /api/72h-verifications`

The current 72H token contract is:

```text
EQBGIzEDvvKObStrcVb6i5Z1-8uYZYtUrYzF2rFZU7xUAXVg
```
