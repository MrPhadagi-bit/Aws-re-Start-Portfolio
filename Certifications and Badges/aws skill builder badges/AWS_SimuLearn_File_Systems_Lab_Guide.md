# AWS SimuLearn: File Systems in the Cloud
## Lab Demonstration Guide

> **Completion Date:** May 20, 2026  
> **Awarded To:** Phadagi Mannda Raven  
> **Certifying Authority:** Michelle Vaz, Director, AWS Training & Certification  
> **Format:** AI-Powered Game-Based Learning with Hands-On Lab

---


## 1. Overview

AWS SimuLearn: File Systems in the Cloud is an AI-powered, game-based learning experience that combines interactive customer scenarios with live AWS sandbox environments. This module focuses on designing and implementing cloud-based file storage solutions using **Amazon EFS (Elastic File System)** and **Amazon FSx**.

The learning experience is divided into two main phases:
- **SimuLearn Scenario:** An interactive chat-based customer meeting where you design a solution architecture by answering technical questions
- **Hands-On Lab:** A guided, step-by-step implementation in a live AWS Management Console

---

## 2. Learning Objectives

Upon completing this lab, you will be able to:

- **Identify** appropriate AWS file storage services for different use cases (EFS vs. FSx vs. S3)
- **Design** scalable file system architectures for cloud workloads
- **Implement** Amazon EFS file systems with proper security configurations
- **Configure** Amazon FSx for Windows File Server or Lustre workloads
- **Mount** file systems to EC2 instances across multiple Availability Zones
- **Apply** security best practices including VPC, security groups, and IAM policies
- **Validate** file system performance and accessibility

---

## 3. Prerequisites

### Knowledge Requirements
- Basic understanding of AWS core services (VPC, EC2, IAM)
- Familiarity with Linux/Windows file system concepts
- Understanding of networking fundamentals (subnets, security groups)

### Technical Requirements
- AWS Skill Builder account (free tier available)
- Modern web browser (Chrome, Firefox, Edge)
- Stable internet connection
- Approximately **60-90 minutes** to complete

---

## 4. Architecture Scenario

### Customer Context
You are presented with a business scenario where a customer needs to migrate or implement file storage in the cloud. Common scenarios include:

- **Content Management System:** Shared storage for web servers across multiple AZs
- **Media Processing:** High-performance shared storage for video/audio processing
- **Enterprise File Sharing:** Windows-compatible file shares for business applications
- **Big Data Analytics:** High-throughput storage for data processing workloads

### Solution Components

