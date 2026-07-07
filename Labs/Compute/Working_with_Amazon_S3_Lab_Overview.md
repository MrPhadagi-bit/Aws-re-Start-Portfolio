# Working with Amazon S3: Lab Overview

## Introduction

In this lab, you create and configure an **Amazon Simple Storage Service (Amazon S3)** bucket to share images with an external user at a media company (`mediacouser`) who has been hired to provide pictures of the products that the café sells. You also configure the S3 bucket to automatically send an email notification to the administrator when the bucket contents are modified.

---

## Architecture Overview

### Component Architecture

An **AWS Identity and Access Management (IAM)** user named `mediacouser`, which represents an external user at a media company, has been pre-created with the appropriate Amazon S3 permissions to allow the user to add, change, or delete images from the bucket. The necessary Amazon S3 permissions are reviewed for each user to make sure that access to the bucket is secure and appropriate for each role.

### Usage Flow

The following steps describe the usage flow in the architectural diagram:

1. **Upload / Modify / Delete:** When new product pictures are available or when existing pictures must be updated, a representative from the media company signs in to the AWS Management Console as `mediacouser` to upload, change, or delete the bucket contents.

2. **CLI Alternative:** As an alternative, `mediacouser` can use the **AWS Command Line Interface (AWS CLI)** to change the contents of the S3 bucket.

3. **Event Detection:** When Amazon S3 detects a change in the contents of the bucket, it publishes an email notification to the `s3NotificationTopic` **Amazon Simple Notification Service (Amazon SNS)** topic.

4. **Email Notification:** The administrator who is subscribed to the `s3NotificationTopic` SNS topic receives an email message that contains the details of the changes to the contents of the bucket.

> **Note:** In real-world implementations, external users might not receive direct access to CLI Host as depicted in the diagram.

---

## Objectives

By the end of this lab, you will be able to do the following:

- Use the `s3api` and `s3` AWS CLI commands to create and configure an S3 bucket.
- Verify write permissions to a user on an S3 bucket.
- Configure event notification on an S3 bucket.

---

## Duration

This lab requires approximately **90 minutes** to complete.

---

## Lab Tasks Summary

| Task | Description |
|------|-------------|
| **Task 1** | Connect to the CLI Host EC2 instance and configure the AWS CLI |
| **Task 2** | Create and initialize the S3 share bucket |
| **Task 3** | Review IAM group and user permissions |
| **Task 4** | Configure event notifications on the S3 share bucket |
| **Task 5** | Test the S3 share bucket event notifications |

---

## Key AWS Services Used

- **Amazon S3** — Object storage for the shared image bucket
- **AWS IAM** — Identity and access management for `mediacouser` and the `mediaco` group
- **Amazon SNS** — Event notification topic (`s3NotificationTopic`) for bucket change alerts
- **AWS CLI** — Command-line interface for bucket and object operations
- **Amazon EC2** — CLI Host instance for running AWS CLI commands

---

## Important Notes

- Bucket names must begin with `cafe-` and cannot contain uppercase letters.
- The `mediaco` IAM group uses a custom policy (`mediaCoPolicy`) that restricts access to the `cafe-*/images/*` prefix.
- Event notifications are configured to trigger on `s3:ObjectCreated:*` and `s3:ObjectRemoved:*` events within the `images/` prefix.
- The `mediacouser` is explicitly denied from changing bucket-level permissions (e.g., bucket ACLs).

---

*Lab complete — Document generated for reference.*
