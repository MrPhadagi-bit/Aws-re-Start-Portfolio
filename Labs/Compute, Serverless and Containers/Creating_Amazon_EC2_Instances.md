# Creating Amazon EC2 Instances

> **AWS Lab Guide** | Estimated Duration: ~45 minutes

---

## 📋 Lab Overview

AWS provides multiple ways to launch Amazon Elastic Compute Cloud (Amazon EC2) instances. In this lab, you will:

1. **Launch a bastion host** using the AWS Management Console
2. **Connect securely** to the bastion host using EC2 Instance Connect
3. **Launch a web server** using the AWS CLI from the bastion host

The following diagram illustrates the final architecture:

```
┌─────────────────────────────────────────────────────────┐
│                        Lab VPC                           │
│  ┌─────────────────────┐    ┌─────────────────────┐    │
│  │   Public Subnet     │    │   Public Subnet     │    │
│  │                     │    │                     │    │
│  │  ┌─────────────┐    │    │  ┌─────────────┐    │    │
│  │  │ Bastion Host│◄───┼────┼──┤  Web Server │    │    │
│  │  │  (t3.micro) │    │    │  │  (t3.micro) │    │    │
│  │  │ Amazon Linux│    │    │  │  + Apache   │    │    │
│  │  └─────────────┘    │    │  └─────────────┘    │    │
│  │         ▲           │    │         ▲           │    │
│  │         │ SSH       │    │         │ HTTP      │    │
│  └─────────┼───────────┘    └─────────┼───────────┘    │
│            │                          │                │
│            └──────────┬───────────────┘                │
│                       │                                 │
│              EC2 Instance Connect                       │
│              + AWS CLI Commands                         │
└─────────────────────────────────────────────────────────┘
```

> 💡 **Optional Challenges**: If you finish early, try the troubleshooting challenges at the end of this lab.

---

## 🎯 Objectives

After completing this lab, you should be able to:

- [x] Launch an EC2 instance using the **AWS Management Console**
- [x] Connect to an EC2 instance using **EC2 Instance Connect**
- [x] Launch an EC2 instance using the **AWS CLI**

---

## 🛠️ Prerequisites

- AWS Management Console access
- Basic familiarity with Linux command line
- Understanding of VPC, subnets, and security groups (helpful but not required)

---

## Task 1: Launching a Bastion Host via AWS Management Console

In this task, you launch an EC2 instance that will serve as a **bastion host** — a jump server from which you can use the AWS CLI to launch additional resources.

### Step 1.1: Navigate to EC2 Console

1. Open the **AWS Management Console**
2. In the **Search bar**, type `EC2` and select **EC2** to open the Amazon EC2 Management Console
3. From the **Launch instance** dropdown, choose **Launch instance**

### Step 1.2: Configure Name and Tags

Tags help categorize AWS resources by purpose, owner, or environment.

| Setting | Value |
|---------|-------|
| **Name** | `Bastion host` |

> ℹ️ When you name an instance, AWS automatically creates a tag with `Key=Name` and `Value=<your input>`.

### Step 1.3: Choose an Amazon Machine Image (AMI)

An AMI is a template that contains:
- A configured root volume (OS, application server, etc.)
- Launch permissions controlling which AWS accounts can use it
- Block device mappings for attached volumes

| Setting | Value |
|---------|-------|
| **Quick Start** | `Amazon Linux` |
| **Description** | Amazon Linux 2 AMI (HVM) |

> ✅ Keep the default selection. This corresponds to **Amazon Linux 2 AMI (HVM)**.

### Step 1.4: Choose an Instance Type

Instance types determine the hardware resources allocated to your EC2 instance.

| Setting | Value |
|---------|-------|
| **Instance type** | `t3.micro` |

**Why t3.micro?**
- Small, burstable performance instance
- Suitable for development, testing, and bursty workloads
- Cost-effective for lab environments

### Step 1.5: Configure Key Pair

| Setting | Value |
|---------|-------|
| **Key pair name** | `Proceed without key pair (Not recommended)` |

> ℹ️ In this lab, you use **EC2 Instance Connect** instead of SSH key pairs to log in.

### Step 1.6: Configure Network Settings

Click **Edit** to expand network configuration options.

| Setting | Value | Notes |
|---------|-------|-------|
| **VPC** | `Lab VPC` | Created via CloudFormation during lab setup |
| **Subnet** | `Public Subnet` | Keep default |
| **Auto-assign public IP** | `Enable` | Keep default |
| **Security group name** | `Bastion security group` | |
| **Description** | `Permit SSH connections` | |

> 🔒 A **security group** acts as a virtual firewall. Rules can be modified anytime and automatically apply to all associated instances.

### Step 1.7: Add Storage

| Setting | Value |
|---------|-------|
| **Root volume** | Keep default (8 GiB) |

