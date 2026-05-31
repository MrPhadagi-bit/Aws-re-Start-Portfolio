# Compute, Serverless and Containers Labs

## About This Folder

This folder contains my AWS re/Start labs and notes for compute, serverless, and container-related cloud concepts. The labs focus on how workloads run in AWS, from virtual servers with Amazon EC2 to event-driven applications with AWS Lambda.

The work in this section helped me practise launching cloud compute resources, configuring networking and security settings, building Lambda functions, connecting AWS services together, and monitoring workloads.

## Lab Index

| Lab | Focus Area |
|---|---|
| [Amazon EC2 Lab](./Amazon-EC2.md) | Launching and configuring an Amazon EC2 instance as a web server |
| [Working with AWS Lambda](./Working%20with%20AWS%20Lambda.md) | Building a serverless sales reporting workflow with Lambda, SNS, CloudWatch Events, Parameter Store, EC2, and VPC access |
| [AWS Lambda Challenge Lab](./177-%5BJAWS%5D-Lab%20-%20%5BChallenge%5D%20AWS%20Lambda%20Exercise.md) | Creating an S3-triggered Lambda function that counts words in uploaded text files and sends results through SNS |

## Topics Covered

| Area | Topics |
|---|---|
| Amazon EC2 | Instances, AMIs, instance types, storage, networking, security groups, and instance lifecycle |
| Serverless | AWS Lambda functions, triggers, layers, event-driven workflows, and function permissions |
| Storage Events | Using Amazon S3 events to trigger serverless processing |
| Notifications | Sending reports and results with Amazon SNS |
| Monitoring | Using CloudWatch Events, EventBridge, and CloudWatch Logs |
| Security | IAM roles, permissions, security groups, and VPC access |
| Containers | Introductory container concepts for future study |

## AWS Services Practised

- Amazon EC2
- Amazon S3
- AWS Lambda
- AWS Identity and Access Management
- Amazon SNS
- Amazon CloudWatch
- Amazon EventBridge
- AWS Systems Manager Parameter Store
- Amazon VPC

## Skills Practised

- Launching and configuring Amazon EC2 instances
- Selecting AMIs, instance types, storage, and networking options
- Creating security groups for web server access
- Understanding the difference between traditional compute and serverless compute
- Creating AWS Lambda functions
- Configuring Lambda triggers from Amazon S3 and scheduled events
- Using Lambda layers for shared dependencies
- Connecting Lambda functions to resources inside a VPC
- Storing configuration values in Parameter Store
- Sending notifications with Amazon SNS
- Troubleshooting Lambda functions with CloudWatch Logs

## Suggested Learning Path

1. Start with [Amazon EC2 Lab](./Amazon-EC2.md) to understand virtual servers in AWS.
2. Continue with [Working with AWS Lambda](./Working%20with%20AWS%20Lambda.md) to practise a complete serverless workflow.
3. Complete the [AWS Lambda Challenge Lab](./177-%5BJAWS%5D-Lab%20-%20%5BChallenge%5D%20AWS%20Lambda%20Exercise.md) to apply event-driven serverless concepts independently.

## Why This Section Matters

Compute is one of the core building blocks of cloud computing. These labs show different ways to run workloads in AWS, including managed virtual machines and serverless functions. Understanding these services is important for cloud support, infrastructure, DevOps, and application operations roles.

## Next Learning Goals

- Add labs for Auto Scaling and Elastic Load Balancing
- Add more container practice using Docker or Amazon ECS
- Add screenshots and architecture diagrams for each lab
- Document common troubleshooting steps for EC2 and Lambda workloads
