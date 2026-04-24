import { Terminal } from "lucide-react";
import { InfoCallout } from "../components/InfoCallout";
import { SpotlightCard } from "../components/SpotlightCard";
import { LocalizedLink as Link } from "../components/LocalizedLink";
import { useLocale } from "../lib/locale";

export default function NotFound() {
  const { locale } = useLocale();
  const isEnglish = locale === "en-US";

  const suggestedRoutes = [
    { label: isEnglish ? "Home" : "首页", href: "/" },
    { label: isEnglish ? "Ecosystem" : "生态应用", href: "/ecosystem" },
    { label: isEnglish ? "Green Book" : "绿皮书", href: "/greenbook" },
  ];

  return (
    <div className="page-shell pt-20 sm:pt-24">
      <section className="page-hero border-b border-line/70 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.08)_0,transparent_42%),linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_42%)]" />
        <div className="page-container page-container-narrow relative z-10">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.82fr)] lg:items-end">
            <div className="flex flex-col gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 text-primary flex items-center justify-center rounded-sm shadow-[0_0_20px_rgba(34,197,94,0.15)]">
                <Terminal size={30} />
              </div>
              <div className="page-kicker w-fit">{isEnglish ? "Entry not found" : "入口未找到"}</div>
              <h1 className="text-[clamp(3.75rem,18vw,6.75rem)] leading-none font-bold tracking-tighter text-primary drop-shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                404
              </h1>
              <h2 className="page-title page-title-compact max-w-[12ch]">
                {isEnglish ? "This entry does not exist yet." : "这个入口暂时不存在。"}
              </h2>
              <p className="page-lead max-w-2xl">
                {isEnglish
                  ? "This address is unpublished or has moved."
                  : "这个地址未公开或已迁移。"}
              </p>
            </div>

            <SpotlightCard className="page-card page-card-lg border-line/70 bg-surface/72 flex flex-col gap-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary/60">
                {isEnglish ? "Suggested entries" : "建议入口"}
              </p>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {isEnglish ? "Choose a valid entry." : "请选择有效入口。"}
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                {isEnglish
                  ? "Home, ecosystem, and Green Book are the current public entries."
                  : "首页、生态应用和绿皮书是当前公开入口。"}
              </p>
              <div className="page-chip-row pt-1">
                {suggestedRoutes.map((route) => (
                  <Link key={route.href} to={route.href} className="page-action-muted">
                    {route.label}
                  </Link>
                ))}
              </div>
            </SpotlightCard>
          </div>

          <div className="page-chip-row pt-4">
            {suggestedRoutes.map((route, index) => (
              <span
                key={route.href}
                className="inline-flex items-center rounded-sm border border-line/70 bg-background/30 px-3 py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground"
              >
                0{index + 1} {route.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section-tight pb-20 sm:pb-28">
        <div className="page-container page-container-narrow">
          <InfoCallout
            tone="dark"
            kicker={isEnglish ? "Official entries" : "公开入口"}
            title={isEnglish ? "Home, ecosystem, and Green Book are available." : "首页、生态应用和绿皮书可访问。"}
            body={isEnglish ? "Use the public entries above." : "请使用上方公开入口。"}
            actions={[
              { label: isEnglish ? "Back home" : "返回首页", href: "/", variant: "primary" },
              { label: isEnglish ? "Join community" : "进入社区", href: "/join" },
            ]}
            align="center"
          />
        </div>
      </section>
    </div>
  );
}
