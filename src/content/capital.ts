import type { Locale } from "../lib/locale";

type LocalizedCopy = {
  "zh-CN": string;
  "en-US": string;
};

type CapitalBrand =
  | {
      kind: "image";
      label: string;
      src: string;
      alt: string;
      monogram?: string;
    }
  | {
      kind: "monogram";
      label: string;
      monogram: string;
      src?: string;
      alt?: string;
    };

type CapitalIdentityTone = "primary" | "gold" | "muted";

type RawPortfolioHolding = {
  seatKey: CapitalSeatKey;
  position: LocalizedCopy;
  claimableReward: number;
  privateNote: LocalizedCopy;
};

type RawReserveLot = {
  seatKey: CapitalSeatKey;
  label: LocalizedCopy;
  amount72H: number;
  allocatedOn: string;
  unlockOn: string;
  status: LocalizedCopy;
  action: LocalizedCopy;
  tone: CapitalIdentityTone;
};

type RawAlphaCycle = {
  seatKey: CapitalSeatKey;
  label: LocalizedCopy;
  period: LocalizedCopy;
  schedule: LocalizedCopy;
  settledReward72H: number;
  status: LocalizedCopy;
  note: LocalizedCopy;
  tone: CapitalIdentityTone;
};

type RawCredential = {
  title: string;
  body: LocalizedCopy;
  achievedOn: string;
  tone: CapitalIdentityTone;
};

type RawCapitalSeat = {
  key: CapitalSeatKey;
  appSlug: CapitalAppSlug;
  type: CapitalSeatType;
  seatNumber: number;
  totalSeats: number;
  titleEn: string;
  subtitleZh: string;
  statusLabel: LocalizedCopy;
  lifecycleLabel: LocalizedCopy;
  holder: string;
  walletShort: string;
  acquiredOn: string;
  tierLabel: LocalizedCopy;
  txHash: string;
  badges: LocalizedCopy[];
  disclosure: LocalizedCopy;
  surfaceHref: string;
  surfaceLabel: LocalizedCopy;
  tone: CapitalIdentityTone;
};

type RawCapitalProgram = {
  type: CapitalSeatType;
  cardTitle: LocalizedCopy;
  formalLabel: string;
  description: LocalizedCopy;
  minimum72H: number;
  durationLabel: LocalizedCopy;
  rewardCadenceLabel: LocalizedCopy;
  redemptionLabel: LocalizedCopy;
  rewardSource: LocalizedCopy;
  riskDisclosure: LocalizedCopy;
  confirmations: LocalizedCopy[];
  recentSeatNumber: number;
};

type RawCapitalApp = {
  slug: CapitalAppSlug;
  name: string;
  brand: CapitalBrand;
  summary: LocalizedCopy;
  lead: LocalizedCopy;
  noteBody: LocalizedCopy;
  statusLabel: LocalizedCopy;
  riskBand: LocalizedCopy;
  rewardSourceSummary: LocalizedCopy;
  surfaceHref: string;
  surfaceLabel: LocalizedCopy;
  surfaceExternal: boolean;
  updatedOn: string;
  tvl72H: number;
  participants: number;
  reserveRemaining: number;
  alphaRemaining: number;
  highlights: LocalizedCopy[];
  reserveProgram: RawCapitalProgram;
  alphaProgram: RawCapitalProgram;
  showcaseSeatKeys: [CapitalSeatKey, CapitalSeatKey];
};

export type CapitalAppSlug = "multi-millionaire" | "72hours" | "wan";
export type CapitalSeatType = "reserve" | "alpha";
export type CapitalSeatKey = `${CapitalAppSlug}:${CapitalSeatType}:${number}`;

export const capitalAppSlugs: readonly CapitalAppSlug[] = ["multi-millionaire", "72hours", "wan"];

export interface CapitalMetricItem {
  label: string;
  value: string;
  hint?: string;
  tone?: CapitalIdentityTone;
}

export interface CapitalActionLink {
  label: string;
  href: string;
  external?: boolean;
  variant?: "primary" | "secondary";
}

export interface CapitalSectionCopy {
  eyebrow: string;
  title: string;
  body?: string;
}

export interface CapitalProgramGuideView {
  type: CapitalSeatType;
  title: string;
  formalLabel: string;
  body: string;
  metrics: CapitalMetricItem[];
  bullets: string[];
  riskDisclosure: string;
  tone: CapitalIdentityTone;
}

export interface CapitalTierView {
  label: string;
  threshold: string;
  note: string;
}

export interface CapitalIdentityCardView {
  key: CapitalSeatKey;
  appSlug: CapitalAppSlug;
  appName: string;
  brand: CapitalBrand;
  title: string;
  subtitle: string;
  statusLabel: string;
  lifecycleLabel: string;
  badges: string[];
  disclosure: string;
  verificationHref: string;
  surfaceHref: string;
  surfaceLabel: string;
  surfaceExternal: boolean;
  tone: CapitalIdentityTone;
  meta: CapitalMetricItem[];
}

export interface CapitalSeatProgramView {
  type: CapitalSeatType;
  title: string;
  formalLabel: string;
  description: string;
  metrics: CapitalMetricItem[];
  confirmations: string[];
  riskDisclosure: string;
  cta: CapitalActionLink;
  verifyAction: CapitalActionLink;
  tone: CapitalIdentityTone;
}

export interface CapitalAppCardView {
  slug: CapitalAppSlug;
  name: string;
  brand: CapitalBrand;
  summary: string;
  statusLabel: string;
  riskBand: string;
  metrics: CapitalMetricItem[];
  reserveLabel: string;
  alphaLabel: string;
  detailHref: string;
  verifyHref: string;
}

export interface CapitalAppPageView {
  slug: CapitalAppSlug;
  name: string;
  brand: CapitalBrand;
  hero: {
    kicker: string;
    title: string;
    lead: string;
    noteLabel: string;
    noteTitle: string;
    noteBody: string;
    chips: string[];
  };
  surfaceAction: CapitalActionLink;
  overviewMetrics: CapitalMetricItem[];
  highlights: string[];
  reserveProgram: CapitalSeatProgramView;
  alphaProgram: CapitalSeatProgramView;
  reserveTiers: CapitalTierView[];
  alphaTiers: CapitalTierView[];
  showcaseSeats: CapitalIdentityCardView[];
  policyNote: CapitalSectionCopy;
}

export interface CapitalPortfolioHoldingView extends CapitalIdentityCardView {
  position: string;
  claimableReward: string;
  privateNote: string;
}

export interface CapitalPortfolioLedgerView {
  title: string;
  seatHref: string;
  tone: CapitalIdentityTone;
  meta: CapitalMetricItem[];
}

export interface CapitalCredentialView {
  title: string;
  body: string;
  achievedOn: string;
  tone: CapitalIdentityTone;
}

export interface CapitalPortfolioView {
  hero: {
    kicker: string;
    title: string;
    lead: string;
    noteLabel: string;
    noteTitle: string;
    noteBody: string;
    chips: string[];
  };
  summaryMetrics: CapitalMetricItem[];
  holdings: CapitalPortfolioHoldingView[];
  reserveLots: CapitalPortfolioLedgerView[];
  alphaCycles: CapitalPortfolioLedgerView[];
  credentials: CapitalCredentialView[];
  inviteMetrics: CapitalMetricItem[];
  shareCard: CapitalIdentityCardView;
  shareActions: CapitalActionLink[];
}

export interface CapitalVerificationView {
  hero: {
    kicker: string;
    title: string;
    lead: string;
    noteLabel: string;
    noteTitle: string;
    noteBody: string;
    chips: string[];
  };
  seat: CapitalIdentityCardView;
  publicMetrics: CapitalMetricItem[];
  riskNote: CapitalSectionCopy;
  actions: CapitalActionLink[];
}

export interface CapitalOverviewView {
  hero: {
    kicker: string;
    title: string;
    lead: string;
    noteLabel: string;
    noteTitle: string;
    noteBody: string;
    chips: string[];
  };
  summaryMetrics: CapitalMetricItem[];
  programs: CapitalProgramGuideView[];
  apps: CapitalAppCardView[];
  portfolioCallout: {
    kicker: string;
    title: string;
    body: string;
    actions: CapitalActionLink[];
  };
}

