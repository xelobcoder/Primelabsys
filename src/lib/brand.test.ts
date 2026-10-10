import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { brandColors } from "@/lib/brand";

function luminance(hex: string) {
  const channels = hex.slice(1).match(/.{2}/g)?.map((channel) => parseInt(channel, 16) / 255) ?? [];
  const [red, green, blue] = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  );
  return 0.2126 * red! + 0.7152 * green! + 0.0722 * blue!;
}

function contrastRatio(first: string, second: string) {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0]! + 0.05) / (values[1]! + 0.05);
}

describe("official PLS brand colors", () => {
  it("uses the official primary green consistently in CSS and the app icon", () => {
    const css = readFileSync(join(process.cwd(), "src", "app", "globals.css"), "utf8");
    const icon = readFileSync(join(process.cwd(), "src", "app", "icon.svg"), "utf8");
    expect(css).toMatch(new RegExp(`--brand-green:\\s*${brandColors.primary};`));
    expect(css).toMatch(new RegExp(`--button-label:\\s*${brandColors.onPrimary};`));
    expect(css).toMatch(new RegExp(`--green-text:\\s*${brandColors.readableAccent};`));
    expect(css).toMatch(/\.button\s*\{[^}]*background:\s*var\(--brand-green\);[^}]*color:\s*var\(--button-label\);/);
    expect(icon).toContain(`fill="${brandColors.primary}"`);
  });

  it("keeps normal-size text readable on official-green buttons and accent text", () => {
    expect(contrastRatio(brandColors.onPrimary, brandColors.primary)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(brandColors.readableAccent, "#ffffff")).toBeGreaterThanOrEqual(4.5);
  });
});
