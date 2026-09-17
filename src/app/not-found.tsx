import { Button, SectionHeading } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <p className="text-accent-400 font-mono text-xs tracking-[0.3em] uppercase">
        Episode not found
      </p>
      <SectionHeading
        level="h1"
        align="center"
        className="mt-4"
        title="This one didn't make the cut."
      />
      <p className="text-text-secondary mt-4">
        The page you&rsquo;re looking for doesn&rsquo;t exist, or the link is out of date.
      </p>
      <div className="mt-8 flex gap-4">
        <Button href="/">Back to Home</Button>
        <Button href="/projects" variant="ghost">
          View Projects
        </Button>
      </div>
    </div>
  );
}
