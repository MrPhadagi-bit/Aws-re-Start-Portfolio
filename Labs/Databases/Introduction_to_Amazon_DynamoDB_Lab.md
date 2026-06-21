# Introduction to Amazon DynamoDB

## Lab Overview

Amazon DynamoDB is a fast and flexible NoSQL database service for all applications that need consistent, single-digit millisecond latency at any scale. It is a fully managed database and supports both document and key-value data models. Its flexible data model and reliable performance make it a great fit for mobile, web, gaming, ad-tech, Internet of Things (IoT), and many other applications.

In this lab, you will create a table in DynamoDB to store information about a music library. You will query the music library and then delete the DynamoDB table.

---

## Topics Covered

In this lab, you will:

- Create an Amazon DynamoDB table
- Enter data into an Amazon DynamoDB table
- Query an Amazon DynamoDB table
- Delete an Amazon DynamoDB table

---

## Duration

This lab requires approximately **35 minutes** to complete.

---

## Prerequisites

- An active AWS account with access to the AWS Management Console
- Basic familiarity with navigating the AWS console
- Understanding of fundamental database concepts (optional but helpful)

---

## Lab Architecture

This lab uses the following AWS service:

| Service | Purpose |
|---------|---------|
| **Amazon DynamoDB** | Fully managed NoSQL database for storing and querying music library data |

---

## Key Concepts

### What is Amazon DynamoDB?

Amazon DynamoDB is a **fully managed NoSQL database service** that provides:

- **Consistent, single-digit millisecond latency** at any scale
- **Flexible data models**: Supports both document and key-value structures
- **Serverless architecture**: No need to provision, patch, or manage servers
- **Automatic scaling**: Scales throughput capacity to handle traffic without manual intervention
- **Built-in security**: Encryption at rest and fine-grained access control

### DynamoDB Core Components

| Component | Description |
|-----------|-------------|
| **Table** | A collection of data (similar to a table in relational databases) |
| **Item** | A group of attributes that is uniquely identifiable among all other items (similar to a row) |
| **Attribute** | A fundamental data element (similar to a column), but each item can have different attributes |
| **Partition Key** | The primary key that determines the partition in which the item is stored |
| **Sort Key** | An optional second key that, combined with the partition key, uniquely identifies each item |
| **Primary Key** | The combination of partition key and optional sort key |

### NoSQL vs. Relational Databases

| Feature | Relational (SQL) | DynamoDB (NoSQL) |
|---------|------------------|------------------|
| Schema | Pre-defined, rigid | Flexible, dynamic |
| Scaling | Typically vertical | Horizontal, automatic |
| Relationships | Heavy use of joins | Denormalized, embedded |
| Query Language | SQL | API-based operations |
| Attributes per item | Fixed per table | Can vary per item |

---

## Lab Tasks

### Task 1: Create a New Table

> **Objective:** Create a DynamoDB table named `Music` with a partition key and sort key.

In this task, you create a new table named `Music` in DynamoDB. Each table requires a **partition key** (or primary key) that is used to partition data across DynamoDB servers. A table can also have a **sort key**. The combination of a partition key and sort key uniquely identifies each item in a DynamoDB table.

#### Step-by-Step Instructions

1. In the AWS Management Console, choose the **Services** menu. Under **Database**, choose **DynamoDB**.
2. Choose **Create table**.
3. For the **Table name**, enter `Music`.
4. For the **Partition key**, enter `Artist` and leave `String` selected in the dropdown list.
5. For **Sort key - optional**, enter `Song` and leave `String` selected.
6. Your table will use the default settings for indexes and provisioned capacity.
7. Scroll down, and choose **Create table**.

> **Note:** The table will be created in less than 1 minute. Wait for the `Music` table status to show **Active** before moving on to the next task.

#### Expected Outcome

A DynamoDB table named `Music` is created with:
- **Partition Key:** `Artist` (String)
- **Sort Key:** `Song` (String)
- **Status:** Active

---

### Task 2: Add Data

> **Objective:** Add music library items to the `Music` table, demonstrating DynamoDB's flexible schema.

In this task, you will add data to the `Music` table. A table is a collection of data on a particular topic.

Each table contains multiple **items**. An item is a group of attributes that is uniquely identifiable among all of the other items. Items in DynamoDB are similar in many ways to rows in other database systems. In DynamoDB, there is no limit to the number of items you can store in a table.

Each item consists of one or more **attributes**. An attribute is a fundamental data element, something that does not need to be broken down any further. For example, an item in a `Music` table contains attributes such as `song` and `artist`. Attributes in DynamoDB are similar to columns in other database systems, but each item (row) can have different attributes (columns).

When you write an item to a DynamoDB table, only the partition key and sort key (if used) are required. Other than these fields, the table does not require a schema. This means that you can add attributes to one item that may be different than the attributes for other items.

#### Step-by-Step Instructions

##### Item 1: Pink Floyd - Money

1. Choose the `Music` table.
2. Choose **Actions**, and then choose **Create item**.
3. For the **Artist** value, enter `Pink Floyd`.
4. For the **Song** value, enter `Money`.
5. These are the only required attributes, but you will now add additional attributes.
6. To create an additional attribute, choose **Add new attribute**.
7. In the dropdown list, select **String**.
8. A new attribute row will be added. For the new attribute, enter:
   - **Field:** `Album`
   - **Value:** `The Dark Side of the Moon`
9. To add another new attribute, choose **Add new attribute**.
10. In the dropdown list, choose **Number**.
11. For the new attribute, enter:
    - **Field:** `Year`
    - **Value:** `1973`
12. Choose **Create item**.

> The item has now been added to the `Music` table.

##### Item 2: John Lennon - Imagine

