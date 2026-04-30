import type { Locale } from "../lib/locale";
import { localized } from "../lib/locale";

const joinContentZh = {
  title: "进入 72hours。",
  subtitle: "从公开应用地图、社区和绿皮书开始。本页是导航入口，不开放购买、领取或真实席位动作。",
  whyTitle: "公开入口",
  whyBody: "72H 官网先帮助用户找到应用、社区、绿皮书与边界说明。",
  joinedTitle: "进入后可见",
  joinedBody: "当前可见的是应用地图、社区入口、公开说明和未开放动作的边界。",
  contactTitle: "官方渠道",
  contactBody: "Telegram、X 与联系页用于公开更新和人工说明。",
  verifyTitle: "核对方式",
  verifyBody: "以本站、绿皮书、链上证据和已标记官方渠道为准。",
};

const joinContentEn = {
  title: "Enter 72hours.",
  subtitle: "Start from the public app map, community, and Green Book. This page is navigation only; purchase, claim, and real seat actions are not open.",
  whyTitle: "Public entry",
  whyBody: "The 72H site helps users find apps, community, Green Book, and boundary notes first.",
  joinedTitle: "What opens next",
  joinedBody: "The current layer shows the app map, community entry, public notes, and closed-action boundaries.",
  contactTitle: "Official channels",
  contactBody: "Telegram, X, and the contact page handle public updates and human notes.",
  verifyTitle: "How to verify",
  verifyBody: "Use this site, Green Book, on-chain evidence, and marked official channels as the reference layer.",
};

export const joinContent = joinContentZh;

export function getJoinContent(locale: Locale) {
  return localized(locale, joinContentZh, joinContentEn);
}
