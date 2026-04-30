import assert from "node:assert/strict";
import test from "node:test";

import { onRequestPost } from "../functions/api/telegram/presale-reservations.js";
import { onRequest as onIntentRequest } from "../functions/api/telegram/presale-intents.js";
import { onRequest as onReceiptRequest } from "../functions/api/telegram/presale-receipts.js";

class FakeKv {
  store = new Map<string, string>();

  async get(key: string) {
    return this.store.get(key) ?? null;
  }

  async put(key: string, value: string) {
    this.store.set(key, value);
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
  };

  const created = await onRequestPost({ request: reservationRequest(body), env });
  assert.equal(created.status, 201);
  const createdPayload = await created.json() as any;
  assert.equal(createdPayload.ok, true);
  assert.equal(createdPayload.duplicate, false);
  assert.equal(createdPayload.reservation.telegramUserId, "382");
  assert.equal(createdPayload.reservation.status, "reserved");
  assert.equal(createdPayload.reservation.lotteryEligible, true);
  assert.equal(createdPayload.reservation.reservationReward72H, "72");
  assert.equal(createdPayload.reservation.lotteryPool72H, "10000000");
  assert.equal(createdPayload.reservation.saleOpensAt, "2026-05-05T09:00:00.000Z");
  assert.equal(createdPayload.reservation.contractEvidence.status, "deployed_inactive_not_purchase");
  assert.equal(createdPayload.reservation.contractEvidence.presaleVaultAddress, "EQCj56OaGFtIBgdtQjIacb7s1jlEy93vh-93PU07MDR1vpE9");
  assert.equal(createdPayload.reservation.contractEvidence.jettonMasterAddress, "EQBGIzEDvvKObStrcVb6i5Z1-8uYZYtUrYzF2rFZU7xUAXVg");
  assert.equal(createdPayload.reservation.lotteryEvidence.pool72H, "10000000");
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

  assert.equal(intent.status, 503);
  assert.equal(receipt.status, 503);
  assert.deepEqual(await intent.json(), { ok: false, error: "presale_route_disabled" });
  assert.deepEqual(await receipt.json(), { ok: false, error: "presale_route_disabled" });
});
