import type { Industry, Solution } from "@/types/content";

export const announcement: { label: string; href: string } | null = null;

export const solutions: Solution[] = [
  {
    slug: "laboratory-management-system",
    title: "Laboratory management, connected from registration to report",
    shortTitle: "Laboratory management",
    eyebrow: "CORE PLATFORM",
    summary: "Coordinate registration, orders, specimens, results and authorized reports in one laboratory workflow.",
    intro: "PLS brings core laboratory operations into a connected workflow, giving teams a clearer view of work from patient registration through result authorization and reporting.",
    workflows: ["Patient registration, visits and test ordering", "Physical specimen barcode lookup, collection, receipt, review and recollection with audit context", "Structured result entry, critical alerts, validation and authorization", "Payment-gated report printing and configured delivery preferences"],
    outcomes: ["A shared operational view across day-to-day work", "Clearer hand-offs between reception and laboratory teams", "More consistent access to authorized results and reports"],
    caveat: "Workflow availability, permissions and report formats depend on facility configuration. Patient access remains within the facility's approved portal.",
  },
  {
    slug: "laboratory-billing",
    title: "Laboratory billing and collections with operational context",
    shortTitle: "Billing & collections",
    eyebrow: "FINANCIAL OPERATIONS",
    summary: "Support cash and organization billing, payment tracking, approved adjustments and receivables visibility.",
    intro: "Connect billing activity to laboratory operations with tools for charges, collections and outstanding balances. The exact workflow can be configured to facility policies.",
    workflows: ["General, organization and configured insurance/NHIS tariff workflows, including member and claim-check codes", "Clinician, referral, package and promotional pricing", "Payment collection, suspended quotes progressing to sales, cash-out and transaction audit", "Refund approvals and review of billing activity"],
    outcomes: ["More useful visibility into balances and collections", "A clearer link between orders and financial activity", "Operational context for billing follow-up"],
    caveat: "NHIS claim-check workflows do not constitute end-to-end submission to an external NHIS claims service. Payment processing integrations require separate verification.",
  },
  {
    slug: "inventory-management",
    title: "Inventory oversight for laboratory supplies",
    shortTitle: "Inventory management",
    eyebrow: "SUPPLY OPERATIONS",
    summary: "Track laboratory items, suppliers, stock movements and selected expiry or replenishment indicators.",
    intro: "PLS inventory workflows help teams organize stock records and movement visibility for laboratory supplies and pharmacy operations where configured.",
    workflows: ["Supplier, storage location and unit records", "Purchase orders, stock receipts, issues, balances and consumption", "Expiry monitoring and stock alerts where configured", "Supplier payments, journals and inventory analytics"],
    outcomes: ["A more consistent record of stock movement", "Earlier visibility into items needing attention", "Better context for purchasing and operational review"],
    caveat: "Physical counts, supplier terms, purchasing integrations and replenishment rules depend on local setup and process.",
  },
  {
    slug: "laboratory-analytics",
    title: "Operational reporting for better-informed decisions",
    shortTitle: "Analytics & reporting",
    eyebrow: "MANAGEMENT VISIBILITY",
    summary: "Review operational workload, billing activity, outstanding balances, inventory and other configured indicators.",
    intro: "Management reporting brings selected operational records into practical summaries. Teams can use these views to understand activity and identify where follow-up may be needed.",
    workflows: ["Operational and workload summaries", "Revenue, billing and outstanding balance analysis", "Inventory activity and consumption views", "Audit and user activity reporting where available"],
    outcomes: ["Less fragmented operational review", "More context for day-to-day management", "A foundation for consistent reporting practices"],
    caveat: "Metric definitions, date ranges and access permissions should be agreed during implementation; reported figures depend on complete source data.",
  },
  {
    slug: "analyzer-integration",
    title: "A considered approach to analyzer connectivity",
    shortTitle: "Analyzer integration",
    eyebrow: "INTEROPERABILITY",
    summary: "Assess compatible analyzer connections based on equipment, protocol availability and facility requirements.",
    intro: "Analyzer connectivity can reduce manual transcription in suitable environments. PLS integration discussions begin with the specific instrument, communication method and workflow.",
    workflows: ["Equipment and protocol discovery", "Interface and mapping assessment", "Workflow, validation and acceptance planning", "Operational support arrangements"],
    outcomes: ["A clear view of technical prerequisites", "Integration scope based on the actual device", "A controlled path from connection to operational use"],
    caveat: "Compatibility is not universal. HL7, ASTM and device-specific protocols are considered only when supported by the particular equipment and integration configuration.",
  },
  {
    slug: "financial-management",
    title: "Financial oversight built around laboratory activity",
    shortTitle: "Financial management",
    eyebrow: "FINANCE",
    summary: "Bring expense workflows, revenue summaries, receivables and selected approvals into operational review.",
    intro: "PLS supports selected financial workflows, linking day-to-day laboratory transactions to review and reporting. Scope should be confirmed against each organization's accounting requirements.",
    workflows: ["Expense capture and approvals", "Revenue and receivables summaries", "Commission-related calculations and reporting", "Transaction records and audit context"],
    outcomes: ["A more complete accounting view across subledgers and financial statements", "Clearer workflows for journal review, period controls and close", "More context for cash, receivables, payables and inventory valuation"],
    caveat: "Budget planning and budget-versus-actual workflows are not evidenced. Bank statement import and matching support is not an external bank integration or automatic reconciliation service.",
  },
  {
    slug: "multi-facility-management",
    title: "A scalable foundation for multi-site operations",
    shortTitle: "Multi-facility operations",
    eyebrow: "GROWTH",
    summary: "Support tenant-aware operations and shared oversight where the customer's configuration enables it.",
    intro: "PLS is designed with tenant-aware deployment patterns and can support multi-facility operating models when provisioned for that use. Access boundaries and reporting scope are set by the deployment.",
    workflows: ["Tenant onboarding and configuration", "Module activation by customer requirements", "Facility-level operational access", "Consolidated oversight where enabled"],
    outcomes: ["A more deliberate path to growing operations", "A consistent implementation conversation across sites", "Clearer separation of facility responsibilities"],
    caveat: "Multi-facility features are not enabled uniformly; availability depends on architecture, subscription and configuration.",
  },
  {
    slug: "home-collection",
    title: "Coordinate home collection operations",
    shortTitle: "Home collection",
    eyebrow: "FIELD OPERATIONS",
    summary: "Organize service areas, staff assignments, billed orders and status checklists for home collection workflows.",
    intro: "Home collection workflows can help facilities coordinate orders that begin with billing and progress through assignment and collection status. Scope depends on each facility's operating setup.",
    workflows: ["Define home collection service areas", "Manage staff and orders originating from billing", "Assign work and update collection status", "Use configured operational checklists"],
    outcomes: ["A clearer view of assigned work", "More structured hand-offs from billing to field operations", "Status visibility for coordination"],
    caveat: "These workflows do not imply consumer self-booking or live GPS tracking.",
  },
  {
    slug: "ultrasound-imaging-workflows",
    title: "Support ultrasound imaging workflows",
    shortTitle: "Ultrasound imaging",
    eyebrow: "IMAGING OPERATIONS",
    summary: "Manage ultrasound waiting lists, report templates and image uploads within configured workflows.",
    intro: "PLS supports selected ultrasound operations, including waiting lists, templates and uploads. Facility-specific workflows and storage requirements should be assessed before use.",
    workflows: ["Maintain ultrasound waiting lists", "Use configured report templates", "Upload images linked to the relevant workflow", "Coordinate imaging activity with laboratory operations where configured"],
    outcomes: ["A more organized view of pending ultrasound work", "Consistent report structure for configured processes", "Images available within the designed workflow"],
    caveat: "This is not a claim of general DICOM support, PACS archiving, diagnostic image interpretation or radiology-wide interoperability.",
  },
];

