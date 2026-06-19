# Creating File Handlers and Modules for Retrieving Information about Insulin

## Lab Overview

In this lab, you will:

- Create a reusable Python module for handling JSON files
- Open a file and load JSON data using Python's built-in `json` module
- Parse the JSON structure to access insulin molecular data
- Calculate the rough molecular weight of human insulin using amino acid sequence data

> **Prerequisite:** This lab builds upon concepts from *Working with the String Sequence and Numeric Weight of Insulin in Python*. Familiarity with Python dictionaries, strings, and basic file I/O is recommended.

---

## Estimated Completion Time

**25 minutes**

---

## Learning Objectives

By the end of this lab, you will be able to:

1. Create and structure a JSON data file for molecular biology applications
2. Write a reusable Python module with error handling for file operations
3. Import and utilize custom modules in a main program
4. Parse nested JSON structures to extract specific data
5. Perform molecular weight calculations using dictionary comprehensions

---

## Prerequisites

- Python 3.x installed
- Basic understanding of JSON syntax
- Familiarity with Python functions, dictionaries, and exception handling
- Text editor or IDE (VS Code, PyCharm, IDLE, etc.)

---

## Lab Structure

This lab consists of three main exercises:

| Exercise | Description | File(s) |
|----------|-------------|---------|
| Exercise 1 | Create the JSON molecules data file | `files/insulin.json` |
| Exercise 2 | Create the JSON file handler module | `jsonFileHandler.py` |
| Exercise 3 | Create the main calculation program | `calc_weight_json.py` |

---

## Exercise 1: Creating the JSON Molecules Data File

### Objective
Create a JSON document that stores insulin molecule sequences, amino acid molecular weights, and the actual molecular weight of insulin.

### Background
Human insulin is a peptide hormone composed of two chains:
- **A-chain** (`aInsulin`): 21 amino acids
- **B-chain** (`bInsulin`): 30 amino acids
- **C-peptide** (`cInsulin`): Connecting peptide removed during processing
- **Signal peptide** (`lsInsulin`): Leader sequence removed during maturation

The molecular weight of each amino acid is essential for calculating the total molecular weight of the insulin protein.

### Instructions

1. **Create a new file:** From your editor's menu bar, choose **File → New File**.

2. **Add the JSON content:** Copy and paste the following code into the newly created file:

```json
{
   "molecules": {
      "lsInsulin": "malwmrllpllallalwgpdpaaa",
      "bInsulin": "fvnqhlcgshlvealylvcgergffytpkt",
      "aInsulin": "giveqcctsicslyqlenycn",
      "cInsulin": "rreaedlqvgqvelgggpgagslqplalegslqkr"
   },
   "weights": {
      "A": 89.09,
      "C": 121.16,
      "D": 133.10,
      "E": 147.13,
      "F": 165.19,
      "G": 75.07,
      "H": 155.16,
      "I": 131.17,
      "K": 146.19,
      "L": 131.17,
      "M": 149.21,
      "N": 132.12,
      "P": 115.13,
      "Q": 146.15,
      "R": 174.20,
      "S": 105.09,
      "T": 119.12,
      "V": 117.15,
      "W": 204.23,
      "Y": 181.19
   },
   "molecularWeightInsulinActual": 5807.63
}
```

3. **Save the file:**
   - Select **File → Save As...**
   - For **Filename**, enter: `insulin.json`
   - For **Folder**, enter or navigate to: `files/`

### Understanding the JSON Structure

| Key | Type | Description |
|-----|------|-------------|
| `molecules` | Object | Contains amino acid sequences for insulin components |
| `weights` | Object | Maps single-letter amino acid codes to their molecular weights (Da) |
| `molecularWeightInsulinActual` | Number | Experimentally determined molecular weight of human insulin (5807.63 Da) |

> **Note:** The molecular weights represent the average residue weights of each amino acid, measured in Daltons (Da).

---

## Exercise 2: Creating the JSON File Handler Module

### Objective
Create a reusable Python module that reads JSON files and returns the parsed data with proper error handling.

### Why Create a Module?

Modular programming promotes:
- **Code reusability:** Use `readJsonFile()` in multiple programs
- **Maintainability:** Update file handling logic in one place
- **Error isolation:** Handle I/O errors gracefully without crashing the main program

### Instructions

1. **Create a new file** named `jsonFileHandler.py`.

2. **Import the JSON library:**

```python
import json
```

3. **Define the file reading function:**

```python
def readJsonFile(fileName):
    data = ""
    try:
        with open(fileName) as json_file:
            data = json.load(json_file)
    except IOError:
        print("Could not read file")
    return data
```

### Code Breakdown

