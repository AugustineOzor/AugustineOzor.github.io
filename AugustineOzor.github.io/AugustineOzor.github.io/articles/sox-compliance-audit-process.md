---
{
 "title": "The SOX Compliance Audit Process: From Planning to Exit Meeting",
 "category": "grc-audit",
 "summary": "The five stages of a SOX compliance audit, with what happens, a worked example and the deliverables at each step.",
 "order": 2,
 "tags": ["SOX", "ITGC", "InternalAudit", "GRC", "Compliance", "AuditReadiness"]
}
---
A SOX audit follows five stages. Each one has a clear purpose, a set of activities and deliverables that feed the next stage.

## 1) Planning: audit objective and scope

**What happens:** The audit team defines what controls will be tested and why, the period covered, the systems in scope and materiality. They gather key documents such as process narratives, control matrices and prior findings.

**Example:** The objective is to assess the effectiveness of IT General Controls and revenue recognition controls for FY2025 Q3. In-scope systems: ERP (SAP), the billing platform and the data warehouse. In-scope processes: Order-to-Cash and Change Management. Materiality: $5M.

**Deliverables**

- Audit plan
- Request list (PBC: Provided By Client)
- Timeline and stakeholders

## 2) Kick-off meeting

**What happens:** Auditors and process owners align on scope, timing, requests and communication cadence. Risks and dependencies are surfaced early.

**Example:** Auditors present the PBC list and due dates. Revenue Ops confirms blackout dates around quarter close. IT confirms access provisioning will be handled through ServiceNow tickets and names a single point of contact.

**Deliverables**

- Agreed timeline and owners
- Communication channel, for example a weekly status call
- Confirmed PBC schedule

## 3) Fieldwork

**What happens:** Auditors test the design and operating effectiveness of controls using walkthroughs, samples and re-performance. They collect evidence and note exceptions.

**Example activities**

- **Walkthrough:** trace a customer order from quote to cash in SAP to confirm the designed controls.
- **Sample testing:** pick 25 new user access requests from April to June and verify approvals, segregation-of-duties checks and timely provisioning.
- **Change management:** for 20 production changes, confirm approvals, code review evidence, and that changes were deployed by someone other than the developer.
- **ITGC:** confirm quarterly user access reviews were performed and exceptions remediated.

**Deliverables**

- Test sheets and evidence (screenshots, logs, tickets)
- Issues log with severity and initial root causes

## 4) Reporting

**What happens:** Auditors consolidate results, rate control effectiveness and draft findings with impact and recommendations. Management reviews them and provides action plans.

**Example finding:** User access reviews for the billing application were performed late in 2 of 4 quarters. *Risk:* unauthorised access could persist longer than acceptable. *Recommendation:* automate reminders and enforce sign-off within 15 days. *Management action plan:* enable quarterly notifications in IAM and add a dashboard, with a target completion of 15 November.

**Deliverables**

- Draft and final audit report
- Management responses and target dates
- Control effectiveness conclusion for SOX

## 5) Exit meeting

**What happens:** Final results are presented, including strengths, confirmed findings and committed remediations. Next steps and follow-ups are agreed.

**Example:** The audit team confirms all high-severity issues have action plans. Two medium-severity items will be retested after remediation in December. A brief lessons-learned review is captured to improve evidence readiness for the next cycle.

**Deliverables**

- Final sign-off on the report
- Remediation tracking plan and retest dates
- Lessons learned for the next audit cycle

## Tips for a smooth audit

- Front-load access to systems and data owners during planning to avoid fieldwork delays.
- Use a single evidence repository with clear naming and versioning.
- Pre-map controls to evidence artefacts so PBC requests are precise.
- Keep a live issues log to avoid surprises at reporting.

**A well-run SOX audit is mostly preparation: clear scope, mapped evidence and no surprises.**
