import { assertBotOnlyReservationMode } from "../../_shared/presale-mode.js";
import { DEFAULT_72H_JETTON_MASTER, DEFAULT_PRESALE_VAULT_ADDRESS } from "../../_shared/presale-runtime.js";
import { getSalesKvBinding, getSalesRecord, getSalesStorageStatus, putSalesRecord, recordSalesEvent } from "../../_shared/sales-storage.js";
import { readTelegramMiniAppInitData, verifyTelegramMiniAppInitData, verifyTelegramWebhookSecret } from "../../_shared/telegram-security.js";

const RESERVATION_OPEN_AT = "2026-05-05T09:00:00.000Z";
const RESERVATION_REWARD_72H = "72";
const LOTTERY_POOL_72H = "10000000";
const CONTRACT_EVIDENCE_STATUS = "deployed_inactive_not_purchase";
const LOTTERY_PAYOUT_MODE = "official_wallet_transfer_no_new_contract";
const LOTTERY_FUNDING_STATUS = "awaiting_private_wallet_funding_tx";
const WAITLIST_MODE = "warmup_waitlist_only";
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

function walletDedupeKey(walletAddress) {
  return walletAddress ? walletAddress.toLowerCase() : undefined;
}

function cleanDesiredAllocation(value) {
  const raw = typeof value === "number" ? String(value) : cleanString(value, 32);
  if (!raw) return undefined;
  const normalized = raw.replace(/,/g, "");
  if (!/^\d+(?:\.\d{1,4})?$/.test(normalized)) return undefined;
  if (Number(normalized) <= 0) return undefined;
  return normalized;
}

function classifyUserSegment(desiredAllocation72H, user) {
  const amount = Number(desiredAllocation72H);
  if (Number.isFinite(amount) && amount >= 7200000) return "priority_whale";
  if (Number.isFinite(amount) && amount >= 720000) return "priority_core";
  if (user?.is_premium) return "telegram_premium";
  return "warmup_waitlist";
}

function cleanCommunityTasks(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {
      joinedTelegram: false,
      followedX: false,
      sharedInvite: false,
      status: "not_started",
    };
  }
  const tasks = {
    joinedTelegram: value.joinedTelegram === true,
    followedX: value.followedX === true,
    sharedInvite: value.sharedInvite === true,
  };
  const completedCount = Object.values(tasks).filter(Boolean).length;
  return {
    ...tasks,
    status: completedCount === 0 ? "not_started" : completedCount === 3 ? "completed" : "in_progress",
  };
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
    channelSource: record.channelSource,
    waitlistMode: record.waitlistMode,
    presaleMode: record.presaleMode,
    requestedPresaleMode: record.requestedPresaleMode,
    botOnly: record.botOnly,
    purchaseEnabled: record.purchaseEnabled,
    whitelistStatus: record.whitelistStatus,
    saleReminderOptIn: record.saleReminderOptIn,
    userSegment: record.userSegment,
    communityTasks: record.communityTasks,
    lotteryEligible: record.lotteryEligible,
    lotteryStatus: record.lotteryStatus,
    walletDedupeStatus: record.walletDedupeStatus,
    rewardStatus: record.rewardStatus,
    rewardTxHash: record.rewardTxHash,
    rewardAwardedAt: record.rewardAwardedAt,
    reservationReward72H: record.reservationReward72H,
    lotteryPool72H: record.lotteryPool72H,
    saleOpensAt: record.saleOpensAt,
    contractEvidence: record.contractEvidence,
    lotteryEvidence: record.lotteryEvidence,
  };
}

