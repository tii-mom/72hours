#!/usr/bin/env node

const API_BASE =
  process.env.CAPITAL_API_BASE_URL ||
  "https://72h-capital-api-staging.348421501.workers.dev";
const INDEXER_BASE =
  process.env.CAPITAL_INDEXER_BASE_URL ||
  "https://72h-capital-indexer-staging.348421501.workers.dev";
const ADMIN_URL =
  process.env.CAPITAL_ADMIN_URL ||
  "https://72h-capital-admin-staging.pages.dev";

const TEST_WALLET =
  process.env.CAPITAL_SMOKE_WALLET ||
  "0QCxJ05yeawVWlsN5SfJ-obajgh2lFffR-O7ebH_s_wqQU_g";

function fail(message, details) {
  console.error(`\n[capital-smoke] ${message}`);
  if (details) {
    console.error(JSON.stringify(details, null, 2));
  }
  process.exit(1);
}

function assert(condition, message, details) {
  if (!condition) {
    fail(message, details);
  }
}

async function fetchJson(url, init) {
  const response = await fetch(url, init);
  const text = await response.text();

  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    fail(`Expected JSON from ${url}`, { status: response.status, body: text.slice(0, 500) });
  }

  return { response, data };
}

async function checkApi() {
  const health = await fetchJson(`${API_BASE}/health`);
  assert(health.response.ok, "API health request failed", health.data);
  assert(health.data.ok === true, "API health is not OK", health.data);
  assert(health.data.configured === true, "API DATABASE_URL is not configured", health.data);
  assert(health.data.dbMode === "postgres", "API is not reading from Postgres", health.data);
  assert(health.data.adminAuthConfigured === true, "API admin auth is not configured", health.data);

  const apps = await fetchJson(`${API_BASE}/v1/capital/apps?locale=en-US`);
  assert(apps.response.ok, "Capital apps request failed", apps.data);
  assert(Array.isArray(apps.data.apps), "Capital apps payload is invalid", apps.data);
  assert(apps.data.apps.length === 3, "Capital apps count must be 3 for staging", apps.data);
  for (const slug of ["multi-millionaire", "72hours", "wan"]) {
    assert(apps.data.apps.some((app) => app.slug === slug), `Missing Capital app ${slug}`, apps.data);
  }

  const detail = await fetchJson(`${API_BASE}/v1/capital/apps/72hours?locale=en-US`);
  assert(detail.response.ok, "Capital app detail request failed", detail.data);
  const detailApp = detail.data.app ?? detail.data;
  assert(detailApp.slug === "72hours", "Capital app detail slug mismatch", detail.data);

  const identity = await fetchJson(`${API_BASE}/v1/capital/identities/72hours/reserve/38?locale=en-US`);
  assert(identity.response.ok, "Capital identity verification request failed", identity.data);
  const verificationSeat = identity.data.identity ?? identity.data.seat ?? identity.data;
  assert(
    verificationSeat.seatNumber === 38 ||
      verificationSeat.number === 38 ||
      verificationSeat.key === "72hours:reserve:38",
    "Capital identity verification payload is invalid",
    identity.data,
  );

  const intent = await fetchJson(`${API_BASE}/v1/capital/reserve/allocate-intent?locale=en-US`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      appSlug: "72hours",
      walletAddress: TEST_WALLET,
      amount72H: 720,
      riskAccepted: true,
    }),
  });
  assert(intent.response.ok, "Reserve allocation intent request failed", intent.data);
  assert(intent.data.intentId, "Reserve allocation intent id is missing", intent.data);
  assert(intent.data.uiState?.disabled === true, "Staging intent must remain wallet-disabled", intent.data);
  assert(
    intent.data.transactionRequest?.scaffold?.productionReady === false,
    "Staging intent must not be production-ready",
    intent.data,
  );
  assert(
    Array.isArray(intent.data.transactionRequest?.messages) &&
      intent.data.transactionRequest.messages.length === 0,
    "Staging intent must not expose wallet-send messages while signing is disabled",
    intent.data,
  );

  const lookup = await fetchJson(`${API_BASE}/v1/capital/intents/${intent.data.intentId}?locale=en-US`);
  assert(lookup.response.ok, "Intent lookup request failed", lookup.data);
  assert(lookup.data.intentId === intent.data.intentId, "Intent lookup id mismatch", lookup.data);

  return {
    health: {
      dbMode: health.data.dbMode,
      networkMode: health.data.networkMode,
      appCount: health.data.counts?.apps,
      intentCount: health.data.counts?.intents,
      adminAuthConfigured: health.data.adminAuthConfigured,
    },
    apps: apps.data.apps.map((app) => app.slug),
    disabledIntent: {
      intentId: intent.data.intentId,
      status: intent.data.status,
      messages: intent.data.transactionRequest.messages.length,
      productionReady: intent.data.transactionRequest.scaffold.productionReady,
    },
  };
}

async function checkIndexer() {
  const health = await fetchJson(`${INDEXER_BASE}/health`);
  assert(health.response.ok, "Indexer health request failed", health.data);
  assert(health.data.ok === true, "Indexer health is not OK", health.data);
  assert(health.data.settings?.tokenConfigured === true, "Indexer admin token is not configured", health.data);
  assert(health.data.settings?.enabled === false, "Indexer staging must remain disabled until polling is intentionally enabled", health.data);
  assert(health.data.settings?.effectiveDryRun === true, "Indexer staging must remain in dry-run mode", health.data);

  const status = await fetchJson(`${INDEXER_BASE}/v1/indexer/status`);
  assert(status.response.ok, "Indexer status request failed", status.data);
  assert(status.data.status === "disabled", "Indexer status must be disabled for staging safety", status.data);

  const pollOnce = await fetchJson(`${INDEXER_BASE}/v1/indexer/poll-once`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  assert(pollOnce.response.status === 403, "Indexer poll-once must be guarded while disabled", pollOnce.data);
  assert(pollOnce.data.status === "disabled", "Indexer poll-once guard status mismatch", pollOnce.data);

  return {
    enabled: health.data.settings.enabled,
    dryRun: health.data.settings.effectiveDryRun,
    watchedAddressCount: health.data.settings.watchedAddressCount,
    pollGuard: pollOnce.data.status,
  };
}

async function checkAdminPages() {
  const response = await fetch(ADMIN_URL, {
    headers: {
      Accept: "text/html",
    },
  });
  const html = await response.text();
  assert(response.ok, "Admin Pages request failed", { status: response.status });
  assert(html.includes('id="root"'), "Admin Pages HTML is missing the React root");
  assert(html.includes("/assets/"), "Admin Pages HTML is missing built assets");

  return {
    url: ADMIN_URL,
    status: response.status,
    assetLinked: html.includes("/assets/"),
  };
}

async function main() {
  const startedAt = new Date().toISOString();
  const [api, indexer, admin] = await Promise.all([
    checkApi(),
    checkIndexer(),
    checkAdminPages(),
  ]);

  console.log(
    JSON.stringify(
      {
        ok: true,
        checkedAt: new Date().toISOString(),
        durationMs: Date.now() - Date.parse(startedAt),
        api,
        indexer,
        admin,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  fail(error instanceof Error ? error.message : "Capital staging smoke failed", {
    error: String(error),
  });
});
