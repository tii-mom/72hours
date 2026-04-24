# Documentation Index

Start here when you need project docs. For Codex work, open only the specific document relevant to the task instead of scanning the whole folder.

## Canonical Specs

- [72hours Green Book (中文正式版)](spec/greenbook.md)
- [72hours Green Book (English Official Version)](spec/greenbook.en.md)
- [72H Capital 功能开发文档](spec/capital.md)
- [Launch Checklist](launch-checklist.md)

## Related Repos

- `../72hours`: 官网前端与 `Capital Preview`
- `../72h-capital-api`: Capital API、索引接口占位与签名意图入口
- `../72h-capital-contracts`: TON 合约骨架与规则约束文档
- `../72h-capital-admin`: Capital 运营与风控后台骨架

## Notes

- `spec/greenbook.md` is the primary reference for Chinese content.
- `spec/greenbook.en.md` is the English official version.
- `spec/capital.md` defines the 72H Capital seat, identity, allocation, contract, and launch requirements.
- The public website source defaults Capital data to `VITE_CAPITAL_DATA_MODE=preview`; testnet, staging, and production deployments opt into API mode with environment variables once the Capital service is live.
- Launch security defaults live in `public/_headers`: production scripts should remain same-origin Vite assets plus the hashed theme bootstrap, with wallet bridge frames allowlisted explicitly.
- Keep this index short so it stays a fast entry point for humans and agents.
