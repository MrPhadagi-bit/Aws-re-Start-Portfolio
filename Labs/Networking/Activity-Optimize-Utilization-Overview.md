# Activity: Optimize Utilization

## Activity Overview

In this activity, you will optimize the AWS resources that are used to run the Café web application. Specifically, you will accomplish the following optimization tasks:

- **Uninstall the decommissioned local database** from the Café instance to decrease the instance's storage requirements
- **Change the instance type to t3.micro** to reduce overall AWS service costs

This optimization activity demonstrates practical cost management strategies following the migration to Amazon RDS in a prior activity.

### Resource Optimization Topology

**Before Optimization:**
- EC2 Instance Type: t3.small
- Database: Local MariaDB + Amazon RDS (decommissioned database still consuming storage)
- Storage: 40 GB (including 20 GB occupied by the local database)

**After Optimization:**
- EC2 Instance Type: t3.micro
- Database: Amazon RDS only
- Storage: 20 GB (local database removed)

---

## Activity Objectives

After completing this activity, you will be able to:

- ✅ Optimize an Amazon Elastic Compute Cloud (Amazon EC2) instance to reduce costs
- ✅ Use the AWS Pricing Calculator to estimate AWS service costs
- ✅ Identify and implement cost-saving opportunities in AWS infrastructure
- ✅ Use the AWS Command Line Interface (AWS CLI) to manage EC2 instances
- ✅ Calculate projected cost savings from resource optimization

---

## Business Case Relevance

### Scenario

A new business requirement for Café: **Optimize resources to reduce AWS service costs**

#### Background

After the migration to Amazon Relational Database Service (Amazon RDS) was completed in a prior activity, Sofîa identified several optimization opportunities that could significantly reduce AWS service costs for the Café web application.

#### Optimization Opportunities Identified

1. **Decommissioned Local Database Removal**
   - The local MariaDB database on the EC2 instance is no longer in use
   - Uninstalling it will free up 20 GB of storage
   - This reduces both storage costs and CPU utilization requirements

2. **Instance Downsizing**
   - With the database process no longer running on the instance, a smaller instance type can handle the workload
   - Downsizing from t3.small to t3.micro will significantly reduce compute costs
   - The application performance will remain unaffected since database operations are now handled by RDS

#### Your Role

In this activity, you will take on the role of **Sofîa** and work on optimizing the Café instance to achieve the following benefits:
- Reduced monthly AWS service costs
- More efficient resource utilization
- Maintained application performance with leaner infrastructure

---

## Activity Steps

### Duration
**Estimated time to complete: 50 minutes**

### Task Breakdown

#### **Task 1: Optimize the Website to Reduce Costs** (30 minutes)

**1.1 Connect to the Café Instance via SSH**
- Establish a Secure Shell (SSH) connection to the Café EC2 instance
- Download and configure access credentials (PPK file for Windows, PEM file for macOS/Linux)
- Note the instance's Public IP address for connection

**1.2 Connect to the CLI Host Instance via SSH**
- Establish a second SSH connection to the CLI Host instance
- Keep both connections open (in separate windows) for the duration of this task
- Configure AWS CLI credentials on the CLI Host

**1.3 Uninstall MariaDB and Resize the Instance**
- Stop the local MariaDB database service
- Remove MariaDB server from the Café instance
- Retrieve the CafeInstance Instance ID using AWS CLI
- Stop the Café EC2 instance
- Modify the instance type from t3.small to t3.micro
- Start the instance and verify it reaches "running" state
- Test the Café website to ensure functionality after optimization

#### **Task 2: Use AWS Pricing Calculator to Estimate Costs** (20 minutes)

**2.1 Calculate Costs Before Optimization**
- Configure AWS Pricing Calculator for the original topology
- Add EC2 t3.small instance with 40 GB storage
- Add RDS db.t3.micro MariaDB instance with 20 GB storage
- Export and record the total estimated monthly cost

**2.2 Calculate Costs After Optimization**
- Modify the calculator estimate to reflect optimizations
- Change EC2 instance type to t3.micro
- Reduce storage to 20 GB
- Export and record the new total estimated monthly cost

**2.3 Estimate Projected Cost Savings**
- Calculate the monthly cost difference
- Document savings achieved through optimization
- Verify the cost reduction benefits

---

## Key AWS Services Used

| Service | Purpose | Configuration |
|---------|---------|----------------|
| **Amazon EC2** | Compute resource for Café web application | t3.small → t3.micro (optimized) |
| **Amazon RDS** | Relational database service | db.t3.micro with MariaDB |
| **AWS CLI** | Command-line tool for AWS resource management | Used for instance management |
| **AWS Pricing Calculator** | Cost estimation tool | Used to calculate before/after costs |

---

## Expected Outcomes

### Cost Savings Achievement

By completing this activity, you will achieve significant cost reductions:

**Before Optimization (Monthly):**
- Amazon RDS service: ~$14.71
- Amazon EC2 service: ~$20.89
- **Total: ~$35.60**

**After Optimization (Monthly):**
- Amazon EC2 service: ~$10.47 (downsized)
- Amazon RDS service: ~$14.71 (unchanged)
- **Total: ~$25.18**

**Overall Monthly Savings: ~$10.42** (29% reduction)

---

## Prerequisites

- AWS account with appropriate permissions
- Basic understanding of EC2, RDS, and AWS CLI
- SSH client installed (PuTTY for Windows; Terminal for macOS/Linux)
- Web browser for AWS Pricing Calculator access
- Access to AWS Management Console

---

## Important Notes

⚠️ **Pricing Information**
- Pricing examples shown in this activity are current as of April 2020
- Refer to the official AWS website for current pricing by service
- Actual costs may vary based on region, usage patterns, and current pricing models

ℹ️ **Regional Considerations**
- All resources should be deployed in the same region
- Note the region where instances are running (e.g., us-east-1, eu-west-2)
- Regional pricing may differ

---

## Success Criteria

Upon successful completion of this activity, you will have:

- ✅ Successfully removed the decommissioned local database from the Café instance
- ✅ Downsized the EC2 instance from t3.small to t3.micro
- ✅ Verified that the Café web application remains functional after optimization
- ✅ Calculated cost estimates using AWS Pricing Calculator
- ✅ Documented projected monthly cost savings of over $10
- ✅ Demonstrated practical knowledge of AWS cost optimization

---

## Activity Completion

Upon successful completion of all tasks, the Café infrastructure will be optimized for cost efficiency while maintaining full application functionality. Martha and Frank will benefit from the reduced AWS service costs resulting from Sofîa's optimization initiative.

**Activity Status:** Ready to begin

---

*Last Updated: 2024*  
*AWS Training & Certification Activity*
