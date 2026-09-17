"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { navItems } from "./nav-items";
import { getSocialLink } from "@/content/social";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { duration, ease } from "@/lib/motion/tokens";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const resume = getSocialLink("resume");
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={cn(
        "duration-base ease-standard sticky top-0 z-40 transition-colors",
        scrolled
          ? "border-border bg-bg/85 border-b backdrop-blur-sm"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-text-primary font-mono text-sm tracking-[0.2em] uppercase"
        >
          {site.name}
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group duration-fast ease-standard relative rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "text-accent-300"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {item.label}
                {active ? (
                  <motion.span
                    aria-hidden="true"
                    className="bg-accent-400 absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 translate-y-2 rounded-full"
                    initial={prefersReducedMotion ? false : { opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: duration.fast, ease: ease.emphasis }}
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="bg-text-secondary duration-fast ease-standard absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 transition-[width] group-hover:w-4"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          {resume?.url ? (
            <Link
              href={resume.url}
              className="border-border-strong text-text-primary hover:border-accent-400 hover:text-accent-300 rounded-md border px-4 py-2 text-sm"
            >
              Resume
            </Link>
          ) : (
            <span
              className="border-border text-text-muted cursor-not-allowed rounded-md border px-4 py-2 text-sm"
              title="Resume coming soon"
            >
              Resume
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="border-border-strong text-text-primary flex h-9 w-9 items-center justify-center rounded-md border lg:hidden"
        >
          <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            {menuOpen ? (
              <path
                d="M2 2L16 16M16 2L2 16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M2 4.5H16M2 9H16M2 13.5H16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: duration.base, ease: ease.standard }}
            className="border-border bg-bg overflow-hidden border-t lg:hidden"
          >
            <Stagger
              staggerDelay={0.04}
              trigger="mount"
              className="flex flex-col gap-1 px-6 py-4"
            >
              {navItems.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <StaggerItem key={item.href}>
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "block rounded-md px-3 py-3 text-base",
                        active ? "text-accent-300" : "text-text-secondary"
                      )}
                    >
                      {item.label}
                    </Link>
                  </StaggerItem>
                );
              })}
              <StaggerItem>
                {resume?.url ? (
                  <Link
                    href={resume.url}
                    onClick={closeMenu}
                    className="border-border-strong text-text-primary mt-2 block rounded-md border px-3 py-3 text-center text-base"
                  >
                    Resume
                  </Link>
                ) : (
                  <span className="border-border text-text-muted mt-2 block rounded-md border px-3 py-3 text-center text-base">
                    Resume — coming soon
                  </span>
                )}
              </StaggerItem>
            </Stagger>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
