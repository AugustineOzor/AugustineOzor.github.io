---
{
 "title": "Security Controls Explained: Types, Functions and Common Controls",
 "short": "Security Controls Explained: Types, Functions and Common Controls",
 "category": "grc-audit",
 "series": "grc-ground-up",
 "group": "controls",
 "seriesNo": 9,
 "summary": "Controls are how risk decisions become reality. How they are classified, and why inherited controls save so much effort.",
 "order": 2009,
 "tags": [
  "SecurityControls",
  "DefenceInDepth",
  "CommonControls",
  "NIST80053"
 ]
}
---
A **security control** is a safeguard that reduces risk. Controls are usually described in two ways.

## By type

- **Administrative (managerial):** policies, training, risk assessments, background checks, access approval processes.
- **Technical (logical):** encryption, multi-factor authentication, firewalls, logging, endpoint protection.
- **Physical:** locks, badges, CCTV, secure server rooms, environmental protection.

## By function

- **Preventive** controls stop an incident (access control, encryption).
- **Detective** controls find one (log monitoring, intrusion detection, audits).
- **Corrective** controls limit damage and restore operations (backups, incident response, patching).
- **Deterrent** and **compensating** controls discourage attacks or stand in when the preferred control is not possible.

Good protection layers several functions, a principle known as **defence in depth**.

## Common and inherited controls

Many controls are provided once and shared by many systems. A data centre's physical security, an organisation-wide security awareness programme or an identity platform are **common controls**. Systems built on them **inherit** those controls instead of re-implementing them.

In the cloud, you inherit many physical and infrastructure controls from the provider. Documenting what is inherited, what is shared and what is yours avoids both gaps and duplicated effort.

**Key takeaway:** Choose a mix of control types and functions for each risk, and reuse common controls wherever you can.
