import type { LearnPath } from "../lib/content-types";
import type { Locale } from "../lib/locale";
import { localized } from "../lib/locale";

const learnPathsZh: LearnPath[] = [
  {
    slug: "vibe-coding-entry",
    title: "先看绿书，\n再学开发。",
    audience: [
      "没技术背景，想先看懂",
      "已经在看，想动手",
    ],
    startingThreshold: "先看入口。",
    stages: [
      {
        name: "看项目",
        goal: "先懂入口和协作。",
        description: "看绿书、社区和生态。",
        exampleActivities: ["阅读绿书", "查看项目状态", "判断入口"],
        estimatedCommitment: "低强度",
      },
      {
        name: "学动手",
        goal: "把想法转成动作。",
        description: "改页面、补逻辑、调内容。",
        exampleActivities: ["补一段文案", "修一个布局", "调一个交互"],
        estimatedCommitment: "中等",
      },
      {
        name: "进开发",
        goal: "进入更深协作。",
        description: "看懂并能改后，再深入。",
        exampleActivities: ["协作开发", "参与 mini app", "推进任务"],
        estimatedCommitment: "持续参与",
      },
    ],
    outcome: [
      "看懂项目",
      "学会动手",
      "进入开发",
    ],
    entryMethod: "先看入口",
    proofOrExpectation: "先参与，再决定。",
    featured: true,
  },
];

const learnPathsEn: LearnPath[] = [
  {
    slug: "vibe-coding-entry",
    title: "Read Green Book first,\nthen build.",
    audience: ["New to tech, want context", "Already watching, want to build"],
    startingThreshold: "See the entry first.",
    stages: [
      {
        name: "See the project",
        goal: "Understand the entry and flow.",
        description: "Read Green Book, community, and ecosystem.",
        exampleActivities: ["Read Green Book", "Check project status", "Pick an entry"],
        estimatedCommitment: "Low effort",
      },
      {
        name: "Learn by doing",
        goal: "Turn ideas into actions.",
        description: "Edit pages, add logic, tune content.",
        exampleActivities: [
          "Add a line of copy",
          "Fix a layout",
          "Adjust an interaction",
        ],
        estimatedCommitment: "Medium",
      },
      {
        name: "Enter development",
        goal: "Move into deeper collaboration.",
        description: "Once you can read and edit it, go deeper.",
        exampleActivities: [
          "Collaborate on dev",
          "Join mini apps",
          "Move tasks forward",
        ],
        estimatedCommitment: "Ongoing",
      },
    ],
    outcome: ["Understand the project", "Learn to build", "Enter development"],
    entryMethod: "Start from the entry point",
    proofOrExpectation: "Participate first, then decide.",
    featured: true,
  },
];

export const learnPaths = learnPathsZh;

export function getLearnPaths(locale: Locale) {
  return localized(locale, learnPathsZh, learnPathsEn);
}
