export interface NavItem {
  label: string;
  href: string;
}

/** Structural routing metadata — distinct from portfolio content in src/content. */
export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Episodes", href: "/episodes" },
  { label: "Projects", href: "/projects" },
  { label: "Tech", href: "/tech" },
  { label: "Experience", href: "/experience" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
