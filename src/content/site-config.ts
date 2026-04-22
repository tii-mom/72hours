import type { HomeHighlight, SiteConfig } from "../lib/content-types";
import type { Locale } from "../lib/locale";
import { localized } from "../lib/locale";

const siteConfigZh: SiteConfig = {
  siteName: "72hours",
  siteUrl: "https://72hours.72h.lol",
  language: "zh-CN",
  primaryCtaLabel: "加入社区",
  secondaryCtaLabel: "浏览生态应用",
  primaryJoinRoute: "/join",
  navItems: [
    { label: "首页", href: "/" },
    { label: "生态应用", href: "/ecosystem" },
    { label: "绿书", href: "/greenbook" },
    { label: "参与入口", href: "/join" },
    { label: "学习路径", href: "/learn" },
    { label: "72H 用途", href: "/hours" },
    { label: "关于 72hours", href: "/about" },
  ],
  footerGroups: [
    {
      title: "进入",
      links: [
        { label: "Telegram", href: "https://t.me/the_72h" },
        { label: "X", href: "https://x.com/taichi2077" },
        { label: "生态应用", href: "/ecosystem" },
        { label: "加入", href: "/join" },
      ],
    },
    {
      title: "理解",
      links: [
        { label: "绿书", href: "/greenbook" },
        { label: "72H", href: "/hours" },
        { label: "关于", href: "/about" },
      ],
    },
    {
      title: "规则",
      links: [
        { label: "隐私", href: "/legal/privacy" },
        { label: "条款", href: "/legal/terms" },
        { label: "声明", href: "/legal/disclaimer" },
      ],
    },
  ],
  hero: {
    title: "持有 72H，再看路径。",
    subtitle: "72hours 用 72H 串起使用、参与和学习。",
    proofSignals: ["1. 持有 72H", "2. 三个场景", "3. 固定供给"],
  },
  globalDisclaimerExcerpt:
    "本站只说明用途、参与和路径，不构成投资建议。",
};

const siteConfigEn: SiteConfig = {
  ...siteConfigZh,
  language: "en-US",
  primaryCtaLabel: "Join Community",
  secondaryCtaLabel: "Browse Ecosystem",
  navItems: [
    { label: "Home", href: "/" },
    { label: "Ecosystem", href: "/ecosystem" },
    { label: "Green Book", href: "/greenbook" },
    { label: "Join", href: "/join" },
    { label: "Learn", href: "/learn" },
    { label: "Hours", href: "/hours" },
    { label: "About 72hours", href: "/about" },
  ],
  footerGroups: [
    {
      title: "Enter",
      links: [
        { label: "Telegram", href: "https://t.me/the_72h" },
        { label: "X", href: "https://x.com/taichi2077" },
        { label: "Ecosystem", href: "/ecosystem" },
        { label: "Join", href: "/join" },
      ],
    },
    {
      title: "Read",
      links: [
        { label: "Green Book", href: "/greenbook" },
        { label: "72H", href: "/hours" },
        { label: "About", href: "/about" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy", href: "/legal/privacy" },
        { label: "Terms", href: "/legal/terms" },
        { label: "Disclaimer", href: "/legal/disclaimer" },
      ],
    },
  ],
  hero: {
    title: "Hold 72H. See the path.",
    subtitle: "72H connects use, participation, and learning.",
    proofSignals: ["1. Hold 72H", "2. Three scenarios", "3. Fixed supply"],
  },
  globalDisclaimerExcerpt:
    "Use, participation, and paths only. Not investment advice.",
};

export const siteConfig = siteConfigZh;

export function getSiteConfig(locale: Locale) {
  return localized(locale, siteConfigZh, siteConfigEn);
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
    title: "3. What 72H is for",
    body: "Use, participate, learn.",
    cta: "View use cases",
    href: "/hours",
    iconLabel: "H",
  },
] as const;

export function getHomeHighlights(locale: Locale) {
  return localized(locale, homeHighlightsZh, homeHighlightsEn);
}

export const homeHighlights: readonly HomeHighlight[] = homeHighlightsZh;
