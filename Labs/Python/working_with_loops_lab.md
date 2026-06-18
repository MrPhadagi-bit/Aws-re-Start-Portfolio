# Working with Loops: Lab Overview

A loop is a segment of code that repeats. You will be introduced to two types of loops: the **while loop** and the **for loop**.

In this lab, you will:

- Use a `while` loop
- Use a `for` loop

## Estimated Completion Time

45 minutes

---

## Table of Contents

1. [Exercise 1: Working with a `while` Loop](#exercise-1-working-with-a-while-loop)
2. [Exercise 2: Working with a `for` Loop](#exercise-2-working-with-a-for-loop)

---

## Prerequisites

- Python 3.x installed
- A text editor or IDE (e.g., VS Code, PyCharm, or a simple text editor)
- Basic understanding of Python syntax (`print()`, `input()`, variables)

---

## Exercise 1: Working with a `while` Loop

A `while` loop makes a section of code repeat until a certain condition is met. In this exercise, you will create a Python script that asks the user to correctly guess a number.

### Step 1: Create the Game Rules

Create a new file named `guess_the_number.py`.

Use the `print()` function to inform the user about your game:

```python
print("Welcome to Guess the Number!")
print("The rules are simple. I will think of a number, and you will try to guess it.")
```

Save and run the file to confirm the output displays as expected.

### Step 2: Import `random` and Write the `while` Loop

At the **top** of the file, include the `random` module:

```python
import random
```

> **Note:** By convention, `import` statements are placed at the top of the script.

After the second `print()` statement, generate a random number between 1 and 10 using `randint()`:

```python
number = random.randint(1, 10)
```

Track whether the user guessed correctly by creating a variable:

```python
isGuessRight = False
```

Create a `while` loop to handle the game logic:

```python
while isGuessRight != True:
    guess = input("Guess a number between 1 and 10: ")
    if int(guess) == number:
        print("You guessed {}. That is correct! You win!".format(guess))
        isGuessRight = True
    else:
        print("You guessed {}. Sorry, that isn't it. Try again.".format(guess))
```

> **Note:** The `while` loop repeats until `isGuessRight` becomes `True`. Python uses **indentation** (typically 4 spaces or a TAB) to determine what statements belong inside the loop.

Save the file.

### Step 3: Write Pseudocode

Before running the script, write out the logic in plain English. This technique is called **pseudocoding**.

Example pseudocode:

```
If the user has not guessed the correct answer, enter the loop.
    Ask the user for a guess.
    Is the guess the correct number?
    If the correct guess:
        Tell the user it was correct.
        Exit the loop.
    If the wrong guess:
        Tell the user it was wrong.
        Continue the loop.
```

### Step 4: Run the Script

Run the file in your terminal:

```bash
python3 guess_the_number.py
```

Confirm that:
- The script runs without errors
- The game prompts you for guesses
- The loop exits when you guess the correct number

### Step 5: Add Comments

Add comments to your code to explain what each section does. Comments start with `#` and are ignored by Python.

```python
# Import the random module to generate random numbers
import random

# Welcome message
print("Welcome to Guess the Number!")
print("The rules are simple. I will think of a number, and you will try to guess it.")

# Generate a random number between 1 and 10
number = random.randint(1, 10)

# Flag to track if the user guessed correctly
isGuessRight = False

# Loop until the user guesses correctly
while isGuessRight != True:
    guess = input("Guess a number between 1 and 10: ")
    if int(guess) == number:
        print("You guessed {}. That is correct! You win!".format(guess))
        isGuessRight = True
    else:
        print("You guessed {}. Sorry, that isn't it. Try again.".format(guess))
```

---

## Exercise 2: Working with a `for` Loop

In Python, a `for` loop iterates over a sequence of items. This feature makes Python relatively easy to write compared to other programming languages, but it can also make code more difficult to read if you're unfamiliar with the syntax. In this exercise, you will use the `for` statement to count to 10.

### Step 1: Inform the User About the Script

Create a new file named `for-loop.py`.

Use the `print()` function to inform the user:

```python
print("Count to 10!")
```

Save and run the file to confirm the output displays correctly.

### Step 2: Write the `for` Loop

Return to the script and add the following code to count from 0 to 10:

```python
for x in range(0, 11):
    print(x)
```

> **Note:** Python uses indentation to determine that the `print` statement is inside the `for` loop.

Save and run the file.

### Understanding the `for` Loop

Here is an explanation of what happens in those two lines:

| Component | Description |
|-----------|-------------|
| `for x in range(0, 11):` | The `for` keyword tells Python to iterate over a sequence. |
| `range(0, 11)` | Generates a list of numbers starting at `0` and ending **before** `11` (i.e., 0 through 10). |
| `x` | Acts as a variable. Each time through the loop, `x` is assigned the next number in the sequence. |
| `print(x)` | Outputs the current value of `x` to the screen. |

### Final Code for `for-loop.py`

```python
# Inform the user about the script
print("Count to 10!")

# Use a for loop to count from 0 to 10
for x in range(0, 11):
    print(x)
```

---

## Summary

Congratulations! You have worked with both `while` and `for` loops in Python.

| Loop Type | Use Case |
|-----------|----------|
| `while` | Repeats code **while a condition is true** (unknown number of iterations). |
| `for` | Repeats code **for each item in a sequence** (known number of iterations). |

### Key Takeaways

- `while` loops are ideal when you don't know how many times the loop needs to run.
- `for` loops are ideal when iterating over a known sequence or range.
- Python relies on **indentation** to define code blocks inside loops.
- Adding **comments** improves code readability and maintainability.
- **Pseudocode** helps you plan your logic before writing actual code.

---

## Additional Resources

- [Python `while` loops - Official Documentation](https://docs.python.org/3/reference/compound_stmts.html#while)
- [Python `for` loops - Official Documentation](https://docs.python.org/3/reference/compound_stmts.html#for)
- [Python `random` module - Official Documentation](https://docs.python.org/3/library/random.html)
- [Python `range()` function - Official Documentation](https://docs.python.org/3/library/stdtypes.html#range)

---

## License

This lab content is provided for educational purposes.
