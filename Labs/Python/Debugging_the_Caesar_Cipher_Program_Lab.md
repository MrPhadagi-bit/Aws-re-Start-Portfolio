# Debugging the Caesar Cipher Program: Lab Overview

## Introduction

Recall that a **debugger** is a computer program that is used to test and find bugs (debug) other programs. In this lab, you will use the **Python Debugger (pdb)** to find and fix bugs in a Python program.

The Caesar cipher is a classic encryption technique where each letter in a message is shifted by a fixed number of positions in the alphabet. While the concept is straightforward, implementing it correctly requires careful attention to data types, string manipulation, and logical flow. Even experienced programmers introduce bugs—and that's where debugging skills become essential.

## Lab Objectives

In this lab, you will:

- Use the **Python Debugger (pdb)** to step through code execution
- **Debug four different versions** of the Caesar cipher program that you created in a previous lab
- Identify and fix bugs related to **data types**, **string case handling**, **logical errors**, and **variable references**
- Develop systematic debugging strategies that apply to real-world programming scenarios

## Prerequisites

Before starting this lab, you should:
- Have completed the **Functions lab** where you created a working Caesar cipher program
- Be familiar with basic Python syntax, functions, and string operations
- Understand the concept of the Caesar cipher encryption algorithm

## Tools Used

- **Python 3.x**
- **pdb** (Python Debugger) — Python's built-in interactive source code debugger
- A text editor or IDE (such as VS Code, PyCharm, or Cloud9)

## Estimated Completion Time

**60 minutes**

---

## Understanding the Python Debugger (pdb)

The Python Debugger (`pdb`) is a built-in module that provides an interactive debugging environment. Key commands you will use:

| Command | Shortcut | Description |
|---------|----------|-------------|
| `break` | `b` | Set a breakpoint at a specific line |
| `run` / `continue` | `c` | Continue execution until a breakpoint is hit |
| `step` | `s` | Execute the current line and step into function calls |
| `next` | `n` | Execute the current line without stepping into functions |
| `print` | `p` | Print the value of a variable |
| `list` | `l` | Display the current source code context |
| `where` | `w` | Show the stack trace (call stack) |
| `quit` | `q` | Exit the debugger |

### Starting pdb

You can start debugging in several ways:

1. **From the command line:**
   ```bash
   python -m pdb your_script.py
   ```

2. **By importing pdb in your code:**
   ```python
   import pdb; pdb.set_trace()  # Python 3.6 and earlier
   # OR
   breakpoint()                 # Python 3.7+ (recommended)
   ```

3. **Post-mortem debugging** (after an exception occurs):
   ```python
   import pdb; pdb.pm()
   ```

---

## Exercise Overview

This lab consists of **four exercises**, each presenting a different buggy version of the Caesar cipher program. Your task is to identify and fix the bug in each version.

| Exercise | Bug Type | Symptom |
|----------|----------|---------|
| **Exercise 1** | Data type mismatch | `TypeError` traceback |
| **Exercise 2** | String case handling | Partial encryption |
| **Exercise 3** | Logical error in decryption | Incorrect decryption |
| **Exercise 4** | Variable reference error | Decrypted message equals encrypted message |

---

## Exercise 1: Working with the Buggy Caesar Cipher Program — Part 1

### Objective
Find and fix a **data type mismatch** bug that causes a `TypeError`.

### The Buggy Code

Create a new file named `caesar_cipher_program_bug_1.py` and paste the following code:

```python
# Module Lab: Caesar Cipher Program Bug #1
#
# In a previous lab, you created a Caesar cipher program. This version of
# the program is buggy. Use a debugger to find the bug and fix it.

# Double the given alphabet
def getDoubleAlphabet(alphabet):
    doubleAlphabet = alphabet + alphabet
    return doubleAlphabet

# Get a message to encrypt
def getMessage():
    stringToEncrypt = input("Please enter a message to encrypt: ")
    return stringToEncrypt

# Get a cipher key
def getCipherKey():
    shiftAmount = input("Please enter a key (whole number from 1-25): ")
    return shiftAmount

# Encrypt message
def encryptMessage(message, cipherKey, alphabet):
    encryptedMessage = ""
    uppercaseMessage = ""
    uppercaseMessage = message.upper()
    for currentCharacter in uppercaseMessage:
        position = alphabet.find(currentCharacter)
        newPosition = position + cipherKey
        if currentCharacter in alphabet:
            encryptedMessage = encryptedMessage + alphabet[newPosition]
        else:
            encryptedMessage = encryptedMessage + currentCharacter
    return encryptedMessage

# Decrypt message
def decryptMessage(message, cipherKey, alphabet):
    decryptKey = -1 * int(cipherKey)
    return encryptMessage(message, decryptKey, alphabet)

# Main program logic
def runCaesarCipherProgram():
    myAlphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    print(f'Alphabet: {myAlphabet}')
    myAlphabet2 = getDoubleAlphabet(myAlphabet)
    print(f'Alphabet2: {myAlphabet2}')
    myMessage = getMessage()
    print(myMessage)
    myCipherKey = getCipherKey()
    print(myCipherKey)
    myEncryptedMessage = encryptMessage(myMessage, myCipherKey, myAlphabet2)
    print(f'Encrypted Message: {myEncryptedMessage}')
    myDecryptedMessage = decryptMessage(myEncryptedMessage, myCipherKey, myAlphabet2)
    print(f'Decrypted Message: {myDecryptedMessage}')

# Main logic
runCaesarCipherProgram()
```

