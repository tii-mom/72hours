import type { Channel } from "../lib/content-types";

export const channels: Channel[] = [
  {
    type: "telegram",
    label: "Telegram",
    url: "https://t.me/the_72h",
    suitableFor: [
      "想直接进入主语境的人",
      "想先看项目更新和官方说明的人",
      "已经愿意开始参与的人",
    ],
    expectationAfterJoining: [
      "先看到真实讨论和入口说明",
      "先理解社区当前在做什么",
      "再决定要不要继续深入",
    ],
    officialVerificationNote:
      "Telegram 是主入口，只认官方公开的链接和站内说明。",
    isPrimary: true,
    priority: 1,
    ctaLabel: "进入 Telegram",
    statusNote: "主社区入口",
  },
  {
    type: "x",
    label: "X",
    url: "https://x.com/taichi2077",
    suitableFor: [
      "想先轻量观察的人",
      "想先看公开动态和对外说明的人",
      "还不想立刻深入的人",
    ],
    expectationAfterJoining: [
      "先看到项目动态和公开说明",
      "先建立基本判断",
      "再决定是否进入主社区",
    ],
    officialVerificationNote:
      "X 适合先观察，不要求你一次性做出深入决定。",
    isPrimary: false,
    priority: 2,
    ctaLabel: "关注 X",
    statusNote: "轻关注入口",
  },
  {
    type: "wechat",
    label: "微信",
    url: "/contact",
    suitableFor: [
      "需要中文补充说明的人",
      "更习惯通过补充联系确认信息的人",
    ],
    expectationAfterJoining: [
      "先通过 Telegram 或 X 建立认知",
      "再查看微信说明和联系边界",
    ],
    officialVerificationNote:
      "微信只作为补充联系和中文说明保留，不承担主入口职责。",
    isPrimary: false,
    priority: 3,
    ctaLabel: "查看微信说明",
    statusNote: "次级补充",
  },
];
