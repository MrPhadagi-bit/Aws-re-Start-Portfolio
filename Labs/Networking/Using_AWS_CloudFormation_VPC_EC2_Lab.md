# Lab: Using AWS CloudFormation to Create an AWS VPC and Amazon EC2 Instance

> **Lab Duration:** ~45-60 minutes  
> **Difficulty:** Intermediate  
> **Prerequisites:** Basic familiarity with AWS CLI and YAML syntax

---

## 1. Lab Overview

### Objective
Create a complete AWS infrastructure using an AWS CloudFormation template that provisions:

| Component | Description |
|-----------|-------------|
| **Amazon VPC** | A logically isolated virtual network |
| **Internet Gateway** | Enables internet connectivity for the VPC |
| **Security Group** | Firewall rules allowing SSH (port 22) from any IP address (0.0.0.0/0) |
| **Private Subnet** | A subnet within the VPC with no direct internet route |
| **Amazon EC2 Instance** | A `t3.micro` instance deployed inside the private subnet |

> **Note:** The EC2 instance is placed in a *private subnet*. It is **not** necessary to access the instance via SSH for a successful solution. The instance will not have a public IP address.

### Learning Outcomes
By the end of this lab, you will be able to:
- Write a CloudFormation template using YAML
- Define VPC networking components (VPC, Subnet, Internet Gateway, Route Table)
- Configure Security Groups with ingress rules
- Launch an EC2 instance using CloudFormation
- Use the AWS CLI to validate and deploy CloudFormation stacks
- Troubleshoot CloudFormation deployment errors

---

## 2. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      AWS Cloud (Region)                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              VPC (10.0.0.0/16)                       │   │
│  │  ┌───────────────────────────────────────────────┐   │   │
│  │  │         Private Subnet (10.0.1.0/24)           │   │   │
│  │  │  ┌─────────────────────────────────────┐      │   │   │
│  │  │  │     EC2 Instance (t3.micro)        │      │   │   │
│  │  │  │     - Amazon Linux 2               │      │   │   │
│  │  │  │     - No Public IP                 │      │   │   │
│  │  │  │     - Security Group attached       │      │   │   │
│  │  │  └─────────────────────────────────────┘      │   │   │
│  │  └───────────────────────────────────────────────┘   │   │
│  │                                                          │
│  │  [Internet Gateway] ──► [VPC Route Table]                │
│  │                                                          │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Lab Environment Setup

### 3.1 Verify AWS CLI Access

The terminal is pre-configured with AWS credentials. Verify access:

```bash
aws sts get-caller-identity
```

**Expected output:**
```json
{
    "UserId": "AROA...",
    "Account": "123456789012",
    "Arn": "arn:aws:sts::123456789012:assumed-role/..."
}
```

### 3.2 Set Your Region (if needed)

```bash
export AWS_REGION=$(aws configure get region)
echo "Current region: $AWS_REGION"
```

### 3.3 Create a Working Directory

```bash
mkdir -p ~/cloudformation-lab && cd ~/cloudformation-lab
pwd
```

---

## 4. CloudFormation Template

### 4.1 Create the Template File

Create the file `vpc-ec2-lab.yaml`:

