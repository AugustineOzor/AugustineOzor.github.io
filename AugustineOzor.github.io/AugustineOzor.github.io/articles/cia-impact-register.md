---
{
 "title": "The CIA Impact Register: Knowing What Matters Before Something Breaks",
 "category": "grc-audit",
 "summary": "A CIA impact register rates every system and AI model for confidentiality, integrity and availability, so security effort goes where the damage would be greatest.",
 "order": 117,
 "tags": ["GRC", "RiskManagement", "CIATriad", "FIPS199", "AIGovernance", "Cybersecurity"]
}
---
**You cannot protect everything equally. A CIA impact register tells you what deserves the most protection, and why.**

Most organisations know they hold sensitive data and run critical systems. Far fewer can show, system by system, what would happen if that data leaked, was altered or became unavailable. That gap is where security budgets get spread too thin, recovery plans restore the wrong things first, and auditors find controls that do not match the risk.

A CIA impact register closes that gap.

## What a CIA impact register is

A CIA impact register is a list of an organisation's assets, systems and AI models, each rated for the impact of a loss of:

- **Confidentiality:** the information is disclosed to someone who should not see it.
- **Integrity:** the information or system is changed or destroyed without authorisation.
- **Availability:** people cannot access or use the system when they need it.

Each of the three is rated **Low**, **Moderate** or **High**. The overall impact of the asset is the highest of the three. This is called the **high-water mark**, the method set out in FIPS 199 and NIST SP 800-60.

The register does not measure how likely an attack is. It measures how bad the outcome would be. That makes it the foundation for risk assessment, not a replacement for it.

## The three impact levels

These definitions follow FIPS 199.

- **Low:** a loss would have a **limited** adverse effect on operations, assets or individuals.
- **Moderate:** a loss would have a **serious** adverse effect, such as significant financial loss, significant harm to individuals or a significant loss of capability.
- **High:** a loss would have a **severe or catastrophic** adverse effect, such as major financial loss, serious harm to individuals or an inability to perform primary functions.

Rate each of C, I and A separately. A public website has low confidentiality impact because its content is already public, but a defaced homepage still damages reputation, so integrity is higher.

## What goes in each entry

A useful register records more than three ratings. Each entry should hold:

- **ID and asset name**, so it can be referenced in risk registers, audits and incidents.
- **Confidentiality, Integrity and Availability ratings.**
- **Overall impact**, calculated as the highest of the three.
- **Information types**, such as customer PII, transactions or model outputs.
- **Asset owner**, the named person accountable for the rating.
- **Rationale**, one or two sentences explaining why each rating was chosen.
- **Key controls** already protecting the asset.
- **Last reviewed and next review dates**, normally every 12 months.
- **Status:** Draft, Under review or Approved.

The rationale is the part most often skipped and the part auditors ask for first. A rating with no reasoning cannot be challenged or defended.

## Where it matters

**Risk assessment.** Impact is half of every risk score. The register gives risk assessors a consistent, agreed impact rating instead of a fresh guess for every risk.

**Control selection.** High-impact systems get stronger controls. NIST SP 800-53 baselines are chosen by impact level, and ISO/IEC 27001 expects controls proportionate to the risk.

**Business continuity and disaster recovery.** Availability ratings set recovery priorities. The systems rated High for availability are restored first.

**Incident response.** When something goes wrong, responders can see straight away which systems are most critical and which information types are involved.

**Data protection.** Confidentiality ratings show where personal data lives and how sensitive it is, which supports GDPR records of processing and DPIAs.

**AI governance.** AI models belong in the register too. An AI credit scoring model rated High for integrity tells you that manipulated outputs could cause unfair lending decisions, which points straight to controls such as model validation, bias testing and human review.

**Audit.** A reviewed, approved register is evidence that the organisation understands its assets and protects them in proportion to their importance.

## Example register

These are fictional examples from a mid-sized bank.

### CIA-001 · Core banking database

- C: High · I: High · A: High · **Overall: High**
- Customer accounts, transactions and balances. Corruption or an outage halts payments.
- Controls: encryption at rest, MFA, database activity monitoring, DR replication.

### CIA-002 · AI credit scoring model

- C: High · I: High · A: Moderate · **Overall: High**
- Applicant PII and credit history. Manipulated outputs lead to unfair or wrong lending decisions.
- Controls: model validation, bias testing, version control, human review of declines.

