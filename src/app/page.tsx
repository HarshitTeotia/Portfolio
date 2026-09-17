import { TrailerGate } from "@/components/trailer/TrailerGate";
import { Hero } from "@/components/home/Hero";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { TechTeaser } from "@/components/home/TechTeaser";

export default function HomePage() {
  return (
    <TrailerGate>
      <Hero />
      <FeaturedWork />
      <TechTeaser />
    </TrailerGate>
  );
}
