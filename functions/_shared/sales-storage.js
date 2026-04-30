function getSalesKv(env) {
  return env.H72H_BOT_SALES_KV || env.BOT_SALES_KV;
}

export function getSalesKvBinding(env) {
  return getSalesKv(env);
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

export async function getSalesRecord(env, key) {
  const kv = getSalesKv(env);
  if (!kv) {
    return {
      ok: false,
      error: "sales_storage_unavailable",
    };
  }

  const raw = await kv.get(key);
  if (!raw) {
    return { ok: true, key, record: undefined };
  }

  try {
    return { ok: true, key, record: JSON.parse(raw) };
  } catch {
    return { ok: false, key, error: "sales_storage_record_invalid" };
  }
}

export async function listSalesRecords(env, { prefix, limit = 100 } = {}) {
  const kv = getSalesKv(env);
  if (!kv) {
    return {
      ok: false,
      error: "sales_storage_unavailable",
    };
  }

  if (typeof kv.list !== "function") {
    return {
      ok: false,
      error: "sales_storage_list_unavailable",
    };
  }

  const listed = await kv.list({ prefix, limit });
  const records = [];
  for (const entry of listed.keys || []) {
    const key = typeof entry === "string" ? entry : entry.name;
    if (!key) continue;
    const read = await getSalesRecord(env, key);
    if (read.ok && read.record) {
      records.push({ key, metadata: entry.metadata, record: read.record });
    }
  }

  return {
    ok: true,
    prefix,
    limit,
    cursor: listed.cursor,
    listComplete: listed.list_complete,
    records,
  };
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