Similarly, to create a second item, use the following attributes:

| Attribute Name | Attribute Type | Attribute Value |
|----------------|----------------|-----------------|
| `Artist` | String | `John Lennon` |
| `Song` | String | `Imagine` |
| `Album` | String | `Imagine` |
| `Year` | Number | `1971` |
| `Genre` | String | `Soft rock` |

> **Key Observation:** This item has an additional attribute called `Genre`. This is an example of each item being capable of having different attributes without having to pre-define a table schema.

##### Item 3: Psy - Gangnam Style

To create a third item, use the following attributes:

| Attribute Name | Attribute Type | Attribute Value |
|----------------|----------------|-----------------|
| `Artist` | String | `Psy` |
| `Song` | String | `Gangnam Style` |
| `Album` | String | `Psy 6 (Six Rules), Part 1` |
| `Year` | Number | `2011` |
| `LengthSeconds` | Number | `219` |

> **Key Observation:** This item has a new `LengthSeconds` attribute identifying the length of the song. This demonstrates the flexibility of a NoSQL database.

> **Tip:** There are also faster ways to load data into DynamoDB, such as using the AWS Command Line Interface (CLI), programmatically loading data via SDKs, or using third-party data migration tools.

#### Expected Outcome

Three items are successfully added to the `Music` table, each with varying attributes demonstrating DynamoDB's schema-less nature.

---

### Task 3: Modify an Existing Item

> **Objective:** Update an existing item in the `Music` table to correct data.

You now notice that there is an error in your data. In this task, you will modify an existing item.

#### Step-by-Step Instructions

1. In the DynamoDB dashboard, under **Tables**, choose **Explore Items**.
2. Choose the **Music** button.
3. Choose the item with **Artist:** `Psy`.
4. Change the **Year** from `2011` to `2012`.
5. Choose **Save changes**.

> The item is now updated.

#### Expected Outcome

The `Psy` item's `Year` attribute is updated from `2011` to `2012`.

---

### Task 4: Query the Table

> **Objective:** Retrieve items from the `Music` table using both Query and Scan operations.

There are two ways to query a DynamoDB table: **query** and **scan**.

#### Understanding Query vs. Scan

| Operation | Description | Efficiency |
|-----------|-------------|------------|
| **Query** | Finds items based on the primary key (partition key) and optionally the sort key. It is fully indexed, so it runs very fast. | **High** - Most efficient way to retrieve data |
| **Scan** | Looks through every item in a table. It is less efficient and can take significant time for larger tables. | **Low** - Reads every item; avoid on large tables |

#### Part A: Query Operation

1. Expand **Scan/Query items**, and choose **Query**.
2. Fields for the `Artist` (Partition key) and `Song` (Sort key) are now displayed.
3. Enter the following details:
   - **Artist (Partition key):** `Psy`
   - **Song (Sort key):** `Gangnam Style`
4. Choose **Run**.

> The song quickly appears in the list. You might need to scroll down to see this result.

> **Key Takeaway:** A query is the most efficient way to retrieve data from a DynamoDB table because it leverages the primary key index.

#### Part B: Scan Operation

1. Scroll up on the page, and choose **Scan**.
2. Expand **Filters**, and enter the following values:
   - **Attribute name:** `Year`
   - **Type:** `Number`
   - **Value:** `1971`
3. Choose **Run**.

> Only the song released in `1971` is displayed.

> **Key Takeaway:** A scan reads every item in the table and then applies the filter. While useful for small tables or exploratory operations, it is not recommended for production workloads on large tables due to cost and performance implications.

#### Expected Outcome

- **Query:** Successfully retrieves the `Psy` - `Gangnam Style` item using the primary key.
- **Scan:** Successfully retrieves the `John Lennon` - `Imagine` item (Year = 1971) by scanning all items.

---

### Task 5: Delete the Table

> **Objective:** Delete the `Music` table and all its data.

In this task, you will delete the `Music` table, which will also delete all the data in the table.

> **Warning:** This action is **irreversible**. Deleting a table removes all items, indexes, and configuration permanently.

#### Step-by-Step Instructions

1. In the DynamoDB dashboard, under **Tables**, choose **Update settings**.
2. Choose the `Music` table if it is not already selected.
3. Choose **Actions**, and then choose **Delete table**.
4. On the confirmation panel, enter `delete` and choose **Delete table**.

> The table will be deleted.

#### Expected Outcome

The `Music` table is permanently deleted from DynamoDB, along with all its items and data.

---

## Conclusion

Congratulations! You have successfully:

- Created an Amazon DynamoDB table
- Entered data into an Amazon DynamoDB table
- Queried an Amazon DynamoDB table
- Deleted an Amazon DynamoDB table

### What You Learned

1. **Table Creation:** DynamoDB tables require at minimum a partition key. An optional sort key can be added to create a composite primary key.
2. **Flexible Schema:** Unlike relational databases, DynamoDB items in the same table can have different attributes. You only need to provide the primary key(s) when creating an item.
3. **Data Modification:** Existing items can be easily updated through the console.
4. **Query Efficiency:** The `Query` operation is the most efficient way to retrieve data because it uses the primary key index. The `Scan` operation reads all items and should be used sparingly.
5. **Table Deletion:** Deleting a table is a permanent action that removes all associated data and indexes.

### Next Steps

- Explore DynamoDB's **Global Secondary Indexes (GSI)** and **Local Secondary Indexes (LSI)** for more advanced querying capabilities.
- Learn about **DynamoDB Streams** to capture table activity in real time.
- Investigate **DynamoDB Accelerator (DAX)** for microsecond latency read performance.
- Review the [DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/) for best practices on capacity planning, data modeling, and security.

---

## Lab Complete

> **End of Lab**
