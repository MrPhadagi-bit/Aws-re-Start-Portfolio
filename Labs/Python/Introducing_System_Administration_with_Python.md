# Introducing System Administration with Python

## Lab Overview

You can use Linux to do many administrative tasks from the terminal, or the Bash command line. Python provides several modules that you can also use to run commands on the command line. In this lab, you will use `os.system()` and `subprocess.run()` to run Bash commands from Python.

## Learning Objectives

In this lab, you will:

- Use `os.system()` to run a Bash command
- Use `subprocess.run()` to run Bash commands

## Estimated Completion Time

30 minutes

---

## Prerequisites

- A working Python 3 environment
- Basic familiarity with Linux terminal commands
- A text editor (e.g., VS Code, nano, vim)

## Lab Environment Setup

Create a new Python file for this lab. You can name it `sys-admin.py` or any name you prefer.

```bash
touch sys-admin.py
```

---

## Exercise 1: Using `os.system()`

### Overview

Python has several modules to allow you to run Bash commands from Python. In this exercise, you will use `os.system()` to run the Bash command `ls`, which shows the directory contents.

### Background

A **module** contains functions that other developers have written. The `os` module provides a portable way of using operating system-dependent functionality, including running shell commands.

The `os.system()` function takes a **string argument** representing the command you want to execute in the shell.

### Instructions

1. Open the Python file you created for this lab.

2. Import the `os` module at the top of your file:

   ```python
   import os
   ```

3. To run the `ls` Bash command, add the following line:

   ```python
   os.system("ls")
   ```

4. Save the file.

5. In the terminal, run your script:

   ```bash
   python3 sys-admin.py
   ```

### Expected Output

The output should show the contents of your current directory. Your output might differ depending on the files in your directory, but it should look similar to this:

```
sys-admin.py README.md
```

### Key Takeaway

`os.system()` is simple to use because it takes a single string argument. However, it is considered less powerful and less secure than modern alternatives.

---

## Exercise 2: Using `subprocess.run()`

### Overview

Though `os.system()` is simple to use, it is recommended that you use the more powerful `subprocess.run()` function. The `subprocess` module allows you to:

- Spawn new processes
- Connect to input/output/error pipes
- Obtain error codes

### Background

The `subprocess.run()` function is part of Python's `subprocess` module, which was introduced to replace older modules like `os.system()`. It provides more flexibility and better error handling.

The full list of arguments for `subprocess.run()` looks like the following:

```python
subprocess.run(
    args,
    *,
    stdin=None,
    input=None,
    stdout=None,
    stderr=None,
    capture_output=False,
    shell=False,
    cwd=None,
    timeout=None,
    check=False,
    encoding=None,
    errors=None,
    text=None,
    env=None,
    universal_newlines=None
)
```

For this lab, you will keep the code simple and focus on the `args` parameter.

### Instructions

1. In your lab file, import the `subprocess` module:

   ```python
   import subprocess
   ```

2. To run the `ls` Bash command, add the following line:

   ```python
   subprocess.run(["ls"])
   ```

   > **Note:** Notice that the argument is a **list** containing the command as a string, not a plain string like with `os.system()`.

3. Save the file.

4. In the terminal, run your script:

   ```bash
   python3 sys-admin.py
   ```

### Expected Output

Confirm that your output lists the files in the directory, similar to the following example (your directory contents may differ):

```
sys-admin.py  sys-admin_2.py  README.md
```

### Key Takeaway

The output looks the same as the output of `os.system()` in Exercise 1, but you are using the more modern `subprocess` module instead of the `os` module.

---

## Exercise 3: Using `subprocess.run()` with Two Arguments

### Overview

In Python, square brackets `[]` denote a **list** data type, which means that `run()` can take a list of arguments. In this exercise, you will pass an additional argument to the `ls` command.

### Background

The `-l` argument tells the `ls` command to use a **long-listing format**, which displays detailed information about each file, including permissions, owner, size, and modification date.

### Instructions

1. Modify the final line of your script to include an additional argument:

   ```python
   subprocess.run(["ls", "-l"])
   ```

   > **Note:** Each part of the command is a separate element in the list.

2. Save the file.

3. In the terminal, run your script again:

   ```bash
   python3 sys-admin.py
   ```

### Expected Output

Your output should be similar to the following example:

```
total 12
-rw-r--r-- 1 ec2-user ec2-user  55 Apr 16 20:20 sys-admin.py
-rw-r--r-- 1 ec2-user ec2-user 343 Apr 16 19:07 sys-admin_2.py
-rw-r--r-- 1 ec2-user ec2-user 569 Apr  6 02:17 README.md
```

### Understanding the Output

| Column | Description |
|--------|-------------|
| `-rw-r--r--` | File permissions (read/write/execute for owner, group, and others) |
| `1` | Number of hard links |
| `ec2-user` | Owner of the file |
| `ec2-user` | Group associated with the file |
| `55` | File size in bytes |
| `Apr 16 20:20` | Last modification date and time |
| `sys-admin.py` | File name |

### Key Takeaway

Passing arguments as separate list elements is safer than concatenating them into a single string, as it prevents shell injection vulnerabilities.

---

## Exercise 4: Using `subprocess.run()` with Three Arguments

### Overview

You will now call `subprocess.run()` with three arguments. The third argument will be a specific file or directory name to list.

### Instructions

1. Modify the final line of your script to include a third argument — a file name:

   ```python
   subprocess.run(["ls", "-l", "README.md"])
   ```

2. Save the file.

3. In the terminal, run your script:

   ```bash
   python3 sys-admin.py
   ```

### Expected Output

Confirm that the expected output is similar to the following example:

