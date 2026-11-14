"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";

const Trailer = dynamic(() => import("./Trailer").then((module) => module.Trailer), {
  ssr: false,
});

const TrailerReplayContext = createContext<(() => void) | null>(null);

/** Lets any descendant (e.g. the Home hero's "Watch trailer" CTA) replay the intro on demand. */
export function useTrailerReplay() {
  return useContext(TrailerReplayContext);
}

/** Home renders immediately; the intro bundle mounts only after an explicit action. */
export function TrailerGate({ children }: { children: ReactNode }) {
  const [playing, setPlaying] = useState(false);
  const play = useCallback(() => setPlaying(true), []);
  const close = useCallback(() => setPlaying(false), []);

  return (
    <TrailerReplayContext.Provider value={play}>
      {children}
      {playing && <Trailer onComplete={close} />}
    </TrailerReplayContext.Provider>
  );
}
