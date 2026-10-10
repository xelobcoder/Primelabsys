import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FacilityListings } from "./FacilityListings";
import type { MarketplaceFacility } from "@/lib/marketplace";

const facility: MarketplaceFacility = {
  slug: "reviewed-laboratory",
  name: "Reviewed Laboratory",
  region: "Northern Region",
  locality: "Tamale",
  address: "",
  phone: "",
  contactEmail: "",
  description: "Approved public laboratory description.",
  openingHours: {},
  paymentInstructions: null,
  currency: "GHS",
  facilityType: "pls-integrated",
  bookingSupported: false,
  facilityLoginUrl: null,
};

describe("public facility listings table", () => {
  it("renders facilities in accessible rows with catalog links and all listing details", () => {
    const html = renderToStaticMarkup(createElement(FacilityListings, { facilities: [facility] }));
    expect(html).toContain('<table class="facility-listings-table">');
    for (const title of ["Laboratory", "Location", "Facility type", "Catalog"]) {
      expect(html).toContain(`<th scope="col">${title}</th>`);
    }
    expect(html).toContain('scope="row"');
    expect(html).toContain("Reviewed Laboratory");
    expect(html).toContain(facility.description);
    expect(html).toContain("Tamale, Northern Region");
    expect(html).toContain("PLS-connected facility");
    expect(html).toContain("Published catalog · GHS");
    expect(html).toContain('href="/facilities/reviewed-laboratory"');
    expect(html).toContain('class="sr-only"> for Reviewed Laboratory</span>');
    expect(html).toContain('aria-label="Public facility listings" tabindex="0"');
    expect(html).toContain('aria-live="polite">1 laboratory');
  });

  it("preserves independent facility labels, plural counts and missing descriptions", () => {
    const independent = { ...facility, slug: "independent-laboratory", name: "Independent Laboratory", facilityType: "independent" as const, description: "" };
    const html = renderToStaticMarkup(createElement(FacilityListings, { facilities: [facility, independent] }));
    expect(html).toContain("Independent facility");
    expect(html).toContain('aria-live="polite">2 laboratories');
    expect(html.match(/scope="row"/g)).toHaveLength(2);
    expect(html.match(/class="facility-listings-description"/g)).toHaveLength(1);
  });

  it("keeps the approved-directory empty state instead of rendering an empty table", () => {
    const html = renderToStaticMarkup(createElement(FacilityListings, { facilities: [] }));
    expect(html).toContain("No approved facilities are listed yet.");
    expect(html).toContain('aria-live="polite">0 laboratories');
    expect(html).not.toContain("<table");
  });
});
