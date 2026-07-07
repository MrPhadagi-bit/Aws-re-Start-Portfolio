# Working with Amazon S3: Lab Overview

## Introduction

In this lab, you create and configure an Amazon Simple Storage Service (Amazon S3) bucket to share images with an external user at a media company (`mediacouser`) who has been hired to provide pictures of the products that the café sells. You also configure the S3 bucket to automatically send an email notification to the administrator when the bucket contents are modified.

---

## Architecture Overview

### Component Architecture

An AWS Identity and Access Management (IAM) user named `mediacouser`, which represents an external user at a media company, has been pre-created with the appropriate Amazon S3 permissions to allow the user to add, change, or delete images from the bucket. The necessary Amazon S3 permissions are reviewed for each user to make sure that access to the bucket is secure and appropriate for each role.

### Usage Flow

The following steps describe the usage flow in the solution:

1. **Upload/Modify Content**: When new product pictures are available or when existing pictures must be updated, a representative from the media company signs in to the AWS Management Console as `mediacouser` to upload, change, or delete the bucket contents.

2. **CLI Alternative**: As an alternative, `mediacouser` can use the AWS Command Line Interface (AWS CLI) to change the contents of the S3 bucket.

3. **Event Detection**: When Amazon S3 detects a change in the contents of the bucket, it publishes an email notification to the `s3NotificationTopic` Amazon Simple Notification Service (Amazon SNS) topic.

4. **Admin Notification**: The administrator who is subscribed to the `s3NotificationTopic` SNS topic receives an email message that contains the details of the changes to the contents of the bucket.

> **Note**: In real-world implementations, external users might not receive direct access to CLI Host as depicted in the diagram.

---

## Objectives

By the end of this lab, you will be able to do the following:

- Use the `s3api` and `s3` AWS CLI commands to create and configure an S3 bucket.
- Verify write permissions to a user on an S3 bucket.
- Configure event notification on an S3 bucket.

---

## Prerequisites

- Access to the AWS Management Console
- EC2 Instance Connect access to the CLI Host instance
- AWS CLI installed and configured
- A valid email address for SNS notifications

---

## Lab Tasks

### Task 1: Connecting to the CLI Host and Configuring AWS CLI

#### 1.1 Connect to the CLI Host EC2 Instance

1. On the AWS Management Console, in the **Search bar**, enter and choose **EC2** to open the EC2 Management Console.
2. In the navigation pane, choose **Instances**.
3. From the list of instances, select the **CLI Host** instance.
4. Choose **Connect**.
5. On the **EC2 Instance Connect** tab, choose **Connect**.

> This opens a new browser tab with the EC2 Instance Connect terminal window. You use this terminal window to complete the tasks throughout the lab. If the terminal becomes unresponsive, refresh the browser or reconnect using these steps.

#### 1.2 Configure the AWS CLI

Run the following command in the EC2 Instance Connect terminal:

```bash
aws configure
```

At the prompts, enter the following values:

| Prompt | Value |
|--------|-------|
| AWS Access Key ID | Your `AccessKey` value |
| AWS Secret Access Key | Your `SecretKey` value |
| Default region name | `us-west-2` |
| Default output format | `json` |

---

### Task 2: Creating and Initializing the S3 Share Bucket

#### 2.1 Create the S3 Bucket

```bash
aws s3 mb s3://<cafe-xxxnnn> --region 'us-west-2'
```

> **Note**: Replace `<cafe-xxxnnn>` with your unique bucket name. Your bucket name **must begin with `cafe-`** and should include a combination of letters and numbers to make it unique. Bucket names **cannot contain uppercase letters**.

**Expected output:**
```
make_bucket: cafe-xxxx9999999
```

#### 2.2 Upload Sample Images

Sample image files are provided in the `initial-images` folder on the CLI Host.

```bash
aws s3 sync ~/initial-images/ s3://<cafe-xxxnnn>/images
```

#### 2.3 Verify the Upload

```bash
aws s3 ls s3://<cafe-xxxnnn>/images/ --human-readable --summarize
```

This displays the details of the uploaded image files, including the number of files and total size.

---

### Task 3: Reviewing IAM Group and User Permissions

