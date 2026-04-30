import { getPresaleMode } from "./presale-mode.js";

export const DEFAULT_PRESALE_VAULT_ADDRESS = "EQCj56OaGFtIBgdtQjIacb7s1jlEy93vh-93PU07MDR1vpE9";
export const DEFAULT_72H_JETTON_MASTER = "EQBGIzEDvvKObStrcVb6i5Z1-8uYZYtUrYzF2rFZU7xUAXVg";

export const PRESALE_STAGE_RULES = [
  {
    publicStage: 0,
    contractStage: 1,
    tokensPerTon: "10,072",
    cap72H: "1,500,000,000",
  },
  {
    publicStage: 1,
    contractStage: 2,
    tokensPerTon: "7,200",
    cap72H: "1,500,000,000",
  },
  {
    publicStage: 2,
    contractStage: 3,
    tokensPerTon: "3,500",
    cap72H: "1,500,000,000",
  },
];

function readString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function readBoolean(value) {
  return typeof value === "string" && value.trim().toLowerCase() === "true";
}

function appendPath(baseUrl, pathname) {
  try {
    return new URL(pathname, baseUrl).toString();
  } catch {
    return undefined;
  }
}

function resolveMiniAppUrl(env) {
  const explicit = readString(env.H72H_BOT_MINIAPP_URL);
  if (explicit) return explicit;

  const publicBaseUrl = readString(env.H72H_BOT_PUBLIC_BASE_URL);
  if (!publicBaseUrl) return undefined;

  return appendPath(publicBaseUrl, "/bot/presale");
}

export function getPresaleRuntime(env) {
  const presaleMode = getPresaleMode(env);
  const enabled = readBoolean(env.H72H_PRESALE_ENABLED) && presaleMode.purchaseEnabled;
  const presaleVaultAddress = readString(env.H72H_PRESALE_VAULT_ADDRESS) || DEFAULT_PRESALE_VAULT_ADDRESS;
  const jettonMasterAddress = readString(env.H72H_72H_JETTON_MASTER) || DEFAULT_72H_JETTON_MASTER;
  const networkMode = readString(env.H72H_PRESALE_NETWORK_MODE) || "mainnet";
  const tonRpcUrl = readString(env.H72H_TON_RPC_URL);
  const tonApiKey = readString(env.H72H_TON_API_KEY);
  const miniAppUrl = resolveMiniAppUrl(env);
  const configured = Boolean(presaleVaultAddress && jettonMasterAddress);
  const storageConfigured = Boolean(env.H72H_BOT_SALES_KV || env.BOT_SALES_KV);

  return {
    configured,
    enabled,
    networkMode,
    presaleVaultAddress,
    jettonMasterAddress,
    miniAppUrl,
    publicBaseUrl: readString(env.H72H_BOT_PUBLIC_BASE_URL),
    tonRpcConfigured: Boolean(tonRpcUrl),
    tonApiKeyConfigured: Boolean(tonApiKey),
    storageConfigured,
    presaleMode,
    purchaseFlowStatus: presaleMode.purchaseEnabled ? "intent_only" : "bot_only_waitlist",
    configStatus: configured ? "configured" : "unavailable",
    tradingStatus: presaleMode.purchaseEnabled ? "configured" : "disabled",
    chainGetterStatus: tonRpcUrl ? "configured" : "disabled",
    chainVerifierStatus: tonRpcUrl ? "manual_review_only" : "disabled",
    chainGetterMessage: tonRpcUrl
      ? "TON RPC is configured. Presale status endpoint will attempt read-only PresaleVault getter reads."
      : "TON RPC is not configured, so on-chain PresaleVault getters are not queried.",
    walletCap72H: "7,200,000",
    totalCap72H: "4,500,000,000",
    stageRules: PRESALE_STAGE_RULES,
  };
}

export function formatPresaleStatus(runtime) {
  const live = runtime.chainSnapshot;
  const lines = [
    "72H 预售预约状态",
    "",
    `真实购买状态：${runtime.enabled ? "受控开关开启，仍需官方公告确认" : "暂未开放"}`,
    `链上状态：${live ? (live.active ? "合约 active" : "合约未开启") : "读取中"}`,
    live ? `当前阶段：Stage ${live.publicStage ?? "?"}` : undefined,
    live ? `合约已记录售出：${live.sold72H} 72H` : undefined,
    live ? `合约已记录收入：${live.saleProceedsTon} TON` : undefined,
    ...(live
      ? [
          "",
          `读取时间：${live.fetchedAt}`,
        ]
      : []),
    ...(runtime.chainGetterErrors?.length
      ? ["", `Getter 错误: ${runtime.chainGetterErrors.join("; ")}`]
      : []),
    "",
    "阶段价格",
    ...runtime.stageRules.map(
      (stage) =>
        `Stage ${stage.publicStage}: 1 TON = ${stage.tokensPerTon} 72H`,
    ),
    "",
    `单钱包上限：${runtime.walletCap72H} 72H`,
    "",
    "官方合约",
    `PresaleVault: ${runtime.presaleVaultAddress}`,
    `72H Jetton: ${runtime.jettonMasterAddress}`,
    "",
    runtime.enabled
      ? "当前仍以官方公告为准；不要私下付款、签名或手工转账。"
      : "当前真实购买关闭，预售界面只做状态展示和白名单预检查。",
  ].filter(Boolean);

  return lines.join("\n");
}
