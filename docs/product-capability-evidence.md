# Website capability evidence

Source review: 2026-10-10. This maps the newly expanded website claims to the
current sibling Lobnos applications. It is a source-code review, not a device
acceptance certificate or proof that every tenant has enabled every workflow.
No customer or patient records are used for website content.

Public content is maintained in [content.ts](../src/data/content.ts). Homepage
cards and detailed feature sections use the same capabilities and groups.
Solution pages link to those detailed sections; the demo form uses shared
product-interest options. Do not import application code or clinical data into
the public website to keep descriptions aligned.

## Source-to-claim map

| Website capability | Software evidence | What the website explains |
| --- | --- | --- |
| Organization accounts (14) | [Organization form](../../lobnos/components/organization/BasicOrganizationForm.jsx), lines 88-110 and 144-164; [organization routes](../../lobnos-server/src/controllers/organization/route.ts), lines 23-35 | Staff-maintained organization profiles and billing context, not automatic customer login provisioning. |
| Clinicians and referral relationships (13) | [Clinician form](../../lobnos/components/Clinicians/BasicInformationClinician.jsx), lines 119-140 and 175; [clinician routes](../../lobnos-server/src/controllers/clinicians/route.ts), lines 7-14 | Clinician profile registration, contact/affiliation details and referral context. Creating a profile is not evidence of creating login credentials. |
| Entity-specific test tariffs (04, 13, 14) | [Billing initialization](../../lobnos-server/src/models/billing/multi/initCustomerBilling.ts), lines 158-192; [billing-strategy resolver](../../lobnos-server/src/models/clincians/billingstrategy.ts), lines 641-755 | Organization/clinician strategies, selected-test or broad concessions, percentage/fixed discounts and surcharges. Tests without a strategy can retain base pricing. |
| Nighttime pricing and checkout (04) | [Pricing calculations](../../lobnos-server/src/models/billing/multi/PrimeBillingEnterprise.ts), lines 174-225 and 245-278; [checkout](../../lobnos-server/src/models/billing/multi/customerBillingCheckout.ts), lines 82-162 | Enabled adjustments use current server hours, including windows crossing midnight. Percentage/fixed adjustments and server recalculation are explained, without claiming appointment-time or location-aware scheduling. |
| Test packages (04) | [Package checkout helper](../../lobnos-server/src/models/billing/multi/packageBillingHelper.ts), lines 6-37 and 82-95 | Saved package prices and concessions. This inspected path excludes night adjustments and does not select package prices by clinician/organization. |
| Commission calculation and tracking (07) | [Rule configurations](../../lobnos/app/settings/applicationsettings/commisions-defaults/commissions/configs/page.tsx), lines 31-58; [assignments](../../lobnos/app/settings/applicationsettings/commisions-defaults/commissions/assignments/page.tsx), lines 41-55; [clinician commission screen](../../lobnos/app/commissions/clinicians/commissions-information/[clinicianid]/page.tsx), lines 212-217 and 256-267; [commission routes](../../lobnos-server/src/controllers/commission/routes.ts), lines 8-56; [post-billing dispatch](../../lobnos-server/src/models/billing/billing-new-client-multi.ts), lines 619-688 | Rule assignment, tracking, batches and service-payment history. Batch-payment processing is admin-restricted; calculating a commission is not proof of payment. |
| Outsourced providers and case costs (14) | [Outsource service UI](../../lobnos/components/outsource/OutSourcingServices.tsx), lines 21-111; [outsourcing model](../../lobnos-server/src/models/organization/outsourcingOrganization/outsourcing.ts), lines 41-112 and 185-194; [organization routes](../../lobnos-server/src/controllers/organization/route.ts), lines 46-59 | Provider records, test costs and case resolution. This is not a claim of automatic provider payment or an end-to-end procurement system. |
| Custom test definitions (15) | [Custom test page](../../lobnos/app/settings/applicationsettings/testpanels/testlist/createcustomtest/page.tsx), lines 27-84 and 120-132; [test-panel routes](../../lobnos-server/src/controllers/testpanel/routes.ts), line 47; [test handlers](../../lobnos-server/src/controllers/testpanel/testpanelHandlers.ts), lines 49-73 | Single/multiple custom definitions subject to tenant/master-catalog policy, rather than unrestricted creation for every tenant. |
| Result fields and reference limits (15) | [Field builder](../../lobnos/components/settingsComponents/FieldsCreation/createfieldsComponent.tsx), lines 126-153, 230-293 and 425-477; [demographic limits](../../lobnos-server/src/models/creator/demographic-limits.ts), lines 65-113 | Field types, units, ordering and supported demographic reference-limit selection. Configured ranges are not automatically clinically validated. |
| Calculated parameters (15, 16) | [Calculation configuration](../../lobnos/components/settingsComponents/test/tabs/CalculationTab.tsx), lines 141-182 and 376-377; [formula service](../../lobnos-server/src/models/creator/calculations/CalculationFormulaService.ts), lines 74-164, 176-260 and 265-282 | Versioned formulas, inputs, conditions, units, precision and recorded calculation inputs/outputs. Clinical review remains necessary. |
| Report presentation (15, 03) | [Per-test report settings](../../lobnos/components/settingsComponents/test/tabs/ReportSettingsTab.tsx), lines 138-222; [template preview](../../lobnos/components/ResutlUI/useCustomResultTemplatingPreview.tsx), lines 84-92 and 123-141; [report settings model](../../lobnos-server/src/models/application/appsettings/result-settings/TestReportSettings.ts) | Per-test fonts, colors and column headings, with the option to inherit general report settings. |
| Result-entry PIN (03) | [Entry interface](../../lobnos/components/LabTestForms/ResultEntryMainEntryBase.jsx), lines 10-13 and 41-51; [entry rule](../../lobnos/components/LabTestForms/testrule.jsx), lines 107-139; [authentication controller](../../lobnos-server/src/controllers/security/authController.ts), lines 167-182 | Optional staff PIN confirmation in the entry interface. It is not printed on the report and is not a patient access PIN. The result-save handler does not independently repeat this check, so do not market it as a universal server-side security gate. |
| Result checks, validation and critical alerts (03) | [Result creator](../../lobnos-server/src/models/creator/creator.ts), lines 297-362 and 413-424; [validation handlers](../../lobnos-server/src/controllers/operations/ascensionStageHandler.ts), lines 22-26 and 82-93; [report-access handler](../../lobnos-server/src/controllers/result/resultHandlers.ts), lines 252-268; [critical evaluator](../../lobnos-server/src/models/creator/CriticalValueEvaluator.ts), lines 29-97 and 163-165 | Configured QC/payment checks, validator/approval/access-window rules and critical alerts. Role and workflow exceptions exist; not every entry necessarily undergoes a separate manual validation stage. |
| Result changes and report events (16) | [Checked-in schema export](../../lobnos-server/db-exports/primelabmaster/primelabmaster.sql), lines 6340-6411; [audit handlers](../../lobnos-server/src/controllers/result/testResultsAuditLogs.ts), lines 6-18; [audit UI](../../lobnos/app/operations/laboratory/auditlogs/page.tsx), lines 29-31 and 83-103; [printing tracker](../../lobnos-server/src/models/operations/testApprovalClass.ts), lines 172-185 | Available old/new result values and edit-session context, plus recorded viewing/printing. Result-audit triggers must exist in the tenant database. The copied employee field is not definitive attribution of the editing user in every record. |
| Analyzer result mapping (08) | [Named dispatch](../../lobnos-server/src/controllers/settings/devices/hl7SoftwareProcessing.ts), lines 236-258; [mapping/result processor](../../lobnos-server/src/controllers/settings/devices/DevicePrecessorBase.ts), lines 70-88 and 95-182; [device routes](../../lobnos-server/src/controllers/settings/devices/route.ts), lines 7-15 | MindRay, AgileS20 and BioeLab named adapters, device-specific JSON/HL7-style result payloads, accession matching and mapped values entering the result workflow. This is not proof of live compatibility for every model in an assay category. |
| QC and calibration follow-up (10) | [QC routes](../../lobnos-server/src/controllers/QualityControl/qualityControlRoutes.ts), lines 17-70; [QC device repository](../../lobnos-server/src/repositories/QualityControl/DeviceRepository.ts) | Control materials, readings/sessions, acceptance/bypass actions and calibration due-date records, not automated physical calibration or universal QC certification. |
| Inventory and purchasing (05) | [Consumption controller](../../lobnos-server/src/controllers/inventory/InventoryConsumptionController.ts), lines 28-47 and 65-159; [purchase receipt handler](../../lobnos-server/src/controllers/inventory/PurchaseOrderController.ts), lines 633-661 | Purchase orders, receipts, stock availability and consumption/history. Physical counts and local stock rules remain necessary. |
| Accounting (06) | [Accounting routes](../../lobnos-server/src/controllers/accounting/route.ts) | Financial reports, journal approval/posting, bank-statement match/unmatch and daily-close workflows. The FAQ must not deny the ledger while the feature page describes it. |

