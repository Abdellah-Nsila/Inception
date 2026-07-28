import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import ModeToggle from "@/components/mode-toggle";
import FancyBackground from "@/components/global/FancyBackground";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Dynamic color morphing tracking path positions
  const lineColor = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ["#14b8a6", "#6366f1", "#3b82f6", "#a855f7", "#ec4899"]
  );

  return (
    <ThemeProvider defaultTheme="system" storageKey="portfolio-theme">
      {/* FIX 1: Added w-full and overflow-x-hidden to kill ghost overflow widths */}
      <div className="relative min-h-screen w-full overflow-x-hidden text-zinc-900 dark:text-zinc-50 text-left transition-colors duration-300 z-10">
        <FancyBackground />
        <Navbar />

        {/* FIX 2: Safeguarded fixed placement relative to mobile viewports */}
        <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
          <ModeToggle />
        </div>

        {/* Core Layout Grid - Optimized padding scales for mobile screens (px-4 to px-8) */}
        <div ref={containerRef} className="relative max-w-5xl mx-auto px-4 sm:px-8 py-24 md:py-32 md:px-12">
          
          {/* FIX 3: Moved timeline alignment inside responsive grid gutters (left-4 sm:left-8) */}
          {/* Continuous Left Timeline Track Channel */}
          <div className="absolute left-4 sm:left-8 md:left-0 top-40 bottom-40 w-[2px] bg-zinc-200/60 dark:bg-zinc-800/40 z-0" />
          
          {/* Active Liquid Color-Morphing Core Stream */}
          <motion.div
            style={{ scaleY: scrollYProgress, backgroundColor: lineColor }}
            className="absolute left-4 sm:left-8 md:left-0 top-40 bottom-40 w-[2px] z-0 origin-top"
          />

          {/* Core Children Content Slot - Adjusted spacing relative to the new line placement */}
          <div className="space-y-24 md:space-y-32 pl-6 md:pl-6 relative z-10 w-full">
            {children}
          </div>
        </div>

        <Footer />
      </div>
    </ThemeProvider>
  );
}