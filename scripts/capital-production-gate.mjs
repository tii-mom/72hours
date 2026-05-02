#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";

// Current official 72H V2 Jetton master. Legacy pre-V2 EQDvE0... is historical/void for active production gates.
const approvedJettonMaster = "EQBGIzEDvvKObStrcVb6i5Z1-8uYZYtUrYzF2rFZU7xUAXVg";
const appKeys = ["72HOURS", "WAN", "MULTI_MILLIONAIRE"];
const urlFields = [
  "CAPITAL_PRODUCTION_API_BASE_URL",
  "CAPITAL_PRODUCTION_INDEXER_BASE_URL",
  "CAPITAL_TONCONNECT_MANIFEST_URL",
  "CAPITAL_MAINNET_RPC_URL",
];
const artifactFields = [
  "CAPITAL_AUDIT_REPORT_PATH",
  "CAPITAL_LEGAL_APPROVAL_PATH",
  "CAPITAL_TESTNET_REHEARSAL_ARTIFACT_PATH",
  "CAPITAL_RESERVE_VAULT_REDEMPTION_VERIFICATION_PATH",
  "CAPITAL_APP_REWARD_POOL_POLICY_PATH",
];
const frontendRequiredEnv = [
  ...urlFields,
  "CAPITAL_MAINNET_EXPLORER_TX_URL_PATTERN",
  "TON_MAINNET_72H_JETTON_MASTER_ADDRESS",
  "H72H_TELEGRAM_BOT_TOKEN",
  "H72H_TELEGRAM_ALERT_CHAT_ID",
  "CAPITAL_MONITORING_OWNER",
  "CAPITAL_ROLLBACK_APPROVAL_OWNER",
  "CAPITAL_TONCONNECT_BRIDGE_ORIGINS",
  "CAPITAL_CSP_CONNECT_SRC",
  "CAPITAL_CSP_FRAME_SRC",
  "CAPITAL_CSP_IMG_SRC",
  "CAPITAL_CSP_MANIFEST_SRC",
];
const signingRequiredEnv = [
  "TON_MAINNET_ADMIN_ADDRESS",
  "H72H_CAPITAL_DB_MODE",
  "DATABASE_URL",
  ...artifactFields,
  ...appKeys.flatMap((app) => [
    `TON_MAINNET_RESERVE_VAULT_ADDRESS_${app}`,
    `TON_MAINNET_RESERVE_VAULT_JETTON_WALLET_ADDRESS_${app}`,
    `TON_MAINNET_APP_REWARD_POOL_ADDRESS_${app}`,
    `TON_MAINNET_APP_REWARD_POOL_JETTON_WALLET_ADDRESS_${app}`,
    `TON_MAINNET_ALPHA_VAULT_ADDRESS_${app}`,
  ]),
];

function value(name) {
  return process.env[name]?.trim();
}

function boolValue(name, fallback = false) {
  const raw = value(name)?.toLowerCase();
  if (raw === "true" || raw === "1" || raw === "yes") return true;
  if (raw === "false" || raw === "0" || raw === "no") return false;
  return fallback;
}

function parseEnvLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
    return undefined;
  }

  const separatorIndex = trimmed.indexOf("=");
  const key = trimmed.slice(0, separatorIndex).trim();
  let rawValue = trimmed.slice(separatorIndex + 1).trim();

  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
    return undefined;
  }

  if (
    (rawValue.startsWith('"') && rawValue.endsWith('"')) ||
    (rawValue.startsWith("'") && rawValue.endsWith("'"))
  ) {
    rawValue = rawValue.slice(1, -1);
  } else {
    rawValue = rawValue.replace(/\s+#.*$/, "").trim();
  }

  if (!rawValue) {
    return undefined;
  }

  return [key, rawValue];
}

function loadEnvFile(path) {
  if (!existsSync(path)) {
    return false;
  }

  const contents = readFileSync(path, "utf8");
  for (const line of contents.split(/\r?\n/)) {
    const entry = parseEnvLine(line);
    if (!entry) continue;
    const [key, rawValue] = entry;
    if (process.env[key] === undefined) {
      process.env[key] = rawValue;
    }
  }

  return true;
}

function loadProductionGateEnv() {
  const envFiles = process.argv
    .filter((arg) => arg.startsWith("--env-file="))
    .map((arg) => arg.slice("--env-file=".length));

  for (const path of [".env.production.example", ".env.production.local", ".env.local", ...envFiles]) {
    loadEnvFile(path);
  }
}

