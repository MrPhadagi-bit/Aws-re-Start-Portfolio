# Working with Commands

> **Note:** All labs rely on previous courseware and lab information.

---

## Overview

This lab provides hands-on experience with essential Linux command-line utilities commonly used in cloud environments. You will practice redirecting output, sorting data, extracting fields, and performing text transformations on an Amazon Linux EC2 instance.

---

## Objectives

In this lab, you will:

-  Use the `tee` command to direct output to a file
-  Use the `sort` command to reorganize the contents of a `.csv` file
-  Use the `cut` command to edit the contents of a file
-  Use the `sed` command for text substitution
-  Use the pipe operator (`|`) to chain commands

---

## Duration

 This lab requires approximately **30 minutes** to complete.

---

## Prerequisites

- Access to an AWS lab environment with an Amazon Linux EC2 instance
- SSH client (PuTTY for Windows or OpenSSH for macOS/Linux)
- EC2 instance credentials (`.pem` or `.ppk` key file)
- Public IP address of the EC2 instance

---

## AWS Service Restrictions

 **Important:** In this lab environment, access to AWS services and service actions might be restricted to the ones that you need to complete the lab instructions. You might encounter errors if you attempt to access other services or perform actions beyond the ones that this lab describes.

---

## Task 1: Use SSH to Connect to an Amazon Linux EC2 Instance

In this task, you will connect to an Amazon Linux EC2 instance using an SSH utility. The following instructions vary slightly depending on your operating system.

###  Windows Users: Using PuTTY to Connect

