import type { Locale } from "../lib/locale";

const hoursContentZh = {
  title: "72H 用途与位置。",
  subtitle: "72H 只连接使用、参与和学习。",
  roleTitle: "72H 的位置",
  roleBody: "把产品、参与和学习串在一起。",
  usageIntro: "三种用途",
  uses: [
    {
      category: "用于产品和服务",
      title: "产品服务",
      body: "它承接产品和服务的统一入口。",
      accent: "产品服务",
    },
    {
      category: "用于生态应用参与",
      title: "生态参与",
      body: "它承接生态参与，不承担治理入口。",
      accent: "生态参与",
    },
    {
      category: "用于学习和构建",
      title: "学习入口",
      body: "它承接学习和理解。",
      accent: "学习入口",
      featured: true,
    },
  ],
  closingBody: "用途、角色和边界保持统一。",
} as const;

const hoursContentEn = {
  title: "72H Use and its role.",
  subtitle: "72H connects use, participation, and learning.",
  roleTitle: "The role of 72H",
  roleBody: "It connects product use, participation, and learning.",
  usageIntro: "Three uses",
  uses: [
    {
      category: "For products and services",
      title: "Product use",
      body: "It serves as the unified entry for products and services.",
      accent: "Product use",
    },
    {
      category: "For ecosystem participation",
      title: "Ecosystem participation",
      body: "It supports participation, not governance.",
      accent: "Ecosystem",
    },
    {
      category: "For learning and building",
      title: "Learning entry",
      body: "It supports learning and understanding.",
      accent: "Learning entry",
      featured: true,
    },
  ],
  closingBody: "Use, role, and boundaries stay aligned.",
} as const;

export const hoursContent = hoursContentZh;

export function getHoursContent(locale: Locale) {
  return locale === "en-US" ? hoursContentEn : hoursContentZh;
}
