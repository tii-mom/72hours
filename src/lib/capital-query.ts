import type {
  CapitalAppPageView,
  CapitalOverviewView,
  CapitalPortfolioView,
  CapitalVerificationView,
} from "../content/capital";
import type { Locale } from "./locale";
import type { CapitalAppSlug, CapitalSeatType } from "./capital-contract-types";

export type CapitalRuntimeMode = "preview" | "api";

export type CapitalOverviewData = CapitalOverviewView;
export type CapitalAppPageData = CapitalAppPageView;
export type CapitalPortfolioData = CapitalPortfolioView;
export type CapitalVerificationData = CapitalVerificationView;

export interface CapitalOverviewQuery {
  locale: Locale;
}

export interface CapitalAppPageQuery {
  locale: Locale;
  slug: CapitalAppSlug;
}

export interface CapitalPortfolioQuery {
  locale: Locale;
  walletAddress: string;
}

export interface CapitalVerificationQuery {
  locale: Locale;
  slug: CapitalAppSlug;
  type: CapitalSeatType;
  seatNumber: number;
}

export type CapitalOverviewQueryKey = readonly ["capital", "overview", Locale];
export type CapitalAppPageQueryKey = readonly ["capital", "app", Locale, CapitalAppSlug];
export type CapitalPortfolioQueryKey = readonly ["capital", "portfolio", Locale, string];
export type CapitalVerificationQueryKey = readonly [
  "capital",
  "verification",
  Locale,
  CapitalAppSlug,
  CapitalSeatType,
  number,
];

export interface CapitalDataClient {
  readonly mode: CapitalRuntimeMode;
  getOverview(query: CapitalOverviewQuery): Promise<CapitalOverviewData>;
  getAppPage(query: CapitalAppPageQuery): Promise<CapitalAppPageData | undefined>;
  getPortfolio(query: CapitalPortfolioQuery): Promise<CapitalPortfolioData>;
  getVerification(query: CapitalVerificationQuery): Promise<CapitalVerificationData | undefined>;
}

function withLocale(pathname: string, locale: Locale) {
  const search = new URLSearchParams({ locale });
  return `${pathname}?${search.toString()}`;
}

export function getCapitalOverviewQueryKey(query: CapitalOverviewQuery): CapitalOverviewQueryKey {
  return ["capital", "overview", query.locale];
}

export function getCapitalAppPageQueryKey(query: CapitalAppPageQuery): CapitalAppPageQueryKey {
  return ["capital", "app", query.locale, query.slug];
}

export function getCapitalPortfolioQueryKey(query: CapitalPortfolioQuery): CapitalPortfolioQueryKey {
  return ["capital", "portfolio", query.locale, requireWalletAddress(query.walletAddress)];
}

export function getCapitalVerificationQueryKey(
  query: CapitalVerificationQuery,
): CapitalVerificationQueryKey {
  return ["capital", "verification", query.locale, query.slug, query.type, query.seatNumber];
}

export function getCapitalOverviewApiPath(query: CapitalOverviewQuery) {
  return withLocale("/apps", query.locale);
}

export function getCapitalAppPageApiPath(query: CapitalAppPageQuery) {
  return withLocale(`/apps/${encodeURIComponent(query.slug)}`, query.locale);
}

export function getCapitalPortfolioApiPath(query: CapitalPortfolioQuery) {
  const search = new URLSearchParams({
    locale: query.locale,
    wallet: requireWalletAddress(query.walletAddress),
  });
  return `/me?${search.toString()}`;
}

export function getCapitalVerificationApiPath(query: CapitalVerificationQuery) {
  return withLocale(
    `/identities/${encodeURIComponent(query.slug)}/${encodeURIComponent(query.type)}/${query.seatNumber}`,
    query.locale,
  );
}

export function getCapitalReserveAllocateIntentApiPath() {
  return "/reserve/allocate-intent";
}

export function getCapitalReserveRedeemIntentApiPath() {
  return "/reserve/redeem-intent";
}

export function getCapitalAlphaAllocateIntentApiPath() {
  return "/alpha/allocate-intent";
}

export function getCapitalRewardClaimIntentApiPath() {
  return "/reward/claim-intent";
}

export function getCapitalIntentApiPath(intentId: string) {
  return `/intents/${encodeURIComponent(intentId)}`;
}

export function getCapitalIntentSubmissionApiPath(intentId: string) {
  return `${getCapitalIntentApiPath(intentId)}/submission`;
}

function requireWalletAddress(walletAddress: string) {
  const trimmed = walletAddress.trim();
  if (!trimmed) {
    throw new Error("Capital portfolio route requires a walletAddress.");
  }
  return trimmed;
}
