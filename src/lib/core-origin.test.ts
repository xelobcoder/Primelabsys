import { afterEach, describe, expect, it, vi } from "vitest";
import { corePlatformOrigin } from "@/lib/core-origin";

afterEach(() => vi.unstubAllEnvs());

function configure(origin: string) {
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("CORE_PLATFORM_API_URL", origin);
  vi.stubEnv("CORE_PLATFORM_ALLOWED_ORIGIN", origin);
  vi.stubEnv("CORE_PLATFORM_ALLOW_LOOPBACK_HTTP", "false");
}

describe("core platform origin", () => {
  it("requires opt-in for a production-build loopback HTTP connection", () => {
    configure("http://127.0.0.1:2300");
    expect(corePlatformOrigin()).toBeNull();
    vi.stubEnv("CORE_PLATFORM_ALLOW_LOOPBACK_HTTP", "true");
    expect(corePlatformOrigin()).toBe("http://127.0.0.1:2300");
  });

  it.each(["http://localhost:2300", "http://[::1]:2300"])("supports explicit loopback origin %s", (origin) => {
    configure(origin);
    vi.stubEnv("CORE_PLATFORM_ALLOW_LOOPBACK_HTTP", "true");
    expect(corePlatformOrigin()).toBe(origin);
  });

  it.each([
    "http://core.example.org", "http://127.0.0.1.example.org:2300",
    "http://192.168.1.1:2300", "http://127.0.0.1:2300/api",
    "http://127.0.0.1:2300?tenantId=1", "http://user:password@127.0.0.1:2300",
  ])("rejects non-loopback or unsafe HTTP origin %s even with opt-in", (origin) => {
    configure(origin);
    vi.stubEnv("CORE_PLATFORM_ALLOW_LOOPBACK_HTTP", "true");
    expect(corePlatformOrigin()).toBeNull();
  });

  it("still requires an exact matching allowlist", () => {
    configure("http://127.0.0.1:2300");
    vi.stubEnv("CORE_PLATFORM_ALLOW_LOOPBACK_HTTP", "true");
    vi.stubEnv("CORE_PLATFORM_ALLOWED_ORIGIN", "http://localhost:2300");
    expect(corePlatformOrigin()).toBeNull();
  });

  it("accepts approved HTTPS without enabling local HTTP", () => {
    configure("https://core.example.org");
    expect(corePlatformOrigin()).toBe("https://core.example.org");
  });
});
