# Data Protection Using Encryption

> **Lab Duration:** ~45 minutes  
> **Level:** Intermediate  
> **Services:** AWS KMS, AWS EC2, AWS Encryption CLI

---

## Overview

This lab demonstrates how to protect sensitive data using **AWS Key Management Service (KMS)** and the **AWS Encryption CLI**. You will create a symmetric encryption key, configure an EC2 instance with the necessary credentials and tools, and perform encryption and decryption operations on mock sensitive data.

AWS KMS is a secure and resilient service that uses **Hardware Security Modules (HSMs)** validated under **FIPS 140-2** to protect your cryptographic keys.

### What You Will Build

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   AWS KMS Key   │◄────────│  File Server    │◄────────│  Encrypted      │
│  (Symmetric)    │         │  (EC2 Instance) │         │  Data Files     │
└─────────────────┘         └─────────────────┘         └─────────────────┘
       │                           │
       │    Encrypt/Decrypt        │
       └───────────────────────────┘
```

---

## Objectives

After completing this lab, you should be able to:

- [x] **Create** an AWS KMS encryption key
- [x] **Install** the AWS Encryption CLI
- [x] **Encrypt** plaintext data into ciphertext
- [x] **Decrypt** ciphertext back into readable plaintext

---

## Prerequisites

Before starting this lab, ensure you have:

| Requirement | Description |
|-------------|-------------|
| AWS Account | Access to the AWS Console with appropriate permissions |
| IAM Role | `voclabs` IAM role pre-configured for this lab |
| EC2 Instance | `File Server` instance pre-provisioned |
| Region | Note your AWS region from the lab details page |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              AWS Cloud                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         AWS KMS                                      │   │
│  │  ┌─────────────────────────────────────────────────────────────┐    │   │
│  │  │  Symmetric Key: MyKMSKey                                   │    │   │
│  │  │  - Alias: MyKMSKey                                         │    │   │
│  │  │  - Type: Symmetric (AES-256-GCM)                           │    │   │
│  │  │  - Administrators: voclabs                                 │    │   │
│  │  │  - Users: voclabs                                          │    │   │
│  │  └─────────────────────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    │ Key Usage                               │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    EC2 - File Server                                 │   │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐ │   │
│  │  │  secret1.txt    │───►│  encrypted file │───►│  decrypted file │ │   │
│  │  │  (plaintext)    │    │  (.encrypted)   │    │  (.decrypted)   │ │   │
│  │  └─────────────────┘    └─────────────────┘    └─────────────────┘ │   │
│  │                                                                     │   │
│  │  Tools Installed:                                                   │   │
│  │  - AWS CLI (configured)                                           │   │
│  │  - AWS Encryption CLI (aws-encryption-cli)                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Task 1: Create an AWS KMS Key

> **Estimated Time:** 10 minutes

In this task, you will create a **symmetric AWS KMS key** that will be used to encrypt and decrypt data.

### Why Symmetric Encryption?

| Aspect | Symmetric Encryption | Asymmetric Encryption |
|--------|---------------------|----------------------|
| **Key Usage** | Same key for encrypt & decrypt | Public key encrypts, private key decrypts |
| **Speed** | Fast and efficient | Slower due to complex math |
| **Use Case** | Bulk data encryption | Key exchange, digital signatures |
| **AWS KMS Support** |  Yes |  Yes |

For this lab, we use **symmetric encryption** because it is fast and efficient for file-level data protection.

### Step-by-Step Instructions

#### 1.1 Navigate to AWS KMS

1. In the AWS Console search bar, type `KMS` and select **Key Management Service**.

#### 1.2 Create a New Key

1. Click **Create a key**.
2. Under **Key type**, select **Symmetric**.
3. Click **Next**.

>  **Tip:** Symmetric keys use the same key to encrypt and decrypt data, making them ideal for encrypting files.

#### 1.3 Add Labels

Configure the following settings:

| Field | Value |
|-------|-------|
| **Alias** | `MyKMSKey` |
| **Description** | `Key used to encrypt and decrypt data files.` |

Click **Next**.

#### 1.4 Define Key Administrative Permissions

1. In the **Key administrators** section, search for `voclabs`.
2.  Select the checkbox next to `voclabs`.
3. Click **Next**.

#### 1.5 Define Key Usage Permissions

1. In the **This account** section, search for `voclabs`.
2.  Select the checkbox next to `voclabs`.
3. Click **Next**.

#### 1.6 Review and Finish

1. Review your settings.
2. Click **Finish**.

#### 1.7 Copy the Key ARN

1. Click on the **MyKMSKey** link (the key you just created).
2. Locate the **ARN** (Amazon Resource Name) field.
3.  **Copy the ARN value** and paste it into a text editor for later use.

>  **Important:** You will need this ARN in Task 3. Keep it accessible!

###  Task 1 Summary

You created a symmetric AWS KMS key named `MyKMSKey` and granted the `voclabs` IAM role both administrative and usage permissions for the key.

---

## Task 2: Configure the File Server Instance

> **Estimated Time:** 15 minutes

In this task, you will configure the `File Server` EC2 instance by:
- Setting up AWS credentials
- Installing the AWS Encryption CLI

### Step-by-Step Instructions

#### 2.1 Connect to the File Server

1. In the AWS Console search bar, type `EC2` and select **EC2**.
2. In the **Instances** list, find the **File Server** instance.
3.  Select the checkbox next to it.
4. Click **Connect**.
5. Choose the **Session Manager** tab.
6. Click **Connect**.

>  **Note:** Session Manager provides secure shell access without needing SSH keys or bastion hosts.

#### 2.2 Create AWS Credentials File

Run the following commands in the Session Manager terminal:

```bash
cd ~
aws configure
```

When prompted, enter the following:

| Prompt | Value | Action |
|--------|-------|--------|
| `AWS Access Key ID` | `1` | Temporary placeholder |
| `AWS Secret Access Key` | `1` | Temporary placeholder |
| `Default region name` | *Your lab region* | Copy from Vocareum AWS Details |
| `Default output format` | *(leave blank)* | Press Enter |

>  **Tip:** Use `Ctrl+Shift+V` to paste into the Session Manager terminal.

#### 2.3 Update Credentials with Lab-Specific Values

1. Go to the **Vocareum console** and click **AWS Details**.
2. Next to **AWS CLI**, click **Show**.
3.  Copy the code block (starts with `[default]`).
4. Paste it into a text editor.

#### 2.4 Edit the Credentials File

Back in the Session Manager terminal:

```bash
vi ~/.aws/credentials
```

1. Delete the existing contents by pressing `dd` repeatedly.
2. Paste the code block you copied from Vocareum.

The file should look similar to:

```ini
[default]
aws_access_key_id = ASIA...
aws_secret_access_key = xxxxx...
aws_session_token = FwoG...
```

3. Save and exit: Press `Escape`, type `:wq`, then press `Enter`.

#### 2.5 Verify Credentials

```bash
cat ~/.aws/credentials
```

You should see the updated credentials with `aws_access_key_id`, `aws_secret_access_key`, and `aws_session_token`.

#### 2.6 Install AWS Encryption CLI

```bash
pip3 install aws-encryption-sdk-cli
```

#### 2.7 Update PATH

```bash
export PATH=$PATH:/home/ssm-user/.local/bin
```

>  **Note:** This PATH update is temporary for the current session. You may need to re-run it if you disconnect.

###  Task 2 Summary

You configured AWS credentials on the File Server instance and installed the AWS Encryption CLI, enabling you to run encryption and decryption commands.

---

## Task 3: Encrypt and Decrypt Data

> **Estimated Time:** 20 minutes

In this task, you will:
1. Create mock sensitive data files
2. Encrypt plaintext into ciphertext
3. Decrypt ciphertext back into plaintext

### Step-by-Step Instructions

#### 3.1 Create Mock Sensitive Data

Run the following commands:

```bash
# Create three empty files
touch secret1.txt secret2.txt secret3.txt

