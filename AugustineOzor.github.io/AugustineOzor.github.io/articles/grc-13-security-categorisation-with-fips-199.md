---
{
 "title": "Security Categorisation with FIPS 199",
 "short": "Security Categorisation with FIPS 199",
 "category": "grc-audit",
 "series": "grc-ground-up",
 "group": "rmf",
 "seriesNo": 13,
 "summary": "How sensitive is your system? FIPS 199 answers that question, and the answer drives every control decision that follows.",
 "order": 2013,
 "tags": [
  "FIPS199",
  "SecurityCategorization",
  "CIA",
  "NISTRMF"
 ]
}
---
Security categorisation decides how much protection a system needs. In the NIST approach it uses **FIPS 199**, which rates the potential impact of losing each of three security objectives:

- **Confidentiality:** unauthorised disclosure of information
- **Integrity:** unauthorised modification or destruction
- **Availability:** disruption of access or use

Each is rated **Low**, **Moderate** or **High**, depending on whether the loss would cause limited, serious or severe or catastrophic harm to the organisation, its assets or individuals.

## From information types to a system rating

You first categorise each **information type** the system handles (NIST SP 800-60 offers a catalogue). The system's overall category then follows the **high-water mark**: the highest rating across all information types and objectives.

## Example

A hospital records system holds patient health information and clinical notes:

- **Confidentiality: High** — disclosure would seriously harm patients and trigger regulatory action.
- **Integrity: High** — altered records could lead to wrong treatment.
- **Availability: Moderate** — outages disrupt care, with manual fallback procedures in place.

The high-water mark makes the system **High**, which means selecting the high control baseline from NIST SP 800-53B.

## Getting it right

Categorisation should be agreed with the system owner and reviewed by leadership. Under-categorising leaves gaps; over-categorising wastes effort on controls the system does not need.

**Key takeaway:** Categorise honestly. Every later decision, from control selection to assessment depth, builds on it.
