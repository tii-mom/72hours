import { recordSalesEvent, getSalesStorageStatus } from "../../_shared/sales-storage.js";
import {
  analyzeSalesSignal,
  formatOperatorAlertLines,
  salesSignalRecordFields,
} from "../../_shared/sales-signals.js";
import { sendTelegramAlert } from "../../_shared/telegram-alerts.js";
import { requireTelegramMiniAppUser } from "../../_shared/telegram-security.js";

const ALLOWED_EVENT_TYPES = new Set([
  "miniapp_open",
  "buy_interest",
  "buy_form_view",
  "buy_form_exit",
  "wallet_help",
  "wallet_connected",
  "wallet_disconnected",
  "contract_check",
  "wallet_transaction_submitted",
  "risk_question",
  "price_question",
  "purchase_failure",
  "human_followup",
  "human_followup_needed",
]);

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "cache-control": "no-store",
      "content-type": "application/json; charset=utf-8",
    },
  });
}

function cleanString(value, maxLength = 160) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : undefined;
}

function userLabel(user) {
  if (user?.username) return `@${user.username}`;
  const name = [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim();
  return name || String(user?.id || "unknown");
}

function primaryIntentForEvent(eventType) {
  const mapping = {
    buy_interest: "buy_intent",
    wallet_help: "wallet_help",
    contract_check: "risk_question",
    human_followup: "human_support",
    human_followup_needed: "human_support",
    risk_question: "risk_question",
    price_question: "price_question",
    purchase_failure: "wallet_help",
  };
  return mapping[eventType] || eventType;
}

async function maybeAlertOperator(env, auth, eventType, event, signal) {
  const alertTypes = new Set(["buy_interest", "human_followup", "human_followup_needed"]);
  if (!alertTypes.has(eventType)) return;

  const record = event.record || {};
  await sendTelegramAlert(env, formatOperatorAlertLines({
    title: eventType === "buy_interest" ? "72H Mini App 开售提醒/预约意向" : "72H Mini App 人工跟进",
    userLabel: userLabel(auth.user),
    userId: auth.user.id,
    signal,
    text: record.reason || eventType,
  }).concat([
    record.walletAddress ? `Wallet: ${record.walletAddress}` : undefined,
    `Event ID: ${event.id || "unavailable"}`,
  ]));
}

export async function onRequestPost({ request, env }) {
  const auth = await requireTelegramMiniAppUser(request, env);
  if (!auth.ok) {
    return json({ ok: false, error: auth.error }, 401);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  const eventType = cleanString(payload?.type, 64);
  if (!ALLOWED_EVENT_TYPES.has(eventType)) {
    return json({ ok: false, error: "invalid_event_type" }, 400);
  }

  const storage = getSalesStorageStatus(env);
  const signal = analyzeSalesSignal(cleanString(payload?.reason, 240) || eventType, {
    primaryIntent: primaryIntentForEvent(eventType),
  });
  const event = await recordSalesEvent(env, {
    signalType: eventType,
    telegramUserId: String(auth.user.id),
    username: auth.user.username,
    walletAddress: cleanString(payload?.walletAddress, 96),
    intentId: cleanString(payload?.intentId, 96),
    reason: cleanString(payload?.reason, 240),
    presaleEnabled: Boolean(payload?.presaleEnabled),
    source: "miniapp",
    ...salesSignalRecordFields(signal),
  });

  if (event.ok) {
    await maybeAlertOperator(env, auth, eventType, event, signal);
  }

  return json({
    ok: event.ok,
    eventId: event.id,
    storage,
    error: event.ok ? undefined : event.error,
  }, event.ok ? 200 : 503);
}
