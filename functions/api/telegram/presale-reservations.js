import { getSalesKvBinding, getSalesRecord, getSalesStorageStatus, putSalesRecord, recordSalesEvent } from "../../_shared/sales-storage.js";
import { readTelegramMiniAppInitData, verifyTelegramMiniAppInitData, verifyTelegramWebhookSecret } from "../../_shared/telegram-security.js";

const RESERVATION_OPEN_AT = "2026-05-05T09:00:00.000Z";
const RESERVATION_REWARD_72H = "72";
const LOTTERY_POOL_72H = "10000000";
const RATE_LIMIT_TTL_SECONDS = 60;

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
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, maxLength) : undefined;
}

function cleanWallet(value) {
  const wallet = cleanString(value, 96);
  if (!wallet) return undefined;
  if (!/^[A-Za-z0-9_\-:]{24,96}$/.test(wallet)) return undefined;
  return wallet;
}

function cleanDesiredAllocation(value) {
  const raw = typeof value === "number" ? String(value) : cleanString(value, 32);
  if (!raw) return undefined;
  const normalized = raw.replace(/,/g, "");
  if (!/^\d+(?:\.\d{1,4})?$/.test(normalized)) return undefined;
  if (Number(normalized) <= 0) return undefined;
  return normalized;
}

function cleanTelegramUser(value) {
  if (!value || typeof value !== "object" || Array.isArray(value) || !value.id) return undefined;
  return {
    id: String(value.id),
    username: cleanString(value.username, 64),
    first_name: cleanString(value.first_name, 64),
    last_name: cleanString(value.last_name, 64),
    language_code: cleanString(value.language_code, 16),
    is_premium: value.is_premium === true,
  };
}

async function authenticate(request, env, payload) {
  const initData = readTelegramMiniAppInitData(request);
  if (initData) {
    const auth = await verifyTelegramMiniAppInitData(initData, env);
    if (auth.ok) {
      return {
        ok: true,
        actorType: "telegram_init_data",
        authDate: auth.authDate,
        startParam: auth.startParam,
        user: cleanTelegramUser(auth.user),
      };
    }
    return { ok: false, error: auth.error };
  }

  if (verifyTelegramWebhookSecret(request, env)) {
    const user = cleanTelegramUser(payload?.telegramUser);
    if (!user) return { ok: false, error: "telegram_user_required_for_secret_auth" };
    return { ok: true, actorType: "telegram_secret", user };
  }

  return { ok: false, error: "telegram_init_data_or_secret_required" };
}

async function hitRateLimit(env, telegramUserId) {
  const kv = getSalesKvBinding(env);
  if (!kv) return { ok: false, error: "sales_storage_unavailable" };

  const key = `reservation:rate:${telegramUserId}`;
  const existing = await kv.get(key);
  if (existing) {
    return { ok: false, error: "rate_limited" };
  }

  await kv.put(key, "1", { expirationTtl: RATE_LIMIT_TTL_SECONDS });
  return { ok: true };
}

function publicReservation(record) {
  if (!record) return undefined;
  return {
    id: record.id,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    status: record.status,
    telegramUserId: record.telegramUserId,
    username: record.username,
    walletAddress: record.walletAddress,
    desiredAllocation72H: record.desiredAllocation72H,
    referral: record.referral,
    source: record.source,
    lotteryEligible: record.lotteryEligible,
    reservationReward72H: record.reservationReward72H,
    lotteryPool72H: record.lotteryPool72H,
    saleOpensAt: record.saleOpensAt,
  };
}

export async function onRequestGet({ request, env }) {
  const auth = await authenticate(request, env, undefined);
  if (!auth.ok) return json({ ok: false, error: auth.error }, 401);

  const key = `reservation:user:${auth.user.id}`;
  const read = await getSalesRecord(env, key);
  if (!read.ok) return json({ ok: false, error: read.error, storage: getSalesStorageStatus(env) }, 503);

  return json({
    ok: true,
    storage: getSalesStorageStatus(env),
    reservation: publicReservation(read.record),
    saleOpensAt: RESERVATION_OPEN_AT,
    lotteryPool72H: LOTTERY_POOL_72H,
    reservationReward72H: RESERVATION_REWARD_72H,
  });
}

export async function onRequestPost({ request, env }) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  const auth = await authenticate(request, env, payload);
  if (!auth.ok) return json({ ok: false, error: auth.error }, 401);

  const desiredAllocation72H = cleanDesiredAllocation(payload?.desiredAllocation72H ?? payload?.desiredAllocation);
  if (!desiredAllocation72H) {
    return json({ ok: false, error: "desired_allocation_required" }, 400);
  }

  const storage = getSalesStorageStatus(env);
  const key = `reservation:user:${auth.user.id}`;
  const existing = await getSalesRecord(env, key);
  if (!existing.ok) return json({ ok: false, error: existing.error, storage }, 503);
  if (existing.record) {
    return json({
      ok: true,
      duplicate: true,
      storage,
      reservation: publicReservation(existing.record),
      message: "reservation_already_exists",
    });
  }

  const rate = await hitRateLimit(env, auth.user.id);
  if (!rate.ok) {
    return json({ ok: false, error: rate.error, storage }, rate.error === "rate_limited" ? 429 : 503);
  }

  const now = new Date().toISOString();
  const id = `rsv_${crypto.randomUUID()}`;
  const record = {
    id,
    version: 1,
    createdAt: now,
    updatedAt: now,
    status: "reserved",
    saleOpensAt: RESERVATION_OPEN_AT,
    telegramUserId: auth.user.id,
    username: auth.user.username,
    telegramUser: auth.user,
    walletAddress: cleanWallet(payload?.walletAddress),
    desiredAllocation72H,
    referral: cleanString(payload?.referral, 120),
    source: cleanString(payload?.source, 80) || auth.startParam || "miniapp",
    lotteryEligible: true,
    reservationReward72H: RESERVATION_REWARD_72H,
    lotteryPool72H: LOTTERY_POOL_72H,
    actorType: auth.actorType,
    authDate: auth.authDate,
  };

  const write = await putSalesRecord(env, key, record, {
    type: "reservation",
    telegramUserId: record.telegramUserId,
    username: record.username,
    status: record.status,
    createdAt: record.createdAt,
  });
  if (!write.ok) return json({ ok: false, error: write.error, storage }, 503);

  await putSalesRecord(env, `reservation:${now}:${id}`, record, {
    type: "reservation_index",
    telegramUserId: record.telegramUserId,
    status: record.status,
    createdAt: record.createdAt,
  });

  await recordSalesEvent(env, {
    signalType: "reservation_created",
    telegramUserId: record.telegramUserId,
    username: record.username,
    walletAddress: record.walletAddress,
    desiredAllocation72H: record.desiredAllocation72H,
    source: record.source,
    referral: record.referral,
    presaleEnabled: false,
  });

  return json({
    ok: true,
    duplicate: false,
    storage,
    reservation: publicReservation(record),
  }, 201);
}
