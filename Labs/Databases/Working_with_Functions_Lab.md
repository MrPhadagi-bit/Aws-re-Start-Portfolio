# Working with Functions

## Scenario

The database operations team has created a relational database named `world` containing three tables: `city`, `country`, and `countrylanguage`. Based on specific use cases in the lab exercise, you write a few queries using database functions with the `SELECT` statement and `WHERE` clause.

---

## Lab Overview and Objectives

This lab demonstrates how to use some common database functions with the `SELECT` statement and `WHERE` clause.

After completing this lab, you should be able to:

- Use aggregate functions `SUM()`, `MIN()`, `MAX()`, and `AVG()` to summarize data
- Use the `SUBSTRING_INDEX()` function to split strings
- Use the `LENGTH()` and `TRIM()` functions to determine the length of a string
- Use the `DISTINCT()` function to filter duplicate records
- Use functions in the `SELECT` statement and `WHERE` clause

---

## Prerequisites

When you start the lab, the following resources are already created for you:

- A **Command Host** instance
- A `world` database containing three tables: `city`, `country`, and `countrylanguage`

> **Sample data in this course is taken from Statistics Finland, general regional statistics, February 4, 2022.**

---

## Duration

This lab requires approximately **45 minutes** to complete.

---

## Task 1: Connect to the Command Host

In this task, you connect to an instance containing a database client, which is used to connect to a database. This instance is referred to as the **Command Host**.

### Step 1.1: Navigate to EC2 Instances

1. In the **AWS Management Console**, choose the **Services** menu.
2. Under **Compute**, choose **EC2**.
3. In the navigation pane, choose **Instances**.

### Step 1.2: Connect to the Command Host

1. Next to the instance labelled **Command Host**, select the checkbox and then choose **Connect**.

> **Note:** If you do not see the Command Host, the lab is possibly still being provisioned, or you may be using another Region.

2. For **Connect to instance**, choose the **Session Manager** tab.
3. Choose **Connect** to open a terminal window.

> **Note:** If the **Connect** button is not available, wait for a few minutes and try again.

### Step 1.3: Configure the Terminal

To configure the terminal to access all required tools and resources, run the following commands:

```bash
sudo su
cd /home/ec2-user/
```

> **Tips:**
> - Copy and paste the command into the Session Manager terminal window.
> - If you are using a Windows system, press **Shift+Ctrl+V** to paste the command.

### Step 1.4: Connect to the Database Server

To connect to the database server, run the following command in the terminal. A password was configured when the database was installed.

```bash
mysql -u root --password='re:St@rt!9'
```

> **Tip:** At any stage of the lab, if the Session Manager window is not responsive or if you need to reconnect to the database instance, follow these steps:
> 1. Close the Session Manager window and try to reconnect using the previous steps.
> 2. Run the following commands in the terminal:
>
> ```bash
> sudo su
> cd /home/ec2-user/
> mysql -u root --password='re:St@rt!9'
> ```

---

## Task 2: Query the World Database

In this task, you query the `world` database using various `SELECT` statements and database functions. You use functions to process and manipulate data in a query. There are a wide range of SQL functions, and this lab reviews a subset of commonly used functions.

### Step 2.1: Show Existing Databases

To show the existing databases, enter the following command in the terminal:

```sql
SHOW DATABASES;
```

Verify that a database named `world` is available. If the `world` database is not available, contact your instructor.

### Step 2.2: Review the Country Table

To review the table schema, data, and number of rows in the `country` table, run the following query:

```sql
SELECT * FROM world.country;
```

### Step 2.3: Use Aggregate Functions

The following query demonstrates how to use aggregate functions `SUM()`, `MIN()`, `MAX()`, and `AVG()` to summarize data. Because the query does not include a `WHERE` condition, the functions aggregate data from all records in the `country` table.

```sql
SELECT 
    SUM(Population), 
    AVG(Population), 
    MAX(Population), 
    MIN(Population), 
    COUNT(Population) 
FROM world.country;
```

| Function | Description |
|----------|-------------|
| `SUM()` | Adds all the population values together |
| `AVG()` | Generates an average across all the population values |
| `MAX()` | Finds the row with the highest population value |
| `MIN()` | Finds the row with the lowest population value |
| `COUNT()` | Finds the number of rows with a population value |