### Step 1.8: Configure Advanced Details

| Setting | Value |
|---------|-------|
| **IAM instance profile** | `Bastion-Role` |

> 🔑 The `Bastion-Role` profile grants the instance permissions to make requests to Amazon EC2 via the AWS CLI. **This is required for Task 3.**

### Step 1.9: Launch the Instance

1. Review the **Summary** section
2. Click **Launch instance**
3. Click **View all instances**

---

## Task 2: Connecting to the Bastion Host

In this task, you use **EC2 Instance Connect** to securely log in to the bastion host.

### Step 2.1: Connect via EC2 Instance Connect

1. In the **EC2 Management Console**, select the checkbox next to your **Bastion host** instance
2. Click **Connect**
3. Select the **EC2 Instance Connect** tab
4. Click **Connect**

> 💡 A browser-based terminal session opens, connected to your bastion host.

### Step 2.2: Verify Connection

Once connected, verify you're on the bastion host:

```bash
whoami
# Output: ec2-user

hostname
# Output: ip-xxx-xxx-xxx-xxx
```

> 🎉 You are now connected to the bastion host and can use the AWS CLI to call AWS services.

---

## Task 3: Launching a Web Server via AWS CLI

In this task, you launch a second EC2 instance (web server) programmatically using the AWS CLI. This demonstrates how to automate infrastructure provisioning.

### Step 3.1: Set the AWS Region

Retrieve the Availability Zone and export the Region:

```bash
# Retrieve Availability Zone from instance metadata
AZ=$(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone)

# Export the Region (remove last character from AZ)
export AWS_DEFAULT_REGION=${AZ::-1}

echo $AWS_DEFAULT_REGION
```

**What this does:**
- Uses EC2 instance metadata service (IMDS) to get the current AZ
- Derives the Region by removing the last character (e.g., `us-west-2a` → `us-west-2`)
- Exports it for subsequent AWS CLI commands

> ⚠️ **Important**: If your EC2 Instance Connect session disconnects, environment variables are lost. Refresh your browser to reconnect and **re-run all steps starting from Step 3.1**.

### Step 3.2: Retrieve the Latest Amazon Linux 2 AMI

Use AWS Systems Manager Parameter Store to get the most recent AMI ID:

```bash
AMI=$(aws ssm get-parameters \
    --names /aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2 \
    --query 'Parameters[0].[Value]' \
    --output text)

echo $AMI
```

**What this does:**
- Queries the SSM Parameter Store for the latest Amazon Linux 2 AMI
- Stores the AMI ID in the `$AMI` environment variable
- Using Parameter Store ensures you always get the latest patched AMI

### Step 3.3: Retrieve the Public Subnet ID

```bash
SUBNET=$(aws ec2 describe-subnets \
    --filters 'Name=tag:Name,Values=Public Subnet' \
    --query 'Subnets[].SubnetId' \
    --output text)

echo $SUBNET
```

### Step 3.4: Retrieve the Web Security Group ID

```bash
SG=$(aws ec2 describe-security-groups \
    --filters 'Name=group-name,Values=WebSecurityGroup' \
    --query 'SecurityGroups[].GroupId' \
    --output text)

echo $SG
```

> 🔒 The `WebSecurityGroup` allows inbound HTTP traffic (port 80).

### Step 3.5: Download the User Data Script

Download the script that will configure the web server on launch:

```bash
# Download the user data script
wget https://aws-tc-largeobjects.s3.us-west-2.amazonaws.com/CUR-TF-100-RSJAWS-1-23732/171-lab-JAWS-create-ec2/s3/UserData.txt

# View the script contents
cat UserData.txt
```

**The user data script typically performs:**
1. Updates system packages
2. Installs Apache (`httpd`)
3. Downloads a web application package
4. Extracts and installs the web application
5. Starts the Apache service

### Step 3.6: Launch the Web Server Instance

Run the `run-instances` command with all required parameters:

```bash
INSTANCE=$(aws ec2 run-instances \
    --image-id $AMI \
    --subnet-id $SUBNET \
    --security-group-ids $SG \
    --user-data file:///home/ec2-user/UserData.txt \
    --instance-type t3.micro \
    --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=Web Server}]' \
    --query 'Instances[*].InstanceId' \
    --output text)

echo $INSTANCE
```

**Parameter breakdown:**

| Parameter | Value | Description |
|-----------|-------|-------------|
| `--image-id` | `$AMI` | Latest Amazon Linux 2 AMI from Parameter Store |
| `--subnet-id` | `$SUBNET` | Public subnet for network placement |
| `--security-group-ids` | `$SG` | WebSecurityGroup allowing HTTP access |
| `--user-data` | `file:///home/ec2-user/UserData.txt` | Script to install and configure Apache |
| `--instance-type` | `t3.micro` | Small burstable instance |
| `--tag-specifications` | `Name=Web Server` | Tags the instance for identification |
| `--query` | `Instances[*].InstanceId` | Returns only the instance ID |
| `--output` | `text` | Plain text output (alternatives: `json`, `table`) |

