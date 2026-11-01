# Prime Laboratory Software — Corporate Website

Independent Next.js website for the PLS public brand, customer discovery, lead enquiries, and separate facility/patient portal entry points. The canonical URL is configurable and defaults to `https://primelabsys.com`. It does not import or proxy code from `lobnos` or `lobnos-server`.

## Requirements and commands

- Node.js 24.18.1 (minimum 20.9)
- PNPM 11.20.0
- `pnpm install --frozen-lockfile`
- `pnpm dev` — local development at `http://localhost:2380`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm start` — production server at port 2380

Copy `.env.example` to `.env.local` for local configuration. Keep all values private and server-side. No credentials or customer/patient data belong in this repository.

### Connecting the sibling Lobnos Server locally

Start the existing `lobnos server` VS Code task in `../lobnos-server` (the current
backend configuration listens on port 2300). The local website `.env.local` uses:

```dotenv
CORE_PLATFORM_API_URL=http://127.0.0.1:2300
CORE_PLATFORM_ALLOWED_ORIGIN=http://127.0.0.1:2300
CORE_PLATFORM_ALLOW_LOOPBACK_HTTP=true
PLS_PORTAL_ALLOWED_HOSTS=localhost,127.0.0.1
PLS_PORTAL_ALLOW_LOOPBACK_HTTP=true
```

Restart the website after environment changes. For a production build, run
`pnpm build` then `pnpm start`. The loopback opt-in permits server-to-server HTTP
on the same machine only; it never enables remote plain-HTTP upstreams or removes
Secure staff cookies. Separate-machine deployments must use the approved HTTPS
core origin and leave this opt-in false.

Verify `/api/v1/marketplace/facilities` on Lobnos Server and
`/api/marketplace/facilities` on the website: both should return a success envelope.
An empty approved registry is a valid empty directory, not an unavailable service.
The backend initializes marketplace tables during normal startup; facilities
still require explicit platform approval before publication.

## Content and product accuracy

Marketing highlights and solution descriptions live in `src/data/content.ts`. The complete, source-backed inventory lives in `src/data/software-capabilities.ts`: 100 customer-facing capabilities across 18 workflow areas, including laboratory operations, patient/doctor access, pharmacy, departmental stock, accounting, payroll, communications and platform administration. Every capability lists actions, scope, a representative application route and internal source references. Public facility profiles still come only from explicitly published records; screenshots of the demo application are not public facility listings.

The brand uses a text wordmark, the official primary green `#2e7d32`, and self-hosted Google Lato typography. The primary green provides sufficient contrast (>= 4.5:1) with white text (`#ffffff`) for buttons and accessible accents. Contrast checks are covered by `src/lib/brand.test.ts`.

The homepage, features and solution pages use actual software captures. `/product-tour` contains 42 demo page captures, including 18 analytics/reporting views. All captures are 1440px wide; most are 1000px tall, with extended views for monthly sales, commissions, payroll and the complete inventory dashboard. Each links to its original image. The customer explicitly confirmed the current facility is a demo and requested that its headers, navigation, displayed demo values and page content remain unchanged. No production records, credentials or provider secrets may be added.

The homepage's animated workflow is an illustrative preview with sample data, not a live workspace or product screenshot. The actual screenshot gallery supports a scrollable image viewport that resets when the selection changes; the tour's workspace index links directly to each captured page.

The About page and homepage share an interactive six-stage implementation journey. Visitors select a stage or use previous/next controls to explore the people involved and discussion points. Original SVG people are illustrations, not staff portraits; their brief entrance animations respect reduced-motion preferences. Stages never advance automatically, and implementation scope and timing remain subject to requirements assessment.

Screenshot metadata in `src/data/product-screens.ts` records the source route, dimensions, workflows and provenance. The captures preserve the rendered application's complete shell and CSS; executable scripts are not included in the static capture input. No replacement headers, fake records or redaction overlays are added to these demo captures. Review a stable, fully loaded page before capture; keep original images available at full size and never substitute an authorization failure or loading screen for a workflow. Instrument administration and result-validation screens that could not be captured reliably in this session were not invented or published.

Google Lato (Latin, weights 400 and 700) is bundled locally through Fontsource with `font-display: swap`; browsers do not contact Google for fonts. The global `--sans` and `--serif` tokens both use Lato for body copy, headings and interface text.

