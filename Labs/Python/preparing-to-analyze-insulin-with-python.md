# Preparing to Analyze Insulin with Python

## Lab Overview

In information technology, Python works well as the programming language of choice for manipulating strings, sequences, and numbers. Python is especially preferred in scientific computing applications such as physics, chemistry, and biology.

In some of the labs for the Python modules, you will perform simple sequence manipulations and calculations on **human insulin**, which is a well-known hormone in the human body that is responsible for regulating sugars.

In this lab, you will:
- Retrieve the protein sequence of human insulin from human preproinsulin

---

## Estimated Completion Time

**30 minutes**

---

## Exercise 1: Retrieving the Protein Sequence of Human Preproinsulin

The National Center for Biotechnology Information (NCBI) has information on many biological sequences.

### Step 1: Access NCBI

1. Go to [https://ncbi.nlm.nih.gov](https://ncbi.nlm.nih.gov).
2. Next to the search bar, choose the dropdown menu and select **Protein**.
3. In the search bar, enter `human insulin` and choose **Search**.

### Step 2: Select the Correct Result

Choose the following search result: **insulin [Homo sapiens]**.

### Step 3: Copy the Sequence

At the bottom of the search record, copy the insulin sequence, which starts with the word `ORIGIN` and ends with `//`.

### Step 4: Create the Sequence File

1. In the VS Code: IDE, choose **File > New File** and save the file as `preproinsulin-seq.txt`.
2. Paste the insulin sequence into `preproinsulin-seq.txt`:

```text
ORIGIN      
        1 malwmrllpl lallalwgpd paaafvnqhl cgshlvealy lvcgergffy tpktrreaed
       61 lqvgqvelgg gpgagslqpl alegslqkrg iveqcctsic slyqlenycn
//
```

---

## Bonus: Cleaning `preproinsulin-seq.txt` Programmatically

Cleaning source data files is a common task in computer programming. You could programmatically clean `preproinsulin-seq.txt` in several ways—for example, by using Bash, Python, or another programming language of choice.

### Suggested Approach

Try using **regex** to programmatically strip the file of:
- `ORIGIN`
- Line numbers (e.g., `1`, `61`)
- The two slashes (`//`)
- Spaces
- Line breaks or return carriages

### Validation

Confirm programmatically that the cleaned file has **110 characters**.

---

## Exercise 2: Obtaining the Protein Sequence of Human Insulin

Insulin is obtained from preproinsulin through a series of cut-and-paste procedures. Preproinsulin contains a **24aa signal sequence** and an **86aa proinsulin molecule**. Amino acids **25–54** and amino acids **90–110** are the processed insulin molecule.

Use **Python**, **Bash**, or **manual manipulation** to retrieve only those amino acids in the sequence that compose insulin.

### Step 1: Clean the Sequence

Manually or programmatically delete:
- `ORIGIN`
- Line numbers (`1`, `61`)
- `//`
- Spaces
- Return carriages

### Step 2: Save the Cleaned Preproinsulin Sequence

1. In the VS Code: IDE, choose **File > New File** and save the file as `preproinsulin-seq-clean.txt`.
2. Copy your cleaned results into the file.
3. **Confirm** that your file has **110 characters** of lowercase letters, which represent the amino acids in the sequence of human preproinsulin.

### Step 3: Extract the Signal Sequence (lsinsulin)

1. In the VS Code: IDE, choose **File > New File** and save the file as `lsinsulin-seq-clean.txt`.
2. Save **amino acids 1–24**.
3. **Verify** that your file has **24 characters**.

### Step 4: Extract the B-Chain (binsulin)

1. In the VS Code: IDE, choose **File > New File** and save the file as `binsulin-seq-clean.txt`.
2. Save **amino acids 25–54**.
3. **Verify** that your file has **30 characters**.

### Step 5: Extract the C-Peptide (cinsulin)

1. In the VS Code: IDE, choose **File > New File** and save the file as `cinsulin-seq-clean.txt`.
2. Save **amino acids 55–89**.
3. **Verify** that your file has **35 characters**.

### Step 6: Extract the A-Chain (ainsulin)

1. In the VS Code: IDE, choose **File > New File** and save the file as `ainsulin-seq-clean.txt`.
2. Save **amino acids 90–110**.
3. **Verify** that your file has **21 characters**.

---

## Discussion: Deciding When to Automate and When to Work Manually

> **Scope versus Time**
>
> Automating your work versus working manually is a dilemma for computer programmers. Too much automation wastes time on coding, whereas too little restricts the scope of your program. Try to balance your automation with working manually in an effort to create a program with the most scope for the least time spent coding.
>
> In this case, it is probably **not worth the extra coding time** to programmatically clean `insulin-seq.txt` to `insulin-seq-clean.txt`. However, if you needed to download **thousands or millions** of files and do the same task, automation would be good to explore.

---

## Conclusion

**Congratulations!** You have prepared data for further processing. Manually preparing these files should help you appreciate the automation that Python can provide.

---

*End Lab*
