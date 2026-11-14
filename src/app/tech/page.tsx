import { pageMetadata } from "@/lib/page-metadata";
import { additionalSkills } from "@/content/skills";
import { Badge, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { TechMap } from "@/components/tech/TechMap";

export const metadata = pageMetadata(
  "/tech/",
  "Technologies — Harshit Teotia",
  "Python, FastAPI, PostgreSQL, REST APIs, RAG, and LLM integrations, mapped to documented project contributions. Additional verified hands-on tools."
);

export default function TechPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <SectionHeading
        level="h1"
        size="display"
        kicker="Tech"
        title="The stack, mapped"
        description="Explore the technologies behind the work. Tap or select one to see the projects that use it, without proficiency ratings."
      />

      <Reveal delay={0.1}>
        <TechMap />
      </Reveal>
      <section className="mt-16">
        <SectionHeading
          title="Other Hands-on Skills"
          description="Additional verified tools and capabilities, without assigning them to an undocumented project."
        />
        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          {additionalSkills.map((group) => (
            <div key={group.title}>
              <h2 className="text-accent-300 mb-3 text-sm">{group.title}</h2>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <Badge key={item}>{item}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
