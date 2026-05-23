# Working with the File System

## Lab Overview

This lab provides hands-on experience with fundamental Linux file system operations using an Amazon Linux EC2 instance. You will learn to create, organize, copy, move, and delete files and directories using terminal commands.

## Objectives

In this lab, you will:

-  Create a folder structure as specified
-  Create files
-  Copy and move files and directories
-  Delete files and directories

## Duration

 This lab requires approximately **30 minutes** to complete.

---

## Task 1: Use SSH to Connect to an Amazon Linux EC2 Instance

In this task, you will connect to an Amazon Linux EC2 instance using an SSH utility. The instructions vary slightly depending on your operating system.

### Windows Users: Using SSH to Connect

>  **macOS/Linux users:** Skip to the next section.

1. **Access Credentials:**
   - Select the **Details** drop-down menu above these instructions
   - Select **Show**
   - A **Credentials** window will be presented

2. **Download Key File:**
   - Select the **Download PPK** button
   - Save the `labsuser.ppk` file (typically saved to the Downloads directory)

3. **Note the Public IP:**
   - Make a note of the **PublicIP** address displayed

4. **Close Details Panel:**
   - Exit the Details panel by selecting the **X**

5. **Install PuTTY (if needed):**
   - Download [PuTTY](https://www.putty.org/) if not already installed
   - Open `putty.exe`

6. **Configure PuTTY Session:**
   - Follow the official AWS guide: [Connect to your Linux instance using PuTTY](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/putty.html)
   - Use the Public IP and `labsuser.ppk` file
   - Username: `ec2-user`

---

### macOS/Linux Users: Using SSH to Connect

1. **Access Credentials:**
   - Select the **Details** drop-down menu
   - Select **Show** to open the Credentials window

2. **Download Key File:**
   - Select the **Download PEM** button
   - Save the `labsuser.pem` file

3. **Set Permissions on Key File:**
   ```bash
   chmod 400 labsuser.pem
   ```

4. **Connect via SSH:**
   ```bash
   ssh -i labsuser.pem ec2-user@<PublicIP>
   ```

---

## Task 2: Create a Folder Structure

In this task, you will create a specific folder structure for CompanyA. The structure is as follows:

```
/home/ec2-user/
└── CompanyA/
    ├── Finance/
    │   ├── ProfitAndLossStatements.csv
    │   └── Salary.csv
    ├── HR/
    │   ├── Assessments.csv
    │   └── TrialPeriod.csv
    └── Management/
        ├── Managers.csv
        └── Schedule.csv
```

### Step-by-Step Instructions

#### Step 1: Navigate to Home Directory

```bash
# Verify you're in the home folder
pwd

# If not in /home/ec2-user, navigate there
cd /home/ec2-user
```

#### Step 2: Create the Top-Level Directory

```bash
mkdir CompanyA
```

#### Step 3: Navigate into CompanyA

```bash
cd CompanyA
```

#### Step 4: Create Subdirectories

```bash
mkdir Finance HR Management
```

#### Step 5: Verify Folders Were Created

```bash
ls
```

**Expected Output:**
```
Finance  HR  Management
```

#### Step 6: Create Files in HR Directory

```bash
cd HR
touch Assessments.csv TrialPeriod.csv
```

#### Step 7: Verify HR Files

```bash
ls
```

**Expected Output:**
```
Assessments.csv  TrialPeriod.csv
```

#### Step 8: Create Files in Finance Directory

```bash
cd ../Finance
touch Salary.csv ProfitAndLossStatements.csv
```

#### Step 9: Verify Finance Files

```bash
ls
```

**Expected Output:**
```
ProfitAndLossStatements.csv  Salary.csv
```

#### Step 10: Create Files in Management Directory

```bash
cd ..
touch Management/Managers.csv Management/Schedule.csv
```

#### Step 11: Verify Management Files

```bash
ls Management
```

**Expected Output:**
```
Managers.csv  Schedule.csv
```

#### Step 12: Final Verification

```bash
ls -laR
```

**Expected Output:**
```
.:
total 0
drwxr-xr-x 5 ec2-user root     49 Aug 10 13:36 .
drwx------ 4 ec2-user ec2-user 90 Aug 10 13:25 ..
drwxrwxr-x 2 ec2-user ec2-user 59 Aug 10 13:39 Finance
drwxrwxr-x 2 ec2-user ec2-user 52 Aug 10 13:37 HR
drwxrwxr-x 2 ec2-user ec2-user 46 Aug 10 13:39 Management

./Finance:
total 0
drwxrwxr-x 2 ec2-user ec2-user 59 Aug 10 13:39 .
drwxr-xr-x 5 ec2-user root     49 Aug 10 13:36 ..
-rw-rw-r-- 1 ec2-user ec2-user  0 Aug 10 13:39 ProfitAndLossStatements.csv
-rw-rw-r-- 1 ec2-user ec2-user  0 Aug 10 13:39 Salary.csv

./HR:
total 0
drwxrwxr-x 2 ec2-user ec2-user 52 Aug 10 13:37 .
drwxr-xr-x 5 ec2-user root     49 Aug 10 13:36 ..
-rw-rw-r-- 1 ec2-user ec2-user  0 Aug 10 13:37 Assessments.csv
-rw-rw-r-- 1 ec2-user ec2-user  0 Aug 10 13:37 TrialPeriod.csv

./Management:
total 0
drwxrwxr-x 2 ec2-user ec2-user 46 Aug 10 13:39 .
drwxr-xr-x 5 ec2-user root     49 Aug 10 13:36 ..
-rw-rw-r-- 1 ec2-user ec2-user  0 Aug 10 13:39 Managers.csv
-rw-rw-r-- 1 ec2-user ec2-user  0 Aug 10 13:39 Schedule.csv
```

### Key Concepts Demonstrated

| Command | Description |
|---------|-------------|
| `mkdir` | Create directories |
| `touch` | Create empty files |
| `cd` | Change directory |
| `ls` | List directory contents |
| `pwd` | Print working directory |
| `cd ../` | Navigate to parent directory |
| Relative paths | `Management/file.csv` creates file in subdirectory |

---

## Task 3: Delete and Reorganize Folders

A few weeks later, the organization needs restructuring. The new folder structure will be:

```
/home/ec2-user/
└── CompanyA/
    └── HR/
        ├── Finance/
        │   ├── ProfitAndLossStatements.csv
        │   └── Salary.csv
        ├── Management/
        │   ├── Managers.csv
        │   └── Schedule.csv
        └── Employees/
            ├── Assessments.csv
            └── TrialPeriod.csv
```

### What You'll Do

1. Copy the Finance folder and its content to the HR folder
2. Remove the previous Finance folder from CompanyA
3. Move the Management folder inside the HR folder
4. Create an Employees folder inside HR
5. Move Assessments.csv and TrialPeriod.csv into the Employees folder

### Step-by-Step Instructions

#### Step 1: Verify Current Location

```bash
pwd
```

**Expected Output:**
```
/home/ec2-user/CompanyA
```

#### Step 2: Copy Finance Folder to HR

```bash
cp -r Finance HR
```

#### Step 3: Verify the Copy

```bash
ls HR/Finance
```

**Expected Output:**
```
ProfitAndLossStatements.csv  Salary.csv
```

#### Step 4: Remove the Original Finance Folder

>  **Note:** `rmdir` only works on empty directories.

**Option A - Remove files first, then directory:**
```bash
rm Finance/ProfitAndLossStatements.csv Finance/Salary.csv
ls Finance          # Verify folder is empty
rmdir Finance
```

**Option B - Use recursive delete (faster):**
```bash
rm -r Finance
```

#### Step 5: Verify Finance Was Removed

```bash
ls
```

**Expected Output:**
```
HR  Management
```

#### Step 6: Move Management into HR

```bash
mv Management HR
```

#### Step 7: Verify the Move

```bash
ls . HR/Management
```

**Expected Output:**
```
.:
HR

HR/Management:
Managers.csv  Schedule.csv
```

#### Step 8: Navigate to HR Directory

```bash
cd HR
```

#### Step 9: Create Employees Folder

```bash
mkdir Employees
```

#### Step 10: Move HR Files to Employees

```bash
mv Assessments.csv TrialPeriod.csv Employees
```

#### Step 11: Verify Final Structure

```bash
ls . Employees
```

**Expected Output:**
```
.:
Employees  Finance  Management

Employees/:
Assessments.csv  TrialPeriod.csv
```

---

## Command Reference

### Directory Operations

| Command | Description | Example |
|---------|-------------|---------|
| `mkdir <dir>` | Create a directory | `mkdir CompanyA` |
| `mkdir <dir1> <dir2>` | Create multiple directories | `mkdir Finance HR Management` |
| `rmdir <dir>` | Remove an **empty** directory | `rmdir Finance` |
| `rm -r <dir>` | Remove directory and contents recursively | `rm -r Finance` |
| `cp -r <src> <dest>` | Copy directory recursively | `cp -r Finance HR` |
| `mv <src> <dest>` | Move or rename directory/file | `mv Management HR` |

### File Operations

| Command | Description | Example |
|---------|-------------|---------|
| `touch <file>` | Create an empty file | `touch Salary.csv` |
| `touch <f1> <f2>` | Create multiple files | `touch Assessments.csv TrialPeriod.csv` |
| `rm <file>` | Remove a file | `rm Finance/Salary.csv` |
| `cp <src> <dest>` | Copy a file | `cp file.txt backup/` |
| `mv <src> <dest>` | Move or rename a file | `mv Assessments.csv Employees/` |

### Navigation & Listing

| Command | Description |
|---------|-------------|
| `pwd` | Print working directory (current location) |
| `cd <dir>` | Change to specified directory |
| `cd ..` | Go up one directory level |
| `cd ../<dir>` | Go up one level, then into specified directory |
| `ls` | List contents of current directory |
| `ls <dir>` | List contents of specified directory |
| `ls -laR` | List all files recursively with details |

### Path Types

| Type | Example | Description |
|------|---------|-------------|
| Absolute | `/home/ec2-user/CompanyA` | Full path from root |
| Relative | `Management/file.csv` | Relative to current directory |
| Parent relative | `../Management/file.csv` | Relative to parent directory |

---

## Troubleshooting

### Issue: `rmdir: failed to remove 'Finance/': Directory not empty`

**Cause:** The `rmdir` command only works on empty directories.

**Solution:**
```bash
# Option 1: Remove contents first
rm Finance/*
rmdir Finance

# Option 2: Use recursive remove
rm -r Finance
```

### Issue: Permission Denied

**Cause:** Insufficient permissions to modify files or directories.

**Solution:**
```bash
# Check permissions
ls -la

# If needed, adjust permissions (use with caution)
chmod 755 <directory>
chmod 644 <file>
```

### Issue: File or Directory Not Found

**Cause:** Typo in filename or wrong directory.

**Solution:**
```bash
# Verify current location
pwd

# List contents to verify names
ls -la

# Use tab completion to avoid typos
```

### Issue: SSH Connection Refused

**Cause:** Incorrect IP, security group settings, or key file permissions.

**Solution:**
```bash
# For .pem files, ensure correct permissions
chmod 400 labsuser.pem

# Verify you're using the correct Public IP
# Check security group allows SSH (port 22) from your IP
```

---

## Summary

Congratulations! You have successfully completed the Working with the File System lab. You learned how to:

1. **Connect** to a remote Linux EC2 instance via SSH
2. **Create** directories and files using `mkdir` and `touch`
3. **Navigate** the file system using `cd`, `pwd`, and `ls`
4. **Copy** directories and files using `cp` and `cp -r`
5. **Move** directories and files using `mv`
6. **Delete** files and directories using `rm` and `rmdir`
7. **Organize** files using relative and absolute paths

These fundamental skills form the foundation of Linux system administration and are essential for working in cloud environments.

---

## Additional Resources

- [AWS Documentation: Connect to Linux Instance](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)
- [Linux Command Line Basics](https://ubuntu.com/tutorials/command-line-for-beginners)
- [Linux File System Hierarchy](https://tldp.org/LDP/Linux-Filesystem-Hierarchy/html/index.html)

---

*Lab Version: 1.0*  
*Last Updated: 2026-05-23*
