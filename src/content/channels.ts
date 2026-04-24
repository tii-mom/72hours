import type { Channel } from "../lib/content-types";
import type { Locale } from "../lib/locale";
import { localized } from "../lib/locale";

const channelsZh: Channel[] = [
  {
    type: "telegram",
    label: "Telegram",
    url: "https://t.me/the_72h",
    suitableFor: [
      "主社区",
      "官方说明",
    ],
    expectationAfterJoining: [
      "社区讨论",
      "项目更新",
    ],
    officialVerificationNote: "Telegram 是当前社区入口。",
    isPrimary: true,
    priority: 1,
    ctaLabel: "进入",
    statusNote: "主社区",
  },
  {
    type: "x",
    label: "X",
    url: "https://x.com/taichi2077",
    suitableFor: [
      "公开动态",
      "快速了解",
    ],
    expectationAfterJoining: [
      "公开更新",
      "补充上下文",
    ],
    officialVerificationNote: "X 适合观察公开动态。",
    isPrimary: false,
    priority: 2,
    ctaLabel: "关注",
    statusNote: "公开动态",
  },
  {
    type: "wechat",
    label: "微信",
    url: "/contact",
    suitableFor: [
      "中文补充",
      "补充联系",
    ],
    expectationAfterJoining: [
      "中文说明",
      "补充信息",
    ],
    officialVerificationNote: "微信用于补充联系。",
    isPrimary: false,
    priority: 3,
    ctaLabel: "看说明",
    statusNote: "补充说明",
  },
];

const channelsEn: Channel[] = [
  {
    type: "telegram",
    label: "Telegram",
    url: "https://t.me/the_72h",
    suitableFor: ["Main context", "Official notes"],
    expectationAfterJoining: ["Community discussion", "Project updates"],
    officialVerificationNote: "Telegram is the current community entry.",
    isPrimary: true,
    priority: 1,
    ctaLabel: "Enter",
    statusNote: "Main community",
  },
  {
    type: "x",
    label: "X",
    url: "https://x.com/taichi2077",
    suitableFor: ["Quick look", "Public updates"],
    expectationAfterJoining: ["Public updates", "Extra context"],
    officialVerificationNote: "X is for observing public updates.",
    isPrimary: false,
    priority: 2,
    ctaLabel: "Follow",
    statusNote: "Public updates",
  },
  {
    type: "wechat",
    label: "WeChat",
    url: "/contact",
    suitableFor: ["Chinese notes", "Supplementary contact"],
    expectationAfterJoining: ["Chinese notes", "Supplementary contact"],
    officialVerificationNote: "WeChat is for supplementary contact.",
    isPrimary: false,
    priority: 3,
    ctaLabel: "Read notes",
    statusNote: "Supplementary notes",
  },
];

export const channels = channelsZh;

export function getChannels(locale: Locale) {
  return localized(locale, channelsZh, channelsEn);
}
