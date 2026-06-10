# Systems Hardening with Patch Manager via AWS Systems Manager

## Lab Overview

In organizations with hundreds and often thousands of workstations, it can be logistically challenging to keep all the operating system (OS) and application software up to date. In most cases, OS updates on workstations can be automatically applied via the network. However, administrators must have a clear security policy and baseline plan to ensure that all workstations are running a certain minimum version of software.

In this lab, you use **Patch Manager**, a capability of **AWS Systems Manager**, to create a patch baseline. You then use the patch baseline that you created to scan the **Amazon Elastic Compute Cloud (Amazon EC2)** instances for Windows that were pre-created for this lab. You also use default patch baseline to patch EC2 Linux instances.

---

## Objectives

After completing this lab, you should be able to:

- Patch Linux instances using default baseline
- Create custom patch baseline
- Use patch groups to patch Windows instances using custom patch baseline
- Verify patch compliance

---

## Duration

This lab requires approximately **60 minutes** to complete.

---

## Prerequisites

- AWS Management Console access
- Pre-configured EC2 instances (three Linux and three Windows instances) with the appropriate IAM role for Systems Manager
- Basic familiarity with the AWS Management Console

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    AWS Management Console                    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │           AWS Systems Manager (SSM)                  │  │
│  │                                                      │  │
│  │   ┌─────────────┐      ┌─────────────────────────┐  │  │
│  │   │ Fleet Manager│      │      Patch Manager      │  │  │
│  │   └─────────────┘      └─────────────────────────┘  │  │
│  │                              │                       │  │
│  │                              ▼                       │  │
│  │   ┌─────────────┐      ┌─────────────────────────┐  │  │
│  │   │ Run Command │◄─────│   Patch Baselines     │  │  │
│  │   └─────────────┘      │  - Default (Linux)     │  │  │
│  │                        │  - Custom (Windows)    │  │  │
│  │                        └─────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────┘  │
│                              │                              │
│                              ▼                              │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              EC2 Instances (Managed Nodes)           │  │
│  │                                                      │  │
│  │   Linux-1  Linux-2  Linux-3    Windows-1  Windows-2  │  │
│  │     │        │        │          │          │         │  │
│  │     └────────┴────────┘          └──────────┘         │  │
│  │          Patch Group: LinuxProd   Patch Group:       │  │
│  │                                   WindowsProd         │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Task 1: Patch Linux Instances Using Default Baselines

Patch Manager provides predefined patch baselines for each supported operating system. You can use these baselines as-is (they cannot be customized), or create your own custom patch baselines for greater control over which patches are approved or rejected.

### 1.1 Verify Managed Instances in Fleet Manager

1. In the **AWS Management Console**, use the search box to enter **Systems Manager** and select it.
2. In the left navigation pane, under **Node Management**, choose **Fleet Manager**.
3. Observe the pre-configured EC2 instances:
   - Three Linux instances
   - Three Windows instances
   > **Note:** These instances have a specific IAM role that allows Systems Manager to manage them.

4. Select the checkbox next to **Linux-1**.
5. Choose the **Node actions** dropdown, then select **View details**.
6. Review the instance details:
   - Platform type
   - Node type
   - OS name
   - IAM role (allows SSM management)
7. Choose **AWS Systems Manager** at the top to return to the homepage.

### 1.2 Patch Linux Instances

1. In the left navigation pane, under **Node Management**, choose **Patch Manager**.
2. Choose **Start with an overview** (proceed to the next step if this option does not appear).
3. Choose **Patch now** to patch the Linux instances with `AWS-AmazonLinux2DefaultPatchBaseline`.
4. Under **Basic configuration**, configure as follows:

| Setting | Value |
|---------|-------|
| **Patching operation** | `Scan and install` |
| **Reboot option** | `Reboot if needed` |
| **Instances to patch** | `Patch only the target instances I specify` |
| **Target selection** | `Specify instance tags` |
| **Tag key** | `Patch Group` |
| **Tag value** | `LinuxProd` |

5. Choose **Add**.
6. Choose **Patch now**.

### 1.3 Monitor Patching Progress

- A new page displays. In the **AWS-PatchNowAssociation** panel, observe the **Status** field showing that three instances will be affected and the progress made.
- A **Scan/Install operation summary** panel also displays the status of the affected EC2 instances visually.
- **Monitor this page until the patch operation on all three instances completes.**

---

## Task 2: Create a Custom Patch Baseline for Windows Instances

Although Windows has default patch baselines, you will create a custom baseline specifically for Windows security updates.

### 2.1 Create the Patch Baseline

1. Return to the **Systems Manager console**.
2. In the left navigation pane, under **Node Management**, choose **Patch Manager**.
3. Choose **Start with an overview** (proceed if this option does not appear).
4. Choose the **Patch baselines** tab.
5. Choose **Create patch baseline**.

#### Patch Baseline Details

| Setting | Value |
|---------|-------|
| **Name** | `WindowsServerSecurityUpdates` |
| **Description** | `Windows security baseline patch` |
| **Operating system** | `Windows` |
| **Default patch baseline** | `Unchecked` |

### 2.2 Configure Approval Rules

#### Rule 1: Critical Security Updates

| Setting | Value |
|---------|-------|
| **Products** | `WindowsServer2019` (deselect **All**) |
| **Severity** | `Critical` |
| **Classification** | `SecurityUpdates` |
| **Auto-approval** | `3 days` |
| **Compliance reporting** | `Critical` |

- Choose **Add rule** to add a second rule.

#### Rule 2: Important Security Updates