```
-rw-r--r-- 1 ec2-user ec2-user 569 Apr  6 02:17 README.md
```

### Key Takeaway

You can pass as many arguments as needed by adding more elements to the list. This makes `subprocess.run()` highly flexible for running complex commands.

---

## Exercise 5: Retrieving System Information

### Overview

The `subprocess.run()` function is powerful because you can use it to run **any** Bash command. In this exercise, you will call the `uname` command to get system information.

### Background

The `uname` command prints system information. When used with the `-a` flag, it displays all available information, including:

- Kernel name
- Network node hostname
- Kernel release
- Kernel version
- Machine hardware name
- Operating system

### Instructions

1. Add the following code to your Python file:

   ```python
   command = "uname"
   commandArgument = "-a"
   print(f'Gathering system information with command: {command} {commandArgument}')
   subprocess.run([command, commandArgument])
   ```

2. Save the file.

3. In the terminal, run your script:

   ```bash
   python3 sys-admin.py
   ```

### Expected Output

Your output should be similar to the following example:

```
Gathering system information with command: uname -a
Linux ip-172-31-29-181 4.4.0-139-generic #165-Ubuntu SMP Wed Oct 24 10:58:50 UTC 2018 x86_64 x86_64 x86_64 GNU/Linux
```

### Understanding the Output

| Field | Description |
|-------|-------------|
| `Linux` | Kernel name |
| `ip-172-31-29-181` | Hostname |
| `4.4.0-139-generic` | Kernel release |
| `#165-Ubuntu SMP Wed Oct 24 10:58:50 UTC 2018` | Kernel version and build info |
| `x86_64` | Machine hardware architecture |
| `GNU/Linux` | Operating system |

### Key Takeaway

Storing commands and arguments in variables makes your code more readable and easier to maintain.

---

## Exercise 6: Retrieving Information About Active Processes

### Overview

To emphasize that `subprocess.run()` allows you to run any command, you will run the `ps` command to get information about active processes.

### Background

The `ps` command reports a snapshot of the current processes. The `-x` flag shows all processes owned by the current user, even those not attached to a terminal.

### Instructions

1. Add the following code to your Python file:

   ```python
   command = "ps"
   commandArgument = "-x"
   print(f'Gathering active process information with command: {command} {commandArgument}')
   subprocess.run([command, commandArgument])
   ```

2. Save the file.

3. In the terminal, run your script:

   ```bash
   python3 sys-admin.py
   ```

### Expected Output

Your output should be similar to the following example:

```
Gathering active process information with command: ps -x
  PID TTY      STAT   TIME COMMAND
18976 pts/459  S+     0:00 python3.11 lab_15_2.py
18977 pts/459  R+     0:00 ps -x
21139 pts/459  S      0:00 /bin/bash -c export OLD_HOME=/home/ccc_4dfa91ec5a_
21164 pts/459  S      0:00 bash --rcfile /home/ccc_4dfa91ec5a_45122/.termrc -
```

### Understanding the Output

| Column | Description |
|--------|-------------|
| `PID` | Process ID — a unique identifier for each running process |
| `TTY` | Terminal type associated with the process |
| `STAT` | Process state (e.g., `S` = sleeping, `R` = running, `+` = foreground) |
| `TIME` | Cumulative CPU time used by the process |
| `COMMAND` | The command that started the process |

### Key Takeaway

You can use `subprocess.run()` to execute any system administration command, making Python a powerful tool for automating system tasks.

---

## Summary

Congratulations! You have successfully called Bash commands from Python using both `os.system()` and `subprocess.run()`.

### What You Learned

| Function | Module | Argument Type | Best For |
|----------|--------|---------------|----------|
| `os.system()` | `os` | String | Simple, quick commands (legacy) |
| `subprocess.run()` | `subprocess` | List | Modern, flexible, secure command execution |

### Best Practices

1. **Prefer `subprocess.run()` over `os.system()`** — It is the modern, recommended approach.
2. **Use lists for arguments** — Passing arguments as separate list elements is safer than using a single string.
3. **Store commands in variables** — This improves code readability and maintainability.
4. **Use `print()` statements** — Adding descriptive output helps when debugging and reviewing logs.

### Next Steps

- Explore additional `subprocess.run()` arguments like `capture_output=True` to capture command output in Python variables.
- Learn about `subprocess.check_output()` for scenarios where you need to process the command output programmatically.
- Experiment with other system administration commands like `df` (disk free), `top` (process monitor), and `netstat` (network statistics).

---

## Appendix: Complete Lab Script

Here is the complete script combining all exercises:

```python
import os
import subprocess

# Exercise 1: Using os.system()
print("=== Exercise 1: os.system() ===")
os.system("ls")
print()

# Exercise 2: Using subprocess.run()
print("=== Exercise 2: subprocess.run() ===")
subprocess.run(["ls"])
print()

# Exercise 3: subprocess.run() with two arguments
print("=== Exercise 3: subprocess.run() with -l ===")
subprocess.run(["ls", "-l"])
print()

# Exercise 4: subprocess.run() with three arguments
print("=== Exercise 4: subprocess.run() with specific file ===")
subprocess.run(["ls", "-l", "README.md"])
print()

# Exercise 5: Retrieving system information
print("=== Exercise 5: System Information ===")
command = "uname"
commandArgument = "-a"
print(f'Gathering system information with command: {command} {commandArgument}')
subprocess.run([command, commandArgument])
print()

# Exercise 6: Retrieving active process information
print("=== Exercise 6: Active Processes ===")
command = "ps"
commandArgument = "-x"
print(f'Gathering active process information with command: {command} {commandArgument}')
subprocess.run([command, commandArgument])
```

---

*End of Lab*
