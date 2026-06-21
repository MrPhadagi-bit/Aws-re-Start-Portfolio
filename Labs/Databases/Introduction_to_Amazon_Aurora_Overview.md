# Introduction to Amazon Aurora: Overview

## Lab Overview

This lab introduces you to **Amazon Aurora** and provides you with a basic understanding of how to use Aurora. You will follow the steps to create an Aurora instance and then connect to it.

---

## Topics Covered

After completing this lab, you will be able to:

- Create an Aurora instance
- Connect to a pre-created Amazon Elastic Compute Cloud (Amazon EC2) instance
- Configure the Amazon EC2 instance to connect to Aurora
- Query the Aurora instance

---

## Duration

This lab requires approximately **40 minutes** to complete.

---

## Prerequisites

- Access to the AWS Management Console
- A pre-created lab environment with a VPC, subnet group, and security groups
- A pre-created EC2 instance named **Command Host**

---

## Task 1: Create an Aurora Instance

In this task, you create an Aurora database (DB) instance.

### Step 1: Navigate to RDS

1. At the top of the AWS Management Console, in the search bar, search for and choose **RDS**.
2. In the left navigation menu, choose **Databases**.
3. Choose **Create database**.

### Step 2: Configure Database Creation Method

| Setting | Value |
|---------|-------|
| Database creation method | **Standard create** |

### Step 3: Choose Engine Options

| Setting | Value |
|---------|-------|
| Engine type | **Aurora (MySQL Compatible)** |
| Engine version | Default for major version **8.0** |
| Templates | **Dev/Test** |

> **Note:** The Dev/Test template is suitable for development and testing environments, optimizing costs and configurations for non-production workloads.

### Step 4: Configure Settings

| Setting | Value |
|---------|-------|
| DB cluster identifier | `aurora` |
| Master username | `admin` |
| Master password | `admin123` |
| Confirm password | `admin123` |

### Step 5: Configure Instance

| Setting | Value |
|---------|-------|
| DB instance class | **Burstable classes (includes t classes)** |
| Instance type | `db.t3.medium` |

### Step 6: Configure Availability & Durability

| Setting | Value |
|---------|-------|
| Multi-AZ deployment | **Don't create an Aurora Replica** |

> **Note:** Amazon RDS Multi-AZ deployments provide enhanced availability and durability for DB instances, making them a natural fit for production database workloads. When you provision a Multi-AZ DB instance, Amazon RDS automatically creates a primary DB instance and synchronously replicates the data to a standby instance in a different Availability Zone. Since this is a lab environment, you do not need to perform a multi-AZ deployment.

### Step 7: Configure Connectivity

| Setting | Value |
|---------|-------|
| Virtual private cloud (VPC) | **LabVPC** |
| Subnet group | **dbsubnetgroup** |
| Public access | **No** |
| VPC security group | **Choose existing** |
| Existing VPC security groups | Remove **default**, select **DBSecurityGroup** |

> **Note:** Subnets are segments of a virtual private cloud (VPC) IP address range that you designate to group your resources based on security and operational needs. A DB subnet group is a collection of subnets (typically private) that you create in a VPC and that you then designate for your DB instances. The aurora subnet group was created for you when you launched the lab using AWS CloudFormation.

> **Consider:** You can use the Amazon Virtual Private Cloud (Amazon VPC) service to launch AWS resources into a virtual network that you've defined. This virtual network closely resembles a traditional network that you'd operate in your own data center, with the benefits of using the scalable infrastructure of AWS.

### Step 8: Configure Monitoring

- Clear the checkbox for **Enable Enhanced monitoring**.

### Step 9: Configure Additional Settings

1. Expand the **Additional configuration** section.
2. For **Initial database name**, enter `world`.

### Step 10: Configure Encryption

- Clear the checkbox for **Enable encryption**.

> **Note:** You can encrypt your Amazon RDS instances and snapshots at rest by enabling the encryption option for your RDS DB instance. Data that is encrypted at rest includes the underlying storage for a DB instance, its automated backups, read replicas, and snapshots.

### Step 11: Configure Maintenance

- Clear the checkbox for **Enable auto minor version upgrade**.

### Step 12: Create the Database

1. Scroll to the bottom of the screen.
2. Choose **Create database**.

> **Note:** Your Aurora DB instance is in the process of launching and can take up to 5 minutes to launch. However, you can continue to the next task.

> If you encounter the **Suggested add-ons for aurora** pop-up window, you can ignore it and choose **Close**.

### Expected Result

Once the database has completed creating, you should see a similar notification message:

> **Successfully created database aurora.**

**Task complete:** You have successfully created an Aurora instance.

---

## Task 2: Connect to an Amazon EC2 Linux Instance

