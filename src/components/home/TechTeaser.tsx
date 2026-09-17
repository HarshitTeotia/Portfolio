import Link from "next/link";
import { Badge, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { technologies } from "@/content/technologies";

export function TechTeaser() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <Reveal>
        <SectionHeading kicker="Stack" title="Technologies, evidenced by real projects" />
      </Reveal>

      <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-2">
        {technologies.map((tech) => (
          <Badge key={tech.id}>{tech.name}</Badge>
        ))}
      </Reveal>

      <Reveal delay={0.15} className="mt-8">
        <Link href="/tech" className="text-accent-300 hover:text-accent-400 text-sm">
          See how each technology connects to real projects →
        </Link>
      </Reveal>
    </section>
  );
}
