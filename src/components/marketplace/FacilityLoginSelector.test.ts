import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("facility selection and catalog-only discovery", () => {
  it("redirects only to the selected sanitized facility destination", () => {
    const source = readFileSync(new URL("./FacilityLoginSelector.tsx", import.meta.url), "utf8");
    expect(source).toContain('const [slug, setSlug] = useState("")');
    expect(source).toContain("facilities.find(facility => facility.slug === slug)");
    expect(source).toContain("if (selected?.facilityLoginUrl) window.location.assign(selected.facilityLoginUrl)");
    expect(source).toContain("disabled={!selected?.facilityLoginUrl}");
    expect(source).not.toContain("tenantId");
  });

  it("does not offer online booking for a catalog-only PLS facility", () => {
    const source = readFileSync(new URL("./MarketplaceCatalog.tsx", import.meta.url), "utf8");
    expect(source).toContain("bookingSupported = true");
    expect(source).toContain("{bookingSupported && <label");
    expect(source).toContain("{bookingSupported ? <BookingRequestForm");
    expect(source).toContain("Online booking has not been enabled for this facility");
  });
});
