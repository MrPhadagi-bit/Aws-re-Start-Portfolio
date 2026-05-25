# Managing Processes

> **Note**: All labs rely on previous courseware and lab information.

---

##  Lab Overview

| Attribute | Details |
|-----------|---------|
| **Duration** | Approximately 45 minutes |
| **Environment** | Amazon Linux EC2 Instance |
| **Prerequisites** | Previous courseware and lab information |

---

##  Objectives

In this lab, you will:

1. **Create a new log file** for process listings using `ps` command
2. **Use the `top` command** to monitor system processes and threads
3. **Establish a cron job** that runs auditing commands repetitively

---

##  AWS Service Restrictions

In this lab environment, access to AWS services and service actions might be restricted to the ones needed to complete the lab instructions. You might encounter errors if you attempt to access other services or perform actions beyond those described in this lab.

---

##  Task 1: Use SSH to Connect to an Amazon Linux EC2 Instance

In this task, you will connect to an Amazon Linux EC2 instance using an SSH utility. Instructions vary slightly depending on your operating system.

### Windows Users: Using SSH to Connect

> **Note**: If you are using macOS or Linux, skip to the next section.

1. **Retrieve Credentials**:
   - Select the **Details** drop-down menu above these instructions
   - Select **Show**
   - A **Credentials** window will be presented

2. **Download Key File**:
   - Select the **Download PPK** button
   - Save the `labsuser.ppk` file (typically saved to the `Downloads` directory)

3. **Note the Public IP**:
   - Make a note of the **PublicIP** address displayed

4. **Close Details Panel**:
   - Exit the Details panel by selecting the **X**

5. **Install PuTTY** (if needed):
   - Download [PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html) to SSH into the Amazon EC2 instance
   - Open `putty.exe`

6. **Configure PuTTY Session**:
   - Follow the directions in the AWS documentation: [Connect to your Linux instance using PuTTY](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/putty.html)

