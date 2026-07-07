# Managing Storage: Lab Overview

## Introduction

AWS provides multiple ways to manage data on Amazon Elastic Block Store (Amazon EBS) volumes. In this lab, you use the AWS Command Line Interface (AWS CLI) to create snapshots of an EBS volume and configure a scheduler to run Python scripts that delete older snapshots.

In the challenge section of this lab, you are challenged to sync the contents of a directory on an EBS volume to an Amazon Simple Storage Service (Amazon S3) bucket using an Amazon S3 sync command.

---

## Lab Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Amazon VPC                           │
│  ┌───────────────────────────────────────────────────┐  │
│  │              Public Subnet                        │  │
│  │                                                   │  │
│  │   ┌──────────────┐      ┌──────────────┐         │  │
│  │   │ Command Host │      │  Processor   │         │  │
│  │   │  (EC2)       │──────│   (EC2)      │         │  │
│  │   │  Admin Node  │      │  EBS Volume  │         │  │
│  │   └──────────────┘      └──────────────┘         │  │
│  │                                                   │  │
│  └───────────────────────────────────────────────────┘  │
│                          │                              │
│                          ▼                              │
│              ┌──────────────────┐                       │
│              │   Amazon S3      │                       │
│              │   Bucket         │                       │
│              │   (File Storage) │                       │
│              └──────────────────┘                       │
└─────────────────────────────────────────────────────────┘
```

### Environment Components

Your lab environment consists of:
- A **Virtual Private Cloud (VPC)** with a **public subnet**
- Two pre-provisioned **Amazon EC2 instances**:
  - **Command Host**: Used to administer AWS resources, including the Processor instance
  - **Processor**: The target instance for EBS snapshot operations
- An **Amazon S3 bucket** for file synchronization and storage

---

## Lab Objectives

By the end of this lab, you will be able to:

1. **Create and maintain snapshots** for Amazon EC2 instances using AWS CLI
2. **Use Amazon S3 sync** to copy files from an EBS volume to an S3 bucket
3. **Use Amazon S3 versioning** to retrieve deleted files

---

## Lab Tasks Summary

### Task 1: Creating and Configuring Resources
- Create an Amazon S3 bucket for file synchronization
- Attach an IAM instance profile (`S3BucketAccess` role) to the "Processor" EC2 instance

### Task 2: Managing EBS Snapshots
- Connect to the "Command Host" EC2 instance via EC2 Instance Connect
- Identify the EBS volume attached to the "Processor" instance
- Take an initial snapshot of the EBS volume (with instance stopped for consistency)
- Schedule recurring snapshot creation using `cron`
- Run a Python script (`snapshotter_v2.py`) to retain only the last two snapshots

### Task 3: Challenge — Synchronize Files with Amazon S3
- Download and unzip sample files to the "Processor" instance
- Enable versioning on your S3 bucket
- Sync local files to Amazon S3 using `aws s3 sync`
- Delete a local file and use `--delete` to mirror the deletion in S3
- Recover the deleted file using S3 versioning and `aws s3api` commands

---

## Estimated Duration

This lab will require approximately **45 minutes** to complete.

---

## Key AWS Services Used

| Service | Purpose |
|---------|---------|
| **Amazon EC2** | Compute instances (Command Host & Processor) |
| **Amazon EBS** | Block storage volumes for EC2 instances |
| **Amazon S3** | Object storage for file backup and versioning |
| **AWS CLI** | Command-line tool for managing AWS resources |
| **IAM** | Identity and access management for secure resource permissions |
| **Amazon VPC** | Network isolation and connectivity |

---

## Prerequisites

- Access to the AWS Management Console
- Basic familiarity with Linux command line
- Understanding of AWS core concepts (EC2, S3, IAM)

---

## Notes

- The "Command Host" instance is your primary administration node for running AWS CLI commands.
- The "Processor" instance should be stopped before taking consistent snapshots of its EBS volume.
- For the challenge task, ensure versioning is enabled on your S3 bucket before syncing files.
- Use the `--delete` flag with `aws s3 sync` to maintain an exact mirror between local and S3 storage.
