import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { implementationSteps } from "@/data/content";
import { ImplementationJourney } from "./ImplementationJourney";

describe("interactive implementation journey", () => {
  it("retains all six stages and their implementation scope", () => {
    const html = renderToStaticMarkup(createElement(ImplementationJourney));
    for (const [, title, copy] of implementationSteps) {
      expect(html).toContain(renderToStaticMarkup(createElement("span", null, title)));
      expect(html).toContain(copy);
    }
    expect(html.match(/class="journey-stage"/g)).toHaveLength(6);
    expect(html.match(/hidden=""/g)).toHaveLength(5);
    expect(html).toContain('href="/request-demo"');
  });

  it("provides explicit stage controls, a status and decorative human illustrations", () => {
    const html = renderToStaticMarkup(createElement(ImplementationJourney));
    expect(html.match(/aria-controls="/g)).toHaveLength(6);
    expect(html.match(/aria-pressed="true"/g)).toHaveLength(1);
    expect(html).toContain('role="status" aria-atomic="true"');
    expect(html).toContain("Previous stage");
    expect(html).toContain("Next stage");
    expect(html).toContain('class="journey-people" aria-hidden="true" focusable="false"');
    expect(html).toContain("Illustrative people, not staff portraits.");
  });
});
