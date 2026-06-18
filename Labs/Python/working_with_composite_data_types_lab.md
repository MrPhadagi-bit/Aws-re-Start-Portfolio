# Working with Composite Data Types

## Lab Overview

A **composite data type** is any data type that comprises primitive data types. If you like food, you can visualize a composite data type as a **turducken**, which is a dish that consists of a chicken that is stuffed into a duck, which is stuffed into a turkey. In this lab, you will create a data type that consists of a **string** that is in a **dictionary**, which is in a **list**.

---

## Learning Objectives

In this lab, you will:

- Use **numeric data types**
- Use **string data types**
- Use the **dictionary** data type
- Use the **list** data type
- Use a **for loop**
- Use the **print()** function
- Use the **if** statement
- Use the **else** statement
- Use the **import** statement

## Estimated Completion Time

 **45 minutes**

---

## Prerequisites

- Basic understanding of Python syntax
- A text editor or IDE (e.g., VS Code, PyCharm, or a cloud-based environment)
- Python 3.x installed on your system

---

## Lab Steps

### Step 1: Creating a Car Inventory CSV File

**CSV (Comma-Separated Values)** is a file format that's used to store tabular data, such as data from a spreadsheet.

#### Instructions:

1. From the menu bar, choose **File > New File**.
   - This action creates an untitled file.

2. Choose **File > Save As...**, and save the file as `car_fleet.csv`.

3. Copy and paste the following text block into the `car_fleet.csv` file and save it:

```csv
vin,make,model,year,range,topSpeed,zeroSixty,mileage
TMX20122,AnyCompany Motors, Coupe, 2012, 335, 155, 4.1, 50000
TM320163,AnyCompany Motors, Sedan, 2016, 240, 140, 5.2, 20000
TMX20121,AnyCompany Motors, SUV, 2012, 295, 155, 4.7, 100000
TMX20204,AnyCompany Motors, Truck, 2020, 300, 155, 3.5, 0
```

>  **Tip:** If a pop-up window opens with the message *Native Clipboard Unavailable*, use the keyboard, not the browser menu, to perform copy and paste actions.
> - On **Windows**: Use `CTRL+C` and `CTRL+V`
> - On **Mac**: Use `Command+C` and `Command+V`

---

### Step 2: Creating a Car Inventory Python Program

#### 2.1 Defining the Dictionary

You will read in the file by using a module called `csv`. Additionally, you will make a **deep copy** of the data to store in memory by using a module called `copy`.

##### Instructions:

1. From the Explorer panel on the left, choose (double-click) the `.py` file that you created.

2. First, **import the modules** that you will use:

```python
import csv
import copy
```

3. Next, **define a dictionary** that will serve as your composite type for reading the tabular data:

```python
myVehicle = {
    "vin" : "<empty>",
    "make" : "<empty>",
    "model" : "<empty>",
    "year" : 0,
    "range" : 0,
    "topSpeed" : 0,
    "zeroSixty" : 0.0,
    "mileage" : 0
}
```

4. Use a **for loop** to iterate over the initial keys and values of the dictionary:

```python
for key, value in myVehicle.items():
    print("{} : {}".format(key, value))
```

>  **Note:** The `items()` function belongs to the dictionary data type. It tells the for loop to traverse the collection owned by the dictionary data type.

5. Define an **empty list** to hold the car inventory that you will read:

```python
myInventoryList = []
```

6. Save the file.

---

#### 2.2 Copying the CSV File into Memory

You will read in the data from disk (hard drive) and make an **in-memory** (random access memory, or RAM) copy.

>  **Hard Drive** stores data long term, including when the power is turned off.  
>  **RAM** refers to temporary memory that is faster, but it is erased when the computer's power is turned off.

You will be introduced to the **`with open`** syntax statement, which keeps a file open while you read data. It will **automatically close** the CSV file when the code inside the `with` block is finished running.

You will also use a **new way of formatting a string**. Instead of using double quotation marks and `.format` to pass in the variables, you can use a single quotation mark and write in the variables between the `{}` symbols (**f-strings**).

Finally, `csv.reader()` is a function that you are using from the `csv` library that you imported.

##### Instructions:

Return to the Python file and enter the following code:

```python
with open('car_fleet.csv') as csvFile:
    csvReader = csv.reader(csvFile, delimiter=',')
    lineCount = 0
    for row in csvReader:
        if lineCount == 0:
            print(f'Column names are: {", ".join(row)}')
            lineCount += 1
        else:
            print(f'vin: {row[0]} make: {row[1]}, model: {row[2]}, year: {row[3]}, range: {row[4]}, topSpeed: {row[5]}, zeroSixty: {row[6]}, mileage: {row[7]}')
            currentVehicle = copy.deepcopy(myVehicle)
            currentVehicle["vin"] = row[0]
            currentVehicle["make"] = row[1]
            currentVehicle["model"] = row[2]
            currentVehicle["year"] = row[3]
            currentVehicle["range"] = row[4]
            currentVehicle["topSpeed"] = row[5]
            currentVehicle["zeroSixty"] = row[6]
            currentVehicle["mileage"] = row[7]
            myInventoryList.append(currentVehicle)
            lineCount += 1
    print(f'Processed {lineCount} lines.')
```

---

####  Deep Dive: Understanding `copy.deepcopy()`

```python
currentVehicle = copy.deepcopy(myVehicle)
```

By default, Python does a **shallow copy** of complex data types. A shallow copy refers, or points, to the storage location of the `myVehicle` dictionary variable.

