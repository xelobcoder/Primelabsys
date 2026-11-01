import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { softwareCapabilityGroups } from "@/data/software-capabilities";
import { SoftwareCapabilities, SoftwareCoverageOverview } from "./SoftwareCapabilities";
import { filterCapabilityGroups, type PublicCapabilityGroup } from "./SoftwareCapabilityExplorer";

const groups: PublicCapabilityGroup[] = softwareCapabilityGroups.map(group => ({
  ...group,
  capabilities: group.capabilities.map(({ id, title, summary, scope, workflows, route }) => ({ id, title, summary, scope, workflows, route })),
}));

describe("complete public software catalog", () => {
  it("renders every verified capability and its actions without exposing internal evidence", () => {
    const html = renderToStaticMarkup(createElement(SoftwareCapabilities));
    const capabilities = softwareCapabilityGroups.flatMap(group => group.capabilities);
    expect(html.match(/class="software-capability"/g)).toHaveLength(capabilities.length);
    for (const capability of capabilities) {
      expect(html).toContain(`id="software-feature-${capability.id}"`);
      for (const workflow of capability.workflows) expect(html).toContain(renderToStaticMarkup(createElement("li", null, workflow)));
    }
    expect(html).not.toContain("lobnos-server");
    expect(html).not.toContain("src/controllers");
    expect(html).toContain('href="/product-tour"');
    expect(html).toContain('class="software-browse"');
    expect(html).toContain('aria-label="Software workflow areas"');
    expect(html.match(/<details class="software-group-accordion"/g)).toHaveLength(softwareCapabilityGroups.length);
    const financeCta = html.match(/<a class="button" href="([^"]+)">Discuss accounting workflows/);
    expect(new URL(financeCta?.[1] ?? "", "http://localhost").searchParams.get("focus")).toBe("Operational and financial oversight");
  });

  it("derives homepage counts and links from the same complete catalog", () => {
    const html = renderToStaticMarkup(createElement(SoftwareCoverageOverview));
    for (const group of softwareCapabilityGroups) expect(html).toContain(`href="/features#software-${group.id}"`);
    const total = softwareCapabilityGroups.reduce((sum, group) => sum + group.capabilities.length, 0);
    expect(html).toContain(`<dd>${total}</dd>`);
    expect(html).toContain(`<dd>${softwareCapabilityGroups.length}</dd>`);
  });

  it("searches group names, titles, actions and boundaries without losing or mutating the full catalog", () => {
    expect(filterCapabilityGroups(groups, "   ")).toBe(groups);
    const payroll = filterCapabilityGroups(groups, "PAYROLL");
    expect(payroll.length).toBeGreaterThan(0);
    expect(payroll.flatMap(group => group.capabilities).some(capability => capability.route.includes("payroll"))).toBe(true);
    const department = filterCapabilityGroups(groups, "department stock");
    expect(department.flatMap(group => group.capabilities).some(capability => capability.route === "/inventory/department-stock")).toBe(true);
    expect(filterCapabilityGroups(groups, "nonexistent-capability-xyz")).toEqual([]);
    expect(groups.flatMap(group => group.capabilities)).toHaveLength(100);
  });
});
