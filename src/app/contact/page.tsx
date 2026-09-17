import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { CornerBrackets } from "@/components/decorative";
import { socialLinks } from "@/content/social";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Contact — THE DEVELOPER",
  description: "Get in touch with Harshit Teotia.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-3xl flex-col justify-center px-6 py-24">
      <SectionHeading
        level="h1"
        size="display"
        align="center"
        kicker="End of season?"
        title="Maybe not. Let's build something."
      />

      <Reveal
        delay={1.1}
        className="border-border-strong relative mt-16 border p-6 sm:p-10"
      >
        <CornerBrackets />
        <div className="grid gap-px sm:grid-cols-2">
          {socialLinks.map((link) =>
            link.url ? (
              <a
                key={link.id}
                href={link.url}
                target={link.id === "email" ? undefined : "_blank"}
                rel={link.id === "email" ? undefined : "noopener noreferrer"}
                className="group border-border-strong hover:bg-bg-elevated duration-fast ease-standard flex flex-col gap-1 border p-5 transition-colors"
              >
                <span className="text-text-muted font-mono text-xs tracking-[0.2em] uppercase">
                  {link.label}
                </span>
                <span className="text-text-primary group-hover:text-accent-300 duration-fast ease-standard flex items-center justify-between gap-2 text-lg transition-colors">
                  {link.id === "email" ? link.url.replace("mailto:", "") : "Open"}
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
