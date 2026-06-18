# Lab: Compare and Contrast Automation and Orchestration

> **Course:** IT Infrastructure & DevOps Fundamentals  
> **Lab Duration:** 30 minutes  
> **Date:** 2026-06-18  
> **Objective:** Understand the relationship, similarities, and differences between software automation and software orchestration by researching and categorizing key concepts.

## Lab Overview

**Software automation** and **software orchestration** are closely related disciplines in modern IT and DevOps, but they operate at fundamentally different scales and scopes.

- **Automation** focuses on executing individual, repeatable tasks without human intervention. It is task-centric.
- **Orchestration** focuses on coordinating and managing multiple automated tasks, systems, and services across complex workflows. It is process- and workflow-centric.

> **Analogy:** Automation is like a single musician playing an instrument perfectly. Orchestration is the conductor coordinating the entire orchestra to perform a symphony.

In this lab, you will:

- Research automation and orchestration concepts independently (in groups).
- Categorize a list of keywords and concepts as belonging to **Automation (A)**, **Orchestration (O)**, or **Both (B)**.
- Provide evidence-based reasoning for each categorization.

---

## Key Definitions

| Term | Definition |
|------|------------|
| **Automation** | The use of technology to perform tasks with minimal human intervention. Typically focused on single, discrete tasks (e.g., running a script, deploying a server). |
| **Orchestration** | The automated configuration, coordination, and management of computer systems, middleware, and services. It manages multi-step workflows across multiple systems. |
| **Infrastructure as Code (IaC)** | Managing and provisioning infrastructure through machine-readable definition files (e.g., Terraform, CloudFormation). |
| **Workflow** | A sequence of connected steps or processes that achieve a specific outcome. |
| **Provisioning** | The process of setting up IT infrastructure (servers, storage, network) and making it available for use. |

---

## Exercise 1: Research Automation & Orchestration

### Instructions

1. **Divide into groups:** The class will split into an even number of groups.
   - **Group A:** Half of the groups will research **automation**.
   - **Group B:** Half of the groups will research **orchestration**.
2. **Research Time:** Spend **15 minutes** researching your assigned topic.
3. **Focus Areas:** Look for the following keywords and determine whether they belong to **Automation (A)**, **Orchestration (O)**, or **Both (B)**.
4. **Document Your Reasoning:** For each keyword, write a brief justification based on your research.

### Research Notes Template

Use the table below to record your findings during the research phase.

| Keyword | A | O | B | Reason / Evidence |
|---------|---|---|---|-------------------|
| Management | ☐ | ☐ | ☐ | |
| Python Script | ☐ | ☐ | ☐ | |
| Provisioning | ☐ | ☐ | ☐ | |
| Code | ☐ | ☐ | ☐ | |
| Single task | ☐ | ☐ | ☐ | |
| Process Coordination | ☐ | ☐ | ☐ | |
| Infrastructure | ☐ | ☐ | ☐ | |
| HCL Configuration Language | ☐ | ☐ | ☐ | |
| Eliminate repetition | ☐ | ☐ | ☐ | |
| User-defined function | ☐ | ☐ | ☐ | |
| Increase reliability | ☐ | ☐ | ☐ | |
| Terraform | ☐ | ☐ | ☐ | |
| Version control | ☐ | ☐ | ☐ | |
| Unit test | ☐ | ☐ | ☐ | |
| Decrease IT cost | ☐ | ☐ | ☐ | |
| Thread creation | ☐ | ☐ | ☐ | |
| Decrease friction among teams | ☐ | ☐ | ☐ | |
| Increase productivity | ☐ | ☐ | ☐ | |
| PyCharm | ☐ | ☐ | ☐ | |
| Workflow | ☐ | ☐ | ☐ | |

> **Tip:** Use reputable sources such as official documentation (HashiCorp, Red Hat, AWS, Microsoft Azure), DevOps textbooks, or peer-reviewed articles.

---

## Exercise 2: Compare and Contrast

### Instructions

1. The instructor will draw **three columns** on the whiteboard (or digital equivalent):
   - **Column 1:** Automation
   - **Column 2:** Both
   - **Column 3:** Orchestration
2. As a class, go through each keyword from Exercise 1.
3. **Place each keyword** in the appropriate column based on your research.
4. **Verbally defend** your placement with reasoning. Be prepared to discuss and potentially move items if the class reaches a different consensus.

### Whiteboard Layout

```
+-------------------+-------------------+-------------------+
|    Automation     |       Both        |   Orchestration   |
+-------------------+-------------------+-------------------+
|                   |                   |                   |
|                   |                   |                   |
|                   |                   |                   |
+-------------------+-------------------+-------------------+
```

### Discussion Prompts

- Why did certain keywords land in the "Both" column?
- What is the boundary between automation and orchestration?
- Can orchestration exist without automation? Why or why not?
- How do tools like Terraform blur the line between automation and orchestration?

---

## Research Summary & Reasoning

> **Note:** The following section provides a reference guide based on industry-standard definitions. Use this to validate your research and class discussions.

### Categorization Guide