**Without this line**, you would have only one storage box, and only the last item in the list would be copied into memory.

**This line makes sure that new storage boxes are created in memory** to store the new tabular data that is being read.

| Copy Type | Behavior | Use Case |
|-----------|----------|----------|
| **Shallow Copy** | Creates a new object but references the same inner objects | Simple, non-nested data |
| **Deep Copy** | Creates a new object and recursively copies all inner objects | Nested/composite data types |

---

### Step 3: Printing the Car Inventory

You will finish the Python script by printing the car inventory from the `myInventoryList` variable.

##### Instructions:

Return to the Python script and enter the following code:

```python
for myCarProperties in myInventoryList:
    for key, value in myCarProperties.items():
        print("{} : {}".format(key, value))
    print("-----")
```

Save the file.

---

### Step 4: Running the Program

1. Open your terminal or command prompt.
2. Navigate to the directory containing your Python file and `car_fleet.csv`.
3. Run the program:

```bash
python3 filename.py
```

>  Replace `filename.py` with the actual name of your Python file.

4. **Confirm** that the script runs correctly and that the output displays as you expect it to.

---

## Expected Output

```
vin : <empty>
make : <empty>
model : <empty>
year : 0
range : 0
topSpeed : 0
zeroSixty : 0.0
mileage : 0
Column names are: vin, make, model, year, range, topSpeed, zeroSixty, mileage
vin: TMX20122 make: AnyCompany Motors, model:  Coupe, year:  2012, range:  335, topSpeed:  155, zeroSixty:  4.1, mileage:  50000
vin: TM320163 make: AnyCompany Motors, model:  Sedan, year:  2016, range:  240, topSpeed:  140, zeroSixty:  5.2, mileage:  20000
vin: TMX20121 make: AnyCompany Motors, model:  SUV, year:  2012, range:  295, topSpeed:  155, zeroSixty:  4.7, mileage:  100000
vin: TMX20204 make: AnyCompany Motors, model:  Truck, year:  2020, range:  300, topSpeed:  155, zeroSixty:  3.5, mileage:  0
Processed 5 lines.
vin : TMX20122
make : AnyCompany Motors
model :  Coupe
year :  2012
range :  335
topSpeed :  155
zeroSixty :  4.1
mileage :  50000
-----
vin : TM320163
make : AnyCompany Motors
model :  Sedan
year :  2016
range :  240
topSpeed :  140
zeroSixty :  5.2
mileage :  20000
-----
... (continues for all vehicles)
```

---

## Complete Code

Here is the complete Python script for reference:

```python
import csv
import copy

# Define the vehicle template dictionary
myVehicle = {
    "vin": "<empty>",
    "make": "<empty>",
    "model": "<empty>",
    "year": 0,
    "range": 0,
    "topSpeed": 0,
    "zeroSixty": 0.0,
    "mileage": 0
}

# Print initial dictionary values
for key, value in myVehicle.items():
    print("{} : {}".format(key, value))

# Initialize empty inventory list
myInventoryList = []

# Read CSV file and populate inventory
with open('car_fleet.csv') as csvFile:
    csvReader = csv.reader(csvFile, delimiter=',')
    lineCount = 0
    for row in csvReader:
        if lineCount == 0:
            print(f'Column names are: {", ".join(row)}')
            lineCount += 1
        else:
            print(f'vin: {row[0]} make: {row[1]}, model: {row[2]}, year: {row[3]}, range: {row[4]}, topSpeed: {row[5]}, zeroSixty: {row[6]}, mileage: {row[7]}')
            currentVehicle = copy.deepcopy(myVehicle)
            currentVehicle["vin"] = row[0]
            currentVehicle["make"] = row[1]
            currentVehicle["model"] = row[2]
            currentVehicle["year"] = row[3]
            currentVehicle["range"] = row[4]
            currentVehicle["topSpeed"] = row[5]
            currentVehicle["zeroSixty"] = row[6]
            currentVehicle["mileage"] = row[7]
            myInventoryList.append(currentVehicle)
            lineCount += 1
    print(f'Processed {lineCount} lines.')

# Print the full inventory
for myCarProperties in myInventoryList:
    for key, value in myCarProperties.items():
        print("{} : {}".format(key, value))
    print("-----")
```

---

## Key Concepts Review

| Concept | Description |
|---------|-------------|
| **Composite Data Type** | A data type built from primitive data types (e.g., a list of dictionaries) |
| **Dictionary** | A collection of key-value pairs in Python |
| **List** | An ordered, mutable collection in Python |
| **Deep Copy** | Creates independent copies of nested objects |
| **CSV** | A plain text format for storing tabular data |
| **f-string** | A string formatting method using `f'...{variable}...'` |
| **`with` statement** | Context manager that automatically handles resource cleanup |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `FileNotFoundError` | Ensure `car_fleet.csv` is in the same directory as your `.py` file |
| `IndexError` | Check that your CSV file has the correct number of columns |
| All inventory items show the same data | Make sure you are using `copy.deepcopy()`, not assignment (`=`) |

---

## Congratulations! 

You have successfully worked with composite data types in Python! You created a string-in-dictionary-in-list structure, read data from a CSV file, and managed memory using deep copies.

---

## Next Steps

- Experiment with adding more vehicles to the CSV file
- Try modifying the dictionary to include additional car properties
- Explore other Python data structures like tuples and sets
- Practice writing the CSV data back to a new file

---

*End of Lab*
