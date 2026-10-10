import { describe, expect, it } from "vitest";
import { getFitRecommendation } from "./implementation-fit";

describe("getFitRecommendation", () => {
  it("prioritizes multi-site planning when the facility is a group", () => {
    expect(getFitRecommendation({
      facility: "multi-site",
      priority: "lab-workflow",
      connectivity: "standalone",
    }).focus).toBe("Connected multi-site planning");
  });

  it("prioritizes interface assessment when analyzers are involved", () => {
    expect(getFitRecommendation({
      facility: "single-lab",
      priority: "lab-workflow",
      connectivity: "analyzers",
    }).focus).toBe("Integration-ready workflow planning");
  });

  it("recommends financial oversight for a revenue-led standalone scope", () => {
    expect(getFitRecommendation({
      facility: "hospital-centre",
      priority: "revenue-oversight",
      connectivity: "standalone",
    }).focus).toBe("Operational and financial oversight");
  });
});
