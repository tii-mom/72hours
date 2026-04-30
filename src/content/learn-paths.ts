import type { LearnPath } from "../lib/content-types";
import type { Locale } from "../lib/locale";
import { localized } from "../lib/locale";

const learnPathsZh: LearnPath[] = [
  {
    slug: "vibe-coding-entry",
    title: "理解 72H 用途、产品语境与社区协作。",
    audience: [
      "普通用户想做出应用",
      "项目方想理解加密应用从 0 到 1",
    ],
    startingThreshold: "线上了解 / 线下交流 / 生态理解。",
    stages: [
      {
        name: "线上报名",
        goal: "通过钱包核对后，在 Telegram 提交学习意向。",
        description: "适合远程确认基础背景、学习方向与可参与时间。",
        exampleActivities: ["连接钱包", "提交报名信息", "参与核对"],
        estimatedCommitment: "远程",
      },
      {
        name: "线下报名",
        goal: "通过联系入口预约线下学习名额。",
        description: "适合面对面理解产品规则、使用边界、社区协作与发布节奏。",
        exampleActivities: ["预约时间", "现场确认", "项目拆解"],
        estimatedCommitment: "现场",
      },
      {
        name: "学习方向",
        goal: "理解像 72H 这样的加密应用如何组织入口、规则与协作。",
        description: "从产品规则、使用边界到社区协作，帮助普通人理解 72H 生态如何运转。",
        exampleActivities: ["钱包与 TON", "前端实现", "项目协作"],
        estimatedCommitment: "产品导向",
      },
    ],
    outcome: [
      "线上报名",
      "线下报名",
      "生态理解",
    ],
    entryMethod: "线上 / 线下报名",
    proofOrExpectation: "报名核对后进入学习安排。",
    featured: true,
  },
];

const learnPathsEn: LearnPath[] = [
  {
    slug: "vibe-coding-entry",
    title: "Understand 72H use, product context, and community collaboration.",
    audience: ["Users who want deeper context", "Project leads studying ecosystem entry design"],
    startingThreshold: "Online note / offline discussion / ecosystem context.",
    stages: [
      {
        name: "Online application",
        goal: "Submit a learning application through Telegram after wallet check.",
        description: "Best for remote confirmation of background, learning direction, and available time.",
        exampleActivities: ["Connect wallet", "Send request", "Eligibility check"],
        estimatedCommitment: "Remote",
      },
      {
        name: "Offline application",
        goal: "Book an offline learning slot through contact.",
        description: "Best for unpacking product rules, usage boundaries, community collaboration, and release rhythm face to face.",
        exampleActivities: ["Book time", "Confirm on site", "Project teardown"],
        estimatedCommitment: "On site",
      },
      {
        name: "Learning focus",
        goal: "Understand how 72H-style crypto applications organize entry, rules, and collaboration.",
        description: "Product rules, usage boundaries, and community collaboration help users understand how the 72H ecosystem works.",
        exampleActivities: ["Wallets and TON", "Product context", "Project collaboration"],
        estimatedCommitment: "Context-oriented",
      },
    ],
    outcome: ["Online application", "Offline application", "Ecosystem context"],
    entryMethod: "Online / offline application",
    proofOrExpectation: "Apply, review, then enter the learning room.",
    featured: true,
  },
];

export const learnPaths = learnPathsZh;

export function getLearnPaths(locale: Locale) {
  return localized(locale, learnPathsZh, learnPathsEn);
}
