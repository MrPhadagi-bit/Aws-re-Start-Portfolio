# 178-[JAWS]-Activity - Working with AWS Lambda

> **Lab Duration:** ~90 minutes  
> **Services:** AWS Lambda, IAM, SNS, CloudWatch Events, Systems Manager Parameter Store, EC2, VPC  
> **Runtime:** Python 3.9  

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Objectives](#objectives)
- [Prerequisites](#prerequisites)
- [Task 1: Observing IAM Role Settings](#task-1-observing-iam-role-settings)
  - [Task 1.1: salesAnalysisReportRole](#task-11-salesanalysisreportrole)
  - [Task 1.2: salesAnalysisReportDERole](#task-12-salesanalysisreportderole)
- [Task 2: Creating a Lambda Layer and Data Extractor Function](#task-2-creating-a-lambda-layer-and-data-extractor-function)
  - [Task 2.1: Creating a Lambda Layer](#task-21-creating-a-lambda-layer)
  - [Task 2.2: Creating the Data Extractor Function](#task-22-creating-the-data-extractor-function)
  - [Task 2.3: Adding the Layer to the Function](#task-23-adding-the-layer-to-the-function)
  - [Task 2.4: Importing the Function Code](#task-24-importing-the-function-code)
  - [Task 2.5: Configuring Network Settings](#task-25-configuring-network-settings)
- [Task 3: Testing the Data Extractor Function](#task-3-testing-the-data-extractor-function)
  - [Task 3.1: Launching a Test](#task-31-launching-a-test)
  - [Task 3.2: Troubleshooting Timeout Errors](#task-32-troubleshooting-timeout-errors)
  - [Task 3.3: Analyzing and Correcting the Function](#task-33-analyzing-and-correcting-the-function)
  - [Task 3.4: Placing Orders and Retesting](#task-34-placing-orders-and-retesting)
- [Task 4: Configuring Notifications](#task-4-configuring-notifications)
  - [Task 4.1: Creating an SNS Topic](#task-41-creating-an-sns-topic)
  - [Task 4.2: Subscribing to the Topic](#task-42-subscribing-to-the-topic)
- [Task 5: Creating the Sales Analysis Report Function](#task-5-creating-the-sales-analysis-report-function)
  - [Task 5.1: Connecting to the CLI Host](#task-51-connecting-to-the-cli-host)
  - [Task 5.2: Configuring the AWS CLI](#task-52-configuring-the-aws-cli)
  - [Task 5.3: Creating the Function via AWS CLI](#task-53-creating-the-function-via-aws-cli)
  - [Task 5.4: Configuring Environment Variables](#task-54-configuring-environment-variables)
  - [Task 5.5: Testing the Function](#task-55-testing-the-function)
  - [Task 5.6: Adding a CloudWatch Events Trigger](#task-56-adding-a-cloudwatch-events-trigger)
- [Troubleshooting Guide](#troubleshooting-guide)
- [Cleanup](#cleanup)
- [Key Takeaways](#key-takeaways)

---

## Overview

This lab deploys a serverless sales analysis reporting solution using AWS Lambda. The system generates a daily sales report by extracting data from a MySQL database running on an EC2 LAMP instance, then emails the results to an administrator via Amazon SNS.

**Key Components:**
- **salesAnalysisReport** - Main orchestrator Lambda function triggered by CloudWatch Events
- **salesAnalysisReportDataExtractor** - Lambda function that queries the café database
- **Lambda Layer (pymysqlLibrary)** - Shared PyMySQL dependency layer
- **SNS Topic** - Email notification delivery mechanism
- **Parameter Store** - Secure storage for database credentials
- **VPC Configuration** - Network access for database connectivity

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           AWS Cloud                                      │
│  ┌─────────────────┐    ┌──────────────────────┐    ┌─────────────────┐ │
│  │ CloudWatch      │    │ salesAnalysisReport  │    │ salesAnalysis   │ │
│  │ Events          │───▶│ Lambda Function      │───▶│ ReportData      │ │
│  │ (Daily 8PM      │    │ - Retrieves DB creds │    │ Extractor       │ │
│  │  MON-SAT)       │    │ - Invokes extractor  │    │ Lambda Function │ │
│  └─────────────────┘    │ - Formats report     │    └────────┬────────┘ │
│                         │ - Publishes to SNS   │             │          │
│                         └──────────────────────┘             │          │
│                                      │                       │          │
│                                      ▼                       ▼          │
│                         ┌──────────────────────┐    ┌─────────────────┐ │
│                         │ Amazon SNS           │    │ Café Database   │ │
│                         │ salesAnalysisReport  │    │ (MySQL on EC2   │ │
│                         │ Topic                │    │  LAMP instance) │ │
│                         └──────────┬───────────┘    └─────────────────┘ │
│                                    │                                    │
│                                    ▼                                    │
│                         ┌──────────────────────┐                        │
│                         │ Administrator Email  │                        │
│                         │ Daily Sales Report   │                        │
│                         └──────────────────────┘                        │
└─────────────────────────────────────────────────────────────────────────┘
```

### Data Flow

| Step | Action | Service |
|------|--------|---------|
| 1 | CloudWatch Events triggers the function at 8 PM (MON-SAT) | CloudWatch Events |
| 2 | `salesAnalysisReport` invokes `salesAnalysisReportDataExtractor` | Lambda |
| 3 | Extractor runs analytical query against `cafe_db` | Lambda → MySQL |
| 4 | Query results returned to main function | Lambda |
| 5 | Function formats report and publishes to SNS topic | Lambda → SNS |
| 6 | SNS sends email to administrator | SNS → Email |

---

## Objectives

After completing this lab, you will be able to:

- ✅ **Recognize IAM policy permissions** required for Lambda functions to access other AWS resources
- ✅ **Create a Lambda layer** to satisfy external library dependencies (PyMySQL)
- ✅ **Create Lambda functions** that extract data from databases and send reports to users
- ✅ **Deploy and test scheduled Lambda functions** that invoke other functions
- ✅ **Use CloudWatch logs** to troubleshoot Lambda execution issues

---

## Prerequisites

- AWS Management Console access
- Lab environment with pre-provisioned resources:
  - EC2 LAMP instance (CafeInstance) running MySQL
  - Systems Manager Parameter Store with database credentials
  - Pre-created IAM roles (`salesAnalysisReportRole`, `salesAnalysisReportDERole`)
  - CLI Host instance with AWS CLI pre-installed
- Downloaded lab files:
  - `pymysql-v3.zip` - Lambda layer package
  - `salesAnalysisReportDataExtractor-v3.zip` - Data extractor function code
  - `salesAnalysisReport-v2.zip` - Main report function code

---

## Task 1: Observing IAM Role Settings

Before creating Lambda functions, analyze the IAM roles and their permissions to understand the security model.

### Task 1.1: salesAnalysisReportRole

This role is used by the main `salesAnalysisReport` Lambda function.

**Navigation:** `Services > Security, Identity, & Compliance > IAM > Roles`

**Trust Relationships:**
- Trusted entity: `lambda.amazonaws.com`
- Allows the Lambda service to assume this role

**Attached Policies:**

| Policy | Purpose |
|--------|---------|
| `AmazonSNSFullAccess` | Full access to Amazon SNS resources for publishing reports |
| `AmazonSSMReadOnlyAccess` | Read-only access to Systems Manager Parameter Store for DB credentials |
| `AWSLambdaBasicExecutionRole` | Write permissions to CloudWatch Logs (required by all Lambda functions) |
| `AWSLambdaRole` | Allows Lambda function to invoke another Lambda function |

### Task 1.2: salesAnalysisReportDERole

This role is used by the `salesAnalysisReportDataExtractor` Lambda function.

**Trust Relationships:**
- Trusted entity: `lambda.amazonaws.com`

**Attached Policies:**

| Policy | Purpose |
|--------|---------|
| `AWSLambdaBasicExecutionRole` | Write permissions to CloudWatch Logs |
| `AWSLambdaVPCAccessExecutionRole` | Permissions to manage elastic network interfaces for VPC connectivity |

> **Note:** The data extractor requires VPC access because it connects to the MySQL database running on an EC2 instance within the VPC.

---

## Task 2: Creating a Lambda Layer and Data Extractor Function

### Task 2.1: Creating a Lambda Layer

Lambda layers allow you to share code and libraries across multiple functions without including them in each deployment package.

**Layer Details:**

| Setting | Value |
|---------|-------|
| Name | `pymysqlLibrary` |
| Description | PyMySQL library modules |
| Upload | `pymysql-v3.zip` |
| Compatible Runtimes | Python 3.9 |

**Navigation:** `Services > Compute > Lambda > Layers > Create layer`

**Expected Result:** `Successfully created layer pymysqlLibrary version 1`

**Layer Directory Structure:**
```
pymysql-v3.zip
└── python/
    └── pymysql/
        └── ...
```

> **Important:** Lambda layers require a specific folder structure. Python libraries must be placed in a `python/` directory at the root of the zip file.

### Task 2.2: Creating the Data Extractor Function

**Function Configuration:**

| Setting | Value |
|---------|-------|
| Function Name | `salesAnalysisReportDataExtractor` |
| Runtime | Python 3.9 |
| Authoring Method | Author from scratch |
| Execution Role | Use existing role: `salesAnalysisReportDERole` |

**Navigation:** `Lambda > Functions > Create function`

### Task 2.3: Adding the Lambda Layer

1. In the **Function overview** panel, choose **Layers**
2. Choose **Add a layer**
3. Select **Custom layers**
4. Choose `pymysqlLibrary` (Version 1)
5. Choose **Add**

**Expected Result:** Layers node shows count `(1)`

### Task 2.4: Importing the Function Code

**Update Handler:**
- Navigate to **Runtime settings > Edit**
- Handler: `salesAnalysisReportDataExtractor.lambda_handler`
- Save

**Upload Code:**
1. In the **Code source** panel, choose **Upload from > .zip file**
2. Upload `salesAnalysisReportDataExtractor-v3.zip`
3. Choose **Save**

**Code Review:**
The function expects database connection parameters in the `event` object:
```json
{
  "dbUrl": "<database-url>",
  "dbName": "<database-name>",
  "dbUser": "<database-user>",
  "dbPassword": "<database-password>"
}
```

### Task 2.5: Configuring Network Settings

The function requires network access to the EC2 LAMP instance running the café database.

**VPC Configuration:**

| Setting | Value |
|---------|-------|
| VPC | `Cafe VPC` |
| Subnet | `Cafe Public Subnet 1` |
| Security Group | `CafeSecurityGroup` |

**Navigation:** `Configuration tab > VPC > Edit`

> **Tip:** You can ignore the high availability warning for this lab. A single subnet is sufficient for testing.

---

## Task 3: Testing the Data Extractor Function

### Task 3.1: Launching a Test

**Retrieve Database Credentials:**

Navigate to `Services > Management & Governance > Systems Manager > Parameter Store` and retrieve values for:
- `/cafe/dbUrl`
- `/cafe/dbName`
- `/cafe/dbUser`
- `/cafe/dbPassword`

**Create Test Event:**

| Setting | Value |
|---------|-------|
| Test Event Action | Create new event |
| Event Name | `SARDETestEvent` |
| Template | hello-world |

**Event JSON:**
```json
{
  "dbUrl": "<value-of-/cafe/dbUrl>",
  "dbName": "<value-of-/cafe/dbName>",
  "dbUser": "<value-of-/cafe/dbUser>",
  "dbPassword": "<value-of-/cafe/dbPassword>"
}
```

**Expected Initial Result:** `Execution result: failed`

### Task 3.2: Troubleshooting Timeout Errors

**Error Message:**
```json
{
  "errorMessage": "2019-02-14T04:14:15.282Z ff0c3e8f-1985-44a3-8022-519f883c8412 Task timed out after 3.00 seconds"
}
```

**Log Analysis:**
- `START` - Function execution began
- `END` - Function execution ended
- `REPORT` - Performance and resource utilization summary

**Root Cause:** The function attempts to connect to the MySQL database (port 3306) but the security group does not allow inbound traffic on that port.

### Task 3.3: Analyzing and Correcting the Function

**Solution:** Add an inbound rule to the `CafeSecurityGroup` security group to allow MySQL traffic.

**Security Group Rule:**

| Type | Protocol | Port Range | Source |
|------|----------|------------|--------|
| MySQL/Aurora | TCP | 3306 | Custom (Lambda security group or VPC CIDR) |

**Navigation:** `EC2 > Security Groups > CafeSecurityGroup > Edit inbound rules`

**Retest:**
- Return to the Lambda function Test tab
- Choose **Test**

**Expected Result:** `Execution result: succeeded (logs)`

**Initial Response (empty database):**
```json
{
  "statusCode": 200,
  "body": []
}
```

> The `body` is empty because no orders exist in the database yet.

### Task 3.4: Placing Orders and Retesting

**Access the Café Website:**
1. Find the public IP of `CafeInstance`:
   - `EC2 > Instances > CafeInstance > Public IPv4 address`
   - OR use `CafePublicIP` from the lab Details panel
2. Navigate to: `http://<public-ip>/cafe`

**Place Orders:**
- Choose **Menu**
- Place several orders to populate the database

**Retest the Function:**
- Return to Lambda Test tab
- Choose **Test**

**Expected Response (with data):**
```json
{
  "statusCode": 200,
  "body": [
    {
      "product_group_number": 1,
      "product_group_name": "Pastries",
      "product_id": 1,
      "product_name": "Croissant",
      "quantity": 1
    },
    {
      "product_group_number": 2,
      "product_group_name": "Drinks",
      "product_id": 8,
      "product_name": "Hot Chocolate",
      "quantity": 2
    }
  ]
}
```

---

## Task 4: Configuring Notifications

### Task 4.1: Creating an SNS Topic

**Topic Configuration:**

| Setting | Value |
|---------|-------|
| Type | Standard |
| Name | `salesAnalysisReportTopic` |
| Display Name | `SARTopic` |

**Navigation:** `Services > Application Integration > Simple Notification Service > Topics > Create topic`

**Action:** Copy and save the **Topic ARN** for later use.

### Task 4.2: Subscribing to the Topic

**Subscription Configuration:**

| Setting | Value |
|---------|-------|
| Protocol | Email |
| Endpoint | Your accessible email address |

**Steps:**
1. Choose **Create subscription**
2. Check your email inbox
3. Open the email from `SARTopic` with subject `AWS Notification - Subscription Confirmation`
4. Choose **Confirm subscription**
5. Verify the browser shows `Subscription confirmed!`

---

## Task 5: Creating the Sales Analysis Report Function

### Task 5.1: Connecting to the CLI Host

1. Navigate to `EC2 > Instances`
2. Select the **CLI Host** instance
3. Choose **Connect > EC2 Instance Connect tab > Connect**

### Task 5.2: Configuring the AWS CLI

Run the configuration command:
```bash
aws configure
```

**Prompts:**

| Prompt | Value | Source |
|--------|-------|--------|
| AWS Access Key ID | Your AccessKey | Lab Details > Credentials |
| AWS Secret Access Key | Your SecretKey | Lab Details > Credentials |
| Default region name | `us-west-2` | Lambda console region dropdown |
| Default output format | `json` | - |

### Task 5.3: Creating the Function via AWS CLI

**Verify Lab Files:**
```bash
cd activity-files
ls
```

**Retrieve Role ARN:**
- Navigate to `IAM > Roles > salesAnalysisReportRole`
- Copy the **ARN** value

**Create Function Command:**
```bash
aws lambda create-function \
  --function-name salesAnalysisReport \
  --runtime python3.9 \
  --zip-file fileb://salesAnalysisReport-v2.zip \
  --handler salesAnalysisReport.lambda_handler \
  --region us-west-2 \
  --role <salesAnalysisReportRoleARN>
```

**Expected Result:** JSON object describing the function attributes.

### Task 5.4: Configuring Environment Variables

The function code (line 26) retrieves the SNS topic ARN from an environment variable named `topicARN`.

**Navigation:** `Lambda > Functions > salesAnalysisReport > Configuration > Environment variables > Edit`

**Environment Variable:**

| Key | Value |
|-----|-------|
| `topicARN` | `<ARN-of-salesAnalysisReportTopic>` |

**Expected Result:** `Successfully updated the function salesAnalysisReport.`

### Task 5.5: Testing the Function

**Create Test Event:**

| Setting | Value |
|---------|-------|
| Test Event Action | Create new event |
| Event Name | `SARTestEvent` |
| Template | hello-world |
| Input | Default JSON (no input required) |

**Expected Result:** `Execution result: succeeded (logs)`

**Function Response:**
```json
{
  "statusCode": 200,
  "body": ""Sale Analysis Report sent.""
}
```

**Email Verification:**
- Check your email inbox
- Look for an email from `AWS Notifications`
- Subject: `Daily Sales Analysis Report`
- Contains the sales report data

> **Timeout Tip:** If you receive a timeout error, run the test again. Cold starts may exceed the default 3-second timeout. Alternatively, increase the timeout in `Configuration > General configuration > Edit`.

### Task 5.6: Adding a CloudWatch Events Trigger

Configure the function to run automatically Monday through Saturday at 8 PM.

**Trigger Configuration:**

| Setting | Value |
|---------|-------|
| Trigger | EventBridge (CloudWatch Events) |
| Rule | Create new rule |
| Rule Name | `salesAnalysisReportDailyTrigger` |
| Rule Description | Initiates report generation on a daily basis |
| Rule Type | Schedule expression |

**Cron Expressions:**

| Scenario | Expression |
|----------|------------|
| Production (8 PM UTC, MON-SAT) | `cron(0 20 ? * MON-SAT *)` |
| Testing (5 minutes from now, London UTC) | `cron(35 11 ? * MON-SAT *)` |
| Testing (5 minutes from now, New York UTC-5) | `cron(35 16 ? * MON-SAT *)` |

**Production Cron Expression:**
```
cron(0 20 ? * MON-SAT *)
```

**Navigation:** `Function overview > Add trigger > EventBridge (CloudWatch Events)`

**Verification:**
- Wait for the scheduled time to elapse
- Check your email for the automated report

---

## Troubleshooting Guide

| Issue | Cause | Solution |
|-------|-------|----------|
| **Timeout Error (3s)** | Security group blocks MySQL port 3306 | Add inbound rule to `CafeSecurityGroup` for TCP port 3306 |
| **Empty report body** | No orders in database | Place orders via café website and retest |
| **Function cold start timeout** | Initialization takes > 3 seconds | Increase timeout in General configuration or retry test |
| **SNS email not received** | Subscription not confirmed | Check email and confirm subscription |
| **Layer import error** | Incorrect layer structure | Verify `python/` directory exists at zip root |
| **VPC connection failed** | Wrong subnet/security group | Verify `Cafe Public Subnet 1` and `CafeSecurityGroup` |
| **Parameter Store access denied** | Missing SSM policy | Verify `AmazonSSMReadOnlyAccess` is attached to role |

---

## Cleanup

To avoid ongoing charges, delete the following resources after completing the lab:

1. **Lambda Functions:**
   - `salesAnalysisReport`
   - `salesAnalysisReportDataExtractor`

2. **Lambda Layer:**
   - `pymysqlLibrary`

3. **SNS Topic:**
   - `salesAnalysisReportTopic` (this will also delete subscriptions)

4. **CloudWatch Events Rule:**
   - `salesAnalysisReportDailyTrigger`

5. **CloudWatch Logs:**
   - Log groups for both Lambda functions (optional)

---

## Key Takeaways

### IAM Best Practices
- Use least-privilege permissions: grant only the access required
- `AWSLambdaBasicExecutionRole` is required for all Lambda functions (CloudWatch Logs)
- VPC access requires `AWSLambdaVPCAccessExecutionRole` for ENI management

### Lambda Layers
- Layers promote code reuse and reduce deployment package size
- Must follow specific directory structures (`python/` for Python libraries)
- Can be shared across multiple functions and accounts

### VPC Networking
- Lambda functions accessing VPC resources need proper subnet and security group configuration
- Security groups must allow inbound traffic on the database port (3306 for MySQL)
- Timeout errors often indicate network connectivity issues

### Event-Driven Architecture
- CloudWatch Events (EventBridge) enables scheduled serverless workflows
- Cron expressions use UTC timezone
- Six-field format: `cron(Minutes Hours Day-of-month Month Day-of-week Year)`

### Monitoring and Debugging
- CloudWatch Logs provide execution details and error messages
- `START`, `END`, and `REPORT` log lines help analyze performance
- Timeout errors are the most common issue; always check security groups first

---

*Lab completed successfully! 🎉*