```
┌─────────────────────────────────────────────────────────────┐
│                      AWS Cloud                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    VPC                              │   │
│  │  ┌─────────────┐    ┌─────────────┐                │   │
│  │  │  Public     │    │   Private   │                │   │
│  │  │  Subnet     │    │   Subnet    │                │   │
│  │  │  (AZ-1)     │    │   (AZ-1)    │                │   │
│  │  └──────┬──────┘    └──────┬──────┘                │   │
│  │         │                  │                        │   │
│  │  ┌──────┴──────┐    ┌──────┴──────┐                │   │
│  │  │  EC2        │    │  EC2        │                │   │
│  │  │  Instance   │◄──►│  Instance   │                │   │
│  │  │  (Web/App)  │    │  (Web/App)  │                │   │
│  │  └──────┬──────┘    └──────┬──────┘                │   │
│  │         │                  │                        │   │
│  │         └────────┬─────────┘                        │   │
│  │                  │                                   │   │
│  │         ┌────────▼─────────┐                        │   │
│  │         │  Amazon EFS      │                        │   │
│  │         │  File System     │                        │   │
│  │         │  (Shared Storage)│                        │   │
│  │         └──────────────────┘                        │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Phase 1: Customer Discovery & Solution Design

### 5.1 Starting the Scenario

1. Navigate to [AWS Skill Builder](https://skillbuilder.aws)
2. Search for **"AWS SimuLearn: File Systems in the Cloud"**
3. Click **"Start Learning"** to launch the SimuLearn module
4. Select your preferred mode:
   - **Chat Mode** (Recommended): Interactive conversation with AI customer
   - **Scripted Mode**: Guided step-by-step with pre-defined questions

### 5.2 The Customer Meeting

During the interactive scenario, you will engage in a simulated customer meeting. The AI customer will describe their requirements, and you must ask clarifying questions and propose appropriate solutions.

#### Key Questions to Consider:

| Question | Why It Matters |
|----------|---------------|
| What type of workloads will access the file system? | Determines EFS (Linux) vs. FSx (Windows/Lustre) |
| How many concurrent connections are expected? | Affects performance mode selection |
| What is the expected data volume and growth rate? | Determines storage class and capacity |
| Do you need cross-AZ availability? | Affects mount target placement |
| What are the performance requirements (IOPS/throughput)? | Determines throughput mode |
| Do you need data encryption at rest/transit? | Affects security configuration |
| Is this for lift-and-shift or new architecture? | Determines compatibility requirements |

### 5.3 Solution Design Decisions

#### Decision Matrix: Choosing the Right File System

| Requirement | Recommended Service | Justification |
|-------------|-------------------|---------------|
| Linux-based workloads, shared access across AZs | **Amazon EFS** | POSIX-compliant, elastic capacity, multi-AZ by default |
| Windows-based workloads, SMB protocol | **Amazon FSx for Windows File Server** | Native Windows compatibility, Active Directory integration |
| High-performance computing, Lustre | **Amazon FSx for Lustre** | Sub-millisecond latency, high throughput for HPC |
| Read-heavy, infrequently accessed data | **EFS Infrequent Access (IA)** | Cost-optimized for archival workloads |
| Big data analytics, machine learning | **FSx for Lustre** | Integrates with S3 for data lake scenarios |

#### EFS Configuration Decisions:

1. **Performance Mode:**
   - **General Purpose** (Default): Latency-sensitive use cases, web serving, content management
   - **Max I/O**: Higher latency but higher aggregate throughput, big data, media processing

2. **Throughput Mode:**
   - **Bursting** (Default): Scales with storage size, good for variable workloads
   - **Provisioned**: Fixed throughput regardless of storage size, predictable performance
   - **Elastic** (Recommended): Automatically scales based on workload, cost-efficient

3. **Storage Class:**
   - **Standard**: Frequently accessed data
   - **Infrequent Access (IA)**: Cost savings for files not accessed daily
   - **Archive**: Lowest cost for rarely accessed data (EFS only)

---

## 6. Phase 2: Hands-On Lab Implementation

### 6.1 Lab Environment Setup

After completing the scenario phase, you will be directed to the **Hands-On Lab** section.

1. Click **"Go to Lab"** or **"Start Lab"**
2. Wait for the AWS sandbox environment to provision (typically 2-3 minutes)
3. The lab provides temporary AWS credentials and a pre-configured VPC

### 6.2 Lab Architecture Overview

The lab environment typically includes:
- **Pre-created VPC** with public and private subnets across 2 AZs
- **Internet Gateway** and **NAT Gateway** (if required)
- **Security Groups** with basic rules
- **IAM Role** for EC2 instances
- **AWS Cloud9** or direct console access

---

## 7. Step-by-Step Lab Walkthrough

### Step 1: Access the AWS Management Console

1. Click **"AWS Console"** button in the lab interface
2. Use the provided credentials (temporary for this lab)
3. Ensure you're in the correct **Region** (usually US East - N. Virginia)

### Step 2: Verify Pre-Created Resources

1. Navigate to **VPC Dashboard**
2. Verify the following exist:
   - VPC (e.g., `Lab VPC`)
   - 2 Public Subnets (AZ-1a, AZ-1b)
   - 2 Private Subnets (AZ-1a, AZ-1b)
   - Internet Gateway attached to VPC
   - Route Tables configured

3. Navigate to **EC2 Dashboard** → **Instances**
4. Verify if starter EC2 instances exist (or you may need to create them)

### Step 3: Create Security Groups

#### 3.1 EFS Security Group

1. Navigate to **EC2** → **Security Groups** → **Create Security Group**
2. Configure:
   - **Security Group Name:** `EFS-SG`
   - **Description:** `Security group for EFS mount targets`
   - **VPC:** Select your lab VPC
3. Add Inbound Rules:
   - **Type:** NFS
   - **Protocol:** TCP
   - **Port Range:** 2049
   - **Source:** Custom → Select `EC2-SG` (or your EC2 security group)
   - **Description:** `Allow NFS from EC2 instances`
4. Click **Create Security Group**

#### 3.2 EC2 Security Group (if not pre-created)

1. Navigate to **EC2** → **Security Groups** → **Create Security Group**
2. Configure:
   - **Security Group Name:** `EC2-SG`
   - **Description:** `Security group for EC2 web instances`
   - **VPC:** Select your lab VPC
3. Add Inbound Rules:
   - **Type:** SSH (or HTTP/HTTPS if web server)
   - **Source:** My IP (or 0.0.0.0/0 for lab purposes)
4. Click **Create Security Group**

### Step 4: Create the Amazon EFS File System

1. Navigate to **EFS Dashboard** (search "EFS" in services)
2. Click **"Create file system"**
3. Click **"Customize"** (to configure advanced options)

#### 4.1 General Configuration

- **Name:** `MyLabEFS`
- **Automatic backups:** Enable (for lab) or Disable
- **Lifecycle management:** 
  - Transition to IA: **30 days** (or After 7 days for faster demo)
  - Transition to Archive: **90 days** (optional)

#### 4.2 Performance & Throughput

- **Performance mode:** General Purpose (recommended for most workloads)
- **Throughput mode:** Elastic (auto-scales, recommended)
- **Encryption:** Enable encryption at rest (AWS managed key)

#### 4.3 Network Access

1. Click **"Add mount target"** for each Availability Zone:
   - **AZ 1 (us-east-1a):**
     - Subnet: Select private subnet in 1a
     - Security Group: `EFS-SG`
   - **AZ 2 (us-east-1b):**
     - Subnet: Select private subnet in 1b
     - Security Group: `EFS-SG`
2. Ensure mount targets are created in **at least 2 AZs** for high availability

#### 4.4 File System Policy (Optional)

- For lab purposes, you can skip or set a basic policy
- In production, enforce encryption in transit and read-only/root squash policies

#### 4.5 Create File System

1. Review all settings
2. Click **"Create"**
3. Wait for file system status to become **Available** (green)
4. Note the **File system ID** (e.g., `fs-0abc123def456789`)

### Step 5: Launch EC2 Instances

#### 5.1 Instance 1 (AZ-1a)

1. Navigate to **EC2 Dashboard** → **Launch Instance**
2. Configure:
   - **Name:** `WebServer-1a`
   - **AMI:** Amazon Linux 2023 (or Amazon Linux 2)
   - **Instance Type:** t3.micro (lab-appropriate)
   - **Key Pair:** Select existing or create new (download .pem file)
   - **Network Settings:**
     - VPC: Lab VPC
     - Subnet: Public subnet in AZ-1a
     - Auto-assign public IP: Enable
     - Security Group: `EC2-SG`
   - **Advanced Details:**
     - IAM Instance Profile: Select lab-provided role
3. Click **Launch Instance**

#### 5.2 Instance 2 (AZ-1b)

1. Repeat the process for second instance:
   - **Name:** `WebServer-1b`
   - **Subnet:** Public subnet in AZ-1b
   - All other settings identical

#### 5.3 Verify Instances

1. Wait for both instances to show **Instance State: Running**
2. Note the **Public IPv4 addresses** for SSH access

### Step 6: Install EFS Utilities and Mount File System

#### 6.1 Connect to Instance 1 (AZ-1a)

```bash
# Using SSH from your local terminal (or AWS CloudShell)
ssh -i "your-key.pem" ec2-user@<Instance-1a-Public-IP>
```

#### 6.2 Install EFS Mount Helper

```bash
# Update system packages
sudo yum update -y

