import { siteConfig } from "./site-config";
import type { Locale } from "../lib/locale";
import { localized } from "../lib/locale";

const greenbookContentZh = {
  hero: {
    eyebrow: "绿书 / 公开说明",
    title: "72H",
    lead: "把使用、参与、学习串成一条清晰路径。",
    ctaPrimary: { label: "加入社区", href: "/join" },
    ctaSecondary: { label: "看生态", href: "/ecosystem" },
  },
  quickFacts: [
    {
      label: "定位",
      value: "实用优先",
      body: "`72H` 是统一入口，不承担治理。",
    },
    {
      label: "总量",
      value: "100,000,000,000",
      body: "固定供应，不通过增发扩张。",
    },
    {
      label: "作用",
      value: "使用 / 参与 / 学习",
      body: "围绕真实场景和业务循环。",
    },
  ],
  holdings: [
    {
      title: "进入生态",
      body: "持有 `72H` 后，可进入 72hours 的产品、服务与活动。",
    },
    {
      title: "参与应用",
      body: "可参与成熟应用，也可进入更早期机会。",
    },
    {
      title: "学习开发",
      body: "把 `72H` 当作 AI 开发入口，进入应用开发。",
    },
    {
      title: "优先资格",
      body: "活动、贡献激励和优先参与资格会向持有者开放。",
    },
  ],
  useCases: [
    {
      title: "产品与服务",
      kicker: "支付",
      body: "在 72hours 生态内用 `72H` 支付，直接进入真实场景。",
      bullets: ["不是囤积逻辑", "是消费和使用入口"],
    },
    {
      title: "应用参与",
      kicker: "支持 / 认购",
      body: "项目按阶段推进，成熟项目和种子项目风险不同。",
      bullets: ["分阶段参与", "不提供收益保证"],
    },
    {
      title: "学习与开发",
      kicker: "开发路径",
      body: "`72H` 也是学习入口，连接 AI 工具、模板与应用开发。",
      bullets: ["进入 AI 开发路径", "从用户走向建设者"],
    },
  ],
  businessModel: {
    title: "商业模式",
    summary: "需求来自使用、参与和学习。",
    streams: [
      "产品和服务收入",
      "应用上架与孵化",
      "学习路径、训练营和开发支持",
      "生态合作与分发",
    ],
  },
  supply: {
    title: "供给模型",
    totalSupply: "100,000,000,000",
    total: "100,000,000,000 72H",
    note: "固定总量，不增发。",
    buckets: [
      {
        name: "Sale Pool",
        label: "Sale Pool",
        amount: "4,500,000,000 72H",
        value: "4,500,000,000 72H",
        share: 4.5,
        note: "公开销售池。",
      },
      {
        name: "House Vault",
        label: "House Vault",
        amount: "4,500,000,000 72H",
        value: "4,500,000,000 72H",
        share: 4.5,
        note: "生态金库。",
      },
      {
        name: "LP Reserve",
        label: "LP Reserve",
        amount: "500,000,000 72H",
        value: "500,000,000 72H",
        share: 0.5,
        note: "流动性储备。",
      },
      {
        name: "Core Growth Reserve",
        label: "Core Growth Reserve",
        amount: "500,000,000 72H",
        value: "500,000,000 72H",
        share: 0.5,
        note: "核心增长储备。",
      },
      {
        name: "Shadow Supply",
        label: "Shadow Supply",
        amount: "90,000,000,000 72H",
        value: "90,000,000,000 72H",
        share: 90,
        note: "影子供应。",
      },
    ],
    summary: "总量固定，释放规则后续公布。",
  },
  boundaries: [
    "`72H` 不承担治理权",
    "参与生态不等于收益承诺",
    "项目机制可能随阶段更新",
    "本文不构成投资建议",
  ],
  goal:
    "让持有 `72H` 成为进入产品、应用与学习的统一入口。",
  share: {
    title: "72H 绿书",
    subtitle: "72H 是进入 72hours 的统一入口。",
    bullets: [
      "持有 72H 是使用权与参与权，不是治理权",
      "三大场景：产品服务、应用参与、学习开发",
      "固定总供应 100,000,000,000 72H",
    ],
    footerNote: "公开说明，不构成投资建议。",
    canonicalUrl: `${siteConfig.siteUrl}/greenbook`,
    shareText: "72hours 绿书：72H 是进入 72hours 的统一接口。",
  },
} as const;