### CIA-003 · Customer service LLM chatbot

- C: Moderate · I: High · A: Moderate · **Overall: High**
- Wrong or injected responses can mislead customers. Limited PII is reachable through retrieval.
- Controls: prompt filtering, output guardrails, retrieval boundaries, PII redaction, conversation logging.

### CIA-004 · HR and payroll system

- C: High · I: High · A: Moderate · **Overall: High**
- Disclosure harms staff privacy. Payroll errors have direct financial impact.
- Controls: RBAC, quarterly access reviews, payroll change approvals, encryption.

### CIA-005 · Corporate email (Microsoft 365)

- C: Moderate · I: Moderate · A: High · **Overall: High**
- Day-to-day business communication depends on it.
- Controls: MFA, DLP policies, phishing filtering, retention policies.

### CIA-006 · Public website

- C: Low · I: Moderate · A: Moderate · **Overall: Moderate**
- Content is already public. Defacement or downtime damages reputation.
- Controls: WAF, CMS change control, uptime monitoring.

### CIA-007 · Data warehouse and BI

- C: High · I: Moderate · A: Low · **Overall: High**
- Large volume of sensitive data in one place. Reporting can tolerate short outages.
- Controls: column-level security, access logging, data classification tags.

### CIA-008 · Backup repository

- C: High · I: High · A: Moderate · **Overall: High**
- The last line of recovery. Tampering would defeat ransomware recovery.
- Controls: immutable backups, encryption, restore testing, segregated credentials.

### CIA-009 · Vendor management portal

- C: Moderate · I: Moderate · A: Low · **Overall: Moderate**
- Commercial terms are confidential. Low operational dependency.
- Controls: SSO, RBAC, access logging on the contract repository.

### CIA-010 · Staff training LMS

- C: Low · I: Low · A: Low · **Overall: Low**
- Minimal sensitivity and business impact.
- Controls: SSO, review of the vendor's SOC 2 report.

**Result:** 7 High, 2 Moderate and 1 Low. Notice that the overall rating can be High even when only one of the three is High, as with corporate email and the data warehouse.

## Scenario: a ransomware attack at 2 a.m.

At 2 a.m. on a Saturday, the bank's monitoring detects ransomware encrypting file servers and spreading towards production systems. The incident response team has a few hours to decide what to isolate, what to protect and what to restore first.

**Without a register**, the team argues about priorities on a call. The data warehouse is restored early because its owner escalates loudest. The backup repository shares administrator credentials with production, and the attackers delete part of it.

**With the register**, the team works from an agreed list:

1. **Protect what recovery depends on.** The backup repository (CIA-008) is rated High for integrity because it is the last line of recovery. Its immutable backups and segregated credentials, recorded as key controls, mean the attackers cannot alter it. The team confirms the latest clean restore point within the first hour.
2. **Restore by availability rating.** The core banking database (CIA-001) and corporate email (CIA-005) are rated High for availability, so they are restored first. The data warehouse (CIA-007) is rated Low for availability and waits until Monday.
3. **Check for data theft by confidentiality rating.** Modern ransomware often steals data before encrypting it. The register shows that the HR system (CIA-004) and the core banking database hold High-confidentiality PII, so forensic checks focus there first. That evidence decides whether the bank must notify regulators and customers.
4. **Check integrity before going live.** The AI credit scoring model (CIA-002) is rated High for integrity. Before it is switched back on, the team compares the model version and recent outputs with the last validated baseline, so lending decisions are not made on a tampered model.

Core payments are back by Saturday afternoon. The post-incident review uses the register to confirm that recovery followed the agreed priorities and to raise one finding: the vendor portal (CIA-009) had never been reviewed and had no review date.

## Getting started

1. **List your assets.** Start with the systems that hold customer, financial or personal data, then add AI models and key third-party services.
2. **Rate C, I and A separately** using the three FIPS 199 levels, and write a short rationale for each.
3. **Let the overall impact follow the high-water mark.** Do not average the ratings.
4. **Get the asset owner to approve each entry.** Ownership makes the ratings stick.
5. **Link the register to your risk register, control set and continuity plans.**
6. **Review it every year**, and whenever a system, its data or its use changes.

## Key takeaway

**A CIA impact register turns "we protect our important systems" into a documented, owned and auditable view of what matters most, so that controls, recovery plans and incident response all start from the same priorities.**
