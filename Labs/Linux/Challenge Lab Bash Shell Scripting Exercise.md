# Challenge Lab: Bash Shell Scripting Exercise

[![Bash](https://img.shields.io/badge/Language-Bash%20Shell%20Scripting-4EAA25?logo=gnu-bash&logoColor=white)](https://www.gnu.org/software/bash/)

> **Duration:** ~55 minutes  
> **Level:** Beginner to Intermediate  
> **Environment:** Amazon Linux EC2 / Any Linux/Unix system with Bash

---

## Objectives

In this challenge, you will:

- [x] Connect to an Amazon Linux EC2 instance using SSH
- [x] Create a Bash script that generates 25 empty files dynamically
- [x] Implement incremental numbering that persists across script executions
- [x] Validate file creation using directory listings

---

## Prerequisites

- An AWS account with a running Amazon Linux EC2 instance
- SSH client (PuTTY for Windows, Terminal for macOS/Linux)
- EC2 Key Pair (`.pem` or `.ppk` file)
- Public IP address of your EC2 instance
- Basic familiarity with Linux command line

---

## Task 1: Connect to EC2 via SSH

### Windows Users (PuTTY)

> **Note:** If you are using macOS or Linux, skip to the [next section](#macoslinux-users-terminal).

1. **Retrieve Credentials**
   - In your lab environment, select the **Details** drop-down menu
   - Select **Show** to open the Credentials window
   - Click **Download PPK** and save `labsuser.ppk` (typically to your `Downloads` folder)
   - Make a note of the **PublicIP** address
   - Close the Details panel by selecting the **X**

2. **Install PuTTY** (if not already installed)
   - Download PuTTY from: https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html
   - Run `putty.exe`

3. **Configure PuTTY Session**
   - Host Name: `ec2-user@<PublicIP>` (e.g., `ec2-user@54.123.45.67`)
   - Port: `22`
   - Connection → SSH → Auth → Private key file: Browse to your `labsuser.ppk`
   - Click **Open** to connect
   - Accept the security alert if prompted

4. **Skip Ahead:** [Your Challenge](#your-challenge)

### macOS/Linux Users (Terminal)

1. **Retrieve Credentials**
   - Note the **PublicIP** address from your lab environment
   - Download the `.pem` key file if provided

2. **Set Permissions & Connect**
   ```bash
   # Restrict key file permissions (required by SSH)
   chmod 400 /path/to/your-key.pem

   # Connect to EC2 instance
   ssh -i /path/to/your-key.pem ec2-user@<PublicIP>
   ```

3. **Verify Connection**
   ```bash
   # You should see the Amazon Linux welcome message
   # Prompt should look like: [ec2-user@ip-xxx-xx-xx-xx ~]$
   ```

---

## Your Challenge

### Requirements

Write a Bash script named `generate_files.sh` that meets the following criteria:

| Requirement | Description |
|-------------|-------------|
| **File Count** | Creates exactly **25 empty (0 KB) files** per execution |
| **Naming Convention** | Files named `<yourName><number>` (e.g., `John1`, `John2`, ...) |
| **Incremental Logic** | Each execution creates the **next batch** of 25 files with **increasing numbers** |
| **Dynamic Numbering** | **DO NOT hard-code numbers** — generate them using automation |
| **Persistence** | Script must detect the highest existing number and continue from there |

### Example Behavior

```bash
# First run
$ ./generate_files.sh
# Creates: yourName1, yourName2, ..., yourName25

# Second run
$ ./generate_files.sh
# Creates: yourName26, yourName27, ..., yourName50

# Third run
$ ./generate_files.sh
# Creates: yourName51, yourName52, ..., yourName75
```

---

## Solution & Explanation

### Complete Script: `generate_files.sh`

```bash
#!/bin/bash

################################################################################
# Script Name: generate_files.sh
# Description: Dynamically creates 25 empty files with incremental numbering
# Author: [Your Name]
# Date: $(date +%Y-%m-%d)
# Version: 1.0
################################################################################

# ------------------------------------------------------------------------------
# CONFIGURATION
# ------------------------------------------------------------------------------
# Set your name prefix here (customize as needed)
YOUR_NAME="yourName"

# Number of files to create per execution
BATCH_SIZE=25

# Target directory (current directory by default)
TARGET_DIR="."

# ------------------------------------------------------------------------------
# FUNCTION: get_max_number
# Description: Finds the highest existing file number for the given prefix
# Returns: The maximum number found, or 0 if no files exist
# ------------------------------------------------------------------------------
get_max_number() {
    local prefix="$1"
    local max_num=0

    # Check if any matching files exist
    # Using ls with nullglob to handle case where no files match
    shopt -s nullglob
    local files=("${TARGET_DIR}/${prefix}"[0-9]*)
    shopt -u nullglob

    # If no files exist, return 0
    if [ ${#files[@]} -eq 0 ]; then
        echo "0"
        return
    fi

    # Extract numbers from filenames and find maximum
    for file in "${files[@]}"; do
        # Extract just the filename (remove path)
        local filename=$(basename "$file")

        # Remove the prefix to get the number part
        # ${filename#"$prefix"} removes the prefix from the beginning
        local num="${filename#"$prefix"}"

        # Validate that we actually got a number
        if [[ "$num" =~ ^[0-9]+$ ]]; then
            if [ "$num" -gt "$max_num" ]; then
                max_num="$num"
            fi
        fi
    done

    echo "$max_num"
}

# ------------------------------------------------------------------------------
# FUNCTION: create_files
# Description: Creates the batch of 25 empty files
# Arguments: $1 = starting number, $2 = batch size
# ------------------------------------------------------------------------------
create_files() {
    local start_num="$1"
    local count="$2"
    local prefix="$3"

    echo "Creating ${count} empty files starting from ${prefix}$((start_num + 1))..."

    for ((i = 1; i <= count; i++)); do
        local file_num=$((start_num + i))
        local filename="${TARGET_DIR}/${prefix}${file_num}"

        # Create empty file using touch
        touch "$filename"

        # Verify file was created
        if [ -f "$filename" ]; then
            echo "  ✓ Created: ${prefix}${file_num}"
        else
            echo "  ✗ Failed to create: ${prefix}${file_num}" >&2
        fi
    done
}

# ------------------------------------------------------------------------------
# MAIN EXECUTION
# ------------------------------------------------------------------------------

echo "=========================================="
echo "  File Generation Script"
echo "=========================================="
echo "Prefix: ${YOUR_NAME}"
echo "Batch Size: ${BATCH_SIZE}"
echo "Target Directory: $(cd "$TARGET_DIR" && pwd)"
echo ""

# Step 1: Determine the starting point
echo "[1/3] Scanning for existing files..."
MAX_EXISTING=$(get_max_number "$YOUR_NAME")
echo "      Highest existing number: ${MAX_EXISTING}"

# Step 2: Calculate new starting number
START_NUMBER="$MAX_EXISTING"
echo "[2/3] Next batch will start at: $((START_NUMBER + 1))"

# Step 3: Create the files
echo "[3/3] Generating files..."
create_files "$START_NUMBER" "$BATCH_SIZE" "$YOUR_NAME"

echo ""
echo "=========================================="
echo "  Batch Complete!"
echo "=========================================="
echo "Files created: ${BATCH_SIZE}"
echo "Range: ${YOUR_NAME}$((START_NUMBER + 1)) to ${YOUR_NAME}$((START_NUMBER + BATCH_SIZE))"
echo ""
echo "Run 'ls -l' to verify the files."
```

### Alternative Compact Version

If you prefer a more concise script without functions:

```bash
#!/bin/bash

YOUR_NAME="yourName"
BATCH_SIZE=25

# Find maximum existing number (returns 0 if none exist)
max_num=$(ls -1 "${YOUR_NAME}"[0-9]* 2>/dev/null | sed 's/[^0-9]//g' | sort -n | tail -1)
max_num=${max_num:-0}

# Create 25 files with incremental numbers
for i in $(seq 1 $BATCH_SIZE); do
    num=$((max_num + i))
    touch "${YOUR_NAME}${num}"
    echo "Created: ${YOUR_NAME}${num}"
done

echo "Created ${BATCH_SIZE} files. Last file: ${YOUR_NAME}$((max_num + BATCH_SIZE))"
```

---

## Testing & Validation

### Step 1: Create and Prepare the Script

```bash
# Create the script file
nano generate_files.sh

# Paste the script content above, then save (Ctrl+O, Enter, Ctrl+X)

# Make it executable
chmod +x generate_files.sh
```

### Step 2: First Execution (Creates files 1-25)

```bash
$ ./generate_files.sh
==========================================
  File Generation Script
==========================================
Prefix: yourName
Batch Size: 25
Target Directory: /home/ec2-user

[1/3] Scanning for existing files...
      Highest existing number: 0
[2/3] Next batch will start at: 1
[3/3] Generating files...
  ✓ Created: yourName1
  ✓ Created: yourName2
  ...
  ✓ Created: yourName25

==========================================
  Batch Complete!
==========================================
```

### Step 3: Validate First Batch

```bash
# Long listing to verify files
$ ls -l

# Expected output:
-rw-rw-r-- 1 ec2-user ec2-user 0 May 30 12:00 yourName1
-rw-rw-r-- 1 ec2-user ec2-user 0 May 30 12:00 yourName2
...
-rw-rw-r-- 1 ec2-user ec2-user 0 May 30 12:00 yourName25

# Verify file sizes are 0 KB
$ ls -lh yourName* | awk '{print $5, $9}'

# Count files
$ ls -1 yourName* | wc -l
25
```

### Step 4: Second Execution (Creates files 26-50)

```bash
$ ./generate_files.sh
...
[1/3] Scanning for existing files...
      Highest existing number: 25
[2/3] Next batch will start at: 26
...

# Validate
$ ls -1 yourName* | wc -l
50
```

### Step 5: Third Execution (Creates files 51-75)

```bash
$ ./generate_files.sh
...
# Should create yourName51 through yourName75
```

### Validation Commands Reference

```bash
# Comprehensive validation
echo "=== Total File Count ==="
ls -1 yourName* | wc -l

echo "=== File Size Verification (should all be 0) ==="
ls -l yourName* | awk '{print $5}' | sort -u

echo "=== Number Sequence Check ==="
ls -1 yourName* | sed 's/[^0-9]//g' | sort -n | head -5
echo "..."
ls -1 yourName* | sed 's/[^0-9]//g' | sort -n | tail -5

echo "=== Missing Numbers in Sequence ==="
ls -1 yourName* | sed 's/[^0-9]//g' | sort -n | awk 'BEGIN{prev=0} {for(i=prev+1;i<$1;i++)print "Missing: "i; prev=$1}'
```

---

## Advanced Enhancements

### Enhancement 1: Command-Line Arguments

```bash
#!/bin/bash
# Usage: ./generate_files.sh [prefix] [batch_size]

YOUR_NAME="${1:-yourName}"      # Default: yourName
BATCH_SIZE="${2:-25}"           # Default: 25
```

### Enhancement 2: Dry-Run Mode

```bash
# Add this option to preview without creating
DRY_RUN=false
# ...
[ "$DRY_RUN" = true ] && echo "Would create: $filename" || touch "$filename"
```

### Enhancement 3: Logging

```bash
LOG_FILE="file_generation.log"
echo "$(date): Created batch $((max_num+1))-$((max_num+BATCH_SIZE))" >> "$LOG_FILE"
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Permission denied` | Run `chmod +x generate_files.sh` |
| `command not found` | Ensure you're in the correct directory or use `./script.sh` |
| Files not incrementing | Check for non-matching files in directory; ensure `nullglob` is set |
| Wrong file count | Verify `BATCH_SIZE` variable; check for existing files with similar names |
| SSH connection refused | Verify Security Group allows inbound SSH (port 22) from your IP |

---

## Lab Complete! 

You have successfully:
- Connected to an Amazon Linux EC2 instance via SSH
- Created a dynamic Bash script with persistent incremental numbering
- Validated file creation using `ls -l` and other commands
- Understood automation concepts like globbing, string manipulation, and loops

---

## License

This lab guide is provided for educational purposes. Feel free to use and modify for your learning or teaching needs.

---

**Contributions:** If you find improvements or alternative solutions, feel free to submit a pull request!
