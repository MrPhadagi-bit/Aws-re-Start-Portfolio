# Create Subnets and Allocate IP Addresses in an Amazon Virtual Private Cloud (Amazon VPC)

## Table of Contents
- [Objectives](#objectives)
- [Duration](#duration)
- [Scenario](#scenario)
- [Prerequisites](#prerequisites)
- [Key Concepts](#key-concepts)
- [Task 1: Investigate the Customer's Needs and Build the VPC](#task-1-investigate-the-customers-needs-and-build-the-vpc)
  - [Step 1: Analyze the Requirements](#step-1-analyze-the-requirements)
  - [Step 2: Determine the CIDR Blocks](#step-2-determine-the-cidr-blocks)
  - [Step 3: Access the AWS Management Console](#step-3-access-the-aws-management-console)
  - [Step 4: Launch the VPC Wizard](#step-4-launch-the-vpc-wizard)
  - [Step 5: Configure the VPC](#step-5-configure-the-vpc)
  - [Step 6: Verify the VPC Creation](#step-6-verify-the-vpc-creation)
- [Task 2: Summarize and Describe Your Findings (Group Activity)](#task-2-summarize-and-describe-your-findings-group-activity)
- [Summary](#summary)
- [Additional Resources](#additional-resources)
- [Cleanup](#cleanup)

---

## Objectives

In this lab, you will:

- Summarize the customer scenario and identify networking requirements
- Create an Amazon Virtual Private Cloud (Amazon VPC) with appropriate CIDR blocks
- Understand how to create subnets and allocate IP addresses using CIDR notation
- Familiarize yourself with the Amazon Web Services (AWS) Management Console
- Develop a solution to the customer's networking issue
- Summarize and describe your findings (group activity)

---

## Duration

This lab requires approximately **1 hour** to complete.

---

## Scenario

Your role is a **Cloud Support Engineer** at AWS. During your shift, a customer from a startup company requests assistance regarding a networking issue within their AWS infrastructure.

### Ticket from Your Customer

> **From:** Paulo Santos, Startup Owner  
> **Subject:** Help Setting Up a VPC
>
> Hello, Cloud Support!
>
> I'm new to AWS, and I need help setting up a VPC. Can you please help me through the setup process? I would like to build only the VPC part and would like to make it look something like the following picture. Can you help me ensure I have around **15,000 private IP addresses** in this VPC available? I would also like the VPC IPv4 CIDR block to be a **192.x.x.x**. I don't remember which is a private range though. Can you confirm that? I would also like to allocate at least **50 IP addresses** for the public subnet.
>
> Thanks!  
> Paulo Santos  
> Startup Owner

### Customer Diagram

The customer's VPC architecture consists of:
- A VPC that requires **15,000 IP addresses** (for the Seattle office headquarters)
- An **Internet Gateway** for external connectivity
- A **public subnet** that requires **50 IP addresses** (for the operations department)

```
┌─────────────────────────────────────────────────────────────┐
│                      VPC (192.168.0.0/18)                    │
│                    ~16,384 Private IP Addresses              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │           Public Subnet (192.168.1.0/26)             │    │
│  │              ~64 IP Addresses (≥50 required)          │    │
│  │                                                       │    │
│  │  [Internet Gateway] ◄──► [EC2 Instances]              │    │
│  │                                                       │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

Before starting this lab, you should:
- Have a basic understanding of IP addressing and subnetting concepts
- Be familiar with CIDR (Classless Inter-Domain Routing) notation
- Have access to an AWS account with permissions to create VPC resources

---

## Key Concepts

### What is a VPC?
A **Virtual Private Cloud (VPC)** is like a data center in the cloud. It is logically isolated from other virtual networks, and you can use a VPC to launch AWS resources within minutes.

### How Resources Communicate
- Resources within a VPC communicate with each other through **private IP addresses**
- An instance needs a **public IP address** to communicate outside the VPC
- The VPC needs networking resources (e.g., **Internet Gateway**, **Route Table**) for instances to reach the internet

### CIDR Block
A **CIDR block** is a range of private IP addresses used within the VPC (e.g., `192.168.0.0/18`). The number after the slash (`/18`) indicates the netmask, which determines how many IP addresses are available.

### Subnet
A **subnet** is a range of IP addresses within your VPC. Subnets can be public (accessible from the internet) or private (isolated from the internet).

### Private IP Address Ranges (RFC 1918)
According to [RFC 1918](https://datatracker.ietf.org/doc/html/rfc1918), the following ranges are reserved for private networks:

| Range | CIDR Notation | Total IPs |
|-------|--------------|-----------|
| 10.0.0.0 – 10.255.255.255 | 10.0.0.0/8 | 16,777,216 |
| 172.16.0.0 – 172.31.255.255 | 172.16.0.0/12 | 1,048,576 |
| **192.168.0.0 – 192.168.255.255** | **192.168.0.0/16** | **65,536** |

> **Note:** The customer specifically requested a `192.x.x.x` range, which falls under the `192.168.0.0/16` private range.

### CIDR Block Size Reference

| CIDR | Total IP Addresses | Usable IP Addresses* |
|------|---------------------|----------------------|
| /16 | 65,536 | 65,531 |
| /17 | 32,768 | 32,763 |
| /18 | 16,384 | 16,379 |
| /19 | 8,192 | 8,187 |
| /20 | 4,096 | 4,091 |
| /21 | 2,048 | 2,043 |
| /22 | 1,024 | 1,019 |
| /23 | 512 | 507 |
| /24 | 256 | 251 |
| /25 | 128 | 123 |
| /26 | 64 | 59 |
| /27 | 32 | 27 |
| /28 | 16 | 11 |

\* AWS reserves 5 IP addresses in each subnet (first 4 and last 1).

### Why Use Private IP Addresses?
Private IP addresses are **not reachable over or from the internet**. This keeps your resources and their communication private within the VPC, enhancing security.

### Public vs. Private Subnets

| Feature | Public Subnet | Private Subnet |
|---------|--------------|----------------|
| Internet Access | Yes (via Internet Gateway) | No (or via NAT Gateway) |
| Public IP | Instances can have public IPs | Instances use only private IPs |
| Use Case | Web servers, load balancers | Databases, application servers |

---

## Task 1: Investigate the Customer's Needs and Build the VPC

### Step 1: Analyze the Requirements

Let's break down Paulo's requirements:

| Requirement | Details |
|-------------|---------|
| **VPC IP Range** | ~15,000 private IP addresses |
| **IP Range Preference** | Must be in `192.x.x.x` (RFC 1918 private range) |
| **Public Subnet** | At least 50 IP addresses |
| **Configuration** | VPC with a single public subnet |

### Step 2: Determine the CIDR Blocks

#### VPC CIDR Block

To accommodate **15,000 IP addresses** in the `192.168.x.x` range:

- `192.168.0.0/18` provides **16,384 IP addresses** (the next closest option above 15,000)
- This fits within the `192.168.0.0/16` private range

> **Verification:** Use the [Subnet Calculator](https://www.subnet-calculator.com/) to verify: `192.168.0.0/18` gives you 16,384 total addresses.

#### Public Subnet CIDR Block

The public subnet must:
- Be **smaller** than the VPC CIDR block
- Provide **at least 50 IP addresses**

- `192.168.1.0/26` provides **64 IP addresses** (meets the ≥50 requirement)
- This is a valid subset of `192.168.0.0/18`

> **Verification:** `192.168.1.0/26` is within `192.168.0.0/18` and provides 64 IPs (59 usable after AWS reservations).

### Step 3: Access the AWS Management Console

1. Log in to the **AWS Management Console**
2. In the search bar at the top-left, type **VPC** and select it from the list

   > **Tip:** Alternatively, navigate to **Services** → **Networking & Content Delivery** → **VPC**

### Step 4: Launch the VPC Wizard

1. In the **Amazon VPC Dashboard**, click the **Launch VPC Wizard** button
2. Review the four VPC configuration options available:
   - VPC with a Single Public Subnet
   - VPC with Public and Private Subnets
   - VPC with Public and Private Subnets and Hardware VPN Access
   - VPC with a Private Subnet Only and Hardware VPN Access

   > **Question:** Which configuration best fits Paulo's needs?
   > 
   > **Answer:** **VPC with a Single Public Subnet** — Paulo needs a public subnet for his operations department and does not require private subnets at this time.

3. Select **VPC with a Single Public Subnet**
4. Click **Select** to proceed to configuration

### Step 5: Configure the VPC

Fill in the following configuration options:

| Configuration Option | Value | Explanation |
|---------------------|-------|-------------|
| **IPv4 CIDR block** | `192.168.0.0/18` | Provides 16,384 IPs (≥15,000 required) |
| **IPv6 CIDR block** | No IPv6 CIDR Block | IPv6 not needed for this lab |
| **VPC name** | `First VPC` | Customer-friendly name |
| **Public subnet's IPv4 CIDR** | `192.168.1.0/26` | Provides 64 IPs (≥50 required) |
| **Availability Zone** | No Preference | AWS will select an AZ automatically |
| **Subnet name** | `Public subnet` | Descriptive name for the subnet |
| **Remaining options** | Default settings | No changes needed |

#### Configuration Summary:

```
VPC Configuration:
├── Name: First VPC
├── IPv4 CIDR: 192.168.0.0/18 (16,384 IPs)
├── IPv6 CIDR: None
├── Subnet:
│   ├── Name: Public subnet
│   ├── IPv4 CIDR: 192.168.1.0/26 (64 IPs)
│   └── Availability Zone: Auto-selected
└── Internet Gateway: Automatically created
```

5. Click **Create VPC** at the bottom right

### Step 6: Verify the VPC Creation

1. You should see a success message: **"VPC Successfully Created"**
2. In the left navigation menu, click **Your VPCs**
3. Verify that **First VPC** (`192.168.0.0/18`) is listed
4. Click **Subnets** in the left navigation menu
5. Verify that **Public subnet** (`192.168.1.0/26`) is listed and associated with your VPC

---

## Task 2: Summarize and Describe Your Findings (Group Activity)

### Activity Instructions

In groups of two, complete the following role-play exercise:

| Role | Responsibility |
|------|---------------|
| **Person 1 (Paulo Santos)** | Act as the customer. Ask clarifying questions about the VPC setup, CIDR choices, and why specific values were selected. |
| **Person 2 (Cloud Support Engineer)** | Walk through the VPC creation process, explaining each decision and how it meets the customer's requirements. |

### Discussion Points

1. **Why was `192.168.0.0/18` chosen for the VPC?**
   - It provides 16,384 IP addresses, which is the closest option above the 15,000 requirement
   - It falls within the RFC 1918 private range (`192.168.0.0/16`)

2. **Why was `192.168.1.0/26` chosen for the public subnet?**
   - It provides 64 IP addresses, which exceeds the 50 IP minimum
   - It is a valid subset of the VPC CIDR block (`192.168.0.0/18`)
   - AWS reserves 5 IPs, leaving 59 usable addresses

3. **What is the difference between a public and private subnet?**
   - Public subnets allow internet access via an Internet Gateway
   - Private subnets isolate instances from direct internet access

4. **What happens if Paulo needs more than 15,000 IPs later?**
   - He can add additional CIDR blocks to the VPC (if they don't overlap)
   - Or create a new VPC with a larger CIDR block (e.g., `/16`)

> **Duration:** This activity should take approximately **30 minutes**.
>
> **Note:** If a group activity is not possible, present your findings to the class or document your explanations in a brief summary.

---

## Summary

In this lab, you successfully:

✅ Analyzed a customer scenario and identified networking requirements  
✅ Determined appropriate CIDR blocks using subnetting principles  
✅ Created a VPC (`192.168.0.0/18`) with 16,384 private IP addresses  
✅ Created a public subnet (`192.168.1.0/26`) with 64 IP addresses  
✅ Verified the VPC and subnet creation in the AWS Management Console  
✅ Understood the difference between public and private subnets  

### Key Takeaways

| Concept | Key Point |
|---------|-----------|
| **RFC 1918** | `192.168.0.0/16` is a valid private IP range |
| **VPC CIDR** | `/18` provides 16,384 IPs (closest to 15,000 requirement) |
| **Subnet CIDR** | Must be smaller than VPC CIDR; `/26` provides 64 IPs |
| **Public Subnet** | Requires an Internet Gateway for external access |
| **AWS Reservations** | 5 IPs are reserved per subnet (first 4 and last 1) |

---

## Additional Resources

- [RFC 1918 - Address Allocation for Private Internets](https://datatracker.ietf.org/doc/html/rfc1918)
- [Subnet Calculator](https://www.subnet-calculator.com/)
- [AWS VPC Documentation](https://docs.aws.amazon.com/vpc/)
- [AWS VPC User Guide - CIDR Blocks](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-cidr-blocks.html)
- [AWS VPC and Subnet Sizing](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Subnets.html#VPC_Sizing)

---

## Cleanup

> **⚠️ Important:** To avoid incurring unnecessary charges, delete the resources created in this lab if they are no longer needed.

### Steps to Clean Up:

1. Navigate to the **VPC Dashboard** in the AWS Management Console
2. Delete the **Internet Gateway** (detach first, then delete)
3. Delete the **Public subnet**
4. Delete the **VPC** (`First VPC`)

> **Note:** Ensure all dependent resources (e.g., EC2 instances, route tables) are deleted before removing the VPC.

---

*Lab created for AWS Cloud Support Engineer training. Last updated: June 2026.*
