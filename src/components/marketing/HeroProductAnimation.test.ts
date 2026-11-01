import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { HeroProductAnimation } from "./HeroProductAnimation";

describe("illustrative workflow preview", () => {
  it("renders a hydration-safe, paused server state and labels the examples", () => {
    const html = renderToStaticMarkup(createElement(HeroProductAnimation));
    expect(html).toContain('aria-label="Play automated workflow animation"');
    expect(html).toContain("ILLUSTRATIVE");
    expect(html).toContain("Illustrative interface and sample data, not a live product screen.");
    expect(html).toContain('role="status"');
    expect(html).toContain('role="group" aria-label="Select animation scene"');
    expect(html).not.toContain('role="tablist"');
    expect(html).not.toContain('aria-live="polite"');
  });
});
