# Software Management Lab

> **Level:** Beginner | **Duration:** ~35 minutes | **Platform:** Amazon Linux EC2 (RHEL-based)

---

## Overview

This lab walks you through essential software management tasks on an Amazon Linux EC2 instance. You will:

- Connect securely via SSH
- Update and upgrade system packages using `yum`
- Roll back (undo) a package installation using `yum history`
- Install and configure the AWS Command Line Interface (AWS CLI v2)

> **Note:** On Amazon Linux 2/2023, `yum` is an alias for `dnf`. The commands used here work on both.

---

## Prerequisites

| Requirement | Details |
|-------------|---------|
| **AWS Account** | Active AWS account with EC2 access |
| **EC2 Instance** | Running Amazon Linux 2/2023 instance with a public IP |
| **Security Group** | Inbound rule allowing **SSH (port 22)** from your IP |
| **Key Pair** | `.pem` (Mac/Linux) or `.ppk` (Windows PuTTY) private key |
| **SSH Client** | OpenSSH (Mac/Linux) or PuTTY (Windows) |

### Default Usernames by AMI

| AMI | Default Username |
|-----|-----------------|
| Amazon Linux 2 / 2023 | `ec2-user` |
| Ubuntu | `ubuntu` |
| RHEL | `ec2-user` |

---

## Task 1: Connect to EC2 via SSH

### macOS / Linux Users

1. **Set key permissions** (required by SSH):
   ```bash
   chmod 400 /path/to/your-key.pem
   ```

2. **Connect to the instance**:
   ```bash
   ssh -i /path/to/your-key.pem ec2-user@<PUBLIC_IP>
   ```

3. On first connection, type `yes` when prompted to verify the host fingerprint.

### Windows Users (PuTTY)

1. Open the **Details** panel in your lab environment and click **Show**.
2. Click **Download PPK** and save `labsuser.ppk`.
3. Note the **Public IP** address, then close the Details panel.
4. Open **PuTTY** (`putty.exe`).
5. In the **Host Name** field, enter: `ec2-user@<PUBLIC_IP>`
6. Navigate to **Connection > SSH > Auth > Credentials**.
7. Browse to and select your `.ppk` file.
8. Click **Open** to connect.

> **Tip:** For frequent connections, create an `~/.ssh/config` entry to avoid typing the full command each time.

---

## Task 2: Update the Linux Machine

In this task, you use the `yum` package manager to check for, and apply, available updates — including security patches.

> **Note:** You may need `sudo` if not running as root.

### Step 2.1: Verify Your Working Directory

```bash
pwd
```

If you are not in the `companyA` home folder:

```bash
cd companyA
```

### Step 2.2: Check for Available Updates

Query the repositories for packages that can be updated:

```bash
sudo yum -y check-update
```

**Expected output:** A list of packages with available updates, or `No packages marked for update` if the system is current.

### Step 2.3: Apply Security-Related Updates

Install only updates classified as security patches:

```bash
sudo yum update --security
```

### Step 2.4: Upgrade All Packages

Apply all available updates and upgrades:

```bash
sudo yum -y upgrade
```

**What this does:**
- `-y` automatically answers "yes" to all prompts
- `upgrade` updates existing packages and installs new dependencies

> **Note:** If your instance is already up to date, the command will report `No packages marked for update`. This is normal — running the command still provides good practice.

### Step 2.5: Install a Sample Package (httpd)

Install the Apache web server package. This also populates `yum history` for the rollback task:

```bash
sudo yum install httpd -y
```

**Expected output:** The command lists the packages being installed and shows the transaction summary.

---

## Task 3: Roll Back a Package

In this task, you use `yum history` to view past transactions and undo a specific one — effectively downgrading or removing packages installed in that transaction.

> **Warning:** Rollback of critical packages like `glibc`, `kernel`, `selinux-policy*`, and `dbus` is **not supported** and may leave the system in an unstable state. Use `yum history` for small, targeted rollbacks only. citeweb_search:1#1web_search:1#3

### Step 3.1: List Transaction History

```bash
sudo yum history list
```

**Example output:**

```
Loaded plugins: extras_suggestions, langpacks, priorities, update-motd
ID  | Login user            | Date and time     | Action(s) | Altered
------------------------------------------------------------
2   | EC2 ... <ec2-user>    | 2026-05-30 10:15  | Install   | 9
1   | System <unset>        | 2026-05-30 10:10  | I, O, U   | 18
```

**Columns explained:**
- **ID** — Transaction identifier (needed for undo)
- **Login user** — Who performed the transaction
- **Action(s)** — `I`=Install, `U`=Update, `O`=Obsoleting, `E`=Erase/Remove
- **Altered** — Number of packages changed

> **Make a note** of the transaction ID for the `httpd` install (usually the highest number).

### Step 3.2: View Transaction Details

Replace `<#>` with the transaction ID from Step 3.1:

```bash
sudo yum history info <#>
```

**Example output:**

```
Transaction ID  : 2
Begin time      : Fri May 30 10:15:00 2026
Begin rpmdb     : 1234:...
End time        : 10:15:32 2026
End rpmdb       : 1243:...
User            : EC2 Default User <ec2-user>
Return-Code     : Success
Command Line    : install httpd -y
```

### Step 3.3: Undo the Transaction

Replace `<#>` with the transaction ID:

```bash
sudo yum -y history undo <#>
```

**What happens:**
- Packages installed in that transaction are removed
- Packages updated in that transaction are downgraded
- Dependencies are resolved automatically

**Expected output:**

