---
{
 "title": "Selecting and Tailoring Security Controls",
 "short": "Selecting and Tailoring Security Controls",
 "category": "grc-audit",
 "series": "grc-ground-up",
 "group": "rmf",
 "seriesNo": 14,
 "summary": "A control baseline is a starting point, not a final answer. How to select, tailor and document controls for a system.",
 "order": 2014,
 "tags": [
  "SP80053",
  "ControlTailoring",
  "SystemSecurityPlan",
  "NISTRMF"
 ]
}
---
Once a system is categorised, the next step is choosing its controls.

## Start with a baseline

**NIST SP 800-53B** provides Low, Moderate and High baselines drawn from the **SP 800-53 Rev. 5** catalogue, plus a privacy baseline. The baseline matching the system's category is the starting point.

## Tailor it

Tailoring adapts the baseline to the real system and its risks:

- **Identify common controls** the system inherits (from the organisation or cloud provider), so they are not rebuilt.
- **Scope out** controls that do not apply, with a recorded justification. A system with no wireless components does not need wireless controls.
- **Add control enhancements** or extra controls where specific risks call for them, such as stronger audit logging for a system holding health data.
- **Set parameters** the catalogue leaves open, like how often access is reviewed or how long logs are kept.
- **Apply compensating controls** when a required control cannot be implemented, explaining how risk is still addressed.

## Document it

The result is recorded in the **system security plan (SSP)**: each control, whether it is system-specific, common or hybrid, who is responsible, and how it is (or will be) implemented. Assessors and auditors work directly from this document.

**Key takeaway:** A baseline gets you started; tailoring makes it fit. Every deviation needs a reason someone could defend in an audit.
