# Amazon EC2 Instances (Challenge) — Lab Guide

> **Level:** Intermediate | **Duration:** ~45 minutes | **Platform:** AWS Management Console

---

##  Lab Overview

In this challenge lab, you apply what you have learned about **Amazon Elastic Compute Cloud (Amazon EC2)**. You will follow high-level steps to create a web application running on an Amazon Linux EC2 instance.

This is a **hands-on, self-directed challenge** — you are expected to use the AWS Console to build the infrastructure from scratch with minimal step-by-step guidance.

---

##  Objectives

After completing this challenge, you should be able to:

-  Configure a virtual network (VPC, subnet, internet gateway, route table)
-  Launch an Amazon Linux EC2 instance into that virtual network
-  Install and configure a web server (`httpd`) via user data
-  Deploy and serve a simple HTML web application
-  Connect securely using SSH via EC2 Instance Connect
-  Verify the web server is publicly accessible

---

##  Your Challenge

Create an Amazon Linux EC2 instance to run a web application. The general steps are outlined below.

---

## Phase 1: Network Setup (VPC)

>  **Hint:** You need to create an internet gateway and properly configure the subnet's route table in your VPC **before** you launch your instance.

### Step 1.1 — Create a New VPC

1. Navigate to **VPC Dashboard** → **Your VPCs** → **Create VPC**
2. Choose **VPC and more** (to auto-create related resources) **OR** create manually:
   - **Name tag:** `ec2-challenge-vpc`
   - **IPv4 CIDR block:** `10.0.0.0/16`
   - **Tenancy:** Default
3. Click **Create VPC**

### Step 1.2 — Create a Public Subnet

1. Go to **Subnets** → **Create subnet**
2. Select your newly created VPC
3. Configure:
   - **Subnet name:** `ec2-challenge-subnet`
   - **Availability Zone:** Choose any (e.g., `us-east-1a`)
   - **IPv4 CIDR block:** `10.0.1.0/24`
4. Click **Create subnet**

### Step 1.3 — Create and Attach an Internet Gateway

1. Go to **Internet Gateways** → **Create internet gateway**
   - **Name tag:** `ec2-challenge-igw`
2. Select the IGW → **Actions** → **Attach to VPC**
3. Select your VPC → **Attach internet gateway**

### Step 1.4 — Update the Route Table

1. Go to **Route Tables** → Select the route table associated with your VPC
2. **Edit routes** → **Add route**
   - **Destination:** `0.0.0.0/0`
   - **Target:** Your Internet Gateway (`igw-xxxxxxxx`)
3. Save changes
4. *(Optional but recommended)*: Go to **Subnet associations** → **Edit subnet associations** → Select your subnet → Save.

>  **Why this matters:** Without the route to `0.0.0.0/0` via the IGW, your instance won't be reachable from the internet.

---

## Phase 2: Launch the EC2 Instance

### Step 2.1 — Launch Instance

1. Navigate to **EC2 Dashboard** → **Instances** → **Launch instances**

### Step 2.2 — Configure Instance Details

| Setting | Requirement |
|---------|-------------|
| **Name** | `ec2-challenge-webserver` |
| **Application and OS Images (AMI)** | **Amazon Linux** (Amazon Linux 2023 or Amazon Linux 2) |
| **Instance type** | **T3 family**, size **smaller than medium** → Use `t3.micro` or `t3.small` |
| **Key pair** | Create new OR use existing (needed for SSH) |
| **Network settings** | **Edit** → Select your VPC and subnet |
| **Auto-assign public IP** | **Enable**  |
| **Firewall (Security Group)** | Create new security group (see below) |

### Step 2.3 — Configure Security Group

Create a security group with the following **Inbound Rules**:

| Type | Protocol | Port Range | Source | Description |
|------|----------|------------|--------|-------------|
| **SSH** | TCP | 22 | `0.0.0.0/0` or `My IP` | EC2 Instance Connect / SSH access |
| **HTTP** | TCP | 80 | `0.0.0.0/0` | Web server traffic |

>  **Important:** In production, restrict SSH to your specific IP (`My IP`). For this lab, `0.0.0.0/0` is acceptable for learning purposes.

### Step 2.4 — Add User Data (Bootstrap Script)

Expand **Advanced details** → Scroll to **User data**.

Paste the following script to automatically install and start the web server:

```bash
#!/bin/bash
# Update all packages
yum update -y

# Install Apache HTTP Server (httpd)
yum install -y httpd

# Start the httpd service
systemctl start httpd

# Enable httpd to start on boot
systemctl enable httpd

# Give write permission to users for the web server's document root
chmod 777 /var/www/html

# Create a simple test page (optional - verifies installation)
echo "<h1>Apache is running on Amazon Linux</h1>" > /var/www/html/index.html
```

>  **What this does:**
> - Updates the system packages
> - Installs `httpd` (Apache Web Server)
> - Starts and enables the service
> - Sets permissions on `/var/www/html` so you can write files later
> - Creates a temporary test page

### Step 2.5 — Configure Storage