# Install Amazon EFS utilities (Amazon Linux 2023/2)
sudo yum install -y amazon-efs-utils

# Verify installation
mount.efs --version
```

#### 6.3 Create Mount Point

```bash
# Create directory for EFS mount
sudo mkdir -p /var/www/html

# Set appropriate permissions
sudo chmod 777 /var/www/html
```

#### 6.4 Mount EFS Using DNS Name

```bash
# Get your File System ID from EFS console (e.g., fs-0abc123def456789)
# Replace <file-system-id> and <region> with actual values

sudo mount -t efs -o tls <file-system-id>:/ /var/www/html

# Example:
# sudo mount -t efs -o tls fs-0abc123def456789:/ /var/www/html
```

#### 6.5 Verify Mount

```bash
# Check mounted file systems
df -h

# Expected output should show:
# <file-system-id>.efs.<region>.amazonaws.com:/  8.0E  ... /var/www/html

# Test write access
cd /var/www/html
sudo touch test-file-from-1a.txt
echo "Hello from Instance in AZ-1a" | sudo tee test-file-from-1a.txt
ls -la
```

#### 6.6 Configure Automatic Mount (fstab)

```bash
# Edit fstab for persistent mount
sudo cp /etc/fstab /etc/fstab.bak

# Add EFS mount entry (using DNS name with tls option)
echo "<file-system-id>.efs.<region>.amazonaws.com:/ /var/www/html efs _netdev,tls 0 0" | sudo tee -a /etc/fstab

