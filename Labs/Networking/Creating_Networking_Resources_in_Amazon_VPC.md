# Creating Networking Resources in an Amazon Virtual Private Cloud (VPC)

**Duration:** 60 minutes

**Role:** Cloud Support Engineer at Amazon Web Services (AWS)

---

## Scenario

You are a **Cloud Support Engineer** at AWS. During your shift, you receive the following email from a customer:

> **From:** Brock, startup owner  
> **Subject:** Help setting up VPC internet connectivity
>
> Hello Cloud Support!
>
> I previously reached out to you regarding help setting up my VPC. I thought I knew how to attach all the resources to make an internet connection, but I cannot even ping outside the VPC. All I need to do is ping! Can you please help me set up my VPC to where it has network connectivity and can ping? The architecture is below. Thanks!
>
> — Brock

### Customer Architecture Requirements

| Resource | Configuration |
|----------|--------------|
| **VPC CIDR** | `192.168.0.0/18` |
| **Public Subnet CIDR** | `192.168.1.0/26` |
| **Internet Gateway** | Required for internet connectivity |
| **Security Group** | Allow SSH, HTTP, HTTPS |
| **EC2 Instance** | Amazon Linux 2023, t3.micro |

---

## Prerequisites

- Access to the AWS Management Console (via Vocareum lab environment)
- Basic understanding of IP addressing and CIDR notation
- Familiarity with SSH clients (PuTTY for Windows, Terminal for Mac/Linux)

---

## Concepts Overview

Before building, let's review the key components:

### Virtual Private Cloud (VPC)
A **VPC** is like a data center in the cloud. It is logically isolated from other virtual networks, allowing you to launch AWS resources in a secure, customizable environment.

### Internet Gateway (IGW)
An **IGW** enables internet connectivity for your VPC. It performs two critical functions:
1. **Network Address Translation (NAT)** for EC2 instances with public IPs
2. Acts as the **target** for internet-bound traffic in route tables

> **Note:** The IGW route in a route table is always `0.0.0.0/0`.

### Subnet
A **subnet** is a range of IP addresses within your VPC. You can create public subnets (internet-facing) and private subnets (isolated) based on architectural needs.

### Route Table
A **route table** contains rules (routes) that determine where network traffic is directed. Each subnet must be associated with a route table.

| Destination | Target | Purpose |
|-------------|--------|---------|
| `192.168.0.0/18` | `local` | Internal VPC traffic |
| `0.0.0.0/0` | `igw-xxxxxxxx` | Internet-bound traffic |

### Network ACL (NACL)
A **NACL** is a stateless firewall at the **subnet level**. It evaluates traffic using numbered rules (lowest number first).

| Property | NACL | Security Group |
|----------|------|----------------|
| **Level** | Subnet | Instance |
| **State** | Stateless | Stateful |
| **Default Behavior** | Allows all (default NACL) | Blocks all |
| **Rules** | Allow **and** Deny | Allow only |
| **Rule Evaluation** | Numbered, sequential | All rules evaluated |

### Security Group
A **Security Group** is a stateful firewall at the **instance level**. It blocks all inbound traffic by default and must explicitly allow traffic.

---

## Task 1: Build a VPC with Internet Connectivity

> **Approach:** Follow the left-hand navigation pane in the VPC console from top to bottom: **Your VPCs → Subnets → Route Tables → Internet Gateways → Network ACLs → Security Groups**.

Think of this as building a sandwich: the **VPC is the bun**, and the resources are everything in between.

---

### Step 1: Create the VPC

1. Navigate to the **AWS Management Console**.
2. Go to **VPC** under *Networking and Content Delivery* (or search for "VPC").
3. In the left navigation pane, select **Your VPCs**.
4. Click **Create VPC** (top right).

#### Configuration:

| Setting | Value |
|---------|-------|
| **Name tag** | `Test VPC` |
| **IPv4 CIDR block** | `192.168.0.0/18` |
| **IPv6 CIDR block** | No IPv6 CIDR block |
| **Tenancy** | Default |

5. Click **Create VPC**.

> **CIDR Breakdown:** `192.168.0.0/18` provides **16,384 IP addresses** (from `192.168.0.0` to `192.168.63.255`).

