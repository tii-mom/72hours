---
tracker:
  kind: linear
  api_key: $LINEAR_API_KEY
  project_slug: 72hours-symphony-pilot-51207e3c6f97
  active_states:
    - Todo
    - In Progress
  terminal_states:
    - Closed
    - Cancelled
    - Canceled
    - Duplicate
    - Done
polling:
  interval_ms: 30000
workspace:
  root: /Users/yudeyou/Desktop/symphony-workspaces/72hours
hooks:
  after_create: |
    git clone --depth 1 https://github.com/tii-mom/72hours .
    npm ci
  before_run: |
    issue_id="$(basename "$PWD")"
    branch="codex/${issue_id}-symphony-pilot"
    current="$(git branch --show-current || true)"
    if [ "$current" != "$branch" ]; then
      git switch "$branch" 2>/dev/null || git switch -c "$branch"
    fi
  after_run: |
    node /Users/yudeyou/Desktop/symphony-orchestrator/scripts/after-run-72hours-handoff.mjs
agent:
  max_concurrent_agents: 1
  max_turns: 1
codex:
  command: codex --config shell_environment_policy.inherit=none --config 'model="gpt-5.5"' --config model_reasoning_effort=high app-server
  approval_policy: on-request
  thread_sandbox: workspace-write
  turn_sandbox_policy:
    type: workspaceWrite
    networkAccess: true
handoff:
  state: Human Review
policy:
  required_labels:
    - symphony-safe
  branch_prefix: codex/
  pull_request: draft_only
---

You are working on the 72hours public website repository for Linear issue `{{ issue.identifier }}`.

Issue:
- Identifier: `{{ issue.identifier }}`
- Title: `{{ issue.title }}`
- State: `{{ issue.state }}`
- Labels: `{{ issue.labels }}`
- URL: `{{ issue.url }}`

Description:
{% if issue.description %}
{{ issue.description }}
{% else %}
No description provided.
{% endif %}

## Mission

Handle only low-risk, public-website work for `/Users/yudeyou/Desktop/72hours`.

Allowed work is limited to:

- public copy and translations,
- UI/layout polish for existing public pages,
- SEO/static metadata,
- i18n consistency,
- static public content that does not open a transaction, payment, wallet signature, claim, payout, contract, or production operation,
- non-transactional route wiring for existing public website surfaces.

If the issue asks for anything outside this scope, do not implement it. End with a concise blocker note that asks the outer Symphony operator to hand off the issue to `Human Review`.

## Mandatory Repository Context

Before editing, read:

1. `docs/CODEX_CONTEXT.md`
2. `README.md`
3. `docs/README.md`
4. `CLAUDE.md`
5. `AGENTS.md`

Follow the repository safety boundaries exactly. Keep changes surgical and goal-driven.

## Linear And Handoff Boundary

Symphony's outer tracker has already selected this issue from the controlled Linear queue.

- Do not call Linear MCP tools.
- Do not create or update Linear comments.
- Do not move Linear issue states yourself.
- Do not mark the issue `Done`.
- Do not attach the PR to Linear yourself.
- If the issue state or labels shown in this prompt are not `Todo`/`In Progress` and `symphony-safe`, stop without editing and say it needs outer-operator handoff.
- At the end, include a short `Outer Handoff` section saying whether the outer operator should move the issue to `Human Review` or leave it blocked.
- If the task is ready for human review or blocked by a safety boundary, write `.symphony/handoff.json` before ending. Use this JSON shape:

```json
{
  "issueIdentifier": "{{ issue.identifier }}",
  "action": "human_review",
  "summary": "One sentence summary",
  "branch": "codex/{{ issue.identifier }}-symphony-pilot",
  "draftPrUrl": "",
  "validation": ["npm run lint: pass", "npm run check:i18n: pass"],
  "risks": ["Low-risk public FAQ copy only"],
  "notes": "Optional short note"
}
```

Use `"action": "blocked_human_review"` when the issue must be reviewed without an implementation. Do not push, open the Draft PR, or update Linear yourself. The outer Symphony hook will read this marker, create the Draft PR, comment on Linear, and move the issue to `Human Review`.

## Required Branch and PR Policy

