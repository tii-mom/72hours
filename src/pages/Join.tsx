import { type ReactNode } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CircleDollarSign,
  Compass,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { LocalizedLink as Link } from "../components/LocalizedLink";
import { useLocale } from "../lib/locale";

const TOKEN_CONTRACT = "EQBGIzEDvvKObStrcVb6i5Z1-8uYZYtUrYzF2rFZU7xUAXVg";

type EntryCard = {
  body: string;
  cta: string;
  href: string;
  icon: ReactNode;
  kicker: string;
  title: string;
  external?: boolean;
};

function InfoTile({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-sm border border-line/70 bg-background/42 px-4 py-4">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-primary/75">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-sm font-semibold leading-6 text-foreground">{value}</div>
    </div>
  );
}

function EntryLink({ entry }: { entry: EntryCard }) {
  const className = "group flex min-h-44 flex-col justify-between rounded-md border border-line/70 bg-surface/62 p-5 text-left transition-colors hover:border-primary/30 hover:bg-surface/78";
  const content = (
    <>
      <div>
        <div className="flex items-center justify-between gap-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary/70">{entry.kicker}</div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-primary/25 bg-primary/10 text-primary">{entry.icon}</div>
        </div>
        <h2 className="mt-4 text-xl font-black tracking-normal text-foreground">{entry.title}</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">{entry.body}</p>
      </div>
      <div className="mt-5 inline-flex items-center text-xs font-bold uppercase tracking-[0.18em] text-gold">
        {entry.cta}
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </>
  );

  return entry.external ? (
    <a href={entry.href} target="_blank" rel="noreferrer" className={className}>
      {content}
    </a>
  ) : (
    <Link to={entry.href} className={className}>
      {content}
    </Link>
  );
}

