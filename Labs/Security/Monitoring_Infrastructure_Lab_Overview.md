# Monitoring Infrastructure: Lab Overview

## Introduction

The ability to monitor your applications and infrastructure is critical for delivering reliable, consistent IT services.

Monitoring requirements range from collecting statistics for long-term analysis to quickly reacting to changes and outages. Monitoring can also support compliance reporting by continuously checking that infrastructure is meeting organizational standards.

This lab shows you how to use **Amazon CloudWatch Metrics**, **Amazon CloudWatch Logs**, **Amazon CloudWatch Events**, and **AWS Config** to monitor your applications and infrastructure.

---

## Duration

This lab requires approximately **60 minutes** to complete.

---

## Lab Architecture & Services Overview

| Service | Purpose in This Lab |
|---------|----------------------|
| **Amazon CloudWatch** | Central monitoring and observability service for AWS resources |
| **CloudWatch Agent** | Collects system-level metrics and logs from EC2 instances |
| **CloudWatch Logs** | Centralizes and monitors application and system log files |
| **CloudWatch Metrics** | Stores, graphs, and alarms on performance data |
| **CloudWatch Events** | Delivers near real-time stream of system events for operational changes |
| **AWS Systems Manager (SSM)** | Manages and automates operational tasks like installing the CloudWatch agent |
| **AWS Config** | Assesses, audits, and evaluates resource configurations for compliance |
| **Amazon SNS** | Sends notifications via email when alarms or events trigger |

---

## Task 1: Installing the CloudWatch Agent

### Overview

The **CloudWatch agent** is used to collect metrics from EC2 instances and on-premises servers. It captures:

- **System-level metrics** from EC2 instances (CPU allocation, free disk space, memory utilization)
- **System-level metrics** from on-premises servers (for hybrid environments)
- **System and application logs** from Linux and Windows servers
- **Custom metrics** from applications using StatsD and collectd protocols

In this task, you will use **AWS Systems Manager Run Command** to install and configure the CloudWatch agent on an EC2 instance.

### Step 1.1: Install the CloudWatch Agent via Systems Manager

1. Open the **AWS Management Console** and navigate to **Systems Manager**.
2. In the left navigation pane, choose **Run Command**.
3. Choose **Run a command**.
4. Select **AWS-ConfigureAWSPackage**.
5. In the **Command parameters** section, configure:
   - **Action**: `Install`
   - **Name**: `AmazonCloudWatchAgent`
   - **Version**: `latest`
6. In the **Targets** section, select **Choose instances manually**, then select the **Web Server** instance.
7. Choose **Run** and wait for the **Overall status** to change to **Success**.
8. Under **Targets and outputs**, expand the instance and click **View output**.
9. Verify the message: `Successfully installed arn:aws:ssm:::package/AmazonCloudWatchAgent`.

> **Note**: If you see a message about unsatisfied preconditions for Windows, expand **Step 2 - Output** instead. This occurs because the instance uses a Linux AMI.

### Step 1.2: Create the CloudWatch Agent Configuration in Parameter Store

The CloudWatch agent configuration is stored in **AWS Systems Manager Parameter Store** so the agent can retrieve it at runtime.

1. In the left navigation pane of Systems Manager, choose **Parameter Store**.
2. Choose **Create parameter** and configure:
   - **Name**: `Monitor-Web-Server`
   - **Description**: `Collect web logs and system metrics`
   - **Value**: Paste the following JSON configuration:

```json
{
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "log_group_name": "HttpAccessLog",
            "file_path": "/var/log/httpd/access_log",
            "log_stream_name": "{instance_id}",
            "timestamp_format": "%b %d %H:%M:%S"
          },
          {
            "log_group_name": "HttpErrorLog",
            "file_path": "/var/log/httpd/error_log",
            "log_stream_name": "{instance_id}",
            "timestamp_format": "%b %d %H:%M:%S"
          }
        ]
      }
    }
  },
  "metrics": {
    "metrics_collected": {
      "cpu": {
        "measurement": [
          "cpu_usage_idle",
          "cpu_usage_iowait",
          "cpu_usage_user",
          "cpu_usage_system"
        ],
        "metrics_collection_interval": 10,
        "totalcpu": false
      },
      "disk": {
        "measurement": [
          "used_percent",
          "inodes_free"
        ],
        "metrics_collection_interval": 10,
        "resources": ["*"]
      },
      "diskio": {
        "measurement": [
          "io_time"
        ],
        "metrics_collection_interval": 10,
        "resources": ["*"]
      },
      "mem": {
        "measurement": [
          "mem_used_percent"
        ],
        "metrics_collection_interval": 10
      },
      "swap": {
        "measurement": [
          "swap_used_percent"
        ],
        "metrics_collection_interval": 10
      }
    }
  }
}
```

3. Choose **Create parameter**.

