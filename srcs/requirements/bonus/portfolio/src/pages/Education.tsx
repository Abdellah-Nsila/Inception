import { educationData } from "@/data/education"; // Adjust this path to match your file location

export default function Education({ sectionIndex }: { sectionIndex: number }) {
  const displayId = String(sectionIndex + 1).padStart(2, "0");
  return (
    <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight !text-teal-600 dark:!text-teal-400">
          <span className="font-mono mr-3 opacity-90">{displayId} //</span>
           Academia & Training
        </h2>
      
      <div className="space-y-12">
        {educationData.map((edu) => (
          <div key={edu.id} className="relative pl-5 border-l border-zinc-200 dark:border-zinc-800 space-y-3">
            {/* Minimal line milestone node marker */}
            <div className="absolute w-2 h-2 rounded-full bg-teal-500 -left-[5px] top-2" />
            
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{edu.institution}</h3>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{edu.degree} — <span className="text-xs italic">{edu.location}</span></p>
              </div>
              <span className="text-xs font-mono text-zinc-500 bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded">
                {edu.period}
              </span>
            </div>

            {/* Iterating over description bullet strings list */}
            <ul className="space-y-1.5 list-none pl-0">
              {edu.description.map((bullet, idx) => (
                <li key={idx} className="text-sm text-zinc-600 dark:text-zinc-400 flex items-start gap-2 leading-relaxed">
                  <span className="text-teal-500 mt-1.5 block h-1 w-1 shrink-0 rounded-full bg-current" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}