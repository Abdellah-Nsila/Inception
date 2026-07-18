// components/Resume.tsx
"use client";

import { FiDownload } from "react-icons/fi";

export default function Resume({ sectionIndex }: { sectionIndex: number }) {
	const displayId = String(sectionIndex + 1).padStart(2, "0");
  return (
    <section 
      id="resume" 
      className="min-h-[45vh] flex flex-col justify-center py-12 w-full max-w-5xl mx-auto border-t border-zinc-100 dark:border-zinc-900/40"
    >
      <div className="max-w-2xl space-y-6">
        
        {/* Normalized Layout Section Title */}
        <div className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tight !text-teal-600 dark:!text-teal-400">
            <span className="font-mono mr-3 opacity-90">{displayId} //</span>
            Curriculum Vitae
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm md:text-base">
            Want a comprehensive breakdown of my operational background, production tech stack proficiencies, and formal engineering milestones? Grab a direct local node printout below.
          </p>
        </div>

        {/* Premium Core Call-to-Action Button */}
        <div className="pt-2">
          <a
            href="/resume.pdf"
            download="Abdellah_Nsila_Resume.pdf"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-teal-600 text-white hover:bg-teal-700 shadow-sm shadow-teal-500/20 transition-all duration-200 active:scale-[0.98]"
          >
            <FiDownload className="w-4 h-4 stroke-[2.5]" />
            <span>Resume</span>
          </a>
        </div>

      </div>
    </section>
  );
}