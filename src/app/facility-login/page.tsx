import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/ui/PageIntro";
import { portalDestination } from "@/lib/site";
import { getPublicFacilities } from "@/lib/public-catalog";
import { FacilityLoginSelector } from "@/components/marketplace/FacilityLoginSelector";

export const metadata: Metadata = { title: "Facility login", description: "Find the correct PLS facility access route for authorized laboratory staff.", alternates: { canonical: "/facility-login" }, robots: { index: false, follow: false, noarchive: true } };

export default async function FacilityLoginPage() {
  const destination = portalDestination("facility");
  const directory = await getPublicFacilities();
  const facilities = directory.status === "ok" ? directory.data.filter((facility) => facility.facilityLoginUrl) : [];
  const unavailable = directory.status === "unavailable";
  return <>
    <PageIntro eyebrow="CLIENT LOGIN" title="Choose your laboratory and sign in." description="Select your facility to continue to its approved PLS login page." action={false} />
    <section className="section portal-entry facility-login-section">
      <div className="wrap facility-login-layout">
        <div className="facility-login-main">
          <span className="eyebrow">FACILITY APPLICATION</span>
          <h2>Sign in to your facility workspace.</h2>
          <p>Continue through a verified sign-in destination for your laboratory. Your facility handles authentication, workspace selection and staff permissions.</p>
          {destination && <a className="facility-login-destination" href={destination} rel="noopener noreferrer">
            <span className="facility-login-destination-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 8-8M20 4v6h-6M20 4l-9 9" /></svg></span>
            <span><small>APPROVED PLS DESTINATION</small><b>Continue to facility sign in</b><em>Opens your secure facility application</em></span>
            <span className="facility-login-arrow" aria-hidden="true">↗</span>
          </a>}
          {facilities.length > 0 && <FacilityLoginSelector facilities={facilities} />}
          {!destination && !facilities.length && <div className="facility-login-unavailable" role="status">
            <span className="facility-login-alert-icon" aria-hidden="true">!</span>
            <div><b>{unavailable ? "Facility sign-in destinations are temporarily unavailable." : "No approved facility sign-in destination is listed."}</b>
              <p>{unavailable ? "We could not verify the facility directory right now. Please try again later or ask your PLS administrator for the approved sign-in link." : "Ask your PLS administrator for the approved sign-in address. Do not use an unverified link or share your password on this website."}</p>
              <Link href="/facilities">Browse facility listings <span aria-hidden="true">→</span></Link>
            </div>
          </div>}
          <p className="facility-login-note">For your protection, this public website does not collect facility usernames or passwords.</p>
        </div>
        <aside className="facility-login-security">
          <span className="facility-security-icon" aria-hidden="true"><svg viewBox="0 0 48 48"><path d="M24 5 39 11v11c0 10-6 17-15 21C15 39 9 32 9 22V11l15-6Z" /><path d="m17 24 5 5 10-11" /></svg></span>
          <span className="eyebrow">SECURE ACCESS</span>
          <h3>Keep your sign-in details private.</h3>
          <p>Only enter credentials on the facility’s verified sign-in page—not on this public website.</p>
          <ul>
            <li><span aria-hidden="true">01</span>Use a link provided by your facility administrator.</li>
            <li><span aria-hidden="true">02</span>Check that the destination belongs to your facility.</li>
            <li><span aria-hidden="true">03</span>Contact your administrator if you are unsure.</li>
          </ul>
          <Link href="/facilities" className="text-link">Browse approved facility listings <span aria-hidden="true">→</span></Link>
        </aside>
      </div>
    </section>
  </>;
}