const copy = (zh: string, en: string): LocalizedCopy => ({
  "zh-CN": zh,
  "en-US": en,
});

function pick(locale: Locale, value: LocalizedCopy) {
  return value[locale];
}

function formatAmount(locale: Locale, value: number) {
  return `${new Intl.NumberFormat(locale).format(value)} 72H`;
}

function formatDate(locale: Locale, value: string) {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(`${value}T00:00:00Z`));
}

function formatSeatNumber(value: number, total: number) {
  const padded = total >= 10 ? String(value).padStart(2, "0") : String(value);
  return `#${padded} / ${total}`;
}

export function getCapitalAppPath(slug: CapitalAppSlug) {
  return `/capital/${slug}`;
}

export function getCapitalSeatVerifyPath(slug: CapitalAppSlug, type: CapitalSeatType, seatNumber: number) {
  return `/capital/${slug}/${type}/${seatNumber}`;
}

export function isCapitalAppSlug(value: string | undefined): value is CapitalAppSlug {
  return Boolean(value && capitalAppSlugs.includes(value as CapitalAppSlug));
}

const reserveRisk = copy(
  "Principal-custodied Reserve Seat 锁定期为 72 天。本金由同一 ReserveVault 托管，到期后可从该合约申请赎回；奖励来自 AppRewardPool，可为 0，且不来自本金。",
  "A Principal-custodied Reserve Seat has a 72-day lock-up. Principal is custodied in the same ReserveVault and can be redeemed from that contract after maturity; rewards come from AppRewardPool, may be 0, and never come from principal.",
);

const alphaRisk = copy(
  "High-conviction Alpha Seat 是 72 周长期高风险配置。本金一经配置不支持赎回，并可能产生部分或全部本金损失；奖励权重高于 Reserve，但奖励可为 0。",
  "A High-conviction Alpha Seat is a 72-week long-term high-risk allocation. Alpha principal is non-redeemable once allocated and may result in partial or total principal loss; reward weight is higher than Reserve, but rewards may be 0.",
);

const networkFeeNote = copy(
  "链上网络费用由用户钱包自行承担。",
  "Network fees are paid by the user wallet.",
);

const reserveTiers = [
  {
    label: copy("Select Reserve Seat", "Select Reserve Seat"),
    threshold: 720,
    note: copy("Reserve 最低门槛。", "Reserve entry threshold."),
  },
  {
    label: copy("Prime Reserve Seat", "Prime Reserve Seat"),
    threshold: 7_200,
    note: copy("适用于更高额度的长期储备配置。", "For larger long-duration reserve allocations."),
  },
  {
    label: copy("Strategic Reserve Seat", "Strategic Reserve Seat"),
    threshold: 72_000,
    note: copy("更偏战略性参与。", "For more strategic participation."),
  },
  {
    label: copy("Large Reserve Seat", "Large Reserve Seat"),
    threshold: 720_000,
    note: copy("面向机构级额度。", "For institutional-scale reserve sizing."),
  },
] as const;

