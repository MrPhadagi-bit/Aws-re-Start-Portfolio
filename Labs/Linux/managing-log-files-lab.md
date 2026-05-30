# Managing Log Files

> **Lab Duration:** 5-10 minutes  
> **Environment:** Amazon Linux EC2 Instance  
> **Prerequisites:** SSH access to EC2 instance

---

## Objectives

By the end of this lab, you will be able to:

- [ ] Connect to an Amazon Linux EC2 instance via SSH
- [ ] Review and analyze the `secure` log file using Linux tools
- [ ] Use the `lastlog` utility to review previous user login activity
- [ ] Extract meaningful security information from log files

---

## Table of Contents

- [Task 1: Connect to the EC2 Instance via SSH](#task-1-connect-to-the-ec2-instance-via-ssh)
  - [Windows Users](#-windows-users)
  - [macOS / Linux Users](#-macos--linux-users)
- [Task 2: Review Secure Log Files](#task-2-review-secure-log-files)
  - [Step 2.1: Verify Working Directory](#step-21-verify-working-directory)
  - [Step 2.2: Inspect the Secure Log](#step-22-inspect-the-secure-log)
  - [Step 2.3: Review Last Login Times](#step-23-review-last-login-times)
- [Additional Challenge](#-additional-challenge)
- [Key Takeaways](#-key-takeaways)
- [Troubleshooting](#-troubleshooting)

---

## Task 1: Connect to the EC2 Instance via SSH

> **Note:** The following instructions vary slightly depending on your operating system. Select the section that applies to you.

### 🪟 Windows Users

These instructions are specifically for Windows users. If you are using macOS or Linux, skip to the [next section](#-macos--linux-users).

1. **Retrieve Credentials**
   - Select the **Details** drop-down menu in your lab environment.
   - Click **Show** to reveal the Credentials window.

2. **Download the Key Pair**
   - Click the **Download PPK** button and save `labsuser.ppk` to your local machine.
   - The file is typically saved to your `Downloads` directory.

3. **Note the Public IP**
   - Make a note of the **PublicIP** address displayed in the credentials panel.
   - Close the Details panel by clicking the **X**.

4. **Install PuTTY (if needed)**
   - If PuTTY is not installed, download it from the official site: [https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html)

5. **Configure Your PuTTY Session**
   - Open `putty.exe`.
   - Follow the AWS documentation to configure your session: [Connect to your Linux instance using PuTTY](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/putty.html)
   - Use the downloaded `.ppk` file for authentication.

> ✅ **Windows Users:** Once connected, proceed to [Task 2](#task-2-review-secure-log-files).

---

### 🍎 macOS / Linux Users

These instructions are for users on macOS or Linux systems.

1. **Retrieve Credentials**
   - Open the **Details** panel in your lab environment and click **Show**.

2. **Download the Key Pair**
   - Click the **Download PEM** button and save `labsuser.pem` to your local machine.

3. **Set Permissions on the Key File**
   ```bash
   chmod 400 ~/Downloads/labsuser.pem
   ```

4. **Connect via SSH**
   ```bash
   ssh -i ~/Downloads/labsuser.pem ec2-user@<PublicIP>
   ```
   Replace `<PublicIP>` with the actual public IP address from the credentials panel.

---

## Task 2: Review Secure Log Files

In this task, you will use common Linux tools to review authentication logs and user login history.

### Step 2.1: Verify Working Directory

Ensure you are in the `companyA` home folder:

```bash
pwd
```

If the output is not `/home/ec2-user/companyA` (or equivalent), navigate to it:

```bash
cd companyA
```

---

### Step 2.2: Inspect the Secure Log

View the contents of the secure log file using `less`:

```bash
sudo less /tmp/log/secure
```

> **Note:** In a typical production environment, the secure log is located at `/var/log/secure`. For this lab, a sample log file is provided at `/tmp/log/secure`.

**Expected Output:**

The log displays authentication events including:
- Source IP addresses of connection attempts
- Authentication failure messages
- Target port numbers
- Timestamps of each event

```
May 30 10:15:01 ip-172-31-0-1 sshd[1234]: Failed password for invalid user admin from 192.168.1.100 port 54321 ssh2
May 30 10:15:05 ip-172-31-0-1 sshd[1234]: Connection closed by 192.168.1.100 port 54321 [preauth]
```

**Key Information Extracted:**
| Field | Description |
|-------|-------------|
| `Timestamp` | When the event occurred |
| `IP Address` | Origin of the connection attempt |
| `Failed password` | Indicates an authentication failure |
| `Port` | Network port used for the attempt |
| `User` | Username used in the attempt (valid or invalid) |

To exit `less`, press **`q`**.

---

### Step 2.3: Review Last Login Times

Display the most recent login time for every user on the system:

```bash
sudo lastlog
```

**Expected Output:**

```
Username         Port     From             Latest
root             pts/0    192.168.1.50     Fri May 30 09:30:01 +0000 2026
bin                                        **Never logged in**
daemon                                     **Never logged in**
adm                                        **Never logged in**
...                                        ...
```

**Key Observations:**
- `root` — Shows the most recent login (if any)
- System accounts (e.g., `bin`, `daemon`, `adm`) — Typically show `**Never logged in**` as they are service accounts
- This helps identify:
  - Unused accounts that could be disabled
  - Unexpected login activity
  - Potential security breaches

---

## 🎯 Additional Challenge

Now that you've reviewed the logs, consider the following questions for your business or security operations:

1. **Threat Detection**
   - Are there repeated failed login attempts from the same IP address? This could indicate a brute-force attack.

2. **User Activity Auditing**
   - Which users have logged in recently? Are there any logins outside of business hours?

3. **Compliance & Reporting**
   - Can you generate a report of all failed authentication attempts for the past 24 hours?

4. **Automation**
   - How could you automate log monitoring using tools like `logwatch`, `fail2ban`, or a SIEM solution?

5. **Log Rotation**
   - How does log rotation (`logrotate`) prevent log files from consuming excessive disk space?

---

## 📚 Key Takeaways

| Command | Purpose |
|---------|---------|
| `sudo less /var/log/secure` | View authentication and security logs |
| `sudo lastlog` | Display the last login time for all users |
| `sudo tail -f /var/log/secure` | Monitor logs in real-time |
| `sudo grep "Failed password" /var/log/secure` | Filter for specific events |

**Best Practices:**
- Regularly review `/var/log/secure` for unauthorized access attempts.
- Monitor `lastlog` output to identify dormant or compromised accounts.
- Forward logs to a centralized logging server for long-term retention and analysis.
- Restrict SSH access using security groups and key-based authentication.

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| `Permission denied` when accessing logs | Use `sudo` to elevate privileges |
| `lastlog` shows `**Never logged in**` for all users | This is normal for system/service accounts |
| Cannot exit `less` | Press `q` to quit |
| SSH connection refused | Verify the security group allows inbound SSH (port 22) and the instance is running |

---

## ✅ Lab Complete

You have successfully:
- Connected to an Amazon Linux EC2 instance via SSH
- Reviewed the secure log file for authentication events
- Analyzed user login history with `lastlog`
- Identified key security information within log files

**Next Steps:** Explore additional log files such as `/var/log/messages`, `/var/log/audit/audit.log`, or set up `fail2ban` to automatically block suspicious IP addresses.

---

*Lab version: 1.0*  
*Last updated: May 2026*
