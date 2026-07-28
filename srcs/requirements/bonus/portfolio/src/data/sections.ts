import type { Section } from "./types";

import Home from "@/pages/Home";
import Resume from "@/pages/Resume";
import TechStack from "@/pages/TechStack";
import Education from "@/pages/Education";
import Projects from "@/pages/Projects";
import Contact from "@/pages/Contact";

export const Sections: Section[] = [
	{
		id: "home",
		label: "Home",
		component: Home,
		minHeight: "min-h-[70vh]"
	},
	{
		id: "techstack",
		label: "Tech Stack",
		component: TechStack,
		minHeight: "min-h-[60vh]"
	},
	{
		id: "education",
		label: "Education",
		component: Education,
		minHeight: "min-h-[60vh]"
	},
	{
		id: "resume",
		label: "Resume",
		component: Resume,
		minHeight: "min-h-[40vh]"
	},
	{
		id: "projects",
		label: "Projects",
		component: Projects,
		minHeight: "min-h-[70vh]"
	},
	{
		id: "contact",
		label: "Contact",
		component: Contact,
		minHeight: "min-h-[60vh]"
	},
];
