# Agent Instructions

## Fast Context Path

For a new Codex thread, read these first and stop there unless the task needs deeper context:

1. `docs/CODEX_CONTEXT.md`
2. `README.md`
3. `docs/README.md`

Do not bulk-load `docs/spec/capital-production-artifacts/evidence/**` or full Capital specs. Open a specific evidence snapshot only when the task asks for audit, launch-gate, deployment, or verification details.

## Browser Automation Safety

- Never launch Chrome, Chromium, or Safari automation against the default user profile.
- Always use an isolated temp `--user-data-dir` or an isolated browser context.
- Never use `killall`, `pkill`, `cmd+w`, `cmd+q`, or AppleScript quit/close actions for browser cleanup.
- Only stop the specific browser process started by the automation.
- Prefer repository wrappers such as `/Users/yudeyou/new-72h/scripts/run-isolated-headless-chrome.mjs` over raw browser binary invocations.

## Repo Notes

- This repo is the public `72hours` website: Vite, React, Tailwind CSS.
- Capital public pages live in this repo, but Capital API, contracts, admin, indexer, and shared types live in sibling repos.
- Keep generated evidence logs out of active Codex context. Summarize results in a short README or context note instead.

## Engineering Discipline

Before coding, read `CLAUDE.md` and follow its Karpathy-style rules: think first, keep changes simple, edit surgically, and verify against the requested goal.
