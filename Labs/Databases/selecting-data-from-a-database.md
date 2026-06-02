# Selecting Data from a Database

> **Duration:** Approximately 45 minutes
> **Prerequisites:** AWS Account with EC2 and Session Manager access

---

## Lab Overview

This lab demonstrates how to use common database operators and the `SELECT` statement to query data from a MySQL database. You will connect to a pre-provisioned EC2 instance (Command Host) that contains a database client, connect to the `world` database, and execute various SQL queries to explore and filter data.

### Sample Data Attribution
Sample data in this course is taken from **Statistics Finland**, general regional statistics, February 4, 2022.

---

## Lab Objectives

After completing this lab, you should be able to:

- [ ] Use the `SELECT` statement to query a database
- [ ] Use the `COUNT()` function to count rows
- [ ] Use the following operators to query a database:
  - Comparison operators: `<`, `>`, `=`
  - `WHERE` clause
  - `ORDER BY` clause
  - `AND` operator

---

## Lab Architecture

When you start the lab, the following resources are already created for you:

- **Command Host:** An EC2 instance with a database client pre-installed
- **World Database:** A MySQL database containing three tables:
  - `city`
  - `country`
  - `countrylanguage`

```
┌─────────────────┐         ┌─────────────────────┐
│   AWS Console   │────────▶│   Command Host      │
│  (Session Mgr)  │   SSH   │   (EC2 Instance)    │
└─────────────────┘         └──────────┬──────────┘
                                       │
                                       │ MySQL Client
                                       ▼
                              ┌─────────────────────┐
                              │   World Database    │
                              │  ┌───────────────┐  │
                              │  │     city      │  │
                              │  │    country    │  │
                              │  │countrylanguage│  │
                              │  └───────────────┘  │
                              └─────────────────────┘
```

---

## Task 1: Connect to the Command Host

In this task, you will connect to an EC2 instance (Command Host) using AWS Systems Manager Session Manager. This instance contains the MySQL client used to connect to the database.

### Step 1.1: Navigate to EC2 Instances

1. In the **AWS Management Console**, choose the **Services** menu.
2. Choose **Compute**, then choose **EC2**.
3. In the left navigation menu, choose **Instances**.

### Step 1.2: Connect via Session Manager

1. Locate the instance labeled **Command Host**.
   > **Note:** If you do not see the Command Host, the lab is possibly still being provisioned, or you may be using another Region.
2. Select the checkbox next to the **Command Host** instance.
3. Choose **Connect**.
4. For **Connect to instance**, choose the **Session Manager** tab.
5. Choose **Connect** to open a terminal window.
   > **Note:** If the **Connect** button is not available, wait a few minutes and try again.

### Step 1.3: Configure the Terminal

Once connected, run the following commands to configure the terminal environment:

```bash
sudo su
cd /home/ec2-user/
```

> **Tip:** Copy and paste the command into the Session Manager terminal window. If you are using a Windows system, press `Shift + Ctrl + V` to paste.

### Step 1.4: Connect to the Database

Run the following command to connect to the MySQL database server:

```bash
mysql -u root --password='re:St@rt!9'
```

> **Tip:** At any stage of the lab, if the Session Manager window is not responsive or if you need to reconnect to the database, follow these steps:
> 1. Close the Session Manager window and reconnect using the previous steps.
> 2. Run the following commands in the terminal:
> ```bash
> sudo su
> cd /home/ec2-user/
> mysql -u root --password='re:St@rt!9'
> ```

---

## Task 2: Query the World Database

In this task, you will query the `world` database using various `SELECT` statements and database operators.

### Step 2.1: Show Available Databases

To display all existing databases, run:

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

> **Verify:** Confirm that a database named `world` is available. If the `world` database is not available, contact your instructor.

---

### Step 2.2: List All Rows and Columns

To list all rows and columns in the `country` table, run:

```sql
SELECT * FROM world.country;
```

**What this does:**
- `SELECT *` retrieves all columns.
- `FROM world.country` specifies the database (`world`) and table (`country`).

---

### Step 2.3: Count Rows in a Table

The `COUNT()` function returns the number of rows that match a specified condition.

| Function | Description |
|----------|-------------|
| `COUNT(*)` | Counts all rows in the table |
| `COUNT(column)` | Counts rows where the specified column is not `NULL` |

To count all rows in the `country` table:

```sql
SELECT COUNT(*) FROM world.country;
```

---

### Step 2.4: Examine Table Schema

To list all columns and their data types in the `country` table:

```sql
SHOW COLUMNS FROM world.country;
```

**Expected Output (partial):**
```
+----------------+---------------+------+-----+---------+----------------+
| Field          | Type          | Null | Key | Default | Extra          |
+----------------+---------------+------+-----+---------+----------------+
| Code           | char(3)       | NO   | PRI |         |                |
| Name           | char(52)      | NO   |     |         |                |
| Continent      | enum(...)     | NO   |     | Asia    |                |
| Region         | char(26)      | NO   |     |         |                |
| SurfaceArea    | float(10,2)   | NO   |     | 0.00    |                |
| Population     | int(11)       | NO   |     | 0       |                |
| LifeExpectancy | float(3,1)    | YES  |     | NULL    |                |
| Capital        | int(11)       | YES  |     | NULL    |                |
+----------------+---------------+------+-----+---------+----------------+
```