const appRecords: readonly RawCapitalApp[] = [
  {
    slug: "multi-millionaire",
    name: "multi-millionaire",
    brand: { kind: "monogram", label: "multi-millionaire", monogram: "MM" },
    summary: copy(
      "首批高门槛席位，强调稀缺容量、长期配置与高级身份识别。",
      "High-threshold seats built around scarce capacity, long-duration allocation, and premium capital identity.",
    ),
    lead: copy(
      "以 72H 获取 multi-millionaire 的限量 Capital Seat。Reserve 是 Principal-custodied Reserve Seat，Alpha 是奖励权重更高的 High-conviction Alpha Seat。",
      "Review a limited multi-millionaire Capital Seat with 72H. Reserve is a Principal-custodied Reserve Seat, while Alpha is a higher-weight High-conviction Alpha Seat.",
    ),
    noteBody: copy(
      "首批参数以高门槛与低席位释放为主，适合愿意长期绑定 multi-millionaire 资本身份的成员。",
      "The first release stays selective on both threshold and seat release, designed for members willing to hold a long multi-millionaire capital identity.",
    ),
    statusLabel: copy("首批开放", "First release"),
    riskBand: copy("高波动 / 稀缺身份", "High beta / scarce identity"),
    rewardSourceSummary: copy(
      "奖励来自 AppRewardPool，可来自协议活动、策略库存与精选合作分配，且可为 0。",
      "Rewards come from AppRewardPool, may draw from protocol campaigns, strategic inventory, and curated partner distributions, and may be 0.",
    ),
    surfaceHref: "/join",
    surfaceLabel: copy("加入候补名单", "Join waitlist"),
    surfaceExternal: false,
    updatedOn: "2026-04-23",
    tvl72H: 12_960_000,
    participants: 61,
    reserveRemaining: 19,
    alphaRemaining: 3,
    highlights: [
      copy("Alpha 最低门槛为 720,000 72H。", "Alpha starts at 720,000 72H."),
      copy("Completed Alpha Seat 获得专属 Mandate 资格。", "Completed Alpha Seats receive a dedicated mandate credential."),
      copy("面向更少但更坚定的长期资本参与者。", "Built for fewer but more committed long-duration capital participants."),
    ],
    reserveProgram: {
      type: "reserve",
      cardTitle: copy("Reserve Seat", "Reserve Seat"),
      formalLabel: "Principal-custodied Reserve Seat",
      description: copy(
        "本金由 ReserveVault 托管。允许追加，72 天后可按批次从同一合约申请赎回。",
        "Principal is custodied by ReserveVault. Top-ups are allowed, and each mature lot can request redemption from the same contract after 72 days.",
      ),
      minimum72H: 720,
      durationLabel: copy("72 天锁定", "72-day lock-up"),
      rewardCadenceLabel: copy("每 7 天奖励请求窗口", "Reward request window every 7 days"),
      redemptionLabel: copy("到期后支持部分赎回", "Partial redemption after maturity"),
      rewardSource: copy(
        "AppRewardPool 面向 Reserve 的奖励批次，可为 0，且不动用本金。",
        "AppRewardPool reward batches for Reserve; rewards may be 0 and do not use principal.",
      ),
      riskDisclosure: reserveRisk,
      confirmations: [
        copy("锁定 72 天。", "72-day lock-up."),
        copy("本金由 ReserveVault 托管。", "Principal is custodied in ReserveVault."),
        copy("到期后从同一 ReserveVault 赎回。", "Redeem from the same ReserveVault after maturity."),
        networkFeeNote,
      ],
      recentSeatNumber: 53,
    },
    alphaProgram: {
      type: "alpha",
      cardTitle: copy("Alpha Seat", "Alpha Seat"),
      formalLabel: "High-conviction Alpha Seat",
      description: copy(
        "高风险、长期、稀缺资本身份。本金不可赎回，完成 72 周后升级为 Completed Alpha Seat。",
        "High-risk, long-term, scarce capital identity. Principal is non-redeemable and upgrades to Completed Alpha Seat after 72 weeks.",
      ),
      minimum72H: 720_000,
      durationLabel: copy("72 周承诺周期", "72-week mandate"),
      rewardCadenceLabel: copy("每 7 周奖励结算", "Reward settlement every 7 weeks"),
      redemptionLabel: copy("本金不可赎回", "Principal is non-redeemable"),
      rewardSource: copy(
        "AppRewardPool 面向 Alpha 的高权重奖励批次，可为 0。",
        "Higher-weight AppRewardPool reward batches for Alpha; rewards may be 0.",
      ),
      riskDisclosure: alphaRisk,
      confirmations: [
        copy("72 周长期配置。", "72-week long-term allocation."),
        copy("本金不可赎回。", "Principal is non-redeemable."),
        copy("可能损失全部本金。", "Full principal loss is possible."),
        networkFeeNote,
      ],
      recentSeatNumber: 6,
    },
    showcaseSeatKeys: ["multi-millionaire:reserve:32", "multi-millionaire:alpha:1"],
  },
  {
    slug: "72hours",
    name: "72hours",
    brand: { kind: "monogram", label: "72hours", monogram: "72H" },
    summary: copy(
      "72hours 主场对应的 Capital Seat，把生态主入口、使用与参与放在同一资本身份层内。",
      "Capital Seats for the 72hours main stage, keeping entry, use, and participation inside the same capital identity layer.",
    ),
    lead: copy(
      "Reserve 维持更稳健的储备结构，Alpha 则对应 72hours 主场的长期高风险资本承诺。",
      "Reserve keeps a steadier reserve structure, while Alpha maps to a longer high-risk capital commitment around the 72hours core surface.",
    ),
    noteBody: copy(
      "该应用是生态主场，对应更完整的参与路径与公开身份展示。",
      "This app sits on the ecosystem main stage and carries the broadest participation path and public identity surface.",
    ),
    statusLabel: copy("核心场域", "Core surface"),
    riskBand: copy("生态核心 / 自主风险", "Core surface / discretionary risk"),
    rewardSourceSummary: copy(
      "奖励来自 AppRewardPool，可接收生态收入路由与活动分配，奖励可为 0。",
      "Rewards come from AppRewardPool, may receive ecosystem revenue routing and campaign allocations, and may be 0.",
    ),
    surfaceHref: "https://72h.lol",
    surfaceLabel: copy("打开 72hours 主场", "Open 72hours"),
    surfaceExternal: true,
    updatedOn: "2026-04-23",
    tvl72H: 6_408_000,
    participants: 74,
    reserveRemaining: 34,
    alphaRemaining: 5,
    highlights: [
      copy("Reserve 先开放；Alpha 在 Reserve 稳定前保持关闭。", "Reserve opens first; Alpha remains closed until Reserve is stable."),
      copy("适合把 Capital 身份与生态参与绑定。", "Best for linking capital identity with broader ecosystem participation."),
      copy("公开验证页默认不展示金额或奖励。", "Public verification intentionally omits amount and reward data."),
    ],
    reserveProgram: {
      type: "reserve",
      cardTitle: copy("Reserve Seat", "Reserve Seat"),
      formalLabel: "Principal-custodied Reserve Seat",
      description: copy(
        "面向主场参与者的本金优先席位。支持追加与批次化赎回。",
        "Principal-first seats for main-stage participants. Supports top-ups and lot-based redemption.",
      ),
      minimum72H: 720,
      durationLabel: copy("72 天锁定", "72-day lock-up"),
      rewardCadenceLabel: copy("每 7 天奖励请求窗口", "Reward request window every 7 days"),
      redemptionLabel: copy("到期后可申请赎回", "Redemption request after maturity"),
      rewardSource: copy(
        "AppRewardPool 接收的生态路由与储备型活动奖励。",
        "Ecosystem routing and reserve campaign rewards held in AppRewardPool.",
      ),
      riskDisclosure: reserveRisk,
      confirmations: [
        copy("锁定 72 天。", "72-day lock-up."),
        copy("本金由 ReserveVault 托管。", "Principal is custodied in ReserveVault."),
        copy("到期后从同一 ReserveVault 赎回。", "Redeem from the same ReserveVault after maturity."),
        networkFeeNote,
      ],
      recentSeatNumber: 38,
    },
    alphaProgram: {
      type: "alpha",
      cardTitle: copy("Alpha Seat", "Alpha Seat"),
      formalLabel: "High-conviction Alpha Seat",
      description: copy(
        "72hours 主场的长期高风险资本身份，强调公开验证、长期承诺与 Completed Mandate 资格。",
        "A long-horizon high-risk capital identity for the 72hours main stage, emphasizing public verification, long commitment, and Completed Mandate status.",
      ),
      minimum72H: 72_000,
      durationLabel: copy("72 周承诺周期", "72-week mandate"),
      rewardCadenceLabel: copy("每 7 周奖励结算", "Reward settlement every 7 weeks"),
      redemptionLabel: copy("本金不可赎回", "Principal is non-redeemable"),
      rewardSource: copy(
        "AppRewardPool 的生态主场活动与精选长期奖励批次。",
        "Core ecosystem programs and selected long-horizon reward batches in AppRewardPool.",
      ),
      riskDisclosure: alphaRisk,
      confirmations: [
        copy("72 周长期配置。", "72-week long-term allocation."),
        copy("本金不可赎回。", "Principal is non-redeemable."),
        copy("奖励可为 0。", "Rewards may be 0."),
        networkFeeNote,
      ],
      recentSeatNumber: 4,
    },
    showcaseSeatKeys: ["72hours:reserve:18", "72hours:alpha:3"],
  },
  {
    slug: "wan",
    name: "WAN",
    brand: {
      kind: "image",
      label: "WAN",
      src: "/brands/wan-icon.png",
      alt: "WAN icon",
      monogram: "WAN",
    },
    summary: copy(
      "把 WAN 的实际使用场景与 Capital Seat 身份绑定，强调操作层使用与公开验证。",
      "Pairs WAN's operating surface with Capital Seat identity, tying real usage to public verification.",
    ),
    lead: copy(
      "WAN Reserve 更接近使用层的储备配置，Alpha 则对应更长期、更高风险的 WAN 资本席位。",
      "WAN Reserve stays closer to an operating reserve profile, while Alpha maps to a longer and higher-risk WAN capital seat.",
    ),
    noteBody: copy(
      "对于已经在 WAN 上使用访问、节点与订阅能力的成员，这是最直接的 Capital 身份入口。",
      "For members already using WAN for access, node, and subscription workflows, this is the most direct Capital identity entry.",
    ),
    statusLabel: copy("运营场域", "Operating surface"),
    riskBand: copy("运营场域 / 中等波动", "Operating surface / moderate beta"),
    rewardSourceSummary: copy(
      "奖励来自 AppRewardPool，可接收运营收入路由、订阅资金池与安全接入活动，奖励可为 0。",
      "Rewards come from AppRewardPool, may receive operating revenue routing, subscription vault flows, and access campaigns, and may be 0.",
    ),
    surfaceHref: "https://wan.lat",
    surfaceLabel: copy("打开 WAN", "Open WAN"),
    surfaceExternal: true,
    updatedOn: "2026-04-23",
    tvl72H: 2_664_000,
    participants: 49,
    reserveRemaining: 11,
    alphaRemaining: 2,
    highlights: [
      copy("首批中席位消耗最快。", "The fastest seat drawdown in the first release."),
      copy("Reserve 更贴近实际使用场景。", "Reserve stays closest to actual usage."),
      copy("Alpha 最低门槛为 72,000 72H。", "Alpha starts at 72,000 72H."),
    ],
    reserveProgram: {
      type: "reserve",
      cardTitle: copy("Reserve Seat", "Reserve Seat"),
      formalLabel: "Principal-custodied Reserve Seat",
      description: copy(
        "面向 WAN 运营场景的本金优先席位，支持追加与成熟批次赎回。",
        "Principal-first seats for the WAN operating surface, with top-ups and mature-lot redemption.",
      ),
      minimum72H: 720,
      durationLabel: copy("72 天锁定", "72-day lock-up"),
      rewardCadenceLabel: copy("每 7 天奖励请求窗口", "Reward request window every 7 days"),
      redemptionLabel: copy("成熟批次可进入赎回", "Mature lots can enter redemption"),
      rewardSource: copy(
        "运营收入路由、订阅资金池与经审核的接入活动。",
        "Operating revenue routing, subscription vault flows, and approved access campaigns.",
      ),
      riskDisclosure: reserveRisk,
      confirmations: [
        copy("锁定 72 天。", "72-day lock-up."),
        copy("本金由 ReserveVault 托管。", "Principal is custodied in ReserveVault."),
        copy("到期后从同一 ReserveVault 赎回。", "Redeem from the same ReserveVault after maturity."),
        networkFeeNote,
      ],
      recentSeatNumber: 61,
    },
    alphaProgram: {
      type: "alpha",
      cardTitle: copy("Alpha Seat", "Alpha Seat"),
      formalLabel: "High-conviction Alpha Seat",
      description: copy(
        "WAN 的长期高风险资本身份，用于稀缺席位与更长期的资本绑定。",
        "WAN's long-duration high-risk capital identity, designed for scarcer seats and tighter long-term capital alignment.",
      ),
      minimum72H: 72_000,
      durationLabel: copy("72 周承诺周期", "72-week mandate"),
      rewardCadenceLabel: copy("每 7 周奖励结算", "Reward settlement every 7 weeks"),
      redemptionLabel: copy("本金不可赎回", "Principal is non-redeemable"),
      rewardSource: copy(
        "AppRewardPool 的运营增长活动、长期策略与精选奖励批次。",
        "Operating growth programs, long-duration strategies, and selected reward batches in AppRewardPool.",
      ),
      riskDisclosure: alphaRisk,
      confirmations: [
        copy("72 周长期配置。", "72-week long-term allocation."),
        copy("本金不可赎回。", "Principal is non-redeemable."),
        copy("可能损失全部本金。", "Full principal loss is possible."),
        networkFeeNote,
      ],
      recentSeatNumber: 7,
    },
    showcaseSeatKeys: ["wan:reserve:7", "wan:alpha:2"],
  },
] as const;

