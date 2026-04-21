import { channels } from "../content/channels";
import { faqItems } from "../content/faqs";
import { learnPaths } from "../content/learn-paths";
import { legalDocs } from "../content/legal";
import { projects } from "../content/projects";
import { siteConfig } from "../content/site-config";
import type { AudienceTag, ParticipationMode } from "./content-types";

export const primaryChannels = channels
  .slice()
  .sort((left, right) => Number(right.isPrimary) - Number(left.isPrimary) || left.priority - right.priority);

export const featuredProjects = projects
  .slice()
  .filter((project) => project.featured)
  .sort((left, right) => left.priority - right.priority);

export const secondaryProjects = projects
  .slice()
  .filter((project) => !project.featured && project.status !== "coming_soon")
  .sort((left, right) => left.priority - right.priority);

export const directoryProjects = projects
  .slice()
  .filter((project) => project.status === "coming_soon" || project.name === "72hours")
  .sort((left, right) => left.priority - right.priority);

export const featuredLearnPath = learnPaths.find((path) => path.featured) ?? learnPaths[0];

export const faqHighlights = faqItems
  .slice()
  .filter((item) => item.isPinned ?? true)
  .sort((left, right) => left.priority - right.priority);

export const legalDocsBySlug = Object.fromEntries(legalDocs.map((doc) => [doc.slug, doc])) as Record<
  "privacy" | "terms" | "disclaimer",
  (typeof legalDocs)[number]
>;

export function getLegalDoc(slug?: string) {
  if (!slug || !(slug in legalDocsBySlug)) {
    return undefined;
  }

  return legalDocsBySlug[slug as keyof typeof legalDocsBySlug];
}

export function getLegalTitle(slug?: string) {
  const doc = getLegalDoc(slug);
  return doc ? `${doc.title} | ${siteConfig.siteName}` : `法律说明 | ${siteConfig.siteName}`;
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

export function formatAudienceTags(tags: AudienceTag[]) {
  return tags.map((tag) => AUDIENCE_LABELS[tag]);
}

export function formatParticipationModes(modes: ParticipationMode[]) {
  return modes.map((mode) => PARTICIPATION_LABELS[mode]);
}

export { homeHighlights, siteConfig } from "../content/site-config";
