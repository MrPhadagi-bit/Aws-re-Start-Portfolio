# Working with Numeric Data Types: Lab Overview

Python makes it easier to do math. In fact, Python is a popular language among data scientists, who must analyze large amounts of data. In this lab, you will explore the basic data types that are used to store numeric values.

## Learning Objectives

In this lab, you will:

- Use the Python shell
- Use the `int` data type
- Use the `float` data type
- Use the `complex` data type
- Use the `bool` data type

## Estimated Completion Time

60 minutes

---

## Prerequisites

- A terminal with Python 3 installed
- A text editor or IDE (e.g., VS Code, PyCharm, or any code editor)

---

## Exercise 1: Using the Python Shell

The Python shell is an interactive environment where you can execute Python commands one at a time.

### Step 1: Start the Python Shell

In your terminal, enter the following command to start the Python shell:

```bash
python3
```

You should see output similar to:

```
Python 3.11 (default, Aug 31 2020, 18:56:18)
[GCC 11.4.1 20230605 (Red Hat 11.4.1-2)] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>>
```

> **Note:** The three greater-than symbols (`>>>`) represent the prompt where you can enter Python commands.

### Step 2: Addition

Enter the following input:

```python
2 + 2
```

Press **ENTER**.

**Expected Output:**

```
4
```

### Step 3: Subtraction

Enter the following input:

```python
4 - 2
```

Press **ENTER**.

**Expected Output:**

```
2
```

### Step 4: Multiplication

To multiply, use the `*` symbol:

Enter the following input:

```python
2 * 2
```

Press **ENTER**.

**Expected Output:**

```
4
```

### Step 5: Division

To divide, use the `/` symbol:

Enter the following input:

```python
4 / 2
```

Press **ENTER**.

**Expected Output:**

```
2.0
```

> **Note:** Division in Python always returns a `float`, even if the result is a whole number.

### Step 6: Exit the Python Shell

To exit the Python shell, enter:

```python
quit()
```

---

## Exercise 2: Introducing the `int` Data Type

Instead of entering commands one by one in the Python shell, you will now create a Python file that contains a sequence of commands.

### Step 1: Create a Python File

Create a new file named `numeric_data_types.py` in your project directory.

### Step 2: Print an Introduction Message

In your file, enter the following code:

```python
print("Python has three numeric types: int, float, and complex")
```

Save the file.

### Step 3: Run the File

In your terminal, run the file:

```bash
python3 numeric_data_types.py
```

**Expected Output:**

```
Python has three numeric types: int, float, and complex
```

### Step 4: Create a Variable

A variable is like a labeled box that stores information. You can change the contents of the box, but the label stays the same.

In your file, add the following code on a new line:

```python
myValue = 1
```

### Step 5: Print the Variable Value

Use the `print()` function to write the value of the variable to the shell:

```python
print(myValue)
```

### Step 6: Get the Data Type

To get the data type of the variable, use the `type()` built-in function:

```python
print(type(myValue))
```

### Step 7: Combine Numbers and Text

To combine numbers and text, use the `str()` built-in function, which converts an argument into a string:

```python
print(str(myValue) + " is of the data type " + str(type(myValue)))
```

### Step 8: Save and Run

Save the file and run it:

```bash
python3 numeric_data_types.py
```

**Expected Output:**

```
Python has three numeric types: int, float, and complex
1
<class 'int'>
1 is of the data type <class 'int'>
```

---

## Exercise 3: Introducing the `float` Data Type

The `int` data type only stores whole numbers. If you want to store a number with a decimal, like `3.14`, you need a new data type called `float`.

### Step 1: Assign a Float Value

In your file, add the following code on a new line:

```python
myValue = 3.14
```

### Step 2: Print the Float Value

```python
print(myValue)
```

### Step 3: Get the Data Type

```python
print(type(myValue))
```

### Step 4: Combine Text and Float

```python
print(str(myValue) + " is of the data type " + str(type(myValue)))
```

### Step 5: Save and Run

Save the file and run it:

