# Linux Labs

![image](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRN8IEo4qwj4IR9jtohM_DuLHegH-mv0J3320tNvvcRHQ&s=10)

## About This Folder

This folder contains my Linux labs and notes completed as part of the AWS re/Start programme. The labs focus on building practical command-line confidence on Amazon Linux EC2 instances.

The work in this section covers connecting to Linux servers, navigating the file system, managing users and permissions, editing files, working with processes and services, reading logs, managing software, and writing basic Bash scripts.

## Lab Index

| Lab | Focus Area |
|---|---|
| [Introduction to Amazon Linux AMI](./Amazon-Linux-AMI.md) | Connecting to Amazon Linux and using built-in documentation |
| [Linux Command Line Lab](./Linux-Command-Line-Lab.md) | Basic terminal commands, SSH workflow, and command history |
| [Working with Commands](./Working_with_Commands.md) | `tee`, `sort`, `cut`, `sed`, and text-processing commands |
| [Working with the File System](./Working%20with%20the%20File%20System.md) | Creating, copying, moving, organizing, and deleting files and folders |
| [Working with Files - Linux Backup Lab](./working_with_files_lab.md) | Creating backups with `tar` and moving backup files |
| [Linux Editing Files Lab](./Linux-Editing-Files-Lab.md) | Editing files with Vim and nano |
| [Linux Users and Groups Lab](./Linux-Users-and-Groups-Lab.md) | Creating users, groups, memberships, and reviewing account access |
| [Linux Managing File Permissions](./Linux%20Managing%20File%20Permissions.md) | Managing ownership, file permissions, and access control |
| [The Bash Shell](./The_Bash_Shell.md) | Aliases, environment variables, and the `PATH` variable |
| [Bash Shell Scripts](./Bash%20Shell%20Scripts.md) | Writing Bash scripts to automate backups |
| [Challenge Lab: Bash Shell Scripting Exercise](./Challenge%20Lab%20Bash%20Shell%20Scripting%20Exercise.md) | Creating a Bash script that dynamically generates files |
| [Managing Processes](./Managing%20Processes.md) | Viewing, monitoring, stopping, and managing Linux processes |
| [Managing Services - Monitoring](./Managing_Services_Monitoring.md) | Checking services with `systemctl`, using `top`, and monitoring with CloudWatch |
| [Managing Log Files](./managing-log-files-lab.md) | Reading Linux security logs and reviewing login activity |
| [Software Management Lab](./software-management-lab.md) | Updating packages, using `yum`, rolling back changes, and installing AWS CLI |

## Skills Practised

- Connecting to Amazon Linux EC2 instances with SSH
- Navigating directories and working with files from the command line
- Using Linux help tools such as `man`
- Redirecting and processing command output
- Editing files with Vim and nano
- Creating and managing users and groups
- Applying Linux file permissions and ownership rules
- Monitoring processes, services, and system activity
- Reviewing Linux log files for troubleshooting and security awareness
- Installing and managing software packages
- Writing Bash scripts for automation

## Tools and Commands Covered

| Category | Examples |
|---|---|
| Navigation | `pwd`, `ls`, `cd`, `tree` |
| File management | `touch`, `cp`, `mv`, `rm`, `mkdir`, `tar` |
| Text processing | `cat`, `less`, `grep`, `sort`, `cut`, `sed`, `tee` |
| Editing | `vim`, `nano` |
| Users and groups | `useradd`, `passwd`, `groupadd`, `usermod`, `id`, `su`, `sudo` |
| Permissions | `chmod`, `chown`, `ls -l` |
| Processes and services | `ps`, `top`, `kill`, `systemctl` |
| Logs | `/var/log/secure`, `lastlog` |
| Software | `yum`, `dnf`, AWS CLI |
| Bash | aliases, variables, scripts, loops |

## Suggested Learning Path

1. Start with [Introduction to Amazon Linux AMI](./Amazon-Linux-AMI.md).
2. Practise basic commands with [Linux Command Line Lab](./Linux-Command-Line-Lab.md).
3. Work through file system, file editing, and command-processing labs.
4. Move into users, groups, permissions, processes, services, and logs.
5. Finish with Bash scripting and software management labs.

## Why This Section Matters

Linux is a core skill for cloud, infrastructure, DevOps, and technical support roles. These labs helped me practise the daily tasks used when working with cloud servers, troubleshooting systems, and managing services in AWS environments.
