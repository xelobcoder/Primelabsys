import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const script = readFileSync(join(process.cwd(), "deploy.sh"), "utf8");

describe("production dependency deployment", () => {
  it("keeps pulled dependency manifests instead of restoring server copies", () => {
    expect(script).toContain("git diff --quiet HEAD -- package.json pnpm-lock.yaml");
    expect(script).toContain("git pull --ff-only --no-autostash");
    expect(script).not.toMatch(/\bcp\b[^\n]*package(?:-lock)?\.json/);
    expect(script).toContain("cp /tmp/pls.env.bak .env");
  });

  it("installs locked runtime and build dependencies before building", () => {
    const install = script.indexOf("pnpm install --frozen-lockfile --prod=false");
    expect(install).toBeGreaterThan(script.indexOf("git pull --ff-only --no-autostash"));
    expect(install).toBeLessThan(script.indexOf("pnpm run build"));
  });

  it("declares the self-hosted font as a runtime dependency with resolvable CSS", () => {
    const manifest = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf8"));
    expect(manifest.dependencies).toHaveProperty("@fontsource/lato");
    const require = createRequire(import.meta.url);
    for (const weight of [400, 700]) {
      const path = require.resolve(`@fontsource/lato/latin-${weight}.css`);
      expect(readFileSync(path, "utf8")).toContain("@font-face");
    }
  });
});
