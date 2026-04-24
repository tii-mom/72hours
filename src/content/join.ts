import type { Locale } from "../lib/locale";
import { localized } from "../lib/locale";

const joinContentZh = {
  title: "社区、公开动态与补充说明。",
  subtitle: "Telegram 是主社区入口，X 对应公开动态，微信提供补充说明。",
  whyTitle: "社区入口",
  whyBody: "Telegram、X 与微信构成当前的官方联系层。",
  joinedTitle: "进入后可见",
  joinedBody: "社区讨论、公开动态和补充说明共同构成当前联系层。",
  contactTitle: "联系入口",
  contactBody: "Telegram、X 和微信说明页。",
  verifyTitle: "核对方式",
  verifyBody: "本站、Telegram、X 和绿皮书共同提供公开核对信息。",
};

const joinContentEn = {
  title: "Community, public updates, and supplementary notes.",
  subtitle: "Telegram is the main community entry. X covers public updates, and WeChat is supplementary.",
  whyTitle: "Community entry",
  whyBody: "Telegram, X, and WeChat make up the current contact layer.",
  joinedTitle: "What you see inside",
  joinedBody: "Community discussion, public updates, and supplementary notes make up the current contact layer.",
  contactTitle: "Contact entry",
  contactBody: "Telegram, X, and WeChat notes.",
  verifyTitle: "How to verify",
  verifyBody: "This site, Telegram, X, and Green Book provide public verification context.",
};

export const joinContent = joinContentZh;

export function getJoinContent(locale: Locale) {
  return localized(locale, joinContentZh, joinContentEn);
}
