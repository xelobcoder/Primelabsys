import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(join(process.cwd(), "src", "app", "globals.css"), "utf8");
const typography = css.slice(css.indexOf("/* Shared typography;"));

function declarations(selector: string) {
  const rules = Array.from(typography.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/([^{}]+)\{([^{}]+)\}/g));
  return rules
    .filter(([, selectors]) => selectors!.split(",").some((item) => item.trim() === selector))
    .map(([, , body]) => body)
    .join("\n");
}

describe("shared readable typography", () => {
  it("defines browser-scalable sizes for body, controls, labels and supporting text", () => {
    expect(css).toContain("--text-body: 1.125rem;");
    expect(css).toContain("--text-control: 1rem;");
    expect(css).toContain("--text-label: .9375rem;");
    expect(css).toContain("--text-small: .875rem;");
    expect(css).toContain("--text-title: 1.375rem;");
    expect(css).toMatch(/body\s*\{[^}]*font-size:\s*var\(--text-body\)/);
  });

  it("applies readable sizes across marketing, directory, forms and portal surfaces", () => {
    for (const selector of [".hero-copy > p", ".feature-row p", ".article-wrap section p", ".marketplace-item-card > p"]) {
      expect(declarations(selector)).toContain("font-size: var(--text-body)");
    }
    for (const selector of [".nav-item > a", ".hero-actions .button", ".form-field input", ".catalog-table td"]) {
      expect(declarations(selector)).toContain("font-size: var(--text-control)");
    }
    for (const selector of [".footer-links a", ".form-privacy", ".role-line small"]) {
      expect(declarations(selector)).toContain("font-size: var(--text-small)");
    }
  });

  it("uses upright heading emphasis without resizing miniature illustrations", () => {
    expect(declarations(".hero h1 em")).toContain("font-style: normal");
    expect(declarations(".hero h1")).toContain("letter-spacing: -.03em");
    expect(typography).not.toMatch(/\.(?:dashboard-frame|screen-workflow-table|dashboard-sample-table)\s*\{/);
    expect(typography).toContain("@media (max-width: 1280px) and (min-width: 851px)");
    expect(declarations(".friction-grid")).toContain("grid-template-columns: 1fr");
  });
});
