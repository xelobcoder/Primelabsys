"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { solutions } from "@/data/content";
import { announcement } from "@/data/content";

const navigation = [
  { label: "Solutions", href: "/solutions", hasMenu: true },
  { label: "Features", href: "/features" },
  { label: "Industries", href: "/industries" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Facilities", href: "/facilities" },
  { label: "Resources", href: "/resources" },
  { label: "About", href: "/about" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      {announcement && <div className="announcement"><Link href={announcement.href}>{announcement.label}<span aria-hidden="true"> ↗</span></Link></div>}
      <header className="site-header">
        <div className="header-inner wrap">
          <Link className="wordmark" href="/" aria-label="Prime Laboratory Software home">
            <span className="wordmark-mark" aria-hidden="true"><i /><i /><i /></span>
            <span className="wordmark-type"><strong>prime</strong><small>LABORATORY SOFTWARE</small></span>
          </Link>
          <button ref={toggleRef} className="menu-toggle" type="button" aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}>
            <span className="sr-only">{open ? "Close navigation" : "Open navigation"}</span>
            <span /><span />
          </button>
          <nav id="primary-navigation" className={`primary-nav ${open ? "is-open" : ""}`} aria-label="Main navigation" onKeyDown={(event) => {
            if (event.key === "Escape" && open) {
              setOpen(false);
              toggleRef.current?.focus();
            }
          }}>
            {navigation.map((item) => (
              <div key={item.label} className={`nav-item ${item.hasMenu ? "nav-has-menu" : ""}`}>
                <Link href={item.href} onClick={() => setOpen(false)}>{item.label}{item.hasMenu && <span className="nav-caret" aria-hidden="true">⌄</span>}</Link>
                {item.hasMenu && <div className="mega-menu">
                  <div className="mega-intro"><span className="eyebrow">CONNECTED OPERATIONS</span><strong>One platform, clearer workflows.</strong><Link href="/solutions">Explore all solutions <span aria-hidden="true">→</span></Link></div>
                  <div className="mega-links">{solutions.slice(0, 6).map((solution) => <Link key={solution.slug} href={`/solutions/${solution.slug}`} onClick={() => setOpen(false)}><span>{solution.shortTitle}</span><small>{solution.eyebrow}</small></Link>)}</div>
                </div>}
              </div>
            ))}
            <div className="nav-mobile-portals"><Link href="/facility-login">Facility login</Link><Link href="/patient-portal">Patient results</Link></div>
            <Link className="nav-demo" href="/request-demo" onClick={() => setOpen(false)}>Request a demo <span aria-hidden="true">↗</span></Link>
          </nav>
          <div className="header-portals">
            <Link href="/facility-login">Client login</Link>
            <Link className="button button-small" href="/request-demo">Request a demo <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </header>
    </>
  );
}