In this task, you log into your Amazon EC2 Linux instance. This instance was launched for you when you started your lab using CloudFormation.

### Step 1: Navigate to EC2

1. At the top of the AWS Management Console, in the search bar, search for and choose **EC2**.
2. In the left navigation menu, choose **Instances**.

### Step 2: Connect to the Instance

1. Next to the instance labelled **Command Host**, select the checkbox.
2. Choose **Connect**.

> **Note:** If you do not see the **Command Host** instance, the lab is possibly still being provisioned, or you may be using another Region.

### Step 3: Use Session Manager

1. For **Connect to instance**, choose **Session Manager**.
2. Choose **Connect** to open a terminal window.

> **Note:** If the **Connect** button is not available, wait for a few minutes and try again.

**Task complete:** You have successfully connected to the Amazon EC2 instance named Command Host.

---

## Task 3: Configure the Amazon EC2 Linux Instance to Connect to Aurora

In this task, you use the `yum` package manager to install the MariaDB client and then configure the Amazon EC2 Linux instance to connect to the Aurora database.

### Step 1: Install the MariaDB Client

Run the following command to install the MariaDB client:

```bash
sudo yum install mariadb -y
```

**Expected output:**

```
******************************
**** This is OUTPUT ONLY. ****
******************************

Install  1 Package

Total download size: 8.8 M
Installed size: 49 M
Downloading packages:
mariadb-5.5.68-1.amzn2.0.1.x86_64.rpm                    |  8.8 MB  00:00:00
Running transaction check
Running transaction test
Transaction test succeeded
Running transaction
    Installing : 1:mariadb-5.5.68-1.amzn2.0.1.86_64       1/1
    Verifying  : 1:mariadb-5.5.68-1.amzn2.0.1.x86_64      1/1

Installed:
mariadb.x86_64 1:5.5.68-1.amzn2.0.1

Complete!
```

> The MariaDB client is what you use in later steps to connect to the Aurora instance that you just created.

### Step 2: Retrieve the Aurora Endpoint

1. Using a different browser tab, go back to the AWS Management Console and in the search bar, search for and choose **RDS**.
2. In the left navigation menu, choose **Databases**.
3. Wait for `aurora-instance-1` to display **Available**.
4. Choose **aurora**.
5. Choose the **Connectivity & security** tab.
6. In the **Endpoints** section, copy the **Endpoint name** for the Writer instance to your text editor.

The endpoint should look similar to the following:

```
mydbcluster.cluster-123456789012.us-west-2.rds.amazonaws.com
```

> **Note:** An endpoint is represented as an Aurora specific URL that contains a host address and a port. The following types of endpoints are available from an Aurora DB cluster:

#### Cluster Endpoint

A cluster endpoint for an Aurora DB cluster connects to the current primary DB instance for that DB cluster. This endpoint is the only one that can perform write operations such as DDL statements. Because of this, the cluster endpoint is the one that you connect to when you first set up a cluster or when your cluster contains only a single DB instance.

Each Aurora DB cluster has one cluster endpoint and one primary DB instance.

You use the cluster endpoint for all write operations on the DB cluster, including inserts, updates, deletes, and DDL changes. You can also use the cluster endpoint for read operations, such as queries.

The cluster endpoint provides failover support for read/write connections to the DB cluster. If the current primary DB instance of a DB cluster fails, Aurora automatically fails over to a new primary DB instance. During a failover, the DB cluster continues to serve connection requests to the cluster endpoint from the new primary DB instance, with minimal interruption of service.

**Example:** `mydbcluster.cluster-123456789012.us-west-2.rds.amazonaws.com:3306`

#### Reader Endpoint

A reader endpoint for an Aurora DB cluster connects to one of the available Aurora replicas for that DB cluster. Each Aurora DB cluster has one reader endpoint. If there is more than one Aurora replica, the reader endpoint directs each connection request to one of the Aurora replicas.

The reader endpoint provides load-balancing support for read-only connections to the DB cluster. Use the reader endpoint for read operations, such as queries. You can't use the reader endpoint for write operations.

The DB cluster distributes connection requests to the reader endpoint among the available Aurora replicas. If the DB cluster contains only a primary DB instance, the reader endpoint serves connection requests from the primary DB instance. If one or more Aurora replicas are created for that DB cluster, subsequent connections to the reader endpoint are load balanced among the replicas.

**Example:** `mydbcluster.cluster-ro-123456789012.us-west-2.rds.amazonaws.com:3306`

### Step 3: Connect to the Aurora Database

Run the following command, replacing `<endpoint_goes_here>` with the endpoint that you copied:

```bash
mysql -u admin --password='admin123' -h <endpoint_goes_here>
```

Your command should look similar to the following:

