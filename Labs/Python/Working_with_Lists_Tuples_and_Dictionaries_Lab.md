# Working with Lists, Tuples, and Dictionaries in Python

> **Level:** Beginner  
> **Estimated Time:** 45 minutes  
> **Prerequisites:** Basic Python syntax, understanding of variables and the `print()` function

---

## Overview

In Python, string and numeric data types are often used in groups called **collections**. Three such collections that Python supports are the **list**, the **tuple**, and the **dictionary**.

In this lab, you will:

- [x] Use the **list** data type
- [x] Use the **tuple** data type
- [x] Use the **dictionary** data type

## Exercise 1: Introducing the List Data Type

> **Estimated Time:** 15 minutes

A **list** is an ordered, mutable (changeable) collection of items. Lists are defined using square brackets `[]`.

### 1.1 Defining a List

In this activity, you will create a Python script to hold a collection of fruit names.

**Instructions:**

1. Create a new Python file (e.g., `lab_collections.py`).
2. Enter the following code:

```python
# Define a list of fruit names
myFruitList = ["apple", "banana", "cherry"]

# Print the entire list
print(myFruitList)

# Print the data type of myFruitList
print(type(myFruitList))
```

3. Save and run the file.

**Expected Output:**

```
['apple', 'banana', 'cherry']
<class 'list'>
```

> **Key Concept:** The `type()` function reveals that `myFruitList` is an object of the `list` class.

---

### 1.2 Accessing a List by Position

You can access the contents of a list by its **index** (position). In Python, list indexing starts at **zero (0)**.

**Instructions:**

Add the following code to your file:

```python
# Access list items by their index position
# Index 0 = first item
print(myFruitList[0])   # Output: apple

# Index 1 = second item
print(myFruitList[1])   # Output: banana

# Index 2 = third item
print(myFruitList[2])   # Output: cherry
```

**Expected Output:**

```
apple
banana
cherry
```

> **Key Concept:** The square brackets `[]` after the variable name tell Python which position in the list you want to access.

---

### 1.3 Changing Values in a List

Lists are **mutable**, meaning their values can be changed after creation.

**Instructions:**

Add the following code to your file:

```python
# Change the value at index 2 (third position) from "cherry" to "orange"
myFruitList[2] = "orange"

# Print the updated list
print(myFruitList)
```

**Expected Output:**

```
['apple', 'banana', 'orange']
```

> **Key Concept:** Because lists are mutable, you can reassign values using the index assignment syntax: `list[index] = new_value`.

---

## Exercise 2: Introducing the Tuple Data Type

> **Estimated Time:** 15 minutes

A **tuple** is similar to a list, but it is **immutable** — it cannot be changed after it is created. Tuples are defined using parentheses `()`.

### 2.1 Defining a Tuple

**Instructions:**

Add the following code to your file:

```python
# Define a tuple of fruit names
myFinalAnswerTuple = ("apple", "banana", "pineapple")

# Print the entire tuple
print(myFinalAnswerTuple)

# Print the data type of myFinalAnswerTuple
print(type(myFinalAnswerTuple))
```

**Expected Output:**

```
('apple', 'banana', 'pineapple')
<class 'tuple'>
```

> **Key Concept:** A data type that cannot be changed after creation is said to be **immutable**. Tuples use `()` instead of `[]`.

---

### 2.2 Accessing a Tuple by Position

Like lists, tuple items can be accessed by their index position.

**Instructions:**

Add the following code to your file:

```python
# Access tuple items by their index position
print(myFinalAnswerTuple[0])   # Output: apple
print(myFinalAnswerTuple[1])   # Output: banana
print(myFinalAnswerTuple[2])   # Output: pineapple
```

**Expected Output:**

```
apple
banana
pineapple
```

> **Key Concept:** Tuple indexing works exactly like list indexing, starting at 0.

---

### 2.3 Immutability Demonstration (Optional)

Try the following code to see immutability in action:

```python
# This will raise a TypeError because tuples are immutable
# myFinalAnswerTuple[0] = "orange"
```

> **Error:** `TypeError: 'tuple' object does not support item assignment`

---

## Exercise 3: Introducing the Dictionary Data Type

> **Estimated Time:** 15 minutes

