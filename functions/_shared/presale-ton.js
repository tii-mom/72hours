import { Address, beginCell, Cell } from "@ton/core";

export const BUY_PRESALE_OPCODE = 0x720b0003;
export const BUY_PRESALE_GAS_RESERVE_NANO = 120_000_000n;

export function normalizeTonAddress(value) {
  if (typeof value !== "string" || !value.trim()) {
    return undefined;
  }
  try {
    return Address.parse(value.trim()).toRawString().toLowerCase();
  } catch {
    return undefined;
  }
}

export function toFriendlyTonAddress(value, options = {}) {
  const address = Address.parse(value);
  return address.toString({
    bounceable: options.bounceable ?? true,
    testOnly: options.testOnly ?? false,
    urlSafe: true,
  });
}

export function buildBuyPresalePayload({
  queryId,
  contractStage,
  tonAmountNano,
  minTokens72HRaw,
}) {
  return beginCell()
    .storeUint(BUY_PRESALE_OPCODE, 32)
    .storeUint(BigInt(queryId), 64)
    .storeUint(Number(contractStage), 8)
    .storeCoins(BigInt(tonAmountNano))
    .storeCoins(BigInt(minTokens72HRaw))
    .endCell()
    .toBoc()
    .toString("base64");
}

export function buildBuyPresaleTransactionRequest({
  targetAddress,
  queryId,
  contractStage,
  tonAmountNano,
  minTokens72HRaw,
  validUntil,
  networkMode,
}) {
  const normalizedTarget = normalizeTonAddress(targetAddress);
  if (!normalizedTarget) {
    return { ok: false, error: "presale_target_address_invalid" };
  }

  const sendAmountNano = BigInt(tonAmountNano) + BUY_PRESALE_GAS_RESERVE_NANO;
  const payload = buildBuyPresalePayload({
    queryId,
    contractStage,
    tonAmountNano,
    minTokens72HRaw,
  });

  return {
    ok: true,
    request: {
      available: true,
      protocol: "ton-connect",
      method: "sendTransaction",
      operation: "72h.presale.buy",
      entrypoint: "BuyPresale",
      payloadEncoding: "base64-boc",
      opcode: `0x${BUY_PRESALE_OPCODE.toString(16)}`,
      queryId: String(queryId),
      contractStage: Number(contractStage),
      tonAmountNano: String(tonAmountNano),
      minTokens72HRaw: String(minTokens72HRaw),
      gasReserveNano: BUY_PRESALE_GAS_RESERVE_NANO.toString(),
      validUntil,
      messages: [
        {
          address: toFriendlyTonAddress(targetAddress, {
            bounceable: true,
            testOnly: networkMode === "testnet",
          }),
          amount: sendAmountNano.toString(),
          payload,
          comment: "72H presale BuyPresale",
        },
      ],
      scaffold: {
        version: "72h-presale-buy/v1",
        encoding: "base64-boc",
        productionReady: true,
        gasPayer: "user",
        notes: [
          "Payload is built deterministically from the stored presale intent.",
          "The message value is tonAmount + 0.12 TON, matching PresaleVault gas requirements.",
        ],
      },
    },
  };
}

export function parseBuyPresaleBody(bodyBase64) {
  if (typeof bodyBase64 !== "string" || !bodyBase64.trim()) {
    return { ok: false, error: "message_body_missing" };
  }

  try {
    const slice = Cell.fromBase64(bodyBase64).beginParse();
    const opcode = slice.loadUint(32);
    const queryId = slice.loadUintBig(64).toString();
    const contractStage = slice.loadUint(8);
    const tonAmountNano = slice.loadCoins().toString();
    const minTokens72HRaw = slice.loadCoins().toString();

    return {
      ok: true,
      message: {
        opcode,
        opcodeHex: `0x${opcode.toString(16)}`,
        queryId,
        contractStage,
        tonAmountNano,
        minTokens72HRaw,
      },
    };
  } catch {
    return { ok: false, error: "message_body_invalid" };
  }
}