export default function Join() {
  const { locale } = useLocale();
  const isEnglish = locale === "en-US";

  const primaryEntries: EntryCard[] = [
    {
      kicker: isEnglish ? "Community" : "社区",
      title: isEnglish ? "Join the public community" : "进入公开社区",
      body: isEnglish
        ? "Follow official updates, ask questions, and enter the current discussion without connecting a wallet on this page."
        : "获取官方更新、提问并进入当前讨论。本页不要求连接钱包，也不处理购买、领取或席位配置。",
      cta: isEnglish ? "Open Telegram" : "打开 Telegram",
      href: "https://t.me/the_72h",
      external: true,
      icon: <MessageCircle className="h-4 w-4" />,
    },
    {
      kicker: isEnglish ? "App map" : "应用地图",
      title: isEnglish ? "Browse ecosystem entries" : "浏览生态入口",
      body: isEnglish
        ? "See which 72H-related apps are live, which are in preparation, and where each official entry points."
        : "查看哪些 72H 相关应用已可进入、哪些仍在建设，以及每个官方入口指向哪里。",
      cta: isEnglish ? "Open app map" : "打开应用地图",
      href: "/ecosystem",
      icon: <Compass className="h-4 w-4" />,
    },
    {
      kicker: isEnglish ? "Green Book" : "绿皮书",
      title: isEnglish ? "Read the public context" : "阅读公开说明",
      body: isEnglish
        ? "Use the Green Book and on-chain evidence to understand the project, boundaries, and fixed-supply facts."
        : "通过绿皮书与链上证据理解项目、边界与固定发行事实。",
      cta: isEnglish ? "Read Green Book" : "阅读绿皮书",
      href: "/greenbook",
      icon: <BookOpen className="h-4 w-4" />,
    },
  ];

  const deeperEntries: EntryCard[] = [
    {
      kicker: isEnglish ? "Learning" : "学习",
      title: isEnglish ? "Learning remains a side path" : "学习是补充路径",
      body: isEnglish
        ? "Learning content helps users understand product use, community work, and basic crypto-app context. It is not the main promise of the site."
        : "学习内容用于帮助用户理解产品使用、社区协作和基础加密应用语境，不作为官网主承诺。",
      cta: isEnglish ? "View learning note" : "查看学习说明",
      href: "/learn",
      icon: <Sparkles className="h-4 w-4" />,
    },
    {
      kicker: isEnglish ? "Capital" : "Capital",
      title: isEnglish ? "Rules are visible, actions are closed" : "规则可读，动作未开放",
      body: isEnglish
        ? "Capital, Reserve, and Alpha pages are read-only rule references now. Real seat actions, purchase, claim, and reward actions are not open."
        : "Capital、Reserve 与 Alpha 页面当前只作为规则参考。真实席位动作、购买、领取和奖励动作均未开放。",
      cta: isEnglish ? "Review boundary" : "查看边界",
      href: "/capital",
      icon: <CircleDollarSign className="h-4 w-4" />,
    },
    {
      kicker: isEnglish ? "Contact" : "联系",
      title: isEnglish ? "Use marked official channels" : "只使用已标记官方渠道",
      body: isEnglish
        ? "Telegram, X, and the contact page form the current contact layer. Any future deeper opening must be announced officially."
        : "Telegram、X 与联系页构成当前联系层。未来如有更深入口开放，必须以官方公告为准。",
      cta: isEnglish ? "View contact" : "查看联系路径",
      href: "/contact",
      icon: <Users className="h-4 w-4" />,
    },
  ];

  return (
    <div className="page-shell pt-20 sm:pt-24">
      <section className="page-section-tight pt-4 sm:pt-10">
        <div className="page-container page-container-wide">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div className="page-kicker w-fit">{isEnglish ? "Official entry" : "官方入口"}</div>
            <div className="hidden items-center gap-2 rounded-sm border border-line/70 bg-surface/58 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:flex">
              <BadgeCheck className="h-3.5 w-3.5 text-primary" />
              72H / TON
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.96fr)_minmax(22rem,0.54fr)] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-[2.65rem] font-black leading-[0.98] tracking-normal text-foreground sm:text-6xl lg:text-7xl">
                {isEnglish ? "Enter 72hours." : "进入 72hours。"}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                {isEnglish
                  ? "Start from the public app map, community, and Green Book. This page is a navigation entry, not a purchase, claim, event, or Capital operation page."
                  : "从公开应用地图、社区和绿皮书开始。本页是导航入口，不是购买台、领取入口、活动页面或 Capital 操作页。"}
              </p>
            </div>
            <div className="rounded-md border border-gold/25 bg-[linear-gradient(180deg,rgba(185,157,87,0.12),rgba(7,14,10,0.72))] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.22)]">
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold">{isEnglish ? "Boundary" : "边界"}</div>
              <h2 className="mt-3 text-2xl font-black leading-tight text-foreground">
                {isEnglish ? "Public information first." : "先看公开信息。"}
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {isEnglish
                  ? "No wallet signature, no real Capital action, no SeasonClaim claim, and no 72H purchase is available on this entry page."
                  : "本入口页不开放钱包签名、真实 Capital 动作、SeasonClaim 领取或 72H 购买。"}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <InfoTile icon={<ShieldCheck className="h-3.5 w-3.5" />} label={isEnglish ? "Token evidence" : "代币证据"} value={TOKEN_CONTRACT} />
            <InfoTile icon={<Compass className="h-3.5 w-3.5" />} label={isEnglish ? "Main path" : "主路径"} value={isEnglish ? "Apps / Community / Green Book" : "应用 / 社区 / 绿皮书"} />
            <InfoTile icon={<BadgeCheck className="h-3.5 w-3.5" />} label={isEnglish ? "Current status" : "当前状态"} value={isEnglish ? "Read-only public entry" : "只读公开入口"} />
          </div>
        </div>
      </section>

      <section className="page-section-tight pt-0">
        <div className="page-container page-container-wide">
          <div className="grid gap-4 lg:grid-cols-3">
            {primaryEntries.map((entry) => (
              <EntryLink key={entry.title} entry={entry} />
            ))}
          </div>
        </div>
      </section>

      <section className="page-section-tight pt-0 pb-20 sm:pb-28">
        <div className="page-container page-container-wide">
          <div className="mb-4 border-b border-line/70 pb-4">
            <div className="page-kicker w-fit">{isEnglish ? "Deeper references" : "补充参考"}</div>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
              {isEnglish
                ? "These references are kept visible for context, but they should not be read as open transaction, seat, or reward flows."
                : "这些入口保留为上下文参考，不应理解为已开放交易、席位或奖励流程。"}
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {deeperEntries.map((entry) => (
              <EntryLink key={entry.title} entry={entry} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
