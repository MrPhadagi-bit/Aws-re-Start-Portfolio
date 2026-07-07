# Working with Amazon EBS: Lab Overview

Amazon Elastic Block Store (Amazon EBS) is a scalable, high-performance block-storage service that is designed for Amazon Elastic Compute Cloud (Amazon EC2). In this lab, you learn how to create an EBS volume and perform operations on it, such as attaching it to an instance, creating a file system, and taking a snapshot backup.

---

## Lab Architecture

![imagine](https://github.com/MrPhadagi-bit/ppppp1/blob/main/lab-scenario.png?raw=true)

---

## Objectives

By the end of this lab, you will be able to do the following:

- **Create an EBS volume** — Provision a new General Purpose SSD (`gp2`) volume in the same Availability Zone as your EC2 instance.
- **Attach and mount an EBS volume to an EC2 instance** — Connect the volume to the instance, format it with an `ext3` file system, and mount it at `/mnt/data-store`.
- **Create a snapshot of an EBS volume** — Capture a point-in-time backup of the volume and store it durably in Amazon S3.
- **Create an EBS volume from a snapshot** — Restore the snapshot to a new volume, attach it to the instance, and verify that the original data is intact.

---

## Prerequisites

- Access to the **AWS Management Console** with permissions for EC2 and EBS operations.
- A running EC2 instance named **Lab** (already provisioned for this lab).
- The instance is located in **Availability Zone `us-west-2a`** (or equivalent for your lab environment).

---

## Lab Tasks Overview

| Task | Description | Key Actions |
|------|-------------|-------------|
| **Task 1** | Create a new EBS volume | Launch a 1 GiB `gp2` volume, tag it `My Volume`, in the same AZ as the Lab instance. |
| **Task 2** | Attach the volume to EC2 | Attach `My Volume` to the Lab instance as `/dev/sdb`. |
| **Task 3** | Connect to the Lab instance | Use **EC2 Instance Connect** to open a terminal session. |
| **Task 4** | Create and configure the file system | Format with `ext3`, mount at `/mnt/data-store`, update `/etc/fstab`, and write a test file. |
| **Task 5** | Create an EBS snapshot | Snapshot `My Volume`, tag it `My Snapshot`, then delete the test file from the live volume. |
| **Task 6** | Restore the snapshot | Create `Restored Volume` from the snapshot, attach as `/dev/sdc`, mount at `/mnt/data-store2`, and verify file recovery. |

---

## Key Concepts

### Amazon EBS
> **Amazon Elastic Block Store (EBS)** provides raw block-level storage volumes for use with Amazon EC2 instances. Each volume is automatically replicated within its Availability Zone to protect you from component failure.

### EBS Snapshots
> **Snapshots** are incremental backups stored in **Amazon S3**. Only the blocks that have changed since the last snapshot are saved, making them efficient and cost-effective. Snapshots enable cloning, cross-region copying, and disaster recovery.

### File System Persistence
> Mounting a volume and adding it to `/etc/fstab` ensures the file system remains available after instance reboots.

---

## Duration

This lab requires approximately **45 minutes** to complete.

---

## Next Steps

Proceed to **Task 1: Creating a new EBS volume** to begin the hands-on portion of this lab.
