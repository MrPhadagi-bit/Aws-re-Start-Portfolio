# Working with Files - Linux Backup Lab

## Overview
This lab demonstrates how to create backups of file structures, log backup operations, and transfer files between directories on an Amazon Linux EC2 instance using SSH and standard Linux utilities.

**Duration:** Approximately 30 minutes

## Objectives

- Create a backup file of an entire folder structure using `tar`
- Log the creation of the backup with date, time, and filename
- Move the backup file to another folder for accessibility

---

## Prerequisites

- Access to an Amazon Linux EC2 instance
- SSH client (PuTTY for Windows, Terminal for macOS/Linux)
- EC2 instance credentials (`.ppk` file for Windows or `.pem` for macOS/Linux)
- Public IP address of the EC2 instance

---

## Task 1: Connect to the EC2 Instance via SSH

### Windows Users (Using PuTTY)

1. **Download Credentials:**
   - Select the **Details** drop-down menu in the lab instructions
   - Click **Show** to open the Credentials window
   - Click **Download PPK** and save `labsuser.ppk` (typically to Downloads)
   - Note the **Public IP** address
   - Close the Details panel

2. **Download PuTTY** (if not installed):
   - Download from: [https://www.putty.org/](https://www.putty.org/)
   - Open `putty.exe`

3. **Configure PuTTY Session:**
   - Follow AWS documentation: [Connect to your Linux instance using PuTTY](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/putty.html)

### macOS/Linux Users (Using Terminal)

1. **Download Credentials:**
   - Download the `.pem` key file from the lab credentials
   - Note the **Public IP** address

2. **Set Permissions and Connect:**
   ```bash
   chmod 400 labsuser.pem
   ssh -i labsuser.pem ec2-user@<Public-IP-Address>
   ```

---

## Task 2: Create a Backup

### Understanding the Folder Structure

The target directory structure is located at `/home/ec2-user/CompanyA/`:

```
/home/ec2-user/CompanyA/
├── Employees/
│   └── Schedules.csv
├── Finance/
│   └── Salary.csv
├── HR/
│   ├── Assessments.csv
│   └── Managers.csv
├── IA/
├── Management/
│   ├── Promotions.csv
│   └── Sections.csv
└── SharedFolders/
```

### Step 1: Verify Current Location

Ensure you are in the `/home/ec2-user/` directory:

```bash
pwd
```

**Expected Output:**
```
/home/ec2-user
```

### Step 2: Validate Folder Structure

Confirm the `CompanyA` folder and its contents exist:

```bash
ls -R CompanyA
```

**Expected Output:**
```
CompanyA/:
Employees  Finance  HR  IA  Management  SharedFolders

CompanyA/Employees:
Schedules.csv

CompanyA/Finance:
Salary.csv

CompanyA/HR:
Assessments.csv  Managers.csv

CompanyA/IA:

CompanyA/Management:
Promotions.csv  Sections.csv
```

### Step 3: Create the Backup Archive

Use `tar` to create a compressed backup of the entire `CompanyA` folder:

```bash
tar -csvpzf backup.CompanyA.tar.gz CompanyA
```

**Command Breakdown:**
| Flag | Description |
|------|-------------|
| `-c` | Create a new archive |
| `-s` | Preserve order (handle sparse files efficiently) |
| `-v` | Verbose mode (list files being processed) |
| `-p` | Preserve permissions |
| `-z` | Compress with gzip |
| `-f` | Specify filename |

**Expected Output:**
```
CompanyA/
CompanyA/Management/
CompanyA/Management/Sections.csv
CompanyA/Management/Promotions.csv
CompanyA/Employees/
CompanyA/Employees/Schedules.csv
CompanyA/Finance/
CompanyA/Finance/Salary.csv
CompanyA/HR/
CompanyA/HR/Managers.csv
CompanyA/HR/Assessments.csv
CompanyA/IA/
CompanyA/SharedFolders/
```

### Step 4: Verify Archive Creation

List files to confirm the backup was created:

```bash
ls
```

**Expected Output:**
```
backup.CompanyA.tar.gz  CompanyA
```

> **Note:** The `backup.CompanyA.tar.gz` file contains the complete folder structure and can be copied and extracted on another location or host.

---

## Task 3: Log the Backup

Create a log file to record when backups were created, helping avoid unnecessary duplicate backups in the future.

### Step 1: Navigate to CompanyA Directory

```bash
cd /home/ec2-user/CompanyA
```

**Expected Output:**
```
[ec2-user@ CompanyA]$
```

### Step 2: Create the Log File

Create an empty CSV file for backup logs:

```bash
touch SharedFolders/backups.csv
```

### Step 3: Add Backup Entry

Log the date, time, and filename of the backup:

```bash
echo "25 Aug 2021, 16:59, backup.CompanyA.tar.gz" | sudo tee SharedFolders/backups.csv
```

> **Note:** The `tee` command writes output to both the terminal and a file. The pipe `|` redirects the `echo` output to `tee`, which writes it to `SharedFolders/backups.csv` while also displaying it on screen.

**Expected Output:**
```
25 Aug 2021, 16:59, backup.CompanyA.tar.gz
```

### Step 4: Verify Log Content

Display the contents of the log file:

```bash
cat SharedFolders/backups.csv
```

**Expected Output:**
```
25 Aug 2021, 16:59, backup.CompanyA.tar.gz
```

---

## Task 4: Move the Backup File

Transfer the backup to the `IA` folder to make it accessible to another team or user who may not have access to the original location.

### Step 1: Confirm Current Location

```bash
pwd
```

**Expected Output:**
```
/home/ec2-user/CompanyA
```

### Step 2: Move the Backup File

Move the archive from the parent directory to the `IA` folder:

```bash
mv ../backup.CompanyA.tar.gz IA/
```

### Step 3: Verify the Move

List contents of both the current directory and the `IA` folder:

```bash
ls . IA
```

**Expected Output:**
```
.:
Employees  Finance  HR  IA  Management  SharedFolders

IA:
backup.CompanyA.tar.gz
```

> **Note:** The backup file is no longer in the current directory (`CompanyA`) and has been successfully moved to the `IA` folder.

---

## Summary of Commands

| Task | Command | Purpose |
|------|---------|---------|
| Verify location | `pwd` | Check current working directory |
| List structure | `ls -R CompanyA` | View recursive directory listing |
| Create backup | `tar -csvpzf backup.CompanyA.tar.gz CompanyA` | Compress and archive folder |
| Navigate | `cd /home/ec2-user/CompanyA` | Change to target directory |
| Create log | `touch SharedFolders/backups.csv` | Create empty log file |
| Log entry | `echo "..." \| sudo tee SharedFolders/backups.csv` | Write backup metadata |
| View log | `cat SharedFolders/backups.csv` | Display log contents |
| Move file | `mv ../backup.CompanyA.tar.gz IA/` | Transfer backup to IA folder |
| Verify move | `ls . IA` | Confirm file relocation |

---

## Key Concepts Learned

1. **tar Command:** Creates compressed archives preserving permissions and directory structure
2. **tee Command:** Writes output to both terminal and file simultaneously
3. **Pipe (`|`):** Redirects output from one command to another
4. **File Management:** Moving files between directories for access control
5. **Logging:** Maintaining records of backup operations with timestamps

---

## Files Created

- `backup.CompanyA.tar.gz` - Compressed backup archive (moved to `IA/`)
- `SharedFolders/backups.csv` - Backup log with timestamp and filename

---

*Lab completed successfully!*
