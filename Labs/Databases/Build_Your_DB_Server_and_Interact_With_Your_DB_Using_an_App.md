# Build Your DB Server and Interact With Your DB Using an App

## Lab Overview

| Attribute | Details |
|-----------|---------|
| **Duration** | Approximately 45 minutes |
| **Difficulty** | Intermediate |
| **Services Used** | Amazon RDS, Amazon VPC, Amazon EC2, Security Groups |
| **Prerequisites** | AWS Management Console access, Lab VPC with Web Security Group, Web Server EC2 instance running |

---

## Objectives

After completing this lab, you will be able to:

1. **Launch an Amazon RDS DB instance** with high availability (Multi-AZ deployment).
2. **Configure the DB instance** to permit secure connections from your web server.
3. **Open a web application** and interact with your database through a user-friendly interface.

---

## Architecture Overview

### Starting Infrastructure

You begin with a pre-configured infrastructure that includes:

- **Lab VPC** with public and private subnets across two Availability Zones
- **Web Server EC2 instance** running in a public subnet, associated with a **Web Security Group**
- **Network infrastructure** (Internet Gateway, route tables) already configured

> ![architecture-lab1.png](architecture-lab1.png)
> *Figure 1: Initial lab architecture with web server only.*

### Final Infrastructure

Upon completion, your architecture will include:

- **Amazon RDS MySQL Multi-AZ DB instance** deployed in private subnets
- **DB Security Group** allowing inbound MySQL traffic (port 3306) from the Web Security Group
- **DB Subnet Group** spanning two Availability Zones for high availability
- **Web application** connected to and persisting data in the RDS database

> ![architecture-lab2.png](architecture-lab2.png)
> *Figure 2: Final lab architecture with highly available RDS database connected to the web server.*

---

## Lab Tasks

### Task 1: Create a Security Group for the RDS DB Instance

**Objective:** Create a security group that allows your web server to access the RDS DB instance on port 3306.

> **Why this matters:** Security groups act as virtual firewalls. By restricting database access to only instances associated with the Web Security Group, you follow the principle of least privilege and prevent unauthorized access to your database.

#### Step-by-Step Instructions

1. In the **AWS Management Console**, click the **search bar** at the top of the page.
2. Type `VPC` and select **VPC** from the search results to open the VPC Dashboard.
3. In the **left navigation pane**, click **Security groups**.
4. Click the **Create security group** button.
5. Configure the security group with the following settings:

| Setting | Value |
|---------|-------|
| **Security group name** | `DB Security Group` |
| **Description** | `Permit access from Web Security Group` |
| **VPC** | `Lab VPC` (select from dropdown) |

6. In the **Inbound rules** section, click **Add rule** and configure:

| Setting | Value |
|---------|-------|
| **Type** | `MySQL/Aurora` (automatically sets port 3306) |
| **Source type** | `Custom` |
| **Source** | Type `sg` in the search field, then select `Web Security Group` |

> **Understanding the Rule:** This configures the DB Security Group to permit inbound traffic on port 3306 **only** from EC2 instances that are associated with the Web Security Group. This is a secure, reference-based approach—you don't need to know specific IP addresses.

7. Scroll to the bottom of the page and click **Create security group**.

> **Verification:** You should see a success message, and the `DB Security Group` will appear in your security groups list.

---

### Task 2: Create a DB Subnet Group

**Objective:** Create a DB subnet group that tells RDS which subnets can be used for the database. Each DB subnet group requires subnets in at least two Availability Zones to support Multi-AZ deployments.

> **Why this matters:** RDS requires a DB Subnet Group to know which subnets are valid for database placement. By selecting private subnets in two different AZs, you ensure the standby replica can be placed in a separate AZ for high availability.

#### Step-by-Step Instructions

1. In the **AWS Management Console**, click the **search bar**.
2. Type `RDS` and select **Aurora and RDS** to open the RDS Dashboard.
3. In the **left navigation pane**, click **Subnet groups**.
   > *Tip:* If the navigation pane is not visible, click the **☰ menu icon** in the top-left corner.
4. Click **Create DB Subnet Group**.
5. Configure the subnet group with the following settings:

| Setting | Value |
|---------|-------|
| **Name** | `DB Subnet Group` |
| **Description** | `DB Subnet Group` |
| **VPC** | `Lab VPC` (select from dropdown) |

6. In the **Add subnets** section:
   - For **Availability Zones**, select the **first** and **second** AZs from the dropdown.
   - For **Subnets**, select the following:
     - `10.0.1.0/24` (Private Subnet 1)
     - `10.0.3.0/24` (Private Subnet 2)

> **Understanding the Subnets:** You are selecting private subnets (`10.0.1.0/24` and `10.0.3.0/24`) because databases should not be publicly accessible. Each subnet is in a different Availability Zone, which is a requirement for Multi-AZ deployments.

7. Click **Create**.