export const features = [
  { number: "01", title: "Patient registration", copy: "Capture demographics, visits and orders as the start of an organized laboratory workflow.", tag: "FRONT OFFICE", icon: "↗" },
  { number: "02", title: "Specimen workflow", copy: "Track barcode lookup, collection, receipt, review, recollection and specimen audit history.", tag: "OPERATIONS", icon: "◌" },
  { number: "03", title: "Results & reports", copy: "Structure results, critical alerts, authorization, payment-gated printing and delivery preferences.", tag: "CLINICAL WORKFLOW", icon: "▤" },
  { number: "04", title: "Billing & revenue", copy: "Connect billing, payment collection, refunds, NHIS claim-check workflows and receivables review.", tag: "FINANCE", icon: "₵" },
  { number: "05", title: "Inventory", copy: "Maintain item and supplier records with stock movement and selected alerts.", tag: "SUPPLY", icon: "▦" },
  { number: "06", title: "Accounting oversight", copy: "Manage ledgers, journals, statements, periods, close and bank statement matching workflows.", tag: "FINANCE", icon: "⌁" },
  { number: "07", title: "Payroll & commissions", copy: "Coordinate compensation, attendance, leave, deductions, payroll periods and commission batches.", tag: "PEOPLE", icon: "◎" },
  { number: "08", title: "Integrations", copy: "Assess analyzer and healthcare connections against each device and interface.", tag: "INTEROPERABILITY", icon: "⤳" },
  { number: "09", title: "Management reporting", copy: "Review workload, revenue, inventory and outstanding balances from configured data.", tag: "INSIGHT", icon: "⌗" },
  { number: "10", title: "Quality & governance", copy: "Support quality control, device calibration, incidents, analytics and audit records.", tag: "QUALITY", icon: "✓" },
  { number: "11", title: "Home collection", copy: "Coordinate service areas, staff, billed orders, assignment and collection status.", tag: "FIELD OPERATIONS", icon: "⌖" },
  { number: "12", title: "Ultrasound workflow", copy: "Organize configured ultrasound waiting lists, report templates and image uploads.", tag: "IMAGING", icon: "◉" },
  { number: "13", title: "Clinician & referral workflows", copy: "Coordinate clinician consultations, orders, result workflows and commission records within configured access boundaries.", tag: "CLINICAL NETWORK", icon: "⌂" },
];

