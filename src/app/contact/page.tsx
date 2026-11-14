import { pageMetadata } from "@/lib/page-metadata";
import { SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { CornerBrackets } from "@/components/decorative";
import { assetPath } from "@/lib/asset-path";
import { socialLinks } from "@/content/social";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

export const metadata = pageMetadata(
  "/contact/",
  "Contact — Harshit Teotia",
  "Contact Harshit Teotia for Python backend and AI engineering opportunities. Bengaluru, India; available to join immediately and open to remote work."
);

export default function ContactPage() {
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-3xl flex-col justify-center px-6 py-24">
      <SectionHeading
        level="h1"
        size="display"
        align="center"
        kicker="Contact"
        title="Let's build useful software."
        description={`${site.location}. ${site.availabilityDetail}`}
      />

      <Reveal
        delay={0.1}
        className="border-border-strong relative mt-16 border p-6 sm:p-10"
      >
        <CornerBrackets />

        <div className="grid gap-px sm:grid-cols-2">
          {socialLinks.map((link) =>
            link.url ? (
              <a
                key={link.id}
                href={link.id === "resume" ? assetPath(link.url) : link.url}
                target={link.id === "email" ? undefined : "_blank"}
                rel={link.id === "email" ? undefined : "noopener noreferrer"}
                className="group border-border-strong hover:bg-bg-elevated duration-fast ease-standard flex flex-col gap-1 border p-5 transition-colors"
              >
                <span className="text-text-muted font-mono text-xs tracking-[0.2em] uppercase">
                  {link.label}
                </span>
                <span className="text-text-primary group-hover:text-accent-300 flex min-h-11 min-w-0 items-center justify-between gap-2 text-sm break-all transition-colors sm:text-base">
                  {link.id === "email"
                    ? link.url.replace("mailto:", "")
                    : link.id === "resume"
                      ? "View PDF"
                      : "Open"}
                  <span
                    aria-hidden="true"
                    className="duration-fast ease-standard transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </a>
            ) : (
              <div
                key={link.id}
                className={cn(
                  "border-border flex flex-col gap-1 border p-5",
                  "cursor-not-allowed"
                )}
                title={`${link.label} coming soon`}
              >
                <span className="text-text-muted font-mono text-xs tracking-[0.2em] uppercase">
                  {link.label}
                </span>
                <span className="text-text-muted text-lg">Coming soon</span>
              </div>
            )
          )}
        </div>
      </Reveal>
    </div>
  );
}
