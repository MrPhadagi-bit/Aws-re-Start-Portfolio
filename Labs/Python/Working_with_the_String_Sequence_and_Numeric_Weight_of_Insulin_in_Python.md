# Working with the String Sequence and Numeric Weight of Insulin in Python

## Lab Overview

This lab guides you through working with biological string data (amino acid sequences) and performing numeric calculations in Python. You will learn to:

- Assign and manipulate string variables containing insulin sequences
- Use Python's `print()` function for output
- Calculate molecular weight using dictionaries and comprehensions
- Understand data type casting and error percentage calculations

---

## Prerequisites

- Python 3.11 installed
- A text editor or IDE (VS Code, PyCharm, etc.)
- Basic understanding of Python syntax

---

## Exercise 1: Assigning Variables to the Sequence Elements of Human Insulin

### Objective
Create variables and assign string values representing different segments of the human insulin protein sequence.

### Background
Human insulin is synthesized as a precursor called **preproinsulin**, which is processed into the active hormone. The sequence can be broken down into:
- **Signal peptide** (removed during processing)
- **B-chain** (30 amino acids)
- **C-peptide** (connecting peptide, removed)
- **A-chain** (21 amino acids)

### Step-by-Step Instructions

#### 1. File Header Comments

Always start your Python file with descriptive comments. Python comments begin with `#`.

```python
#!/usr/bin/env python3.11
# -*- coding: utf-8 -*-
# Working with the String Sequence and Numeric Weight of Insulin in Python
```

> **Note:** The shebang line (`#!/usr/bin/env python3.11`) specifies the Python interpreter. The encoding declaration (`# -*- coding: utf-8 -*-`) ensures proper character handling.

#### 2. Store the Full Preproinsulin Sequence

```python
# Store the human preproinsulin sequence in a variable called preproinsulin:
preproInsulin = "malwmrllpllallalwgpdpaaafvnqhlcgshlvealylvcgergffytpktr" \
                "reaedlqvgqvelgggpgagslqplalegslqkrgiveqcctsicslyqlenycn"
```

