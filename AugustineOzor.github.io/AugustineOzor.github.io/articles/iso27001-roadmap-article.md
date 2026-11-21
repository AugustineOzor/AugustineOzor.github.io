---
title: "Six Steps to Build an ISO 27001 Roadmap That Survives Reality"
author: Augustine Ozor
description: "How to turn the 16 stages of an ISO 27001 implementation into a Gantt-based roadmap with parallel work, leadership gates, named owners and built-in slack."
tags: [ISO 27001, ISMS, GRC, Program planning]
---

# Six Steps to Build an ISO 27001 Roadmap That Survives Reality

*By Augustine Ozor · 8 min read*

An implementation plan is easy to draw and hard to keep. The 16 stages of an ISO 27001 program are sequential in places and parallel in others, and the plans that hold up are the ones that expect vendors to fail audits, people to leave and workshops to be cancelled. Here are six steps for building one that survives contact with reality, with a Gantt chart you can adapt.

## Step 1 · Lay out the 16 stages as a Gantt chart

Give each stage one row. These are typical allocations for a company of 100 to 200 people; treat them as a starting point and adjust to your size and maturity.

| Stage | Typical allocation |
|---|---|
| Context + interested parties | 3 wk |
| Scope | 2 wk |
| Leadership + policy + roles | 4 wk (overlap) |
| Risk methodology | 2 wk |
| Risk assessment | 4 wk (workshops per function) |
| Risk treatment + SoA | 3 wk |
| Control implementation | 8 to 12 wk |
| Evidence | Ongoing from week 1 |
| Internal audit | 4 wk |
| Management review | 1 wk |
| Corrective action (CAPA) | 4 wk |
| Certification stage 1 + stage 2 audits | 6 wk |

Laid out with the overlaps below, this comes to roughly 45 weeks (about ten months), including a three-week buffer and the certification audits.

![Indicative 45-week ISO 27001 implementation Gantt chart: 16 stages, four leadership gates (G1 to G4) and a 3-week buffer before the certification audits](gantt-chart.png)

*Indicative 45-week plan. Red diamonds are leadership gates; the dashed box is the unallocated buffer.*

> Note: "stage 1 and stage 2" at the end are the certification body's two audit stages, not stages of the 16-step roadmap.

## Step 2 · Identify parallels and hard dependencies

Some work can overlap safely, and some cannot. Knowing which is what stops a plan from being either needlessly slow or quietly unrealistic.

**Safe to run in parallel**

- Leadership, policy and roles (they share the same sponsors).
- Topic-specific policy drafting while risk workshops are running.
- Evidence collection, which starts in week 1 rather than the week before the audit.
- Quick-win controls, such as multi-factor authentication, ahead of formal SoA approval when the risk is plainly high.

**Strictly sequential**

- Scope before risk assessment, so you assess the right assets.
- Risk assessment, then treatment, then the Statement of Applicability.
- Implementation before internal audit, and internal audit before management review.
- Management review and corrective action before the certification audits.

The full dependency logic, including what breaks when stages are reordered, is in my [dependency map](https://github.com/AugustineOzor/iso27001-isms-implementation-roadmap/blob/main/docs/dependency-map.md).

## Step 3 · Insert leadership gates

Hold a formal review at the end of each major stage. No one proceeds past a gate without sign-off. Gates protect you from the quiet descoping that happens when a deadline gets tight.

| Gate | Timing | Decision |
|---|---|---|
| G1 Scope sign-off | Month 2 | Approve scope and exclusions |
| G2 SoA approval | Month 4 | Approve controls and exclusions |
| G3 Internal audit pass | Month 8 | Accept audit result, majors closed |
| G4 Readiness verdict | Month 9 | Go or no-go for certification audits |

## Step 4 · Allocate ownership per stage

Each stage gets one named owner. In most programs that is the ISMS owner, with input from function leads. Shared ownership is how stages stall.

| Stages | Single owner | Input from |
|---|---|---|
| 1-3 Context, parties, scope | ISMS owner (CISO) | Executives, Legal, function leads |
| 4-6 Leadership, policy, roles | ISMS owner | CEO (sponsor), Head of People |
| 7-8 Risk methodology and assessment | ISMS owner | Function leads as risk owners |
| 9-10 Treatment and SoA | ISMS owner | CTO, Legal, control owners |
| 11 Control implementation | ISMS owner (program) | Control owners per Annex A theme |
| 12 Evidence | ISMS owner | Every control owner |
| 13-14 Internal audit, management review | ISMS owner (program); independent auditor | CEO chairs review |
| 15-16 CAPA, certification | ISMS owner | Finding owners, audit coordinator |

## Step 5 · Build in slack

This is the step that saves the program. Reality intervenes: vendors fail audits, key people leave, workshops get cancelled. Reserve two to three weeks of unallocated time as a buffer.

In the chart the buffer sits just before the readiness verdict, so any slippage upstream is absorbed before the certification audits are locked in. A few rules keep it honest:

- Spend it only with the steering committee's approval, and log what it was spent on.
- Do not pre-allocate it to "nice to have" tasks.
- If more than half is gone before the internal audit, treat that as a signal to re-plan, not to hope.

### The buffer rule

Programs without buffer always slip past the audit date. Programs with 2 to 3 weeks of buffer hit the date in 80% of cases. This single discipline is worth more than any tool.

## Step 6 · Communicate the sequence publicly

Share the roadmap with leadership and the project team in week 1. Put the Gantt chart and the dependency map in the kickoff pack, and make both easy to find afterwards.

Then defend it. When someone wants to skip ahead, point at the dependencies: "we can't approve controls before the risk assessment is done" is a much stronger answer than "that's not the plan". The roadmap becomes your shield.

## The takeaway

A good ISO 27001 roadmap is not the most optimistic one. It names the dependencies, puts gates where leadership must decide, gives every stage one owner, holds time in reserve and is shared openly from week 1. Build those five things in and the plan bends instead of breaking.

The full 16-stage method, with a worked example, a 93-control Statement of Applicability and audit-readiness checklists, is in my [ISO 27001 Implementation Roadmap repository](https://github.com/AugustineOzor/iso27001-isms-implementation-roadmap).
