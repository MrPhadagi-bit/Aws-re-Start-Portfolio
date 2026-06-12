# Introduction to AWS Identity and Access Management (IAM)

> **Lab Level:** Beginner  
> **Duration:** ~60 minutes  
> **Services:** AWS IAM, Amazon EC2, Amazon S3

---

##  Objectives

After completing this lab, you should be able to:

- [x] Create and apply an IAM password policy
- [x] Explore pre-created IAM users and user groups
- [x] Inspect IAM policies as applied to the pre-created user groups
- [x] Add users to user groups with specific capabilities active
- [x] Locate and use the IAM sign-in URL
- [x] Experiment with the effects of policies on service access

---

##  Lab Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         AWS Account                                  │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                     IAM Password Policy                      │   │
│  │  • Minimum 10 characters                                     │   │
│  │  • Require uppercase, lowercase, numbers, symbols           │   │
│  │  • Password expiration: 90 days                              │   │
│  │  • Prevent reuse: 5 passwords                                │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                      IAM Users (3)                             │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │   │
│  │  │  user-1  │  │  user-2  │  │  user-3  │                   │   │
│  │  │ (S3)     │  │ (EC2)    │  │ (Admin)  │                   │   │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘                   │   │
│  └───────┼─────────────┼─────────────┼───────────────────────────┘   │
│          │             │             │                              │
│  ┌───────┴─────────────┴─────────────┴───────────────────────────┐   │
│  │                     IAM User Groups (3)                        │   │
│  │                                                                │   │
│  │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐  │   │
│  │  │  S3-Support     │ │  EC2-Support    │ │   EC2-Admin     │  │   │
│  │  │  ┌───────────┐  │ │  ┌───────────┐  │ │  ┌───────────┐  │  │   │
│  │  │  │ user-1    │  │ │  │ user-2    │  │ │  │ user-3    │  │  │   │
│  │  │  └───────────┘  │ │  └───────────┘  │ │  └───────────┘  │  │   │
│  │  │                 │ │                 │ │                 │  │   │
│  │  │ Policy:         │ │ Policy:         │ │ Policy:         │  │   │
│  │  │ AmazonS3        │ │ AmazonEC2       │ │ EC2-Admin-Policy│  │   │
│  │  │ ReadOnlyAccess  │ │ ReadOnlyAccess  │ │ (Inline)        │  │   │
│  │  │                 │ │                 │ │                 │  │   │
│  │  │ Actions:        │ │ Actions:        │ │ Actions:        │  │   │
│  │  │ • s3:Get*       │ │ • ec2:Describe* │ │ • ec2:Describe* │  │   │
│  │  │ • s3:List*      │ │ • ec2:List*     │ │ • ec2:Start*    │  │   │
│  │  │                 │ │                 │ │ • ec2:Stop*     │  │   │
│  │  └─────────────────┘ └─────────────────┘ └─────────────────┘  │   │
│  └───────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    AWS Resources                             │   │
│  │  ┌─────────────┐  ┌─────────────────────────────────────┐  │   │
│  │  │  Amazon S3  │  │            Amazon EC2               │  │   │
│  │  │  ┌───────┐  │  │  ┌─────────────────────────────┐   │  │   │
│  │  │  │Buckets│  │  │  │      EC2 Instance           │   │  │   │
│  │  │  │  •    │  │  │  │  ┌───────────────────────┐   │   │  │   │
│  │  │  │  •    │  │  │  │  │ user-1: No Access     │   │   │  │   │
│  │  │  │  •    │  │  │  │  │ user-2: Read Only     │   │   │  │   │
│  │  │  └───────┘  │  │  │  │ user-3: Full Control  │   │   │  │   │
│  │  │             │  │  │  └───────────────────────┘   │   │  │   │
│  │  └─────────────┘  │  └─────────────────────────────┘   │  │   │
│  │                   └─────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

##  Business Scenario

Your company is expanding its AWS infrastructure and has hired three new staff members with different responsibilities:

| User | Role | Required Access |
|------|------|-----------------|
| **user-1** | S3 Support Staff | Read-only access to Amazon S3 |
| **user-2** | EC2 Support Staff | Read-only access to Amazon EC2 |
| **user-3** | EC2 Administrator | View, start, and stop EC2 instances |

---

##  IAM Concepts

### What is IAM?
AWS Identity and Access Management (IAM) is a web service that helps you securely control access to AWS resources. You use IAM to control who is authenticated (signed in) and authorized (has permissions) to use resources.

### Key IAM Components

| Component | Description |
|-----------|-------------|
| **Users** | End users who log into the console or interact with AWS programmatically |
| **Groups** | Collections of users that share the same permissions |
| **Roles** | AWS identities with permission policies that can be assumed by anyone who needs them |
| **Policies** | JSON documents that define permissions (what actions are allowed/denied on which resources) |

### Policy Types

