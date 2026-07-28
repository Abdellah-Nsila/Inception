import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowUpRight, FiLayers, FiMail } from "react-icons/fi";
import { quotesData } from "@/data/quotes";
import { LinksData } from "@/data/links";

export default function Home({ sectionIndex }: { sectionIndex: number }) {
  const displayId = String(sectionIndex + 1).padStart(2, "0");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % quotesData.length);
    }, 2500);
    
    return () => clearInterval(timer);
  }, []);

  // Programmatic Smooth Scroll Handler to prevent immediate jump cuts
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section 
      id={`home_${displayId}`} 
      className="min-h-[85vh] grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-y-12 md:gap-x-12 items-center py-12 relative w-full"
    >
      
      {/* 1. Left Column: Identity & Call-to-Actions */}
      <div className="space-y-7 w-full order-2 md:order-1 md:col-span-7">
        
        {/* Animated Phrase Subtitle */}
        <div className="h-6 overflow-hidden relative w-full flex items-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className={`text-sm font-mono uppercase tracking-widest font-bold block ${quotesData[index].color}`}
            >
              {quotesData[index].text}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Main Identity Block */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
            Hey, I'm{" "}
            <span className="bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-transparent">
              Abdellah Nsila
            </span>
          </h1>
          
          <p className="max-w-xl text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Software Engineer specializing in low-level systems, custom network protocols, and high-performance web architectures. I build secure, fluid infrastructures focused on speed and reliability.
          </p>
        </div>

        {/* Redesigned Premium CTA Interface Array */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full max-w-md">
          
          {/* Primary Action Button: Tech Outline to Fill Flood */}
          <button 
            onClick={() => scrollToSection("projects")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold border border-zinc-400 bg-zinc-50/20 text-zinc-600 hover:text-zinc-900 hover:border-zinc-400 dark:border-zinc-600 dark:bg-zinc-950/20 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:border-zinc-600 transition-all duration-300 active:scale-[0.98] cursor-pointer"
          >
            <FiLayers className="w-4 h-4 opacity-80 group-hover:rotate-6 transition-transform" />
            <span>Explore Projects</span>
          </button>

          {/* Secondary Action Button: Clean Mechanical Ghost Border */}
          <button 
            onClick={() => scrollToSection("contact")}
            className="group w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold border border-teal-500/40 bg-teal-500/5 text-teal-600 dark:text-teal-400 hover:bg-teal-600 hover:text-white dark:hover:bg-teal-500 dark:hover:text-white transition-all duration-300 active:scale-[0.98] shadow-sm shadow-teal-500/5 cursor-pointer"
          >
            <FiMail className="w-4 h-4 opacity-70" />
            <span>Get in Touch</span>
          </button>
          
        </div>
      </div>

      {/* 2. Right Column: Animating Fluid Profile Frame */}
      <div className="flex justify-center items-center w-full order-1 md:order-2 md:col-span-5">
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 flex items-center justify-center">
          
          {/* Animated Background Glow */}
          <motion.div
            animate={{
              borderRadius: [
                "42% 58% 70% 30% / 45% 45% 55% 55%",
                "70% 30% 52% 48% / 60% 40% 60% 40%",
                "42% 58% 70% 30% / 45% 45% 55% 55%"
              ],
              rotate: [0, 120, 360]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 bg-gradient-to-tr from-teal-500/30 to-emerald-500/20 blur-xl opacity-80 dark:opacity-60"
          />

          {/* Morphing Liquid Mask Container */}
          <motion.div
            animate={{
              borderRadius: [
                "42% 58% 70% 30% / 45% 45% 55% 55%",
                "70% 30% 52% 48% / 60% 40% 60% 40%",
                "42% 58% 70% 30% / 45% 45% 55% 55%"
              ]
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-full h-full p-1.5 bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-500 shadow-xl overflow-hidden group cursor-pointer"
          >
            
            {/* Image Wrapper */}
            <motion.div 
              animate={{
                borderRadius: [
                  "42% 58% 70% 30% / 45% 45% 55% 55%",
                  "70% 30% 52% 48% / 60% 40% 60% 40%",
                  "42% 58% 70% 30% / 45% 45% 55% 55%"
                ]
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-full h-full overflow-hidden bg-zinc-100 dark:bg-zinc-900"
            >
              <img
                src={`${import.meta.env.BASE_URL}profile.jpeg`}
                alt="Abdellah Nsila"
                className="w-full h-full object-cover object-top scale-125 group-hover:scale-130 transition-transform duration-500 ease-out grayscale-[15%] group-hover:grayscale-0"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80";
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* 3. Full-Width Links Row */}
      <div className="col-span-1 md:col-span-12 order-3 w-full pt-4 md:pt-8 border-t border-zinc-100 dark:border-zinc-900/60">
        <div className="flex flex-wrap items-center gap-2.5 w-full">
          {LinksData.map((link) => {
            const Icon = link.icon;

            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border border-zinc-200 bg-zinc-50/50 text-zinc-700 hover:text-teal-600 hover:border-teal-500/30 hover:bg-teal-50/50 dark:border-zinc-800/80 dark:bg-zinc-900/30 dark:text-zinc-300 dark:hover:text-teal-400 dark:hover:border-teal-500/30 dark:hover:bg-teal-950/20 transition-all duration-200 whitespace-nowrap"
              >
                <span className="text-zinc-400 group-hover:text-teal-500 dark:text-zinc-500 dark:group-hover:text-teal-400 transition-colors">
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                </span>
                
                <span>{link.title}</span>
                
                <FiArrowUpRight className="w-3.5 h-3.5 text-zinc-400 opacity-0 -translate-y-0.5 translate-x-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:translate-y-0 transition-all duration-300 shrink-0" />
              </a>
            );
          })}
        </div>
      </div>

    </section>
  );
}