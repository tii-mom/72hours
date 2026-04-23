import { useEffect, useState } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import { Languages, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../lib/utils";
import { getSiteConfig } from "../content/site-config";
import { useLocale } from "../lib/locale";
import { localizeHref } from "../lib/routes";
import { LocalizedLink as Link } from "./LocalizedLink";

function LanguageBadge({ className = "", onClick }: { className?: string; onClick?: () => void }) {
  const { isEnglish } = useLocale();

  return (
      <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-sm border border-white/10 bg-nav-button px-3 py-2 text-[10px] sm:text-xs font-bold tracking-[0.16em] uppercase text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground sm:min-h-0 sm:min-w-0",
        className
      )}
      aria-label={isEnglish ? "Switch to Chinese" : "Switch to English"}
    >
      <Languages size={14} strokeWidth={1.75} aria-hidden="true" />
      <span>{isEnglish ? "EN" : "中文"}</span>
    </button>
  );
}

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { locale, toggleLocale, isEnglish } = useLocale();
  const siteConfig = getSiteConfig(locale);
  const footerNote = isEnglish
    ? "Use official entry points first. Legal notes stay below."
    : "先用官方入口，法律说明见下方。";
  const outlet = useOutlet();
  const isHomeRoute = location.pathname === "/" || location.pathname === "/en";

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <div className={cn("min-h-screen flex flex-col font-sora relative bg-background", isHomeRoute && "h-[100svh] overflow-hidden")}>
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.035] mix-blend-overlay bg-noise" />
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] mix-blend-overlay" />

      <header className="fixed top-0 left-0 right-0 z-50 py-4 sm:py-5 transition-all duration-300 bg-background/40 backdrop-blur-md border-b border-white/5">
        <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 flex items-center justify-between">
          <Link to="/" className="inline-flex min-h-11 items-center gap-1 px-0.5 text-lg sm:text-xl md:text-2xl font-bold tracking-widest text-foreground group sm:min-h-0 sm:px-0">
            72<span className="text-primary group-hover:drop-shadow-[0_0_10px_rgba(34,197,94,0.5)] transition-all">hours</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 lg:gap-12">
            {siteConfig.navItems.map((link) => {
              const href = localizeHref(link.href, locale);
              const isActive = location.pathname === href;

              return (
                <Link
                  key={href}
                  to={link.href}
                  className={cn(
                    "text-sm uppercase tracking-widest transition-colors font-medium hover:text-foreground relative group",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {link.label}
                  {isActive ? (
                    <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary drop-shadow-[0_0_5px_rgba(34,197,94,0.8)]" />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <LanguageBadge onClick={toggleLocale} />
            <Link
              to={siteConfig.primaryJoinRoute}
              className="bg-nav-button hover:bg-nav-button/80 text-foreground border border-white/10 px-5 py-2.5 rounded-sm text-sm uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(34,197,94,0.1)]"
            >
              {siteConfig.primaryCtaLabel}
            </Link>
          </div>

          <button
            className="md:hidden inline-flex min-h-11 min-w-11 items-center justify-center p-2 text-foreground hover:text-primary transition-colors active:scale-90"
            onClick={() => setIsOpen(true)}
            aria-label={isEnglish ? "Open navigation menu" : "打开导航菜单"}
          >
            <Menu size={28} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isOpen ? (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="absolute top-0 left-0 bottom-0 w-[82%] max-w-sm bg-background border-r border-white/10 p-6 sm:p-8 flex flex-col shadow-2xl overflow-hidden before:absolute before:inset-0 before:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] before:bg-[size:20px_20px] before:opacity-30 before:pointer-events-none"
            >
              <div className="relative z-10 flex justify-between items-center mb-8 sm:mb-12">
                <Link to="/" className="text-lg sm:text-xl font-bold tracking-widest text-foreground mix-blend-plus-lighter">
                  72<span className="text-primary">hours</span>
                </Link>
                <div className="flex items-center gap-2">
                  <LanguageBadge className="px-2.5 py-1.5" onClick={toggleLocale} />
                  <button
                    className="text-muted-foreground hover:text-foreground transition-colors p-1"
                    onClick={() => setIsOpen(false)}
                    aria-label={isEnglish ? "Close navigation menu" : "关闭导航菜单"}
                  >
                    <X size={24} strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              <nav className="relative z-10 flex flex-col gap-5 sm:gap-8">
                {siteConfig.navItems.map((link) => {
                  const href = localizeHref(link.href, locale);
                  const isActive = location.pathname === href;

                  return (
                    <Link
                      key={href}
                      to={link.href}
                      className={cn(
                        "inline-flex min-h-11 items-center gap-2 rounded-sm px-1.5 py-2 text-base font-semibold transition-colors sm:min-h-0 sm:px-0 sm:py-0 sm:text-lg",
                        isEnglish ? "uppercase tracking-[0.18em]" : "tracking-[0.04em]",
                        isActive
                          ? "text-primary drop-shadow-[0_0_8px_rgba(34,197,94,0.4)] before:content-['>'] before:text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                <div className="pt-8 border-t border-white/10 mt-4">
                  <div className="pb-4">
                    <LanguageBadge className="w-fit" onClick={toggleLocale} />
                  </div>
                  <Link
                    to={siteConfig.primaryJoinRoute}
                    className="bg-primary text-primary-foreground text-center block w-full min-h-11 px-6 py-4 rounded-sm text-sm uppercase tracking-widest font-bold shadow-[0_0_15px_rgba(34,197,94,0.2)] active:scale-95 transition-transform"
                  >
                    {siteConfig.primaryCtaLabel}
                  </Link>
                </div>
              </nav>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <main className={cn("flex-1 flex flex-col w-full relative z-10", isHomeRoute && "min-h-0")}>
        <div className="flex-1 flex flex-col w-full">{outlet}</div>
      </main>

      <footer
        className={cn(
          "relative z-10 border-t border-white/10 bg-black/95 text-sm",
          isHomeRoute && "fixed inset-x-0 bottom-0 border-white/10 bg-black/86 backdrop-blur-xl"
        )}
      >
        <div className={cn(
          "container mx-auto flex max-w-7xl flex-col gap-7 px-5 py-9 sm:px-8 sm:py-11 lg:px-16",
          isHomeRoute && "gap-2.5 px-5 py-3.5 sm:gap-3 sm:px-8 sm:py-4 lg:px-16"
        )}>
          <div className={cn(
            "grid gap-2 border-b border-white/10 pb-6 sm:grid-cols-[minmax(180px,0.42fr)_minmax(0,1fr)] sm:items-end",
            isHomeRoute && "grid-cols-1 gap-1.5 pb-2.5 sm:grid-cols-[minmax(150px,0.28fr)_minmax(0,1fr)]"
          )}>
            <div className={cn(
              "text-xl font-bold tracking-widest text-foreground sm:text-2xl",
              isHomeRoute && "text-lg sm:text-xl"
            )}>
              72<span className="text-primary">hours</span>
            </div>
            <p className={cn(
              "max-w-2xl text-[13px] font-light leading-relaxed text-muted-foreground sm:justify-self-end sm:text-right sm:text-sm",
              isHomeRoute && "text-xs sm:text-[13px]"
            )}>
              {footerNote}
            </p>
          </div>

          <nav
            className={cn(
              "divide-y divide-white/10 border-y border-white/10",
              isHomeRoute && "border-y-0"
            )}
            aria-label={isEnglish ? "Footer navigation" : "页脚导航"}
          >
            {siteConfig.footerGroups.map((group) => (
              <div
                key={group.title}
                className={cn(
                  "grid gap-3 py-4 sm:grid-cols-[86px_minmax(0,1fr)] sm:items-center sm:gap-5",
                  isHomeRoute && "gap-1.5 py-2 sm:grid-cols-[64px_minmax(0,1fr)] sm:py-2.5"
                )}
              >
                <div className={cn(
                  "text-[12px] font-bold text-white/48",
                  isHomeRoute && "text-[11px]",
                  isEnglish ? "uppercase tracking-[0.24em]" : "tracking-[0.14em]"
                )}>
                  {group.title}
                </div>
                <div className={cn(
                  "flex flex-wrap items-center gap-x-2 gap-y-2 text-[15px] text-muted-foreground sm:text-base",
                  isHomeRoute && "gap-y-1 text-[13px] sm:text-sm"
                )}>
                  {group.links.map((link) => {
                    const classes = cn(
                      "inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm px-2.5 py-2 text-left font-medium transition-colors hover:text-primary magnetic-target sm:min-h-8 sm:min-w-0 sm:justify-start sm:px-0 sm:py-0",
                      isHomeRoute && "sm:min-h-8"
                    );
                    const divider = <span className="text-primary/50" aria-hidden="true">/</span>;
                    const content = link.href.startsWith("http") ? (
                        <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className={classes}>
                          {link.label}
                        </a>
                    ) : (
                      <Link key={link.label} to={link.href} className={classes}>
                        {link.label}
                      </Link>
                    );

                    return (
                      <div key={link.label} className="inline-flex items-center gap-2">
                        {divider}
                        {content}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