### Running the Program

Execute the program:
```bash
python caesar_cipher_program_bug_1.py
```

### Expected Error

You should receive an error similar to the following:

```
Alphabet: ABCDEFGHIJKLMNOPQRSTUVWXYZ
Alphabet2: ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ
Please enter a message to encrypt: AWS Restart rocks
AWS Restart rocks
Please enter a key (whole number from 1-25): 2
2
Traceback (most recent call last):
  File "caesar_cipher_program_bug_1.py", line 56, in <module>
    runCaesarCipherProgram()
  File "caesar_cipher_program_bug_1.py", line 50, in runCaesarCipherProgram
    myEncryptedMessage = encryptMessage(myMessage, myCipherKey, myAlphabet2)
  File "caesar_cipher_program_bug_1.py", line 28, in encryptMessage
    newPosition = position + cipherKey
TypeError: unsupported operand type(s) for +: 'int' and 'str'
```

### Analysis

The **traceback** is a stack trace that starts from the point of an exception handler and goes down the call chain to where the exception was raised. Let's analyze the traceback:

1. **Line 56**: `runCaesarCipherProgram()` is called
2. **Line 50**: `encryptMessage()` is called with `myCipherKey`
3. **Line 28**: The error occurs: `newPosition = position + cipherKey`

The error message `TypeError: unsupported operand type(s) for +: 'int' and 'str'` tells us that Python cannot add an integer (`position`) and a string (`cipherKey`).

### Debugging Steps

1. Set a breakpoint before line 28:
   ```python
   breakpoint()  # Add this before line 28
   ```

2. Run the program and inspect the variables when the breakpoint hits:
   ```
   (Pdb) p position
   0
   (Pdb) p cipherKey
   '2'
   (Pdb) p type(cipherKey)
   <class 'str'>
   ```

3. Notice that `cipherKey` is a **string** (`'2'`) rather than an **integer** (`2`). This is because the `input()` function in `getCipherKey()` always returns a string.

### The Fix

The `getCipherKey()` function returns a string, but `encryptMessage()` expects an integer. Convert the cipher key to an integer in the `getCipherKey()` function:

```python
def getCipherKey():
    shiftAmount = input("Please enter a key (whole number from 1-25): ")
    return int(shiftAmount)  # Convert string to integer
```

> **Note:** You could also convert it in `encryptMessage()` or in the main logic, but converting at the source (where the input is received) is the cleanest solution.

### Validation

Run the program again with the same inputs:
- Message: `AWS Restart rocks`
- Key: `2`

Expected output:
```
Encrypted Message: CYU TGUVCTV TQEMU!
Decrypted Message: AWS RESTART ROCKS!
```

---

## Exercise 2: Working with the Buggy Caesar Cipher Program — Part 2

### Objective
Find and fix a **string case handling** bug that causes partial encryption.

### The Buggy Code

Create a new file named `debug-caesar-2.py` and paste the following code:

```python
# Module Lab: Caesar Cipher Program Bug #2
#
# In a previous lab, you created a Caesar cipher program. This version of
# the program is buggy. Use a debugger to find the bug and fix it.

# Double the given alphabet
def getDoubleAlphabet(alphabet):
    doubleAlphabet = alphabet + alphabet
    return doubleAlphabet

# Get a message to encrypt
def getMessage():
    stringToEncrypt = input("Please enter a message to encrypt: ")
    return stringToEncrypt

# Get a cipher key
def getCipherKey():
    shiftAmount = input("Please enter a key (whole number from 1-25): ")
    return shiftAmount

# Encrypt message
def encryptMessage(message, cipherKey, alphabet):
    encryptedMessage = ""
    uppercaseMessage = ""
    uppercaseMessage = message  # <-- Bug: Not converting to uppercase!
    for currentCharacter in uppercaseMessage:
        position = alphabet.find(currentCharacter)
        newPosition = position + int(cipherKey)
        if currentCharacter in alphabet:
            encryptedMessage = encryptedMessage + alphabet[newPosition]
        else:
            encryptedMessage = encryptedMessage + currentCharacter
    return encryptedMessage

# Decrypt message
def decryptMessage(message, cipherKey, alphabet):
    decryptKey = -1 * int(cipherKey)
    return encryptMessage(message, decryptKey, alphabet)

# Main program logic
def runCaesarCipherProgram():
    myAlphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    print(f'Alphabet: {myAlphabet}')
    myAlphabet2 = getDoubleAlphabet(myAlphabet)
    print(f'Alphabet2: {myAlphabet2}')
    myMessage = getMessage()
    print(myMessage)
    myCipherKey = getCipherKey()
    print(myCipherKey)
    myEncryptedMessage = encryptMessage(myMessage, myCipherKey, myAlphabet2)
    print(f'Encrypted Message: {myEncryptedMessage}')
    myDecryptedMessage = decryptMessage(myEncryptedMessage, myCipherKey, myAlphabet2)
    print(f'Decrypted Message: {myDecryptedMessage}')

# Main logic
runCaesarCipherProgram()
```

### Running the Program

Execute the program:
```bash
python debug-caesar-2.py
```

### Expected Output (Buggy)

```
Alphabet: ABCDEFGHIJKLMNOPQRSTUVWXYZ
Alphabet2: ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ
Please enter a message to encrypt: AWS Restart rocks!
AWS Restart rocks!
Please enter a key (whole number from 1-25): 2
2
Encrypted Message: CYU Testart rocks!
Decrypted Message: AWS Restart rocks!
```

### Analysis

Notice the problem: **only "AWS" was encrypted**, while "Restart rocks!" remained unchanged. The program ended without errors, but the output is incorrect.

### Debugging Strategy

Run the program multiple times with different inputs to gather clues:

| Input Message | Key | Encrypted Output | Observation |
|---------------|-----|------------------|-------------|
| `AWS Restart rocks!` | `2` | `CYU Testart rocks!` | Only uppercase letters encrypted |
| `aws restart rocks!` | `2` | `aws restart rocks!` | Nothing encrypted! |
| `AWS` | `2` | `CYU` | Works correctly |
| `aws` | `2` | `aws` | Nothing encrypted! |

**Pattern identified:** Only uppercase letters are being encrypted. Lowercase letters are not found in the alphabet string (which is all uppercase), so they are skipped.

### Debugging Steps

1. Set a breakpoint inside the `for` loop in `encryptMessage()`:
   ```python
   for currentCharacter in uppercaseMessage:
       breakpoint()  # Add here
       position = alphabet.find(currentCharacter)
   ```

2. Inspect the variables:
   ```
   (Pdb) p currentCharacter
   'r'
   (Pdb) p alphabet.find(currentCharacter)
   -1
   (Pdb) p currentCharacter in alphabet
   False
   ```

3. Notice that `currentCharacter` is lowercase `'r'`, but `alphabet` contains only uppercase letters. The `find()` method returns `-1` for characters not found, and the `if` condition fails.

### The Fix

The message must be converted to **uppercase** before processing. Change line 26:

```python
# Incorrect (buggy):
uppercaseMessage = message

# Correct (fixed):
uppercaseMessage = message.upper()
```

### Validation

Run the program again with the same inputs:
- Message: `AWS Restart rocks!`
- Key: `2`

Expected output:
```
Encrypted Message: CYU TGUVCTV TQEMU!
Decrypted Message: AWS RESTART ROCKS!
```

> **Note:** The decrypted message will be in ALL CAPS because we lost the original case during encryption. This is expected behavior for this implementation.

---

## Exercise 3: Working with the Buggy Caesar Cipher Program — Part 3

### Objective
Find and fix a **logical error in decryption** that produces incorrect decrypted output.

### The Buggy Code

Create a new file named `caesar_debug-3.py` and paste the following code:

```python
# Module Lab: Caesar Cipher Program Bug #3
#
# In a previous lab, you created a Caesar cipher program. This version of
# the program is buggy. Use a debugger to find the bug and fix it.

# Double the given alphabet
def getDoubleAlphabet(alphabet):
    doubleAlphabet = alphabet + alphabet
    return doubleAlphabet

# Get a message to encrypt
def getMessage():
    stringToEncrypt = input("Please enter a message to encrypt: ")
    return stringToEncrypt

# Get a cipher key
def getCipherKey():
    shiftAmount = input("Please enter a key (whole number from 1-25): ")
    return shiftAmount

# Encrypt message
def encryptMessage(message, cipherKey, alphabet):
    encryptedMessage = ""
    uppercaseMessage = ""
    uppercaseMessage = message.upper()
    for currentCharacter in uppercaseMessage:
        position = alphabet.find(currentCharacter)
        newPosition = position + int(cipherKey)
        if currentCharacter in alphabet:
            encryptedMessage = encryptedMessage + alphabet[newPosition]
        else:
            encryptedMessage = encryptedMessage + currentCharacter
    return encryptedMessage

# Decrypt message
def decryptMessage(message, cipherKey, alphabet):
    decryptKey = -1 * int(cipherKey)
    return encryptMessage(message, cipherKey, alphabet)  # <-- Bug here!

# Main program logic
def runCaesarCipherProgram():
    myAlphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    print(f'Alphabet: {myAlphabet}')
    myAlphabet2 = getDoubleAlphabet(myAlphabet)
    print(f'Alphabet2: {myAlphabet2}')
    myMessage = getMessage()
    print(myMessage)
    myCipherKey = getCipherKey()
    print(myCipherKey)
    myEncryptedMessage = encryptMessage(myMessage, myCipherKey, myAlphabet2)
    print(f'Encrypted Message: {myEncryptedMessage}')
    myDecryptedMessage = decryptMessage(myEncryptedMessage, myCipherKey, myAlphabet2)
    print(f'Decrypted Message: {myDecryptedMessage}')

# Main logic
runCaesarCipherProgram()
```

### Running the Program

Execute the program:
```bash
python caesar_debug-3.py
```

### Expected Output (Buggy)

```
Alphabet: ABCDEFGHIJKLMNOPQRSTUVWXYZ
Alphabet2: ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ
Please enter a message to encrypt: AWS Restart rocks!
AWS Restart rocks!
Please enter a key (whole number from 1-25): 2
2
Encrypted Message: CYU TGUVCTV TQEMU!
Decrypted Message: EAW VIWXEVX VSGOW!
```

### Analysis

The encryption looks correct (`AWS Restart rocks!` → `CYU TGUVCTV TQEMU!`), but the decryption is wrong. The decrypted message should return to the original text, but instead we get `EAW VIWXEVX VSGOW!`.

Let's trace through the logic:
- Encryption shifts letters **forward** by the key (e.g., `A` + 2 = `C`)
- Decryption should shift letters **backward** by the key (e.g., `C` - 2 = `A`)
- The `decryptMessage()` function calculates `decryptKey = -1 * int(cipherKey)` (which is `-2`)
- But then it calls `encryptMessage(message, cipherKey, alphabet)` — passing the **original positive key**, not the calculated negative key!

### Debugging Steps

1. Set a breakpoint in `decryptMessage()`:
   ```python
   def decryptMessage(message, cipherKey, alphabet):
       decryptKey = -1 * int(cipherKey)
       breakpoint()  # Add here
       return encryptMessage(message, cipherKey, alphabet)
   ```

2. Inspect the variables:
   ```
   (Pdb) p cipherKey
   '2'
   (Pdb) p decryptKey
   -2
   (Pdb) p encryptMessage(message, cipherKey, alphabet)
   'EAW VIWXEVX VSGOW!'
   (Pdb) p encryptMessage(message, decryptKey, alphabet)
   'AWS RESTART ROCKS!'
   ```

3. Notice that using `cipherKey` (positive 2) encrypts again instead of decrypting. Using `decryptKey` (negative 2) correctly reverses the encryption.

### The Fix

Pass `decryptKey` instead of `cipherKey` to `encryptMessage()`:

```python
def decryptMessage(message, cipherKey, alphabet):
    decryptKey = -1 * int(cipherKey)
    return encryptMessage(message, decryptKey, alphabet)  # Use decryptKey!
```

### Validation

Run the program again with the same inputs:
- Message: `AWS Restart rocks!`
- Key: `2`

Expected output:
```
Encrypted Message: CYU TGUVCTV TQEMU!
Decrypted Message: AWS RESTART ROCKS!
```

