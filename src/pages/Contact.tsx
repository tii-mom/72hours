import { AtSign, MessageCircle, Users } from "lucide-react";
import { LocalizedLink as Link } from "../components/LocalizedLink";
import { InfoCallout } from "../components/InfoCallout";
import { InfoPageHero } from "../components/InfoPageHero";
import { getChannels } from "../content/channels";
import { getSiteConfig } from "../content/site-config";
import { useLocale } from "../lib/locale";

const CHANNEL_ICONS = {
  telegram: <MessageCircle size={22} />,
  x: <AtSign size={22} />,
  wechat: <Users size={22} />,
  other: <Users size={22} />,
} as const;

export default function Contact() {
  const { locale } = useLocale();
  const isEnglish = locale === "en-US";
  const channels = getChannels(locale);
  const siteConfig = getSiteConfig(locale);
  const getChannel = (type: "telegram" | "x" | "wechat" | "other") =>
    channels.find((channel) => channel.type === type);
  const telegram = getChannel("telegram");
  const xChannel = getChannel("x");
  const wechat = getChannel("wechat");
  const wechatHref = wechat?.url === "/contact" ? "/join" : (wechat?.url ?? "/join");
  const wechatCta =
    wechat?.url === "/contact"
      ? (isEnglish ? "Back to entry" : "回入口")
      : (wechat?.ctaLabel ?? (isEnglish ? "Read notes" : "看说明"));
  const contactChannels = [
    {
      icon: CHANNEL_ICONS.telegram,
      title: telegram?.label ?? "Telegram",
      status: telegram?.statusNote ?? "主社区",
      body: telegram?.suitableFor.join(" / ") ?? (isEnglish ? "Community and official notes" : "社区与官方说明"),
      expectation:
        telegram?.expectationAfterJoining ?? (isEnglish ? ["Community discussion", "Project updates"] : ["社区讨论", "项目更新"]),
      href: telegram?.url ?? "https://t.me/the_72h",
      cta: telegram?.ctaLabel ?? (isEnglish ? "Enter" : "进入"),
      note: telegram?.officialVerificationNote ?? (isEnglish ? "Telegram is the main entry point." : "Telegram 是主入口。"),
    },
    {
      icon: CHANNEL_ICONS.x,
      title: xChannel?.label ?? "X",
      status: xChannel?.statusNote ?? "公开动态",
      body: xChannel?.suitableFor.join(" / ") ?? (isEnglish ? "Public updates / Quick context" : "公开动态 / 快速了解"),
      expectation:
        xChannel?.expectationAfterJoining ?? (isEnglish ? ["Public updates", "Extra context"] : ["公开更新", "补充上下文"]),
      href: xChannel?.url ?? "https://x.com/72hour_s",
      cta: xChannel?.ctaLabel ?? (isEnglish ? "Follow" : "关注"),
      note: xChannel?.officialVerificationNote ?? (isEnglish ? "X is for public observation." : "X 用于公开观察。"),
    },
    {
      icon: CHANNEL_ICONS.wechat,
      title: wechat?.label ?? "微信",
      status: wechat?.statusNote ?? "补充说明",
      body: wechat?.suitableFor.join(" / ") ?? (isEnglish ? "Chinese notes / supplementary contact" : "中文补充 / 补充联系"),
      expectation:
        wechat?.expectationAfterJoining ?? (isEnglish ? ["Notes page", "Supplementary contact"] : ["说明页", "补充信息"]),
      href: wechatHref,
      cta: wechatCta,
      note: wechat?.officialVerificationNote ?? (isEnglish ? "WeChat is supplementary contact only." : "微信只作补充联系。"),
    },
  ];

  return (
    <div className="page-shell pt-20 sm:pt-24">
      <InfoPageHero
        kicker={isEnglish ? "Contact" : "联系"}
        icon={<MessageCircle size={30} />}
        title={isEnglish ? "Use official entries only." : "只走官方入口。"}
        lead={isEnglish ? "Official contact entries and verification notes." : "官方联系入口与核对信息。"}
        noteLabel={isEnglish ? "Site note" : "站点说明"}
        noteTitle={siteConfig.siteName}
        noteBody={siteConfig.globalDisclaimerExcerpt}
        chips={[
          "Telegram",
          "X",
          isEnglish ? "WeChat supplement" : "微信补充",
        ].map((label) => (
          <span
            key={label}
            className="inline-flex items-center rounded-sm border border-line/70 bg-background/30 px-3 py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground"
          >
            {label}
          </span>
        ))}
      />

      <section className="page-section">
        <div className="page-container page-container-wide">
          <div className="overflow-hidden rounded-md border border-line/70 bg-surface/18">
            {contactChannels.map((channel, index) => (
              <article
                key={channel.title}
                className={`grid gap-5 p-5 sm:p-6 lg:p-7 ${
                  index !== contactChannels.length - 1 ? "border-b border-line/70" : ""
                }`}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-primary/10 text-primary flex items-center justify-center rounded-sm">
                    {channel.icon}
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{channel.title}</h2>
                    <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary/60">
                      {channel.status}
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto] lg:items-start">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                      {channel.body}
                    </p>
                    <p className="text-[10px] sm:text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      {channel.note}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary/60">
                      {isEnglish ? "After you arrive" : "到达后"}
                    </span>
                    {channel.expectation.map((line) => (
                      <p key={line} className="text-sm sm:text-base text-foreground/85 font-light leading-relaxed">
                        {line}
                      </p>
                    ))}
                  </div>
                  {channel.href.startsWith("http") ? (
                    <a
                      href={channel.href}
                      target="_blank"
                      rel="noreferrer"
                      className="page-action lg:justify-self-end"
                    >
                      {channel.cta}
                    </a>
                  ) : (
                    <Link to={channel.href} className="page-action lg:justify-self-end">
                      {channel.cta}
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section-tight pb-20 sm:pb-28">
        <div className="page-container page-container-narrow">
          <InfoCallout
            tone="dark"
            kicker={isEnglish ? "Verify entry" : "核对入口"}
            title={isEnglish ? "Telegram, X, and WeChat form the current contact layer." : "Telegram、X 和微信构成当前联系层。"}
            body={isEnglish ? "Official links are centralized on this site and the marked channels." : "官方链接集中在本站和已标记渠道。"}
            actions={[
              { label: isEnglish ? "View FAQ" : "查看 FAQ", href: "/faq" },
              { label: isEnglish ? "Join community" : "加入社区", href: "/join", variant: "primary" },
            ]}
            align="center"
          />
        </div>
      </section>
    </div>
  );
}
