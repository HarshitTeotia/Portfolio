"use client";

import Link from "@/components/ui/SiteLink";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { navItems } from "./nav-items";
import { getSocialLink } from "@/content/social";
import { assetPath } from "@/lib/asset-path";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { Modal } from "@/components/ui/Modal";

function isActive(pathname: string, href: string) {
  const path = pathname.replace(/\/$/, "") || "/";
  return href === "/" ? path === "/" : path === href || path.startsWith(href + "/");
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const menuOpen = menuPath === pathname;
  const resume = getSocialLink("resume");
  const closeMenu = useCallback(() => setMenuPath(null), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const media = window.matchMedia("(min-width: 1024px)");
    const onResize = () => {
      if (media.matches) closeMenu();
    };
    media.addEventListener("change", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      media.removeEventListener("change", onResize);
    };
  }, [closeMenu]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-colors",
        scrolled
          ? "border-border bg-bg/95 backdrop-blur-sm"
          : "bg-bg/80 border-transparent"
      )}
    >
      <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href="/"
          className="text-text-primary inline-flex min-h-11 items-center font-mono text-sm tracking-[0.12em] uppercase"
        >
          {site.name}
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className={cn(
                "inline-flex min-h-11 items-center rounded-md px-3 text-sm transition-colors",
                isActive(pathname, item.href)
                  ? "bg-accent-600/15 text-accent-300"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        {resume?.url && (
          <a
            href={assetPath(resume.url)}
            className="border-border-strong text-text-primary hover:border-accent-400 hidden min-h-11 items-center rounded-md border px-4 text-sm lg:inline-flex"
          >
            Resume
          </a>
        )}
        <button
          type="button"
          onClick={() => setMenuPath(pathname)}
          aria-expanded={menuOpen}
          aria-haspopup="dialog"
          aria-controls={menuOpen ? "mobile-nav" : undefined}
          aria-label="Open menu"
          className="border-border-strong text-text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-md border lg:hidden"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M3 5H17M3 10H17M3 15H17"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      {menuOpen && (
        <Modal
          labelId="menu-title"
          onClose={closeMenu}
          className="h-dvh w-screen max-w-none sm:mr-0 sm:w-[26rem]"
        >
          <div className="flex h-full flex-col overflow-y-auto p-5 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <h2
                id="menu-title"
                className="text-accent-300 font-mono text-sm tracking-widest uppercase"
              >
                Navigation
              </h2>
              <button
                type="button"
                autoFocus
                onClick={closeMenu}
                className="border-border-strong min-h-11 rounded-md border px-4 text-sm"
              >
                Close menu ×
              </button>
            </div>
            <nav id="mobile-nav" aria-label="Mobile" className="mt-8 flex flex-col gap-2">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  className={cn(
                    "flex min-h-12 items-center gap-5 rounded-md px-4 py-3 text-lg",
                    isActive(pathname, item.href)
                      ? "bg-accent-600/15 text-accent-300"
                      : "text-text-secondary hover:bg-bg-elevated"
                  )}
                >
                  <span aria-hidden="true" className="text-text-muted font-mono text-xs">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </Link>
              ))}
              {resume?.url && (
                <a
                  href={assetPath(resume.url)}
                  onClick={closeMenu}
                  className="border-border-strong mt-4 inline-flex min-h-12 items-center justify-center rounded-md border text-base"
                >
                  View Resume
                </a>
              )}
            </nav>
            <p className="text-text-secondary mt-auto pt-8 text-sm">
              {site.opportunityLocation} · Available to join immediately
            </p>
          </div>
        </Modal>
      )}
    </header>
  );
}
