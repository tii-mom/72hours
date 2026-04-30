#!/usr/bin/env node
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const workspaceRoot = path.dirname(root);
const repoPath = (envName, fallbackDir) =>
  process.env[envName] || path.join(workspaceRoot, fallbackDir);
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const evidenceDir = path.join(
  root,
  "docs/spec/capital-production-artifacts/evidence",
  `remediation-${timestamp}`,
);

const commands = [
  {
    name: "contracts-tact-build",
    cwd: repoPath("H72H_CAPITAL_CONTRACTS_DIR", "72h-capital-contracts"),
    cmd: "npm",
    args: ["run", "tact:build"],
  },
  {
    name: "contracts-typecheck",
    cwd: repoPath("H72H_CAPITAL_CONTRACTS_DIR", "72h-capital-contracts"),
    cmd: "npm",
    args: ["run", "typecheck"],
  },
  {
    name: "contracts-test",
    cwd: repoPath("H72H_CAPITAL_CONTRACTS_DIR", "72h-capital-contracts"),
    cmd: "npm",
    args: ["run", "test"],
  },
  {
    name: "contracts-build",
    cwd: repoPath("H72H_CAPITAL_CONTRACTS_DIR", "72h-capital-contracts"),
    cmd: "npm",
    args: ["run", "build"],
  },
  {
    name: "shared-typecheck",
    cwd: repoPath("H72H_CAPITAL_SHARED_DIR", "72h-capital-shared"),
    cmd: "npm",
    args: ["run", "typecheck"],
  },
  {
    name: "api-check",
    cwd: repoPath("H72H_CAPITAL_API_DIR", "72h-capital-api"),
    cmd: "npm",
    args: ["run", "check"],
  },
  {
    name: "api-capital-route-test",
    cwd: repoPath("H72H_CAPITAL_API_DIR", "72h-capital-api"),
    cmd: "npm",
    args: ["run", "test:capital"],
  },
  {
    name: "indexer-check",
    cwd: repoPath("H72H_CAPITAL_INDEXER_DIR", "72h-capital-indexer"),
    cmd: "npm",
    args: ["run", "check"],
  },
  {
    name: "indexer-poller-test",
    cwd: repoPath("H72H_CAPITAL_INDEXER_DIR", "72h-capital-indexer"),
    cmd: "npm",
    args: ["run", "test:poller"],
  },
  {
    name: "admin-build",
    cwd: repoPath("H72H_CAPITAL_ADMIN_DIR", "72h-capital-admin"),
    cmd: "npm",
    args: ["run", "build"],
  },
  {
    name: "website-lint",
    cwd: root,
    cmd: "npm",
    args: ["run", "lint"],
  },
  {
    name: "website-build",
    cwd: root,
    cmd: "npm",
    args: ["run", "build"],
  },
  {
    name: "production-gate-skip-network",
    cwd: root,
    cmd: "node",
    args: ["scripts/capital-production-gate.mjs", "--skip-network"],
    expectedExitCodes: [1],
  },
];

function runCommand(step) {
  return new Promise((resolve) => {
    const startedAt = new Date().toISOString();
    const child = spawn(step.cmd, step.args, {
      cwd: step.cwd,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      const text = chunk.toString();
      stdout += text;
      process.stdout.write(text);
    });
    child.stderr.on("data", (chunk) => {
      const text = chunk.toString();
      stderr += text;
      process.stderr.write(text);
    });
    child.on("close", (code) => {
      const expected = step.expectedExitCodes ?? [0];
      const ok = expected.includes(code ?? -1);
      resolve({
        name: step.name,
        cwd: step.cwd,
        command: [step.cmd, ...step.args].join(" "),
        startedAt,
        finishedAt: new Date().toISOString(),
        exitCode: code,
        expectedExitCodes: expected,
        ok,
        stdout,
        stderr,
      });
    });
  });
}

mkdirSync(evidenceDir, { recursive: true });

const results = [];
for (const command of commands) {
  console.log(`\n== ${command.name} ==`);
  const result = await runCommand(command);
  results.push(result);
  const log = [
    `# ${result.name}`,
    ``,
    `cwd: ${result.cwd}`,
    `command: ${result.command}`,
    `startedAt: ${result.startedAt}`,
    `finishedAt: ${result.finishedAt}`,
    `exitCode: ${result.exitCode}`,
    `expectedExitCodes: ${result.expectedExitCodes.join(", ")}`,
    `ok: ${result.ok}`,
    ``,
    `## stdout`,
    "```",
    result.stdout.trim(),
    "```",
    ``,
    `## stderr`,
    "```",
    result.stderr.trim(),
    "```",
    ``,
  ].join("\n");
  writeFileSync(path.join(evidenceDir, `${result.name}.md`), log);
}

const allOk = results.every((result) => result.ok);
const summary = [
  "# Capital Remediation Evidence",
  "",
  `Generated: ${new Date().toISOString()}`,
  `Status: ${allOk ? "pass" : "fail"}`,
  "",
  "| Step | Expected exit | Actual exit | Result |",
  "| --- | --- | --- | --- |",
  ...results.map(
    (result) =>
      `| ${result.name} | ${result.expectedExitCodes.join(", ")} | ${result.exitCode} | ${result.ok ? "pass" : "fail"} |`,
  ),
  "",
  "This is local engineering evidence only. It does not replace the external audit report, testnet rehearsal artifact, or production deployment evidence.",
  "",
].join("\n");

writeFileSync(path.join(evidenceDir, "README.md"), summary);
console.log(`\nEvidence written to ${evidenceDir}`);

if (!allOk) {
  process.exit(1);
}
