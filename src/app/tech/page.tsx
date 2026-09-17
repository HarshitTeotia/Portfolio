import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { TechMap } from "@/components/tech/TechMap";

export const metadata: Metadata = {
  title: "Tech — THE DEVELOPER",
  description:
    "The stack, shown through the real projects that actually use each technology — no percentage bars.",
};

export default function TechPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <SectionHeading
        level="h1"
        size="display"
        kicker="Tech"
        title="The stack, mapped"
        description="Every technology below connects to the project(s) that actually use it — hover or focus one to trace the connection, not a claimed skill level."
      />

      <Reveal delay={0.1}>
        <TechMap />
      </Reveal>
    </div>
  );
}
