import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import Layout from "./components/Layout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ScrollProgress } from "./components/Effects";
import { LocaleProvider, useLocale } from "./lib/locale";
import { ThemeProvider, getThemeColor, useTheme } from "./lib/theme";
import { resolveRouteMeta } from "./content/route-meta";
import { stripLocalePrefix } from "./lib/routes";
import { CapitalTonConnectProvider, TonConnectRuntimeSync } from "./lib/tonconnect";
import CapitalRouteBoundary from "./components/CapitalRouteBoundary";
import Ecosystem from "./pages/Ecosystem";
import Capital from "./pages/Capital";
import CapitalApp from "./pages/CapitalApp";
import CapitalIdentity from "./pages/CapitalIdentity";
import CapitalVerify from "./pages/CapitalVerify";
import GreenBook from "./pages/GreenBook";
import Learn from "./pages/Learn";
import Hours from "./pages/Hours";
import About from "./pages/About";
import Join from "./pages/Join";
import Faq from "./pages/Faq";
import Contact from "./pages/Contact";
import Legal from "./pages/Legal";
import Contracts from "./pages/Contracts";
import NotFound from "./pages/NotFound";

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
  const { theme } = useTheme();
  const barePath = stripLocalePrefix(location.pathname);
  const routeMeta = resolveRouteMeta(locale, barePath);

  useEffect(() => {
    document.documentElement.lang = routeMeta.htmlLang;

    document.title = routeMeta.title;
    setMeta("name", "description", routeMeta.description);
    setMeta("name", "robots", routeMeta.robots);
    setMeta("name", "theme-color", getThemeColor(theme));
    setMeta("property", "og:title", routeMeta.title);
    setMeta("property", "og:description", routeMeta.description);
    setMeta("property", "og:url", routeMeta.canonicalUrl);
    setMeta("property", "og:site_name", routeMeta.siteName);
    setMeta("property", "og:image", routeMeta.ogImageUrl);
    setMeta("property", "og:locale", routeMeta.ogLocale);
    setMeta("name", "twitter:title", routeMeta.title);
    setMeta("name", "twitter:description", routeMeta.description);
    setMeta("name", "twitter:image", routeMeta.ogImageUrl);
    setLink("canonical", routeMeta.canonicalUrl);
    setLink("alternate", routeMeta.alternateZhUrl, { hreflang: "zh-CN" });
    setLink("alternate", routeMeta.alternateEnUrl, { hreflang: "en-US" });
    setLink("alternate", routeMeta.xDefaultUrl, { hreflang: "x-default" });
  }, [
    routeMeta.alternateEnUrl,
    routeMeta.alternateZhUrl,
    routeMeta.canonicalUrl,
    routeMeta.description,
    routeMeta.htmlLang,
    routeMeta.ogImageUrl,
    routeMeta.ogLocale,
    routeMeta.robots,
    routeMeta.siteName,
    routeMeta.title,
    routeMeta.xDefaultUrl,
    theme,
  ]);

  return null;
}

function AppShell() {
  return (
    <>
      <ScrollProgress />
      <RouteObserver />
      <Layout />
    </>
  );
}

function AppProviders() {
  return (
    <LocaleProvider>
      <ThemeProvider>
        <CapitalTonConnectProvider>
          <TonConnectRuntimeSync />
          <AppShell />
        </CapitalTonConnectProvider>
      </ThemeProvider>
    </LocaleProvider>
  );
}

function withCapitalBoundary(element: React.ReactNode) {
  return <CapitalRouteBoundary>{element}</CapitalRouteBoundary>;
}

function AppRoutes() {
  const sharedRoutes = (
    <>
      <Route index element={<Navigate to="join" replace />} />
      <Route path="ecosystem" element={<Ecosystem />} />
      <Route path="capital" element={withCapitalBoundary(<Capital />)} />
      <Route path="capital/me" element={withCapitalBoundary(<CapitalIdentity />)} />
      <Route path="capital/:slug" element={withCapitalBoundary(<CapitalApp />)} />
      <Route path="capital/:slug/:type/:seatNumber" element={withCapitalBoundary(<CapitalVerify />)} />
      <Route path="greenbook" element={<GreenBook />} />
      <Route path="join" element={<Join />} />
      <Route path="learn" element={<Learn />} />
      <Route path="hours" element={<Hours />} />
      <Route path="about" element={<About />} />
      <Route path="faq" element={<Faq />} />
      <Route path="contact" element={<Contact />} />
      <Route path="contracts" element={<Contracts />} />
      <Route path="token" element={<Navigate to="contracts" replace />} />
      <Route path="legal/:slug" element={<Legal />} />
      <Route path="*" element={<NotFound />} />
    </>
  );

  return (
    <Routes>
      <Route path="/" element={<AppProviders />}>
        {sharedRoutes}
      </Route>
      <Route path="/en" element={<AppProviders />}>
        {sharedRoutes}
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
