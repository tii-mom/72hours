import type { Locale } from "./locale";

const ENGLISH_PREFIX = "/en";

function normalizePathname(pathname: string) {
  if (!pathname) {
    return "/";
  }

  const ensured = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const compact = ensured.replace(/\/{2,}/g, "/");

  if (compact !== "/" && compact.endsWith("/")) {
    return compact.replace(/\/+$/, "");
  }

  return compact;
}

export function normalizeLocale(value?: string | null): Locale | undefined {
  if (value === "zh-CN" || value === "en-US") {
    return value;
  }

  return undefined;
}

export function stripLocalePrefix(pathname: string) {
  const normalized = normalizePathname(pathname);

  if (normalized === ENGLISH_PREFIX) {
    return "/";
  }

  if (normalized.startsWith(`${ENGLISH_PREFIX}/`)) {
    return normalized.slice(ENGLISH_PREFIX.length) || "/";
  }

  return normalized;
}

export function getLocaleFromPath(pathname: string): Locale {
  const normalized = normalizePathname(pathname);
  return normalized === ENGLISH_PREFIX || normalized.startsWith(`${ENGLISH_PREFIX}/`) ? "en-US" : "zh-CN";
}

export function localizePath(pathname: string, locale: Locale) {
  const barePath = stripLocalePrefix(pathname);

  if (locale === "en-US") {
    return barePath === "/" ? ENGLISH_PREFIX : `${ENGLISH_PREFIX}${barePath}`;
  }

  return barePath;
}

export function stripLocaleSearch(search: string) {
  const params = new URLSearchParams(search);
  params.delete("lang");
  const serialized = params.toString();
  return serialized ? `?${serialized}` : "";
}

export function localizeHref(href: string, locale: Locale) {
  if (!href.startsWith("/")) {
    return href;
  }

  const [withoutHash, hash = ""] = href.split("#");
  const [pathname, rawSearch = ""] = withoutHash.split("?");
  const search = stripLocaleSearch(rawSearch ? `?${rawSearch}` : "");
  const localizedPath = localizePath(pathname || "/", locale);

  return `${localizedPath}${search}${hash ? `#${hash}` : ""}`;
}
