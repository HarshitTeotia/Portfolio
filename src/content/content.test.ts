import { describe, expect, it } from "vitest";
import { projects } from "./projects";
import { technologies } from "./technologies";
import { seasons } from "./seasons";
import { experience } from "./experience";
import { education } from "./education";
import { socialLinks } from "./social";

/**
 * Schema/integrity tests — catch broken content (dangling references, blank
 * required fields, accidental duplicates) at test time instead of letting a
 * bad content edit silently render wrong.
 */

describe("projects", () => {
  it("has unique ids, slugs, and episode numbers", () => {
    expect(new Set(projects.map((p) => p.id)).size).toBe(projects.length);
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length);
    expect(new Set(projects.map((p) => p.episodeNumber)).size).toBe(projects.length);
  });

  it("only references technologies that actually exist", () => {
    const techIds = new Set(technologies.map((t) => t.id));
    for (const project of projects) {
      for (const techId of project.technologies) {
        expect(
          techIds.has(techId),
          `${project.id} references unknown tech "${techId}"`
        ).toBe(true);
      }
    }
  });

  it("has non-empty required narrative fields", () => {
    for (const project of projects) {
      expect(project.title.length, project.id).toBeGreaterThan(0);
      expect(project.positioning.length, project.id).toBeGreaterThan(0);
      expect(project.problem.length, project.id).toBeGreaterThan(0);
      expect(project.solution.length, project.id).toBeGreaterThan(0);
      expect(project.role.length, project.id).toBeGreaterThan(0);
      expect(project.highlights.length, project.id).toBeGreaterThan(0);
    }
  });

  it("never has a github link with both a URL and isPrivate:true (contradictory state)", () => {
    for (const project of projects) {
      const github = project.links.github;
      if (github?.isPrivate) {
        expect(github.url, project.id).toBeNull();
      }
    }
  });
});

describe("technologies", () => {
  it("every technology traces to at least one real project (no orphan buzzwords)", () => {
    for (const tech of technologies) {
      expect(tech.usedIn.length, tech.id).toBeGreaterThan(0);
    }
  });

  it("only references projects that actually exist", () => {
    const projectIds = new Set(projects.map((p) => p.id));
    for (const tech of technologies) {
      for (const projectId of tech.usedIn) {
        expect(
          projectIds.has(projectId),
          `${tech.id} references unknown project "${projectId}"`
        ).toBe(true);
      }
    }
  });

  it("the tech <-> project graph is symmetric", () => {
    for (const tech of technologies) {
      for (const projectId of tech.usedIn) {
        const project = projects.find((p) => p.id === projectId);
        expect(
          project?.technologies.includes(tech.id),
          `${projectId} should list "${tech.id}" in its technologies array`
        ).toBe(true);
      }
    }
    for (const project of projects) {
      for (const techId of project.technologies) {
        const tech = technologies.find((t) => t.id === techId);
        expect(
          tech?.usedIn.includes(project.id),
          `${techId} should list "${project.id}" in its usedIn array`
        ).toBe(true);
      }
    }
  });
});

describe("seasons", () => {
  it("has unique ids and codes, non-empty story", () => {
    expect(new Set(seasons.map((s) => s.id)).size).toBe(seasons.length);
    expect(new Set(seasons.map((s) => s.code)).size).toBe(seasons.length);
    for (const season of seasons) {
      expect(season.story.length, season.id).toBeGreaterThan(0);
    }
  });
});

describe("experience", () => {
  it("relatedProjectIds only reference real projects", () => {
    const projectIds = new Set(projects.map((p) => p.id));
    for (const entry of experience) {
      for (const id of entry.relatedProjectIds) {
        expect(projectIds.has(id), `${entry.id} references unknown project "${id}"`).toBe(
          true
        );
      }
    }
  });

  it("at most one entry is marked current", () => {
    expect(experience.filter((e) => e.current).length).toBeLessThanOrEqual(1);
  });
});

describe("education", () => {
  it("seasonId references a real season", () => {
    const seasonIds = new Set(seasons.map((s) => s.id));
    for (const entry of education) {
      expect(seasonIds.has(entry.seasonId), entry.id).toBe(true);
    }
  });
});

describe("social links", () => {
  it("email is present and is a real mailto link (never a placeholder)", () => {
    const email = socialLinks.find((l) => l.id === "email");
    expect(email?.url).toMatch(/^mailto:.+@.+/);
  });

  it("placeholder links are explicitly null, never an empty string or fake URL", () => {
    for (const link of socialLinks) {
      if (link.id === "email") continue;
      expect(link.url === null || typeof link.url === "string").toBe(true);
      if (link.url !== null) {
        expect(link.url.length).toBeGreaterThan(0);
      }
    }
  });
});