---

### Step 2.5: Query Specific Columns

To return only specific columns (`Name`, `Capital`, `Region`, `SurfaceArea`, `Population`):

```sql
SELECT Name, Capital, Region, SurfaceArea, Population
FROM world.country;
```

---

### Step 2.6: Use Aliases (`AS`)

Database column names are sometimes not user-friendly. Use the `AS` keyword to create descriptive column headers.

```sql
SELECT Name, Capital, Region,
       SurfaceArea AS "Surface Area",
       Population
FROM world.country;
```

> **Observe:** The `SurfaceArea` column is now displayed as `Surface Area` in the query output.

---

### Step 2.7: Order Results (`ORDER BY`)

Ordered result sets are easier to view and work with. Use `ORDER BY` to sort results.

#### Ascending Order (Default)

```sql
SELECT Name, Capital, Region,
       SurfaceArea AS "Surface Area",
       Population
FROM world.country
ORDER BY Population;
```

#### Descending Order (`DESC`)

```sql
SELECT Name, Capital, Region,
       SurfaceArea AS "Surface Area",
       Population
FROM world.country
ORDER BY Population DESC;
```

---

### Step 2.8: Filter Results (`WHERE` Clause)

Add conditions to `SELECT` statements using the `WHERE` clause and comparison operators.

#### Comparison Operators

| Operator | Meaning                  |
|----------|--------------------------|
| `=`      | Equal to                 |
| `>`      | Greater than             |
| `<`      | Less than                |
| `>=`     | Greater than or equal to |
| `<=`     | Less than or equal to    |
| `<>`     | Not equal to             |

#### Example: Population Greater Than 50,000,000

```sql
SELECT Name, Capital, Region,
       SurfaceArea AS "Surface Area",
       Population
FROM world.country
WHERE Population > 50000000
ORDER BY Population DESC;
```

---

### Step 2.9: Combine Conditions (`AND` Operator)

Use `AND` to require multiple conditions to be true simultaneously.

#### Example: Population Between 50M and 100M

```sql
SELECT Name, Capital, Region,
       SurfaceArea AS "Surface Area",
       Population
FROM world.country
WHERE Population > 50000000
  AND Population < 100000000
ORDER BY Population DESC;
```

**Explanation:**
- `Population > 50000000`: First condition — population must be greater than 50 million.
- `AND`: Both conditions must be true.
- `Population < 100000000`: Second condition — population must be less than 100 million.

---

## Challenge Exercise

### Question

> **Which country in Southern Europe has a population greater than 50,000,000?**

<details>
<summary>Click to reveal the solution</summary>

```sql
SELECT Name, Capital, Region,
       SurfaceArea AS "Surface Area",
       Population
FROM world.country
WHERE Population > 50000000
  AND Region = 'Southern Europe';
```

**Expected Output:**
```
+--------+----------------+----------------+--------------+------------+
| Name   | Capital        | Region         | Surface Area | Population |
+--------+----------------+----------------+--------------+------------+
| Italy  |            146 | Southern Europe |    301316.00 |   57680000 |
+--------+----------------+----------------+--------------+------------+
```

</details>

---

## Summary of Commands Used

| Task | Command |
|------|---------|
| Show databases | `SHOW DATABASES;` |
| Select all columns | `SELECT * FROM world.country;` |
| Count rows | `SELECT COUNT(*) FROM world.country;` |
| Show columns | `SHOW COLUMNS FROM world.country;` |
| Select specific columns | `SELECT Name, Capital, Region, SurfaceArea, Population FROM world.country;` |
| Use alias | `SELECT SurfaceArea AS "Surface Area" FROM world.country;` |
| Order ascending | `ORDER BY Population;` |
| Order descending | `ORDER BY Population DESC;` |
| Filter with WHERE | `WHERE Population > 50000000;` |
| Combine conditions | `WHERE Population > 50000000 AND Region = 'Southern Europe';` |

---

## Conclusion

Congratulations! You have successfully completed this lab and demonstrated the ability to:

- Use the `SELECT` statement to query a database
- Use the `COUNT()` function to aggregate data
- Use comparison operators (`<`, `>`, `=`) in queries
- Filter results using the `WHERE` clause
- Sort results using `ORDER BY` (ascending and descending)
- Combine multiple conditions using the `AND` operator

---

## Additional Resources

- [MySQL SELECT Statement Documentation](https://dev.mysql.com/doc/refman/8.0/en/select.html)
- [MySQL COUNT() Function](https://dev.mysql.com/doc/refman/8.0/en/aggregate-functions.html#function_count)
- [MySQL WHERE Clause](https://dev.mysql.com/doc/refman/8.0/en/where-optimization.html)
- [MySQL ORDER BY Clause](https://dev.mysql.com/doc/refman/8.0/en/sorting-rows.html)
- [AWS Systems Manager Session Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html)

---

## License

This lab guide is provided for educational purposes. Sample data is sourced from Statistics Finland.

---

*Lab complete. Happy querying!*
