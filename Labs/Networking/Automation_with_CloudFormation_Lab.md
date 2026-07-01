# Automation with CloudFormation

> **Deploying infrastructure in a consistent, reliable manner is difficult** — it requires people to follow documented procedures without taking any undocumented shortcuts. Plus, it can be difficult to deploy infrastructure out-of-hours when less staff are available. AWS CloudFormation changes this by defining infrastructure in a template that can be automatically deployed — even on an automated schedule.

This lab provides hands-on experience in deploying and editing CloudFormation stacks. It is an interactive experience, requiring you to consult documentation to discover how to define resources within a CloudFormation template.

---

## Lab Objectives

By the end of this lab, you will be able to:

1. **Deploy** an AWS CloudFormation stack with a defined Virtual Private Cloud (VPC) and Security Group.
2. **Configure** an AWS CloudFormation stack with additional resources, such as an Amazon Simple Storage Service (S3) bucket and an Amazon Elastic Compute Cloud (EC2) instance.
3. **Update** an existing CloudFormation stack by modifying its template.
4. **Terminate** an AWS CloudFormation stack and its respective resources.

## Duration

 **Approximately 45 minutes**

![imagine](https://github.com/MrPhadagi-bit/ppppp1/blob/main/architecture.png?raw=true)

---

## Task 1: Deploy a CloudFormation Stack

In this task, you will deploy a CloudFormation stack that creates a VPC, as illustrated in the architecture diagram.

### Step 1.1: Review the CloudFormation Template

1. Download the CloudFormation template file: `task1.yaml`
2. Open the file in a **Text Editor** (not a Word Processor) such as VS Code, Notepad++, or Sublime Text.
3. Review the template structure:

| Section | Purpose |
|---------|---------|
| **Parameters** | Prompts for input values (e.g., CIDR ranges for the VPC and subnet). These values can be referenced elsewhere in the template. |
| **Resources** | Defines the infrastructure to be deployed (VPC, Security Group, etc.). |
| **Outputs** | Provides selective information about created resources (e.g., the Default Security Group ID). |

> **Note:** CloudFormation templates are written in **YAML** (or JSON). The format is critical — pay close attention to **indents** and **hyphens**.

### Step 1.2: Launch the Stack

1. In the **AWS Management Console**, navigate to **Services** → **CloudFormation**.
2. Click **Create stack**.
3. Under **Prerequisite - Prepare template**, select **Upload a template file**.
4. Click **Choose file** and upload the `task1.yaml` template you downloaded earlier.
5. Click **Next**.

### Step 1.3: Specify Stack Details

1. **Stack name**: Enter `Lab`
2. In the **Parameters** section, you will see prompts for:
   - **VPC CIDR Range**
   - **Subnet CIDR Range**

   > Default values are already specified in the template, so **no modification is needed**.

3. Click **Next**.

### Step 1.4: Configure Stack Options

1. Review the optional settings (tags, IAM role, rollback configuration, etc.).
2. Leave all settings at their **default values**.
3. Click **Next**.

### Step 1.5: Review and Create

1. Review the summary of all settings.
2. Some resources are defined with **custom names**, which can lead to naming conflicts. CloudFormation will prompt you to acknowledge this.
3.  Check the acknowledgement box for custom names.
4. Click **Create stack**.

### Step 1.6: Monitor Stack Creation

1. The stack will enter the `CREATE_IN_PROGRESS` status.
2. Click the **Events** tab to view activities in reverse chronological order:
   - Resource creation start/completion
   - Any errors encountered
3. Click the **Resources** tab to see resources being created. CloudFormation automatically determines the optimal creation order (e.g., VPC before subnet).
4. Wait until the status changes to **`CREATE_COMPLETE`**.
   >  Click **Refresh** occasionally to update the display.

> **Optional:** Navigate to the **VPC Console** to verify the `Lab` VPC was created, then return to CloudFormation.

---

## Task 2: Add an Amazon S3 Bucket to the Stack

In this task, you will edit the CloudFormation template to add an Amazon S3 bucket, then update the existing stack.

### Objective

- Add an Amazon S3 bucket resource to the template.
- Update the `Lab` stack with the revised template.
- Observe CloudFormation's ability to add resources without redeploying unchanged ones.

### Step 2.1: Edit the Template

1. Open `task1.yaml` in your text editor.
2. Under the **`Resources:`** section, add the following lines:

```yaml
  MyS3Bucket:
    Type: AWS::S3::Bucket
```

> **Tips:**
> - Use **two spaces** for each indent level.
> - No `Properties` are required for a basic S3 bucket.
> - The solution requires only **two lines** — one for the resource identifier and one for the `Type`.
> - Refer to the [Amazon S3 Template Snippets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/quickref-s3.html) documentation for YAML examples.

### Step 2.2: Update the Stack

1. In the **CloudFormation Console**, select the **`Lab`** stack.
2. Click **Update**.
3. Under **Prerequisite - Prepare template**, select **Replace current template**.
4. Choose **Upload a template file** → **Choose file**, then select your modified `task1.yaml`.
5. Click **Next**.
6. On the **Specify stack details** page, click **Next**.
7. On the **Configure stack options** page, click **Next**.
8. Wait for CloudFormation to calculate the changes. At the bottom of the page, you should see:

   ```
   Add: MyS3Bucket (AWS::S3::Bucket)
   ```

   > This demonstrates that CloudFormation will **only add** the new bucket — all other resources remain unchanged.

9. Click **Update stack**.

### Step 2.3: Verify the Update

1. Wait for the stack status to change from `UPDATE_IN_PROGRESS` to **`UPDATE_COMPLETE`**.
2. Click the **Resources** tab.
3. The new S3 bucket will appear in the list. CloudFormation assigns it a **random name** to avoid conflicts.

> **Optional:** Navigate to the **S3 Console** to verify the bucket was created, then return to CloudFormation.

---

## Task 3: Add an Amazon EC2 Instance to the Stack

In this task, you will add an Amazon EC2 instance to the template. This is more complex than the S3 bucket because it requires referencing associated resources (AMI, security group, subnet).

### Step 3.1: Add the AMI Parameter

1. In `task1.yaml`, locate the **`Parameters:`** section.
2. Add the following parameter to dynamically retrieve the latest Amazon Linux 2 AMI:

```yaml
  AmazonLinuxAMIID:
    Type: AWS::SSM::Parameter::Value<AWS::EC2::Image::Id>
    Default: /aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2
```

> This parameter uses the **AWS Systems Manager Parameter Store** to automatically fetch the latest AMI ID for the stack's region. This eliminates the need to manually specify AMI IDs for different regions.

### Step 3.2: Add the EC2 Instance Resource

1. Under the **`Resources:`** section, add the EC2 instance:

```yaml
  AppServer:
    Type: AWS::EC2::Instance
    Properties:
      ImageId: !Ref AmazonLinuxAMIID
      InstanceType: t3.micro
      SecurityGroupIds:
        - !Ref AppSecurityGroup
      SubnetId: !Ref PublicSubnet
      Tags:
        - Key: Name
          Value: App Server
```

> **Key Concepts:**
> - **`!Ref`** is used to reference other resources or parameters within the same template.
> - **`SecurityGroupIds`** expects a **list** (hence the `-` hyphen before `!Ref AppSecurityGroup`).
> - Refer to the [AWS::EC2::Instance](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html) documentation for more details.

### Step 3.3: Update the Stack

1. In the **CloudFormation Console**, select the **`Lab`** stack.
2. Click **Update**.
3. Choose **Replace current template** → **Upload a template file**.
4. Select your modified `task1.yaml` and click **Next**.
5. On the **Specify stack details** page, click **Next**.
6. On the **Configure stack options** page, click **Next**.
7. Review the change preview. You should see:

   ```
   Add: AppServer (AWS::EC2::Instance)
   ```

8. Click **Update stack**.

### Step 3.4: Verify the EC2 Instance

1. Wait for the stack status to reach **`UPDATE_COMPLETE`**.
2. Click the **Resources** tab — the `AppServer` instance will be listed.

> **Optional:** Navigate to the **EC2 Console** to see the `App Server` instance, then return to CloudFormation.

---

## Task 4: Delete the Stack

When a CloudFormation stack is deleted, all resources that it created are automatically terminated.

### Step 4.1: Initiate Deletion

1. In the **CloudFormation Console**, select the **`Lab`** stack.
2. Click **Delete**.
3. At the confirmation prompt, click **Delete stack**.

### Step 4.2: Monitor Deletion

1. The stack will show `DELETE_IN_PROGRESS`.
2. CloudFormation will automatically delete all resources in the correct order (e.g., EC2 instance before subnet, subnet before VPC).
3. After a few minutes, the stack will disappear from the list.

### Step 4.3: Verify Resource Cleanup

> **Optional:** Verify that the following resources have been deleted:
> - **S3 Console** — The bucket created by the stack
> - **EC2 Console** — The `App Server` instance
> - **VPC Console** — The `Lab` VPC and associated resources

---

## Summary

| Task | What You Did | Key Takeaway |
|------|-------------|--------------|
| **Task 1** | Deployed a CloudFormation stack with a VPC and Security Group. | CloudFormation automates infrastructure deployment from a template. |
| **Task 2** | Added an S3 bucket by editing the template and updating the stack. | Updating a stack only modifies changed resources — existing ones remain untouched. |
| **Task 3** | Added an EC2 instance with cross-resource references (`!Ref`). | Templates can dynamically reference other resources and parameters for flexibility. |
| **Task 4** | Deleted the stack and verified resource cleanup. | Stack deletion automatically removes all managed resources, ensuring clean teardown. |

---

## Additional Resources

- [AWS CloudFormation Documentation](https://docs.aws.amazon.com/cloudformation/)
- [AWS CloudFormation Template Reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-reference.html)
- [Amazon S3 Template Snippets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/quickref-s3.html)
- [AWS::EC2::Instance Documentation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html)
- [Query for the latest Amazon Linux AMI IDs using AWS Systems Manager Parameter Store](https://aws.amazon.com/blogs/compute/query-for-the-latest-amazon-linux-ami-ids-using-aws-systems-manager-parameter-store/)

---

*Lab Complete* 
