import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import React, { useEffect, Suspense } from "react";
import Layout from "./components/Layout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ScrollProgress } from "./components/Effects";
import { LocaleProvider, useLocale } from "./lib/locale";
import { getSiteConfig } from "./content/site-config";
import { getAboutContent } from "./content/about";
import { getHoursContent } from "./content/hours";
import { getJoinContent } from "./content/join";
import { greenbookContent } from "./content/greenbook";
import { getLegalDoc, getLegalTitle } from "./lib/content";

// Lazy load pages for code splitting
const Home = React.lazy(() => import("./pages/Home"));
const Ecosystem = React.lazy(() => import("./pages/Ecosystem"));
const GreenBook = React.lazy(() => import("./pages/GreenBook"));
const Learn = React.lazy(() => import("./pages/Learn"));
const Hours = React.lazy(() => import("./pages/Hours"));
const About = React.lazy(() => import("./pages/About"));
const Join = React.lazy(() => import("./pages/Join"));
const Faq = React.lazy(() => import("./pages/Faq"));
const Contact = React.lazy(() => import("./pages/Contact"));
const Legal = React.lazy(() => import("./pages/Legal"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

// Vibe-styled fallback loading screen
const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center font-mono text-primary text-sm tracking-widest gap-4 opacity-70">
    <div className="w-8 h-8 rounded-sm animate-spin border-t-2 border-l-2 border-primary"></div>
    <span className="animate-pulse">[ LOADING_MODULE... ]</span>
  </div>
);

function setMeta(attribute: "name" | "property", key: string, content: string) {
  const selector = `meta[${attribute}="${key}"]`;
  let tag = document.head.querySelector(selector) as HTMLMetaElement | null;

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
}

function setLink(rel: string, href: string, options?: { hreflang?: string }) {
  const selector =
    options?.hreflang
      ? `link[rel="${rel}"][hreflang="${options.hreflang}"]`
      : `link[rel="${rel}"]:not([hreflang])`;
  let tag = document.head.querySelector(selector) as HTMLLinkElement | null;

  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", rel);

    if (options?.hreflang) {
      tag.setAttribute("hreflang", options.hreflang);
    }

    document.head.appendChild(tag);
  }

  tag.setAttribute("href", href);
}

