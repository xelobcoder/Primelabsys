import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { productScreens } from "@/data/product-screens";
import { ActualProductGallery } from "./ActualProductGallery";

describe("software screenshot gallery", () => {
  it("announces selection and describes how to inspect a screenshot", () => {
    const screens = productScreens.filter(screen => ["registration", "general-ledger"].includes(screen.id));
    const html = renderToStaticMarkup(createElement(ActualProductGallery, { id: "gallery-test", screens }));
    expect(html.match(/<option /g)).toHaveLength(2);
    expect(html).toContain('role="status" aria-atomic="true"');
    expect(html).toContain("Page 1 of 2: Patient registration");
    expect(html).toContain('aria-controls="gallery-test-panel"');
    expect(html).toContain('aria-describedby="gallery-test-hint"');
    expect(html).toContain("Scroll within the image");
    expect(html).toContain(`href="${screens[0].src}"`);
  });
});
