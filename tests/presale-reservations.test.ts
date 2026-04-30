import assert from "node:assert/strict";
import test from "node:test";

import { runLotteryDraw } from "../functions/_shared/lottery-draw.js";
import { onRequestPost } from "../functions/api/telegram/presale-reservations.js";
import { onRequestGet as onSalesAdminGet } from "../functions/api/telegram/sales-admin.js";
import { onRequest as onIntentRequest } from "../functions/api/telegram/presale-intents.js";
import { onRequest as onReceiptRequest } from "../functions/api/telegram/presale-receipts.js";
import { onRequest as onNakedIntentRequest } from "../functions/presale-intents.js";
import { onRequest as onNakedReceiptRequest } from "../functions/presale-receipts.js";

class FakeKv {
  store = new Map<string, string>();

  async get(key: string) {
    return this.store.get(key) ?? null;
  }

  async put(key: string, value: string) {
    this.store.set(key, value);
  }

  async list({ prefix = "", limit = 100, cursor }: { prefix?: string; limit?: number; cursor?: string } = {}) {
    const offset = Number(cursor || 0);
    const allKeys = [...this.store.keys()].filter((name) => name.startsWith(prefix));
    const page = allKeys.slice(offset, offset + limit);
    const nextOffset = offset + page.length;
    return {
      keys: page.map((name) => ({ name })),
      cursor: nextOffset < allKeys.length ? String(nextOffset) : undefined,
      list_complete: nextOffset >= allKeys.length,
    };
  }
}

function reservationRequest(body: unknown) {
  return new Request("https://72h.example/api/telegram/presale-reservations", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-telegram-bot-api-secret-token": "test-secret",
    },
    body: JSON.stringify(body),
  });
}

test("presale reservation creates one idempotent off-chain whitelist record per Telegram user", async () => {
  const env = {
    H72H_TELEGRAM_WEBHOOK_SECRET: "test-secret",
    H72H_BOT_SALES_KV: new FakeKv(),
  };
  const body = {
    telegramUser: { id: 382, username: "iq382", first_name: "IQ" },
    walletAddress: "EQReservationWallet00000000000000000000000000000000",
    desiredAllocation72H: "7200000",
    referral: "test-suite",
    source: "unit_test",
    saleReminderOptIn: true,
    communityTasks: {
      joinedTelegram: true,
      followedX: false,
      sharedInvite: true,
    },
  };

  const created = await onRequestPost({ request: reservationRequest(body), env });
  assert.equal(created.status, 201);
  const createdPayload = await created.json() as any;
  assert.equal(createdPayload.ok, true);
  assert.equal(createdPayload.duplicate, false);
  assert.equal(createdPayload.reservation.telegramUserId, "382");
  assert.equal(createdPayload.reservation.status, "warmup_registered");
  assert.equal(createdPayload.reservation.presaleMode, "warmup");
  assert.equal(createdPayload.reservation.botOnly, true);
  assert.equal(createdPayload.reservation.purchaseEnabled, false);
  assert.equal(createdPayload.reservation.channelSource, "unit_test");
  assert.equal(createdPayload.reservation.whitelistStatus, "registered_pending_review");
  assert.equal(createdPayload.reservation.walletDedupeStatus, "unique_wallet_reserved");
  assert.equal(createdPayload.reservation.rewardStatus, "not_awarded");
  assert.equal(createdPayload.reservation.lotteryEligible, true);
  assert.equal(createdPayload.reservation.lotteryStatus, "eligible_pending_draw");
  assert.equal(createdPayload.reservation.walletVerificationStatus, "verified_unique");
  assert.equal(createdPayload.reservation.reviewStatus, "auto_pass");
  assert.equal(createdPayload.reservation.riskLevel, "medium");
  assert.deepEqual(createdPayload.reservation.riskFlags, ["share_self_attested"]);
  assert.equal(createdPayload.reservation.drawReviewStatus, "eligible");
  assert.equal(createdPayload.reservation.lotteryCodeCount, 3);
  assert.equal(createdPayload.reservation.lotteryCodeLedger[0].reason, "reservation_success");
  assert.equal(createdPayload.reservation.lotteryCodeLedger[1].reason, "community_share");
  assert.equal(createdPayload.reservation.lotteryCodeLedger[1].reviewStatus, "pending_manual_review");
  assert.equal(createdPayload.reservation.shareTasks.communityShareOnce, "self_attested");
  assert.equal(createdPayload.reservation.inviteCode, "u382");
  assert.equal(createdPayload.reservation.inviteAlias, "iq382");
  assert.equal(createdPayload.reservation.inviteLink, "https://t.me/the72hbot?startapp=ref_u382");
  assert.equal(createdPayload.reservation.reservationReward72H, "72");
  assert.equal(createdPayload.reservation.lotteryPool72H, "10000000");
  assert.equal(createdPayload.reservation.saleOpensAt, "2026-05-05T09:00:00.000Z");
  assert.equal(createdPayload.reservation.waitlistMode, "warmup_waitlist_only");
  assert.equal(createdPayload.reservation.saleReminderOptIn, true);
  assert.equal(createdPayload.reservation.userSegment, "priority_whale");
  assert.deepEqual(createdPayload.reservation.communityTasks, {
    joinedTelegram: true,
    followedX: false,
    sharedInvite: true,
    status: "in_progress",
  });
  assert.equal(createdPayload.reservation.contractEvidence.status, "deployed_inactive_not_purchase");
  assert.equal(createdPayload.reservation.contractEvidence.presaleVaultAddress, "EQCj56OaGFtIBgdtQjIacb7s1jlEy93vh-93PU07MDR1vpE9");
  assert.equal(createdPayload.reservation.contractEvidence.jettonMasterAddress, "EQBGIzEDvvKObStrcVb6i5Z1-8uYZYtUrYzF2rFZU7xUAXVg");
  assert.equal(createdPayload.reservation.lotteryEvidence.pool72H, "10000000");
  assert.equal(createdPayload.reservation.lotteryEvidence.fundingStatus, "awaiting_private_wallet_funding_tx");
  assert.equal(createdPayload.reservation.lotteryEvidence.fundingSource, "private_wallet");
  assert.equal(createdPayload.reservation.lotteryEvidence.payoutMode, "official_wallet_transfer_no_new_contract");
  assert.equal(createdPayload.reservation.lotteryEvidence.noNewContract, true);

  const duplicate = await onRequestPost({ request: reservationRequest({ ...body, desiredAllocation72H: "1" }), env });
  assert.equal(duplicate.status, 200);
  const duplicatePayload = await duplicate.json() as any;
  assert.equal(duplicatePayload.ok, true);
  assert.equal(duplicatePayload.duplicate, true);
  assert.equal(duplicatePayload.reservation.id, createdPayload.reservation.id);
  assert.equal(duplicatePayload.reservation.desiredAllocation72H, "7200000");
});