Shared typography uses rem-based tokens: 15px body copy, 14px controls, 13px labels/supporting text, and 18px card titles at the default browser font size. Page headings cap at 44px; the homepage hero caps at 52px. Compact spacing and a desktop workflow sidebar make the catalog easier to browse. Mobile form inputs remain 16px to avoid browser focus zoom. Real software screenshots are not restyled or modified by the website typography.

`/pricing` presents three quotation starting points, scope factors, onboarding steps and FAQs. These are not fixed packages or published license tiers: rates, currency, taxes, module availability, license limits, provider costs and commercial terms must be confirmed in a written quotation. Content lives in `src/data/pricing.ts`. Each scope CTA carries an allowlisted context into the existing demo enquiry form; arbitrary query-string context is ignored. Navigation, footer and sitemap include the pricing page.

`/analytics` makes the reporting depth explicit across 15 source-backed areas: test/result analysis, sales, outstanding balances, outsourcing profitability, expenses, patient demographics/data quality, clinician/referral performance, acquisition follow-ups, commissions, inventory/procurement, payroll, pharmacy, imaging, specimens and compliance. `src/data/analytics.ts` lists specific report views and metric groups with internal frontend source references. Homepage, features and the analytics solution page expose the same showcase; main navigation, footer and sitemap link to the dedicated page. The reporting gallery includes actual sales, test-volume, demographic, outsourcing, expense, payroll, commission, pharmacy, inventory, financial and communications captures—not fabricated charts. Capture a stable, loaded report: zero-data periods remain honest empty states. Never publish a loading, error or authentication screen as a product visual.

The product viewer displays the image first and keeps its page selector below the image. Controls and the collapsible screenshot index are not sticky overlays. Choosing a page brings its image back into view. Above-fold viewers load eagerly; screenshot transitions do not fade or scale the image. Images fit the viewport width on mobile rather than hiding the report behind a horizontally clipped sidebar. Long screenshots scroll inside a keyboard-focusable image viewport without cropping or altering the PNG; full-size originals remain available. The reporting inventory is broader than the captured screenshot set.

The homepage overview derives its area, capability and action counts from the complete catalog. `/features#software-capabilities` renders every entry, supports multi-word search and explains each workflow in an expandable detail section. Matching entries link to real screenshots. The original 16 capability highlights remain available at their existing anchors for compatibility with solution links.

Highlights, solution descriptions and demo interests share `src/data/content.ts`; the full catalog and image registry have their own typed data files. Internal evidence is stripped before catalog data reaches the client explorer. Solution pages include relevant real screenshots, while the navigation, footer and sitemap expose the product tour. Tests cover catalog completeness, search, source-backed routes, image dimensions, full-size image links, retained solution anchors and demo submission limits.

[The capability evidence map](docs/product-capability-evidence.md) connects the expanded descriptions to software source paths and records important limits: tenant catalog policy, package/night-pricing behavior, interface-only staff PIN confirmation, tenant audit setup and device-specific analyzer acceptance.

## Facility portal destination discovery

Separate portal entry pages use the legacy approved-public-facility destination feed only to display validated login URLs:

- `GET /api/v1/public/facilities`

The Client login page provides a facility selector and redirects to the selected
approved `facilityLoginUrl`. The website does not infer tenant hostnames, construct
login paths, or accept destinations outside `PLS_PORTAL_ALLOWED_HOSTS`. A missing
or rejected destination is not made clickable. Same-machine HTTP additionally
requires `PLS_PORTAL_ALLOW_LOOPBACK_HTTP=true` and backend
`PUBLIC_FACILITY_ALLOW_LOOPBACK_HTTP=true`; remote HTTP remains prohibited.

Platform super-admins manage approved profiles from the main software's
**Manage facility > Website directory, catalog and client login** section.
Publication updates are read without shared caching. Existing provisioned
facilities appear alongside approved independent laboratories, and their tests
and explicitly classified panels use live PLS tariff prices. Catalog-only PLS
facilities do not offer online booking until a reviewed marketplace integration
enables that workflow.

Set server-only `CORE_PLATFORM_API_URL` and `CORE_PLATFORM_ALLOWED_ORIGIN` to the same exact origin. Remote upstreams require HTTPS; local production-build HTTP requires the explicit loopback opt-in described above. The portal-directory server fetch has no browser-supplied tenant ID or credential; facility portal links require HTTPS and the hostname allowlist. No facility/customer records are bundled into the website.

