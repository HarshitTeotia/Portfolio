import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "./Header";

vi.mock("next/navigation", () => ({
  usePathname: () => "/projects",
}));

describe("Header", () => {
  it("renders every nav item", () => {
    render(<Header />);
    for (const label of [
      "Home",
      "Episodes",
      "Projects",
      "Tech",
      "Experience",
      "About",
      "Contact",
    ]) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
  });

  it("marks the current route active via aria-current", () => {
    render(<Header />);
    const activeLinks = screen
      .getAllByText("Projects")
      .filter((el) => el.closest("a")?.getAttribute("aria-current") === "page");
    expect(activeLinks.length).toBeGreaterThan(0);
  });

  it("mobile menu toggle starts closed and exposes aria-expanded", () => {
    render(<Header />);
    const toggle = screen.getByRole("button", { name: /open menu/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});
