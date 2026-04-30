import type { LearnPath } from "../lib/content-types";
import type { Locale } from "../lib/locale";
import { localized } from "../lib/locale";

const learnPathsZh: LearnPath[] = [
  {
    slug: "vibe-coding-entry",
    title: "学习 72H 类加密应用开发。",
    audience: [
      "普通用户想做出应用",
      "项目方想理解加密应用从 0 到 1",
    ],
    startingThreshold: "线上报名 / 线下报名 / 应用开发。",
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
        description: "适合面对面拆解产品规则、钱包连接、前端页面与发布流程。",
        exampleActivities: ["预约时间", "现场确认", "项目拆解"],
        estimatedCommitment: "现场",
      },
      {
        name: "学习方向",
        goal: "学习像 72H 这样的加密应用如何开发。",
        description: "从钱包连接、产品规则、前端实现到社区协作，帮助普通人理解并做出应用。",
        exampleActivities: ["钱包与 TON", "前端实现", "项目协作"],
        estimatedCommitment: "产品导向",
      },
    ],
    outcome: [
      "线上报名",
      "线下报名",
      "应用开发",
    ],
    entryMethod: "线上 / 线下报名",
    proofOrExpectation: "报名核对后进入学习安排。",
    featured: true,
  },
];

const learnPathsEn: LearnPath[] = [
  {
    slug: "vibe-coding-entry",
    title: "Learn to build 72H-style crypto applications.",
    audience: ["Users who want to become builders", "Project leads learning crypto app delivery"],
    startingThreshold: "Online application / offline application / app building.",
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
        description: "Best for unpacking product rules, wallet connection, frontend pages, and release steps face to face.",
        exampleActivities: ["Book time", "Confirm on site", "Project teardown"],
        estimatedCommitment: "On site",
      },
      {
        name: "Learning focus",
        goal: "Learn how 72H-style crypto applications are built.",
        description: "Wallet connection, product rules, frontend implementation, and community collaboration help users become builders or project leads.",
        exampleActivities: ["Wallets and TON", "Frontend delivery", "Project collaboration"],
        estimatedCommitment: "Build-oriented",
      },
    ],
    outcome: ["Online application", "Offline application", "App building"],
    entryMethod: "Online / offline application",
    proofOrExpectation: "Apply, review, then enter the learning room.",
    featured: true,
  },
];

export const learnPaths = learnPathsZh;

export function getLearnPaths(locale: Locale) {
  return localized(locale, learnPathsZh, learnPathsEn);
}
