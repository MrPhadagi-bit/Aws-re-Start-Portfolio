# Amazon Route 53 Failover Routing: Lab Overview

> **Skill Level:** Intermediate  
> **Duration:** ~45 minutes  
> **Services:** Amazon Route 53, Amazon EC2, Amazon SNS

---

## Table of Contents

1. [Introduction](#introduction)
2. [Architecture Overview](#architecture-overview)
3. [Prerequisites](#prerequisites)
4. [Objectives](#objectives)
5. [Lab Tasks](#lab-tasks)
   - [Task 1: Confirming the Cafe Websites](#task-1-confirming-the-cafe-websites)
   - [Task 2: Configuring a Route 53 Health Check](#task-2-configuring-a-route-53-health-check)
   - [Task 3: Configuring Route 53 Records](#task-3-configuring-route-53-records)
   - [Task 4: Verifying the DNS Resolution](#task-4-verifying-the-dns-resolution)
   - [Task 5: Verifying the Failover Functionality](#task-5-verifying-the-failover-functionality)
6. [Conclusion](#conclusion)
7. [Cleanup Notes](#cleanup-notes)

---

## Introduction

In this hands-on lab, you will configure **failover routing** for a simple web application using **Amazon Route 53**. The lab environment is pre-provisioned with two Amazon EC2 instances, each running a full **LAMP stack** (Linux, Apache, MySQL, PHP) with a cafe website deployed. These instances are intentionally placed in **different Availability Zones** within the same AWS Region (e.g., `us-west-2a` and `us-west-2b`) to demonstrate high availability.

Your goal is to configure Route 53 so that:
- **Normal traffic** is routed to the **primary** EC2 instance.
- If the primary instance becomes **unavailable**, Route 53 **automatically fails over** traffic to the **secondary** instance.
- You receive an **email alert** via Amazon SNS when the health check detects a failure.

---

## Architecture Overview

```
+-----------------------------------------------------------------------------+
|                              AWS Cloud (us-west-2)                           |
|                                                                             |
|   +-------------------------+         +-------------------------+          |
|   |  Availability Zone 1      |         |  Availability Zone 2      |          |
|   |  (us-west-2a)             |         |  (us-west-2b)             |          |
|   |                           |         |                           |          |
|   |  +-------------------+   |         |  +-------------------+   |          |
|   |  |  CafeInstance1    |   |         |  |  CafeInstance2    |   |          |
|   |  |  (PRIMARY)        |   |         |  |  (SECONDARY)      |   |          |
|   |  |  LAMP + Cafe App  |   |         |  |  LAMP + Cafe App  |   |          |
|   |  |  IP: <PrimaryIP>  |   |         |  |  IP: <SecondaryIP>|   |          |
|   |  +-------------------+   |         |  +-------------------+   |          |
|   |           ^              |         |           ^              |          |
|   +-----------+--------------+         +-----------+--------------+          |
|               |                                    |                         |
|               +------------------------------------+                         |
|                            |                                               |
|                    +-------+-------+                                       |
|                    |   Route 53    |                                       |
|                    |   Failover    |                                       |
|                    |   Records     |                                       |
|                    |               |                                       |
|                    |  Health Check |---> SNS Email Alert                  |
|                    |  (Primary)    |                                       |
|                    +-------+-------+                                       |
|                            |                                               |
|                    www.XXXXXX_XXXXXXXXXX.vocareum.training                   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### Traffic Flow

| State | Primary Instance | Secondary Instance | User Experience |
|-------|------------------|--------------------|-----------------|
| **Healthy** | Running in AZ-1 | Standby in AZ-2 | Traffic routed to **Primary** |
| **Unhealthy** | Stopped/Failed | Running in AZ-2 | Traffic **fails over** to Secondary |

---

## Prerequisites

Before starting this lab, ensure you have:

- Access to an **AWS lab account** (provided by your instructor or training platform).
- A **valid email address** that you can access for SNS notifications.
- Basic familiarity with the **AWS Management Console**.
- Understanding of DNS concepts (A records, TTL, hosted zones).

> **Note:** The lab environment is pre-provisioned. Two EC2 instances (`CafeInstance1` and `CafeInstance2`) are already running with the cafe application installed.

---

## Objectives

After completing this lab, you will be able to:

1. Configure a Route 53 **health check** that monitors an HTTP endpoint and sends email alerts when it becomes unhealthy.
2. Configure **failover routing** in Route 53 to automatically redirect traffic between primary and secondary endpoints.
3. **Verify DNS resolution** and confirm that failover behavior works as expected.

---

## Lab Tasks

---

### Task 1: Confirming the Cafe Websites

> **Purpose:** Verify that both EC2 instances are running the cafe application correctly before configuring failover.

#### Step 1.1: Gather Required Information

1. At the top of the lab page, click **Details** -> **Show** to open the **Credentials** panel.
2. Copy and save the following values to a text editor for later use:
   - `CafeInstance1IPAddress`
   - `PrimaryWebSiteURL`
   - `SecondaryWebsiteURL`
   - `CafeInstance2IPAddress`
3. Close the Credentials panel.

#### Step 1.2: Verify EC2 Instances

1. Navigate to the **AWS Management Console**.
2. In the search bar, type `EC2` and open the **EC2 Management Console**.
3. In the left navigation pane, under **Instances**, click **Instances**.
4. Confirm the following:
   - `CafeInstance1` is running in **Cafe Public Subnet 1** (`us-west-2a`).
   - `CafeInstance2` is running in **Cafe Public Subnet 2** (`us-west-2b`).

#### Step 1.3: Test the Cafe Application

1. Open a new browser tab and paste the **PrimaryWebSiteURL**.
   - The cafe homepage should load.
   - Observe the **Server Information** section -- it displays the EC2 instance details and **Availability Zone** (`us-west-2a`).
2. Open another browser tab and paste the **SecondaryWebsiteURL**.
   - Confirm similar configuration, but in `us-west-2b`.
3. On one of the websites, click **Menu** -> select any item -> click **Submit Order**.
   - The **Order Confirmation** page shows the server time zone, confirming the application is functional.

> **Confirmation:** Both instances are running the cafe app in different Availability Zones, providing the foundation for high availability.

---

### Task 2: Configuring a Route 53 Health Check

> **Purpose:** Create a health check that monitors the primary website and triggers an SNS email alert if it becomes unreachable.

#### Step 2.1: Create the Health Check

1. In the AWS Management Console, open **Route 53** from the Services menu.
   > You may see IAM-related error messages -- these are expected in lab accounts and can be safely ignored.
2. In the left navigation pane, click **Health checks**.
3. Click **Create health check** and configure the following:

| Setting | Value |
|---------|-------|
| **Name** | `Primary-Website-Health` |
| **What to monitor** | `Endpoint` |
| **Specify endpoint by** | `IP address` |
| **IP address** | Paste the **Public IPv4 address** of `CafeInstance1` (from `CafeInstance1IPAddress`) |
| **Path** | `cafe` |

4. Expand **Advanced configuration** and set:

| Setting | Value | Rationale |
|---------|-------|-----------|
| **Request interval** | `Fast (10 seconds)` | Faster detection of failures |
| **Failure threshold** | `2` | Trigger failover after 2 consecutive failures |

5. Click **Next**.

#### Step 2.2: Configure SNS Notifications

1. Under **Get notified when health check fails**, configure:

| Setting | Value |
|---------|-------|
| **Create alarm** | `Yes` |
| **Send notification to** | `New SNS topic` |
| **Topic name** | `Primary-Website-Health` |
| **Recipient email address** | Your accessible email address |

2. Click **Create health check**.

#### Step 2.3: Confirm Health Check Status

1. The health check may take up to **1 minute** to show a **Healthy** status.
2. Click the **refresh icon** to update the status.
3. Select `Primary-Website-Health` and click the **Monitoring** tab to view status history.

#### Step 2.4: Confirm SNS Subscription

1. Check your email for a message from **AWS Notifications**.
2. Open the email and click the **Confirm subscription** link to activate email alerts.

> **Confirmation:** Route 53 is now actively monitoring the primary instance. You will receive an email if it becomes unhealthy.

---

### Task 3: Configuring Route 53 Records

> **Purpose:** Create DNS A records with failover routing policies so Route 53 can automatically switch traffic between primary and secondary instances.

#### Task 3.1: Creating an A Record for the Primary Website

1. In the Route 53 console, click **Hosted zones** in the left navigation pane.
2. Select your domain: `XXXXXX_XXXXXXXXXX.vocareum.training` (unique to your account).
   - You will see two pre-existing records:
     - **NS (Name Server)** -- Lists the 4 authoritative name servers. **Do not modify.**
     - **SOA (Start of Authority)** -- Base DNS information. **Do not modify.**
3. Click **Create record** and configure:

| Setting | Value |
|---------|-------|
| **Record name** | `www` |
| **Record type** | `A - Routes traffic to an IPv4 address` |
| **Value** | IP address of `CafeInstance1IPAddress` |
| **TTL (seconds)** | `15` |
| **Routing policy** | `Failover` |
| **Failover record type** | `Primary` |
| **Health check ID** | `Primary-Website-Health` |
| **Record ID** | `FailoverPrimary` |

4. Click **Create records**.

> The new A record appears as the third record in the hosted zone.

#### Task 3.2: Creating an A Record for the Secondary Website

1. Click **Create record** again and configure:

| Setting | Value |
|---------|-------|
| **Record name** | `www` |
| **Record type** | `A - Routes traffic to an IPv4 address` |
| **Value** | IP address of `CafeInstance2IPAddress` |
| **TTL (seconds)** | `15` |
| **Routing policy** | `Failover` |
| **Failover record type** | `Secondary` |
| **Health check ID** | *(Leave empty)* |
| **Record ID** | `FailoverSecondary` |

2. Click **Create records**.

> **Confirmation:** You now have two `www` A records with failover routing. Route 53 will serve the primary record when healthy, and automatically fail over to the secondary if the health check fails.

---

### Task 4: Verifying the DNS Resolution

> **Purpose:** Confirm that the DNS record resolves to the primary website under normal conditions.

1. In the Route 53 **Hosted zones** page, select the checkbox for either A record.
2. In the **Record details** panel, copy the **Record name** value (e.g., `www.XXXXXX_XXXXXXXXXX.vocareum.training`).
3. Open a new browser tab, paste the record name, and append `/cafe` to the URL:
   ```
   http://www.XXXXXX_XXXXXXXXXX.vocareum.training/cafe/
   ```
4. Load the page -- the cafe primary website should appear.
5. Check the **Server Information** section to confirm it shows the primary Availability Zone (e.g., `us-west-2a`).

> **Confirmation:** DNS is correctly resolving to the primary instance.

---

### Task 5: Verifying the Failover Functionality

> **Purpose:** Simulate a primary server failure and confirm that Route 53 automatically fails over to the secondary instance.

#### Step 5.1: Stop the Primary Instance

1. Return to the **EC2 Management Console**.
2. Select `CafeInstance1`.
3. From the **Instance state** menu, choose **Stop instance** -> confirm by clicking **Stop**.

> The primary website is now offline. Route 53 will detect this via the health check.

#### Step 5.2: Monitor the Health Check

1. Navigate to **Route 53** -> **Health checks**.
2. Select `Primary-Website-Health` and click the **Monitoring** tab.
3. Refresh periodically -- you should see failed health checks within minutes.
4. Wait until the status shows **Unhealthy**.

> This may take a few minutes. Be patient and refresh the view.

#### Step 5.3: Verify Failover

1. Return to the browser tab with `www.XXXXXX_XXXXXXXXXX.vocareum.training/cafe`.
2. **Refresh the page**.
3. Check the **Server Information** section:
   - It should now display a **different Availability Zone** (e.g., `us-west-2b` instead of `us-west-2a`).
   - This confirms traffic is now being served from `CafeInstance2`.

> **Tip:** If the page hasn't changed, wait a bit longer for DNS propagation (up to the TTL value of 15 seconds, though caching may delay it slightly).

#### Step 5.4: Verify the SNS Alert

1. Check your email for a message from **AWS Notifications**.
2. The subject will be: `ALARM: Primary-Website-Health-awsroute53-...`
3. Open the email to review details about what triggered the alarm.

> **Confirmation:** You have successfully verified that Route 53 failover routing works. When the primary instance failed, traffic automatically redirected to the secondary instance, and you received an email alert.

---

## Conclusion

**Congratulations!** You have successfully completed the Amazon Route 53 Failover Routing lab.

### What You Accomplished

| Task | Achievement |
|------|-------------|
| Task 1 | Verified two EC2 instances running the cafe app in different AZs |
| Task 2 | Created a Route 53 health check with SNS email alerting |
| Task 3 | Configured failover routing with primary and secondary A records |
| Task 4 | Verified DNS resolution points to the primary instance |
| Task 5 | Simulated a failure and confirmed automatic failover to the secondary instance |

### Key Takeaways

- **Health checks** are the foundation of Route 53 failover -- they continuously monitor endpoint health.
- **Failover routing policies** allow you to define primary and secondary endpoints for automatic traffic redirection.
- **Low TTL values** (e.g., 15 seconds) enable faster DNS propagation during failover events.
- **SNS integration** ensures you are proactively notified when failures occur.
- **Multi-AZ deployment** is a best practice for building highly available applications on AWS.

---

## Cleanup Notes

> **Important:** If you are responsible for cleaning up lab resources, ensure you terminate or stop the EC2 instances and delete the Route 53 health checks and records to avoid unexpected charges.

| Resource | Cleanup Action |
|----------|---------------|
| EC2 Instances | Stop or terminate `CafeInstance1` and `CafeInstance2` |
| Route 53 Health Check | Delete `Primary-Website-Health` |
| Route 53 Records | Delete the `www` A records from the hosted zone |
| SNS Topic | Delete the `Primary-Website-Health` SNS topic (optional) |

---

## Additional Resources

- [Amazon Route 53 Documentation](https://docs.aws.amazon.com/route53/)
- [Route 53 Health Checks](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover.html)
- [Route 53 Failover Routing](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html#routing-policy-failover)
- [Amazon SNS Documentation](https://docs.aws.amazon.com/sns/)
- [AWS High Availability Best Practices](https://aws.amazon.com/architecture/high-availability/)

---

*Document generated for educational purposes. Lab content provided by AWS Training and Certification.*
