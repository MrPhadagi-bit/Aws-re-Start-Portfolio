# Challenge Lab: Python Scripting Exercise

**Duration:** Approximately 40 minutes

---

## Table of Contents
1. [Connecting to the Linux Host](#connecting-to-the-linux-host)
   - [Windows Users: Using SSH to Connect](#windows-users-using-ssh-to-connect)
   - [macOS and Linux Users: Using SSH to Connect](#macos-and-linux-users-using-ssh-to-connect)
2. [Your Challenge](#your-challenge)
3. [Step-by-Step Instructions](#step-by-step-instructions)
4. [Solution Walkthrough](#solution-walkthrough)
5. [Verification](#verification)
6. [Lab Complete](#lab-complete)

---

## Connecting to the Linux Host

### Windows Users: Using SSH to Connect

> **Note:** These instructions are specifically for **Windows users**. If you are using macOS or Linux, skip to the [next section](#macos-and-linux-users-using-ssh-to-connect).

1. **Access Credentials**
   - Select the **Details** drop-down menu above these instructions.
   - Select **Show**. A **Credentials** window will be presented.

2. **Download the Key File**
   - Select the **Download PPK** button and save the `labsuser.ppk` file.
   - Typically, your browser will save it to the `Downloads` directory.

3. **Note the Public IP Address**
   - Make a note of the **PublicIP** address displayed in the Credentials window.

4. **Close the Details Panel**
   - Exit the Details panel by selecting the **X**.

5. **Download PuTTY**
   - Download [PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html) to SSH into the Amazon EC2 instance.
   - If you do not have PuTTY installed on your computer, download it from the link above.

6. **Open PuTTY**
   - Run `putty.exe`.

7. **Configure Your PuTTY Session**
   - Follow the directions in the official AWS guide: [Connect to your Linux instance using PuTTY](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/putty.html)

> **Windows Users:** [Click here to skip ahead to the next task.](#your-challenge)

---

### macOS and Linux Users: Using SSH to Connect

1. **Access Credentials**
   - Select the **Details** drop-down menu above these instructions.
   - Select **Show**. A **Credentials** window will be presented.

2. **Download the Key File**
   - Select the **Download PEM** button and save the `labsuser.pem` file.
   - Typically, your browser will save it to the `Downloads` directory.

3. **Note the Public IP Address**
   - Make a note of the **PublicIP** address displayed in the Credentials window.

4. **Close the Details Panel**
   - Exit the Details panel by selecting the **X**.

5. **Set Permissions on the Key File**
   ```bash
   chmod 400 ~/Downloads/labsuser.pem
   ```

6. **Connect via SSH**
   ```bash
   ssh -i ~/Downloads/labsuser.pem ec2-user@<PublicIP>
   ```
   > Replace `<PublicIP>` with the actual Public IP address you noted earlier.

---

## Your Challenge

Write a Python script that accomplishes the following:

| Task | Description |
|------|-------------|
| **1. Generate Primes** | Display all prime numbers between **1 and 250** |
| **2. Store Results** | Save the results to a file named **`results.txt`** |
| **3. Test the Script** | Verify that the script produced the expected results in `results.txt` |
| **4. Document Location** | Save the script and make a note of its **absolute path** for future reference |

> **Note:** Both Python 2 and Python 3 are installed on the Linux Host. It is **recommended to use Python 3**.
> To run a Python script using version 3, use the following command (replace `file.py` with your file name):
> ```bash
> python3 file.py
> ```

---

## Step-by-Step Instructions

### Step 1: Create the Python Script

1. Navigate to your home directory (or a directory of your choice):
   ```bash
   cd ~
   ```

2. Create a new Python file using a text editor (e.g., `nano`, `vim`, or `vi`):
   ```bash
   nano find_primes.py
   ```

### Step 2: Write the Script

Copy and paste the following code into your editor:

```python
#!/usr/bin/env python3
"""
Challenge Lab: Python Scripting Exercise
========================================
This script finds all prime numbers between 1 and 250
and stores the results in a file named results.txt.

Author: Lab Participant
Date: June 18, 2026
"""

import math


def is_prime(number):
    """
    Check if a given number is prime.
    
    A prime number is a natural number greater than 1 that has no 
    positive divisors other than 1 and itself.
    
    Args:
        number (int): The number to check for primality.
    
    Returns:
        bool: True if the number is prime, False otherwise.
    """
    # Numbers less than 2 are not prime
    if number < 2:
        return False
    
    # 2 is the only even prime number
    if number == 2:
        return True
    
    # All other even numbers are not prime
    if number % 2 == 0:
        return False
    
    # Check for factors from 3 up to the square root of the number
    # We only need to check odd numbers
    for i in range(3, int(math.sqrt(number)) + 1, 2):
        if number % i == 0:
            return False
    
    return True


def find_primes(start, end):
    """
    Find all prime numbers within a given range.
    
    Args:
        start (int): The start of the range (inclusive).
        end (int): The end of the range (inclusive).
    
    Returns:
        list: A list of all prime numbers in the range.
    """
    primes = []
    for num in range(start, end + 1):
        if is_prime(num):
            primes.append(num)
    return primes


def save_results(primes, filename="results.txt"):
    """
    Save the list of prime numbers to a text file.
    
    Args:
        primes (list): The list of prime numbers to save.
        filename (str): The name of the output file. Defaults to "results.txt".
    
    Returns:
        str: The absolute path of the saved file.
    """
    import os
    
    # Get the absolute path of the output file
    filepath = os.path.abspath(filename)
    
    with open(filename, 'w') as file:
        file.write("Prime Numbers between 1 and 250\n")
        file.write("=" * 40 + "\n")
        file.write("Total count: {}\n".format(len(primes)))
        file.write("-" * 40 + "\n")
        
        for prime in primes:
            file.write("{}\n".format(prime))
    
    return filepath


def main():
    """
    Main function to execute the prime number finder.
    """
    print("=" * 50)
    print("Challenge Lab: Prime Number Finder")
    print("=" * 50)
    print()
    
    # Define the range
    START = 1
    END = 250
    
    print("Finding prime numbers between {} and {}...".format(START, END))
    print()
    
    # Find all prime numbers in the range
    primes = find_primes(START, END)
    
    # Display the results
    print("Found {} prime numbers:".format(len(primes)))
    print("-" * 50)
    
    # Print primes in rows of 10 for readability
    for i, prime in enumerate(primes):
        print("{:4d}".format(prime), end=" ")
        if (i + 1) % 10 == 0:
            print()  # New line every 10 numbers
    print()
    print("-" * 50)
    
    # Save results to file
    filepath = save_results(primes)
    
    print()
    print("Results successfully saved to: {}".format(filepath))
    print()
    print("Lab challenge completed successfully!")


if __name__ == "__main__":
    main()
```

3. Save the file and exit the editor:
   - In `nano`: Press `Ctrl + O` to save, then `Ctrl + X` to exit.
   - In `vim`: Press `Esc`, then type `:wq` and press `Enter`.

### Step 3: Make the Script Executable (Optional but Recommended)

```bash
chmod +x find_primes.py
```

### Step 4: Run the Script

```bash
python3 find_primes.py
```

> **Expected Output:** The script will display all prime numbers between 1 and 250 in the terminal and save them to `results.txt`.

---

## Solution Walkthrough

### Understanding the Algorithm

The script uses an efficient approach to find prime numbers:

1. **Edge Case Handling:**
   - Numbers less than 2 are not prime.
   - 2 is the only even prime number.

2. **Even Number Elimination:**
   - All even numbers greater than 2 are immediately excluded.

3. **Square Root Optimization:**
   - Instead of checking all numbers up to `n`, we only check up to `sqrt(n)`.
   - If `n` has a factor larger than its square root, the corresponding co-factor would be smaller than the square root (and would have already been found).

4. **Odd Number Iteration:**
   - We only check odd divisors (`range(3, sqrt(n)+1, 2)`), further reducing the number of checks.

### Prime Numbers Between 1 and 250

The expected output should contain **53 prime numbers**:

```
2, 3, 5, 7, 11, 13, 17, 19, 23, 29,
31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
73, 79, 83, 89, 97, 101, 103, 107, 109, 113,
127, 131, 137, 139, 149, 151, 157, 163, 167, 173,
179, 181, 191, 193, 197, 199, 211, 223, 227, 229,
233, 239, 241
```

---

## Verification

### Step 1: Verify the Script Output

After running the script, verify the terminal output shows 53 prime numbers.

### Step 2: Verify the results.txt File

1. **Check that the file exists:**
   ```bash
   ls -la results.txt
   ```

2. **View the contents of the file:**
   ```bash
   cat results.txt
   ```

3. **Expected contents of `results.txt`:**
   ```
   Prime Numbers between 1 and 250
   ========================================
   Total count: 53
   ----------------------------------------
   2
   3
   5
   7
   11
   13
   17
   19
   23
   29
   ... (continues for all 53 primes)
   ```

4. **Count the lines to verify:**
   ```bash
   wc -l results.txt
   ```
   > The file should have 53 data lines (plus header lines).

5. **Verify the file contains exactly 53 prime numbers:**
   ```bash
   grep -c "^[0-9]" results.txt
   ```
   > This should return `53`.

### Step 3: Note the Absolute Path

Get the absolute path of your script for future reference:

```bash
pwd
realpath find_primes.py
```

> **Example output:** `/home/ec2-user/find_primes.py`

**Document this path in your notes.**

---

## Alternative: Quick One-Liner Verification

If you want to quickly verify your results using the command line:

```bash
# Count prime numbers using a Python one-liner
python3 -c "
import math
def is_prime(n):
    if n < 2: return False
    if n == 2: return True
    if n % 2 == 0: return False
    for i in range(3, int(math.sqrt(n)) + 1, 2):
        if n % i == 0: return False
    return True
primes = [n for n in range(1, 251) if is_prime(n)]
print('Total primes found: {}'.format(len(primes)))
print(primes)
"
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `python3: command not found` | Try using `python` instead of `python3` |
| `Permission denied` | Run `chmod +x find_primes.py` or use `python3 find_primes.py` |
| `results.txt not found` | Ensure you are in the correct directory where the script was run |
| Script runs but no output | Check for syntax errors using `python3 -m py_compile find_primes.py` |

---

## Lab Complete

Congratulations! You have successfully completed the Challenge Lab.

### Summary of What Was Accomplished:

- [x] Connected to the Linux host via SSH
- [x] Wrote a Python 3 script to find all prime numbers between 1 and 250
- [x] Stored the results in `results.txt`
- [x] Tested the script and verified the output
- [x] Documented the absolute path of the script

### Key Takeaways:

1. **Prime Number Algorithm:** Understanding how to efficiently check for prime numbers using the square root optimization.
2. **File I/O in Python:** Writing data to text files using Python's built-in `open()` function.
3. **Script Documentation:** Using docstrings and comments to make code readable and maintainable.
4. **Absolute Paths:** Using `os.path.abspath()` to get the full path of files for future reference.

---

> **Next Steps:** Feel free to extend this script by:
> - Adding command-line arguments to specify a custom range
> - Implementing the Sieve of Eratosthenes for larger ranges
> - Adding error handling and logging
> - Creating a function to read back and display the saved results

---

*Lab completed on: June 18, 2026*