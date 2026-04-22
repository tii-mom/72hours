import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type Locale = "zh-CN" | "en-US";

const STORAGE_KEY = "72hours.locale";
const DEFAULT_LOCALE: Locale = "zh-CN";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
  toggleLocale: () => void;
  isEnglish: boolean;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readStoredLocale(): Locale {
  if (typeof window === "undefined") {
    return DEFAULT_LOCALE;
  }

  const queryLocale = new URL(window.location.href).searchParams.get("lang");
  if (queryLocale === "en-US" || queryLocale === "zh-CN") {
    return queryLocale;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "en-US" ? "en-US" : DEFAULT_LOCALE;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readStoredLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem(STORAGE_KEY, locale);

    const url = new URL(window.location.href);
    url.searchParams.set("lang", locale);
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale: setLocaleState,
      toggleLocale: () => setLocaleState((current) => (current === "zh-CN" ? "en-US" : "zh-CN")),
      isEnglish: locale === "en-US",
    }),
    [locale]
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
