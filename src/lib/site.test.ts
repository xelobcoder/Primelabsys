import { afterEach, describe, expect, it, vi } from "vitest";
import { approvedPortalUrl } from "@/lib/site";

describe("approved portal destinations", () => {
  afterEach(() => vi.unstubAllEnvs());
  const allowlist = ["portal.example.org"];

  it("accepts a clean HTTPS URL on the exact approved host", () => {
    expect(approvedPortalUrl("https://portal.example.org/results", allowlist)).toBe("https://portal.example.org/results");
  });

  it("rejects unapproved hosts, insecure schemes and credential-like URL state", () => {
    expect(approvedPortalUrl("https://attacker.example.org/", allowlist)).toBeNull();
    expect(approvedPortalUrl("http://portal.example.org/", allowlist)).toBeNull();
    expect(approvedPortalUrl("https://portal.example.org/?patient=123", allowlist)).toBeNull();
    expect(approvedPortalUrl("https://user:secret@portal.example.org/", allowlist)).toBeNull();
  });
  it("requires both loopback permission and an approved host for local client login", () => {
    vi.stubEnv("PLS_PORTAL_ALLOW_LOOPBACK_HTTP", "false");
    expect(approvedPortalUrl("http://localhost:2377/authentications/login", ["localhost"])).toBeNull();
    vi.stubEnv("PLS_PORTAL_ALLOW_LOOPBACK_HTTP", "true");
    expect(approvedPortalUrl("http://localhost:2377/authentications/login", ["localhost"])).toBe("http://localhost:2377/authentications/login");
    expect(approvedPortalUrl("http://localhost:2377/authentications/login", [])).toBeNull();
    expect(approvedPortalUrl("http://remote.example/login", ["remote.example"])).toBeNull();
    expect(approvedPortalUrl("http://localhost:2377/login?token=private", ["localhost"])).toBeNull();
  });
});
