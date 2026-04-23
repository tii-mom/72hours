import type { Locale } from "../lib/locale";

const aboutContentZh = {
  title: "72hours 如何连接使用、参与和学习。",
  subtitle: "入口、方法、边界、关系。",
  whyTitle: "为什么有 72hours",
  whyBody: "把人接到真实使用和参与场景里。",
  principleQuote: "理解来自参与。",
  methodBody: "先看入口，再看动作，再看边界。",
  relationTitle: "四层关系",
  relationCards: [
    {
      title: "1. 社区",
      body: "先看 Telegram 和 X。",
    },
    {
      title: "2. 生态",
      body: "每个应用都有状态和下一步。",
    },
    {
      title: "3. 学习",
      body: "学习放在第二阶段。",
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
      title: "先看入口",
      body: "所有说明都回到真实场景与官方链接。",
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
      title: "先参与再深入",
      body: "先使用，再决定要不要更深入。",
    },
  ],
  rejectTitle: "我们不做",
  rejectBody: "不做课程售卖、抽象叙事和收益包装。",
} as const;

const aboutContentEn = {
  title: "How 72hours connects use, participation, and learning.",
  subtitle: "Entry points, methods, boundaries, and relationships.",
  whyTitle: "Why 72hours exists",
  whyBody: "It connects people to real use and participation.",
  principleQuote: "Understanding comes from participation.",
  methodBody: "See the entry point, the action, then the boundary.",
  relationTitle: "Four relationships",
  relationCards: [
    {
      title: "1. Community",
      body: "Start with Telegram and X.",
    },
    {
      title: "2. Ecosystem",
      body: "Each app has a status and a next step.",
    },
    {
      title: "3. Learning",
      body: "Learning comes in the second stage.",
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
      title: "Start with the entry point",
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
      title: "Participate before going deeper",
      body: "Use first, then decide whether to go deeper.",
    },
  ],
  rejectTitle: "What we do not do",
  rejectBody: "No course selling, abstract narratives, or dressed-up return promises.",
} as const;

export const aboutContent = aboutContentZh;

export function getAboutContent(locale: Locale) {
  return locale === "en-US" ? aboutContentEn : aboutContentZh;
}