```bash
mysql -u admin --password='admin123' -h mydbcluster.cluster-123456789012.us-west-2.rds.amazonaws.com
```

#### MySQL Command-Line Client Options

| Switch | Description |
|--------|-------------|
| `-u` or `--user` | The MySQL username used to connect to a database instance. |
| `-p` or `--password` | The MySQL password used to connect to a database instance. |
| `-h` or `--host` | The host address of the database engine. |

**Expected output:**

```
******************************
**** This is OUTPUT ONLY. ****
******************************
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MySQL connection id is 173
Server version: 8.0.28 Source distribution
Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.
Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MySQL [(none)]>
```

**Task complete:** You have successfully configured the Amazon EC2 Linux instance to connect to Aurora.

---

## Task 4: Create a Table and Insert and Query Records

In this task, you learn how to create a table in a database, load data, and run a query.

### Step 1: List Available Databases

Run the following command:

```sql
SHOW DATABASES;
```

**Expected output:**

```
******************************
**** This is OUTPUT ONLY. ****
******************************
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
| world              |
+--------------------+
5 rows in set (0.02 sec)

MySQL [(none)]>
```

### Step 2: Switch to the World Database

Run the following command:

```sql
USE world;
```

**Expected output:**

```
******************************
**** This is OUTPUT ONLY. ****
******************************
Database changed

MySQL [world]>
```

### Step 3: Create a New Table

Run the following command to create a `country` table:

```sql
CREATE TABLE `country` (
  `Code` CHAR(3) NOT NULL DEFAULT '',
  `Name` CHAR(52) NOT NULL DEFAULT '',
  `Continent` enum('Asia','Europe','North America','Africa','Oceania','Antarctica','South America') NOT NULL DEFAULT 'Asia',
  `Region` CHAR(26) NOT NULL DEFAULT '',
  `SurfaceArea` FLOAT(10,2) NOT NULL DEFAULT '0.00',
  `IndepYear` SMALLINT(6) DEFAULT NULL,
  `Population` INT(11) NOT NULL DEFAULT '0',
  `LifeExpectancy` FLOAT(3,1) DEFAULT NULL,
  `GNP` FLOAT(10,2) DEFAULT NULL,
  `GNPOld` FLOAT(10,2) DEFAULT NULL,
  `LocalName` CHAR(45) NOT NULL DEFAULT '',
  `GovernmentForm` CHAR(45) NOT NULL DEFAULT '',
  `Capital` INT(11) DEFAULT NULL,
  `Code2` CHAR(2) NOT NULL DEFAULT '',
  PRIMARY KEY (`Code`)
);
```

**Expected output:**

```
******************************
**** This is OUTPUT ONLY. ****
******************************

Query OK, 0 rows affected, 7 warnings (0.02 sec)

MySQL [world]>
```

### Step 4: Insert Records

Run the following commands to insert records into the `country` table:

```sql
INSERT INTO `country` VALUES ('GAB','Gabon','Africa','Central Africa',267668.00,1960,1226000,50.1,5493.00,5279.00,'Le Gabon','Republic',902,'GA');

INSERT INTO `country` VALUES ('IRL','Ireland','Europe','British Islands',70273.00,1921,3775100,76.8,75921.00,73132.00,'Ireland/Éire','Republic',1447,'IE');

INSERT INTO `country` VALUES ('THA','Thailand','Asia','Southeast Asia',513115.00,1350,61399000,68.6,116416.00,153907.00,'Prathet Thai','Constitutional Monarchy',3320,'TH');

INSERT INTO `country` VALUES ('CRI','Costa Rica','North America','Central America',51100.00,1821,4023000,75.8,10226.00,9757.00,'Costa Rica','Republic',584,'CR');

INSERT INTO `country` VALUES ('AUS','Australia','Oceania','Australia and New Zealand',7741220.00,1901,18886000,79.8,351182.00,392911.00,'Australia','Constitutional Monarchy, Federation',135,'AU');
```

**Expected output:**

```
******************************
**** This is OUTPUT ONLY. ****
******************************
Query OK, 1 row affected (0.00 sec)

MySQL [world]>
```

### Step 5: Query the Table

Run the following `SELECT` statement:

```sql
SELECT * FROM country WHERE GNP > 35000 and Population > 10000000;
```

**Expected output:**

