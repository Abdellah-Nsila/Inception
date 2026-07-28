import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { type MouseEvent } from "react";

interface ProjectCardProps {
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
}

export default function ProjectCard({ title, description, techStack, githubUrl }: ProjectCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className="group relative rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-800/60 p-[2px] transition-all duration-300 shadow-sm"
    >
      {/* 1px Edge spotlight tracker layer */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              130px circle at ${mouseX}px ${mouseY}px,
              rgba(20, 184, 166),
              transparent 100%
            )
          `,
        }}
      />

      {/* Solid Core Inner Body */}
      <div className="relative z-10 rounded-[11px] bg-white dark:bg-zinc-950 p-6 flex h-full flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">{title}</h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {description}
          </p>
        </div>
        
        <div className="mt-6 space-y-4">
          {/* Tech stack pill distribution map */}
          <div className="flex flex-wrap gap-1.5">
            {techStack.map((tech) => (
              <span 
                key={tech} 
                className="text-[10px] font-mono text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/20 px-2 py-0.5 rounded border border-teal-100 dark:border-teal-900/20"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-end pt-2 border-t border-zinc-100 dark:border-zinc-900">
            {githubUrl ? (
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
              >
                View Source
              </a>
            ) : (
              <span className="text-xs text-zinc-400 font-mono">Private Repository</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
