"use client";

import { Button } from "@/components/ui";
import { useTrailerReplay } from "@/components/trailer/TrailerGate";

export function WatchTrailerButton() {
  const replay = useTrailerReplay();

  return (
    <Button type="button" variant="link" onClick={() => replay?.()}>
      <span aria-hidden="true">▷</span> Play Intro
    </Button>
  );
}
