import { getPresaleRuntime } from "../../_shared/presale-runtime.js";
import { getPresaleRuntimeWithChain } from "../../_shared/presale-chain.js";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "cache-control": "no-store",
      "content-type": "application/json; charset=utf-8",
    },
  });
}

export async function onRequestGet({ request, env }) {
  const runtime = getPresaleRuntime(env);
  const url = new URL(request.url);
  const buyerAddress = url.searchParams.get("buyerAddress");
  const presale = await getPresaleRuntimeWithChain(env, { runtime, buyerAddress });
  return json({
    ok: true,
    presale,
  });
}
