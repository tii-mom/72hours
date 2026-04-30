#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const files = execFileSync("git", ["ls-files", "src/content", "src/pages", "src/components"], {
  cwd: root,
  encoding: "utf8",
})
  .split("\n")
  .filter(Boolean)
  .filter((file) => /\.(ts|tsx)$/.test(file));

const bannedCopyPatterns = [
  /\bCapital workflow\b/i,
  /\bmanual review\b/i,
  /\bintent review\b/i,
  /\bSend intent\b/i,
  /\bEligibility review\b/i,
  /控制台/,
  /资格核对/,
  /AI-assisted/i,
  /人工智能/,
];

const allowedSurfaceLines = [
  "bg-surface",
  "surfaceHref",
  "surfaceLabel",
  "surfaceExternal",
  "surfaceAction",
  "surfaceIsExternal",
  "--surface",
];

const issues = [];
for (const file of files) {
  const content = readFileSync(join(root, file), "utf8");
  const lines = content.split("\n");

  lines.forEach((line, index) => {
    for (const pattern of bannedCopyPatterns) {
      if (pattern.test(line)) {
        issues.push(`${file}:${index + 1}: banned public-copy term: ${pattern}`);
      }
    }

    if (/\bsurface\b/i.test(line) && !allowedSurfaceLines.some((allowed) => line.includes(allowed))) {
      issues.push(`${file}:${index + 1}: avoid public-copy/internal term "surface"`);
    }
  });
}

if (issues.length) {
  console.error("Public copy/i18n check failed:\n" + issues.join("\n"));
  process.exit(1);
}

console.log(`Public copy/i18n check passed for ${files.length} files.`);