---

### Step 2: Create a Public Subnet

1. In the left navigation pane, select **Subnets**.
2. Click **Create subnet** (top right).
3. Select your **Test VPC** from the dropdown.

#### Configuration:

| Setting | Value |
|---------|-------|
| **Subnet name** | `Public Subnet` |
| **Availability Zone** | No preference |
| **IPv4 CIDR block** | `192.168.1.0/26` |

4. Click **Create subnet**.

> **CIDR Breakdown:** `192.168.1.0/26` provides **64 IP addresses** (from `192.168.1.0` to `192.168.1.63`). AWS reserves 5 IPs per subnet, leaving 59 usable addresses.

---

### Step 3: Create a Route Table

1. In the left navigation pane, select **Route Tables**.
2. Click **Create route table** (top right).

#### Configuration:

| Setting | Value |
|---------|-------|
| **Name** | `Public Route Table` |
| **VPC** | `Test VPC` |

3. Click **Create route table**.

> The route table is created with only the **local route** (`192.168.0.0/18 → local`). We will add the IGW route later.

---

### Step 4: Create and Attach an Internet Gateway

1. In the left navigation pane, select **Internet Gateways**.
2. Click **Create internet gateway** (top right).

#### Configuration:

| Setting | Value |
|---------|-------|
| **Name tag** | `IGW Test VPC` |

3. Click **Create internet gateway**.

#### Attach the IGW to the VPC:

4. With the IGW selected, click **Actions** → **Attach to VPC**.
5. Select **Test VPC** from the dropdown.
6. Click **Attach internet gateway**.

> **Status:** The IGW should now show as **Attached**.

---

### Step 5: Add Route to Route Table & Associate Subnet

#### Add the Internet Route:

1. Navigate to **Route Tables** in the left pane.
2. Select **Public Route Table**.
3. Click the **Routes** tab (bottom panel).
4. Click **Edit routes**.
5. Click **Add route**.

| Setting | Value |
|---------|-------|
| **Destination** | `0.0.0.0/0` |
| **Target** | Internet Gateway → `IGW Test VPC` |

6. Click **Save changes**.

> **What this does:** Any traffic destined for the internet (any IP not in the VPC) is routed through the IGW.

#### Associate the Subnet:

1. With **Public Route Table** selected, click the **Subnet associations** tab.
2. Click **Edit subnet associations**.
3. Select **Public Subnet**.
4. Click **Save associations**.

> **Naming Convention Tip:** Keep names consistent (`Public Route Table` ↔ `Public Subnet`) to avoid confusion as your infrastructure grows.

---

### Step 6: Create a Network ACL

1. In the left navigation pane, select **Network ACLs**.
2. Click **Create network ACL** (top right).

#### Basic Configuration:

| Setting | Value |
|---------|-------|
| **Name** | `Public Subnet NACL` |
| **VPC** | `Test VPC` |

3. Click **Create network ACL**.

#### Configure Inbound Rules:

4. Select **Public Subnet NACL**.
5. Click the **Inbound rules** tab → **Edit inbound rules**.
6. Click **Add new rule**:

| Setting | Value |
|---------|-------|
| **Rule number** | `100` |
| **Type** | `All traffic` |
| **Protocol** | `All` |
| **Port range** | `All` |
| **Source** | `0.0.0.0/0` |
| **Allow/Deny** | `Allow` |

7. Click **Save changes**.

#### Configure Outbound Rules:

8. Click the **Outbound rules** tab → **Edit outbound rules**.
9. Click **Add new rule**:

| Setting | Value |
|---------|-------|
| **Rule number** | `100` |
| **Type** | `All traffic` |
| **Protocol** | `All` |
| **Port range** | `All` |
| **Destination** | `0.0.0.0/0` |
| **Allow/Deny** | `Allow` |

10. Click **Save changes**.

> **Rule Interpretation:** Rule 100 allows all traffic. The implicit `*` (asterisk) rule at the bottom denies anything that doesn't match.

---

### Step 7: Create a Security Group

1. In the left navigation pane, select **Security Groups**.
2. Click **Create security group** (top right).

#### Basic Details:

| Setting | Value |
|---------|-------|
| **Security group name** | `public-security-group` |
| **Description** | `Allows public access` |
| **VPC** | `Test VPC` |

