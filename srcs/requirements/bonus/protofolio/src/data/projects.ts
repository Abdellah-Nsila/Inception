import type { Project } from "./types";

export const projectsData: Project[] = [
  {
    id: "webScary",
    title: "WebScary",
    description: "A scraping tool targeting 3 sites",
    techStack: ["Python", "React", "Microservices"],
    category: ["Scrapping", "web", "Team"],
    featured: true,
    githubUrl: "https://github.com/Allobaba-WebScrapy/web-client"
  },
  {
    id: "minishell",
    title: "Minishell",
    description: "Minishell is a simplified Unix shell designed to mimic the behavior of /bin/bash. It supports command parsing, input/output redirections, pipelines, environment variable expansion.",
    techStack: ["C", "Bash", "Makefile"],
    category: ["Unix", "Shell", "Team"],
    featured: true,
    githubUrl: "https://github.com/Minishell13/Minishell"
  },
  {
    id: "cub3d",
    title: "Cub3d",
    description: "Cub3d Spacetoon is a 2.5D raycasting game written in C (MiniLibX)",
    techStack: ["C", "MiniLibX"],
    category: ["Game", "Graphics", "FPS"],
    featured: true,
    githubUrl: "https://github.com/Cub3D1337/Spacetoon"
  },
  {
    id: "inception",
    title: "Inception",
    description: "A multi-container system administration project deploying a complete WordPress infrastructure using Docker Compose.",
    techStack: ["Docker", "Docker Compose", "Nginx", "MariaDB", "WordPress", "Debian"],
    category: ["systems", "devops"],
    featured: true,
    githubUrl: "https://github.com/Abdellah-Nsila/Inception"
  },
  {
    id: "webserv",
    title: "Webserv",
    description: "An HTTP/1.0 compliant web server written from scratch in C++ 98, utilizing non-blocking I/O multiplexing.",
    techStack: ["C++", "Sockets", "Network Programming", "Multiplexing"],
    category: ["systems", "web", "Team"],
    featured: true,
    githubUrl: "https://github.com/Web-serv-42/Webserv"
  },
];