export const industries: Industry[] = [
  {
    slug: "diagnostic-laboratories",
    title: "Independent diagnostic laboratories",
    summary: "Organize the daily rhythm of a diagnostic laboratory, from registration through reporting and collections.",
    intro: "Independent laboratories balance patient-facing service, specimen processing, result reporting and business operations. PLS brings key workflows into one operational platform.",
    workflows: ["Registration and test ordering", "Specimen hand-offs and result workflow", "Billing, collections and outstanding balances", "Inventory and management reporting"],
    considerations: "Fit depends on service mix, facility process, local policies, deployment requirements and implementation scope.",
  },
  {
    slug: "hospital-laboratories",
    title: "Hospital laboratories",
    summary: "Coordinate laboratory work with configured billing, roles and reporting processes.",
    intro: "Hospital laboratories have distinct operational requirements and system boundaries. PLS discussions start with how the laboratory receives work, manages results and communicates with connected systems.",
    workflows: ["Specimen reception and processing", "Result entry and authorization", "Configured billing and inventory workflows", "Assessment of analyzer or hospital-system interfaces"],
    considerations: "Hospital-system integration, clinical governance, availability and regulatory fit must be assessed for the specific organization.",
  },
  {
    slug: "diagnostic-centres",
    title: "Diagnostic centres",
    summary: "Connect front-desk, laboratory and business workflows in diagnostic-centre operations.",
    intro: "Diagnostic centres can bring patient registration, service ordering, result workflows and financial oversight together while retaining their chosen operating procedures.",
    workflows: ["Patient visits and service ordering", "Laboratory assignment and results", "Cash and organization billing", "Inventory and management views"],
    considerations: "Specialty workflows and patient access are configuration-dependent and must be confirmed before commitment.",
  },
  {
    slug: "laboratory-groups",
    title: "Medical laboratory groups",
    summary: "Plan for consistent workflows and oversight across facilities where the deployment supports it.",
    intro: "Growing laboratory groups need a shared view without losing local accountability. PLS can be assessed for tenant-aware operating models and configured group oversight.",
    workflows: ["Tenant and facility onboarding", "Role-aware facility operations", "Shared operational definitions", "Consolidated views where enabled"],
    considerations: "Multi-site access, consolidated analytics, data residency and billing arrangements require deployment-specific review.",
  },
  {
    slug: "corporate-health",
    title: "Corporate and occupational health",
    summary: "Explore configured laboratory workflows for organizations serving workplace health programs.",
    intro: "Corporate and occupational health services may need structured ordering, billing and reporting workflows. PLS requirements should be mapped to the customer's consent and information-governance obligations.",
    workflows: ["Organization billing arrangements", "Order and specimen tracking", "Result authorization and reporting", "Configured operational summaries"],
    considerations: "No occupational-health compliance or employer access model is implied; data access must be designed and approved by the customer.",
  },
  {
    slug: "healthcare-referral-networks",
    title: "Healthcare organizations and referral networks",
    summary: "Discuss referral, clinician and organization workflows with clear access boundaries.",
    intro: "Referral networks involve multiple organizations and information-sharing responsibilities. PLS can be assessed against approved referral, pricing and reporting requirements.",
    workflows: ["Clinician and referral records", "Configured pricing and billing", "Order-to-result hand-offs", "Authorized access boundaries"],
    considerations: "Any external portal or referral integration requires a verified endpoint, explicit authorization model and technical assessment.",
  },
];

