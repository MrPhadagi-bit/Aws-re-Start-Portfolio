# Troubleshooting a Network Issue: AWS VPC Connectivity Lab

---

## Overview

This hands-on lab simulates a real-world AWS support scenario where you, acting as a **Cloud Support Engineer**, must diagnose and resolve a network connectivity issue within an Amazon Virtual Private Cloud (VPC). The lab provides an exact replica of the customer's environment, allowing you to practice systematic troubleshooting techniques.

---

## Learning Objectives

After completing this lab, you should be able to:

- **Analyze** the customer scenario and identify potential root causes
- **Troubleshoot** AWS VPC networking issues including:
  - Subnet and route table associations
  - Internet Gateway attachment and routing
  - Security Group rules and Network ACLs
  - EC2 instance-level service configuration
- **Apply** systematic debugging methodology to cloud infrastructure problems

---

## Duration

⏱️ **Estimated Time:** Approximately 1 hour

---

## Scenario

### Your Role
You are a **Cloud Support Engineer** at **Amazon Web Services (AWS)**. During your shift, you receive a support request from a consulting company experiencing networking issues within their AWS infrastructure.

### Customer Context
The customer, **Ana** (a contractor), has deployed a standard VPC architecture with an Apache web server but is unable to access it from the internet.

### Email from the Customer

> **From:** Ana (Contractor)  
> **To:** AWS Cloud Support  
> **Subject:** Cannot connect to Apache server
>
> Hello, Cloud Support!
>
> When I create an Apache server through the command line, I cannot ping it. I also get an error when I enter the IP address in the browser. Can you please help figure out what is blocking my connection?
>
> Thanks!  
> Ana  
> Contractor

### Customer Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        AWS Cloud                            │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Customer VPC                           │   │
│  │                                                     │   │
│  │   ┌─────────────────────────────────────────┐      │   │
│  │   │        Internet Gateway (IGW)           │      │   │
│  │   │            ↑                            │      │   │
│  │   └─────────────────────────────────────────┘      │   │
│  │            │                                      │   │
│  │   ┌────────┴──────────────────────────────┐       │   │
│  │   │         Public Subnet                 │       │   │
│  │   │                                       │       │   │
│  │   │   ┌─────────────────────────────┐     │       │   │
│  │   │   │   Amazon EC2 Instance       │     │       │   │
│  │   │   │   (Amazon Linux)            │     │       │   │
│  │   │   │   - Apache/httpd            │     │       │   │
│  │   │   │   - Public IP assigned      │     │       │   │
│  │   │   └─────────────────────────────┘     │       │   │
│  │   └───────────────────────────────────────┘       │   │
│  └───────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Figure:** The customer's virtual private cloud (VPC) architecture, which consists of a VPC, an internet gateway, a public subnet, and an Amazon Elastic Compute Cloud (Amazon EC2) instance.

---

## Prerequisites

Before starting this lab, ensure you have:

- [ ] Access to the AWS Management Console (provided in the lab environment)
- [ ] SSH client installed:
  - **Windows:** PuTTY (`.ppk` key format)
  - **macOS/Linux:** OpenSSH (`.pem` key format)
- [ ] Basic familiarity with Linux command line
- [ ] Understanding of basic networking concepts (IP addresses, ports, protocols)

---

## Task 1: Use SSH to Connect to an Amazon Linux EC2 Instance

In this task, you will connect to an Amazon Linux EC2 instance using SSH. The instructions vary depending on your operating system.

### Windows Users: Using SSH to Connect