#### Inbound Rules:

3. Click **Add rule** for each of the following:

| Type | Protocol | Port Range | Source | Description |
|------|----------|------------|--------|-------------|
| SSH | TCP | 22 | `0.0.0.0/0` | SSH access |
| HTTP | TCP | 80 | `0.0.0.0/0` | Web traffic |
| HTTPS | TCP | 443 | `0.0.0.0/0` | Secure web traffic |

#### Outbound Rules:

4. Keep the default outbound rule:

| Type | Protocol | Port Range | Destination |
|------|----------|------------|-------------|
| All traffic | All | All | `0.0.0.0/0` |

5. Click **Create security group**.

> **Key Difference from NACL:** Security groups are **stateful** — if you allow inbound SSH, the return traffic is automatically allowed. They also **cannot deny traffic** (only allow).

---

## Task 2: Launch an EC2 Instance and Connect via SSH

### Launch the EC2 Instance

1. Navigate to the **EC2 Management Console** (search for "EC2").
2. In the left pane, select **Instances** → **Launch instances**.

#### Configuration:

| Section | Setting | Value |
|---------|---------|-------|
| **Name and tags** | Name | *(leave blank or enter a name)* |
| **Application and OS Images** | Quick Start | `Amazon Linux` |
| | AMI | `Amazon Linux 2023 AMI` |
| **Instance type** | Type | `t3.micro` |
| **Key pair** | Key pair name | `vockey` |
| **Network settings** | VPC | `Test VPC` |
| | Subnet | `Public Subnet` |
| | Auto-assign public IP | `Enable` |
| | Firewall | `Select existing security group` |
| | Security groups | `public-security-group` |

3. Click **Launch instance**.
4. Click **View all instances** and wait for the instance state to change to **Running**.

> **Note:** Make a note of the **Public IPv4 address** displayed in the instance details.

---

### Connect via SSH

#### For Windows Users (PuTTY):

1. Download the **PPK key file** (`labsuser.ppk`) from the lab credentials panel.
2. Download and open **PuTTY** (`putty.exe`).
3. Configure the session:
   - **Host Name (or IP address):** `ec2-user@<Public-IP>`
   - **Port:** `22`
   - **Connection type:** SSH
4. Navigate to **Connection → SSH → Auth → Credentials**.
5. Browse and select the `labsuser.ppk` file.
6. Click **Open** to connect.

#### For macOS/Linux Users (Terminal):

```bash
# Ensure your PEM key has the correct permissions
chmod 400 labsuser.pem

# Connect to the instance
ssh -i labsuser.pem ec2-user@<Public-IP>
```

> Replace `<Public-IP>` with the actual public IPv4 address of your EC2 instance.

---

## Task 3: Test Internet Connectivity with Ping

Once connected to your EC2 instance via SSH, run the following command:

```bash
ping google.com
```

### Expected Output (Successful Connectivity):

```
PING google.com (142.250.80.46) 56(84) bytes of data.
64 bytes from nrt13s55-in-f14.1e100.net (142.250.80.46): icmp_seq=1 ttl=116 time=1.23 ms
64 bytes from nrt13s55-in-f14.1e100.net (142.250.80.46): icmp_seq=2 ttl=116 time=1.15 ms
64 bytes from nrt13s55-in-f14.1e100.net (142.250.80.46): icmp_seq=3 ttl=116 time=1.18 ms
^C
--- google.com ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2003ms
rtt min/avg/max/mdev = 1.150/1.186/1.230/0.032 ms
```

### Stop the Ping Test

- **Windows:** Press `CTRL + C`
- **Mac/Linux:** Press `CMD + C` or `CTRL + C`

