import { SiGithub, SiUpwork, SiInstagram, SiDiscord } from "react-icons/si";
import { SlSocialLinkedin } from "react-icons/sl";
import type { Links } from "./types";

export const LinksData: Links[] = [
  {
    id: "github",
    title: "Github",
    url: "https://github.com/Abdellah-Nsila",
    icon: SiGithub
  },
  {
    id: "linkedin",
    title: "LinkedIn",
    url: "https://linkedin.com/in/yourusername",
    icon: SlSocialLinkedin
  },
    {
    id: "upwork",
    title: "Upwork",
    url: "https://www.upwork.com/freelancers/~014def966d69d149fd",
    icon: SiUpwork
  },
  {
    id: "discord",
    title: "Discord",
    url: "https://discord.com/users/1024827844146233425",
    icon: SiDiscord
  },
    {
    id: "instagram",
    title: "Instagram",
    url: "https://instagram.com/in/yourusername",
    icon: SiInstagram
  },
];
