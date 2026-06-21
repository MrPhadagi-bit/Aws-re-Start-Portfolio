# Challenge Lab: Build Your DB Server and Interact With Your DB

> **Lab Duration:** ~45 minutes  
> **Objective:** Reinforce the concept of leveraging an AWS-managed database instance for solving relational database needs using Amazon Relational Database Service (Amazon RDS).

---

## Overview

Amazon Relational Database Service (Amazon RDS) makes it easy to set up, operate, and scale a relational database in the cloud. It provides cost-efficient and resizable capacity while managing time-consuming database administration tasks, which allows you to focus on your applications and business.

Amazon RDS provides you with six familiar database engines to choose from:
- Amazon Aurora
- Oracle
- Microsoft SQL Server
- PostgreSQL
- MySQL
- MariaDB

After completing this lab, you will be able to:
- Create an RDS instance
- Use the Amazon RDS Query Editor to query data
- Connect to an RDS instance from an EC2 Linux server using a MySQL client
- Create tables, insert data, and perform SQL joins

---

## Part 1: Launch an Amazon RDS DB Instance

### Step 1.1: Navigate to RDS Console
1. Sign in to the **AWS Management Console**.
2. In the search bar, type **RDS** and select **Amazon RDS** from the services list.
3. Click **Create database**.

### Step 1.2: Configure Database Settings

Choose the following options carefully to meet lab requirements:

| Setting | Required Value | Notes |
|---------|---------------|-------|
| **Choose a database creation method** | `Standard create` | |
| **Engine options** | `MySQL` (or `Amazon Aurora` → `Amazon Aurora Provisioned`) | Amazon Aurora Serverless is **NOT** available for this lab |
| **Template** | `Dev/Test` or `Free tier` | |
| **DB instance identifier** | e.g., `rds-lab-db` | Make a note of this |
| **Master username** | e.g., `admin` | Make a note of this |
| **Master password** | e.g., `MyStrongPassword123!` | Make a note of this |

### Step 1.3: Configure Instance & Storage

| Setting | Required Value |
|---------|---------------|
| **DB instance class** | `Burstable classes` → `db.t3.micro` (or db.t3.small / db.t3.medium) |
| **Storage type** | `General Purpose SSD (gp2)` |
| **Allocated storage** | Up to **100 GB** (e.g., 20 GB) |
| **Enable storage autoscaling** | Unchecked (recommended) |

> **Important:** Ensure you select **Burstable classes** and a `db.t*` instance type. Avoid Provisioned IOPS.

### Step 1.4: Configure Connectivity

| Setting | Required Value |
|---------|---------------|
| **Virtual Private Cloud (VPC)** | Select the **Lab VPC** |
| **Public access** | `No` (recommended for security) |
| **VPC security group (firewall)** | Select the security group that allows the **LinuxServer** to connect |
| **Availability Zone** | Use default or select as needed |

> **Security Group Rule:** Ensure the RDS security group has an **Inbound rule** allowing:
> - **Type:** MySQL/Aurora
> - **Port:** 3306
> - **Source:** The Security Group ID of your **LinuxServer** (or its private IP/subnet)

### Step 1.5: Additional Configuration

| Setting | Required Value |
|---------|---------------|
| **Initial database name** | e.g., `labdb` |
| **Enhanced monitoring** | **Disabled** (for MySQL engine) |
| **Enable automated backups** | Unchecked (optional) |
| **Enable deletion protection** | Unchecked (optional) |

### Step 1.6: Create the Database
1. Review all settings.
2. Click **Create database**.
3. Wait for the database status to change to **Available** (this may take 5–10 minutes).

> **Screenshot Required:** Capture a screenshot of the RDS console showing your database in "Available" status with the endpoint visible.

---

## Part 2: Connect to the Linux Server

### Step 2.1: Retrieve Connection Details
1. In the lab environment, click **Details** → **Show**.
2. Make a note of the **LinuxServer** public IP address or DNS name.
3. Click **Download PEM** (for Linux/macOS) or **Download PPK** (for Windows) to get your SSH key.