If the portal directory is unconfigured or unavailable, the site presents an explicit unavailable state rather than inventing destinations. Facility authentication remains in its separate approved application.

## Shared laboratory marketplace

The marketplace uses the approved core origin above and the separate `/api/v1/marketplace` contract documented in `lobnos-server/docs/marketplace-api.md`. The website does not bundle test facilities, credentials, customer data or patient records. Public facility discovery returns only platform-approved listings; a new independent registration receives `pending_approval` and does not create a public listing or usable login. PLS-connected catalogs are explicitly identified and sourced from the currently published core catalog; independent facilities manage their marketplace profile and catalog separately.

- `/facilities` and `/facilities/[slug]` read only the marketplace's live approved facility/catalog endpoints. Empty or unavailable responses remain empty/unavailable rather than falling back to sample records. Catalog prices are live facility prices, not quotes or guarantees.
- Public facility listings use a searchable table with laboratory name and description, location, facility type, catalog currency and a tests/prices link. On narrow screens the table scrolls horizontally without reducing text size; search counts and empty states remain available.
- `/join-facility` submits an independent-facility application with an administrator password in the HTTPS request body. The server hashes credentials. The interface reports pending review only after the core returns its HTTP 202 success response.
- Booking requests include selected item IDs and contact/collection details only in a POST body. The core re-resolves current prices and computes totals; no browser-supplied total is trusted. A request is not an accepted appointment, a PLS order, a paid transaction or completed service.
- The opaque tracking credential is the 256-bit idempotency key. It is held in page memory only as needed for a response or exact retry, and is never put in a URL, browser storage, analytics or logs. Tracking and payment claims are POST-body-only, and marketplace responses are no-store/private.
- A submitted payment reference is only a claim. Authorized facility staff must verify the exact server-priced amount before scheduling or fulfillment. The website does not process external payments; recording a refund documents a staff-confirmed external transfer and does not transfer funds.
- Independent facility staff authenticate with their own facility-scoped marketplace credentials and an `HttpOnly; Secure; SameSite=Strict` 12-hour cookie. The website's same-origin API proxy forwards that cookie only to allowlisted staff endpoints and rewrites only the cookie path to the website's `/api/marketplace/staff` route. It refuses insecure/malformed upstream cookies, cross-origin staff writes, unexpected paths/queries, tenant-ID inputs, redirects and oversized bodies. The cookie is not returned as JSON and is never stored in local storage.
- PLS-connected facility staff must use the authorized PLS facility application, not independent-marketplace credentials. Marketplace linking validates references to existing PLS records only; it does not automatically create or synchronize a PLS patient, billing, sample, order or payment. No automated downstream order or payment processing is claimed here.

The marketplace server proxy requires `CORE_PLATFORM_API_URL` and `CORE_PLATFORM_ALLOWED_ORIGIN` to match exactly; remote connections require HTTPS, while same-machine loopback HTTP can be explicitly enabled as described above. Do not expose either value to the browser or add bearer credentials to public requests. The backend's production cookie is Secure; do not disable Secure to make staff sessions work over plain HTTP. Use a trusted HTTPS development/review route if the local browser does not accept that cookie. Keep private booking lookups and staff pages out of analytics, shared caches and browser history links; `/booking-status` and the facility dashboard/login are noindex and excluded from the sitemap.

The current-site feature copy is limited to implementation-verified modules: general ledger and financial statements; AR/AP aging, inventory valuation and subledger reconciliation; journal approval/posting/reversal, accounting periods and daily close; imported bank-statement match/unmatch; payroll and commissions; pharmacy; physical specimen traceability; home-collection coordination; ultrasound waiting lists/templates/uploads; QC and compliance records; notification/email/SMS queues; tenant provisioning and module activation; and configured HL7 result receiver/mapping workflows. It does not claim budget planning, automatic external claims submission, universal analyzer compatibility, ASTM readiness, a DICOM/PACS archive, consumer home-collection booking, live GPS tracking, external payment processing, certifications, guaranteed outcomes or uptime.

## Portal boundaries

`/facility-login` and `/patient-portal` are separate discovery/entry pages. They never collect credentials, accept patient identifiers, or claim to authenticate users. Add a portal destination only after the production endpoint and hostname are approved. Set `PLS_FACILITY_PORTAL_URL` / `PLS_PATIENT_PORTAL_URL` and include exact hostnames in `PLS_PORTAL_ALLOWED_HOSTS`; destinations not using HTTPS or not on that allowlist are rejected. The authenticated applications remain responsible for identity, tenancy, patient privacy, authorization, and result delivery.