# Add sensitive content to secret1.txt
echo 'TOP SECRET 1!!!' > secret1.txt
```

Verify the content:

```bash
cat secret1.txt
```

**Expected Output:**
```
TOP SECRET 1!!!
```

#### 3.2 Create Output Directory

```bash
mkdir output
```

#### 3.3 Store the KMS Key ARN

Run the following command, replacing `<KMS ARN>` with the ARN you copied in Task 1:

```bash
keyArn=<KMS ARN>
```

**Example:**
```bash
keyArn=arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012
```

>  **Tip:** You can identify a KMS key by its key ID, key ARN, alias name, or alias ARN.

#### 3.4 Encrypt the File

Run the encryption command:

```bash
aws-encryption-cli --encrypt \
    --input secret1.txt \
    --wrapping-keys key=$keyArn \
    --metadata-output ~/metadata \
    --encryption-context purpose=test \
    --commitment-policy require-encrypt-require-decrypt \
    --output ~/output/.
```

###  Command Breakdown

| Parameter | Purpose |
|-----------|---------|
| `--encrypt` | Specifies the encryption operation |
| `--input secret1.txt` | The plaintext file to encrypt |
| `--wrapping-keys key=$keyArn` | The KMS key used for encryption |
| `--metadata-output ~/metadata` | Saves encryption metadata to a file |
| `--encryption-context purpose=test` | Adds context for audit and security |
| `--commitment-policy require-encrypt-require-decrypt` | Enforces key commitment security feature |
| `--output ~/output/.` | Output directory for the encrypted file |

>  **Note:** When the command succeeds, it returns **no output**.

#### 3.5 Verify Encryption Success

```bash
echo $?
```

| Return Value | Meaning |
|-------------|---------|
| `0` |  Success |
| Non-zero |  Failure |

#### 3.6 View the Encrypted File

```bash
ls output
```

**Expected Output:**
```
secret1.txt.encrypted
```

View the ciphertext:

```bash
cd output
cat secret1.txt.encrypted
```

**Sample Output:**
```
????ENCRYPTED CONTENT???
```

>  **What happened?** The plaintext was transformed into **ciphertext** — unreadable data that can only be decrypted with the correct key.

#### 3.7 Decrypt the File

Run the decryption command:

```bash
aws-encryption-cli --decrypt \
    --input secret1.txt.encrypted \
    --wrapping-keys key=$keyArn \
    --commitment-policy require-encrypt-require-decrypt \
    --encryption-context purpose=test \
    --metadata-output ~/metadata \
    --max-encrypted-data-keys 1 \
    --buffer \
    --output .