| Component | Purpose |
|-----------|---------|
| `import json` | Imports Python's built-in JSON handling library |
| `data = ""` | Initializes an empty string as default return value |
| `with open(fileName)` | Opens file using context manager (auto-closes file) |
| `json.load(json_file)` | Parses JSON file into a Python dictionary |
| `try/except IOError` | Catches file access errors (missing file, permissions, etc.) |
| `return data` | Returns parsed dictionary or empty string on failure |

### Key Concepts

- **`json.load()` vs `json.loads()`:**
  - `json.load(file)` -- reads from a file object
  - `json.loads(string)` -- parses a JSON-formatted string

- **Context Manager (`with` statement):** Ensures the file is properly closed after reading, even if an error occurs.

- **`IOError` Exception:** Caught when the file cannot be opened (file not found, permission denied, etc.).

---

## Exercise 3: Creating the Main Program

### Objective
Create the main program that uses the `jsonFileHandler` module to retrieve insulin data and calculate its molecular weight.

### Instructions

1. **Create a new file** named `calc_weight_json.py`.

2. **Import the custom module:**

```python
import jsonFileHandler
```

3. **Retrieve the JSON data:**

```python
data = jsonFileHandler.readJsonFile('files/insulin.json')
```

4. **Validate data and extract insulin sequences:**

```python
if data != "":
    # Extract B-chain and A-chain sequences
    bInsulin = data['molecules']['bInsulin']
    aInsulin = data['molecules']['aInsulin']

    # Combine chains to form complete insulin sequence
    insulin = bInsulin + aInsulin

    # Retrieve actual molecular weight for comparison
    molecularWeightInsulinActual = data['molecularWeightInsulinActual']

    # Display retrieved data
    print('bInsulin: ' + bInsulin)
    print('aInsulin: ' + aInsulin)
    print('molecularWeightInsulinActual: ' + str(molecularWeightInsulinActual))
else:
    print("Error. Exiting program")
```

### Expected Output (Data Retrieval Test)

```
bInsulin: fvnqhlcgshlvealylvcgergffytpkt
aInsulin: giveqcctsicslyqlenycn
molecularWeightInsulinActual: 5807.63
```

### Error Handling Test

To verify error handling works:
1. Temporarily change the filename to `'files/insuline.json'` (note the typo)
2. Run the program
3. **Expected output:**

```
Could not read file
Error. Exiting program
```

4. **Revert the filename** back to `'files/insulin.json'` before proceeding.

---

### Calculating Molecular Weight

Add the following code inside the `if data != ""` block, after the existing `print` statements:

```python
    # ============================================================
    # Calculating the molecular weight of insulin
    # ============================================================

    # Step 1: Retrieve the amino acid weight dictionary
    aaWeights = data['weights']

    # Step 2: Count occurrences of each amino acid in the insulin sequence
    # Dictionary comprehension iterates over all 20 standard amino acids
    aaCountInsulin = {
        x: float(insulin.upper().count(x)) 
        for x in ['A', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 
                  'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'Y']
    }

    # Step 3: Calculate total molecular weight
    # Multiply count of each amino acid by its molecular weight, then sum
    molecularWeightInsulin = sum({
        x: (aaCountInsulin[x] * aaWeights[x]) 
        for x in ['A', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K',
                  'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'Y']
    }.values())

    # Step 4: Display results
    print("The rough molecular weight of insulin: " + str(molecularWeightInsulin))

    # Step 5: Calculate percent error compared to actual molecular weight
    percentError = ((molecularWeightInsulin - molecularWeightInsulinActual) 
                    / molecularWeightInsulinActual) * 100
    print("Percent error: " + str(percentError))
```

### Algorithm Explanation

| Step | Operation | Purpose |
|------|-----------|---------|
| 1 | `aaWeights = data['weights']` | Load amino acid weight lookup table |
| 2 | Dictionary comprehension with `.count()` | Count how many times each amino acid appears |
| 3 | Multiply counts by weights and `sum()` | Calculate total molecular weight |
| 4 | `print()` | Display calculated weight |
| 5 | Percent error formula | Compare calculated vs. actual molecular weight |

### Percent Error Formula

```
Percent Error = ((Calculated Weight - Actual Weight) / Actual Weight) * 100
```

### Expected Final Output

```
bInsulin: fvnqhlcgshlvealylvcgergffytpkt
aInsulin: giveqcctsicslyqlenycn
molecularWeightInsulinActual: 5807.63
The rough molecular weight of insulin: 6696.420000000001
Percent error: 15.30383306099047
```

### Why the ~15% Error?

The calculated molecular weight (6696.42 Da) is higher than the actual weight (5807.63 Da) because:

