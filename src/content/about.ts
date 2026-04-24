import type { Locale } from "../lib/locale";

const aboutContentZh = {
  title: "72hours 连接使用、参与和学习。",
  subtitle: "入口、方法、边界与关系。",
  whyTitle: "为什么有 72hours",
  whyBody: "把真实使用、公开参与和项目边界放在同一处。",
  principleQuote: "理解来自参与。",
  methodBody: "入口、动作和边界保持一致。",
  relationTitle: "四层关系",
  relationCards: [
    {
      title: "1. 社区",
      body: "Telegram、X 与联系页构成联系层。",
    },
    {
      title: "2. 生态",
      body: "每个应用都有状态、用途和进入方式。",
    },
    {
      title: "3. 学习",
      body: "学习帮助用户理解用途、边界和协作。",
    },
    {
      title: "4. 72H 用途",
      body: "连接使用、参与和学习。",
      featured: true,
    },
  ],
  principlesTitle: "我们坚持",
  principles: [
    {
      title: "入口清晰",
      body: "所有说明都对应真实场景与官方链接。",
    },
    {
      title: "普通人可读",
      body: "不默认术语，也不预设技术背景。",
    },
    {
      title: "边界清楚",
      body: "只说明用途，不写收益或承诺。",
    },
    {
      title: "参与优先",
      body: "真实使用比抽象判断更重要。",
    },
  ],
  rejectTitle: "我们不做",
  rejectBody: "不做课程售卖、抽象叙事和收益包装。",
} as const;

const aboutContentEn = {
  title: "How 72hours connects use, participation, and learning.",
  subtitle: "Entry points, methods, boundaries, and relationships.",
  whyTitle: "Why 72hours exists",
  whyBody: "It connects people to real use, participation, and context.",
  principleQuote: "Understanding comes from participation.",
  methodBody: "The entry, the action, and the boundary stay aligned.",
  relationTitle: "Four relationships",
  relationCards: [
    {
      title: "1. Community",
      body: "Telegram, X, and the contact page make up the contact layer.",
    },
    {
      title: "2. Ecosystem",
      body: "Each app has a status, a purpose, and an entry point.",
    },
    {
      title: "3. Learning",
      body: "Learning helps people understand utility, boundaries, and collaboration.",
    },
    {
      title: "4. 72H Use",
      body: "Connects use, participation, and learning.",
      featured: true,
    },
  ],
  principlesTitle: "What we stand for",
  principles: [
    {
      title: "Clear entry",
      body: "Each explanation points to a real scenario and an official link.",
    },
    {
      title: "Readable for newcomers",
      body: "No jargon, and no assumed technical background.",
    },
    {
      title: "Clear boundaries",
      body: "We explain usage only, not returns or promises.",
    },
    {
      title: "Participation focus",
      body: "Use and participation stay in the same view.",
    },
  ],
  rejectTitle: "What we do not do",
  rejectBody: "No course selling, abstract narratives, or dressed-up return promises.",
} as const;

export const aboutContent = aboutContentZh;

export function getAboutContent(locale: Locale) {
  return locale === "en-US" ? aboutContentEn : aboutContentZh;
}
