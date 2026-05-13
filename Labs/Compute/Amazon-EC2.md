# Introduction to Amazon EC2 - Lab Documentation

> **Program:** Praesignis AWS re/Start Programme  
> **Lab:** Introduction to Amazon EC2  
> **Author:** Raven Mannda Phadagi  
> **Date:** May 2026  
> **Region:** US West (Oregon) - `us-west-2`

---

## Overview

This lab provides a hands-on introduction to launching and configuring an Amazon EC2 instance.

**Amazon Elastic Compute Cloud (Amazon EC2)** is an AWS service that provides resizable virtual servers in the cloud. These virtual servers, called instances, allow users to run applications without needing to manage physical hardware.

In this lab, I configured an EC2 web server by selecting an Amazon Machine Image, choosing an instance type, configuring networking, setting up a security group, configuring storage, enabling termination protection, and launching the instance.

---

## Objectives

By the end of this lab, I was able to:

- Launch an Amazon EC2 instance.
- Select an Amazon Linux AMI.
- Choose a free tier eligible instance type.
- Configure VPC, subnet, and public IP settings.
- Create a security group for a web server.
- Configure root volume storage.
- Enable termination protection.
- Launch the instance from the AWS Management Console.

---

## Lab Configuration Summary

| Configuration | Value |
|---|---|
| Instance Name | Web Server |
| AMI | Amazon Linux 2023 kernel-6.1 AMI |
| Instance Type | `t3.micro` |
| VPC | Lab VPC - `10.0.0.0/16` |
| Subnet | Public Subnet 1 - `us-west-2a` |
| Public IP | Enabled |
| Key Pair | Proceed without a key pair |
| Security Group | Web Server securitygroup |
| Storage | 8 GiB `gp3` root volume |
| Termination Protection | Enabled |

---

## Step 1 - Name the EC2 Instance

In the **Launch an instance** page, I entered the instance name as:

```text
Web Server
```

This name helps identify the EC2 instance in the AWS console.

![Launch instance - name and tags](./images/amazon-ec2/01-name-and-tags.png)

---

## Step 2 - Select an Amazon Machine Image

Under **Application and OS Images**, I selected **Amazon Linux** from the Quick Start options.

The selected AMI was:

```text
Amazon Linux 2023 kernel-6.1 AMI
```

This AMI is free tier eligible and optimized for AWS workloads.

![Amazon Linux AMI selection](./images/amazon-ec2/02-ami-selection.png)

---

## Step 3 - Choose the Instance Type

For the instance type, I selected:

```text
t3.micro
```

The `t3.micro` instance type is free tier eligible and provides:

- 2 vCPUs
- 1 GiB memory
- Current generation performance

![Instance type selection](./images/amazon-ec2/03-instance-type.png)

---

## Step 4 - Configure Key Pair

For the key pair setting, I selected:

```text
Proceed without a key pair (Not recommended)
```

This was used for the lab environment. In a real production environment, a key pair should be created and stored securely so that administrators can connect to the instance using SSH.

![Key pair configuration](./images/amazon-ec2/04-key-pair.png)

---

## Step 5 - Configure Network Settings

Under **Network settings**, I configured the instance with the lab VPC and public subnet.

| Network Setting | Value |
|---|---|
| VPC | Lab VPC - `10.0.0.0/16` |
| Subnet | Public Subnet 1 |
| Availability Zone | `us-west-2a` |
| Auto-assign public IP | Enable |
| Firewall | Create security group |

Enabling the public IP allows the instance to be reachable from the internet, depending on the security group rules.

![Network settings](./images/amazon-ec2/05-network-settings.png)

---

## Step 6 - Create a Security Group

I created a new security group for the web server.

| Security Group Setting | Value |
|---|---|
| Security group name | Web Server securitygroup |
| Description | Security group for my web server |

At this stage, no inbound rules were added. Security group rules can be added later depending on the traffic the instance needs to allow, such as HTTP or SSH.

![Security group settings](./images/amazon-ec2/06-security-group.png)

---

## Step 7 - Configure Storage

The default storage configuration was used:

| Storage Setting | Value |
|---|---|
| Root volume size | 8 GiB |
| Volume type | `gp3` |
| IOPS | 3,000 |
| Encryption | Not encrypted |

Amazon EBS provides persistent block storage for EC2 instances. The `gp3` volume type is a general-purpose SSD volume suitable for many workloads.

![Configure storage](./images/amazon-ec2/07-storage.png)

---

## Step 8 - Enable Termination Protection

In **Advanced details**, I enabled termination protection.

Termination protection helps prevent accidental deletion of an EC2 instance. If this setting is enabled, the instance cannot be terminated until termination protection is disabled.

![Termination protection enabled](./images/amazon-ec2/08-termination-protection.png)

---

## Step 9 - Launch the Instance

After reviewing the configuration, I clicked **Launch instance**.

The **Preview code** option can also be used to view equivalent infrastructure code for the selected launch configuration.

![Launch instance button](./images/amazon-ec2/09-launch-instance.png)

---

## Key Concepts Learned

| Concept | Description |
|---|---|
| Amazon EC2 | Provides virtual servers in the AWS Cloud. |
| AMI | A template used to launch an EC2 instance with a selected operating system and configuration. |
| Instance Type | Defines the CPU, memory, storage, and networking capacity of an instance. |
| Key Pair | Used to securely connect to EC2 instances through SSH. |
| VPC | A logically isolated network in AWS. |
| Subnet | A segment of a VPC where AWS resources can be launched. |
| Security Group | A virtual firewall that controls inbound and outbound traffic. |
| EBS Volume | Persistent block storage attached to an EC2 instance. |
| Termination Protection | Prevents accidental termination of an EC2 instance. |

---

## Reflection

This lab helped me understand the main configuration steps required to launch an EC2 instance in AWS. I learned how compute, networking, security, and storage settings work together when creating a virtual server in the cloud.

The most important takeaway was understanding that launching an EC2 instance is not only about choosing a server, but also about configuring the surrounding infrastructure correctly.

---

## References

- [Amazon EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [Amazon Machine Images](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html)
- [Amazon EC2 Instance Types](https://aws.amazon.com/ec2/instance-types/)
- [Security Groups for EC2](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-security-groups.html)
- [Amazon EBS Volume Types](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volume-types.html)

---

*Lab completed as part of the Praesignis AWS re/Start Programme - May 2026.*
