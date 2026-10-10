import type { Metadata } from "next";
import { headers } from "next/headers";
import { FeatureGrid } from "@/components/ui/FeatureGrid";
import { PageIntro } from "@/components/ui/PageIntro";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { solutions } from "@/data/content";

export const metadata: Metadata = { title: "Laboratory management solutions", description: "Explore PLS solutions for laboratory workflow, billing, inventory, reporting, integrations and multi-facility operations.", alternates: { canonical: "/solutions" } };

export default async function SolutionsPage() {
  const nonce = (await headers()).get("x-nonce") || undefined;
  const structuredData = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "PLS Laboratory Management Platform", applicationCategory: "BusinessApplication", operatingSystem: "Web browser", description: "Laboratory management workflows for registration, specimens, results, billing, inventory and operational reporting." };
  return <>
    <PageIntro eyebrow="PLS SOLUTIONS" title="Bring essential laboratory workflows together." description="Explore a connected foundation for patient registration, specimen processing, result reporting, billing, inventory and management visibility." />
    <section className="section"><div className="wrap"><div className="solution-overview"><div><SectionHeading eyebrow="A CONNECTED OPERATING MODEL" title="From the first request to the management view." copy="PLS supports connected workflows across operational, financial and business functions. Explore the areas relevant to your facility." /></div><div className="overview-art" aria-hidden="true"><span>REGISTER</span><b>→</b><span>PROCESS</span><b>→</b><span>REVIEW</span><b>→</b><span>REPORT</span></div></div><FeatureGrid items={solutions} /><p className="section-footnote">Availability depends on facility configuration, deployment and agreed scope. No universal equipment compatibility or regulatory certification is implied.</p></div></section>
    <script type="application/ld+json" nonce={nonce} dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
  </>;
}