# Example:
# echo "fs-0abc123def456789.efs.us-east-1.amazonaws.com:/ /var/www/html efs _netdev,tls 0 0" | sudo tee -a /etc/fstab

# Test fstab entry (without rebooting)
sudo mount -a

# Verify no errors
df -h | grep efs
```

### Step 7: Mount EFS on Instance 2 (AZ-1b)

1. SSH into the second instance:
```bash
ssh -i "your-key.pem" ec2-user@<Instance-1b-Public-IP>
```

2. Repeat Steps 6.2 through 6.6:
```bash
# Install utilities
sudo yum install -y amazon-efs-utils

# Create mount point
sudo mkdir -p /var/www/html
sudo chmod 777 /var/www/html

# Mount EFS (same file system ID!)
sudo mount -t efs -o tls <file-system-id>:/ /var/www/html

# Verify shared access
cd /var/www/html
ls -la
# You should see test-file-from-1a.txt created by the first instance!

# Create a file from this instance
echo "Hello from Instance in AZ-1b" | sudo tee test-file-from-1b.txt
```

### Step 8: Verify Cross-AZ File Sharing

#### 8.1 Test File Synchronization

```bash
# On Instance 1 (AZ-1a)
ssh -i "your-key.pem" ec2-user@<Instance-1a-Public-IP>
cd /var/www/html
cat test-file-from-1b.txt
# Should display: Hello from Instance in AZ-1b

# Create another shared file
echo "Shared content accessible from both AZs" | sudo tee shared-content.txt
```

#### 8.2 Verify on Instance 2

```bash
# On Instance 2 (AZ-1b)
cat shared-content.txt
# Should display: Shared content accessible from both AZs
```

### Step 9: Configure Web Server (Optional Enhancement)

If demonstrating a web application scenario:

```bash
# On both instances
sudo yum install -y httpd
sudo systemctl start httpd
sudo systemctl enable httpd

# Create shared web content in EFS
sudo tee /var/www/html/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head><title>AWS EFS Demo</title></head>
<body>
<h1>Hello from AWS EFS Shared Storage!</h1>
<p>This content is served from a shared EFS file system across multiple AZs.</p>
<p>Server: <!--#echo var="SERVER_NAME" --></p>
</body>
</html>
EOF

# Configure Apache to serve from EFS
# Edit /etc/httpd/conf/httpd.conf to set DocumentRoot "/var/www/html"