> **Windows Users**: [Click here to skip ahead to Task 2](#task-2-create-list-of-processes)

### macOS / Linux Users: Using SSH to Connect

1. **Retrieve Credentials**:
   - Select the **Details** drop-down menu above these instructions
   - Select **Show**
   - A **Credentials** window will be presented

2. **Download Key File**:
   - Select the **Download PEM** button
   - Save the `labsuser.pem` file

3. **Set Permissions** (Linux/macOS only):
   ```bash
   chmod 400 labsuser.pem
   ```

4. **Connect via SSH**:
   ```bash
   ssh -i labsuser.pem ec2-user@<PublicIP>
   ```

---

##  Task 2: Create List of Processes

In this exercise, you will create a log file from the `ps` command. This log file should be added to the **SharedFolders** section.

### Objective

Create a log file named `processes.csv` from `ps -aux` and omit any processes that:
- Contain the **root** user
- Contain `[` or `]` in the **COMMAND** section

### Steps

1. **Verify Current Directory**:
   ```bash
   pwd
   ```
   > Expected output: `/home/ec2-user/companyA`

   If you are not in this folder, navigate to it:
   ```bash
   cd companyA
   ```

2. **Create the Process Log File**:
   ```bash
   sudo ps -aux | grep -v root | sudo tee SharedFolders/processes.csv
   ```
   > **Note**: There is a space following the command followed by a period to represent the current location.

   This command will:
   - List all processes with detailed information (`ps -aux`)
   - Filter out processes owned by root (`grep -v root`)
   - Save the output to `SharedFolders/processes.csv` (`tee`)

3. **Validate Your Work**:
   ```bash
   cat SharedFolders/processes.csv
   ```

### Expected Output

The console displays output from the `ps -aux` command showing all current processes running on your machine, excluding root-owned processes. This is validated by using the command `cat SharedFolders/processes.csv`.

---

##  Task 3: List the Processes Using the `top` Command

In this exercise, you will use the `top` command to display processes and threads that are active in the system.

### Steps

1. **Run the `top` Command**:
   ```bash
   top
   ```

2. **Observe the Output**:

   The `top` command displays system performance and lists the processes and threads active in the system. The output provides:

   | Metric | Description |
   |--------|-------------|
   | **Tasks** | Total number of tasks |
   | **Running** | Number of currently running tasks |
   | **Sleeping** | Number of sleeping tasks |
   | **Stopped** | Number of stopped tasks |
   | **Zombie** | Number of zombie processes |
   | **CPU Usage** | Percentage of CPU used |
   | **KiB Memory** | Memory usage in KiB |
   | **KiB Swap** | Swap usage in KiB |

3. **Analyze Task States**:

   While observing the output of `top`, look at the second line below the command. Tasks in `top` can have the following states:
   - **Running**
   - **Sleep**
   - **Stopped**
   - **Zombie**

   > **Question**: How many running tasks do you see?

   Example output:
   ```
   Tasks: 93 total, 1 running, 48 sleeping, 0 stopped, 0 zombie
   ```

4. **Quit `top`**:
   - Press `q` and then **Enter**

### Additional Options

You can also run `top` with the following options to find usage and version information:

```bash
top -hv
```

---

##  Task 4: Create a Cron Job

In this exercise, you will create a cron job that will create an audit file with `#####` to cover all `.csv` files.

> **Note**: You may have to use `sudo` to complete this exercise if you are not root.

### Understanding Cron

- **Cron** is a command that runs a task on a regular basis at a specified time
- This command maintains the list of tasks to run in a **crontab file**
- The crontab file includes **six fields**:
  1. Minutes
  2. Hour
  3. Day of Month (DOM)
  4. Month (MON)
  5. Day of Week (DOW)
  6. Command (CMD)

> These fields can also be denoted with asterisks (`*`) for "any value".

### Steps

1. **Verify Current Directory**:
   ```bash
   pwd
   ```
   > Expected output: `/home/ec2-user/companyA`

2. **Open Crontab Editor**:
   ```bash
   sudo crontab -e
   ```
   This will open the default text editor (typically `vi` or `nano`).

3. **Enter Insert Mode**:
   - Press `i` to enter insert mode

4. **Add the Following Lines**:

   ```bash
   SHELL=/bin/bash
   PATH=/usr/bin:/bin:/usr/local/bin
   MAILTO=root
   0 * * * * ls -la $(find .) | sed -e 's/..csv/#####.csv/g' > /home/ec2-user/companyA/SharedFolders/filteredAudit.csv
   ```

   ### Line-by-Line Explanation

   | Line | Purpose |
   |------|---------|
   | `SHELL=/bin/bash` | Specifies the shell to use for executing commands |
   | `PATH=/usr/bin:/bin:/usr/local/bin` | Sets the PATH environment variable |
   | `MAILTO=root` | Sends any output or errors to the root user |
   | `0 * * * * ...` | Runs the command every hour at minute 0 |

   ### Cron Schedule Breakdown

   ```
   0 * * * *
   │ │ │ │ │
   │ │ │ │ └─── Day of Week (0-7, Sunday = 0 or 7)
   │ │ │ └───── Month (1-12)
   │ │ └─────── Day of Month (1-31)
   │ └───────── Hour (0-23)
   └─────────── Minute (0-59)
   ```

   - `0` = At minute 0
   - `*` = Every hour
   - `*` = Every day of month
   - `*` = Every month
   - `*` = Every day of week

   ### Command Explanation

   ```bash
   ls -la $(find .) | sed -e 's/..csv/#####.csv/g' > /home/ec2-user/companyA/SharedFolders/filteredAudit.csv
   ```

   - `find .` → Finds all files in current directory and subdirectories
   - `ls -la $(find .)` → Lists all found files in long format
   - `sed -e 's/..csv/#####.csv/g'` → Replaces any two characters followed by `.csv` with `#####.csv`
   - `> /home/ec2-user/companyA/SharedFolders/filteredAudit.csv` → Redirects output to the audit file

5. **Save and Close**:
   - Press **ESC** to exit insert mode
   - Type `:wq` and press **Enter**

6. **Validate Your Work**:
   ```bash
   sudo crontab -l
   ```

   Inspect the crontab file to ensure that it matches the text exactly.

### Expected Output

The output of `sudo crontab -l` should display:

```bash
SHELL=/bin/bash
PATH=/usr/bin:/bin:/usr/local/bin
MAILTO=root
0 * * * * ls -la $(find .) | sed -e 's/..csv/#####.csv/g' > /home/ec2-user/companyA/SharedFolders/filteredAudit.csv
```

---

##  Validation Checklist

| Task | Validation Command | Expected Result |
|------|---------------------|-----------------|
| Task 2 | `cat SharedFolders/processes.csv` | CSV file with non-root processes |
| Task 3 | `top` then `q` | Interactive process viewer |
| Task 4 | `sudo crontab -l` | Cron job entries displayed |

---

##  Additional Resources

- [AWS EC2 User Guide - Connect using PuTTY](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/putty.html)
- [Linux `ps` Command Documentation](https://man7.org/linux/man-pages/man1/ps.1.html)
- [Linux `top` Command Documentation](https://man7.org/linux/man-pages/man1/top.1.html)
- [Cron How-To](https://help.ubuntu.com/community/CronHowto)

---

##  Troubleshooting

### Permission Denied Errors
- Use `sudo` before commands that require elevated privileges
- Ensure your user is in the appropriate groups

### Crontab Editor Issues
- If `crontab -e` opens an unfamiliar editor, set your preferred editor:
  ```bash
  export EDITOR=nano  # or vim, vi, etc.
  sudo crontab -e
  ```

### SSH Connection Issues
- Verify the security group allows SSH (port 22) from your IP
- Ensure the key file permissions are correct (`chmod 400 labsuser.pem`)
- Verify you are using the correct username (`ec2-user` for Amazon Linux)

---

##  License

This lab material is provided for educational purposes.

---

> **Lab Version**: 1.0  
> **Last Updated**: 2024  
> **Maintainer**: Course Instructor
