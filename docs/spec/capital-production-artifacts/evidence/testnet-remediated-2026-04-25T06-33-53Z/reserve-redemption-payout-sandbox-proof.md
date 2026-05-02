# Reserve Redemption Payout Sandbox Proof

Status: passed.
Date: 2026-04-25
Scope: local TON sandbox proof for the remediated `ReserveVault` payout path.

The deployed testnet `ReserveVault` uses the real 72-day lot lock, so a same-day testnet redemption cannot mature naturally. This sandbox proof covers the redemption payout behavior that cannot be completed on the current testnet deployment without waiting 72 days or deploying a dedicated short-lock test contract.

## Command

```bash
cd /Users/yudeyou/Desktop/72h-capital-contracts
npx vitest run tests/reserve-redemption-payout.spec.ts
npm test
```

## Result

- `tests/reserve-redemption-payout.spec.ts`: 2 tests passed.
- Full contract test suite: 45 tests passed.

## Proven Behavior

- A matured lot `RecordPrincipalRedeem` creates pending redemption state.
- The vault sends a Jetton `Transfer` payout request from the vault Jetton wallet to the lot owner.
- `FinalizePrincipalRedeem` deducts:
  - redeemed amount by lot,
  - principal by seat,
  - total principal.
- A bounced payout clears pending state without deducting lot/principal/total principal.
- After bounce cleanup, the same lot can be retried.

## Files

- `/Users/yudeyou/Desktop/72h-capital-contracts/tests/reserve-redemption-payout.spec.ts`
- `/Users/yudeyou/Desktop/72h-capital-contracts/contracts/ReserveVault.tact`

## Audit Note

This is not a replacement for the final 72-day testnet redemption transaction. It is acceptable as same-day engineering evidence for the payout state machine. The final production gate should still require either:

- a short-lock audited test deployment used only for rehearsal, or
- a real mature-lot testnet redemption after the 72-day lock expires.