```

###  Decryption Command Breakdown

| Parameter | Purpose |
|-----------|---------|
| `--decrypt` | Specifies the decryption operation |
| `--input secret1.txt.encrypted` | The encrypted file to decrypt |
| `--wrapping-keys key=$keyArn` | The KMS key used for decryption (same as encryption) |
| `--encryption-context purpose=test` | Must match the encryption context used during encryption |
| `--max-encrypted-data-keys 1` | Limits the number of data keys to process |
| `--buffer` | Enables buffering for performance |
| `--output .` | Outputs to current directory |

#### 3.8 View the Decrypted File

```bash
ls
```

**Expected Output:**
```
secret1.txt.encrypted
secret1.txt.encrypted.decrypted
```

View the restored plaintext:

```bash
cat secret1.txt.encrypted.decrypted
```

**Expected Output:**
```
TOP SECRET 1!!!
```

>  **Success!** The original plaintext has been fully restored.

### Encryption & Decryption Flow

```
┌─────────────┐    Encrypt     ┌─────────────────┐    Decrypt     ┌─────────────┐
│  Plaintext  │ ──────────────► │   Ciphertext    │ ──────────────► │  Plaintext  │
│ secret1.txt │    (KMS Key)    │ secret1.txt.enc │    (KMS Key)   │  (restored) │
└─────────────┘                 └─────────────────┘                └─────────────┘
      │                               │                                  │
      │  TOP SECRET 1!!!              │  ?????ENCRYPTED???               │  TOP SECRET 1!!!
      │                               │                                  │
