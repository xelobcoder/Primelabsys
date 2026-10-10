import Link from "next/link";

export function PageIntro({ eyebrow, title, description, action = true }: { eyebrow: string; title: string; description: string; action?: boolean }) {
  return (
    <section className="page-intro">
      <div className="wrap page-intro-inner">
        <div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p>
          {action && <Link className="button" href="/request-demo">Talk through your workflow <span aria-hidden="true">↗</span></Link>}
        </div>
        <div className="intro-orbit" aria-hidden="true"><span className="orbit-ring orbit-ring-one" /><span className="orbit-ring orbit-ring-two" /><span className="orbit-core"><b>PLS</b><small>LAB SOFTWARE</small></span><span className="orbit-dot dot-one" /><span className="orbit-dot dot-two" /><span className="orbit-dot dot-three" /></div>
      </div>
    </section>
  );
}
