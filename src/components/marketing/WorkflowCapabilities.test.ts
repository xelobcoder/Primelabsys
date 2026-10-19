import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { features, featureGroups } from "@/data/content";
import { WorkflowCapabilities } from "./WorkflowCapabilities";

describe("homepage workflow capabilities", () => {
  const html = renderToStaticMarkup(createElement(WorkflowCapabilities));

  it("presents every capability once with its verified description", () => {
    expect(html.match(/<article /g)).toHaveLength(features.length);
    for (const feature of features) {
      const title = renderToStaticMarkup(createElement("h4", null, feature.title));
      expect(html.split(title)).toHaveLength(2);
      expect(html).toContain(renderToStaticMarkup(createElement("p", null, feature.copy)));
    }
  });

  it("provides three named groups with accurate counts and a clear heading hierarchy", () => {
    expect(html.match(/<h2 /g)).toHaveLength(1);
    expect(html.match(/<h3 /g)).toHaveLength(3);
    expect(html.match(/<h4>/g)).toHaveLength(features.length);
    for (const [index, group] of featureGroups.entries()) {
      const count = features.filter(feature => group.numbers.includes(feature.number)).length;
      expect(html).toContain(`aria-labelledby="workflow-group-${index + 1}"`);
      expect(html).toContain(`${count} capabilities</span>`);
    }
    expect(html).not.toContain("<br");
    expect(html).not.toContain("feature-number");
    for (const feature of features) expect(html).toContain(`href="/features#capability-${feature.number}"`);
  });

  it("retains the capability page link and configuration caveat", () => {
    expect(html).toContain('href="/features"');
    expect(html).toContain("Explore all capabilities");
    expect(html).toContain(`${features.length} capabilities across 3 workflow areas.`);
    expect(html).toContain("Availability depends on configuration, permissions, deployment and agreed scope.");
  });
});
