function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "cache-control": "public, max-age=60, stale-while-revalidate=300",
      "content-type": "application/json; charset=utf-8",
    },
  });
}

export async function onRequestGet({ env }) {
  if (!env.APP_DISCOVERY_KV) {
    return json({ apps: [] });
  }

  const list = await env.APP_DISCOVERY_KV.list({ prefix: "app:" });
  const apps = [];

  for (const key of list.keys) {
    const value = await env.APP_DISCOVERY_KV.get(key.name, "json");
    if (value) apps.push(value);
  }

  apps.sort((left, right) => {
    const priority = Number(left.priority || 0) - Number(right.priority || 0);
    if (priority !== 0) return priority;
    return String(left.slug).localeCompare(String(right.slug));
  });

  return json({ apps });
}
