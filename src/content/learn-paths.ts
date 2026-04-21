import type { LearnPath } from "../lib/content-types";

export const learnPaths: LearnPath[] = [
  {
    slug: "vibe-coding-entry",
    title: "通过指导和 Vibe coding 进入加密项目开发",
    audience: [
      "完全没有技术背景，但想看懂真实项目的人",
      "已经通过生态页跑通基础认知，现在想获得构建与修正能力的人",
    ],
    startingThreshold: "先进入社区，先看懂真实项目，再开始学习。",
    stages: [
      {
        name: "看懂真实项目",
        goal: "先理解真实入口和真实协作是如何运作的。",
        description:
          "先进入社区对话和生态页面，看看真实项目现在怎么组织、怎么参与、怎么回流。",
        exampleActivities: ["阅读项目说明", "查看社区更新", "判断适合自己的入口"],
        estimatedCommitment: "低强度观察",
      },
      {
        name: "学会用 Vibe coding 参与",
        goal: "把想法转成可以被执行的具体动作。",
        description:
          "开始用自然语言配合 AI 来修改界面、补足逻辑、调整内容。",
        exampleActivities: ["补一段页面文案", "修一个布局", "调整一个交互"],
        estimatedCommitment: "中等投入",
      },
      {
        name: "进入加密项目开发",
        goal: "进入更深层的开发协作场景。",
        description:
          "当你已经能够看懂、修改并参与协作时，就可以进入更深层的开发场景。",
        exampleActivities: ["协作开发", "参与 mini app", "和社区一起推进任务"],
        estimatedCommitment: "稳定参与",
      },
    ],
    outcome: [
      "看懂真实项目",
      "学会用 Vibe coding 参与",
      "进入加密项目开发",
    ],
    entryMethod: "加入社区，进入路径。",
    proofOrExpectation:
      "学习不是第一步。先参与，再决定自己要不要继续往深处走。",
    featured: true,
  },
];
