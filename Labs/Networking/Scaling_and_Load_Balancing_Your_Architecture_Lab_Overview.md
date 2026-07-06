# Scaling and Load Balancing Your Architecture: Lab Overview

## Introduction

In this lab, you use **Elastic Load Balancing (ELB)** and **Amazon EC2 Auto Scaling** to load balance and automatically scale your infrastructure.

**Elastic Load Balancing (ELB)** automatically distributes incoming application traffic across multiple Amazon Elastic Compute Cloud (Amazon EC2) instances. ELB provides the amount of load balancing capacity needed to route application traffic to help you achieve fault tolerance in your applications.

**Auto Scaling** helps you maintain application availability and gives you the ability to scale your Amazon EC2 capacity out or in automatically according to conditions that you define. You can use auto scaling to help ensure that you are running your desired number of EC2 instances. Auto scaling can also automatically increase the number of EC2 instances during spikes in demand to maintain performance and can decrease capacity during lulls to reduce costs. Auto scaling is well suited to applications that have stable demand patterns or that experience hourly, daily, or weekly variability in usage.

### Architecture Overview

- **Starting Architecture**: AWS infrastructure with a single web server in a public subnet.
- **Final Architecture**: ELB and EC2 instances in an Auto Scaling group deployed in private subnets spread across two Availability Zones.

---

## Objectives

After completing this lab, you should be able to do the following:

- Create an AMI from an EC2 instance.
- Create a load balancer.
- Create a launch template and an Auto Scaling group.
- Configure an Auto Scaling group to scale new instances within private subnets.
- Use Amazon CloudWatch alarms to monitor the performance of your infrastructure.

---

## Duration

This lab requires approximately **45 minutes** to complete.

