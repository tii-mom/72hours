import type { SiteConfig } from "../lib/content-types";

export const siteConfig: SiteConfig = {
  siteName: "72hours",
  siteUrl: "https://72hours.72h.lol",
  language: "zh-CN",
  primaryCtaLabel: "加入社区",
  secondaryCtaLabel: "浏览生态应用",
  primaryJoinRoute: "/join",
  navItems: [
    { label: "首页", href: "/" },
    { label: "生态应用", href: "/ecosystem" },
    { label: "参与入口", href: "/join" },
    { label: "学习路径", href: "/learn" },
    { label: "hours", href: "/hours" },
    { label: "关于 72hours", href: "/about" },
  ],
  footerGroups: [
    {
      title: "参与",
      links: [
        { label: "Telegram", href: "https://t.me/the_72h" },
        { label: "X", href: "https://x.com/taichi2077" },
        { label: "参与入口", href: "/join" },
        { label: "生态应用", href: "/ecosystem" },
        { label: "学习路径", href: "/learn" },
        { label: "hours", href: "/hours" },
      ],
    },
    {
      title: "理解",
      links: [
        { label: "关于 72hours", href: "/about" },
        { label: "FAQ", href: "/faq" },
        { label: "联系说明", href: "/contact" },
      ],
    },
    {
      title: "约束",
      links: [
        { label: "隐私政策", href: "/legal/privacy" },
        { label: "服务条款", href: "/legal/terms" },
        { label: "免责声明", href: "/legal/disclaimer" },
      ],
    },
  ],
  hero: {
    title: "先加入社区，再看生态与路径。",
    subtitle:
      "72hours 是由一群技术开发者共同创建的社区，面向没有技术背景的普通人。我们通过指导和教学，帮助用户学会 Vibe coding，并逐步进入加密项目开发与参与。",
    proofSignals: [
      "1. 真实存在的入口",
      "2. Vibe Coding 路径",
      "3. 场景驱动的 hours",
    ],
  },
  globalDisclaimerExcerpt:
    "本站内容用于说明社区、生态和参与路径，不构成投资建议或收益承诺。",
};

export const homeHighlights = [
  {
    title: "1. 真实存在的入口",
    body: "这里不是空壳。每个项目都对应一个明确的状态、参与方式和下一步动作，先看入口，再决定是否深入。",
    cta: "浏览生态应用",
    href: "/ecosystem",
    iconLabel: "Terminal",
  },
  {
    title: "2. Vibe Coding 路径",
    body: "学习是第二阶段。先通过社区看懂真实项目，再学会用自然语言和 AI 生成、修正、参与代码。",
    cta: "了解学习路径",
    href: "/learn",
    iconLabel: "V",
  },
  {
    title: "3. 场景驱动的 hours",
    body: "hours 不是价格页，也不是投机页。它只承接三件事：产品和服务、生态应用参与、Vibe coding 学习。",
    cta: "查看使用场景",
    href: "/hours",
    iconLabel: "H",
  },
] as const;
