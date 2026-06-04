# Internet Protocols - Public and Private IP Addresses

> **AWS Cloud Support Engineer Lab** | Duration: ~1 hour | Difficulty: Beginner

---

##  Objectives

In this lab, you will:

- [x] Summarize and investigate the customer scenario
- [x] Analyze the difference between a **private** and **public** IP address
- [x] Develop a solution to the customer's networking issue
- [x] Summarize and describe your findings *(group activity)*

**Duration:** ~1 hour

---

##  Scenario

### Customer Ticket

> **From:** Jess, Cloud Admin (Fortune 500 Company)
>
> Hello, Cloud Support!
>
> We currently have one VPC with a CIDR range of `10.0.0.0/16`. In this VPC, we have two Amazon EC2 instances: **Instance A** and **Instance B**. Even though both are in the **same subnet** and have the **same configurations**, **Instance A cannot reach the internet**, while **Instance B can**.
>
> I suspect the issue is with the EC2 instances, but I'm not sure.
>
> I also have a question: Can I use a **public IP range** such as `12.0.0.0/16` for a new VPC? Would that cause any issues?
>
> Thanks!  
> — Jess

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      AWS Cloud                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  VPC: 10.0.0.0/16                                     │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Public Subnet                                  │  │  │
│  │  │  ┌─────────────┐      ┌─────────────┐          │  │  │
│  │  │  │ Instance A  │      │ Instance B  │          │  │  │
│  │  │  │  No Internet│      │  Internet  │          │  │  │
│  │  │  └─────────────┘      └─────────────┘          │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                      │                                  │  │
│  │              Internet Gateway (IGW)                    │  │
│  │                      │                                  │  │
│  │                   Internet                             │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

> **Note:** The AWS architecture (routing tables, IGW attachment, subnet configuration) has already been verified as correct. The issue lies elsewhere.

---

##  Task 1: Investigate the Customer's Environment

### Step 1: Access the AWS Management Console

1. Click **Start Lab** at the top of the instructions.
2. Wait for the status to show **"Lab status: ready"**.
3. Click **AWS** to open the AWS Management Console in a new tab.

### Step 2: Navigate to EC2 Instances

1. In the AWS Console search bar, type **EC2** and select it.
   - *Alternative path:* `Services → Compute → EC2`
2. In the left navigation menu, click **Instances**.
3. You should see **two instances**: `Instance A` and `Instance B`.

### Step 3: Inspect Networking Configuration

#### For Each Instance:

1. **Select** the checkbox next to the instance name.
2. Scroll to the **Networking** tab at the bottom of the page.
3. **Record** the following information:

| Property | Instance A | Instance B |
|----------|-----------|-----------|
| **Name** | Instance A | Instance B |
| **Public IPv4 Address** | ? | ? |
| **Private IPv4 Address** | ? | ? |
| **VPC ID** | ? | ? |
| **Subnet ID** | ? | ? |

### Step 4: Analyze the Differences

> ** Hint:** Pay close attention to the **Public IPv4 Address** field. Does one instance have it while the other doesn't?

### Troubleshooting Methodology: OSI Model Mapping

| OSI Layer | AWS Infrastructure | Relevance |
|-----------|-------------------|-----------|
| **Layer 7** – Application | Application | End-user services |
| **Layer 6** – Presentation | Web/App Servers | Data formatting |
| **Layer 5** – Session | EC2 Instances | Session management |
| **Layer 4** – Transport | Security Groups, NACLs | TCP/UDP rules |
| **Layer 3** – Network | Route Tables, IGW, Subnets | IP routing |
| **Layer 2** – Data Link | Route Tables, IGW, Subnets | Frame forwarding |
| **Layer 1** – Physical | Regions, Availability Zones | Physical infrastructure |

> **Approach:** Since the architecture (Layer 3) is confirmed correct, investigate **Layer 5 (EC2 instance configuration)** — specifically the **public IP assignment**.

---

##  Task 2: Connect to the EC2 Instance via SSH

### Prerequisites

- Download the **PPK** (Windows) or **PEM** (Mac/Linux) key file from the lab credentials panel.
- Note the **Public IP address** of the instance you can connect to.

### For Windows Users (PuTTY)

1. Download `labsuser.ppk` from the **Details → Show** panel.
2. Download and open **PuTTY** (`putty.exe`).
3. Configure the session:
   - **Host Name:** `ec2-user@<Public-IP>`
   - **Port:** `22`
   - **Connection → SSH → Auth → Private key file:** Browse to `labsuser.ppk`
4. Click **Open** to connect.

### For macOS / Linux Users (Terminal)

1. Download `labsuser.pem` from the **Details → Show** panel.
2. Set correct permissions on the key file:
   ```bash
   chmod 400 labsuser.pem
   ```
3. Connect via SSH:
   ```bash
   ssh -i labsuser.pem ec2-user@<Public-IP>
   ```

### Verify Internet Connectivity

Once connected, test internet access:

```bash
# Test DNS resolution and connectivity
ping -c 4 google.com

# Or use curl to test HTTP connectivity
curl -I https://aws.amazon.com
```

---

##  Task 3: Send the Response to the Customer (Group Activity)

> **Duration:** 5–10 minutes  
> **Format:** Pair activity (or individual presentation if working solo)

### Activity Setup

| Role | Person | Responsibility |
|------|--------|---------------|
| **Cloud Support Engineer** | Person 1 | Present findings and explain the solution |
| **Customer (Jess)** | Person 2 | Ask clarifying questions, confirm understanding |

### Discussion Points