#### 3.1 Review the `mediaco` IAM Group

1. On the AWS Management Console, search for and open **IAM**.
2. In the navigation pane, choose **User groups**.
3. Select the **mediaco** group.
4. Choose the **Permissions** tab.

**Review the following policies:**

- **`IAMUserChangePassword`**: AWS managed policy that permits users to change their own password.
- **`mediaCoPolicy`**: Custom policy with three key statements:

| Statement ID (Sid) | Purpose |
|-------------------|---------|
| `AllowGroupToSeeBucketListInTheConsole` | Allows users to view the list of S3 buckets in the account via the console |
| `AllowRootLevelListingOfTheBucket` | Allows users to view first-level objects in the cafe bucket |
| `AllowUserSpecificActionsOnlyInTheSpecificPrefix` | Grants `GetObject`, `PutObject`, and `DeleteObject` permissions on `cafe-*/images/*` folder |

#### 3.2 Review the `mediacouser` IAM User

1. In the IAM console, choose **Users**.
2. Select **mediacouser**.
3. On the **Permissions** tab, verify policies: `IAMUserChangePassword` and `mediaCoPolicy`.
4. On the **Groups** tab, confirm membership in the `mediaco` group.
5. On the **Security credentials** tab, create an access key:
   - Choose **Create access key**
   - Select **Command Line Interface (CLI)**
   - Check the acknowledgment box
   - Choose **Next** -> **Create access key**
   - **Download the `.csv` file**
   - Copy the **Console sign-in link** for the next task

#### 3.3 Test `mediacouser` Permissions

> **Important**: Do not sign out of your current session. Use a **different browser** or an **incognito/private window**.

1. Navigate to the **Console sign-in link** copied earlier.
2. Sign in with:
   - **IAM user name**: `mediacouser`
   - **Password**: `Training1!`
3. Open **S3** and select your bucket.

**Test Cases:**

| Use Case | Action | Expected Result |
|----------|--------|-----------------|
| **View** | Select `images/` -> `Donuts.jpg` -> **Open** | Image opens in new tab |
| **Upload** | Choose **Upload** -> **Add files** -> select local image -> **Upload** | File uploads successfully |
| **Delete** | Select `Cup-of-Hot-Chocolate.jpg` -> **Delete** -> type `delete` -> **Delete objects** | Object is removed |
| **Unauthorized** | Navigate to bucket -> **Permissions** tab | Error: *"Insufficient permissions"* |

> Attempting to upload directly to the bucket root should also fail.

---

### Task 4: Configuring Event Notifications on the S3 Bucket

#### 4.1 Create and Configure the `s3NotificationTopic` SNS Topic

1. Search for and open **Simple Notification Service (SNS)**.
2. In the navigation pane, choose **Topics**.
3. Choose **Create topic** -> **Standard**.
4. For **Name**, enter: `s3NotificationTopic`
5. Choose **Create topic**.
6. Copy the **ARN** value to a text editor for later use.

**Configure Access Policy:**

1. Choose **Edit** on the topic page.
2. Expand **Access policy - optional**.
3. Replace the JSON with the following policy (replace placeholders):

```json
{
  "Version": "2008-10-17",
  "Id": "S3PublishPolicy",
  "Statement": [
    {
      "Sid": "AllowPublishFromS3",
      "Effect": "Allow",
      "Principal": {
        "Service": "s3.amazonaws.com"
      },
      "Action": "SNS:Publish",
      "Resource": "<ARN of s3NotificationTopic>",
      "Condition": {
        "ArnLike": {
          "aws:SourceArn": "arn:aws:s3:*:*:<cafe-xxxnnn>"
        }
      }
    }
  ]
}
```

> This policy grants the cafe S3 bucket permission to publish messages to the SNS topic.

4. Choose **Save changes**.

**Subscribe to the Topic:**

1. Go to the **Subscriptions** tab.
2. Choose **Create subscription**.
3. **Topic ARN**: Select `s3NotificationTopic`
4. **Protocol**: `Email`
5. **Endpoint**: Enter your accessible email address
6. Choose **Create subscription**
7. Check your inbox for the **AWS Notification - Subscription Confirmation** email
8. Open the email and choose **Confirm subscription**

