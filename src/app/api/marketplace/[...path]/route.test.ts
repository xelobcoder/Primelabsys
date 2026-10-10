import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/marketplace/[...path]/route";

const facilitySlug = "independent-lab";
const privateToken = "a".repeat(43);
const context = (path: string[]) => ({ params: Promise.resolve({ path }) });

function request(path: string, method: "GET" | "POST", body?: unknown, extraHeaders: Record<string, string> = {}) {
  return new NextRequest(`http://localhost:2380/api/marketplace/${path}`, {
    method,
    headers: {
      origin: "http://localhost:2380",
      ...(body === undefined ? {} : { "content-type": "application/json" }),
      ...extraHeaders,
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}

function jsonResponse(result: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify({ status: "success", result }), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
}

beforeEach(() => {
  vi.stubEnv("CORE_PLATFORM_API_URL", "https://core.example");
  vi.stubEnv("CORE_PLATFORM_ALLOWED_ORIGIN", "https://core.example");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("same-origin marketplace proxy", () => {
  it("preserves pending registration and never turns it into an approved listing", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ facility: { slug: facilitySlug, status: "pending_approval" } }, 202));
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(request("registrations", "POST", { name: "Independent Lab", adminPassword: "a-secure-password" }), context(["registrations"]));
    expect(response.status).toBe(202);
    expect((await response.json()).result.facility.status).toBe("pending_approval");
    expect(response.headers.get("cache-control")).toContain("no-store");
  });

  it("forwards private booking credentials in the request body, never in the upstream URL", async () => {
    const body = {
      facilitySlug,
      itemIds: [1],
      idempotencyKey: privateToken,
      patient: { name: "Private Example", phone: "+10000000", email: null },
      collectionMethod: "in_facility",
      collectionAddress: null,
    };
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({
      bookingId: "32638520-7ba6-4c73-8f24-2bb5f3b2a6e4",
      trackingToken: privateToken,
      status: "requested",
      totalAmount: 42,
      currency: "GHS",
      paymentInstructions: null,
    }, 201));
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(request("bookings", "POST", body), context(["bookings"]));
    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://core.example/api/v1/marketplace/bookings");
    expect(url).not.toContain(privateToken);
    expect(JSON.parse(String(options.body)).idempotencyKey).toBe(privateToken);
    expect(response.status).toBe(201);
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect((await response.json()).result.status).toBe("requested");
  });

  it("forwards a private status lookup with POST and leaves payment claims pending", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ claimId: 9, status: "pending_verification" }, 201));
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(request("bookings/payment-claims", "POST", { trackingToken: privateToken, reference: "external-ref", amount: 42 }), context(["bookings", "payment-claims"]));
    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://core.example/api/v1/marketplace/bookings/payment-claims");
    expect(url).not.toContain(privateToken);
    expect(JSON.parse(String(options.body)).trackingToken).toBe(privateToken);
    expect((await response.json()).result.status).toBe("pending_verification");
    expect(response.headers.get("cache-control")).toContain("no-store");
  });

  it("rewrites only the secure, HTTP-only staff cookie path for the site proxy", async () => {
    const upstreamCookie = "pls-marketplace-session=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN; Path=/api/v1/marketplace/staff; Max-Age=43200; HttpOnly; Secure; SameSite=Strict";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ expiresAt: "2030-01-01T00:00:00.000Z" }, 200, { "set-cookie": upstreamCookie })));
    const response = await POST(request("staff/login", "POST", { facilitySlug, email: "admin@example.org", password: "correct-horse-battery" }), context(["staff", "login"]));
    expect(response.status).toBe(200);
    const cookie = response.headers.get("set-cookie") || "";
    expect(cookie).toContain("Path=/api/marketplace/staff");
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("Secure");
    expect(cookie).toContain("SameSite=Strict");
    expect(cookie).not.toContain("Domain=");
    const loginResponse = await response.json();
    expect(loginResponse.result).not.toHaveProperty("token");
    expect(loginResponse.result).not.toHaveProperty("sessionToken");
    expect(loginResponse.result).not.toHaveProperty("bearer");
  });

  it("rejects insecure upstream staff cookies rather than exposing a weaker session", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({}, 200, {
      "set-cookie": "pls-marketplace-session=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN; Path=/api/v1/marketplace/staff; HttpOnly; SameSite=Strict",
    })));
    const response = await POST(request("staff/login", "POST", {}), context(["staff", "login"]));
    expect(response.status).toBe(502);
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("requires an exact same-origin request before staff mutations", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(request("staff/logout", "POST", {}, { origin: "https://attacker.example" }), context(["staff", "logout"]));
    expect(response.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects tenant authority in query/body and does not forward staff cookies to public discovery", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ facilities: [] }));
    vi.stubGlobal("fetch", fetchMock);
    const queryRequest = new NextRequest("http://localhost:2380/api/marketplace/facilities?tenantId=1", {
      headers: { cookie: `pls-marketplace-session=${privateToken}` },
    });
    const queryResponse = await GET(queryRequest, context(["facilities"]));
    expect(queryResponse.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();

    const bodyResponse = await POST(request("registrations", "POST", { tenantId: 1 }), context(["registrations"]));
    expect(bodyResponse.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();

    await GET(request("facilities", "GET", undefined, { cookie: `pls-marketplace-session=${privateToken}` }), context(["facilities"]));
    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(new Headers(options.headers).has("cookie")).toBe(false);
  });
});