sudo systemctl restart httpd
```

### Step 10: Monitor EFS Performance

1. Navigate to **EFS Dashboard** → Select your file system
2. Click **"Monitoring"** tab
3. Observe metrics:
   - **Client connections:** Should show 2 (one per instance)
   - **Data read/write:** Activity from file operations
   - **Burst credit balance:** For bursting throughput mode
   - **Storage usage:** Amount of data stored

---

## 8. Verification & Testing

### 8.1 Functional Tests

| Test | Command/Action | Expected Result |
|------|---------------|-----------------|
| Mount verification | `df -h \| grep efs` | Shows EFS mount point |
| Cross-AZ read | `cat /var/www/html/test-file-from-1b.txt` from 1a | Content visible |
| Cross-AZ write | `touch new-file` from 1b, `ls` from 1a | File appears on both |
| Persistence | `sudo reboot` then check mount | EFS remounts automatically |
| Encryption | Check EFS console | "Encryption at rest: Enabled" |

### 8.2 Architecture Validation Checklist

- [ ] EFS file system created in **2+ Availability Zones**
- [ ] Security groups restrict NFS (port 2049) to appropriate sources
- [ ] EC2 instances in different AZs can read/write shared files
- [ ] Data persists across instance reboots
- [ ] Encryption at rest is enabled
- [ ] Encryption in transit (TLS) is configured
- [ ] Automatic mount configured in `/etc/fstab`

---

## 9. Cleanup

> ⚠️ **Important:** The lab environment is temporary and will auto-terminate. However, for good practice:

### 9.1 Unmount EFS

```bash
# On both instances
sudo umount /var/www/html

# Remove from fstab
sudo sed -i '/efs/d' /etc/fstab
```

### 9.2 Terminate Resources (if manually created)

1. **EC2 Instances:**
   - Navigate to EC2 → Instances
   - Select both instances → Actions → Terminate

2. **EFS File System:**
   - Navigate to EFS → Select file system
   - Delete (must delete mount targets first, or use "Delete file system" which handles dependencies)

3. **Security Groups:**
   - Delete `EFS-SG` and `EC2-SG` (if created manually)

### 9.3 End Lab Session

1. Return to **AWS Skill Builder** lab page
2. Click **"End Lab"** to release sandbox resources
3. Confirm completion to record your progress

---

## 10. Key Takeaways

### Architecture Best Practices

1. **Multi-AZ Deployment:** Always deploy EFS mount targets in multiple AZs for high availability
2. **Security Groups:** Restrict NFS access (port 2049) to only necessary EC2 security groups
3. **Encryption:** Enable encryption at rest and in transit (TLS) for sensitive data
4. **Performance Mode:** Use General Purpose for most workloads; Max I/O only for specific big data scenarios
5. **Throughput Mode:** Elastic throughput is recommended for variable workloads; provisioned for predictable needs

### Cost Optimization

- Use **EFS Infrequent Access (IA)** for files not accessed daily (automatic lifecycle policies)
- Use **Bursting throughput** for workloads with spiky patterns
- Monitor **Burst Credit Balance** to avoid performance degradation
- Consider **EFS Archive** for long-term retention of rarely accessed files

### When to Use What

| Use Case | Service | Key Feature |
|----------|---------|-------------|
| Shared Linux storage | **Amazon EFS** | POSIX-compliant, elastic |
| Windows file shares | **FSx for Windows** | SMB, NTFS, AD integration |
| HPC / Machine Learning | **FSx for Lustre** | Sub-millisecond latency |
| Big Data Analytics | **FSx for Lustre + S3** | Linked data repositories |
| Simple web assets | **Amazon S3** | Object storage, CDN integration |

---

## 11. Troubleshooting

### Common Issues & Solutions

#### Issue: Mount fails with "Connection timed out"

**Diagnosis:** Security group or network ACL blocking NFS traffic

**Solution:**
```bash
# Verify security group rules
# EFS Security Group must allow inbound TCP 2049 from EC2 Security Group
# EC2 Security Group must allow outbound to EFS Security Group

# Verify mount target AZ matches instance AZ
# Check VPC and subnet configuration
```

#### Issue: "Permission denied" when writing to EFS

**Diagnosis:** File system permissions or IAM policy restrictions

**Solution:**
```bash
# Check mount point permissions
sudo chmod 777 /var/www/html

