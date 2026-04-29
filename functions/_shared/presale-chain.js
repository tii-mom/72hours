import { Address, beginCell } from "@ton/core";
import { getPresaleRuntime, PRESALE_STAGE_RULES } from "./presale-runtime.js";

function readString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
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

function getTonRpcHeaders(env) {
  const headers = {
    accept: "application/json",
    "content-type": "application/json",
  };
  const apiKey = readString(env.H72H_TON_API_KEY);
  if (apiKey) {
    headers["X-API-Key"] = apiKey;
    headers.authorization = `Bearer ${apiKey}`;
  }
  return headers;
}

function normalizeStackInt(value) {
  if (typeof value === "number" || typeof value === "bigint") {
    return BigInt(value).toString();
  }
  if (typeof value === "string") {
    return BigInt(value).toString();
  }
  if (Array.isArray(value) && value.length >= 2) {
    return normalizeStackInt(value[1]);
  }
  if (value && typeof value === "object") {
    const record = value;
    if (record.value !== undefined) return normalizeStackInt(record.value);
    if (record.num !== undefined) return normalizeStackInt(record.num);
  }
  throw new Error("unsupported_stack_int");
}

function normalizeGetterPayload(payload) {
  if (payload?.ok === false) {
    throw new Error(payload.error?.message || payload.error || "ton_getter_failed");
  }
  const result = payload?.result ?? payload;
  if (Array.isArray(result?.stack)) {
    return result.stack;
  }
  if (Array.isArray(payload?.stack)) {
    return payload.stack;
  }
  throw new Error("ton_getter_invalid_stack");
}

async function postJson(url, body, headers, fetchImpl) {
  const response = await fetchImpl(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  }).catch(() => undefined);
  if (!response) {
    return { ok: false, error: "ton_rpc_network_error" };
  }
  if (!response.ok) {
    return { ok: false, error: "ton_rpc_request_failed", httpStatus: response.status };
  }
  const payload = await response.json().catch(() => undefined);
  if (!payload) {
    return { ok: false, error: "ton_rpc_invalid_json" };
  }
  return { ok: true, payload };
}

async function runGetMethod({ env, address, method, stack = [], fetchImpl = fetch }) {
  const rpcUrl = readString(env.H72H_TON_RPC_URL);
  if (!rpcUrl) {
    return { ok: false, error: "ton_rpc_not_configured" };
  }

  const headers = getTonRpcHeaders(env);
  const endpoint = normalizeEndpoint(rpcUrl);
  const attempts = isJsonRpcEndpoint(endpoint)
    ? [
        {
          url: endpoint,
          body: {
            jsonrpc: "2.0",
            id: `presale-${method}-${Date.now()}`,
            method: "runGetMethod",
            params: { address, method, stack },
          },
        },
      ]
    : [
        {
          url: `${endpoint}/runGetMethod`,
          body: { address, method, stack },
        },
        {
          url: endpoint,
          body: {
            jsonrpc: "2.0",
            id: `presale-${method}-${Date.now()}`,
            method: "runGetMethod",
            params: { address, method, stack },
          },
        },
      ];

  let lastError = "ton_rpc_not_attempted";
  for (const attempt of attempts) {
    let url;
    try {
      url = new URL(attempt.url);
    } catch {
      lastError = "ton_rpc_invalid_url";
      continue;
    }

    const response = await postJson(url, attempt.body, headers, fetchImpl);
    if (!response.ok) {
      lastError = response.error;
      continue;
    }

    try {
      const returnedStack = normalizeGetterPayload(response.payload);
      return { ok: true, stack: returnedStack };
    } catch (error) {
      lastError = error instanceof Error ? error.message : "ton_getter_parse_failed";
    }
  }

  return { ok: false, error: lastError };
}

async function readGetterInt(input) {
  const result = await runGetMethod(input);
  if (!result.ok) {
    return result;
  }
  try {
    return { ok: true, value: normalizeStackInt(result.stack[0]) };
  } catch {
    return { ok: false, error: "ton_getter_int_unreadable" };
  }
}

function formatCoins(rawValue) {
  const raw = BigInt(rawValue);
  const nano = 1_000_000_000n;
  const whole = raw / nano;
  const fraction = raw % nano;
  if (fraction === 0n) return whole.toLocaleString("en-US");
  const decimal = fraction.toString().padStart(9, "0").replace(/0+$/, "");
  return `${whole.toLocaleString("en-US")}.${decimal}`;
}

function publicStageFromContractStage(contractStage) {
  const parsed = Number(contractStage);
  return PRESALE_STAGE_RULES.find((stage) => stage.contractStage === parsed)?.publicStage;
}

function stackNum(value) {
  return ["num", `0x${BigInt(value).toString(16)}`];
}

function stackAddress(value) {
  try {
    return [
      "slice",
      {
        bytes: beginCell()
          .storeAddress(Address.parse(value))
          .endCell()
          .toBoc()
          .toString("base64"),
      },
    ];
  } catch {
    return undefined;
  }
}

