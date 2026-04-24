import { AtSign, MessageCircle, Users } from "lucide-react";
import { LocalizedLink as Link } from "../components/LocalizedLink";
import { InfoCallout } from "../components/InfoCallout";
import { InfoPageHero } from "../components/InfoPageHero";
import { getChannels } from "../content/channels";
import { getJoinContent } from "../content/join";
import { useLocale } from "../lib/locale";

const channelIcons = {
  telegram: <MessageCircle size={22} />,
  x: <AtSign size={22} />,
  wechat: <Users size={22} />,
  other: <Users size={22} />,
} as const;

export default function Join() {
  const { locale } = useLocale();
  const isEnglish = locale === "en-US";
  const joinContent = getJoinContent(locale);
  const channels = getChannels(locale);
  const telegram = channels.find((channel) => channel.type === "telegram");
  const xChannel = channels.find((channel) => channel.type === "x");
  const wechat = channels.find((channel) => channel.type === "wechat");

  const entries = [
    {
      icon: channelIcons.telegram,
      label: telegram?.label ?? "Telegram",
      status: telegram?.statusNote ?? (isEnglish ? "Main community" : "主社区"),
      body:
        telegram?.suitableFor.join(" / ") ??
        (isEnglish ? "Community and official notes" : "社区与官方说明"),
      expectation:
        telegram?.expectationAfterJoining ??
        (isEnglish ? ["Community discussion", "Project updates"] : ["社区讨论", "项目更新"]),
      href: telegram?.url ?? "https://t.me/the_72h",
      cta: telegram?.ctaLabel ?? (isEnglish ? "Enter" : "进入"),
      external: true,
    },
    {
      icon: channelIcons.x,
      label: xChannel?.label ?? "X",
      status: xChannel?.statusNote ?? (isEnglish ? "Public updates" : "公开动态"),
      body:
        xChannel?.suitableFor.join(" / ") ??
        (isEnglish ? "Public updates and quick context" : "公开更新和快速了解"),
      expectation:
        xChannel?.expectationAfterJoining ??
        (isEnglish ? ["Public updates", "Extra context"] : ["公开更新", "补充上下文"]),
      href: xChannel?.url ?? "https://x.com/taichi2077",
      cta: xChannel?.ctaLabel ?? (isEnglish ? "Follow" : "关注"),
      external: true,
    },
    {
      icon: channelIcons.wechat,
      label: wechat?.label ?? "微信",
      status: wechat?.statusNote ?? (isEnglish ? "Supplementary notes" : "补充说明"),
      body:
        wechat?.suitableFor.join(" / ") ??
        (isEnglish ? "Chinese notes and supplementary contact" : "中文说明和补充联系"),
      expectation:
        wechat?.expectationAfterJoining ??
        (isEnglish ? ["Notes page", "Supplementary contact"] : ["说明页", "补充信息"]),
      href: wechat?.url === "/contact" ? "/contact" : (wechat?.url ?? "/contact"),
      cta: wechat?.ctaLabel ?? (isEnglish ? "Read notes" : "看说明"),
      external: false,
    },
  ] as const;

  return (
    <div className="page-shell pt-20 sm:pt-24">
      <InfoPageHero
        kicker={isEnglish ? "Join" : "参与入口"}
        icon={<MessageCircle size={30} />}
        title={joinContent.title}
        lead={joinContent.subtitle}
        noteLabel={isEnglish ? "Official entry" : "官方入口"}
        noteTitle={joinContent.whyTitle}
        noteBody={joinContent.whyBody}
        chips={[
          telegram?.label ?? "Telegram",
          xChannel?.label ?? "X",
          wechat?.label ?? "微信",
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
            {entries.map((entry, index) => (
              <article
                key={entry.label}
                className={`grid gap-5 p-5 sm:p-6 lg:p-7 ${
                  index !== entries.length - 1 ? "border-b border-line/70" : ""
                }`}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-primary/10 text-primary flex items-center justify-center rounded-sm">
                    {entry.icon}
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{entry.label}</h2>
                    <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary/60">
                      {entry.status}
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto] lg:items-start">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                      {entry.body}
                    </p>
                    <p className="text-[10px] sm:text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      {entry.external
                        ? isEnglish
                          ? "External entry"
                          : "外部入口"
                        : isEnglish
                          ? "On-site entry"
                          : "站内入口"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary/60">
                      {isEnglish ? "After you arrive" : "到达后"}
                    </span>
                    {entry.expectation.map((line) => (
                      <p key={line} className="text-sm sm:text-base text-foreground/85 font-light leading-relaxed">
                        {line}
                      </p>
                    ))}
                  </div>
                  {entry.external ? (
                    <a
                      href={entry.href}
                      target="_blank"
                      rel="noreferrer"
                      className="page-action lg:justify-self-end"
                    >
                      {entry.cta}
                    </a>
                  ) : (
                    <Link to={entry.href} className="page-action lg:justify-self-end">
                      {entry.cta}
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
            kicker={joinContent.contactTitle}
            title={joinContent.contactBody}
            body={joinContent.joinedBody}
            actions={[
              { label: isEnglish ? "Browse ecosystem" : "浏览生态应用", href: "/ecosystem", variant: "primary" },
              { label: isEnglish ? "Read Green Book" : "阅读绿皮书", href: "/greenbook" },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
