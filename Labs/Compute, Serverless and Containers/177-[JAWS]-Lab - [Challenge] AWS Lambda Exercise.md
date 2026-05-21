# 177-[JAWS]-Lab - [Challenge] AWS Lambda Exercise

> **AWS Lambda Challenge Lab** — Build a serverless pipeline that counts words in a text file uploaded to S3 and reports the result via SNS (email/SMS).

---

## 📋 Lab Overview

In this challenge lab, you will create an **AWS Lambda function** that automatically counts the number of words in a text file. The function is triggered when a file is uploaded to an **Amazon S3** bucket and reports the word count via **Amazon SNS** (email and optionally SMS).

---

## 🎯 Objectives

After completing this lab, you will be able to:

- ✅ Create a Lambda function to count the number of words in a text file.
- ✅ Configure an **Amazon S3** bucket to invoke a Lambda function on file upload.
- ✅ Create an **Amazon SNS** topic to report the word count via email.
- ✅ (Optional) Send the word count result via SMS.

---

## ⏱️ Duration

Approximately **90 minutes**.

---

## 🚀 Your Challenge

### Goal
Create a Lambda function that counts words in a text file and reports the result via SNS.

### General Steps
1. Use the **AWS Management Console** to develop a Lambda function in **Python**.
2. Create the required resources (S3 bucket, SNS topic, etc.).
3. Report the word count in an email using an SNS topic.
4. *(Optional)* Also send the result via SMS.
5. Format the response message exactly as specified below.
6. Automatically invoke the function when a text file is uploaded to an S3 bucket.
7. Test the function by uploading sample text files with different word counts.
8. Forward the resulting email and a screenshot of your Lambda function to your instructor.

---

## 📝 Message Format Requirements

### Email / SMS Body
```
The word count in the <textFileName> file is nnn.
```
- Replace `<textFileName>` with the actual name of the uploaded file.
- Replace `nnn` with the actual word count.

### Email Subject
```
Word Count Result
```

---

## 🔐 IAM Role & Permissions

> **Important:** The lab policy does **not** permit the creation of an IAM role. Use the pre-existing **`LambdaAccessRole`** role.

The `LambdaAccessRole` includes the following managed policies:

| Policy | Description |
|--------|-------------|
| `AWSLambdaBasicExecutionRole` | Write permissions to **Amazon CloudWatch Logs**. |
| `AmazonSNSFullAccess` | Full access to **Amazon SNS** via the AWS Management Console. |
| `AmazonS3FullAccess` | Full access to all **S3 buckets** via the AWS Management Console. |
| `CloudWatchFullAccess` | Full access to **Amazon CloudWatch**. |

---

## 🛠️ Architecture Diagram

```
+-------------+      Upload .txt       +-----------------+
|   User      | ---------------------->|   Amazon S3     |
|  (You)      |                        |   Bucket        |
+-------------+                        +--------+--------+
                                                |
                                                | Event Notification
                                                v
                                       +-----------------+
                                       |  AWS Lambda     |
                                       |  (Python)       |
                                       |                 |
                                       |  1. Read file   |
                                       |  2. Count words |
                                       |  3. Publish to  |
                                       |     SNS         |
                                       +--------+--------+
                                                |
                                                | Publish Message
                                                v
                                         +--------------+
                                         |  Amazon SNS  |
                                         |   Topic      |
                                         +------+-------+
                                                |
                               +----------------+----------------+
                               v                v                v
                         +---------+      +---------+      +---------+
                         |  Email  |      |  SMS    |      |  Other  |
                         | (Req'd) |      |(Optional|      |Endpoints|
                         +---------+      +---------+      +---------+
```

---

## 🧪 Testing Instructions

1. **Create a few sample `.txt` files** with different word counts.
   - Example: `sample1.txt` (5 words), `sample2.txt` (50 words), `sample3.txt` (200 words).
2. **Upload each file** to your configured S3 bucket.
3. **Check your email** for the word count result.
4. *(Optional)* **Check your phone** for the SMS message.
5. **Forward the email** and a **screenshot of your Lambda function** to your instructor.

---

## 💡 Hints

- 🌍 **Create all resources in the same AWS Region** to avoid cross-region latency and permission issues.
- 🔗 Ensure the **S3 bucket notification** is properly configured to trigger the Lambda function on `PUT` events for `.txt` files.
- 📧 Verify your **SNS topic subscription** (email) by clicking the confirmation link sent by AWS.
- 📱 For SMS, ensure the destination phone number is in **E.164 format** (e.g., `+1234567890`).
- 🐍 Use Python's built-in string methods (`.split()`) to count words efficiently.

---

## 📚 Additional Guidance

Refer to the following lab for foundational Lambda concepts:

> **Working with AWS Lambda**

---

## ✅ Conclusion

Congratulations! Upon successful completion of this lab, you will have:

- ✅ Created a Lambda function to count the number of words in a text file.
- ✅ Configured an S3 bucket to invoke a Lambda function when a text file is uploaded.
- ✅ Created an Amazon SNS topic to report the word count in an email.

---

## 📁 Sample Lambda Function (Python)

> **Note:** This is a reference implementation. You should build and test this in the AWS Management Console as part of the lab.

```python
import json
import boto3
import urllib.parse

s3 = boto3.client('s3')
sns = boto3.client('sns')

SNS_TOPIC_ARN = 'arn:aws:sns:<region>:<account-id>:<topic-name>'  # Replace with your SNS Topic ARN

def lambda_handler(event, context):
    # Get bucket and object key from the S3 event
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(
        event['Records'][0]['s3']['object']['key'], 
        encoding='utf-8'
    )

    try:
        # Read the file content from S3
        response = s3.get_object(Bucket=bucket, Key=key)
        text = response['Body'].read().decode('utf-8')

        # Count words
        word_count = len(text.split())

        # Format the message
        message = f"The word count in the {key} file is {word_count}."

        # Publish to SNS
        sns.publish(
            TopicArn=SNS_TOPIC_ARN,
            Subject='Word Count Result',
            Message=message
        )

        print(f"Successfully processed {key}. Word count: {word_count}")
        return {
            'statusCode': 200,
            'body': json.dumps({'message': message})
        }

    except Exception as e:
        print(f"Error processing file {key}: {str(e)}")
        raise e
```

---

## 🔗 Useful AWS Documentation

- [AWS Lambda Developer Guide](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
- [Amazon S3 Event Notifications](https://docs.aws.amazon.com/AmazonS3/latest/userguide/NotificationHowTo.html)
- [Amazon SNS Developer Guide](https://docs.aws.amazon.com/sns/latest/dg/welcome.html)
- [Boto3 S3 Documentation](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3.html)
- [Boto3 SNS Documentation](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/sns.html)

---

## 📸 Deliverables Checklist

- [ ] Lambda function created and configured in AWS Console.
- [ ] S3 bucket created with event notification triggering Lambda.
- [ ] SNS topic created with email subscription confirmed.
- [ ] Test email received with correct subject and formatted message.
- [ ] *(Optional)* Test SMS received.
- [ ] Email forwarded to instructor.
- [ ] Screenshot of Lambda function code sent to instructor.

---

> **Lab ID:** 177-[JAWS]  
> **Type:** Challenge Lab  
> **Service:** AWS Lambda, Amazon S3, Amazon SNS  
> **Language:** Python 3.x
