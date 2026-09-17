import { Badge, Button, Card, Divider, SectionHeading } from "@/components/ui";

export const metadata = {
  robots: { index: false, follow: false },
};

/**
 * Internal-only visual QA route for design-system primitives (Epic 02).
 * Not linked from the public nav.
 */
export default function DesignSystemPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-16 px-6 py-16">
      <SectionHeading
        level="h1"
        kicker="Internal"
        title="Design System"
        description="Tokens and primitives showcase — desktop & keyboard-focus QA."
      />

      <section className="flex flex-col gap-4">
        <h3 className="text-text-secondary font-mono text-sm uppercase">Colors</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            ["bg", "bg-bg border border-border-strong"],
            ["bg-elevated", "bg-bg-elevated"],
            ["bg-overlay", "bg-bg-overlay"],
            ["accent-600", "bg-accent-600"],
            ["accent-400", "bg-accent-400"],
            ["text-secondary", "bg-text-secondary"],
          ].map(([name, cls]) => (
            <div key={name} className="flex flex-col gap-2">
              <div className={`h-16 rounded-md ${cls}`} />
              <span className="text-text-muted font-mono text-xs">{name}</span>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      <section className="flex flex-col gap-4">
        <h3 className="text-text-secondary font-mono text-sm uppercase">Typography</h3>
        <p className="font-display text-6xl">Display 6xl</p>
        <p className="font-display text-4xl">Display 4xl</p>
        <p className="font-display text-2xl">Display 2xl</p>
        <p className="text-base">
          Body / Inter — the workhorse sans for UI and long-form copy.
        </p>
        <p className="text-accent-300 font-mono text-sm">
          Mono / JetBrains Mono — episode numbers, tech tags, technical accents.
        </p>
      </section>

      <Divider />

      <section className="flex flex-col gap-4">
        <h3 className="text-text-secondary font-mono text-sm uppercase">Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link style</Button>
        </div>
      </section>

      <Divider />

      <section className="flex flex-col gap-4">
        <h3 className="text-text-secondary font-mono text-sm uppercase">Badges</h3>
        <div className="flex flex-wrap gap-3">
          <Badge>FastAPI</Badge>
          <Badge>PostgreSQL</Badge>
          <Badge tone="accent">EP 04 — Viblets</Badge>
        </div>
      </section>

      <Divider />

      <section className="flex flex-col gap-4">
        <h3 className="text-text-secondary font-mono text-sm uppercase">Card</h3>
        <Card className="max-w-sm">
          <p className="font-display text-xl">Project Card Shell</p>
          <p className="text-text-secondary mt-2 text-sm">
            Reused by episode and project index cards.
          </p>
        </Card>
      </section>
    </div>
  );
}
