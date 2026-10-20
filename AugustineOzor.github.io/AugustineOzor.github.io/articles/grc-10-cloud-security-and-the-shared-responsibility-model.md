---
{
 "title": "Cloud Security and the Shared Responsibility Model",
 "short": "Cloud Security and the Shared Responsibility Model",
 "category": "grc-audit",
 "series": "grc-ground-up",
 "group": "controls",
 "seriesNo": 10,
 "summary": "Moving to the cloud does not move all your security obligations. Here is what the provider covers and what remains yours.",
 "order": 2010,
 "tags": [
  "CloudSecurity",
  "SharedResponsibility",
  "AWS",
  "IAM"
 ]
}
---
Cloud providers secure a great deal, but not everything. The **shared responsibility model** divides the work.

- **The provider is responsible for security *of* the cloud:** physical data centres, hardware, the network backbone and the virtualisation layer.
- **The customer is responsible for security *in* the cloud:** their data, identities and access, operating system patching on virtual servers, network rules, encryption settings and application security.

The split shifts with the service model. With **infrastructure as a service** (such as Amazon EC2), you manage the operating system and everything above it. With **managed services** (such as Amazon RDS for databases), the provider also patches the database engine, but you still control access, encryption and backups. With **software as a service**, you mainly manage users, data and configuration.

## Where breaches actually happen

Most cloud incidents trace back to the customer's side: publicly exposed storage buckets, overly broad IAM permissions, unencrypted data, missing logging or unpatched instances. These are configuration and governance failures, not provider failures.

## Example: OpenMRS on AWS

For a medical records system on EC2 with an RDS database, AWS secures the facilities and hardware. The hospital must still enforce least-privilege IAM roles, restrict security groups, encrypt the database and backups with KMS, enable CloudTrail logging, patch the EC2 instances and review access regularly.

**Key takeaway:** In the cloud you inherit the provider's infrastructure controls, but configuration, identity and data remain your job.
