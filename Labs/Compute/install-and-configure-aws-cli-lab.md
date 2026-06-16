# Install and Configure the AWS CLI

## Lab Overview

The AWS Command Line Interface (AWS CLI) is a command line tool that provides an interface for interacting with products and services from Amazon Web Services (AWS).

You can install the AWS CLI on your local machine or a virtual machine such as an Amazon Elastic Compute Cloud (Amazon EC2) instance.

In this activity, you install and configure the AWS CLI on a Red Hat Linux instance because this instance type does not have the AWS CLI pre-installed. Some instance types, such as Amazon Linux, do come pre-installed with the AWS CLI.

During this activity, you establish a Secure Shell (SSH) connection to the instance. You configure the installation with an access key that can connect to an AWS account. Finally, you practice using the AWS CLI to interact with AWS Identity and Access Management (IAM).

When you finish the activity, it will reflect the following diagram:

```
![imagine](https://labs.vocareum.com/web/5053054/5296753.0/ASNLIB/public/docs/lang/en-us/images/archi_diagram.png)

```

In the preceding diagram, you can access the AWS Cloud through an SSH connection. Within the AWS Cloud, a virtual private cloud (VPC) with a Red Hat EC2 instance is configured with the AWS CLI. IAM is configured, and you use the AWS CLI to interact with IAM.

---

## Objectives

After completing this lab, you should be able to do the following:

- ✅ Install and configure the AWS CLI.
- ✅ Connect the AWS CLI to an AWS account.
- ✅ Access IAM by using the AWS CLI.

---

## Duration

This activity requires approximately **45 minutes** to complete.

---

## Prerequisites

- An AWS account with appropriate permissions
- Access to the AWS Management Console
- SSH client (PuTTY for Windows, Terminal for macOS/Linux)
- Lab credentials (Access Key ID and Secret Access Key)

---

## Task 1: Connect to the Red Hat EC2 Instance by Using SSH

In this task, you log in to an existing EC2 instance.

### Windows Users