### Step 2.2: SSH into the Linux Server

**For Linux / macOS:**
```bash
chmod 400 your-key.pem
ssh -i your-key.pem ec2-user@<LinuxServer-IP-or-DNS>
```

**For Windows (PuTTY):**
1. Open PuTTY.
2. In **Host Name**, enter: `ec2-user@<LinuxServer-IP-or-DNS>`
3. In **Connection → SSH → Auth → Private key file**, browse to your `.ppk` file.
4. Click **Open**.

> **Screenshot Required:** Capture a screenshot showing a successful SSH connection to the LinuxServer.

---

## Part 3: Install MySQL Client and Connect to RDS

### Step 3.1: Install the MySQL Client

Once connected to the LinuxServer via SSH, run:

```bash
# For Amazon Linux 2 / Amazon Linux 2023
sudo yum update -y
sudo yum install -y mariadb105

# OR for older Amazon Linux
sudo yum install -y mysql

# For Ubuntu/Debian based instances
sudo apt-get update
sudo apt-get install -y mysql-client
```

Verify installation:
```bash
mysql --version
```

### Step 3.2: Connect to Your RDS Database

Use the endpoint, username, and password you noted earlier:

```bash
mysql -h <RDS-ENDPOINT> -P 3306 -u <MASTER-USERNAME> -p
```

Example:
```bash
mysql -h rds-lab-db.abc123xyz.us-east-1.rds.amazonaws.com -P 3306 -u admin -p
```

When prompted, enter your master password. You should see the MySQL welcome banner and prompt:

```
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MySQL connection id is 123
Server version: 8.0.33 Source distribution

mysql>
```

> **Screenshot Required:** Capture a screenshot showing a successful MySQL connection from the LinuxServer.

---

## Part 4: Create and Populate the RESTART Table

### Step 4.1: Select Your Database

```sql
USE labdb;
```

### Step 4.2: Create the RESTART Table

```sql
CREATE TABLE RESTART (
    Student_ID INT PRIMARY KEY,
    Student_Name VARCHAR(100),
    Restart_City VARCHAR(100),
    Graduation_Date DATETIME
);
```

> **Screenshot Required:** Capture a screenshot showing the successful `CREATE TABLE` command execution.

### Step 4.3: Insert 10 Sample Rows

```sql
INSERT INTO RESTART (Student_ID, Student_Name, Restart_City, Graduation_Date) VALUES
(1, 'Alice Johnson', 'New York', '2025-05-15 10:00:00'),
(2, 'Bob Smith', 'Los Angeles', '2025-05-16 14:30:00'),
(3, 'Carol White', 'Chicago', '2025-05-17 09:00:00'),
(4, 'David Brown', 'Houston', '2025-05-18 11:00:00'),
(5, 'Eva Green', 'Phoenix', '2025-05-19 13:00:00'),
(6, 'Frank Black', 'Philadelphia', '2025-05-20 15:00:00'),
(7, 'Grace Lee', 'San Antonio', '2025-05-21 10:30:00'),
(8, 'Henry Wilson', 'San Diego', '2025-05-22 12:00:00'),
(9, 'Ivy Martinez', 'Dallas', '2025-05-23 14:00:00'),
(10, 'Jack Taylor', 'San Jose', '2025-05-24 16:00:00');
```

> **Screenshot Required:** Capture a screenshot showing the successful insertion of 10 rows.

### Step 4.4: Select All Rows from RESTART

```sql
SELECT * FROM RESTART;
```

> **Screenshot Required:** Capture a screenshot showing the full `RESTART` table data.

---

## Part 5: Create and Populate the CLOUD_PRACTITIONER Table

### Step 5.1: Create the CLOUD_PRACTITIONER Table

```sql
CREATE TABLE CLOUD_PRACTITIONER (
    Student_ID INT PRIMARY KEY,
    Certification_Date DATETIME
);
```

> **Screenshot Required:** Capture a screenshot showing the successful `CREATE TABLE` command execution.

### Step 5.2: Insert 5 Sample Rows

