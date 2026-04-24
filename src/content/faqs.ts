import type { FAQItem } from "../lib/content-types";
import type { Locale } from "../lib/locale";

const faqItemsZh: FAQItem[] = [
  {
    id: "start",
    category: "入门",
    question: "如何开始？",
    answer: "绿皮书负责说明，Telegram 负责社区入口。",
    relatedLinks: [{ label: "绿皮书", href: "/greenbook" }],
    priority: 1,
    isPinned: true,
  },
  {
    id: "official",
    category: "安全",
    question: "怎么确认官方入口？",
    answer: "本站、绿皮书和站内链接构成官方核对范围。",
    relatedLinks: [{ label: "官方联系", href: "/contact" }],
    priority: 2,
    isPinned: true,
  },
  {
    id: "learn",
    category: "学习",
    question: "学习和参与是什么关系？",
    answer: "学习和参与对应不同深度的了解。",
    relatedLinks: [{ label: "学习路径", href: "/learn" }],
    priority: 3,
    isPinned: true,
  },
  {
    id: "hours",
    category: "72H 用途",
    question: "72H 用途是什么？",
    answer: "72H 用途围绕使用、参与和学习。",
    relatedLinks: [{ label: "72H 用途", href: "/hours" }],
    priority: 4,
    isPinned: true,
  },
] as const;

const faqItemsEn: FAQItem[] = [
  {
    id: "start",
    category: "Getting started",
    question: "How do I begin?",
    answer: "Green Book explains the project, and Telegram is the community entry.",
    relatedLinks: [{ label: "Green Book", href: "/greenbook" }],
    priority: 1,
    isPinned: true,
  },
  {
    id: "official",
    category: "Safety",
    question: "How do I verify the official entry?",
    answer: "This site, Green Book, and on-site links form the official reference layer.",
    relatedLinks: [{ label: "Contact", href: "/contact" }],
    priority: 2,
    isPinned: true,
  },
  {
    id: "learn",
    category: "Learning",
    question: "How are learning and participation related?",
    answer: "Learning and participation reflect different levels of involvement.",
    relatedLinks: [{ label: "Learn", href: "/learn" }],
    priority: 3,
    isPinned: true,
  },
  {
    id: "hours",
    category: "72H Use",
    question: "What is 72H Use?",
    answer: "72H Use centers on use, participation, and learning.",
    relatedLinks: [{ label: "72H Use", href: "/hours" }],
    priority: 4,
    isPinned: true,
  },
] as const;

export const faqItems = faqItemsZh;

export function getFaqItems(locale: Locale) {
  return locale === "en-US" ? faqItemsEn : faqItemsZh;
}
