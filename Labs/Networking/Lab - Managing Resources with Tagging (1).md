# Lab: Managing Resources with Tagging

## Overview

This lab is divided into two main portions:

**Task Portion:** You will use the AWS Command Line Interface (CLI) to inspect the tags assigned to Amazon EC2 instances. You will then use pre-provided scripts to shut down and start up Amazon EC2 instances simultaneously based on their tags.

**Challenge Portion:** You will be challenged to develop a solution to terminate instances that fail to implement specific tags required for security compliance.


## Objectives

After completing this lab, you will be able to:

- Apply tags to existing AWS resources
- Find resources based on tag filters
- Use the AWS CLI to query and manipulate tags using JMESPath syntax
- Use the AWS CLI or AWS SDK for PHP to stop and terminate Amazon EC2 instances based on resource attributes
- Implement automated resource management workflows based on tagging policies

---

## Duration

**Estimated Time:** Approximately 45 minutes to complete


![imagine](https://github.com/MrPhadagi-bit/ppppp1/blob/main/lab-7-less-instances.png?raw=true)


## Scenario

The lab environment consists of the following components:

### Infrastructure

- **Amazon VPC:** Lab VPC
  - **Public Subnet:** Contains the CommandHost EC2 instance
  - **Private Subnet:** Contains 8 Amazon EC2 Linux instances
- **CommandHost:** AWS Command Line Interface (CLI) tools have been pre-installed and configured

### EC2 Instances

Eight Amazon EC2 Linux instances are deployed in the private subnet. Each instance has three custom tags applied:

| Tag Name | Description | Values |
|----------|-------------|--------|
| **Project** | Identifies the project the instance belongs to | ERPSystem, Experiment1 |
| **Version** | Version of the project | Currently set to 1.0 (modified in Task 1) |
| **Environment** | Deployment environment designation | development, staging, production |

### Tagging Policy

- Development instances are used for testing and feature development
- Production instances run customer-facing workloads
- Staging instances validate changes before production deployment
- All instances are tagged to support automated management and cost allocation

---

## Part 1: Task Exercises

### Task 1: Using Tags to Manage Resources

In this task, you will use the AWS CLI to find EC2 instances according to their tags and modify tag values using CLI commands.

#### Step 1: Connect to the Command Host

##### For Windows Users: Using SSH with PuTTY

1. Click **Details** above these instructions and select **Show**
2. A Credentials window will appear
3. Click **Download PPK** and save the `labsuser.ppk` file (typically downloads to Downloads folder)
4. Note the **PublicIP** address
5. Exit the Details panel by clicking **X**

6. If PuTTY is not installed, [download PuTTY](https://www.putty.org/)
7. Open `putty.exe`
8. Configure your PuTTY session following the [AWS PuTTY connection guide](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/putty.html)

##### For Mac and Linux Users: Using SSH

1. In the AWS Management Console, navigate to **Services > EC2 > Instances**
2. Select the **CommandHost** instance
3. Copy the **IPv4 Public IP** from the Description pane
4. Click **Details** dropdown and select **Show** for the Credentials window
5. Click **Download PEM** and save the `labsuser.pem` file
6. Exit the Details panel by clicking **X**

7. Open a terminal and navigate to the download directory:
   ```bash
   cd ~/Downloads
   ```

8. Change permissions on the key file:
   ```bash
   chmod 400 labsuser.pem
   ```

9. Connect to the CommandHost (replace `<public-ip>` with your Public IPv4 address):
   ```bash
   ssh -i labsuser.pem ec2-user@<public-ip>
   ```

10. Type `yes` when prompted to allow the first connection

> **Note:** You will not be prompted for a password when using key pair authentication.

#### Step 2: Find Development Instances for the ERPSystem Project

Now that you're logged in to the CommandHost, you can use AWS CLI commands to find resources in your private subnet that belong to the ERPSystem project and are tagged as development.

##### Command 1: List All ERPSystem Instances

Run the following command to find all instances tagged with `Project=ERPSystem`:

```bash
aws ec2 describe-instances --filter "Name=tag:Project,Values=ERPSystem"
```

**Expected Output:** Full set of parameters for all instances tagged `Project=ERPSystem`. This returns extensive output including all properties.

##### Command 2: Filter to Instance IDs Only

To reduce output verbosity, use the `--query` parameter to return only Instance IDs:

```bash
aws ec2 describe-instances --filter "Name=tag:Project,Values=ERPSystem" --query 'Reservations[*].Instances[*].InstanceId'
```

**Expected Output:**
```json
[
  ["i-135b491e"],
  ["i-3e584a33"],
  [...]
]
```

**Query Explanation:** The `--query` parameter uses JMESPath wildcard syntax (`[*]`) to iterate through all reservations and instances, returning only the `InstanceId` for each.

##### Command 3: Return Multiple Fields

To include multiple fields in the output (Instance ID and Availability Zone), run:

```bash
aws ec2 describe-instances --filter "Name=tag:Project,Values=ERPSystem" --query 'Reservations[*].Instances[*].{ID:InstanceId,AZ:Placement.AvailabilityZone}'
```

**Expected Output:**
```json
[
  [
    {
      "ID": "i-135b491e",
      "AZ": "us-west-2a"
    }
  ],
  ...
]
```

**Query Explanation:** The curly braces `{}` syntax allows specifying multiple properties with custom aliases:
```
{Alias1:PropertyName1, Alias2:PropertyName2, [...]}
```

##### Command 4: Include Custom Tags in Output

To include the value of the **Project** tag in your results, run:

```bash
aws ec2 describe-instances --filter "Name=tag:Project,Values=ERPSystem" --query 'Reservations[*].Instances[*].{ID:InstanceId,AZ:Placement.AvailabilityZone,Project:Tags[?Key==`Project`] | [0].Value}'
```

**Expected Output:**
```json
[
  [
    {
      "ID": "i-3250b838",
      "AZ": "us-west-2a",
      "Project": "ERPSystem"
    }
  ],
  ...
]
```

**Tag Query Explanation:**
```
Tags[?Key==`Project`] | [0].Value
```
- `Tags[?Key==`Project`]` - Find all tag elements where Key equals "Project"
- `| [0].Value` - Select the first matching tag and extract its Value property
- This syntax retrieves the value of a specific named tag

##### Command 5: Include Multiple Custom Tags

To include the Environment and Version tags alongside the Project tag, run:

```bash
aws ec2 describe-instances --filter "Name=tag:Project,Values=ERPSystem" --query 'Reservations[*].Instances[*].{ID:InstanceId,AZ:Placement.AvailabilityZone,Project:Tags[?Key==`Project`] | [0].Value,Environment:Tags[?Key==`Environment`] | [0].Value,Version:Tags[?Key==`Version`] | [0].Value}'
```

**Expected Output:**
```json
[
  [
    {
      "ID": "i-3250b838",
      "AZ": "us-west-2a",
      "Project": "ERPSystem",
      "Environment": "production",
      "Version": "1.0"
    }
  ],
  ...
]
```

##### Command 6: Add Secondary Filter for Environment Tag

To see only ERPSystem instances in the **development** environment, add a second tag filter:

```bash
aws ec2 describe-instances --filter "Name=tag:Project,Values=ERPSystem" "Name=tag:Environment,Values=development" --query 'Reservations[*].Instances[*].{ID:InstanceId,AZ:Placement.AvailabilityZone,Project:Tags[?Key==`Project`] | [0].Value,Environment:Tags[?Key==`Environment`] | [0].Value,Version:Tags[?Key==`Version`] | [0].Value}'
```

**Expected Output:**
```json
[
  [
    {
      "ID": "i-9552ba9f",
      "AZ": "us-west-2a",
      "Project": "ERPSystem",
      "Environment": "development",
      "Version": "1.0"
    }
  ],
  ...
]
```

> **Note:** You should see only two instances returned, both with `Project=ERPSystem` and `Environment=development`.

#### Step 3: Change Version Tag for Development Instances

Instead of manually updating each instance, you will use an automated Bash script to update tags in batch.

##### Examine the Change Script

On the CommandHost, open the tag change script:

```bash
nano change-resource-tags.sh
```

The script contains:

```bash
#!/bin/bash

ids=$(aws ec2 describe-instances --filter "Name=tag:Project,Values=ERPSystem" "Name=tag:Environment,Values=development" --query 'Reservations[*].Instances[*].InstanceId' --output text)

aws ec2 create-tags --resources $ids --tags 'Key=Version,Value=1.1'
```

**Script Explanation:**

1. **Line 3:** Uses `describe-instances` to find all development instances for ERPSystem
   - Uses `--output text` to format results as plain text (instead of JSON) for easier variable assignment
   - Stores the instance IDs in the `$ids` variable

2. **Line 5:** Uses `aws ec2 create-tags` to apply tags to the identified instances
   - The `create-tags` command can both create new tags and overwrite existing ones
   - In this case, it overwrites the existing `Version` tag from `1.0` to `1.1`

> **Key Advantage:** Using `--output text` with a simple list (like instance IDs) makes the output easier to manipulate and pass to other commands compared to JSON format.

##### Run the Script

Exit the nano editor and run the script:

```bash
./change-resource-tags.sh
```

##### Verify Tag Changes

To verify that the Version tag was updated on development instances and unchanged on other instances, run:

```bash
aws ec2 describe-instances --filter "Name=tag:Project,Values=ERPSystem" --query 'Reservations[*].Instances[*].{ID:InstanceId,AZ:Placement.AvailabilityZone,Project:Tags[?Key==`Project`] | [0].Value,Environment:Tags[?Key==`Environment`] | [0].Value,Version:Tags[?Key==`Version`] | [0].Value}'
```

**Expected Verification Results:**
- Development instances: `Version=1.1`
- Staging/Production instances: `Version=1.0`
- All instances maintain their original Project and Environment tags

---

### Task 2: Stop and Start Resources by Tag

In this task, you will use a pre-provided PHP script to stop and restart EC2 instances based on their tags. This demonstrates automated resource management across multiple regions.

#### Step 1: Examine the Stopinator Script

Navigate to the aws-tools directory:

```bash
cd ~/aws-tools
```

Open the stopinator.php script:

```bash
nano stopinator.php
```

**Script Overview:**

The `stopinator.php` script uses the AWS SDK for PHP to stop and restart instances based on tags. It searches across all AWS regions for matching instances.

**Script Parameters:**

| Parameter | Format | Description |
|-----------|--------|-------------|
| `-t` | `name=value;name=value` | **Optional.** Specifies tags to match. Multiple tags are separated by semicolons. If omitted, the script targets all running instances in the account. |
| `-s` | Boolean flag (no arguments) | **Optional.** When present, matched instances are **started** instead of stopped. |

**Usage Examples:**
```bash
# Stop instances with specific tags
./stopinator.php -t"Project=ERPSystem;Environment=development"

# Start instances with specific tags
./stopinator.php -t"Project=ERPSystem;Environment=development" -s

# Stop all running instances in account (use with caution!)
./stopinator.php
```

Exit the nano editor.

#### Step 2: Stop Development Instances

Run the stopinator script to stop development instances for ERPSystem:

```bash
./stopinator.php -t"Project=ERPSystem;Environment=development"
```

**Expected Output:**
```
Region is us-east-1
  No instances to stop in region
Region is us-west-1
  No instances to stop in region
Region is us-west-2
  Identified instance i-9552ba9f
  Identified instance i-d35fb7d9
Stopping all identified instances...
[...]
  No instances to stop in region
Region is sa-east-1
  No instances to stop in region
```

> **Note:** Output varies by region. The script identifies two instances in the region where this lab is running and stops them.

#### Step 3: Verify Instance Stop

1. In the AWS Management Console, navigate to **Services > EC2 > Instances**
2. Verify that two instances are in **Stopping** or **Stopped** state

#### Step 4: Restart Development Instances

Return to your SSH session and restart the instances:

```bash
./stopinator.php -t"Project=ERPSystem;Environment=development" -s
```

The `-s` flag signals that instances should be **started** instead of stopped.

#### Step 5: Verify Instance Start

Return to the EC2 Management Console and verify that the two stopped instances are now in **Starting** or **Running** state.

---

## Part 2: Challenge Exercise

### Task 3: Challenge - Terminate Non-Compliant Instances

**Challenge Difficulty:** Advanced

#### Challenge Description

**Scenario:** Your company requires that all EC2 instances implement security compliance tags. You have been tasked with creating an automated process to terminate instances that do not conform to security policies.

**Security Policy:** All instances in your private subnet must have an **Environment** tag defined (with any value).

**Challenge Objective:** Find and terminate all instances in your private subnet that **do not implement the Environment tag** (i.e., a "tag-or-terminate" policy).

#### Challenge Hints

1. If you are not comfortable with PHP or similar languages with AWS SDK support (Python, Ruby, etc.), consider using a series of AWS CLI commands
2. The AWS PHP call `Ec2::terminateInstances()` terminates instances
3. The equivalent AWS CLI command is `aws ec2 terminate-instances`
4. Reference the `stopinator.php` script from Task 2 for code structure and patterns

#### Challenge Solution Overview

The general solution approach consists of three steps:

1. **Identify Tagged Instances:** Obtain a list of all instances that have the Environment tag defined
2. **Compare Lists:** Compare against all available instances in the subnet and identify which instances are missing the Environment tag
3. **Terminate Non-Compliant Instances:** Supply the non-tagged instance IDs to the termination command

**Implementation Language:** The provided solution uses PHP with the AWS SDK.

---

### Task 3.1: Review the Tag-Or-Terminate Script

#### Open the Termination Script

```bash
nano terminate-instances.php
```

#### Script Parameters

The script accepts two required parameters:

| Parameter | Description |
|-----------|-------------|
| `-region` | The AWS region you are running in (without the availability zone letter) |
| `-subnetid` | The ID of the subnet containing instances to check for compliance |

#### Code Block 1: Obtain Tagged Instances

The first block identifies all instances that have the Environment tag defined:

```php
# Obtain a list of all instances with the Environment tag set.
```

This code block:
- Uses the `describeInstances()` method with a filter for the Environment tag
- Stores all instance IDs with the tag in a hash table
- Builds a reference list of compliant instances

#### Code Block 2: Compare and Identify Non-Compliant Instances

The second code block:
- Examines all instances within your target subnet
- Compares each instance against the hash table of tagged instances
- Adds instance IDs of non-tagged instances to a "terminate list"

#### Code Block 3: Terminate Non-Compliant Instances

The final section:
- Uses the `terminateInstances()` method
- Passes the list of non-compliant instance IDs as arguments
- Executes the termination process

---

### Task 3.2: Configure Environment for Testing

Before running the termination script, you must configure your lab by removing Environment tags from test instances.

#### Remove Environment Tags

1. Navigate to the **AWS Management Console > EC2 > Instances**

2. Select one instance in your private subnet

3. Click the **Tags** tab

4. Click **Add/Edit Tags**

5. Find the **Environment** tag and click the **remove icon** (X)

6. Click **Save**

7. **Repeat this process for one additional instance** in your private subnet
   - You should now have **two instances without Environment tags**

> **Warning:** Only remove tags from test instances. These instances will be terminated by the script!

---

### Task 3.3: Prepare Script Parameters

Before running the termination script, you need to gather the region and subnet information.

#### Obtain Region Information

1. In the EC2 Management Console, select one of the private subnet instances

2. On the **Description** tab, find the **Availability Zone** field

3. Copy the Availability Zone value **excluding the last letter** to a text file
   - Example: If AZ is `us-west-2a`, copy `us-west-2`
   - This value is your `<region>`

#### Obtain Subnet ID

1. Still in the Description tab, find the **Subnet ID** field

2. Copy this value to a text file
   - This value is your `<subnet-id>`

---

### Task 3.4: Run the Termination Script

Return to your SSH session and run the script, replacing placeholders with your values:

```bash
./terminate-instances.php -region <region> -subnetid <subnet-id>
```

**Example execution:**
```bash
./terminate-instances.php -region us-west-2 -subnetid subnet-12345678
```

#### Expected Output

```
Checking i-dd3a90d1
Checking i-a4248ea8
Checking i-793a9075
Checking i-a9248ea5
Checking i-aa248ea6
Checking i-da3a90d6
Checking i-a13b91ad
Checking i-a23b91ae
Checking i-ab248ea7
Terminating instances...
Instances terminated.
```

The script will:
1. Check each instance in the subnet for the Environment tag
2. Identify instances without the tag
3. Terminate all non-compliant instances

#### Verify Termination

Return to the EC2 Management Console and verify that the two instances you removed tags from are now in **Shutting-down** or **Terminated** state.

---

## Lab Completion

Congratulations! You have successfully completed the lab. You have:

✅ Connected to the CommandHost and authenticated with AWS  
✅ Used AWS CLI commands with JMESPath queries to find resources by tags  
✅ Modified tags on EC2 instances using automated scripts  
✅ Stopped and started resources based on tag criteria  
✅ Implemented and executed a security compliance automation workflow  

### Key Takeaways

1. **Tags are powerful organizational tools** - They enable resource discovery, cost allocation, and automated lifecycle management

2. **JMESPath queries provide flexibility** - The `--query` parameter allows you to format AWS CLI output precisely for your needs

3. **Automation scales management** - Scripts enable consistent, repeatable resource management across multiple instances

4. **Multi-region support** - Many management tools (like stopinator) automatically scan all regions for tagged resources

5. **Security compliance can be automated** - Tag-based policies enable enforcing security standards across your infrastructure

---

## Additional Resources

- [AWS CLI Documentation](https://docs.aws.amazon.com/cli/latest/userguide/)
- [JMESPath Tutorial](https://jmespath.org/tutorial.html)
- [AWS EC2 Tagging Best Practices](https://docs.aws.amazon.com/general/latest/gr/aws_tagging.html)
- [AWS SDK for PHP](https://docs.aws.amazon.com/sdk-for-php/latest/developer-guide/)
- [AWS Systems Manager Tags](https://docs.aws.amazon.com/systems-manager/latest/userguide/tagging-resources.html)

---

**Lab Environment Note:** This lab uses a controlled AWS environment that may differ from production systems. Always test automation scripts in development environments before deploying to production.
