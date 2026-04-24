import {
  getCapitalAppPage,
  getCapitalOverview,
  getCapitalPortfolio,
  getCapitalVerification,
} from "../content/capital";
import { createCapitalApiClient, type CapitalApiClientOptions } from "./capital-http";
import { getCapitalRuntimeConfig, isCapitalApiMode, type CapitalRuntimeConfig } from "./capital-runtime";
import type {
  CapitalAppPageQuery,
  CapitalDataClient,
  CapitalOverviewQuery,
  CapitalPortfolioQuery,
  CapitalVerificationQuery,
} from "./capital-query";

const previewCapitalClient: CapitalDataClient = {
  mode: "preview",
  async getOverview(query) {
    return getCapitalOverview(query.locale);
  },
  async getAppPage(query) {
    return getCapitalAppPage(query.locale, query.slug);
  },
  async getPortfolio(query) {
    return getCapitalPortfolio(query.locale);
  },
  async getVerification(query) {
    return getCapitalVerification(query.locale, query.slug, query.type, query.seatNumber);
  },
};

let capitalClient: CapitalDataClient | undefined;

export function createCapitalPreviewClient(): CapitalDataClient {
  return previewCapitalClient;
}

export function createCapitalClient(
  config: CapitalRuntimeConfig = getCapitalRuntimeConfig(),
  options: CapitalApiClientOptions = {},
): CapitalDataClient {
  if (isCapitalApiMode(config)) {
    return createCapitalApiClient(config, options);
  }

  return previewCapitalClient;
}

export function getCapitalClient() {
  if (!capitalClient) {
    capitalClient = createCapitalClient();
  }

  return capitalClient;
}

export function resetCapitalClient() {
  capitalClient = undefined;
}

export function fetchCapitalOverview(query: CapitalOverviewQuery) {
  return getCapitalClient().getOverview(query);
}

export function fetchCapitalAppPage(query: CapitalAppPageQuery) {
  return getCapitalClient().getAppPage(query);
}

export function fetchCapitalPortfolio(query: CapitalPortfolioQuery) {
  return getCapitalClient().getPortfolio(query);
}

export function fetchCapitalVerification(query: CapitalVerificationQuery) {
  return getCapitalClient().getVerification(query);
}

export { getCapitalRuntimeConfig, isCapitalApiMode } from "./capital-runtime";
export {
  getCapitalAppPageApiPath,
  getCapitalAppPageQueryKey,
  getCapitalAlphaAllocateIntentApiPath,
  getCapitalIntentApiPath,
  getCapitalIntentSubmissionApiPath,
  getCapitalOverviewApiPath,
  getCapitalOverviewQueryKey,
  getCapitalPortfolioApiPath,
  getCapitalPortfolioQueryKey,
  getCapitalReserveAllocateIntentApiPath,
  getCapitalReserveRedeemIntentApiPath,
  getCapitalVerificationApiPath,
  getCapitalVerificationQueryKey,
  getCapitalYieldClaimIntentApiPath,
} from "./capital-query";
export type { CapitalApiClientOptions } from "./capital-http";
export type { CapitalRuntimeConfig, CapitalRuntimeMode } from "./capital-runtime";
export type {
  CapitalAppPageData,
  CapitalAppPageQuery,
  CapitalAppPageQueryKey,
  CapitalDataClient,
  CapitalOverviewData,
  CapitalOverviewQuery,
  CapitalOverviewQueryKey,
  CapitalPortfolioData,
  CapitalPortfolioQuery,
  CapitalPortfolioQueryKey,
  CapitalVerificationData,
  CapitalVerificationQuery,
  CapitalVerificationQueryKey,
} from "./capital-query";
