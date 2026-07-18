import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiTerminal, FiMenu, FiX, FiDownload } from "react-icons/fi"; 
import { Sections } from "@/data/sections";

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const observers = Sections.map((section) => {
      const el = document.getElementById(section.id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(section.id);
          }
        },
        { rootMargin: "-40% 0px -50% 0px" }
      );

      observer.observe(el);
      return { observer, el };
    });

    return () => {
      observers.forEach((obs) => obs?.observer.unobserve(obs.el));
    };
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false); 
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 w-full max-w-5xl mx-auto">
      {/* Primary Navigation Container Deck */}
      <div className="w-full flex items-center justify-between rounded-full border border-zinc-200/60 bg-white/70 px-4 py-2 shadow-lg backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-950/70 transition-all duration-300">
        
        {/* Left-Aligned Terminal Logo Element */}
        <div className="group flex items-center gap-2 select-none px-2 py-1 cursor-pointer" onClick={() => scrollToSection("home")}>
          <FiTerminal className="w-4 h-4 text-teal-600 dark:text-teal-400 stroke-[2.5] group-hover:rotate-6 transition-transform" />
          <span className="font-mono text-sm font-extrabold tracking-tight text-zinc-900 dark:text-white">
            AN <span className="text-teal-500/80 font-normal dark:text-teal-400/80">//</span>
          </span>
        </div>

        {/* Desktop View Interface Link Array */}
        <nav className="hidden md:flex items-center gap-1">
          {Sections.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                  isActive 
                    ? "text-teal-600 dark:text-teal-400" 
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 z-[-1] rounded-full bg-zinc-100 dark:bg-zinc-900"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {section.label || section.id}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Download & Mobile Toggle Switches */}
        <div className="flex items-center gap-2">
          {/* Global Navbar CV Download Action */}
          <a
            href="/resume.pdf"
            download="Abdellah_Nsila_Resume.pdf"
            className="p-2 rounded-full border border-zinc-200/80 bg-zinc-50/40 text-zinc-600 hover:text-teal-600 hover:border-teal-500/30 dark:border-zinc-800/80 dark:bg-zinc-900/20 dark:text-zinc-400 dark:hover:text-teal-400 transition-all duration-200 shadow-sm"
            title="Download CV"
            aria-label="Download CV"
          >
            <FiDownload className="w-4 h-4 stroke-[2.5]" />
          </a>

          {/* Mobile View Toggle Switch */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-full text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <FiX className="w-5 h-5 stroke-[2.5]" /> : <FiMenu className="w-5 h-5 stroke-[2.5]" />}
            </button>
          </div>
        </div>

      </div>

      {/* Mobile View Full Overlay Slide Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute top-16 inset-x-4 p-4 rounded-3xl border border-zinc-200/80 bg-white/95 shadow-xl backdrop-blur-lg dark:border-zinc-800/80 dark:bg-zinc-950/95 md:hidden flex flex-col gap-1.5 z-40"
          >
            {Sections.map((section, index) => {
              const isActive = activeSection === section.id;
              return (
                <motion.button
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full text-left font-medium text-base py-3 px-4 rounded-2xl transition-all flex items-center justify-between ${
                    isActive 
                      ? "bg-zinc-100 text-teal-600 dark:bg-zinc-900 dark:text-teal-400 font-bold" 
                      : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900/50"
                  }`}
                >
                  <span>{section.label || section.id}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 dark:bg-teal-400" />
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}