# Migrating to Amazon RDS: Lab Overview

## Introduction

In this lab, you migrate the café web application to use a fully managed **Amazon Relational Database Service (Amazon RDS)** database (DB) instance instead of a local database instance.

You begin by generating some data on the existing database. This data is migrated to the new Amazon RDS instance.

During the migration process, you build the required components, including two private subnets in different Availability Zones, a security group for the database instance, and the RDS DB instance itself. After the database has been migrated, you reconfigure the café application to use the Amazon RDS instance instead of a local database.

---

## Architecture Overview

### Starting Architecture (Before Migration)

The following diagram illustrates the topology of the café web application runtime environment **before** the migration:


![Imgaine](https://github.com/MrPhadagi-bit/ppppp1/blob/main/StartingArchitecture.png?raw=true)


**Key characteristics of the starting architecture:**
- The application database runs in an **Amazon EC2** Linux, Apache, MySQL, and PHP (**LAMP**) instance along with the application code.
- The instance has a **T3 small** instance type and runs in a **public subnet** so that internet clients can access the website.
- A **CLI Host instance** resides in the same subnet to facilitate administration using the **AWS Command Line Interface (AWS CLI)**.

---

### Final Architecture (After Migration)

The following diagram illustrates the topology of the café web application runtime environment **after** the migration:


![Imgaine](https://github.com/MrPhadagi-bit/ppppp1/blob/main/FinalArchitecture.png?raw=true)


**Key characteristics of the final architecture:**
- The local café database is migrated to an **Amazon RDS database** that resides **outside** the EC2 instance.
- The Amazon RDS database is deployed in the **same VPC** as the EC2 instance.
- Two **private subnets** in different Availability Zones provide high availability.
- A **database subnet group** spans both private subnets.
- A dedicated **security group** controls database access, allowing only the café application to connect.

---

## Lab Objectives

After completing this lab, you will be able to:

| # | Objective |
|---|-----------|
| 1 | **Create an Amazon RDS MariaDB instance** by using the AWS CLI. |
| 2 | **Migrate data** from a MariaDB database on an EC2 instance to an Amazon RDS MariaDB instance. |
| 3 | **Monitor** the Amazon RDS instance by using **Amazon CloudWatch** metrics. |

---

## Prerequisites & Initial Setup

Before starting the migration, ensure you have the following values from your lab environment:

| Parameter | Description | Example |
|-----------|-------------|---------|
| `CafeInstanceURL` | Public URL of the café web application | `34.55.102.33/cafe` |
| `AccessKey` | AWS Access Key ID for CLI authentication | `AKIA...` |
| `SecretKey` | AWS Secret Access Key for CLI authentication | `wJalrXUtnF...` |
| `LabRegion` | AWS Region where resources are deployed | `us-west-2` |
| `CafeVpcID` | ID of the VPC containing the café application | `vpc-0abc123...` |
| `CafeSecurityGroupID` | ID of the security group attached to CafeInstance | `sg-012345...` |
| `CafeInstanceAZ` | Availability Zone of the CafeInstance | `us-west-2a` |

> **Note:** Copy these values to a text editor for easy reference throughout the lab.

---

## Lab Tasks Overview

### Task 1: Generate Order Data
Place orders on the café website to create data in the existing local database. This data will be migrated later.

- Navigate to `CafeInstanceURL` in a browser.
- Choose **Menu**, add at least one of each item to your order, then choose **Submit Order**.
- Go to **Order History** and record the number of orders placed.

---

### Task 2: Create Amazon RDS Instance via AWS CLI

#### 2.1 Connect to CLI Host
Use **EC2 Instance Connect** to connect to the CLI Host instance.

#### 2.2 Configure AWS CLI
```bash
aws configure
```
Enter the following when prompted:
- **AWS Access Key ID:** `AccessKey`
- **AWS Secret Access Key:** `SecretKey`
- **Default region name:** `LabRegion`
- **Default output format:** `json`

#### 2.3 Create Prerequisite Components

**Security Group (CafeDatabaseSG):**
```bash
# Create security group
aws ec2 create-security-group \
  --group-name CafeDatabaseSG \
  --description "Security group for Cafe database" \
  --vpc-id <CafeInstance VPC ID>

# Add inbound rule for MySQL (Port 3306)
aws ec2 authorize-security-group-ingress \
  --group-id <CafeDatabaseSG Group ID> \
  --protocol tcp --port 3306 \
  --source-group <CafeSecurityGroup Group ID>
```

**Private Subnets:**
| Subnet | CIDR Block | Availability Zone | Purpose |
|--------|-----------|-------------------|---------|
| CafeDB Private Subnet 1 | `10.200.2.0/23` | `CafeInstanceAZ` | Hosts the RDS DB instance |
| CafeDB Private Subnet 2 | `10.200.10.0/23` | Different AZ (e.g., `us-west-2b`) | Required for DB subnet group |

```bash
# Create Private Subnet 1
aws ec2 create-subnet \
  --vpc-id <CafeInstance VPC ID> \
  --cidr-block 10.200.2.0/23 \
  --availability-zone <CafeInstance Availability Zone>

# Create Private Subnet 2
aws ec2 create-subnet \
  --vpc-id <CafeInstance VPC ID> \
  --cidr-block 10.200.10.0/23 \
  --availability-zone <availability-zone>
```

**DB Subnet Group:**
```bash
aws rds create-db-subnet-group \
  --db-subnet-group-name "CafeDB Subnet Group" \
  --db-subnet-group-description "DB subnet group for Cafe" \
  --subnet-ids <Cafe Private Subnet 1 ID> <Cafe Private Subnet 2 ID> \
  --tags "Key=Name,Value=CafeDatabaseSubnetGroup"
```

#### 2.4 Create RDS MariaDB Instance

| Configuration | Value |
|---------------|-------|
| DB Instance Identifier | `CafeDBInstance` |
| Engine | `MariaDB` |
| Engine Version | `10.11.11` |
| DB Instance Class | `db.t3.micro` |
| Allocated Storage | `20 GB` |
| Availability Zone | `CafeInstanceAZ` |
| DB Subnet Group | `CafeDB Subnet Group` |
| VPC Security Groups | `CafeDatabaseSG` |
| Public Accessibility | `No` |
| Master Username | `root` |
| Master Password | `Re:Start!9` |

```bash
aws rds create-db-instance \
  --db-instance-identifier CafeDBInstance \
  --engine mariadb \
  --engine-version 10.11.11 \
  --db-instance-class db.t3.micro \
  --allocated-storage 20 \
  --availability-zone <CafeInstance Availability Zone> \
  --db-subnet-group-name "CafeDB Subnet Group" \
  --vpc-security-group-ids <CafeDatabaseSG Group ID> \
  --no-publicly-accessible \
  --master-username root --master-user-password 'Re:Start!9'
```

> **Important:** The database may take up to **10 minutes** to become available. Monitor status with:
> ```bash
> aws rds describe-db-instances \
>   --db-instance-identifier CafeDBInstance \
>   --query "DBInstances[*].[Endpoint.Address,AvailabilityZone,PreferredBackupWindow,BackupRetentionPeriod,DBInstanceStatus]"
> ```

---

### Task 3: Migrate Data to Amazon RDS

#### 3.1 Connect to CafeInstance
Use EC2 Instance Connect to connect to the CafeInstance.

#### 3.2 Backup Local Database
```bash
mysqldump --user=root --password='Re:Start!9' \
  --databases cafe_db --add-drop-database > cafedb-backup.sql
```

> This generates SQL statements to reproduce the schema and data of the original `cafe_db` database.

#### 3.3 Download RDS CA Certificate
```bash
curl -o global-bundle.pem https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem
```

#### 3.4 Restore Backup to RDS
```bash
mysql --user=root --password='Re:Start!9' \
  --host=<RDS Instance Database Endpoint Address> \
  --ssl-ca=./global-bundle.pem \
  < cafedb-backup.sql
```

#### 3.5 Verify Migration
```bash
mysql --user=root --password='Re:Start!9' \
  --host=<RDS Instance Database Endpoint Address> \
  --ssl-ca=./global-bundle.pem \
  cafe_db
```

Then run:
```sql
select * from product;
```

Verify that the data matches the orders placed in Task 1.

---

### Task 4: Reconfigure Application

Update the application to use the RDS instance instead of the local database.

1. Navigate to **AWS Systems Manager** → **Parameter Store**.
2. Select the parameter `/cafe/dbUrl`.
3. Choose **Edit**.
4. Replace the value with the **RDS Instance Database Endpoint Address**.
5. Choose **Save changes**.

**Test the website:**
- Open `CafeInstanceURL` in a new browser window.
- Choose **Order History** and confirm the order count matches the pre-migration count.
- (Optional) Place new orders to verify functionality.

---

### Task 5: Monitor with CloudWatch

1. Navigate to **Amazon RDS Console** → **Databases** → `cafedbinstance`.
2. Choose the **Monitoring** tab.

**Key Metrics Available:**

| Metric | Description |
|--------|-------------|
| **CPUUtilization** | Percentage of CPU utilization |
| **DatabaseConnections** | Number of active database connections |
| **FreeStorageSpace** | Amount of available storage space |
| **FreeableMemory** | Amount of available RAM |
| **WriteIOPS** | Average disk write I/O operations per second |
| **ReadIOPS** | Average disk read I/O operations per second |

**Monitoring Exercise:**
1. Open an interactive SQL session to the RDS instance from CafeInstance:
   ```bash
   mysql --user=root --password='Re:Start!9' \
     --host=<RDS Instance Database Endpoint Address> \
     --ssl-ca=./global-bundle.pem \
     cafe_db
   ```
2. In the RDS console, observe the **DatabaseConnections** graph — it should show **1 connection**.
3. Exit the session (`exit`) and refresh the graph after 1 minute — it should show **0 connections**.

---

## Summary

| Step | Action | Status |
|------|--------|--------|
| ✅ | Generated order data on local database | Task 1 |
| ✅ | Created RDS MariaDB instance via AWS CLI | Task 2 |
| ✅ | Migrated data from EC2 to RDS | Task 3 |
| ✅ | Reconfigured application to use RDS | Task 4 |
| ✅ | Monitored RDS with CloudWatch metrics | Task 5 |

---

## Duration

This lab requires approximately **60 minutes** to complete.

## Key Takeaways

- **Amazon RDS** simplifies database management by offloading administration tasks such as provisioning, patching, backup, and recovery.
- **AWS CLI** enables infrastructure-as-code style provisioning of RDS resources, including security groups, subnets, and the database instance itself.
- **Data migration** from a local MariaDB instance to Amazon RDS can be accomplished using standard MySQL tools (`mysqldump` and `mysql`).
- **SSL/TLS encryption** is required by default for Amazon RDS connections.
- **Amazon CloudWatch** provides real-time monitoring of database performance metrics.
- **AWS Systems Manager Parameter Store** allows secure, centralized management of application configuration, making database endpoint updates seamless without code changes.
