import { Link } from "react-router-dom";
import { MessageCircle, AtSign, Users } from "lucide-react";
import { SpotlightCard } from "../components/SpotlightCard";
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
  const contactChannels = [
    {
      icon: CHANNEL_ICONS.telegram,
      title: telegram?.label ?? "Telegram",
      status: telegram?.statusNote ?? "主社区入口",
      body: telegram?.suitableFor.join(" / ") ?? (isEnglish ? "Main context / Updates and notes" : "主语境 / 看更新和说明"),
      expectation: telegram?.expectationAfterJoining ?? (isEnglish ? ["Read Green Book first", "Then review the discussion and notes"] : ["先看绿书", "再看讨论和说明"]),
      href: telegram?.url ?? "https://t.me/the_72h",
      cta: telegram?.ctaLabel ?? (isEnglish ? "Enter" : "进入"),
      note: telegram?.officialVerificationNote ?? (isEnglish ? "Telegram is the main entry point." : "Telegram 是主入口。"),
    },
    {
      icon: CHANNEL_ICONS.x,
      title: xChannel?.label ?? "X",
      status: xChannel?.statusNote ?? "轻关注入口",
      body: xChannel?.suitableFor.join(" / ") ?? (isEnglish ? "Light observation / Public updates" : "轻量观察 / 看公开动态"),
      expectation: xChannel?.expectationAfterJoining ?? (isEnglish ? ["Check the updates first", "Then decide whether to join the main community"] : ["先看动态", "再决定是否进入主社区"]),
      href: xChannel?.url ?? "https://x.com/taichi2077",
      cta: xChannel?.ctaLabel ?? (isEnglish ? "Follow" : "关注"),
      note: xChannel?.officialVerificationNote ?? (isEnglish ? "X is suitable for observation first." : "X 适合先观察。"),
    },
    {
      icon: CHANNEL_ICONS.wechat,
      title: wechat?.label ?? "微信",
      status: wechat?.statusNote ?? "次级补充",
      body: wechat?.suitableFor.join(" / ") ?? (isEnglish ? "Chinese notes / supplementary contact" : "中文补充 / 补充联系"),
      expectation: wechat?.expectationAfterJoining ?? (isEnglish ? ["Build context through Green Book first", "Then read the WeChat notes"] : ["先通过绿书建立认知", "再看微信说明"]),
      href: wechat?.url ?? "/join",
      cta: wechat?.ctaLabel ?? (isEnglish ? "Read notes" : "看说明"),
      note: wechat?.officialVerificationNote ?? (isEnglish ? "WeChat is only a supplementary contact path." : "微信只作补充联系。"),
    },
  ];

  return (
    <div className="page-shell pt-20 sm:pt-24">
      <section className="page-hero border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.06)_0,transparent_42%)] pointer-events-none"></div>
        <div className="page-container page-container-narrow flex flex-col gap-5 sm:gap-6 relative z-10">
          <div className="page-kicker w-fit">{isEnglish ? "Contact" : "联系"}</div>
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="flex flex-col gap-4">
              <h1 className="page-title page-title-compact max-w-[10ch]">
                {isEnglish ? "Use official paths only." : "只走官方路径。"}
              </h1>
              <p className="page-lead max-w-2xl">
                {isEnglish ? "Review the entries, then verify the source." : "先看入口，再核对来源。"}
              </p>
            </div>
            <div className="hidden lg:flex flex-col items-end gap-2 text-right">
              <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary/60">
                {isEnglish ? "Site note" : "站点说明"}
              </span>
              <span className="text-sm text-muted-foreground leading-relaxed max-w-[18ch]">
                {siteConfig.globalDisclaimerExcerpt}
              </span>
            </div>
          </div>
          <div className="page-chip-row pt-2">
            <span className="inline-flex items-center px-3 py-2 rounded-sm border border-white/10 bg-secondary/10 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-muted-foreground">
              Telegram
            </span>
            <span className="inline-flex items-center px-3 py-2 rounded-sm border border-white/10 bg-secondary/10 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-muted-foreground">
              X
            </span>
            <span className="inline-flex items-center px-3 py-2 rounded-sm border border-white/10 bg-secondary/10 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-muted-foreground">
              {isEnglish ? "WeChat supplement" : "微信补充"}
            </span>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="page-container page-container-wide">
          <div className="border-t border-white/10">
            {contactChannels.map((channel, index) => (
              <article
                key={channel.title}
                className={`grid gap-5 py-6 sm:py-8 ${
                  index !== contactChannels.length - 1 ? "border-b border-white/10" : ""
                }`}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-primary/10 text-primary flex items-center justify-center rounded-sm">
                    {channel.icon}
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{channel.title}</h2>
                    <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary/60">
                      {channel.status}
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto] lg:items-start">
                <div className="flex flex-col gap-2">
                  <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                      {channel.body}
                    </p>
                    <p className="text-[10px] sm:text-xs uppercase tracking-[0.28em] text-muted-foreground">
                      {channel.note}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary/60">
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
                      className="inline-flex px-5 sm:px-6 py-3 bg-primary text-primary-foreground text-xs sm:text-sm font-bold tracking-widest uppercase rounded-sm lg:justify-self-end"
                    >
                      {channel.cta}
                    </a>
                  ) : (
                    <Link
                      to={channel.href}
                      className="inline-flex px-5 sm:px-6 py-3 bg-primary text-primary-foreground text-xs sm:text-sm font-bold tracking-widest uppercase rounded-sm lg:justify-self-end"
                    >
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
          <SpotlightCard className="page-card page-card-lg border-primary/20 bg-primary/5 flex flex-col gap-5 sm:gap-6">
            <div className="flex flex-col gap-3">
              <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.32em] text-primary/70">
                {isEnglish ? "Verify entry" : "核对入口"}
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
                {isEnglish ? "Trust Telegram, X, and the WeChat notes page." : "只认 Telegram、X 和微信说明页。"}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed max-w-2xl">
                {isEnglish ? "If the link is not on this site or the official homepage, stop." : "如果链接不在本站或官方主页里，就先停。"}
              </p>
            </div>
            <div className="page-chip-row">
              <Link
                to="/faq"
                className="inline-flex px-5 py-3 border border-white/10 text-foreground text-xs sm:text-sm font-bold tracking-widest uppercase rounded-sm"
              >
                {isEnglish ? "View FAQ" : "查看 FAQ"}
              </Link>
              <Link
                to="/join"
                className="inline-flex px-5 py-3 bg-primary text-primary-foreground text-xs sm:text-sm font-bold tracking-widest uppercase rounded-sm"
              >
                {isEnglish ? "Back to entry" : "回入口"}
              </Link>
            </div>
          </SpotlightCard>
        </div>
      </section>
    </div>
  );
}
