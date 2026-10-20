---
{
 "title": "Defining the System Boundary and Following the Data",
 "short": "Defining the System Boundary and Following the Data",
 "category": "grc-audit",
 "series": "grc-ground-up",
 "group": "rmf",
 "seriesNo": 12,
 "summary": "You cannot protect a system you have not defined. How to draw the boundary and map the flow of sensitive data.",
 "order": 2012,
 "tags": [
  "SystemBoundary",
  "DataFlow",
  "NISTRMF",
  "OpenMRS"
 ]
}
---
Before choosing a single control, you need to know exactly what the system is. The **authorisation boundary** defines which components are in scope and therefore covered by the system's controls and authorisation.

## What to capture

- **Purpose:** the mission or business function the system supports.
- **Components:** servers, databases, applications, network segments and cloud services.
- **People:** user groups, administrators and support teams.
- **Interconnections:** other systems the system exchanges data with, such as laboratory systems, billing platforms or identity providers.
- **Data:** the types of information stored and processed, and their sensitivity.

## Follow the data

A **data flow diagram** traces sensitive data from the moment it enters to the moment it is deleted. For a patient record, that means registration at the front desk, storage in the database, access by clinicians, transfer to a laboratory system, backup, archiving and eventual disposal.

Each step and each **trust-boundary crossing** (for example, data leaving your network for a third party) is a place where controls are needed: encryption in transit, access control, logging, or an agreement with the receiving party.

## Common pitfalls

Boundaries drawn too narrowly leave risky components (such as backup storage or admin workstations) unprotected. Boundaries drawn too widely make the system impossible to assess. Undocumented interconnections are a frequent audit finding.

**Key takeaway:** Draw the boundary deliberately, then follow the data across it. Every crossing is a control decision.