| Type | Description | Use Case |
|------|-------------|----------|
| **AWS Managed Policies** | Pre-built policies created and maintained by AWS | Common use cases (e.g., `AmazonS3ReadOnlyAccess`) |
| **Customer Managed Policies** | Custom policies created by your administrators | Organization-specific requirements |
| **Inline Policies** | Policies embedded directly into a single user, group, or role | One-off situations, strict one-to-one relationships |

### Policy Structure (JSON)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",           // Allow or Deny
      "Action": "s3:GetObject",    // Specific API call
      "Resource": "arn:aws:s3:::bucket-name/*"  // Scope of resources
    }
  ]
}
```

---

##  Lab Tasks

### Task 1: Create an Account Password Policy

> **Objective:** Strengthen password requirements at the AWS account level for all IAM users.

**Why this matters:** Weak passwords are a primary attack vector. Enforcing strong password policies is a fundamental security control.

#### Steps:

1. **Note your AWS Region** (e.g., Oregon) shown in the upper-right corner of the console.

2. **Navigate to IAM:**
   - In the AWS Management Console search box, enter **IAM** and select it.

3. **Access Account Settings:**
   - In the left navigation pane, choose **Account settings**.
   - Observe the default password policy currently in effect.

4. **Update Password Policy:**
   - Choose **Change password policy**.
   - Configure the following options:

   | Setting | Value | Rationale |
   |---------|-------|-----------|
   | **Minimum password length** | `10` | Increases brute-force resistance |
   | **Require uppercase** |  | Increases character space |
   | **Require lowercase** |  | Increases character space |
   | **Require numbers** |  | Increases character space |
   | **Require symbols** |  | Significantly increases entropy |
   | **Password expiration** | `90` days | Limits exposure window |
   | **Password expiration requires admin reset** |  | Users can self-service |
   | **Prevent password reuse** | `5` passwords | Prevents password cycling |

5. **Save Changes:**
   - Choose **Save changes**.

>  **Result:** The policy applies account-wide to all IAM users immediately.

---

### Task 2: Explore Users and User Groups

> **Objective:** Understand the pre-created IAM entities and their current configurations.

#### 2.1 Explore IAM Users

1. **Navigate to Users:**
   - In the left navigation pane, choose **Users**.
   - You will see three pre-created users: `user-1`, `user-2`, `user-3`.

2. **Inspect user-1:**
   - Choose **user-1** → **Summary** page opens.
   - **Permissions tab:** No permissions attached.
   - **Groups tab:** Not a member of any group.
   - **Security credentials tab:** Console password assigned.

>  **Key Insight:** A user without permissions or group membership has **zero access** to AWS resources.

#### 2.2 Explore User Groups

| Group | Attached Policy | Policy Type | Permissions |
|-------|----------------|-------------|-------------|
| **EC2-Support** | `AmazonEC2ReadOnlyAccess` | AWS Managed | `ec2:Describe*`, `ec2:List*` — View EC2, ELB, CloudWatch, Auto Scaling resources |
| **S3-Support** | `AmazonS3ReadOnlyAccess` | AWS Managed | `s3:Get*`, `s3:List*` — Get and list S3 resources |
| **EC2-Admin** | `EC2-Admin-Policy` | **Inline (Customer)** | `ec2:Describe*`, `ec2:Start*`, `ec2:Stop*` — View, start, and stop EC2 instances |

**Inspecting Policies:**

```
For each group:
  → Choose the group
  → Choose the Permissions tab
  → Select the  (plus sign) next to the policy name
  → Review the JSON policy document
```

>  **Key Insight:** Managed policies are centrally maintained — when AWS updates them, all attached entities automatically receive the update. Inline policies are tightly coupled to a single entity.

---

### Task 3: Add Users to User Groups

> **Objective:** Assign users to groups to inherit permissions based on their job functions.

>  **Note:** Ignore any "not authorized" errors — these are caused by lab account restrictions and won't impact completion.

#### 3.1 Add user-1 to S3-Support Group

```
Navigation: IAM → User groups → S3-Support → Users tab → Add users
```

| Step | Action |
|------|--------|
| 1 | Choose **S3-Support** group |
| 2 | Choose the **Users** tab |
| 3 | Choose **Add users** |
| 4 | Select checkbox for **user-1** |
| 5 | Choose **Add users** |
| 6 | Verify user-1 appears in the Users tab |

**Result:** `user-1` now inherits `AmazonS3ReadOnlyAccess` permissions.

#### 3.2 Add user-2 to EC2-Support Group

Repeat the steps above, selecting **EC2-Support** group and **user-2**.

**Result:** `user-2` now inherits `AmazonEC2ReadOnlyAccess` permissions.

#### 3.3 Add user-3 to EC2-Admin Group

Repeat the steps above, selecting **EC2-Admin** group and **user-3**.

**Result:** `user-3` now inherits `EC2-Admin-Policy` permissions.

#### Verification

Navigate to **User groups** and confirm each group shows **1** in the Users column:

```
┌────────────────┬──────────────────────────────────┬────────┐
│ Group Name     │ Attached Policy                  │ Users  │
├────────────────┼──────────────────────────────────┼────────┤
│ EC2-Admin      │ EC2-Admin-Policy (Inline)        │   1    │
│ EC2-Support    │ AmazonEC2ReadOnlyAccess          │   1    │
│ S3-Support     │ AmazonS3ReadOnlyAccess           │   1    │
└────────────────┴──────────────────────────────────┴────────┘
```

---

### Task 4: Sign In and Test User Permissions

> **Objective:** Validate that permissions are correctly applied by testing each user's access.

#### 4.1 Get the IAM Sign-In URL

1. In the IAM left navigation pane, choose **Dashboard**.
2. In the **AWS Account** section, locate the **Sign-in URL for IAM users**.
3. Copy this URL (format: `https://<account-id>.signin.aws.amazon.com/console`).

