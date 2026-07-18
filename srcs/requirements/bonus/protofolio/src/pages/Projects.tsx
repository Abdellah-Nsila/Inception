import ProjectCard from "@/components/global/ProjectCard";
import { projectsData } from "@/data/projects"; // Adjust this path to match your file location


export default function Projects({ sectionIndex }: { sectionIndex: number }) {
  const displayId = String(sectionIndex + 1).padStart(2, "0");
  // Filters or lists only featured engineering items if needed
  const displayProjects = projectsData.filter(p => p.featured);

  return (
    <div className="space-y-8">
      {/* Normalized Layout with Teal Themed Big Title */}
      <div className="space-y-3">
        <h2 className="text-3xl font-bold tracking-tight !text-teal-600 dark:!text-teal-400">
          <span className="font-mono mr-3 opacity-90">{displayId} //</span>
           Featured Engineering
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Hover over the card links to trace edge lights. Driven dynamically via project arrays.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayProjects.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            description={project.description}
            techStack={project.techStack}
            githubUrl={project.githubUrl}
          />
        ))}
      </div>
    </div>
  );
}