const seatRecords: readonly RawCapitalSeat[] = [
  {
    key: "wan:reserve:7",
    appSlug: "wan",
    type: "reserve",
    seatNumber: 7,
    totalSeats: 72,
    titleEn: "WAN Prime Reserve Seat #07 / 72",
    subtitleZh: "优先储备配置 · Prime 评级 · 已验证资本身份",
    statusLabel: copy("已激活资本身份", "Active Capital Identity"),
    lifecycleLabel: copy("锁定中", "Locked"),
    holder: "Mandate Desk 07",
    walletShort: "UQBW...72H",
    acquiredOn: "2026-03-11",
    tierLabel: copy("Prime", "Prime"),
    txHash: "6e4f...8a07",
    badges: [
      copy("Prime", "Prime"),
      copy("72 天锁定", "72-day lock"),
      copy("奖励窗口开启", "Reward window open"),
    ],
    disclosure: copy("公开验证页不展示配置金额与奖励数值。", "Public verification omits allocation size and reward values."),
    surfaceHref: getCapitalAppPath("wan"),
    surfaceLabel: copy("查看 WAN Capital", "View WAN Capital"),
    tone: "primary",
  },
  {
    key: "wan:alpha:2",
    appSlug: "wan",
    type: "alpha",
    seatNumber: 2,
    totalSeats: 9,
    titleEn: "WAN Prime Alpha Seat #2 / 9",
    subtitleZh: "Alpha 配置 · Prime 评级 · 已验证资本身份",
    statusLabel: copy("已激活资本身份", "Active Capital Identity"),
    lifecycleLabel: copy("有效中", "Active"),
    holder: "Orbit Wallet",
    walletShort: "UQCA...WAN",
    acquiredOn: "2026-02-06",
    tierLabel: copy("Prime", "Prime"),
    txHash: "0b73...cc02",
    badges: [
      copy("Prime", "Prime"),
      copy("72 周承诺", "72-week mandate"),
      copy("公开验证", "Public verification"),
    ],
    disclosure: copy("公开验证页不展示配置金额与奖励数值。", "Public verification omits allocation size and reward values."),
    surfaceHref: getCapitalAppPath("wan"),
    surfaceLabel: copy("查看 WAN Capital", "View WAN Capital"),
    tone: "gold",
  },
  {
    key: "72hours:reserve:18",
    appSlug: "72hours",
    type: "reserve",
    seatNumber: 18,
    totalSeats: 72,
    titleEn: "72hours Select Reserve Seat #18 / 72",
    subtitleZh: "优先储备配置 · Historical Capital Identity",
    statusLabel: copy("历史资本身份", "Historical Capital Identity"),
    lifecycleLabel: copy("历史", "Historical"),
    holder: "Northbound Office",
    walletShort: "UQ72...R18",
    acquiredOn: "2025-12-14",
    tierLabel: copy("Select", "Select"),
    txHash: "a918...7218",
    badges: [
      copy("Historical", "Historical"),
      copy("原编号保留", "Original seat retained"),
      copy("可重新激活", "Reactivation eligible"),
    ],
    disclosure: copy("公开验证页不展示配置金额与奖励数值。", "Public verification omits allocation size and reward values."),
    surfaceHref: getCapitalAppPath("72hours"),
    surfaceLabel: copy("查看 72hours Capital", "View 72hours Capital"),
    tone: "muted",
  },
  {
    key: "72hours:alpha:3",
    appSlug: "72hours",
    type: "alpha",
    seatNumber: 3,
    totalSeats: 9,
    titleEn: "72hours Strategic Alpha Seat #3 / 9",
    subtitleZh: "Alpha 配置 · Strategic 评级 · 已验证资本身份",
    statusLabel: copy("已激活资本身份", "Active Capital Identity"),
    lifecycleLabel: copy("有效中", "Active"),
    holder: "Signal Account",
    walletShort: "UQ72...A03",
    acquiredOn: "2025-11-02",
    tierLabel: copy("Strategic", "Strategic"),
    txHash: "15de...7203",
    badges: [
      copy("Strategic", "Strategic"),
      copy("72 周承诺", "72-week mandate"),
      copy("7 周结算", "7-week settlement"),
    ],
    disclosure: copy("公开验证页不展示配置金额与奖励数值。", "Public verification omits allocation size and reward values."),
    surfaceHref: getCapitalAppPath("72hours"),
    surfaceLabel: copy("查看 72hours Capital", "View 72hours Capital"),
    tone: "gold",
  },
  {
    key: "multi-millionaire:reserve:32",
    appSlug: "multi-millionaire",
    type: "reserve",
    seatNumber: 32,
    totalSeats: 72,
    titleEn: "multi-millionaire Large Reserve Seat #32 / 72",
    subtitleZh: "优先储备配置 · Large tier · 已验证资本身份",
    statusLabel: copy("已激活资本身份", "Active Capital Identity"),
    lifecycleLabel: copy("成熟可赎回", "Matured"),
    holder: "MM Reserve Office",
    walletShort: "UQMM...R32",
    acquiredOn: "2025-10-18",
    tierLabel: copy("Large", "Large"),
    txHash: "83af...mm32",
    badges: [
      copy("Large", "Large"),
      copy("成熟批次", "Matured lot"),
      copy("可从 ReserveVault 赎回", "ReserveVault redeemable"),
    ],
    disclosure: copy("公开验证页不展示配置金额与奖励数值。", "Public verification omits allocation size and reward values."),
    surfaceHref: getCapitalAppPath("multi-millionaire"),
    surfaceLabel: copy("查看 multi-millionaire Capital", "View multi-millionaire Capital"),
    tone: "primary",
  },
  {
    key: "multi-millionaire:alpha:1",
    appSlug: "multi-millionaire",
    type: "alpha",
    seatNumber: 1,
    totalSeats: 9,
    titleEn: "multi-millionaire Completed Alpha Seat #1 / 9",
    subtitleZh: "已完成 Alpha Mandate · 长周期承诺已完成",
    statusLabel: copy("已完成 Alpha Mandate", "Completed Alpha Mandate"),
    lifecycleLabel: copy("已完成", "Completed"),
    holder: "Portfolio Council",
    walletShort: "UQMM...A01",
    acquiredOn: "2024-11-07",
    tierLabel: copy("Completed", "Completed"),
    txHash: "7d19...mm01",
    badges: [
      copy("Completed", "Completed"),
      copy("Mandate Credential", "Mandate credential"),
      copy("身份升级", "Identity upgraded"),
    ],
    disclosure: copy("公开验证页不展示配置金额与奖励数值。", "Public verification omits allocation size and reward values."),
    surfaceHref: getCapitalAppPath("multi-millionaire"),
    surfaceLabel: copy("查看 multi-millionaire Capital", "View multi-millionaire Capital"),
    tone: "gold",
  },
] as const;