>  **This URL is the entry point for all IAM users in this account.**

#### 4.2 Test user-1 (S3 Support)

**Sign In:**
```
URL:     <IAM Sign-in URL>
Username: user-1
Password: Lab-Password1
```

**Test S3 Access:**
1. From Services menu, choose **S3**.
2. Choose a bucket name and browse contents.
3.  **Expected:** Successfully view bucket list and contents.

**Test EC2 Access:**
1. From Services menu, choose **EC2**.
2. In left navigation, choose **Instances**.
3.  **Expected:** "You are not authorized to perform this operation."

**Sign Out:** Click `user-1` (top-right) → **Sign out**.

---

#### 4.3 Test user-2 (EC2 Support)

**Sign In:**
```
URL:     <IAM Sign-in URL>
Username: user-2
Password: Lab-Password2
```

**Test EC2 Read Access:**
1. From Services menu, choose **EC2**.
2. In left navigation, choose **Instances**.
3.  **Expected:** EC2 instance is visible (read-only access working).

**Test EC2 Write Access:**
1. Select the EC2 instance.
2. From **Instance state** dropdown, choose **Stop instance**.
3. In the confirmation window, choose **Stop**.
4.  **Expected:** "Failed to stop the instance. You are not authorized..."
5. Choose **Cancel**.

**Test S3 Access:**
1. From Services menu, choose **S3**.
2.  **Expected:** "You don't have permissions to list buckets."

**Sign Out:** Click `user-2` (top-right) → **Sign out**.

---

#### 4.4 Test user-3 (EC2 Admin)

**Sign In:**
```
URL:     <IAM Sign-in URL>
Username: user-3
Password: Lab-Password3
```

**Test EC2 Admin Access:**
1. From Services menu, choose **EC2**.
2. In left navigation, choose **Instances**.
3. Select the EC2 instance.
4. From **Instance state** dropdown, choose **Stop instance**.
5. In the confirmation window, choose **Stop**.
6.  **Expected:** Instance enters **Stopping** state and shuts down successfully.

**Sign Out:** Click `user-3` (top-right) → **Sign out**.

---

##  Expected Results Summary

```
┌─────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│  User   │  S3 Buckets  │  EC2 View    │  EC2 Stop    │  EC2 Start   │
├─────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│ user-1  │     ✅       │     ❌       │     ❌       │     ❌       │
│ user-2  │     ❌       │     ✅       │     ❌       │     ❌       │
│ user-3  │     ❌       │     ✅       │     ✅       │     ✅       │
└─────────┴──────────────┴──────────────┴──────────────┴──────────────┘
```

---

##  Key Takeaways

### Principle of Least Privilege
Each user has access **only** to the resources and actions required for their specific role. This minimizes the attack surface and limits potential damage from compromised credentials.

### Group-Based Permission Management
- **Efficiency:** Assign permissions once to a group, not individually to each user.
- **Scalability:** New hires simply join the appropriate group.
- **Maintainability:** Update group permissions once, affect all members immediately.

### Policy Types Matter
| Type | Scope | Maintenance |
|------|-------|-------------|
| AWS Managed | Broad, reusable | AWS maintains |
| Customer Managed | Custom, reusable | You maintain |
| Inline | Single entity only | Manual per entity |

### Password Policy as Foundation
Strong password policies are your first line of defense. They apply globally and immediately to all IAM users.

---

##  Lab Cleanup

This lab uses pre-created resources that do not require cleanup. In a production environment, you would:

1. Remove users from groups if no longer needed.
2. Delete inline policies if they are no longer required.
3. Monitor CloudTrail logs for access patterns.

---

##  Additional Resources

- [AWS IAM Documentation](https://docs.aws.amazon.com/iam/)
- [IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [AWS Managed Policies Reference](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/)
- [IAM Policy Simulator](https://policysim.aws.amazon.com/)
- [AWS Security Blog - IAM](https://aws.amazon.com/blogs/security/tag/iam/)

---

##  Conclusion

Congratulations! You have successfully:

-  Created and applied a custom IAM password policy
-  Explored pre-created IAM users and user groups
-  Inspected IAM policies (managed vs. inline)
-  Added users to groups with specific capabilities
-  Located and used the IAM sign-in URL
-  Experimented with policy effects on service access

You now understand the fundamentals of AWS IAM and can apply these principles to secure your own AWS environments.

---

*Lab complete 🎉*