> **Verification:** The `DB Subnet Group` will appear in your subnet groups list with two subnets listed.

---

### Task 3: Create an Amazon RDS DB Instance

**Objective:** Configure and launch a Multi-AZ Amazon RDS for MySQL database instance.

> **Why this matters:** Amazon RDS Multi-AZ deployments provide enhanced availability and durability for production database workloads. RDS automatically creates a primary DB instance and synchronously replicates data to a standby instance in a different Availability Zone (AZ). If an AZ failure occurs, RDS automatically fails over to the standby without manual intervention.

#### Step-by-Step Instructions

1. In the **RDS Dashboard**, click **Databases** in the left navigation pane.
2. Click the **dropdown arrow** on the **Create database** button and select **Standard create** (or **Full configuration** depending on console version).
3. Under **Engine options**, configure:

| Setting | Value |
|---------|-------|
| **Engine type** | `MySQL` |
| **Engine version** | Leave at default (latest stable version) |

4. Under **Templates**, select:

| Setting | Value |
|---------|-------|
| **Templates** | `Dev/Test` |

5. Under **Availability and durability**, select:

| Setting | Value |
|---------|-------|
| **Deployment option** | `Multi-AZ DB instance` (2 instances) |

> **Note:** This creates a primary instance and a synchronous standby replica in a different AZ.

6. Under **Settings**, configure:

| Setting | Value |
|---------|-------|
| **DB instance identifier** | `lab-db` |
| **Master username** | `main` |

7. Under **Credential Settings**, configure:

| Setting | Value |
|---------|-------|
| **Credentials management** | `Self managed` |
| **Auto generate a password** | ☐ *Uncheck* (if checked) |
| **Master password** | `lab-password` |
| **Confirm master password** | `lab-password` |
| **Password authentication** | ☑ *Ensure this is selected* |

8. Under **Instance configuration**, configure:

| Setting | Value |
|---------|-------|
| **DB instance class** | `Burstable classes (includes t classes)` → `db.t3.medium` |

9. Under **Storage**, configure:

| Setting | Value |
|---------|-------|
| **Storage type** | `General Purpose SSD (gp3)` |
| **Allocated storage** | `20` GB |

10. Under **Connectivity**, configure:

| Setting | Value |
|---------|-------|
| **Compute resource** | `Don't connect to an EC2 compute resource` |
| **Virtual Private Cloud (VPC)** | `Lab VPC` |
| **DB subnet group** | `DB Subnet Group` |
| **Public access** | `No` |
| **VPC security group (firewall)** | `Choose existing` |
| **Existing VPC security groups** | Remove `default` (click the ❌), then select `DB Security Group` |

> **Why No Public Access?** The database should only be accessible from within the VPC (specifically from the web server). This is a critical security best practice.

11. Under **Monitoring**, uncheck:
   - ☐ **Enable Enhanced monitoring**

12. Under **Performance Insights**, uncheck:
   - ☐ **Enable Performance Insights**

13. Expand the **Additional configuration** section and configure:

| Setting | Value |
|---------|-------|
| **Initial database name** | `lab` |

14. Under **Backup**, uncheck:
   - ☐ **Enable automated backups**

> **⚠️ Important Note:** Disabling automated backups is **not recommended for production environments**. We disable it here only to make the database deploy faster for this lab. In real-world scenarios, always enable automated backups with an appropriate retention period.

15. Scroll to the bottom of the page and click **Create database**.

#### Wait for Database Creation

1. Your database will now launch. Click on **`lab-db`** (the link itself) to view its details.
2. You will need to wait approximately **4 minutes** for the database to become available.
   - The deployment process is creating a database in **two different Availability Zones**.
   - If prompted with a **Suggested add-ons** window, choose **Close**.
3. Wait until the **Status** changes to **Modifying** or **Available**.

#### Retrieve the Database Endpoint

1. Click on **`lab-db`** to view its details.
2. Scroll down to the **Connectivity & security** tab.
3. Copy the **Endpoint** field. It will look similar to:
   ```
   lab-db.cggq8lhnxvnv.us-west-2.rds.amazonaws.com
   ```
   > *Alternatively, you can choose **View connection details** at the top of the page to see the endpoint.*
4. **Paste the Endpoint value into a text editor.** You will use it in the next task.

> **Understanding the Endpoint:** This DNS name always resolves to the current primary instance. During a failover, RDS automatically updates this DNS to point to the standby, ensuring your application can reconnect without configuration changes.

---

### Task 4: Interact With Your Database

**Objective:** Open the web application running on your web server and configure it to connect to your newly created RDS database.

#### Step-by-Step Instructions

1. **Retrieve the Web Server IP Address:**
   - Locate the **WebServer IP address** in the **AWS Details** panel above these instructions.
   - Copy this IP address to your clipboard.

