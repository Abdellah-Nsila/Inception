import type { ComponentType } from "react";
import { type IconType } from "react-icons";

export interface Section {
  id: string;
  label: string;
  component: ComponentType<{ sectionIndex: number }>;
  minHeight: string;
}

export interface Quotes {
	id: string;
	text: string;
	color: string;
}

export interface Project {
	id: string;
	title: string;
	description: string;
	longDescription?: string;
	techStack: string[];
	githubUrl?: string;
	liveUrl?: string;
	category: string[] // 'systems' | 'web' | 'devops' | 'other' | 'unix' | 'network' | 'gamedev' | 'algorithms' | 'graphics' | 'AI';
	featured: boolean;
}

export interface  Links {
	id: string;
	title: string;
	url: string;
	icon: IconType;
}

export interface TechItem {
  name: string;
  type: string;
  icon: IconType; // Natively maps React Icon components
}

export interface TechCategory {
  title: string;
  items: TechItem[];
}
export interface Education {
	id: string;
	institution: string;
	degree: string;
	location: string;
	period: string; // e.g., "2024 - Present"
	description: string[]; // Bullet points of what you did/learned
}

export interface Certification {
	id: string;
	title: string;
	issuer: string;
	issueDate: string;
	credentialUrl?: string;
}


