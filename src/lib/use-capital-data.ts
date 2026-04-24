import { useEffect, useState } from "react";
import type { CapitalAppSlug, CapitalSeatType } from "../content/capital";
import {
  fetchCapitalAppPage,
  fetchCapitalOverview,
  fetchCapitalPortfolio,
  fetchCapitalVerification,
  type CapitalAppPageData,
  type CapitalOverviewData,
  type CapitalPortfolioData,
  type CapitalVerificationData,
} from "./capital-client";
import type { Locale } from "./locale";

export type CapitalResourceState<T> =
  | { status: "loading"; data?: T }
  | { status: "ready"; data: T }
  | { status: "missing" }
  | { status: "error"; error: Error; data?: T };

const capitalResourceCache = new Map<string, unknown>();

function readCachedResource<T>(cacheKey: string) {
  return capitalResourceCache.get(cacheKey) as T | undefined;
}

function writeCachedResource<T>(cacheKey: string, value: T) {
  capitalResourceCache.set(cacheKey, value);
}

function toCapitalError(error: unknown) {
  return error instanceof Error ? error : new Error("Capital data request failed.");
}

export function useCapitalOverview(locale: Locale) {
  const cacheKey = `capital:overview:${locale}`;
  const [state, setState] = useState<CapitalResourceState<CapitalOverviewData>>(() => {
    const cached = readCachedResource<CapitalOverviewData>(cacheKey);

    return cached ? { status: "ready", data: cached } : { status: "loading" };
  });

  useEffect(() => {
    let cancelled = false;
    const cached = readCachedResource<CapitalOverviewData>(cacheKey);

    setState(cached ? { status: "ready", data: cached } : { status: "loading" });

    fetchCapitalOverview({ locale })
      .then((data) => {
        if (cancelled) return;
        writeCachedResource(cacheKey, data);
        setState({ status: "ready", data });
      })
      .catch((error) => {
        if (cancelled) return;
        setState({ status: "error", error: toCapitalError(error), data: cached });
      });

    return () => {
      cancelled = true;
    };
  }, [cacheKey, locale]);

  return state;
}

export function useCapitalAppPage(locale: Locale, slug: CapitalAppSlug) {
  const cacheKey = `capital:app:${locale}:${slug}`;
  const [state, setState] = useState<CapitalResourceState<CapitalAppPageData>>(() => {
    const cached = readCachedResource<CapitalAppPageData>(cacheKey);

    return cached ? { status: "ready", data: cached } : { status: "loading" };
  });

  useEffect(() => {
    let cancelled = false;
    const cached = readCachedResource<CapitalAppPageData>(cacheKey);

    setState(cached ? { status: "ready", data: cached } : { status: "loading" });

    fetchCapitalAppPage({ locale, slug })
      .then((data) => {
        if (cancelled) return;
        if (!data) {
          setState({ status: "missing" });
          return;
        }

        writeCachedResource(cacheKey, data);
        setState({ status: "ready", data });
      })
      .catch((error) => {
        if (cancelled) return;
        setState({ status: "error", error: toCapitalError(error), data: cached });
      });

    return () => {
      cancelled = true;
    };
  }, [cacheKey, locale, slug]);

  return state;
}

export function useCapitalPortfolio(locale: Locale) {
  const cacheKey = `capital:portfolio:${locale}`;
  const [state, setState] = useState<CapitalResourceState<CapitalPortfolioData>>(() => {
    const cached = readCachedResource<CapitalPortfolioData>(cacheKey);

    return cached ? { status: "ready", data: cached } : { status: "loading" };
  });

  useEffect(() => {
    let cancelled = false;
    const cached = readCachedResource<CapitalPortfolioData>(cacheKey);

    setState(cached ? { status: "ready", data: cached } : { status: "loading" });

    fetchCapitalPortfolio({ locale })
      .then((data) => {
        if (cancelled) return;
        writeCachedResource(cacheKey, data);
        setState({ status: "ready", data });
      })
      .catch((error) => {
        if (cancelled) return;
        setState({ status: "error", error: toCapitalError(error), data: cached });
      });

    return () => {
      cancelled = true;
    };
  }, [cacheKey, locale]);

  return state;
}

export function useCapitalVerification(
  locale: Locale,
  slug: CapitalAppSlug,
  type: CapitalSeatType,
  seatNumber: number,
) {
  const cacheKey = `capital:verification:${locale}:${slug}:${type}:${seatNumber}`;
  const [state, setState] = useState<CapitalResourceState<CapitalVerificationData>>(() => {
    const cached = readCachedResource<CapitalVerificationData>(cacheKey);

    return cached ? { status: "ready", data: cached } : { status: "loading" };
  });

  useEffect(() => {
    let cancelled = false;
    const cached = readCachedResource<CapitalVerificationData>(cacheKey);

    setState(cached ? { status: "ready", data: cached } : { status: "loading" });

    fetchCapitalVerification({ locale, slug, type, seatNumber })
      .then((data) => {
        if (cancelled) return;
        if (!data) {
          setState({ status: "missing" });
          return;
        }

        writeCachedResource(cacheKey, data);
        setState({ status: "ready", data });
      })
      .catch((error) => {
        if (cancelled) return;
        setState({ status: "error", error: toCapitalError(error), data: cached });
      });

    return () => {
      cancelled = true;
    };
  }, [cacheKey, locale, seatNumber, slug, type]);

  return state;
}