---

## Exercise 4: Working with the Buggy Caesar Cipher Program — Part 4

### Objective
Find and fix a **variable reference error** that causes the decrypted message to equal the encrypted message.

### The Buggy Code

Create a new file named `debug-caesar-4.py` and paste the following code:

```python
# Module Lab: Caesar Cipher Program Bug #4
#
# In a previous lab, you created a Caesar cipher program. This version of
# the program is buggy. Use a debugger to find the bug and fix it.

# Double the given alphabet
def getDoubleAlphabet(alphabet):
    doubleAlphabet = alphabet + alphabet
    return doubleAlphabet

# Get a message to encrypt
def getMessage():
    stringToEncrypt = input("Please enter a message to encrypt: ")
    return stringToEncrypt

# Get a cipher key
def getCipherKey():
    shiftAmount = input("Please enter a key (whole number from 1-25): ")
    return shiftAmount

# Encrypt message
def encryptMessage(message, cipherKey, alphabet):
    encryptedMessage = ""
    uppercaseMessage = ""
    uppercaseMessage = message.upper()
    for currentCharacter in uppercaseMessage:
        position = alphabet.find(currentCharacter)
        newPosition = position + int(cipherKey)
        if currentCharacter in alphabet:
            encryptedMessage = encryptedMessage + alphabet[newPosition]
        else:
            encryptedMessage = encryptedMessage + currentCharacter
    return encryptedMessage

# Decrypt message
def decryptMessage(message, cipherKey, alphabet):
    decryptKey = -1 * int(cipherKey)
    return encryptMessage(message, decryptKey, alphabet)

# Main program logic
def runCaesarCipherProgram():
    myAlphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    print(f'Alphabet: {myAlphabet}')
    myAlphabet2 = getDoubleAlphabet(myAlphabet)
    print(f'Alphabet2: {myAlphabet2}')
    myMessage = getMessage()
    print(myMessage)
    myCipherKey = getCipherKey()
    print(myCipherKey)
    myEncryptedMessage = encryptMessage(myMessage, myCipherKey, myAlphabet2)
    print(f'Encrypted Message: {myEncryptedMessage}')
    myDecryptedMessage = decryptMessage(myEncryptedMessage, myCipherKey, myAlphabet2)
    print(f'Decrypted Message: {myEncryptedMessage}')  # <-- Bug here!

# Main logic
runCaesarCipherProgram()
```

### Running the Program

Execute the program:
```bash
python debug-caesar-4.py
```

### Expected Output (Buggy)

```
Alphabet: ABCDEFGHIJKLMNOPQRSTUVWXYZ
Alphabet2: ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ
Please enter a message to encrypt: AWS Restart rocks!
AWS Restart rocks!
Please enter a key (whole number from 1-25): 2
2
Encrypted Message: CYU TGUVCTV TQEMU!
Decrypted Message: CYU TGUVCTV TQEMU!
```

### Analysis

The encryption works correctly, but the decrypted message is identical to the encrypted message. This is suspicious because:
- The `decryptMessage()` function appears correct
- The logic for decryption is sound
- Yet the output shows the encrypted text instead of the original text

This suggests the issue is not in the decryption logic itself, but in **how the result is displayed**.

### Debugging Steps

1. Set a breakpoint after the `decryptMessage()` call:
   ```python
   myDecryptedMessage = decryptMessage(myEncryptedMessage, myCipherKey, myAlphabet2)
   breakpoint()  # Add here
   print(f'Decrypted Message: {myEncryptedMessage}')
   ```

2. Inspect the variables:
   ```
   (Pdb) p myEncryptedMessage
   'CYU TGUVCTV TQEMU!'
   (Pdb) p myDecryptedMessage
   'AWS RESTART ROCKS!'
   ```

3. Notice that `myDecryptedMessage` contains the correct decrypted text (`AWS RESTART ROCKS!`), but the `print()` statement on the next line prints `myEncryptedMessage` instead!

### The Fix

Change the `print()` statement to display `myDecryptedMessage` instead of `myEncryptedMessage`:

```python
# Incorrect (buggy):
print(f'Decrypted Message: {myEncryptedMessage}')

# Correct (fixed):
print(f'Decrypted Message: {myDecryptedMessage}')
```

This is a classic **copy-paste error** — the line was likely copied from the encryption print statement, but the variable name was not updated.

### Validation

Run the program again with the same inputs:
- Message: `AWS Restart rocks!`
- Key: `2`

