// components/global/Footer.tsx
import { FiTerminal, FiArrowUp } from "react-icons/fi";
import { LinksData } from "@/data/links";
import { Sections } from "@/data/sections";

export default function Footer() {
  // Dynamically extract the current year from real-time execution context
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full max-w-5xl mx-auto px-8 md:px-12 pb-12 relative z-20">
      
      {/* 1. Primary Header Row: Brand Identity & Balanced Uptime Action */}
      <div className="w-full border-t border-teal-200 dark:border-teal-800 pt-10 pb-6 pl-4 md:pl-6 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo Signature */}
        <div onClick={scrollToTop} className="cursor-pointer group inline-flex items-center gap-2 select-none">
          <FiTerminal className="w-4 h-4 text-teal-600 dark:text-teal-400 stroke-[2.5] group-hover:rotate-6 transition-transform" />
          <span className="font-mono text-sm font-extrabold tracking-tight text-zinc-900 dark:text-white">
            AN <span className="text-teal-500/80 font-normal dark:text-teal-400/80">//</span>
          </span>
        </div>

        {/* Right: Uptime (Back to Top) Element */}
        <button
          onClick={scrollToTop}
          className="group flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium border border-zinc-200/80 bg-zinc-50/40 text-zinc-500 hover:text-teal-600 hover:border-teal-500/30 dark:border-zinc-800/80 dark:bg-zinc-900/20 dark:text-zinc-400 dark:hover:text-teal-400 transition-all duration-200 cursor-pointer"
          title="Return to Root"
        >
          <span>UPTIME</span>
          <FiArrowUp className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform stroke-[2.5]" />
        </button>

      </div>

      {/* 2. Split Directory Row: Left-Aligned Navigation & Right-Aligned Connections */}
      <div className="w-full pl-4 md:pl-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-8 border-b border-zinc-100 dark:border-zinc-900/40">
        
        {/* Left Side: Navigation Array Block */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 sm:min-w-[80px]">
            Navigation
          </span>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {Sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="text-xs font-medium text-zinc-600 hover:text-teal-600 dark:text-zinc-400 dark:hover:text-teal-400 transition-colors whitespace-nowrap"
              >
                {section.label || section.id}
              </a>
            ))}
          </nav>
        </div>

        {/* Right Side: Micro-Icon External Connection Array Block */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 md:justify-end">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 sm:min-w-[80px] md:text-right">
            Connections
          </span>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {LinksData.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-teal-600 dark:text-zinc-400 dark:hover:text-teal-400 transition-colors group whitespace-nowrap"
                >
                  {/* Scaled down to ultra-clean w-3 h-3 footprint */}
                  <Icon className="w-3 h-3 text-zinc-400 group-hover:text-teal-500 transition-colors shrink-0" />
                  {/* <span>{link.title}</span> */}
                </a>
              );
            })}
          </div>
        </div>

      </div>

      {/* 3. Telemetry Footer Strip: Full Width Meta Properties */}
      <div className="w-full pt-6 pl-4 md:pl-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        {/* Dynamic Year Copyright Output */}
        <p className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
          &copy; {currentYear} Core Infrastructure. All rights reserved.
        </p>

        {/* System Telemetry Track with Integrated Geographic Location Node */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] sm:text-[11px] font-mono text-zinc-400 dark:text-zinc-500 w-full lg:w-auto justify-start lg:justify-end">
          
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="tracking-wider">SYS: NOMINAL</span>
          </div>
          
          <span className="opacity-20">|</span>
          <div className="tracking-wider text-teal-600 dark:text-teal-400 font-bold">
            LOC: MARRAKESH, MOROCCO
          </div>
          
          <span className="opacity-20">|</span>
          <div className="tracking-wider">ENV: PRODUCTION</div>
          
          <span className="opacity-20">|</span>
          <div className="tracking-wider">PROTO: HTTP/1.1</div>

        </div>

      </div>
    </footer>
  );
}