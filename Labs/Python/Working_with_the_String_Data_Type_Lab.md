# Working with the String Data Type

## Lab Overview

In Python, a collection of letters and symbols is called a **string**. Strings are used often in Python for input and output.

In this lab, you will:

- Write Python code that uses the string data type
- Concatenate strings
- Use the string to get input
- Format strings for output

**Estimated completion time:** 45 minutes

---

## Prerequisites

- Python 3 installed on your system
- A text editor or IDE (e.g., VS Code, PyCharm, or a simple text editor)
- Basic familiarity with running Python scripts from the terminal/command line

---

## Table of Contents

1. [Exercise 1: Introducing the String Data Type](#exercise-1-introducing-the-string-data-type)
2. [Exercise 2: Working with String Concatenation](#exercise-2-working-with-string-concatenation)
3. [Exercise 3: Working with Input Strings](#exercise-3-working-with-input-strings)
4. [Exercise 4: Formatting Output Strings](#exercise-4-formatting-output-strings)

---

## Exercise 1: Introducing the String Data Type

A text file containing a logical sequence of commands is a **script**.

### Objectives

- Create a Python script that declares a string variable.
- Print the string to the console.
- Use the `type()` function to inspect the data type of a variable.
- Concatenate a string with the result of `type()` using `str()`.

### Instructions

1. From the Explorer panel on the left, choose the `.py` file that you created in the previous *Creating your Python exercise file* section.

2. In the file, enter the following code:

    ```python
    myString = "This is a string."
    print(myString)
    ```

3. **Save** the file.

4. In the terminal, run the file:

    ```bash
    python3 filename.py
    ```

5. Confirm that the script runs correctly and that the output displays as you expect it to.

    **Expected Output:**
    ```
    This is a string.
    ```

6. Extend the Python script by using the built-in function `type()` to get the data type of the variable. Enter the following code:

    ```python
    print(type(myString))
    ```

7. To convert the return value of `type()` into a string, use the `str()` built-in function:

    ```python
    print(myString + " is of the data type " + str(type(myString)))
    ```

8. **Save** the file.

9. In the terminal, run the file again:

    ```bash
    python3 filename.py
    ```

10. Confirm that the script runs correctly.

    **Expected Output:**
    ```
    This is a string.
    <class 'str'>
    This is a string. is of the data type <class 'str'>
    ```

### Key Concepts

| Concept | Description |
|---------|-------------|
| `str` | The string data type in Python. Represents a sequence of characters. |
| `type()` | A built-in function that returns the data type of a given object. |
| `str()` | A built-in function that converts a given value into a string representation. |

---

## Exercise 2: Working with String Concatenation

**String concatenation** is the process of combining two strings into one string. You have actually been doing string concatenation since Lab 1, but you didn't call this process by that term.

The **plus sign (`+`)** is used to concatenate strings. When the plus sign (`+`) is used with strings, it behaves differently than when you use it for numbers. In Lab 1, you used the plus sign (`+`) to add numbers. Now, you will use the plus sign (`+`) to combine, or concatenate, strings.

### Objectives

- Create two string variables.
- Concatenate them using the `+` operator.
- Print the resulting concatenated string.

### Instructions

1. Return to the Python script.

2. Create two strings and then concatenate them by entering the following code:

    ```python
    firstString = "water"
    secondString = "fall"
    thirdString = firstString + secondString
    print(thirdString)
    ```

3. **Save** the file.

4. In the terminal, run the file:

    ```bash
    python3 filename.py
    ```

5. Confirm that the script runs correctly and that the output displays as you expect it to.

    **Expected Output:**
    ```
    This is a string.
    <class 'str'>
    This is a string. is of the data type <class 'str'>
    waterfall
    ```

### Key Concepts

| Operator | Usage | Example | Result |
|----------|-------|---------|--------|
| `+` | String concatenation | `"water" + "fall"` | `"waterfall"` |
| `+` | Numeric addition | `5 + 3` | `8` |

> **Note:** Python does not allow concatenating a string with a number directly (e.g., `"Age: " + 25` will raise a `TypeError`). You must convert the number to a string first using `str()`.

---

## Exercise 3: Working with Input Strings

In coding, information that a user enters is known as **input**. You will use a built-in function named `input()` to get information from the user. The `input()` function will pause the code until a user enters a string and presses **ENTER**.

### Objectives

- Use the `input()` function to prompt the user for their name.
- Store the user's input in a variable.
- Print the value of the variable to the console.

### Instructions

1. Return to the Python script.

2. Enter the following code:

    ```python
    name = input("What is your name? ")
    ```

3. Use the `print()` function to write the value of the variable to the shell:

    ```python
    print(name)
    ```

4. **Save** the file.

5. In the terminal, run the file:

    ```bash
    python3 filename.py
    ```

6. Confirm that the script runs correctly and that the output displays as you expect it to.

    **Expected Output:**
    ```
    This is a string.
    <class 'str'>
    This is a string. is of the data type <class 'str'>
    waterfall
    What is your name? Maria
    Maria
    ```

### Key Concepts

| Function | Description |
|----------|-------------|
| `input(prompt)` | Displays the `prompt` string to the user and waits for them to type input and press **ENTER**. The input is always returned as a string. |

> **Tip:** The `input()` function always returns a string, even if the user types a number. If you need to perform arithmetic on user input, you must convert it using `int()` or `float()`.

---

## Exercise 4: Formatting Output Strings

When your script wants to communicate information back to the user, it is called **output**. You have been using the `print()` function to write output to the shell. You will create a survey and output the information that it collects back to the user.

### Objectives

- Collect multiple pieces of user input (favorite color and favorite animal).
- Use the `format()` method to create a formatted output string.
- Display the formatted string to the user.

### Instructions

1. Return to the Python script and enter the following code:

    ```python
    color = input("What is your favorite color?  ")
    animal = input("What is your favorite animal?  ")
    ```

2. You have been using the `print()` function with only one variable, but you can also use it with multiple variables to format a string. Enter the following code:

    ```python
    print("{}, you like a {} {}!".format(name, color, animal))
    ```

3. **Save** the file.

4. In the terminal, run the file:

    ```bash
    python3 filename.py
    ```

5. The Python shell has stopped and is waiting for your input.

    - Enter a **name** and press **ENTER**.
    - Next, you are asked for your favorite **color**. Enter a color and press **ENTER**.
    - Next, you are asked for your favorite **animal**. Enter an animal and press **ENTER**.

6. Finally, the script prints a formatted string to the user by using the three pieces of information that you provided. Confirm that the output in the shell looks like the following output.

    **Expected Output:**
    ```
    This is a string.
    <class 'str'>
    This is a string. is of the data type <class 'str'>
    waterfall
    What is your name? Maria
    Maria
    What is your favorite color?  blue
    What is your favorite animal?  dog
    Maria, you like a blue dog!
    ```

### Key Concepts

| Method | Description | Example |
|--------|-------------|---------|
| `str.format()` | Replaces `{}` placeholders in a string with the provided arguments. | `"Hello, {}!".format("World")` → `"Hello, World!"` |

> **Note:** The final `print()` statement uses the `format()` function. In the `format()` function, the opening and closing braces (`{}`) act as **placeholders** for the variables that will be passed to (that is, put between) the function's parentheses.

---

## Summary

Congratulations! You have used Python to:

1. ✅ Work with the **string data type**
2. ✅ **Concatenate** strings using the `+` operator
3. ✅ Collect **input** from the user using `input()`
4. ✅ **Format** output strings using the `format()` method

### Quick Reference

| Task | Code Example |
|------|--------------|
| Declare a string | `myString = "Hello"` |
| Check data type | `type(myString)` |
| Convert to string | `str(42)` |
| Concatenate strings | `"Hello" + " " + "World"` |
| Get user input | `name = input("Enter name: ")` |
| Format a string | `"Hello, {}!".format(name)` |

---

## Additional Resources

- [Python Official Documentation: Strings](https://docs.python.org/3/library/string.html)
- [Python Official Documentation: input()](https://docs.python.org/3/library/functions.html#input)
- [Python Official Documentation: str.format()](https://docs.python.org/3/library/stdtypes.html#str.format)

---

*End of Lab*
