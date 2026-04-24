import type { LearnPath } from "../lib/content-types";
import type { Locale } from "../lib/locale";
import { localized } from "../lib/locale";

const learnPathsZh: LearnPath[] = [
  {
    slug: "vibe-coding-entry",
    title: "理解项目与动手协作。",
    audience: [
      "没技术背景，想理解项目",
      "已经了解内容，想实际参与",
    ],
    startingThreshold: "适合已了解基本说明的人。",
    stages: [
      {
        name: "看项目",
        goal: "理解入口和协作方式。",
        description: "绿皮书、社区与生态应用提供基础语境。",
        exampleActivities: ["阅读绿皮书", "查看项目状态", "判断入口"],
        estimatedCommitment: "低强度",
      },
      {
        name: "学动手",
        goal: "把想法转成可执行内容。",
        description: "补内容、调布局、打磨交互。",
        exampleActivities: ["补一段文案", "修一个布局", "调一个交互"],
        estimatedCommitment: "中等",
      },
      {
        name: "进协作",
        goal: "进入更深一层的协作。",
        description: "适用于已经熟悉内容与协作节奏的人。",
        exampleActivities: ["参与协作", "加入 mini app", "推进任务"],
        estimatedCommitment: "持续参与",
      },
    ],
    outcome: [
      "看懂项目",
      "学会动手",
      "进入协作",
    ],
    entryMethod: "学习路径",
    proofOrExpectation: "参与和学习相互连接。",
    featured: true,
  },
];

const learnPathsEn: LearnPath[] = [
  {
    slug: "vibe-coding-entry",
    title: "Understand the project and build with it.",
    audience: ["New to the topic, want context", "Already following, want to participate"],
    startingThreshold: "For people who already understand the basics.",
    stages: [
      {
        name: "See the project",
        goal: "Understand the entry and flow.",
        description: "Green Book, community, and ecosystem apps provide the base context.",
        exampleActivities: ["Read Green Book", "Check project status", "Pick an entry"],
        estimatedCommitment: "Low effort",
      },
      {
        name: "Learn by doing",
        goal: "Turn ideas into actions.",
        description: "Add content, tune layouts, and refine interactions.",
        exampleActivities: [
          "Add a line of copy",
          "Fix a layout",
          "Adjust an interaction",
        ],
        estimatedCommitment: "Medium",
      },
      {
        name: "Enter collaboration",
        goal: "Move into deeper collaboration.",
        description: "Suitable for people familiar with the content and collaboration rhythm.",
        exampleActivities: [
          "Collaborate on the project",
          "Join mini apps",
          "Move tasks forward",
        ],
        estimatedCommitment: "Ongoing",
      },
    ],
    outcome: ["Understand the project", "Learn to build", "Enter collaboration"],
    entryMethod: "Learning path",
    proofOrExpectation: "Participation and learning stay connected.",
    featured: true,
  },
];

export const learnPaths = learnPathsZh;

export function getLearnPaths(locale: Locale) {
  return localized(locale, learnPathsZh, learnPathsEn);
}
