# Compute Labs

## About This Folder

This folder contains my AWS re/Start compute labs and notes. The labs focus on running workloads in AWS using virtual servers, command-line tools, and serverless functions.

The work in this section includes launching Amazon EC2 instances, configuring web servers, using AWS CLI commands, troubleshooting instance creation, and building event-driven workflows with AWS Lambda.

## Lab Index

| Lab | Focus Area |
|---|---|
| [Amazon EC2 Lab](./Amazon-EC2.md) | Launching and configuring an EC2 instance in the AWS Management Console |
| [Creating Amazon EC2 Instances](./Creating_Amazon_EC2_Instances.md) | Launching a bastion host and web server using the console, EC2 Instance Connect, and AWS CLI |
| [Troubleshooting EC2 Instance Creation](./Troubleshooting_EC2_Instance_Creation.md) | Using AWS CLI and user data to troubleshoot deployment of a LAMP-based cafe web application |
| [Amazon EC2 Instances Challenge Lab](./Amazon_EC2_Instances_Challenge_Lab.md) | Building a web application on Amazon Linux EC2 with VPC, subnet, internet gateway, route table, and user data configuration |
| [Working with AWS Lambda](./Working%20with%20AWS%20Lambda.md) | Building a serverless sales reporting workflow with Lambda, SNS, CloudWatch Events, Parameter Store, EC2, and VPC access |
| [AWS Lambda Exercise](./AWS%20Lambda%20Exercise.md) | Creating an S3-triggered Lambda function that counts words in uploaded text files and sends results through SNS |

## Topics Covered

| Area | What I Practised |
|---|---|
| Amazon EC2 | Launching instances, choosing AMIs, selecting instance types, and managing instance settings |
| Web Servers | Deploying simple web applications and configuring web server access |
| AWS CLI | Running commands to create and troubleshoot compute resources |
| User Data | Automating instance setup during launch |
| Security Groups | Controlling inbound and outbound access to compute resources |
| Serverless | Creating Lambda functions and event-driven workflows |
| Monitoring | Reviewing Lambda and compute activity with CloudWatch tools |
| Troubleshooting | Investigating deployment, connectivity, and configuration issues |

## AWS Services and Tools Used

- Amazon EC2
- AWS Lambda
- Amazon S3
- Amazon SNS
- Amazon CloudWatch
- Amazon EventBridge
- AWS Systems Manager Parameter Store
- Amazon VPC
- Security groups
- AWS CLI
- EC2 Instance Connect

## Skills Practised

- Launching and configuring Amazon EC2 instances
- Connecting to EC2 instances securely
- Deploying web servers on Amazon Linux
- Using user data scripts for automated setup
- Running AWS CLI commands for compute tasks
- Troubleshooting failed EC2 launches and application deployments
- Creating Lambda functions
- Configuring Lambda triggers from Amazon S3 and scheduled events
- Sending notifications with Amazon SNS
- Understanding the difference between server-based and serverless compute

## Suggested Learning Path

1. Start with the Amazon EC2 introduction lab.
2. Practise creating EC2 instances with the console and AWS CLI.
3. Complete the EC2 troubleshooting and challenge labs.
4. Move into AWS Lambda and event-driven serverless workflows.
5. Finish with the Lambda challenge exercise to practise applying serverless concepts independently.

## Why This Section Matters

Compute is one of the core building blocks of cloud computing. These labs helped me understand how applications run in AWS, how virtual servers are configured, how automation supports deployments, and how serverless services can process events without managing servers.