export async function fetchPresaleChainSnapshot(env, runtime, options = {}) {
  const rpcUrl = readString(env.H72H_TON_RPC_URL);
  if (!rpcUrl) {
    return {
      status: "disabled",
      message: "TON RPC is not configured, so on-chain PresaleVault getters are not queried.",
    };
  }

  if (!runtime.presaleVaultAddress) {
    return {
      status: "unavailable",
      message: "PresaleVault address is not configured.",
      errors: ["presale_vault_address_missing"],
    };
  }

  const fetchImpl = options.fetchImpl || fetch;
  const buyerStack = options.buyerAddress ? stackAddress(options.buyerAddress) : undefined;
  const common = { env, address: runtime.presaleVaultAddress, fetchImpl };
  const getterCalls = {
    isActive: readGetterInt({ ...common, method: "isActive" }),
    currentStage: readGetterInt({ ...common, method: "getCurrentStage" }),
    stageCapRaw: readGetterInt({ ...common, method: "getStageCap72H" }),
    totalCapRaw: readGetterInt({ ...common, method: "getTotalCap72H" }),
    fundedRaw: readGetterInt({ ...common, method: "getFunded72H" }),
    soldRaw: readGetterInt({ ...common, method: "getSold72H" }),
    saleProceedsRaw: readGetterInt({ ...common, method: "getSaleProceedsTon" }),
    withdrawnRaw: readGetterInt({ ...common, method: "getWithdrawnTon" }),
  };

  for (const stage of PRESALE_STAGE_RULES) {
    getterCalls[`soldByStage${stage.contractStage}`] = readGetterInt({
      ...common,
      method: "getSoldByStage",
      stack: [stackNum(stage.contractStage)],
    });
  }

  if (options.buyerAddress && buyerStack) {
    getterCalls.purchasedByBuyer = readGetterInt({
      ...common,
      method: "getPurchasedByBuyer",
      stack: [buyerStack],
    });
  } else if (options.buyerAddress && !buyerStack) {
    getterCalls.purchasedByBuyer = Promise.resolve({ ok: false, error: "buyer_address_invalid" });
  }

  const entries = await Promise.all(
    Object.entries(getterCalls).map(async ([key, promise]) => [key, await promise]),
  );
  const results = Object.fromEntries(entries);
  const errors = Object.entries(results)
    .filter(([, result]) => !result.ok)
    .map(([key, result]) => `${key}:${result.error || "failed"}`);

  if (errors.length > 0) {
    return {
      status: "unavailable",
      message: "TON RPC is configured, but PresaleVault getter reads are unavailable.",
      errors,
    };
  }

  const contractStage = results.currentStage.value;
  const soldByStage = PRESALE_STAGE_RULES.map((stage) => {
    const raw = results[`soldByStage${stage.contractStage}`].value;
    return {
      publicStage: stage.publicStage,
      contractStage: stage.contractStage,
      soldRaw: raw,
      sold72H: formatCoins(raw),
      capRaw: results.stageCapRaw.value,
      cap72H: formatCoins(results.stageCapRaw.value),
    };
  });
  const buyerRemainingRaw = results.purchasedByBuyer?.value === undefined
    ? undefined
    : (7_200_000n * 1_000_000_000n - BigInt(results.purchasedByBuyer.value));
  const buyerRemainingClamped = buyerRemainingRaw === undefined || buyerRemainingRaw > 0n ? buyerRemainingRaw : 0n;

  return {
    status: "configured",
    message: "Live PresaleVault getters are available from TON RPC.",
    snapshot: {
      fetchedAt: new Date().toISOString(),
      active: BigInt(results.isActive.value) !== 0n,
      contractStage: Number(contractStage),
      publicStage: publicStageFromContractStage(contractStage),
      stageCapRaw: results.stageCapRaw.value,
      stageCap72H: formatCoins(results.stageCapRaw.value),
      totalCapRaw: results.totalCapRaw.value,
      totalCap72H: formatCoins(results.totalCapRaw.value),
      fundedRaw: results.fundedRaw.value,
      funded72H: formatCoins(results.fundedRaw.value),
      soldRaw: results.soldRaw.value,
      sold72H: formatCoins(results.soldRaw.value),
      saleProceedsTonRaw: results.saleProceedsRaw.value,
      saleProceedsTon: formatCoins(results.saleProceedsRaw.value),
      withdrawnTonRaw: results.withdrawnRaw.value,
      withdrawnTon: formatCoins(results.withdrawnRaw.value),
      soldByStage,
      buyerAddress: options.buyerAddress,
      buyerPurchasedRaw: results.purchasedByBuyer?.value,
      buyerPurchased72H: results.purchasedByBuyer?.value === undefined ? undefined : formatCoins(results.purchasedByBuyer.value),
      buyerRemainingRaw: buyerRemainingClamped?.toString(),
      buyerRemaining72H: buyerRemainingClamped === undefined ? undefined : formatCoins(buyerRemainingClamped),
    },
  };
}

export async function getPresaleRuntimeWithChain(env, options = {}) {
  const runtime = options.runtime || getPresaleRuntime(env);
  const chain = await fetchPresaleChainSnapshot(env, runtime, options);
  return {
    ...runtime,
    chainGetterStatus: chain.status,
    chainGetterMessage: chain.message,
    chainGetterErrors: chain.errors,
    chainSnapshot: chain.snapshot,
  };
}
