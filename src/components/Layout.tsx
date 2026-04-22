import { Link, useLocation, useOutlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { Languages, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../lib/utils";
import { getSiteConfig } from "../content/site-config";
import { useLocale } from "../lib/locale";

function LanguageBadge({ className = "", onClick }: { className?: string; onClick?: () => void }) {
  const { isEnglish } = useLocale();
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-sm border border-white/10 bg-nav-button px-3 py-2 text-[10px] sm:text-xs font-bold tracking-[0.16em] uppercase text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground",
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
  const { toggleLocale, isEnglish } = useLocale();
  const siteConfig = getSiteConfig(isEnglish ? "en-US" : "zh-CN");
  const footerNote = isEnglish
    ? "Use official entry points first. Legal notes stay below."
    : "先用官方入口，法律说明见下方。";
  const outlet = useOutlet(); // Freezes the route state during exit transitions

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col font-sora relative bg-background">
      {/* Global TV / Film Grain Noise Layer & Subtle Grid */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.035] mix-blend-overlay bg-noise" />
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] mix-blend-overlay" />

      <header className="fixed top-0 left-0 right-0 z-50 py-4 sm:py-5 transition-all duration-300 bg-background/40 backdrop-blur-md border-b border-white/5">
        <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 flex items-center justify-between">
          <Link to="/" className="text-lg sm:text-xl md:text-2xl font-bold tracking-widest text-foreground flex items-center gap-1 group">
             72<span className="text-primary group-hover:drop-shadow-[0_0_10px_rgba(34,197,94,0.5)] transition-all">hours</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 lg:gap-12">
            {siteConfig.navItems.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "text-sm uppercase tracking-widest transition-colors font-medium hover:text-foreground relative group",
                  location.pathname === link.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.label}
                {/* Active Indicator Glow */}
                {location.pathname === link.href && (
                  <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary drop-shadow-[0_0_5px_rgba(34,197,94,0.8)]" />
                )}
              </Link>
            ))}
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
            className="md:hidden text-foreground p-1 hover:text-primary transition-colors active:scale-90"
            onClick={() => setIsOpen(true)}
          >
            <Menu size={28} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
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
                  >
                    <X size={24} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
              
              <nav className="relative z-10 flex flex-col gap-5 sm:gap-8">
                {siteConfig.navItems.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      "text-base sm:text-lg transition-colors font-semibold flex items-center gap-2",
                      isEnglish ? "uppercase tracking-[0.18em]" : "tracking-[0.04em]",
                      location.pathname === link.href ? "text-primary drop-shadow-[0_0_8px_rgba(34,197,94,0.4)] before:content-['>'] before:text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-8 border-t border-white/10 mt-4">
                  <div className="pb-4">
                    <LanguageBadge className="w-fit" onClick={toggleLocale} />
                  </div>
                  <Link
                    to={siteConfig.primaryJoinRoute}
                    className="bg-primary text-primary-foreground text-center block w-full px-6 py-4 rounded-sm text-sm uppercase tracking-widest font-bold shadow-[0_0_15px_rgba(34,197,94,0.2)] active:scale-95 transition-transform"
                  >
                    {siteConfig.primaryCtaLabel}
                  </Link>
                </div>
              </nav>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content wrapper with AnimatePresence for Page Transitions */}
      <main className="flex-1 flex flex-col w-full relative z-10">
        <div className="flex-1 flex flex-col w-full">
          {outlet}
        </div>
      </main>

      <footer className="border-t border-white/10 py-5 sm:py-6 bg-black relative z-10 text-xs sm:text-sm">
        <div className="container mx-auto px-5 sm:px-6 max-w-7xl flex flex-col gap-4 sm:gap-5">
          <div className="flex flex-col gap-2 border-b border-white/10 pb-4 sm:pb-5">
            <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-[10px] sm:text-xs">
              <span className="w-2 h-2 rounded-full bg-primary" />
              72hours
            </div>
            <p className="max-w-2xl text-muted-foreground font-light leading-relaxed text-sm sm:text-[15px]">
              {footerNote}
            </p>
          </div>

          <div className="grid gap-2.5 rounded-[24px] border border-white/8 bg-white/[0.02] p-3 sm:p-4 lg:grid-cols-3">
              {siteConfig.footerGroups.map((group) => (
                <div key={group.title} className="flex flex-col gap-2.5 px-2 py-1.5">
                  <div className="flex items-center gap-3">
                    <div className={cn("shrink-0 text-[10px] font-bold text-white/45", isEnglish ? "uppercase tracking-[0.24em]" : "tracking-[0.12em]")}>
                      {group.title}
                    </div>
                    <span className="h-px flex-1 bg-white/8" />
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    {group.links.map((link) => {
                      const classes = "group inline-flex min-h-8 items-center gap-2 rounded-full border border-white/8 bg-white/[0.02] px-3 py-1 text-left text-[13px] transition-all hover:border-primary/20 hover:bg-primary/[0.04] hover:text-primary magnetic-target";
                      return link.href.startsWith("http") ? (
                        <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className={classes}>
                          <span className="text-primary/55 transition-transform group-hover:translate-x-0.5">/</span>
                          <span>{link.label}</span>
                        </a>
                      ) : (
                        <Link key={link.label} to={link.href} className={classes}>
                          <span className="text-primary/55 transition-transform group-hover:translate-x-0.5">/</span>
                          <span>{link.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