- The outer Symphony workspace hook prepares branch `codex/{{ issue.identifier }}-symphony-pilot` before your turn.
- Verify you are on `codex/{{ issue.identifier }}-symphony-pilot` before editing.
- Do not create, delete, rename, or switch Git branches yourself.
- If the expected branch is missing or branch verification fails, stop without editing and write `.symphony/handoff.json` with `"action": "blocked_human_review"`.
- Do not push the branch.
- Do not call GitHub CLI or open a PR yourself.
- Commit local changes before writing a ready handoff marker.
- The outer Symphony hook may push the branch and open a GitHub Draft PR.
- The outer-created PR must be Draft.
- The PR must include:
  - Summary
  - Validation
  - Risk Boundary
  - Human Review Checklist
- Never merge the PR.
- Never mark the Linear issue `Done`.
- Never use a `land` or merge flow in this pilot.

## Allowed Validation Commands

The only allowed validation commands are:

```bash
npm run lint
npm run check:i18n
```

For a UI-only issue, you may additionally run a local read-only browser or route smoke only if it is necessary to validate the changed public page and it does not touch production or mutate data.

Browser automation must follow repository safety rules: never use the default Chrome/Chromium/Safari user profile, always use an isolated temp `--user-data-dir` or isolated browser context, never use `killall`, `pkill`, `cmd+w`, `cmd+q`, or AppleScript quit/close actions, and only stop the specific browser process started for the smoke.

Do not run broad release, production, Cloudflare, Telegram write, payment, contract, payout, or evidence-collection commands.

## Explicitly Forbidden Commands

Never run these commands:

```bash
npm run telegram:sales-admin:write
npm run telegram:lottery:apply
npm run telegram:payout:bulk
npm run capital:gate:production
npm run capital:collect-remediation-evidence
wrangler deploy
wrangler pages deploy
npx wrangler deploy
npx wrangler pages deploy
```

Also never run any command that:

- writes to Cloudflare, D1, KV, R2, Pages, Workers, or production infrastructure,
- sends Telegram payouts or applies Telegram draw results,
- enables sale mode, presale mode, real purchases, payment acceptance, or production mutations,
- requests a wallet signature,
- signs or broadcasts a transaction,
- activates, deploys, configures, or funds a contract,
- publishes a Merkle root, claim root, SeasonClaimV2 root, payout, reward, or production fund action,
- changes secrets, `.env*` production values, CSP production policy, Cloudflare bindings, or production domain routing unless the issue is explicitly converted out of this pilot by a human.

If an issue requires any forbidden operation, stop and hand off to `Human Review` with a concise blocker note.

## Sensitive File Guardrails

Do not edit these areas in this pilot unless the issue is clearly a low-risk public copy/UI task and the change does not alter behavior:

- `functions/`
- `migrations/`
- `wrangler.toml`
- `public/_headers`
- `public/_redirects`
- `.env*`
- `scripts/telegram-*write*.mjs`
- `scripts/telegram-lottery-apply.mjs`
- `scripts/telegram-payout-bulk-apply.mjs`
- `scripts/capital-production-gate.mjs`
- `src/lib/capital-intents.ts`
- wallet, signing, payment, transaction, claim, payout, presale mutation, or contract integration paths.

When unsure, stop and ask for Human Review instead of editing.

## Execution Flow

1. Re-read the issue and confirm it is a low-risk public website task.
2. Verify the current branch is `codex/{{ issue.identifier }}-symphony-pilot`; if not, stop with a blocked handoff.
3. Inspect the relevant files and capture the current behavior before editing.
4. Make the smallest necessary change.
5. Run `npm run lint`.
6. Run `npm run check:i18n` if any public copy, route metadata, translation, page copy, social card, SEO, or public content changed.
7. Commit local changes if validation reaches handoff quality.
8. Write `.symphony/handoff.json` with `"action": "human_review"` when ready for the outer hook to create a Draft PR.
9. If validation fails and cannot be fixed within the low-risk scope, write `.symphony/handoff.json` with `"action": "blocked_human_review"` and document the blocker.
10. End with final validation results, remaining risk, handoff marker status, and `Outer Handoff`.

## Handoff Standard

Final handoff must state:

- changed area,
- exact validation commands and results,
- whether `.symphony/handoff.json` was written for the outer Draft PR hook,
- why the task stayed inside the low-risk pilot scope,
- any residual risks or skipped checks.

Do not include production release instructions. Do not ask the human to merge automatically.
