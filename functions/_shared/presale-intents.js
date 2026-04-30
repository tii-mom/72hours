import { DEFAULT_PRESALE_VAULT_ADDRESS, PRESALE_STAGE_RULES } from "./presale-runtime.js";
import { buildBuyPresaleTransactionRequest } from "./presale-ton.js";

const NANO = 1_000_000_000n;
const DEFAULT_MIN_TON_NANO = 100_000_000n;
const DEFAULT_MAX_TON_NANO = 10_000_000_000_000n;
const WALLET_CAP_RAW_72H = 7_200_000n * NANO;

function readSecret(env) {
  const value =
    env.H72H_BOT_INTENT_SIGNING_SECRET ||
    env.H72H_TELEGRAM_WEBHOOK_SECRET ||
    env.H72H_TELEGRAM_BOT_SECRET;
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function toHex(buffer) {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacHex(secret, data) {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return toHex(await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(data)));
}

function stageByPublicStage(value) {
  const parsed = Number(value);
  return PRESALE_STAGE_RULES.find((stage) => stage.publicStage === parsed);
}

function parseTonAmountNano(value) {
  if (typeof value !== "string" && typeof value !== "number") {
    return undefined;
  }

  const normalized = String(value).trim();
  if (!/^\d+(?:\.\d{1,9})?$/.test(normalized)) {
    return undefined;
  }

  const [whole, fraction = ""] = normalized.split(".");
  return BigInt(whole) * NANO + BigInt(fraction.padEnd(9, "0"));
}

function formatNano(value) {
  const whole = value / NANO;
  const fraction = value % NANO;
  if (fraction === 0n) return whole.toString();
  return `${whole}.${fraction.toString().padStart(9, "0").replace(/0+$/, "")}`;
}

function normalizeWalletAddress(value) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (/^(?:-1:|0:)[0-9a-fA-F]{64}$/.test(trimmed) || /^[UEk][Qf][A-Za-z0-9_-]{46}$/.test(trimmed)) {
    return trimmed;
  }
  return undefined;
}

function tokensPerTonRaw(stage) {
  return BigInt(stage.tokensPerTon.replaceAll(",", "")) * NANO;
}

function expectedTokensRaw(amountTonNano, stage) {
  return (amountTonNano * tokensPerTonRaw(stage)) / NANO;
}

function queryIdFromDigest(hexDigest) {
  return BigInt(`0x${hexDigest.slice(0, 16)}`).toString();
}

function resolveTransactionBlockReason(runtime, input) {
  if (runtime.enabled !== true) {
    return "presale_feature_flag_disabled";
  }
  if (!runtime.chainSnapshot) {
    return "chain_getters_unavailable";
  }
  if (runtime.chainSnapshot.active !== true) {
    return "presale_inactive_on_chain";
  }
  if (Number(runtime.chainSnapshot.contractStage) !== Number(input.contractStage)) {
    return "stage_not_active_on_chain";
  }
  if (runtime.chainSnapshot.buyerPurchasedRaw === undefined) {
    return "buyer_wallet_cap_getter_unavailable";
  }
  if (BigInt(runtime.chainSnapshot.buyerPurchasedRaw) + input.expectedTokensRaw > WALLET_CAP_RAW_72H) {
    return "wallet_cap_exceeded_on_chain";
  }
  return undefined;
}

export function sanitizeIntentInput(payload) {
  const amountTonNano = parseTonAmountNano(payload?.amountTon);
  const stage = stageByPublicStage(payload?.stage ?? 0);
  const walletAddress = normalizeWalletAddress(payload?.walletAddress);

  if (!stage) {
    return { ok: false, error: "invalid_stage" };
  }
  if (!amountTonNano) {
    return { ok: false, error: "invalid_amount_ton" };
  }
  if (amountTonNano < DEFAULT_MIN_TON_NANO || amountTonNano > DEFAULT_MAX_TON_NANO) {
    return { ok: false, error: "amount_out_of_range" };
  }
  if (!walletAddress) {
    return { ok: false, error: "wallet_address_required" };
  }

  const tokenAmountRaw = expectedTokensRaw(amountTonNano, stage);
  if (tokenAmountRaw <= 0n || tokenAmountRaw > WALLET_CAP_RAW_72H) {
    return { ok: false, error: "wallet_cap_exceeded" };
  }

  return {
    ok: true,
    amountTonNano,
    amountTon: formatNano(amountTonNano),
    publicStage: stage.publicStage,
    contractStage: stage.contractStage,
    tokensPerTon: stage.tokensPerTon,
    expectedTokensRaw: tokenAmountRaw,
    expectedTokens72H: formatNano(tokenAmountRaw),
    walletAddress,
    source: typeof payload?.source === "string" ? payload.source.trim().slice(0, 80) : undefined,
    referral: typeof payload?.referral === "string" ? payload.referral.trim().slice(0, 80) : undefined,
  };
}

export async function createDeterministicPresaleIntent({ env, runtime, telegramUser, payload }) {
  const secret = readSecret(env);
  if (!secret) {
    return { ok: false, error: "intent_signing_secret_not_configured" };
  }

  const input = sanitizeIntentInput(payload);
  if (!input.ok) {
    return input;
  }

  const canonical = [
    "72h-presale-intent-v1",
    telegramUser.id,
    input.walletAddress,
    input.publicStage,
    input.amountTonNano.toString(),
    runtime.presaleVaultAddress || DEFAULT_PRESALE_VAULT_ADDRESS,
  ].join("|");
  const digest = await hmacHex(secret, canonical);
  const now = new Date().toISOString();
  const validUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
  const transactionBlockReason = resolveTransactionBlockReason(runtime, input);
  const transactionRequest = transactionBlockReason
    ? {
        available: false,
        reason: transactionBlockReason,
      }
    : (() => {
      const transaction = buildBuyPresaleTransactionRequest({
        targetAddress: runtime.presaleVaultAddress,
        queryId: queryIdFromDigest(digest),
        contractStage: input.contractStage,
        tonAmountNano: input.amountTonNano.toString(),
        minTokens72HRaw: input.expectedTokensRaw.toString(),
        validUntil,
        networkMode: runtime.networkMode,
      });
      return transaction.ok
        ? transaction.request
        : {
            available: false,
            reason: transaction.error || "transaction_payload_unavailable",
          };
    })();

  return {
    ok: true,
    intent: {
      intentId: `presale_${digest.slice(0, 32)}`,
      queryId: queryIdFromDigest(digest),
      status: transactionRequest.available ? "ready_to_sign" : "blocked",
      createdAt: now,
      updatedAt: now,
      validUntil,
      telegramUserId: String(telegramUser.id),
      telegramUsername: telegramUser.username,
      walletAddress: input.walletAddress,
      amountTonNano: input.amountTonNano.toString(),
      amountTon: input.amountTon,
      expectedTokensRaw: input.expectedTokensRaw.toString(),
      expectedTokens72H: input.expectedTokens72H,
      publicStage: input.publicStage,
      contractStage: input.contractStage,
      tokensPerTon: input.tokensPerTon,
      source: input.source,
      referral: input.referral,
      targetAddress: runtime.presaleVaultAddress,
      opcode: "0x720b0003",
      idempotencyKey: digest,
      transactionRequest,
      verification: {
        required: ["targetAddress", "opcode", "queryId", "stage", "amount", "minTokens72H", "success", "idempotency"],
        status: "not_submitted",
      },
    },
  };
}
