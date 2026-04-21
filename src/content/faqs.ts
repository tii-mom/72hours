import type { FAQItem } from "../lib/content-types";

export const faqItems: FAQItem[] = [
  {
    id: "start",
    category: "入门",
    question: "如何开始？",
    answer:
      "先进入 Telegram 或先关注 X。你不需要一次性完成所有动作，先看见真实入口就够了。",
    relatedLinks: [{ label: "加入社区", href: "/join" }],
    priority: 1,
    isPinned: true,
  },
  {
    id: "official",
    category: "安全",
    question: "怎么确认官方入口？",
    answer:
      "只认本页和站内指向的官方入口。Telegram 是主入口，X 是轻关注入口，微信是补充说明。",
    relatedLinks: [{ label: "官方联系", href: "/contact" }],
    priority: 2,
    isPinned: true,
  },
  {
    id: "learn",
    category: "学习",
    question: "学习和参与是什么关系？",
    answer:
      "学习是第二阶段。先参与生态和社区，再决定要不要走到更深的学习路径。",
    relatedLinks: [{ label: "学习路径", href: "/learn" }],
    priority: 3,
    isPinned: true,
  },
  {
    id: "hours",
    category: "hours",
    question: "hours 是什么？",
    answer:
      "hours 只承接产品和服务、生态应用参与、Vibe coding 学习，不做收益叙事，也不是价格页。",
    relatedLinks: [{ label: "hours", href: "/hours" }],
    priority: 4,
    isPinned: true,
  },
];
