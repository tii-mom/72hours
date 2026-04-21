import { Link, useLocation, useOutlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../lib/utils";

const NAV_LINKS = [
  { name: "首页", path: "/" },
  { name: "生态应用", path: "/ecosystem" },
  { name: "学习路径", path: "/learn" },
  { name: "hours", path: "/hours" },
  { name: "关于", path: "/about" },
];

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);
  const [time, setTime] = useState(new Date().toUTCString());
  const location = useLocation();
  const outlet = useOutlet(); // Freezes the route state during exit transitions

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toUTCString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sora relative bg-background">
      {/* Global TV / Film Grain Noise Layer & Subtle Grid */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.035] mix-blend-overlay bg-noise" />
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] mix-blend-overlay" />

      <header className="fixed top-0 left-0 right-0 z-50 py-5 transition-all duration-300 bg-background/40 backdrop-blur-md border-b border-white/5">
        <div className="w-full max-w-7xl mx-auto px-8 lg:px-16 flex items-center justify-between">
          <Link to="/" className="text-xl md:text-2xl font-bold tracking-widest text-foreground flex items-center gap-1 group">
             72<span className="text-primary group-hover:drop-shadow-[0_0_10px_rgba(34,197,94,0.5)] transition-all">hours</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 lg:gap-12">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm uppercase tracking-widest transition-colors font-medium hover:text-foreground relative group",
                  location.pathname === link.path ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.name}
                {/* Active Indicator Glow */}
                {location.pathname === link.path && (
                  <motion.div layoutId="nav-indicator" className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary drop-shadow-[0_0_5px_rgba(34,197,94,0.8)]" />
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center">
            <Link
              to="/join"
              className="bg-nav-button hover:bg-nav-button/80 text-foreground border border-white/10 px-6 py-2.5 rounded-sm text-sm uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(34,197,94,0.1)]"
            >
              加入社区
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
              className="absolute top-0 left-0 bottom-0 w-3/4 max-w-sm bg-background border-r border-white/10 p-8 flex flex-col shadow-2xl overflow-hidden before:absolute before:inset-0 before:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] before:bg-[size:20px_20px] before:opacity-30 before:pointer-events-none"
            >
              <div className="relative z-10 flex justify-between items-center mb-12">
                <Link to="/" className="text-xl font-bold tracking-widest text-foreground mix-blend-plus-lighter">
                   72<span className="text-primary">hours</span>
                </Link>
                <button
                  className="text-muted-foreground hover:text-foreground transition-colors p-1"
                  onClick={() => setIsOpen(false)}
                >
                  <X size={24} strokeWidth={1.5} />
                </button>
              </div>
              
              <nav className="relative z-10 flex flex-col gap-8">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "text-lg uppercase tracking-widest transition-colors font-mono flex items-center gap-2",
                      location.pathname === link.path ? "text-primary drop-shadow-[0_0_8px_rgba(34,197,94,0.4)] before:content-['>'] before:text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-8 border-t border-white/10 mt-4">
                  <Link
                    to="/join"
                    className="bg-primary text-primary-foreground text-center block w-full px-6 py-4 rounded-sm text-sm uppercase tracking-widest font-bold shadow-[0_0_15px_rgba(34,197,94,0.2)] active:scale-95 transition-transform"
                  >
                    加入社区
                  </Link>
                </div>
              </nav>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content wrapper with AnimatePresence for Page Transitions */}
      <main className="flex-1 flex flex-col w-full relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex-1 flex flex-col w-full"
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="border-t border-white/10 py-12 bg-black relative z-10 font-mono text-xs md:text-sm">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col gap-10">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-10">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-primary font-bold tracking-widest uppercase">System Online</span>
              </div>
              <div className="text-muted-foreground flex flex-col gap-1">
                <p>Node ID: 72H-NEXUS-01</p>
                <p>Protocol: Vibe Coding v1.0.0</p>
                <p>UTC Time: <span className="text-foreground">{time}</span></p>
              </div>
            </div>

            <div className="text-muted-foreground/30 whitespace-pre font-bold leading-none select-none hidden sm:block transform scale-75 md:scale-100 origin-bottom-right">
{`   _____ ___  
  |__  /|__ \\
    / /   / /
   / /   / /_ 
  /_/   /____| hours`}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-muted-foreground">
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-lg font-sora font-bold tracking-tighter hover:opacity-80 transition-opacity flex items-center magnetic-target">
                <span className="text-white">72</span><span className="text-primary">hours</span>
              </Link>
              <p className="font-sora font-light">先参与，再理解。 / <span className="glitch-text text-white font-mono text-xs uppercase" data-text="TACIT KNOWLEDGE">Tacit Knowledge</span></p>
            </div>
            <div className="flex gap-8 uppercase tracking-widest">
              <a href="https://t.me/the_72h" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center gap-2 magnetic-target">
                <span>[</span> Telegram <span>]</span>
              </a>
              <a href="https://x.com/taichi2077" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center gap-2 magnetic-target">
                <span>[</span> X <span>]</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
