# Insert, Update, and Delete Data in a Database

> **Lab Duration:** ~45 minutes  
> **Difficulty:** Beginner  
> **Prerequisites:** Basic familiarity with AWS EC2 and Linux terminal commands

---

## 📋 Table of Contents

- [Lab Overview](#lab-overview)
- [Objectives](#objectives)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Task 1: Connect to the Database](#task-1-connect-to-the-database)
- [Task 2: Insert Data into a Table](#task-2-insert-data-into-a-table)
- [Task 3: Update Rows in a Table](#task-3-update-rows-in-a-table)
- [Task 4: Delete Rows from a Table](#task-4-delete-rows-from-a-table)
- [Task 5: Import Data Using an SQL File](#task-5-import-data-using-an-sql-file)
- [Conclusion](#conclusion)
- [Sample Data Attribution](#sample-data-attribution)
- [Troubleshooting](#troubleshooting)

---

## Lab Overview

This hands-on lab demonstrates fundamental **Data Manipulation Language (DML)** operations using **Structured Query Language (SQL)**. You will connect to a pre-provisioned MySQL database instance, manipulate data in the `world` database, and learn how to safely perform insert, update, delete, and import operations.

> **Note:** Sample data in this course is taken from [Statistics Finland](https://www.stat.fi/), general regional statistics, February 4, 2022.

---

## Objectives

After completing this lab, you will be able to:

- ✅ **Insert** rows into a table
- ✅ **Update** rows in a table  
- ✅ **Delete** rows from a table
- ✅ **Import** rows from a database backup file

---

## Architecture

### Starting State
When you begin this lab, the following resources are already provisioned for you:

```
┌─────────────────┐         ┌─────────────────────────────┐
│   AWS EC2       │         │      MySQL Database         │
│  Command Host   │────────▶│      (world database)       │
│  (Amazon Linux) │  SSH/    │                             │
│                 │Session  │  ┌─────────┐ ┌──────────┐  │
│  MySQL Client   │Manager   │  │  city   │ │ country  │  │
│  Pre-installed  │         │  └─────────┘ └──────────┘  │
│                 │         │  ┌──────────────────────┐  │
│  world.sql      │         │  │  countrylanguage   │  │
│  (backup file)  │         │  └──────────────────────┘  │
└─────────────────┘         └─────────────────────────────┘
```

### Ending State
After completing all tasks, you will have successfully manipulated data in the `world` database:

```
┌─────────────────┐         ┌─────────────────────────────┐
│   Lab User      │         │      world Database         │
│  (You)          │────────▶│                             │
│                 │         │  ┌─────────┐ ┌──────────┐  │
│  INSERT ✅      │         │  │  city   │ │ country  │◀─┼── Data inserted
│  UPDATE ✅      │         │  │(populated)│ │(populated)│  │   & updated
│  DELETE ✅      │         │  └─────────┘ └──────────┘  │
│  IMPORT ✅      │         │  ┌──────────────────────┐  │
│                 │         │  │  countrylanguage   │  │
└─────────────────┘         │  │    (populated)       │  │
                            │  └──────────────────────┘  │
                            └─────────────────────────────┘
```

---

## Prerequisites

Before starting this lab, ensure you have:

- [ ] Access to the AWS Management Console with appropriate permissions
- [ ] The lab environment has been fully provisioned (wait for "Command Host" EC2 instance to appear)
- [ ] Basic familiarity with Linux terminal commands
- [ ] A text editor or clipboard manager for copying/pasting commands

> ⚠️ **Important:** If you do not see the Command Host instance, the lab may still be provisioning, or you may be using an incorrect AWS Region.

---

## Task 1: Connect to the Database

### Step 1.1: Access the Command Host via Session Manager

1. In the **AWS Management Console**, choose the **Services** menu.
2. Under **Compute**, choose **EC2**.
3. In the left navigation pane, choose **Instances**.
4. Locate the instance labeled **Command Host**, select the checkbox, and choose **Connect**.
5. For **Connect to instance**, choose the **Session Manager** tab.
6. Choose **Connect** to open a terminal window.

> 💡 **Tip:** If the **Connect** button is not available, wait a few minutes for the instance to finish initializing and try again.

### Step 1.2: Configure the Terminal Environment

Run the following commands to configure the terminal and access required tools:

```bash
sudo su
cd /home/ec2-user/
```

> 💡 **Paste Tips:**
> - **Linux/Mac:** `Ctrl+Shift+V` or right-click → Paste
> - **Windows:** `Shift+Ctrl+V`

### Step 1.3: Connect to MySQL

Connect to the database instance using the pre-configured root credentials:

```bash
mysql -u root --password='re:St@rt!9'
```

**Connection Parameters Explained:**

| Parameter | Description |
|-----------|-------------|
| `-u` or `--user` | The MySQL username used to connect to the database instance |
| `-p` or `--password` | The MySQL password used to connect to the database instance |

### Step 1.4: Verify Available Databases

Once connected to the MySQL shell, list all existing databases:

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
| world              |
+--------------------+
```

> 📝 **Make a note** of the currently available databases for reference.

---

## Task 2: Insert Data into a Table

### Step 2.1: Verify the Country Table Exists

Before inserting data, verify the `country` table exists and inspect its current contents:

```sql
SELECT * FROM world.country;
```

> **SQL Syntax Note:** The `SELECT` statement retrieves data. The `*` denotes all columns. The `FROM` clause specifies the database (`world`) and table (`country`).

### Step 2.2: Insert Sample Rows

Insert two new rows into the `country` table. The values must match the column order defined in the table schema.

**Insert Ireland:**
```sql
INSERT INTO world.country 
VALUES ('IRL','Ireland','Europe','British Islands',70273.00,1921,3775100,76.8,75921.00,73132.00,'Ireland/Éire','Republic',1447,'IE');
```

**Insert Australia:**
```sql
INSERT INTO world.country 
VALUES ('AUS','Australia','Oceania','Australia and New Zealand',7741220.00,1901,18886000,79.8,351182.00,392911.00,'Australia','Constitutional Monarchy, Federation',135,'AU');
```

**Column Order for `country` Table:**

| Position | Column Name | Data Type | Example Value |
|----------|-------------|-----------|---------------|
| 1 | `Code` | CHAR(3) | 'IRL' |
| 2 | `Name` | CHAR(52) | 'Ireland' |
| 3 | `Continent` | ENUM | 'Europe' |
| 4 | `Region` | CHAR(26) | 'British Islands' |
| 5 | `SurfaceArea` | FLOAT | 70273.00 |
| 6 | `IndepYear` | SMALLINT | 1921 |
| 7 | `Population` | INT | 3775100 |
| 8 | `LifeExpectancy` | FLOAT | 76.8 |
| 9 | `GNP` | FLOAT | 75921.00 |
| 10 | `GNPOld` | FLOAT | 73132.00 |
| 11 | `LocalName` | CHAR(45) | 'Ireland/Éire' |
| 12 | `GovernmentForm` | CHAR(45) | 'Republic' |
| 13 | `Capital` | INT | 1447 |
| 14 | `Code2` | CHAR(2) | 'IE' |

### Step 2.3: Verify Insertions

Confirm both rows were successfully inserted:

```sql
SELECT * FROM world.country WHERE Code IN ('IRL', 'AUS');
```

**Expected Output:**

| Code | Name | Continent | Region | SurfaceArea | IndepYear | Population | LifeExpectancy | GNP | GNPOld | LocalName | GovernmentForm | Capital | Code2 |
|------|------|-----------|--------|-------------|-----------|------------|----------------|-----|--------|-----------|----------------|---------|-------|
| AUS | Australia | Oceania | Australia and New Zealand | 7741220 | 1901 | 18886000 | 79.8 | 351182 | 392911 | Australia | Constitutional Monarchy, Federation | 135 | AU |
| IRL | Ireland | Europe | British Islands | 70273 | 1921 | 3775100 | 76.8 | 75921 | 73132 | Ireland/Éire | Republic | 1447 | IE |

---

## Task 3: Update Rows in a Table

> ⚠️ **Warning:** UPDATE and DELETE statements without a `WHERE` clause affect **ALL** rows in the table. Always double-check your queries before executing.

### Step 3.1: Update All Rows (No WHERE Clause)

Set the `Population` column to `0` for **all rows** in the `country` table:

```sql
UPDATE world.country SET Population = 0;
```

> **Note:** All rows are updated because no `WHERE` condition is specified to filter the results.

### Step 3.2: Verify the Update

```sql
SELECT * FROM world.country;
```

You should observe that the `Population` column now shows `0` for all rows, including Ireland and Australia.

### Step 3.3: Update Multiple Columns

Update both `Population` and `SurfaceArea` columns for all rows:

```sql
UPDATE world.country SET Population = 100, SurfaceArea = 100;
```

### Step 3.4: Verify the Multi-Column Update

```sql
SELECT * FROM world.country;
```

**Expected Result:** Both `Population` and `SurfaceArea` columns should display `100` for all rows.

---

## Task 4: Delete Rows from a Table

> ⚠️ **Critical Warning:** Exercise extreme caution when using `UPDATE` and `DELETE`. These operations may be **irreversible** if you do not have a backup.

### Step 4.1: Disable Foreign Key Checks (Optional but Recommended)

To prevent constraint errors when deleting rows that might be referenced by other tables:

```sql
SET FOREIGN_KEY_CHECKS = 0;
```

### Step 4.2: Delete All Rows from the Country Table

Delete **all rows** from the `country` table:

```sql
DELETE FROM world.country;
```

> **Note:** Because no `WHERE` clause is specified, this operation removes every row in the table.

### Step 4.3: Verify Deletion

Confirm the table is now empty:

```sql
SELECT * FROM world.country;
```

**Expected Output:**
```
Empty set (0.00 sec)
```

---

## Task 5: Import Data Using an SQL File

Manually inserting rows is time-consuming for large datasets. SQL script files allow you to batch-load data efficiently.

### Step 5.1: Exit MySQL Shell

```sql
QUIT;
```

### Step 5.2: Verify the Backup File Exists

Check that the `world.sql` backup file is present on the Command Host:

```bash
ls /home/ec2-user/world.sql
```

**Expected Output:**
```
/home/ec2-user/world.sql
```

### Step 5.3: Import the SQL Backup

Load the entire database backup into MySQL:

```bash
mysql -u root --password='re:St@rt!9' < /home/ec2-user/world.sql
```

**What this command does:**
- Creates two additional tables (`city`, `countrylanguage`)
- Populates all three tables (`city`, `country`, `countrylanguage`) with sample data
- Restores the `country` table with complete data

### Step 5.4: Reconnect to MySQL

```bash
mysql -u root --password='re:St@rt!9'
```

### Step 5.5: Verify the Database Structure

Switch to the `world` database and list all tables:

```sql
USE world;
SHOW TABLES;
```

**Expected Output:**
```
+-----------------+
| Tables_in_world |
+-----------------+
| city            |
| country         |
| countrylanguage |
+-----------------+
```

### Step 5.6: Verify Data Import

Check that the `country` table now contains significantly more rows:

```sql
SELECT * FROM country;
```

You should see a comprehensive list of countries (200+ rows).

### Step 5.7: Explore Additional Tables

Query the other tables created during the import:

```sql
-- View sample cities
SELECT * FROM city LIMIT 5;

-- View sample languages
SELECT * FROM countrylanguage LIMIT 5;
```

---

## Conclusion

Congratulations! 🎉 You have successfully completed this lab and demonstrated the following skills:

| Task | Operation | SQL Command | Scope |
|------|-----------|-------------|-------|
| 2 | **Insert** rows | `INSERT INTO ... VALUES (...)` | Added Ireland & Australia |
| 3 | **Update** rows | `UPDATE ... SET ...` | Modified Population & SurfaceArea |
| 4 | **Delete** rows | `DELETE FROM ...` | Removed all rows |
| 5 | **Import** rows | `mysql ... < file.sql` | Restored full dataset |

### Key Takeaways

- **`INSERT INTO`** adds new rows to a table. Values must match the column schema order.
- **`UPDATE`** modifies existing data. Without a `WHERE` clause, it affects all rows.
- **`DELETE`** removes rows. Always verify your `WHERE` clause (if any) before executing.
- **SQL backup files** (`.sql`) are an efficient way to bulk-load or restore database data.
- **`WHERE` clauses** are essential for targeted updates and deletions (covered in advanced labs).

---

## Sample Data Attribution

> **Data Source:** Statistics Finland  
> **Dataset:** General regional statistics  
> **Date:** February 4, 2022  
> **URL:** [https://www.stat.fi/](https://www.stat.fi/)

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **"Command Host" instance not visible** | Wait 2-3 minutes for provisioning to complete. Verify you are in the correct AWS Region. |
| **"Connect" button is grayed out** | The instance is still initializing. Wait 1-2 minutes and refresh the page. |
| **MySQL connection refused** | Ensure you are running `sudo su` and `cd /home/ec2-user/` before connecting. |
| **Foreign key constraint error on DELETE** | Run `SET FOREIGN_KEY_CHECKS = 0;` before deleting. |
| **Session Manager window freezes** | Close the tab and reconnect using the steps in Task 1. |
| **Need to reconnect to database** | Run: `sudo su` → `cd /home/ec2-user/` → `mysql -u root --password='re:St@rt!9'` |

---

## Quick Reference Card

```bash
# Connect to EC2 via Session Manager
# (AWS Console → EC2 → Instances → Command Host → Connect → Session Manager)

# Configure terminal
sudo su
cd /home/ec2-user/

# Connect to MySQL
mysql -u root --password='re:St@rt!9'

# Inside MySQL shell:
SHOW DATABASES;                          -- List databases
USE world;                               -- Select database
SHOW TABLES;                             -- List tables
SELECT * FROM table_name;                -- View all data
INSERT INTO table VALUES (...);          -- Insert row
UPDATE table SET col = val;              -- Update all rows
UPDATE table SET col = val WHERE ...;    -- Update specific rows (best practice)
DELETE FROM table;                       -- Delete all rows
DELETE FROM table WHERE ...;             -- Delete specific rows (best practice)
QUIT;                                    -- Exit MySQL

# Import SQL file from Linux shell
mysql -u root --password='re:St@rt!9' < /home/ec2-user/world.sql
```

---

## License

This lab content is provided for educational purposes. Sample data is attributed to Statistics Finland.

---

*Lab Version: 1.0 | Last Updated: 2026-06-01*
