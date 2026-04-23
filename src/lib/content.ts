import { getChannels } from "../content/channels";
import { getFaqItems } from "../content/faqs";
import { getLearnPaths } from "../content/learn-paths";
import { getLegalDocs } from "../content/legal";
import { getProjects } from "../content/projects";
import { getSiteConfig } from "../content/site-config";
import type { Locale } from "./locale";
import type { AudienceTag, ParticipationMode } from "./content-types";

const defaultChannels = getChannels("zh-CN");
const defaultProjects = getProjects("zh-CN");
const defaultLearnPaths = getLearnPaths("zh-CN");
const defaultFaqItems = getFaqItems("zh-CN");
export const primaryChannels = defaultChannels
  .slice()
  .sort((left, right) => Number(right.isPrimary) - Number(left.isPrimary) || left.priority - right.priority);

export const featuredProjects = defaultProjects
  .slice()
  .filter((project) => project.category === "main_entry")
  .sort((left, right) => left.priority - right.priority);

export const secondaryProjects = defaultProjects
  .slice()
  .filter((project) => project.category === "tools" || project.category === "new_launch")
  .sort((left, right) => left.priority - right.priority);

export const directoryProjects = defaultProjects
  .slice()
  .filter((project) => project.category === "coming_soon")
  .sort((left, right) => left.priority - right.priority);

export const featuredLearnPath = defaultLearnPaths.find((path) => path.featured) ?? defaultLearnPaths[0];

export const faqHighlights = defaultFaqItems
  .slice()
  .filter((item) => item.isPinned ?? true)
  .sort((left, right) => left.priority - right.priority);

export function getLegalDoc(locale: Locale, slug?: string) {
  const legalDocs = getLegalDocs(locale);
  if (!slug) {
    return undefined;
  }

  return legalDocs.find((doc) => doc.slug === slug);
}

export function getLegalTitle(locale: Locale, slug?: string) {
  const doc = getLegalDoc(locale, slug);
  const siteConfig = getSiteConfig(locale);
  return doc ? `${siteConfig.siteName} | ${doc.title}` : `${siteConfig.siteName} | ${locale === "en-US" ? "Legal" : "法律说明"}`;
}

const AUDIENCE_LABELS: Record<AudienceTag, string> = {
  new_to_crypto: "刚接触加密的人",
  curious_explorer: "先观察的人",
  community_participant: "已经在参与的人",
  builder_or_creator: "愿意动手的人",
  deeper_learner: "想更深入学习的人",
};

const PARTICIPATION_LABELS: Record<ParticipationMode, string> = {
  join_community: "先加入社区",
  try_now: "立即尝试",
  apply_waitlist: "申请候补",
  follow_updates: "先关注更新",
  deeper_participation: "更深参与",
};

const AUDIENCE_LABELS_EN: Record<AudienceTag, string> = {
  new_to_crypto: "New to crypto",
  curious_explorer: "Curious observer",
  community_participant: "Community participant",
  builder_or_creator: "Builder / creator",
  deeper_learner: "Deeper learner",
};

const PARTICIPATION_LABELS_EN: Record<ParticipationMode, string> = {
  join_community: "Join community first",
  try_now: "Try now",
  apply_waitlist: "Apply for waitlist",
  follow_updates: "Follow updates",
  deeper_participation: "Deeper participation",
};

export function formatAudienceTags(tags: AudienceTag[], locale: Locale = "zh-CN") {
  const labels = locale === "en-US" ? AUDIENCE_LABELS_EN : AUDIENCE_LABELS;
  return tags.map((tag) => labels[tag]);
}

export function formatParticipationModes(modes: ParticipationMode[], locale: Locale = "zh-CN") {
  const labels = locale === "en-US" ? PARTICIPATION_LABELS_EN : PARTICIPATION_LABELS;
  return modes.map((mode) => labels[mode]);
}

export { getHomeHighlights, getSiteConfig, homeHighlights, siteConfig } from "../content/site-config";