export async function onRequestGet({ request, env }) {
  const auth = await authenticate(request, env, undefined);
  if (!auth.ok) return json({ ok: false, error: auth.error }, 401);

  const key = `reservation:user:${auth.user.id}`;
  const read = await getSalesRecord(env, key);
  if (!read.ok) return json({ ok: false, error: read.error, storage: getSalesStorageStatus(env) }, 503);
  const modeGate = assertBotOnlyReservationMode(env);

  return json({
    ok: true,
    storage: getSalesStorageStatus(env),
    presaleMode: modeGate.presaleMode,
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

  const modeGate = assertBotOnlyReservationMode(env);
  if (!modeGate.ok) {
    return json({ ok: false, error: modeGate.error, presaleMode: modeGate.presaleMode }, 403);
  }

  const desiredAllocation72H = cleanDesiredAllocation(payload?.desiredAllocation72H ?? payload?.desiredAllocation);
  if (!desiredAllocation72H) {
    return json({ ok: false, error: "desired_allocation_required" }, 400);
  }

  const walletAddress = cleanWallet(payload?.walletAddress);
  const walletKey = walletDedupeKey(walletAddress);
  const storage = getSalesStorageStatus(env);
  const key = `reservation:user:${auth.user.id}`;
  const existing = await getSalesRecord(env, key);
  if (!existing.ok) return json({ ok: false, error: existing.error, storage }, 503);
  if (existing.record) {
    return json({
      ok: true,
      duplicate: true,
      storage,
      presaleMode: modeGate.presaleMode,
      reservation: publicReservation(existing.record),
      message: "reservation_already_exists",
    });
  }

  if (walletKey) {
    const walletRead = await getSalesRecord(env, `reservation:wallet:${walletKey}`);
    if (!walletRead.ok) return json({ ok: false, error: walletRead.error, storage }, 503);
    if (walletRead.record?.telegramUserId && walletRead.record.telegramUserId !== auth.user.id) {
      return json({
        ok: false,
        error: "wallet_already_reserved",
        storage,
        presaleMode: modeGate.presaleMode,
        walletDedupeStatus: "duplicate_wallet_rejected",
      }, 409);
    }
  }

  const rate = await hitRateLimit(env, auth.user.id);
  if (!rate.ok) {
    return json({ ok: false, error: rate.error, storage }, rate.error === "rate_limited" ? 429 : 503);
  }

  const now = new Date().toISOString();
  const id = `rsv_${crypto.randomUUID()}`;
  const source = cleanString(payload?.source, 80) || auth.startParam || "miniapp";
  const channelSource = cleanString(payload?.channelSource, 80) || source;
  const record = {
    id,
    version: 2,
    createdAt: now,
    updatedAt: now,
    status: modeGate.presaleMode.mode === "warmup" ? "warmup_registered" : "waitlist_registered",
    saleOpensAt: RESERVATION_OPEN_AT,
    waitlistMode: WAITLIST_MODE,
    presaleMode: modeGate.presaleMode.mode,
    requestedPresaleMode: modeGate.presaleMode.requestedMode,
    botOnly: true,
    purchaseEnabled: false,
    telegramUserId: auth.user.id,
    username: auth.user.username,
    telegramUser: auth.user,
    walletAddress,
    walletDedupeKey: walletKey,
    walletDedupeStatus: walletKey ? "unique_wallet_reserved" : "wallet_not_provided",
    desiredAllocation72H,
    referral: cleanString(payload?.referral, 120),
    source,
    channelSource,
    whitelistStatus: "registered_pending_review",
    saleReminderOptIn: payload?.saleReminderOptIn !== false,
    userSegment: classifyUserSegment(desiredAllocation72H, auth.user),
    communityTasks: cleanCommunityTasks(payload?.communityTasks),
    lotteryEligible: true,
    lotteryStatus: "eligible_pending_draw",
    rewardStatus: "not_awarded",
    rewardTxHash: undefined,
    rewardAwardedAt: undefined,
    reservationReward72H: RESERVATION_REWARD_72H,
    lotteryPool72H: LOTTERY_POOL_72H,
    contractEvidence: {
      status: CONTRACT_EVIDENCE_STATUS,
      presaleVaultAddress: cleanString(payload?.presaleVaultAddress, 96) || DEFAULT_PRESALE_VAULT_ADDRESS,
      jettonMasterAddress: cleanString(payload?.jettonMasterAddress, 96) || DEFAULT_72H_JETTON_MASTER,
      saleOpensAt: RESERVATION_OPEN_AT,
      note: "Off-chain reservation evidence only; not a purchase, payment, signature, or on-chain quota.",
    },
    lotteryEvidence: {
      pool72H: LOTTERY_POOL_72H,
      fundingStatus: LOTTERY_FUNDING_STATUS,
      fundingSource: "private_wallet",
      payoutMode: LOTTERY_PAYOUT_MODE,
      noNewContract: true,
      fundingTxHash: cleanString(payload?.lotteryFundingTxHash, 128),
      prizeWalletAddress: cleanWallet(payload?.prizeWalletAddress),
      note: "Lottery rewards are paid by official 72H wallet transfers after winners are finalized; this is not a self-claim smart contract.",
    },
    actorType: auth.actorType,
    authDate: auth.authDate,
  };

  const write = await putSalesRecord(env, key, record, {
    type: "reservation",
    telegramUserId: record.telegramUserId,
    username: record.username,
    status: record.status,
    whitelistStatus: record.whitelistStatus,
    lotteryStatus: record.lotteryStatus,
    rewardStatus: record.rewardStatus,
    presaleMode: record.presaleMode,
    channelSource: record.channelSource,
    createdAt: record.createdAt,
  });
  if (!write.ok) return json({ ok: false, error: write.error, storage }, 503);

  if (walletKey) {
    await putSalesRecord(env, `reservation:wallet:${walletKey}`, {
      reservationId: id,
      telegramUserId: record.telegramUserId,
      walletAddress,
      status: record.status,
      createdAt: record.createdAt,
    }, {
      type: "reservation_wallet_index",
      telegramUserId: record.telegramUserId,
      walletAddress,
      createdAt: record.createdAt,
    });
  }

  await putSalesRecord(env, `reservation:${now}:${id}`, record, {
    type: "reservation_index",
    telegramUserId: record.telegramUserId,
    status: record.status,
    whitelistStatus: record.whitelistStatus,
    presaleMode: record.presaleMode,
    channelSource: record.channelSource,
    createdAt: record.createdAt,
  });

  await recordSalesEvent(env, {
    signalType: "reservation_created",
    telegramUserId: record.telegramUserId,
    username: record.username,
    walletAddress: record.walletAddress,
    walletDedupeStatus: record.walletDedupeStatus,
    desiredAllocation72H: record.desiredAllocation72H,
    source: record.source,
    channelSource: record.channelSource,
    referral: record.referral,
    userSegment: record.userSegment,
    whitelistStatus: record.whitelistStatus,
    lotteryEligible: record.lotteryEligible,
    lotteryStatus: record.lotteryStatus,
    rewardStatus: record.rewardStatus,
    saleReminderOptIn: record.saleReminderOptIn,
    communityTaskStatus: record.communityTasks.status,
    presaleMode: record.presaleMode,
    presaleEnabled: false,
  });

  return json({
    ok: true,
    duplicate: false,
    storage,
    presaleMode: modeGate.presaleMode,
    reservation: publicReservation(record),
  }, 201);
}
