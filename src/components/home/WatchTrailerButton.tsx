"use client";

import { Button } from "@/components/ui";
import { useTrailerReplay } from "@/components/trailer/TrailerGate";

export function WatchTrailerButton() {
  const replay = useTrailerReplay();

  return (
    <Button type="button" variant="primary" onClick={() => replay?.()}>
      Watch Trailer
    </Button>
  );
}