const greenbookContentEn = {
  hero: {
    eyebrow: "Green Book / Public notes",
    title: "72H\nGreen Book",
    lead: "Put use, participation, and learning on the same path.",
    ctaPrimary: { label: "Join community", href: "/join" },
    ctaSecondary: { label: "Browse ecosystem", href: "/ecosystem" },
  },
  quickFacts: [
    {
      label: "Positioning",
      value: "utility-first",
      body: "`72H` is the unified entry point, not a governance token.",
    },
    {
      label: "Total supply",
      value: "100,000,000,000",
      body: "Fixed supply with no inflationary expansion.",
    },
    {
      label: "Purpose",
      value: "Use / participate / learn",
      body: "Built around real scenarios and business loops.",
    },
  ],
  holdings: [
    {
      title: "Enter the ecosystem",
      body: "Holding `72H` gives access to 72hours products, services, and events.",
    },
    {
      title: "Participate in apps",
      body: "Join established apps or explore earlier-stage opportunities.",
    },
    {
      title: "Learn to build",
      body: "Use `72H` as a Vibe coding entry point for app development.",
    },
    {
      title: "Priority access",
      body: "Events, contribution rewards, and priority access are opened to holders.",
    },
  ],
  useCases: [
    {
      title: "Products and services",
      kicker: "Payments",
      body: "Use `72H` inside the ecosystem for real usage.",
      bullets: ["Not for hoarding", "A usage entry point"],
    },
    {
      title: "App participation",
      kicker: "Support / subscription",
      body: "Projects move by stage, and risk varies by stage.",
      bullets: ["Stage-based participation", "No return guarantee"],
    },
    {
      title: "Learning and development",
      kicker: "Builder Path",
      body: "`72H` also opens a learning path for AI tools and app development.",
      bullets: ["Enter the Vibe coding path", "Move from user to builder"],
    },
  ],
  businessModel: {
    title: "Business model",
    summary: "Demand comes from use, participation, and learning.",
    streams: [
      "Product and service revenue",
      "App listings and incubation",
      "Learning paths, bootcamps, and dev support",
      "Ecosystem partnerships and distribution",
    ],
  },
  supply: {
    title: "Supply model",
    totalSupply: "100,000,000,000",
    total: "100,000,000,000 72H",
    note: "Fixed supply, no inflation.",
    buckets: [
      {
        name: "Sale Pool",
        label: "Sale Pool",
        amount: "4,500,000,000 72H",
        value: "4,500,000,000 72H",
        share: 4.5,
        note: "Public sale pool.",
      },
      {
        name: "House Vault",
        label: "House Vault",
        amount: "4,500,000,000 72H",
        value: "4,500,000,000 72H",
        share: 4.5,
        note: "Ecosystem vault.",
      },
      {
        name: "LP Reserve",
        label: "LP Reserve",
        amount: "500,000,000 72H",
        value: "500,000,000 72H",
        share: 0.5,
        note: "Liquidity reserve.",
      },
      {
        name: "Core Growth Reserve",
        label: "Core Growth Reserve",
        amount: "500,000,000 72H",
        value: "500,000,000 72H",
        share: 0.5,
        note: "Core growth reserve.",
      },
      {
        name: "Shadow Supply",
        label: "Shadow Supply",
        amount: "90,000,000,000 72H",
        value: "90,000,000,000 72H",
        share: 90,
        note: "Shadow supply.",
      },
    ],
    summary: "The total is fixed; release rules are announced separately.",
  },
  boundaries: [
    "`72H` does not carry governance rights",
    "Participating in the ecosystem does not guarantee returns",
    "Project mechanics may change as the stage changes",
    "This document is not investment advice",
  ],
  goal:
    "Make holding `72H` the unified entry for products, apps, and learning.",
  share: {
    title: "72H Green Book",
    subtitle: "72H is the unified interface into 72hours.",
    bullets: [
      "Holding 72H grants usage and participation rights, not governance rights",
      "Three scenarios: products, apps, learning",
      "Fixed total supply of 100,000,000,000 72H",
    ],
    footerNote: "Public notes only; not investment advice.",
    canonicalUrl: `${siteConfig.siteUrl}/greenbook`,
    shareText: "72hours Green Book: 72H is the unified 72hours interface.",
  },
} as const;

export const greenbookContent = greenbookContentZh;

export function getGreenBookContent(locale: Locale) {
  return localized(
    locale,
    greenbookContentZh,
    greenbookContentEn as unknown as typeof greenbookContentZh,
  );
}
