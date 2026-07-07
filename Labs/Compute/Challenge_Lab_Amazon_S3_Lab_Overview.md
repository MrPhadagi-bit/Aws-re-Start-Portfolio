# Challenge Lab: Amazon S3 — Lab Overview

> **Skill Level:** Beginner  
> **Duration:** ~45 minutes  
> **Prerequisites:** AWS Management Console access, EC2 Instance Connect or SSH client

---

## Table of Contents

1. [Lab Objectives](#objectives)
2. [Architecture Overview](#architecture-overview)
3. [Task 1: Connecting to the CLI Host Instance](#task-1-connecting-to-the-cli-host-instance)
4. [Task 2: Configuring the AWS CLI](#task-2-configuring-the-aws-cli)
5. [Task 3: Finishing the Challenge](#task-3-finishing-the-challenge)
   - [Step 3.1: Create an S3 Bucket](#step-31-create-an-s3-bucket)
   - [Step 3.2: Upload an Object](#step-32-upload-an-object)
   - [Step 3.3: Attempt to Access the Object via Browser](#step-33-attempt-to-access-the-object-via-browser)
   - [Step 3.4: Make the Object Publicly Accessible](#step-34-make-the-object-publicly-accessible)
   - [Step 3.5: Access the Object via Browser (Public)](#step-35-access-the-object-via-browser-public)
   - [Step 3.6: List Bucket Contents via AWS CLI](#step-36-list-bucket-contents-via-aws-cli)
6. [Expected Results & Validation](#expected-results--validation)
7. [Troubleshooting](#troubleshooting)
8. [Cleanup (Post-Lab)](#cleanup-post-lab)
9. [References](#references)

---

## Objectives

By the end of this challenge, you should be able to do the following:

- ✅ Create an Amazon S3 bucket.
- ✅ Upload an object into the bucket.
- ✅ Access the object using a web browser.
- ✅ List the contents of the S3 bucket using the AWS Command Line Interface (AWS CLI).

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     AWS Cloud                               │
│                                                             │
│  ┌─────────────────┐         ┌─────────────────────────┐   │
│  │  EC2 Instance   │         │    Amazon S3            │   │
│  │  (CLI Host)     │────────▶│    ┌─────────────────┐  │   │
│  │                 │  AWS    │    │  S3 Bucket      │  │   │
│  │  • AWS CLI      │  API    │    │  ┌───────────┐  │  │   │
│  │  • Configured   │         │    │  │  Object   │  │  │   │
│  │    Credentials  │         │    │  │  (Public) │  │  │   │
│  └─────────────────┘         │    │  └───────────┘  │  │   │
│                              │    └─────────────────┘  │   │
│                              └─────────────────────────┘   │
│                                                             │
│  ┌─────────────────┐                                        │
│  │  Web Browser    │───────────────────────────────────────▶│
│  │  (User's Local) │         S3 Object URL (Public Access)   │
│  └─────────────────┘                                        │
└─────────────────────────────────────────────────────────────┘
```

**Components:**
- **CLI Host (EC2):** A pre-provisioned Linux instance with AWS CLI installed. You will use this to run AWS CLI commands.
- **Amazon S3:** Object storage service where you will create a bucket and store files.
- **Web Browser:** Used to test public accessibility of S3 objects via HTTP/HTTPS.

---

## Task 1: Connecting to the CLI Host Instance

To start the challenge, you connect to the CLI Host instance that is already provisioned for you.

### Step-by-Step Instructions

1. **Open the EC2 Management Console**
   - On the AWS Management Console, locate the **Search bar** at the top.
   - Enter `EC2` and choose **EC2** to open the EC2 Management Console.

2. **Locate the CLI Host Instance**
   - In the left navigation pane, choose **Instances**.
   - From the list of instances, identify and select the instance named **CLI Host**.

3. **Connect to the Instance**
   - With the CLI Host instance selected, choose the **Connect** button (top-right).
   - On the **EC2 Instance Connect** tab, choose **Connect**.
   - A new browser tab opens with a terminal session to your EC2 instance.

> **💡 Note:** If you prefer to use an SSH client (e.g., Terminal on macOS/Linux, PuTTY on Windows), see the AWS documentation: [Connect to Your Linux Instance](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html).

4. **Verify Connection**
   - Once connected, you should see a terminal prompt similar to:
     ```bash
     [ec2-user@ip-10-0-0-XXX ~]$
     ```

---

## Task 2: Configuring the AWS CLI

Now that you are connected to the CLI Host instance, you must configure the AWS CLI with valid credentials to interact with AWS services.

### Step-by-Step Instructions

1. **Run the Configuration Command**
   ```bash
   aws configure
   ```

2. **Enter the Following Values at Each Prompt:**

   | Prompt | Value | Description |
   |--------|-------|-------------|
   | `AWS Access Key ID` | *(Your provided `AccessKey`)* | Identifies your AWS account |
   | `AWS Secret Access Key` | *(Your provided `SecretKey`)* | Authenticates your requests |
   | `Default region name` | `us-west-2` | The AWS Region for API calls |
   | `Default output format` | `json` | Format for CLI output |

   **Example interaction:**
   ```bash
   $ aws configure
   AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
   AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
   Default region name [None]: us-west-2
   Default output format [None]: json
   ```

3. **Verify Configuration**
   ```bash
   aws sts get-caller-identity
   ```
   You should see a JSON response with your Account, UserId, and ARN.

> **⚠️ Security Tip:** The credentials file is stored at `~/.aws/credentials`. Never share or commit this file to version control.

---

## Task 3: Finishing the Challenge

Complete the following steps to finish the lab. Capture screenshots at each major milestone to submit to your instructor.

---

### Step 3.1: Create an S3 Bucket

Every object in Amazon S3 is stored in a **bucket**. Bucket names must be globally unique across all AWS accounts.

#### Using the AWS CLI:

```bash
aws s3 mb s3://<your-unique-bucket-name>
```

**Example:**
```bash
aws s3 mb s3://my-challenge-bucket-12345-uswest2
```

> **📌 Naming Rules:**
> - Must be globally unique (no two AWS accounts can have the same bucket name).
> - 3–63 characters long.
> - Can contain only lowercase letters, numbers, dots (`.`), and hyphens (`-`).
> - Must begin and end with a letter or number.
> - Cannot contain uppercase characters or underscores.

#### Expected Output:
```
make_bucket: my-challenge-bucket-12345-uswest2
```

**📸 Screenshot:** Capture the terminal showing the successful bucket creation.

---

### Step 3.2: Upload an Object

Upload a file from the CLI Host to your newly created S3 bucket.

#### Using the AWS CLI:

```bash
aws s3 cp <local-file> s3://<your-bucket-name>/
```

**Example (create a sample file first):**
```bash
# Create a sample HTML file
echo "<html><body><h1>Hello from S3!</h1></body></html>" > hello.html

# Upload to S3
aws s3 cp hello.html s3://my-challenge-bucket-12345-uswest2/
```

#### Expected Output:
```
upload: ./hello.html to s3://my-challenge-bucket-12345-uswest2/hello.html
```

**📸 Screenshot:** Capture the terminal showing the successful upload.

---

### Step 3.3: Attempt to Access the Object via Browser

Before making the object public, attempt to access it via a web browser to observe the default **Access Denied** behavior.

#### Construct the Object URL:

```
https://<bucket-name>.s3.<region>.amazonaws.com/<object-key>
```

**Example:**
```
https://my-challenge-bucket-12345-uswest2.s3.us-west-2.amazonaws.com/hello.html
```

#### Expected Result:

You should see an **Access Denied** XML error page:
```xml
<Error>
  <Code>AccessDenied</Code>
  <Message>Access Denied</Message>
  <RequestId>...</RequestId>
  <HostId>...</HostId>
</Error>
```

> **📝 Why?** By default, all S3 objects are **private**. Only the bucket owner has access until explicit permissions are granted.

**📸 Screenshot:** Capture the browser showing the Access Denied error.

---

### Step 3.4: Make the Object Publicly Accessible

> **⚠️ Important:** The requirement is to make the **object** public, **not the entire bucket**. Making a bucket public is a broader security risk and should generally be avoided in production.

#### Method A: Using the AWS CLI (Recommended)

Apply a bucket policy or use the `put-object-acl` command to grant public read access to the specific object:

```bash
aws s3api put-object-acl   --bucket <your-bucket-name>   --key hello.html   --acl public-read
```

**Example:**
```bash
aws s3api put-object-acl   --bucket my-challenge-bucket-12345-uswest2   --key hello.html   --acl public-read
```

#### Method B: Using a Bucket Policy (Alternative)

Create a policy file `bucket-policy.json`:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::<your-bucket-name>/hello.html"
    }
  ]
}
```

Apply the policy:
```bash
aws s3api put-bucket-policy   --bucket <your-bucket-name>   --policy file://bucket-policy.json
```

#### Verify the ACL:
```bash
aws s3api get-object-acl --bucket <your-bucket-name> --key hello.html
```

You should see a `Grantee` with `URI` containing `AllUsers` and `Permission: READ`.

**📸 Screenshot:** Capture the terminal showing the ACL update or bucket policy application.

---

### Step 3.5: Access the Object via Browser (Public)

Now that the object has public-read permissions, refresh the same URL in your browser.

#### Object URL:
```
https://<bucket-name>.s3.<region>.amazonaws.com/<object-key>
```

**Example:**
```
https://my-challenge-bucket-12345-uswest2.s3.us-west-2.amazonaws.com/hello.html
```

#### Expected Result:

The browser should now display the content of `hello.html`:
```html
Hello from S3!
```

> **🎉 Success!** The object is now publicly accessible over the internet.

**📸 Screenshot:** Capture the browser successfully displaying the object content.

---

### Step 3.6: List Bucket Contents via AWS CLI

Use the AWS CLI to list all objects in your S3 bucket.

#### Command:
```bash
aws s3 ls s3://<your-bucket-name>/
```

**Example:**
```bash
aws s3 ls s3://my-challenge-bucket-12345-uswest2/
```

#### Expected Output:
```
2026-07-07 11:45:32         62 hello.html
```

> **📊 Output Format:** `LastModified  Size(bytes)  ObjectKey`

#### Alternative: Using `s3api` for Detailed JSON Output
```bash
aws s3api list-objects --bucket <your-bucket-name>
```

**📸 Screenshot:** Capture the terminal showing the bucket listing.

---

## Expected Results & Validation

Use the following checklist to verify successful completion:

| # | Task | Validation Criteria | ✅ |
|---|------|---------------------|----|
| 1 | S3 bucket created | `aws s3 mb` returns success | ☐ |
| 2 | Object uploaded | Object appears in bucket listing | ☐ |
| 3 | Private access denied | Browser shows `AccessDenied` XML | ☐ |
| 4 | Object made public | `get-object-acl` shows `AllUsers` grant | ☐ |
| 5 | Public access works | Browser displays object content | ☐ |
| 6 | Bucket listed via CLI | `aws s3 ls` shows the object | ☐ |

---

## Troubleshooting

### Issue: "Bucket already exists"
```
An error occurred (BucketAlreadyExists) when calling the CreateBucket operation
```
**Solution:** Bucket names are globally unique. Append a random number or your initials.

### Issue: "Access Denied" when applying ACL
```
An error occurred (AccessDenied) when calling the PutObjectAcl operation
```
**Solution:** Ensure your IAM user/role has `s3:PutObjectAcl` permission. Also, check if the bucket has **Block Public Access** settings enabled at the account or bucket level.

### Issue: "Access Denied" in browser after making public
**Solution:** 
1. Verify the ACL was applied to the correct object.
2. Check if the bucket has **S3 Block Public Access** enabled. If so, disable it (only for this lab):
   ```bash
   aws s3api put-public-access-block      --bucket <bucket-name>      --public-access-block-configuration      "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
   ```
3. Wait 30–60 seconds for S3 propagation, then retry.

### Issue: "InvalidAccessKeyId"
**Solution:** Re-run `aws configure` and ensure the Access Key ID and Secret Key are entered correctly (no extra spaces).

---

## Cleanup (Post-Lab)

To avoid incurring unnecessary charges, clean up your resources after the lab:

```bash
# Delete the object
aws s3 rm s3://<your-bucket-name>/hello.html

# Delete the bucket (must be empty first)
aws s3 rb s3://<your-bucket-name>
```

**Example:**
```bash
aws s3 rm s3://my-challenge-bucket-12345-uswest2/hello.html
aws s3 rb s3://my-challenge-bucket-12345-uswest2
```

> **💰 Cost Note:** S3 charges for storage, requests, and data transfer. Emptying and deleting the bucket prevents ongoing storage charges.

---

## References

| Resource | Link |
|----------|------|
| Amazon S3 Documentation | https://docs.aws.amazon.com/s3/ |
| AWS CLI S3 Reference | https://docs.aws.amazon.com/cli/latest/reference/s3/ |
| AWS CLI S3API Reference | https://docs.aws.amazon.com/cli/latest/reference/s3api/ |
| S3 Bucket Naming Rules | https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html |
| S3 Access Control Lists (ACLs) | https://docs.aws.amazon.com/AmazonS3/latest/userguide/acl-overview.html |
| S3 Block Public Access | https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html |
| Connect to EC2 Linux Instance | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html |
| AWS CLI Configuration | https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html |

---

## Conclusion

Congratulations! 🎉 You have successfully completed the Amazon S3 Challenge Lab. You have demonstrated the ability to:

1. ✅ **Create an S3 bucket** using the AWS CLI.
2. ✅ **Upload an object** into the bucket.
3. ✅ **Access the object** using a web browser (after configuring public permissions).
4. ✅ **List the contents** of the S3 bucket using the AWS CLI.

These foundational skills are essential for working with object storage in AWS and serve as building blocks for more advanced architectures involving static website hosting, data lakes, and backup strategies.

---

> **Lab Complete** — Remember to submit your screenshots to your instructor for review.
