import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import {
  ArrowRight,
  AtSign,
  BookOpen,
  ChevronDown,
  Clock,
  ExternalLink,
  FileText,
  FileJson,
  Globe2,
  Handshake,
  Info,
  Languages,
  Menu,
  Send,
  Shield,
  Wallet,
  X,
} from "lucide-react";
import { cn } from "../lib/utils";
import { getSiteConfig } from "../content/site-config";
import { useLocale } from "../lib/locale";
import { localizeHref, stripLocalePrefix } from "../lib/routes";
import { LocalizedLink as Link } from "./LocalizedLink";
import { ThemeToggle } from "./ThemeToggle";

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

const SITE_LOGO_SRC = "/brand/72hours-logo.png";

function getFocusableElements(root: HTMLElement | null) {
  if (!root) return [] as HTMLElement[];
  return Array.from(root.querySelectorAll<HTMLElement>(focusableSelector)).filter(
    (element) => element.offsetParent !== null || element === document.activeElement,
  );
}

function LanguageBadge({ className = "", onClick }: { className?: string; onClick?: () => void }) {
  const { isEnglish } = useLocale();

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 whitespace-nowrap rounded-sm border border-line/70 bg-surface/80 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground sm:min-h-0 sm:min-w-0 sm:text-xs",
        className,
      )}
      aria-label={isEnglish ? "Switch to Chinese" : "Switch to English"}
    >
      <Languages size={14} strokeWidth={1.75} aria-hidden="true" />
      <span>{isEnglish ? "EN" : "中文"}</span>
    </button>
  );
}

function BrandLogo({ className = "", markClassName = "", showName = true }: { className?: string; markClassName?: string; showName?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <img
        src={SITE_LOGO_SRC}
        alt=""
        aria-hidden="true"
        className={cn("h-9 w-9 shrink-0 rounded-sm object-contain", markClassName)}
      />
      {showName ? <span className="text-foreground">72hours</span> : null}
    </span>
  );
}

function MobileCapitalLink() {
  const { isEnglish } = useLocale();

  return (
    <Link
      to="/capital/me"
      className="inline-flex min-h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-sm border border-line/70 bg-surface/80 px-2 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:cursor-wait disabled:opacity-60"
      aria-label={isEnglish ? "Open Capital wallet page" : "打开 Capital 钱包页"}
    >
      <Wallet size={14} strokeWidth={1.75} aria-hidden="true" />
      <span className="truncate">{isEnglish ? "Capital" : "钱包"}</span>
    </Link>
  );
}

type FooterActionLinkProps = {
  actionLabel: string;
  body: string;
  external: boolean;
  href: string;
  icon: ReactNode;
  title: string;
};

function FooterActionLink({ actionLabel, body, external, href, icon, title }: FooterActionLinkProps) {
  const className =
    "group grid min-h-[5.5rem] grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-4 bg-background/40 px-4 py-4 text-left transition-colors duration-200 hover:bg-surface-elevated/72 sm:grid-cols-[3.25rem_minmax(0,1fr)_auto] sm:px-5";
  const content = (
    <>
      <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-sm border border-line/75 bg-surface/70 text-primary transition-colors duration-200 group-hover:border-gold/45 group-hover:text-gold">
        <span className="absolute inset-0 bg-primary/5 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        <span className="relative">{icon}</span>
      </div>
      <div className="min-w-0">
        <div className="text-[0.98rem] font-semibold tracking-normal text-foreground sm:text-base">
          {title}
        </div>
        <p className="mt-1 text-[12px] leading-5 text-muted-foreground sm:text-[13px]">
          {body}
        </p>
      </div>
      <div className="flex items-center justify-end gap-2 text-muted-foreground transition-colors duration-200 group-hover:text-gold">
        <span className="hidden text-[10px] font-bold uppercase tracking-[0.2em] sm:inline">
          {actionLabel}
        </span>
        {external ? (
          <ExternalLink className="h-4 w-4" strokeWidth={1.8} />
        ) : (
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={1.8} />
        )}
      </div>
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link to={href} className={className}>
      {content}
    </Link>
  );
}

