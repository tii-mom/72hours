import type { Locale } from "../lib/locale";
import { localizePath } from "../lib/routes";
import { getAboutContent } from "./about";
import { getGlossary } from "./glossary";
import { getHoursContent } from "./hours";
import { getJoinContent } from "./join";
import { getSiteConfig } from "./site-config";
import { getLegalDoc } from "../lib/content";

const LEGAL_SLUGS = ["privacy", "terms", "disclaimer"] as const;
const STATIC_BARE_PATHS = [
  "/",
  "/ecosystem",
  "/greenbook",
  "/join",
  "/learn",
  "/hours",
  "/about",
  "/faq",
  "/contact",
  ...LEGAL_SLUGS.map((slug) => `/legal/${slug}` as const),
] as const;

export type StaticBarePath = (typeof STATIC_BARE_PATHS)[number];

export interface ResolvedRouteMeta {
  locale: Locale;
  htmlLang: Locale;
  title: string;
  description: string;
  canonicalPath: string;
  canonicalUrl: string;
  alternateZhUrl: string;
  alternateEnUrl: string;
  xDefaultUrl: string;
  ogImageUrl: string;
  ogLocale: "zh_CN" | "en_US";
  siteName: string;
  robots: string;
}

function canonicalizeServedPath(pathname: string) {
  return pathname === "/" ? "/" : `${pathname.replace(/\/+$/, "")}/`;
}

function buildResolvedMeta(
  locale: Locale,
  barePath: string,
  title: string,
  description: string,
  options: { canonicalBarePath?: string; robots?: string } = {}
): ResolvedRouteMeta {
  const siteConfig = getSiteConfig(locale);
  const canonicalBarePath = options.canonicalBarePath ?? barePath;
  const canonicalPath = canonicalizeServedPath(localizePath(canonicalBarePath, locale));
  const alternateZhPath = canonicalizeServedPath(localizePath(canonicalBarePath, "zh-CN"));
  const alternateEnPath = canonicalizeServedPath(localizePath(canonicalBarePath, "en-US"));

  return {
    locale,
    htmlLang: locale,
    title,
    description,
    canonicalPath,
    canonicalUrl: new URL(canonicalPath, siteConfig.siteUrl).href,
    alternateZhUrl: new URL(alternateZhPath, siteConfig.siteUrl).href,
    alternateEnUrl: new URL(alternateEnPath, siteConfig.siteUrl).href,
    xDefaultUrl: new URL(alternateZhPath, siteConfig.siteUrl).href,
    ogImageUrl: new URL(locale === "en-US" ? "/og-cover-en.png" : "/og-cover-zh.png", siteConfig.siteUrl).href,
    ogLocale: locale === "en-US" ? "en_US" : "zh_CN",
    siteName: siteConfig.siteName,
    robots: options.robots ?? "index, follow",
  };
}

export function resolveRouteMeta(locale: Locale, barePath: string): ResolvedRouteMeta {
  const siteConfig = getSiteConfig(locale);
  const glossary = getGlossary(locale);
  const aboutContent = getAboutContent(locale);
  const hoursContent = getHoursContent(locale);
  const joinContent = getJoinContent(locale);

  if (barePath.startsWith("/legal/")) {
    const slug = barePath.split("/").pop();
    const doc = getLegalDoc(locale, slug);

    if (doc) {
      return buildResolvedMeta(locale, barePath, `${siteConfig.siteName} | ${doc.title}`, doc.summary);
    }
  }

  const metaByPath: Record<string, { title: string; description: string }> = {
    "/": {
      title: `${siteConfig.siteName} | ${glossary.pageLabels.home}`,
      description: siteConfig.hero.subtitle,
    },
    "/ecosystem": {
      title: `${siteConfig.siteName} | ${glossary.pageLabels.ecosystem}`,
      description:
        locale === "en-US"
          ? "Browse ecosystem apps by category, status, and next step."
          : "按分类、状态和下一步查看 72hours 生态应用。",
    },
    "/greenbook": {
      title: `${siteConfig.siteName} | ${glossary.pageLabels.greenBook}`,
      description:
        locale === "en-US"
          ? "Read Green Book to see how 72H connects use, participation, and learning."
          : "看绿皮书，了解 72H 如何串起使用、参与和学习。",
    },
    "/join": {
      title: `${siteConfig.siteName} | ${glossary.pageLabels.join}`,
      description: joinContent.subtitle,
    },
    "/learn": {
      title: `${siteConfig.siteName} | ${glossary.pageLabels.learn}`,
      description:
        locale === "en-US" ? "Read Green Book first, then decide how to learn and build." : "先看绿皮书，再决定如何学习和动手。",
    },
    "/hours": {
      title: `${siteConfig.siteName} | ${glossary.pageLabels.use72H}`,
      description: hoursContent.subtitle,
    },
    "/about": {
      title: `${siteConfig.siteName} | ${glossary.pageLabels.about}`,
      description: aboutContent.subtitle,
    },
    "/faq": {
      title: `${siteConfig.siteName} | ${glossary.pageLabels.faq}`,
      description:
        locale === "en-US"
          ? "Getting started, safety, learning, and 72H Use."
          : "关于 72hours 的入门、安全、学习和 72H 用途常见问题。",
    },
    "/contact": {
      title: `${siteConfig.siteName} | ${glossary.pageLabels.contact}`,
      description:
        locale === "en-US"
          ? "Official contact paths for Telegram, X, and WeChat notes."
          : "核对 Telegram、X 和微信说明页的官方联系路径。",
    },
  };

  const resolved = metaByPath[barePath];

  if (!resolved) {
    return buildResolvedMeta(
      locale,
      barePath,
      `${siteConfig.siteName} | 404`,
      locale === "en-US"
        ? "This page does not exist or has moved. Return home and choose a valid entry."
        : "页面不存在或已迁移。返回首页并重新选择入口。",
      {
        canonicalBarePath: "/",
        robots: "noindex, nofollow",
      }
    );
  }

  return buildResolvedMeta(locale, barePath, resolved.title, resolved.description);
}

export function getStaticPageEntries() {
  return (["zh-CN", "en-US"] as const).flatMap((locale) =>
    STATIC_BARE_PATHS.map((barePath) => ({
      locale,
      barePath,
      pathname: localizePath(barePath, locale),
      meta: resolveRouteMeta(locale, barePath),
    }))
  );
}

export function renderSitemapXml() {
  const siteConfig = getSiteConfig("zh-CN");
  const urls = STATIC_BARE_PATHS.map((barePath) => {
    const zhUrl = new URL(canonicalizeServedPath(localizePath(barePath, "zh-CN")), siteConfig.siteUrl).href;
    const enUrl = new URL(canonicalizeServedPath(localizePath(barePath, "en-US")), siteConfig.siteUrl).href;

    return [
      "  <url>",
      `    <loc>${zhUrl}</loc>`,
      `    <xhtml:link rel="alternate" hreflang="zh-CN" href="${zhUrl}" />`,
      `    <xhtml:link rel="alternate" hreflang="en-US" href="${enUrl}" />`,
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${zhUrl}" />`,
      "  </url>",
      "  <url>",
      `    <loc>${enUrl}</loc>`,
      `    <xhtml:link rel="alternate" hreflang="zh-CN" href="${zhUrl}" />`,
      `    <xhtml:link rel="alternate" hreflang="en-US" href="${enUrl}" />`,
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${zhUrl}" />`,
      "  </url>",
    ].join("\n");
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`;
}
