import type { Locale } from "../lib/locale";
import { localizePath } from "../lib/routes";
import { getAboutContent } from "./about";
import { getGlossary } from "./glossary";
import { getHoursContent } from "./hours";
import { getJoinContent } from "./join";
import { getSiteConfig } from "./site-config";
import { getLegalDoc } from "../lib/content";

const LEGAL_SLUGS = ["privacy", "terms", "disclaimer"] as const;
const CAPITAL_APP_PATHS = ["/capital/multi-millionaire", "/capital/72hours", "/capital/wan"] as const;
const STATIC_BARE_PATHS = [
  "/",
  "/ecosystem",
  "/capital",
  "/capital/me",
  ...CAPITAL_APP_PATHS,
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
  const isEnglish = locale === "en-US";

  const capitalVerifyMatch = barePath.match(/^\/capital\/([^/]+)\/(reserve|alpha)\/(\d+)$/);

  if (capitalVerifyMatch) {
    const [, appSlug, seatType, seatNumber] = capitalVerifyMatch;
    const appLabel =
      appSlug === "multi-millionaire" ? "multi-millionaire" : appSlug === "wan" ? "WAN" : "72hours";
    const seatLabel = seatType === "reserve" ? "Reserve Seat" : "Alpha Seat";

    return buildResolvedMeta(
      locale,
      barePath,
      `${siteConfig.siteName} | ${appLabel} ${seatLabel} #${seatNumber}`,
      isEnglish
        ? "Verified capital identity page. Public seat details only. No amount or reward data is disclosed."
        : "资本身份验证页，仅公开席位信息，不展示金额或奖励数据。",
      {
        robots: "noindex, nofollow",
      }
    );
  }

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
        isEnglish
          ? "Browse ecosystem apps by category, status, and next step."
          : "按分类、状态和下一步查看 72hours 生态应用。",
    },
    "/capital": {
      title: `${siteConfig.siteName} | ${glossary.pageLabels.capital}`,
      description: isEnglish
        ? "Review limited capital seats, reserve and alpha allocations, and the first launch surfaces in 72H Capital."
        : "查看限量资本席位、Reserve 与 Alpha 配置规则，以及 72H Capital 首批开放应用。",
    },
    "/capital/me": {
      title: `${siteConfig.siteName} | My Capital Identity`,
      description: isEnglish
        ? "Inspect active, historical, and completed capital identities, reserve lots, alpha cycles, and credentials."
        : "查看 Capital 身份、Reserve 批次、Alpha 周期与 Credential 展示。",
    },
    "/capital/multi-millionaire": {
      title: `${siteConfig.siteName} | multi-millionaire Capital`,
      description: isEnglish
        ? "See the capital seat structure, alpha threshold, and verified identity surfaces for multi-millionaire."
        : "查看 multi-millionaire 的 Capital Seat 结构、Alpha 门槛与身份展示。",
    },
    "/capital/72hours": {
      title: `${siteConfig.siteName} | 72hours Capital`,
      description: isEnglish
        ? "See reserve and alpha seat rules, tiers, and verified identity surfaces for the 72hours core surface."
        : "查看 72hours 主场对应的 Reserve 与 Alpha 席位规则、评级与身份展示。",
    },
    "/capital/wan": {
      title: `${siteConfig.siteName} | WAN Capital`,
      description: isEnglish
        ? "Review WAN capital seats, reserve and alpha allocation terms, and verified identity pages."
        : "查看 WAN 的 Capital Seat、Reserve 与 Alpha 配置条款及验证页面。",
    },
    "/greenbook": {
      title: `${siteConfig.siteName} | ${glossary.pageLabels.greenBook}`,
      description:
        isEnglish
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
        isEnglish ? "Learning path for the 72hours project." : "72hours 项目的学习路径。",
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
        isEnglish
          ? "Common questions about entry, safety, learning, and 72H Use."
          : "关于入口、安全、学习和 72H 用途的常见问题。",
    },
    "/contact": {
      title: `${siteConfig.siteName} | ${glossary.pageLabels.contact}`,
      description:
        isEnglish
          ? "Official contact paths for Telegram, X, and WeChat notes."
          : "Telegram、X 和微信说明页对应的官方联系路径。",
    },
  };

  const resolved = metaByPath[barePath];

  if (!resolved) {
    return buildResolvedMeta(
      locale,
      barePath,
      `${siteConfig.siteName} | 404`,
      isEnglish
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
