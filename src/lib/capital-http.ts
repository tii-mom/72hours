import type { CapitalRuntimeConfig } from "./capital-runtime";
import {
  getCapitalAppPageApiPath,
  getCapitalOverviewApiPath,
  getCapitalPortfolioApiPath,
  getCapitalVerificationApiPath,
  type CapitalAppPageData,
  type CapitalDataClient,
  type CapitalOverviewData,
  type CapitalPortfolioData,
  type CapitalVerificationData,
} from "./capital-query";

export interface CapitalApiClientOptions {
  fetcher?: typeof fetch;
  headers?: HeadersInit;
}

function buildCapitalApiUrl(baseUrl: string, path: string) {
  const normalizedBase = baseUrl === "/" ? "" : baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return normalizedBase ? `${normalizedBase}${normalizedPath}` : normalizedPath;
}

function createCapitalHeaders(headers?: HeadersInit) {
  const requestHeaders = new Headers(headers);

  if (!requestHeaders.has("Accept")) {
    requestHeaders.set("Accept", "application/json");
  }

  return requestHeaders;
}

async function readCapitalJson<T>(response: Response, url: string): Promise<T> {
  if (!response.ok) {
    throw new Error(`Capital API request failed (${response.status}) for ${url}.`);
  }

  return response.json() as Promise<T>;
}

async function readOptionalCapitalJson<T>(response: Response, url: string): Promise<T | undefined> {
  if (response.status === 404) {
    return undefined;
  }

  return readCapitalJson<T>(response, url);
}

export function createCapitalApiClient(
  config: Pick<CapitalRuntimeConfig, "apiBaseUrl">,
  options: CapitalApiClientOptions = {},
): CapitalDataClient {
  const fetcher = options.fetcher ?? globalThis.fetch;

  if (typeof fetcher !== "function") {
    throw new Error("Capital API mode requires a fetch implementation.");
  }

  const requestInit: RequestInit = {
    headers: createCapitalHeaders(options.headers),
  };

  return {
    mode: "api",
    async getOverview(query) {
      const url = buildCapitalApiUrl(config.apiBaseUrl, getCapitalOverviewApiPath(query));
      const response = await fetcher(url, requestInit);

      return readCapitalJson<CapitalOverviewData>(response, url);
    },
    async getAppPage(query) {
      const url = buildCapitalApiUrl(config.apiBaseUrl, getCapitalAppPageApiPath(query));
      const response = await fetcher(url, requestInit);

      return readOptionalCapitalJson<CapitalAppPageData>(response, url);
    },
    async getPortfolio(query) {
      const url = buildCapitalApiUrl(config.apiBaseUrl, getCapitalPortfolioApiPath(query));
      const response = await fetcher(url, requestInit);

      return readCapitalJson<CapitalPortfolioData>(response, url);
    },
    async getVerification(query) {
      const url = buildCapitalApiUrl(config.apiBaseUrl, getCapitalVerificationApiPath(query));
      const response = await fetcher(url, requestInit);

      return readOptionalCapitalJson<CapitalVerificationData>(response, url);
    },
  };
}