# Verify EFS file system policy doesn't enforce read-only
# Check IAM role permissions (if using IAM authorization)
```

#### Issue: Slow performance

**Diagnosis:** Incorrect performance/throughput mode or burst credits depleted

**Solution:**
```bash
# Check CloudWatch metrics for burst credit balance
# Consider changing to Provisioned or Elastic throughput mode
# Verify instance type isn't network-constrained (t3 has baseline limits)
```

#### Issue: Files not visible across instances

**Diagnosis:** Different EFS file systems mounted or mount target issues

**Solution:**
```bash
# Verify both instances mount the SAME File System ID
df -h | grep efs

# Check mount target availability in each AZ
# Ensure DNS resolution works: nslookup <file-system-id>.efs.<region>.amazonaws.com
```

---

## 12. Additional Resources

### Official AWS Documentation
- [Amazon EFS User Guide](https://docs.aws.amazon.com/efs/latest/ug/)
- [Amazon FSx for Windows File Server](https://docs.aws.amazon.com/fsx/latest/WindowsGuide/)
- [Amazon FSx for Lustre](https://docs.aws.amazon.com/fsx/latest/LustreGuide/)
- [EFS Performance Tips](https://docs.aws.amazon.com/efs/latest/ug/performance.html)

### AWS Training
- [AWS SimuLearn Portal](https://aws.amazon.com/training/digital/aws-simulearn/)
- [AWS Cloud Quest](https://aws.amazon.com/training/digital/cloud-quest/)
- [AWS Skill Builder - Storage Learning Plan](https://skillbuilder.aws)

### Hands-On Labs
- [Introduction to Amazon EFS](https://aws.amazon.com/getting-started/hands-on/intro-to-efs/)
- [EFS Workshop](https://catalog.us-east-1.prod.workshops.aws/workshops/6c4d5a4e-7a63-461d-935c-7254f45de84d/en-US)
- [FSx for Windows Workshop](https://catalog.us-east-1.prod.workshops.aws/workshops/6c4d5a4e-7a63-461d-935c-7254f45de84d/en-US)

---

## Appendix A: Quick Reference Commands

```bash
# Install EFS utils
sudo yum install -y amazon-efs-utils

# Mount EFS with TLS encryption
sudo mount -t efs -o tls <fs-id>:/ /mnt/efs

# Mount using EFS mount helper (recommended)
sudo mount -t efs -o tls <fs-id>:/ /mnt/efs

# Add to /etc/fstab for persistence
<fs-id>.efs.<region>.amazonaws.com:/ /mnt/efs efs _netdev,tls 0 0

# Check mount status
df -h | grep efs
mount | grep efs

# Check EFS connections from instance
cat /proc/mounts | grep efs
```

## Appendix B: Architecture Diagram Source

For documentation or presentation purposes, the architecture uses:
- **VPC:** Isolated network environment
- **Public Subnets:** For load balancers or bastion hosts
- **Private Subnets:** For application instances (if using ALB)
- **EFS:** Shared storage layer across all AZs
- **EC2:** Compute layer with horizontal scaling across AZs

---

## Document Information

| Field | Value |
|-------|-------|
| **Document Title** | AWS SimuLearn: File Systems in the Cloud - Lab Demonstration Guide |
| **Version** | 1.0 |
| **Last Updated** | May 20, 2026 |
| **Author** | Phadagi Mannda Raven |
| **Certification** | AWS Training & Certification |
| **Lab Type** | SimuLearn AI-Powered Game-Based Learning |
| **Services Covered** | Amazon EFS, Amazon EC2, Amazon VPC, Security Groups |
| **Estimated Duration** | 60-90 minutes |
| **Difficulty Level** | Intermediate (Cloud Practitioner / Solutions Architect Associate) |

---

> **Congratulations!** You have completed the AWS SimuLearn: File Systems in the Cloud lab demonstration. This guide serves as both a reference for your completed training and a reusable template for implementing EFS in production environments.
> 
> *"Build with confidence, scale with EFS."*
