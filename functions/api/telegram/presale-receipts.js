function json(data, status = 503) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "cache-control": "no-store",
      "content-type": "application/json; charset=utf-8",
    },
  });
}

export async function onRequest() {
  return json({
    ok: false,
    error: "presale_route_disabled",
  });
}
