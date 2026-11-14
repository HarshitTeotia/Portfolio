import { pageMetadata } from "@/lib/page-metadata";
import { site } from "@/content/site";
import { TrailerGate } from "@/components/trailer/TrailerGate";
import { Hero } from "@/components/home/Hero";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { TechTeaser } from "@/components/home/TechTeaser";

export const metadata = pageMetadata("/", site.seoTitle, site.summary);

export default function HomePage() {
  return (
    <TrailerGate>
      <Hero />
      <FeaturedWork />
      <TechTeaser />
    </TrailerGate>
  );
}
