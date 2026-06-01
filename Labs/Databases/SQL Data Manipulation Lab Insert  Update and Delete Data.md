# 🗄️ SQL Data Manipulation Lab: Insert, Update, and Delete Data

> **Scenario**: The database operations team has created a relational database called `world` containing three tables: `city`, `country`, and `countrylanguage`. You have to validate the configuration of the database by running **INSERT**, **UPDATE**, and **DELETE** statements on the `country` table.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Architecture](#architecture)
- [Lab Duration](#lab-duration)
- [Task 1: Connect to the Database](#task-1-connect-to-the-database)
- [Task 2: Insert Data into a Table](#task-2-insert-data-into-a-table)
- [Task 3: Update Rows in a Table](#task-3-update-rows-in-a-table)
- [Task 4: Delete Rows from a Table](#task-4-delete-rows-from-a-table)
- [Task 5: Import Data Using an SQL File](#task-5-import-data-using-an-sql-file)
- [Conclusion](#conclusion)
- [Troubleshooting](#troubleshooting)
- [Sample Data Source](#sample-data-source)

---

## 📖 Overview

This lab demonstrates how to **insert**, **update**, **delete**, and **import** rows of data using Structured Query Language (SQL). You will use a MySQL database instance on AWS EC2 to perform these operations.

### 🎯 Lab Objectives

After completing this lab, you will be able to:

- ✅ Insert rows into a table
- ✅ Update rows in a table
- ✅ Delete rows from a table
- ✅ Import rows from a database backup file

### 🛠️ Pre-Provisioned Resources

When you start this lab, the following resources are already created for you:

- A **Command Host** instance (EC2)
- A **world** database containing three tables: `city`, `country`, and `countrylanguage`

---

## 🔧 Prerequisites

- AWS Management Console access
- Basic familiarity with SQL syntax
- Basic familiarity with Linux terminal commands

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    AWS Cloud                                │
│                                                             │
│  ┌──────────────────┐         ┌──────────────────────┐     │
│  │   Command Host   │         │   MySQL Database     │     │
│  │   (EC2 Instance) │────────▶│   (world database)   │     │
│  │                  │  SSH/    │                      │     │
│  │  - Session Mgr   │  MySQL   │  Tables:             │     │
│  │  - MySQL Client  │  Client  │  • city              │     │
│  │                  │          │  • country           │     │
│  └──────────────────┘          │  • countrylanguage   │     │
│                                └──────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

**At the end of this lab**, your architecture will show:
- A lab user connected to a database instance
- Insert, Update, and Delete operations performed on the `country` table

---

## ⏱️ Lab Duration

This lab requires approximately **45 minutes** to complete.

---

## 🚀 Task 1: Connect to a Database

In this task, you connect to an instance containing a database client (referred to as the **Command Host**).

### Step 1: Access the EC2 Instance

1. In the **AWS Management Console**, choose the **Services** menu.
2. Under **Compute**, choose **EC2**.
3. In the left navigation pane, choose **Instances**.
4. Next to the instance labelled **Command Host**, select the check box ✅ and then choose **Connect**.

> ⚠️ **Note**: If you do not see the Command Host, the lab is possibly still being provisioned, or you may be using another Region.

### Step 2: Connect via Session Manager

1. For **Connect to instance**, choose the **Session Manager** tab.
2. Choose **Connect** to open a terminal window.

> ⚠️ **Note**: If the Connect button is not available, wait for a few minutes and try again.

### Step 3: Configure the Terminal

Run the following commands to configure the terminal:

```bash
sudo su
cd /home/ec2-user/
```

💡 **Tips**:
- Copy and paste the command into the Session Manager terminal window.
- If you are using a Windows system, press `Shift+Ctrl+V` to paste the command.

### Step 4: Connect to MySQL

Run the following command to connect to the database instance:

```bash
mysql -u root --password='re:St@rt!9'
```

#### MySQL Connection Parameters

| Switch | Description |
|--------|-------------|
| `-u` or `--user` | The MySQL user name used to connect to a database instance |
| `-p` or `--password` | The MySQL password used to connect to a database instance |

### Step 5: Verify Databases

To show the existing databases, run:

```sql
SHOW DATABASES;
```

Make a note of the currently available databases.

> 💡 **Tip**: At any stage of the lab, if the Session Manager window is not responsive or if you need to reconnect:
> 1. Close the Session Manager window and try to reconnect using the previous steps.
> 2. Run these commands in the terminal:
> ```bash
> sudo su
> cd /home/ec2-user/
> mysql -u root --password='re:St@rt!9'
> ```

---

## ➕ Task 2: Insert Data into a Table

In this task, you insert sample data into the `country` table.

### Step 1: Verify the Table Exists

Run the following command to verify the `country` table exists:

```sql
SELECT * FROM world.country;
```

> 📌 The `SELECT *` statement identifies all columns to include in the result set. The `FROM` clause specifies the database (`world`) and table (`country`) being queried.

### Step 2: Insert Rows

Run the following `INSERT` statements. The values in the `VALUES` clause must be in the same order as defined by the table schema.

#### Insert Ireland (IRL)

```sql
INSERT INTO world.country VALUES (
  'IRL', 'Ireland', 'Europe', 'British Islands', 70273.00, 1921, 3775100, 76.8, 
  75921.00, 73132.00, 'Ireland/Éire', 'Republic', 1447, 'IE'
);
```

#### Insert Australia (AUS)

```sql
INSERT INTO world.country VALUES (
  'AUS', 'Australia', 'Oceania', 'Australia and New Zealand', 7741220.00, 1901, 
  18886000, 79.8, 351182.00, 392911.00, 'Australia', 
  'Constitutional Monarchy, Federation', 135, 'AU'
);
```

### Step 3: Verify Insertions

To verify that two rows were successfully inserted, run:

```sql
SELECT * FROM world.country WHERE Code IN ('IRL', 'AUS');
```

#### Expected Output

| Code | Name | Continent | Region | SurfaceArea | IndepYear | Population | LifeExpectancy | GNP | GNPOld | LocalName | GovernmentForm | Capital | Code2 |
|------|------|-----------|--------|-------------|-----------|------------|----------------|-----|--------|-----------|----------------|---------|-------|
| AUS | Australia | Oceania | Australia and New Zealand | 7741220 | 1901 | 18886000 | 79.8 | 351182 | 392911 | Australia | Constitutional Monarchy, Federation | 135 | AU |
| IRL | Ireland | Europe | British Islands | 70273 | 1921 | 3775100 | 76.8 | 75921 | 73132 | Ireland/Éire | Republic | 1447 | IE |

---

## 🔄 Task 3: Update Rows in a Table

In this task, you update both rows in the `country` table using `UPDATE` statements.

### Step 1: Update Population to 0

Run the following `UPDATE` statement to set the `Population` column to `0` for **all rows**:

```sql
UPDATE world.country SET Population = 0;
```

> ⚠️ **Warning**: All rows are updated because the `UPDATE` statement does **not** include a `WHERE` condition. A `WHERE` clause uses conditions to filter rows. (The next lab introduces the `WHERE` clause in detail.)

### Step 2: Verify the Update

```sql
SELECT * FROM world.country;
```

### Step 3: Update Multiple Columns

Run the following `UPDATE` statement to update both `Population` and `SurfaceArea`:

```sql
UPDATE world.country SET Population = 100, SurfaceArea = 100;
```

### Step 4: Verify the Multi-Column Update

```sql
SELECT * FROM world.country;
```

---

## 🗑️ Task 4: Delete Rows from a Table

In this task, you delete rows in the `country` table using a `DELETE` statement.

> ⚠️ **Exercise caution** when using data manipulation statements such as `UPDATE` and `DELETE` because these changes may not be reversible.

### Step 1: Disable Foreign Key Checks

To prevent constraint errors, run:

```sql
SET FOREIGN_KEY_CHECKS = 0;
```

### Step 2: Delete All Rows

Run the following command to delete **ALL** rows from the `country` table:

```sql
DELETE FROM world.country;
```

> ⚠️ **Warning**: Because the `DELETE` statement does not include a `WHERE` condition, **all rows are deleted**.

### Step 3: Verify Deletion

```sql
SELECT * FROM world.country;
```

You should see an empty result set (no rows returned).

---

## 📥 Task 5: Import Data Using an SQL File

In this task, you import sample data into the `country` table using an SQL backup file.

### Step 1: Exit MySQL

```sql
QUIT;
```

### Step 2: Verify the SQL File Exists

```bash
ls /home/ec2-user/world.sql
```

### Step 3: Import the SQL File

It is time-consuming to insert individual rows. A SQL script file containing a group of SQL statements can quickly load data into a database.

Run the following command to load rows into the `country` table:

```bash
mysql -u root --password='re:St@rt!9' < /home/ec2-user/world.sql
```

> 📌 This database file adds two additional tables and inserts data into all three tables.

### Step 4: Reconnect to MySQL

```bash
mysql -u root --password='re:St@rt!9'
```

### Step 5: Verify the Script Ran Successfully

```sql
USE world;
SHOW TABLES;
```

You should see three tables:
- `city`
- `country`
- `countrylanguage`

### Step 6: Verify Data Import

```sql
SELECT * FROM country;
```

Notice that there are many more entries in the `country` table now.

### Step 7: Query Other Tables

Similarly, use `SELECT` to query the `city` and `countrylanguage` tables:

```sql
SELECT * FROM city LIMIT 5;
SELECT * FROM countrylanguage LIMIT 5;
```

---

## ✅ Conclusion

Congratulations! 🎉 You have successfully:

- ✅ Inserted rows into a table
- ✅ Updated rows in a table
- ✅ Deleted rows from a table
- ✅ Imported rows from a database backup file

---

## 🔍 Troubleshooting

| Issue | Solution |
|-------|----------|
| Command Host not visible | The lab may still be provisioning. Wait a few minutes and refresh. |
| Connect button not available | Wait a few minutes and try again. |
| Session Manager not responsive | Close the window and reconnect using the steps in Task 1. |
| Foreign key constraint errors | Run `SET FOREIGN_KEY_CHECKS = 0;` before DELETE operations. |
| Permission denied | Ensure you ran `sudo su` before executing commands. |

---

## 📚 Sample Data Source

Sample data in this course is taken from **Statistics Finland**, general regional statistics, February 4, 2022.

---

## 📄 License

This lab documentation is provided for educational purposes.

---

**Lab Complete** 🏁

> 💡 **Pro Tip**: Always use `WHERE` clauses with `UPDATE` and `DELETE` statements in production environments to avoid unintended data loss!
