# Performing a Conditional Search

## Scenario

The database operations team has created a relational database named `world` containing three tables: `city`, `country`, and `countrylanguage`. To help the team, you will write a few queries to search for records in the `country` table by using the `SELECT` statement and a `WHERE` clause.

---

## Lab Overview and Objectives

This lab demonstrates how to use the `SELECT` statement and a `WHERE` clause to filter records with a conditional search.

After completing this lab, you should be able to:

- Write a search condition by using the `WHERE` clause
- Use the `BETWEEN` operator
- Use the `LIKE` operator with wildcard characters
- Use the `AS` operator to create a column alias
- Use functions in a `SELECT` statement
- Use functions in a `WHERE` clause

---

## Lab Architecture

When you start the lab, the following resources are already created for you:

- **Command Host instance** — An Amazon EC2 instance with a database client installed
- **Database** — The `world` database containing three tables: `city`, `country`, and `countrylanguage`

You will use the Command Host to query the `world` database.

> **Note:** At the end of this lab, you will have learned how to use the `WHERE` clause, `BETWEEN` operator, and `LIKE` function to filter records.

---

## Duration

This lab requires approximately **45 minutes** to complete.

---

## Sample Data Attribution

Sample data in this course is taken from **Statistics Finland, General regional statistics, February 4, 2022**.

---

## Task 1: Connect to the Command Host

In this task, you connect to an Amazon Elastic Compute Cloud (Amazon EC2) instance containing a database client, which you will use to connect to a database. This instance will be referred to as the **Command Host**.

### Step 1: Access the EC2 Instance

1. In the **AWS Management Console**, choose the **Services** menu.
2. Choose **Compute**, and then choose **EC2**.
3. In the left navigation menu, choose **Instances**.
4. Next to the instance labelled **Command Host**, select the check box and then choose **Connect**.

> **Note:** If you do not see the Command Host, the lab is probably still being provisioned, or you might be using another Region.

### Step 2: Connect via Session Manager

1. For **Connect to instance**, choose the **Session Manager** tab.
2. Choose **Connect** to open a terminal window.

> **Note:** If the **Connect** button is not available, wait for a few minutes and try again.

### Step 3: Configure the Terminal

To configure the terminal to access all required tools and resources, run the following commands:

```bash
sudo su
cd /home/ec2-user/
```

> **Tips:**
> - Copy and paste the command into the Session Manager terminal window.
> - If you are using a Windows system, press **Shift+Ctrl+V** to paste the command.

### Step 4: Connect to the Database Server

To connect to the database server, run the following command. A password was configured when the database was installed.

```bash
mysql -u root --password='re:St@rt!9'
```

> **Tip:** At any stage of the lab, if the Session Manager window is not responsive or if you need to reconnect to the database instance, then follow these steps:
> 1. Close the Session Manager window, and try to reconnect using the previous steps.
> 2. Run the following commands in the terminal:
>    ```bash
>    sudo su
>    cd /home/ec2-user/
>    mysql -u root --password='re:St@rt!9'
>    ```

---

## Task 2: Query the World Database

In this task, you will query the `world` database by using various `SELECT` statements and database functions.

### Step 1: Show Existing Databases

To show the existing databases, run the following query:

```sql
SHOW DATABASES;
```

Verify that a database named `world` is available. If the `world` database is not available, then contact your instructor.

### Step 2: Review the Country Table

To review the table schema, data, and number of rows in the `country` table, run the following query:

```sql
SELECT * FROM world.country;
```

### Step 3: Filter Records with WHERE and AND

By reducing the number of records, the result set would be smaller and easier to work with. To limit the number of records returned, you can use a `WHERE` clause to define the conditions that records must match.

Use the `AND` operator to combine two conditions. Each record is checked against both conditions before it's included in the result set. You can use the `>` operator and `=` operator to query values that are greater than or equal to a certain value. Similarly, you can combine the `<` operator and `=` operator to query values that are less than or equal to a certain value.

To reduce the number of records in the result set by using a `WHERE` clause and the `AND` operator, run the following query:

```sql
SELECT Name, Capital, Region, SurfaceArea, Population
FROM world.country
WHERE Population >= 50000000 AND Population <= 100000000;
```

### Step 4: Use the BETWEEN Operator

When searching for records by using a range condition, you can use the `BETWEEN` operator instead of the `>=` operator and `<=` operator. By using the `BETWEEN` operator, the query is easier to read. Note that the operator is **inclusive**, meaning that the beginning and ending values are included.

To return the same records as the previous result set by using the `BETWEEN` operator, run the following query:

```sql
SELECT Name, Capital, Region, SurfaceArea, Population
FROM world.country
WHERE Population BETWEEN 50000000 AND 100000000;
```

### Step 5: Use LIKE with Wildcards and SUM

You can use the `LIKE` function to search for a string pattern. The following query will return records that include the string `Europe` in the `Region` column. The percent symbol (`%`) is a wildcard character that represents any number of characters before or after the word `Europe`. The query will aggregate the population of all European countries by using the `SUM` function.

To return the population of all European countries by using the `LIKE` function and `SUM` function, run the following query:

```sql
SELECT SUM(Population)
FROM world.country
WHERE Region LIKE '%Europe%';
```

### Step 6: Use Column Aliases with AS

In the previous query, the `SELECT` clause included a `SUM` function. In the following query, the `SUM` function is still used to calculate the total population of Europe. The query also includes a **column alias**, which makes the output easier to read. To define the column alias, the `AS` command is used in the `SELECT` statement.

To return the same information as the previous query with the column alias, run the following query:

```sql
SELECT SUM(Population) AS 'Europe Population Total'
FROM world.country
WHERE Region LIKE '%Europe%';
```

> **Note on SQL Case Sensitivity:** SQL is not a case-sensitive language. You can use either `SELECT` or `select` when writing a query. However, databases that you query might be configured with a case-sensitive collation. If the database was case sensitive, you would not be able to query a column named `Population` by using the following:
> ```sql
> SELECT population FROM world.country
> ```
> Even though the database used in this lab is not case sensitive, we recommend making your queries consistent with the naming convention that is used in the database.

### Step 7: Use Functions in the WHERE Clause

The following example demonstrates how to perform a case-sensitive search. Depending on the database configuration, when comparing `Central` to `central`, the outcome might be `false`, because the strings don't use the same case. To solve this problem, you can use the `LOWER` function in the `WHERE` clause to compare the strings both as lowercase.

To perform a case-sensitive search by using the `LOWER` function, run the following query:

```sql
SELECT Name, Capital, Region, SurfaceArea, Population
FROM world.country
WHERE LOWER(Region) LIKE '%central%';
```

---

## Challenge Task

Write a query to return the sum of the surface area and sum of the population of North America.

> **Hint:** Query the table first to determine which columns and operators to use.

<details>
<summary>Click to reveal the solution</summary>

```sql
SELECT SUM(SurfaceArea) AS 'N. America Surface Area',
       SUM(Population) AS 'N. America Population'
FROM world.country
WHERE Region = 'North America';
```

</details>

---

## Lab Complete

You have successfully completed this lab! You have learned how to:

- Use the `WHERE` clause to filter records
- Use the `AND` operator to combine multiple conditions
- Use the `BETWEEN` operator for inclusive range searches
- Use the `LIKE` operator with wildcard characters (`%`) for pattern matching
- Use the `AS` operator to create readable column aliases
- Use aggregate functions (`SUM`) in `SELECT` statements
- Use functions (`LOWER`) in `WHERE` clauses for case-insensitive searches

---

*End of Lab Document*
