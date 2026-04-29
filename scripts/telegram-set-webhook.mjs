#!/usr/bin/env node

function env(name) {
  const value = process.env[name]?.trim();
  return value || undefined;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function assertHttpsUrl(raw, field) {
  let url;
  try {
    url = new URL(raw);
  } catch {
    fail(`${field} must be a valid absolute URL.`);
  }

  if (url.protocol !== "https:") {
    fail(`${field} must use https for Telegram webhooks.`);
  }

  return url;
}

function parseArgs(argv) {
  return {
    dropPendingUpdates: argv.includes("--drop-pending-updates"),
    webhookPath: argv.includes("--webhook-path")
      ? argv[argv.indexOf("--webhook-path") + 1]
      : "/api/telegram/webhook",
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const token = env("H72H_TELEGRAM_BOT_TOKEN");
  const publicBaseUrl = env("H72H_BOT_PUBLIC_BASE_URL");
  const webhookSecret = env("H72H_TELEGRAM_WEBHOOK_SECRET");

  if (!token) fail("H72H_TELEGRAM_BOT_TOKEN is required.");
  if (!publicBaseUrl) fail("H72H_BOT_PUBLIC_BASE_URL is required.");
  if (!webhookSecret) fail("H72H_TELEGRAM_WEBHOOK_SECRET is required.");
  if (!/^[A-Za-z0-9_-]{16,256}$/.test(webhookSecret)) {
    fail("H72H_TELEGRAM_WEBHOOK_SECRET must be 16-256 characters using A-Z, a-z, 0-9, _ or -.");
  }

  const webhookUrl = new URL(args.webhookPath, assertHttpsUrl(publicBaseUrl, "H72H_BOT_PUBLIC_BASE_URL")).toString();
  const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: "POST",
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      url: webhookUrl,
      secret_token: webhookSecret,
      allowed_updates: ["message", "callback_query"],
      drop_pending_updates: args.dropPendingUpdates,
    }),
  });

  const body = await response.json().catch(() => undefined);
  if (!response.ok || body?.ok === false) {
    fail(body?.description || `Telegram setWebhook failed with HTTP ${response.status}.`);
  }

  console.log("Telegram webhook configured.");
  console.log(`Webhook URL: ${webhookUrl}`);
  console.log(`Drop pending updates: ${args.dropPendingUpdates ? "yes" : "no"}`);
}

await main();
