function getSalesKv(env) {
  return env.H72H_BOT_SALES_KV || env.BOT_SALES_KV;
}

function nowIso() {
  return new Date().toISOString();
}

function cleanMetadata(metadata = {}) {
  return Object.fromEntries(
    Object.entries(metadata)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => [key, String(value).slice(0, 512)]),
  );
}

export function getSalesStorageStatus(env) {
  return {
    configured: Boolean(getSalesKv(env)),
    binding: "H72H_BOT_SALES_KV",
  };
}

export function createRecordId(prefix = "rec") {
  return `${prefix}_${crypto.randomUUID()}`;
}

export async function putSalesRecord(env, key, record, metadata = {}) {
  const kv = getSalesKv(env);
  if (!kv) {
    return {
      ok: false,
      error: "sales_storage_unavailable",
      record,
    };
  }

  await kv.put(key, JSON.stringify(record), {
    metadata: cleanMetadata(metadata),
  });

  return { ok: true, key, record };
}

export async function recordSalesEvent(env, event) {
  const createdAt = event.createdAt || nowIso();
  const id = event.id || createRecordId("evt");
  const record = {
    id,
    version: 1,
    createdAt,
    ...event,
  };
  const key = `event:${createdAt}:${id}`;

  console.log(JSON.stringify({
    event: "telegram_sales_signal",
    storage: getSalesStorageStatus(env).configured ? "kv" : "log_only",
    ...record,
  }));

  const write = await putSalesRecord(env, key, record, {
    type: record.signalType || record.type || "unknown",
    telegramUserId: record.telegramUserId,
    username: record.username,
    createdAt,
  });

  return {
    ...write,
    id,
    key,
    record,
  };
}
