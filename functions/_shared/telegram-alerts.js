import { createTelegramApi } from "./telegram-api.js";

function readString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function safeText(value, maxLength = 500) {
  if (typeof value !== "string") return undefined;
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength) || undefined;
}

function userLabel(user) {
  const username = safeText(user?.username, 80);
  if (username) return `@${username}`;
  return safeText([user?.first_name, user?.last_name].filter(Boolean).join(" "), 120) || String(user?.id || "unknown");
}

export async function sendTelegramAlert(env, lines) {
  const alertChatId = readString(env.H72H_TELEGRAM_ALERT_CHAT_ID);
  if (!alertChatId) {
    return { ok: false, skipped: true, reason: "alert_chat_not_configured" };
  }

  try {
    const api = createTelegramApi(env);
    await api.sendMessage({
      chatId: alertChatId,
      text: lines.filter(Boolean).join("\n"),
    });
    return { ok: true };
  } catch (error) {
    console.error("telegram_alert_failed", error instanceof Error ? error.message : String(error));
    return { ok: false, error: "telegram_alert_failed" };
  }
}

export async function alertPurchaseIntentCreated(env, { user, intent }) {
  return sendTelegramAlert(env, [
    "72H presale intent created",
    "",
    `User: ${userLabel(user)}`,
    `Telegram ID: ${user?.id || intent.telegramUserId || "unknown"}`,
    `Wallet: ${intent.walletAddress}`,
    `Amount: ${intent.amountTon} TON`,
    `Expected: ${intent.expectedTokens72H} 72H`,
    `Stage: ${intent.publicStage} / contract ${intent.contractStage}`,
    `Intent: ${intent.intentId}`,
    intent.source ? `Source: ${safeText(intent.source, 120)}` : undefined,
    intent.referral ? `Referral: ${safeText(intent.referral, 120)}` : undefined,
    intent.transactionRequest?.available ? "Wallet payload: available" : `Wallet payload: ${intent.transactionRequest?.reason || "unavailable"}`,
  ]);
}

export async function alertReceiptSubmitted(env, { user, intent, receipt }) {
  return sendTelegramAlert(env, [
    "72H presale receipt submitted",
    "",
    `User: ${userLabel(user)}`,
    `Telegram ID: ${user?.id || receipt.telegramUserId || "unknown"}`,
    `Wallet: ${intent.walletAddress}`,
    `Intent: ${receipt.intentId}`,
    `Receipt: ${receipt.receiptId}`,
    `Status: ${receipt.status}`,
    receipt.reason ? `Reason: ${receipt.reason}` : undefined,
    receipt.txHash ? `Tx: ${receipt.txHash}` : undefined,
  ]);
}
