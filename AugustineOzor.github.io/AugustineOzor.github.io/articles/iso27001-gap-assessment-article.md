

# ISO 27001 Gap Assessment: Measure the Management System Before You Touch a Control
<img width="1600" height="400" alt="banner (1)" src="https://github.com/user-attachments/assets/a31c172d-27a8-4229-bf34-e12122c3a67b" />

You can't plan a journey without knowing the starting point. A gap assessment is the structured measurement of how far an organization currently is from the requirements of ISO 27001. It is the first thing a competent Lead Implementer does after leadership buy-in, before writing a single policy and before touching a control.

It converts a vague feeling ("our security could be better") into a precise, evidenced baseline: which requirements are met, which are partly met, and which are missing entirely. Without it, you are guessing at how much work the program is, how long it will take and what it will cost. With it, you can walk into a leadership meeting with a number.

## 1 · Assess Clauses 4 to 10, not Annex A

The most common mistake is assessing the wrong thing. New implementers open Annex A, see 93 controls and start scoring the organization against each one. That is not a gap assessment, at least not yet. A gap assessment is run against ISO 27001 Clauses 4 to 10: the management system itself.

| Clause | What it covers |
|---|---|
| 4 | Context, interested parties, ISMS scope |
| 5 | Leadership, policy, roles and responsibilities |
| 6 | Risk assessment, risk treatment, objectives, planning |
| 7 | Resources, competence, awareness, communication, documented information |
| 8 | Operational planning and control |
| 9 | Monitoring, internal audit, management review |
| 10 | Nonconformity, corrective action, continual improvement |

Annex A controls are not assessed at this stage because you do not yet know which of them apply. Applicability is an output of risk assessment and risk treatment, work that happens later in the sequence. Scoring all 93 controls before you have a risk register tells you nothing useful and wastes weeks.

> **The clean rule.** A gap assessment measures the management system (Clauses 4 to 10). The Statement of Applicability, much later, measures the controls (Annex A). Mixing the two is the fastest way to produce a 90-page document nobody can act on.

## 2 · Use a 3-tier scale

Every clause gets one of three ratings:

- **Compliant:** the requirement is fully met, and you can point to the evidence that proves it.
- **Partially Compliant:** some of the requirement is met, but material gaps remain. Real work exists; it is incomplete, informal or unevidenced.
- **Non-Compliant:** the requirement is not met. Nothing exists, or what exists does not address the clause.

A pass/fail scale hides the most important information. "Partial" is where most real organizations live, and telling Partial apart from Non-Compliant is the actual skill, because it changes how much work each gap needs and what kind. A Partial clause needs finishing; a Non-Compliant clause needs building from zero.

## 3 · For every clause, ask: "what would I demand to see?"

A rating is only as good as the evidence behind it. For each clause, write down the specific document or record you would ask the organization to produce. "We do leadership commitment" is an opinion. "Show me the last two management review minutes" is a test.

This habit does two things. It stops you rating something Compliant on someone's say-so, and it hands you the to-do list for closing the gap for free: the evidence you couldn't be shown is the work.

> **Insider tip.** A Stage 1 certification audit closely resembles a gap assessment of Clauses 4 to 10 run by the certification body. If you run an honest one yourself first, Stage 1 holds no surprises. Implementers who skip the self-assessment meet their gaps for the first time in front of the auditor.

## 4 · The deliverable: a Gap Analysis Report that earns funding

The output is a single document leadership can act on. A strong one has seven parts:

1. **Purpose:** why the assessment was run and what it measures.
2. **Scope:** Clauses 4 to 10, with a note that Annex A is out of scope at this stage.
3. **Methodology:** the 3-tier scale and how evidence was reviewed.
4. **Findings table:** one row per clause, with rating, current state and evidence to obtain.
5. **Totals:** how many clauses are Compliant, Partial and Non-Compliant.
6. **Prioritized recommendations:** what to fix first, with Non-Compliant before Partial.
7. **Conclusion:** the honest headline and the path forward.

An illustrative extract of the findings table (fictional organization):

| Clause | Rating | Current state | Evidence to obtain |
|---|---|---|---|
| 4.3 Scope | Non-Compliant | No documented scope; "everything IT" assumed | Signed scope statement with boundary |
| 5.1 Leadership | Partial | Executive supportive, no budget or meetings | Steering minutes, approved resources |
| 5.2 Policy | Compliant | Policy approved by CEO and published | Signed policy, acknowledgement records |
| 6.1.2 Risk assessment | Non-Compliant | Informal risk list, no method | Approved methodology, risk register |
| 6.2 Objectives | Non-Compliant | None set | Measurable objectives with owners |
| 7.5 Documented information | Partial | Documents exist, no version control | Document control procedure, register |
| 9.2 Internal audit | Non-Compliant | No program | Audit program, plan and report |
| 9.3 Management review | Non-Compliant | Never held | Review minutes with decisions |
| 10.2 Corrective action | Partial | Incidents fixed, causes not recorded | Corrective action log with root cause |

*Totals for this extract: 1 Compliant, 4 Partial, 5 Non-Compliant out of 10 clauses.*

## 5 · When it happens in the program

The gap assessment runs early: right after you and leadership understand what ISO 27001 is, and around the time scope is being shaped. In my 16-stage roadmap, it sits alongside the first three stages (context, interested parties and scope). It sizes the project by telling leadership how many months and how much budget the gaps represent, and it gives you the baseline you will re-measure against before Stage 1.

It is run once as a baseline, then informally re-run before the certification audit to confirm the gaps are closed. It is not a control-by-control audit, and it is not the internal audit (Clause 9.2). That comes much later, against a live ISMS.

## The takeaway

Measure the management system first, rate honestly on three tiers, tie every rating to evidence you would demand to see, and hand leadership a report with a number in it. The gaps you find become the work plan.

The full 16-stage method, with a worked example, a 93-control Statement of Applicability and audit-readiness checklists, is in my [ISO 27001 Implementation Roadmap repository](https://github.com/AugustineOzor/iso27001-isms-implementation-roadmap).
