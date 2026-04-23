import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import React, { Suspense, useEffect } from "react";
import Layout from "./components/Layout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ScrollProgress } from "./components/Effects";
import { LocaleProvider, useLocale } from "./lib/locale";
import { resolveRouteMeta } from "./content/route-meta";
import { stripLocalePrefix } from "./lib/routes";

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
  const barePath = stripLocalePrefix(location.pathname);
  const routeMeta = resolveRouteMeta(locale, barePath);

  useEffect(() => {
    document.documentElement.lang = routeMeta.htmlLang;

    document.title = routeMeta.title;
    setMeta("name", "description", routeMeta.description);
    setMeta("name", "robots", routeMeta.robots);
    setMeta("name", "theme-color", "#030603");
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
  ]);

  return null;
}

function AppShell() {
  return (
    <>
      <ScrollProgress />
      <RouteObserver />
      <Suspense fallback={<PageLoader />}>
        <Layout />
      </Suspense>
    </>
  );
}

function AppRoutes() {
  const sharedRoutes = (
    <>
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
    </>
  );

  return (
    <Routes>
      <Route
        path="/"
        element={
          <LocaleProvider>
            <AppShell />
          </LocaleProvider>
        }
      >
        {sharedRoutes}
      </Route>
      <Route
        path="/en"
        element={
          <LocaleProvider>
            <AppShell />
          </LocaleProvider>
        }
      >
        {sharedRoutes}
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
