# Linux Users and Groups Lab - AWS Academy

> **Lab:** 229-[LX]-Lab - Linux Users and Groups  
> **Platform:** Amazon Linux EC2 instance  
> **Focus:** User accounts, groups, permissions, sudo access, and security logging

---

## Overview

This lab introduces Linux user and group management on an Amazon Linux EC2 instance.

In this lab, I practiced how to:

- Connect to an Amazon Linux EC2 instance using SSH.
- Create Linux user accounts.
- Create Linux groups for different departments.
- Add users to one or more groups.
- Test user login behavior and permissions.
- Review failed sudo attempts in the Linux security log.

---

## Task 1 - SSH Connection

Connect to an Amazon Linux EC2 instance using SSH.

### For Windows Users

1. Navigate to the **Details** dropdown menu and select **Show** to view credentials.
2. Click the **Download PPK** button and save the `labsuser.ppk` file.
3. Note the **PublicIP** address.
4. Close the Details panel.
5. [Download PuTTY](https://the.earth.li/~sgtatham/putty/latest/w64/putty.exe) if it is not already installed.
6. Open `putty.exe`.
7. Configure your PuTTY session by following the [AWS EC2 PuTTY connection guide](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/connect-linux-inst-from-windows.html).

### For macOS/Linux Users

Use SSH directly from your terminal:

```bash
ssh -i labsuser.pem ec2-user@<PublicIP>
```

Replace `<PublicIP>` with your instance's public IP address.

---

## Task 2 - Create Users

Create 10 users for the organization using the provided user table. This teaches you how to manage user accounts in Linux.

### User Credentials Table

| First Name | Last Name | User ID | Job Role | Starting Password |
|---|---|---|---|---|
| Alejandro | Rosalez | arosalez | Sales Manager | P@ssword1234! |
| Efua | Owusu | eowusu | Shipping | P@ssword1234! |
| Jane | Doe | jdoe | Shipping | P@ssword1234! |
| Li | Juan | ljuan | HR Manager | P@ssword1234! |
| Mary | Major | mmajor | Finance Manager | P@ssword1234! |
| Mateo | Jackson | mjackson | CEO | P@ssword1234! |
| Nikki | Wolf | nwolf | Sales Representative | P@ssword1234! |
| Paulo | Santos | psantos | Shipping | P@ssword1234! |
| Sofia | Martinez | smartinez | HR Specialist | P@ssword1234! |
| Saanvi | Sarkar | ssarkar | Finance Specialist | P@ssword1234! |

### Steps to Create Users

#### 1. Verify Your Location

```bash
pwd
```

Expected output:
```
/home/ec2-user
```

#### 2. Create the First User

```bash
sudo useradd arosalez
```

#### 3. Set the User Password

```bash
sudo passwd arosalez
```

When prompted, enter the password twice:
```
P@ssword1234!
```

> **Note:** When entering the password, nothing will appear on the screen. Type carefully and press Enter.

#### 4. Validate User Creation

```bash
sudo cat /etc/passwd | cut -d: -f1
```

You should see `arosalez` in the list.

#### 5. Create Remaining Users

Repeat steps 2-3 for each remaining user from the table:

```bash
sudo useradd eowusu
sudo passwd eowusu

sudo useradd jdoe
sudo passwd jdoe

sudo useradd ljuan
sudo passwd ljuan

sudo useradd mmajor
sudo passwd mmajor

sudo useradd mjackson
sudo passwd mjackson

sudo useradd nwolf
sudo passwd nwolf

sudo useradd psantos
sudo passwd psantos

sudo useradd smartinez
sudo passwd smartinez

sudo useradd ssarkar
sudo passwd ssarkar
```

#### 6. Verify All Users Are Created

```bash
sudo cat /etc/passwd | cut -d: -f1
```

Expected output should include all user IDs:
```
........
ec2-user
arosalez
eowusu
jdoe
ljuan
mjackson
mmajor
nwolf
psantos
smartinez
ssarkar
```

---

## Task 3 - Create Groups

Organize users into groups based on their departments and roles.

### Groups to Create

- **Sales** - Sales team members
- **HR** - Human Resources team
- **Finance** - Finance department
- **Shipping** - Shipping/Logistics team
- **Managers** - Management personnel
- **CEO** - Executive leadership
- **Personnel** - All employees

### Steps to Create Groups

#### 1. Verify Your Location

```bash
pwd
```

#### 2. Create the Sales Group

```bash
sudo groupadd Sales
```

#### 3. Verify Group Creation

```bash
cat /etc/group
```

You should see:
```
Sales:x:1014
```

#### 4. Create Remaining Groups

```bash
sudo groupadd HR
sudo groupadd Finance
sudo groupadd Shipping
sudo groupadd Managers
sudo groupadd CEO
sudo groupadd Personnel
```

#### 5. Verify All Groups Are Created

```bash
cat /etc/group
```

Expected output:
```
Sales:x:1014
HR:x:1015
Finance:x:1016
Shipping:x:1017
Managers:x:1018
CEO:x:1019
Personnel:x:1020
```

### Assign Users to Groups

**User-to-Group Assignment Table**

| Group Name | User IDs | Group Name | User IDs | Group Name | User IDs |
|---|---|---|---|---|---|
| Sales | arosalez, nwolf | HR | ljuan, smartinez | Finance | mmajor, ssarkar |
| Shipping | eowusu, jdoe, psantos | Managers | arosalez, ljuan, mmajor | CEO | mjackson |

**Steps to Assign Users**

Use the following command format to add each user to their group:

```bash
sudo usermod -a -G <Group Name> <User ID>
```

#### Sales Group
```bash
sudo usermod -a -G Sales arosalez
sudo usermod -a -G Sales nwolf
```

#### HR Group
```bash
sudo usermod -a -G HR ljuan
sudo usermod -a -G HR smartinez
```

#### Finance Group
```bash
sudo usermod -a -G Finance mmajor
sudo usermod -a -G Finance ssarkar
```

#### Shipping Group
```bash
sudo usermod -a -G Shipping eowusu
sudo usermod -a -G Shipping jdoe
sudo usermod -a -G Shipping psantos
```

#### Managers Group
```bash
sudo usermod -a -G Managers arosalez
sudo usermod -a -G Managers ljuan
sudo usermod -a -G Managers mmajor
```

#### CEO Group
```bash
sudo usermod -a -G CEO mjackson
```

#### Personnel Group

```bash
sudo usermod -a -G Personnel arosalez
sudo usermod -a -G Personnel eowusu
sudo usermod -a -G Personnel jdoe
sudo usermod -a -G Personnel ljuan
sudo usermod -a -G Personnel mmajor
sudo usermod -a -G Personnel mjackson
sudo usermod -a -G Personnel nwolf
sudo usermod -a -G Personnel psantos
sudo usermod -a -G Personnel smartinez
sudo usermod -a -G Personnel ssarkar
```

#### Add ec2-user to All Groups

```bash
sudo usermod -a -G Sales ec2-user
sudo usermod -a -G HR ec2-user
sudo usermod -a -G Finance ec2-user
sudo usermod -a -G Shipping ec2-user
sudo usermod -a -G Managers ec2-user
sudo usermod -a -G CEO ec2-user
sudo usermod -a -G Personnel ec2-user
```

#### Verify All Group Assignments

```bash
sudo cat /etc/group
```

Expected output:
```
Sales:x:1014:arosalez,nwolf,ec2-user
HR:x:1015:ljuan,smartinez,ec2-user
Finance:x:1016:mmajor,ssarkar,ec2-user
Shipping:x:1017:eowusu,jdoe,psantos,ec2-user
Managers:x:1018:arosalez,ljuan,mmajor,ec2-user
CEO:x:1019:mjackson,ec2-user
Personnel:x:1020:arosalez,eowusu,jdoe,ljuan,mmajor,mjackson,nwolf,psantos,smartinez,ssarkar,ec2-user
```

> **Important:** Managers are personnel, but not all personnel are managers. Some users belong to multiple groups.

---

## Task 4 - Log In Using New Users

Test user login functionality and understand sudoers permissions.

### Steps to Test User Login

#### 1. Switch to a New User

```bash
su arosalez
```

#### 2. Enter the User Password

```
P@ssword1234!
```

You should now see:
```
[arosalez@ec2-user]$
```

The `ec2-user` indicator shows you're in the ec2-user home directory.

#### 3. Verify Current Directory

```bash
pwd
```

Output:
```
/home/ec2-user
```

### Testing Permissions

#### 1. Attempt to Create a File Without Permissions

```bash
touch myFile.txt
```

Expected error:
```
touch: cannot touch 'myFile.txt': Permission denied
```

This occurs because `arosalez` doesn't have write permissions in the ec2-user home folder.

#### 2. Attempt to Create a File Using Sudo Without Sudoer Rights

```bash
sudo touch myFile.txt
```

Expected error:
```
arosalez is not in the sudoers file. This incident will be reported.
```

This demonstrates that `arosalez` is not authorized as a sudoer.

#### 3. Exit the User Session

```bash
exit
```

You return to the `ec2-user` account.

### Reviewing Security Logs

#### View the Secure Log File

```bash
sudo cat /var/log/secure
```

Scroll to the bottom to see the failed sudo attempt:

```
Aug  9 14:45:55 ip-10-0-10-217 sudo: arosalez : user NOT in sudoers ; TTY=pts/1 ; PWD=/home/ec2-user ; USER=root ; COMMAND=/bin/touch myFile.txt
```

This demonstrates that unauthorized sudo commands are logged for security auditing.

---

## Key Concepts

### Users (`/etc/passwd`)

- Individual accounts with unique user IDs.
- Store basic account information.
- Each user has a dedicated home directory.

### Groups (`/etc/group`)

- Collections of users with shared permissions.
- Used for managing access to files and resources.
- Users can belong to multiple groups.

### Sudoers

- Special privileged users who can execute commands with root-level permissions.
- Controlled by the `/etc/sudoers` file.
- All sudo commands are logged in `/var/log/secure`.

### Useful Commands Summary

| Command | Purpose |
|---|---|
| `sudo useradd <username>` | Create a new user |
| `sudo passwd <username>` | Set/change user password |
| `sudo groupadd <groupname>` | Create a new group |
| `sudo usermod -a -G <group> <user>` | Add user to group |
| `cat /etc/passwd` | View all users |
| `cat /etc/group` | View all groups |
| `su <username>` | Switch to another user |
| `sudo cat /var/log/secure` | View security logs |

---

## Notes

- All passwords in this lab use the format `P@ssword1234!`.
- User IDs must be spelled correctly for login functionality.
- A primary group is automatically created for each new user.
- The `cut` command and pipe operator (`|`) help filter output for readability.
- Unauthorized actions are logged in `/var/log/secure` for security auditing.

---

## Reflection

This lab helped me understand how Linux user accounts and groups are used to organize access on a system. I practiced creating users, assigning users to department-based groups, testing login behavior, and reviewing security logs after a failed sudo attempt.

These skills are important for cloud support and systems administration because Linux permissions and user access control are part of managing secure cloud environments.

---

## Additional Resources

- [AWS EC2 Linux Instance Connection Guide](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)
- [Linux User and Group Management](https://linux.die.net/man/8/useradd)
- [Sudoers File Documentation](https://linux.die.net/man/5/sudoers)

---

*Lab completed as part of the AWS re/Start Programme.*
