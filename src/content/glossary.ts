import type { Locale } from "../lib/locale";

const glossaryZh = {
  brandName: "72hours",
  pageLabels: {
    home: "首页",
    ecosystem: "生态应用",
    capital: "资本",
    greenBook: "绿皮书",
    join: "参与入口",
    learn: "学习路径",
    use72H: "72H 用途",
    about: "关于 72hours",
    faq: "常见问题",
    contact: "联系",
    legal: "法律说明",
  },
  legalLabels: {
    privacy: "隐私",
    terms: "条款",
    disclaimer: "声明",
  },
  quickIndex: {
    gettingStarted: "入门",
    safety: "安全",
    learning: "学习",
    use72H: "72H 用途",
  },
  useLine: "使用 / 参与 / 学习",
  coreDefinition: "72H 是进入 72hours 的统一入口。",
  greenBookShareTitle: "72H 绿皮书",
} as const;

const glossaryEn = {
  brandName: "72hours",
  pageLabels: {
    home: "Home",
    ecosystem: "Ecosystem",
    capital: "Capital",
    greenBook: "Green Book",
    join: "Join",
    learn: "Learn",
    use72H: "72H Use",
    about: "About 72hours",
    faq: "FAQ",
    contact: "Contact",
    legal: "Legal",
  },
  legalLabels: {
    privacy: "Privacy",
    terms: "Terms",
    disclaimer: "Disclaimer",
  },
  quickIndex: {
    gettingStarted: "Getting started",
    safety: "Safety",
    learning: "Learning",
    use72H: "72H Use",
  },
  useLine: "Use / participate / learn",
  coreDefinition: "72H is the unified entry point into 72hours.",
  greenBookShareTitle: "72H Green Book",
} as const;

export const glossary = glossaryZh;

export function getGlossary(locale: Locale) {
  return locale === "en-US" ? glossaryEn : glossaryZh;
}
