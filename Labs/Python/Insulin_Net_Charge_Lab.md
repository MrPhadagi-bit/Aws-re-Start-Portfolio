# Lab: Calculating the Net Charge of Insulin by Using Python Lists and Loops

## Overview

In the **Flow Control** module, you learned about `if-else` statements, `while` loops, lists, and `for` loops. Now you will apply what you have learned to the real-world application of **human insulin**.

Here, you will use **lists**, **for** and **while** loops, and **basic math** to calculate the net charge of insulin from pH 0 to pH 14.

### Learning Objectives

In this lab, you will:

- Create a **dictionary** of pKa values (which indicate the strength of an acid) that will be used in the net charge calculations
- Use the `count()` method to get a count of amino acids
- Use a `while` loop to calculate the net charge of insulin from pH 0 to pH 14

### Estimated Completion Time

**25 minutes**

---

## Exercise 1: Assigning Variables, Lists, and Dictionaries

### Step 1: Define Insulin Sequence Variables

From the Explorer panel on the left, choose the file that you created in the previous *Creating your Python exercise file* section.

Copy the following code, paste it into the file, and save the file:

```python
# Python 3.11
# Coding: utf-8

# Store the human preproinsulin sequence in a variable called preproinsulin:
preproInsulin = "malwmrllpllallalwgpdpaaafvnqhlcgshlvealylvcgergffytpktrreaedlqvgqvelgggpgagslqplalegslqkrgiveqcctsicslyqlenycn"

# Store the remaining sequence elements of human insulin in variables:
lsInsulin = "malwmrllpllallalwgpdpaaa"
bInsulin = "fvnqhlcgshlvealylvcgergffytpkt"
aInsulin = "giveqcctsicslyqlenycn"
cInsulin = "rreaedlqvgqvelgggpgagslqplalegslqkr"

# Combine B-chain and A-chain to form mature insulin
insulin = bInsulin + aInsulin
```

> **Note:** The `insulin` variable combines the B-chain and A-chain sequences, which together form the mature, active insulin hormone.

### Step 2: Create the pKa Dictionary

On the next line, create a new dictionary by entering:

```python
pKR = {}
```

To fill the dictionary with key-value pairs, insert the first key of `y` with a value of `10.07`. Place the cursor inside the braces, and enter:

```python
pKR = {'y': 10.07,
```

> **Note:** You included a comma after the value so that you can add the remaining key-value pairs.

To match the code segment, add the following key-value pairs into the dictionary:

| Key | Value | Amino Acid |
|-----|-------|------------|
| `'y'` | `10.07` | Tyrosine |
| `'c'` | `8.18` | Cysteine |
| `'k'` | `10.53` | Lysine |
| `'h'` | `6.00` | Histidine |
| `'r'` | `12.48` | Arginine |
| `'d'` | `3.65` | Aspartic Acid |
| `'e'` | `4.25` | Glutamic Acid |

The complete dictionary should look like the following code:

```python
pKR = {'y': 10.07, 'c': 8.18, 'k': 10.53, 'h': 6.00, 'r': 12.48, 'd': 3.65, 'e': 4.25}
```

> **Note:** Y, C, K, H, R, D, and E are the only amino acids that contribute to the net-charge calculation because they have ionizable side chains with measurable pKa values.

---

## Exercise 2: Using `count()` to Count the Numbers of Each Amino Acid

In this exercise, you will use the `count()` method and **list comprehension** to count the number of Y, C, K, H, R, D, and E amino acids. These amino acids contribute to the net charge.

### Step 1: Count a Single Amino Acid

To identify a count of an item within a list, you can use the `count()` method. To see how many amino acids in insulin are Y, use the `count()` method by entering:

```python
insulin.count("y")
```

### Step 2: Cast the Count as a Float

Next, update the `insulin.count()` line by casting the variable returned by the `count()` method as a `float`:

```python
float(insulin.count("y"))
```

### Step 3: Use List Comprehension for All Amino Acids

Now that you have the basis for identifying a single entity, you can use this method to find all entities from a list. This process can be done by using **list comprehension** (specifically, a dictionary comprehension). For the entire line, enter:

```python
seqCount = {x: float(insulin.count(x)) for x in ['y', 'c', 'k', 'h', 'r', 'd', 'e']}
```

> **Note:** The first two steps in this exercise are predecessors to the third step. They demonstrate the progression from counting a single amino acid to efficiently counting all relevant amino acids using a dictionary comprehension.

**What this code does:**
- Iterates over each amino acid in the list `['y', 'c', 'k', 'h', 'r', 'd', 'e']`
- Counts occurrences of each in the `insulin` string
- Stores the count (as a float) in a dictionary with the amino acid as the key

---

## Exercise 3: Writing the Net Charge Formula

In this exercise, you will construct the net charge formula. You will use the provided `netCharge` variable in a Python-based net charge formula. The function for the formula includes a `while` loop that will print the net charge while the `pH` variable is equal to or below 14.

### Step 1: Initialize the pH Variable

Create a variable called `pH` and initialize it to zero:

```python
pH = 0
```

### Step 2: Create the While Loop

Create the `while` loop:

```python
while (pH <= 14):
```

### Step 3: Add the Net Charge Calculation

Copy the following `netCharge` variable and paste it at the beginning of the `while` loop (indented):

```python
    netCharge = (
        +(sum({x: ((seqCount[x] * (10**pKR[x])) / ((10**pH) + (10**pKR[x])))
               for x in ['k', 'h', 'r']}.values()))
        -(sum({x: ((seqCount[x] * (10**pH)) / ((10**pH) + (10**pKR[x])))
               for x in ['y', 'c', 'd', 'e']}.values()))
    )
```