export const roles = [
  ["Laboratory directors", "Review workload, financial summaries and operating activity."],
  ["Scientists & technicians", "Move assigned work through specimen and result workflows."],
  ["Reception teams", "Register visits and organize incoming service requests."],
  ["Billing officers", "Record collections and review outstanding balances."],
  ["Finance managers", "Follow configured expense, approval and reporting processes."],
  ["Inventory officers", "Track items, suppliers and stock movements."],
  ["Clinicians & referring providers", "Use configured consultation, order and referral workflows within authorized access boundaries."],
];

export const provisioning = {
  title: "Online in five minutes after approval and payment.",
  description: "Once your software request is approved and payment is confirmed, PLS provisions your online workspace in five minutes so you can sign in and navigate the software.",
  note: "This is the software provisioning period. Facility configuration, data migration, integrations and training follow the agreed implementation scope.",
};

export const implementationSteps = [
  ["01", "Initial conversation", "Understand the facility, services and operating priorities."],
  ["02", "Requirements assessment", "Map current workflows, roles, data and integration needs."],
  ["03", "Product demonstration", "Explore the relevant workflows using synthetic examples."],
  ["04", "Configuration planning", "Agree scope, responsibilities, setup and implementation approach."],
  ["05", "Training & readiness", "Prepare users and operational processes for the planned launch."],
  ["06", "Go-live & support", "Coordinate transition and ongoing assistance with the facility."],
];

export const resources = [
  {
    slug: "laboratory-workflow-digitization",
    title: "A practical guide to laboratory workflow digitization",
    category: "FIELD GUIDE",
    summary: "Questions to ask when mapping registration, specimen, results and reporting workflows.",
    sections: ["Start with the actual hand-offs", "Agree status definitions", "Make authorization explicit", "Measure data quality before dashboards"],
  },
  {
    slug: "laboratory-software-evaluation",
    title: "Evaluating laboratory management software",
    category: "BUYER'S GUIDE",
    summary: "A structured way to assess workflow fit, configuration, integrations and implementation scope.",
    sections: ["Map the current service journey", "Prioritize critical requirements", "Ask for evidence of device compatibility", "Understand support, migration and governance"],
  },
  {
    slug: "analyzer-integration-readiness",
    title: "Preparing for analyzer integration discussions",
    category: "TECHNICAL NOTE",
    summary: "What to gather before assessing instrument connectivity with a laboratory platform.",
    sections: ["Record the exact model and software version", "Request protocol documentation", "Identify interface equipment and network constraints", "Plan validation and operational acceptance"],
  },
];

export const faqs = [
  { q: "Does PLS work with every analyzer?", a: "No universal compatibility is claimed. Each connection must be assessed against the analyzer model, available protocol, interface requirements and configured workflow." },
  { q: "Can patients access results from this website?", a: "This website is a discovery gateway, not a patient record system. It links to an approved patient portal only when a destination has been configured and verified." },
  { q: "Can PLS support multiple facilities?", a: "Tenant-aware operating patterns are available, but the exact modules, oversight and access model depend on the deployment and subscription." },
  { q: "Does the product include a general ledger or bank reconciliation?", a: "The website describes selected expense, approval, receivable and reporting workflows. It does not claim a complete general ledger or bank reconciliation capability." },
  { q: "How quickly can we access PLS?", a: `${provisioning.description} ${provisioning.note}` },
  { q: "How long does implementation take?", a: "The online workspace is provisioned in five minutes after request approval and payment confirmation. Configuration, migration, integrations, training and operational readiness have separate timelines agreed during requirements assessment." },
];

export const testimonials: [] = [];
export const caseStudies: [] = [];

export const company = {
  description: "Prime Laboratory Software (PLS) helps diagnostic laboratories bring essential laboratory and business workflows into clearer view.",
  values: ["Practical operations", "Thoughtful implementation", "Transparent capability boundaries", "Responsible data access"],
  publicEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "",
  publicPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() || "",
};