```

###  Task 3 Summary

You successfully:
- Created mock sensitive data
- Encrypted plaintext into ciphertext using AWS KMS
- Decrypted ciphertext back into readable plaintext

---

## Cleanup

>  **Important:** To avoid unnecessary charges, clean up resources after completing the lab.   
### Steps:

1. **Delete the KMS Key:**
   - Navigate to AWS KMS → Customer managed keys
   - Select `MyKMSKey`
   - Click **Key actions** → **Schedule key deletion**
   - Confirm deletion (minimum 7-day waiting period)

2. **Terminate the EC2 Instance (if applicable):**
   - Navigate to EC2 → Instances
   - Select the File Server instance
   - Click **Instance state** → **Terminate instance**

3. **Remove Local Files:**
   ```bash
   cd ~
   rm -rf output/ secret1.txt secret2.txt secret3.txt metadata
   ```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `aws-encryption-cli: command not found` | Re-run `export PATH=$PATH:/home/ssm-user/.local/bin` |
| `AccessDeniedException` | Verify the `voclabs` role has KMS key usage permissions |
| `InvalidCiphertextException` | Ensure you're using the correct KMS key ARN |
| `EncryptionContextMismatch` | The `--encryption-context` must match exactly between encrypt and decrypt |
| `Credentials error` | Verify `~/.aws/credentials` contains valid session tokens |
| Pasting issues in Session Manager | Use `Ctrl+Shift+V` instead of `Ctrl+V` |

---

## Key Concepts

### Symmetric vs. Asymmetric Encryption

```
Symmetric Encryption:
┌─────────┐         ┌─────────┐         ┌─────────┐
│ Plain   │ ───────►│  Same   │ ───────►│ Cipher  │
│  Text   │         │   Key   │         │  Text   │
└─────────┘         └─────────┘         └─────────┘
     ▲                                    │
     └──────── Same Key ──────────────────┘

Asymmetric Encryption:
┌─────────┐         ┌─────────┐         ┌─────────┐
│ Plain   │ ───────►│ Public  │ ───────►│ Cipher  │
│  Text   │         │   Key   │         │  Text   │
└─────────┘         └─────────┘         └─────────┘
     ▲                                    │
     └──────── Private Key ───────────────┘
```

### Encryption Context

The **encryption context** is a set of key-value pairs that provide additional authenticated data (AAD). It:
- Adds security by binding ciphertext to specific context
- Appears in CloudTrail logs for audit purposes
- Must match exactly during decryption

### Key Commitment

The `--commitment-policy require-encrypt-require-decrypt` ensures:
- **Key commitment** is enforced during encryption
- Only ciphertext with valid key commitment can be decrypted
- Protects against certain cryptographic attacks

---

## Additional Resources

- [AWS KMS Documentation](https://docs.aws.amazon.com/kms/latest/developerguide/overview.html)
- [AWS Encryption SDK Developer Guide](https://docs.aws.amazon.com/encryption-sdk/latest/developer-guide/introduction.html)
- [AWS Encryption CLI Reference](https://docs.aws.amazon.com/encryption-sdk/latest/developer-guide/crypto-cli.html)
- [FIPS 140-2 Validation](https://csrc.nist.gov/projects/cryptographic-module-validation-program)
- [AWS KMS Best Practices](https://docs.aws.amazon.com/kms/latest/developerguide/best-practices.html)

---

## Lab Completion Checklist

- [x] Created a symmetric AWS KMS key (`MyKMSKey`)
- [x] Configured AWS credentials on the File Server
- [x] Installed the AWS Encryption CLI
- [x] Encrypted `secret1.txt` into ciphertext
- [x] Decrypted ciphertext back into plaintext
- [x] Verified data integrity (original content restored)

---

> **Congratulations!** You have successfully completed the Data Protection Using Encryption lab. You now understand how to use AWS KMS and the AWS Encryption CLI to secure sensitive data at rest.

---

*Last updated: 2026-06-10*
