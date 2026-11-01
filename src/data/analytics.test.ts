import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { analyticsAreas, analyticsScreenIds } from "./analytics";
import { productScreens } from "./product-screens";
import AnalyticsPage from "@/app/analytics/page";
import { AnalyticsShowcase } from "@/components/marketing/AnalyticsShowcase";
import { ActualProductGallery } from "@/components/marketing/ActualProductGallery";

describe("extensive public analytics visualization", () => {
  it("covers fifteen implemented reporting areas with source references and specific report names", () => {
    expect(analyticsAreas).toHaveLength(15);
    expect(new Set(analyticsAreas.map(area => area.id)).size).toBe(15);
    for (const area of analyticsAreas) {
      expect(area.reports.length).toBeGreaterThanOrEqual(5);
      expect(area.route).toMatch(/^\//);
      expect(area.evidence.every(source => /:\d+$/.test(source))).toBe(true);
      for (const id of area.screenIds ?? []) expect(productScreens.some(screen => screen.id === id)).toBe(true);
    }
    expect(analyticsAreas.map(area => area.id)).toEqual(expect.arrayContaining(["results", "outsourcing", "outstanding", "payroll", "pharmacy", "inventory", "patients", "clinicians", "compliance", "specimens"]));
  });

  it("renders every area and metric group, with an analytics-only gallery and explicit capture boundaries", () => {
    const html = renderToStaticMarkup(createElement(AnalyticsPage));
    for (const area of analyticsAreas) {
      expect(html).toContain(`id="analytics-${area.id}"`);
      for (const report of area.reports) expect(html).toContain(renderToStaticMarkup(createElement("li", null, createElement("span", { "aria-hidden": true }, "✓"), report)));
    }
    expect(html.match(/<option /g)).toHaveLength(analyticsScreenIds.length);
    expect(html).toContain('href="/images/pls-inventory-dashboard.png"');
    expect(html).toContain("not every report listed below");
    expect(html).not.toContain("app/analytics/");
    expect(html).not.toContain("SYNTHETIC UI");
  });

  it("keeps registered originals and provides selected-report galleries without affecting the default gallery", () => {
    const selected = analyticsScreenIds.map(id => productScreens.find(screen => screen.id === id)!);
    expect(selected.every(Boolean)).toBe(true);
    const html = renderToStaticMarkup(createElement(ActualProductGallery, { screens: selected }));
    expect(html.match(/<option /g)).toHaveLength(selected.length);
    const original = productScreens.find(screen => screen.id === "inventory-dashboard")!;
    const image = readFileSync(join(process.cwd(), "public", original.src));
    expect(image.readUInt32BE(16)).toBe(1440);
    expect(image.readUInt32BE(20)).toBe(2200);
    expect(productScreens[0].id).toBe("registration");
    expect(() => renderToStaticMarkup(createElement(ActualProductGallery, { screens: [] }))).toThrow("at least one registered screenshot");
  });

  it("makes analytics visible on the homepage, features, navigation, footer and sitemap", () => {
    const html = renderToStaticMarkup(createElement(AnalyticsShowcase));
    expect(html.match(/class="analytics-preview-card"/g)).toHaveLength(3);
    expect(html).toContain('href="/analytics"');
    for (const area of analyticsAreas) expect(html).toContain(`href="/analytics#analytics-${area.id}"`);
    for (const file of ["src\\app\\page.tsx", "src\\app\\features\\page.tsx"]) expect(readFileSync(join(process.cwd(), file), "utf8")).toContain("<AnalyticsShowcase />");
    for (const file of ["src\\components\\layout\\SiteHeader.tsx", "src\\components\\layout\\SiteFooter.tsx", "src\\app\\sitemap.ts"]) expect(readFileSync(join(process.cwd(), file), "utf8")).toContain('"/analytics"');
  });
});