function RouteObserver() {
  const location = useLocation();
  const { locale } = useLocale();
  const isEnglish = locale === "en-US";
  const siteConfig = getSiteConfig(locale);
  const aboutContent = getAboutContent(locale);
  const hoursContent = getHoursContent(locale);
  const joinContent = getJoinContent(locale);
  const greenbookDescription = isEnglish
    ? "Read Green Book to see how 72H connects use, participation, and learning."
    : "看绿书，了解 72H 如何串起使用、参与和学习。";
  const greenbookTitle = isEnglish ? "Green Book" : "绿书";
  const hoursTitle = isEnglish ? "Hours" : "小时";
  const faqTitle = isEnglish ? "FAQ" : "常见问题";
  const contactTitle = isEnglish ? "Contact" : "联系";

  useEffect(() => {
    document.documentElement.lang = siteConfig.language;

    const metaByPath: Record<string, { title: string; description: string }> = {
      "/": {
        title: `${siteConfig.siteName} | ${isEnglish ? "Home" : "首页"}`,
        description: siteConfig.hero.subtitle,
      },
      "/join": {
        title: `${siteConfig.siteName} | ${isEnglish ? "Join" : "参与入口"}`,
        description: joinContent.subtitle,
      },
      "/ecosystem": {
        title: `${siteConfig.siteName} | ${isEnglish ? "Ecosystem" : "生态应用"}`,
        description: isEnglish
          ? "Check the status, participation path, and next step for each 72hours ecosystem app."
          : "查看 72hours 生态应用的状态、参与方式和下一步。",
      },
      "/greenbook": {
        title: `${siteConfig.siteName} | ${greenbookTitle}`,
        description: greenbookDescription,
      },
      "/learn": {
        title: `${siteConfig.siteName} | ${isEnglish ? "Learn" : "学习路径"}`,
        description: isEnglish ? "Read Green Book first, then learn to build." : "先看绿书，再学开发。",
      },
      "/hours": {
        title: `${siteConfig.siteName} | ${hoursTitle}`,
        description: hoursContent.subtitle,
      },
      "/about": {
        title: `${siteConfig.siteName} | ${isEnglish ? "About" : "关于"}`,
        description: aboutContent.subtitle,
      },
      "/faq": {
        title: `${siteConfig.siteName} | ${faqTitle}`,
        description: isEnglish
          ? "Getting started, safety, learning, and Hours."
          : "关于 72hours 的入门、安全、学习和小时常见问题。",
      },
      "/contact": {
        title: `${siteConfig.siteName} | ${contactTitle}`,
        description: isEnglish
          ? "Official contact paths for Telegram, X, and WeChat."
          : "核对 Telegram、X 和微信说明页的官方联系路径。",
      },
    };

    let nextMeta =
      metaByPath[location.pathname] ?? {
        title: `${siteConfig.siteName} | 404`,
        description: isEnglish
          ? "This page does not exist or has moved. Return home and choose a valid entry."
          : "页面不存在或已迁移。返回首页并重新选择入口。",
      };

    if (location.pathname.startsWith("/legal/")) {
      const slug = location.pathname.split("/").pop();
      const legalTitle = getLegalTitle(locale, slug);
      const legalDescription = getLegalDoc(locale, slug)?.summary ?? (isEnglish ? "Legal notes for 72hours." : "72hours 的法律说明。");
      const docTitle = legalTitle;
      nextMeta = {
        title: docTitle,
        description: legalDescription,
      };
    }

    const canonicalUrl = new URL(location.pathname, siteConfig.siteUrl).href;
    const alternateLocale = isEnglish ? "zh-CN" : "en-US";
    const alternateUrl = new URL(`${location.pathname}?lang=${alternateLocale}`, siteConfig.siteUrl).href;
    const socialImageUrl = new URL("/og-cover.svg", siteConfig.siteUrl).href;

    document.title = nextMeta.title;
    setMeta("name", "description", nextMeta.description);
    setMeta("name", "theme-color", "#030603");
    setMeta("property", "og:title", nextMeta.title);
    setMeta("property", "og:description", nextMeta.description);
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:site_name", siteConfig.siteName);
    setMeta("property", "og:image", socialImageUrl);
    setMeta("property", "og:locale", siteConfig.language);
    setMeta("name", "twitter:title", nextMeta.title);
    setMeta("name", "twitter:description", nextMeta.description);
    setMeta("name", "twitter:image", socialImageUrl);
    setLink("canonical", canonicalUrl);
    setLink("alternate", canonicalUrl, { hreflang: siteConfig.language });
    setLink("alternate", alternateUrl, { hreflang: alternateLocale });
    setLink("alternate", canonicalUrl, { hreflang: "x-default" });
  }, [
    location.pathname,
    locale,
    siteConfig.language,
    siteConfig.siteName,
    siteConfig.siteUrl,
    siteConfig.hero.subtitle,
    joinContent.subtitle,
    hoursContent.subtitle,
    aboutContent.subtitle,
    greenbookDescription,
    isEnglish,
  ]);

  return null;
}

export default function App() {
  return (
    <ErrorBoundary>
      <LocaleProvider>
        <BrowserRouter>
          <ScrollProgress />
          <RouteObserver />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="ecosystem" element={<Ecosystem />} />
                <Route path="greenbook" element={<GreenBook />} />
                <Route path="join" element={<Join />} />
                <Route path="learn" element={<Learn />} />
                <Route path="hours" element={<Hours />} />
                <Route path="about" element={<About />} />
                <Route path="faq" element={<Faq />} />
                <Route path="contact" element={<Contact />} />
                <Route path="legal/:slug" element={<Legal />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </LocaleProvider>
    </ErrorBoundary>
  );
}