2. **Open the Web Application:**
   - Open a **new web browser tab**.
   - Paste the **WebServer IP address** into the address bar and press **Enter**.
   - The web application will display, showing information about the EC2 instance.

3. **Navigate to the RDS Configuration Page:**
   - At the top of the web application page, click the **RDS** link.
   - You will see a configuration form to connect the application to your database.

> ![Web Application Interface](web-app-interface.png)
> *Figure 3: The web application interface showing the RDS configuration form.*

4. **Configure the Database Connection:**

| Setting | Value |
|---------|-------|
| **Endpoint** | Paste the RDS endpoint you copied earlier (e.g., `lab-db.cggq8lhnxvnv.us-west-2.rds.amazonaws.com`) |
| **Database** | `lab` |
| **Username** | `main` |
| **Password** | `lab-password` |

5. Click **Submit**.

6. **Wait for Initialization:**
   - A message will appear explaining that the application is running a command to copy information to the database.
   - After a few seconds, the application will display an **Address Book**.

> **What just happened?** The web application connected to your RDS MySQL database, created the necessary tables, and populated initial data. The Address Book application is now using the RDS database to store information persistently.

7. **Test the Application:**
   - **Add** a new contact to the Address Book.
   - **Edit** an existing contact.
   - **Remove** a contact.
   - Verify that changes persist after refreshing the page.

> **High Availability in Action:** The data you enter is being persisted to the primary database instance and is **automatically replicating synchronously** to the standby instance in the second Availability Zone. If the primary AZ were to fail, RDS would automatically promote the standby to primary, and your data would remain safe and accessible.

---

## Lab Summary

### What You Built

| Component | Purpose |
|-----------|---------|
| **DB Security Group** | Firewall rule allowing MySQL access (port 3306) only from the Web Security Group |
| **DB Subnet Group** | Defines private subnets in two AZs for RDS database placement |
| **RDS Multi-AZ MySQL Instance** | Highly available database with synchronous standby replica |
| **Web Application Connection** | Address Book app reading/writing persistent data to RDS |

### Key Concepts Demonstrated

- **Multi-AZ Deployment:** Automatic synchronous replication across two Availability Zones for high availability.
- **Security Groups:** Reference-based security allowing only authorized resources (web servers) to access the database.
- **Private Subnets:** Database instances placed in private subnets with no public access for security.
- **DB Subnet Groups:** Required RDS configuration defining which subnets are valid for database instances.
- **DNS Endpoint:** A stable endpoint that automatically resolves to the current primary instance, even after failover.

### Best Practices Applied

✅ **Least Privilege Access:** Database security group only allows traffic from the web server security group.  
✅ **Private Subnet Placement:** Database has no public access and resides in private subnets.  
✅ **Multi-AZ for High Availability:** Production-grade availability with automatic failover capability.  
✅ **Encrypted Credentials:** Application connects using authenticated username/password credentials.

---

## Troubleshooting

| Issue | Possible Cause | Solution |
|-------|-------------|----------|
| Database stuck in "Creating" | Normal deployment time | Wait approximately 4 minutes; Multi-AZ deployments take longer |
| Cannot connect to database | Wrong endpoint | Verify you copied the full endpoint from the Connectivity & security tab |
| Web app shows connection error | Security group misconfiguration | Verify DB Security Group allows port 3306 from Web Security Group |
| Subnet group creation fails | Subnets in only one AZ | Ensure you selected subnets from two different Availability Zones |

---

## Cleanup (Post-Lab)

> **Important:** To avoid incurring unexpected charges, delete the following resources after completing the lab:

1. **Delete the RDS DB Instance:**
   - Go to RDS → Databases → Select `lab-db` → Actions → Delete
   - Choose whether to create a final snapshot (not needed for this lab)
   - Type `delete me` to confirm
   - Wait for deletion to complete (~5-10 minutes)

2. **Delete the DB Subnet Group:**
   - Go to RDS → Subnet groups → Select `DB Subnet Group` → Delete

3. **Delete the DB Security Group:**
   - Go to VPC → Security groups → Select `DB Security Group` → Actions → Delete security group

> **Note:** The Web Server and Lab VPC are typically managed by the lab environment and may be cleaned up automatically.

---

## Additional Resources

- [Amazon RDS Documentation](https://docs.aws.amazon.com/rds/)
- [Amazon RDS Multi-AZ Deployments](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html)
- [Working with DB Subnet Groups](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_VPC.WorkingWithRDSInstanceinaVPC.html#USER_VPC.Subnets)
- [Amazon RDS FAQs](https://aws.amazon.com/rds/faqs/)

---

## Lab Complete ✅

You have successfully:
- ✅ Created a secure DB Security Group
- ✅ Configured a DB Subnet Group spanning two Availability Zones
- ✅ Launched a Multi-AZ RDS MySQL instance
- ✅ Connected a web application to your highly available database
- ✅ Verified data persistence and replication across Availability Zones

**Congratulations on completing the lab!**