```
Undoing transaction 2, from Fri May 30 10:15:00 2026
Dep-Install     apr-1.7.0-11.amzn2.x86_64
Dep-Install     apr-util-1.6.1-5.amzn2.0.2.x86_64
...
Erased          httpd-2.4.62-1.amzn2.x86_64
Complete!
```

> **Alternative:** You can also use `sudo yum history undo last` to undo the most recent transaction without knowing the ID.

---

## Task 4: Install the AWS CLI

The AWS CLI v2 is the primary tool for interacting with AWS services from the command line. On Amazon Linux, it is installed via a standalone installer (not through `yum`). citeweb_search:1#4

### Step 4.1: Verify Python

```bash
python3 --version
```

**Requirement:** Python 3.3+ or Python 2.6.5+.

### Step 4.2: Verify pip (Optional)

```bash
pip3 --version
```

If `pip3` is not found, proceed with the standalone installer below.

### Step 4.3: Download the AWS CLI v2 Installer

```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
```

- `-o` specifies the output filename
- The file is saved to your current directory

### Step 4.4: Unzip the Installer

```bash
unzip awscliv2.zip
```

This creates an `aws/` directory containing the install script.

### Step 4.5: Run the Installer

```bash
sudo ./aws/install
```

**What this does:**
- Installs AWS CLI to `/usr/local/aws-cli/`
- Creates a symlink at `/usr/local/bin/aws`
- Requires `sudo` for write permissions to system directories

### Step 4.6: Verify Installation

```bash
aws --version
```

**Expected output:**

```
aws-cli/2.x.x Python/3.x.x Linux/... exe/x86_64.amzn.2
```

### Step 4.7: View Help (Optional)

```bash
aws help
```

Press `q` to exit the help viewer.

> **Updating AWS CLI v2:** To update to a newer release, repeat Steps 4.3–4.4, then run `sudo ./aws/install --update`. citeweb_search:1#4

---

## Task 5: Configure the AWS CLI

In this task, you configure the AWS CLI with credentials and default settings so it can communicate with your AWS account.

### Step 5.1: Run Configuration Wizard

```bash
aws configure
```

You will be prompted for four values:

| Prompt | Value | Notes |
|--------|-------|-------|
| `AWS Access Key ID` | *(leave blank)* | Press Enter |
| `AWS Secret Access Key` | *(leave blank)* | Press Enter |
| `Default region name` | `us-west-2` | Or your preferred region |
| `Default output format` | `json` | Options: `json`, `yaml`, `text`, `table` |

### Step 5.2: Manually Add Credentials

Since the lab provides temporary session credentials, you must paste them directly into the credentials file.

1. Open the credentials file:
   ```bash
   sudo nano ~/.aws/credentials
   ```

2. Paste the credentials from your lab **Details** panel (AWS CLI section). The format should look like:

   ```ini
   [default]
   aws_access_key_id=AKIA...
   aws_secret_access_key=...
   aws_session_token=...
   ```

3. Save and exit:
   - Press `Ctrl + O` → `Enter` to save
   - Press `Ctrl + X` to exit

### Step 5.3: Verify AWS CLI Connectivity

Find your **Command Host** instance ID from the EC2 console, then run:

```bash
aws ec2 describe-instance-attribute   --instance-id i-1234567890abcdefg   --attribute instanceType
```

**Expected output:**

```json
{
    "InstanceId": "i-1234567890abcdefg",
    "InstanceType": {
        "Value": "t3.micro"
    }
}
```

If you see valid JSON output with your instance details, the AWS CLI is configured correctly.

---

## Cleanup

To avoid incurring costs, terminate or stop your EC2 instance when finished:

```bash
# From your local machine (after exiting SSH)
aws ec2 terminate-instances --instance-ids i-1234567890abcdefg
```

Or use the AWS Management Console:
1. Go to **EC2 > Instances**
2. Select your instance
3. Click **Instance state > Terminate instance**

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Permission denied (publickey)` | Ensure key file permissions are `chmod 400`. Verify you are using the correct username (`ec2-user`). |
| `No packages marked for update` | System is already up to date. This is not an error. |
| `yum history undo` fails | Some packages (kernel, glibc, selinux) cannot be rolled back. Ensure older RPM versions are still available in enabled repos. citeweb_search:1#3 |
| `aws: command not found` | The symlink may not be in your `$PATH`. Try `/usr/local/bin/aws --version` or re-run the installer. |
| `Unable to locate credentials` | Verify `~/.aws/credentials` exists and contains valid keys. Check file permissions. |
| PuTTY "Network error: Connection timed out" | Verify the security group allows inbound SSH (port 22) from your public IP. Check the instance is running and has a public IP. |

---

## Key Takeaways

- `yum check-update` queries repos without installing anything.
- `yum update --security` applies only security patches.
- `yum -y upgrade` applies all available updates non-interactively.
- `yum history` tracks every transaction and allows precise undo/redo operations.
- **Not all packages can be safely rolled back** — always have backups for major updates.
- AWS CLI v2 is installed via a standalone zip installer, not through `yum`.
- The `aws configure` command creates `~/.aws/credentials` and `~/.aws/config` files.
- Session tokens (from temporary credentials) must be included in the credentials file.

---

## References

- [Red Hat: How to use yum history to roll back an update](https://access.redhat.com/solutions/64069) citeweb_search:1#3
- [Red Hat: How to use yum/dnf to downgrade or rollback](https://access.redhat.com/solutions/29617) citeweb_search:1#1
- [AWS CLI v2 Installation Guide](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-linux.html)
- [AWS EC2: Connect to Your Linux Instance Using SSH](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstancesLinux.html)

---

*Lab version: 1.0 | Last updated: 2026-05-30*
