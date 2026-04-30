import assert from "node:assert/strict";
import test from "node:test";

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

  async list({ prefix = "", limit = 100 }: { prefix?: string; limit?: number } = {}) {
    const keys = [...this.store.keys()]
      .filter((name) => name.startsWith(prefix))
      .slice(0, limit)
      .map((name) => ({ name }));
    return { keys, list_complete: true };
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
});

test("sales admin lists waitlist reservations without enabling admin writes", async () => {
  const env = {
    H72H_TELEGRAM_WEBHOOK_SECRET: "test-secret",
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

  const listed = await onSalesAdminGet({
    request: new Request("https://72h.example/api/telegram/sales-admin", {
      headers: { "x-telegram-bot-api-secret-token": "test-secret" },
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
  assert.equal(listedPayload.reservations[0].rewardStatus, "not_awarded");
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
