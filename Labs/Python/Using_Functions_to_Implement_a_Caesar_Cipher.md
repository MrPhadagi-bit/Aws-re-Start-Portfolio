# Using Functions to Implement a Caesar Cipher

## Lab Overview

In programming, a **function** is a named section of a program that performs a specific task. Python has built-in functions like `print()` that are provided by the language. Additionally, you can use functions provided by other developers through the `import` statement. For example, you can use `import math` if you want to use the `math.floor()` function. In Python, you can also make your own functions, which are called **user-defined functions**.

To drive the discussion of user-defined functions, you will write a program that implements a **Caesar cipher**, which is a simple method of encryption. A Caesar cipher takes the letters of a message and shifts each letter along the alphabet by a certain number of places.

In this lab, you will:

- Create user-defined functions
- Use several functions to implement a Caesar cipher encryption program

**Estimated completion time:** 60 minutes.

---

## Exercise 1: Creating a User-Defined Function

To start the process of implementing a Caesar cipher in Python, you will create a simple user-defined function.

1. From the Explorer panel on the left, choose the file that you created in the previous *Creating your Python exercise file* section.
2. Define a function called `getDoubleAlphabet` that takes a string argument and concatenates, or combines, the given string with itself as follows:

```python
def getDoubleAlphabet(alphabet):
    doubleAlphabet = alphabet + alphabet
    return doubleAlphabet
```

> **Note:** The required parts of the function statement are the keyword `def`, a name, and the colon (`:`). Additionally, in Python, variables don't need to be declared, and their data types are inferred from the assignment statement.

3. Save the file.

To understand what the function does, take a sample input of `alphabet="ABC"`. The return string for this input would be `"ABC" + "ABC" = "ABCABC"`. The plus sign (`+`) concatenates the strings into one string.

Across the following exercises, you will define more functions that perform a simple task. You will then combine these functions to make a Caesar cipher program.

---

## Exercise 2: Encrypting a Message

The next function you define will request a message to encrypt from the user. You will use the built-in function called `input()`.

In the text editor, enter the following code, and save the file:

```python
def getMessage():
    stringToEncrypt = input("Please enter a message to encrypt: ")
    return stringToEncrypt
```

> **Note:** Functions should perform a specific task. Usually, because functions perform a specific task, your functions will also probably be short. Though this function returns a string, it doesn't take an argument like the `getDoubleAlphabet()` function.

---

## Exercise 3: Getting a Cipher Key

The cipher key is how far you will shift the letters. By using two alphabets, you can have a cipher key that is any integer from 1 to 25. Don't count the key at index 26 because that key would shift you back to the original message.

Define a function to request a cipher key from the user by entering the following code:

```python
def getCipherKey():
    shiftAmount = input("Please enter a key (whole number from 1-25): ")
    return shiftAmount
```

Save the file.

---

## Exercise 4: Encrypting a Message

So far, the functions have been short and simple. That is usually the case when you keep to a specific task inside a function. The `encryptMessage` function will be a little longer.

### Algorithm for Encryption

Before writing the code, plan out the algorithm for encryption as follows:

1. Take three arguments: the message, the cipherKey, and the alphabet.
2. Initialize variables.
3. Use a `for` loop to traverse each letter in the message.
4. For a specific letter, find the position.
5. For a specific letter, determine the new position given the cipher key.
6. If current letter is in the alphabet, append the new letter to the encrypted message.
7. If current letter is not in the alphabet, append the current letter.
8. Return the encrypted message after exhausting all the letters in the message.

### Implementation

In the exercise file, enter the following code, and follow the logic by reviewing the steps of the previous algorithm:

```python
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
```

Save the file.

---

## Exercise 5: Decrypting a Message

Functions are useful because you can reuse them. You will write a `decryptMessage()` function by reusing the `encryptMessage()` function. For this simple encryption, you can undo the encryption by shifting each letter back. Thus, instead of adding the cipher key, you will subtract the cipher key. To avoid rewriting most of the logic, you will pass in a negative cipher key.

Next, enter the following code, and save the file:

```python
def decryptMessage(message, cipherKey, alphabet):
    decryptKey = -1 * int(cipherKey)
    return encryptMessage(message, decryptKey, alphabet)
```

---

## Exercise 6: Creating a Main Function

You have built a collection of user-defined functions that will help you write a Caesar cipher program. The main logic of the program will, of course, also be contained in a function.

### Main Program Logic

Before you look at the code, plan out your logic:

1. Define a string variable to contain the English alphabet.
2. To be able to shift letters, double your alphabet string.
3. Get a message to encrypt from the user.
4. Get a cipher key from the user.
5. Encrypt the message.
6. Decrypt the message.

### Implementation

In the exercise file, enter the following code, and follow the logic by reviewing the steps of the previous algorithm:

```python
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
```

To help with debugging and understanding the program, `print()` statements were added, but they are not strictly necessary for the program to operate correctly.

Save and run the file, and then view the results.

### Calling the Main Function

Nothing happens. Why? Recall that a function is a named section of a program that performs a specific task. You have not called your function.

To call the function, add the following line to your `.py` file and save the file:

```python
runCaesarCipherProgram()
```

Run the program again. The output should be similar to the following:

```
Alphabet: ABCDEFGHIJKLMNOPQRSTUVWXYZ
Alphabet2: ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ
Please enter a message to encrypt: new message
new message
Please enter a key (whole number from 1-25): 4
4
Encrypted Message: RIA QIWWEKI
Decrypted Message: NEW MESSAGE
```

Re-run the program with different inputs.

**Congratulations!** You have worked with user-defined functions and implemented an encryption program!

---

## Complete Program

Here is the complete program with all functions combined:

```python
def getDoubleAlphabet(alphabet):
    doubleAlphabet = alphabet + alphabet
    return doubleAlphabet


def getMessage():
    stringToEncrypt = input("Please enter a message to encrypt: ")
    return stringToEncrypt


def getCipherKey():
    shiftAmount = input("Please enter a key (whole number from 1-25): ")
    return shiftAmount


def encryptMessage(message, cipherKey, alphabet):
    encryptedMessage = ""
    uppercaseMessage = message.upper()
    for currentCharacter in uppercaseMessage:
        position = alphabet.find(currentCharacter)
        newPosition = position + int(cipherKey)
        if currentCharacter in alphabet:
            encryptedMessage = encryptedMessage + alphabet[newPosition]
        else:
            encryptedMessage = encryptedMessage + currentCharacter
    return encryptedMessage


def decryptMessage(message, cipherKey, alphabet):
    decryptKey = -1 * int(cipherKey)
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


# Call the main function to run the program
runCaesarCipherProgram()
```

---

## Key Takeaways

- **User-defined functions** allow you to break down complex problems into smaller, manageable tasks.
- Functions can **take arguments** (like `getDoubleAlphabet(alphabet)`) or **take no arguments** (like `getMessage()`).
- Functions can **return values** that can be used by other functions.
- **Code reuse** is a powerful benefit of functions — the `decryptMessage()` function reuses `encryptMessage()` by passing a negative key.
- A **main function** (like `runCaesarCipherProgram()`) helps organize the overall flow of a program.
- Functions must be **called** to execute — defining a function alone does not run it.
