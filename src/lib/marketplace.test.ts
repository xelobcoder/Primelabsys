import { afterEach, describe, expect, it, vi } from "vitest";
import {
  bookingRequestSchema,
  bookingTrackingRequestSchema,
  facilityRegistrationRequestSchema,
  getMarketplaceCatalog,
  getMarketplaceFacilities,
  marketplaceCoreOrigin,
  paymentClaimRequestSchema,
  trackingTokenHtmlPattern,
} from "@/lib/marketplace";

afterEach(() => vi.unstubAllEnvs());

describe("marketplace request boundaries", () => {
  it("requires a 256-bit base64url idempotency/tracking token and unique catalog items", () => {
    const booking = {
      facilitySlug: "independent-lab",
      itemIds: [1, 2],
      idempotencyKey: "a".repeat(43),
      patient: { name: "Taylor Example", phone: "+10000000", email: null },
      collectionMethod: "in_facility",
      collectionAddress: null,
    };
    expect(bookingRequestSchema.safeParse(booking).success).toBe(true);
    expect(bookingRequestSchema.safeParse({ ...booking, itemIds: [1, 1] }).success).toBe(false);
    expect(bookingRequestSchema.safeParse({ ...booking, idempotencyKey: "x" }).success).toBe(false);
    expect(bookingTrackingRequestSchema.safeParse({ trackingToken: "a".repeat(43) }).success).toBe(true);
  });

  describe("public marketplace catalog integration", () => {
    it("preserves approved PLS facilities and selectable panel types from the live catalog", async () => {
      vi.stubEnv("CORE_PLATFORM_API_URL", "https://core.example");
      vi.stubEnv("CORE_PLATFORM_ALLOWED_ORIGIN", "https://core.example");
      const catalog = {
        facility: {
          slug: "provisioned-lab",
          name: "Provisioned Laboratory",
          region: "Central",
          locality: "Accra",
          address: "",
          phone: "",
          contactEmail: "",
          description: "An approved PLS-connected facility.",
          openingHours: {},
          paymentInstructions: null,
          currency: "GHS",
          facilityType: "pls-integrated",
        },
        currency: "GHS",
        tests: [{
          id: 41,
          type: "panel",
          name: "Complete blood count panel",
          description: null,
          price: 125,
          sampleRequirements: [],
          collectionMethods: ["in_facility"],
          available: true,
          turnaroundHours: null,
        }],
        source: "pls-live",
      };
      const fetchMock = vi.fn()
        .mockResolvedValueOnce(new Response(JSON.stringify({ status: "success", result: { facilities: [catalog.facility] } }), {
          status: 200,
          headers: { "content-type": "application/json" },
        }))
        .mockResolvedValueOnce(new Response(JSON.stringify({ status: "success", result: catalog }), {
          status: 200,
          headers: { "content-type": "application/json" },
        }));
      vi.stubGlobal("fetch", fetchMock);

      const facilities = await getMarketplaceFacilities();
      expect(facilities.status).toBe("ok");
      if (facilities.status !== "ok") throw new Error("expected approved facility list");
      expect(facilities.data[0]?.facilityType).toBe("pls-integrated");

      const result = await getMarketplaceCatalog("provisioned-lab");
      expect(result.status).toBe("ok");
      if (result.status !== "ok") throw new Error("expected live PLS catalog");
      expect(result.data.source).toBe("pls-live");
      expect(result.data.tests[0]?.type).toBe("panel");
      expect(result.data.tests[0]?.available).toBe(true);
      expect(result.data.tests[0]?.price).toBe(125);
    });
  });

  it("uses a valid modern HTML v-mode pattern for private tracking codes", () => {
    const htmlPattern = new RegExp(`^(?:${trackingTokenHtmlPattern})$`, "v");
    expect(htmlPattern.test("A".repeat(42) + "-")).toBe(true);
    expect(htmlPattern.test("A".repeat(42) + "_")).toBe(true);
    expect(htmlPattern.test("A".repeat(42) + "/")).toBe(false);
  });

  it("requires an address for home collection without accepting browser-submitted totals", () => {
    const booking = {
      facilitySlug: "independent-lab",
      itemIds: [1],
      idempotencyKey: "a".repeat(43),
      patient: { name: "Taylor Example", phone: "+10000000", email: null },
      collectionMethod: "home",
      collectionAddress: null,
    };
    expect(bookingRequestSchema.safeParse(booking).success).toBe(false);
    expect(bookingRequestSchema.safeParse({ ...booking, collectionAddress: "10 Sample Street" }).success).toBe(true);
    const parsed = bookingRequestSchema.safeParse({ ...booking, collectionAddress: "10 Sample Street", totalAmount: 0 });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data).not.toHaveProperty("totalAmount");
  });

  it("requires real registration fields and enforces the bcrypt UTF-8 byte limit", () => {
    const registration = {
      name: "Independent Lab",
      slug: "independent-lab",
      region: "Region",
      locality: "Town",
      address: "10 Sample Street",
      phone: "+10000000",
      contactEmail: "contact@example.org",
      description: "An independent laboratory application.",
      openingHours: { monday: "08:00-17:00" },
      paymentInstructions: "",
      currency: "GHS",
      adminEmail: "admin@example.org",
      adminPassword: "a-secure-password",
    };
    expect(facilityRegistrationRequestSchema.safeParse(registration).success).toBe(true);
    expect(facilityRegistrationRequestSchema.safeParse({ ...registration, adminPassword: "é".repeat(40) }).success).toBe(false);
    expect(facilityRegistrationRequestSchema.safeParse({ ...registration, slug: "Not A Slug" }).success).toBe(false);
  });

  it("treats payment references as positive-amount claims, not proof of payment", () => {
    expect(paymentClaimRequestSchema.safeParse({ trackingToken: "a".repeat(43), reference: "BANK-REF-1", amount: 100 }).success).toBe(true);
    expect(paymentClaimRequestSchema.safeParse({ trackingToken: "a".repeat(43), reference: "BANK-REF-1", amount: 0 }).success).toBe(false);
  });

  it("accepts only the explicitly allowlisted HTTPS core origin in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("CORE_PLATFORM_API_URL", "https://core.example");
    vi.stubEnv("CORE_PLATFORM_ALLOWED_ORIGIN", "https://core.example");
    expect(marketplaceCoreOrigin()).toBe("https://core.example");
    vi.stubEnv("CORE_PLATFORM_API_URL", "https://attacker.example");
    expect(marketplaceCoreOrigin()).toBeNull();
  });
});
