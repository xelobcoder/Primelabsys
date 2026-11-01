import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SiteHeader } from "./SiteHeader";

describe("site navigation", () => {
  const html = renderToStaticMarkup(createElement(SiteHeader));
  const css = readFileSync(join(process.cwd(), "src", "app", "globals.css"), "utf8");

  it("renders collapsed navigation controls and a hidden solutions disclosure", () => {
    expect(html).toContain('aria-expanded="false" aria-controls="primary-navigation"');
    expect(html).toContain('aria-expanded="false" aria-controls="solutions-mega-menu"');
    expect(html).toMatch(/id="solutions-mega-menu"[^>]*hidden=""/);
    expect(html).not.toContain('aria-haspopup="true"');
    expect(html).toContain('href="/product-tour"');
    expect(css).toMatch(/\.mega-menu\[hidden\]\s*\{\s*display:\s*none/);
    expect(css).not.toMatch(/\.nav-has-menu:(?:hover|focus-within)\s+\.mega-menu/);
  });

  it("uses a viewport-bounded drawer and animates both visible toggle lines", () => {
    expect(css).toMatch(/@media \(max-width: 1200px\)\s*\{[\s\S]*?\.primary-nav\s*\{\s*position:\s*absolute;\s*top:\s*100%/);
    expect(css).toContain("max-height: calc(100dvh - 120px)");
    expect(html).toContain('<div class="nav-links">');
    expect(css).toMatch(/\.nav-links\s*\{[^}]*overflow-y:\s*auto/);
    expect(css).not.toMatch(/\.nav-demo\s*\{[^}]*position:\s*sticky/);
    expect(css).toContain('span[aria-hidden="true"]:nth-child(2)');
    expect(css).toContain('span[aria-hidden="true"]:nth-child(3)');
  });
});