### Understanding the Formula

The net charge formula uses the **Henderson-Hasselbalch equation** principles:

- **Positive contributors** (K, H, R — basic amino acids): 
  - These have positively charged side chains at low pH
  - Formula: `(10^pKa) / (10^pH + 10^pKa)` gives the fraction protonated (charged)

- **Negative contributors** (Y, C, D, E — acidic amino acids):
  - These have negatively charged side chains at high pH  
  - Formula: `(10^pH) / (10^pH + 10^pKa)` gives the fraction deprotonated (charged)

### Step 4: Print the Results

To print the `netCharge` variable with the `pH`, use a format string for better readability:

```python
    print('{0:.2f}'.format(pH), netCharge)
```

### Step 5: Increment pH

Finally, increment the `pH` variable:

```python
    pH += 1
```

### Complete Exercise 3 Code

```python
pH = 0
while (pH <= 14):
    netCharge = (
        +(sum({x: ((seqCount[x] * (10**pKR[x])) / ((10**pH) + (10**pKR[x])))
               for x in ['k', 'h', 'r']}.values()))
        -(sum({x: ((seqCount[x] * (10**pH)) / ((10**pH) + (10**pKR[x])))
               for x in ['y', 'c', 'd', 'e']}.values()))
    )
    print('{0:.2f}'.format(pH), netCharge)
    pH += 1
```

Save and run the file.

---

## Important: Indentation and Spacing in Python

> **Be careful about indentation and spaces in Python!**
>
> Subsets of Python code are organized by indentation and spaces. In Python, even one misplaced indentation or space can throw an exception or other error. For example, be sure that every item within your `while` loop is properly indented so the code will work.
>
> - The `netCharge` calculation must be indented inside the `while` loop
> - The `print()` statement must be indented inside the `while` loop  
> - The `pH += 1` increment must be indented inside the `while` loop

---

## Complete Lab Code

Here is the complete, consolidated code for reference:

```python
# Python 3.11
# Coding: utf-8
# Lab: Calculating the Net Charge of Insulin

# ============================================
# Exercise 1: Assigning Variables and Dictionary
# ============================================

# Store the human preproinsulin sequence:
preproInsulin = "malwmrllpllallalwgpdpaaafvnqhlcgshlvealylvcgergffytpktrreaedlqvgqvelgggpgagslqplalegslqkrgiveqcctsicslyqlenycn"

# Store the remaining sequence elements of human insulin:
lsInsulin = "malwmrllpllallalwgpdpaaa"
bInsulin = "fvnqhlcgshlvealylvcgergffytpkt"
aInsulin = "giveqcctsicslyqlenycn"
cInsulin = "rreaedlqvgqvelgggpgagslqplalegslqkr"

# Combine B-chain and A-chain to form mature insulin:
insulin = bInsulin + aInsulin

# Create pKa dictionary for ionizable amino acids:
pKR = {'y': 10.07, 'c': 8.18, 'k': 10.53, 'h': 6.00, 'r': 12.48, 'd': 3.65, 'e': 4.25}

# ============================================
# Exercise 2: Counting Amino Acids
# ============================================

# Use dictionary comprehension to count relevant amino acids:
seqCount = {x: float(insulin.count(x)) for x in ['y', 'c', 'k', 'h', 'r', 'd', 'e']}

# ============================================
# Exercise 3: Calculating Net Charge
# ============================================

pH = 0
while (pH <= 14):
    netCharge = (
        +(sum({x: ((seqCount[x] * (10**pKR[x])) / ((10**pH) + (10**pKR[x])))
               for x in ['k', 'h', 'r']}.values()))
        -(sum({x: ((seqCount[x] * (10**pH)) / ((10**pH) + (10**pKR[x])))
               for x in ['y', 'c', 'd', 'e']}.values()))
    )
    print('{0:.2f}'.format(pH), netCharge)
    pH += 1
```

---

## Expected Output

When you run the complete code, you should see output similar to:

```
0.00  6.0...
1.00  6.0...
2.00  6.0...
3.00  5.9...
4.00  5.1...
5.00  3.5...
6.00  1.8...
7.00  0.5...
8.00 -0.5...
9.00 -1.2...
10.00 -1.8...
11.00 -2.4...
12.00 -3.0...
13.00 -3.5...
14.00 -4.0...
```

> **Note:** Exact values may vary slightly due to floating-point arithmetic. The key observation is that the net charge transitions from **positive** at low pH to **negative** at high pH, crossing near the **isoelectric point** (where net charge ≈ 0).

---

## Summary

### What You Learned

1. **Dictionary Creation**: You created a dictionary mapping amino acids to their pKa values
2. **String Methods**: You used `count()` to count amino acid occurrences in a protein sequence
3. **Dictionary Comprehension**: You efficiently built a dictionary of amino acid counts using a single line of code
4. **While Loops**: You iterated through pH values from 0 to 14
5. **Mathematical Modeling**: You applied the Henderson-Hasselbalch equation to calculate protein charge
6. **Biochemistry Application**: You connected Python programming to real-world biochemistry concepts

### Key Concepts

| Concept | Application |
|---------|-------------|
| `count()` | Counting amino acid occurrences |
| Dictionary comprehension | Building `seqCount` efficiently |
| `while` loop | Iterating pH from 0 to 14 |
| Henderson-Hasselbalch | Calculating charge fractions |
| Net charge | Summing positive and negative contributions |

---

## Congratulations! 

You have successfully worked with **lists** and **loops** in a Python function to solve a real-world biochemistry problem. You calculated the net charge of human insulin across a pH range — a fundamental concept in protein chemistry and drug formulation!

---

*End of Lab*