## Lead delivery

The request-demo and contact forms submit to `/api/lead`. Server-side schema validation, a honeypot, a bounded request body, and per-process rate limiting are applied. The route forwards accepted enquiries only to an HTTPS `LEAD_WEBHOOK_URL` with a server-only bearer token. Lobnos Server provides the first-party `POST /api/v1/marketplace/platform-enquiries` receiver; configure the same strong token as `LEAD_WEBHOOK_TOKEN` on this website and `WEBSITE_LEAD_WEBHOOK_TOKEN` on Lobnos Server. Accepted enquiries are stored in the control database `platform_enquiries` table with `new` status. Local development may explicitly set `LEAD_WEBHOOK_ALLOW_LOOPBACK_HTTP=true` for a loopback-only HTTP receiver; remote HTTP remains blocked. Until a real approved delivery integration is configured, submissions return an explicit unavailable error; the website does not claim that an enquiry was sent. The in-memory limiter is a baseline for a single process, not a substitute for a shared edge/WAF or distributed rate limit in a scaled deployment.

## Search and privacy

Metadata, canonical URLs, social cards, sitemap, robots rules, organization JSON-LD, and a noindex policy for portal entry points are implemented. No analytics or tracking scripts are included. Add a consent manager before any non-essential tracking. Privacy and terms pages are publication drafts and need legal review and business-specific details before they are represented as approved policies.

## Deployment

The project can run independently behind Nginx; sample PM2 and Nginx files are under `deploy/`. Build with `pnpm install --frozen-lockfile --prod=false && pnpm build`, then run `pnpm start` under PM2 on `127.0.0.1:2380`. Build-time dependencies must be installed even when `NODE_ENV=production`. Configure TLS and DNS separately. These templates do not alter DNS, Nginx sites, certificates, or production applications. Review the current VPS routing and prepare rollback before deployment.

`deploy.sh` preserves the production `.env`, but keeps `package.json` and `pnpm-lock.yaml` from the pulled commit. It refuses locally modified dependency manifests and pulls without autostashing; review and reconcile server-side manifest changes before deploying. Never restore old package manifests over a new checkout: doing so can omit required dependencies such as the self-hosted Lato fonts. Once the manifests match the deployed commit, run the frozen installation and build commands above.

## External decisions still required

- Approve legal entity details, contact information, privacy notice, and terms.
- Add only approved public contact details using `NEXT_PUBLIC_CONTACT_EMAIL` and/or `NEXT_PUBLIC_CONTACT_PHONE`.
- Configure the approved CRM/email webhook and delivery monitoring.
- Confirm facility and patient portal HTTPS URLs, hostname allowlist, routing, and login behavior.
- Approve verified facility names, public contact/profile fields, logos, and publication rights.
- Validate analyzer/device compatibility per model and protocol; no universal interoperability is claimed.
- Verify backup, recovery, security, regulatory, and deployment statements before publishing stronger assurances.
- Decide whether to add a CMS, consent tooling, or analytics after governance review.

## Internal feature evidence (engineering reference only)

Capability scope was cross-checked against the existing server routes and controllers. These paths are traceability references, not public website content and not proof of a particular customer's deployment:

- Accounting and bank reconciliation: `src/controllers/accounting/route.ts`, `BankReconciliationController.ts`
- Inventory, pharmacy and prescriptions: `src/controllers/inventory/routes/index.ts`, `src/controllers/pharmacy/routes.ts`, `src/controllers/prescriptions/routes.ts`
- Payroll and commissions: `src/controllers/payroll/routes.ts`, `src/controllers/commission/routes.ts`
- Specimens, operations and results: `src/controllers/samples/physicalSampleRoutes.ts`, `src/controllers/operations/homeCollection/routes.ts`, `src/controllers/operations/route.ts`, `src/controllers/result/route.ts`
- Billing and quality/compliance: `src/controllers/billing/index.ts`, `src/controllers/QualityControl/qualityControlRoutes.ts`, `src/controllers/compliance/routes.ts`
- Delivery and tenancy: `src/controllers/email/route.ts`, `src/controllers/sms/route.ts`, `src/controllers/notifications/route.ts`, `src/controllers/platform/facilities.ts`, `src/controllers/settings/devices/hl7SoftwareProcessing.ts`