function addError(errors, code, field, message) {
  errors.push({ code, field, message });
}

function parseUrl(raw) {
  try {
    return new URL(raw);
  } catch {
    return undefined;
  }
}

function isTonAddress(raw) {
  return /^(?:-1:|0:)[0-9a-fA-F]{64}$/.test(raw) || /^[UEk][Qf][A-Za-z0-9_-]{46}$/.test(raw);
}

function parseOriginList(raw) {
  return raw
    .split(/[,\s]+/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function originMatches(originOrSource, url) {
  if (originOrSource === "https:" && url.protocol === "https:") return true;
  if (originOrSource === url.origin) return true;
  if (originOrSource === url.hostname) return true;
  if (originOrSource.startsWith("*.")) return url.hostname.endsWith(originOrSource.slice(1));
  return false;
}

function requireUrl(errors, field) {
  const raw = value(field);
  if (!raw) return undefined;

  const url = parseUrl(raw);
  if (!url || !["https:", "http:"].includes(url.protocol)) {
    addError(errors, "invalid-url", field, `${field} must be an absolute http(s) URL.`);
    return undefined;
  }

  if (url.protocol !== "https:" && !["localhost", "127.0.0.1", "::1"].includes(url.hostname)) {
    addError(errors, "insecure-url", field, `${field} must use https for production.`);
  }

  if (/staging|testnet|localhost|127\.0\.0\.1/i.test(raw)) {
    addError(errors, "non-production-url", field, `${field} must not point at staging, testnet, or localhost.`);
  }

  return url;
}

function requireArtifact(errors, field) {
  const path = value(field);
  if (!path) return;
  if (!existsSync(path)) {
    addError(errors, "missing-artifact", field, `${field} does not exist: ${path}`);
  }
}

function requireCspAllows(errors, field, url, label) {
  const raw = value(field);
  if (!raw || !url) return;
  const allowed = parseOriginList(raw);
  if (!allowed.some((origin) => originMatches(origin, url))) {
    addError(errors, "csp-missing-origin", field, `${field} must include ${label} origin ${url.origin}.`);
  }
}

async function checkJsonEndpoint(label, url, expectedEnvironment) {
  const response = await fetch(url);
  const body = await response.json().catch(() => undefined);
  if (!response.ok) {
    return `${label} returned HTTP ${response.status}.`;
  }
  const environment =
    body?.environment ??
    (body?.settings?.network === "mainnet" && body?.settings?.postgresConfigured === true
      ? "production"
      : undefined);
  if (environment !== expectedEnvironment) {
    return `${label} is not reporting environment=${expectedEnvironment}.`;
  }
  return undefined;
}

async function main() {
  loadProductionGateEnv();
  const skipNetwork = process.argv.includes("--skip-network");
  const signingInputsRequired = boolValue("CAPITAL_MAINNET_SIGNING_ENABLED", false);
  const requiredEnv = signingInputsRequired
    ? [...frontendRequiredEnv, ...signingRequiredEnv]
    : frontendRequiredEnv;
  const errors = [];
  for (const name of requiredEnv) {
    if (!value(name)) addError(errors, "missing-env", name, `${name} is required.`);
  }

  const apiUrl = requireUrl(errors, "CAPITAL_PRODUCTION_API_BASE_URL");
  const indexerUrl = requireUrl(errors, "CAPITAL_PRODUCTION_INDEXER_BASE_URL");
  const manifestUrl = requireUrl(errors, "CAPITAL_TONCONNECT_MANIFEST_URL");
  const rpcUrl = requireUrl(errors, "CAPITAL_MAINNET_RPC_URL");

  if (signingInputsRequired) {
    for (const field of artifactFields) {
      requireArtifact(errors, field);
    }
  }

  if (signingInputsRequired && /capital-audit-report-2026-04-25\.md$/.test(value("CAPITAL_AUDIT_REPORT_PATH") ?? "")) {
    addError(
      errors,
      "no-go-audit-report",
      "CAPITAL_AUDIT_REPORT_PATH",
      "CAPITAL_AUDIT_REPORT_PATH must point to a remediated re-audit report, not the 2026-04-25 No-Go report.",
    );
  }

  const explorerPattern = value("CAPITAL_MAINNET_EXPLORER_TX_URL_PATTERN");
  if (explorerPattern) {
    const explorerUrl = parseUrl(explorerPattern.replace("{tx}", "sample"));
    if (!explorerUrl) {
      addError(
        errors,
        "invalid-url-pattern",
        "CAPITAL_MAINNET_EXPLORER_TX_URL_PATTERN",
        "CAPITAL_MAINNET_EXPLORER_TX_URL_PATTERN must become a valid URL after replacing {tx}.",
      );
    } else if (!explorerPattern.includes("{tx}")) {
      addError(
        errors,
        "missing-placeholder",
        "CAPITAL_MAINNET_EXPLORER_TX_URL_PATTERN",
        "CAPITAL_MAINNET_EXPLORER_TX_URL_PATTERN must include the {tx} placeholder.",
      );
    } else {
      requireCspAllows(errors, "CAPITAL_CSP_CONNECT_SRC", explorerUrl, "explorer");
      requireCspAllows(errors, "CAPITAL_CSP_IMG_SRC", explorerUrl, "explorer");
    }
  }

  requireCspAllows(errors, "CAPITAL_CSP_CONNECT_SRC", apiUrl, "API");
  requireCspAllows(errors, "CAPITAL_CSP_CONNECT_SRC", indexerUrl, "Indexer");
  requireCspAllows(errors, "CAPITAL_CSP_CONNECT_SRC", rpcUrl, "RPC");
  requireCspAllows(errors, "CAPITAL_CSP_MANIFEST_SRC", manifestUrl, "TonConnect manifest");

  const bridgeOrigins = value("CAPITAL_TONCONNECT_BRIDGE_ORIGINS");
  if (bridgeOrigins) {
    for (const origin of parseOriginList(bridgeOrigins)) {
      const bridgeUrl = parseUrl(origin);
      if (!bridgeUrl) {
        addError(errors, "invalid-origin", "CAPITAL_TONCONNECT_BRIDGE_ORIGINS", `Invalid TonConnect bridge/frame origin: ${origin}`);
      } else {
        requireCspAllows(errors, "CAPITAL_CSP_CONNECT_SRC", bridgeUrl, "TonConnect bridge/frame");
        requireCspAllows(errors, "CAPITAL_CSP_FRAME_SRC", bridgeUrl, "TonConnect bridge/frame");
      }
    }
  }

  if (
    value("TON_MAINNET_72H_JETTON_MASTER_ADDRESS") &&
    value("TON_MAINNET_72H_JETTON_MASTER_ADDRESS") !== approvedJettonMaster
  ) {
    addError(
      errors,
      "wrong-jetton-master",
      "TON_MAINNET_72H_JETTON_MASTER_ADDRESS",
      `TON_MAINNET_72H_JETTON_MASTER_ADDRESS must equal the approved 72H Jetton master: ${approvedJettonMaster}.`,
    );
  }

  if (
    value("TON_MAINNET_72H_JETTON_MASTER_ADDRESS") &&
    value("TON_MAINNET_ADMIN_ADDRESS") &&
    value("TON_MAINNET_72H_JETTON_MASTER_ADDRESS") === value("TON_MAINNET_ADMIN_ADDRESS")
  ) {
    addError(
      errors,
      "address-role-conflict",
      "TON_MAINNET_72H_JETTON_MASTER_ADDRESS",
      "TON_MAINNET_72H_JETTON_MASTER_ADDRESS must be the Jetton master contract, not the admin wallet address.",
    );
  }

  for (const field of requiredEnv.filter((name) => name.startsWith("TON_MAINNET_"))) {
    const address = value(field);
    if (address && !isTonAddress(address)) {
      addError(errors, "invalid-ton-address", field, `${field} must look like a TON user-friendly or raw address.`);
    }
  }

  for (const app of appKeys) {
    const reserveVault = value(`TON_MAINNET_RESERVE_VAULT_ADDRESS_${app}`);
    const reserveWallet = value(`TON_MAINNET_RESERVE_VAULT_JETTON_WALLET_ADDRESS_${app}`);
    const rewardPool = value(`TON_MAINNET_APP_REWARD_POOL_ADDRESS_${app}`);
    const rewardWallet = value(`TON_MAINNET_APP_REWARD_POOL_JETTON_WALLET_ADDRESS_${app}`);
    const alphaVault = value(`TON_MAINNET_ALPHA_VAULT_ADDRESS_${app}`);
    const addressEntries = [
      [`TON_MAINNET_RESERVE_VAULT_ADDRESS_${app}`, reserveVault],
      [`TON_MAINNET_RESERVE_VAULT_JETTON_WALLET_ADDRESS_${app}`, reserveWallet],
      [`TON_MAINNET_APP_REWARD_POOL_ADDRESS_${app}`, rewardPool],
      [`TON_MAINNET_APP_REWARD_POOL_JETTON_WALLET_ADDRESS_${app}`, rewardWallet],
      [`TON_MAINNET_ALPHA_VAULT_ADDRESS_${app}`, alphaVault],
    ].filter(([, address]) => address);

    for (let i = 0; i < addressEntries.length; i += 1) {
      for (let j = i + 1; j < addressEntries.length; j += 1) {
        if (addressEntries[i][1] === addressEntries[j][1]) {
          addError(errors, "address-role-conflict", addressEntries[j][0], `${addressEntries[j][0]} must not equal ${addressEntries[i][0]}.`);
        }
      }
    }
  }

  if (value("H72H_CAPITAL_DB_MODE") && value("H72H_CAPITAL_DB_MODE") !== "postgres") {
    addError(errors, "wrong-db-mode", "H72H_CAPITAL_DB_MODE", "H72H_CAPITAL_DB_MODE must be postgres for production.");
  }

  if (value("DATABASE_URL") && !/^postgres(?:ql)?:\/\//.test(value("DATABASE_URL"))) {
    addError(errors, "invalid-database-url", "DATABASE_URL", "DATABASE_URL must be a Postgres connection string.");
  }

  if (value("H72H_TELEGRAM_BOT_TOKEN") && !/^\d+:[A-Za-z0-9_-]{20,}$/.test(value("H72H_TELEGRAM_BOT_TOKEN"))) {
    addError(errors, "invalid-telegram-token", "H72H_TELEGRAM_BOT_TOKEN", "H72H_TELEGRAM_BOT_TOKEN must look like a Telegram bot token.");
  }

  if (value("H72H_TELEGRAM_ALERT_CHAT_ID") && !/^-?\d+$/.test(value("H72H_TELEGRAM_ALERT_CHAT_ID"))) {
    addError(errors, "invalid-telegram-chat", "H72H_TELEGRAM_ALERT_CHAT_ID", "H72H_TELEGRAM_ALERT_CHAT_ID must be the numeric Telegram chat id.");
  }

  if (value("CAPITAL_MONITORING_OWNER") && value("CAPITAL_MONITORING_OWNER").length < 3) {
    addError(errors, "invalid-owner", "CAPITAL_MONITORING_OWNER", "CAPITAL_MONITORING_OWNER must identify the person or team owning production monitoring.");
  }

  if (value("CAPITAL_ROLLBACK_APPROVAL_OWNER") && value("CAPITAL_ROLLBACK_APPROVAL_OWNER").length < 3) {
    addError(
      errors,
      "invalid-owner",
      "CAPITAL_ROLLBACK_APPROVAL_OWNER",
      "CAPITAL_ROLLBACK_APPROVAL_OWNER must identify the person or team authorized to approve rollback.",
    );
  }

  if (!skipNetwork && apiUrl) {
    const error = await checkJsonEndpoint("Production API health", `${apiUrl.href.replace(/\/+$/, "")}/health`, "production").catch((caught) =>
      caught instanceof Error ? caught.message : String(caught),
    );
    if (error) addError(errors, "health-check-failed", "CAPITAL_PRODUCTION_API_BASE_URL", error);
  }

  if (!skipNetwork && indexerUrl) {
    const error = await checkJsonEndpoint("Production Indexer health", `${indexerUrl.href.replace(/\/+$/, "")}/health`, "production").catch((caught) =>
      caught instanceof Error ? caught.message : String(caught),
    );
    if (error) addError(errors, "health-check-failed", "CAPITAL_PRODUCTION_INDEXER_BASE_URL", error);
  }

  if (errors.length > 0) {
    console.error(
      JSON.stringify(
        {
          ok: false,
          message: "Capital production gate failed. Fix every listed field before enabling mainnet signing.",
          networkChecksSkipped: skipNetwork,
          errors,
        },
        null,
        2,
      ),
    );
    process.exit(1);
  }

  console.log(JSON.stringify({
    ok: true,
    networkChecksSkipped: skipNetwork,
    mainnetSigningInputsRequired: signingInputsRequired,
    message: signingInputsRequired
      ? "Capital production gate passed."
      : "Capital production frontend gate passed with mainnet signing inputs disabled.",
  }, null, 2));
}

main();