| Keyword | Category | Reasoning |
|---------|----------|-----------|
| **Management** | **Both (B)** | Both automation and orchestration involve managing resources, but at different scales. Automation manages individual tasks; orchestration manages complex systems and services. |
| **Python Script** | **Automation (A)** | A Python script typically automates a single task or a small sequence of tasks. It is a building block of automation. |
| **Provisioning** | **Both (B)** | Provisioning can be automated (e.g., spinning up one VM) or orchestrated (e.g., provisioning an entire multi-tier application stack across regions). |
| **Code** | **Both (B)** | Both automation scripts and orchestration definitions are written as code (e.g., Bash, Python, YAML, HCL, JSON). |
| **Single task** | **Automation (A)** | By definition, automation targets discrete, individual tasks. Orchestration coordinates multiple tasks. |
| **Process Coordination** | **Orchestration (O)** | Coordination of multiple processes across systems is the core definition of orchestration. |
| **Infrastructure** | **Both (B)** | Infrastructure can be automated (single server deployment) or orchestrated (multi-cloud infrastructure with networking, storage, and compute). |
| **HCL Configuration Language** | **Both (B)** | HCL (HashiCorp Configuration Language) is used by Terraform, which automates infrastructure provisioning but also orchestrates complex, multi-resource dependencies. |
| **Eliminate repetition** | **Automation (A)** | The primary goal of automation is to eliminate manual, repetitive tasks. |
| **User-defined function** | **Automation (A)** | Functions (in scripts or code) are modular units of automation. They encapsulate repeatable logic. |
| **Increase reliability** | **Both (B)** | Both automation (consistent task execution) and orchestration (consistent workflow execution) increase system reliability. |
| **Terraform** | **Both (B)** | Terraform automates resource creation, but its dependency graph and multi-resource management make it an orchestration tool as well. |
| **Version control** | **Both (B)** | Both automation scripts and orchestration definitions are stored in version control (e.g., Git) for tracking and collaboration. |
| **Unit test** | **Automation (A)** | Unit testing is the automated verification of individual components of code. It is a form of quality assurance automation. |
| **Decrease IT cost** | **Both (B)** | Both reduce costs: automation by reducing manual labor on tasks, orchestration by optimizing resource utilization and reducing operational overhead. |
| **Thread creation** | **Automation (A)** | Thread creation is a low-level, programmatic task typically handled by automated scripts or applications, not orchestration platforms. |
| **Decrease friction among teams** | **Orchestration (O)** | Orchestration standardizes and coordinates workflows across teams (Dev, Ops, Security), reducing handoff friction. |
| **Increase productivity** | **Both (B)** | Automation increases productivity by speeding up tasks; orchestration increases productivity by streamlining complex, cross-system workflows. |
| **PyCharm** | **Automation (A)** | PyCharm is an IDE used to write and run Python scripts, which are primarily automation tools. It is not an orchestration platform. |
| **Workflow** | **Orchestration (O)** | Workflows are the defining characteristic of orchestration—the sequencing and coordination of multiple steps. |

### Visual Summary: The Automation vs. Orchestration Spectrum

```
┌─────────────────────────────────────────────────────────────────┐
│                        SCOPE / SCALE                            │
├─────────────────────────────────────────────────────────────────┤
│  Narrow / Task-Level          →          Broad / System-Level   │
│                                                                 │
│  [Automation] ────────────────────────→ [Orchestration]         │
│                                                                 │
│  • Single task                    •   Multi-step workflows      │
│  • One system                     •   Cross-system coordination │
│  • Script-based                   •   Platform-based (K8s, etc) │
│  • Eliminate repetition           •   Decrease team friction    │
│  • Unit tests                     •   Process coordination      │
│  • Thread creation                •   Service mesh management   │
│                                                                 │
│  [Both] ──────────────────────────────────────────────────────  │
│  • Code / HCL / Version Control  •  Increase reliability        │
│  • Provisioning / Infrastructure  •  Decrease IT cost           │
│  • Management / Productivity      •  Terraform                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Conclusion

### Key Takeaways

1. **Automation is a subset of orchestration.** Orchestration cannot exist without automation, but automation can exist without orchestration.
2. **Scale is the primary differentiator.** Automation handles tasks; orchestration handles workflows and systems.
3. **Tools often blur the lines.** Modern tools like Terraform, Ansible, and Kubernetes perform both automation and orchestration functions.
4. **Both deliver business value** through increased reliability, productivity, and reduced costs—but orchestration specifically addresses cross-team and cross-system complexity.

### Reflection Questions

1. Describe a real-world scenario where you would use **automation only** (no orchestration).
2. Describe a real-world scenario where **orchestration** is required and automation alone is insufficient.
3. How does understanding the difference between automation and orchestration help you choose the right tool for a job?

---

## References & Further Reading

- HashiCorp. (2026). *What is Infrastructure as Code?* https://developer.hashicorp.com/terraform/docs/intro
- Red Hat. (2026). *What is IT orchestration?* https://www.redhat.com/en/topics/automation/what-is-orchestration
- Kubernetes Documentation. (2026). *Kubernetes Concepts: Workloads.* https://kubernetes.io/docs/concepts/workloads/
- Microsoft Azure. (2026). *Automation vs. Orchestration in Cloud Computing.* https://learn.microsoft.com/en-us/azure/
- AWS. (2026). *AWS CloudFormation vs. AWS Systems Manager Automation.* https://docs.aws.amazon.com/

---

>  **STOP**  
> You have successfully completed this lab.

---

*Lab prepared for: IT Infrastructure & DevOps Fundamentals*  
*Date: 2026-06-18*
