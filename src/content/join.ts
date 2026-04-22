import type { Locale } from "../lib/locale";
import { localized } from "../lib/locale";

const joinContentZh = {
  title: "先进入主语境。",
  subtitle: "先看绿书，再进 Telegram。X 用来先观察。",
  whyTitle: "为什么先看入口？",
  whyBody: "先看入口，再决定要不要进。",
  joinedTitle: "进来后看什么",
  joinedBody: "先看绿书和真实讨论，再走下一步。",
  firstStepTitle: "第一次先做什么",
  firstStepBody: "先看绿书，再进 Telegram 或看 X。",
  verifyTitle: "怎么核对",
  verifyBody: "官方入口以本站、Telegram、X 和绿书为准。",
};

const joinContentEn = {
  title: "Enter the main context first.",
  subtitle: "Read Green Book first. Then join Telegram.",
  whyTitle: "Why start from the entry point?",
  whyBody: "Check the entry first, then decide whether to go deeper.",
  joinedTitle: "What to look at after joining",
  joinedBody: "Read Green Book and real discussion first, then decide.",
  firstStepTitle: "What to do first",
  firstStepBody: "Read Green Book first, then join Telegram or follow X.",
  verifyTitle: "How to verify",
  verifyBody: "Official entry points are this site, Telegram, X, and Green Book.",
};

export const joinContent = joinContentZh;

export function getJoinContent(locale: Locale) {
  return localized(locale, joinContentZh, joinContentEn);
}
