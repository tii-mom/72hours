import type { HomeHighlight, SiteConfig } from "../lib/content-types";
import type { Locale } from "../lib/locale";
import { getGlossary } from "./glossary";

function buildSiteConfig(locale: Locale): SiteConfig {
  const glossary = getGlossary(locale);
  const isEnglish = locale === "en-US";

  return {
    siteName: glossary.brandName,
    siteUrl: "https://72h.lol",
    language: locale,
    primaryCtaLabel: isEnglish ? "Enter" : "进入",
    secondaryCtaLabel: isEnglish ? "Join Community" : "加入社区",
    primaryJoinRoute: "/join",
    navItems: [
      { label: isEnglish ? "Enter" : "进入", href: "/join" },
      { label: glossary.pageLabels.ecosystem, href: "/ecosystem" },
      { label: glossary.pageLabels.greenBook, href: "/greenbook" },
    ],
    footerGroups: [
      {
        id: "enter",
        title: isEnglish ? "Enter" : "进入",
        links: [
          { label: "Telegram", href: "https://t.me/the_72h" },
          { label: "X", href: "https://x.com/72hour_s" },
          { label: isEnglish ? "Enter" : "进入", href: "/join" },
          { label: glossary.pageLabels.ecosystem, href: "/ecosystem" },
          { label: glossary.pageLabels.greenBook, href: "/greenbook" },
          { label: glossary.pageLabels.contracts, href: "/contracts" },
        ],
      },
      {
        id: "read",
        title: isEnglish ? "Read" : "理解",
        links: [
          { label: glossary.pageLabels.greenBook, href: "/greenbook" },
          { label: glossary.pageLabels.use72H, href: "/hours" },
          { label: isEnglish ? "About" : "关于", href: "/about" },
        ],
      },
      {
        id: "legal",
        title: isEnglish ? "Legal" : "规则",
        links: [
          { label: glossary.legalLabels.privacy, href: "/legal/privacy" },
          { label: glossary.legalLabels.terms, href: "/legal/terms" },
          { label: glossary.legalLabels.disclaimer, href: "/legal/disclaimer" },
        ],
      },
    ],
    hero: {
      title: isEnglish ? "72H on TON." : "72H 在 TON 上。",
      subtitle: isEnglish
        ? "Open the official 72H ecosystem entries in 72 hours."
        : "72小时，进入官方 72H 生态入口。",
      proofSignals: isEnglish
        ? ["TON Chain", "Fixed Supply", "Rich Apps", "New Model"]
        : ["TON链", "固定发行", "丰富应用", "创新经济模型"],
    },
    globalDisclaimerExcerpt: isEnglish
      ? "Official entries, public notes, and boundaries belong on this site."
      : "官方入口、公开说明与边界信息都在本站。",
  };
}

export const siteConfig = buildSiteConfig("zh-CN");

export function getSiteConfig(locale: Locale) {
  return buildSiteConfig(locale);
}

const homeHighlightsZh: readonly HomeHighlight[] = [
  {
    title: "1. 真实入口",
    body: "状态、参与、入口。",
    cta: "浏览生态应用",
    href: "/ecosystem",
    iconLabel: "Terminal",
  },
  {
    title: "2. 学习报名",
    body: "线上报名、线下报名。",
    cta: "查看学习报名",
    href: "/learn",
    iconLabel: "V",
  },
  {
    title: "3. 72H 的用途",
    body: "使用、参与、学习。",
    cta: "查看使用场景",
    href: "/hours",
    iconLabel: "H",
  },
] as const;

const homeHighlightsEn: readonly HomeHighlight[] = [
  {
    title: "1. Real entry",
    body: "Status, participation, next step.",
    cta: "Browse ecosystem",
    href: "/ecosystem",
    iconLabel: "Terminal",
  },
  {
    title: "2. Learning application",
    body: "Online and offline applications.",
    cta: "View application",
    href: "/learn",
    iconLabel: "V",
  },
  {
    title: "3. 72H Use",
    body: "Use, participate, learn.",
    cta: "View use cases",
    href: "/hours",
    iconLabel: "H",
  },
] as const;

export function getHomeHighlights(locale: Locale) {
  return locale === "en-US" ? homeHighlightsEn : homeHighlightsZh;
}

export const homeHighlights: readonly HomeHighlight[] = homeHighlightsZh;
