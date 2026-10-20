---
{
 "title": "Continuous Monitoring and Secure Decommissioning",
 "short": "Continuous Monitoring and Secure Decommissioning",
 "category": "grc-audit",
 "series": "grc-ground-up",
 "group": "rmf",
 "seriesNo": 17,
 "summary": "Authorisation is not the finish line. How systems stay secure after go-live, and how they are retired safely.",
 "order": 2017,
 "tags": [
  "ContinuousMonitoring",
  "SP800137",
  "Decommissioning",
  "NISTRMF"
 ]
}
---
A system that was secure on authorisation day will not stay that way on its own. Software changes, threats evolve and people move roles. **Continuous monitoring** (described in NIST SP 800-137) keeps risk visible over time.

## What continuous monitoring covers

- **Change management:** assess the security impact of changes before they go live.
- **Ongoing control assessments:** test a portion of controls on a regular cycle, focusing on the most volatile or important.
- **Vulnerability and configuration scanning:** find new weaknesses quickly.
- **Ongoing risk response:** feed new findings into the POA&M and fix them.
- **Documentation updates:** keep the system security plan and authorisation package current.
- **Reporting:** give the system owner and authorising official regular, plain-language updates.

Done well, continuous monitoring supports **ongoing authorisation**, where the authorising official relies on current evidence instead of a full reassessment every few years.

## Secure decommissioning

Every system eventually retires. Decommissioning safely means:

- migrating or archiving data according to retention requirements
- **sanitising** storage so data cannot be recovered (NIST SP 800-88 gives guidance)
- revoking accounts, keys and certificates, and removing network connections
- updating the inventory and recording the closure

Forgotten systems, still running and unpatched, are a common entry point for attackers.

**Key takeaway:** Monitor continuously while the system lives, and close it down deliberately when it ends.
