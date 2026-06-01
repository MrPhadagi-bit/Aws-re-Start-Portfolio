# Database Table Operations Lab

> **AWS Academy Lab** | SQL Fundamentals | MySQL | ~45 minutes

[![License](https://img.shields.io/badge/License-Educational-blue.svg)](LICENSE)
[![Database](https://img.shields.io/badge/Database-MySQL-orange.svg)](https://www.mysql.com/)
[![AWS](https://img.shields.io/badge/Cloud-AWS-yellow.svg)](https://aws.amazon.com/)

---

## Table of Contents

- [Overview](#overview)
- [Learning Objectives](#learning-objectives)
- [Prerequisites](#prerequisites)
- [Lab Architecture](#lab-architecture)
- [Lab Tasks](#lab-tasks)
  - [Task 1: Connect to the Command Host](#task-1-connect-to-the-command-host)
  - [Task 2: Create a Database and Table](#task-2-create-a-database-and-table)
  - [Task 3: Delete a Database and Tables](#task-3-delete-a-database-and-tables)
- [SQL Commands Reference](#sql-commands-reference)
- [Challenges](#challenges)
- [Troubleshooting](#troubleshooting)
- [Sample Data Attribution](#sample-data-attribution)
- [Cleanup](#cleanup)
- [License](#license)

---

## Overview

This lab provides hands-on practice with fundamental **database and table operations** using MySQL on AWS EC2. You will work through the complete lifecycle of database objects: creating, inspecting, modifying, and deleting databases and tables.

**Scenario:** You are a database operations team member who has been granted access to a pre-configured relational database instance. Your task is to practice creating and dropping (deleting) databases and tables using standard SQL commands.

**Duration:** Approximately **45 minutes**

---

## Learning Objectives

After completing this lab, you will be able to:

| Objective | SQL Statement | Description |
|-----------|---------------|-------------|
| ✅ Create databases and tables | `CREATE` | Build new database objects with defined schemas |
| ✅ View available databases and tables | `SHOW` | Inspect existing database objects and their structures |
| ✅ Modify table structure | `ALTER` | Rename columns or change schema properties |
| ✅ Delete databases and tables | `DROP` | Permanently remove database objects |

---

## Prerequisites

### Provided Resources

The following resources are **pre-provisioned** for you when the lab starts:

- ☁️ **AWS EC2 Instance** (Command Host) with MySQL client installed
- 🔐 **MySQL Database Server** accessible from the Command Host
- 🛡️ **AWS Systems Manager Session Manager** configured for secure access

### Required Knowledge

- Basic Linux terminal commands (`cd`, `sudo`, `ls`)
- Understanding of relational database concepts (tables, columns, rows)
- Familiarity with SQL syntax (helpful but not required)

### Credentials

| Parameter | Value |
|-----------|-------|
| MySQL Username | `root` |
| MySQL Password | `re:St@rt!9` |
| Database Name | `world` (created during lab) |

---

## Lab Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      AWS Cloud                               │
│                                                              │
│  ┌──────────────────────┐      ┌──────────────────────┐   │
│  │   EC2 Command Host   │      │   RDS / MySQL DB      │   │
│  │  (MySQL Client)      │──────│  (Database Server)    │   │
│  │                      │ SSH  │                       │   │
│  │  • Session Manager   │      │  • Pre-installed      │   │
│  │  • Linux Terminal    │      │  • Root access        │   │
│  └──────────────────────┘      └──────────────────────┘   │
│                                                              │
│  Access Method: AWS Systems Manager Session Manager          │
└─────────────────────────────────────────────────────────────┘
```

---

## Lab Tasks

### Task 1: Connect to the Command Host

Establish a secure connection to the EC2 instance and configure the MySQL client environment.

#### Step 1: Access the EC2 Instance

1. Open the **AWS Management Console**
2. Navigate to **Services** → **Compute** → **EC2**
3. In the left sidebar, click **Instances**
4. Locate the instance labeled **"Command Host"**
5. Select the checkbox next to it → Click **Connect**
6. Choose the **Session Manager** tab → Click **Connect**

> ⚠️ **Note:** If the Command Host is not visible, the lab may still be provisioning. Wait 2-3 minutes and refresh.

> 💡 **Tip:** If the Connect button is unavailable, wait a few minutes and retry.

#### Step 2: Configure the Terminal Environment

Once connected, run the following commands to set up the environment:

```bash
# Switch to root user for full system access
sudo su

# Navigate to the ec2-user home directory
cd /home/ec2-user/
```

#### Step 3: Connect to MySQL

Connect to the relational database instance using the provided credentials:

```bash
mysql -u root --password='re:St@rt!9'
```

**Connection Parameters Explained:**

| Flag | Long Form | Description |
|------|-----------|-------------|
| `-u` | `--user` | MySQL username (root) |
| `-p` | `--password` | MySQL password (provided in quotes) |

> 💡 **Reconnection Tip:** If the Session Manager becomes unresponsive:
> 1. Close the Session Manager window
> 2. Reconnect using the steps above
> 3. Re-run: `sudo su`, `cd /home/ec2-user/`, `mysql -u root --password='re:St@rt!9'`

---

### Task 2: Create a Database and Table

Create a new database named `world`, build a `country` table, and fix a schema error.

#### Step 2.1: Inspect Existing Databases

View all available databases on the server:

```sql
SHOW DATABASES;
```

**Expected Output:**
```
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
```

> 🎯 **Purpose:** Verify you're connected to the correct database instance and understand the existing environment.

#### Step 2.2: Create the `world` Database

```sql
CREATE DATABASE world;
```

#### Step 2.3: Verify Database Creation

```sql
SHOW DATABASES;
```

**Expected Output:**
```
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
| world              |  <-- New database
+--------------------+
```

#### Step 2.4: Create the `country` Table

Create a table with a comprehensive schema for country data:

```sql
CREATE TABLE world.country (
  `Code` CHAR(3) NOT NULL DEFAULT '',
  `Name` CHAR(52) NOT NULL DEFAULT '',
  `Conitinent` enum('Asia','Europe','North America','Africa','Oceania','Antarctica','South America') NOT NULL DEFAULT 'Asia',
  `Region` CHAR(26) NOT NULL DEFAULT '',
  `SurfaceArea` FLOAT(10,2) NOT NULL DEFAULT '0.00',
  `IndepYear` SMALLINT(6) DEFAULT NULL,
  `Population` INT(11) NOT NULL DEFAULT '0',
  `LifeExpectancy` FLOAT(3,1) DEFAULT NULL,
  `GNP` FLOAT(10,2) DEFAULT NULL,
  `GNPOld` FLOAT(10,2) DEFAULT NULL,
  `LocalName` CHAR(45) NOT NULL DEFAULT '',
  `GovernmentForm` CHAR(45) NOT NULL DEFAULT '',
  `HeadOfState` CHAR(60) DEFAULT NULL,
  `Capital` INT(11) DEFAULT NULL,
  `Code2` CHAR(2) NOT NULL DEFAULT '',
  PRIMARY KEY (`Code`)
);
```

**Schema Breakdown:**

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| `Code` | `CHAR(3)` | NOT NULL, PRIMARY KEY | ISO country code (3 chars) |
| `Name` | `CHAR(52)` | NOT NULL | Official country name |
| `Conitinent` | `ENUM(...)` | NOT NULL, DEFAULT 'Asia' | Continent (note: misspelled) |
| `Region` | `CHAR(26)` | NOT NULL | Geographic region |
| `SurfaceArea` | `FLOAT(10,2)` | NOT NULL, DEFAULT 0.00 | Land area in sq km |
| `IndepYear` | `SMALLINT(6)` | NULL | Year of independence |
| `Population` | `INT(11)` | NOT NULL, DEFAULT 0 | Total population |
| `LifeExpectancy` | `FLOAT(3,1)` | NULL | Average life expectancy |
| `GNP` | `FLOAT(10,2)` | NULL | Gross National Product |
| `GNPOld` | `FLOAT(10,2)` | NULL | Previous GNP value |
| `LocalName` | `CHAR(45)` | NOT NULL | Name in local language |
| `GovernmentForm` | `CHAR(45)` | NOT NULL | Type of government |
| `HeadOfState` | `CHAR(60)` | NULL | Current leader |
| `Capital` | `INT(11)` | NULL | Capital city ID |
| `Code2` | `CHAR(2)` | NOT NULL | 2-character country code |

#### Step 2.5: Verify Table Creation

```sql
-- Select the world database
USE world;

-- List all tables in the database
SHOW TABLES;
```

**Expected Output:**
```
+-----------------+
| Tables_in_world |
+-----------------+
| country         |
+-----------------+
```

#### Step 2.6: Inspect Table Columns

```sql
SHOW COLUMNS FROM world.country;
```

> 🔍 **Observation:** Notice that the `Continent` column is misspelled as `Conitinent`.

#### Step 2.7: Fix the Column Name

Use `ALTER TABLE` to rename the misspelled column:

```sql
ALTER TABLE world.country 
RENAME COLUMN Conitinent TO Continent;
```

> 📝 **Syntax Note:** `RENAME COLUMN` is available in MySQL 8.0+. For older versions, use `CHANGE COLUMN`.

#### Step 2.8: Verify the Fix

```sql
SHOW COLUMNS FROM world.country;
```

**Expected Output:**
```
+---------------+-------------------------------------------+------+-----+---------+-------+
| Field         | Type                                      | Null | Key | Default | Extra |
+---------------+-------------------------------------------+------+-----+---------+-------+
| Code          | char(3)                                   | NO   | PRI |         |       |
| Name          | char(52)                                  | NO   |     |         |       |
| Continent     | enum(...)                                 | NO   |     | Asia    |       |  <-- Fixed!
| ...           | ...                                       | ...  | ... | ...     | ...   |
+---------------+-------------------------------------------+------+-----+---------+-------+
```

---

### Task 3: Delete a Database and Tables

Safely remove the created database objects using `DROP` commands.

#### Step 3.1: Drop the `city` Table (if created)

```sql
DROP TABLE world.city;
```

> ⚠️ **Warning:** `DROP TABLE` permanently deletes the table and all its data. This action **cannot be undone** without a backup.

#### Step 3.2: Drop the `country` Table

```sql
DROP TABLE world.country;
```

#### Step 3.3: Verify Tables Are Deleted

```sql
SHOW TABLES;
```

**Expected Output:**
```
Empty set (0.00 sec)
```

#### Step 3.4: Drop the `world` Database

```sql
DROP DATABASE world;
```

> ⚠️ **Warning:** `DROP DATABASE` removes the entire database, all tables, and all data permanently.

#### Step 3.5: Verify Database Deletion

```sql
SHOW DATABASES;
```

**Expected Output:** (world database no longer listed)
```
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
```

---

## SQL Commands Reference

### DDL (Data Definition Language) Commands Used

| Command | Purpose | Example |
|---------|---------|---------|
| `CREATE DATABASE` | Create a new database | `CREATE DATABASE world;` |
| `CREATE TABLE` | Create a new table with schema | `CREATE TABLE world.country (...);` |
| `SHOW DATABASES` | List all databases | `SHOW DATABASES;` |
| `SHOW TABLES` | List tables in current DB | `SHOW TABLES;` |
| `SHOW COLUMNS` | Display table structure | `SHOW COLUMNS FROM world.country;` |
| `USE` | Select active database | `USE world;` |
| `ALTER TABLE ... RENAME COLUMN` | Rename a column | `ALTER TABLE world.country RENAME COLUMN Conitinent TO Continent;` |
| `DROP TABLE` | Delete a table | `DROP TABLE world.country;` |
| `DROP DATABASE` | Delete a database | `DROP DATABASE world;` |

### Data Types Used

| Type | Description | Example Value |
|------|-------------|---------------|
| `CHAR(n)` | Fixed-length string | `'USA'`, `'Finland'` |
| `INT(n)` | Integer (display width n) | `5500000` |
| `SMALLINT(n)` | Small integer | `1917` |
| `FLOAT(m,d)` | Floating-point (m digits, d decimals) | `338424.00` |
| `ENUM(...)` | Enumerated list of values | `'Asia'`, `'Europe'` |

---

## Challenges

### Challenge 1: Create a `city` Table

**Task:** Create a table named `city` with two columns: `Name` and `Region`, both using `CHAR` data type.

<details>
<summary>💡 Click to reveal solution</summary>

```sql
CREATE TABLE world.city (
    `Name` CHAR(52), 
    `Region` CHAR(26)
);
```

**Explanation:**
- `Name` uses `CHAR(52)` to match the country table's name field length
- `Region` uses `CHAR(26)` to match the country table's region field length
- Neither column has `NOT NULL` constraints, so they can accept empty values

</details>

---

### Challenge 2: Drop the `country` Table

**Task:** Write the SQL command to delete the `country` table.

<details>
<summary>💡 Click to reveal solution</summary>

```sql
DROP TABLE world.country;
```

**Explanation:**
- `DROP TABLE` is the standard SQL command for removing tables
- The `world.` prefix specifies the database containing the table
- Always verify with `SHOW TABLES` after dropping to confirm deletion

</details>

---

## Troubleshooting

### Common Issues and Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| **Command Host not visible** | Lab still provisioning | Wait 2-3 minutes and refresh the EC2 console |
| **Connect button disabled** | Instance not ready | Wait for instance status checks to complete |
| **"Access denied" for MySQL** | Wrong password | Verify password: `re:St@rt!9` (case-sensitive) |
| **"Unknown database" error** | Database doesn't exist | Run `CREATE DATABASE world;` first |
| **"Table doesn't exist"** | Table not created or misspelled | Check `SHOW TABLES;` and verify spelling |
| **Session Manager disconnects** | Idle timeout | Reconnect using Task 1 steps |
| **ALTER TABLE fails** | MySQL version < 8.0 | Use: `ALTER TABLE table CHANGE old new datatype;` |

### Reconnection Script

If you need to reconnect at any point, run these commands in sequence:

```bash
sudo su
cd /home/ec2-user/
mysql -u root --password='re:St@rt!9'
```

---

## Sample Data Attribution

Sample data used in this course is taken from:

> **Statistics Finland** — General regional statistics  
> Published: February 4, 2022  
> [https://www.stat.fi/](https://www.stat.fi/)

---

## Cleanup

To ensure no resources are left behind and to avoid unexpected charges:

1. ✅ Drop all tables created during the lab (`DROP TABLE`)
2. ✅ Drop the `world` database (`DROP DATABASE world;`)
3. ✅ Exit MySQL client: `EXIT;` or `QUIT;`
4. ✅ Close the Session Manager terminal
5. ✅ End the lab session in the AWS Academy console (if applicable)

---

## License

This lab material is provided for **educational purposes** as part of the AWS Academy curriculum. 

> ⚠️ **Important:** Do not use production credentials or store sensitive data in lab environments. The passwords provided are for educational use only and should never be used in production systems.

---

## Additional Resources

- [MySQL 8.0 Reference Manual - CREATE DATABASE](https://dev.mysql.com/doc/refman/8.0/en/create-database.html)
- [MySQL 8.0 Reference Manual - CREATE TABLE](https://dev.mysql.com/doc/refman/8.0/en/create-table.html)
- [MySQL 8.0 Reference Manual - ALTER TABLE](https://dev.mysql.com/doc/refman/8.0/en/alter-table.html)
- [MySQL 8.0 Reference Manual - DROP TABLE](https://dev.mysql.com/doc/refman/8.0/en/drop-table.html)
- [AWS Systems Manager Session Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html)

---

<p align="center">
  <strong>Happy Learning! 🚀</strong><br>
  <em>Database Operations Team | AWS Academy</em>
</p>
