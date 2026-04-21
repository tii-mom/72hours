import { Link } from "react-router-dom";
import { AtSign, MessageCircle, Users } from "lucide-react";
import { SpotlightCard } from "../components/SpotlightCard";
import { channels } from "../content/channels";
import { joinContent } from "../content/join";

const channelIcons = {
  telegram: <MessageCircle size={36} />,
  x: <AtSign size={36} />,
  wechat: <Users size={36} />,
  other: <Users size={36} />,
} as const;

const getChannel = (type: "telegram" | "x" | "wechat" | "other") =>
  channels.find((channel) => channel.type === type);

export default function Join() {
  const telegram = getChannel("telegram");
  const xChannel = getChannel("x");
  const wechat = getChannel("wechat");

  return (
    <div className="flex-1 flex flex-col pt-24 font-sora relative">
      <section className="px-8 lg:px-16 py-24 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30 pointer-events-none"></div>
        <div className="container mx-auto max-w-4xl flex flex-col items-center text-center gap-8 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter drop-shadow-[0_0_20px_rgba(34,197,94,0.2)]">
            {joinContent.title.split("\n").map((line, index) => (
              <span key={line}>
                {line}
                {index === 0 ? <br /> : null}
              </span>
            ))}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed font-light max-w-2xl">
            {joinContent.subtitle}
          </p>
        </div>
      </section>

      <section className="px-8 lg:px-16 pb-20 relative z-10">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
          <SpotlightCard className="p-8 md:p-10 flex flex-col gap-6 min-h-full">
            <div className="bg-[#24A1DE]/10 p-5 rounded-full flex-shrink-0 shadow-[0_0_20px_rgba(36,161,222,0.2)] w-fit">
              {channelIcons.telegram}
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <h2 className="text-2xl font-bold tracking-widest text-[#24A1DE]">
                主入口：{telegram?.label ?? "Telegram"}
              </h2>
              <p className="text-muted-foreground font-light leading-relaxed">
                {telegram?.suitableFor[0] ?? "想直接进入主语境的人"}
                {telegram?.suitableFor[1] ? "。 " + telegram.suitableFor[1] : ""}
              </p>
              <div className="mt-2">
                <a
                  href={telegram?.url ?? "https://t.me/the_72h"}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex px-8 py-3 bg-[#24A1DE] hover:bg-[#24A1DE]/90 text-white font-bold tracking-widest uppercase rounded-sm text-sm active:scale-95 transition-all shadow-[0_0_15px_rgba(36,161,222,0.3)]"
                >
                  {telegram?.ctaLabel ?? "进入 Telegram"}
                </a>
              </div>
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-8 md:p-10 flex flex-col gap-6 min-h-full">
            <div className="bg-foreground/10 p-5 text-foreground rounded-full flex-shrink-0 w-[76px] h-[76px] flex items-center justify-center">
              {channelIcons.x}
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <h2 className="text-2xl font-bold tracking-widest">
                轻关注入口：{xChannel?.label ?? "X"}
              </h2>
              <p className="text-muted-foreground font-light leading-relaxed">
                如果你想先看公开动态、项目预告和对外说明，先关注 X。
                它更适合低承诺观察，不要求你先做出深入决定。
              </p>
              <div className="mt-2">
                <a
                  href={xChannel?.url ?? "https://x.com/taichi2077"}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex px-8 py-3 border-2 border-foreground hover:bg-foreground hover:text-background text-foreground font-bold tracking-widest uppercase rounded-sm text-sm active:scale-95 transition-all"
                >
                  {xChannel?.ctaLabel ?? "关注 X"}
                </a>
              </div>
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-8 md:p-10 flex flex-col gap-6 min-h-full">
            <div className="bg-primary/10 p-5 text-primary rounded-full flex-shrink-0 w-[76px] h-[76px] flex items-center justify-center font-mono text-lg font-bold">
              {channelIcons.wechat}
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <h2 className="text-2xl font-bold tracking-widest">
                次级补充：{wechat?.label ?? "微信"}
              </h2>
              <p className="text-muted-foreground font-light leading-relaxed">
                如果你更需要中文补充说明，可以先通过 Telegram 或 X 建立认知，再查看微信相关说明。
                微信是补充联系，不替代主入口。
              </p>
              <div className="mt-2">
                <Link
                  to={wechat?.url ?? "/contact"}
                  className="inline-flex px-8 py-3 bg-primary text-primary-foreground font-bold tracking-widest uppercase rounded-sm text-sm active:scale-95 transition-all shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                >
                  {wechat?.ctaLabel ?? "查看微信说明"}
                </Link>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </section>

      <section className="px-8 lg:px-16 pb-28 relative z-10">
        <div className="container mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
          <SpotlightCard className="p-8 md:p-10 flex flex-col gap-4">
            <h3 className="text-2xl font-bold tracking-widest">{joinContent.joinedTitle}</h3>
            <p className="text-muted-foreground font-light leading-relaxed">{joinContent.joinedBody}</p>
            <p className="text-muted-foreground font-light leading-relaxed">
              社区的作用不是先把你“教完”，而是先把你放进一个能看见真实入口和真实协作的语境里。
            </p>
          </SpotlightCard>

          <SpotlightCard className="p-8 md:p-10 flex flex-col gap-4">
            <h3 className="text-2xl font-bold tracking-widest">{joinContent.firstStepTitle}</h3>
            <p className="text-muted-foreground font-light leading-relaxed">{joinContent.firstStepBody}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/ecosystem"
                className="inline-flex px-5 py-3 bg-primary text-primary-foreground text-sm font-bold tracking-widest uppercase rounded-sm active:scale-95 transition-all"
              >
                先浏览生态应用
              </Link>
              <Link
                to="/about"
                className="inline-flex px-5 py-3 border border-white/10 text-foreground text-sm font-bold tracking-widest uppercase rounded-sm active:scale-95 transition-all"
              >
                了解方法与原则
              </Link>
            </div>
          </SpotlightCard>
        </div>
      </section>

      <section className="px-8 lg:px-16 pb-20 relative z-10">
        <div className="container mx-auto max-w-5xl">
          <SpotlightCard className="p-8 md:p-10 border-l-4 border-l-primary">
            <h3 className="text-2xl font-bold tracking-widest mb-4">{joinContent.verifyTitle}</h3>
            <p className="text-muted-foreground font-light leading-relaxed">{joinContent.verifyBody}</p>
          </SpotlightCard>
        </div>
      </section>
    </div>
  );
}
