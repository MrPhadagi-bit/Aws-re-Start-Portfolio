# AWS SimuLearn: Core Security Concepts — Lab Documentation

> **Completed:** June 11, 2026  
> **Awarded to:** Phadagi Mannda Raven  
> **Issued by:** AWS Training & Certification — Michelle Vaz, Director, AWS Training & Certification

![AWS SimuLearn: Core Security Concepts Completion Certificate](aws_simulearn_certificate.png)

---

## Table of Contents

1. [Course Overview](#course-overview)
2. [Learning Objectives](#learning-objectives)
3. [Learning Phase](#learning-phase)
4. [Hands-On Lab: Guided Simulation](#hands-on-lab-guided-simulation)
5. [DIY Challenge (Do-It-Yourself)](#diy-challenge-do-it-yourself)
6. [Key Concepts & Services Covered](#key-concepts--services-covered)
7. [Skills Developed](#skills-developed)
8. [Reflection & Takeaways](#reflection--takeaways)

---

## Course Overview

**AWS SimuLearn: Core Security Concepts** is an AI-powered, hands-on simulation course designed by AWS Training & Certification. Unlike traditional video-based training, SimuLearn immerses learners in realistic AWS cloud scenarios where they must design and implement security solutions using actual AWS services.

The course focuses on foundational AWS security services including **IAM (Identity and Access Management)**, **EC2 (Elastic Compute Cloud)**, and **RDS (Relational Database Service)** — giving learners practical experience in securing cloud resources. citeweb_search:1#1

| Attribute | Details |
|-----------|---------|
| **Course Type** | AI-Powered Hands-On Simulation |
| **Duration** | Self-paced (typically 2–4 hours) |
| **Level** | Beginner to Intermediate |
| **Prerequisites** | Basic AWS Console familiarity |
| **AWS Services** | IAM, EC2, RDS, VPC, Security Groups, NACLs |

---

## Learning Objectives

By the end of this lab, you will be able to:

- **Design secure IAM policies** — Create and manage users, groups, roles, and custom policies with least-privilege principles.
- **Implement network security** — Configure Security Groups and Network ACLs to segment and protect multi-tier applications.
- **Secure compute resources** — Apply security best practices to EC2 instances including key pair management and IAM instance profiles.
- **Protect data at rest and in transit** — Configure encryption for RDS databases and S3 storage.
- **Apply defense-in-depth strategies** — Layer multiple security controls (identity, network, encryption, monitoring) for comprehensive protection.

---

## Learning Phase

The learning phase of AWS SimuLearn is structured around an **interactive narrative-driven simulation**. Here's how it was conducted:

### Phase 1: Concept Introduction
- **Format:** Interactive reading modules embedded within the simulation
- **Content:** Core security concepts including:
  - The AWS Shared Responsibility Model
  - Principle of Least Privilege
  - Defense in Depth architecture
  - Encryption fundamentals (at-rest vs. in-transit)

### Phase 2: Guided Walkthrough
- **Format:** Step-by-step AI-guided simulation in a sandboxed AWS environment
- **Approach:** The learner is placed in a realistic scenario (e.g., "You are a Security Engineer at a startup launching a rare bookstore application")
- **Activities:**
  1. **IAM Foundation** — Create users, groups, and attach managed policies
  2. **Custom Policy Creation** — Build customer-managed policies for granular access control
  3. **Network Segmentation** — Create VPCs, subnets, Internet Gateways, and route tables
  4. **Security Group Configuration** — Define inbound/outbound rules for application tiers
  5. **NACL Implementation** — Add subnet-level traffic filtering as a secondary defense layer
  6. **Data Protection** — Configure VPC Endpoints and encryption for S3/RDS access

### Phase 3: Knowledge Checks
- Interactive quizzes embedded throughout to reinforce concepts
- Scenario-based questions requiring application of security principles

---

## Hands-On Lab: Guided Simulation

### Lab 1: IAM User & Group Management
**Duration:** ~45 minutes

| Step | Action | Expected Outcome |
|------|--------|------------------|
| 1 | Navigate to IAM Console | Access to Identity & Access Management dashboard |
| 2 | Create IAM Users | Users created with programmatic and console access |
| 3 | Create IAM Groups | Groups organized by role (e.g., `SupportEngineers`, `Developers`) |
| 4 | Attach Managed Policies | Policies like `AmazonEC2ReadOnlyAccess` attached to groups |
| 5 | Use IAM Sign-In Link | Test user login via custom IAM URL |

**Key Learning:** Understanding the difference between IAM users, groups, roles, and policies. The IAM sign-in link allows users to access the console with their specific permissions. citeweb_search:1#2

---

### Lab 2: Custom Policy & Access Control
**Duration:** ~30 minutes

| Step | Action | Expected Outcome |
|------|--------|------------------|
| 1 | Create Customer-Managed Policy | JSON policy defining specific EC2 and S3 permissions |
| 2 | Create Group with Custom Policy | Group controlled entirely by custom policy |
| 3 | Assign Users to Group | Users inherit permissions through group membership |
| 4 | Test Access Boundaries | Verify users can only perform allowed actions |

**Scenario Context:** Acting as a security engineer for a startup, setting up a development team with proper access permissions while maintaining security boundaries. citeweb_search:1#2

---

### Lab 3: VPC & Network Security
**Duration:** ~90 minutes

| Step | Action | Expected Outcome |
|------|--------|------------------|
| 1 | Create a VPC | Isolated network with custom CIDR block |
| 2 | Create Internet Gateway | Public internet access attached to VPC |
| 3 | Create Public Subnets | Subnets across multiple Availability Zones |
| 4 | Configure Route Tables | Traffic routing between subnets and IGW |
| 5 | Create NACL | Subnet-level stateless traffic filtering |
| 6 | Configure Security Groups | Instance-level stateful traffic filtering |

**Key Learning:** Understanding the relationship between VPC components and how Security Groups (stateful, instance-level) complement NACLs (stateless, subnet-level) for defense in depth. citeweb_search:1#2

---

### Lab 4: Data Security & VPC Endpoints
**Duration:** ~30 minutes

| Step | Action | Expected Outcome |
|------|--------|------------------|
| 1 | Identify Public Traffic Paths | Map how S3/RDS traffic leaves the VPC |
| 2 | Create VPC Endpoint | Private link between VPC and AWS service |
| 3 | Configure Endpoint Policy | Restrict which buckets can be accessed |
| 4 | Enable Encryption | Server-side encryption (SSE-S3 or SSE-KMS) |
| 5 | Verify Private Connectivity | Confirm traffic no longer traverses public internet |

**Key Learning:** VPC Endpoints keep traffic on the AWS backbone network, eliminating exposure to the public internet and reducing attack surface. citeweb_search:1#2

---

## DIY Challenge (Do-It-Yourself)

The DIY (Do-It-Yourself) challenge is the **capstone assessment** of the SimuLearn course. Unlike the guided simulation, the DIY phase presents a complex scenario with minimal step-by-step instructions, requiring independent application of all learned concepts.

### DIY Scenario Structure

Based on the AWS Cloud Quest pattern (which shares the SimuLearn framework), the DIY challenge typically follows this structure: citeweb_search:1#3

```
┌─────────────────────────────────────────────────────────────┐
│                    DIY CHALLENGE FLOW                        │
├─────────────────────────────────────────────────────────────┤
│  1. READ SCENARIO                                            │
│     → Understand the business context and security goals     │
│                                                              │
│  2. ANALYZE CURRENT STATE                                    │
│     → Review existing infrastructure and identify gaps     │
│                                                              │
│  3. PLAN SECURITY ARCHITECTURE                             │
│     → Design IAM policies, network rules, and encryption     │
│                                                              │
│  4. IMPLEMENT SOLUTIONS                                      │
│     → Execute changes in the AWS sandbox environment       │
│                                                              │
│  5. VALIDATE & TEST                                          │
│     → Verify security controls work as intended            │
│                                                              │
│  6. SUBMIT FOR VALIDATION                                    │
│     → AI evaluates completion and provides feedback        │
└─────────────────────────────────────────────────────────────┘
```

### Sample DIY Challenge Steps

**Challenge:** Secure a multi-tier web application (Web Tier + App Tier + Database Tier)

1. **Open IAM Console** → Navigate to User Groups
2. **Select `SupportEngineers` Group** → Click **Attach Policies**
3. **Create Custom Policy** with least-privilege access to EC2 and CloudWatch
4. **Configure Security Groups:**
   - Web Tier SG: Allow HTTP(80)/HTTPS(443) from `0.0.0.0/0`
   - App Tier SG: Allow traffic only from Web Tier SG
   - DB Tier SG: Allow traffic only from App Tier SG on port 3306
5. **Create NACL Rules:**
   - Inbound: Allow ephemeral ports, deny unnecessary ranges
   - Outbound: Restrict to necessary destinations
6. **Enable RDS Encryption** → Configure KMS key for database encryption
7. **Create VPC Endpoint** for S3 to avoid public internet for backups
8. **Test End-to-End** → Verify application functionality with security controls active

### DIY Validation Criteria

The AI simulation validates:
- ✅ IAM policies follow least-privilege principles
- ✅ Network segmentation is properly implemented
- ✅ Encryption is enabled for sensitive data
- ✅ No unintended public access points exist
- ✅ Application remains functional after security hardening

---

## Key Concepts & Services Covered

### Core AWS Services

| Service | Security Role | Lab Application |
|---------|--------------|-----------------|
| **IAM** | Identity & Access Management | User/group creation, policy attachment, role assumption |
| **EC2** | Compute Security | Security Groups, key pairs, IAM instance profiles |
| **RDS** | Database Security | Encryption at rest, security group rules, parameter groups |
| **VPC** | Network Isolation | Subnet creation, route tables, Internet Gateways |
| **Security Groups** | Instance-Level Firewall | Stateful filtering for application tiers |
| **NACLs** | Subnet-Level Firewall | Stateless filtering as secondary defense |
| **VPC Endpoints** | Private Connectivity | Keep AWS service traffic off public internet |
| **S3** | Object Storage Security | Bucket policies, encryption, access logging |
| **KMS** | Key Management | Customer-managed keys for encryption |

### Security Principles Applied

1. **Shared Responsibility Model** — AWS secures the cloud; you secure IN the cloud
2. **Least Privilege** — Grant only necessary permissions
3. **Defense in Depth** — Layer multiple security controls
4. **Encryption Everywhere** — Data at rest AND in transit
5. **Network Segmentation** — Isolate tiers with Security Groups and NACLs

---

## Skills Developed

### Technical Skills
- 🔐 **IAM Policy Authoring** — JSON policy syntax and evaluation logic
- 🌐 **Network Architecture** — VPC design with multi-AZ deployment
- 🛡️ **Firewall Configuration** — Security Group and NACL rule optimization
- 🔑 **Encryption Management** — KMS key policies and encryption configuration
- 🔍 **Security Auditing** — Identifying and remediating misconfigurations

### Soft Skills
- 🧩 **Problem-Solving** — Analyzing complex security scenarios
- 📋 **Documentation** — Recording security architecture decisions
- 🤝 **Role-Based Thinking** — Acting as a Security Engineer in realistic contexts
- ⚡ **Time Management** — Prioritizing security controls under constraints

---

## Reflection & Takeaways

### What Made This Lab Effective

1. **Immersive Simulation** — The AI-powered environment reacts to decisions in real-time, providing immediate feedback on security choices.

2. **Narrative Context** — Working within a startup scenario (rare bookstore application) made abstract security concepts concrete and memorable.

3. **Progressive Complexity** — Starting with basic IAM and building to multi-tier network security created a solid learning curve.

4. **DIY Challenge** — The independent capstone forced synthesis of all concepts, cementing knowledge through application.

### Key Takeaways for Real-World Application

> *"Security is not a product, but a process."* — Bruce Schneier

- **Always start with IAM** — Identity is the perimeter in cloud security
- **Layer your defenses** — Security Groups + NACLs + Encryption = robust protection
- **Minimize public exposure** — VPC Endpoints and private subnets reduce attack surface
- **Test your assumptions** — Validate that security controls don't break functionality
- **Document everything** — Security architectures must be auditable and reproducible

### Next Steps

After completing this SimuLearn course, recommended follow-up learning paths:

1. **AWS Certified Cloud Practitioner** — Formal certification validating foundational knowledge
2. **AWS Cloud Quest: Cloud Practitioner** — Extended hands-on challenges
3. **AWS Security Specialty** — Deep dive into advanced security services (WAF, Shield, GuardDuty)
4. **Real-World Projects** — Apply these patterns to personal or professional AWS environments

---

## Appendix: Certificate Verification

| Field | Value |
|-------|-------|
| **Course Name** | AWS SimuLearn: Core Security Concepts |
| **Completion Date** | June 11, 2026 |
| **Recipient** | Phadagi Mannda Raven |
| **Issuing Authority** | AWS Training & Certification |
| **Signatory** | Michelle Vaz, Director, AWS Training & Certification |
| **Certificate Image** | [View Certificate](aws_simulearn_certificate.png) |

---

*This lab documentation was created to serve as a comprehensive reference for the AWS SimuLearn: Core Security Concepts course. It captures the learning journey from guided simulation through independent DIY challenge completion.*

**Tags:** `#AWS` `#CloudSecurity` `#IAM` `#VPC` `#SimuLearn` `#HandsOnLab` `#CyberSecurity` `#AWSTraining`
