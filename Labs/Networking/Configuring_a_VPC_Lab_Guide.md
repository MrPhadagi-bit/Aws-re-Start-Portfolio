# Configuring a VPC - Lab Guide

## Lab Overview

Amazon Virtual Private Cloud (Amazon VPC) gives you the ability to provision a logically isolated section of the Amazon Web Services (AWS) Cloud where you can launch AWS resources in a virtual network that you define. You have complete control over your virtual networking environment, including selecting your IP address ranges, creating subnets, and configuring route tables and network gateways.

In this lab, you build a virtual private cloud (VPC) and other network components required to deploy resources, such as an Amazon Elastic Compute Cloud (Amazon EC2) instance.

### Architecture Diagram

The following diagram shows the final lab architecture:

![imagine]( https://github.com/MrPhadagi-bit/ppppp1/blob/main/architecture.png?raw=true)

### Network Components

| Component | Name | CIDR/Details |
|-----------|------|-------------|
| VPC | Lab VPC | 10.0.0.0/16 |
| Public Subnet | Public Subnet | 10.0.0.0/24 |
| Private Subnet | Private Subnet | 10.0.2.0/23 |
| Internet Gateway | Lab IGW | Attached to Lab VPC |
| NAT Gateway | Lab NAT gateway | In Public Subnet |
| Public Route Table | Public Route Table | 0.0.0.0/0 → IGW |
| Private Route Table | Private Route Table | 0.0.0.0/0 → NAT |
| Bastion Server | Bastion Server | t3.micro, Amazon Linux 2023 |
| Private Instance | Private Instance | t3.micro, Amazon Linux 2023 |

---

## Objectives

By the end of this lab, you should be able to do the following:

1. **Create a VPC** with a private and public subnet, an internet gateway, and a NAT gateway.
2. **Configure route tables** associated with subnets to handle local and internet-bound traffic by using an internet gateway and a NAT gateway.
3. **Launch a bastion server** in a public subnet.
4. **Use a bastion server** to log in to an instance in a private subnet.

> **Optional Challenge:** If you have time, you can complete the optional challenge section in which you create an Amazon EC2 instance in a private subnet and connect to it through the bastion server.

---

## Duration

This lab will require approximately **45 minutes** to complete.

---

## Prerequisites

- Access to the AWS Management Console
- Basic understanding of networking concepts (CIDR, subnets, routing)
- Familiarity with the AWS console navigation

---

## Task 1: Creating a VPC

In this task, you create a new VPC with the specified CIDR block and enable DNS hostnames.

### Steps

1. On the **AWS Management Console**, in the **Search bar**, enter and choose **VPC** to go to the VPC Management Console.

2. In the left navigation pane, for **Virtual private cloud**, choose **Your VPCs**.

   > **Note:** In every Region, a default VPC with a CIDR block of `172.31.0.0/16` has already been created for you. Even if you haven't created anything in your account yet, you will see some pre-existing VPC resources.

3. Choose **Create VPC** and configure the following options:

   | Setting | Value |
   |---------|-------|
   | **Resources to create** | VPC only |
   | **Name tag** | `Lab VPC` |
   | **IPv4 CIDR block** | IPv4 CIDR manual input |
   | **IPv4 CIDR** | `10.0.0.0/16` |
   | **IPv6 CIDR block** | No IPv6 CIDR block |
   | **Tenancy** | Default |
   | **Tags** | Leave as suggested |

4. Choose **Create VPC**.

   At the top of the page, a message displays: *"You successfully created vpc-NNNNNNNNNNN / Lab VPC."*

5. Choose **Actions**, and choose **Edit VPC settings**.

6. In the **DNS settings** section, select **Enable DNS hostnames**.

7. Choose **Save**.

   > **Result:** EC2 instances launched into the VPC now automatically receive a public IPv4 DNS hostname.

---

## Task 2: Creating Subnets

In this task, you create a public subnet and a private subnet within the Lab VPC.

### Task 2.1: Creating a Public Subnet

1. In the left navigation pane, for **Virtual private cloud**, choose **Subnets**.

2. Choose **Create subnet** and configure the following:

   | Setting | Value |
   |---------|-------|
   | **VPC ID** | Lab VPC |
   | **Subnet name** | `Public Subnet` |
   | **Availability Zone** | First AZ in the list (do not choose *No preference*) |
   | **IPv4 CIDR block** | `10.0.0.0/24` |

3. Choose **Create subnet**.

4. Select **Public Subnet** from the list.

5. Choose **Actions**, then choose **Edit subnet settings**.

6. In the **Auto-assign IP settings** section, select **Enable auto-assign public IPv4 address**.

7. Choose **Save**.

   > **Note:** Even though this subnet is named *Public Subnet*, it is not yet public. A public subnet must have an internet gateway attached and a route table pointing to it.

### Task 2.2: Creating a Private Subnet

1. Choose **Create subnet** again and configure:

   | Setting | Value |
   |---------|-------|
   | **VPC ID** | Lab VPC |
   | **Subnet name** | `Private Subnet` |
   | **Availability Zone** | First AZ in the list (same as public subnet) |
   | **IPv4 CIDR block** | `10.0.2.0/23` |

2. Choose **Create subnet**.

   > **Note:** The CIDR `10.0.2.0/23` includes all IPs starting with `10.0.2.x` and `10.0.3.x`. This range is twice as large as the public subnet because most resources should be kept in private subnets unless they specifically need internet accessibility.

---

## Task 3: Creating an Internet Gateway

In this task, you create an internet gateway and attach it to the Lab VPC.

### Steps

1. In the left navigation pane, for **Virtual private cloud**, choose **Internet gateways**.

2. Choose **Create internet gateway**.

3. For **Name tag**, enter `Lab IGW`.

4. Choose **Create internet gateway**.

5. Choose **Actions**, then choose **Attach to a VPC**.

6. Select **Lab VPC** and attach.

   > **Result:** Your VPC now has a connection to the internet. However, to route traffic to the internet, you must also configure the public subnet's route table.

---

## Task 4: Configuring Route Tables

In this task, you:
- Create a public route table for internet-bound traffic
- Add a route to direct internet traffic to the internet gateway
- Associate the public subnet with the new route table
- Configure the private route table for local traffic

### Steps

1. In the left navigation pane, for **Virtual private cloud**, choose **Route tables**.

2. Several route tables are listed. Select the route table that includes **Lab VPC** in the VPC column.

   > **Tip:** If you cannot see the VPC column, scroll to the right.

3. In the **Name** column, choose the edit icon, enter `Private Route Table`, and choose **Save**.

4. Choose the **Routes** tab. You will see one route:
   - `10.0.0.0/16` → `local` (allows all subnets within the VPC to communicate)

5. Choose **Create route table** and configure:

   | Setting | Value |
   |---------|-------|
   | **Name** | `Public Route Table` |
   | **VPC** | Lab VPC |

6. Choose **Create route table**.

7. After creation, choose the **Routes** tab, then **Edit routes**.

8. Choose **Add route** and configure:

   | Setting | Value |
   |---------|-------|
   | **Destination** | `0.0.0.0/0` |
   | **Target** | Internet Gateway → `Lab IGW` |

9. Choose **Save changes**.

10. Choose the **Subnet associations** tab.

11. Choose **Edit subnet associations**.

12. Select **Public Subnet**.

13. Choose **Save associations**.

   > **Result:** The public subnet is now truly public because it has a route table entry that sends traffic to the internet through the internet gateway.

---

## Task 5: Launching a Bastion Server in the Public Subnet

A bastion server (also known as a jump box) is an EC2 instance in a public subnet that provides secure access to resources in a private subnet.

### Steps

1. On the **AWS Management Console**, in the **Search bar**, enter and choose **EC2**.

2. In the left navigation pane, choose **Instances**.

3. Choose **Launch instances** and configure:

   | Section | Setting | Value |
   |---------|---------|-------|
   | **Name and tags** | Name | `Bastion Server` |
   | **Application and OS Images** | Quick Start | Amazon Linux |
   | | AMI | Amazon Linux 2023 AMI |
   | **Instance type** | | `t3.micro` |
   | **Key pair** | | Proceed without a key pair (Not recommended) |
   | **Network settings** | VPC | Lab VPC |
   | | Subnet | Public Subnet |
   | | Auto-assign public IP | Enable |
   | **Firewall** | Security group | Create security group |
   | | Security group name | `Bastion Security Group` |
   | | Description | `Allow SSH` |
   | **Inbound rules** | Type | `ssh` |
   | | Source type | `Anywhere` |

4. Choose **Launch instance**.

5. Choose **View all instances** to see the launched instance.

   > **Note:** The instance will initially show as **Pending**, then change to **Running** when boot is complete. You do not need to wait for it to be running before continuing.

---

## Task 6: Creating a NAT Gateway

In this task, you launch a NAT gateway in the public subnet and configure the private route table to allow private subnet resources to communicate with the internet.

### Steps

1. On the **AWS Management Console**, in the **Search bar**, enter **NAT gateways**, choose the **Features list**, and choose **NAT gateways**.

2. Choose **Create NAT gateway** and configure:

   | Setting | Value |
   |---------|-------|
   | **Name** | `Lab NAT gateway` |
   | **Subnet** | Public Subnet |
   | **Elastic IP** | Allocate Elastic IP |

3. Choose **Create NAT gateway**.

4. In the left navigation pane, choose **Route tables**, then select **Private Route Table**.

5. Choose the **Routes** tab, then **Edit routes**.

6. Choose **Add route** and configure:

   | Setting | Value |
   |---------|-------|
   | **Destination** | `0.0.0.0/0` |
   | **Target** | NAT Gateway → select `nat-` from the list |

7. Choose **Save changes**.

   > **Result:** Resources in the private subnet that need to communicate with the internet now have their traffic directed to the NAT gateway, which forwards requests to the internet. Responses flow back through the NAT gateway to the private subnet.

---

## Optional Challenge: Testing the Private Subnet

This challenge is optional and provided in case you have lab time remaining.

### Launching an Instance in the Private Subnet

1. Follow the same steps as launching the bastion server, but configure:

   | Section | Setting | Value |
   |---------|---------|-------|
   | **Name** | | `Private Instance` |
   | **AMI** | | Amazon Linux 2023 AMI |
   | **Instance type** | | `t3.micro` |
   | **Key pair** | | Proceed without a key pair |
   | **Network settings** | VPC | Lab VPC |
   | | Subnet | **Private Subnet** |
   | **Security group** | Name | `Private Instance SG` |
   | | Description | `Allow SSH from Bastion` |
   | **Inbound rule** | Type | `ssh` |
   | | Source type | `Custom` |
   | | Source | `10.0.0.0/16` |

2. Expand **Advanced Details** and for **User data**, paste the following script:

   ```bash
   #!/bin/bash
   # Turn on password authentication for lab challenge
   echo 'lab-password' | passwd ec2-user --stdin
   sed -i 's|[#]*PasswordAuthentication no|PasswordAuthentication yes|g' /etc/ssh/sshd_config
   systemctl restart sshd.service
   ```

   > **Warning:** This script enables password authentication for lab convenience. It is **not recommended** for production deployments.

3. Choose **Launch instance**.

### Logging in to the Bastion Server

1. Go to the **EC2 Management Console** → **Instances**.
2. Select the **Bastion Server** instance.
3. Choose **Connect**.
4. On the **EC2 Instance Connect** tab, choose **Connect**.

   > You are now logged in to the bastion server in the public subnet. Keep this terminal open.

### Logging in to the Private Instance

1. In the EC2 console, select **Private Instance**.
2. Copy the **Private IPv4 address** (starts with `10.0.2.x` or `10.0.3.x`).
3. In the bastion terminal, run:

   ```bash
   ssh PRIVATE-IP
   # Example: ssh 10.0.2.123
   ```

4. If prompted *"Are you sure you want to continue connecting"*, enter `yes`.
5. When prompted for a password, enter `lab-password`.

   > **Result:** You are now connected to the private instance via the bastion server.

### Testing the NAT Gateway

Run the following command to verify internet connectivity:

```bash
ping -c 3 amazon.com
```

**Expected output:**

```
PING amazon.com (176.32.98.166) 56(84) bytes of data.
64 bytes from 176.32.98.166: icmp_seq=1 ttl=222 time=79.2 ms
64 bytes from 176.32.98.166: icmp_seq=2 ttl=222 time=79.2 ms
64 bytes from 176.32.98.166: icmp_seq=3 ttl=222 time=79.0 ms
```

> **Interpretation:** The private instance successfully communicated with `amazon.com` on the internet. Since the private instance is in the private subnet, this is only possible through the NAT gateway, confirming your network configuration is successful.

---

## Conclusion

Congratulations! You have successfully completed the following:

 Created a VPC with a private and public subnet, an internet gateway, and a NAT gateway  
 Configured route tables associated with subnets to handle local and internet-bound traffic  
 Launched a bastion server in a public subnet  
 Used a bastion server to log in to an instance in a private subnet  
 *(Optional)* Verified NAT gateway functionality by testing internet connectivity from a private instance

---

## Key Takeaways

| Concept | Description |
|---------|-------------|
| **Public Subnet** | Has a route to the Internet Gateway (IGW). Resources can be directly reached from the internet. |
| **Private Subnet** | Has a route to the NAT Gateway. Resources can initiate outbound internet connections but cannot be directly reached from the internet. |
| **Bastion Host** | A secure jump server in the public subnet used to access private resources. |
| **NAT Gateway** | Allows outbound-only internet traffic from private subnets while preventing inbound connections. |
| **Route Tables** | Control traffic flow within the VPC and to external destinations. |

---

## Cleanup (Important!)

To avoid incurring charges, delete the following resources after completing the lab:

1. Terminate EC2 instances (Bastion Server, Private Instance)
2. Delete NAT Gateway
3. Release Elastic IP
4. Delete Internet Gateway (detach first)
5. Delete subnets (Public and Private)
6. Delete route tables (except default)
7. Delete the VPC

---

*Lab complete - Happy learning!* 
