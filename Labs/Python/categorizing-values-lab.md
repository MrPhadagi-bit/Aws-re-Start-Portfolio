# Categorizing Values: Lab Overview

## Introduction

With Python, you can mix types in a list. In this lab, you will create a list with different types and print the values.

## Learning Objectives

In this lab, you will:

- ✅ Use **numeric data types**
- ✅ Use **string data types**
- ✅ Use the **list data type**
- ✅ Use a **for loop**
- ✅ Use the **`print()` function**

## Estimated Completion Time

⏱️ **30 minutes**

---

## Exercise 1: Creating a Mixed-Type List

### Overview

You can mix data types in a Python list. In other languages, this capability is not a feature of lists. In this exercise, you will explore this capability.

### Step-by-Step Instructions

#### Step 1: Open Your Python File

From the Explorer panel on the left, choose the `.py` file that you created in the previous **Creating your Python exercise file** section.

#### Step 2: Define a Mixed-Type List

Define a list with different types, like the following example:

```python
myMixedTypeList = [45, 290578, 1.02, True, "My dog is on the bed.", "45"]
```

> 💡 **Note:** Notice that the last element `"45"` is a **string** (enclosed in quotes), while the first element `45` is an **integer**. This distinction is important in Python!

#### Step 3: Loop Through the List

Use a `for` loop statement to traverse the list and print the data type for each item in the list:

```python
for item in myMixedTypeList:
    print("{} is of the data type {}".format(item, type(item)))
```

#### Step 4: Save and Run

Save the file and run it.

### Expected Output

Confirm that the script runs correctly and that the output displays as you expect it to:

```
45 is of the data type <class 'int'>
290578 is of the data type <class 'int'>
1.02 is of the data type <class 'float'>
True is of the data type <class 'bool'>
My dog is on the bed. is of the data type <class 'str'>
45 is of the data type <class 'str'>
```

### Complete Code

Here is the complete script for reference:

```python
# Exercise 1: Creating a Mixed-Type List
# This script demonstrates Python's ability to store different data types in a single list

# Define a list containing various data types
myMixedTypeList = [45, 290578, 1.02, True, "My dog is on the bed.", "45"]

# Iterate through each item in the list
for item in myMixedTypeList:
    # Print the item and its corresponding data type
    print("{} is of the data type {}".format(item, type(item)))
```

---

## Key Takeaways

This exercise reinforced the Python programming concepts that were covered in labs 1–6. Although the code has only a few lines, it is powerful. Take some time to review the code and make sure you understand everything that happens in it.

### What You Learned:

| Concept | Description |
|---------|-------------|
| `list` | A collection that can hold multiple items of different data types |
| `int` | Integer values (whole numbers) |
| `float` | Floating-point values (decimal numbers) |
| `bool` | Boolean values (`True` or `False`) |
| `str` | String values (text enclosed in quotes) |
| `type()` | Built-in function that returns the data type of an object |
| `for` loop | Iterates over each item in a sequence |

---

## 🎉 Congratulations!

You have worked with the **list data type** and learned about Python's support for mixing data types in a list declaration.

---

## Additional Resources

- [Python Lists - Official Documentation](https://docs.python.org/3/tutorial/datastructures.html)
- [Python Data Types](https://docs.python.org/3/library/stdtypes.html)

---

*End of Lab*
