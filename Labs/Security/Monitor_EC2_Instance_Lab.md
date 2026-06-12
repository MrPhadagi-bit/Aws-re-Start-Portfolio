# Monitor an EC2 Instance with CloudWatch & SNS

> **Level:** Intermediate | **Duration:** ~60 minutes | **Services:** EC2, CloudWatch, SNS, Systems Manager

---
## Lab Objectives

After completing this lab, you should be able to:

- [x] Create an **Amazon SNS** notification topic and email subscription
- [x] Configure a **CloudWatch alarm** for CPU utilization thresholds
- [x] Stress test an **EC2 instance** to simulate high CPU load
- [x] Confirm that an **Amazon SNS email** was sent when the alarm triggers
- [x] Create a **CloudWatch dashboard** for centralized monitoring

---

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Stress Test   │────▶│   CloudWatch    │────▶│  Amazon SNS     │
│   EC2 Instance  │     │   Alarm (>60%)  │     │  Topic          │
│                 │     │                 │     │                 │
│  ┌───────────┐  │     │  Threshold: 60% │     │  ┌───────────┐  │
│  │ stress    │  │     │  Period: 1 min  │     │  │ Email     │  │
│  │ --cpu 10  │  │     │  Statistic: Avg │     │  │ Endpoint  │  │
│  └───────────┘  │     │                 │     │  └───────────┘  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                                               │
         └───────────────────────────────────────────────┘
                              Email Notification
                              "ALARM: CPU > 60%"
