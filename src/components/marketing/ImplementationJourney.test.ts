import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { implementationSteps } from "@/data/content";
import { ImplementationJourney } from "./ImplementationJourney";

describe("connected circular implementation journey", () => {
  it("retains all six stages and their implementation scope", () => {
    const html = renderToStaticMarkup(createElement(ImplementationJourney));
    for (const [, title, copy] of implementationSteps) {
      expect(html).toContain(renderToStaticMarkup(createElement("h3", null, title)));
      expect(html).toContain(copy);
    }
    expect(html.match(/class="journey-visible-stage"/g)).toHaveLength(6);
    expect(html).not.toContain('hidden=""');
    expect(html).not.toContain("<button");
    expect(html).toContain('href="/request-demo"');
  });

  it("provides a clockwise numbered path and decorative human illustrations", () => {
    const html = renderToStaticMarkup(createElement(ImplementationJourney));
    expect(html).toContain('aria-label="Implementation stages in order"');
    expect(html).toContain("Follow the numbered path clockwise");
    expect(html).toContain('class="journey-ring"');
    expect(html).toContain('class="journey-people" aria-hidden="true" focusable="false"');
    expect(html).toContain("Illustrative people, not staff portraits.");
  });
});