```bash
cat > vpc-ec2-lab.yaml << 'EOF'
AWSTemplateFormatVersion: '2010-09-09'
Description: >
  Lab Template: Creates a VPC with an Internet Gateway, a private subnet,
  a security group allowing SSH from anywhere, and a t3.micro EC2 instance.

# ─────────────────────────────────────────────────────────────────────────────
# PARAMETERS
# ─────────────────────────────────────────────────────────────────────────────
Parameters:

  VpcCidr:
    Type: String
    Default: 10.0.0.0/16
    Description: CIDR block for the VPC
    AllowedPattern: '^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\/([0-9]|[1-2][0-9]|3[0-2])$'
    ConstraintDescription: Must be a valid CIDR block (e.g., 10.0.0.0/16)

  PrivateSubnetCidr:
    Type: String
    Default: 10.0.1.0/24
    Description: CIDR block for the private subnet
    AllowedPattern: '^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\/([0-9]|[1-2][0-9]|3[0-2])$'
    ConstraintDescription: Must be a valid CIDR block (e.g., 10.0.1.0/24)

  InstanceType:
    Type: String
    Default: t3.micro
    Description: EC2 instance type
    AllowedValues:
      - t3.micro
      - t3.small
      - t2.micro

  KeyPairName:
    Type: AWS::EC2::KeyPair::KeyName
    Description: Name of an existing EC2 KeyPair for SSH access (optional but recommended)
    Default: ''
    ConstraintDescription: Must be the name of an existing EC2 KeyPair.

  LatestAmiId:
    Type: 'AWS::SSM::Parameter::Value<AWS::EC2::Image::Id>'
    Default: '/aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2'
    Description: Latest Amazon Linux 2 AMI ID from SSM Parameter Store

# ─────────────────────────────────────────────────────────────────────────────
# RESOURCES
# ─────────────────────────────────────────────────────────────────────────────
Resources:

  # ── 1. VPC ─────────────────────────────────────────────────────────────────
  LabVPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: !Ref VpcCidr
      EnableDnsHostnames: true
      EnableDnsSupport: true
      Tags:
        - Key: Name
          Value: !Sub '${AWS::StackName}-VPC'
        - Key: Environment
          Value: Lab

  # ── 2. Internet Gateway ────────────────────────────────────────────────────
  LabInternetGateway:
    Type: AWS::EC2::InternetGateway
    Properties:
      Tags:
        - Key: Name
          Value: !Sub '${AWS::StackName}-IGW'

  # ── 3. Attach Internet Gateway to VPC ──────────────────────────────────────
  AttachGateway:
    Type: AWS::EC2::VPCGatewayAttachment
    Properties:
      VpcId: !Ref LabVPC
      InternetGatewayId: !Ref LabInternetGateway

  # ── 4. Private Subnet ──────────────────────────────────────────────────────
  LabPrivateSubnet:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref LabVPC
      CidrBlock: !Ref PrivateSubnetCidr
      AvailabilityZone: !Select 
        - 0
        - !GetAZs 
          Ref: AWS::Region
      MapPublicIpOnLaunch: false    # Private subnet: no auto-assign public IP
      Tags:
        - Key: Name
          Value: !Sub '${AWS::StackName}-PrivateSubnet'
        - Key: Type
          Value: Private

  # ── 5. Route Table for VPC (associated with private subnet for basic routing) ─
  LabRouteTable:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId: !Ref LabVPC
      Tags:
        - Key: Name
          Value: !Sub '${AWS::StackName}-RouteTable'

  # ── 6. Subnet Route Table Association ────────────────────────────────────────
  LabSubnetRouteTableAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      SubnetId: !Ref LabPrivateSubnet
      RouteTableId: !Ref LabRouteTable

  # ── 7. Security Group ──────────────────────────────────────────────────────
  LabSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Security group allowing SSH access from anywhere
      VpcId: !Ref LabVPC
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 22
          ToPort: 22
          CidrIp: 0.0.0.0/0
          Description: Allow SSH from anywhere (lab requirement)
      SecurityGroupEgress:
        - IpProtocol: -1    # Allow all outbound traffic
          CidrIp: 0.0.0.0/0
      Tags:
        - Key: Name
          Value: !Sub '${AWS::StackName}-SG'

  # ── 8. EC2 Instance (t3.micro) in Private Subnet ───────────────────────────
  LabEC2Instance:
    Type: AWS::EC2::Instance
    Properties:
      InstanceType: !Ref InstanceType
      ImageId: !Ref LatestAmiId
      SubnetId: !Ref LabPrivateSubnet
      SecurityGroupIds:
        - !Ref LabSecurityGroup
      Tags:
        - Key: Name
          Value: !Sub '${AWS::StackName}-EC2'
        - Key: Environment
          Value: Lab
      # No KeyName required for this lab (SSH access not needed)
      # If a key pair is provided, uncomment the line below:
      # KeyName: !Ref KeyPairName

# ─────────────────────────────────────────────────────────────────────────────
# OUTPUTS
# ─────────────────────────────────────────────────────────────────────────────
Outputs:

  VPCId:
    Description: ID of the created VPC
    Value: !Ref LabVPC
    Export:
      Name: !Sub '${AWS::StackName}-VPCId'

  PrivateSubnetId:
    Description: ID of the created private subnet
    Value: !Ref LabPrivateSubnet
    Export:
      Name: !Sub '${AWS::StackName}-PrivateSubnetId'

  SecurityGroupId:
    Description: ID of the created security group
    Value: !Ref LabSecurityGroup
    Export:
      Name: !Sub '${AWS::StackName}-SecurityGroupId'

  EC2InstanceId:
    Description: ID of the created EC2 instance
    Value: !Ref LabEC2Instance
    Export:
      Name: !Sub '${AWS::StackName}-EC2InstanceId'

  EC2PrivateIp:
    Description: Private IP address of the EC2 instance
    Value: !GetAtt LabEC2Instance.PrivateIp
    Export:
      Name: !Sub '${AWS::StackName}-EC2PrivateIp'
EOF
```

