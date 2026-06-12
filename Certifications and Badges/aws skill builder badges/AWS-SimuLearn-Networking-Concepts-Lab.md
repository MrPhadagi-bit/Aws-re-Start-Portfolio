# AWS SimuLearn: Networking Concepts - Hands-On Lab

> **Certification:** AWS SimuLearn: Networking Concepts  
> **Completed:** June 02, 2026  
> **Author:** phadagi mannda raven  
> **Lab Duration:** 45-60 minutes  
> **Cost:** Free Tier eligible

---

## Table of Contents

- [Lab Overview](#lab-overview)
- [Learning Objectives](#learning-objectives)
- [Architecture Diagram](#architecture-diagram)
- [Lab 1: VPC and Subnet Creation](#lab-1-vpc-and-subnet-creation)
- [Lab 2: Security Configuration](#lab-2-security-configuration)
- [Lab 3: EC2 Instance Deployment](#lab-3-ec2-instance-deployment)
- [Lab 4: Connectivity Testing](#lab-4-connectivity-testing)
- [Lab 5: DNS and VPC Endpoints](#lab-5-dns-and-vpc-endpoints-optional)
- [Lab 6: Cleanup](#lab-6-cleanup-critical)
- [Troubleshooting Guide](#troubleshooting-guide)
- [Key Concepts Summary](#key-concepts-summary)
- [Certification Mapping](#certification-mapping)
- [Next Steps](#next-steps)

---

## Lab Overview

| Attribute | Details |
|-----------|---------|
| **Course** | AWS SimuLearn: Networking Concepts |
| **Difficulty** | Beginner to Intermediate |
| **Duration** | 45-60 minutes |
| **Cost** | Free Tier eligible (~$0.50 if not) |
| **Prerequisites** | AWS Account, basic AWS Console navigation |

---

## Learning Objectives

By completing this lab, you will:

1. Create and configure a **VPC** with proper IP addressing
2. Understand **public vs. private subnets** and deploy resources in each
3. Configure **Internet Gateways** and **Route Tables** for connectivity
4. Implement **Network ACLs** and **Security Groups** for layered security
5. Test connectivity between resources using **ping** and **SSH**
6. Observe **DNS resolution** within a VPC

---

## Architecture Diagram

```
+-------------------------------------------------------------+
|                      AWS Cloud                               |
|  +-----------------------------------------------------+   |
|  |              VPC: 10.0.0.0/16 (Lab-VPC)              |   |
|  |  +-----------------+    +-------------------------+ |   |
|  |  |  Public Subnet   |    |      Private Subnet      | |   |
|  |  |  10.0.1.0/24    |    |      10.0.2.0/24         | |   |
|  |  |                 |    |                         | |   |
|  |  | +-------------+ |    |  +-----------------+    | |   |
|  |  | |  Bastion    | |    |  |  Private Server |    | |   |
|  |  | |  (EC2)      | |    |  |    (EC2)        |    | |   |
|  |  | |  10.0.1.10  |<|----+--|-> 10.0.2.10     |    | |   |
|  |  | |  Public IP   | |    |  |  No Public IP    |    | |   |
|  |  | +-------------+ |    |  +-----------------+    | |   |
|  |  +--------|--------+    +-------------------------+ |   |
|  |           |                                          |   |
|  |      +----|----+                                     |   |
|  |      |   IGW   | <-- Internet Gateway               |   |
|  |      +----|----+                                     |   |
|  |           |                                          |   |
|  +-----------|------------------------------------------+   |
|              |                                               |
|         +----|----+                                          |
|         | Internet |                                          |
|         +----------+                                          |
+-------------------------------------------------------------+
```

---

## Lab 1: VPC and Subnet Creation

### Step 1.1: Create the VPC

1. Navigate to **VPC Dashboard** -> **Your VPCs** -> **Create VPC**
2. Choose **VPC and more** (automated setup)
3. Configure:

```yaml
VPC settings:
  Name tag: Lab-VPC
  IPv4 CIDR block: 10.0.0.0/16
  IPv6 CIDR block: No IPv6 CIDR block
  Tenancy: Default

Subnet settings:
  Number of Availability Zones: 2 (for high availability practice)
  Number of public subnets: 2
  Number of private subnets: 2
  NAT gateways: None (we'll use bastion host instead)
  VPC endpoints: None
```

> **Documentation Note:** The `/16` CIDR provides 65,536 IP addresses. Public subnets use `/24` (256 IPs) for direct internet access, while private subnets isolate resources.

### Step 1.2: Verify Components

After creation, verify these were automatically created:

- [ ] **Internet Gateway** (IGW) attached to VPC
- [ ] **Public Route Table** with route to `0.0.0.0/0` -> IGW
- [ ] **Private Route Table** (no route to IGW)
- [ ] **Network ACL** (default allows all traffic)

---

## Lab 2: Security Configuration

### Step 2.1: Create Security Groups

**Bastion Security Group (Public Access):**

| Type | Protocol | Port Range | Source | Description |
|------|----------|------------|--------|-------------|
| SSH | TCP | 22 | Your IP/32 | Admin access only |
| ICMP | All | N/A | 10.0.0.0/16 | Allow ping from VPC |

**Private Server Security Group:**

| Type | Protocol | Port Range | Source | Description |
|------|----------|------------|--------|-------------|
| SSH | TCP | 22 | `sg-bastion-id` | Only from Bastion |
| ICMP | All | N/A | `sg-bastion-id` | Allow ping from Bastion |

> **Key Concept:** Security Groups are **stateful**—return traffic is automatically allowed. They operate at the instance level (Layer 4).

### Step 2.2: Configure Network ACL (Optional Advanced)

Navigate to **Network ACLs** -> **Edit inbound rules** for private subnet:

| Rule # | Type | Protocol | Port Range | Source | Allow/Deny |
|--------|------|----------|------------|--------|------------|
| 100 | SSH | TCP | 22 | 10.0.1.0/24 | Allow |
| 200 | ICMP | All | N/A | 10.0.1.0/24 | Allow |
| * | All | All | All | 0.0.0.0/0 | Deny |

> **Key Concept:** NACLs are **stateless**—you must explicitly allow return traffic. They operate at the subnet level (Layer 3/4) and process rules in numerical order.

---

## Lab 3: EC2 Instance Deployment

### Step 3.1: Launch Bastion Host (Public Subnet)

```bash
# Instance Configuration
Name: Bastion-Host
AMI: Amazon Linux 2023
Instance type: t2.micro (Free Tier)
Key pair: Create new or use existing
Network settings:
  VPC: Lab-VPC
  Subnet: Public Subnet 1 (10.0.1.0/24)
  Auto-assign public IP: Enable
  Security group: Bastion-SG
Storage: 8 GB gp2 (default)
```

**User Data Script** (optional, for automated setup):

```bash
#!/bin/bash
yum update -y
yum install -y nc telnet
echo "Bastion host configured" > /var/log/setup.log
```

### Step 3.2: Launch Private Server (Private Subnet)

```bash
# Instance Configuration
Name: Private-Server
AMI: Amazon Linux 2023
Instance type: t2.micro
Key pair: Same key as Bastion
Network settings:
  VPC: Lab-VPC
  Subnet: Private Subnet 1 (10.0.2.0/24)
  Auto-assign public IP: Disable (critical!)
  Security group: Private-SG
Storage: 8 GB gp2
```

> **Critical Learning Point:** Disabling auto-assign public IP ensures the instance remains truly private. It can only be reached through the bastion or NAT.

---

## Lab 4: Connectivity Testing

### Step 4.1: SSH to Bastion Host

```bash
# From your local machine
chmod 400 your-key.pem
ssh -i your-key.pem ec2-user@<BASTION_PUBLIC_IP>
```

### Step 4.2: Test Internet Connectivity from Bastion

```bash
# Test outbound internet (should succeed - public subnet)
ping -c 4 8.8.8.8
curl -I https://aws.amazon.com
```

### Step 4.3: Copy Key to Bastion (Temporary Method)

```bash
# On your local machine, copy the PEM file
scp -i your-key.pem your-key.pem ec2-user@<BASTION_PUBLIC_IP>:/home/ec2-user/
ssh -i your-key.pem ec2-user@<BASTION_PUBLIC_IP>
chmod 400 your-key.pem  # On bastion
```

> **Production Note:** In production, use AWS Systems Manager Session Manager or SSH Agent Forwarding instead of copying keys.

### Step 4.4: SSH from Bastion to Private Server

```bash
# From Bastion host
ssh -i your-key.pem ec2-user@<PRIVATE_SERVER_IP>
# Example: ssh -i your-key.pem ec2-user@10.0.2.10
```

### Step 4.5: Test Private Server Connectivity

```bash
# Test outbound internet (should FAIL - no NAT Gateway)
ping -c 4 8.8.8.8
# Expected: Network is unreachable

# Test internal VPC connectivity (should SUCCEED)
ping -c 4 10.0.1.10  # Bastion private IP
```

---

## Lab 5: DNS and VPC Endpoints (Optional)

### Step 5.1: Observe DNS Resolution

On the **Private Server**:

```bash
# Check AWS DNS server (provided by DHCP in VPC)
cat /etc/resolv.conf
# Should show: nameserver 10.0.0.2 (VPC DNS resolver)

# Test DNS resolution
nslookup s3.amazonaws.com
dig ec2.us-east-1.amazonaws.com
```

> **Key Concept:** The VPC provides DNS resolution at `VPC_CIDR + 2` (e.g., `10.0.0.2`). This enables private DNS resolution without internet access.

### Step 5.2: Create VPC Endpoint for S3 (Gateway)

1. **VPC Dashboard** -> **Endpoints** -> **Create Endpoint**
2. Configure:
   - Service category: AWS services
   - Service: `com.amazonaws.<region>.s3` (Gateway type)
   - VPC: Lab-VPC
   - Route tables: Select private route table

3. Verify: Private route table now has route to S3 prefix list

4. Test on Private Server:

```bash
# This should now work without internet!
aws s3 ls --region <your-region>
```

---

## Lab 6: Cleanup (Critical!)

To avoid charges, delete in this order:

```bash
1. Terminate EC2 instances (Bastion, Private Server)
2. Delete VPC Endpoint (if created)
3. Release Elastic IPs (if allocated)
4. Delete VPC
   - This automatically removes:
     - Subnets
     - Route Tables
     - Internet Gateway
     - Network ACLs
     - Security Groups (non-default)
```

---

## Troubleshooting Guide

| Issue | Symptom | Solution |
|-------|---------|----------|
| **Can't SSH to Bastion** | Connection timeout | Check Security Group inbound SSH rule; verify public IP assignment |
| **Can't SSH to Private** | Connection refused | Verify Bastion SG allows outbound to Private SG; check key permissions |
| **No internet from Bastion** | Ping fails | Verify IGW attached; check route table has 0.0.0.0/0 -> IGW |
| **Private server has internet** | Unexpected! | Check if NAT Gateway exists; verify no public IP assigned |
| **DNS fails** | nslookup timeout | Enable DNS resolution in VPC settings; check DHCP options |

---

## Key Concepts Summary

| Concept | Description | AWS Implementation |
|---------|-------------|-------------------|
| **VPC** | Isolated network boundary | Virtual network with CIDR block |
| **Subnet** | IP address range partition | Public (IGW route) vs. Private (no IGW) |
| **Route Table** | Traffic direction rules | Destination CIDR -> Target (IGW, NAT, local) |
| **Security Group** | Instance-level firewall | Stateful, allow rules only |
| **NACL** | Subnet-level firewall | Stateless, allow/deny rules, ordered |
| **IGW** | Internet access for VPC | Attached to VPC, referenced in route table |
| **NAT Gateway** | Outbound-only internet for private | Placed in public subnet, route from private |
| **VPC Endpoint** | Private AWS service access | Route table entry, no internet needed |

---

## Certification Mapping

This lab covers these AWS SimuLearn: Networking Concepts modules:

- [x] IP Addressing and CIDR notation
- [x] VPC fundamentals and subnetting
- [x] Public vs. Private subnets
- [x] Internet connectivity (IGW, NAT)
- [x] Network security (Security Groups, NACLs)
- [x] DNS resolution in VPC
- [x] AWS service access patterns

---

## Next Steps

1. **Advanced Lab:** Add a NAT Gateway and observe private subnet outbound internet
2. **Peer Connection Lab:** Connect two VPCs using VPC Peering
3. **Transit Gateway Lab:** Centralize network connectivity across multiple VPCs
4. **Exam Prep:** Review [AWS Certified Cloud Practitioner](https://aws.amazon.com/certification/certified-cloud-practitioner/) networking objectives

---

## Certificate

![AWS SimuLearn: Networking Concepts Completion Certificate](certificate.png)

> **Awarded to:** phadagi mannda raven  
> **Date:** June 02, 2026  
> **Issued by:** AWS Training & Certification

---

*Lab Complete!* :tada:

You now have practical experience with AWS networking fundamentals that directly maps to your AWS SimuLearn: Networking Concepts certification.
