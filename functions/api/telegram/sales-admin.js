import { getPresaleMode } from "../../_shared/presale-mode.js";
import { getSalesStorageStatus, listSalesRecords } from "../../_shared/sales-storage.js";
import { verifyTelegramWebhookSecret } from "../../_shared/telegram-security.js";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "cache-control": "no-store",
      "content-type": "application/json; charset=utf-8",
    },
  });
}

function publicAdminReservation(record) {
  return {
    id: record.id,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    status: record.status,
    presaleMode: record.presaleMode,
    telegramUserId: record.telegramUserId,
    username: record.username,
    walletAddress: record.walletAddress,
    walletDedupeStatus: record.walletDedupeStatus,
    desiredAllocation72H: record.desiredAllocation72H,
    source: record.source,
    channelSource: record.channelSource,
    referral: record.referral,
    whitelistStatus: record.whitelistStatus,
    lotteryEligible: record.lotteryEligible,
    lotteryStatus: record.lotteryStatus,
    rewardStatus: record.rewardStatus,
    rewardTxHash: record.rewardTxHash,
    rewardAwardedAt: record.rewardAwardedAt,
    saleReminderOptIn: record.saleReminderOptIn,
    userSegment: record.userSegment,
    communityTasks: record.communityTasks,
  };
}

export async function onRequestGet({ request, env }) {
  if (!verifyTelegramWebhookSecret(request, env)) {
    return json({ ok: false, error: "admin_secret_required" }, 401);
  }

  const url = new URL(request.url);
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit") || 100), 1), 500);
  const listed = await listSalesRecords(env, { prefix: "reservation:", limit });
  if (!listed.ok) {
    return json({ ok: false, error: listed.error, storage: getSalesStorageStatus(env) }, 503);
  }

  const uniqueReservations = new Map();
  for (const { record } of listed.records) {
    if (record?.id && record?.telegramUserId && record?.version && !uniqueReservations.has(record.id)) {
      uniqueReservations.set(record.id, record);
    }
  }
  const reservations = [...uniqueReservations.values()]
    .sort((left, right) => String(right.createdAt || "").localeCompare(String(left.createdAt || "")))
    .map(publicAdminReservation);

  return json({
    ok: true,
    storage: getSalesStorageStatus(env),
    presaleMode: getPresaleMode(env),
    reservations,
    count: reservations.length,
  });
}

export async function onRequestPost() {
  return json({
    ok: false,
    error: "presale_admin_writes_disabled",
  }, 503);
}

export async function onRequest(context) {
  if (context.request.method === "GET") return onRequestGet(context);
  if (context.request.method === "POST") return onRequestPost(context);
  return json({ ok: false, error: "method_not_allowed" }, 405);
}