const portfolioHoldings: readonly RawPortfolioHolding[] = [
  {
    seatKey: "wan:reserve:7",
    position: copy("8,640 72H · 3 个 Reserve 批次", "8,640 72H across 3 reserve lots"),
    claimableReward: 126,
    privateNote: copy("其中 1 个批次已到期，可从 ReserveVault 申请赎回。", "One reserve lot is already mature and can request redemption from ReserveVault."),
  },
  {
    seatKey: "72hours:alpha:3",
    position: copy("720,000 72H · Strategic Alpha", "720,000 72H committed as Strategic Alpha"),
    claimableReward: 1_080,
    privateNote: copy("当前处于第 11 个结算周期，下次结算窗口在 2026-06-04。", "Currently in settlement cycle 11, with the next window opening on 2026-06-04."),
  },
  {
    seatKey: "72hours:reserve:18",
    position: copy("原席位已全部赎回，身份保留。", "Original reserve fully redeemed; identity retained."),
    claimableReward: 0,
    privateNote: copy("重新配置 >= 720 72H 后，可恢复原编号。", "Reallocate >= 720 72H to reactivate the original seat number."),
  },
  {
    seatKey: "multi-millionaire:alpha:1",
    position: copy("7,200,000 72H · Completed Alpha Mandate", "7,200,000 72H completed under a full Alpha mandate"),
    claimableReward: 0,
    privateNote: copy("Completed Credential 已发放，但本金仍不支持赎回。", "Completed credential is issued, while principal remains non-redeemable."),
  },
] as const;

const reserveLots: readonly RawReserveLot[] = [
  {
    seatKey: "wan:reserve:7",
    label: copy("WAN Prime Reserve Seat #07 · Batch A", "WAN Prime Reserve Seat #07 · Batch A"),
    amount72H: 3_600,
    allocatedOn: "2026-02-10",
    unlockOn: "2026-04-22",
    status: copy("已成熟", "Matured"),
    action: copy("可申请部分赎回", "Partial redemption available"),
    tone: "primary",
  },
  {
    seatKey: "wan:reserve:7",
    label: copy("WAN Prime Reserve Seat #07 · Batch B", "WAN Prime Reserve Seat #07 · Batch B"),
    amount72H: 2_400,
    allocatedOn: "2026-03-29",
    unlockOn: "2026-06-09",
    status: copy("锁定中", "Locked"),
    action: copy("等待到期", "Wait for maturity"),
    tone: "muted",
  },
  {
    seatKey: "wan:reserve:7",
    label: copy("WAN Prime Reserve Seat #07 · Batch C", "WAN Prime Reserve Seat #07 · Batch C"),
    amount72H: 2_640,
    allocatedOn: "2026-04-07",
    unlockOn: "2026-06-18",
    status: copy("锁定中", "Locked"),
    action: copy("等待到期", "Wait for maturity"),
    tone: "muted",
  },
  {
    seatKey: "72hours:reserve:18",
    label: copy("72hours Select Reserve Seat #18 · Final redemption", "72hours Select Reserve Seat #18 · Final redemption"),
    amount72H: 720,
    allocatedOn: "2025-12-14",
    unlockOn: "2026-02-24",
    status: copy("已完成赎回", "Redeemed"),
    action: copy("席位可重新激活", "Seat can be reactivated"),
    tone: "gold",
  },
] as const;

const alphaCycles: readonly RawAlphaCycle[] = [
  {
    seatKey: "72hours:alpha:3",
    label: copy("72hours Strategic Alpha Seat #3 · Cycle 11", "72hours Strategic Alpha Seat #3 · Cycle 11"),
    period: copy("第 11 / 72 周期", "Cycle 11 / 72"),
    schedule: copy("下次结算窗口：2026-06-04", "Next settlement window: 2026-06-04"),
    settledReward72H: 1_080,
    status: copy("等待结算", "Awaiting settlement"),
    note: copy("Alpha 奖励按 7 周结算，奖励权重更高，但可为 0。", "Alpha rewards settle every 7 weeks with higher reward weight, but may be 0."),
    tone: "gold",
  },
  {
    seatKey: "multi-millionaire:alpha:1",
    label: copy("multi-millionaire Completed Alpha Seat #1 · Cycle 72", "multi-millionaire Completed Alpha Seat #1 · Cycle 72"),
    period: copy("72 / 72 周期已完成", "Cycle 72 / 72 completed"),
    schedule: copy("Completed Mandate 已生成", "Completed mandate credential issued"),
    settledReward72H: 0,
    status: copy("已完成", "Completed"),
    note: copy("Completed Alpha 仅升级身份视觉与 Credential，不提供本金赎回。", "Completed Alpha upgrades identity status and credential only; it does not unlock principal redemption."),
    tone: "primary",
  },
] as const;

const credentials: readonly RawCredential[] = [
  {
    title: "First Allocation",
    body: copy("完成首个 Capital 配置。", "Completed the first Capital allocation."),
    achievedOn: "2025-12-14",
    tone: "primary",
  },
  {
    title: "Reserve Mandate",
    body: copy("持有至少一个有效 Reserve Seat。", "Holds at least one active Reserve Seat."),
    achievedOn: "2026-03-11",
    tone: "primary",
  },
  {
    title: "Alpha Mandate",
    body: copy("持有至少一个 Alpha Seat。", "Holds at least one Alpha Seat."),
    achievedOn: "2025-11-02",
    tone: "gold",
  },
  {
    title: "Strategic Mandate",
    body: copy("达到 Strategic Alpha 评级。", "Reached the Strategic Alpha tier."),
    achievedOn: "2025-11-02",
    tone: "gold",
  },
  {
    title: "Completed Alpha Mandate",
    body: copy("完成完整 72 周 Alpha 周期。", "Completed a full 72-week Alpha cycle."),
    achievedOn: "2026-04-02",
    tone: "gold",
  },
  {
    title: "Portfolio Mandate",
    body: copy("同时持有 Active、Historical 与 Completed 身份。", "Holds active, historical, and completed identity states together."),
    achievedOn: "2026-04-09",
    tone: "muted",
  },
  {
    title: "Capital Network I",
    body: copy("邀请 3 位成员完成配置。", "Invited 3 members to complete allocation."),
    achievedOn: "2026-04-18",
    tone: "primary",
  },
] as const;

function getAppRecord(slug: CapitalAppSlug) {
  return appRecords.find((app) => app.slug === slug);
}

function getSeatRecord(seatKey: CapitalSeatKey) {
  return seatRecords.find((seat) => seat.key === seatKey);
}

function mapSeat(locale: Locale, rawSeat: RawCapitalSeat): CapitalIdentityCardView {
  const app = getAppRecord(rawSeat.appSlug);

  if (!app) {
    throw new Error(`Missing app record for ${rawSeat.appSlug}`);
  }

  return {
    key: rawSeat.key,
    appSlug: rawSeat.appSlug,
    appName: app.name,
    brand: app.brand,
    title: rawSeat.titleEn,
    subtitle: rawSeat.subtitleZh,
    statusLabel: pick(locale, rawSeat.statusLabel),
    lifecycleLabel: pick(locale, rawSeat.lifecycleLabel),
    badges: rawSeat.badges.map((badge) => pick(locale, badge)),
    disclosure: pick(locale, rawSeat.disclosure),
    verificationHref: getCapitalSeatVerifyPath(rawSeat.appSlug, rawSeat.type, rawSeat.seatNumber),
    surfaceHref: rawSeat.surfaceHref,
    surfaceLabel: pick(locale, rawSeat.surfaceLabel),
    surfaceExternal: false,
    tone: rawSeat.tone,
    meta: [
      {
        label: locale === "en-US" ? "Seat" : "席位",
        value: formatSeatNumber(rawSeat.seatNumber, rawSeat.totalSeats),
      },
      {
        label: locale === "en-US" ? "Tier" : "评级",
        value: pick(locale, rawSeat.tierLabel),
      },
      {
        label: locale === "en-US" ? "Wallet" : "钱包",
        value: rawSeat.walletShort,
      },
      {
        label: locale === "en-US" ? "Acquired" : "获取时间",
        value: formatDate(locale, rawSeat.acquiredOn),
      },
    ],
  };
}

function buildReserveTierView(locale: Locale) {
  return reserveTiers.map((tier) => ({
    label: pick(locale, tier.label),
    threshold: formatAmount(locale, tier.threshold),
    note: pick(locale, tier.note),
  }));
}

