# Troubleshooting a VPC

## Lab Overview

In this lab, you troubleshoot virtual private cloud (VPC) configurations and analyze VPC Flow Logs.

You begin with an environment that includes two VPCs, Amazon Elastic Compute Cloud (Amazon EC2) instances, and other networking components shown in the following diagram.

This diagram also shows four numbered circles (#1–4) that indicate the order in which you work through this lab.

> **VPC components** that support the café web server instance runtime environment. The diagram also shows a CLI Host instance located in a separate VPC to run AWS CLI commands for troubleshooting. Numbered labels in the diagram identify these tasks.

Your tasks include the following:

1. Creating an Amazon Simple Storage Service (Amazon S3) bucket to hold VPC Flow Log data
2. Creating a flow log to capture all IP traffic passing through network interfaces in the VPC
3. Troubleshooting the VPC configuration issues to allow access to the resources
4. Downloading and analyzing the flow log data

## Objectives

By the end of this lab, you will be able to do the following:

-  **Create VPC Flow Logs** — Set up an S3 bucket and configure flow logs to capture IP traffic data.
-  **Troubleshoot VPC configuration issues** — Identify and resolve routing, security group, and network ACL problems.
- **Analyze flow logs** — Download, extract, and query VPC Flow Logs to diagnose network issues.


## Duration

This lab requires approximately **75 minutes** to complete.

![imagine ](https://github.com/MrPhadagi-bit/ppppp1/blob/main/Architecture%20(1).png?raw=true)

---

## Task 1: Connecting to the CLI Host Instance

In this task, you use EC2 Instance Connect to connect to the CLI Host instance. You use this instance to run AWS Command Line Interface (AWS CLI) commands.

### Step 1: Open EC2 Console

1. On the AWS Management Console, in the **Search bar**, enter and choose **EC2** to open the EC2 Management Console.

### Step 2: Select the CLI Host Instance

2. In the navigation pane, choose **Instances**.
3. From the list of instances, select the **CLI Host** instance.

### Step 3: Connect via EC2 Instance Connect

4. Choose **Connect**.
5. On the **EC2 Instance Connect** tab, choose **Connect**.

> This option opens a new browser tab that shows the EC2 Instance Connect terminal window.

> **Note:** If you prefer to use an SSH client to connect to the EC2 instance, see the guidance to [Connect to Your Linux Instance](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstancesLinux.html).

> **Tip:** You use this terminal window to complete the tasks throughout the lab. If the terminal becomes unresponsive, refresh the browser or use the steps in this task to connect again.

Now that you are connected to the CLI Host instance, you can configure and use the AWS CLI to call AWS services.

---

### Task 1.1: Configuring the AWS CLI on the CLI Host Instance

To configure the AWS CLI profile with credentials, in the EC2 Instance Connect terminal, run the following command:

```bash
aws configure
```

At the prompts, copy the following values that you pasted into your text editor, and paste them into the terminal window as directed:

| Prompt | Value |
|--------|-------|
| **AWS Access Key ID** | Enter the value for `AccessKey` |
| **AWS Secret Access Key** | Enter the value for `SecretKey` |
| **Default region name** | `us-west-2` |
| **Default output format** | `json` |

> You run CLI commands on this CLI Host terminal window as instructed throughout the lab.

---

## Task 2: Creating VPC Flow Logs

In this task, you create an S3 bucket to publish data from VPC Flow Logs. Then you create VPC Flow Logs on VPC1 to capture information about IP traffic between network interfaces in VPC1. The flow logs are then published to the S3 bucket.

### Step 1: Create the S3 Bucket

To create the S3 bucket where the flow logs will be published, run the following command. In the command, replace `######` with six random numbers:

```bash
aws s3api create-bucket --bucket flowlog###### --region 'us-west-2' --create-bucket-configuration LocationConstraint='us-west-2'
```

**Expected Output:**
```json
{
    "Location": "http://flowlog######.s3.amazonaws.com"
}
```

> In this command, `flowlog######` is your bucket name. **You use this bucket name in a later step.**

> **Note:** If you receive an error message indicating that *Bucket name already exists*, use a different set of random numbers to replace `######` and run the command again.

### Step 2: Get the VPC ID for VPC1

To get the VPC ID for VPC1 to create VPC Flow Logs, run the following command:

```bash
aws ec2 describe-vpcs --query 'Vpcs[*].[VpcId,Tags[?Key==`Name`].Value,CidrBlock]' --filters "Name=tag:Name,Values='VPC1'"
```

**Expected Output:**
```json
[
    [
        "vpc-01edacbe1c31959d2",
        ["VPC1"],
        "10.0.0.0/16"
    ]
]
```

> The JSON-formatted output shows the VPC ID: `vpc-01edacbe1c31959d2`

### Step 3: Create VPC Flow Logs

To create VPC Flow Logs on VPC1, run the following command. In the command, replace `<flowlog######>` with the bucket name from the previous steps, and replace `<vpc-id>` with the VPC ID for VPC1 from the previous step.

```bash
aws ec2 create-flow-logs --resource-type VPC --resource-ids <vpc-id> --traffic-type ALL --log-destination-type s3 --log-destination arn:aws:s3:::<flowlog######>
```

**Expected Output:**
```json
{
    "FlowLogIds": ["fl-xxxxxxxxxxxxxxxxx"],
    "ClientToken": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

> **Note:** If you see an `"Unsuccessful"` message, ignore it.

### Step 4: Confirm Flow Log Creation

To confirm that the flow log was created, run the following command:

```bash
aws ec2 describe-flow-logs
```

**Expected Output:**
```json
{
    "FlowLogs": [
        {
            "FlowLogId": "fl-xxxxxxxxxxxxxxxxx",
            "FlowLogStatus": "ACTIVE",
            "LogDestination": "arn:aws:s3:::flowlog######",
            ...
        }
    ]
}
```

> The command output should show that a single flow log was created with a `FlowLogStatus` of `ACTIVE` and a log destination that points to your S3 bucket.

Now that the flow log has been created, you can continue to the next task, which involves some troubleshooting.

---

## Task 3: Troubleshooting VPC Configuration Issues to Allow Access to Resources

In this task, you analyze access to the web server instance and troubleshoot some networking issues. Recall that the cafe web server instance runs in the public subnet in VPC1. Refer to the diagram at the start of this lab to see details about how the network should be configured.

### Initial Verification: Test Web Server Access

1. From your text editor, copy the **WebServerIP** IP address, and paste it into a new browser tab.

> After a few moments, the page fails to load, and you receive a message indicating that the site can't be reached or the connection has timed out. **This message is expected.**

> Leave this browser tab open so that you can return to it later.

### Step 2: Find Web Server Instance Details

In the CLI Host terminal, to find details about the web server instance, run the following command. In the command, replace `<WebServerIP>` with the WebServerIP address that you used in the previous steps:

```bash
aws ec2 describe-instances --filter "Name=ip-address,Values='<WebServerIP>'"
```

A large JSON document is returned that provides more details than you need for your troubleshooting.

To return only relevant details, you filter the results on the client side by using the `--query` parameter. The following command returns only the state of the instance, the private IP address, the instance ID, the security groups that are applied to it, the subnet in which it runs, and the key pair name that is associated with it.

```bash
aws ec2 describe-instances --filter "Name=ip-address,Values='<WebServerIP>'" --query 'Reservations[*].Instances[*].[State,PrivateIpAddress,InstanceId,SecurityGroups,SubnetId,KeyName]'
```

> The command results indicate that the instance is running and return additional information that you can use later.

### Step 3: Attempt SSH Connection via EC2 Instance Connect

Next, you try to establish an SSH connection to the web server instance by using EC2 Instance Connect.

1. In the browser tab with the AWS Management Console, in the Search bar, enter and choose **EC2** to open the EC2 Management Console.
2. In the navigation pane, choose **Instances**.
3. From the list of instances, select the **Cafe Web Server** instance.
4. Choose **Connect**.
5. On the **EC2 Instance Connect** tab, choose **Connect**.

> After a few seconds, the attempt to connect fails. You get an error on the browser window that says, *"Failed to connect to your instance."* **This behavior is expected.**

---

### Troubleshooting Challenge #1: Web Server Access

You have established that the web server instance is running but the webpage is not loading. What could the issue be?

> **Challenge yourself** to conduct your investigation by using only AWS CLI programmatic access. Avoid using the AWS Management Console.

#### Hints & Steps:

**1. Check Open Ports with nmap**

Use the `nmap` utility to check which ports are open on the web server EC2 instance.

First, install the utility on the CLI Host instance:

```bash
sudo yum install -y nmap
```

Then run:

```bash
nmap <WebServerIP>
```

> If `nmap` cannot find any open ports, could there be something else blocking access to the instance?

**2. Check Security Group Settings**

Check the security group details by using the `aws ec2 describe-security-groups` command.

You might find it helpful to analyze the results of the command if you use the `group-ids` parameter. This value is also available in the text editor (`WebServerSgId`) with the other values that you've used in this lab.

```bash
aws ec2 describe-security-groups --group-ids <WebServerSgId>
```

> After you run the `describe-security-groups` command, analyze the resulting output. **Do the security group settings that are applied to the web server EC2 instance look like they are allowing connectivity to port 22?**

**3. Check Route Table Settings**

Check the route table settings for the route table that is associated with the subnet where the web server is running.

```bash
aws ec2 describe-route-tables --filter "Name=association.subnet-id,Values='<VPC1PubSubnetID>'"
```

> When you analyze the output of the `describe-route-tables` command, recall that the subnet is labeled as public. **Do you notice any issues with the routes?**

**4. Fix the Route (if needed)**

If you must define a new route, use the `aws ec2 create-route` command.

You must know the `route-table-id` and `gateway-id` to successfully create a route. Both of these values are available in the text editor. You should also have the `route-table-id` from when you ran the `describe-route-tables` command earlier.

```bash
aws ec2 create-route --route-table-id <route-table-id> --destination-cidr-block 0.0.0.0/0 --gateway-id <gateway-id>
```

You can also use the `aws ec2 describe-internet-gateways` command to get the `gateway-id`:

```bash
aws ec2 describe-internet-gateways --filters "Name=attachment.vpc-id,Values='<vpc-id>'"
```

**5. Verify the Fix**

After you think you have solved the issue, return to the browser tab where you tried to load the web server page, and refresh the webpage.

> **Expected Result:** The browser page should display a message that says, *"Hello From Your Web Server!"*

🎉 **Congratulations!** You have resolved the issue that prevented you from accessing the website. However, another issue remains, and you investigate this issue in the next section.

---

### Troubleshooting Challenge #2: SSH Access

Now that you resolved the web access issue, try connecting to the web server instance using EC2 Instance Connect.

> This attempt also fails. An error similar to the message that you received earlier displays on the browser. Again, **this behavior is expected.**

What could be the remaining issue?

You already verified that the web server is running. You successfully created a route table entry to connect the subnet where the web server instance is running to the internet. You also verified that the security group allows connections on port 22, which is the default SSH port.

#### Hints & Steps:

**1. Check Network ACL Settings**

On the CLI Host instance terminal, check the network access control list (network ACL) settings for the network ACL that is associated with the subnet where the instance is running.

```bash
aws ec2 describe-network-acls --filter "Name=association.subnet-id,Values='<VPC1PublicSubnetID>'" --query 'NetworkAcls[*].[NetworkAclId,Entries]'
```

> Analyze the output that results from running the command. **Do any of the entries look like they might be causing the issue?**

**2. Delete Problematic Network ACL Entries**

To delete any network ACL entries that might be causing an issue, use the `delete-network-acl-entry` command. Note the `network-acl-id` retrieved by the previous command.

```bash
aws ec2 delete-network-acl-entry --network-acl-id <network-acl-id> --rule-number <rule-number> --ingress
```

> **Note:** You may need to delete both ingress and egress rules depending on the issue.

**3. Verify the Fix**

After you think you have solved the issue, try connecting to the web server instance using EC2 Instance Connect again and confirm that you can connect.

If you can connect, you have successfully resolved the issue. To confirm that you are connected to the correct EC2 instance, run the `hostname` command after you are connected.

> **Expected Result:** It should indicate `web-server` as the hostname.

🎉 **Congratulations!** You have resolved the SSH access issue that prevented you from connecting to the web server.

---

## Task 4: Analyzing Flow Logs

You have resolved the network issues. While doing so, you created some useful entries in the flow logs that you created when you created VPC Flow Logs at the beginning of this lab.

In this final task, you query the flow logs to observe the activities that they capture.

---

### Task 4.1: Downloading and Extracting Flow Logs

**Step 1: Create a Local Directory**

In the CLI Host terminal window, to create a local directory where you can download the flow log files, run the following command:

```bash
mkdir flowlogs
```

**Step 2: Change Directory**

```bash
cd flowlogs
```

**Step 3: List S3 Buckets**

To list the S3 buckets to recall the bucket name, run the following command:

```bash
aws s3 ls
```

**Step 4: Download Flow Logs**

To download the flow logs, run the following command. In the command, replace `<flowlog######>` with the bucket name that you used earlier in the lab:

```bash
aws s3 cp s3://<flowlog######>/ . --recursive
```

> If the command is successful, you should see that many files are downloaded to a subdirectory similar to the following: `AWSLogs/AccountID/vpcflowlogs/us-west-2/yyyy/mm/dd/`

**Step 5: Navigate to the Subdirectory**

Next, you move down the folder structure to the subdirectory where you downloaded the files.

```bash
cd <AWSLogs/AccountID/vpcflowlogs/us-west-2/yyyy/mm/dd/>
```

> **Tip:** You can also use the `cd` command and repeatedly press the **Tab** key to reach the required subdirectory.

**Step 6: List Downloaded Files**

To see all the downloaded log files, run the `ls` command.

```bash
ls
```

> The logs are located in an `AWSLogs/<AccountID>/vpcflowlogs/<region>/yyyy/mm/dd` subdirectory. The file names all end in `log.gz`, which indicates that they are compressed as GNU .zip files.

**Step 7: Extract the Logs**

To extract the logs, run the following command:

```bash
gunzip *.gz
```

**Step 8: Verify Extraction**

Run the `ls` command again.

```bash
ls
```

> All the files are now extracted.

---

### Task 4.2: Analyzing the Logs

In this section, you analyze the flow logs to check if your failed SSH connection attempts were captured in the logs.

#### Step 1: Analyze Log Structure

First, you analyze the structure of the logs.

Copy one of the file names that were returned by the `ls` command that you ran in the previous steps.

In the terminal window, run the following command. In the command, replace `<file name>` with the file name that you copied in the previous step:

```bash
head <file name>
```

> The header row indicates the kind of data that each log entry contains. Each entry contains information, such as:
> - The IP address of the source of the event (in the **fourth column**)
> - The destination port (**seventh column**)
> - Start and end timestamps (in Unix timestamp format)
> - The action that resulted (**ACCEPT** or **REJECT**)

#### Step 2: Search for REJECT Entries

To search each log file in the current directory and return lines that contain the word `REJECT`, run the following command:

```bash
grep -rn REJECT .
```

> This command should return a large dataset because it includes every event where the VPC settings rejected the request.

#### Step 3: Count REJECT Entries

To find out how many records were returned, run the following command:

```bash
grep -rn REJECT . | wc -l
```

> The results show the number of lines in your result set.

#### Step 4: Filter for Port 22

To refine your search by looking for only lines that contain `22` (which is the port number where you attempted to connect to the web server when access was blocked), run the following command:

```bash
grep -rn 22 . | grep REJECT
```

> This command should return a smaller number of results.

#### Step 5: Isolate Failed SSH Connection Attempts

To isolate the result set so that it displays only the log entries that correspond to the failed SSH connection attempts that you made, you must filter the results further.

Recall that your failed attempts to use SSH to connect the web server were initiated from your local machine. In the next step, you determine the IP address by which your local machine is addressable from the internet.

**Get Your Public IP Address:**

1. On the AWS Management Console, go to the Amazon EC2 service in the same Region where your EC2 instances are running.
2. Choose **Security Groups**.
3. Choose the link for **WebSecurityGroup**, and then choose the **Inbound rules** tab.
4. Choose **Edit inbound rules**, and then choose **Add Rule**.
5. In the third row that you just created, for **Source**, choose **My IP**.
6. Copy the IP address from the Classless Inter-Domain Routing (CIDR) block that is automatically populated (it will end in `/32`), and paste it into a text editor. **Copy only the IP address, not the `/32` suffix.**
7. Choose **Cancel**.

> You do not need to modify any security groups in this account. The purpose of this step is to capture this IP address.

**Run the Refined Query:**

In the CLI Host terminal session, run the following refined query on the flow logs. In the following command, replace `<ip-address>` with the IP address from the CIDR block that you copied in the previous steps:

```bash
grep -rn 22 . | grep REJECT | grep <ip-address>
```

> The number of lines in the result set should now match the number of times you tried and failed to use SSH to connect the web server instance.

> Notice that the elastic network interface ID is in each of the log entries that were returned by your query.

#### Step 6: Verify Network Interface ID

To confirm that the network interface ID that is recorded in the flow log matches the network interface that is assigned to the web server instance, run the following command. In the command, replace `<WebServerIP>` with the IP address from text editor:

```bash
aws ec2 describe-network-interfaces --filters "Name=association.public-ip,Values='<WebServerIP>'" --query 'NetworkInterfaces[*].[NetworkInterfaceId,Association.PublicIp]'
```

#### Step 7: Translate Timestamps

Notice the two long numbers that appear toward the end of each log entry before the `REJECT` term.

These numbers are Unix-formatted timestamps. The first timestamp indicates the start time of each event that was captured. The second timestamp indicates the end time. You can convert them into a human-readable format by using the Linux `date` command line utility.

For example, if the timestamp is `1554496931`, then you would run the following command:

```bash
date -d @1554496931
```

To translate one of the timestamps into a human-readable format, run the `date -d @<timestamp>` command for one of the captured timestamps from one of the filtered `REJECT` results.

> It should indicate a time from today that corresponds to when you were working through this lab.

To compare the result to the current time, run the following command:

```bash
date
```

---

## Conclusion

🎉 **Congratulations!** You now have successfully done the following:

- ✅ **Created VPC Flow Logs** — Set up an S3 bucket and configured flow logs to capture all IP traffic.
- ✅ **Troubleshot VPC configuration issues** — Identified and resolved routing table, security group, and network ACL problems.
- ✅ **Analyzed flow logs** — Downloaded, extracted, and queried VPC Flow Logs to diagnose network issues and verify failed SSH attempts.

**Lab complete!**

---

## Additional Resources

Using `grep` is a powerful but basic way to pull meaningful data out of VPC Flow Log files. The market offers many tools for running reports or generating analytic dashboards from logs.

### Amazon Athena

One solution is to use the **Amazon Athena** service. You can use Athena to ingest logs so that they become data in a database table. You can then run SQL queries to extract meaningful information from the logs.

For more information about Athena, see:
- [Querying Amazon VPC Flow Logs](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs-athena.html)
- [Amazon Athena Documentation](https://docs.aws.amazon.com/athena/)

### AWS Documentation

- [VPC Flow Logs](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html)
- [Working with Flow Logs](https://docs.aws.amazon.com/vpc/latest/userguide/working-with-flow-logs.html)
- [Troubleshooting VPC Connectivity](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-troubleshooting.html)
- [Security Groups for Your VPC](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html)
- [Network ACLs](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html)
- [Route Tables](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html)

---

## Quick Reference: Common Commands

| Task | Command |
|------|---------|
| Configure AWS CLI | `aws configure` |
| Create S3 bucket | `aws s3api create-bucket --bucket <name> --region us-west-2 --create-bucket-configuration LocationConstraint=us-west-2` |
| Describe VPCs | `aws ec2 describe-vpcs --query 'Vpcs[*].[VpcId,Tags[?Key==\`Name\`].Value,CidrBlock]' --filters "Name=tag:Name,Values='VPC1'"` |
| Create flow logs | `aws ec2 create-flow-logs --resource-type VPC --resource-ids <vpc-id> --traffic-type ALL --log-destination-type s3 --log-destination arn:aws:s3:::<bucket>` |
| Describe instances | `aws ec2 describe-instances --filter "Name=ip-address,Values='<IP>'" --query 'Reservations[*].Instances[*].[State,PrivateIpAddress,InstanceId,SecurityGroups,SubnetId,KeyName]'` |
| Describe security groups | `aws ec2 describe-security-groups --group-ids <sg-id>` |
| Describe route tables | `aws ec2 describe-route-tables --filter "Name=association.subnet-id,Values='<subnet-id>'"` |
| Create route | `aws ec2 create-route --route-table-id <rtb-id> --destination-cidr-block 0.0.0.0/0 --gateway-id <igw-id>` |
| Describe network ACLs | `aws ec2 describe-network-acls --filter "Name=association.subnet-id,Values='<subnet-id>'" --query 'NetworkAcls[*].[NetworkAclId,Entries]'` |
| Delete network ACL entry | `aws ec2 delete-network-acl-entry --network-acl-id <nacl-id> --rule-number <rule-number> --ingress` |
| Download flow logs | `aws s3 cp s3://<bucket>/ . --recursive` |
| Extract logs | `gunzip *.gz` |
| Search REJECT entries | `grep -rn REJECT .` |
| Filter SSH rejects | `grep -rn 22 . \| grep REJECT \| grep <ip-address>` |
| Convert Unix timestamp | `date -d @<timestamp>` |

---

> **Lab Version:** 1.0  
> **Last Updated:** June 2026  
> **Region:** us-west-2 (Oregon)
