# Organizing Data: SQL GROUP BY and Window Functions Lab

## Scenario

The database operations team has created a relational database named `world` containing three tables: `city`, `country`, and `countrylanguage`. You help write a few queries to group records for analysis by using both the `GROUP BY` and `OVER` clauses.

---

## Lab Overview and Objectives

This lab demonstrates how to use some common database functions with the `GROUP BY` and `OVER` clauses.

After completing this lab, you should be able to:

- Use the `GROUP BY` clause with the aggregate function `SUM()`
- Use the `OVER` clause with the `RANK()` window function
- Use the `OVER` clause with the aggregate function `SUM()` and the `RANK()` window function

> **Note:** Sample data in this course is taken from Statistics Finland, general regional statistics, February 4, 2022.

### Prerequisites

When you start the lab, the following resources are already created for you:

- A **Command Host** instance (EC2)
- A `world` database containing three tables: `city`, `country`, and `countrylanguage`

### Duration

This lab requires approximately **45 minutes** to complete.

---

## Task 1: Connect to the Command Host

In this task, you connect to an instance containing a database client, which is used to connect to a database. This instance is referred to as the **Command Host**.

### Step 1: Locate the EC2 Instance

1. In the **AWS Management Console**, choose the **Services** menu.
2. Under **Compute**, choose **EC2**.
3. In the navigation pane, choose **Instances**.
4. Next to the instance labelled **Command Host**, select the checkbox and then choose **Connect**.

> **Note:** If you do not see the Command Host, the lab is possibly still being provisioned, or you may be using another Region.

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
> - If you are using a Windows system, press `Shift + Ctrl + V` to paste the command.

### Step 4: Connect to the Database Server

To connect to the database server, run the following command in the terminal. A password was configured when the database was installed.

```bash
mysql -u root --password='re:St@rt!9'
```

> **Tip:** At any stage of the lab, if the Sessions Manager window is not responsive or if you need to reconnect to the database instance, follow these steps:
> 1. Close the Sessions Manager window, and try to reconnect using the previous steps.
> 2. Run the following commands in the terminal:
>    ```bash
>    sudo su
>    cd /home/ec2-user/
>    mysql -u root --password='re:St@rt!9'
>    ```

---

## Task 2: Query the World Database

In this task, you query the `world` database using various `SELECT` statements and database functions.

### Step 1: Verify Available Databases

To show the existing databases, enter the following command in the terminal:

```sql
SHOW DATABASES;
```

Verify that a database named `world` is available. If the `world` database is not available, contact your instructor.

### Step 2: Review the Country Table

To review the table schema, data, and number of rows in the `country` table, enter the following query:

```sql
SELECT * FROM world.country;
```

### Step 3: Filter and Order Records

To return a list of records where the `Region` is **Australia and New Zealand**, run the following query. This query includes an `ORDER BY` clause that arranges the results by `Population` in descending order.

```sql
SELECT Region, Name, Population
FROM world.country
WHERE Region = 'Australia and New Zealand'
ORDER BY Population DESC;
```

### Step 4: Group Records with GROUP BY and SUM()

You can use the `GROUP BY` clause to group related records together. The following example:
1. Filters records using a `WHERE` clause where the region is equal to **Australia and New Zealand**.
2. Groups the results using a `GROUP BY` clause.
3. Applies the `SUM()` function to the grouped results to generate a total population for that region.

Run the following query in your terminal:

```sql
SELECT Region, SUM(Population)
FROM world.country
WHERE Region = 'Australia and New Zealand'
GROUP BY Region
ORDER BY SUM(Population) DESC;
```

> **Explanation:** This query returns a `SUM()` of the `Population` for the **Australia and New Zealand** region. Because the `WHERE` clause is filtered by `Region`, only the **Australia and New Zealand** records are aggregated.

### Step 5: Running Total with Window Functions