function buildAlphaTierView(locale: Locale, app: RawCapitalApp) {
  const base = app.alphaProgram.minimum72H;

  return [
    {
      label: locale === "en-US" ? "Prime Alpha Seat" : "Prime Alpha Seat",
      threshold: formatAmount(locale, base),
      note: locale === "en-US" ? "1x application Alpha threshold." : "1x 应用 Alpha 门槛。",
    },
    {
      label: locale === "en-US" ? "Strategic Alpha Seat" : "Strategic Alpha Seat",
      threshold: formatAmount(locale, base * 10),
      note: locale === "en-US" ? "10x application Alpha threshold." : "10x 应用 Alpha 门槛。",
    },
    {
      label: locale === "en-US" ? "Large Alpha Seat" : "Large Alpha Seat",
      threshold: formatAmount(locale, base * 100),
      note: locale === "en-US" ? "100x application Alpha threshold." : "100x 应用 Alpha 门槛。",
    },
  ];
}

function mapProgram(
  locale: Locale,
  app: RawCapitalApp,
  program: RawCapitalProgram,
  remainingSeats: number,
  verifySeatKey: CapitalSeatKey,
): CapitalSeatProgramView {
  const verifySeat = getSeatRecord(verifySeatKey);

  if (!verifySeat) {
    throw new Error(`Missing verification seat ${verifySeatKey}`);
  }

  return {
    type: program.type,
    title: pick(locale, program.cardTitle),
    formalLabel: program.formalLabel,
    description: pick(locale, program.description),
    metrics: [
      {
        label: program.type === "alpha"
          ? locale === "en-US" ? "Launch status" : "开放状态"
          : locale === "en-US" ? "Remaining seats" : "剩余席位",
        value: program.type === "alpha"
          ? locale === "en-US" ? "Closed for v1" : "v1 暂不开放"
          : `${remainingSeats} / 72`,
        tone: program.type === "alpha" ? "gold" : "primary",
      },
      {
        label: locale === "en-US" ? "Minimum" : "最低门槛",
        value: formatAmount(locale, program.minimum72H),
      },
      {
        label: locale === "en-US" ? "Duration" : "周期",
        value: pick(locale, program.durationLabel),
      },
      {
        label: locale === "en-US" ? "Reward cadence" : "奖励节奏",
        value: pick(locale, program.rewardCadenceLabel),
      },
      {
        label: locale === "en-US" ? "Redemption" : "赎回规则",
        value: pick(locale, program.redemptionLabel),
      },
      {
        label: locale === "en-US" ? "Latest issued" : "最近编号",
        value: formatSeatNumber(program.recentSeatNumber, program.type === "reserve" ? 72 : 9),
      },
    ],
    confirmations: program.confirmations.map((item) => pick(locale, item)),
    riskDisclosure: pick(locale, program.riskDisclosure),
    cta: {
      label: locale === "en-US"
        ? `Request ${program.type === "reserve" ? "Reserve" : "Alpha"} Seat`
        : `请求 ${program.type === "reserve" ? "Reserve" : "Alpha"} 席位`,
      href: "/capital/me",
      variant: "primary",
    },
    verifyAction: {
      label: locale === "en-US" ? "Verify seat" : "验证席位",
      href: getCapitalSeatVerifyPath(verifySeat.appSlug, verifySeat.type, verifySeat.seatNumber),
      variant: "secondary",
    },
    tone: program.type === "alpha" ? "gold" : "primary",
  };
}

function sum<T>(values: readonly T[], pickValue: (value: T) => number) {
  return values.reduce((total, value) => total + pickValue(value), 0);
}

export function getCapitalOverview(locale: Locale): CapitalOverviewView {
  const totalReserveRemaining = sum(appRecords, (app) => app.reserveRemaining);
  const totalAlphaRemaining = sum(appRecords, (app) => app.alphaRemaining);
  const totalReserveSeats = appRecords.length * 72;
  const totalAlphaSeats = appRecords.length * 9;
  const totalParticipants = sum(appRecords, (app) => app.participants);
  const totalTvl = sum(appRecords, (app) => app.tvl72H);

  return {
    hero: {
      kicker: "72H Capital",
      title: locale === "en-US"
        ? "Review verified capital seats in selected 72H ecosystem applications."
        : "核对 72H 生态精选应用的可验证资本席位。",
      lead: locale === "en-US"
        ? "Reserve and Alpha seats introduce limited capital identity across the first three applications, with public verification and wallet-bound seat numbers."
        : "Reserve 与 Alpha 席位把首批三款应用纳入同一资本身份体系，强调限量编号、钱包绑定与公开验证。",
      noteLabel: locale === "en-US" ? "First release" : "首批开放",
      noteTitle: locale === "en-US" ? "243 limited seats across 3 applications." : "3 个应用，共 243 个限量席位。",
      noteBody: locale === "en-US"
        ? "Phase one keeps seats non-transferable, verification public, and amount disclosure private. Figures on this page are current review figures under the published seat rules."
        : "第一期席位不可转让、验证公开、金额私有。本页数据为当前核对数值，并遵循已公开席位规则。",
      chips: [
        "multi-millionaire",
        "72hours",
        "WAN",
        locale === "en-US" ? "72-day Reserve" : "72 天 Reserve",
        locale === "en-US" ? "72-week Alpha" : "72 周 Alpha",
      ],
    },
    summaryMetrics: [
      {
        label: locale === "en-US" ? "Applications" : "应用数",
        value: String(appRecords.length),
        hint: locale === "en-US" ? "First release set" : "首批开放",
        tone: "primary",
      },
      {
        label: locale === "en-US" ? "Reserve seats" : "Reserve 席位",
        value: `${totalReserveSeats - totalReserveRemaining} / ${totalReserveSeats}`,
        hint: locale === "en-US" ? `${totalReserveRemaining} still open` : `剩余 ${totalReserveRemaining}`,
      },
      {
        label: locale === "en-US" ? "Alpha seats" : "Alpha 席位",
        value: `${totalAlphaSeats - totalAlphaRemaining} / ${totalAlphaSeats}`,
        hint: locale === "en-US" ? "Closed until Reserve is stable" : "Reserve 稳定前保持关闭",
        tone: "gold",
      },
      {
        label: locale === "en-US" ? "Review allocation total" : "核对配置总量",
        value: formatAmount(locale, totalTvl),
      },
      {
        label: locale === "en-US" ? "Seat holders" : "席位持有人",
        value: new Intl.NumberFormat(locale).format(totalParticipants),
      },
    ],
    programs: [
      {
        type: "reserve",
        title: locale === "en-US" ? "Principal-custodied Reserve Seat" : "Principal-custodied Reserve Seat",
        formalLabel: locale === "en-US" ? "Reserve Seat" : "Reserve Seat",
        body: locale === "en-US"
          ? "Principal-first capital entry with a 72-day lock-up, lot-based top-ups, and redemption only after maturity."
          : "本金优先的资本入口，72 天锁定，支持批次化追加，并仅在到期后开放赎回。",
        metrics: [
          {
            label: locale === "en-US" ? "Seat supply" : "席位供给",
            value: "72 / app",
          },
          {
            label: locale === "en-US" ? "Entry threshold" : "起始门槛",
            value: formatAmount(locale, 720),
          },
          {
            label: locale === "en-US" ? "Reward window" : "奖励窗口",
            value: locale === "en-US" ? "Every 7 days" : "每 7 天",
          },
          {
            label: locale === "en-US" ? "Network fees" : "网络费用",
            value: pick(locale, networkFeeNote),
          },
        ],
        bullets: [
          locale === "en-US" ? "Reserve identity stays even after full principal redemption." : "全部本金赎回后，Reserve 身份依然保留。",
          locale === "en-US" ? "Top-ups create new lock lots without changing seat number." : "追加会形成新锁定批次，但不改变席位编号。",
          locale === "en-US" ? "Mature principal is redeemed from the same ReserveVault." : "到期本金从同一 ReserveVault 赎回。",
        ],
        riskDisclosure: pick(locale, reserveRisk),
        tone: "primary",
      },
      {
        type: "alpha",
        title: locale === "en-US" ? "High-conviction Alpha Seat" : "High-conviction Alpha Seat",
        formalLabel: locale === "en-US" ? "Alpha Seat" : "Alpha Seat",
        body: locale === "en-US"
          ? "Scarce, longer-duration, higher-risk capital identity with a 72-week mandate and non-redeemable principal."
          : "稀缺、长期、更高风险的资本身份，采用 72 周承诺周期，本金不可赎回。",
        metrics: [
          {
            label: locale === "en-US" ? "Seat supply" : "席位供给",
            value: "9 / app",
            tone: "gold",
          },
          {
            label: locale === "en-US" ? "Entry threshold" : "起始门槛",
            value: locale === "en-US"
              ? "72,000 or 720,000 72H"
              : "72,000 或 720,000 72H",
          },
          {
            label: locale === "en-US" ? "Settlement window" : "结算窗口",
            value: locale === "en-US" ? "Every 7 weeks" : "每 7 周",
          },
          {
            label: locale === "en-US" ? "Principal" : "本金",
            value: locale === "en-US" ? "Non-redeemable" : "不可赎回",
          },
        ],
        bullets: [
          locale === "en-US" ? "Alpha can top up without changing seat number." : "Alpha 允许追加，但不改变席位编号。",
          locale === "en-US" ? "Completed Alpha upgrades identity status after week 72." : "第 72 周后可升级为 Completed Alpha 身份。",
          locale === "en-US" ? "No public verification page reveals amounts, rewards, or loss figures." : "公开验证页不会展示金额、奖励或亏损数值。",
        ],
        riskDisclosure: pick(locale, alphaRisk),
        tone: "gold",
      },
    ],
    apps: appRecords.map((app) => ({
      slug: app.slug,
      name: app.name,
      brand: app.brand,
      summary: pick(locale, app.summary),
      statusLabel: pick(locale, app.statusLabel),
      riskBand: pick(locale, app.riskBand),
      metrics: [
        {
          label: locale === "en-US" ? "Review allocation total" : "核对配置总量",
          value: formatAmount(locale, app.tvl72H),
        },
        {
          label: locale === "en-US" ? "Seat holders" : "席位持有人",
          value: new Intl.NumberFormat(locale).format(app.participants),
        },
        {
          label: locale === "en-US" ? "Reserve open" : "Reserve 余量",
          value: `${app.reserveRemaining} / 72`,
        },
        {
          label: locale === "en-US" ? "Alpha status" : "Alpha 状态",
          value: locale === "en-US" ? "Closed for v1" : "v1 暂不开放",
          tone: "gold",
        },
      ],
      reserveLabel: `${locale === "en-US" ? "Reserve from" : "Reserve 自"} ${formatAmount(locale, app.reserveProgram.minimum72H)}`,
      alphaLabel: `${locale === "en-US" ? "Alpha threshold" : "Alpha 门槛"} ${formatAmount(locale, app.alphaProgram.minimum72H)}`,
      detailHref: getCapitalAppPath(app.slug),
      verifyHref: getCapitalSeatVerifyPath(app.slug, "reserve", app.reserveProgram.recentSeatNumber),
    })),
    portfolioCallout: {
      kicker: locale === "en-US" ? "My Capital" : "我的 Capital",
      title: locale === "en-US"
        ? "Inspect active, historical, and completed capital identity in one place."
        : "在同一页查看 Active、Historical 与 Completed Capital 身份。",
      body: locale === "en-US"
        ? "The portfolio view groups identity cards, reserve lots, alpha settlement cycles, credentials, and invite status for review."
        : "组合页集中展示身份卡、Reserve 批次、Alpha 周期、Credential 与邀请状态。",
      actions: [
        {
          label: locale === "en-US" ? "Open My Capital" : "打开我的 Capital",
          href: "/capital/me",
          variant: "primary",
        },
        {
          label: locale === "en-US" ? "Review verification" : "查看验证页",
          href: getCapitalSeatVerifyPath("multi-millionaire", "alpha", 1),
          variant: "secondary",
        },
      ],
    },
  };
}

