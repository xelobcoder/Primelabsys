import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import FeaturesPage from "@/app/features/page";
import SolutionDetailPage, { generateStaticParams } from "@/app/solutions/[slug]/page";
import { leadSchema } from "@/lib/lead";
import { demoInterests, faqs, featureGroups, features, solutions } from "./content";

describe("software-aligned website content", () => {
  it("groups every capability exactly once without stale counts or missing IDs", () => {
    const numbers = features.map(feature => feature.number);
    const grouped = featureGroups.flatMap(group => group.numbers);
    expect(new Set(numbers).size).toBe(numbers.length);
    expect(new Set(grouped).size).toBe(grouped.length);
    expect([...grouped].sort()).toEqual([...numbers].sort());
    for (const feature of features) {
      expect(feature.workflows.length).toBeGreaterThanOrEqual(3);
      expect(feature.benefit.length).toBeGreaterThan(40);
    }
  });

  it("renders specific workflows, benefits and scope notes rather than feature labels alone", () => {
    const html = renderToStaticMarkup(createElement(FeaturesPage));
    expect(html.match(/class="capability-detail-card"/g)).toHaveLength(features.length);
    for (const feature of features) {
      expect(html).toContain(`id="capability-${feature.number}"`);
      expect(html).toContain(`href="#capability-${feature.number}"`);
      expect(html).toContain(renderToStaticMarkup(createElement("h3", null, feature.title)));
      for (const workflow of feature.workflows) {
        expect(html).toContain(renderToStaticMarkup(createElement("li", null, workflow)));
      }
      expect(html).toContain(feature.benefit.replaceAll("&", "&amp;").replaceAll("'", "&#x27;"));
    }
    expect(html.match(/Why it matters/g)).toHaveLength(features.length);
  });

  it("explains the previously missing pricing, relationship, template, interface and audit capabilities", () => {
    const capability = (number: string) => {
      const feature = features.find(item => item.number === number);
      expect(feature).toBeDefined();
      return JSON.stringify(feature).toLowerCase();
    };
    for (const term of ["clinician", "organization", "package", "time-based", "night"]) expect(capability("04")).toContain(term);
    expect(capability("13")).toContain("register");
    expect(capability("14")).toContain("organization");
    expect(capability("07")).toContain("commission");
    expect(capability("07")).toContain("payment history");
    expect(capability("15")).toContain("create");
    expect(capability("15")).toContain("report");
    for (const term of ["dropdown", "reference", "calculated", "fonts", "colors", "column headings"]) expect(capability("15")).toContain(term);
    expect(capability("03")).toContain("staff pin confirmation");
    expect(capability("03")).toContain("not a printed patient");
    expect(capability("08")).toContain("hl7");
    expect(capability("08")).toContain("map");
    expect(capability("16")).toContain("workflow-specific");
    expect(capability("16")).toContain("viewing/printing");
    expect(capability("16")).toContain("audit setup");
  });

  it("keeps solution discovery and links connected to detailed capabilities", async () => {
    expect(new Set(solutions.map(solution => solution.slug)).size).toBe(solutions.length);
    expect(generateStaticParams()).toHaveLength(solutions.length);
    for (const solution of solutions) {
      for (const number of solution.featureNumbers ?? []) {
        expect(features.some(feature => feature.number === number)).toBe(true);
      }
      const page = await SolutionDetailPage({ params: Promise.resolve({ slug: solution.slug }) });
      const html = renderToStaticMarkup(page);
      for (const number of solution.featureNumbers ?? []) expect(html).toContain(`href="/features#capability-${number}"`);
    }
    for (const slug of ["test-creation-report-templates", "clinician-organization-management", "audit-history-access-controls"]) {
      expect(solutions.some(solution => solution.slug === slug)).toBe(true);
    }
  });

  it("does not contradict the accounting or integration capabilities in the FAQs", () => {
    const accounting = faqs.find(faq => faq.q.toLowerCase().includes("general ledger"));
    expect(accounting?.a).toContain("Yes.");
    expect(accounting?.a).toContain("not direct bank connectivity");
    const integration = solutions.find(solution => solution.slug === "analyzer-integration");
    expect(integration?.workflows.join(" ")).toContain("HL7-style");
    for (const name of ["MindRay", "AgileS20", "BioeLab"]) expect(integration?.intro).toContain(name);
    expect(integration?.caveat).toContain("No universal compatibility");
    expect(features.find(feature => feature.number === "16")?.caveat).toContain("not a claim that every action");
  });

  it("offers the actual product workflows in demo requests within the submission limit", () => {
    expect(new Set(demoInterests).size).toBe(demoInterests.length);
    expect(demoInterests.length).toBeLessThanOrEqual(12);
    for (const interest of ["Test & report templates", "Clinicians & organizations", "Time-based pricing", "Commissions", "Analyzer integration", "Audit & access controls"]) {
      expect(demoInterests).toContain(interest);
    }
    expect(leadSchema.safeParse({
      formType: "demo", fullName: "Example User", workEmail: "user@example.test",
      organization: "Example Laboratory", interests: demoInterests,
      message: "Please demonstrate these software workflows.",
    }).success).toBe(true);
  });
});