```sql
INSERT INTO CLOUD_PRACTITIONER (Student_ID, Certification_Date) VALUES
(1, '2025-06-01 10:00:00'),
(2, '2025-06-02 11:00:00'),
(3, '2025-06-03 12:00:00'),
(4, '2025-06-04 13:00:00'),
(5, '2025-06-05 14:00:00');
```

> **Screenshot Required:** Capture a screenshot showing the successful insertion of 5 rows.

### Step 5.3: Select All Rows from CLOUD_PRACTITIONER

```sql
SELECT * FROM CLOUD_PRACTITIONER;
```

> **Screenshot Required:** Capture a screenshot showing the full `CLOUD_PRACTITIONER` table data.

---

## Part 6: Perform an Inner Join

### Step 6.1: Join the Two Tables

Execute the following query to display the student ID, student name, and certification date:

```sql
SELECT 
    R.Student_ID,
    R.Student_Name,
    C.Certification_Date
FROM RESTART R
INNER JOIN CLOUD_PRACTITIONER C
ON R.Student_ID = C.Student_ID;
```

**Expected Output:**

```
+------------+---------------+---------------------+
| Student_ID | Student_Name  | Certification_Date  |
+------------+---------------+---------------------+
|          1 | Alice Johnson | 2025-06-01 10:00:00 |
|          2 | Bob Smith     | 2025-06-02 11:00:00 |
|          3 | Carol White   | 2025-06-03 12:00:00 |
|          4 | David Brown   | 2025-06-04 13:00:00 |
|          5 | Eva Green     | 2025-06-05 14:00:00 |
+------------+---------------+---------------------+
5 rows in set (0.00 sec)
```

> **Screenshot Required:** Capture a screenshot showing the result of the INNER JOIN query.

---

## Part 7: Lab Complete & Cleanup

### Step 7.1: Exit MySQL
```sql
EXIT;
```

### Step 7.2: Exit the Linux Server
```bash
exit
```

### Step 7.3: (Optional) Delete the RDS Instance
1. Navigate to the **RDS Console**.
2. Select your database instance.
3. Click **Actions** → **Delete**.
4. Confirm deletion (uncheck **Create final snapshot** if not needed).

---

## Summary of Required Screenshots

| # | Screenshot Description |
|---|------------------------|
| 1 | RDS console showing database in "Available" status with endpoint |
| 2 | Successful SSH connection to LinuxServer |
| 3 | Successful MySQL client connection from LinuxServer to RDS |
| 4 | `CREATE TABLE RESTART` command execution |
| 5 | 10 rows inserted into `RESTART` table |
| 6 | `SELECT * FROM RESTART` output |
| 7 | `CREATE TABLE CLOUD_PRACTITIONER` command execution |
| 8 | 5 rows inserted into `CLOUD_PRACTITIONER` table |
| 9 | `SELECT * FROM CLOUD_PRACTITIONER` output |
| 10 | INNER JOIN query result showing Student_ID, Student_Name, Certification_Date |

---

## Troubleshooting Tips

| Issue | Solution |
|-------|----------|
| Cannot connect to RDS from LinuxServer | Verify the RDS security group allows inbound MySQL (3306) from the LinuxServer's security group or private IP |
| `mysql` command not found | Ensure the MySQL/MariaDB client is installed: `sudo yum install -y mariadb105` |
| Access denied for user | Double-check the master username and password. Ensure you're connecting to the correct endpoint |
| Database creation fails | Verify instance type is `db.t3.micro` (or db.t3.small/medium), storage is gp2, and region is correct |
| SSH connection refused | Ensure the LinuxServer's security group allows inbound SSH (port 22) from your IP |

---

## Additional Resources

- [Amazon RDS Documentation](https://docs.aws.amazon.com/rds/)
- [Connecting to a DB Instance Running MySQL](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_MySQL.html)
- [AWS RDS Security Groups](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.RDSSecurityGroups.html)

---

*Lab Version: 2026.06 | Created for AWS Cloud Practitioner Challenge Lab*
