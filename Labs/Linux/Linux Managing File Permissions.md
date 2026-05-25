# Linux Managing File Permissions

A hands-on lab for managing file and folder ownership, permission modes, and access control on Amazon Linux EC2.
---

## Task 1: Connect via SSH

Connect to an Amazon Linux EC2 instance using SSH.

### Windows Users (PuTTY)

1. **Download the PPK key file**
   - Open the **Details** panel in your lab instructions
   - Click **Show** to reveal the Credentials window
   - Click **Download PPK** and save `labsuser.ppk` to your Downloads folder
   - Note the **PublicIP** address shown
   - Close the Details panel

2. **Download PuTTY** (if not already installed)
   - Get it from: [https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html)

3. **Configure PuTTY Session**
   - Open `putty.exe`
   - In **Host Name**, enter: `ec2-user@<PublicIP>`
   - In the left panel, navigate to: **Connection → SSH → Auth → Credentials**
   - Under **Private key file for authentication**, browse to your `labsuser.ppk` file
   - Click **Open** to connect

### macOS / Linux Users (Terminal)

1. **Download the PEM key file**
   - Open the **Details** panel in your lab instructions
   - Click **Show** to reveal the Credentials window
   - Click **Download PEM** and save `labsuser.pem`
   - Note the **PublicIP** address

2. **Set permissions and connect**
   ```bash
   chmod 400 labsuser.pem
   ssh -i labsuser.pem ec2-user@<PublicIP>
   ```

---

## Task 2: Change File and Folder Ownership

Navigate to the `companyA` folder and change ownership for different departments.

### Step-by-Step Commands

```bash
# Verify current directory
pwd
# Expected output: /home/ec2-user/companyA

# If not in companyA, navigate there
cd companyA

# Change companyA folder ownership to CEO (mjackson) and group to Personnel
sudo chown -R mjackson:Personnel /home/ec2-user/companyA

# Change HR folder ownership to HR manager (ljuan) and group to HR
sudo chown -R ljuan:HR HR

# Change HR/Finance folder ownership to finance manager (mmajor) and group to Finance
sudo chown -R mmajor:Finance HR/Finance

# Validate changes recursively
ls -laR
```

### Expected Output Structure

```
companyA/
├── Documents      (mjackson:Personnel)
├── Employees      (mjackson:Personnel)
├── HR             (ljuan:HR)
│   └── Finance    (mmajor:Finance)
├── Management     (mjackson:Personnel)
├── Roster.csv     (mjackson:Personnel)
├── Sales          (mjackson:Personnel)
├── SharedFolders  (mjackson:Personnel)
└── Shipping       (mjackson:Personnel)
```

---

## Task 3: Change Permission Modes

Create files and modify permissions using both **symbolic** and **absolute (numeric)** modes.

### Symbolic Mode

```bash
# Create a file using vim
sudo vi symbolic_mode_file

# In vim: press 'i' to insert, then ESC, then :wq to save and quit

# Add write permission for group owner
sudo chmod g+w symbolic_mode_file

# Result: Group now has write access
```

### Absolute (Numeric) Mode

```bash
# Create another file
sudo vi absolute_mode_file

# In vim: press 'i' to insert, then ESC, then :wq to save and quit

# Set permissions to 764 (user=rwx, group=rw-, other=r--)
sudo chmod 764 absolute_mode_file
```

### Permission Breakdown: 764

| Digit | Binary | Permissions | Meaning |
|-------|--------|-------------|---------|
| 7 | 111 | rwx | User: Read, Write, Execute |
| 6 | 110 | rw- | Group: Read, Write |
| 4 | 100 | r-- | Other: Read only |

### Validate

```bash
ls -l
# Output should show:
# -rw-rw-r-- symbolic_mode_file
# -rwxrw-r-- absolute_mode_file
```

---

## Task 4: Assign Permissions to Shipping and Sales

Assign appropriate ownership to department folders.

```bash
# Verify current directory
pwd
# Expected: /home/ec2-user/companyA

# Change Shipping folder ownership to shipping manager (eowusu) and group Shipping
sudo chown -R eowusu:Shipping Shipping

# Change Sales folder ownership to sales manager (nwolf) and group Sales
sudo chown -R nwolf:Sales Sales

# Validate Shipping folder
ls -laR Shipping

# Validate Sales folder
ls -laR Sales
```

---

## Quick Reference

### `chown` Command

| Command | Description |
|---------|-------------|
| `chown user file` | Change file owner |
| `chown user:group file` | Change owner and group |
| `chown -R user:group dir` | Recursively change ownership |

### `chmod` Numeric Values

| Value | Permission | Symbol |
|-------|------------|--------|
| 7 | rwx | Read, Write, Execute |
| 6 | rw- | Read, Write |
| 5 | r-x | Read, Execute |
| 4 | r-- | Read only |
| 0 | --- | No permissions |

### `chmod` Symbolic Mode

| Operator | Meaning |
|----------|---------|
| `+` | Add permission |
| `-` | Remove permission |
| `=` | Set exact permission |

| Class | Symbol |
|-------|--------|
| User (owner) | `u` |
| Group | `g` |
| Other | `o` |
| All | `a` |

### Common Permission Patterns

| Numeric | Symbolic | Use Case |
|---------|----------|----------|
| 777 | `a+rwx` | Full access (avoid) |
| 755 | `u+rwx,g+rx,o+rx` | Executable directories |
| 644 | `u+rw,g+r,o+r` | Standard files |
| 700 | `u+rwx` | Private files |

---

## Lab Checklist

- [ ] Connected to EC2 via SSH
- [ ] Changed `companyA` ownership to `mjackson:Personnel`
- [ ] Changed `HR` ownership to `ljuan:HR`
- [ ] Changed `HR/Finance` ownership to `mmajor:Finance`
- [ ] Created `symbolic_mode_file` with `g+w` permissions
- [ ] Created `absolute_mode_file` with `764` permissions
- [ ] Changed `Shipping` ownership to `eowusu:Shipping`
- [ ] Changed `Sales` ownership to `nwolf:Sales`
- [ ] Validated all changes with `ls -laR`

---

## Resources

- [AWS Docs: Connect to Linux Instance](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)
- [Linux chmod Command](https://linux.die.net/man/1/chmod)
- [Linux chown Command](https://linux.die.net/man/1/chown)

---

*Lab created for AWS Academy / Cloud Foundations courses.*