The following example uses a **windowing function** to generate a running total by adding the `Population` of the first record to the `Population` of the second record and subsequent records. This query uses the `OVER()` clause to group the records by `Region` and uses the `SUM()` function to aggregate the records. The output displays the population of a country alongside a running total of the region.

Run the following query in your terminal:

```sql
SELECT
    Region,
    Name,
    Population,
    SUM(Population) OVER (PARTITION BY Region ORDER BY Population) AS 'Running Total'
FROM world.country
WHERE Region = 'Australia and New Zealand';
```

### Step 6: Ranking with RANK() Window Function

The following query groups the records by `Region` and orders them by `Population` with the `OVER()` clause. This query also includes the `RANK()` function to generate a rank number indicating the position of each record in the result set. The `RANK()` function is useful when dealing with large groups of records.

Run the following query in your terminal:

```sql
SELECT
    Region,
    Name,
    Population,
    SUM(Population) OVER (PARTITION BY Region ORDER BY Population) AS 'Running Total',
    RANK() OVER (PARTITION BY Region ORDER BY Population) AS 'Ranked'
FROM world.country
WHERE Region = 'Australia and New Zealand';
```

---

## Challenge Exercise

### Objective

Write a query to **rank the countries in each region by their population from largest to smallest**.

### Hints

- You have to determine whether to use either the `GROUP BY` or `OVER` grouping clause.
- You have to determine whether to use either the `SUM()` or `RANK()` function.

<details>
<summary>Click to reveal the solution</summary>

```sql
SELECT
    Region,
    Name,
    Population,
    RANK() OVER (PARTITION BY Region ORDER BY Population DESC) AS 'Rank'
FROM world.country;
```

**Explanation:**
- We use `RANK()` (not `SUM()`) because we want to rank countries, not aggregate their populations.
- We use `OVER()` (not `GROUP BY`) because we want to see individual rows with their rankings, not collapsed groups.
- `PARTITION BY Region` ensures ranking happens independently within each region.
- `ORDER BY Population DESC` ensures the largest population gets rank #1.

</details>

---

## Summary of Key Concepts

| Concept | Description | Use Case |
|---------|-------------|----------|
| `GROUP BY` | Groups rows that have the same values into summary rows | Aggregate data (e.g., total population per region) |
| `SUM()` | Returns the total sum of a numeric column | Calculate totals, running totals |
| `OVER()` | Defines a window or set of rows for window functions | Perform calculations across a set of table rows related to the current row |
| `RANK()` | Assigns a rank to each row within a partition | Determine the position of a row within a group |
| `PARTITION BY` | Divides the result set into partitions for window functions | Apply window functions independently to each group |

---

## Conclusion

Congratulations! You have now successfully:

- Used the `GROUP BY` clause with the aggregate function `SUM()`
- Used the `OVER` clause with the `RANK()` window function
- Used the `OVER` clause with the aggregate function `SUM()` and the `RANK()` window function

### Lab Complete

You have completed the **Organizing Data** lab. You can now close your Session Manager connection.

---

## Appendix: Quick Reference Commands

```bash
# Connect to Command Host via Session Manager
# (Use AWS Console > EC2 > Instances > Connect > Session Manager)

# Configure terminal
sudo su
cd /home/ec2-user/

# Connect to MySQL database
mysql -u root --password='re:St@rt!9'

# Show databases
SHOW DATABASES;

# Select all from country table
SELECT * FROM world.country;

# Filter, group, and aggregate
SELECT Region, SUM(Population)
FROM world.country
WHERE Region = 'Australia and New Zealand'
GROUP BY Region;

# Window function: Running total
SELECT Region, Name, Population,
       SUM(Population) OVER (PARTITION BY Region ORDER BY Population) AS 'Running Total'
FROM world.country
WHERE Region = 'Australia and New Zealand';

# Window function: Ranking
SELECT Region, Name, Population,
       RANK() OVER (PARTITION BY Region ORDER BY Population DESC) AS 'Rank'
FROM world.country;
```
