import assert from "node:assert/strict";
import test from "node:test";

import {
  getCapitalPortfolioApiPath as getSiteCapitalPortfolioApiPath,
  getCapitalPortfolioQueryKey as getSiteCapitalPortfolioQueryKey,
} from "../src/lib/capital-query.ts";
import {
  getCapitalPortfolioApiPath as getSharedCapitalPortfolioApiPath,
  getCapitalPortfolioQueryKey as getSharedCapitalPortfolioQueryKey,
} from "../../72h-capital-shared/src/routes.ts";

const walletAddress = "EQCapitalRouteWallet0000000000000000000000000000000000000";

test("website and shared portfolio route helpers require the same wallet-scoped contract", () => {
  const query = { locale: "en-US" as const, walletAddress };

  assert.equal(getSiteCapitalPortfolioApiPath(query), getSharedCapitalPortfolioApiPath(query));
  assert.equal(getSiteCapitalPortfolioApiPath(query), `/me?locale=en-US&wallet=${walletAddress}`);
  assert.deepEqual(getSiteCapitalPortfolioQueryKey(query), getSharedCapitalPortfolioQueryKey(query));
});

test("website portfolio route helper rejects blank wallet addresses", () => {
  assert.throws(
    () => getSiteCapitalPortfolioApiPath({ locale: "zh-CN", walletAddress: " " }),
    /requires a walletAddress/,
  );
});
