# Build Your VPC and Launch a Web Server

> **AWS Lab** | Networking & Compute | Estimated Time: ~45 minutes

---

##  Objectives

After completing this lab, you should be able to:

- [x] Create a **Virtual Private Cloud (VPC)**
- [x] Create **subnets** (public and private)
- [x] Configure a **security group**
- [x] Launch an **Amazon EC2 instance** into a VPC
- [x] Deploy a functional **web server** in a custom network environment

---

##  Lab Overview

### Scenario

In this lab, you use **Amazon Virtual Private Cloud (VPC)** to create your own VPC and add additional components to produce a customized network for a Fortune 100 customer. You will also create security groups for your EC2 instance, then configure and customize an EC2 instance to run a web server and launch it into the VPC.

### Architecture

The final architecture will look like this:

```
┌─────────────────────────────────────────────────────────────┐
│                        AWS Cloud                             │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  VPC: Lab VPC                       │   │
│  │              CIDR: 10.0.0.0/16                        │   │
│  │                                                      │   │
│  │  ┌─────────────────┐    ┌─────────────────────────┐ │   │
│  │  │   AZ: us-west-2a │    │      AZ: us-west-2b    │ │   │
│  │  │                  │    │                        │ │   │
│  │  │ ┌─────────────┐  │    │  ┌─────────────────┐   │ │   │
│  │  │ │Public Subnet│  │    │  │ Public Subnet 2 │   │ │   │
│  │  │ │10.0.0.0/24  │  │    │  │  10.0.2.0/24    │   │ │   │
│  │  │ │             │  │    │  │                 │   │ │   │
│  │  │ │ Web Server 1│  │    │  │                 │   │ │   │
│  │  │ │  (EC2)      │  │    │  │                 │   │ │   │
│  │  │ └─────────────┘  │    │  └─────────────────┘   │ │   │
│  │  │         ▲        │    │                        │ │   │
│  │  │    Internet Gateway │    │                        │ │   │
│  │  └─────────────────┘    └─────────────────────────┘ │   │
│  │                                                      │   │
│  │  ┌─────────────────┐    ┌─────────────────────────┐   │   │
│  │  │ ┌─────────────┐  │    │  ┌─────────────────┐   │   │
│  │  │ │Private Subnet│  │    │  │ Private Subnet 2│   │   │
│  │  │ │10.0.1.0/24  │  │    │  │  10.0.3.0/24    │   │   │
│  │  │ │             │  │    │  │                 │   │   │
│  │  │ │  NAT Gateway│  │    │  │                 │   │   │
│  │  │ └─────────────┘  │    │  └─────────────────┘   │   │
│  │  └─────────────────┘    └─────────────────────────┘   │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  Security Group: Web Security Group (HTTP: 0.0.0.0/0)       │
└─────────────────────────────────────────────────────────────┘
```

### Key Components

| Component | Purpose |
|-----------|---------|
| **VPC** | Isolated virtual network (10.0.0.0/16) |
| **Internet Gateway** | Enables internet connectivity for public subnets |
| **NAT Gateway** | Provides outbound internet access for private subnets |
| **Public Subnets** | Subnets with route to IGW (10.0.0.0/24, 10.0.2.0/24) |
| **Private Subnets** | Subnets without IGW route (10.0.1.0/24, 10.0.3.0/24) |
| **Route Tables** | Control traffic routing between subnets |
| **Security Group** | Virtual firewall for EC2 instances |
| **EC2 Instance** | Web server running Apache, PHP, and MySQL |

---

##  Prerequisites

- AWS Management Console access
- Basic understanding of networking concepts (CIDR, subnets, routing)
- Valid AWS account with permissions to create VPC and EC2 resources

---

##  Task 1: Create Your VPC

> **Purpose:** Establish the foundational network infrastructure with the VPC Wizard.

### Step 1: Navigate to VPC Dashboard

