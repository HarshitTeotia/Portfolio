import type { SocialLink } from "./types";

/** Verified contact URLs and existing resume file. */
export const socialLinks: SocialLink[] = [
  { id: "email", label: "Email", url: "mailto:harshitteotia2003@gmail.com" },
  { id: "github", label: "GitHub", url: "https://github.com/HarshitTeotia" },
  {
    id: "linkedin",
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/harshit-teotia/",
  },
  { id: "resume", label: "Resume", url: "/resume/Harshit_Teotia_Resume.pdf" },
];

export function getSocialLink(id: SocialLink["id"]): SocialLink | undefined {
  return socialLinks.find((link) => link.id === id);
}
