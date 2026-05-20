# AWS SimuLearn - File Systems in the Cloud

> **Completion Date:** May 20, 2026  
> **Awarded To:** Phadagi Mannda Raven  
> **Provider:** AWS Training and Certification  
> **Learning Format:** AWS SimuLearn AI-powered game-based learning with hands-on lab practice  
> **Focus Services:** Amazon EFS, Amazon FSx, Amazon EC2, Amazon VPC, security groups, and AWS storage architecture

---

## Overview

This badge documents completion of **AWS SimuLearn: File Systems in the Cloud**, an AWS Training and Certification learning experience focused on designing and implementing file storage solutions in AWS.

The learning experience combines an interactive customer scenario with a hands-on AWS lab. The scenario focuses on selecting the right file storage service for a business requirement, while the lab reinforces implementation skills using AWS file system services.

---

## What I Practiced

In this SimuLearn module, I practiced how to:

- Identify when to use Amazon EFS, Amazon FSx, or Amazon S3.
- Design shared file storage for cloud workloads.
- Understand how Amazon EFS supports Linux-based shared storage.
- Understand how Amazon FSx supports Windows and high-performance workloads.
- Configure file system access using VPC networking and security groups.
- Connect file systems to Amazon EC2 instances.
- Validate cross-instance access to shared storage.
- Apply security and availability best practices for cloud file systems.

---

## Learning Objectives

After completing this learning activity, I strengthened my understanding of:

| Area | Skills Practiced |
|---|---|
| Cloud Storage | File storage use cases, shared storage, and service selection. |
| Amazon EFS | Elastic file systems, mount targets, NFS access, and Linux workloads. |
| Amazon FSx | Managed file systems for Windows and high-performance workloads. |
| Amazon EC2 | Mounting and testing file systems from compute instances. |
| Amazon VPC | Subnets, Availability Zones, routing, and security group design. |
| Security | Restricting file system access, enabling encryption, and using least privilege. |
| Architecture | Choosing storage services based on workload, protocol, performance, and cost. |

---

## Service Selection Notes

| Requirement | Recommended AWS Service | Reason |
|---|---|---|
| Shared Linux file storage | Amazon EFS | POSIX-compliant shared storage for Linux workloads. |
| Windows file shares | Amazon FSx for Windows File Server | Supports SMB and Windows-native file sharing. |
| High-performance computing workloads | Amazon FSx for Lustre | Designed for high-throughput and low-latency workloads. |
| Object storage for static assets or backups | Amazon S3 | Durable object storage for files, media, backups, and archives. |

---

## Amazon EFS Implementation Summary

A typical Amazon EFS implementation includes:

1. Creating or using an existing VPC.
2. Launching EC2 instances in one or more Availability Zones.
3. Creating an Amazon EFS file system.
4. Creating mount targets in the required Availability Zones.
5. Configuring security groups to allow NFS traffic on port `2049`.
6. Installing EFS utilities on the EC2 instances.
7. Mounting the EFS file system to a Linux directory.
8. Testing shared file access across instances.

Example mount command:

```bash
sudo mount -t efs -o tls <file-system-id>:/ /var/www/html
```

Example persistent mount entry:

```text
<file-system-id>.efs.<region>.amazonaws.com:/ /var/www/html efs _netdev,tls 0 0
```

---

## Verification Checklist

- [x] Completed AWS SimuLearn file systems learning activity.
- [x] Reviewed file storage use cases in AWS.
- [x] Compared Amazon EFS, Amazon FSx, and Amazon S3.
- [x] Practiced designing a file storage solution for a customer scenario.
- [x] Reviewed EFS mount targets, security groups, and EC2 access.
- [x] Documented key lessons learned for portfolio evidence.

---

## Key Takeaways

- Amazon EFS is useful for shared Linux file storage across multiple EC2 instances.
- Amazon FSx is useful when workloads require managed Windows file shares or high-performance Lustre storage.
- Security groups are important because EFS requires NFS access on port `2049`.
- Mount targets should be placed across Availability Zones for availability.
- Encryption at rest and encryption in transit should be considered for production file systems.
- The best storage service depends on access pattern, protocol, performance, cost, and operating system requirements.

---

## Commands Reference

```bash
# Install Amazon EFS utilities
sudo yum install -y amazon-efs-utils

# Create a mount directory
sudo mkdir -p /var/www/html

# Mount an EFS file system with TLS
sudo mount -t efs -o tls <file-system-id>:/ /var/www/html

# Check mounted file systems
df -h

# Test write access
echo "Hello from Amazon EFS" | sudo tee /var/www/html/test-file.txt
```

---

## Reflection

This AWS SimuLearn activity helped me understand how cloud file storage is selected and implemented in AWS. I learned how different file system services support different workloads and why architecture decisions must consider performance, access protocol, availability, security, and cost.

The lab also strengthened my understanding of how Amazon EC2, VPC networking, security groups, and managed storage services work together in a cloud architecture.

---

## Additional Resources

- [Amazon EFS User Guide](https://docs.aws.amazon.com/efs/latest/ug/)
- [Amazon FSx Documentation](https://docs.aws.amazon.com/fsx/)
- [Amazon EC2 User Guide](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/)
- [AWS SimuLearn](https://aws.amazon.com/training/digital/aws-simulearn/)

---

*Completed as part of my AWS Training and Certification learning journey.*
