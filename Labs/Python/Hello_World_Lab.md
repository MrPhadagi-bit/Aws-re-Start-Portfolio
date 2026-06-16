# Lab: Creating a Hello, World Program

> **Course:** Introduction to Programming  
> **Language:** Python 3.x  
> **Estimated Time:** 45 minutes  
> **Difficulty:** Beginner

---

## Overview

Welcome to your first programming lab! In this hands-on exercise, you will:

- Set up your development environment using the VS Code: IDE
- Learn the basics of the Python programming language
- Write, save, and execute your first Python program
- Understand Python version management

By the end of this lab, you will have a working "Hello, World" program — the traditional first step for every programmer.

---

## Prerequisites

Before starting this lab, ensure you have:

- [ ] Access to the AWS lab environment
- [ ] A modern web browser (Chrome, Firefox, Safari, or Edge)
- [ ] Pop-up windows enabled for the lab platform
- [ ] Basic familiarity with using a terminal/command line (helpful but not required)

---

## Environment Setup

### Step 1: Start the Lab Environment

1. Navigate to the top of the lab instructions page
2. Click the **Start Lab** button
3. Wait for the status message: `Lab status: ready`
4. Close the Start Lab panel by clicking the **X**

### Step 2: Access the AWS Management Console

1. At the top of the instructions, click **AWS**
2. The AWS Management Console will open in a new browser tab (auto-login enabled)

> **Note:** If the new tab doesn't open, check for a pop-up blocker banner at the top of your browser. Click the banner and select **Allow pop-ups**.

### Step 3: Open the VS Code: IDE

1. Locate the **LabIDEURL** value in the panel to the left of the instructions
2. Copy the URL and paste it into a new browser tab
3. When prompted, enter the **LabIDEPassword** value as the password
4. The VS Code: IDE will open

### Step 4: Create Your Python Exercise File

1. In VS Code:, click **File** > **New File** (or press `Ctrl+N` / `Cmd+N`)
2. Save the file immediately:
   - Click **File** > **Save As...**
   - Navigate to `/home/ec2-user/environment/`
   - Name your file: `hello-world.py`
   - Click **Save**

> **Tip:** The `.py` extension identifies the file as a Python script.

### Step 5: Open a Terminal

1. In VS Code:, click **Terminal** > **New Terminal** from the menu bar
2. A terminal session will open at the bottom of the IDE
3. Verify your current directory:

```bash
pwd
```

**Expected Output:**
```
/home/ec2-user/environment
```

4. Confirm your file exists:

```bash
ls -la hello-world.py
```

---

## Exercise 1: Introducing Python

### What is Python?

Python is a **high-level, general-purpose** programming language.

| Characteristic | Description |
|----------------|-------------|
| **High-level** | Uses English-like words and readable syntax |
| **General-purpose** | Used for web development, data science, automation, AI, and more |
| **Interpreted** | Code runs line-by-line without prior compilation |
| **Cross-platform** | Works on Windows, macOS, and Linux |

### Python Versions

Python has two major release families:

| Version | Status | Notes |
|---------|--------|-------|
| Python 2.x |  End-of-Life (January 2020) | Legacy code only; do not use for new projects |
| Python 3.x |  Active Development | Current standard; used in this course |

> **Backward Compatibility:** Python generally maintains compatibility within minor versions (e.g., 3.10 → 3.11), but major versions (2.x → 3.x) have significant syntax differences.

### Checking Your Python Installation

Run the following commands in your terminal to verify installed versions:

```bash
# Check the default Python version
python --version

# Check if Python 2 is available (legacy)
python2 --version

# Check Python 3 specifically
python3 --version
```

**Example Output:**
```bash
~ $ python --version
Python 3.11

~ $ python2 --version
python2: command not found

~ $ python3 --version
Python 3.11
```

> **Note:** In this lab environment, `python` and `python3` typically point to the same Python 3.x installation.

---

## Exercise 2: Writing Your First Python Program

### The Tradition of "Hello, World"

The "Hello, World" program is the traditional first program written when learning a new language. It serves as a simple sanity check that your development environment is correctly configured.

### Writing the Code

1. In VS Code:, click on `hello-world.py` in the **Explorer** panel (left sidebar)
2. Enter the following code:

```python
print("Hello, World")
```

3. Save the file:
   - **File** > **Save** (or press `Ctrl+S` / `Cmd+S`)

### Understanding the Code

| Component | Description |
|-----------|-------------|
| `print()` | A built-in Python **function** that outputs text to the console |
| `"Hello, World"` | A **string** (text data) enclosed in double quotes |
| `()` | Parentheses that enclose the function's **arguments** |

### Running Your Program

In the terminal, execute your script using Python 3:

```bash
python3 hello-world.py
```

**Expected Output:**
```
Hello, World
```

 **Congratulations!** You have successfully written and executed your first Python program.

---

## Verification

To confirm everything is working correctly, verify the following:

- [ ] VS Code: IDE opens without errors
- [ ] Terminal shows `/home/ec2-user/environment` as the working directory
- [ ] `hello-world.py` file exists in the Explorer panel
- [ ] Running `python3 hello-world.py` prints `Hello, World`
- [ ] No syntax errors or exceptions appear in the terminal

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `python3: command not found` | Try `python hello-world.py` instead |
| `No such file or directory` | Ensure you saved the file in `/home/ec2-user/environment/` and check the filename spelling |
| `SyntaxError` | Verify you used straight quotes `"` not curly quotes `""`; check for missing parentheses |
| Pop-up blocked | Enable pop-ups for the lab domain in your browser settings |
| Cannot access IDE | Double-check the `LabIDEURL` and `LabIDEPassword` values |

---

## Next Steps

Now that you've completed your first program, consider exploring:

- **Variables:** Store data using names (e.g., `message = "Hello, World"`)
- **User Input:** Use `input()` to accept keyboard input
- **Comments:** Add notes to your code using `#`
- **Multiple Print Statements:** Output multiple lines of text

### Example Extension

```python
# This is a comment - Python ignores this line
name = "Student"  # Variable storing a string
print("Hello, World")
print(f"Welcome, {name}!")  # f-string for formatted output
```

---

## Resources

- [Python Official Documentation](https://docs.python.org/3/)
- [Python.org Downloads](https://www.python.org/downloads/)
- [VS Code: Documentation](https://code.visualstudio.com/docs)

---

*Lab content provided for educational purposes. Last updated: 2026.*
