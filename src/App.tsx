import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import React, { useEffect, Suspense } from "react";
import Layout from "./components/Layout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ScrollProgress } from "./components/Effects";

// Lazy load pages for code splitting
const Home = React.lazy(() => import("./pages/Home"));
const Ecosystem = React.lazy(() => import("./pages/Ecosystem"));
const Learn = React.lazy(() => import("./pages/Learn"));
const Hours = React.lazy(() => import("./pages/Hours"));
const About = React.lazy(() => import("./pages/About"));
const Join = React.lazy(() => import("./pages/Join"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

// Vibe-styled fallback loading screen
const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center font-mono text-primary text-sm tracking-widest gap-4 opacity-70">
    <div className="w-8 h-8 rounded-sm animate-spin border-t-2 border-l-2 border-primary"></div>
    <span className="animate-pulse">[ LOADING_MODULE... ]</span>
  </div>
);

function RouteObserver() {
  const location = useLocation();

  useEffect(() => {
    // Analytics & SEO: Dynamic Titles
    const titles: Record<string, string> = {
      "/": "首页 | 72hours - 先参与，再理解",
      "/ecosystem": "生态应用 | 72hours",
      "/learn": "学习路径 | 72hours",
      "/hours": "hours 场景 | 72hours",
      "/about": "关于我们 | 72hours",
      "/join": "加入社区 | 72hours",
    };
    
    document.title = titles[location.pathname] || "404 信号丢失 | 72hours";
  }, [location.pathname]);

  return null;
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollProgress />
        <RouteObserver />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="ecosystem" element={<Ecosystem />} />
              <Route path="learn" element={<Learn />} />
              <Route path="hours" element={<Hours />} />
              <Route path="about" element={<About />} />
              <Route path="join" element={<Join />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