test("presale reservation rejects duplicate wallets across Telegram users", async () => {
  const env = {
    H72H_TELEGRAM_WEBHOOK_SECRET: "test-secret",
    H72H_BOT_SALES_KV: new FakeKv(),
  };
  const walletAddress = "EQReservationWallet00000000000000000000000000000000";

  const first = await onRequestPost({
    request: reservationRequest({ telegramUser: { id: 1 }, walletAddress, desiredAllocation72H: "720" }),
    env,
  });
  assert.equal(first.status, 201);

  const second = await onRequestPost({
    request: reservationRequest({ telegramUser: { id: 2 }, walletAddress, desiredAllocation72H: "720" }),
    env,
  });
  assert.equal(second.status, 409);
  const payload = await second.json() as any;
  assert.equal(payload.error, "wallet_already_reserved");
  assert.equal(payload.walletDedupeStatus, "duplicate_wallet_rejected");
  assert.equal(payload.walletVerificationStatus, "duplicate_rejected");
  assert.deepEqual(payload.riskFlags, ["duplicate_wallet_attempt"]);
});


test("presale lottery codes hold walletless referrals pending and support one-time self-attested community share", async () => {
  const env = {
    H72H_TELEGRAM_WEBHOOK_SECRET: "test-secret",
    H72H_BOT_SALES_KV: new FakeKv(),
  };

  const inviter = await onRequestPost({
    request: reservationRequest({ telegramUser: { id: 10, username: "alpha" }, walletAddress: "EQAlphaWallet0000000000000000000000000000000000", desiredAllocation72H: "720" }),
    env,
  });
  assert.equal(inviter.status, 201);
  const inviterPayload = await inviter.json() as any;
  assert.equal(inviterPayload.reservation.lotteryCodeCount, 1);
  assert.equal(inviterPayload.reservation.inviteCode, "u10");
  assert.equal(inviterPayload.reservation.inviteAlias, "alpha");
  assert.equal(inviterPayload.reservation.walletVerificationStatus, "verified_unique");

  const invited = await onRequestPost({
    request: reservationRequest({ telegramUser: { id: 11, username: "beta" }, desiredAllocation72H: "720", referral: "u10" }),
    env,
  });
  assert.equal(invited.status, 201);
  const invitedPayload = await invited.json() as any;
  assert.equal(invitedPayload.reservation.lotteryCodeCount, 1);
  assert.equal(invitedPayload.reservation.lotteryEligible, false);
  assert.equal(invitedPayload.reservation.lotteryStatus, "ineligible_pending_wallet");
  assert.equal(invitedPayload.reservation.reviewStatus, "pending_review");
  assert.equal(invitedPayload.reservation.walletVerificationStatus, "missing");
  assert.equal(invitedPayload.reservation.referralCode, "u10");
  assert.equal(invitedPayload.reservation.referredByTelegramUserId, "10");

  const share = await onRequestPost({
    request: reservationRequest({ telegramUser: { id: 11 }, action: "community_share_completed" }),
    env,
  });
  assert.equal(share.status, 200);
  const sharePayload = await share.json() as any;
  assert.equal(sharePayload.duplicate, false);
  assert.equal(sharePayload.reservation.lotteryCodeCount, 3);
  assert.equal(sharePayload.reservation.communityTasks.sharedInvite, true);
  assert.equal(sharePayload.reservation.shareTasks.communityShareOnce, "self_attested");
  assert.equal(sharePayload.reservation.lotteryCodeLedger.find((item: any) => item.reason === "community_share").reviewStatus, "pending_manual_review");

  const shareAgain = await onRequestPost({
    request: reservationRequest({ telegramUser: { id: 11 }, action: "community_share_completed" }),
    env,
  });
  assert.equal(shareAgain.status, 200);
  const shareAgainPayload = await shareAgain.json() as any;
  assert.equal(shareAgainPayload.duplicate, true);
  assert.equal(shareAgainPayload.reservation.lotteryCodeCount, 3);

  const listed = await onSalesAdminGet({
    request: new Request("https://72h.example/api/telegram/sales-admin", {
      headers: { "x-telegram-bot-api-secret-token": "test-secret" },
    }),
    env,
  });
  const listedPayload = await listed.json() as any;
  const alpha = listedPayload.reservations.find((record: any) => record.telegramUserId === "10");
  const beta = listedPayload.reservations.find((record: any) => record.telegramUserId === "11");
  assert.equal(alpha.validReferralCount, 0);
  assert.equal(alpha.pendingReferralCount, 1);
  assert.equal(alpha.lotteryCodeCount, 1);
  assert.equal(alpha.lotteryCodeLedger.some((item: any) => item.reason === "pending_referral" && item.codes === 0), true);
  assert.equal(beta.lotteryCodeCount, 3);
  assert.equal(beta.lotteryEligible, false);
  assert.equal(beta.walletVerificationStatus, "missing");
  assert.equal(beta.reviewStatus, "pending_review");
  assert.equal(beta.riskFlags.includes("share_self_attested"), true);
});