- **Root volume:** Keep the default size (e.g., 8 GiB)
- **Volume type:** Select **General Purpose SSD (gp2)**

### Step 2.6 — Launch

Review and **Launch instance**.

Wait for the instance state to show **Running** and the **Status checks** to show **2/2 checks passed**.

---

## Phase 3: Verify Installation via System Logs

### Step 3.1 — Capture Screenshot of System Log

1. Select your running instance
2. Click **Actions** → **Monitor and troubleshoot** → **Get system log**
3. Review the log output — you should see:
   - `httpd` installation messages
   - `Starting httpd:` or `Started The Apache HTTP Server`
   - No critical errors

4.  **Capture a screenshot** of the system log showing that `httpd` was successfully installed.

>  **Troubleshooting:** If you don't see httpd installation logs, verify:
> - The user data script was pasted correctly
> - The instance was launched with the correct AMI (Amazon Linux)
> - You checked the log after the instance has fully initialized (may take 2-3 minutes)

---

## Phase 4: Connect & Deploy the Web Page

### Step 4.1 — Connect via EC2 Instance Connect

 **Hint:** You need to use **EC2 Instance Connect** to connect over SSH using a web browser.

1. Select your instance → Click **Connect**
2. Choose the **EC2 Instance Connect** tab
3. Ensure **Connect using EC2 Instance Connect** is selected
4. User name should be `ec2-user`
5. Click **Connect**

A browser-based terminal will open.

### Step 4.2 — Create the HTML File

Inside the EC2 Instance Connect terminal, create the project file:

```bash
# Navigate to the web server document root
cd /var/www/html

# Create the projects.html file using a text editor
# Option A: Using nano (if available)
nano projects.html

# Option B: Using cat with heredoc
cat > projects.html << 'EOF'
<!DOCTYPE html>
<html>
<body>
<h1>YOUR-NAME's re/Start Project Work</h1>
<p>EC2 Instance Challenge Lab</p>
</body>
</html>
EOF
```

>  **Replace `YOUR-NAME` with your actual name** before saving!

### Step 4.3 — Verify File Placement

```bash
# List files in the web root
ls -la /var/www/html/

# Verify the content
cat /var/www/html/projects.html
```

>  **Note:** If you encounter permission issues, use `sudo`:
> ```bash
> sudo nano /var/www/html/projects.html
> # or
> sudo chmod 777 /var/www/html
> ```

---

## Phase 5: Test & Validate

### Step 5.1 — Access the Web Page

1. Go back to the **EC2 Dashboard** → Select your instance
2. Copy the **Public IPv4 address** (e.g., `3.85.123.45`)

>  **Hint:** Use the **public IPv4 address** of the instance to access your webpage.

3. Open a web browser and navigate to:
   ```
   http://<YOUR-PUBLIC-IP>/projects.html
   ```
   Example: `http://3.85.123.45/projects.html`

### Step 5.2 — Capture Screenshot

You should see a page displaying:

> # YOUR-NAME's re/Start Project Work
> EC2 Instance Challenge Lab

 **Capture a screenshot** showing that the page was successfully returned and displayed.

---

##  Submission Checklist

Submit the following screenshots to your instructor:

| # | Screenshot Description |
|---|------------------------|
| 1 | **EC2 System Log** showing `httpd` successfully installed |
| 2 | **Browser Screenshot** showing `projects.html` rendered correctly with your name |

---

##  Hints & Troubleshooting

| Issue | Solution |
|-------|----------|
| **Cannot access webpage** | Verify Security Group allows HTTP (port 80) from `0.0.0.0/0` |
| **Cannot connect via SSH** | Verify Security Group allows SSH (port 22). Check that the instance has a public IP assigned. |
| **httpd not found in logs** | Ensure you used an **Amazon Linux AMI** and the user data script was entered before launch. |
| **Permission denied writing to /var/www/html** | Use `sudo` or ensure `chmod 777 /var/www/html` was in user data. |
| **Page shows "Forbidden"** | Check file permissions: `sudo chmod 644 /var/www/html/projects.html` |
| **EC2 Instance Connect fails** | Ensure the instance is running, has a public IP, and the security group allows SSH. |

---

##  Additional Resources

For additional guidance, refer to the following labs:

- **Creating Amazon EC2 Instances** *(prerequisite lab)*

### AWS Documentation
- [Amazon EC2 User Guide](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/)
- [Amazon VPC User Guide](https://docs.aws.amazon.com/vpc/latest/userguide/)
- [EC2 Instance Connect](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-connect-methods.html)
- [Apache HTTP Server on Amazon Linux](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-lamp-amazon-linux-2023.html)

---

## 🏁 Lab Complete

Congratulations! You have successfully:
-  Created a custom VPC with public internet access
-  Launched an Amazon Linux EC2 instance with proper networking
-  Automated web server installation using user data
-  Connected securely via EC2 Instance Connect
-  Deployed a custom HTML webpage
-  Verified public accessibility of your web application

---

*Generated for AWS re/Start Program — EC2 Challenge Lab*
