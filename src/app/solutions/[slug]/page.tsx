import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/ui/PageIntro";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { solutions } from "@/data/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return solutions.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const solution = solutions.find((item) => item.slug === slug);
  if (!solution) return {};
  return { title: solution.shortTitle, description: solution.summary, alternates: { canonical: `/solutions/${slug}` }, openGraph: { title: solution.shortTitle, description: solution.summary, type: "website" } };
}

export default async function SolutionDetailPage({ params }: Props) {
  const { slug } = await params;
  const solution = solutions.find((item) => item.slug === slug);
  if (!solution) notFound();
  const otherSolutions = solutions.filter((item) => item.slug !== slug).slice(0, 3);
  return <>
    <PageIntro eyebrow={solution.eyebrow} title={solution.title} description={solution.intro} />
    <section className="section"><div className="wrap detail-layout"><div className="detail-main"><SectionHeading eyebrow="WORKFLOWS TO EXPLORE" title="See where this fits in your day-to-day." copy={solution.summary} /><ul className="check-list">{solution.workflows.map((workflow) => <li key={workflow}><span>✓</span>{workflow}</li>)}</ul>{solution.caveat && <p className="disclaimer-box"><b>Scope note</b>{solution.caveat}</p>}</div><aside className="detail-aside"><span className="eyebrow">OPERATIONAL VALUE</span><h2>Make everyday activity easier to follow.</h2><ul>{solution.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul><Link className="button button-dark" href="/request-demo">Discuss your requirements <span aria-hidden="true">↗</span></Link></aside></div></section>
    <section className="section related-section"><div className="wrap"><div className="section-topline"><SectionHeading eyebrow="RELATED CAPABILITIES" title="More of the platform." /><Link className="text-link" href="/solutions">All solutions →</Link></div><div className="related-grid">{otherSolutions.map((item) => <Link key={item.slug} href={`/solutions/${item.slug}`}><span>{item.eyebrow}</span><b>{item.shortTitle}</b><span aria-hidden="true">↗</span></Link>)}</div></div></section>
  </>;
}
