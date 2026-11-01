import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { productScreens } from "@/data/product-screens";
import ProductTourPage from "./page";

describe("product tour navigation", () => {
  it("keeps every screenshot reachable from a collapsible workspace index", () => {
    const html = renderToStaticMarkup(createElement(ProductTourPage));
    expect(html).toContain('<details class="screen-library-index">');
    expect(html).toContain('aria-label="Product screenshots"');
    expect(html).not.toContain('<nav class="software-group-links" aria-label="Product screenshots">');
    for (const screen of productScreens) {
      expect(html).toContain(`href="#screen-${screen.id}"`);
      expect(html).toContain(`id="screen-${screen.id}"`);
    }
  });
});
