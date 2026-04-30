import type { Locale } from "../lib/locale";
import { localized } from "../lib/locale";

const joinContentZh = {
  title: "持币进入学习报名、应用与 Capital。",
  subtitle: "从官方应用地图、社区和绿皮书开始。学习、协作和席位入口会先做参与核对。",
  whyTitle: "参与入口",
  whyBody: "72H 不只是展示资产，而是进入学习、应用和 Capital 身份的统一凭证。",
  joinedTitle: "进入后可见",
  joinedBody: "学习报名、席位规则、应用入口与人工核对会集中在同一个参与工作台。",
  contactTitle: "人工核对",
  contactBody: "Telegram 用于提交意向、余额异常核对和最终名额确认。",
  verifyTitle: "核对方式",
  verifyBody: "钱包余额、72H 链上事实、风险边界与公开页面共同构成参与前的核对信息。",
};

const joinContentEn = {
  title: "Use 72H to enter learning applications, apps, and Capital.",
  subtitle: "Start from the app map, community, or Green Book. Learning, collaboration, and seat paths may ask for an eligibility check.",
  whyTitle: "Participation entry",
  whyBody: "72H is not only a displayed asset; it is the shared credential for learning, apps, and Capital identity.",
  joinedTitle: "What opens next",
  joinedBody: "Learning applications, seat rules, app entries, and human confirmation stay in one entry page.",
  contactTitle: "Human confirmation",
  contactBody: "Telegram handles requests, balance checks, and final confirmation.",
  verifyTitle: "How to verify",
  verifyBody: "Wallet balance, 72H on-chain facts, risk boundaries, and public pages form the pre-entry check.",
};

export const joinContent = joinContentZh;

export function getJoinContent(locale: Locale) {
  return localized(locale, joinContentZh, joinContentEn);
}
