import { createContext, useContext, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getLocaleFromPath,
  localizePath as toLocalizedPath,
  normalizeLocale,
  stripLocalePrefix,
  stripLocaleSearch,
} from "./routes";

export type Locale = "zh-CN" | "en-US";

const STORAGE_KEY = "72hours.locale";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
  toggleLocale: () => void;
  isEnglish: boolean;
  localizePath: (pathname: string) => string;
  barePath: string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const queryLocale = normalizeLocale(new URLSearchParams(location.search).get("lang"));
  const barePath = stripLocalePrefix(location.pathname);
  const locale = queryLocale ?? getLocaleFromPath(location.pathname);

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  useEffect(() => {
    const cleanedSearch = stripLocaleSearch(location.search);
    const canonicalPath = toLocalizedPath(barePath, locale);
    const targetUrl = `${canonicalPath}${cleanedSearch}${location.hash}`;
    const currentUrl = `${location.pathname}${location.search}${location.hash}`;

    if (targetUrl !== currentUrl) {
      navigate(targetUrl, { replace: true });
    }
  }, [barePath, locale, location.hash, location.pathname, location.search, navigate]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale: (next) => {
        const nextPath = toLocalizedPath(barePath, next);
        const cleanedSearch = stripLocaleSearch(location.search);
        navigate(`${nextPath}${cleanedSearch}${location.hash}`);
      },
      toggleLocale: () => {
        const nextLocale = locale === "zh-CN" ? "en-US" : "zh-CN";
        const nextPath = toLocalizedPath(barePath, nextLocale);
        const cleanedSearch = stripLocaleSearch(location.search);
        navigate(`${nextPath}${cleanedSearch}${location.hash}`);
      },
      isEnglish: locale === "en-US",
      localizePath: (pathname) => toLocalizedPath(pathname, locale),
      barePath,
    }),
    [barePath, locale, location.hash, location.search, navigate]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const value = useContext(LocaleContext);

  if (!value) {
    throw new Error("useLocale must be used within LocaleProvider");
  }

  return value;
}

export function localized<T>(locale: Locale, zh: T, en: T) {
  return locale === "en-US" ? en : zh;
}