function getFooterLinkMeta(href: string, isEnglish: boolean) {
  if (href.includes("t.me")) {
    return {
      body: isEnglish ? "Community channel and latest updates." : "社区频道与最新动态。",
      icon: <Send size={17} strokeWidth={1.75} />,
    };
  }

  if (href.includes("x.com")) {
    return {
      body: isEnglish ? "Public updates and context." : "公开动态与上下文。",
      icon: <AtSign size={17} strokeWidth={1.75} />,
    };
  }

  switch (href) {
    case "/ecosystem":
      return {
        body: isEnglish ? "Apps, tools, and active surfaces." : "应用、工具与可进入界面。",
        icon: <Globe2 size={17} strokeWidth={1.75} />,
      };
    case "/capital":
      return {
        body: isEnglish ? "Capital seats and identity verification." : "资本席位与身份验证。",
        icon: <Shield size={17} strokeWidth={1.75} />,
      };
    case "/contracts":
      return {
        body: isEnglish ? "Mainnet token and contract evidence." : "主网代币与合约证据。",
        icon: <FileJson size={17} strokeWidth={1.75} />,
      };
    case "/join":
      return {
        body: isEnglish ? "Community, contact, and public updates." : "社区、联系与公开动态。",
        icon: <Handshake size={17} strokeWidth={1.75} />,
      };
    case "/greenbook":
      return {
        body: isEnglish ? "Shared context and operating notes." : "共同语境与使用说明。",
        icon: <BookOpen size={17} strokeWidth={1.75} />,
      };
    case "/hours":
      return {
        body: isEnglish ? "Use cases, roles, and boundaries." : "用途、角色与边界。",
        icon: <Clock size={17} strokeWidth={1.75} />,
      };
    case "/about":
      return {
        body: isEnglish ? "Project direction and basic context." : "项目方向与基础背景。",
        icon: <Info size={17} strokeWidth={1.75} />,
      };
    case "/legal/privacy":
      return {
        body: isEnglish ? "Privacy handling and data boundaries." : "隐私处理与数据边界。",
        icon: <Shield size={17} strokeWidth={1.75} />,
      };
    case "/legal/terms":
      return {
        body: isEnglish ? "Terms for site access and use." : "网站访问与使用条款。",
        icon: <FileText size={17} strokeWidth={1.75} />,
      };
    case "/legal/disclaimer":
      return {
        body: isEnglish ? "Risk notes and non-advisory statement." : "风险说明与非建议声明。",
        icon: <FileText size={17} strokeWidth={1.75} />,
      };
    default:
      return {
        body: isEnglish ? "Open this official entry." : "打开官方入口。",
        icon: <ArrowRight size={17} strokeWidth={1.75} />,
      };
  }
}

function isNavPathActive(currentPath: string, href: string) {
  return currentPath === href || (href !== "/" && currentPath.startsWith(`${href}/`));
}

