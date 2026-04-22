import type { Channel } from "../lib/content-types";
import type { Locale } from "../lib/locale";
import { localized } from "../lib/locale";

const channelsZh: Channel[] = [
  {
    type: "telegram",
    label: "Telegram",
    url: "https://t.me/the_72h",
    suitableFor: [
      "想进主语境",
      "先看绿书",
    ],
    expectationAfterJoining: [
      "先看绿书",
      "再决定是否继续",
    ],
    officialVerificationNote: "Telegram 是主入口。",
    isPrimary: true,
    priority: 1,
    ctaLabel: "进入",
    statusNote: "主社区入口",
  },
  {
    type: "x",
    label: "X",
    url: "https://x.com/taichi2077",
    suitableFor: [
      "想先观察",
      "想看公开动态",
    ],
    expectationAfterJoining: [
      "先看动态和绿书",
      "再决定是否进入",
    ],
    officialVerificationNote: "X 适合先观察。",
    isPrimary: false,
    priority: 2,
    ctaLabel: "关注",
    statusNote: "轻关注入口",
  },
  {
    type: "wechat",
    label: "微信",
    url: "/contact",
    suitableFor: [
      "需要中文补充",
      "想要补充联系",
    ],
    expectationAfterJoining: [
      "先看绿书、Telegram 或 X",
      "再看微信说明",
    ],
    officialVerificationNote: "微信只作补充联系。",
    isPrimary: false,
    priority: 3,
    ctaLabel: "看说明",
    statusNote: "次级补充",
  },
];

const channelsEn: Channel[] = [
  {
    type: "telegram",
    label: "Telegram",
    url: "https://t.me/the_72h",
    suitableFor: ["Main context", "Green Book first"],
    expectationAfterJoining: ["Read Green Book first", "Then continue"],
    officialVerificationNote: "Telegram is the primary entry point.",
    isPrimary: true,
    priority: 1,
    ctaLabel: "Enter",
    statusNote: "Main community entry",
  },
  {
    type: "x",
    label: "X",
    url: "https://x.com/taichi2077",
    suitableFor: ["Quick look", "Public updates"],
    expectationAfterJoining: ["Read updates and Green Book", "Then decide"],
    officialVerificationNote: "X is best for observation first.",
    isPrimary: false,
    priority: 2,
    ctaLabel: "Follow",
    statusNote: "Light observation entry",
  },
  {
    type: "wechat",
    label: "WeChat",
    url: "/contact",
    suitableFor: ["Chinese notes", "Supplementary contact"],
    expectationAfterJoining: ["Build context first", "Then read WeChat notes"],
    officialVerificationNote: "WeChat is for supplementary contact only.",
    isPrimary: false,
    priority: 3,
    ctaLabel: "Read notes",
    statusNote: "Supplementary",
  },
];

export const channels = channelsZh;

export function getChannels(locale: Locale) {
  return localized(locale, channelsZh, channelsEn);
}