```

**Data Flow:**
1. EC2 instance emits CPU metrics to CloudWatch every 1 minute
2. CloudWatch alarm evaluates the `CPUUtilization` metric against the 60% threshold
3. When the threshold is breached, the alarm transitions to `In alarm` state
4. CloudWatch triggers the SNS topic, which sends an email to the subscribed address
5. Dashboard provides real-time visualization of the metric

---

## Prerequisites

- AWS account with access to the AWS Management Console
- Valid email address (you must have inbox access to confirm the subscription)
- Basic familiarity with AWS EC2 and the AWS Console navigation

---

## Lab Environment

| Component | Details |
|-----------|---------|
| **EC2 Instance** | `Stress Test` — preconfigured with Amazon Linux 2 |
| **IAM Role** | Attached role with permissions for CloudWatch and Systems Manager |
| **Access Method** | AWS Systems Manager Session Manager (no SSH key required) |
| **Region** | Pre-configured by lab environment |

> **Note:** All backend infrastructure (VPC, IAM roles, EC2 instance) has been pre-built. You only need to configure the monitoring and notification components.

---

## Task 1: Configure Amazon SNS

> **Estimated Time:** 10 minutes  
> **Goal:** Create an SNS topic and subscribe your email address to receive alarm notifications.

### Step 1.1: Navigate to Amazon SNS

1. In the **AWS Management Console**, enter `SNS` in the search bar.
2. Choose **Simple Notification Service** from the results.

### Step 1.2: Create the SNS Topic

1. In the left navigation pane, choose **Topics**.
2. Choose **Create topic**.
3. In the **Details** section, configure:

   | Setting | Value |
   |---------|-------|
   | **Type** | `Standard` |
   | **Name** | `MyCwAlarm` |

4. Choose **Create topic**.

> **What is a Standard Topic?**  
> Standard topics provide at-least-once message delivery and support fan-out to multiple subscribers. For alarm notifications, this is the recommended choice.

### Step 1.3: Create an Email Subscription

1. On the `MyCwAlarm` topic details page, choose the **Subscriptions** tab.
2. Choose **Create subscription**.
3. In the **Details** section, configure:

   | Setting | Value |
   |---------|-------|
   | **Topic ARN** | Leave default (pre-filled) |
   | **Protocol** | `Email` |
   | **Endpoint** | Your valid email address (e.g., `yourname@example.com`) |

4. Choose **Create subscription**.

### Step 1.4: Confirm the Subscription

1. Check your email inbox for a message from **AWS Notifications** with the subject:  
   `AWS Notification - Subscription Confirmation`
2. Open the email and choose **Confirm subscription**.
3. Return to the AWS Console.
4. In the left navigation pane, choose **Subscriptions**.
5. Verify the **Status** column shows **`Confirmed`**.

```
┌─────────────────────────────────────────┐
│   Subscription Status: Confirmed      │
│  Topic: MyCwAlarm                       │
│  Protocol: Email                        │
│  Endpoint: yourname@example.com         │
└─────────────────────────────────────────┘
```

> ** Important:** The alarm **cannot send emails** until the subscription is confirmed. If you don't see the confirmation email within 2 minutes, check your spam/junk folder.

---

## Task 2: Create a CloudWatch Alarm

> **Estimated Time:** 15 minutes  
> **Goal:** Create an alarm that triggers when the Stress Test EC2 instance exceeds 60% CPU utilization.

### Step 2.1: Explore CloudWatch Metrics

1. In the AWS Console search bar, enter `CloudWatch` and choose it.
2. In the left navigation pane, choose **Metrics** → **All metrics**.
3. Choose the **EC2** namespace, then choose **Per-Instance Metrics**.
4. Locate the `Stress Test` instance and select the checkbox for the **`CPUUtilization`** metric.
5. Observe the graph — it should show approximately **0%** since the instance is currently idle.

> **Note:** CloudWatch typically takes **5–10 minutes** after EC2 instance creation to begin fetching metric details. If you don't see metrics yet, wait a few minutes and refresh.

### Step 2.2: Create the Alarm

1. In the left navigation pane, choose **Alarms** → **All alarms**.
2. Choose **Create alarm**.
3. Choose **Select metric**.
4. Navigate to **EC2** → **Per-Instance Metrics**.
5. Select the checkbox for **`CPUUtilization`** on the `Stress Test` instance.
6. Choose **Select metric**.

### Step 2.3: Configure Metric and Conditions

On the **Specify metric and conditions** page, configure:

#### Metric Settings

| Setting | Value | Description |
|---------|-------|-------------|
| **Metric name** | `CPUUtilization` | The EC2 CPU utilization metric |
| **InstanceId** | Default (pre-filled) | Targets the Stress Test instance |
| **Statistic** | `Average` | Uses the mean value over the period |
| **Period** | `1 minute` | Evaluates every 60 seconds |

#### Conditions (Threshold)

| Setting | Value | Description |
|---------|-------|-------------|
| **Threshold type** | `Static` | Fixed threshold value |
| **Whenever CPUUtilization is...** | `Greater > threshold` | Triggers when CPU exceeds the limit |
| **than...** | `60` | Threshold value: **60%** |

```
┌────────────────────────────────────────────────────────┐
│  Alarm Condition: CPUUtilization > 60% for 1 minute    │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Metric: CPUUtilization (Average)               │   │
│  │  Period: 1 minute                               │   │
│  │  Threshold: 60% ────────────────────────        │   │
│  │                                         │       │   │
│  │     CPU Usage    ╱╲    ╱╲               │       │   │
│  │                 ╱  ╲  ╱  ╲    ╱╲        │       │   │
│  │                ╱    ╲╱    ╲  ╱  ╲  ╱╲  │       │   │
│  │  ──────────────────────────────────────────────  │   │
│  │  0%                                            100%│   │
│  └─────────────────────────────────────────────────┘   │
│  🔴 ALARM STATE: In alarm (when above threshold)       │
│  🟢 OK STATE: Below threshold                            │
└────────────────────────────────────────────────────────┘
```

Choose **Next**.

### Step 2.4: Configure Actions

On the **Configure actions** page:

1. Under **Notification**:
   - **Alarm state trigger:** `In alarm`
   - **Select an SNS topic:** `Select an existing SNS topic`
   - **Send a notification to...:** Choose **`MyCwAlarm`** from the dropdown

2. Choose **Next**.

### Step 2.5: Name and Review

On the **Add name and description** page:

| Setting | Value |
|---------|-------|
| **Alarm name** | `LabCPUUtilizationAlarm` |
| **Alarm description** | `CloudWatch alarm for Stress Test EC2 instance CPUUtilization` |

Choose **Next**, review the **Preview and create** page, then choose **Create alarm**.

> **Alarm States Explained:**
> - `OK` — Metric is within the defined threshold
> - `In alarm` — Metric has breached the threshold
> - `Insufficient data` — Not enough data points to evaluate the alarm

---

## Task 3: Stress Test the EC2 Instance

> **Estimated Time:** 15 minutes  
> **Goal:** Simulate high CPU load to trigger the CloudWatch alarm and verify the SNS email notification.

### Step 3.1: Access the EC2 Instance

1. Navigate to the **Vocareum lab console** page.
2. Choose the **AWS Details** button.
3. Locate **EC2InstanceURL** and copy the link.
4. Paste the URL into a new browser tab to open a terminal via **AWS Systems Manager Session Manager**.

> **What is Session Manager?**  
> Session Manager provides secure browser-based shell access to EC2 instances without opening inbound ports, managing SSH keys, or using bastion hosts.

### Step 3.2: Run the Stress Test

In the terminal, execute the following command to stress the CPU to 100%:

```bash
sudo stress --cpu 10 -v --timeout 400s
```

**Command Breakdown:**

| Flag | Description |
|------|-------------|
| `--cpu 10` | Spawns 10 workers to consume CPU cores |
| `-v` | Verbose output (shows detailed activity) |
| `--timeout 400s` | Runs for 400 seconds, then automatically stops |

**Expected Output:**

```
stress: info: [1234] dispatching hogs: 10 cpu, 0 io, 0 vm, 0 hdd
stress: info: [1234] successful run completed in 400s
```

> **Simulation Context:** This test simulates a scenario where a malicious actor or runaway process spikes CPU utilization. High CPU usage is a common indicator of crypto-mining malware, brute-force attacks, or resource exhaustion attacks.

### Step 3.3: Monitor Live CPU Usage (Optional)

1. Return to the **Vocareum console** and open a **second terminal** using the same EC2InstanceURL.
2. Run the `top` command to view real-time CPU usage:

   ```bash
   top
   ```

3. You should see CPU usage near **100%** with multiple `stress` processes consuming resources.

### Step 3.4: Monitor the CloudWatch Alarm

1. Return to the **AWS Console** → **CloudWatch** → **Alarms** → **All alarms**.
2. Choose **`LabCPUUtilizationAlarm`**.
3. Refresh the graph every **1 minute**.
4. Observe the `CPUUtilization` metric rising above the **60%** threshold line.

**Timeline Expectation:**

| Time | Alarm State | What Happens |
|------|-------------|--------------|
| T+0 min | `OK` | Stress test begins |
| T+2-3 min | `In alarm` | CPU exceeds 60% threshold |
| T+2-3 min | `In alarm` | **SNS email sent** to your inbox |
| T+6-7 min | `OK` | Stress test ends (400s), CPU drops |

> **Note:** It takes **2–3 minutes** for the alarm to transition to `In alarm` because CloudWatch evaluates the average over the configured period. The email may take an additional 1–2 minutes to arrive.

### Step 3.5: Verify the Email Notification

1. Check your email inbox for a new message from **AWS Notifications**.
2. The email subject will be similar to:  
   `ALARM: "LabCPUUtilizationAlarm" in US-East-1`
3. The email body contains:
   - Alarm name
   - AWS Region
   - Account ID
   - Metric: `CPUUtilization > 60% for 1 minute`
   - Timestamp of the state change

```
┌─────────────────────────────────────────────────────────┐
│  FROM: AWS Notifications <no-reply@sns.amazonaws.com>   │
│  SUBJECT: ALARM: "LabCPUUtilizationAlarm" in US-East-1  │
│                                                         │
│  Alarm Details:                                         │
│  • Name: LabCPUUtilizationAlarm                         │
│  • State: ALARM                                         │
│  • Reason: Threshold Crossed                            │
│  • Metric: CPUUtilization > 60%                         │
│  • Instance: Stress Test (i-xxxxxxxxxxxxxxxxx)        │
│  • Time: 2024-XX-XX XX:XX:XX UTC                       │
└─────────────────────────────────────────────────────────┘
```

> ** Success Criteria:** You have successfully verified that the CloudWatch alarm triggered the SNS topic, which delivered an email notification to your inbox.

---

## Task 4: Create a CloudWatch Dashboard

> **Estimated Time:** 10 minutes  
> **Goal:** Build a centralized dashboard to visualize the EC2 CPU utilization metric.

### Step 4.1: Create the Dashboard

1. In the **AWS Console**, navigate to **CloudWatch** → **Dashboards**.
2. Choose **Create dashboard**.
3. For **Dashboard name**, enter: `LabEC2Dashboard`
4. Choose **Create dashboard**.

### Step 4.2: Add a Line Widget

1. In the **Add widget** dialog, choose **Line**.
2. Choose **Metrics**.
3. Navigate to **EC2** → **Per-Instance Metrics**.
4. Select the checkbox for:
   - **Instance name:** `Stress Test`
   - **Metric name:** `CPUUtilization`
5. Choose **Create widget**.

### Step 4.3: Save the Dashboard

1. Choose **Save dashboard**.

**Dashboard Features:**

| Feature | Benefit |
|---------|---------|
| **Real-time metrics** | View CPU utilization without navigating to multiple pages |
| **Cross-region support** | Monitor resources across different AWS Regions |
| **Customizable layout** | Add multiple widgets (alarms, logs, other metrics) |
| **Shareable** | Generate URLs to share dashboards with team members |

> **Pro Tip:** You can add the `LabCPUUtilizationAlarm` widget to the dashboard to visualize alarm state alongside the metric graph. This provides a single-pane-of-glass view for operational monitoring.

---

## Cleanup

> ** Important:** To avoid unexpected charges, clean up resources if this is not a persistent lab environment.

| Resource | Action |
|----------|--------|
| **CloudWatch Dashboard** | CloudWatch → Dashboards → `LabEC2Dashboard` → Actions → Delete |
| **CloudWatch Alarm** | CloudWatch → Alarms → `LabCPUUtilizationAlarm` → Actions → Delete |
| **SNS Subscription** | SNS → Subscriptions → Select subscription → Delete |
| **SNS Topic** | SNS → Topics → `MyCwAlarm` → Delete |

> **Note:** The EC2 instance and IAM role are managed by the lab environment and do not require manual cleanup.

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| **No confirmation email received** | Email in spam/junk folder | Check spam folder; resend confirmation from SNS Subscriptions page |
| **CloudWatch shows no metrics** | Metrics not yet populated | Wait 5–10 minutes after instance creation; verify instance is running |
| **Alarm never triggers** | Threshold too high or period too long | Verify threshold is `60` and period is `1 minute`; check correct instance is selected |
| **Email not sent after alarm triggers** | SNS subscription not confirmed | Go to SNS → Subscriptions and confirm the email endpoint |
| **Stress command not found** | `stress` package not installed | Install with: `sudo yum install stress -y` (Amazon Linux) |
| **Session Manager connection fails** | IAM permissions missing | Verify the IAM role attached to the instance includes `AmazonSSMManagedInstanceCore` policy |

---

## Key Takeaways

```
┌─────────────────────────────────────────────────────────────┐
│   MONITORING STRATEGY                                       │
│                                                               │
│  1. METRICS    → CloudWatch collects EC2 CPUUtilization      │
│  2. ALARMS     → Threshold-based alerting (60% CPU)        │
│  3. ACTIONS    → SNS sends email when threshold breached     │
│  4. VISIBILITY → Dashboard provides centralized monitoring   │
│                                                               │
│   SECURITY IMPLICATIONS                                     │
│                                                               │
│  • CPU spikes can indicate malware, crypto-mining, or        │
│    unauthorized resource consumption                          │
│  • Automated alerting enables rapid incident response        │
│  • Dashboards improve operational awareness                  │
│                                                               │
│   BEST PRACTICES                                            │
│                                                               │
│  • Use multiple alarm thresholds (e.g., 60% warning, 80%   │
│    critical) for tiered response                              │
│  • Combine SNS with Lambda for automated remediation         │
│  • Add memory and disk metrics for comprehensive monitoring  │
│  • Set up CloudWatch Logs for application-level visibility   │
└─────────────────────────────────────────────────────────────┘
```

### What You Built

1. **Amazon SNS Topic** (`MyCwAlarm`) — A messaging channel for alarm notifications
2. **Email Subscription** — Confirmed endpoint to receive alerts
3. **CloudWatch Alarm** (`LabCPUUtilizationAlarm`) — Automated threshold monitoring
4. **Stress Test Validation** — Proven end-to-end notification flow
5. **CloudWatch Dashboard** (`LabEC2Dashboard`) — Centralized operational view

---

## Additional Resources

- [Amazon CloudWatch Documentation](https://docs.aws.amazon.com/cloudwatch/)
- [Amazon SNS Developer Guide](https://docs.aws.amazon.com/sns/)
- [AWS Systems Manager Session Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html)
- [CloudWatch Alarms](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html)
- [Creating CloudWatch Dashboards](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/create_dashboard.html)

---

*Lab completed successfully! *

*Last updated: 2026-06-12*