Expected output:
```
Encrypted Message: CYU TGUVCTV TQEMU!
Decrypted Message: AWS RESTART ROCKS!
```

---

## Summary of Bugs and Fixes

| Exercise | File | Bug Description | Fix |
|----------|------|-----------------|-----|
| **1** | `caesar_cipher_program_bug_1.py` | `getCipherKey()` returns a string, but `encryptMessage()` expects an integer | Convert return value: `return int(shiftAmount)` |
| **2** | `debug-caesar-2.py` | Message not converted to uppercase before encryption | Change `uppercaseMessage = message` to `uppercaseMessage = message.upper()` |
| **3** | `caesar_debug-3.py` | `decryptMessage()` passes original `cipherKey` instead of calculated `decryptKey` | Change to `return encryptMessage(message, decryptKey, alphabet)` |
| **4** | `debug-caesar-4.py` | Print statement displays wrong variable (`myEncryptedMessage` instead of `myDecryptedMessage`) | Change to `print(f'Decrypted Message: {myDecryptedMessage}')` |

---

## Debugging Best Practices

Throughout this lab, you practiced several essential debugging techniques:

1. **Read the traceback carefully** — Error messages and line numbers are your first clues.
2. **Use print statements or pdb to inspect variables** — Verify that variables contain the values you expect.
3. **Reproduce the bug consistently** — Run the program multiple times with different inputs to identify patterns.
4. **Isolate the problem** — Narrow down which function or line contains the bug.
5. **Form a hypothesis** — Make an educated guess about what's wrong, then test it.
6. **Fix one bug at a time** — Verify each fix before moving on to the next issue.
7. **Validate your fix** — Run the program with various inputs to ensure the fix works in all cases.

---

## Additional Challenges

Once you have completed the four exercises, try the following enhancements:

1. **Input validation**: Modify `getCipherKey()` to handle invalid inputs (e.g., non-numeric values, numbers outside 1-25).
2. **Preserve case**: Update the program to preserve the original uppercase/lowercase pattern of the input message.
3. **Handle special characters**: Ensure that numbers and Unicode characters are handled gracefully.
4. **Write unit tests**: Create test cases for `encryptMessage()` and `decryptMessage()` to verify correctness automatically.

---

## Conclusion

Congratulations! You have successfully debugged four versions of the Caesar cipher program and completed all the labs for this course. 

You have learned to:
- Use the Python Debugger (`pdb`) to step through code
- Identify and fix **data type errors**, **logic errors**, **string handling issues**, and **variable reference mistakes**
- Apply systematic debugging strategies to real-world programming problems

These skills are fundamental to software development and will serve you well in any programming language or environment.

---

## Appendix: Complete Fixed Code

For reference, here is the fully corrected Caesar cipher program:

```python
# Complete Fixed Caesar Cipher Program

def getDoubleAlphabet(alphabet):
    doubleAlphabet = alphabet + alphabet
    return doubleAlphabet

def getMessage():
    stringToEncrypt = input("Please enter a message to encrypt: ")
    return stringToEncrypt

def getCipherKey():
    shiftAmount = input("Please enter a key (whole number from 1-25): ")
    return int(shiftAmount)

def encryptMessage(message, cipherKey, alphabet):
    encryptedMessage = ""
    uppercaseMessage = message.upper()
    for currentCharacter in uppercaseMessage:
        position = alphabet.find(currentCharacter)
        newPosition = position + cipherKey
        if currentCharacter in alphabet:
            encryptedMessage = encryptedMessage + alphabet[newPosition]
        else:
            encryptedMessage = encryptedMessage + currentCharacter
    return encryptedMessage

def decryptMessage(message, cipherKey, alphabet):
    decryptKey = -1 * cipherKey
    return encryptMessage(message, decryptKey, alphabet)

def runCaesarCipherProgram():
    myAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    print(f'Alphabet: {myAlphabet}')
    myAlphabet2 = getDoubleAlphabet(myAlphabet)
    print(f'Alphabet2: {myAlphabet2}')
    myMessage = getMessage()
    print(myMessage)
    myCipherKey = getCipherKey()
    print(myCipherKey)
    myEncryptedMessage = encryptMessage(myMessage, myCipherKey, myAlphabet2)
    print(f'Encrypted Message: {myEncryptedMessage}')
    myDecryptedMessage = decryptMessage(myEncryptedMessage, myCipherKey, myAlphabet2)
    print(f'Decrypted Message: {myDecryptedMessage}')

runCaesarCipherProgram()
```

---

*End of Lab*