### 4.2 Validate the Template Syntax

Before deploying, validate the template for syntax errors:

```bash
aws cloudformation validate-template --template-body file://vpc-ec2-lab.yaml
```

**Expected output:** A JSON response describing the template parameters, description, and capabilities. If errors exist, fix them before proceeding.

---

## 5. Deploying the Stack

### 5.1 Deploy the CloudFormation Stack

```bash
aws cloudformation create-stack \
  --stack-name vpc-ec2-lab \
  --template-body file://vpc-ec2-lab.yaml \
  --capabilities CAPABILITY_IAM \
  --tags Key=Project,Value=CloudFormationLab
```

> **Note:** The `CAPABILITY_IAM` capability is included as a best practice, even though this template does not create IAM resources.

### 5.2 Monitor Stack Creation Progress

**Option A: Watch events in real-time**
```bash
aws cloudformation describe-stack-events \
  --stack-name vpc-ec2-lab \
  --query 'StackEvents[*].[LogicalResourceId,ResourceStatus,ResourceStatusReason]' \
  --output table
```

**Option B: Check stack status**
```bash
aws cloudformation describe-stacks \
  --stack-name vpc-ec2-lab \
  --query 'Stacks[0].StackStatus'
```

Wait until the status is `CREATE_COMPLETE`.

### 5.3 Alternative: Deploy with Change Sets (Recommended for Production)

```bash
# Create a change set
aws cloudformation create-change-set \
  --stack-name vpc-ec2-lab \
  --change-set-name initial-deployment \
  --template-body file://vpc-ec2-lab.yaml \
  --capabilities CAPABILITY_IAM

# Review the change set
aws cloudformation describe-change-set \
  --stack-name vpc-ec2-lab \
  --change-set-name initial-deployment

# Execute the change set
aws cloudformation execute-change-set \
  --stack-name vpc-ec2-lab \
  --change-set-name initial-deployment
```

---

## 6. Validating the Deployment

### 6.1 Verify Stack Outputs

```bash
aws cloudformation describe-stacks \
  --stack-name vpc-ec2-lab \
  --query 'Stacks[0].Outputs' \
  --output table
```

### 6.2 Verify VPC

```bash
aws ec2 describe-vpcs \
  --filters "Name=tag:Name,Values=vpc-ec2-lab-VPC" \
  --query 'Vpcs[*].[VpcId,CidrBlock,State]' \
  --output table
```

### 6.3 Verify Internet Gateway

```bash
aws ec2 describe-internet-gateways \
  --filters "Name=tag:Name,Values=vpc-ec2-lab-IGW" \
  --query 'InternetGateways[*].[InternetGatewayId,Attachments[0].State]' \
  --output table
```

### 6.4 Verify Subnet

```bash
aws ec2 describe-subnets \
  --filters "Name=tag:Name,Values=vpc-ec2-lab-PrivateSubnet" \
  --query 'Subnets[*].[SubnetId,CidrBlock,AvailabilityZone,MapPublicIpOnLaunch]' \
  --output table
```

> **Verify:** `MapPublicIpOnLaunch` should be `false` (private subnet).

### 6.5 Verify Security Group

