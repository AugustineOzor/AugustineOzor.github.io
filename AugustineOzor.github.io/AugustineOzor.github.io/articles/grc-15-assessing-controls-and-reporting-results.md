---
{
 "title": "Assessing Controls and Reporting Results",
 "short": "Assessing Controls and Reporting Results",
 "category": "grc-audit",
 "series": "grc-ground-up",
 "group": "rmf",
 "seriesNo": 15,
 "summary": "Assessment is where claims meet evidence. How controls are tested and how results are reported.",
 "order": 2015,
 "tags": [
  "ControlAssessment",
  "AuditEvidence",
  "SecurityAssessmentReport",
  "NISTRMF"
 ]
}
---
A control assessment answers one question: **are the controls implemented correctly, operating as intended and producing the desired outcome?**

## Plan the assessment

An **assessment plan** sets the scope, the controls to test, the methods, the schedule and the assessors. Assessors should be independent of the people who built and operate the controls.

## Three assessment methods

- **Examine:** review documents, configurations and records, such as policies, IAM settings or access review sign-offs.
- **Interview:** talk to the people who run the control to confirm they understand and follow it.
- **Test:** exercise the control directly, for example attempting a login without multi-factor authentication or restoring a backup.

Strong assessments combine methods and use **samples** across the review period, not a single example.

## Report the results

The **security assessment report** records each control as satisfied or not, describes every finding (what was expected, what was found, the risk and a recommendation) and rates severity. It should be factual and specific: "MFA was not enforced for 3 of 12 administrator accounts", not "MFA weaknesses noted".

## Then remediate

Some findings can be fixed quickly and retested before the report is final. Others move into a **plan of action and milestones (POA&M)** for tracking.

**Key takeaway:** Examine, interview, test, then report precisely. An assessment is only as good as its evidence.