> These instructions are specifically for Windows users. If you are using macOS or Linux, skip to the [macOS/Linux section](#-macoslinux-users-using-openssh-to-connect).

#### Step 1: Retrieve Credentials

1. Select the **Details** drop-down menu above these instructions, then select **Show**.
2. A **Credentials** window will be presented.
3. Select the **Download PPK** button and save the `labsuser.ppk` file.
   - Typically, your browser will save it to the **Downloads** directory.
4. Make a note of the **PublicIP** address.
5. Exit the Details panel by selecting the **X**.

#### Step 2: Download PuTTY (if needed)

- Download [PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html) to SSH into the Amazon EC2 instance.
- If you do not have PuTTY installed, download and install it.

#### Step 3: Configure PuTTY Session

1. Open `putty.exe`
2. Configure your session following the official AWS documentation:  
    [Connect to your Linux instance using PuTTY](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/putty.html)

#### Step 4: Connect

- Click **Open** to initiate the SSH connection.
- When prompted, login as: `ec2-user`

---

###  macOS/Linux Users: Using OpenSSH to Connect

> These instructions are for macOS and Linux users.

#### Step 1: Retrieve Credentials

1. Select the **Details** drop-down menu, then select **Show**.
2. Download the **PEM** file (`labsuser.pem`).
3. Note the **PublicIP** address.
4. Close the Details panel.

#### Step 2: Set Permissions on Key File

```bash
chmod 400 ~/Downloads/labsuser.pem
```

#### Step 3: Connect via SSH

```bash
ssh -i ~/Downloads/labsuser.pem ec2-user@<PublicIP>
```

Replace `<PublicIP>` with the actual public IP address of your instance.

---

###  Verification

Once connected, your terminal prompt should look similar to:

```bash
[ec2-user@ip-10-0-10-81 ~]$
```

---

## Task 2: Use the tee Command

In this task, you use the `tee` command to display output to both the screen and a file simultaneously.

### What is `tee`?

The `tee` command reads from standard input and writes to both standard output (the screen) and one or more files. It's useful when you want to see output in real-time while also saving it for later.

### Instructions

#### Step 1: Verify Current Directory

```bash
pwd
```

**Expected Output:**
```
/home/ec2-user
```

#### Step 2: Use tee with hostname

```bash
hostname | tee file1.txt
```

**What happens:**
- `hostname` generates the instance's hostname as standard output
- The pipe (`|`) sends this output to `tee`
- `tee` displays the hostname on your screen **and** writes it to `file1.txt`

**Expected Output:**
```bash
[ec2-user@ ~]$ hostname | tee file1.txt
ip-10-0-10-81.us-west-2.compute.internal
```

>  **Note:** Your actual output will vary based on your instance's IP and region (format: `ip-(xx-xx-xx-xx).(region).compute.internal`).

#### Step 3: Verify File Creation

```bash
ls
```

**Expected Output:**
```bash
[ec2-user@ ~]$ ls
companyA  file1.txt
```

You should see `file1.txt` listed alongside any existing directories (like `companyA`).

#### Step 4: Verify File Contents

```bash
cat file1.txt
```

**Expected Output:**
```
ip-10-0-10-81.us-west-2.compute.internal
```

---

###  tee Command Reference

| Syntax | Description |
|--------|-------------|
| `command \| tee file.txt` | Output to screen and file |
| `command \| tee -a file.txt` | Append to file (don't overwrite) |
| `command \| tee file1 file2` | Output to multiple files |

---

## Task 3: Use the sort Command and Pipe Operator

In this task, you use the `sort` command to reorder a `.csv` file and the pipe operator to search for specific content.

### What is `sort`?

The `sort` command arranges lines of text files in alphabetical or numerical order. By default, it sorts alphabetically.

### What is the Pipe Operator (`|`)?

The pipe operator takes the standard output of one command and passes it as standard input to another command. It enables powerful command chaining.

---

### Part A: Create the test.csv File

#### Step 1: Verify Current Directory

```bash
pwd
```

**Expected Output:**
```
/home/ec2-user
```

#### Step 2: Create the CSV File

```bash
cat > test.csv
```

#### Step 3: Enter the Following Data

Type each line exactly as shown (including commas and spaces):

```
Factory, 1, Paris
Store, 2, Dubai
Factory, 3, Brasilia
Store, 4, Algiers
Factory, 5, Tokyo
```

#### Step 4: Save and Exit

Press **CTRL+D** to exit the file and save.

>  **Tip:** CTRL+D sends an EOF (End of File) signal, telling the system you're done inputting data.

#### Step 5: Verify File Creation

```bash
ls
```

You should see `test.csv` in the directory listing.

---

### Part B: Sort the CSV File

#### Step 1: Run sort Command

```bash
sort test.csv
```

**Expected Output:**
```bash
[ec2-user@ ~]$ sort test.csv
Factory, 1, Paris
Factory, 3, Brasilia
Factory, 5, Tokyo
Store, 2, Dubai
Store, 4, Algiers
```

**How it works:**
- Because no options were specified, `sort` uses default alphabetical sorting
- "Factory" comes before "Store" alphabetically
- Within each group, it sorts by the second column numerically (1, 3, 5 and 2, 4)

---

### Part C: Search Using Pipe and grep

#### Step 1: Search for "Paris"

```bash
grep Paris test.csv
```

**Expected Output:**
```bash
[ec2-user@ ~]$ grep Paris test.csv
Factory, 1, Paris
```

**How it works:**
- `grep` searches the file for lines containing the pattern "Paris"
- It returns only the matching line(s)

#### Alternative: Using Pipe with cat

```bash
cat test.csv | grep Paris
```

This achieves the same result by piping the output of `cat` into `grep`.

---

###  sort & grep Reference

| Command | Description |
|---------|-------------|
| `sort file.txt` | Sort alphabetically (default) |
| `sort -n file.txt` | Sort numerically |
| `sort -r file.txt` | Sort in reverse order |
| `sort -k 2 file.txt` | Sort by second field |
| `grep "pattern" file` | Search for pattern in file |
| `grep -i "pattern" file` | Case-insensitive search |
| `grep -n "pattern" file` | Show line numbers |

---

## Task 4: Use the cut Command

In this task, you use the `cut` command to extract specific sections from each line of a file.

### What is `cut`?

The `cut` command removes sections from each line of files. It's commonly used to extract specific fields or characters from delimited data.

---

### Part A: Create the cities.csv File

#### Step 1: Verify Current Directory

```bash
pwd
```

#### Step 2: Create the File

```bash
cat > cities.csv
```

#### Step 3: Enter the Following Data

```
Dallas, Texas
Seattle, Washington
Los Angeles, California
Atlanta, Georgia
New York, New York
```

#### Step 4: Save and Exit

Press **CTRL+D** to save and exit.

---

### Part B: Extract Fields with cut

#### Step 1: Extract the First Field

```bash
cut -d ',' -f 1 cities.csv
```

**Command Breakdown:**
| Option | Meaning |
|--------|---------|
| `-d ','` | Set delimiter to comma (`,`) |
| `-f 1` | Extract the first field |

**Expected Output:**
```bash
[ec2-user@ ~]$ cut -d ',' -f 1 cities.csv
Dallas
Seattle
Los Angeles
Atlanta
New York
```

**What happened:**
- The command removed everything after the first comma on each line
- Only the city names remain

---

### Part C: Extract the Second Field

```bash
cut -d ',' -f 2 cities.csv
```

**Expected Output:**
```
 Texas
 Washington
 California
 Georgia
 New York
```

>  **Note:** There may be a leading space since the original data had a space after the comma.

---

###  cut Command Reference

| Syntax | Description |
|--------|-------------|
| `cut -d ',' -f 1 file` | Extract first field (comma-delimited) |
| `cut -d ':' -f 1,3 file` | Extract fields 1 and 3 (colon-delimited) |
| `cut -c 1-5 file` | Extract characters 1 through 5 |
| `cut -c 1,3,5 file` | Extract characters 1, 3, and 5 |

---

## Additional Challenge: Use the sed Command

In this challenge, you use the `sed` command (stream editor) to perform text substitutions.

### What is `sed`?

`sed` is a powerful stream editor used to perform basic text transformations. It's commonly used for find-and-replace operations in files.

### Basic Syntax

```bash
sed 's/word being replaced/replacement word/' filename
```

- `s` = substitute
- `/` = delimiter
- First string = search pattern
- Second string = replacement text

---

### Challenge: Replace First Comma with Period

Replace the first comma (`,`) with a period (`.`) in both `cities.csv` and `test.csv`.

#### For cities.csv:

```bash
sed 's/,/./' cities.csv
```

**Expected Output:**
```
Dallas. Texas
Seattle. Washington
Los Angeles. California
Atlanta. Georgia
New York. New York
```

#### For test.csv:

```bash
sed 's/,/./' test.csv
```

**Expected Output:**
```
Factory. 1, Paris
Store. 2, Dubai
Factory. 3, Brasilia
Store. 4, Algiers
Factory. 5, Tokyo
```

>  **Note:** Only the **first** comma on each line is replaced because we didn't use the global (`g`) flag.

---

### Advanced: Replace All Commas with Periods

To replace **all** commas on each line, add the `g` (global) flag:

```bash
sed 's/,/./g' cities.csv
```

---

### One-Liner Challenge: Process Both Files

You can process both files in one line using command chaining:

```bash
echo "=== cities.csv ===" && sed 's/,/./' cities.csv && echo "" && echo "=== test.csv ===" && sed 's/,/./' test.csv
```

Or save the changes back to the files using the `-i` flag:

```bash
sed -i 's/,/./' cities.csv
sed -i 's/,/./' test.csv
```

> **Warning:** The `-i` flag modifies the file in-place. Use with caution!

---

###  sed Command Reference

| Syntax | Description |
|--------|-------------|
| `sed 's/old/new/' file` | Replace first occurrence per line |
| `sed 's/old/new/g' file` | Replace all occurrences per line |
| `sed -i 's/old/new/g' file` | Edit file in-place |
| `sed 's/old/new/2' file` | Replace second occurrence only |
| `sed 's/old/new/2g' file` | Replace from 2nd occurrence onward |
| `sed -n '2,5p' file` | Print only lines 2 through 5 |

---

## Summary

| Command | Purpose | Key Options |
|---------|---------|-------------|
| `tee` | Output to screen and file | `-a` (append) |
| `sort` | Sort lines of text | `-n` (numeric), `-r` (reverse), `-k` (key) |
| `cut` | Extract sections from lines | `-d` (delimiter), `-f` (field), `-c` (character) |
| `sed` | Stream editor for text transformation | `s/old/new/g` (substitute global) |
| `\|` (pipe) | Chain commands together | Connects stdout to stdin |
| `grep` | Search for patterns | `-i` (ignore case), `-n` (line numbers) |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Permission denied on SSH | Check key file permissions: `chmod 400 key.pem` |
| `tee` not found | Verify you're on Amazon Linux; `tee` is pre-installed |
| `cat` command hangs | Remember to press **CTRL+D** to send EOF |
| `sort` output looks wrong | Check for hidden characters; use `cat -A` to inspect |
| `cut` extracts wrong field | Verify delimiter matches exactly (check for spaces) |
| `sed` changes not saving | Use `-i` flag for in-place editing, or redirect output |
| File not found errors | Always verify with `pwd` and `ls` first |

---

##  Additional Resources

- [Linux tee Command Documentation](https://man7.org/linux/man-pages/man1/tee.1.html)
- [Linux sort Command Documentation](https://man7.org/linux/man-pages/man1/sort.1.html)
- [Linux cut Command Documentation](https://man7.org/linux/man-pages/man1/cut.1.html)
- [Linux sed Command Documentation](https://man7.org/linux/man-pages/man1/sed.1.html)
- [AWS Documentation: Connect to Linux Instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)

---

##  Conclusion

You have successfully completed the **Working with Commands** lab! You now have practical experience with:

- Redirecting and duplicating output with `tee`
- Organizing data with `sort`
- Extracting specific data with `cut`
- Transforming text with `sed`
- Chaining commands with the pipe operator

These fundamental Linux commands are essential tools for any cloud practitioner or system administrator working with AWS and Linux environments.

---

> **Lab Version:** 1.0  
> **Last Updated:** 2026-05-25  
> **Author:** AWS Training & Certification
