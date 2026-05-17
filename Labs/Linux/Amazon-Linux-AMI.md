# Introduction to Amazon Linux AMI - Lab Documentation

> **Program:** Praesignis AWS re/Start Programme  
> **Lab:** 225-[LX]-Lab - Introduction to Amazon Linux AMI  
> **Author:** Raven Mannda Phadagi  
> **Duration:** Approximately 30 minutes

---

## Overview

This lab reinforces basic command line interface (CLI) knowledge and provides a foundation for learning new commands inside the Linux shell.

In this lab, I used Secure Shell (SSH) to connect to an Amazon Linux Amazon Machine Image (AMI) in a Vocareum lab environment. I then explored the Linux manual page system using the `man` command.

---

## AWS Service Restrictions

Access to AWS services and service actions in this lab environment is restricted to the permissions required for the lab instructions.

Attempting to access other services or perform actions outside the lab instructions may result in errors.

---

## Scenario

The lab environment provides an Amazon Linux EC2 instance that can be accessed through SSH. After connecting to the instance, the main task is to explore Linux manual pages and understand how they help users learn commands directly from the terminal.

---

## Objectives

After completing this lab, I was able to:

- Use SSH to access an Amazon Linux AMI within Vocareum labs.
- Understand the purpose of the `man` command.
- Use the search and navigation features inside man pages.
- Identify common man page headers.
- Understand how command documentation is structured in Linux.

---

## Lab Environment

The following components were pre-created as part of the lab environment:

| Component | Description |
|---|---|
| Amazon EC2 - Command Host | Located in the public subnet. This is the instance used to run Linux commands. |
| Public Subnet | Network boundary within the VPC. |
| Amazon VPC | Virtual Private Cloud hosting the lab resources. |

The Public Subnet and Amazon VPC are examined in more detail later in the AWS re/Start course.

---

## Accessing the AWS Management Console

1. At the top of the lab instructions, choose **Start Lab** to launch the lab.
2. Wait until the lab status changes to **ready**.
3. Choose **AWS** to open the AWS Management Console in a new browser tab.
4. If the browser blocks the new tab, allow pop-ups and try again.
5. Arrange the AWS Management Console and lab instructions side by side.

---

## Task 1 - Use SSH to Connect to an Amazon Linux EC2 Instance

To connect to the Amazon Linux instance:

1. Open the **Details** drop-down menu in the lab instructions.
2. Choose **Show** to display the credentials window.
3. Select **Download PPK** and save the `labsuser.ppk` file.
4. Note the **PublicIP** address.
5. Close the Details panel.
6. Download and open [PuTTY](https://www.putty.org/).
7. Use PuTTY and the downloaded private key file to connect to the EC2 instance.

Reference guide:

- [Connect to your Linux instance using PuTTY](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/putty.html)

---

## Task 2 - Explore the Linux Man Pages

Manual pages, often called **man pages**, are the standard built-in help system for Linux commands.

They are useful because they allow users to learn command syntax, options, descriptions, examples, and related commands directly from the terminal.

---

### Step 1 - Open the Man Page for `man`

At the command prompt, enter:

```bash
man man
```

This opens the manual page for the `man` command itself.

---

### Step 2 - Identify Man Page Headers

Inside the man page output, I looked for common section headers.

| Header | Description |
|---|---|
| NAME | The command name and a short description. |
| SYNOPSIS | The syntax and usage format of the command. |
| DESCRIPTION | A detailed explanation of what the command does. |
| OPTIONS | Flags and options that can modify command behavior. |
| EXAMPLES | Practical examples of how to use the command. |
| FILES | Files used or affected by the command. |
| SEE ALSO | Related commands and references. |

These headers make it easier to find the exact information needed when learning a command.

---

### Step 3 - Examine the DESCRIPTION Header

The **DESCRIPTION** section provides a deeper explanation of the command.

For the `man` command, this section explains how manual pages are organized and how Linux command documentation is divided into numbered sections.

---

### Step 4 - Navigate and Exit Man Pages

Useful navigation keys:

| Key | Action |
|---|---|
| Up Arrow | Move up one line. |
| Down Arrow | Move down one line. |
| Space | Move forward one page. |
| `/search-term` | Search inside the man page. |
| `n` | Move to the next search result. |
| `q` | Quit and return to the terminal. |

To exit the man page, press:

```text
q
```

---

## AWS Components Reference

### Amazon EC2

Amazon EC2 provides virtual servers in the AWS Cloud. It allows users to choose instance types with different combinations of CPU, memory, storage, and networking capacity.

### Amazon Linux AMI

An Amazon Linux AMI is a pre-configured Linux image provided by AWS. It is commonly used for EC2 instances because it is optimized for AWS environments and includes tools that help manage AWS resources.

### Instance Used in This Lab

| Property | Value |
|---|---|
| Instance Type | `t3.micro` |
| vCPUs | 1 |
| Memory | 1 GiB |

Note: The lab environment may restrict which instance types can be used.

---

## Key Concepts Learned

| Concept | Description |
|---|---|
| SSH | Secure method for remotely connecting to a Linux instance. |
| PuTTY | SSH client used to connect to Linux instances from Windows. |
| PPK File | PuTTY private key file used for authentication. |
| Amazon Linux AMI | AWS-provided Linux image used to launch EC2 instances. |
| Man Pages | Built-in Linux documentation for commands. |
| `man` Command | Opens manual pages for Linux commands. |
| Command Documentation | Helps users understand syntax, options, examples, and related commands. |

---

## Reflection

This lab helped me become more comfortable using Linux documentation from the command line. Instead of relying only on external websites, I learned how to use the `man` command to find information directly inside the Linux environment.

This is important for cloud and technical support work because Linux systems are often managed through the terminal, and being able to read command documentation is a practical troubleshooting skill.

---

## Lab Complete

To end the lab:

1. Select **End Lab** at the top of the page.
2. Select **Yes** to confirm.
3. Wait for the message confirming that deletion has been initiated.
4. Close the message panel.

---

## Additional Resources

- [Amazon EC2 Instance Types](https://aws.amazon.com/ec2/instance-types/)
- [Amazon Machine Images](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html)
- [Status Checks for Your Instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/monitoring-system-instance-status-check.html)
- [Amazon EC2 Service Quotas](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-resource-limits.html)
- [Terminate Your Instance](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/terminating-instances.html)

---

*Lab completed as part of the Praesignis AWS re/Start Programme.*
