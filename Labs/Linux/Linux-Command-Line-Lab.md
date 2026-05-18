# Linux Command Line Lab - AWS Academy

> A hands-on lab guide covering essential Linux command-line skills on an Amazon Linux EC2 instance through SSH.

---

## Overview

This lab introduces foundational Linux command-line skills in a cloud environment.

In this lab, I practiced how to:

- Connect to an Amazon Linux EC2 instance using SSH.
- Run basic system information commands.
- Use bash history features to improve command-line workflow.
- Check command output and understand what each command is used for.

---

## Prerequisites

- Access to the AWS Academy lab environment.
- A running Amazon Linux EC2 instance.
- A terminal application:
  - Windows: [PuTTY](https://www.putty.org/)
  - macOS or Linux: built-in terminal

---

## Task 1 - Connect Through SSH

### Windows Users - PuTTY

1. Select the **Details** drop-down menu above the lab instructions.
2. Choose **Show** to open the credentials window.
3. Choose **Download PPK** and save the `labsuser.ppk` file.
4. Make a note of the **PublicIP** address.
5. Close the Details panel.
6. Download and open [PuTTY](https://www.putty.org/) if it is not already installed.
7. Configure the PuTTY session using the downloaded private key and the EC2 instance public IP address.

Reference guide:

- [Connect to your Linux instance using PuTTY](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/putty.html)

### macOS and Linux Users

Use the terminal with the standard SSH command:

```bash
ssh -i /path/to/labsuser.pem ec2-user@<PublicIP>
```

Replace `/path/to/labsuser.pem` with the location of the private key file and `<PublicIP>` with the public IP address from the lab details.

---

## Task 2 - Run Familiar Commands

In this task, I used Linux commands to gather basic system and session information.

### 2.1 - Identify the Current User

```bash
whoami
```

This command displays the current username, such as `ec2-user`.

Tip: Start typing `whoa` and press `Tab` to use shell auto-completion.

---

### 2.2 - Get the Hostname

```bash
hostname -s
```

This command displays the shortened hostname of the Linux instance, such as `ip-10-x-x-x`.

---

### 2.3 - Check System Uptime

```bash
uptime -p
```

This command shows how long the system has been running in a human-readable format.

Example output:

```text
up 3 hours, 22 minutes
```

---

### 2.4 - View Logged-In Users

```bash
who -H -a
```

This command lists logged-in users and session details.

| Field | Description |
|---|---|
| Name | Username of the logged-in user. |
| Line | Terminal or connection line. |
| Time | Time the session started. |
| Idle | Idle time for the session. |
| PID | Process identifier. |
| Comment | Additional session information. |
| Exit | Exit time, if applicable. |

---

### 2.5 - Check Date and Time by Time Zone

```bash
TZ=America/New_York date
TZ=America/Los_Angeles date
```

These commands display the current date and time for the specified time zones.

Note: If the system time is not configured correctly, the output may be inaccurate.

---

### 2.6 - View the Julian Calendar

```bash
cal -j
```

This command displays the current month using Julian dates, where each day is numbered consecutively across the year.

Alternate calendar views:

```bash
cal -s
cal -m
```

| Command | Description |
|---|---|
| `cal -s` | Show the calendar with Sunday as the first day of the week. |
| `cal -m` | Show the calendar with Monday as the first day of the week. |

For more options, use:

```bash
man cal
```

---

### 2.7 - View User ID and Group Information

```bash
id ec2-user
```

This command displays the user ID, group ID, and group memberships for the `ec2-user` account.

---

## Task 3 - Improve Workflow Through History and Search

In this task, I used bash history features to reduce repetitive typing and work more efficiently in the terminal.

### 3.1 - View Command History

```bash
history
```

This command displays a numbered list of commands previously entered in the current shell session.

---

### 3.2 - Use Reverse History Search

Press `Ctrl + R` to open reverse history search.

Example:

```text
(reverse-i-search)`TZ': TZ=America/Los_Angeles date
```

Steps:

1. Press `Ctrl + R`.
2. Type part of a previous command, such as `TZ`.
3. Press `Tab` to load a matching command into the prompt for editing.
4. Use the arrow keys to edit the command before running it.

Note: Press `Tab` to load the command for editing. Pressing `Enter` runs the selected command immediately.

---

### 3.3 - Re-run the Last Command

```bash
date
!!
```

The `!!` shortcut repeats the most recent command. This is useful when quickly repeating an action or re-running a command with changes.

---

## Command Reference

| Command | Description |
|---|---|
| `whoami` | Display the current logged-in username. |
| `hostname -s` | Display the short hostname of the machine. |
| `uptime -p` | Show system uptime in a readable format. |
| `who -H -a` | List logged-in users with extended details. |
| `TZ=<Zone> date` | Display the date and time in a specific time zone. |
| `cal -j` | Show the current month with Julian dates. |
| `cal -s` | Show the calendar with Sunday as the first day of the week. |
| `cal -m` | Show the calendar with Monday as the first day of the week. |
| `id <username>` | Display user ID, group ID, and group memberships. |
| `history` | List previously entered commands. |
| `Ctrl + R` | Open reverse history search. |
| `!!` | Re-run the most recently entered command. |

---

## Key Concepts Learned

| Concept | Description |
|---|---|
| SSH | Secure method for connecting to a remote Linux instance. |
| Amazon Linux | Linux distribution commonly used with Amazon EC2. |
| Shell Commands | Instructions entered in the terminal to interact with the operating system. |
| Command History | Bash feature that stores previously used commands. |
| Reverse Search | Fast way to search command history from the terminal. |
| Manual Pages | Built-in command documentation accessed with `man`. |

---

## Reflection

This lab helped me become more comfortable with basic Linux commands and terminal workflow. I practiced connecting to an Amazon Linux EC2 instance, checking system information, viewing logged-in users, working with time zones, using calendar commands, and using bash history shortcuts.

These skills are important for cloud support and infrastructure work because many AWS systems are managed through Linux terminals and SSH sessions.

---

*Lab documentation by Raven Mannda Phadagi as part of the AWS re/Start Programme.*
