# Using the Debugger: Lab Overview

## Introduction

A **software bug** refers to an error, flaw, or failure in a computer program that causes an incorrect or unexpected result. A **debugger** is a computer program that is used to test and find bugs (debug) other programs. You can use a debugger to step through the code.

The **Python Debugger (pdb)** is an interactive source code debugger for Python programs. In this lab, you will use the pdb to step through the scripts you wrote in previous labs.

## Learning Objectives

In this lab, you will:

- Explore the basic features of the Python Debugger
- Use the Python Debugger to step through Python scripts

## Estimated Completion Time

**30 minutes**

---

## Exercise 1: Exploring the Basic Features of the VS Code IDE Python Debugger

The VS Code IDE offers an interactive source code debugger for several languages, including Python. In this exercise, you will cover some of the basic commands for debugging a Python file.

### Step 1: Prepare Your Python File

From the Explorer pane on the left side of the IDE, choose the `.py` file that you created in the previous *Creating your Python exercise file* section. Copy the following code and paste it in the file:

```python
name = "John"
print("Hello " + name + ".")
age = 40
print(name + " is " + str(age) + " years old.")
```

### Step 2: Open the Debugger

To open the debugger, choose the **Run and Debug** icon in the left sidebar (it looks like a play button with a bug).

### Step 3: Set Breakpoints

Click in the gutter to the left of **line 1** to add a breakpoint (a red dot appears), and click in the gutter to the left of **line 4** to add another breakpoint.

### Step 4: Add Watch Expressions

In the Run and Debug panel, under the **WATCH** section, choose the **+** icon to add two watch expressions:

- `name`
- `age`

### Step 5: Start Debugging

At the top of the Run and Debug panel, choose **Run and Debug**. If prompted to select a debugger, choose **Python Debugger**, then choose **Python File**.

The program starts and stops at the first breakpoint (line 1).

### Step 6: Step Over

In the debug toolbar at the top of the editor, choose the **Step Over** icon (arrow curving over a dot).

Line 1 is run, and the value of the `name` variable is displayed in the **VARIABLES** section of the Run and Debug panel.

### Step 7: Continue to Next Breakpoint

Choose the **Continue** icon (blue play arrow) in the debug toolbar. The program resumes and stops at line 4 where the other breakpoint is set. The value of the `age` variable is now displayed.

### Step 8: Finish Execution

Choose the **Continue** icon again to resume and end the program.

---

## Exercise 2: Using the Python Debugger

Using the debugging basics you learned in Exercise 1, try stepping through some of the other labs to practice using the Python Debugger.

---

## Conclusion

**Congratulations!** You have used some of the basic features of the Python Debugger.

---

*End Lab*
