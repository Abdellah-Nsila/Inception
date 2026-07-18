import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ScrollSectionProps {
  children: React.ReactNode;
  colorClass?: string; // Allow different sections to have different colored lines
}

export default function ScrollSection({ children, colorClass = "bg-indigo-500" }: ScrollSectionProps) {
  const ref = useRef(null);
  
  // Track scroll progress purely within this specific section
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"], 
  });

  // Map the 0-1 scroll progress to a 0% - 100% CSS height
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={ref} className="relative pl-8 py-12 md:pl-12">
      {/* The background track (subtle line) */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] rounded-full bg-zinc-200 dark:bg-zinc-800" />
      
      {/* The animated highlight line */}
      <motion.div 
        style={{ height }} 
        className={`absolute left-0 top-0 w-[2px] rounded-full ${colorClass} origin-top`} 
      />
      
      {children}
    </div>
  );
}