```
******************************
**** This is OUTPUT ONLY. ****
******************************
+------+-----------+-----------+---------------------------+-------------+-----------+------------+----------------+-----------+-----------+--------------+------------------------------------+---------+-------+
| Code | Name      | Continent | Region                    | SurfaceArea | IndepYear | Population | LifeExpectancy | GNP       | GNPOld    | LocalName    | GovernmentForm                      | Capital | Code2 |
+------+-----------+-----------+---------------------------+-------------+-----------+------------+----------------+-----------+-----------+--------------+------------------------------------+---------+-------+
| AUS  | Australia | Oceania   | Australia and New Zealand |  7741220.00 |      1901 |   18886000 |           79.8 | 351182.00 | 392911.00 | Australia    | Constitutional Monarchy, Federation |     135 | AU    |
| THA  | Thailand  | Asia      | Southeast Asia            |   513115.00 |      1350 |   61399000 |           68.6 | 116416.00 | 153907.00 | Prathet Thai | Constitutional Monarchy             |    3320 | TH    |
+------+-----------+-----------+---------------------------+-------------+-----------+------------+----------------+-----------+-----------+--------------+------------------------------------+---------+-------+
2 rows in set (0.00 sec)

MySQL [world]>
```

The query should return two records for **Australia** and **Thailand**.

**Task complete:** You have successfully created a table named `country`, inserted data into the table, and queried records returning two results.

---

## Conclusion

You have now successfully:

- Created an Aurora instance
- Connected to a pre-created Amazon EC2 instance
- Configured the Amazon EC2 instance to connect to Aurora
- Queried the Aurora instance

**Lab complete!**

---

## Summary of Key Concepts

| Concept | Description |
|---------|-------------|
| **Amazon Aurora** | A fully managed relational database engine compatible with MySQL and PostgreSQL, offering high performance and availability. |
| **Aurora Cluster Endpoint** | Connects to the primary DB instance for read/write operations. Provides automatic failover support. |
| **Aurora Reader Endpoint** | Connects to Aurora replicas for read-only operations. Provides load balancing across replicas. |
| **Multi-AZ Deployment** | Provides enhanced availability by synchronously replicating data to a standby instance in a different Availability Zone. |
| **DB Subnet Group** | A collection of subnets in a VPC designated for DB instances. |
| **VPC Security Groups** | Control inbound and outbound traffic to your DB instances. |
| **MariaDB Client** | A command-line client used to connect to and interact with MySQL-compatible databases like Aurora. |

---

## Appendix: Quick Reference Commands

### Install MariaDB Client
```bash
sudo yum install mariadb -y
```

### Connect to Aurora
```bash
mysql -u admin --password='admin123' -h <endpoint>
```

### List Databases
```sql
SHOW DATABASES;
```

### Select Database
```sql
USE world;
```

### Create Table
```sql
CREATE TABLE `country` (
  `Code` CHAR(3) NOT NULL DEFAULT '',
  `Name` CHAR(52) NOT NULL DEFAULT '',
  `Continent` enum('Asia','Europe','North America','Africa','Oceania','Antarctica','South America') NOT NULL DEFAULT 'Asia',
  `Region` CHAR(26) NOT NULL DEFAULT '',
  `SurfaceArea` FLOAT(10,2) NOT NULL DEFAULT '0.00',
  `IndepYear` SMALLINT(6) DEFAULT NULL,
  `Population` INT(11) NOT NULL DEFAULT '0',
  `LifeExpectancy` FLOAT(3,1) DEFAULT NULL,
  `GNP` FLOAT(10,2) DEFAULT NULL,
  `GNPOld` FLOAT(10,2) DEFAULT NULL,
  `LocalName` CHAR(45) NOT NULL DEFAULT '',
  `GovernmentForm` CHAR(45) NOT NULL DEFAULT '',
  `Capital` INT(11) DEFAULT NULL,
  `Code2` CHAR(2) NOT NULL DEFAULT '',
  PRIMARY KEY (`Code`)
);
```

### Insert Records
```sql
INSERT INTO `country` VALUES ('GAB','Gabon','Africa','Central Africa',267668.00,1960,1226000,50.1,5493.00,5279.00,'Le Gabon','Republic',902,'GA');
INSERT INTO `country` VALUES ('IRL','Ireland','Europe','British Islands',70273.00,1921,3775100,76.8,75921.00,73132.00,'Ireland/Éire','Republic',1447,'IE');
INSERT INTO `country` VALUES ('THA','Thailand','Asia','Southeast Asia',513115.00,1350,61399000,68.6,116416.00,153907.00,'Prathet Thai','Constitutional Monarchy',3320,'TH');
INSERT INTO `country` VALUES ('CRI','Costa Rica','North America','Central America',51100.00,1821,4023000,75.8,10226.00,9757.00,'Costa Rica','Republic',584,'CR');
INSERT INTO `country` VALUES ('AUS','Australia','Oceania','Australia and New Zealand',7741220.00,1901,18886000,79.8,351182.00,392911.00,'Australia','Constitutional Monarchy, Federation',135,'AU');
```

### Query Records
```sql
SELECT * FROM country WHERE GNP > 35000 and Population > 10000000;
```
