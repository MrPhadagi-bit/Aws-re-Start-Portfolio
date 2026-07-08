# Working with AWS CloudTrail: Activity Overview

## Table of Contents
1. [Introduction](#introduction)
2. [Activity Overview](#activity-overview)
3. [Prerequisites](#prerequisites)
4. [Architecture](#architecture)
5. [Task 1: Modifying a Security Group and Observing the Website](#task-1)
6. [Task 2: Creating a CloudTrail Log and Observing the Hacked Website](#task-2)
7. [Task 3: Analyzing the CloudTrail Logs by Using grep](#task-3)
8. [Task 4: Analyzing the CloudTrail Logs by Using Athena](#task-4)
9. [Challenge: Identify the Hacker](#challenge)
10. [Task 5: Analyzing the Hack Further and Improving Security](#task-5)
11. [Conclusion](#conclusion)

---

## Introduction

Welcome to the **Working with AWS CloudTrail** hands-on activity! In this lab, you will step into the role of **Sofîa**, a security analyst at the Café, and investigate a security incident involving a hacked website. You will use AWS CloudTrail to audit actions taken in your AWS account, analyze logs using multiple methods, and ultimately identify and remove the threat.

### Business Case Relevance

Martha and Frank, the Café leadership team, are concerned because the website was hacked. They need someone to discover who did it and ensure it doesn't happen again. Faythe, Frank, Martha, and others make frequent changes to the website, and sometimes those changes cause issues. This morning, the website was compromised. Martha and Frank are asking Sofîa if there is a way to track what was changed and who made the changes.

**Your mission:** Play the role of Sofîa, become a detective, and discover the culprit.

---

## Activity Overview

### Duration
This lab requires approximately **75 minutes** to complete.

### Activity Objectives
After completing this activity, you will be able to:

- Configure a CloudTrail trail
- Analyze CloudTrail logs by using various methods to discover relevant information
- Import CloudTrail log data into Athena
- Run queries in Athena to filter CloudTrail log entries
- Resolve security concerns within the AWS account and on an EC2 Linux instance

### Starting Point
The activity begins with an **Amazon Elastic Compute Cloud (Amazon EC2) instance** named **Café Web Server**, which runs a web application that hosts the Café website.

---

## Prerequisites

Before starting this activity, ensure you have:

- Access to the AWS Management Console with appropriate permissions
- A terminal or SSH client (PuTTY for Windows, Terminal for macOS/Linux)
- Basic familiarity with AWS EC2, IAM, and S3 services
- Basic knowledge of Linux command line and SQL

---

## Architecture

The architectural diagram illustrates the setup that this activity uses:

```
┌─────────────────────────────────────────────────────────────────────┐
│                           AWS Cloud                                  │
│                                                                      │
│   ┌─────────────────────────────────────────────────────────────┐    │
│   │                    AWS Management Console                    │    │
│   │                                                              │    │
│   │   ┌─────────────┐    ┌─────────────┐    ┌──────────────┐    │    │
│   │   │   CloudTrail │    │    EC2      │    │    Athena    │    │    │
│   │   │   (Trail)   │───▶│  (Web Server)│    │  (Query Logs)│    │    │
│   │   └──────┬──────┘    └──────┬──────┘    └──────────────┘    │    │
│   │          │                  │                                │    │
│   │          ▼                  ▼                                │    │
│   │   ┌──────────────────────────────────────┐                   │    │
│   │   │         S3 Bucket                   │                   │    │
│   │   │    (monitoring#### - Log Storage)   │                   │    │
│   │   └──────────────────────────────────────┘                   │    │
│   │                                                              │    │
│   └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│   ┌─────────────────────────────────────────────────────────────┐    │
│   │              SSH Connection (Port 22)                      │    │
│   │         ┌──────────┐          ┌──────────────┐             │    │
│   │         │  Your IP  │◄────────►│ Café Web     │             │    │
│   │         │  (/32)    │          │ Server (EC2) │             │    │
│   │         └──────────┘          └──────────────┘             │    │
│   └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│   ┌─────────────────────────────────────────────────────────────┐    │
│   │              HTTP Access (Port 80)                          │    │
│   │         ┌──────────┐          ┌──────────────┐             │    │
│   │         │  Browser  │◄────────►│ Café Website │             │    │
│   │         │  (Any IP) │          │  (/cafe/)    │             │    │
│   │         └──────────┘          └──────────────┘             │    │
│   └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### Key Components

| Component | Description |
|-----------|-------------|
| **Café Web Server (EC2)** | The target instance running the Café website |
| **WebSecurityGroup** | Security group controlling inbound/outbound traffic |
| **CloudTrail Trail** | Auditing service capturing all API activity |
| **S3 Bucket** | Storage for CloudTrail log files (`monitoring####`) |
| **Athena** | Interactive query service for SQL-based log analysis |
| **IAM Users** | Includes legitimate users and the suspicious `chaos` user |

---

## Task 1: Modifying a Security Group and Observing the Website

### Objective
Establish secure SSH access to the Café Web Server and verify the website is functioning normally before the incident.

### Steps

#### 1.1 Navigate to EC2 Console
1. From the **Services** menu, choose **Compute** → **EC2**
2. Choose **Instances**
3. Locate and select the **Café Web Server (WebSecurityGroup)** instance

#### 1.2 Review Security Group Rules
1. Click the **Security** tab
2. Choose the `sg-xxxxxxxxxx` security group
3. In the **Inbound rules** tab, observe that only one inbound rule exists:
   - **Type:** HTTP
   - **Protocol:** TCP
   - **Port Range:** 80
   - **Source:** 0.0.0.0/0

#### 1.3 Add SSH Access Rule
1. Choose **Edit inbound rules**
2. Choose **Add rule** and configure:

| Field | Value |
|-------|-------|
| **Type** | SSH |
| **Protocol** | TCP |
| **Port Range** | 22 |
| **Source** | My IP |

> ⚠️ **CRITICAL SECURITY NOTE:** Confirm that the TCP port 22 access is open to **only your IP address**. The entry should show a CIDR block with your specific IP address followed by `/32` (e.g., `203.0.113.1/32`), **NOT** `0.0.0.0/0` (which allows access from anywhere).

3. Choose **Save rules**

#### 1.4 Verify the Website
1. Select the **Café Web Server** instance
2. Click the **Details** tab
3. Copy the **Public IPv4 address** value
4. Open a new browser tab and navigate to:
   ```
   http://<WebServerIP>/cafe/
   ```
5. **Expected Result:** The website looks normal with appropriate bakery café photos

---

## Task 2: Creating a CloudTrail Log and Observing the Hacked Website

### Objective
Create a CloudTrail trail to audit account activity, then observe the security incident.

### Task 2.1: Create a CloudTrail Trail

#### Step-by-Step Configuration

1. From the **Services** menu, select **Management & Governance** → **CloudTrail**
   > Note: Ignore any AWS Organizations access denied messages.

2. On the navigation pane (click the ☰ icon if hidden), choose **Trails**
   > Note: Ignore any warnings about organization trails not being available.

3. Choose **Create trail**

4. Configure the trail:

| Setting | Value |
|---------|-------|
| **Trail name** | `monitor` |
| **S3 bucket** | Create a new S3 bucket |
| **Trail log bucket and folder** | `monitoring####` (replace `####` with four random digits) |
| **AWS KMS alias** | `<your-initials>-KMS` (e.g., `kc-KMS`) |

> ⚠️ **IMPORTANT:** Verify the Trail name is exactly `monitor`, or the activity will not work as intended.

5. Choose **Next**
6. On the **Choose log events** page, choose **Next**
7. On the **Review and create** page, choose **Create trail**
8. Verify the trail appears on the **Trails** page

### Task 2.2: Observe the Hacked Website

1. Return to the browser tab with the Café website
2. Refresh the page (you may need to wait ~1 minute)
3. **Force refresh** to bypass cache: Press and hold **Shift** + click the browser refresh button

#### Expected Result
- The website has been hacked
- Suspicious images have replaced the original café photos
- This indicates unauthorized access has occurred

#### Initial Investigation

1. Browse to the **EC2** service and observe the **Café Web Server** instance details
2. In the **Security** tab, choose the `sg-xxxxxxxxxx` security group
3. Click the **Inbound rules** tab

#### Suspicious Finding
You will observe:
- Your original rule: SSH access from your IP (`/32`)
- **A NEW unauthorized rule:** SSH access from `0.0.0.0/0` (anywhere)

> 🔍 **Question:** Who added this security hole? CloudTrail logs will help you find out.

---

## Task 3: Analyzing the CloudTrail Logs by Using grep

### Objective
Use command-line tools to download and analyze CloudTrail logs stored in S3.

### Task 3.1: Connect to the EC2 Instance via SSH

#### For macOS/Linux Users

1. Download the key pair (`labsuser.pem`) from the lab credentials
2. Open a terminal and navigate to the download directory:
   ```bash
   cd ~/Downloads
   ```
3. Set proper permissions on the key:
   ```bash
   chmod 400 labsuser.pem
   ```
4. Copy the **Public IPv4 address** from the EC2 console
5. Connect via SSH:
   ```bash
   ssh -i labsuser.pem ec2-user@<public-ip>
   ```
6. When prompted, type `yes` to allow the first connection

#### For Windows Users

1. Download the key pair (`labsuser.ppk`) from the lab credentials
2. Download and install [PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html)
3. Configure PuTTY session with:
   - Host Name: `ec2-user@<public-ip>`
   - Connection → SSH → Auth → Private key: Browse to `labsuser.ppk`
4. Click **Open**

### Task 3.3: Download and Extract CloudTrail Logs

Once connected via SSH, execute the following commands:

```bash
# Step 1: Create a directory for CloudTrail logs
mkdir ctraillogs

# Step 2: Change to the new directory
cd ctraillogs

# Step 3: List S3 buckets to identify the monitoring bucket
aws s3 ls

# Step 4: Download CloudTrail logs (replace <monitoring####> with actual bucket name)
aws s3 cp s3://<monitoring####>/ . --recursive
```

> ⏱️ **Note:** If no files download, wait 5 minutes and retry. CloudTrail posts logs to S3 every 5 minutes.

```bash
# Step 5: Navigate to the log subdirectory
# Use cd and Tab completion to find the path:
# AWSLogs/<account-num>/CloudTrail/<Region>/<yyyy>/<mm>/<dd>/

# Step 6: List downloaded files (should end in .json.gz)
ls -l

# Step 7: Extract the compressed logs
gunzip *.gz

# Step 8: Verify extraction
ls -l
```

### Task 3.4: Analyze Logs Using grep

#### Understanding Log Structure

CloudTrail logs are in **JSON format**. Each log entry contains standard fields:

| Field | Description |
|-------|-------------|
| `awsRegion` | AWS Region where the event occurred |
| `eventName` | The API action performed |
| `eventSource` | The AWS service endpoint |
| `eventTime` | Timestamp of the event (ISO 8601) |
| `requestParameters` | Parameters passed with the API call |
| `sourceIPAddress` | IP address that initiated the request |
| `userIdentity` | Details about who performed the action |

#### grep Commands for Analysis

```bash
# Set the Web Server IP as a variable
ip=<WebServerIP>

# View source IP addresses across all log files
for i in $(ls); do echo "=== $i ===" && cat $i | python -m json.tool | grep sourceIPAddress; done

# View event names across all log files
for i in $(ls); do echo "=== $i ===" && cat $i | python -m json.tool | grep eventName; done

# View a formatted single log file
cat <filename.json> | python -m json.tool
```

> 💡 **Tip:** Look for `update` actions and events where `sourceIPAddress` matches the Café Web Server's IP.

### Task 3.5: Analyze Logs Using AWS CLI CloudTrail Commands

```bash
# Lookup console login events
aws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=ConsoleLogin

# Find actions on security groups
aws cloudtrail lookup-events --lookup-attributes AttributeKey=ResourceType,AttributeValue=AWS::EC2::SecurityGroup --output text

# Get the region and security group ID of the Café Web Server
region=$(curl http://169.254.169.254/latest/dynamic/instance-identity/document | grep region | cut -d '"' -f4)
sgId=$(aws ec2 describe-instances --filters "Name=tag:Name,Values='Cafe Web Server'" --query 'Reservations[*].Instances[*].SecurityGroups[*].[GroupId]' --region $region --output text)
echo $sgId

# Filter CloudTrail events for the specific security group
aws cloudtrail lookup-events --lookup-attributes AttributeKey=ResourceType,AttributeValue=AWS::EC2::SecurityGroup --region $region --output text | grep $sgId
```

---

## Task 4: Analyzing the CloudTrail Logs by Using Athena

### Objective
Use Amazon Athena to run SQL queries over CloudTrail log data stored in S3.

### Why Athena?

| Challenge with grep/CLI | Athena Solution |
|---------------------------|-----------------|
| Verbose JSON files are hard to read | Structured SQL queries |
| Multiple files to search across | Single database table view |
| Complex filtering requires multiple commands | Simple WHERE clauses |
| No aggregation capabilities | SQL aggregation functions |

### Task 4.1: Create the Athena Table

1. Navigate to **CloudTrail** console
2. In the navigation pane, choose **Event history**
3. Click **Create Athena table**
4. For **Storage location**, choose your `monitoring####` S3 bucket
5. Review the **CREATE TABLE** SQL statement:
   - Notice how each JSON field maps to a database column
   - Observe the `LOCATION` clause pointing to your S3 bucket
6. Choose **Create table**

### Task 4.2: Analyze Logs Using Athena

1. Navigate to **Services** → **Analytics** → **Athena**
2. If the Query Editor is not visible, choose **Explore query editor**
3. Close any tutorial screens
4. In the left panel, expand the `cloudtrail_logs_monitoring####` table to see columns

#### Configure Query Results Location

1. Choose **Settings** → **Manage**
2. Set **Location of query result** to:
   ```
   s3://monitoring####/results/
   ```
3. Choose **Save**

#### Sample Queries

**Query 1: Preview Data**
```sql
SELECT *
FROM cloudtrail_logs_monitoring####
LIMIT 5;
```

**Query 2: Select Key Columns**
```sql
SELECT useridentity.userName, eventtime, eventsource, eventname, requestparameters
FROM cloudtrail_logs_monitoring####
LIMIT 30;
```

**Query 3: Filter by EC2 Events**
```sql
SELECT useridentity.userName, eventtime, eventsource, eventname, requestparameters
FROM cloudtrail_logs_monitoring####
WHERE eventsource = 'ec2.amazonaws.com'
LIMIT 50;
```

**Query 4: Search for Security Group Modifications**
```sql
SELECT useridentity.userName, eventtime, eventsource, eventname, requestparameters
FROM cloudtrail_logs_monitoring####
WHERE eventsource = 'ec2.amazonaws.com'
  AND eventname LIKE '%Security%'
ORDER BY eventtime DESC;
```

**Query 5: Find Specific Security Group Changes**
```sql
SELECT useridentity.userName, eventtime, eventname, sourceipaddress, requestparameters
FROM cloudtrail_logs_monitoring####
WHERE eventsource = 'ec2.amazonaws.com'
  AND eventname = 'AuthorizeSecurityGroupIngress'
ORDER BY eventtime DESC;
```

**Query 6: Active Users in the Past Day**
```sql
SELECT DISTINCT useridentity.userName, eventName, eventSource
FROM cloudtrail_logs_monitoring####
WHERE from_iso8601_timestamp(eventtime) > date_add('day', -1, now())
ORDER BY eventSource;
```

---

## Challenge: Identify the Hacker

### Your Mission
Discover the log entry containing the essential information about who hacked the website.

### Tips for Investigation

| Tip | Guidance |
|-----|----------|
| **Tip 1** | Examine the data returned by previous queries. Even if not the exact entry, it shows what data each column contains. Don't be afraid to experiment with modified SQL queries. Use the **+** icon next to "New query" to create additional query tabs. |
| **Tip 2** | Filter by events related to Amazon EC2 service. Use `WHERE eventsource = 'ec2.amazonaws.com'` |
| **Tip 3** | Remove the `LIMIT` clause to query the entire log set |
| **Tip 4** | Look at the `eventname` column data. Refine queries with `LIKE '%Security%'` |
| **Tip 5** | Analyze security-related `eventname` values. Look for suspicious patterns |
| **Tip 6** | Try the general query for active users to identify all recent account activity |

### Success Criteria

You have successfully completed the challenge if you can identify:

| Information | What to Find |
|-------------|--------------|
| **Hacker's Identity** | The name of the AWS user who created the security hole |
| **Time of Attack** | The exact timestamp when they hacked the security group |
| **Source IP** | The IP address from which they launched the attack |
| **Access Method** | Whether they used console or programmatic access |

> 💾 **Action Item:** Copy the hacker's IP address to a text file for later reference.

---

## Task 5: Analyzing the Hack Further and Improving Security

### Objective
Remove the hacker's access and implement security improvements to prevent future incidents.

### Task 5.1: Check OS Users

In your SSH terminal, execute:

```bash
# Check recent authentication activity
sudo aureport --auth
```

**Finding:** Evidence of a user other than `ec2-user` — the `chaos-user`.

```bash
# Check who is currently logged in
who
```

**Finding:** The `chaos-user` is still logged in! Remove them immediately.

```bash
# Attempt to delete the chaos-user (will fail if still logged in)
sudo userdel -r chaos-user

# Note the process number returned, then kill the session
sudo kill -9 <ProcNum>

# Verify the user is disconnected
who

# Now delete the chaos-user successfully
sudo userdel -r chaos-user

# Verify no other suspicious login users exist
sudo cat /etc/passwd | grep -v nologin
```

> ✅ **Expected Result:** Only standard OS users remain (root, sync, shutdown, halt, ec2-user).

### Task 5.2: Update SSH Security

The hacker connected via SSH. Investigate how:

```bash
# Check SSH configuration file modification time
sudo ls -l /etc/ssh/sshd_config
```

**Finding:** The file was modified today — suspicious!

```bash
# Edit the SSH configuration
sudo vi /etc/ssh/sshd_config
```

#### Required Changes in `sshd_config`

| Line | Action | Reason |
|------|--------|--------|
| `PasswordAuthentication yes` | **Comment out** (add `#`) | Prevents password-based SSH access |
| `#PasswordAuthentication no` | **Uncomment** (remove `#`) | Enforces key-based authentication only |

**VI Editor Commands:**
1. Type `:set number` to show line numbers
2. Navigate to line 61
3. Press `a` to enter edit mode
4. Add `#` at the start of `PasswordAuthentication yes`
5. Navigate to line 63
6. Remove `#` from `#PasswordAuthentication no`
7. Press `Esc` to exit edit mode
8. Type `:wq` to save and quit

```bash
# Restart SSH service to apply changes
sudo service sshd restart
```

> ⚠️ **Note:** If your SSH connection drops, reconnect using your key pair.

#### Remove the Hacker's Security Group Rule

1. Return to **EC2 Console** → **Security Groups**
2. Select the **Web Server security group**
3. Go to the **Inbound rules** tab → **Edit inbound rules**
4. **Delete** the rule allowing port 22 from `0.0.0.0/0`
5. **Save** the changes

### Task 5.3: Fix the Website

```bash
# Navigate to the website images directory
cd /var/www/html/cafe/images/

# List files (hacker created a backup of the original)
ls -l

# Restore the original image
sudo mv Coffee-and-Pastries.backup Coffee-and-Pastries.jpg
```

**Verify the fix:**
1. Reload `http://<WebServerIP>/cafe` in your browser
2. Use **Shift + Refresh** to bypass cache
3. The original café images should display correctly

### Task 5.4: Delete the AWS Hacker User

The hacker used AWS CLI to open port 22 in the security group. Remove their IAM access:

1. Navigate to **Services** → **IAM**
2. Choose **Users**
3. Select the checkbox next to **`chaos`** user
4. Choose **Delete**
5. Enter the username `chaos` to confirm
6. Select **Delete**

> ✅ The `chaos` user can no longer cause trouble in the AWS account.

---

## Conclusion

### Incident Summary

| Aspect | Detail |
|--------|--------|
| **Initial State** | Café website running normally on EC2 |
| **Vulnerability** | SSH password authentication enabled; overly permissive security group rules |
| **Attack Vector** | Hacker (`chaos` user) gained AWS and OS access, modified security groups and website |
| **Detection** | CloudTrail logs captured all API activity |
| **Investigation** | Used grep, AWS CLI, and Athena to analyze logs |
| **Resolution** | Removed hacker's access, restored website, secured SSH configuration |

### Security Best Practices Applied

1. ✅ **CloudTrail enabled** for continuous auditing
2. ✅ **Least privilege access** — removed overly permissive SSH rules
3. ✅ **Key-based authentication** — disabled password-based SSH
4. ✅ **User access review** — removed unauthorized IAM and OS users
5. ✅ **Log analysis** — used multiple tools to investigate the incident

### Key Takeaways

- **CloudTrail is essential** for auditing AWS account activity
- **Defense in depth** matters — secure both AWS IAM and OS-level access
- **Monitor security groups** regularly for unauthorized changes
- **Athena enables powerful SQL-based log analysis** at scale
- **Act quickly** when suspicious activity is detected

> 🎉 **Congratulations!** You have successfully uncovered the identity of the hacker, removed their access, and secured the Café website. Martha and Frank can rest easy knowing their website is protected, and the team now understands the importance of continuous security monitoring with CloudTrail.

---

## Appendix: Quick Reference

### Common CloudTrail Event Names

| Event Name | Description |
|------------|-------------|
| `AuthorizeSecurityGroupIngress` | Added inbound rule to security group |
| `RevokeSecurityGroupIngress` | Removed inbound rule from security group |
| `CreateAccessKey` | Created new IAM access key |
| `ConsoleLogin` | User logged into AWS Management Console |
| `RunInstances` | Launched new EC2 instance |
| `PutBucketPolicy` | Modified S3 bucket policy |

### Useful Athena Query Patterns

```sql
-- Find all actions by a specific user
SELECT eventtime, eventsource, eventname, requestparameters
FROM cloudtrail_logs_monitoring####
WHERE useridentity.userName = 'chaos'
ORDER BY eventtime DESC;

-- Find security group changes in the last hour
SELECT useridentity.userName, eventtime, eventname, requestparameters
FROM cloudtrail_logs_monitoring####
WHERE eventsource = 'ec2.amazonaws.com'
  AND eventname LIKE '%SecurityGroup%'
  AND from_iso8601_timestamp(eventtime) > date_add('hour', -1, now())
ORDER BY eventtime DESC;

-- Find console vs programmatic access
SELECT useridentity.userName, 
       useridentity.type,
       eventtime, 
       eventname
FROM cloudtrail_logs_monitoring####
WHERE useridentity.userName = 'chaos';
```

### SSH Security Checklist

- [ ] Password authentication disabled (`PasswordAuthentication no`)
- [ ] Only key-based authentication enabled
- [ ] Security group restricts SSH to specific IPs (`/32`)
- [ ] No `0.0.0.0/0` rules for SSH
- [ ] Regular audit of OS users (`cat /etc/passwd`)
- [ ] CloudTrail logging enabled
- [ ] Regular review of IAM users and permissions

---

*Document Version: 1.0*  
*Last Updated: 2026-07-08*  
*Activity: AWS CloudTrail Security Investigation Lab*