```bash
python3 numeric_data_types.py
```

**Expected Output:**

```
Python has three numeric types: int, float, and complex
1
<class 'int'>
1 is of the data type <class 'int'>
3.14
<class 'float'>
3.14 is of the data type <class 'float'>
```

---

## Exercise 4: Introducing the `complex` Data Type

In advanced math, an imaginary number is a complex number that can be written as a real number multiplied by the imaginary unit `i`. In Python, this is represented using `j` (e.g., `5j`).

### Step 1: Assign a Complex Value

In your file, add the following code on a new line:

```python
myValue = 5j
```

### Step 2: Print the Complex Value

```python
print(myValue)
```

### Step 3: Get the Data Type

```python
print(type(myValue))
```

### Step 4: Combine Text and Complex

```python
print(str(myValue) + " is of the data type " + str(type(myValue)))
```

### Step 5: Save and Run

Save the file and run it:

```bash
python3 numeric_data_types.py
```

**Expected Output:**

```
Python has three numeric types: int, float, and complex
1
<class 'int'>
1 is of the data type <class 'int'>
3.14
<class 'float'>
3.14 is of the data type <class 'float'>
5j
<class 'complex'>
5j is of the data type <class 'complex'>
```

---

## Exercise 5: Introducing the `bool` Data Type

The `bool` (Boolean) data type comprises the permanent names `True` and `False`, which are represented by the numerals `1` and `0`, where `1 = True` and `0 = False`. The `bool` data type is implemented as a subset of `int` and is not considered a real data type. However, in some programming languages, it is implemented as a different data type. These exercises call the Python `bool` a "fake" data type.

### Part A: `True`

#### Step 1: Assign `True`

In your file, add the following code on a new line:

```python
myValue = True
```

#### Step 2: Print the Boolean Value

```python
print(myValue)
```

#### Step 3: Get the Data Type

```python
print(type(myValue))
```

#### Step 4: Combine Text and Boolean

```python
print(str(myValue) + " is of the data type " + str(type(myValue)))
```

### Part B: `False`

#### Step 5: Assign `False`

In your file, add the following code on a new line:

```python
myValue = False
```

#### Step 6: Print the Boolean Value

```python
print(myValue)
```

#### Step 7: Get the Data Type

```python
print(type(myValue))
```

#### Step 8: Combine Text and Boolean

```python
print(str(myValue) + " is of the data type " + str(type(myValue)))
```

### Step 9: Save and Run

Save the file and run it:

```bash
python3 numeric_data_types.py
```

**Expected Output:**

```
Python has three numeric types: int, float, and complex
1
<class 'int'>
1 is of the data type <class 'int'>
3.14
<class 'float'>
3.14 is of the data type <class 'float'>
5j
<class 'complex'>
5j is of the data type <class 'complex'>
True
<class 'bool'>
True is of the data type <class 'bool'>
False
<class 'bool'>
False is of the data type <class 'bool'>
```

---

## Summary

Congratulations! You have learned about Python's three numeric data types: `int`, `float`, and `complex`. Additionally, you were introduced to the Python "fake" data type called `bool`. Note that `bool` is actually the numerals `0` and `1`, which represent the values of `False` and `True`.

### Key Takeaways

| Data Type | Description | Example |
|-----------|-------------|---------|
| `int` | Whole numbers (positive or negative) | `1`, `-5`, `100` |
| `float` | Numbers with decimal points | `3.14`, `-0.5`, `2.0` |
| `complex` | Numbers with a real and imaginary part | `5j`, `3+4j` |
| `bool` | Boolean values: `True` or `False` | `True`, `False` |

### Built-in Functions Used

- `print()`: Outputs text or values to the console
- `type()`: Returns the data type of a value or variable
- `str()`: Converts a value to a string
- `quit()`: Exits the Python shell

---

## Next Steps

Now that you understand Python's numeric data types, you can explore:

- Arithmetic operations and expressions
- Type conversion and casting
- Working with variables and assignments
- Python's built-in math library

---

*End of Lab*
