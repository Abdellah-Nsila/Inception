import type { TechCategory } from "./types";

import { 
  SiC, SiCplusplus, SiLinux, SiGnubash, SiDocker, SiOpengl,
  SiPython, SiPhp, SiTypescript, SiJavascript, SiLaravel,
  SiReact, SiElectron, SiTailwindcss, SiHtml5, SiBootstrap,
  SiPostgresql, SiMysql, SiMongodb, SiGit, SiFigma, SiFirebase
} from "react-icons/si";

import { FaDatabase, FaCss3Alt } from "react-icons/fa"; // Using FontAwesome for a clean generic SQL icon

export const techsData: TechCategory[] = [
  {
    title: "Systems & Infrastructure",
    items: [
      { name: "C", type: "Low-level", icon: SiC },
      { name: "C++", type: "OOP / Systems", icon: SiCplusplus },
      { name: "Linux", type: "OS Environment / Kernel", icon: SiLinux },
      { name: "Bash", type: "Scripting", icon: SiGnubash },
      { name: "Docker", type: "Containers", icon: SiDocker },
      { name: "OpenGL", type: "Graphics API", icon: SiOpengl },
    ],
  },
  {
    title: "Core Languages & Backend",
    items: [
      { name: "Python", type: "Scripting / AI", icon: SiPython },
      { name: "PHP", type: "Server-side", icon: SiPhp },
      { name: "TypeScript", type: "Strict JS", icon: SiTypescript },
      { name: "JavaScript", type: "Web Standard", icon: SiJavascript },
      { name: "Laravel", type: "Framework", icon: SiLaravel },
    ],
  },
  {
    title: "Frontend & Graphics Engine",
    items: [
      { name: "React", type: "UI Library", icon: SiReact },
      { name: "Electron", type: "Desktop Apps", icon: SiElectron },
      { name: "Tailwind CSS", type: "Styling", icon: SiTailwindcss },
      { name: "HTML5", type: "Markup", icon: SiHtml5 },
      { name: "CSS3", type: "Styles", icon: FaCss3Alt },
      { name: "Bootstrap", type: "UI Kit", icon: SiBootstrap },
    ],
  },
  {
    title: "Databases & Tooling",
    items: [
      { name: "SQL", type: "Query Language", icon: FaDatabase },
      { name: "PostgreSQL", type: "Relational", icon: SiPostgresql },
      { name: "MySQL", type: "Relational", icon: SiMysql },
      { name: "MongoDB", type: "NoSQL", icon: SiMongodb },
      { name: "Firebase", type: "NoSQL", icon: SiFirebase },
      { name: "Git", type: "Version Control", icon: SiGit },
      { name: "Figma", type: "UI/UX Design", icon: SiFigma },
    ],
  },
];