A **dictionary** is a collection of key-value pairs. Unlike lists and tuples, dictionaries use **named positions (keys)** instead of numeric indexes. Dictionaries are defined using curly braces `{}`.

### 3.1 Defining a Dictionary

Imagine a dictionary that maps people's names to their favorite fruits.

**Instructions:**

Add the following code to your file:

```python
# Define a dictionary with names as keys and favorite fruits as values
myFavoriteFruitDictionary = {
    "Akua": "apple",
    "Saanvi": "banana",
    "Paulo": "pineapple"
}

# Print the entire dictionary
print(myFavoriteFruitDictionary)

# Print the data type
print(type(myFavoriteFruitDictionary))
```

**Expected Output:**

```
{'Akua': 'apple', 'Saanvi': 'banana', 'Paulo': 'pineapple'}
<class 'dict'>
```

> **Key Concept:** Each entry in a dictionary consists of a **key** and a **value**, separated by a colon `:`. Keys must be unique.

---

### 3.2 Accessing a Dictionary by Name

In this activity, you will use the **name (key)** of each person to retrieve their favorite fruit.

**Instructions:**

Add the following code to your file:

```python
# Access values using their keys
print(myFavoriteFruitDictionary["Akua"])     # Output: apple
print(myFavoriteFruitDictionary["Saanvi"])   # Output: banana
print(myFavoriteFruitDictionary["Paulo"])    # Output: pineapple
```

**Expected Output:**

```
apple
banana
pineapple
```

> **Key Concept:** Instead of numeric indexes like `list[0]`, dictionaries use keys like `dict["key"]` to access values.

---

## Summary

| Feature | List | Tuple | Dictionary |
|---------|------|-------|------------|
| **Syntax** | `[]` | `()` | `{}` |
| **Ordered** |  Yes |  Yes |  Yes (Python 3.7+) |
| **Mutable** |  Yes |  No (Immutable) |  Yes |
| **Indexed by** | Numeric index (0, 1, 2...) | Numeric index (0, 1, 2...) | Named keys |
| **Duplicates** |  Allowed |  Allowed |  Keys must be unique |
| **Use Case** | Changeable collections | Fixed collections | Key-value mappings |

---

## Full Script

Here is the complete script combining all three exercises:

```python
# ============================================
# Working with Lists, Tuples, and Dictionaries
# ============================================

# --- Exercise 1: Lists ---
myFruitList = ["apple", "banana", "cherry"]
print(myFruitList)
print(type(myFruitList))

print(myFruitList[0])
print(myFruitList[1])
print(myFruitList[2])

myFruitList[2] = "orange"
print(myFruitList)

# --- Exercise 2: Tuples ---
myFinalAnswerTuple = ("apple", "banana", "pineapple")
print(myFinalAnswerTuple)
print(type(myFinalAnswerTuple))

print(myFinalAnswerTuple[0])
print(myFinalAnswerTuple[1])
print(myFinalAnswerTuple[2])

# --- Exercise 3: Dictionaries ---
myFavoriteFruitDictionary = {
    "Akua": "apple",
    "Saanvi": "banana",
    "Paulo": "pineapple"
}
print(myFavoriteFruitDictionary)
print(type(myFavoriteFruitDictionary))

print(myFavoriteFruitDictionary["Akua"])
print(myFavoriteFruitDictionary["Saanvi"])
print(myFavoriteFruitDictionary["Paulo"])
```

**Complete Expected Output:**

```
['apple', 'banana', 'cherry']
<class 'list'>
apple
banana
cherry
['apple', 'banana', 'orange']
('apple', 'banana', 'pineapple')
<class 'tuple'>
apple
banana
pineapple
{'Akua': 'apple', 'Saanvi': 'banana', 'Paulo': 'pineapple'}
<class 'dict'>
apple
banana
pineapple
```

---

## Next Steps

- Explore **list methods** like `.append()`, `.remove()`, `.sort()`, and `.reverse()`
- Learn about **tuple unpacking**: `a, b, c = my_tuple`
- Discover **dictionary methods** like `.keys()`, `.values()`, `.items()`, and `.get()`
- Try nesting collections (e.g., a list of dictionaries)

---

*Congratulations! You have successfully worked with the list, tuple, and dictionary data types in Python.* 