test("sales admin lists waitlist reservations with a dedicated read-only secret without enabling admin writes", async () => {
  const env = {
    H72H_TELEGRAM_WEBHOOK_SECRET: "test-secret",
    H72H_SALES_ADMIN_READONLY_SECRET: "readonly-secret",
    H72H_PRESALE_MODE: "sale_live",
    H72H_BOT_SALES_KV: new FakeKv(),
  };

  const created = await onRequestPost({
    request: reservationRequest({ telegramUser: { id: 382 }, desiredAllocation72H: "720", source: "kol_a" }),
    env,
  });
  assert.equal(created.status, 201);
  const createdPayload = await created.json() as any;
  assert.equal(createdPayload.presaleMode.mode, "waitlist");
  assert.equal(createdPayload.presaleMode.purchaseEnabled, false);

  const unauthenticated = await onSalesAdminGet({
    request: new Request("https://72h.example/api/telegram/sales-admin", {
      headers: { "x-72h-sales-admin-readonly-secret": "wrong-secret" },
    }),
    env,
  });
  assert.equal(unauthenticated.status, 401);

  const listed = await onSalesAdminGet({
    request: new Request("https://72h.example/api/telegram/sales-admin", {
      headers: { "x-72h-sales-admin-readonly-secret": "readonly-secret" },
    }),
    env,
  });
  assert.equal(listed.status, 200);
  const listedPayload = await listed.json() as any;
  assert.equal(listedPayload.ok, true);
  assert.equal(listedPayload.presaleMode.mode, "waitlist");
  assert.equal(listedPayload.reservations.length, 1);
  assert.equal(listedPayload.reservations[0].source, "kol_a");
  assert.equal(listedPayload.reservations[0].whitelistStatus, "registered_pending_review");
  assert.equal(listedPayload.reservations[0].rewardEligible, false);
  assert.equal(listedPayload.reservations[0].reservationReward72H, "72");
  assert.equal(listedPayload.reservations[0].lotteryCodeCount, 1);
  assert.equal(listedPayload.reservations[0].lotteryCodeLedger[0].reason, "reservation_success");
  assert.equal(listedPayload.reservations[0].lotteryEligible, false);
  assert.equal(listedPayload.reservations[0].lotteryStatus, "ineligible_pending_wallet");
  assert.equal(listedPayload.reservations[0].walletVerificationStatus, "missing");
  assert.equal(listedPayload.reservations[0].reviewStatus, "pending_review");
  assert.equal(listedPayload.reservations[0].drawReviewStatus, "held");
  assert.equal(listedPayload.page.listComplete, true);
  assert.equal(listedPayload.reservations[0].lotteryPool72H, "10000000");
  assert.equal(listedPayload.reservations[0].lotteryEvidence.payoutMode, "official_wallet_transfer_no_new_contract");
  assert.equal(listedPayload.reservations[0].rewardStatus, "not_awarded");
});