1. Open the [AWS Management Console](https://aws.amazon.com/console/)
2. In the search bar at the top, type `VPC` and select **VPC** from the list
3. You are now in the **Amazon VPC Dashboard**

### Step 2: Launch VPC Wizard

1. Click **Create VPC**
2. Select **VPC and more** (creates VPC, subnets, NAT gateway, and internet gateway in one workflow)

### Step 3: Configure VPC Settings

| Setting | Value | Description |
|---------|-------|-------------|
| **Resources to create** | `VPC and more` | Creates full network stack |
| **Name tag auto-generation** | ☐ *Uncheck* | Manual naming for clarity |
| **IPv4 CIDR block** | `10.0.0.0/16` | 65,536 available IP addresses |
| **IPv6 CIDR block** | `No IPv6 CIDR block` | IPv4 only for this lab |
| **Tenancy** | `Default` | Shared hardware |
| **Number of Availability Zones** | `1` | Start with one AZ |
| **Number of public subnets** | `1` | Initial public subnet |
| **Number of private subnets** | `1` | Initial private subnet |
| **NAT gateways** | `In 1 AZ` | Outbound internet for private subnet |
| **VPC endpoints** | `None` | No S3/DynamoDB endpoints |

### Step 4: Customize Subnet CIDR Blocks

Click **Expand** next to *Customize subnet CIDR blocks* and configure:

| Subnet | CIDR Block | IP Range |
|--------|-----------|----------|
| Public subnet in us-west-2a | `10.0.0.0/24` | 10.0.0.0 - 10.0.0.255 |
| Private subnet in us-west-2a | `10.0.1.0/24` | 10.0.1.0 - 10.0.1.255 |

### Step 5: Name Resources in Preview Pane

Before creating, update the auto-generated names in the **Preview** pane:

| Resource Type | Original Name | New Name |
|--------------|---------------|----------|
| VPC | *Auto-generated* | `Lab VPC` |
| Subnet 1 (Public) | *Auto-generated* | `Public Subnet 1` |
| Subnet 2 (Private) | *Auto-generated* | `Private Subnet 1` |
| Route Table 1 | *Auto-generated* | `Public Route Table` |
| Route Table 2 | *Auto-generated* | `Private Route Table` |

### Step 6: Create VPC

1. Click **Create VPC**
2. Wait for the **Success** message to appear
3. Click **View VPC** to verify details

>  **Verification:** The VPC details page should show `Lab VPC` with CIDR `10.0.0.0/16`

---

##  Task 2: Create Additional Subnets

> **Purpose:** Add subnets in a second Availability Zone for high availability.

### Step 1: Navigate to Subnets

1. In the left navigation pane, click **Subnets**
2. You should see `Public Subnet 1` and `Private Subnet 1` already created

### Step 2: Create Public Subnet 2

1. Click **Create subnet**
2. Configure the following:

| Setting | Value |
|---------|-------|
| **VPC ID** | `Lab VPC` (from dropdown) |
| **Subnet name** | `Public Subnet 2` |
| **Availability Zone** | `No preference` (or select a second AZ) |
| **IPv4 CIDR block** | `10.0.2.0/24` |

3. Click **Create subnet**

>  **Note:** This subnet will have all IP addresses starting with `10.0.2.x`

### Step 3: Create Private Subnet 2

1. Click **Create subnet** again
2. Configure the following:

| Setting | Value |
|---------|-------|
| **VPC ID** | `Lab VPC` (from dropdown) |
| **Subnet name** | `Private Subnet 2` |
| **Availability Zone** | `No preference` (or select a second AZ) |
| **IPv4 CIDR block** | `10.0.3.0/24` |

3. Click **Create subnet**

>  **Note:** This subnet will have all IP addresses starting with `10.0.3.x`

### Subnet Summary

| Subnet Name | AZ | CIDR | Type |
|------------|-----|------|------|
| Public Subnet 1 | us-west-2a | 10.0.0.0/24 | Public |
| Private Subnet 1 | us-west-2a | 10.0.1.0/24 | Private |
| Public Subnet 2 | us-west-2b | 10.0.2.0/24 | Public |
| Private Subnet 2 | us-west-2b | 10.0.3.0/24 | Private |

---

##  Task 3: Associate Subnets and Add Routes

> **Purpose:** Associate new subnets with the correct route tables to ensure proper traffic flow.

### Part A: Associate Public Subnet 2 with Public Route Table

1. In the left navigation pane, click **Route Tables**
2. Select **`Public Route Table`** from the list
3. In the lower pane, click the **Subnet associations** tab
4. Under *Subnets without explicit associations*, click **Edit subnet associations**
5. Select the checkbox for **`Public Subnet 2`**
6. Click **Save associations**

>  **Verification:** Public Subnet 2 should now be listed under *Explicit subnet associations*

### Part B: Associate Private Subnet 2 with Private Route Table

1. Select **`Private Route Table`** from the list
2. In the lower pane, click the **Subnet associations** tab
3. Under *Subnets without explicit associations*, click **Edit subnet associations**
4. Select the checkbox for **`Private Subnet 2`**
5. Click **Save associations**

>  **Verification:** Private Subnet 2 should now be listed under *Explicit subnet associations*

### Route Table Logic

```
┌─────────────────────────────────────────────────────────────┐
│                    ROUTING LOGIC                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Public Route Table          Private Route Table           │
│  ┌─────────────────┐        ┌─────────────────┐           │
│  │ Destination     │        │ Destination     │           │
│  │ 10.0.0.0/16    │ local   │ 10.0.0.0/16    │ local     │
│  │ 0.0.0.0/0      │ IGW     │ 0.0.0.0/0      │ NAT GW    │
│  └─────────────────┘        └─────────────────┘           │
│                                                             │
│  Public Subnets 1 & 2 ──────► Public Route Table           │
│  Private Subnets 1 & 2 ─────► Private Route Table          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

>  **Result:** Your VPC now has public and private subnets configured in **two Availability Zones** for high availability.

---

##  Task 4: Create a VPC Security Group

> **Purpose:** Create a virtual firewall that controls inbound traffic to your web server.

### Understanding Security Groups

A **security group** acts as a virtual firewall for your EC2 instance. You can add rules that allow traffic to or from its associated instances. By default, security groups deny all inbound traffic and allow all outbound traffic.

### Step 1: Navigate to Security Groups

1. In the left navigation pane, click **Security Groups**
2. Click **Create security group**

### Step 2: Configure Security Group

| Setting | Value | Description |
|---------|-------|-------------|
| **Security group name** | `Web Security Group` | Descriptive name |
| **Description** | `Enable HTTP access` | Purpose of the group |
| **VPC** | `Lab VPC` | Attach to our VPC |

### Step 3: Add Inbound Rule

1. Under **Inbound rules**, click **Add rule**
2. Configure the rule:

| Setting | Value |
|---------|-------|
| **Type** | `HTTP` |
| **Protocol** | `TCP` (auto-selected) |
| **Port range** | `80` (auto-selected) |
| **Source** | `Anywhere-IPv4` (`0.0.0.0/0`) |
| **Description** | `Permit web requests` |

3. Click **Create security group**

>  **Verification:** The security group `Web Security Group` should appear in the list with the inbound rule visible.

---

##  Task 5: Launch a Web Server Instance

> **Purpose:** Launch and configure an EC2 instance to serve as a web server in your VPC.

### Step 1: Navigate to EC2 Dashboard

1. In the AWS Management Console search bar, type `EC2` and select **EC2**
2. In the left navigation pane, click **Instances**
3. Click **Launch instances**

### Step 2: Configure Instance Details

#### Name and Tags
| Setting | Value |
|---------|-------|
| **Name** | `Web Server 1` |

#### Application and OS Image (AMI)
| Setting | Value |
|---------|-------|
| **Quick Start** | `Amazon Linux` |
| **Amazon Machine Image (AMI)** | `Amazon Linux 2 AMI (HVM)` |

#### Instance Type
| Setting | Value |
|---------|-------|
| **Instance type** | `t3.micro` |

>  **Note:** `t3.micro` is eligible for the AWS Free Tier.

#### Key Pair (Login)
| Setting | Value |
|---------|-------|
| **Key pair** | `vockey` |

#### Network Settings

Click **Edit** to expand network settings:

| Setting | Value | Description |
|---------|-------|-------------|
| **VPC - required** | `Lab VPC` | Your custom VPC |
| **Subnet** | `Public Subnet 2` | Place in public subnet |
| **Auto-assign public IP** | `Enable` | Required for internet access |
| **Firewall (security groups)** | `Select existing security group` | Use pre-created group |
| **Security groups** | `Web Security Group` | Allows HTTP traffic |

### Step 3: Add User Data (Bootstrap Script)

1. Expand **Advanced details**
2. Scroll to **User data** section
3. Copy and paste the following script:

```bash
#!/bin/bash
# Install Apache Web Server and PHP
yum install -y httpd mysql php

# Download Lab files
wget https://aws-tc-largeobjects.s3.us-west-2.amazonaws.com/CUR-TF-100-RESTRT-1/267-lab-NF-build-vpc-web-server/s3/lab-app.zip

# Extract application files to web root
unzip lab-app.zip -d /var/www/html/

# Enable and start Apache web server
chkconfig httpd on
service httpd start
```

>  **What this script does:**
> - Installs Apache (`httpd`), MySQL, and PHP (LAMP stack)
> - Downloads a sample web application from S3
> - Extracts the application to `/var/www/html/` (Apache's web root)
> - Configures Apache to start automatically on boot
> - Starts the Apache service immediately

### Step 4: Launch Instance

1. Click **Launch instance**
2. Click **View all instances** to see the instance list

### Step 5: Wait for Instance Status Checks

1. Wait until `Web Server 1` shows **2/2 checks passed** in the **Status check** column
2. This may take **2-5 minutes**
3. Click the **refresh** button at the top of the page to update status

>  **Tip:** If status checks are taking long, ensure the instance is in a public subnet with an auto-assigned public IP.

---

##  Verification

### Step 1: Get Public DNS

1. Select the checkbox for `Web Server 1`
2. Click the **Details** tab
3. Copy the **Public IPv4 DNS** value (e.g., `ec2-xxx-xxx-xxx-xxx.us-west-2.compute.amazonaws.com`)

### Step 2: Test Web Server

1. Open a new web browser tab
2. Paste the **Public IPv4 DNS** value into the address bar
3. Press **Enter**

### Expected Result

If successful, you should see a web page displaying the success message or the lab application interface. This confirms that:

-  The EC2 instance is running
-  The security group is allowing HTTP traffic (port 80)
-  The user data script executed successfully
-  Apache is serving content from `/var/www/html/`
-  The VPC, subnet, and internet gateway are properly configured

```
┌─────────────────────────────────────────────────────────────┐
│                    SUCCESS INDICATORS                        │
├─────────────────────────────────────────────────────────────┤
│   EC2 Instance: Running (2/2 checks passed)               │
│    Security Group: HTTP (80) open to 0.0.0.0/0             │
│   VPC: Lab VPC with Internet Gateway attached             │
│   Subnet: Public Subnet 2 with route to IGW               │
│   Web Server: Apache serving content on port 80           │
│   Browser: Successfully loads the web page               │
└─────────────────────────────────────────────────────────────┘
```

---

##  Cleanup

To avoid incurring unnecessary charges, delete the following resources after completing the lab:

### Step 1: Terminate EC2 Instance
1. Go to **EC2 Dashboard** → **Instances**
2. Select `Web Server 1`
3. Click **Instance state** → **Terminate instance**

### Step 2: Delete VPC (Cascading Delete)
1. Go to **VPC Dashboard**
2. Select `Lab VPC`
3. Click **Actions** → **Delete VPC**
4. This will automatically delete:
   - Subnets
   - Route tables
   - Internet gateway
   - NAT gateway
   - Security groups (except default)

>  **Warning:** Deleting the VPC will also delete the NAT gateway, which may incur charges if left running. Always clean up resources after lab completion.

---

##  Troubleshooting

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| **Instance status check fails** | User data script error | Check system logs in EC2 console → Actions → Monitor and troubleshoot → Get system log |
| **Cannot access web page** | Security group blocking | Verify inbound rule allows HTTP (port 80) from `0.0.0.0/0` |
| **No public IP assigned** | Auto-assign disabled | Ensure subnet has "Auto-assign public IPv4 address" enabled |
| **404 error on web page** | Files not extracted | SSH into instance and check `/var/www/html/` contents |
| **Timeout error** | Route table misconfigured | Verify public subnet route table has `0.0.0.0/0` → IGW |
| **NAT Gateway charges** | NAT Gateway left running | Delete NAT Gateway if not needed for private subnet outbound |

### Common Commands for Debugging

```bash
# Check Apache status
sudo systemctl status httpd

# Check web root contents
ls -la /var/www/html/

# Check user data execution logs
sudo cat /var/log/cloud-init-output.log

# Test local web server
curl http://localhost
```

---

##  Additional Resources

- [What is Amazon VPC?](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)
- [VPC Subnets](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Subnets.html)
- [Internet Gateways](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html)
- [NAT Gateways](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html)
- [Security Groups for Your VPC](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html)
- [EC2 Instance User Data](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html)

---

##  Lab Summary

```
┌─────────────────────────────────────────────────────────────┐
│                    LAB COMPLETION CHECKLIST                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [x] Task 1: Created VPC (10.0.0.0/16) with IGW & NAT GW   │
│  [x] Task 2: Created 4 subnets across 2 AZs                 │
│  [x] Task 3: Associated subnets with correct route tables   │
│  [x] Task 4: Created Web Security Group (HTTP inbound)      │
│  [x] Task 5: Launched EC2 web server with user data         │
│  [x] Verified: Web server accessible via public DNS          │
│                                                             │
│   Congratulations! You have successfully built a            │
│     fully functional VPC with a running web server!         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

> **Lab Complete** 
>
> You have successfully delivered the architecture requested by the Fortune 100 customer: a fully functional VPC with public and private subnets, security groups, route tables, and a running web server.

---

*Generated for AWS Training & Certification*
