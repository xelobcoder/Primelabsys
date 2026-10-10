import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { absoluteUrl, companyName, siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Prime Laboratory Software | Connected laboratory operations", template: "%s | Prime Laboratory Software" },
  description: "Explore connected laboratory management workflows for registration, specimens, results, billing, inventory and operational reporting.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: companyName,
    title: "Prime Laboratory Software | Connected laboratory operations",
    description: "One intelligent platform for clearer laboratory operations.",
    url: absoluteUrl("/"),
  },
  twitter: { card: "summary_large_image", title: "Prime Laboratory Software", description: "Connected laboratory operations, thoughtfully brought together." },
  ...(process.env.GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } } : {}),
};

export const viewport: Viewport = { themeColor: "#27ae60", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const nonce = (await headers()).get("x-nonce") || undefined;
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: companyName,
    url: siteUrl,
    description: "Laboratory management software and connected operational workflows.",
  };
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
        <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
