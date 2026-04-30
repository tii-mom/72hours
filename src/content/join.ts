import type { Locale } from "../lib/locale";
import { localized } from "../lib/locale";

const joinContentZh = {
  title: "持币进入学习报名、应用与 Capital。",
  subtitle: "连接 TON 钱包，用 72H 完成资格核对，再选择学习报名、投资席位或社区协作入口。",
  whyTitle: "参与入口",
  whyBody: "72H 不只是展示资产，而是进入学习、应用和 Capital 身份的统一凭证。",
  joinedTitle: "进入后可见",
  joinedBody: "学习报名、席位规则、应用入口与人工核对会集中在同一个参与工作台。",
  contactTitle: "人工核对",
  contactBody: "Telegram 用于提交意向、余额异常核对和最终名额确认。",
  verifyTitle: "核对方式",
  verifyBody: "钱包余额、72H 合约、风险边界与公开页面共同构成参与前的核对信息。",
};

const joinContentEn = {
  title: "Use 72H to enter learning applications, apps, and Capital.",
  subtitle: "Connect a TON wallet, verify 72H eligibility, then choose a learning application, capital seat, or community collaboration path.",
  whyTitle: "Participation entry",
  whyBody: "72H is not only a displayed asset; it is the shared credential for learning, apps, and Capital identity.",
  joinedTitle: "What opens next",
  joinedBody: "Learning applications, seat rules, app entries, and manual review stay in the same participation console.",
  contactTitle: "Manual review",
  contactBody: "Telegram handles intent submission, balance review, and final seat confirmation.",
  verifyTitle: "How to verify",
  verifyBody: "Wallet balance, the 72H contract, risk boundaries, and public pages together form the pre-entry verification record.",
};

export const joinContent = joinContentZh;

export function getJoinContent(locale: Locale) {
  return localized(locale, joinContentZh, joinContentEn);
}
