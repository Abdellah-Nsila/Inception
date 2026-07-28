import { techsData } from "@/data/techs";

export default function TechStack({ sectionIndex }: { sectionIndex: number }) {
  const displayId = String(sectionIndex + 1).padStart(2, "0");
  // Lane 1 Data: Systems & Backend
  const lane1Data = techsData.slice(0, 2).flatMap((category, catIdx) => [
    { id: `cat-1-${catIdx}`, isCategory: true as const, name: category.title },
    ...category.items.map((tech, techIdx) => ({
      id: `tech-1-${catIdx}-${techIdx}`,
      isCategory: false as const,
      name: tech.name,
      type: tech.type,
      icon: tech.icon,
    })),
  ]);

  // Lane 2 Data: Frontend & Databases
  const lane2Data = techsData.slice(2, 4).flatMap((category, catIdx) => [
    { id: `cat-2-${catIdx}`, isCategory: true as const, name: category.title },
    ...category.items.map((tech, techIdx) => ({
      id: `tech-2-${catIdx}-${techIdx}`,
      isCategory: false as const,
      name: tech.name,
      type: tech.type,
      icon: tech.icon,
    })),
  ]);

  const renderTrackItems = (items: typeof lane1Data) => (
    <>
      {items.map((item) => (
        <div key={item.id} className="flex items-center shrink-0">
          {item.isCategory ? (
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-sm font-mono text-[11px] uppercase tracking-widest font-extrabold border border-zinc-800 dark:border-zinc-200 select-none mx-3">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              {item.name}
            </div>
          ) : (
            <div className="group flex items-center gap-3 px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-100/80 dark:border-zinc-800/60 dark:bg-zinc-900/60 transition-all duration-200 hover:border-teal-500/40 hover:bg-white dark:hover:bg-zinc-950 select-none mx-1.5 cursor-pointer">
              <div className="text-zinc-500 dark:text-zinc-400 group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors text-lg shrink-0">
                <item.icon />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-xs tracking-tight text-zinc-800 dark:text-zinc-200">
                  {item.name}
                </span>
                <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500">
                  {item.type}
                </span>
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  );

  return (
    <div className="space-y-8 w-full">
      {/* Dynamic Header */}
      <div className="space-y-3">
        <h2 className="text-3xl font-bold tracking-tight !text-teal-600 dark:!text-teal-400">
          <span className="font-mono mr-3 opacity-90">{displayId} //</span>
          Technical Arsenal
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          A continuous streaming timeline of frameworks, languages, and low-level development toolsets.
        </p>
      </div>

      {/* 
        Horizontal Mask Viewport 
        - Removed pseudo before/after element blocks completely.
        - Added hardware-accelerated dual inline mask matrices for seamless edge dissipation.
      */}
      <div 
        className="relative w-full overflow-hidden py-4 space-y-8"
        style={{
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, #000 12%, #000 88%, transparent 100%)",
          maskImage: "linear-gradient(to right, transparent 0%, #000 12%, #000 88%, transparent 100%)"
        }}
      >
        
        {/* Lane 1: Heading Left */}
        <div className="animate-pipeline-left gap-1">
          {renderTrackItems(lane1Data)}
          {renderTrackItems(lane1Data)}
        </div>

        {/* Lane 2: Heading Right */}
        <div className="animate-pipeline-right gap-1">
          {renderTrackItems(lane2Data)}
          {renderTrackItems(lane2Data)}
        </div>

      </div>

      {/* High-Performance GPU Pipeline Style Block */}
      <style>{`
        @keyframes streamLeft {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes streamRight {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .animate-pipeline-left, .animate-pipeline-right {
          display: flex;
          width: max-content;
          will-change: transform;
        }
        .animate-pipeline-left {
          animation: streamLeft 35s linear infinite;
        }
        .animate-pipeline-right {
          animation: streamRight 35s linear infinite;
        }
        .animate-pipeline-left:hover, .animate-pipeline-right:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}