function getNavIcon(href: string) {
  switch (href) {
    case "/join":
      return <Handshake size={19} strokeWidth={1.75} />;
    case "/ecosystem":
      return <Globe2 size={19} strokeWidth={1.75} />;
    case "/capital":
      return <Shield size={19} strokeWidth={1.75} />;
    case "/contracts":
      return <FileJson size={19} strokeWidth={1.75} />;
    case "/greenbook":
      return <BookOpen size={19} strokeWidth={1.75} />;
    default:
      return <ArrowRight size={19} strokeWidth={1.75} />;
  }
}

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const location = useLocation();
  const { locale, toggleLocale, isEnglish } = useLocale();
  const siteConfig = getSiteConfig(locale);
  const mobileNavItems = siteConfig.navItems.filter((link) =>
    ["/ecosystem", "/capital", "/contracts", "/greenbook", "/join"].includes(link.href),
  );
  const drawerNavItems = [
    ...siteConfig.footerGroups.flatMap((group) => group.links),
  ].filter((link) =>
    ["/hours", "/about", "/legal/privacy", "/legal/terms", "/legal/disclaimer"].includes(link.href),
  );
  const outlet = useOutlet();
  const headerRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const drawerId = useId();
  const drawerTitleId = useId();
  const drawerDescriptionId = useId();
  const footerNote = siteConfig.globalDisclaimerExcerpt;
  const isMiniAppLayout = stripLocalePrefix(location.pathname) === "/bot/presale";

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    setExpandedGroups((current) => {
      const next = { ...current };

      for (const group of siteConfig.footerGroups) {
        if (!(group.id in next)) {
          next[group.id] = group.id === "enter";
        }
      }

      for (const key of Object.keys(next)) {
        if (!siteConfig.footerGroups.some((group) => group.id === key)) {
          delete next[key];
        }
      }

      return next;
    });
  }, [locale]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const body = document.body;
    const inertTargets = [headerRef.current, mainRef.current, footerRef.current].filter(
      Boolean,
    ) as HTMLElement[];

    lastFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    inertTargets.forEach((element) => {
      element.setAttribute("inert", "");
      element.setAttribute("aria-hidden", "true");
    });

    const focusTarget = getFocusableElements(drawerRef.current)[0] ?? closeButtonRef.current;
    const focusTimeout = window.setTimeout(() => focusTarget?.focus(), 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") {
        return;
      }

      const focusable = getFocusableElements(drawerRef.current);
      if (focusable.length === 0) {
        event.preventDefault();
        closeButtonRef.current?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || !drawerRef.current?.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimeout);
      document.removeEventListener("keydown", handleKeyDown);
      body.style.overflow = previousOverflow;

      inertTargets.forEach((element) => {
        element.removeAttribute("inert");
        element.removeAttribute("aria-hidden");
      });

      lastFocusedRef.current?.focus();
    };
  }, [isOpen]);

  const toggleFooterGroup = (groupId: string) => {
    setExpandedGroups((current) => ({
      ...current,
      [groupId]: !current[groupId],
    }));
  };

  if (isMiniAppLayout) {
    return (
      <div className="relative flex min-h-screen flex-col bg-background font-sora text-foreground">
        <div className="pointer-events-none fixed inset-0 z-0 opacity-20 bg-[linear-gradient(color-mix(in_srgb,hsl(var(--foreground))_8%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,hsl(var(--foreground))_8%,transparent)_1px,transparent_1px)] bg-[size:44px_44px]" />
        <main id="main-content" ref={mainRef} tabIndex={-1} className="relative z-10 flex flex-1 flex-col">
          <div className="flex min-h-0 flex-1 flex-col">{outlet}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-background pb-[calc(5.05rem+var(--safe-bottom))] font-sora text-foreground md:pb-0">
      <a
        href="#main-content"
        className="sr-only z-[60] rounded-sm border border-primary/30 bg-background px-4 py-3 text-xs font-bold uppercase tracking-widest text-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
      >
        {isEnglish ? "Skip to main content" : "跳到主要内容"}
      </a>

      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.022] mix-blend-overlay bg-noise motion-reduce:hidden" />
      <div className="pointer-events-none fixed inset-0 z-0 opacity-20 bg-[linear-gradient(color-mix(in_srgb,hsl(var(--foreground))_8%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,hsl(var(--foreground))_8%,transparent)_1px,transparent_1px)] bg-[size:44px_44px]" />

      <header
        ref={headerRef}
        className="fixed left-0 right-0 top-0 z-50 border-b border-line/60 bg-background/78 pt-[calc(0.55rem+var(--safe-top))] backdrop-blur-xl transition-colors md:pt-[calc(0.875rem+var(--safe-top))]"
      >
        <div className="mx-auto hidden w-full max-w-7xl items-center justify-between px-5 pb-3.5 sm:px-8 sm:pb-5 md:flex lg:px-16">
          <Link
            to={siteConfig.primaryJoinRoute}
            className="group inline-flex min-h-11 items-center px-0.5 text-lg font-bold tracking-widest text-foreground sm:min-h-0 sm:px-0 sm:text-xl md:text-2xl"
            aria-label="72hours"
          >
            <BrandLogo markClassName="h-10 w-10 transition-transform group-hover:scale-105" />
          </Link>

          <nav className="hidden items-center gap-5 md:flex lg:gap-8 xl:gap-10" aria-label={isEnglish ? "Primary navigation" : "主导航"}>
            {siteConfig.navItems.map((link) => {
              const href = localizeHref(link.href, locale);
              const isActive = isNavPathActive(location.pathname, href);

              return (
                <Link
                  key={href}
                  to={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative whitespace-nowrap text-sm font-medium uppercase tracking-[0.14em] transition-colors hover:text-foreground",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {link.label}
                  {isActive ? <div className="absolute -bottom-2 left-0 right-0 h-px bg-primary" /> : null}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            <LanguageBadge onClick={toggleLocale} />
            <Link
              to={siteConfig.primaryJoinRoute}
              className="whitespace-nowrap rounded-sm border border-gold/25 bg-nav-button px-5 py-2.5 text-sm uppercase tracking-[0.14em] text-foreground transition-colors hover:border-primary/40 hover:bg-surface-elevated active:scale-95"
            >
              {siteConfig.primaryCtaLabel}
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm border border-line/70 bg-surface/60 p-2 text-foreground transition-colors hover:text-primary active:scale-95 md:hidden"
            onClick={() => setIsOpen(true)}
            aria-label={isEnglish ? "Open site settings" : "打开网站设置"}
            aria-expanded={isOpen}
            aria-controls={drawerId}
          >
            <Menu size={26} strokeWidth={1.5} />
          </button>
        </div>

        <div className="mx-auto grid w-full max-w-md grid-cols-[1fr_1fr_minmax(6rem,1.2fr)_2.75rem] gap-2 px-4 pb-2 md:hidden">
          <ThemeToggle className="min-w-0 px-2" />
          <LanguageBadge className="min-w-0 px-2" onClick={toggleLocale} />
          <MobileCapitalLink />
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm border border-line/70 bg-surface/60 p-2 text-foreground transition-colors hover:text-primary active:scale-95"
            onClick={() => setIsOpen(true)}
            aria-label={isEnglish ? "Open site settings" : "打开网站设置"}
            aria-expanded={isOpen}
            aria-controls={drawerId}
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {isOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 cursor-default bg-background/72 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsOpen(false)}
          />

          <aside
            ref={drawerRef}
            id={drawerId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={drawerTitleId}
            aria-describedby={drawerDescriptionId}
            className="absolute inset-y-0 left-0 flex w-[92%] max-w-[430px] flex-col overflow-hidden border-r border-line/70 bg-background px-5 pb-5 pt-[calc(1.25rem+var(--safe-top))] shadow-2xl animate-slide-in-left sm:p-8"
          >
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(color-mix(in_srgb,hsl(var(--foreground))_8%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,hsl(var(--foreground))_8%,transparent)_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />

            <div className="relative z-10 flex items-center justify-between gap-3">
              <div>
                <h2 id={drawerTitleId} className="text-2xl font-bold tracking-widest text-foreground">
                  <BrandLogo markClassName="h-10 w-10" />
                </h2>
                <p id={drawerDescriptionId} className="mt-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  {isEnglish ? "Theme, language, and notes." : "主题、语言与说明。"}
                </p>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm border border-line/70 bg-surface/70 text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setIsOpen(false)}
                aria-label={isEnglish ? "Close navigation menu" : "关闭导航菜单"}
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            <div className="relative z-10 mt-6 grid grid-cols-2 gap-2">
              <ThemeToggle className="w-full justify-center px-3 py-3" />
              <LanguageBadge className="w-full justify-center px-3 py-3" onClick={toggleLocale} />
            </div>

            <nav className="relative z-10 mt-8 flex flex-col border-y border-line/70" aria-label={isEnglish ? "Secondary navigation" : "辅助导航"}>
              {drawerNavItems.map((link, index) => {
                const href = localizeHref(link.href, locale);
                const isActive = isNavPathActive(location.pathname, href);

                return (
                  <Link
                    key={href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "grid min-h-16 grid-cols-[2.6rem_minmax(0,1fr)_1rem] items-center border-b border-line/70 py-3 text-left text-lg font-semibold tracking-normal transition-colors last:border-b-0",
                      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span className="font-mono text-[11px] text-gold/75">{String(index + 1).padStart(2, "0")}</span>
                    <span>{link.label}</span>
                    <span className={cn("h-1.5 w-1.5 rounded-full", isActive ? "bg-primary" : "bg-line")} />
                  </Link>
                );
              })}
            </nav>

            <div className="relative z-10 mt-auto pt-6">
              <div className="grid gap-3">
                <Link to={siteConfig.primaryJoinRoute} className="premium-button w-full" onClick={() => setIsOpen(false)}>
                  {siteConfig.primaryCtaLabel}
                </Link>
                <Link to="/join" className="premium-button-muted w-full" onClick={() => setIsOpen(false)}>
                  {siteConfig.secondaryCtaLabel}
                </Link>
              </div>
            </div>
          </aside>
        </div>
      ) : null}

      <main id="main-content" ref={mainRef} tabIndex={-1} className="relative z-10 flex flex-1 flex-col">
        <div className="flex min-h-0 flex-1 flex-col">{outlet}</div>
      </main>

      {!isOpen ? (
        <nav
          className="fixed inset-x-0 bottom-0 z-50 border-t border-line/75 bg-background/94 px-3 pb-[calc(0.45rem+var(--safe-bottom))] pt-1.5 backdrop-blur-xl md:hidden"
          aria-label={isEnglish ? "Primary mobile navigation" : "移动主导航"}
        >
          <div className="mx-auto grid max-w-md grid-cols-4 gap-1 rounded-md border border-line/60 bg-surface/36 p-1 shadow-[0_-18px_54px_rgba(0,0,0,0.32)]">
            {mobileNavItems.map((link) => {
              const href = localizeHref(link.href, locale);
              const isActive = isNavPathActive(location.pathname, href);

              return (
                <Link
                  key={href}
                  to={link.href}
                  aria-label={link.label}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "group relative flex min-h-[3.15rem] items-center justify-center rounded-sm border px-1 transition-colors",
                    isActive
                      ? "border-primary/35 bg-primary/12 text-primary"
                      : "border-transparent text-muted-foreground hover:border-line/70 hover:bg-background/54 hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center transition-colors",
                      isActive ? "text-primary" : "text-gold/70 group-hover:text-gold",
                    )}
                    aria-hidden="true"
                  >
                    {getNavIcon(link.href)}
                  </span>
                  {isActive ? <span className="absolute bottom-1 h-1 w-1 rounded-full bg-primary" aria-hidden="true" /> : null}
                </Link>
              );
            })}
          </div>
        </nav>
      ) : null}

      <footer
        ref={footerRef}
        className="relative z-10 hidden border-t border-line/70 bg-background/95 text-sm md:block"
      >
        <div className="mx-auto grid max-w-7xl gap-7 px-4 py-8 sm:px-8 sm:py-12 lg:grid-cols-[minmax(180px,0.22fr)_minmax(0,1fr)] lg:gap-8 lg:px-16">
          <div className="flex flex-col gap-4 px-1 sm:px-0">
            <div className="text-xl font-bold tracking-widest text-foreground sm:text-2xl">
              <BrandLogo markClassName="h-10 w-10" />
            </div>
            <p className="max-w-sm text-[13px] font-light leading-6 text-muted-foreground sm:text-sm">
              {footerNote}
            </p>
            <div className="mt-1 h-px w-16 bg-gold/45" />
          </div>

          <nav
            className="overflow-hidden rounded-md border border-line/75 bg-surface/24 shadow-[0_24px_80px_rgba(0,0,0,0.18)]"
            aria-label={isEnglish ? "Footer navigation" : "页脚导航"}
          >
            {siteConfig.footerGroups.map((group) => {
              const isExpanded = expandedGroups[group.id] ?? group.id === "enter";
              const count = String(group.links.length).padStart(2, "0");

              return (
                <section key={group.id} className="border-b border-line/70 last:border-b-0">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 border-b border-line/70 bg-background/42 px-4 py-3 text-left md:hidden"
                    onClick={() => toggleFooterGroup(group.id)}
                    aria-expanded={isExpanded}
                    aria-controls={`footer-group-${group.id}`}
                  >
                    <span className={cn("text-[11px] font-bold text-gold", isEnglish ? "uppercase tracking-[0.24em]" : "tracking-[0.14em]")}>
                      {group.title}
                    </span>
                    <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                      {count}
                      <ChevronDown
                        className={cn("h-4 w-4 transition-transform duration-200", isExpanded ? "rotate-180" : "rotate-0")}
                        aria-hidden="true"
                      />
                    </span>
                  </button>

                  <div className="hidden items-center justify-between border-b border-line/70 bg-background/42 px-4 py-3 md:flex sm:px-5">
                    <div className={cn("text-[11px] font-bold text-gold", isEnglish ? "uppercase tracking-[0.24em]" : "tracking-[0.14em]")}>
                      {group.title}
                    </div>
                    <span className="font-mono text-[11px] text-gold/75">{count}</span>
                  </div>

                  <div
                    id={`footer-group-${group.id}`}
                    className={cn(
                      "grid gap-px divide-y divide-line/70 sm:grid-cols-2 sm:divide-x sm:divide-y-0 sm:divide-line/70 lg:grid-cols-3",
                      isExpanded ? "grid md:grid" : "hidden md:grid",
                    )}
                  >
                    {group.links.map((link) => {
                      const external = link.href.startsWith("http");
                      const meta = getFooterLinkMeta(link.href, isEnglish);

                      return (
                        <FooterActionLink
                          key={link.label}
                          actionLabel={isEnglish ? "Enter" : "进入"}
                          body={meta.body}
                          external={external}
                          href={link.href}
                          icon={meta.icon}
                          title={link.label}
                        />
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </nav>
        </div>
      </footer>
    </div>
  );
}
