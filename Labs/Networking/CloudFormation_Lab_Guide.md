# Automation with CloudFormation

Deploying infrastructure in a consistent, reliable manner is difficult — it requires people to follow documented procedures without taking any undocumented shortcuts. Plus, it can be difficult to deploy infrastructure out-of-hours when less staff are available. AWS CloudFormation changes this by defining infrastructure in a template that can be automatically deployed — even on an automated schedule.

This lab provides experience in deploying and editing CloudFormation stacks. It is an interactive experience, requiring you to consult documentation to discover how to define resources within a CloudFormation template.

## Lab Objectives

This lab will demonstrate how to:

- Deploy an AWS CloudFormation stack with a defined Virtual Private Cloud (VPC), and Security Group.
- Configure an AWS CloudFormation stack with resources, such as an Amazon Simple Storage Solution (S3) bucket and Amazon Elastic Compute Cloud (EC2).
- Terminate an AWS CloudFormation stack and its respective resources.

## Duration

This lab will require approximately **45 minutes** to complete.

---

## Prerequisites

- Access to the AWS Management Console
- A text editor (not a word processor) for editing YAML files
- The provided CloudFormation template file: `task1.yaml`

---

## Task 1: Deploy a CloudFormation Stack

In this task, you will deploy a CloudFormation stack that creates a VPC as shown in the lab architecture diagram.

### Understanding the Template

Before deploying, let's examine the structure of the `task1.yaml` file:

| Section | Purpose |
|---------|---------|
| **Parameters** | Prompts for inputs that can be used elsewhere in the template. This template asks for two IP address (CIDR) ranges for defining the VPC. |
| **Resources** | Defines the infrastructure to be deployed. This template defines the VPC and a Security Group. |
| **Outputs** | Provides selective information about resources in the stack. This template outputs the Default Security Group for the created VPC. |

