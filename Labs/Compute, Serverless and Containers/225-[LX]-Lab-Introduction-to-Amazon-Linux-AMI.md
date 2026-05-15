# 225-[LX]-Lab - Introduction to Amazon Linux AMI

**Programme:** Praesignis AWS Restart  
**Author:** Raven Phadagi  
**Duration:** Approximately 30 minutes

---

## Overview

This lab reinforces knowledge of basic command line interface (CLI) functionality and provides a foundation for learning new commands and capabilities within the Linux shell.

---

## AWS Service Restrictions

Access to AWS services and service actions in this lab environment is restricted to those needed to complete the lab instructions. Attempting to access other services or perform actions beyond what is described may result in errors.

---

## Scenario

In this lab, you use Secure Shell (SSH) to access an Amazon Linux Amazon Machine Image (AMI) within Vocareum labs. You then use the `man` command to access and explore the man pages.

---

## Objectives

After completing this lab, you will be able to:

- Use SSH to access an Amazon Linux AMI within Vocareum labs
- Understand the purpose of the `man` command
- Demonstrate the search feature of the man pages
- Examine man page headers

---

## Lab Environment

The following components are pre-created as part of the lab environment:

| Component | Description |
|---|---|
| Amazon EC2 — Command Host | Located in the public subnet. You log in to this instance to run the commands in this lab. |
| Public Subnet | Network boundary within the VPC |
| Amazon VPC | Virtual Private Cloud hosting the lab resources |

The Public Subnet and Amazon VPC are examined later during this course.

---

## Accessing the AWS Management Console

1. At the top of the lab instructions, choose **Start Lab** to launch your lab. A Start Lab panel opens displaying the lab status.

   > If you need more time, choose **Start Lab** again to restart the timer.

2. Wait until you see **Lab status: ready**, then close the Start Lab panel by choosing **X**.

3. At the top of the instructions, choose **AWS**. This opens the AWS Management Console in a new browser tab and automatically logs you in.

   > If a new browser tab does not open, your browser may be blocking pop-ups. Look for a banner or icon at the top of your browser and choose **Allow pop-ups**.

4. Arrange the AWS Management Console tab alongside these instructions so you can follow the steps while viewing the console.

---

## Task 1 - Use SSH to Connect to an Amazon Linux EC2 Instance

1. Select the **Details** drop-down menu above these instructions and choose **Show**. A Credentials window will appear.

2. Select **Download PPK** and save the `labsuser.ppk` file. Your browser will typically save it to the Downloads directory.

3. Make a note of the **PublicIP** address.

4. Close the Details panel by selecting **X**.

5. Download and open [PuTTY](https://www.putty.org/) to SSH into the EC2 instance.

6. Open `putty.exe` and configure your session by following the directions here: [Connect to your Linux instance using PuTTY](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/putty.html)

---

## Task 2 - Explore the Linux Man Pages

In this task, you use a bash terminal to view the Linux standard help system, commonly referred to as the manual pages or man pages.

---

### Step 1 - Open the Man Page for `man`

At the command prompt, enter the following command and press Enter:

```bash
man man
```

**Screenshot:**

![man man command output](images/man_command_prompt.png)

*Figure: At the command prompt, the `man man` command has been entered.*

---

### Step 2 - Identify Man Page Headers

Look for the following section headers within the man page output. You can scroll through the man pages using the up and down arrow keys.

| Header | Description |
|---|---|
| NAME | The name and brief description of the command |
| SYNOPSIS | The syntax and usage of the command |
| DESCRIPTION | A detailed explanation of what the command does |
| OVERVIEW | High-level summary of functionality |
| EXAMPLES | Practical usage examples |
| FILES | Files used or affected by the command |
| OPTIONS | Available flags and options |
| SEE ALSO | Related commands and references |

**Screenshot:**

![man page synopsis section](images/man_command_synopsis.png)

*Figure: The man page displays important information about a command.*

---

### Step 3 - Examine the DESCRIPTION Header

Take note of the DESCRIPTION header, particularly the section numbers described within it. These section numbers categorise man pages across the Linux system.

**Screenshot:**

![man page description section](images/man_command_description.png)

*Figure: The DESCRIPTION header provides an overview of a command.*

---

### Step 4 - Exit the Man Pages

To exit the man pages, press:

```
q
```

---

## Lab Complete

Congratulations! You have completed the lab.

To end the lab:

1. Select **End Lab** at the top of the page.
2. Select **Yes** to confirm.
3. A panel will appear with the message: *"DELETE has been initiated... You may close this message box now."*
4. Select **X** to close the panel.

---

## AWS Components Reference

### Amazon EC2

Amazon EC2 provides a wide selection of instance types optimised for different use cases. Instance types offer varying combinations of CPU, memory, storage, and networking capacity, giving you the flexibility to choose the right mix of resources for your workload.

### Instance Used in This Lab

| Property | Value |
|---|---|
| Instance Type | t3.micro |
| vCPUs | 1 |
| Memory | 1 GiB |

Note: You may be restricted from using other instance types in this lab environment.

---

## Additional Resources

| Resource | Link |
|---|---|
| Amazon EC2 Instance Types | https://aws.amazon.com/ec2/instance-types/ |
| Amazon Machine Images (AMI) | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html |
| Status Checks for Your Instances | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/monitoring-system-instance-status-check.html |
| Amazon EC2 Service Quotas | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-resource-limits.html |
| Terminate Your Instance | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/terminating-instances.html |

---

*Lab: 225-[LX]-Lab - Introduction to Amazon Linux AMI | Praesignis AWS Restart Programme*