1. **Water loss during peptide bond formation:** Each peptide bond releases one water molecule (18.015 Da). For a 51-amino acid chain, ~49 water molecules are lost.
2. **Disulfide bridge formation:** Three disulfide bonds form between cysteine residues, releasing additional atoms.
3. **Post-translational modifications:** The actual insulin undergoes specific folding and processing not accounted for in simple summation.

> **Note:** In the prerequisite lab (*Working with the String Sequence and Numeric Weight of Insulin*), you may have explored methods to account for these biochemical processes.

---

## Complete Code Reference

### `files/insulin.json`
```json
{
   "molecules": {
      "lsInsulin": "malwmrllpllallalwgpdpaaa",
      "bInsulin": "fvnqhlcgshlvealylvcgergffytpkt",
      "aInsulin": "giveqcctsicslyqlenycn",
      "cInsulin": "rreaedlqvgqvelgggpgagslqplalegslqkr"
   },
   "weights": {
      "A": 89.09, "C": 121.16, "D": 133.10, "E": 147.13,
      "F": 165.19, "G": 75.07, "H": 155.16, "I": 131.17,
      "K": 146.19, "L": 131.17, "M": 149.21, "N": 132.12,
      "P": 115.13, "Q": 146.15, "R": 174.20, "S": 105.09,
      "T": 119.12, "V": 117.15, "W": 204.23, "Y": 181.19
   },
   "molecularWeightInsulinActual": 5807.63
}
```

### `jsonFileHandler.py`
```python
import json

def readJsonFile(fileName):
    data = ""
    try:
        with open(fileName) as json_file:
            data = json.load(json_file)
    except IOError:
        print("Could not read file")
    return data
```

### `calc_weight_json.py`
```python
import jsonFileHandler

# Retrieve data from JSON file
data = jsonFileHandler.readJsonFile('files/insulin.json')

if data != "":
    # Extract insulin sequences
    bInsulin = data['molecules']['bInsulin']
    aInsulin = data['molecules']['aInsulin']
    insulin = bInsulin + aInsulin

    # Retrieve actual molecular weight
    molecularWeightInsulinActual = data['molecularWeightInsulinActual']

    # Display sequences
    print('bInsulin: ' + bInsulin)
    print('aInsulin: ' + aInsulin)
    print('molecularWeightInsulinActual: ' + str(molecularWeightInsulinActual))

    # Calculate rough molecular weight
    aaWeights = data['weights']
    aaCountInsulin = {
        x: float(insulin.upper().count(x)) 
        for x in ['A', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 
                  'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'Y']
    }
    molecularWeightInsulin = sum({
        x: (aaCountInsulin[x] * aaWeights[x]) 
        for x in ['A', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K',
                  'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'Y']
    }.values())

    # Display results
    print("The rough molecular weight of insulin: " + str(molecularWeightInsulin))
    percentError = ((molecularWeightInsulin - molecularWeightInsulinActual) 
                    / molecularWeightInsulinActual) * 100
    print("Percent error: " + str(percentError))
else:
    print("Error. Exiting program")
```

---

## Project Structure

```
project-root/
├── files/
│   └── insulin.json          # JSON data file
├── jsonFileHandler.py        # Reusable file handler module
└── calc_weight_json.py       # Main calculation program
```

---

## Troubleshooting

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| `ModuleNotFoundError: No module named 'jsonFileHandler'` | Module not in same directory | Ensure `jsonFileHandler.py` is in the same folder as `calc_weight_json.py` |
| `Could not read file` | Incorrect path or missing file | Verify `files/insulin.json` exists and path is correct |
| `KeyError` when accessing data | Malformed JSON | Validate JSON syntax using an online JSON validator |
| `Permission denied` | File access restrictions | Check file permissions or run with appropriate privileges |

---

## Summary

In this lab, you:

1. Created a structured JSON data file containing insulin sequences and amino acid weights
2. Built a reusable module (`jsonFileHandler.py`) with error handling for reading JSON files
3. Developed a main program that imports the module and performs molecular weight calculations
4. Calculated molecular weight using dictionary comprehensions and compared against actual values

### Key Takeaways

- **JSON** is an excellent format for storing structured scientific data
- **Custom modules** promote code reusability and separation of concerns
- **`try/except` blocks** make programs robust against file I/O failures
- **Dictionary comprehensions** provide concise ways to process biological sequence data
- Understanding the **difference between calculated and actual molecular weights** highlights the importance of biochemical context in computational biology

---

## Further Exploration

- Modify the program to calculate the molecular weight of the C-peptide alone
- Extend the error handling to catch `json.JSONDecodeError` for malformed JSON
- Create a function that accounts for water loss during peptide bond formation
- Research how to calculate the isoelectric point (pI) of insulin using the amino acid data

---

*End of Lab*
