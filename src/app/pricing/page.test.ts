import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import PricingPage, { metadata } from "./page";
import RequestDemoPage from "@/app/request-demo/page";
import { pricingFaqs, pricingOptions } from "@/data/pricing";

describe("public quotation-led pricing", () => {
  it("renders all scope options, quotation factors and FAQs without fabricated commercial claims", () => {
    const html = renderToStaticMarkup(createElement(PricingPage));
    expect(metadata.alternates).toEqual({ canonical: "/pricing" });
    expect(html.match(/<strong>Custom quote<\/strong>/g)).toHaveLength(3);
    expect(html).toContain("No published fixed rates");
    expect(html).toContain("not fixed packages or license tiers");
    expect(html).not.toMatch(/\$\d|MOST ADOPTED|Unlimited users|99\.9%|HIPAA certified/);
    for (const option of pricingOptions) {
      expect(html).toContain(`href="/request-demo?focus=${encodeURIComponent(option.focus)}"`);
      expect(html).toContain(`id="pricing-${option.id}-title"`);
    }
    expect(html.match(/<details>/g)).toHaveLength(pricingFaqs.length);
    expect(html).toContain('href="/features#software-capabilities"');
    expect(html).toContain('href="/product-tour"');
  });

  it("keeps the selected pricing scope in the existing demo enquiry form", async () => {
    for (const option of pricingOptions) {
      const element = await RequestDemoPage({ searchParams: Promise.resolve({ focus: option.focus }) });
      const html = renderToStaticMarkup(element);
      expect(html).toContain("PRICING ENQUIRY");
      expect(html).toContain(option.focus.replace(/&/g, "&amp;"));
      expect(html).not.toContain("FIT FINDER RESULT");
      expect(html).toContain("I would like to discuss:");
      expect(html).not.toContain("I used the PLS fit finder");
    }
  });

  it("preserves fit finder context and rejects arbitrary query-string context", async () => {
    const fit = renderToStaticMarkup(await RequestDemoPage({ searchParams: Promise.resolve({ focus: "Core laboratory workflow foundation" }) }));
    expect(fit).toContain("FIT FINDER RESULT");
    const invalid = renderToStaticMarkup(await RequestDemoPage({ searchParams: Promise.resolve({ focus: "unsupported-pricing-context" }) }));
    expect(invalid).not.toContain("unsupported-pricing-context");
  });

  it("exposes pricing in main navigation, footer and sitemap", () => {
    for (const file of ["src\\components\\layout\\SiteHeader.tsx", "src\\components\\layout\\SiteFooter.tsx", "src\\app\\sitemap.ts"]) {
      expect(readFileSync(join(process.cwd(), file), "utf8")).toContain('"/pricing"');
    }
  });
});
