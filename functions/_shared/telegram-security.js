const TELEGRAM_WEBHOOK_SECRET_HEADER = "x-telegram-bot-api-secret-token";
const LEGACY_BOT_SECRET_HEADER = "x-telegram-bot-secret";
const TELEGRAM_INIT_DATA_HEADER = "x-telegram-init-data";
const TELEGRAM_INIT_DATA_AUTH_PREFIX = "tma ";

function readSecret(value) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function timingSafeEqual(left, right) {
  const leftValue = String(left || "");
  const rightValue = String(right || "");
  const maxLength = Math.max(leftValue.length, rightValue.length);
  let diff = leftValue.length ^ rightValue.length;

  for (let index = 0; index < maxLength; index += 1) {
    diff |= (leftValue.charCodeAt(index) || 0) ^ (rightValue.charCodeAt(index) || 0);
  }

  return diff === 0;
}

function toHex(buffer) {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function parseJsonObject(value) {
  if (!value) return undefined;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

async function hmacSha256(key, data) {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    typeof key === "string" ? new TextEncoder().encode(key) : key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  return crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    typeof data === "string" ? new TextEncoder().encode(data) : data,
  );
}

export function getTelegramWebhookSecret(env) {
  return readSecret(env.H72H_TELEGRAM_WEBHOOK_SECRET) || readSecret(env.H72H_TELEGRAM_BOT_SECRET);
}

export function verifyTelegramWebhookSecret(request, env) {
  const expected = getTelegramWebhookSecret(env);
  const received =
    readSecret(request.headers.get(TELEGRAM_WEBHOOK_SECRET_HEADER)) ||
    readSecret(request.headers.get(LEGACY_BOT_SECRET_HEADER));

  if (!expected || !received) {
    return false;
  }

  return timingSafeEqual(received, expected);
}

export function readTelegramMiniAppInitData(request) {
  const auth = readSecret(request.headers.get("authorization"));
  if (auth.toLowerCase().startsWith(TELEGRAM_INIT_DATA_AUTH_PREFIX)) {
    return auth.slice(TELEGRAM_INIT_DATA_AUTH_PREFIX.length).trim();
  }

  return readSecret(request.headers.get(TELEGRAM_INIT_DATA_HEADER));
}

export async function verifyTelegramMiniAppInitData(initData, env, options = {}) {
  const botToken = readSecret(env.H72H_TELEGRAM_BOT_TOKEN);
  if (!botToken) {
    return { ok: false, error: "telegram_bot_token_not_configured" };
  }

  if (!initData) {
    return { ok: false, error: "telegram_init_data_missing" };
  }

  const params = new URLSearchParams(initData);
  const hash = params.get("hash") || "";
  if (!/^[0-9a-f]{64}$/i.test(hash)) {
    return { ok: false, error: "telegram_init_data_hash_missing" };
  }

  const authDate = Number(params.get("auth_date") || "0");
  const nowSeconds = Math.floor((options.nowMs ?? Date.now()) / 1000);
  const maxAgeSeconds = Number.isFinite(options.maxAgeSeconds) ? options.maxAgeSeconds : 86400;
  if (!Number.isFinite(authDate) || authDate <= 0) {
    return { ok: false, error: "telegram_init_data_auth_date_invalid" };
  }
  if (maxAgeSeconds > 0 && nowSeconds - authDate > maxAgeSeconds) {
    return { ok: false, error: "telegram_init_data_expired" };
  }

  const dataCheckString = [...params.entries()]
    .filter(([key]) => key !== "hash")
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secretKey = await hmacSha256("WebAppData", botToken);
  const expectedHash = toHex(await hmacSha256(secretKey, dataCheckString));
  if (!timingSafeEqual(expectedHash, hash.toLowerCase())) {
    return { ok: false, error: "telegram_init_data_hash_mismatch" };
  }

  const user = parseJsonObject(params.get("user"));
  if (!user?.id) {
    return { ok: false, error: "telegram_init_data_user_missing" };
  }

  return {
    ok: true,
    authDate,
    queryId: params.get("query_id") || undefined,
    startParam: params.get("start_param") || undefined,
    user: {
      id: user.id,
      username: typeof user.username === "string" ? user.username : undefined,
      first_name: typeof user.first_name === "string" ? user.first_name : undefined,
      last_name: typeof user.last_name === "string" ? user.last_name : undefined,
      language_code: typeof user.language_code === "string" ? user.language_code : undefined,
      is_premium: user.is_premium === true,
    },
  };
}

export async function requireTelegramMiniAppUser(request, env, options = {}) {
  const initData = readTelegramMiniAppInitData(request);
  return verifyTelegramMiniAppInitData(initData, env, options);
}
