import Link from "@/components/ui/SiteLink";
import { navItems } from "./nav-items";
import { assetPath } from "@/lib/asset-path";
import { socialLinks } from "@/content/social";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-border border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-text-primary font-mono text-sm tracking-[0.2em] uppercase">
            {site.name}
          </span>
          <p className="text-text-secondary max-w-sm text-sm">{site.tagline}</p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-text-secondary hover:text-text-primary inline-flex min-h-11 items-center text-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {socialLinks.map((link) =>
            link.url ? (
              <a
                key={link.id}
                href={link.id === "resume" ? assetPath(link.url) : link.url}
                target={link.id === "email" ? undefined : "_blank"}
                rel={link.id === "email" ? undefined : "noopener noreferrer"}
                className="text-text-secondary hover:text-accent-300 inline-flex min-h-11 items-center text-sm"
              >
                {link.label}
              </a>
            ) : (
              <span
                key={link.id}
                className="text-text-muted text-sm"
                title={`${link.label} coming soon`}
              >
                {link.label}
              </span>
            )
          )}
        </div>
      </div>

      <div className="text-text-muted mx-auto max-w-6xl px-6 pb-8 text-xs">
        © {new Date().getFullYear()} {site.name}
      </div>
    </footer>
  );
}
