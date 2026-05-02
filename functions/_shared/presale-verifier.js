import {
  BUY_PRESALE_GAS_RESERVE_NANO,
  BUY_PRESALE_OPCODE,
  normalizeTonAddress,
  parseBuyPresaleBody,
} from "./presale-ton.js";

function readString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function normalizeHash(value) {
  if (typeof value !== "string") return undefined;
  const normalized = value.trim().replace(/^0x/i, "");
  return /^[0-9a-f]{64}$/i.test(normalized) ? normalized.toLowerCase() : undefined;
}

function normalizeEndpoint(endpoint) {
  return endpoint.replace(/\/+$/, "");
}

function isJsonRpcEndpoint(endpoint) {
  try {
    return new URL(endpoint).pathname.toLowerCase().endsWith("/jsonrpc");
  } catch {
    return false;
  }
}

function getTxHash(tx) {
  return normalizeHash(tx?.transaction_id?.hash || tx?.hash);
}

function getInbound(tx) {
  return tx?.in_msg || tx?.inMsg || tx?.inMessage;
}

function getMessageBody(message) {
  return message?.body || message?.msg_data?.body || message?.message_content?.body;
}

function parseNanoValue(value) {
  try {
    return BigInt(String(value || "0"));
  } catch {
    return undefined;
  }
}

async function fetchToncenterTransactions(env, address, fetchImpl = fetch) {
  const rpcUrl = readString(env.H72H_TON_RPC_URL);
  if (!rpcUrl) {
    return { ok: false, error: "ton_rpc_not_configured" };
  }

  const endpoint = normalizeEndpoint(rpcUrl);
  const attempts = isJsonRpcEndpoint(endpoint)
    ? [
        {
          kind: "jsonrpc",
          url: endpoint,
          body: {
            jsonrpc: "2.0",
            id: `receipt-${Date.now()}`,
            method: "getTransactions",
            params: { address, limit: 40, archival: true },
          },
        },
      ]
    : [
        { kind: "rest", url: `${endpoint}/getTransactions` },
        {
          kind: "jsonrpc",
          url: endpoint,
          body: {
            jsonrpc: "2.0",
            id: `receipt-${Date.now()}`,
            method: "getTransactions",
            params: { address, limit: 40, archival: true },
          },
        },
      ];

  const headers = {};
  const apiKey = readString(env.H72H_TON_API_KEY);
  if (apiKey) {
    headers["X-API-Key"] = apiKey;
    headers.authorization = `Bearer ${apiKey}`;
  }

  let lastError = "ton_rpc_not_attempted";
  for (const attempt of attempts) {
    let url;
    try {
      url = new URL(attempt.url);
      if (attempt.kind === "rest") {
        url.searchParams.set("address", address);
        url.searchParams.set("limit", "40");
        url.searchParams.set("archival", "true");
      }
    } catch {
      lastError = "ton_rpc_invalid_url";
      continue;
    }

    const response = await fetchImpl(url, {
      method: attempt.kind === "jsonrpc" ? "POST" : "GET",
      headers: attempt.kind === "jsonrpc" ? { ...headers, "content-type": "application/json" } : headers,
      body: attempt.kind === "jsonrpc" ? JSON.stringify(attempt.body) : undefined,
    }).catch(() => undefined);
    if (!response) {
      lastError = "ton_rpc_network_error";
      continue;
    }
    if (!response.ok) {
      lastError = "ton_rpc_request_failed";
      continue;
    }

    const body = await response.json().catch(() => undefined);
    const result = body?.result?.transactions || body?.result;
    if (body?.ok === false || !Array.isArray(result)) {
      lastError = "ton_rpc_invalid_response";
      continue;
    }

    return { ok: true, transactions: result };
  }

  return { ok: false, error: lastError };
}

export async function verifyPresaleReceipt({ env, runtime, intent, proof, fetchImpl = fetch }) {
  const txHash = normalizeHash(proof?.txHash || proof?.transactionHash || proof?.hash);
  if (!txHash) {
    return { ok: false, error: "transaction_hash_required" };
  }

  const expectedAddress = normalizeTonAddress(intent.targetAddress || runtime.presaleVaultAddress);
  if (!expectedAddress) {
    return { ok: false, error: "target_address_unavailable" };
  }

  const fetched = await fetchToncenterTransactions(env, expectedAddress, fetchImpl);
  if (!fetched.ok) {
    return {
      ok: true,
      status: "manual_review",
      reason: fetched.error,
      txHash,
      checks: {
        targetAddress: "unavailable",
        amount: "unavailable",
        success: "unavailable",
        opcode: "unavailable",
        queryId: "unavailable",
        stage: "unavailable",
        tonAmount: "unavailable",
        minTokens72H: "unavailable",
        idempotency: "pass",
      },
    };
  }

  const match = fetched.transactions.find((tx) => getTxHash(tx) === txHash);
  if (!match) {
    return {
      ok: true,
      status: "not_found",
      reason: "transaction_not_found_for_presale_vault",
      txHash,
      checks: {
        targetAddress: "fail",
        amount: "unavailable",
        success: "unavailable",
        opcode: "unavailable",
        queryId: "unavailable",
        stage: "unavailable",
        tonAmount: "unavailable",
        minTokens72H: "unavailable",
        idempotency: "pass",
      },
    };
  }

  const inbound = getInbound(match) || {};
  const value = parseNanoValue(inbound.value || inbound.amount);
  const expectedValue = parseNanoValue(intent.amountTonNano);
  const expectedSendValue = expectedValue === undefined ? undefined : expectedValue + BUY_PRESALE_GAS_RESERVE_NANO;
  const amountOk = value !== undefined && expectedSendValue !== undefined && value >= expectedSendValue;
  const destination = inbound.destination || inbound.dest || match.account?.address;
  const normalizedDestination = normalizeTonAddress(destination);
  const targetOk = normalizedDestination === expectedAddress;
  const success = match.success !== false;
  const parsedBody = parseBuyPresaleBody(getMessageBody(inbound));
  const message = parsedBody.ok ? parsedBody.message : undefined;
  const opcodeOk = message?.opcode === BUY_PRESALE_OPCODE;
  const queryIdOk = message?.queryId === String(intent.queryId);
  const stageOk = Number(message?.contractStage) === Number(intent.contractStage);
  const tonAmountOk = message?.tonAmountNano === String(intent.amountTonNano);
  const minTokensOk = message?.minTokens72HRaw === String(intent.expectedTokensRaw);

  const baseChecks = {
    targetAddress: targetOk ? "pass" : "fail",
    amount: amountOk ? "pass" : "fail",
    success: success ? "pass" : "fail",
    opcode: parsedBody.ok ? (opcodeOk ? "pass" : "fail") : "fail",
    queryId: parsedBody.ok ? (queryIdOk ? "pass" : "fail") : "fail",
    stage: parsedBody.ok ? (stageOk ? "pass" : "fail") : "fail",
    tonAmount: parsedBody.ok ? (tonAmountOk ? "pass" : "fail") : "fail",
    minTokens72H: parsedBody.ok ? (minTokensOk ? "pass" : "fail") : "fail",
    idempotency: "pass",
  };

  const verified = targetOk && amountOk && success && opcodeOk && queryIdOk && stageOk && tonAmountOk && minTokensOk;
  return {
    ok: true,
    status: verified ? "verified" : "rejected",
    reason: verified ? "all_required_chain_checks_passed" : parsedBody.ok ? "chain_checks_failed" : parsedBody.error,
    txHash,
    transactionLt: match.transaction_id?.lt,
    decodedMessage: message,
    checks: baseChecks,
  };
}
