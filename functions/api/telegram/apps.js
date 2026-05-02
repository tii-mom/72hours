import { assertImageReachable, sanitizeAppPayload, validateAppPayload } from "../../_shared/app-validation.js";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "cache-control": "no-store",
      "content-type": "application/json; charset=utf-8",
    },
  });
}

function assertSecret(request, env) {
  const expected = env.H72H_TELEGRAM_BOT_SECRET;
  const received = request.headers.get("x-telegram-bot-secret");

  return Boolean(expected && received && expected === received);
}

export async function onRequestPost({ request, env }) {
  if (!assertSecret(request, env)) {
    return json({ ok: false, error: "unauthorized" }, 401);
  }

  if (!env.APP_DISCOVERY_KV) {
    return json({ ok: false, error: "APP_DISCOVERY_KV binding is missing" }, 500);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  const validation = validateAppPayload(payload);
  if (validation.errors.length) {
    return json({ ok: false, error: "validation_failed", details: validation.errors }, 400);
  }

  const imageError = await assertImageReachable(request, payload.heroImageSrc);
  if (imageError) {
    return json({ ok: false, error: "image_validation_failed", details: [imageError] }, 400);
  }

  const app = sanitizeAppPayload(payload);
  await env.APP_DISCOVERY_KV.put(`app:${app.slug}`, JSON.stringify(app), {
    metadata: {
      slug: app.slug,
      updatedAt: app.updatedAt,
      updatedBy: app.updatedBy,
    },
  });

  return json({ ok: true, app });
}