>  **Note:** These instructions are specifically for Windows users. If you are using macOS or Linux, skip to the [next section](#macoslinux-users-using-ssh-to-connect).

#### Step 1: Retrieve Connection Details
1. Select the **Details** drop-down menu above these instructions
2. Select **Show** to open the Credentials window
3. Click **Download PPK** and save the `labsuser.ppk` file
   - Typically saved to your `Downloads` directory
4. Make a note of the **Public IP** address
5. Exit the Details panel by selecting the **X**

#### Step 2: Install PuTTY (if needed)
- Download [PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html) if not already installed
- Open `putty.exe`

#### Step 3: Configure PuTTY Session
- Follow the official AWS documentation: [Connect to your Linux instance using PuTTY](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/putty.html)
- **Key configuration points:**
  - **Host Name:** `ec2-user@<Public-IP>`
  - **Port:** `22`
  - **Connection type:** SSH
  - **Auth > Private key file:** Browse to your `labsuser.ppk` file

#### Step 4: Connect
- Click **Open** to initiate the SSH session
- Accept the host key prompt if this is your first connection

**[Windows Users: Click here to skip ahead to Task 2](#task-2-install-httpd)**

---

### macOS/Linux Users: Using SSH to Connect

>  **Note:** These instructions are for macOS and Linux users. Windows users should follow the [section above](#windows-users-using-ssh-to-connect).

#### Step 1: Retrieve Connection Details
1. Select the **Details** drop-down menu above these instructions
2. Select **Show** to open the Credentials window
3. Click **Download PEM** and save the `labsuser.pem` file
4. Make a note of the **Public IP** address
5. Exit the Details panel by selecting the **X**

#### Step 2: Set Key Permissions
Open a terminal and run:

```bash
chmod 400 /path/to/labsuser.pem
```

>  **Security Note:** The private key file must have restricted permissions (read-only for owner) to be accepted by SSH.

#### Step 3: Connect via SSH

```bash
ssh -i /path/to/labsuser.pem ec2-user@<Public-IP>
```

**Example:**
```bash
ssh -i ~/Downloads/labsuser.pem ec2-user@203.0.113.45
```

#### Step 4: Verify Connection
You should see the Amazon Linux welcome message and prompt:

```
[ec2-user@ip-10-0-1-100 ~]$
```

---

## Task 2: Install httpd

In this task, you will install and start the Apache HTTP Server (`httpd`) on the EC2 instance.

>  **Helpful Hint:** You may need to use `sudo` if you are not logged in as root.

### Step 1: Check httpd Service Status

First, verify whether the httpd service is installed and its current state:

```bash
sudo systemctl status httpd.service
```

**Expected Output (Inactive):**
```
● httpd.service - The Apache HTTP Server
   Loaded: loaded (/usr/lib/systemd/system/httpd.service; disabled; vendor preset: disabled)
   Active: inactive (dead)
```

>  **Analysis:** The service is **loaded** (already installed) but currently **inactive** (not running).

### Step 2: Start the httpd Service

```bash
sudo systemctl start httpd.service
```

### Step 3: Verify Service is Active

```bash
sudo systemctl status httpd.service
```

**Expected Output (Active):**
```
● httpd.service - The Apache HTTP Server
   Loaded: loaded (/usr/lib/systemd/system/httpd.service; disabled; vendor preset: disabled)
   Active: active (running) since Mon 2024-01-15 10:30:00 UTC; 5s ago
```

>  **Confirmation:** The Apache HTTP Server is now in **Active** status.

### Step 4: Test Apache in Browser

1. Open a new browser tab
2. Enter the following URL (replace `<PUBLIC-IP>` with your instance's public IP):

```
http://<PUBLIC-IP-OF-INSTANCE>
```

**Example:**
```
http://203.0.113.45
```

**Expected Result:**  
At this point, the page **will NOT load** — this is the issue we need to troubleshoot in Task 3. You will likely see a timeout or connection refused error.

>  **Expected (After Fix):** The Apache test page should display:
> 
> ![Apache Test Page](https://httpd.apache.org/images/httpd_logo.png)
> 
> *Figure: The test page of the Apache HTTP server when Apache is successfully installed.*

---

## Task 3: Investigate the Customer's VPC Configuration

In this task, you will systematically investigate the customer's VPC and resources to identify what is blocking the connection.

### Navigation to AWS Console

1. At the upper right of these instructions, choose **AWS**
   - The AWS Management Console opens in a new browser tab
2. Navigate to **VPC**:
   - If visible in **Recently visited services**, choose **VPC**
   - Otherwise, use the **Services** dropdown → **Networking & Content Delivery** → **VPC**

### VPC Troubleshooting Checklist

Use the left navigation pane to verify each component:

#### 1. Subnets
- [ ] Are the route tables associated with the correct subnets?
- [ ] Is the subnet configured to auto-assign public IPv4 addresses?
- [ ] Is the EC2 instance launched in the correct (public) subnet?

#### 2. Route Tables
- [ ] Does the route table have a route to the Internet Gateway?
- [ ] Is the route `0.0.0.0/0 → igw-xxxxxxxx` present?
- [ ] Is the route table explicitly associated with the public subnet?

#### 3. Internet Gateway
- [ ] Is an Internet Gateway created?
- [ ] Is the Internet Gateway **attached** to the VPC?
- [ ] Is the attachment state `available`?

#### 4. Security Groups
- [ ] Is the correct security group attached to the EC2 instance?
- [ ] **Inbound Rules:**
  - [ ] Is **HTTP (port 80)** allowed from `0.0.0.0/0`?
  - [ ] Is **SSH (port 22)** allowed from your IP or `0.0.0.0/0`?
- [ ] **Outbound Rules:**
  - [ ] Is outbound traffic allowed (typically `All traffic` to `0.0.0.0/0`)?

#### 5. Network ACLs
- [ ] Are the Network ACL rules allowing inbound/outbound traffic?
- [ ] Is there a deny rule blocking HTTP/HTTPS?

#### 6. EC2 Instance Configuration
- [ ] Does the instance have a public IPv4 address assigned?
- [ ] Is the instance in a `running` state?
- [ ] Are the status checks passing?

### Hints

>  **Connectivity Test:** Can you ping websites such as `www.amazon.com` from the EC2 instance? If yes, outbound internet connectivity works (Internet Gateway and route table are functional).

>  **Port Awareness:** Apache is a web server that commonly uses:
> - **HTTP:** Port 80
> - **HTTPS:** Port 443

### Verification

Once you have reviewed all components (routing, security, and resources), confirm the fix by testing:

```
http://<PUBLIC-IP-OF-INSTANCE>
```

**Expected Output:**

The Apache HTTP Server test page should successfully load:

>  **Apache Test Page**
> 
> *Figure: The test page of the Apache HTTP server when Apache is successfully installed.*

---

## Expected Resolution

### Root Cause
In this lab scenario, the most common issue is with **Security Group inbound rules**. Specifically, the security group likely does not allow inbound traffic on **port 80 (HTTP)** from the internet (`0.0.0.0/0`).

### Fix
1. Navigate to **EC2** → **Security Groups**
2. Select the security group attached to your EC2 instance
3. Choose **Edit inbound rules**
4. Add a rule:
   - **Type:** HTTP
   - **Protocol:** TCP
   - **Port range:** 80
   - **Source:** `0.0.0.0/0` (or your specific IP for security)
   - **Description:** Allow web traffic
5. Save the rule
6. Re-test the URL in your browser

---

## Recap

### What We Did
In this lab, you:

1.  **Connected** to an Amazon Linux EC2 instance via SSH
2.  **Installed and started** the Apache HTTP Server (`httpd`)
3.  **Systematically troubleshot** the customer's networking issue by examining:
   - Subnet associations
   - Route table configurations
   - Internet Gateway attachments
   - Security Group rules
   - Network ACLs
4.  **Identified** that the customer had an issue with their **security group inbound rules** (missing HTTP port 80 access)
5.  **Resolved** the issue by adding the appropriate security group rule
6.  **Verified** the Apache server successfully loads in the browser

### Key Takeaways
- Security Groups are **stateful** and act as virtual firewalls at the instance level
- The most common VPC connectivity issues involve:
  1. Missing or incorrect Security Group rules
  2. Missing route to Internet Gateway (`0.0.0.0/0`)
  3. Internet Gateway not attached to VPC
  4. Instance not in a public subnet
- Always verify layer by layer: Instance → Subnet → Route Table → Internet Gateway → Security Groups

---

## Additional Resources

- [What is Amazon VPC?](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)
- [VPC Networking Components](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Networking.html)
- [Security Groups for Your VPC](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html)
- [Connect to Your Linux Instance](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstancesLinux.html)
- [Troubleshoot Instance Connectivity](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/TroubleshootingInstancesConnecting.html)

---

## Lab Complete! 

You have successfully completed the troubleshooting lab. You can now:
- Document your findings for the customer (Ana)
- Close the support ticket with resolution details
- Apply these troubleshooting skills to real-world AWS networking issues

---

*Lab Version: 1.0*  
*Last Updated: 2024*  
*AWS Skill Level: Beginner to Intermediate*
