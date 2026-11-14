import { act } from "react";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import { useReducedMotion } from "./use-reduced-motion";

it("hydrates the server tree without errors before adopting reduced motion", async () => {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const spy = vi.spyOn(window, "matchMedia").mockReturnValue({ ...media, matches: true });
  function Probe() {
    return useReducedMotion() ? <p>Reduced motion</p> : <div>Animated</div>;
  }
  const container = document.createElement("div");
  container.innerHTML = renderToString(<Probe />);
  document.body.append(container);
  expect(container.textContent).toBe("Animated");
  const errors: unknown[] = [];
  let root: ReturnType<typeof hydrateRoot>;
  await act(async () => {
    root = hydrateRoot(container, <Probe />, {
      onRecoverableError: (error) => errors.push(error),
    });
  });
  expect(errors).toEqual([]);
  expect(container.textContent).toBe("Reduced motion");
  await act(async () => root.unmount());
  container.remove();
  spy.mockRestore();
});
