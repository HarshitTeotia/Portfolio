import { afterEach, describe, expect, it, vi } from "vitest";
import { assetPath } from "./asset-path";
import { pageMetadata } from "./page-metadata";
import { siteUrl } from "./site-url";

afterEach(() => vi.unstubAllEnvs());

describe("static deployment URLs", () => {
  it("prefixes raw public assets for project hosting and leaves root hosting valid", () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/Portfolio");
    expect(assetPath("/resume/Harshit_Teotia_Resume.pdf")).toBe(
      "/Portfolio/resume/Harshit_Teotia_Resume.pdf"
    );
    expect(assetPath("/harshit.jpg")).toBe("/Portfolio/harshit.jpg");
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "");
    expect(assetPath("/harshit.jpg")).toBe("/harshit.jpg");
  });

  it("uses the same route URL and title for canonical and sharing metadata", () => {
    const metadata = pageMetadata("/projects/haut/", "HAUT", "Hospitality operations");
    const url = `${siteUrl}/projects/haut/`;
    expect(metadata.alternates?.canonical).toBe(url);
    expect(metadata.openGraph).toMatchObject({ url, title: "HAUT" });
    expect(metadata.twitter).toMatchObject({ title: "HAUT" });
  });
});