> **Configuration Summary**:
> - **Logs**: Collects `HttpAccessLog` and `HttpErrorLog` from `/var/log/httpd/`
> - **Metrics**: Collects CPU, disk, disk I/O, memory, and swap metrics every 10 seconds

### Step 1.3: Start the CloudWatch Agent

1. Return to **Run Command** in Systems Manager.
2. Choose **Run command**.
3. Filter by **Document name prefix** → **Equals** → `AmazonCloudWatch-ManageAgent`.
4. Select **AmazonCloudWatch-ManageAgent**.
5. In the **Command parameters** section, configure:
   - **Action**: `configure`
   - **Mode**: `ec2`
   - **Optional Configuration Source**: `ssm`
   - **Optional Configuration Location**: `Monitor-Web-Server`
   - **Optional Restart**: `yes`
6. In the **Targets** section, select the **Web Server** instance.
7. Choose **Run** and wait for **Success**.

> The CloudWatch agent is now running and sending log and metric data to CloudWatch.

---

## Task 2: Monitoring Application Logs Using CloudWatch Logs

### Overview

**CloudWatch Logs** enables you to monitor applications and systems using log data without requiring code changes. You can:

- Track specific literal terms (e.g., `NullReferenceException`)
- Count occurrences of terms at specific positions (e.g., `404` status codes)
- Report findings to CloudWatch metrics for alarming
- Encrypt log data in transit and at rest

### Step 2.1: Generate Log Data

1. Copy the **WebServerIP** from the lab details.
2. Open a new browser tab and navigate to the IP address. You should see a **web server Test Page**.
3. Append `/start` to the URL and press Enter. You will receive a **404 Not Found** error — this is expected and generates log data.
4. Keep the tab open and return to the AWS Console.

### Step 2.2: View Logs in CloudWatch

1. Navigate to **CloudWatch** → **Log groups**.
2. You should see **HttpAccessLog** and **HttpErrorLog**.
3. Choose **HttpAccessLog**, then select the log stream matching your instance ID.
4. Review the log data. You should see a `GET /start` request with a `404` status code.

> This demonstrates automatic log shipping from EC2 to CloudWatch Logs, accessible without logging into individual servers.

### Step 2.3: Create a Metric Filter

A **metric filter** extracts metric data from log events and sends it to CloudWatch Metrics.

1. In **CloudWatch** → **Log groups**, select **HttpAccessLog**.
2. From **Actions**, choose **Create metric filter**.
3. In the **Filter pattern** box, paste:

```
[ip, id, user, timestamp, request, status_code=404, size]
```

4. In the **Test pattern** section, select your EC2 instance ID and choose **Test pattern**.
5. Verify results show `$status_code` of `404`, then choose **Next**.
6. Configure the filter:
   - **Filter name**: `404Errors`
   - **Metric namespace**: `LogMetrics`
   - **Metric name**: `404Errors`
   - **Metric value**: `1`
7. Choose **Next** → **Create metric filter**.

### Step 2.4: Create an Alarm from the Metric Filter

1. In the **404Errors** panel, select the checkbox and choose **Create alarm**.
2. Configure:
   - **Period**: `1 minute`
   - **Whenever 404Errors is**: `Greater/Equal` **than** `5`
3. In **Notification**:
   - **Select an SNS Topic**: **Create new topic**
   - **Email endpoints**: Enter your accessible email address
   - Choose **Create topic**
4. Set:
   - **Alarm name**: `404 Errors`
   - **Alarm description**: `Alert when too many 404s detected on an instance`
5. Choose **Create alarm**.
6. Check your email and **confirm the SNS subscription**.

### Step 2.5: Trigger the Alarm

1. Return to the web server browser tab.
2. Attempt to access non-existent pages (e.g., `http://<WebServerIP>/start2`, `/start3`, etc.) at least **5 times**.
3. Each request generates a separate log entry.
4. Wait **1–2 minutes**, then refresh the CloudWatch console.
5. The alarm graph should turn **red** (Alarm state).
6. Check your email for an alarm notification with the subject: `ALARM: "404 Errors"`.

> This demonstrates how to create alarms from application log data and receive alerts when unusual behavior is detected.

---

## Task 3: Monitoring Instance Metrics Using CloudWatch

### Overview

**CloudWatch Metrics** stores performance data about your systems. AWS services automatically publish metrics, and you can also publish custom metrics via the CloudWatch agent or directly from your application.

### Step 3.1: View EC2 Instance Metrics

1. Navigate to **EC2** → **Instances**.
2. Select the **Web Server** instance.
3. Choose the **Monitoring** tab.
4. Examine the metrics: CPU, disk, and network usage.

> These metrics view the instance from the outside as a virtual machine. They do **not** show internal metrics like free memory or disk space.

### Step 3.2: View CloudWatch Agent Metrics

1. Navigate to **CloudWatch** → **Metrics** → **All metrics**.
2. Choose **CWAgent** → **device, fstype, host, path** to view disk space metrics.
3. Navigate up and choose **CWAgent** → **host** to view memory metrics.
4. Explore other metrics captured automatically by AWS services.