> **Note:** The template is written in **YAML** (YAML Ain't Markup Language), a format commonly used for configuration files. The file format is important — pay close attention to indents and hyphens. CloudFormation templates can also be written in JSON.

### Step-by-Step Deployment

1. **Navigate to CloudFormation**
   - In the AWS Management Console, on the **Services** menu, click **CloudFormation**.

2. **Create a New Stack**
   - Click **Create stack**.
   - Select **Upload a template file**.
   - Click **Browse** or **Choose file** and upload the `task1.yaml` template file you downloaded earlier.
   - Click **Next**.

3. **Specify Stack Details**
   - **Stack name:** Enter `Lab`
   - In the **Parameters** section, you will see prompts for the IP address (CIDR) range for the VPC and Subnet. Default values have been specified by the template, so there is no need to modify these values.
   - Click **Next**.

4. **Configure Stack Options**
   - The Options page can be used to specify additional parameters. Browse the page, but leave settings at their default values.
   - Click **Next**.

5. **Review and Create**
   - The Review page displays a summary of all settings.
   - Some resources are defined with custom names, which can lead to naming conflicts. CloudFormation will prompt you to acknowledge that custom names are being used.
   - Check the acknowledgement box.
   - Click **Create stack**.

6. **Monitor Stack Creation**
   - The stack will enter the `CREATE_IN_PROGRESS` status.
   - Click the **Events** tab and scroll through the listing. The listing shows (in reverse order) the activities performed by CloudFormation, such as starting to create a resource and then completing the resource creation. Any errors encountered will be listed here.
   - Click the **Resources** tab to see the resources being created. CloudFormation determines the optimal order for resource creation (e.g., creating the VPC before the subnet).
   - Wait until the status changes to `CREATE_COMPLETE`. Click **Refresh** occasionally to update the display.

7. **Verification (Optional)**
   - Go to the **VPC console** to see the Lab VPC that was created.
   - Return to the CloudFormation console.

---

## Task 2: Add an Amazon S3 Bucket to the Stack

In this task, you will gain experience editing a CloudFormation template by adding an Amazon S3 bucket.

### Objective

- Add an Amazon S3 bucket to the template
- Update the stack with the revised template
- This will result in a new bucket being deployed

### Instructions

Rather than following pre-defined steps, you will need to discover how to update the template yourself! Here are some tips to guide you:

1. **Edit the Template**
   - Open the `task1.yaml` file in your text editor.
   - Add an Amazon S3 bucket resource under the `Resources:` section.
   - Refer to the [Amazon S3 Template Snippets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/quickref-s3.html) documentation for assistance. Look at the YAML example.

2. **Key Requirements**
   - Your code should go under the `Resources:` header in the template file.
   - You do not require any Properties for this bucket resource.
   - **Indents are important in YAML** — use two spaces for each indent.
   - The correct solution only needs **two lines**: one for the identifier and one for the `Type`.

### Example Solution Structure

```yaml
Resources:
  # ... existing resources ...

  MyS3Bucket:
    Type: AWS::S3::Bucket
```

### Update the Stack

Once you have edited the template, follow these steps to update the stack:

1. In the CloudFormation console, select the **Lab** stack.
2. Click **Update**.
3. Choose **Replace current template**, then choose **Upload a template file**.
4. Click **Choose file**, then browse to and select the modified `task1.yaml` file.
5. Click **Next**.
6. On the **Specify stack details** page, click **Next**.
7. On the **Configure stack options** page, click **Next**.
8. Wait for CloudFormation to calculate the changes. Towards the bottom of the page, you should see a preview indicating that CloudFormation will **Add** an Amazon S3 bucket. All other resources will remain unchanged.
   > This demonstrates that it is fast and easy to add additional resources to an existing stack, since those resources do not need to be redeployed.
9. Click **Update stack**.
10. After a minute, the stack status will change from `UPDATE_IN_PROGRESS` to `UPDATE_COMPLETE`.
11. Click the **Resources** tab. The bucket will now be displayed in the list of resources. CloudFormation will have assigned it a random name to avoid conflicts.

> **Troubleshooting:** If you receive an error message or the bucket was not correctly created, review your YAML indentation and syntax. YAML is very sensitive to spacing.

### Verification (Optional)
- Go to the **S3 console** to see the bucket that was created.
- Return to the CloudFormation console.

---

## Task 3: Add an Amazon EC2 Instance to the Stack

In this task, your objective is to add an Amazon EC2 instance to the template, then update the stack with the revised template.

> **Note:** Defining an EC2 instance is more complex than an S3 bucket because it needs to use associated resources, such as an AMI, security group, and subnet.

### Step 1: Add the AMI Parameter

First, add a special parameter in the `Parameters` section to provide a value for the Amazon Machine Image (AMI):

```yaml
Parameters:
  # ... existing parameters ...

  AmazonLinuxAMIID:
    Type: AWS::SSM::Parameter::Value<AWS::EC2::Image::Id>
    Default: /aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2
```

**How it works:** This parameter uses the AWS Systems Manager Parameter Store to retrieve the latest AMI (Amazon Linux 2 in this case) for the stack's region. This makes it easy to deploy stacks in different regions without manually specifying an AMI ID for every region.

> For more details, see: [AWS Compute Blog: Query for the latest Amazon Linux AMI IDs using AWS Systems Manager Parameter Store](https://aws.amazon.com/blogs/compute/query-for-the-latest-amazon-linux-ami-ids-using-aws-systems-manager-parameter-store/)

### Understanding `!Ref`

When writing CloudFormation templates, you can refer to other resources using the `!Ref` keyword. For example:

```yaml
  VPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: 10.0.0.0/16

  PublicRouteTable:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId: !Ref VPC
```

Notice how `!Ref VPC` refers to the VPC resource. You will use this technique when defining the EC2 instance.

### Step 2: Add the EC2 Instance Resource

Add an Amazon EC2 instance under the `Resources:` section with the following properties:

| Property | Value | Notes |
|----------|-------|-------|
| `ImageId` | `!Ref AmazonLinuxAMIID` | References the parameter added in Step 1 |
| `InstanceType` | `t3.micro` | The instance size |
| `SecurityGroupIds` | List containing `!Ref AppSecurityGroup` | References the security group defined in the template. Note: this expects a **list** of security groups. |
| `SubnetId` | `!Ref PublicSubnet` | References the subnet defined in the template |
| `Tags` | Name: `App Server` | Tags the instance for identification |

### Example EC2 Instance Definition

```yaml
Resources:
  # ... existing resources ...

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

### Tips

- Refer to the [AWS::EC2::Instance](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html) documentation for assistance. Use the YAML version.
- Only add the five properties listed above — there is no need to include any other properties.
- When referring to `SecurityGroupIds`, the template expects a **list** of security groups, so you must use the list syntax with `- !Ref AppSecurityGroup`.

### Update the Stack

1. Save your modified `task1.yaml` file.
2. In the CloudFormation console, select the **Lab** stack.
3. Click **Update**.
4. Choose **Replace current template**, then upload your revised template file.
5. Click **Next** through the configuration pages.
6. Review the preview changes — you should see that an EC2 instance will be added.
7. Click **Update stack**.
8. Wait for the status to change from `UPDATE_IN_PROGRESS` to `UPDATE_COMPLETE`.
9. Click the **Resources** tab — the instance will now be displayed.

### Verification (Optional)
- Go to the **EC2 console** to see the App Server that was created.
- Return to the CloudFormation console.

---

## Task 4: Delete the Stack

When a CloudFormation stack is deleted, CloudFormation will automatically delete all the resources that it created. This is one of the key benefits of infrastructure as code — clean, complete resource lifecycle management.

### Deletion Steps

1. In the CloudFormation console, select the **Lab** stack.
2. Click **Delete**.
3. At the confirmation prompt, click **Delete stack**.
4. The stack will show `DELETE_IN_PROGRESS`. After a few minutes, the stack will disappear from the console.

### Verification (Optional)
- Verify that the Amazon S3 bucket, Amazon EC2 instance, and the VPC have been deleted by checking their respective service consoles.

---

## Summary

In this lab, you learned how to:

- ✅ Deploy a CloudFormation stack with a VPC and Security Group
- ✅ Edit a CloudFormation template to add an S3 bucket
- ✅ Add an EC2 instance using parameters and resource references (`!Ref`)
- ✅ Update an existing CloudFormation stack incrementally
- ✅ Delete a CloudFormation stack and all its associated resources

### Key Takeaways

| Concept | Description |
|---------|-------------|
| **Infrastructure as Code** | Define infrastructure in templates that can be version-controlled and reused |
| **YAML Sensitivity** | CloudFormation templates require precise indentation (2 spaces recommended) |
| **Resource References** | Use `!Ref` to link resources together within a template |
| **Incremental Updates** | CloudFormation only modifies changed resources, leaving others untouched |
| **Automatic Cleanup** | Deleting a stack automatically removes all resources it created |

---

## Additional Resources

- [AWS CloudFormation User Guide](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html)
- [AWS CloudFormation Template Reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-reference.html)
- [Amazon S3 Template Snippets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/quickref-s3.html)
- [AWS::EC2::Instance Documentation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html)
- [Query for the latest Amazon Linux AMI IDs using AWS Systems Manager Parameter Store](https://aws.amazon.com/blogs/compute/query-for-the-latest-amazon-linux-ami-ids-using-aws-systems-manager-parameter-store/)

---

*Lab Complete*
