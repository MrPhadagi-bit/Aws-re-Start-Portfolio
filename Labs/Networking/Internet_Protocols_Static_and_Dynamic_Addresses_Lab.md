# Internet Protocols - Static and Dynamic Addresses: Scenario

> **Your Role:** Cloud Support Engineer at Amazon Web Services (AWS)
> 
> **Customer:** Bob, Cloud Admin at a Fortune 500 Company
> 
> **Lab Duration:** 60 minutes

---

## Table of Contents

- [Customer Ticket](#customer-ticket)
- [Architecture Overview](#architecture-overview)
- [Objectives](#objectives)
- [Prerequisites](#prerequisites)
- [Background: Static vs. Dynamic IP Addresses](#background-static-vs-dynamic-ip-addresses)
- [Task 1: Investigate the Customer's Environment](#task-1-investigate-the-customers-environment)
  - [Step 1: Launch a Test EC2 Instance](#step-1-launch-a-test-ec2-instance)
  - [Step 2: Observe Dynamic IP Behavior](#step-2-observe-dynamic-ip-behavior)
  - [Step 3: Allocate an Elastic IP (EIP)](#step-3-allocate-an-elastic-ip-eip)
  - [Step 4: Associate the EIP with the Instance](#step-4-associate-the-eip-with-the-instance)
  - [Step 5: Verify the Solution](#step-5-verify-the-solution)
- [Task 2: Customer Response (Group Activity)](#task-2-customer-response-group-activity)
- [Findings Summary](#findings-summary)
- [Key Takeaways](#key-takeaways)
- [Cleanup](#cleanup)
- [Troubleshooting](#troubleshooting)

---

## Customer Ticket

> **From:** Bob, Cloud Admin
> 
> **Subject:** EC2 Instance IP Address Keeps Changing

```
Hello Cloud Support!

We are having issues with one of our EC2 instances. The IP changes every time 
we start and stop this instance called "Public Instance". This causes everything 
to break since it needs a static IP address. We are not sure why the IP changes 
on this instance to a random IP every time. Can you please investigate? Attached 
is our architecture. Please let me know if you have any questions.

Thanks!
Bob, Cloud Admin
```

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        AWS Cloud                             │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                      Customer VPC                    │   │
│  │                                                      │   │
│  │   ┌─────────────────────────────────────────────┐   │   │
│  │   │              Public Subnet                   │   │   │
│  │   │                                              │   │   │
│  │   │   ┌─────────────────────────────────────┐    │   │   │
│  │   │   │         EC2 "Public Instance"        │    │   │   │
│  │   │   │                                      │    │   │   │
│  │   │   │   Public IP: Changes on stop/start   │    │   │   │
│  │   │   │   Private IP: 10.0.1.x               │    │   │   │
│  │   │   │                                      │    │   │   │
│  │   │   └─────────────────────────────────────┘    │   │   │
│  │   │                                              │   │   │
│  │   └─────────────────────────────────────────────┘   │   │
│  │                                                      │   │
│  │   ┌─────────────────┐                                │   │
│  │   │ Internet Gateway │  ← Routes traffic to/from VPC  │   │
│  │   └─────────────────┘                                │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Objectives

In this lab, you will:

1. ✅ **Summarize the customer scenario** — Understand Bob's issue with his EC2 instance
2. ✅ **Analyze the difference** between statically and dynamically assigned IP addresses using EC2 instances
3. ✅ **Assign a persistent (static) IP** to an EC2 instance using AWS Elastic IP (EIP)
4. ✅ **Develop a solution** to the customer's issue and summarize your findings

---

## Prerequisites

- Access to the AWS Management Console (lab environment)
- Basic understanding of AWS EC2 and VPC concepts
- Familiarity with the AWS Console navigation

---

## Background: Static vs. Dynamic IP Addresses

### What is a Dynamic IP Address?

A **dynamic IP address** is assigned automatically by AWS when an EC2 instance is launched (or started after being stopped). Key characteristics:

| Characteristic | Description |
|----------------|-------------|
| **Assignment** | Automatically assigned by AWS DHCP |
| **Persistence** | **Changes** every time the instance is stopped and started |
| **Cost** | Included at no extra charge |
| **Use Case** | Temporary, non-critical workloads |
| **Behavior** | Released back to AWS pool when instance stops; new IP assigned on start |

> ⚠️ **Important:** When you **stop** an EC2 instance, AWS releases its public IP back into the pool. When you **start** it again, AWS assigns a **new** public IP from the available pool. This is the root cause of Bob's issue.

### What is a Static IP Address?

A **static IP address** (in AWS, called an **Elastic IP** or **EIP**) is a persistent public IPv4 address that you allocate to your AWS account. Key characteristics:

| Characteristic | Description |
|----------------|-------------|
| **Assignment** | Manually allocated and associated by you |
| **Persistence** | **Remains the same** regardless of instance state (stop/start) |
| **Cost** | Free when attached to a running instance; charged when idle |
| **Use Case** | Production workloads, DNS records, whitelisting, APIs |
| **Behavior** | Stays with the instance until explicitly disassociated |

### Quick Comparison

| Feature | Dynamic Public IP | Elastic IP (Static) |
|---------|-------------------|---------------------|
| Changes on stop/start? | ✅ Yes | ❌ No |
| Additional cost? | No | Free if in use; ~$0.005/hr if idle |
| Can be moved between instances? | No | ✅ Yes |
| DNS-friendly? | ❌ No | ✅ Yes |
| Best for production? | ❌ No | ✅ Yes |

---

## Task 1: Investigate the Customer's Environment

### Step 1: Launch a Test EC2 Instance

We will replicate Bob's environment by launching an EC2 instance with **Auto-assign Public IP enabled** (the default dynamic behavior).

#### 1.1 Navigate to EC2 Dashboard

1. Log in to the **AWS Management Console**
2. In the search bar (top-left), type `EC2` and select **EC2** from the list
   > 💡 *Tip: You can also find EC2 under **Services → Compute***

#### 1.2 Launch a New Instance

1. In the left navigation menu, choose **Instances**
2. Click the **Launch instances** button (top-right corner)

#### 1.3 Configure the Instance

Follow these steps to configure your test instance:

| Step | Setting | Value |
|------|---------|-------|
| **Step 1: Choose AMI** | Amazon Machine Image | **Amazon Linux 2 AMI (HVM)** — Select the first entry |
| **Step 2: Instance Type** | Instance Type | **t3.micro** |
| | | Click **Next: Configure Instance Details** |
| **Step 3: Configure Instance** | Network | `vpc-xxxxxxxx` \| **Lab VPC** |
| | Subnet | `subnet-xxxxxx` \| **Public Subnet 1** |
| | Auto-assign Public IP | **Enable** ← *This is the dynamic setting!* |
| | | Click **Next: Add Storage** |
| **Step 4: Add Storage** | | Leave as default |
| | | Click **Next: Add Tags** |
| **Step 5: Add Tags** | Key | `Name` |
| | Value | `test instance` |
| | | Click **Next: Configure Security Group** |
| **Step 6: Security Group** | Assign a security group | Select **Select an existing security group** |
| | | Choose **Linux Instance SG** |
| | | Click **Review and Launch** |
| **Step 7: Review** | | Click **Launch** |

#### 1.4 Select Key Pair

1. In the pop-up dialog:
   - **First dropdown:** Keep **Choose an existing key pair**
   - **Second dropdown:** Select **vockey \| RSA**
   - ✅ Check the acknowledgment box
   - Click **Launch Instances**

2. You will return to the EC2 dashboard. Wait until the **Instance state** shows **Running** and **Status checks** shows **2/2 checks passed**.

> ⏱️ *This may take 1–2 minutes.*

---

### Step 2: Observe Dynamic IP Behavior

Now we will demonstrate the problem Bob is experiencing.

#### 2.1 Record Initial IP Addresses

1. Select the checkbox next to your **test instance**
2. At the bottom, click the **Networking** tab
3. Record the following:

```
┌────────────────────────────────────────┐
│  INITIAL STATE (Instance Running)     │
├────────────────────────────────────────┤
│  Public IPv4 address:  ________________│
│  Private IPv4 address: ________________│
└────────────────────────────────────────┘
```

#### 2.2 Stop the Instance

1. With the instance selected, click **Instance state** (top-right)
2. Select **Stop instance**
3. Wait until the **Instance state** changes to **Stopped**

#### 2.3 Record IP Addresses After Stop

1. With the instance still selected, click the **Networking** tab
2. Observe the IP addresses:

```
┌────────────────────────────────────────┐
│  AFTER STOP (Instance Stopped)          │
├────────────────────────────────────────┤
│  Public IPv4 address:  ________________│  ← Likely blank or different
│  Private IPv4 address: ________________│  ← Usually stays the same
└────────────────────────────────────────┘
```

> 📝 **Observation:** The Public IPv4 address is released when the instance stops.

#### 2.4 Start the Instance Again

1. Click **Instance state** → **Start instance**
2. Wait until the instance is **Running** (2/2 checks passed)

#### 2.5 Record IP Addresses After Restart

1. Click the **Networking** tab again
2. Record the new IP addresses:

```
┌────────────────────────────────────────┐
│  AFTER RESTART (Instance Running)     │
├────────────────────────────────────────┤
│  Public IPv4 address:  ________________│  ← 🔄 CHANGED!
│  Private IPv4 address: ________________│  ← Usually same
└────────────────────────────────────────┘
```

#### 2.6 Analysis Questions

Answer the following in your notes:

| Question | Your Answer |
|----------|-------------|
| Did the **Public IPv4 address** change after stop/start? | |
| Did the **Private IPv4 address** change after stop/start? | |
| Is the Public IP **static** or **dynamic**? | |
| Is the Private IP **static** or **dynamic**? | |
| Have we replicated Bob's issue? | |

> ✅ **Conclusion:** The Public IPv4 address assigned by "Auto-assign Public IP" is **dynamic** — it changes every time the instance stops and starts. This is exactly what Bob is experiencing!

---

### Step 3: Allocate an Elastic IP (EIP)

AWS provides **Elastic IPs (EIPs)** as the solution for persistent public IP addresses.

#### 3.1 Navigate to Elastic IPs

1. In the left navigation menu, under **Network & Security**, select **Elastic IPs**
2. You should see **no EIPs** allocated yet

#### 3.2 Allocate a New Elastic IP

1. Click **Allocate Elastic IP address** (top-right)
2. Keep all settings as **default**
3. Click **Allocate**

#### 3.3 Record the EIP

```
┌────────────────────────────────────────┐
│  ELASTIC IP ALLOCATED                 │
├────────────────────────────────────────┤
│  Elastic IP address:  ________________│
│  Allocation ID:       ________________│
└────────────────────────────────────────┘
```

> 💡 **Note:** This IP is now reserved in your AWS account and will not change.

---

### Step 4: Associate the EIP with the Instance

Now we attach the persistent EIP to our dynamic instance.

#### 4.1 Associate the EIP

1. Select the checkbox next to your newly allocated **EIP**
2. Click **Actions** (top-right) → **Associate Elastic IP address**
3. Configure the association:

| Setting | Value |
|---------|-------|
| Resource type | **Instance** |
| Instance | Select **test instance** from the dropdown |
| Private IP address | Select the available private IP from the dropdown |
| Reassociation | Leave unchecked (for now) |

4. Click **Associate**

#### 4.2 Verify the Association

1. Navigate back to **Instances** (left menu)
2. Select your **test instance**
3. Click the **Networking** tab
4. Observe the **Public IPv4 address** — it should now show your **EIP**!

```
┌────────────────────────────────────────┐
│  AFTER EIP ASSOCIATION                │
├────────────────────────────────────────┤
│  Public IPv4 address:  <Your EIP>     │  ← Now persistent!
│  Private IPv4 address: ________________│
└────────────────────────────────────────┘
```

---

### Step 5: Verify the Solution

Let's prove that the EIP stays persistent through a stop/start cycle.

#### 5.1 Stop the Instance

1. Select the **test instance**
2. Click **Instance state** → **Stop instance**
3. Wait until the state is **Stopped**

#### 5.2 Record IP Addresses

```
┌────────────────────────────────────────┐
│  AFTER STOP (With EIP)                │
├────────────────────────────────────────┤
│  Public IPv4 address:  ________________│  ← Should still show EIP
│  Private IPv4 address: ________________│
└────────────────────────────────────────┘
```

#### 5.3 Start the Instance Again

1. Click **Instance state** → **Start instance**
2. Wait until **Running** (2/2 checks)

#### 5.4 Record IP Addresses After Restart

```
┌────────────────────────────────────────┐
│  AFTER RESTART (With EIP)             │
├────────────────────────────────────────┤
│  Public IPv4 address:  ________________│  ← 🎯 SAME EIP!
│  Private IPv4 address: ________________│
└────────────────────────────────────────┘
```

#### 5.5 Final Analysis

| Question | Your Answer |
|----------|-------------|
| Did the **Public IPv4 address** change after stop/start? | ❌ No — it stayed the same! |
| Is the EIP **static** or **dynamic**? | ✅ **Static** |
| Did we solve Bob's issue? | ✅ **Yes!** |
| Why? | The Elastic IP persists through stop/start cycles |

---

## Task 2: Customer Response (Group Activity)

### Scenario Role Play

| Role | Person |
|------|--------|
| **Bob (Customer)** | Person 1 |
| **Cloud Support Engineer** | Person 2 |

### Activity Instructions

1. **Person 2 (Engineer)** presents the findings to **Person 1 (Bob)**
2. Walk through:
   - What caused the issue (dynamic public IP)
   - How it was diagnosed (replicated in test environment)
   - The solution (Elastic IP allocation and association)
   - Why this solves the problem (EIPs persist through stop/start)
3. Answer any questions Bob may have
4. **Duration:** 5–10 minutes

### Sample Customer Response Email

```
Subject: Re: EC2 Instance IP Address Keeps Changing — RESOLVED

Hi Bob,

Thank you for reaching out to AWS Cloud Support. I've investigated the issue 
with your "Public Instance" and have identified the root cause and solution.

┌─────────────────────────────────────────────────────────────────┐
│ ROOT CAUSE                                                       │
├─────────────────────────────────────────────────────────────────┤
│ Your EC2 instance is configured with "Auto-assign Public IP"    │
│ enabled. This assigns a DYNAMIC public IP address from AWS's    │
│ pool every time the instance starts. When you stop the instance,│
│ that IP is released back to the pool. On restart, AWS assigns   │
│ a completely NEW public IP address — which is why your resources │
│ break.                                                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ SOLUTION                                                         │
├─────────────────────────────────────────────────────────────────┤
│ Allocate an Elastic IP (EIP) and associate it with your EC2     │
│ instance. An Elastic IP is a STATIC public IPv4 address that     │
│ persists through stop/start cycles and remains associated with    │
│ your instance until you explicitly release it.                  │
└─────────────────────────────────────────────────────────────────┘

Steps taken:
1. Launched a test instance to replicate your environment
2. Confirmed the public IP changes on stop/start (dynamic behavior)
3. Allocated an Elastic IP address
4. Associated the EIP with the test instance
5. Verified the IP remains the same after stop/start

Next Steps for You:
1. Go to EC2 → Network & Security → Elastic IPs
2. Click "Allocate Elastic IP address"
3. Select the EIP → Actions → "Associate Elastic IP address"
4. Choose your "Public Instance" and associate
5. Update any DNS records or firewall rules to use the new EIP

Please let me know if you need assistance with the implementation!

Best regards,
[Your Name]
AWS Cloud Support Engineer
```

---

## Findings Summary

### Root Cause

Bob's EC2 instance is using the default **dynamic public IP** assignment. AWS automatically assigns a new public IP from its pool every time the instance starts after being stopped. This is expected behavior for the "Auto-assign Public IP" feature.

### Solution

**Elastic IP (EIP)** is AWS's solution for persistent public IPv4 addresses:

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SOLUTION FLOW                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   BEFORE (Dynamic)              AFTER (Static)                       │
│   ┌─────────────┐               ┌─────────────┐                     │
│   │   STOP      │               │   STOP      │                     │
│   │  IP: 1.2.3.4│               │  IP: 5.6.7.8│  ← EIP stays!      │
│   └──────┬──────┘               └──────┬──────┘                     │
│          │                             │                             │
│          ▼                             ▼                             │
│   ┌─────────────┐               ┌─────────────┐                     │
│   │   START     │               │   START     │                     │
│   │  IP: 9.8.7.6│  ← NEW IP!   │  IP: 5.6.7.8│  ← SAME IP!        │
│   └─────────────┘               └─────────────┘                     │
│                                                                      │
│   ❌ Breaks dependencies          ✅ Stable for DNS, firewalls, etc. │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Key Differences Observed

| Test | Dynamic IP (Before) | Elastic IP (After) |
|------|---------------------|-------------------|
| Stop instance | IP released | IP reserved |
| Start instance | New IP assigned | Same IP retained |
| DNS reliability | ❌ Poor | ✅ Excellent |
| Production suitability | ❌ Not recommended | ✅ Recommended |

---

## Key Takeaways

1. **Dynamic Public IPs** are automatically assigned by AWS and change on every stop/start cycle. They are suitable for temporary or development workloads.

2. **Elastic IPs (EIPs)** are static, persistent public IPv4 addresses that you control. They are ideal for:
   - Production workloads
   - DNS A-record mappings
   - Firewall whitelisting
   - Third-party API integrations requiring IP validation

3. **Private IPs** typically remain the same within a subnet, but public IPs require an EIP for persistence.

4. **Cost Consideration:** EIPs are free when attached to a running instance. AWS charges a small hourly fee (~$0.005/hr) for idle (unattached) EIPs to encourage efficient IP usage.

5. **Best Practice:** For any production EC2 instance that requires a consistent public endpoint, always use an **Elastic IP** rather than relying on auto-assigned dynamic IPs.

---

## Cleanup

> ⚠️ **Important:** To avoid unnecessary charges, clean up resources after the lab.

1. **Disassociate the EIP:**
   - EC2 → Elastic IPs → Select your EIP → Actions → **Disassociate Elastic IP address**

2. **Release the EIP:**
   - Select the EIP → Actions → **Release Elastic IP address** → Confirm

3. **Terminate the Test Instance:**
   - EC2 → Instances → Select **test instance** → Instance state → **Terminate instance**

4. **Verify Cleanup:**
   - Ensure no running instances remain (except lab-provided ones)
   - Ensure no Elastic IPs are allocated

---

## Troubleshooting

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| Cannot associate EIP | Instance already has a public IP | Disassociate or release the existing dynamic IP first, or enable reassociation |
| EIP not showing in console | Wrong region selected | Ensure you're in the same region where the EIP was allocated |
| Instance not reachable after EIP | Security group rules | Verify the security group allows inbound traffic on required ports |
| Cannot allocate more EIPs | Account limit reached | Request a limit increase via AWS Support, or release unused EIPs |
| Charged for idle EIP | EIP not attached to a running instance | Attach it to an instance or release it if no longer needed |

---

## Additional Resources

- [AWS Documentation: Elastic IP Addresses](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html)
- [AWS Documentation: Public IPv4 Addresses](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-instance-addressing.html)
- [AWS Pricing: Elastic IP Addresses](https://aws.amazon.com/ec2/pricing/#Elastic_IP_Addresses)

---

*Lab completed successfully!* ✅

> **Status:** Bob's issue has been diagnosed and resolved. The "Public Instance" now has a persistent public IP address using an Elastic IP.
