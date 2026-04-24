export type ProjectStatus =
  | "live"
  | "beta"
  | "waitlist"
  | "community_pilot"
  | "coming_soon"
  | "archived";

export type AudienceTag =
  | "new_to_crypto"
  | "curious_explorer"
  | "community_participant"
  | "builder_or_creator"
  | "deeper_learner";

export type ParticipationMode =
  | "join_community"
  | "try_now"
  | "apply_waitlist"
  | "follow_updates"
  | "deeper_participation";

export type ChannelType = "telegram" | "x" | "wechat" | "other";

export type ProofAssetType = "image" | "screenshot" | "quote" | "link" | "note";

export interface ProofAsset {
  type: ProofAssetType;
  title?: string;
  value: string;
  caption?: string;
  isVerified?: boolean;
}

export interface ExternalLink {
  label: string;
  url: string;
  type: "app" | "waitlist" | "community" | "docs";
  isOfficial?: boolean;
}

export interface ProjectRelation {
  level:
    | "none"
    | "adjacent"
    | "supported"
    | "core"
    | "prep"
    | "advanced"
    | "integrated";
  summary: string;
}

export type ProjectSignalTone = "new" | "hot" | "core" | "guide";
export type ProjectCategory = "new_launch" | "main_entry" | "tools" | "coming_soon";

export interface ProjectSignal {
  tone: ProjectSignalTone;
  label: string;
}

export interface Project {
  slug: string;
  name: string;
  oneLineValue: string;
  summary?: string;
  detailIntro?: string;
  category: ProjectCategory;
  status: ProjectStatus;
  audienceFit: AudienceTag[];
  participationMode: ParticipationMode[];
  externalLink: ExternalLink;
  hoursRelation?: ProjectRelation;
  learnRelation?: ProjectRelation;
  proofAssets: ProofAsset[];
  featured: boolean;
  priority: number;
  visibility?: "public" | "hidden";
  iconKey?: "box" | "beaker" | "check" | "spark" | "shield" | "relay";
  logoSrc?: string;
  logoAlt?: string;
  brandStripSrc?: string;
  brandStripAlt?: string;
  signals?: ProjectSignal[];
}

export interface Channel {
  type: ChannelType;
  label: string;
  url: string;
  suitableFor: string[];
  expectationAfterJoining: string[];
  officialVerificationNote: string;
  isPrimary: boolean;
  priority: number;
  ctaLabel?: string;
  qrcodeAsset?: string;
  statusNote?: string;
}

export interface LearnStage {
  name: string;
  goal: string;
  description: string;
  exampleActivities?: string[];
  estimatedCommitment?: string;
}

export interface LearnPath {
  slug: string;
  title: string;
  audience: string[];
  startingThreshold: string;
  stages: LearnStage[];
  outcome: string[];
  entryMethod: string;
  proofOrExpectation?: string;
  featured?: boolean;
}

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  relatedLinks?: Array<{ label: string; href: string }>;
  priority: number;
  isPinned?: boolean;
  visibility?: "public" | "hidden";
}

export interface LegalDocMeta {
  slug: "privacy" | "terms" | "disclaimer";
  title: string;
  summary: string;
  effectiveDate: string;
  owner?: string;
  version?: string;
  contentSource?: string;
  requiresTopNotice: boolean;
  relatedDocs?: string[];
}

export interface SiteConfig {
  siteName: string;
  siteUrl: string;
  language: "zh-CN" | "en-US";
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  primaryJoinRoute: string;
  navItems: Array<{ label: string; href: string }>;
  footerGroups: Array<{
    id: string;
    title: string;
    links: Array<{ label: string; href: string }>;
  }>;
  hero: {
    title: string;
    subtitle: string;
    proofSignals: string[];
  };
  globalDisclaimerExcerpt: string;
}

export interface HomeHighlight {
  title: string;
  body: string;
  cta: string;
  href: string;
  iconLabel: string;
}