1. **Root Cause:** Why can Instance B reach the internet but Instance A cannot?
2. **Public vs. Private IP:** What is the difference, and why does it matter?
3. **VPC CIDR Best Practices:** Can you use a public range like `12.0.0.0/16` in a VPC?

### Sample Response Template

Use the following structure to formulate your response to Jess:

```markdown
Dear Jess,

Thank you for reaching out to AWS Cloud Support. I've investigated your environment
and would like to share my findings.

## Finding 1: Internet Connectivity Issue

After reviewing both EC2 instances, I found that:

- **Instance B** has a **Public IPv4 address** assigned and can reach the internet.
- **Instance A** does **NOT** have a **Public IPv4 address** assigned, which is why
  it cannot reach the internet.

### Why This Happens

In AWS, a public subnet allows instances to have public IPs, but each EC2 instance
must have the **"Auto-assign public IP"** setting enabled (or a public IP manually
assigned, such as an Elastic IP) to communicate with the internet via the IGW.

### Recommended Fix

You can resolve this for Instance A by:

1. **Option A:** Enabling **"Auto-assign public IP"** in the subnet settings
   (applies to new instances only).
2. **Option B:** Allocating an **Elastic IP** and associating it with Instance A.
3. **Option C:** Launching a replacement instance with **"Auto-assign public IP"**
   enabled during creation.

## Finding 2: Using Public IP Ranges in a VPC

Regarding your question about using `12.0.0.0/16` (a public IP range) for your VPC:

**Short Answer:** It is technically possible, but it is **strongly discouraged** and
will likely cause issues.

### Why You Should Avoid Public Ranges in VPCs

| Issue | Explanation |
|-------|-------------|
| **Routing Conflicts** | If your VPC uses `12.0.0.0/16`, and the destination `12.x.x.x` exists on the public internet, AWS will route traffic internally instead of to the internet. |
| **RFC 1918 Compliance** | Private IP ranges (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) are designed for internal networks. |
| **Best Practice** | Always use RFC 1918 private ranges for VPC CIDRs to avoid IP conflicts. |

### Recommended CIDR Ranges for VPCs

| Range | Usable IPs | Use Case |
|-------|-----------|----------|
| `10.0.0.0/8` | ~16.7 million | Large enterprise networks |
| `172.16.0.0/12` | ~1 million | Medium-sized networks |
| `192.168.0.0/16` | ~65,000 | Small networks |

Your current VPC using `10.0.0.0/16` follows best practices. 

Please let me know if you need assistance implementing any of these changes.

Best regards,  
AWS Cloud Support Engineer
```

---

##  Key Concepts

### Public vs. Private IP Addresses

| Feature | Public IP Address | Private IP Address |
|---------|------------------|-------------------|
| **Scope** | Globally routable on the internet | Internal network only |
| **Assigned by** | AWS (auto or Elastic IP) | AWS (based on subnet CIDR) |
| **Cost** | Free (auto-assigned) or paid (Elastic IP) | Free |
| **Reachability** | Can access and be accessed from the internet | Only within VPC/VPN/Direct Connect |
| **Example** | `54.123.45.67` | `10.0.1.25` |

### RFC 1918 Private IP Ranges

These ranges are reserved for private networks and should be used for VPC CIDRs:

```
10.0.0.0/8      → 10.0.0.0     – 10.255.255.255
172.16.0.0/12   → 172.16.0.0   – 172.31.255.255
192.168.0.0/16  → 192.168.0.0  – 192.168.255.255
```

>  **Never use public IP ranges** (e.g., `1.0.0.0/8`, `12.0.0.0/8`, etc.) for your VPC CIDR.

---

##  Troubleshooting Guide

### Instance Cannot Reach the Internet

```
□ Is the instance in a public subnet?
□ Is an Internet Gateway (IGW) attached to the VPC?
□ Is the route table configured with 0.0.0.0/0 → IGW?
□ Does the instance have a Public IPv4 address or Elastic IP?
□ Are Security Group outbound rules allowing traffic?
□ Are NACLs allowing inbound/outbound traffic?
```

### Quick Fix: Assign an Elastic IP

```bash
# AWS CLI example (optional)
aws ec2 allocate-address --domain vpc
aws ec2 associate-address --instance-id i-xxxxxxxxxxxxxxxxx --allocation-id eipalloc-xxxxxxxx
```

---

##  FAQ

**Q: Can two instances in the same subnet have different internet access?**
> **A:** Yes. Even in the same subnet, only instances with a public IP (auto-assigned or Elastic IP) can reach the internet through the IGW.

**Q: What happens if I use a public CIDR for my VPC?**
> **A:** Traffic to that IP range will be routed internally within the VPC instead of to the actual public destination, causing connectivity issues.

**Q: Is "Auto-assign public IP" retroactive?**
> **A:** No. It only applies to instances launched *after* the setting is enabled. Existing instances need an Elastic IP.

**Q: What's the difference between a public IP and an Elastic IP?**
> **A:** A public IP is dynamic and changes on stop/start. An Elastic IP is static and persists until released.

---

##  Lab Complete

Congratulations! You have successfully:

- Investigated the customer's networking issue
- Identified the difference between public and private IP addressing
- Understood why public IP ranges should not be used for VPC CIDRs
- Formulated a professional response to the customer

---

##  Additional Resources

- [AWS Docs: VPC and Subnet Basics](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Subnets.html)
- [AWS Docs: Elastic IP Addresses](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html)
- [RFC 1918 - Address Allocation for Private Internets](https://tools.ietf.org/html/rfc1918)
- [AWS Docs: Connect to Linux Instance via SSH](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstancesLinux.html)

---

> **Contributors:** AWS Training & Certification  
> **Last Updated:** 2026-06-04