Patient registration, specimen workflow, management reporting, home collection,
ultrasound and the supporting payroll/pharmacy/communication descriptions retain
the site's existing capability inventory. This expansion does not certify every
deployment or introduce new application functionality.

## Analyzer acceptance boundaries

The HTTP device path accepts device-specific JSON using HL7-style structures.
The separate [HL7 server](../../lobnos-server/src/services/medical-devices/HL7Server.ts)
and [device manager](../../lobnos-server/src/services/medical-devices/DeviceManager.ts)
do not establish that a TCP HL7 listener is initialized in the running
application. Do not advertise general live HL7/ASTM interoperability.

The reviewed receive/processor success path also requires operational testing:
returning a processor value is not evidence that the HTTP response is completed.
This website task does not change that backend behavior.

Chemistry, hematology and hormone/immunoassay are explicit subjects for
instrument assessment, not compatibility guarantees. Before publishing a
supported-model claim, record the exact device/model, transport/bridge,
parameter mapping, accession handling and successful deployment acceptance.

## Keeping the connection real

The reviewed automatic commission path prefers recorded paid amount and can
subtract a positive recorded cost for a flagged outsourced service. It does not
establish the project's full intended eligibility rule that the selected
outsourcing organization actually rendered the service. Public copy therefore
describes configurations, tracking and payment history rather than promising
that this eligibility gate is implemented. Reviewing that backend discrepancy
is separate from this website-content change.

- Update feature copy, workflows, benefit and caveat together.
- Link solutions to valid feature IDs; preserve generated sitemap discovery.
- Keep counts derived from the shared groups instead of hard-coded totals.
- Add regression tests for important named workflows and their limitations.
- Do not infer capabilities from an empty validator, a mock form, a type name
  or a protocol parser that is not wired into the running application.
- Do not promise universal audit coverage, immutable logs, regulatory
  certification, automatic provider delivery or unverified instrument support.