#### 4.2 Add Event Notification Configuration to S3 Bucket

**Create the notification configuration file:**

```bash
vi s3EventNotification.json
```

In insert mode (`i`), paste the following JSON (replace the ARN placeholder):

```json
{
  "TopicConfigurations": [
    {
      "TopicArn": "<ARN of s3NotificationTopic>",
      "Events": ["s3:ObjectCreated:*", "s3:ObjectRemoved:*"],
      "Filter": {
        "Key": {
          "FilterRules": [
            {
              "Name": "prefix",
              "Value": "images/"
            }
          ]
        }
      }
    }
  ]
}
```

> This configuration requests S3 to publish notifications for `ObjectCreated` and `ObjectRemoved` events on objects with the `images/` prefix.

Save and exit (`ESC` -> `:wq` -> `Enter`).

**Apply the configuration:**

```bash
aws s3api put-bucket-notification-configuration --bucket <cafe-xxxnnn> --notification-configuration file://s3EventNotification.json
```

**Verify the setup:**
- Check your email inbox for an **Amazon S3 Notification** with a test event.
- The `Event` key will show `s3:TestEvent`.

---

### Task 5: Testing S3 Event Notifications

#### 5.1 Configure AWS CLI for `mediacouser`

In the CLI Host terminal, run:

```bash
aws configure
```

Enter the `mediacouser` credentials from the downloaded `.csv` file:

| Prompt | Value |
|--------|-------|
| AWS Access Key ID | `mediacouser` Access Key ID |
| AWS Secret Access Key | `mediacouser` Secret Access Key |
| Default region name | Press `Enter` (keep `us-west-2`) |
| Default output format | `json` |

#### 5.2 Test the Put Use Case (Upload)

```bash
aws s3api put-object --bucket <cafe-xxxnnn> --key images/Caramel-Delight.jpg --body ~/new-images/Caramel-Delight.jpg
```

**Expected result:**
- Command returns the ETag of the uploaded object.
- Email notification received with `eventName`: `ObjectCreated:Put`
- `object` key: `images/Caramel-Delight.jpg`

#### 5.3 Test the Get Use Case (Read)

```bash
aws s3api get-object --bucket <cafe-xxxnnn> --key images/Donuts.jpg Donuts.jpg
```

**Expected result:**
- Object is downloaded successfully.
- **No email notification** is generated (get operations are not configured to trigger events).

#### 5.4 Test the Delete Use Case

```bash
aws s3api delete-object --bucket <cafe-xxxnnn> --key images/Strawberry-Tarts.jpg
```

**Expected result:**
- Object is deleted.
- Email notification received with `eventName`: `ObjectRemoved:Delete`
- `object` key: `images/Strawberry-Tarts.jpg`

#### 5.5 Test an Unauthorized Use Case

```bash
aws s3api put-object-acl --bucket <cafe-xxxnnn> --key images/Donuts.jpg --acl public-read
```

**Expected result:**
```
An error occurred (AccessDenied) when calling the PutObjectAcl operation: Access Denied
```

---

## Summary of Key Commands

| Task | Command |
|------|---------|
| Configure AWS CLI | `aws configure` |
| Create S3 bucket | `aws s3 mb s3://<bucket-name> --region 'us-west-2'` |
| Sync local files to S3 | `aws s3 sync ~/initial-images/ s3://<bucket>/images` |
| List S3 objects | `aws s3 ls s3://<bucket>/images/ --human-readable --summarize` |
| Upload object (API) | `aws s3api put-object --bucket <bucket> --key <key> --body <file>` |
| Download object | `aws s3api get-object --bucket <bucket> --key <key> <output-file>` |
| Delete object | `aws s3api delete-object --bucket <bucket> --key <key>` |
| Set bucket notification | `aws s3api put-bucket-notification-configuration --bucket <bucket> --notification-configuration file://<file>` |

---

## Conclusion

Congratulations! You have successfully completed the following:

- Used the `s3api` and `s3` AWS CLI commands to create and configure an S3 bucket
- Verified write permissions to a user on an S3 bucket
- Configured event notification on an S3 bucket

---

## Duration

This lab requires approximately **90 minutes** to complete.

---

*Lab complete.*
