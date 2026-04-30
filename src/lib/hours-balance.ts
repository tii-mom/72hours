export type HoursBalanceVerificationStatus =
  | "eligible"
  | "insufficient"
  | "manual_review";

export type HoursBalanceVerification = {
  balance?: number;
  message: string;
  source: "tonapi" | "manual_review";
  status: HoursBalanceVerificationStatus;
};

const DEFAULT_DECIMALS = 9;
const DEFAULT_TIMEOUT_MS = 6_000;
const DEFAULT_RETRIES = 2;

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function rawJettonBalanceToNumber(rawBalance: string, decimals: number) {
  const normalizedDecimals = Number.isFinite(decimals) ? decimals : DEFAULT_DECIMALS;
  const value = Number(rawBalance) / 10 ** normalizedDecimals;

  return Number.isFinite(value) ? value : 0;
}

async function fetchWithTimeout(url: string, timeoutMs: number) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      headers: { accept: "application/json" },
      signal: controller.signal,
    });
  } finally {
    window.clearTimeout(timeout);
  }
}

export async function verifyHoursBalance({
  address,
  isEnglish,
  threshold,
  tokenContract,
  retries = DEFAULT_RETRIES,
  timeoutMs = DEFAULT_TIMEOUT_MS,
}: {
  address: string;
  isEnglish: boolean;
  threshold: number;
  tokenContract: string;
  retries?: number;
  timeoutMs?: number;
}): Promise<HoursBalanceVerification> {
  const url = `https://tonapi.io/v2/accounts/${encodeURIComponent(address)}/jettons/${encodeURIComponent(tokenContract)}`;
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetchWithTimeout(url, timeoutMs);

      if (!response.ok) {
        throw new Error(`TonAPI ${response.status}`);
      }

      const payload = (await response.json()) as {
        balance?: string;
        jetton?: {
          decimals?: number | string;
        };
      };
      const balance = rawJettonBalanceToNumber(payload.balance ?? "0", Number(payload.jetton?.decimals ?? DEFAULT_DECIMALS));
      const eligible = balance >= threshold;

      return {
        balance,
        source: "tonapi",
        status: eligible ? "eligible" : "insufficient",
        message: eligible
          ? isEnglish
            ? "Balance verified on TON."
            : "已通过 TON 链上余额验资。"
          : isEnglish
            ? "Balance is below the required threshold."
            : "余额低于当前门槛。",
      };
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await delay(650 * (attempt + 1));
      }
    }
  }

  console.warn("72H balance verification fell back to manual review.", lastError);

  return {
    source: "manual_review",
    status: "manual_review",
    message: isEnglish
      ? "Automatic balance proof is unstable. Send the wallet address for manual review."
      : "自动验资暂不稳定，请发送钱包地址进入人工核对。",
  };
}