### Success Criteria

 You see **replies** from `google.com`  
 **0% packet loss**  
 This confirms your VPC has full internet connectivity!

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      AWS Cloud                               │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  Test VPC (192.168.0.0/18)            │   │
│  │                                                      │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │           Public Subnet (192.168.1.0/26)    │    │   │
│  │  │                                              │    │   │
│  │  │   ┌─────────────────────────────────────┐   │    │   │
│  │  │   │    EC2 Instance (t3.micro)          │   │    │   │
│  │  │   │    - Amazon Linux 2023              │   │    │   │
│  │  │   │    - Public IP: Enabled             │   │    │   │
│  │  │   │    - Security Group:                │   │    │   │
│  │  │   │      • SSH (22) from 0.0.0.0/0      │   │    │   │
│  │  │   │      • HTTP (80) from 0.0.0.0/0     │   │    │   │
│  │  │   │      • HTTPS (443) from 0.0.0.0/0   │   │    │   │
│  │  │   └─────────────────────────────────────┘   │    │   │
│  │  │                                              │    │   │
│  │  │   NACL: Allow All Inbound/Outbound           │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  │                                                      │   │
│  │   Route Table (Public Route Table)                    │   │
│  │   ┌─────────────────────────────────────────────┐    │   │
│  │   │ Destination      │ Target                   │    │   │
│  │   │ 192.168.0.0/18   │ local                    │    │   │
│  │   │ 0.0.0.0/0        │ IGW Test VPC (igw-xxx)   │    │   │
│  │   └─────────────────────────────────────────────┘    │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│   Internet Gateway (IGW Test VPC) ───→  Internet           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Troubleshooting Guide

| Symptom | Possible Cause | Solution |
|---------|---------------|----------|
| **Cannot ping google.com** | IGW not attached to VPC | Verify IGW is attached to `Test VPC` |
| | Missing route to IGW | Check route table has `0.0.0.0/0 → IGW` |
| | Subnet not associated with route table | Associate `Public Subnet` with `Public Route Table` |
| | NACL blocking ICMP | Ensure NACL allows all traffic (or specifically ICMP) |
| | Security group blocking outbound | Allow all outbound traffic in security group |
| | No public IP on instance | Enable "Auto-assign public IP" or assign Elastic IP |
| | Instance in wrong subnet | Verify instance is in `Public Subnet` |
| **Cannot SSH into instance** | Security group missing SSH rule | Add inbound rule for SSH (port 22) |
| | Wrong key pair | Use `vockey` key pair |
| | Instance still pending | Wait for instance state = **Running** |

### Diagnostic Commands (from EC2 instance):

```bash
# Check network interfaces
ip addr show

# Check routing table
ip route show

# Test DNS resolution
nslookup google.com

# Test connectivity to specific IP
curl -I https://google.com

# Check security group rules (from AWS CLI - if installed)
aws ec2 describe-security-groups --group-ids <sg-id>
```

---

## Cleanup

To avoid unnecessary charges, delete the following resources in this order:

1. **Terminate the EC2 instance** (EC2 Console → Instances → Terminate)
2. **Detach and delete the Internet Gateway** (VPC Console → Internet Gateways)
3. **Delete the VPC** (VPC Console → Your VPCs → Delete)
   - This will automatically delete associated subnets, route tables, NACLs, and security groups.

> **Warning:** Deleting the VPC will remove all associated resources. Ensure you have terminated the EC2 instance first to avoid dependency errors.

---

## Key Takeaways

| Concept | Key Point |
|---------|-----------|
| **VPC** | Logically isolated network; define your own IP range |
| **Subnet** | Segment of VPC IPs; public = internet-facing, private = isolated |
| **IGW** | Required for internet connectivity; attach to VPC and route via `0.0.0.0/0` |
| **Route Table** | Directs traffic; must associate with subnet |
| **NACL** | Stateless subnet firewall; rules evaluated by number |
| **Security Group** | Stateful instance firewall; blocks all inbound by default |
| **Public IP** | Required for instance-to-internet communication |

### The "Sandwich" Approach to VPC Building

> **Top-down construction:** Start with the VPC (the bun), then add subnets, route tables, IGW, NACLs, and security groups (the fillings), and finally place your EC2 instance (the main ingredient) inside.

---

## References

- [AWS VPC Documentation](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)
- [Internet Gateways](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html)
- [Route Tables](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html)
- [Network ACLs](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html)
- [Security Groups](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html)
- [Connect to Linux using PuTTY](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/putty.html)

---

**Lab Complete! 🎉**

You have successfully built a VPC with internet connectivity, launched an EC2 instance, and verified connectivity using `ping`. Brock's startup can now communicate with the internet!
