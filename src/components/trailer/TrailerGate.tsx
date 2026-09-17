"use client";

import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { Trailer } from "./Trailer";

const STORAGE_KEY = "trailer-seen";

function subscribe() {
  // sessionStorage doesn't need external change notifications for this use —
  // we only ever read it once per mount, via the snapshot functions below.
  return () => {};
}

function getSnapshot() {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

// SSR / no-JS default: treat as "already seen" so the server-rendered page
// (and any client without JS) shows Home directly — never a stuck trailer.
// A genuine first-time visitor flips this to `false` right after hydration.
function getServerSnapshot() {
  return true;
}

const TrailerReplayContext = createContext<(() => void) | null>(null);

/** Lets any descendant (e.g. the Home hero's "Watch trailer" CTA) replay the intro on demand. */
export function useTrailerReplay() {
  return useContext(TrailerReplayContext);
}

/**
 * Wraps the Home page content. Children render immediately (server-rendered,
 * no layout shift, works with JS disabled) — the Trailer is an overlay on
 * top, shown only for first-time-this-session visitors.
 *
 * Uses useSyncExternalStore (not useEffect+setState) to read sessionStorage
 * safely across server/client without a manual effect — this is the
 * React-sanctioned way to read browser-only external state without a
 * hydration mismatch.
 */
export function TrailerGate({ children }: { children: ReactNode }) {
  const seenBefore = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [dismissedThisVisit, setDismissedThisVisit] = useState(false);
  const [replaying, setReplaying] = useState(false);

  const showTrailer = replaying || (!seenBefore && !dismissedThisVisit);

  function handleComplete() {
    setDismissedThisVisit(true);
    setReplaying(false);
  }

  return (
    <TrailerReplayContext.Provider value={() => setReplaying(true)}>
      {children}
      {showTrailer && <Trailer onComplete={handleComplete} />}
    </TrailerReplayContext.Provider>
  );
}