export function getCapitalAppPage(locale: Locale, slug: CapitalAppSlug): CapitalAppPageView | undefined {
  const app = getAppRecord(slug);

  if (!app) {
    return undefined;
  }

  const [reserveSeatKey, alphaSeatKey] = app.showcaseSeatKeys;
  const reserveSeat = getSeatRecord(reserveSeatKey);
  const alphaSeat = getSeatRecord(alphaSeatKey);

  if (!reserveSeat || !alphaSeat) {
    throw new Error(`Missing showcase seats for ${slug}`);
  }

  return {
    slug: app.slug,
    name: app.name,
    brand: app.brand,
    hero: {
      kicker: "72H Capital",
      title: `${app.name} Capital`,
      lead: pick(locale, app.lead),
      noteLabel: locale === "en-US" ? "Current release" : "当前批次",
      noteTitle: locale === "en-US"
        ? `${pick(locale, app.statusLabel)} · ${pick(locale, app.riskBand)}`
        : `${pick(locale, app.statusLabel)} · ${pick(locale, app.riskBand)}`,
      noteBody: pick(locale, app.noteBody),
      chips: [
        pick(locale, app.statusLabel),
        pick(locale, app.riskBand),
        locale === "en-US" ? "Public verification" : "公开验证",
        locale === "en-US" ? `Updated ${formatDate(locale, app.updatedOn)}` : `更新于 ${formatDate(locale, app.updatedOn)}`,
      ],
    },
    surfaceAction: {
      label: pick(locale, app.surfaceLabel),
      href: app.surfaceHref,
      external: app.surfaceExternal,
      variant: "primary",
    },
    overviewMetrics: [
      {
        label: locale === "en-US" ? "Review allocation total" : "核对配置总量",
        value: formatAmount(locale, app.tvl72H),
      },
      {
        label: locale === "en-US" ? "Seat holders" : "席位持有人",
        value: new Intl.NumberFormat(locale).format(app.participants),
      },
      {
        label: locale === "en-US" ? "Reserve remaining" : "Reserve 余量",
        value: `${app.reserveRemaining} / 72`,
        tone: "primary",
      },
      {
        label: locale === "en-US" ? "Alpha status" : "Alpha 状态",
        value: locale === "en-US" ? "Closed for v1" : "v1 暂不开放",
        tone: "gold",
      },
      {
        label: locale === "en-US" ? "Reward source" : "奖励来源",
        value: pick(locale, app.rewardSourceSummary),
      },
      {
        label: locale === "en-US" ? "Updated" : "更新时间",
        value: formatDate(locale, app.updatedOn),
      },
    ],
    highlights: app.highlights.map((item) => pick(locale, item)),
    reserveProgram: mapProgram(locale, app, app.reserveProgram, app.reserveRemaining, reserveSeatKey),
    alphaProgram: mapProgram(locale, app, app.alphaProgram, app.alphaRemaining, alphaSeatKey),
    reserveTiers: buildReserveTierView(locale),
    alphaTiers: buildAlphaTierView(locale, app),
    showcaseSeats: [mapSeat(locale, reserveSeat), mapSeat(locale, alphaSeat)],
    policyNote: {
      eyebrow: locale === "en-US" ? "Disclosure boundary" : "披露边界",
      title: locale === "en-US"
        ? "Verification is public. Allocation size, reward, and loss figures stay private."
        : "验证信息公开，但配置金额、奖励与亏损数值保持私有。",
      body: locale === "en-US"
        ? "Capital identity is designed to prove seat ownership, sequence, state, and credential status without turning the verification page into a balance dashboard."
        : "Capital 身份用于证明席位归属、编号顺序、状态与 Credential，不把验证页变成金额看板。",
    },
  };
}