> **PEP 8 Compliance:** The trailing backslash (`\`) is used to split long strings across multiple lines. [PEP 8](https://peps.python.org/pep-0008/) — Python's style guide — recommends a maximum of **79 characters per line** to improve readability. While Python will execute longer lines, adhering to this standard makes your code more maintainable and easier to review.

#### 3. Store Individual Sequence Components

```python
# Store the remaining sequence elements of human insulin in variables:

# Signal peptide (leader sequence, removed during processing)
lsInsulin = "malwmrllpllallalwgpdpaaa"

# B-chain of insulin (first chain of active hormone)
bInsulin = "fvnqhlcgshlvealylvcgergffytpkt"

# A-chain of insulin (second chain of active hormone)
aInsulin = "giveqcctsicslyqlenycn"

# C-peptide (connecting peptide, removed during maturation)
cInsulin = "rreaedlqvgqvelgggpgagslqplalegslqkr"
```

> **Naming Convention:** Variable names in Python typically use **camelCase** (lowercase first word, uppercase first letter of subsequent words, no underscores or spaces). This convention improves readability while keeping names concise. Examples: `preproInsulin`, `bInsulin`, `aInsulin`.

#### 4. Merge Sequence Components

Combine the B-chain and A-chain to form the mature insulin sequence:

```python
# Combine B-chain and A-chain to form mature insulin
insulin = bInsulin + aInsulin
```

> **String Concatenation:** The `+` operator joins two strings together. This creates the biologically active form of insulin, which consists of the B-chain and A-chain connected by disulfide bonds.

---

## Exercise 2: Verifying Sequence Integrity (Optional Check)

Before proceeding, it's good practice to verify that your sequences are correct:

```python
# Verify that the concatenated chains match the expected mature insulin sequence
# The mature insulin should be the B-chain followed by the A-chain
print("Length of preproinsulin:", len(preproInsulin))
print("Length of lsInsulin (signal peptide):", len(lsInsulin))
print("Length of bInsulin (B-chain):", len(bInsulin))
print("Length of cInsulin (C-peptide):", len(cInsulin))
print("Length of aInsulin (A-chain):", len(aInsulin))
print("Length of mature insulin:", len(insulin))
```

---

## Exercise 3: Using `print()` to Display Sequences

### Objective
Use Python's built-in `print()` function to output insulin sequences to the console.

### Step-by-Step Instructions

#### 1. Print Direct Strings

```python
# Printing "the sequence of human insulin" to console using successive print() commands:
print("The sequence of human preproinsulin:")
```

> **Behavior:** This `print()` statement outputs the exact string provided, with no additional formatting.

#### 2. Print Variable Contents

```python
# Print the content of the preproInsulin variable
print(preproInsulin)
```

> **Variable Printing:** When you pass a variable to `print()`, Python outputs the value stored in that variable. This is useful for debugging and verifying data.

#### 3. Concatenate Strings in `print()`

```python
# Printing to console using concatenated strings inside the print function (one-liner):
print("The sequence of human insulin, chain a: " + aInsulin)
```

> **String Concatenation in print():** The `+` operator joins the descriptive text with the variable content. Both operands must be strings; mixing data types (e.g., string + integer) will raise a `TypeError`.

#### 4. Using Multiple Arguments (Alternative Approach)

```python
# Alternative: Using multiple arguments in print()
# print() automatically inserts a space between arguments
print("The sequence of human insulin, chain a:", aInsulin)
```

> **Multiple Arguments:** The built-in `print()` function accepts multiple arguments separated by commas. By default, it inserts a space between each argument. This approach avoids explicit string concatenation and handles mixed data types gracefully.

#### 5. Complete Print Statements for All Chains

```python
# Display all insulin components
print("\n" + "="*60)
print("HUMAN INSULIN SEQUENCE COMPONENTS")
print("="*60)

print("\n1. Signal Peptide (lsInsulin):")
print(lsInsulin)

print("\n2. B-Chain (bInsulin):")
print(bInsulin)

print("\n3. C-Peptide (cInsulin):")
print(cInsulin)

print("\n4. A-Chain (aInsulin):")
print(aInsulin)

print("\n5. Mature Insulin (bInsulin + aInsulin):")
print(insulin)

print("\n" + "="*60)
```

---

## Exercise 4: Calculating the Rough Molecular Weight of Human Insulin

### Objective
Calculate the molecular weight of insulin using amino acid residue weights and compare with the accepted experimental value.

### Background
Each amino acid has a characteristic molecular weight. When amino acids link together to form a protein, water molecules are released (condensation reactions). This calculation provides a **rough estimate** because it does not account for:
- Disulfide bond formation (removes 2 H per bond)
- Post-translational modifications
- Three-dimensional structural constraints

### Step-by-Step Instructions

#### 1. Define Amino Acid Weights

```python
# Calculating the molecular weight of insulin

# Creating a dictionary of amino acid (AA) weights
# Keys are single-letter amino acid codes; values are average residue weights
aaWeights = {
    'A': 89.09,   # Alanine
    'C': 121.16,  # Cysteine
    'D': 133.10,  # Aspartic Acid
    'E': 147.13,  # Glutamic Acid
    'F': 165.19,  # Phenylalanine
    'G': 75.07,   # Glycine
    'H': 155.16,  # Histidine
    'I': 131.17,  # Isoleucine
    'K': 146.19,  # Lysine
    'L': 131.17,  # Leucine
    'M': 149.21,  # Methionine
    'N': 132.12,  # Asparagine
    'P': 115.13,  # Proline
    'Q': 146.15,  # Glutamine
    'R': 174.20,  # Arginine
    'S': 105.09,  # Serine
    'T': 119.12,  # Threonine
    'V': 117.15,  # Valine
    'W': 204.23,  # Tryptophan
    'Y': 181.19   # Tyrosine
}
```

> **Dictionary Data Structure:** Dictionaries in Python store key-value pairs. Here, each amino acid letter code maps to its average residue weight (in Daltons, Da). This structure enables O(1) lookup time when calculating weights.

#### 2. Count Amino Acids in Insulin

```python
# Count the number of each amino acid in the insulin sequence
# Using dictionary comprehension for concise, readable code

aaCountInsulin = {
    x: float(insulin.upper().count(x)) 
    for x in ['A', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 
              'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'Y']
}
```

> **Dictionary Comprehension:** This compact syntax creates a dictionary by iterating over a list of amino acid codes. For each amino acid `x`:
> - `insulin.upper().count(x)` counts occurrences (case-insensitive)
> - `float()` ensures numeric type for calculations
> - The result is stored with `x` as the key

#### 3. Calculate Molecular Weight

```python
# Multiply the count by the weights and sum all contributions
# Another dictionary comprehension calculates weight per amino acid, then sum()

molecularWeightInsulin = sum(
    {
        x: (aaCountInsulin[x] * aaWeights[x]) 
        for x in ['A', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K',
                  'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'Y']
    }.values()
)

print("The rough molecular weight of insulin: " + str(molecularWeightInsulin))
```

> **Calculation Breakdown:**
> 1. The inner comprehension creates a dictionary where each amino acid maps to its total weight contribution (count × weight)
> 2. `.values()` extracts just the numeric weights
> 3. `sum()` adds all contributions together
> 4. `str()` casts the numeric result to a string for concatenation

#### 4. Calculate Error Percentage

The actual molecular weight of human insulin is **5807.63 Da**. Our calculation yields a higher value because it doesn't account for water loss during peptide bond formation and disulfide bridges.

```python
# Actual molecular weight of human insulin (experimental value)
molecularWeightInsulinActual = 5807.63

# Calculate error percentage using the formula:
# error percentage = (| measured - accepted | / accepted) × 100%
# In this case, we use (measured - accepted) / accepted × 100%

errorPercentage = ((molecularWeightInsulin - molecularWeightInsulinActual) 
                  / molecularWeightInsulinActual) * 100

print("Error percentage: " + str(errorPercentage))
```

> **Type Casting:** When concatenating strings with numbers, Python requires explicit conversion. The `str()` function **casts** (converts) a numeric value to its string representation. Without this, Python raises a `TypeError` because you cannot concatenate different data types directly.

> **Absolute Error Note:** The formula uses absolute value for general error calculation. In this specific implementation, we observe the directional error (overestimation due to unaccounted water loss).

---

## Complete Lab Script

Below is the complete, consolidated Python script combining all exercises:

```python
#!/usr/bin/env python3.11
# -*- coding: utf-8 -*-
# =============================================================================
# Lab: Working with the String Sequence and Numeric Weight of Insulin in Python
# Description: Assign insulin sequences to variables, print them, and calculate
#              the molecular weight using amino acid residue weights.
# =============================================================================

# =============================================================================
# EXERCISE 1: Assigning Variables to Insulin Sequence Elements
# =============================================================================

# Store the human preproinsulin sequence in a variable called preproinsulin:
preproInsulin = "malwmrllpllallalwgpdpaaafvnqhlcgshlvealylvcgergffytpktr" \
                "reaedlqvgqvelgggpgagslqplalegslqkrgiveqcctsicslyqlenycn"

# Store the remaining sequence elements of human insulin in variables:
lsInsulin = "malwmrllpllallalwgpdpaaa"           # Signal peptide
bInsulin = "fvnqhlcgshlvealylvcgergffytpkt"       # B-chain
aInsulin = "giveqcctsicslyqlenycn"                # A-chain
cInsulin = "rreaedlqvgqvelgggpgagslqplalegslqkr"  # C-peptide

# Merge B-chain and A-chain to form mature insulin
insulin = bInsulin + aInsulin

# =============================================================================
# EXERCISE 3: Using print() to Display Sequences
# =============================================================================

# Printing "the sequence of human insulin" to console using successive print() commands:
print("The sequence of human preproinsulin:")
print(preproInsulin)

# Printing to console using concatenated strings inside the print function (one-liner):
print("The sequence of human insulin, chain a: " + aInsulin)

# Alternative using multiple arguments:
print("The sequence of human insulin, chain a:", aInsulin)

# =============================================================================
# EXERCISE 4: Calculating the Rough Molecular Weight of Human Insulin
# =============================================================================

# Creating a list of the amino acid (AA) weights
aaWeights = {
    'A': 89.09, 'C': 121.16, 'D': 133.10, 'E': 147.13, 'F': 165.19,
    'G': 75.07, 'H': 155.16, 'I': 131.17, 'K': 146.19, 'L': 131.17,
    'M': 149.21, 'N': 132.12, 'P': 115.13, 'Q': 146.15, 'R': 174.20,
    'S': 105.09, 'T': 119.12, 'V': 117.15, 'W': 204.23, 'Y': 181.19
}

# Count the number of each amino acid
aaCountInsulin = {
    x: float(insulin.upper().count(x))
    for x in ['A', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K',
              'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'Y']
}

# Multiply the count by the weights
molecularWeightInsulin = sum(
    {
        x: (aaCountInsulin[x] * aaWeights[x])
        for x in ['A', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K',
                  'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'Y']
    }.values()
)

print("The rough molecular weight of insulin: " + str(molecularWeightInsulin))

# Calculate error percentage
molecularWeightInsulinActual = 5807.63
errorPercentage = ((molecularWeightInsulin - molecularWeightInsulinActual)
                   / molecularWeightInsulinActual) * 100

print("Error percentage: " + str(errorPercentage))

# =============================================================================
# END OF LAB
# =============================================================================
```

---

## Expected Output

When you run the complete script, you should see output similar to:

```
The sequence of human preproinsulin:
malwmrllpllallalwgpdpaaafvnqhlcgshlvealylvcgergffytpktreaedlqvgqvelgggpgagslqplalegslqkrgiveqcctsicslyqlenycn
The sequence of human insulin, chain a: giveqcctsicslyqlenycn
The sequence of human insulin, chain a: giveqcctsicslyqlenycn
The rough molecular weight of insulin: 6696.42
Error percentage: 15.303...
```

> **Note on Error:** The calculated weight (~6696.42 Da) exceeds the actual weight (5807.63 Da) by approximately **15.3%**. This overestimation occurs because:
> 1. **Peptide bond formation** releases one water molecule (18.015 Da) per bond. For a 51-amino-acid protein, 50 water molecules are lost.
> 2. **Disulfide bonds** (3 in insulin) each release 2 hydrogen atoms.
> 3. The calculation uses **residue weights** but doesn't subtract the water mass lost during polymerization.

---

## Key Concepts Summary

| Concept | Description | Example |
|---------|-------------|---------|
| **Variable Assignment** | Storing data in named containers | `bInsulin = "fvnqhl..."` |
| **String Concatenation** | Joining strings with `+` | `insulin = bInsulin + aInsulin` |
| **PEP 8 Compliance** | Python style guide for readability | Line length ≤ 79 characters |
| **Dictionary** | Key-value data structure | `aaWeights = {'A': 89.09, ...}` |
| **Dictionary Comprehension** | Compact dictionary creation | `{x: count(x) for x in list}` |
| **Type Casting** | Converting between data types | `str(molecularWeightInsulin)` |
| **`print()` Function** | Output to console | `print("Text:", variable)` |

---

## Further Exploration

1. **Correct the Molecular Weight Calculation:** Modify the script to subtract water mass (18.015 Da × number of peptide bonds) and see how close you get to 5807.63 Da.

2. **Sequence Analysis:** Write a function that calculates the molecular weight for any protein sequence input.

3. **GC Content:** Calculate the percentage of hydrophobic vs. hydrophilic amino acids in insulin.

4. **Reverse Translation:** Given the amino acid sequence, determine possible DNA coding sequences (remembering codon degeneracy).

---

## References

- [PEP 8 — Style Guide for Python Code](https://peps.python.org/pep-0008/)
- [Python Documentation: print()](https://docs.python.org/3/library/functions.html#print)
- [Python Documentation: Dictionaries](https://docs.python.org/3/tutorial/datastructures.html#dictionaries)
- Insulin Molecular Weight (Accepted): 5807.63 Da

---

*Lab completed. Congratulations on working with variables, strings, dictionaries, and numeric calculations in Python!*
