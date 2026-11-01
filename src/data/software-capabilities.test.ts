import { describe, expect, it } from "vitest";
import { softwareCapabilityCount, softwareCapabilityGroups } from "./software-capabilities";

describe("Prime Laboratory Software capability catalog", () => {
  const groups = softwareCapabilityGroups;
  const capabilities = groups.flatMap(group => group.capabilities);

  it("uses stable unique group and capability identifiers", () => {
    const groupIds = groups.map(group => group.id);
    const capabilityIds = capabilities.map(capability => capability.id);

    expect(groups.length).toBeGreaterThanOrEqual(12);
    expect(groups.length).toBeLessThanOrEqual(18);
    expect(new Set(groupIds).size).toBe(groupIds.length);
    expect(new Set(capabilityIds).size).toBe(capabilityIds.length);
    expect(capabilities.length).toBeGreaterThanOrEqual(60);
    expect(capabilities.length).toBeLessThanOrEqual(100);
    expect(groupIds.every(id => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id))).toBe(true);
    expect(capabilityIds.every(id => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id))).toBe(true);
    expect(softwareCapabilityCount).toBe(capabilities.length);
  });

  it("includes summaries, explicit workflow lists, scope notes and repository evidence", () => {
    for (const group of groups) {
      expect(group.title.trim().length).toBeGreaterThan(0);
      expect(group.description.trim().length).toBeGreaterThan(20);
      expect(group.capabilities.length).toBeGreaterThan(0);
    }

    for (const capability of capabilities) {
      expect(capability.title.trim().length).toBeGreaterThan(0);
      expect(capability.summary.trim().length).toBeGreaterThan(40);
      expect(capability.workflows.length).toBeGreaterThanOrEqual(2);
      expect(capability.workflows.every(workflow => workflow.trim().length > 15)).toBe(true);
      expect(capability.scope.trim().length).toBeGreaterThan(20);
      expect(capability.evidence.length).toBeGreaterThan(0);
      expect(capability.evidence.every(source =>
        /^(?:lobnos|lobnos-server|primelaboratorysystems)\/.+:\d+(?:-\d+)?$/.test(source),
      )).toBe(true);
    }
  });

  it("uses actual app-relative routes or an empty route for service-only capabilities", () => {
    for (const capability of capabilities) {
      expect(capability.route === "" || /^\/(?:[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*)?$/.test(capability.route)).toBe(true);
    }
  });

  it("covers the core and newest operational modules", () => {
    const ids = new Set(capabilities.map(capability => capability.id));
    for (const id of [
      "patient-registration",
      "patient-portal",
      "appointment-scheduling",
      "test-catalog-setup",
      "specimen-storage-retention",
      "home-collection-order-management",
      "structured-result-entry",
      "ultrasound-worklist",
      "billing-strategies",
      "general-ledger-journals",
      "department-stock-custody",
      "pharmacy-point-of-sale",
      "payroll-period-processing",
      "commission-batches",
      "qc-result-entry-gate",
      "database-backup-management",
      "email-templates-queue",
      "analyzer-result-adapters",
      "patient-bill-payment-gateways",
      "public-laboratory-booking",
      "marketplace-payment-claim-review",
    ]) {
      expect(ids.has(id), `missing capability ${id}`).toBe(true);
    }
  });

  it("keeps laboratory inventory and pharmacy as separate customer-facing areas", () => {
    const inventoryGroup = groups.find(group => group.id === "laboratory-inventory-department-stock");
    const pharmacyGroup = groups.find(group => group.id === "pharmacy");

    expect(inventoryGroup).toBeDefined();
    expect(pharmacyGroup).toBeDefined();
    expect(inventoryGroup).not.toBe(pharmacyGroup);
    expect(inventoryGroup?.capabilities.some(capability => capability.id === "department-stock-custody")).toBe(true);
    expect(pharmacyGroup?.capabilities.some(capability => capability.id === "pharmacy-point-of-sale")).toBe(true);
  });

  it("documents provider gateways separately from marketplace booking claims", () => {
    const gateways = capabilities.find(capability => capability.id === "patient-bill-payment-gateways");
    const marketplaceClaims = capabilities.find(capability => capability.id === "marketplace-payment-claim-review");

    expect(gateways?.summary).toContain("Paystack");
    expect(gateways?.summary).toContain("Hubtel");
    expect(gateways?.summary).toContain("PaySwitch");
    expect(gateways?.scope).toContain("marketplace booking payment claims remain a separate");
    expect(marketplaceClaims?.scope).toContain("not processed through the patient-bill provider gateway");
  });
});