export function getCapitalPortfolio(locale: Locale): CapitalPortfolioView {
  const mappedHoldings = portfolioHoldings.map((holding) => {
    const rawSeat = getSeatRecord(holding.seatKey);

    if (!rawSeat) {
      throw new Error(`Missing portfolio seat ${holding.seatKey}`);
    }

    return {
      ...mapSeat(locale, rawSeat),
      position: pick(locale, holding.position),
      claimableReward: formatAmount(locale, holding.claimableReward),
      privateNote: pick(locale, holding.privateNote),
    };
  });

  return {
    hero: {
      kicker: "72H Capital",
      title: locale === "en-US" ? "My Capital Identity" : "我的资本身份",
      lead: locale === "en-US"
        ? "A review-only portfolio view for active, historical, and completed capital identity across the first release."
        : "仅供核对的首批 Capital 身份组合页，覆盖 Active、Historical 与 Completed 状态。",
      noteLabel: locale === "en-US" ? "Portfolio state" : "组合状态",
      noteTitle: locale === "en-US" ? "4 seats across 3 applications." : "3 个应用，共 4 个席位。",
      noteBody: locale === "en-US"
        ? "This page groups private portfolio context with public identity surfaces: reserve lots, alpha cycles, credentials, and invite progress."
        : "该页面把私有组合信息与公开身份界面并置，集中展示 Reserve 批次、Alpha 周期、Credential 与邀请进度。",
      chips: [
        locale === "en-US" ? "2 active" : "2 个 Active",
        locale === "en-US" ? "1 historical" : "1 个 Historical",
        locale === "en-US" ? "1 completed" : "1 个 Completed",
      ],
    },
    summaryMetrics: [
      {
        label: locale === "en-US" ? "Active seats" : "Active 席位",
        value: "2",
        tone: "primary",
      },
      {
        label: locale === "en-US" ? "Historical seats" : "Historical 席位",
        value: "1",
      },
      {
        label: locale === "en-US" ? "Completed seats" : "Completed 席位",
        value: "1",
        tone: "gold",
      },
      {
        label: locale === "en-US" ? "Available reward record" : "可用奖励记录",
        value: formatAmount(locale, 1_206),
      },
      {
        label: locale === "en-US" ? "Credentials" : "Credential",
        value: String(credentials.length),
      },
    ],
    holdings: mappedHoldings,
    reserveLots: reserveLots.map((lot) => ({
      title: pick(locale, lot.label),
      seatHref: (() => {
        const seat = getSeatRecord(lot.seatKey);
        return seat ? getCapitalSeatVerifyPath(seat.appSlug, seat.type, seat.seatNumber) : getCapitalSeatVerifyPath("wan", "reserve", 7);
      })(),
      tone: lot.tone,
      meta: [
        {
          label: locale === "en-US" ? "Amount" : "金额",
          value: formatAmount(locale, lot.amount72H),
        },
        {
          label: locale === "en-US" ? "Allocated" : "配置时间",
          value: formatDate(locale, lot.allocatedOn),
        },
        {
          label: locale === "en-US" ? "Unlocks" : "解锁时间",
          value: formatDate(locale, lot.unlockOn),
        },
        {
          label: locale === "en-US" ? "Status" : "状态",
          value: pick(locale, lot.status),
        },
        {
          label: locale === "en-US" ? "Next action" : "下一步",
          value: pick(locale, lot.action),
        },
      ],
    })),
    alphaCycles: alphaCycles.map((cycle) => ({
      title: pick(locale, cycle.label),
      seatHref: getCapitalSeatVerifyPath(
        getSeatRecord(cycle.seatKey)?.appSlug ?? "72hours",
        getSeatRecord(cycle.seatKey)?.type ?? "alpha",
        getSeatRecord(cycle.seatKey)?.seatNumber ?? 3,
      ),
      tone: cycle.tone,
      meta: [
        {
          label: locale === "en-US" ? "Period" : "周期",
          value: pick(locale, cycle.period),
        },
        {
          label: locale === "en-US" ? "Schedule" : "时间",
          value: pick(locale, cycle.schedule),
        },
        {
          label: locale === "en-US" ? "Recorded reward" : "已记录奖励",
          value: formatAmount(locale, cycle.settledReward72H),
        },
        {
          label: locale === "en-US" ? "Status" : "状态",
          value: pick(locale, cycle.status),
        },
        {
          label: locale === "en-US" ? "Note" : "说明",
          value: pick(locale, cycle.note),
        },
      ],
    })),
    credentials: credentials.map((credential) => ({
      title: credential.title,
      body: pick(locale, credential.body),
      achievedOn: formatDate(locale, credential.achievedOn),
      tone: credential.tone,
    })),
    inviteMetrics: [
      {
        label: locale === "en-US" ? "Verified invites" : "有效邀请",
        value: "5",
        tone: "primary",
      },
      {
        label: locale === "en-US" ? "Current network credential" : "当前网络 Credential",
        value: "Capital Network I",
      },
      {
        label: locale === "en-US" ? "To next credential" : "距离下一等级",
        value: "4",
      },
    ],
    shareCard: mapSeat(locale, getSeatRecord("multi-millionaire:alpha:1")!),
    shareActions: [
      {
        label: locale === "en-US" ? "Verify identity" : "验证身份",
        href: getCapitalSeatVerifyPath("multi-millionaire", "alpha", 1),
        variant: "primary",
      },
      {
        label: locale === "en-US" ? "Browse seats" : "浏览席位",
        href: "/capital",
        variant: "secondary",
      },
    ],
  };
}

export function getCapitalVerification(
  locale: Locale,
  slug: CapitalAppSlug,
  type: CapitalSeatType,
  seatNumber: number,
): CapitalVerificationView | undefined {
  const rawSeat = seatRecords.find(
    (seat) => seat.appSlug === slug && seat.type === type && seat.seatNumber === seatNumber,
  );

  if (!rawSeat) {
    return undefined;
  }

  const seat = mapSeat(locale, rawSeat);

  return {
    hero: {
      kicker: "72H Capital",
      title: locale === "en-US" ? "Verified Capital Identity" : "已验证资本身份",
      lead: locale === "en-US"
        ? "Public seat verification confirms identity, sequence, state, and credential metadata only."
        : "公开验证页仅确认身份、编号顺序、状态与 Credential 元数据。",
      noteLabel: locale === "en-US" ? "Public record" : "公开记录",
      noteTitle: seat.title,
      noteBody: locale === "en-US"
        ? "Allocation amount, reward, and loss figures are intentionally excluded from this page."
        : "本页有意不展示配置金额、奖励与亏损数值。",
      chips: [
        seat.appName,
        type === "reserve"
          ? locale === "en-US" ? "Reserve Seat" : "Reserve Seat"
          : locale === "en-US" ? "Alpha Seat" : "Alpha Seat",
        seat.lifecycleLabel,
      ],
    },
    seat,
    publicMetrics: [
      {
        label: locale === "en-US" ? "Application" : "应用",
        value: seat.appName,
      },
      {
        label: locale === "en-US" ? "Seat type" : "席位类型",
        value: type === "reserve"
          ? locale === "en-US" ? "Principal-custodied Reserve Seat" : "Principal-custodied Reserve Seat"
          : locale === "en-US" ? "High-conviction Alpha Seat" : "High-conviction Alpha Seat",
      },
      {
        label: locale === "en-US" ? "Seat number" : "席位编号",
        value: formatSeatNumber(rawSeat.seatNumber, rawSeat.totalSeats),
      },
      {
        label: locale === "en-US" ? "Status" : "身份状态",
        value: seat.statusLabel,
      },
      {
        label: locale === "en-US" ? "Lifecycle" : "状态",
        value: seat.lifecycleLabel,
      },
      {
        label: locale === "en-US" ? "Holder" : "持有人",
        value: rawSeat.holder,
      },
      {
        label: locale === "en-US" ? "Wallet" : "钱包",
        value: rawSeat.walletShort,
      },
      {
        label: locale === "en-US" ? "Acquired" : "获取时间",
        value: formatDate(locale, rawSeat.acquiredOn),
      },
      {
        label: locale === "en-US" ? "Current tier" : "当前评级",
        value: pick(locale, rawSeat.tierLabel),
      },
      {
        label: locale === "en-US" ? "Transaction hash" : "交易哈希",
        value: rawSeat.txHash,
      },
    ],
    riskNote: {
      eyebrow: locale === "en-US" ? "Risk disclosure" : "风险披露",
      title: type === "reserve"
        ? locale === "en-US" ? "Reserve seats use principal-first handling, not principal certainty." : "Reserve 席位采用本金优先处理，但不等于本金确定。"
        : locale === "en-US" ? "Alpha seats are non-redeemable and can lose principal." : "Alpha 席位本金不可赎回，并可能发生本金损失。",
      body: type === "reserve" ? pick(locale, reserveRisk) : pick(locale, alphaRisk),
    },
    actions: [
      {
        label: locale === "en-US" ? "View application" : "查看应用页",
        href: getCapitalAppPath(slug),
        variant: "primary",
      },
      {
        label: locale === "en-US" ? "Open My Capital" : "打开我的 Capital",
        href: "/capital/me",
        variant: "secondary",
      },
    ],
  };
}
