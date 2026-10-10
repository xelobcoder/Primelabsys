import { describe, expect, it } from "vitest";
import { leadSchema } from "@/lib/lead";

const valid = {
  formType: "demo",
  fullName: "Alex Example",
  workEmail: "alex@example.org",
  organization: "Example laboratory",
  message: "We would like to discuss registration and result workflows.",
};

describe("leadSchema", () => {
  it("accepts a valid demo enquiry", () => {
    expect(leadSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects invalid email and too-short messages", () => {
    const result = leadSchema.safeParse({ ...valid, workEmail: "invalid", message: "hello" });
    expect(result.success).toBe(false);
  });

  it("rejects a filled honeypot field", () => {
    expect(leadSchema.safeParse({ ...valid, _website: "bot content" }).success).toBe(false);
  });
});
