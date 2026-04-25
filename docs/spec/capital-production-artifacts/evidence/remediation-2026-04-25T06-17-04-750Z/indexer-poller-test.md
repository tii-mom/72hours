# indexer-poller-test

cwd: /Users/yudeyou/Desktop/72h-capital-indexer
command: npm run test:poller
startedAt: 2026-04-25T06:17:14.931Z
finishedAt: 2026-04-25T06:17:15.224Z
exitCode: 0
expectedExitCodes: 0
ok: true

## stdout
```
> 72h-capital-indexer@0.1.0 test:poller
> node --import tsx --test tests/poller-projection.test.ts

TAP version 13
# Subtest: reserve rehearsal event is idempotent and exports seat, lot, chain event, and verification payload
ok 1 - reserve rehearsal event is idempotent and exports seat, lot, chain event, and verification payload
  ---
  duration_ms: 8.194375
  type: 'test'
  ...
# Subtest: postgres projection writer is an explicit no-op without enable flag
ok 2 - postgres projection writer is an explicit no-op without enable flag
  ---
  duration_ms: 3.94175
  type: 'test'
  ...
# Subtest: v1 simplified events project alpha, rewards, and principal redeems
ok 3 - v1 simplified events project alpha, rewards, and principal redeems
  ---
  duration_ms: 14.204708
  type: 'test'
  ...
# Subtest: ton poller disabled and dry-run paths do not require secrets or advance cursors
ok 4 - ton poller disabled and dry-run paths do not require secrets or advance cursors
  ---
  duration_ms: 8.477875
  type: 'test'
  ...
1..4
# tests 4
# suites 0
# pass 4
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 193.664792
```

## stderr
```

```
