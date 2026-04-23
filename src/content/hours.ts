import type { Locale } from "../lib/locale";

const hoursContentZh = {
  title: "先看 72H 用途，\n再看它的位置。",
  subtitle: "72H 只连接使用、参与和学习。",
  roleTitle: "72H 的位置",
  roleBody: "把产品、参与和学习串起来。",
  usageIntro: "三种用途",
  uses: [
    {
      category: "用于产品和服务",
      title: "产品服务",
      body: "进入产品或服务时，它就是统一入口。",
      accent: "产品服务",
    },
    {
      category: "用于生态应用参与",
      title: "生态参与",
      body: "用于参与，不是治理入口。",
      accent: "生态参与",
    },
    {
      category: "用于 AI 开发学习",
      title: "学习入口",
      body: "先看绿皮书，再接学习路径。",
      accent: "学习入口",
      featured: true,
    },
  ],
  closingBody: "先看用途，再回到入口。",
} as const;

const hoursContentEn = {
  title: "Start with 72H Use.\nThen see its role.",
  subtitle: "72H connects use, participation, and learning.",
  roleTitle: "The role of 72H",
  roleBody: "It connects product use, participation, and learning.",
  usageIntro: "Three uses",
  uses: [
    {
      category: "For products and services",
      title: "Product use",
      body: "It is the unified entry point for products and services.",
      accent: "Product use",
    },
    {
      category: "For ecosystem participation",
      title: "Ecosystem participation",
      body: "It is for participation, not a governance entry point.",
      accent: "Ecosystem",
    },
    {
      category: "For AI development learning",
      title: "Learning entry",
      body: "Read Green Book first, then move into the learning path.",
      accent: "Learning entry",
      featured: true,
    },
  ],
  closingBody: "See the use first, then return to the entry.",
} as const;

export const hoursContent = hoursContentZh;

export function getHoursContent(locale: Locale) {
  return locale === "en-US" ? hoursContentEn : hoursContentZh;
}
