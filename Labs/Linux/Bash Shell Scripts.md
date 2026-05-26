# Bash Shell Scripts

> **Lab: Automating Backups with Bash on Amazon Linux EC2**
> 
> **Estimated Duration:** ~25 minutes  
> **Environment:** Amazon Linux EC2 Instance (via SSH)  
> **Prerequisites:** Previous courseware and lab information (all labs build upon prior knowledge)

---

## Table of Contents

- [Overview](#overview)
- [Objectives](#objectives)
- [Prerequisites](#prerequisites)
- [Task 1: Connect to EC2 via SSH](#task-1-connect-to-ec2-via-ssh)
  - [Windows Users (PuTTY)](#windows-users-putty)
  - [macOS / Linux Users](#macos--linux-users)
- [Task 2: Write the Backup Shell Script](#task-2-write-the-backup-shell-script)
  - [Step-by-Step Script Creation](#step-by-step-script-creation)
  - [Script Breakdown](#script-breakdown)
  - [Execution & Verification](#execution--verification)
- [Script Reference](#script-reference)
- [Troubleshooting](#troubleshooting)
- [Next Steps](#next-steps)

---

## Overview

This lab guides you through creating a **Bash shell script** that automates the backup of a folder (`CompanyA`) as a compressed archive. The archive filename includes the current date to ensure unique, timestamped backups.

### Archive Naming Convention
```
YYYY_MM_DD-backup-CompanyA.tar.gz
```

---

## Objectives

By the end of this lab, you will be able to:

- [x] Connect to an Amazon Linux EC2 instance using SSH
- [x] Create and edit a Bash shell script
- [x] Use variables, the `date` command, and `tar` to create timestamped backups
- [x] Set appropriate file permissions for script execution
- [x] Execute the script and verify the backup archive

---

## Prerequisites

- Access to an Amazon Linux EC2 instance (public IP and key pair provided)
- SSH client installed (PuTTY for Windows, OpenSSH for macOS/Linux)
- Basic familiarity with Linux command line and `vi` editor
- `sudo` privileges (or root access) if required

> **Note:** All labs in this course build upon previous courseware. Ensure you have completed prior labs before proceeding.

---

## Task 1: Connect to EC2 via SSH

### Windows Users (PuTTY)

1. **Retrieve Credentials**
   - Select the **Details** drop-down menu above these instructions
   - Click **Show** to open the Credentials window
   - Click **Download PPK** and save `labsuser.ppk` (typically to `Downloads/`)
   - Make a note of the **PublicIP** address
   - Close the Details panel by clicking **X**

2. **Install PuTTY** (if not already installed)
   - Download from: [https://www.putty.org/](https://www.putty.org/)
   - Run `putty.exe`

3. **Configure PuTTY Session**
   - Follow AWS official guide: [Connect to your Linux instance using PuTTY](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/putty.html)
   - **Key settings:**
     - Host Name: `ec2-user@<PublicIP>`
     - Port: `22`
     - Connection → SSH → Auth → Private key: Browse to `labsuser.ppk`

4. **Connect**
   - Click **Open** to initiate the SSH session

> **Windows Users:** Once connected, proceed to [Task 2](#task-2-write-the-backup-shell-script).

---

### macOS / Linux Users

1. **Retrieve Credentials**
   - Select the **Details** drop-down menu above these instructions
   - Click **Show** to open the Credentials window
   - Click **Download PEM** and save `labsuser.pem`
   - Make a note of the **PublicIP** address
   - Close the Details panel by clicking **X**

2. **Set Key Permissions**
   ```bash
   chmod 400 ~/Downloads/labsuser.pem
   ```

3. **Connect via SSH**
   ```bash
   ssh -i ~/Downloads/labsuser.pem ec2-user@<PublicIP>
   ```

---

## Task 2: Write the Backup Shell Script

### Step-by-Step Script Creation

#### 1. Verify Home Directory

Ensure you are in the home folder before proceeding:

```bash
pwd
```

**Expected Output:**
```
[ec2-user@ ~]$ pwd
/home/ec2-user/
```

---

#### 2. Create the Script File

Create an empty shell script named `backup.sh`:

```bash
touch backup.sh
```

---

#### 3. Set Execute Permissions

Make the script executable so it can be run directly:

```bash
sudo chmod 755 backup.sh
```

> **Why `755`?**  
> - Owner: read (4) + write (2) + execute (1) = **7**  
> - Group: read (4) + execute (1) = **5**  
> - Others: read (4) + execute (1) = **5**  
> This allows the owner full control while letting others execute the script.

---

#### 4. Edit the Script with `vi`

Open `backup.sh` in the `vi` text editor:

```bash
vi backup.sh
```

---

#### 5. Enter Insert Mode

Press **`i`** to activate insert mode in `vi`.

> **vi Modes:**
> - **Normal mode:** Default mode for navigation and commands
> - **Insert mode (`i`):** For typing and editing text
> - **Command mode (`:`):** For saving, quitting, and other commands

---

#### 6. Write the Script

Type the following script line by line:

```bash
#!/bin/bash
DAY="$(date +%Y_%m_%d)"
BACKUP="/home/$USER/backups/$DAY-backup-CompanyA.tar.gz"
tar -csvpzf $BACKUP /home/$USER/CompanyA
```

---

#### 7. Save and Exit

1. Press **`Esc`** to exit insert mode and return to normal mode
2. Type **`:wq`** and press **Enter**
   - `:` enters command mode
   - `w` writes (saves) the file
   - `q` quits the editor

---

### Script Breakdown

| Line | Code | Explanation |
|------|------|-------------|
| 1 | `#!/bin/bash` | **Shebang** - Tells the system to execute this script using `/bin/bash` |
| 2 | `DAY="$(date +%Y_%m_%d)"` | Creates a variable `DAY` containing the current date formatted as `YYYY_MM_DD` |
| 3 | `BACKUP="/home/$USER/backups/$DAY-backup-CompanyA.tar.gz"` | Defines the full path for the backup archive. `$USER` resolves to `ec2-user` |
| 4 | `tar -csvpzf $BACKUP /home/$USER/CompanyA` | Creates a compressed archive of the `CompanyA` folder |

#### `tar` Flags Explained

| Flag | Meaning |
|------|---------|
| `-c` | **Create** a new archive |
| `-s` | **Preserve** symbolic links (handle them as links, not the target file) |
| `-v` | **Verbose** - List files being processed |
| `-p` | **Preserve permissions** of the original files |
| `-z` | **Compress** with gzip |
| `-f` | **File** - Specify archive filename (must be last flag before filename) |

#### `date` Format Specifiers

| Specifier | Output | Example |
|-----------|--------|---------|
| `%Y` | 4-digit year | `2026` |
| `%m` | 2-digit month | `05` |
| `%d` | 2-digit day | `26` |

> **Alternative:** You can also use `date +%Y%m%d` for a compact format like `20260526`.

---

### Execution & Verification

#### Run the Script

Execute the backup script from the current directory:

```bash
./backup.sh
```

**Expected Output:**
```
[ec2-user@ ~]$ ./backup.sh
tar: Removing leading `/' from member names
/home/ec2-user/CompanyA/
/home/ec2-user/CompanyA/Management/
/home/ec2-user/CompanyA/Management/Sections.csv
/home/ec2-user/CompanyA/Management/Promotions.csv
/home/ec2-user/CompanyA/Employees/
/home/ec2-user/CompanyA/Employees/Schedules.csv
/home/ec2-user/CompanyA/Finance/
/home/ec2-user/CompanyA/Finance/Salary.csv
/home/ec2-user/CompanyA/HR/
/home/ec2-user/CompanyA/HR/Managers.csv
/home/ec2-user/CompanyA/HR/Assessments.csv
/home/ec2-user/CompanyA/IA/
/home/ec2-user/CompanyA/SharedFolders/
```

> **Note on `tar` message:**  
> `tar: Removing leading '/' from member names` is a **normal security feature**. `tar` strips the leading `/` to prevent accidental overwrites when extracting to the root directory. This is expected behavior and not an error.

---

#### Verify the Backup

Check that the archive was created successfully in the `backups` directory:

```bash
ls backups/
```

**Expected Output:**
```
[ec2-user@ ~]$ ls backups/
2026_05_26-backup-CompanyA.tar.gz
```

> **Archive Location:** `/home/ec2-user/backups/YYYY_MM_DD-backup-CompanyA.tar.gz`

---

## Script Reference

### Complete `backup.sh`

```bash
#!/bin/bash
# =============================================================================
# Script Name: backup.sh
# Description: Automated backup of CompanyA folder as a timestamped tar.gz archive
# Author: Lab Student
# Date: $(date +%Y-%m-%d)
# Environment: Amazon Linux EC2
# =============================================================================

# --- Configuration ---
# DAY: Current date in YYYY_MM_DD format for unique archive naming
DAY="$(date +%Y_%m_%d)"

# BACKUP: Full path to the archive file
# $USER automatically resolves to the current user (ec2-user)
BACKUP="/home/$USER/backups/$DAY-backup-CompanyA.tar.gz"

# SOURCE: Directory to backup
SOURCE="/home/$USER/CompanyA"

# --- Execution ---
# Create compressed archive with preserved permissions and verbose output
tar -csvpzf "$BACKUP" "$SOURCE"

# --- Optional: Verification ---
if [ $? -eq 0 ]; then
    echo "Backup completed successfully: $BACKUP"
    ls -lh "$BACKUP"
else
    echo "Backup failed!" >&2
    exit 1
fi
```

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| `Permission denied` when running `./backup.sh` | Script lacks execute permissions | Run `chmod 755 backup.sh` |
| `tar: /home/ec2-user/CompanyA: Cannot open: No such file or directory` | Source directory doesn't exist | Verify the path with `ls /home/$USER/CompanyA` |
| `tar (child): /home/ec2-user/backups/...: Cannot open: No such file or directory` | `backups` directory doesn't exist | Create it first: `mkdir -p /home/$USER/backups` |
| `vi` won't let me type | Not in insert mode | Press `i` to enter insert mode |
| Can't save in `vi` | Typing in wrong mode | Press `Esc`, then type `:wq` and press Enter |
| `sudo: command not found` | Not installed or not in PATH | Try without `sudo` first; most EC2 tasks work as `ec2-user` |

---

## Next Steps

### Scheduling with `cron`

To run this backup automatically on a schedule, add it to the crontab:

```bash
# Open crontab editor
crontab -e

# Add a line to run daily at 2:00 AM
0 2 * * * /home/ec2-user/backup.sh >> /home/ec2-user/backup.log 2>&1
```

### Advanced Enhancements

- [ ] Add error handling and logging
- [ ] Implement backup rotation (keep only last N backups)
- [ ] Copy archives to S3 or remote servers using `aws s3 cp` or `scp`
- [ ] Add email notifications on success/failure
- [ ] Encrypt archives with `gpg` for sensitive data

---

## License

This lab material is provided for educational purposes as part of the cloud computing curriculum.

---

> **Lab Complete!** You have successfully created and executed a Bash script that automates folder backups with timestamped archives.