test("wallet-verified referrals become valid codes and sales admin exposes KV pagination warnings", async () => {
  const env = {
    H72H_TELEGRAM_WEBHOOK_SECRET: "test-secret",
    H72H_BOT_SALES_KV: new FakeKv(),
  };

  await onRequestPost({
    request: reservationRequest({
      telegramUser: { id: 20, username: "gamma" },
      walletAddress: "EQGammaWallet000000000000000000000000000000000",
      desiredAllocation72H: "720",
    }),
    env,
  });
  await onRequestPost({
    request: reservationRequest({
      telegramUser: { id: 21, username: "delta" },
      walletAddress: "EQDeltaWallet000000000000000000000000000000000",
      desiredAllocation72H: "720",
      referral: "u20",
    }),
    env,
  });

  const firstPage = await onSalesAdminGet({
    request: new Request("https://72h.example/api/telegram/sales-admin?limit=1", {
      headers: { "x-telegram-bot-api-secret-token": "test-secret" },
    }),
    env,
  });
  const firstPayload = await firstPage.json() as any;
  assert.equal(firstPayload.page.listComplete, false);
  assert.equal(typeof firstPayload.page.nextCursor, "string");
  assert.match(firstPayload.page.warning, /More KV records/);

  const secondPage = await onSalesAdminGet({
    request: new Request(`https://72h.example/api/telegram/sales-admin?limit=10&cursor=${firstPayload.page.nextCursor}`, {
      headers: { "x-telegram-bot-api-secret-token": "test-secret" },
    }),
    env,
  });
  const secondPayload = await secondPage.json() as any;
  const gamma = secondPayload.reservations.find((record: any) => record.telegramUserId === "20");
  assert.equal(gamma.validReferralCount, 1);
  assert.equal(gamma.pendingReferralCount, 0);
  assert.equal(gamma.lotteryCodeCount, 2);
  assert.equal(gamma.lotteryCodeLedger.some((item: any) => item.reason === "valid_referral" && item.codes === 1), true);
});

test("presale reservation rejects unauthenticated or malformed requests", async () => {
  const env = { H72H_TELEGRAM_WEBHOOK_SECRET: "test-secret", H72H_BOT_SALES_KV: new FakeKv() };

  const unauthenticated = await onRequestPost({
    request: new Request("https://72h.example/api/telegram/presale-reservations", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ desiredAllocation72H: "7200000" }),
    }),
    env,
  });
  assert.equal(unauthenticated.status, 401);

  const malformed = await onRequestPost({
    request: reservationRequest({ telegramUser: { id: 382 }, desiredAllocation72H: "0" }),
    env,
  });
  assert.equal(malformed.status, 400);
});