These instructions are specifically for Windows users. If you are using macOS or Linux, skip to the [macOS/Linux Users](#macoslinux-users) section.

1. Select the **Details** drop-down menu above these instructions, and then select **Show**. A Credentials window will be presented.

2. Select the **Download PPK** button and save the `labsuser.ppk` file.  
   Typically your browser will save it to the Downloads directory.

3. Make a note of the **PublicIP** address.

4. Then exit the Details panel by selecting the **X**.

5. Download **PuTTY** to SSH into the Amazon EC2 instance. If you do not have PuTTY installed on your computer, download it [here](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html).

6. Open `putty.exe`

7. Configure your PuTTY session by following the directions in the following link: [Connect to your Linux instance using PuTTY](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/putty.html)

> **Windows Users:** You may now skip ahead to [Task 2](#task-2-install-the-aws-cli-on-a-red-hat-linux-instance).

### macOS/Linux Users

1. Select the **Details** drop-down menu above these instructions, and then select **Show**. A Credentials window will be presented.

2. Select the **Download PEM** button and save the `labsuser.pem` file.

3. Make a note of the **PublicIP** address and the **Username**.

4. Open a terminal window and navigate to the directory where you saved the `.pem` file.

5. Change the permissions of the `.pem` file to make it readable only by you:

   ```bash
   chmod 400 labsuser.pem
   ```

6. Connect to the EC2 instance using SSH:

   ```bash
   ssh -i labsuser.pem ec2-user@<PublicIP>
   ```

   Replace `<PublicIP>` with the Public IP address you noted earlier.

7. When prompted, type `yes` to confirm the connection.

---

## Task 2: Install the AWS CLI on a Red Hat Linux Instance

In this task, you follow these steps from the terminal window to install the AWS CLI on a Red Hat Linux instance.

### Step 1: Download the AWS CLI Installer

To write the downloaded file to the current directory, run the following `curl` command with the `-o` option:

```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
```

> 💡 **Tip:** The `-o` option specifies the output filename. Without it, `curl` would output the file contents to the terminal.

### Step 2: Unzip the Installer

To unzip the installer, run the following `unzip` command with the `-u` option. The `-u` option updates existing files and skips prompts to overwrite:

```bash
unzip -u awscliv2.zip
```

> 💡 **Tip:** The `-u` option prompts you to overwrite any existing files. To skip these prompts, the command includes the `-u` option.

### Step 3: Run the Install Program

To run the install program, run the following command. This `sudo` command grants write permissions to the directory:

```bash
sudo ./aws/install
```

> 💡 **Tip:** The installation command uses a file named `install` in the unzipped `aws` directory to install the AWS CLI.

### Step 4: Confirm the Installation

To confirm the installation, run the following command:

```bash
aws --version
```

The following is an example of the output:

```
aws-cli/2.7.24 Python/3.8.8 Linux/4.14.133-113.105.amzn2.x86_64 botocore/2.4.5
```

> ⚠️ **Note:** The version numbers that are installed change over time and might not reflect this example.

### Step 5: Verify the AWS CLI is Working

To verify that the AWS CLI is now working, run the following `aws help` command:

```bash
aws help
```

The help command displays information for the AWS CLI.

At the `:` prompt, enter `q` to exit.

---

## Task 3: Observe IAM Configuration Details in the AWS Management Console

In this task, you observe the IAM configuration details for the EC2 instance in the AWS Management Console.

1. In the AWS Management Console, in the **Search** box, enter `IAM` and choose **IAM**. This option takes you to the IAM console page.

   > ⚠️ **Note:** The IAM page that appears contains messages indicating that you do not have permission to observe some IAM service details. You can safely ignore these messages.

2. In the navigation pane, choose **Users**, and then choose `awsstudent`.

3. You are now in the **Permissions** tab. Next to `lab_policy`, choose the arrow icon, and then choose the `{} JSON` button.

   This `lab_policy` document is formatted in JSON. The IAM policy grants the `awsstudent` user access to specific AWS services in this account.

4. Choose the **Security credentials** tab. In the **Access keys** section, locate the `awsstudent` user's access key ID.

   > ⚠️ **Note:** Once the access key is created, you must save the secret access key locally at the time that the key is created. For this lab, you can find the access key ID and the secret access key in the **Details** dropdown list at the top of these instructions.

---

## Task 4: Configure the AWS CLI to Connect to Your AWS Account

In the SSH session terminal window, run the configure command for the AWS CLI:

```bash
aws configure
```

At the prompt, configure the following:

| Prompt | Value | Description |
|--------|-------|-------------|
| **AWS Access Key ID** | *(from Details dropdown)* | Copy and paste the `AccessKey` value into the terminal window. |
| **AWS Secret Access Key** | *(from Details dropdown)* | Copy and paste the `SecretKey` value into the terminal window. |
| **Default region name** | `us-west-2` | The AWS region where resources are located. |
| **Default output format** | `json` | The format for command output. |

Example interaction:

```bash
$ aws configure
AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Default region name [None]: us-west-2
Default output format [None]: json
```

> 💡 **Tip:** The `aws configure` command stores your credentials in the `~/.aws/credentials` file and your configuration in the `~/.aws/config` file.

---

## Task 5: Observe IAM Configuration Details by Using the AWS CLI

In this task, you observe the IAM configuration details for the EC2 instance using the AWS CLI.

In the terminal window, test the IAM configuration by running the following command:

```bash
aws iam list-users
```

A successful test shows a JSON response that includes a list of IAM users in the account.

Example output:

```json
{
    "Users": [
        {
            "Path": "/",
            "UserName": "awsstudent",
            "UserId": "AIDAXXXXXXXXXXXXXXXX",
            "Arn": "arn:aws:iam::123456789012:user/awsstudent",
            "CreateDate": "2023-01-01T00:00:00Z"
        }
    ]
}
```

---

## 🏆 Activity 1 Challenge

Use the AWS CLI Command Reference documentation and AWS CLI to download the `lab_policy` document in a JSON-formatted IAM policy document. This is the same document that is in the AWS Management Console.

> ⚠️ **Avoid the temptation to use the AWS Management Console.**

> 💡 **Note:** If permitted, work in a group to complete this challenge.

### Tips to Help You Complete the Challenge

- In the [IAM AWS CLI Command Reference](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/iam/index.html) documentation page, choose the hyperlinks for any commands that you might want to use. You can see the information that the commands will return and details about how to use the commands.
- Look for a command that lists policies. To filter a specific set of policies, set the scope to `Local` because the `lab_policy` document is a customer managed policy.
- Look for a command that can get a policy version. This command requires the version number of the `lab_policy` document and retrieves the actual JSON representation of the IAM policy.
- To pipe any terminal output to a new file, use the `>` command. This command can be useful for storing information relating to the `lab_policy.json` file that you will turn in at the end of this challenge.

---

## Activity Summary

You successfully installed and configured the AWS CLI on a Red Hat Linux instance and connected it to an AWS account. You used the AWS CLI to retrieve policy information by referencing AWS documentation.

### Key Takeaways

- 🎯 You can use the AWS CLI to manage and control multiple AWS services through the command line. You can also accomplish these tasks by using the AWS Management Console.
- 🔑 To connect to the same AWS account, the AWS CLI needed an access key ID and secret access key. To sign in to the AWS Management Console, you need a user name and password.

---

## 🔓 Solution: Activity 1 Challenge

<details>
<summary>Click to reveal the solution</summary>

### Step 1: List Customer Managed Policies

In the IAM AWS CLI Command Reference documentation page, the following command lists IAM policies and filters customer managed policies:

```bash
aws iam list-policies --scope Local
```

This command returns a list of customer-managed policies, including the `lab_policy`. Look for the `Arn` and `DefaultVersionId` fields in the output.

Example output:

```json
{
    "Policies": [
        {
            "PolicyName": "lab_policy",
            "PolicyId": "ANPAXXXXXXXXXXXXXXXX",
            "Arn": "arn:aws:iam::123456789012:policy/lab_policy",
            "Path": "/",
            "DefaultVersionId": "v1",
            "AttachmentCount": 1,
            "PermissionsBoundaryUsageCount": 0,
            "IsAttachable": true,
            "CreateDate": "2023-01-01T00:00:00Z",
            "UpdateDate": "2023-01-01T00:00:00Z"
        }
    ]
}
```

### Step 2: Retrieve the Policy Document

Next, use the version number, `Arn` information, and `DefaultVersionId` found inside the `lab_policy` document to retrieve the JSON IAM policy. Use the `>` command to save the file:

```bash
aws iam get-policy-version --policy-arn arn:aws:iam::123456789012:policy/lab_policy --version-id v1 > lab_policy.json
```

> 💡 **Tip:** Replace `123456789012` with your actual AWS account ID.

### Step 3: Verify the Downloaded File

To verify the contents of the downloaded policy document:

```bash
cat lab_policy.json
```

You should see the JSON-formatted IAM policy document that matches what you observed in the AWS Management Console.

</details>

---

## ✅ Conclusion

Congratulations! You now have successfully done the following:

- ✅ Installed and configured the AWS CLI
- ✅ Connected the AWS CLI to an AWS account
- ✅ Accessed IAM by using the AWS CLI

**Lab complete!** 🎉

---

## Additional Resources

- [AWS CLI User Guide](https://docs.aws.amazon.com/cli/latest/userguide/)
- [AWS CLI Command Reference - IAM](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/iam/index.html)
- [AWS IAM Documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/)
- [Connecting to Your Linux Instance Using SSH](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstancesLinux.html)
- [Installing or updating the latest version of the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Permission denied` when running SSH | Ensure the `.pem` file has `chmod 400` permissions (macOS/Linux) or the `.ppk` file is correctly loaded in PuTTY (Windows). |
| `unzip: command not found` | Install unzip using `sudo yum install unzip` (Red Hat/CentOS) or `sudo apt-get install unzip` (Ubuntu/Debian). |
| `aws: command not found` after installation | The AWS CLI may not be in your PATH. Try running `/usr/local/bin/aws --version` or log out and back in. |
| `AccessDenied` when running AWS commands | Verify your Access Key ID and Secret Access Key are correct in `aws configure`. |
| Cannot find `lab_policy` | Ensure you are using `--scope Local` in the `list-policies` command, as `lab_policy` is a customer-managed policy. |

---

*Last updated: 2026*
