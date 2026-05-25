# The Bash Shell

> **Note:** All labs rely on previous courseware and lab information.

---

## 📋 Objectives

In this lab, you will:

- Create and work with an alias to backup a complete folder
- Work with the `PATH` variable and add a new folder to it

---

## ⏱️ Duration

This lab requires approximately **30 minutes** to complete.

---

## Table of Contents

- [Task 1: Use SSH to Connect to an Amazon Linux EC2 Instance](#task-1-use-ssh-to-connect-to-an-amazon-linux-ec2-instance)
- [Task 2: Create an Alias for a Backup Operation](#task-2-create-an-alias-for-a-backup-operation)
- [Task 3: Explore and Update the PATH Environment Variable](#task-3-explore-and-update-the-path-environment-variable)

---

## Task 1: Use SSH to Connect to an Amazon Linux EC2 Instance

In this task, you will connect to an Amazon Linux EC2 instance using an SSH utility. The following instructions vary slightly depending on whether you are using **Windows** or **Mac/Linux**.

### Windows Users: Using SSH to Connect

> These instructions are specifically for Windows users. If you are using macOS or Linux, skip to the next section.

1. Select the **Details** drop-down menu above these instructions, and then select **Show**. A **Credentials** window will be presented.

2. Select the **Download PPK** button and save the `labsuser.ppk` file.  
   Typically your browser will save it to the **Downloads** directory.

3. Make a note of the **PublicIP** address.

4. Exit the Details panel by selecting the **X**.

5. Download **PuTTY** to SSH into the Amazon EC2 instance. If you do not have PuTTY installed, download it from the official site.

6. Open `putty.exe`

7. Configure your PuTTY session by following the directions in the official AWS documentation: [Connect to your Linux instance using PuTTY](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/putty.html)

> **Windows Users:** You may skip ahead to the next task once connected.

---

## Task 2: Create an Alias for a Backup Operation

In this task, you will create an alias that gives you the ability to back up whatever path you provide it.

> **Helpful Hint:** You may have to use `sudo` to complete this task if you are not root.

### Step 2.1: Verify Your Current Directory

To validate that you are in the home folder, run:

```bash
pwd
```

**Expected output:**

```
[ec2-user@ ~]$ pwd
/home/ec2-user/
```

### Step 2.2: Create the `backup` Alias

Create an alias called `backup` that uses `tar` to back up the second parameter provided into the first parameter.

> **Usage example:** `backup "fileToSaveTo.tar.gz" "pathToBackUp"`

Run the following command:

```bash
alias backup='tar -cvzf '
```

#### Understanding the `tar` Options

| Option | Description |
|--------|-------------|
| `-f` | Archives the files (`tar` can also archive devices) |
| `-v` | Verbose option — displays what is put into the archive |
| `-z` | Compresses the archive into the `.gzip` format |

> **Note:** `tar -cf` would work but would not display the contents or compress the archive.

### Step 2.3: Use the Alias to Back Up the `CompanyA` Folder

To back up the `CompanyA` directory, run:

```bash
backup backup_companyA.tar.gz CompanyA
```

**Expected output:**

```
[ec2-user@ ~]$ backup backup_companyA.tar.gz CompanyA
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
CompanyA/bin/hello.sh
```

> **Figure:** The command `backup backup_companyA.tar.gz CompanyA` shows the entire directory of CompanyA. The contents include folders such as `Management`, `Employees`, `Finance`, `HR`, `IA`, `SharedFolders`, and `bin`. Files include: `Sections.csv`, `Promotions.csv`, `Schedules.csv`, `Salary.csv`, `Managers.csv`, `Assessments.csv`, and `hello.sh`.

### Step 2.4: Verify the Archive Was Created

To confirm the archive exists, run:

```bash
ls
```

**Expected output:**

```
[ec2-user@ ~]$ ls
backup_companyA.tar.gz  CompanyA
```

---

## Task 3: Explore and Update the PATH Environment Variable

In this task, you will display the `PATH` environment variable, then update it to add a new directory for executables.

### Step 3.1: Navigate to the `bin` Folder

Navigate to the `bin` folder inside the `CompanyA` directory:

```bash
cd /home/ec2-user/CompanyA/bin
```

> **Tip:** You can also use `pwd` to verify you are in `/home/ec2-user`, then use `cd CompanyA/bin` to enter the folder.

### Step 3.2: Run the `hello.sh` Script (Method 1)

Run the script from the current directory:

```bash
./hello.sh
```

**Expected output:**

```
[ec2-user@ bin]$ ./hello.sh
hello ec2-user
```

### Step 3.3: Navigate to the Parent Folder

Move up one directory level:

```bash
cd ..
```

**Expected output:**

```
[ec2-user@ bin]$ cd ..
[ec2-user@ CompanyA]$
```

### Step 3.4: Run the `hello.sh` Script (Method 2)

Run the script using a relative path:

```bash
./bin/hello.sh
```

**Expected output:**

```
[ec2-user@ CompanyA]$ ./bin/hello.sh
hello ec2-user
```

### Step 3.5: Run the `hello.sh` Script (Method 3 — Fails)

Attempt to run the script without a path:

```bash
hello.sh
```

**Expected output:**

```
[ec2-user@ CompanyA]$ hello.sh
bash: hello.sh: command not found
```

> **Analysis:** The third attempt failed because the system could not find `hello.sh` in any directory listed in the `PATH` variable. In the next step, you will fix this.

### Step 3.6: Display the Current `PATH` Variable

To see the current value of `PATH`, run:

```bash
echo $PATH
```

**Expected output:**

```
[ec2-user@ CompanyA]$ echo $PATH
/usr/local/bin:/usr/bin:/usr/local/sbin:/usr/sbin:/home/ec2-user/.local/bin:/home/ec2-user/bin
```

#### Understanding `PATH`

> The `PATH` variable is a list of folders where the system looks for executables and libraries. If you enter a command such as `hello.sh`, Linux will look for the script in the current folder and then in all the folders contained in the `PATH` variable.
>
> Notice that `/home/ec2-user/CompanyA/bin` is **not** listed. This is why the third run failed.
>
> **Current workarounds:**
> 1. Navigate to `/home/ec2-user/CompanyA/bin` and run `hello.sh`
> 2. Enter `/home/ec2-user/CompanyA/bin/hello.sh` from any folder

### Step 3.7: Add `CompanyA/bin` to `PATH`

To add the `/home/ec2-user/CompanyA/bin` folder to the `PATH` variable, run:

```bash
PATH=$PATH:/home/ec2-user/CompanyA/bin
```

**Expected output:** *(no output — command executes silently)*

```
[ec2-user@ CompanyA]$ PATH=$PATH:/home/ec2-user/CompanyA/bin
```

### Step 3.8: Verify the Fix

Try running `hello.sh` again without a path:

```bash
hello.sh
```

**Expected output:**

```
[ec2-user@ CompanyA]$ hello.sh
hello ec2-user
```

> **Success!** The script now runs from anywhere because `/home/ec2-user/CompanyA/bin` is now included in the `PATH`.

---

## 📝 Summary

| Task | What You Learned |
|------|------------------|
| **Task 1** | How to connect to an Amazon Linux EC2 instance via SSH using PuTTY (Windows) |
| **Task 2** | How to create a `backup` alias using `tar -cvzf` to compress and archive directories |
| **Task 3** | How `PATH` works, why commands fail when not in `PATH`, and how to append directories to it |

---

## 🔗 Additional Resources

- [AWS Docs: Connect to your Linux instance using PuTTY](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/putty.html)
- [Linux `tar` Command Manual](https://man7.org/linux/man-pages/man1/tar.1.html)
- [Linux `alias` Command](https://man7.org/linux/man-pages/man1/alias.1p.html)
- [Understanding the PATH Environment Variable](https://www.linuxfoundation.org/blog/blog/classic-sysadmin-understanding-the-linux-path-variable)

---

*Lab duration: ~30 minutes*  
*Last updated: May 2026*