### Step 2.4: Split Strings with SUBSTRING_INDEX()

In some cases, you might need to split a string. The following query uses `SUBSTRING_INDEX()` to split a string where a space occurs:

```sql
SELECT Region, SUBSTRING_INDEX(Region, " ", 1) FROM world.country;
```

After you run the query, notice that the second column includes the beginning of each region name.

### Step 2.5: Filter Records Using SUBSTRING_INDEX() in WHERE Clause

Sometimes you may need to search rows using a string fragment. The following query includes `SUBSTRING_INDEX()` as part of a condition in the `WHERE` clause to filter records that include `Southern` in the first part of the region name:

```sql
SELECT Name, Region 
FROM world.country 
WHERE SUBSTRING_INDEX(Region, " ", 1) = "Southern";
```

### Step 2.6: Use LENGTH() and TRIM() Functions

You can use the `LENGTH()` and `TRIM()` functions to determine how many characters are in a string. `TRIM()` clears leading and trailing blank spaces, and the `LENGTH()` function returns a count of the remaining characters. The next example returns only regions that have fewer than 10 characters in their names:

```sql
SELECT Region 
FROM world.country 
WHERE LENGTH(TRIM(Region)) < 10;
```

### Step 2.7: Filter Duplicates with DISTINCT()

You might have noticed duplicate records in the previous example. You can use the `DISTINCT()` function to filter the duplicates:

```sql
SELECT DISTINCT(Region) 
FROM world.country 
WHERE LENGTH(TRIM(Region)) < 10;
```

---

## Challenge

Query the `country` table to return a set of records based on the following requirement:

> **Write a query to return rows that have `Micronesian/Caribbean` as the name in the `Region` column. The output should split the region as `Micronesia` and `Caribbean` into two separate columns: one named `Region Name 1` and one named `Region Name 2`.**

<details>
<summary><strong>Click to reveal the solution</strong></summary>

```sql
SELECT 
    Name,
    Region,
    SUBSTRING_INDEX(Region, '/', 1) AS `Region Name 1`,
    SUBSTRING_INDEX(Region, '/', -1) AS `Region Name 2`
FROM world.country
WHERE Region = 'Micronesian/Caribbean';
```

**Explanation:**
- `SUBSTRING_INDEX(Region, '/', 1)` returns the substring before the first `/` (`Micronesia`)
- `SUBSTRING_INDEX(Region, '/', -1)` returns the substring after the last `/` (`Caribbean`)
- The `WHERE` clause filters only rows where `Region` is exactly `Micronesian/Caribbean`

</details>

---

## Conclusion

Congratulations! You have now successfully:

- Used aggregate functions `SUM()`, `MIN()`, `MAX()`, and `AVG()` to summarize data
- Used the `SUBSTRING_INDEX()` function to split strings
- Used the `LENGTH()` and `TRIM()` functions to determine the length of a string
- Used the `DISTINCT()` function to filter duplicate records
- Used functions in the `SELECT` statement and `WHERE` clause

---

## Lab Complete

You have successfully completed the **Working with Functions** lab.

---

## Quick Reference: Functions Used in This Lab

| Function | Syntax | Description |
|----------|--------|-------------|
| `SUM()` | `SUM(column)` | Returns the total sum of a numeric column |
| `AVG()` | `AVG(column)` | Returns the average value of a numeric column |
| `MAX()` | `MAX(column)` | Returns the maximum value in a column |
| `MIN()` | `MIN(column)` | Returns the minimum value in a column |
| `COUNT()` | `COUNT(column)` | Returns the number of rows that match a specified criterion |
| `SUBSTRING_INDEX()` | `SUBSTRING_INDEX(str, delim, count)` | Returns a substring from a string before a specified number of delimiter occurrences |
| `LENGTH()` | `LENGTH(str)` | Returns the length of a string in bytes |
| `TRIM()` | `TRIM(str)` | Removes leading and trailing spaces from a string |
| `DISTINCT()` | `DISTINCT(column)` | Returns only unique (different) values |