> The CloudWatch agent runs **inside** the instance, providing insight into internal system state such as memory utilization and disk usage.

---

## Task 4: Creating Real-Time Notifications

### Overview

**CloudWatch Events** delivers a near real-time stream of system events describing changes in AWS resources. You can match events with rules and route them to targets such as Lambda functions, SNS topics, or Kinesis streams.

In this task, you create a rule that notifies you when an EC2 instance is **stopped** or **terminated**.

### Step 4.1: Create a CloudWatch Events Rule

1. In **CloudWatch**, expand **Events** → choose **Rules**.
2. Choose **Create rule**.
3. Configure:
   - **Name**: `Instance_Stopped_Terminated`
4. In **Build event pattern**:
   - **Event source**: `AWS Services`
   - **AWS service**: `EC2`
   - **Event Type**: `EC2 Instance State-change Notification`
   - **Specific state(s)**: Select `stopped` and `terminated`
5. Choose **Next**.
6. In **Select target(s)**:
   - **Target types**: `AWS Service`
   - **Select a target**: `SNS topic`
   - **Topic**: `Default_CloudWatch_Alarms_Topic`
   - **Permissions**: Uncheck **Use execution role (recommended)**
7. Choose **Next** → **Create rule**.

### Step 4.2: Test the Notification

1. Navigate to **SNS** → **Topics** and verify your email subscription is active.
2. Go to **EC2** → **Instances**, select **Web Server**.
3. Choose **Instance state** → **Stop instance** → **Stop**.
4. The instance enters the **Stopping** state, then **Stopped**.
5. Check your email for a JSON-formatted notification about the stopped instance.

> To receive a more readable message, you could create an AWS Lambda function triggered by CloudWatch Events to format and send the message via SNS.

---

## Task 5: Monitoring for Infrastructure Compliance

### Overview

**AWS Config** continuously monitors and records your AWS resource configurations. It allows you to:

- Automate evaluation of recorded configurations against desired configurations
- Review changes in configurations and relationships between resources
- Dive into detailed resource configuration histories
- Determine overall compliance against internal guidelines

In this task, you activate AWS Config rules to ensure compliance for **tagging** and **EBS volume attachment**.

### Step 5.1: Enable AWS Config (if needed)

1. Navigate to **Config**.
2. If prompted, choose **Get started** → **Next** → **Next** → **Confirm**.
3. Close the welcome window if it appears.

### Step 5.2: Add the Required Tags Rule

1. In **AWS Config**, choose **Rules** → **Add rule**.
2. In the search field, enter `required-tags`.
3. Select **required-tags** and choose **Next**.
4. In **Parameters**, set:
   - **tag1Key**: `project`
5. Choose **Next** → **Add rule**.

> This rule checks that all resources have a `project` tag. Evaluation takes a few minutes.

### Step 5.3: Add the EBS Volume In-Use Check Rule

1. Choose **Add rule**.
2. Search for `ec2-volume-inuse-check`.
3. Select **ec2-volume-inuse-check** and choose **Next**.
4. Choose **Next** → **Add rule**.

> This rule checks that EBS volumes are attached to EC2 instances.

### Step 5.4: Review Compliance Results

1. Wait for at least one rule to complete evaluation (refresh the page if needed).
2. If you see **No resources in scope**, wait a few more minutes for AWS Config to finish scanning.
3. Choose each rule to view results.
4. Under **Resources in scope**, filter by **Compliant**.

**Expected Results**:

| Rule | Compliant | Non-Compliant |
|------|-----------|---------------|
| **required-tags** | EC2 instance with `project` tag | Resources without `project` tag |
| **ec2-volume-inuse-check** | Volume attached to an instance | Volume not attached to an instance |

> AWS Config provides a large library of pre-defined compliance checks. You can also create custom rules using AWS Lambda.

---

## Lab Complete

You have successfully completed the **Monitoring Infrastructure** lab. You should now be able to:

- Deploy and configure the **CloudWatch agent** using **AWS Systems Manager**
- Monitor application logs with **CloudWatch Logs** and create **metric filters** and **alarms**
- Monitor system metrics with **CloudWatch Metrics**
- Set up **real-time notifications** using **CloudWatch Events** and **SNS**
- Track **infrastructure compliance** using **AWS Config rules**

---

## Key Takeaways

| Concept | Service | Benefit |
|---------|---------|---------|
| Log collection & analysis | CloudWatch Logs | Centralized log access without server login |
| System metrics | CloudWatch Agent + Metrics | Internal visibility (memory, disk) beyond basic EC2 metrics |
| Real-time event response | CloudWatch Events | Immediate notification of infrastructure changes |
| Compliance auditing | AWS Config | Continuous evaluation against organizational standards |
| Alerting | CloudWatch Alarms + SNS | Proactive notification of threshold breaches |

---

*Lab duration: ~60 minutes*