test("lottery draw is deterministic, dedupes users, blocks repeated major wins, and keeps participation rewards in range", () => {
  const reservations = [
    { id: "r1", telegramUserId: "1", username: "alpha", walletAddress: "EQ1", lotteryEligible: true, status: "warmup_registered", lotteryCodeCount: 6 },
    { id: "r1-dup", telegramUserId: "1", username: "alpha_dup", walletAddress: "EQ1DUP", lotteryEligible: true, status: "warmup_registered", lotteryCodeCount: 99 },
    { id: "r2", telegramUserId: "2", username: "beta", walletAddress: "EQ2", lotteryEligible: true, status: "warmup_registered", lotteryCodeCount: 4 },
    { id: "r3", telegramUserId: "3", username: "gamma", walletAddress: "EQ3", lotteryEligible: true, status: "warmup_registered", lotteryCodeCount: 3 },
    { id: "r4", telegramUserId: "4", username: "delta", walletAddress: "EQ4", lotteryEligible: true, status: "warmup_registered", lotteryCodeCount: 2 },
    { id: "r5", telegramUserId: "5", username: "epsilon", walletAddress: "EQ5", lotteryEligible: true, status: "warmup_registered", lotteryCodeCount: 1 },
    { id: "r6", telegramUserId: "6", username: "zeta", walletAddress: "EQ6", lotteryEligible: false, status: "cancelled", lotteryCodeCount: 10 },
  ];

  const drawInput = {
    reservations,
    tonBlockHash: "ton-block-hash-public-001",
    activityId: "early-access-draw-1",
    drawTime: "2026-05-05T09:00:00.000Z",
    bigPrizeTiers: [
      { tier: "first", label: "一等奖", count: 1, rewardAmount72H: 72000 },
      { tier: "second", label: "二等奖", count: 1, rewardAmount72H: 7200 },
      { tier: "third", label: "三等奖", count: 1, rewardAmount72H: 720 },
    ],
  };
  const first = runLotteryDraw(drawInput);
  const second = runLotteryDraw(drawInput);

  assert.deepEqual(first.winners, second.winners);
  assert.equal(first.draw.seed, "ton-block-hash-public-001|early-access-draw-1|2026-05-05T09:00:00.000Z");
  assert.equal(first.draw.eligibleUserCount, 5);
  assert.equal(first.draw.ticketCount, 16);
  assert.equal(first.reservations.length, 6);

  const majorWinners = first.winners.filter((winner: any) => ["first", "second", "third"].includes(winner.winningTier));
  assert.equal(new Set(majorWinners.map((winner: any) => winner.telegramUserId)).size, majorWinners.length);
  assert.equal(majorWinners.length, 3);
  assert.equal(first.winners.some((winner: any) => winner.telegramUserId === "6"), false);

  const participationRewards = first.winners.filter((winner: any) => winner.winningTier === "participation");
  assert.equal(participationRewards.length, 2);
  for (const winner of participationRewards) {
    const amount = Number((winner as any).rewardAmount72H);
    assert.equal(amount >= 10 && amount <= 200, true);
  }

  for (const row of first.reservations.filter((record: any) => record.winningTier !== "none")) {
    assert.equal((row as any).payoutStatus, "pending_manual_transfer");
    assert.equal((row as any).payoutTx, undefined);
  }
});

test("purchase intent and receipt routes remain disabled", async () => {
  const intent = await onIntentRequest();
  const receipt = await onReceiptRequest();
  const nakedIntent = await onNakedIntentRequest();
  const nakedReceipt = await onNakedReceiptRequest();

  assert.equal(intent.status, 503);
  assert.equal(receipt.status, 503);
  assert.equal(nakedIntent.status, 503);
  assert.equal(nakedReceipt.status, 503);
  assert.deepEqual(await intent.json(), { ok: false, error: "presale_route_disabled" });
  assert.deepEqual(await receipt.json(), { ok: false, error: "presale_route_disabled" });
  assert.deepEqual(await nakedIntent.json(), { ok: false, error: "presale_route_disabled" });
  assert.deepEqual(await nakedReceipt.json(), { ok: false, error: "presale_route_disabled" });
});
