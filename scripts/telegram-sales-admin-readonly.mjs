#!/usr/bin/env node

function env(name) {
  const value = process.env[name]?.trim();
  return value || undefined;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function parseArgs(argv) {
  const readFlag = (name) => {
    const index = argv.indexOf(name);
    return index >= 0 ? argv[index + 1] : undefined;
  };

  return {
    baseUrl: readFlag("--base-url") || env("H72H_BOT_PUBLIC_BASE_URL") || "https://72h.lol",
    limit: readFlag("--limit") || "100",
    telegramUserId: readFlag("--telegram-user-id"),
    username: readFlag("--username"),
  };
}

function maskWallet(walletAddress) {
  if (!walletAddress || walletAddress.length <= 14) return walletAddress;
  return `${walletAddress.slice(0, 6)}…${walletAddress.slice(-6)}`;
}

function sanitizeReservation(record) {
  return {
    id: record.id,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    status: record.status,
    telegramUserId: record.telegramUserId,
    username: record.username,
    walletAddress: maskWallet(record.walletAddress),
    walletDedupeStatus: record.walletDedupeStatus,
    desiredAllocation72H: record.desiredAllocation72H,
    source: record.source,
    channelSource: record.channelSource,
    referral: record.referral,
    whitelistStatus: record.whitelistStatus,
    inviteCode: record.inviteCode,
    inviteLink: record.inviteLink,
    referralCode: record.referralCode,
    referredByTelegramUserId: record.referredByTelegramUserId,
    validReferralCount: record.validReferralCount,
    rewardEligible: record.rewardEligible,
    reservationReward72H: record.reservationReward72H,
    lotteryCodeCount: record.lotteryCodeCount,
    lotteryCodeLedger: record.lotteryCodeLedger,
    lotteryEligible: record.lotteryEligible,
    lotteryStatus: record.lotteryStatus,
    lotteryPool72H: record.lotteryPool72H,
    lotteryEvidence: record.lotteryEvidence,
    drawStatus: record.drawStatus,
    winningTier: record.winningTier,
    winningTierLabel: record.winningTierLabel,
    rewardAmount72H: record.rewardAmount72H,
    payoutStatus: record.payoutStatus || record.rewardStatus,
    payoutTx: record.payoutTx || record.rewardTxHash,
    rewardStatus: record.rewardStatus,
    rewardTxHash: record.rewardTxHash,
    rewardAwardedAt: record.rewardAwardedAt,
    saleReminderOptIn: record.saleReminderOptIn,
    userSegment: record.userSegment,
    communityTasks: record.communityTasks,
  };
}

function matchesFilter(record, args) {
  if (args.telegramUserId && String(record.telegramUserId) !== String(args.telegramUserId)) return false;
  if (args.username) {
    const expected = args.username.replace(/^@/, "").toLowerCase();
    const actual = String(record.username || "").replace(/^@/, "").toLowerCase();
    if (actual !== expected) return false;
  }
  return true;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const secret = env("H72H_TELEGRAM_WEBHOOK_SECRET") || env("H72H_TELEGRAM_BOT_SECRET");
  if (!secret) fail("H72H_TELEGRAM_WEBHOOK_SECRET is required for read-only sales-admin access.");

  const baseUrl = new URL(args.baseUrl);
  if (baseUrl.protocol !== "https:") fail("--base-url must be an https URL.");
  const limit = Math.min(Math.max(Number(args.limit) || 100, 1), 500);
  const url = new URL("/api/telegram/sales-admin", baseUrl);
  url.searchParams.set("limit", String(limit));

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "x-telegram-bot-api-secret-token": secret,
      "user-agent": "72h-telegram-sales-admin-readonly/1.0",
    },
  });

  const body = await response.json().catch(() => undefined);
  if (!response.ok || body?.ok === false) {
    fail(body?.error || `sales-admin read failed with HTTP ${response.status}`);
  }

  const reservations = (body.reservations || [])
    .filter((record) => matchesFilter(record, args))
    .map(sanitizeReservation);

  console.log(JSON.stringify({
    ok: true,
    baseUrl: baseUrl.toString().replace(/\/$/, ""),
    storage: body.storage,
    presaleMode: body.presaleMode,
    count: reservations.length,
    reservations,
  }, null, 2));
}

await main();