### Step 3.7: Monitor Instance Status

Check the instance status:

```bash
# View all instance details in JSON
aws ec2 describe-instances --instance-ids $INSTANCE

# Check only the instance state
aws ec2 describe-instances \
    --instance-ids $INSTANCE \
    --query 'Reservations[].Instances[].State.Name' \
    --output text
```

> ⏳ The status will show `pending` initially. **Re-run the command until it returns `running`**.

### Step 3.8: Test the Web Server

Retrieve the public DNS name:

```bash
aws ec2 describe-instances \
    --instance-ids $INSTANCE \
    --query 'Reservations[].Instances[].PublicDnsName' \
    --output text
```

**Example output:**
```
ec2-35-11-22-33.us-west-2.compute.amazonaws.com
```

**Test the web server:**
1. Copy the DNS name from the output
2. Open a new browser tab
3. Paste the DNS name and press **Enter**

> ✅ A web page should load, confirming the web server was successfully launched and configured.

**Verify in the Console:**
1. Return to the **EC2 Management Console**
2. In the left navigation pane, choose **Instances**
3. Click **Refresh**
4. You should see both:
   - `Bastion host`
   - `Web Server`

---

## 📊 Comparison: Launch Methods

| Method | Best For | Pros | Cons |
|--------|----------|------|------|
| **AWS Management Console** | One-off or temporary instances | Visual, intuitive, great for learning | Manual, not repeatable, prone to human error |
| **AWS CLI / Scripts** | Automated, repeatable deployments | Programmatic, version-controlled, consistent | Requires scripting knowledge |
| **AWS CloudFormation** | Launching related resources together | Infrastructure as Code, declarative, manages dependencies | Steeper learning curve |

> 💡 **Recommendation**: Use the Console for quick experiments, CLI/scripts for automation, and CloudFormation for production infrastructure.

---

## 🏆 Optional Challenge 1: Troubleshoot EC2 Instance Connect

### Scenario

You have an instance called **Misconfigured Web Server**. Try to connect to it using EC2 Instance Connect.

### Your Tasks

1. Select the **Misconfigured Web Server** instance
2. Click **Connect** → **EC2 Instance Connect**
3. Observe the error
4. Diagnose and fix the misconfiguration

### Hints

<details>
<summary>Click to reveal hints</summary>

- Check the security group inbound rules
- Verify the instance is in a public subnet
- Ensure the instance has a public IP address
- Check the IAM instance profile permissions

</details>

### Discussion Questions

- What was the problem?
- What did you do to fix it?

---

## 🏆 Optional Challenge 2: Fix the Web Server Installation

### Scenario

The **Misconfigured Web Server** instance has a broken web server installation.

### Your Tasks

1. Retrieve the public IPv4 DNS name of the **Misconfigured Web Server**
2. Open it in a browser
3. Diagnose why the web page doesn't load
4. Fix the misconfiguration

### Hints

<details>
<summary>Click to reveal hints</summary>

- SSH into the instance and check if Apache is running:
  ```bash
  sudo systemctl status httpd
  ```
- Check if the web server is installed:
  ```bash
  rpm -q httpd
  ```
- Review the user data script execution logs:
  ```bash
  sudo cat /var/log/cloud-init-output.log
  ```
- Verify security group rules allow HTTP (port 80) inbound

</details>

### Discussion Questions

- What was the problem?
- What did you do to fix it?

---

## ✅ Conclusion

Congratulations! You have successfully completed the following:

- [x] Launched an EC2 instance using the **AWS Management Console**
- [x] Connected to an EC2 instance using **EC2 Instance Connect**
- [x] Launched an EC2 instance using the **AWS CLI**

### Key Takeaways

1. **AWS Management Console** is ideal for quick, one-off instance launches
2. **AWS CLI** enables automation and repeatable infrastructure deployment
3. **User data scripts** automate instance configuration at launch time
4. **Security groups** control inbound and outbound traffic
5. **IAM instance profiles** grant instances permissions to access AWS services

### Next Steps

- Explore **AWS CloudFormation** for Infrastructure as Code
- Learn about **Auto Scaling Groups** for automatic instance scaling
- Investigate **AWS Systems Manager Session Manager** as an alternative to bastion hosts

---

## 📚 Additional Resources

- [Amazon EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [AWS CLI Command Reference - EC2](https://docs.aws.amazon.com/cli/latest/reference/ec2/)
- [EC2 Instance Connect Documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-connect-methods.html)
- [AWS Systems Manager Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html)

---

*Lab complete. Happy cloud computing! ☁️*