```bash
aws ec2 describe-security-groups \
  --filters "Name=tag:Name,Values=vpc-ec2-lab-SG" \
  --query 'SecurityGroups[*].[GroupId,GroupName,IpPermissions]' \
  --output table
```

> **Verify:** Ingress rule should show `FromPort: 22`, `ToPort: 22`, `IpRanges: 0.0.0.0/0`.

### 6.6 Verify EC2 Instance

```bash
aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=vpc-ec2-lab-EC2" \
  --query 'Reservations[*].Instances[*].[InstanceId,InstanceType,State.Name,PrivateIpAddress,SubnetId]' \
  --output table
```

> **Verify:**
> - `InstanceType` should be `t3.micro`
> - `State.Name` should be `running`
> - `PrivateIpAddress` should be within `10.0.1.0/24`
> - No `PublicIpAddress` field should be present (private subnet)

### 6.7 Verify Complete Architecture with a Single Command

```bash
echo "=== STACK STATUS ==="
aws cloudformation describe-stacks \
  --stack-name vpc-ec2-lab \
  --query 'Stacks[0].[StackName,StackStatus,CreationTime]' \
  --output table

echo "=== VPC ==="
aws ec2 describe-vpcs --filters "Name=tag:Name,Values=vpc-ec2-lab-VPC" \
  --query 'Vpcs[*].[VpcId,CidrBlock]' --output table

echo "=== INTERNET GATEWAY ==="
aws ec2 describe-internet-gateways --filters "Name=tag:Name,Values=vpc-ec2-lab-IGW" \
  --query 'InternetGateways[*].[InternetGatewayId]' --output table

echo "=== SUBNET ==="
aws ec2 describe-subnets --filters "Name=tag:Name,Values=vpc-ec2-lab-PrivateSubnet" \
  --query 'Subnets[*].[SubnetId,CidrBlock,MapPublicIpOnLaunch]' --output table

echo "=== SECURITY GROUP ==="
aws ec2 describe-security-groups --filters "Name=tag:Name,Values=vpc-ec2-lab-SG" \
  --query 'SecurityGroups[*].[GroupId,IpPermissions[0].FromPort,IpPermissions[0].IpRanges[0].CidrIp]' --output table

echo "=== EC2 INSTANCE ==="
aws ec2 describe-instances --filters "Name=tag:Name,Values=vpc-ec2-lab-EC2" \
  --query 'Reservations[*].Instances[*].[InstanceId,InstanceType,State.Name,PrivateIpAddress]' --output table
```

---

## 7. Troubleshooting

### Common Errors and Solutions

#### Error: `CREATE_FAILED` on EC2 Instance

**Symptom:** Stack fails during EC2 instance creation.

**Check logs:**
```bash
aws cloudformation describe-stack-events \
  --stack-name vpc-ec2-lab \
  --query 'StackEvents[?ResourceStatus==`CREATE_FAILED`].[LogicalResourceId,ResourceStatusReason]'
```

**Common causes:**
- **Instance type not available in AZ:** The `t3.micro` may not be available in the first AZ. Solution: The template uses `!GetAZs` which selects the first AZ. If this fails, hardcode a different AZ.
- **AMI not found:** The SSM parameter may not resolve. Verify with:
  ```bash
  aws ssm get-parameter --name /aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2
  ```

#### Error: `CREATE_FAILED` on Security Group

**Symptom:** Security group creation fails.

**Solution:** Check if the VPC was created successfully first. Security groups depend on the VPC.

#### Error: `ROLLBACK_COMPLETE`

**Symptom:** Stack automatically rolls back after failure.

**Solution:** Check events before rollback completes, or disable rollback for debugging:
```bash
aws cloudformation create-stack \
  --stack-name vpc-ec2-lab \
  --template-body file://vpc-ec2-lab.yaml \
  --disable-rollback \
  --capabilities CAPABILITY_IAM
```

### Iterative Development Workflow

When the template fails, follow this iterative process:

