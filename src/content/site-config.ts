import type { HomeHighlight, SiteConfig } from "../lib/content-types";
import type { Locale } from "../lib/locale";
import { getGlossary } from "./glossary";

function buildSiteConfig(locale: Locale): SiteConfig {
  const glossary = getGlossary(locale);
  const isEnglish = locale === "en-US";

  return {
    siteName: glossary.brandName,
    siteUrl: "https://72hours.72h.lol",
    language: locale,
    primaryCtaLabel: isEnglish ? "Join Community" : "加入社区",
    secondaryCtaLabel: isEnglish ? "Browse Ecosystem" : "浏览生态应用",
    primaryJoinRoute: "/join",
    navItems: [
      { label: glossary.pageLabels.home, href: "/" },
      { label: glossary.pageLabels.ecosystem, href: "/ecosystem" },
      { label: glossary.pageLabels.greenBook, href: "/greenbook" },
      { label: glossary.pageLabels.join, href: "/join" },
      { label: glossary.pageLabels.learn, href: "/learn" },
      { label: glossary.pageLabels.use72H, href: "/hours" },
      { label: glossary.pageLabels.about, href: "/about" },
    ],
    footerGroups: [
      {
        title: isEnglish ? "Enter" : "进入",
        links: [
          { label: "Telegram", href: "https://t.me/the_72h" },
          { label: "X", href: "https://x.com/taichi2077" },
          { label: glossary.pageLabels.ecosystem, href: "/ecosystem" },
          { label: glossary.pageLabels.join, href: "/join" },
        ],
      },
      {
        title: isEnglish ? "Read" : "理解",
        links: [
          { label: glossary.pageLabels.greenBook, href: "/greenbook" },
          { label: glossary.pageLabels.use72H, href: "/hours" },
          { label: isEnglish ? "About" : "关于", href: "/about" },
        ],
      },
      {
        title: isEnglish ? "Legal" : "规则",
        links: [
          { label: glossary.legalLabels.privacy, href: "/legal/privacy" },
          { label: glossary.legalLabels.terms, href: "/legal/terms" },
          { label: glossary.legalLabels.disclaimer, href: "/legal/disclaimer" },
        ],
      },
    ],
    hero: {
      title: isEnglish ? "Hold 72H. See the path." : "持有 72H，再看路径。",
      subtitle: isEnglish
        ? "72H connects use, participation, and learning."
        : "72hours 用 72H 串起使用、参与和学习。",
      proofSignals: isEnglish
        ? ["1. Hold 72H", "2. Three scenarios", "3. Fixed supply"]
        : ["1. 持有 72H", "2. 三个场景", "3. 固定供给"],
    },
    globalDisclaimerExcerpt: isEnglish
      ? "Use, participation, and paths only. Not investment advice."
      : "本站只说明用途、参与和路径，不构成投资建议。",
  };
}

export const siteConfig = buildSiteConfig("zh-CN");

export function getSiteConfig(locale: Locale) {
  return buildSiteConfig(locale);
}

const homeHighlightsZh: readonly HomeHighlight[] = [
  {
    title: "1. 真实入口",
    body: "状态、参与、下一步。",
    cta: "浏览生态应用",
    href: "/ecosystem",
    iconLabel: "Terminal",
  },
  {
    title: "2. 动手路径",
    body: "先看项目，再动手。",
    cta: "了解学习路径",
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
    title: "2. Hands-on path",
    body: "See the project first, then build.",
    cta: "Learn the path",
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
