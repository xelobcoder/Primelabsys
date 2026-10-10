import { afterEach, describe, expect, it, vi } from "vitest";
import { getPublicFacilities, getPublicFacilityCatalog } from "@/lib/public-catalog";

const facility = {
  slug: "northstar-laboratory",
  name: "Northstar Laboratory",
  region: "Northern Region",
  locality: "Tamale",
  description: "An approved public facility profile.",
  website: "https://northstar.example.org",
  facilityLoginUrl: "https://portal.example.org/staff",
  patientPortalUrl: "https://portal.example.org/results",
};
const catalog = {
  facility,
  tests: [{ id: 12, name: "Full blood count", description: null, price: 85, currency: "GHS" }],
  services: [{ id: 5, name: "Home collection", description: "Collection service", price: 30, currency: "GHS" }],
  currency: "GHS",
  pricingContext: "General / cash list prices; packages/insurance/discounts may differ",
  updatedAt: "2026-10-10T04:00:00.000Z",
};

function jsonResponse(value: unknown, status = 200) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function configureApi() {
  vi.stubEnv("CORE_PLATFORM_API_URL", "https://core.example.org");
  vi.stubEnv("CORE_PLATFORM_ALLOWED_ORIGIN", "https://core.example.org");
  vi.stubEnv("PLS_PORTAL_ALLOWED_HOSTS", "portal.example.org");
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("public facility catalog integration", () => {
  it("returns a genuinely empty registry as an empty list", async () => {
    configureApi();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ facilities: [] })));
    const result = await getPublicFacilities();
    expect(result).toEqual({ status: "ok", data: [] });
  });

  it("loads only public facility records and allowlisted portal URLs", async () => {
    configureApi();
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ facilities: [facility] }));
    vi.stubGlobal("fetch", fetchMock);
    const result = await getPublicFacilities();
    expect(result.status).toBe("ok");
    if (result.status !== "ok") throw new Error("expected public facility list");
    expect(result.data[0]?.name).toBe(facility.name);
    expect(result.data[0]?.facilityLoginUrl).toBe("https://portal.example.org/staff");
    expect(result.data[0]?.patientPortalUrl).toBe("https://portal.example.org/results");
    const [requestedUrl, options] = fetchMock.mock.calls[0] as [URL, RequestInit];
    expect(requestedUrl.toString()).toBe("https://core.example.org/api/v1/public/facilities");
    expect(requestedUrl.search).toBe("");
    expect(new Headers(options.headers).has("authorization")).toBe(false);
    expect(new Headers(options.headers).has("cookie")).toBe(false);
    expect(options.redirect).toBe("manual");
  });

  it("does not expose a facility login destination outside the approved host allowlist", async () => {
    configureApi();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({
      facilities: [{ ...facility, facilityLoginUrl: "https://untrusted.example/login" }],
    })));
    const result = await getPublicFacilities();
    expect(result.status).toBe("ok");
    if (result.status !== "ok") throw new Error("expected public facility list");
    expect(result.data[0]?.facilityLoginUrl).toBeNull();
  });

  it("does not contact unapproved, insecure or query-bearing API origins", async () => {
    vi.stubEnv("CORE_PLATFORM_API_URL", "http://api.example.org");
    vi.stubEnv("CORE_PLATFORM_ALLOWED_ORIGIN", "http://api.example.org");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    expect(await getPublicFacilities()).toEqual({ status: "unavailable" });
    expect(fetchMock).not.toHaveBeenCalled();

    vi.stubEnv("CORE_PLATFORM_API_URL", "https://core.example.org?tenantId=1");
    vi.stubEnv("CORE_PLATFORM_ALLOWED_ORIGIN", "https://core.example.org");
    expect(await getPublicFacilities()).toEqual({ status: "unavailable" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns an explicit unavailable state for API or response-shape failures", async () => {
    configureApi();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ error: "Unavailable" }, 503)));
    expect(await getPublicFacilities()).toEqual({ status: "unavailable" });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ facilities: [{ ...facility, slug: "../private" }] })));
    expect(await getPublicFacilities()).toEqual({ status: "unavailable" });
  });

  it("returns test and service prices with the API pricing context and null descriptions intact", async () => {
    configureApi();
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(catalog));
    vi.stubGlobal("fetch", fetchMock);
    const result = await getPublicFacilityCatalog("northstar-laboratory");
    expect(result.status).toBe("ok");
    if (result.status !== "ok") throw new Error("expected public catalog");
    expect(result.data.tests[0]?.description).toBeNull();
    expect(result.data.tests[0]?.price).toBe(85);
    expect(result.data.services[0]?.name).toBe("Home collection");
    expect(result.data.pricingContext).toContain("packages/insurance/discounts");
    expect(fetchMock).toHaveBeenCalledOnce();
    const [requestedUrl] = fetchMock.mock.calls[0] as [URL];
    expect(requestedUrl.toString()).toBe("https://core.example.org/api/v1/public/facilities/northstar-laboratory/catalog");
    expect(requestedUrl.search).toBe("");
  });

  it("preserves a 404 for an unlisted or unpublished catalog", async () => {
    configureApi();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ message: "Not found" }, 404)));
    expect(await getPublicFacilityCatalog("unlisted-facility")).toEqual({ status: "not-found" });
  });
});