```bash
# 1. Delete the failed stack
aws cloudformation delete-stack --stack-name vpc-ec2-lab

# 2. Wait for deletion to complete
aws cloudformation wait stack-delete-complete --stack-name vpc-ec2-lab

# 3. Edit the template (fix the issue)
vim vpc-ec2-lab.yaml

# 4. Validate the updated template
aws cloudformation validate-template --template-body file://vpc-ec2-lab.yaml

# 5. Re-deploy
aws cloudformation create-stack \
  --stack-name vpc-ec2-lab \
  --template-body file://vpc-ec2-lab.yaml \
  --capabilities CAPABILITY_IAM

# 6. Monitor and repeat if necessary
aws cloudformation describe-stacks --stack-name vpc-ec2-lab --query 'Stacks[0].StackStatus'
```

### Using AWS Console for Visual Debugging

If CLI debugging is difficult, you can also view the stack in the AWS Management Console:
1. Navigate to **CloudFormation** > **Stacks**
2. Select `vpc-ec2-lab`
3. Click the **Events** tab to see detailed failure reasons
4. Click the **Resources** tab to see the status of each resource

---

## 8. Cleanup

### 8.1 Delete the CloudFormation Stack

When the lab is complete (or if you need to restart), delete the stack:

```bash
aws cloudformation delete-stack --stack-name vpc-ec2-lab
```

### 8.2 Verify Deletion

```bash
aws cloudformation describe-stacks \
  --stack-name vpc-ec2-lab \
  --query 'Stacks[0].StackStatus'
```

Wait for `DELETE_COMPLETE`. If resources were manually modified, deletion may fail.

### 8.3 Force Delete (if stack is stuck)

```bash
# Retain resources and delete the stack record
aws cloudformation delete-stack \
  --stack-name vpc-ec2-lab \
  --retain-resources LabEC2Instance
```

---

## 9. Appendix: Full Template Reference

### Template Structure Explained

| Section | Purpose |
|---------|---------|
| `AWSTemplateFormatVersion` | Identifies the CloudFormation template version |
| `Description` | Human-readable description of the template |
| `Parameters` | Input values that customize the deployment |
| `Resources` | AWS resources to create (the core of the template) |
| `Outputs` | Values returned after stack creation (e.g., IDs, IPs) |

### Intrinsic Functions Used

| Function | Usage in Template |
|----------|-------------------|
| `!Ref` | References a parameter or resource (returns ID) |
| `!Sub` | Substitutes variables in strings |
| `!GetAtt` | Retrieves specific attributes of a resource |
| `!Select` | Selects an item from a list |
| `!GetAZs` | Returns a list of Availability Zones in the region |

### Resource Dependencies

CloudFormation automatically handles most dependencies, but explicit dependencies can be added:

```yaml
  LabEC2Instance:
    Type: AWS::EC2::Instance
    DependsOn: LabSubnetRouteTableAssociation  # Explicit dependency
    Properties:
      # ...
```

### Security Note

The security group in this lab allows SSH from `0.0.0.0/0` (anywhere) as required by the lab instructions. **In production environments, never allow unrestricted SSH access.** Restrict the CIDR to your specific IP address:

```yaml
  SecurityGroupIngress:
    - IpProtocol: tcp
      FromPort: 22
      ToPort: 22
      CidrIp: 203.0.113.0/24   # Replace with your IP
```

---

## Completion Checklist

Before notifying the instructor, verify:

- [ ] Template file `vpc-ec2-lab.yaml` created and saved
- [ ] Template validates successfully (`validate-template` returns no errors)
- [ ] Stack `vpc-ec2-lab` creates with status `CREATE_COMPLETE`
- [ ] VPC exists with CIDR `10.0.0.0/16`
- [ ] Internet Gateway is attached to the VPC
- [ ] Private subnet exists with CIDR `10.0.1.0/24` and `MapPublicIpOnLaunch: false`
- [ ] Security group allows inbound SSH (port 22) from `0.0.0.0/0`
- [ ] EC2 instance is `t3.micro`, `running`, and has a private IP in `10.0.1.0/24`
- [ ] EC2 instance has **no** public IP address
- [ ] All resources are tagged appropriately

**Notify the instructor when all checks pass!**

---

*Lab version: 1.0 | Last updated: 2026-07-01*