| Setting | Value |
|---------|-------|
| **Products** | `WindowsServer2019` (deselect **All**) |
| **Severity** | `Important` |
| **Classification** | `SecurityUpdates` |
| **Auto-approval** | `3 days` |
| **Compliance reporting** | `High` |

6. Choose **Create patch baseline**.

### 2.3 Modify Patch Groups

1. In the **Patch baselines** section, select the radio button for the `WindowsServerSecurityUpdates` patch baseline you just created.
   > **Tip:** The baseline may be on the second page. Use the search bar to locate it.
2. Choose the **Actions** dropdown, then select **Modify patch groups**.
3. Under **Patch groups**, enter: `WindowsProd`
4. Choose **Add**, then choose **Close**.

---

## Task 3: Patching the Windows Instances

After configuration, Patch Manager uses **Run Command** to call the `RunPatchBaseline` document to evaluate which patches should be installed on target instances according to each instance's operating system type.

### 3.1 Tagging Windows Instances

> **Note:** The Linux instances were pre-configured during lab setup with `LinuxProd` tags and do not need additional tags.

1. In the **AWS Management Console**, search for **EC2** and select it.
2. Choose **Instances**, select the checkbox next to **Windows-1**.
3. Choose the **Tags** tab, then choose **Manage tags**.
4. Choose **Add new tag** and configure:

| Setting | Value |
|---------|-------|
| **Key** | `Patch Group` |
| **Value** | `WindowsProd` |

5. Choose **Save**.
6. **Repeat** the above steps for **Windows-2** and **Windows-3** instances with the same tag.

### 3.2 Patching Windows Instances

1. Return to the **Systems Manager console**.
2. Choose **Patch Manager**.
3. Choose **Start with an overview** (proceed if this option does not appear).
4. Choose **Patch now**.
5. Under **Basic configuration**, configure as follows:

| Setting | Value |
|---------|-------|
| **Patching operation** | `Scan and install` |
| **Reboot option** | `Reboot if needed` |
| **Instances to patch** | `Patch only the target instances I specify` |
| **Target selection** | `Specify instance tags` |
| **Tag key** | `Patch Group` |
| **Tag value** | `WindowsProd` |

6. Choose **Add**.
7. Choose **Patch now**.

### 3.3 Monitor Execution Output

1. A new page displays. When available, choose the link to the **Execution ID**.
2. A page in the **State Manager** part of Systems Manager opens.
3. Choose the **Output** link for one of the managed instances showing a status of **InProgress**.
4. A page in the **Run Command** part of Systems Manager opens.
5. Expand the **Output** panel to observe the details.
   > **Behind the scenes:** Patch Manager uses Run Command to run `PatchBaselineOperations`. If you scroll through the output, you should see the `PatchGroup: WindowsProd` details.
6. A **Systems Manager document (SSM document)** defines the actions that Systems Manager performs on your managed instances.

---

## Task 4: Verifying Compliance

### 4.1 Dashboard Compliance Summary

1. In the left navigation pane, under **Node Management**, choose **Patch Manager**.
2. Choose the **Dashboard** tab.
3. Under **Compliance summary**, you should see:
   - **Compliant: 6**
   > This verifies that all Windows and Linux instances are compliant.

### 4.2 Compliance Reporting

1. Choose the **Compliance reporting** tab.
2. This tab provides an overview of all running instances with SSM.
3. Verify that the **Compliance status** of all Linux and Windows instances is **Compliant**.
   > All six instances (three Linux and three Windows) should show as compliant.

### 4.3 Node Patching Details

1. Scroll to the right in the **Node patching details** panel to find for each instance:
   - Critical noncompliant count
   - Security noncompliant count
   - Other noncompliant count
   - Last operation date
   - Baseline ID

2. Choose the **Node ID** for one of the Windows nodes.
3. In the **Node ID** page that opens, choose the **Patch** tab.
4. Scroll down and observe:
   - What patches were applied to this instance
   - The **Installed Time** for each patch

---

## Summary of Patch Groups

| Instance Type | Tag Key | Tag Value | Patch Baseline |
|---------------|---------|-----------|----------------|
| Linux-1, Linux-2, Linux-3 | `Patch Group` | `LinuxProd` | `AWS-AmazonLinux2DefaultPatchBaseline` (Default) |
| Windows-1, Windows-2, Windows-3 | `Patch Group` | `WindowsProd` | `WindowsServerSecurityUpdates` (Custom) |

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Patch Manager** | A capability of AWS Systems Manager that automates the process of patching managed instances with both security-related updates and other types of updates. |
| **Patch Baseline** | A set of rules that defines which patches are approved for installation on your instances. AWS provides default baselines; you can also create custom baselines. |
| **Patch Group** | A way to organize instances for patching by using tags. You can define which patch baseline applies to which patch group. |
| **Run Command** | A Systems Manager feature that lets you remotely and securely manage the configuration of your managed instances. |
| **SSM Document** | Defines the actions that Systems Manager performs on your managed instances. Patch Manager uses the `AWS-RunPatchBaseline` document. |
| **Compliance Reporting** | Provides visibility into the patch compliance status of your managed instances. |

---

## Conclusion

Congratulations! You have successfully completed the following:

- [x] Patched Linux instances using the default baseline
- [x] Created a custom patch baseline for Windows security updates
- [x] Used patch groups to patch Windows instances using the custom patch baseline
- [x] Verified patch compliance across all managed instances

---

## Additional Resources

- [AWS Systems Manager Patch Manager Documentation](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-patch.html)
- [Working with Patch Baselines](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-baselines.html)
- [Working with Patch Groups](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-patch-patchgroups.html)
- [AWS Systems Manager Compliance](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-compliance.html)

---

*Lab complete.*
