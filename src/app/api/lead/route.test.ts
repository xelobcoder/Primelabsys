import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/lead/route";

const validLead = {
  formType: "demo",
  fullName: "Taylor Example",
  workEmail: "taylor@example.org",
  organization: "Example laboratory",
  message: "We want to review laboratory workflow and billing requirements.",
  interests: ["Laboratory management"],
  _website: "",
};

function request(body: unknown, ip: string) {
  return new NextRequest("http://localhost:2380/api/lead", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "http://localhost:2380",
      "x-real-ip": ip,
    },
    body: JSON.stringify(body),
  });
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("POST /api/lead", () => {
  it("returns an explicit unavailable response when delivery is not configured", async () => {
    vi.stubEnv("LEAD_WEBHOOK_URL", "");
    vi.stubEnv("LEAD_WEBHOOK_TOKEN", "");
    const response = await POST(request(validLead, "198.51.100.20"));
    expect(response.status).toBe(503);
    expect((await response.json()).message).toContain("Your message was not sent");
  });

  it("validates before attempting delivery", async () => {
    vi.stubEnv("LEAD_WEBHOOK_URL", "https://crm.example.org/leads");
    vi.stubEnv("LEAD_WEBHOOK_TOKEN", "test-only-token");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(request({ ...validLead, workEmail: "not-an-email" }, "198.51.100.21"));
    expect(response.status).toBe(400);
    expect((await response.json()).fields.workEmail).toBeDefined();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not rate-limit invalid submissions", async () => {
    vi.stubEnv("LEAD_WEBHOOK_URL", "https://crm.example.org/leads");
    vi.stubEnv("LEAD_WEBHOOK_TOKEN", "test-only-token");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    for (let attempt = 0; attempt < 6; attempt += 1) {
      const response = await POST(request({ ...validLead, workEmail: "invalid" }, "198.51.100.30"));
      expect(response.status).toBe(400);
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reports success only when the mocked webhook accepts the enquiry", async () => {
    vi.stubEnv("LEAD_WEBHOOK_URL", "https://crm.example.org/leads");
    vi.stubEnv("LEAD_WEBHOOK_TOKEN", "test-only-token");
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 202 }));
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(request(validLead, "198.51.100.22"));
    expect(response.status).toBe(200);
    expect((await response.json()).message).toContain("successfully delivered");
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, options] = fetchMock.mock.calls[0] as [URL, RequestInit];
    expect(url.toString()).toBe("https://crm.example.org/leads");
    expect(new Headers(options.headers).get("authorization")).toBe("Bearer test-only-token");
    expect(JSON.parse(String(options.body))).not.toHaveProperty("_website");
  });

  it("permits plain HTTP only for explicitly enabled loopback development", async () => {
    vi.stubEnv("LEAD_WEBHOOK_URL", "http://127.0.0.1:5000/api/v1/marketplace/platform-enquiries");
    vi.stubEnv("LEAD_WEBHOOK_TOKEN", "test-only-token");
    vi.stubEnv("LEAD_WEBHOOK_ALLOW_LOOPBACK_HTTP", "true");
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 202 }));
    vi.stubGlobal("fetch", fetchMock);
    const accepted = await POST(request(validLead, "198.51.100.23"));
    expect(accepted.status).toBe(200);
    vi.stubEnv("LEAD_WEBHOOK_ALLOW_LOOPBACK_HTTP", "false");
    const rejected = await POST(request(validLead, "198.51.100.24"));
    expect(rejected.status).toBe(503);
    expect(fetchMock).toHaveBeenCalledOnce();
  });
});
