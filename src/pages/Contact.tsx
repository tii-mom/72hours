import { Link } from "react-router-dom";
import { MessageCircle, AtSign, Users } from "lucide-react";
import { SpotlightCard } from "../components/SpotlightCard";
import { Reveal } from "../components/Reveal";
import { channels } from "../content/channels";

const CHANNEL_ICONS = {
  telegram: <MessageCircle size={22} />,
  x: <AtSign size={22} />,
  wechat: <Users size={22} />,
  other: <Users size={22} />,
} as const;

const getChannel = (type: "telegram" | "x" | "wechat" | "other") =>
  channels.find((channel) => channel.type === type);

export default function Contact() {
  const telegram = getChannel("telegram");
  const xChannel = getChannel("x");
  const wechat = getChannel("wechat");

  return (
    <div className="flex-1 flex flex-col pt-24 font-sora relative">
      <section className="px-8 lg:px-16 py-20 relative z-10 border-b border-white/5">
        <div className="container mx-auto max-w-4xl flex flex-col gap-6">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-bold tracking-widest uppercase mb-4">
              官方联系
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-balance">
              只通过官方路径联系，减少噪音与误读。
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-xl text-muted-foreground leading-relaxed font-light max-w-2xl">
              官方联系不是为了做复杂表单，而是为了让你清楚知道该去哪里、该怎么看，以及该如何核对真假入口。
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-8 lg:px-16 py-20 relative z-10">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: CHANNEL_ICONS.telegram,
              title: telegram?.label ?? "Telegram",
              body: telegram?.suitableFor.join("；") ?? "主社区入口，适合直接进入主语境的人。",
              href: telegram?.url ?? "https://t.me/the_72h",
              cta: telegram?.ctaLabel ?? "进入 Telegram",
            },
            {
              icon: CHANNEL_ICONS.x,
              title: xChannel?.label ?? "X",
              body: xChannel?.suitableFor.join("；") ?? "公开动态入口，适合先轻量观察的人。",
              href: xChannel?.url ?? "https://x.com/taichi2077",
              cta: xChannel?.ctaLabel ?? "关注 X",
            },
            {
              icon: CHANNEL_ICONS.wechat,
              title: wechat?.label ?? "微信",
              body: wechat?.suitableFor.join("；") ?? "补充联系渠道，适合需要中文说明的人。",
              href: wechat?.url ?? "/join",
              cta: wechat?.ctaLabel ?? "查看微信说明",
            },
          ].map((channel, index) => (
            <Reveal key={channel.title} delay={0.1 * index}>
              <SpotlightCard className="p-8 md:p-10 flex flex-col gap-5 h-full">
                <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-sm">
                  {channel.icon}
                </div>
                <h2 className="text-2xl font-bold tracking-widest">{channel.title}</h2>
                <p className="text-muted-foreground font-light leading-relaxed">{channel.body}</p>
                {channel.href.startsWith("http") ? (
                  <a
                    href={channel.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-auto inline-flex px-6 py-3 bg-primary text-primary-foreground text-sm font-bold tracking-widest uppercase rounded-sm"
                  >
                    {channel.cta}
                  </a>
                ) : (
                  <Link
                    to={channel.href}
                    className="mt-auto inline-flex px-6 py-3 bg-primary text-primary-foreground text-sm font-bold tracking-widest uppercase rounded-sm"
                  >
                    {channel.cta}
                  </Link>
                )}
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-8 lg:px-16 pb-28 relative z-10">
        <div className="container mx-auto max-w-4xl">
          <Reveal>
            <SpotlightCard className="p-8 md:p-10 border-l-4 border-l-primary">
              <h3 className="text-2xl font-bold tracking-widest mb-4">如果你要核对真假入口</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                先只认这里公开的入口：Telegram、X 和微信说明页。不要把其他名字相近的节点当成官方入口。
              </p>
              <div className="flex flex-wrap gap-4 pt-6">
                <Link
                  to="/faq"
                  className="inline-flex px-5 py-3 border border-white/10 text-foreground text-sm font-bold tracking-widest uppercase rounded-sm"
                >
                  查看 FAQ
                </Link>
                <Link
                  to="/join"
                  className="inline-flex px-5 py-3 bg-primary text-primary-foreground text-sm font-bold tracking-widest uppercase rounded-sm"
                >
                  返回参与入口
                </Link>
              </div>
            </SpotlightCard>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