![Imgaine](https://github.com/MrPhadagi-bit/ppppp1/blob/main/StartingArchitecture.png?raw=true)

---

![Imgaine](https://github.com/MrPhadagi-bit/ppppp1/blob/main/FinalArchitecture.png?raw=true)

## Lab Tasks

### Task 1: Creating an AMI for Auto Scaling

In this task, you create an AMI from the existing **Web Server 1** instance. This action saves the contents of the boot disk so that new instances can be launched with identical content.

#### Steps:

1. Open the **Amazon EC2 Management Console** from the AWS Management Console.
2. In the left navigation pane, under the **Instances** section, choose **Instances**.
3. Locate the **Web Server 1** instance (should be in a **Running** state).
4. Select the **Web Server 1** instance.
5. From the **Actions** dropdown, choose **Image and templates > Create image**.
6. Configure the following options:
   - **Image name**: `Web Server AMI`
   - **Image description (optional)**: `Lab AMI for Web Server`
7. Choose **Create image**.
8. Note the **AMI ID** displayed on the confirmation screen — you will use this AMI when launching the Auto Scaling group later in the lab.

---

### Task 2: Creating a Load Balancer

In this task, you create a load balancer that can balance traffic across multiple EC2 instances and Availability Zones.

#### Steps:

1. In the EC2 console left navigation pane, under **Load Balancing**, choose **Load Balancers**.
2. Choose **Create load balancer**.
3. Under **Load balancer types**, for **Application Load Balancer**, choose **Create**.
4. In the **Basic configuration** section:
   - **Load balancer name**: `LabELB`
5. In the **Network mapping** section:
   - **VPC**: `Lab VPC`
   - **Mappings**: Select both Availability Zones listed.
     - First AZ: `Public Subnet 1`
     - Second AZ: `Public Subnet 2`
6. In the **Security groups** section:
   - Remove the default security group.
   - Select **Web Security Group** (permits HTTP access).
7. In the **Listeners and routing** section:
   - Choose **Create target group** (opens in a new tab).
   - In the new tab, under **Basic configuration**:
     - **Target type**: `Instances`
     - **Target group name**: `lab-target-group`
   - Choose **Next**, then on the **Register targets** page, choose **Create target group**.
   - Close the Target groups tab and return to the Load Balancers tab.
   - Choose **Refresh** next to the **Forward to** dropdown, then select `lab-target-group`.
8. Choose **Create load balancer**.
9. You should see: *Successfully created load balancer: LabELB*
10. Choose **View load balancer** and copy the **DNS name** to a text editor for later use.

---

### Task 3: Creating a Launch Template

In this task, you create a launch template for your Auto Scaling group. A launch template specifies information for the instances, such as the AMI, instance type, key pair, security group, and disks.

#### Steps:

1. In the EC2 console, under the **Instances** section, choose **Launch Templates**.
2. Choose **Create launch template**.
3. In the **Launch template name and description** section:
   - **Launch template name**: `lab-app-launch-template`
   - **Template version description**: `A web server for the load test app`
   - **Auto Scaling guidance**: Select *Provide guidance to help me set up a template that I can use with EC2 Auto Scaling*.
4. In the **Application and OS Images (Amazon Machine Image)** section:
   - Choose the **My AMIs** tab.
   - Verify that **Web Server AMI** is selected.
5. In the **Instance type** section:
   - Select `t3.micro` from the dropdown.
6. In the **Key pair (login)** section:
   - Set **Key pair name** to `Don't include in launch template`.
   > **Note**: In this lab, you do not need to connect to the instance.
7. In the **Network settings** section:
   - **Security groups**: Select **Web Security Group**.
8. Choose **Create launch template**.
9. You should see: *Successfully created lab-app-launch-template*.
10. Choose **View launch templates**.

---

### Task 4: Creating an Auto Scaling Group

In this task, you use your launch template to create an Auto Scaling group.

#### Steps:

1. Select `lab-app-launch-template`, then from the **Actions** dropdown, choose **Create Auto Scaling group**.
2. On the **Choose launch template or configuration** page:
   - **Auto Scaling group name**: `Lab Auto Scaling Group`
   - Choose **Next**.
3. On the **Choose instance launch options** page, under **Network**:
   - **VPC**: `Lab VPC`
   - **Availability Zones and subnets**: Select `Private Subnet 1 (10.0.1.0/24)` and `Private Subnet 2 (10.0.3.0/24)`.
   - Choose **Next**.
4. On the **Configure advanced options – optional** page:
   - Under **Load balancing – optional**, choose **Attach to an existing load balancer**.
   - Select **Choose from your load balancer target groups**.
   - From the dropdown, choose `lab-target-group | HTTP`.
   - Under **Health checks – optional**:
     - **Health check type**: `ELB`
   - Choose **Next**.
5. On the **Configure group size and scaling policies – optional** page:
   - Under **Group size – optional**:
     - **Desired capacity**: `2`
     - **Minimum capacity**: `2`
     - **Maximum capacity**: `4`
   - Under **Scaling policies – optional**:
     - Choose **Target tracking scaling policy**.
     - **Metric type**: `Average CPU utilization`
     - **Target value**: `50`
     > This tells Auto Scaling to maintain an average CPU utilization of 50% across all instances.
   - Choose **Next**.
6. On the **Add notifications – optional** page, choose **Next**.
7. On the **Add tags – optional** page:
   - Choose **Add tag**:
     - **Key**: `Name`
     - **Value**: `Lab Instance`
   - Choose **Next**.
8. Choose **Create Auto Scaling group**.

> **Note**: The Auto Scaling group initially shows an **Instances count** of zero, but new instances will be launched to reach the desired count of two. If you encounter an error with the `t3.micro` instance type, rerun the task using `t2.micro` instead.

---

### Task 5: Verifying That Load Balancing Is Working

In this task, you verify that load balancing is working correctly.

#### Steps:

1. In the EC2 console, under **Instances**, you should see two new instances named **Lab Instance** (launched by Auto Scaling). If not visible, wait 30 seconds and refresh.
2. In the left navigation pane, under **Load Balancing**, choose **Target Groups**.
3. Select `lab-target-group`.
4. In the **Registered targets** section, verify that two **Lab Instance** targets are listed.
5. Wait until the **Health status** of both instances changes to **healthy**. Refresh as needed.
   > A **healthy** status means the instance has passed the load balancer's health check and will receive traffic.
6. Open a new browser tab, paste the **DNS name** you copied earlier, and press **Enter**.
7. The **Load Test** application should appear, confirming that the load balancer is routing traffic to one of the EC2 instances.

---

### Task 6: Testing Auto Scaling

You created an Auto Scaling group with a minimum of 2 instances and a maximum of 4. Currently, 2 instances are running. You will now increase the load to trigger auto scaling.

#### Steps:

1. Keep the **Load Test** application tab open.
2. Open **CloudWatch** from the AWS Management Console.
3. In the left navigation pane, under **Alarms**, choose **All alarms**.
4. Two alarms are displayed (automatically created by the Auto Scaling group). These keep the average CPU load close to 50% while maintaining 2–4 instances.
5. Select the alarm with **AlarmHigh** in its name. The **State** should be **OK**.
   > If not, wait a minute and refresh until it changes.
6. Return to the **Load Test** application tab.
7. Next to the AWS logo, choose **Load Test** to generate high loads.
   > The page will auto-refresh so all instances generate load. **Do not close this tab.**
8. Return to the **CloudWatch** tab.
9. Within 5 minutes:
   - **AlarmLow** status should change to **OK**.
   - **AlarmHigh** status should change to **In alarm**.
   > Refresh every 60 seconds. The **AlarmHigh** chart should show increasing CPU. Once it crosses 50% for more than 3 minutes, auto scaling will add instances.
10. Wait until **AlarmHigh** enters the **In alarm** state.
11. Return to **EC2 > Instances**. More than two **Lab Instance** instances should now be running — Auto Scaling created them in response to the alarm.

---

### Task 7: Terminating the Web Server 1 Instance

In this task, you terminate the original **Web Server 1** instance, which is no longer needed.

#### Steps:

1. In the EC2 console, select **Web Server 1** (ensure it is the only instance selected).
2. From the **Instance state** dropdown, choose **Terminate instance**.
3. Choose **Terminate**.

---

## Optional Challenge: Creating an AMI Using AWS CLI

> This challenge is optional and intended for use if you have remaining lab time.

In this challenge, you create an AMI using AWS Command Line Interface (AWS CLI) commands.

#### Steps:

1. Use **Amazon EC2 Instance Connect** to connect to one of the EC2 instances created earlier.
2. At the top of the lab page, choose **AWS Details**. For **AWS CLI**, choose **Show**.
3. Configure AWS credentials based on the provided information.
   > For more details, see [Configuration and Credential File Settings](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).
4. Create an AMI using the AWS CLI.
   > For reference, see [AWS CLI Command Reference Examples](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-image.html).
   - **Tip**: You need to provide the AMI name and the instance ID of the EC2 instance you want to image.

---

## Conclusion

Congratulations! You have successfully completed the following:

- ✅ Created an AMI from an EC2 instance.
- ✅ Created a load balancer.
- ✅ Created a launch template and an Auto Scaling group.
- ✅ Configured an Auto Scaling group to scale new instances within private subnets.
- ✅ Used CloudWatch alarms to monitor the performance of your infrastructure.

---

## Lab Complete

> **Note**: Remember to clean up any resources you created if this lab is part of a sandbox environment to avoid unexpected charges.
