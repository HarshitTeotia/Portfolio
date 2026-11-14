export interface NavItem {
  label: string;
  href: string;
}

/** Structural routing metadata — distinct from portfolio content in src/content. */
export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Experience", href: "/experience" },
  { label: "Projects", href: "/projects" },
  { label: "Technologies", href: "/tech" },
  { label: "Career", href: "/episodes" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
