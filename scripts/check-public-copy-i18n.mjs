#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const changedFiles = Array.from(
  new Set([
    ...gitLines(["diff", "--name-only", "--diff-filter=ACMR", "HEAD", "--", "src/content"]),
    ...gitLines(["diff", "--cached", "--name-only", "--diff-filter=ACMR", "--", "src/content"]),
  ]),
).filter((file) => file.endsWith(".ts"));

if (!changedFiles.length) {
  console.log("Public copy/i18n structure check passed: no changed src/content files.");
  process.exit(0);
}

const issues = [];

for (const file of changedFiles) {
  const source = readFileSync(file, "utf8");
  const pairs = findLocalePairs(source);

  for (const [baseName, pair] of pairs) {
    if (!pair.Zh || !pair.En) continue;
    compareShapes(file, baseName, shapeOfLiteral(pair.Zh), shapeOfLiteral(pair.En));
  }
}

if (issues.length) {
  console.error("Public copy/i18n structure check failed:\n" + issues.join("\n"));
  process.exit(1);
}

console.log(`Public copy/i18n structure check passed for ${changedFiles.length} changed content file(s).`);

function gitLines(args) {
  return execFileSync("git", args, { encoding: "utf8" })
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function findLocalePairs(source) {
  const pairs = new Map();
  const declarationPattern = /const\s+([A-Za-z0-9_]+)(Zh|En)\b/g;

  for (const match of source.matchAll(declarationPattern)) {
    const [, baseName, locale] = match;
    const equalsIndex = source.indexOf("=", match.index);
    if (equalsIndex === -1) continue;

    const literalStart = findLiteralStart(source, equalsIndex + 1);
    if (literalStart === -1) continue;

    const literal = readBalancedLiteral(source, literalStart);
    if (!literal) continue;

    if (!pairs.has(baseName)) pairs.set(baseName, {});
    pairs.get(baseName)[locale] = literal;
  }

  return pairs;
}

function findLiteralStart(source, start) {
  for (let index = start; index < source.length; index += 1) {
    if (/\s/.test(source[index])) continue;
    return source[index] === "{" || source[index] === "[" ? index : -1;
  }
  return -1;
}

function readBalancedLiteral(source, start) {
  const opener = source[start];
  const closer = opener === "{" ? "}" : "]";
  let depth = 0;
  let quote = null;

  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    const previous = source[index - 1];

    if (quote) {
      if (char === quote && previous !== "\\") quote = null;
      continue;
    }

    if (char === "\"" || char === "'" || char === "`") {
      quote = char;
      continue;
    }

    if (char === opener) depth += 1;
    if (char === closer) depth -= 1;
    if (depth === 0) return source.slice(start, index + 1);
  }

  return "";
}

function shapeOfLiteral(value) {
  const normalized = value.replace(/(["'`])(?:\\.|(?!\1)[\s\S])*\1/g, "\"\"");
  return parseShape(normalized.trim());
}

function parseShape(value) {
  if (value.startsWith("[")) return parseArrayShape(value);
  if (value.startsWith("{")) return parseObjectShape(value);
  return "scalar";
}

function parseArrayShape(value) {
  const inner = unwrap(value, "[", "]");
  return { type: "array", items: splitTopLevel(inner, ",").filter(Boolean).map(parseShape) };
}

function parseObjectShape(value) {
  const inner = unwrap(value, "{", "}");
  const keys = {};

  for (const entry of splitTopLevel(inner, ",").filter(Boolean)) {
    const separator = findTopLevelSeparator(entry, ":");
    if (separator === -1) continue;

    const rawKey = entry.slice(0, separator).trim();
    const key = rawKey.replace(/^["'`]|["'`]$/g, "");
    keys[key] = parseShape(entry.slice(separator + 1).trim());
  }

  return { type: "object", keys };
}

function compareShapes(file, label, zhShape, enShape, path = "") {
  if (shapeType(zhShape) !== shapeType(enShape)) {
    issues.push(`${file}:${label}${path}: zh/en shape type mismatch`);
    return;
  }

  if (zhShape?.type === "array") {
    if (zhShape.items.length !== enShape.items.length) {
      issues.push(`${file}:${label}${path}: zh/en array length mismatch (${zhShape.items.length} vs ${enShape.items.length})`);
      return;
    }

    zhShape.items.forEach((item, index) => {
      compareShapes(file, label, item, enShape.items[index], `${path}[${index}]`);
    });
    return;
  }

  if (zhShape?.type === "object") {
    const zhKeys = Object.keys(zhShape.keys).sort();
    const enKeys = Object.keys(enShape.keys).sort();
    if (zhKeys.join("\n") !== enKeys.join("\n")) {
      issues.push(`${file}:${label}${path}: zh/en object keys mismatch`);
      return;
    }

    for (const key of zhKeys) {
      compareShapes(file, label, zhShape.keys[key], enShape.keys[key], `${path}.${key}`);
    }
  }
}

function shapeType(shape) {
  return typeof shape === "object" ? shape.type : shape;
}

function unwrap(value, open, close) {
  const start = value.indexOf(open);
  const end = value.lastIndexOf(close);
  return start === -1 || end === -1 || end <= start ? "" : value.slice(start + 1, end);
}

function splitTopLevel(value, delimiter) {
  const parts = [];
  let start = 0;
  let depth = 0;

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (char === "{" || char === "[") depth += 1;
    if (char === "}" || char === "]") depth -= 1;
    if (char === delimiter && depth === 0) {
      const part = value.slice(start, index).trim();
      if (part) parts.push(part);
      start = index + 1;
    }
  }

  const tail = value.slice(start).trim();
  if (tail) parts.push(tail);
  return parts;
}

function findTopLevelSeparator(value, separator) {
  let depth = 0;

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (char === "{" || char === "[") depth += 1;
    if (char === "}" || char === "]") depth -= 1;
    if (char === separator && depth === 0) return index;
  }

  return -1;
}
