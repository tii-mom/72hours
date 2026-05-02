function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "cache-control": "no-store",
      "content-type": "application/json; charset=utf-8",
    },
  });
}

function sanitizeRecord(payload) {
  const createdAt = new Date().toISOString();
  const address = typeof payload.address === "string" ? payload.address : "";
  const status = ["eligible", "insufficient", "manual_review"].includes(payload.status)
    ? payload.status
    : "manual_review";

  return {
    id: crypto.randomUUID(),
    address,
    balance: Number.isFinite(payload.balance) ? payload.balance : undefined,
    createdAt,
    source: payload.source === "tonapi" ? "tonapi" : "manual_review",
    status,
    subject: typeof payload.subject === "string" ? payload.subject : "join",
    threshold: Number.isFinite(payload.threshold) ? payload.threshold : 0,
    tokenContract: typeof payload.tokenContract === "string" ? payload.tokenContract : "",
  };
}

export async function onRequestPost({ request, env }) {
  if (env.HOURS_VERIFICATION_PUBLIC_WRITE !== "true") {
    return json({ ok: false, error: "hours_verification_route_disabled" }, 503);
  }

  if (!env.HOURS_VERIFICATION_KV) {
    return json({ ok: false, error: "HOURS_VERIFICATION_KV binding is missing" }, 500);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  const record = sanitizeRecord(payload);
  if (!record.address || !record.tokenContract || !record.threshold) {
    return json({ ok: false, error: "invalid_record" }, 400);
  }

  await env.HOURS_VERIFICATION_KV.put(`verification:${record.createdAt}:${record.id}`, JSON.stringify(record), {
    metadata: {
      status: record.status,
      subject: record.subject,
      createdAt: record.createdAt,
    },
  });

  return json({ ok: true, record });
}
