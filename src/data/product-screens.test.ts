import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ActualProductGallery } from "@/components/marketing/ActualProductGallery";
import ProductTourPage from "@/app/product-tour/page";
import { productScreens } from "./product-screens";
import { solutions } from "./content";

describe("unchanged demo software screenshot library", () => {
  it("registers real full-page assets with routes and accurate dimensions", () => {
    expect(productScreens.length).toBeGreaterThanOrEqual(28);
    expect(new Set(productScreens.map(screen => screen.id)).size).toBe(productScreens.length);
    expect(new Set(productScreens.map(screen => screen.src)).size).toBe(productScreens.length);
    for (const screen of productScreens) {
      const image = readFileSync(join(process.cwd(), "public", screen.src));
      expect(image.subarray(1, 4).toString()).toBe("PNG");
      expect(image.readUInt32BE(16)).toBe(screen.width);
      expect(image.readUInt32BE(20)).toBe(screen.height);
      expect(image.byteLength).toBeGreaterThan(40000);
      expect(screen.sourceRoute).toMatch(/^\//);
      expect(screen.provenance).toContain("application header");
      expect(screen.provenance).not.toContain("redacted");
      expect(screen.alt).not.toContain("redacted");
      for (const slug of screen.solutions) expect(solutions.some(solution => solution.slug === slug)).toBe(true);
    }
  });

  it("shows real screenshots and offers every full-size original rather than simulated interfaces", () => {
    const html = renderToStaticMarkup(createElement(ProductTourPage));
    for (const screen of productScreens) {
      expect(html).toContain(`id="screen-${screen.id}"`);
      expect(html).toContain(`href="${screen.src}"`);
    }
    expect(html).toContain("original application header");
    expect(html).not.toContain("SYNTHETIC UI");
    expect(html).not.toContain("PRIVACY-REVIEWED CROP");
    const home = readFileSync(join(process.cwd(), "src", "app", "page.tsx"), "utf8");
    expect(home).not.toContain("DashboardMockup");
    expect(home).not.toContain("ProductShowcase");
    expect(home).not.toContain("hero-product-frame");
  });

  it("provides a compact accessible page selector and next/previous controls", () => {
    const html = renderToStaticMarkup(createElement(ActualProductGallery, { id: "test-gallery" }));
    expect(html.match(/<option /g)).toHaveLength(productScreens.length);
    expect(html).toContain('for="test-gallery-select"');
    expect(html).toContain('aria-controls="test-gallery-panel"');
    expect(html).toContain("Previous software screenshot");
    expect(html).toContain("Next software screenshot");
    expect(html).toContain(`href="${productScreens[0].src}"`);
    expect(html.indexOf('class="actual-gallery-image"')).toBeLessThan(html.indexOf('class="actual-gallery-picker"'));
    const tour = renderToStaticMarkup(createElement(ProductTourPage));
    expect(tour).toContain('loading="eager"');
  });
});
