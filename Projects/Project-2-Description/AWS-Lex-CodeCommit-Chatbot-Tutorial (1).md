# AWS Lex CodeCommit Chatbot Demo — Complete Console Tutorial

> **Project Type:** Educational Chatbot | **Difficulty:** Intermediate  
> **Services:** Amazon Lex V2, AWS Lambda, IAM, CloudWatch  
> **Estimated Time:** 45–60 minutes

---

## 1. Project Overview

You are building an interactive educational chatbot for a fictional client, **Cloud Learners Inc.**, using the **AWS Management Console** and **AWS Lambda**.

The chatbot teaches learners about **AWS CodeCommit** — AWS's fully managed source control service — and includes a short quiz to assess understanding.

### Client Requirements

| Requirement | How It's Met |
|-------------|--------------|
| Answer basic CodeCommit questions | Three information intents with detailed responses |
| Run an interactive quiz | Lambda-driven quiz with branching logic |
| Provide feedback on answers | Correct/incorrect responses after each question |
| Demonstrate live in console | Amazon Lex test window |

---

## 2. What the Chatbot Does

### Part 1: Information Chatbot

Users can ask natural-language questions about CodeCommit. The bot recognizes the intent and returns a helpful, detailed response.

**Example interaction:**

```
User:  How do I create a repository in CodeCommit?
Bot:   To create a repository, run: aws codecommit create-repository 
       --repository-name {RepoName} --repository-description 'description'. 
       You can also do this from the AWS Console under 
       CodeCommit > Repositories > Create repository.
```

### Part 2: CodeCommit Quiz

Users start the quiz with a simple command. The bot asks 5 multiple-choice questions, gives immediate feedback, and tracks progress across the conversation.

**Example interaction:**

```
User:  Start quiz
Bot:   Welcome to the AWS CodeCommit Quiz!
       Question 1: What is AWS CodeCommit primarily used for?
       A) Hosting private Git repositories
       B) Running virtual machines
       C) Monitoring application performance
       Choose A, B, or C.

User:  A
Bot:   Correct! AWS CodeCommit is a fully managed source control service 
       that hosts secure private Git repositories. Would you like the next question?

User:  yes
Bot:   Question 2: Which version control system does AWS CodeCommit support?
       ...
```

---

## 3. Architecture & Services

![imagine](https://github.com/Isaacdvs2/AWS-re-Start-Lex-Chatbot-Project/raw/main/resources/AWSLexFlow.png)
```

| Service | Role in This Project |
|---------|---------------------|
| **Amazon Lex V2** | Natural language understanding, intent classification, conversation management |
| **AWS Lambda** | Quiz branching logic, session state management, response generation |
| **IAM** | Grants Lex permission to invoke the Lambda function |
| **CloudWatch Logs** | Debugging and monitoring Lambda execution |

---

## 4. Key Concepts

### Bot
A complete chatbot project in Amazon Lex.  
**This project:** `CodeCommitLearningBot`

### Intent
What the user wants to accomplish.  
**Examples:** `CreateRepository`, `CloneRepository`, `CodeCommitQuiz`

### Utterance
A sample phrase the user might type. Lex uses these to train its intent classifier.  
**Example:** `"How do I create a repository in CodeCommit?"`

### Response
The message the bot sends back to the user.  
**Example:** `"To create a repository, run: aws codecommit create-repository..."`

### Lambda Fulfillment
Lex sends the user's input to a Lambda function, which computes the response dynamically. This is essential for the quiz because the bot must remember which question the user is on.

### Session Attributes
Temporary key-value pairs stored during a conversation.  
**This project:** `quizQuestion` tracks the current quiz question number.

---

## 5. Step 1: Create the Amazon Lex Bot

### 5.1 Open Amazon Lex

![imagine](https://github.com/MrPhadagi-bit/ppppp1/blob/main/amazon%20lex%20screenshot/Screenshot%202026-07-03%20172635.png?raw=true)

1. Sign in to the [AWS Management Console](https://console.aws.amazon.com/)
2. In the top search bar, type: `Amazon Lex`
3. Select **Amazon Lex**
4. Choose **Amazon Lex V2** if both versions are shown
5. Click **Create bot**

### 5.2 Choose Bot Creation Method

Select: **Create a blank bot**
![imagine](https://github.com/MrPhadagi-bit/ppppp1/blob/main/amazon%20lex%20screenshot/Screenshot%202026-07-03%20172749.png?raw=true)

> This gives you an empty bot so you can build all intents manually.

### 5.3 Configure Bot Details

![imagine](https://github.com/MrPhadagi-bit/ppppp1/blob/main/amazon%20lex%20screenshot/Screenshot%202026-07-03%20172835.png?raw=true)

| Setting | Value |
|---------|-------|
| **Bot name** | `CodeCommitLearningBot` |
| **Description** | `AWS CodeCommit learning and quiz chatbot` |
| **IAM permissions** | Create a role with basic Amazon Lex permissions |
| **COPPA** | No |
| **Idle session timeout** | 5 minutes |

### 5.4 Add Language

| Setting | Value |
|---------|-------|
| **Language** | English (ZA) — if available |
| **Fallback language** | English (US) — if English (ZA) is unavailable |
| **Voice interaction** | None |
| **Intent classification confidence score threshold** | Keep default |

Click **Done**.

---

## 6. Step 2: Create Information Intent — CreateRepository

This intent answers questions about creating an AWS CodeCommit repository.

### 6.1 Add Empty Intent

1. In the left menu, click **Intents**
2. Click **Add intent**
3. Select **Add empty intent**
4. Enter intent name: `CreateRepository`
5. Click **Add**
![imagine](https://github.com/MrPhadagi-bit/ppppp1/blob/main/amazon%20lex%20screenshot/Screenshot%202026-07-04%20125643.png?raw=true)

### 6.2 Add Sample Utterances

In the **Sample utterances** section, add each of the following:

```text
How do I create a repository in CodeCommit?
Create a CodeCommit repository
How can I make a new repository?
I want to create a repo
How do I make a CodeCommit repo?
How do I create a new AWS repository?
Show me how to create a CodeCommit repository
```
![imagine](https://github.com/MrPhadagi-bit/ppppp1/blob/main/amazon%20lex%20screenshot/Screenshot%202026-07-04%20125714.png?raw=true)

> **Tip:** Include varied phrasing to improve intent recognition accuracy.

### 6.3 Add Closing Response

Scroll to **Closing response** and enter:

```text
To create a repository, run: aws codecommit create-repository --repository-name RepoName --repository-description 'description'. You can also do this from the AWS Console under CodeCommit > Repositories > Create repository.
```

### 6.4 Save Intent

Click **Save intent**.
![imagine](https://github.com/MrPhadagi-bit/ppppp1/blob/main/amazon%20lex%20screenshot/Screenshot%202026-07-03%20173328.png?raw=true)

---

## 7. Step 3: Create Information Intent — CloneRepository

This intent explains how to clone a CodeCommit repository.

### 7.1 Add Empty Intent

Create a new empty intent named: `CloneRepository`

### 7.2 Add Sample Utterances

```text
How do I clone a CodeCommit repo?
Clone a CodeCommit repository
How can I download my repository?
How do I clone my repo?
Give me the CodeCommit clone command
How do I get my CodeCommit repository on my computer?
What command clones a CodeCommit repository?
```

### 7.3 Add Closing Response

```text
You can clone your repository using: git clone https://git-codecommit.{region}.amazonaws.com/v1/repos/{RepoName}. Make sure you have configured Git credentials, SSH, HTTPS, or the credential helper first.
```

### 7.4 Save Intent

Click **Save intent**.

---

## 8. Step 4: Create Information Intent — ManagePermissions

This intent explains how CodeCommit access is managed through IAM.

### 8.1 Add Empty Intent

Create a new empty intent named: `ManagePermissions`

### 8.2 Add Sample Utterances

```text
How do I give someone access to a repository?
Manage repository permissions
How do I add a user to CodeCommit?
How do I control access to CodeCommit?
How do I give permissions for a repo?
How do I allow another developer to use my repository?
How are CodeCommit permissions managed?
```

### 8.3 Add Closing Response

```text
Repository access is managed through IAM policies. Attach a policy granting codecommit actions to the user or role, scoped to the repository ARN. You can also use AWS IAM Identity Center for federated access.
```

### 8.4 Save Intent

Click **Save intent**.

### Why These Intents Don't Need Lambda

The first three intents are **simple Q&A intents**:

- The user asks one question
- Lex identifies the correct intent
- Lex sends one static response
- No conversation state needs to be remembered

The quiz is different — it has multiple steps and requires state tracking. That's why the quiz uses Lambda.

---

## 9. Step 5: Create the Lambda Function

The Lambda function controls the entire quiz flow:

- Starting the quiz
- Asking each question
- Validating answers (A, B, or C)
- Providing correct/incorrect feedback
- Tracking progress via session attributes
- Ending the quiz after question 5

### 9.1 Open AWS Lambda

1. In the AWS Console search bar, type: `Lambda`
2. Open **AWS Lambda**
3. Click **Create function**

### 9.2 Choose Function Type

Select: **Author from scratch**

### 9.3 Configure Function

| Setting | Value |
|---------|-------|
| **Function name** | `CodeCommitLexFulfillment` |
| **Runtime** | Python 3.12 (or latest available Python runtime) |
| **Architecture** | x86_64 |
| **Permissions** | Create a new role with basic Lambda permissions |

Click **Create function**.

### 9.4 Replace the Default Code

In the Lambda code editor:

1. Ensure the file is named: `lambda_function.py`
2. Replace all default code with the following:

```python
INFO_RESPONSES = {
    "CreateRepository": (
        "To create a repository, run: aws codecommit create-repository "
        "--repository-name {RepoName} --repository-description 'description'. "
        "You can also do this from the AWS Console under CodeCommit > "
        "Repositories > Create repository."
    ),
    "CloneRepository": (
        "You can clone your repository using: git clone "
        "https://git-codecommit.{region}.amazonaws.com/v1/repos/{RepoName}. "
        "Make sure you have configured Git credentials, SSH, HTTPS, or the "
        "credential helper first."
    ),
    "ManagePermissions": (
        "Repository access is managed through IAM policies. Attach a policy "
        "granting codecommit actions to the user or role, scoped to the "
        "repository ARN. You can also use AWS IAM Identity Center for "
        "federated access."
    ),
}

QUIZ_QUESTIONS = {
    "1": {
        "question": (
            "Welcome to the AWS CodeCommit Quiz!\n"
            "Question 1: What is AWS CodeCommit primarily used for?\n"
            "A) Hosting private Git repositories\n"
            "B) Running virtual machines\n"
            "C) Monitoring application performance\n"
            "Choose A, B, or C."
        ),
        "correct": "A",
        "correct_response": (
            "Correct! AWS CodeCommit is a fully managed source control service "
            "that hosts secure private Git repositories. Would you like the "
            "next question?"
        ),
        "incorrect_response": (
            "Incorrect. The correct answer is A) Hosting private Git repositories. "
            "AWS CodeCommit helps developers securely store and manage source "
            "code using Git. Would you like to try the next question?"
        ),
    },
    "2": {
        "question": (
            "Question 2: Which version control system does AWS CodeCommit support?\n"
            "A) Git\n"
            "B) SVN\n"
            "C) Mercurial\n"
            "Choose A, B, or C."
        ),
        "correct": "A",
        "correct_response": (
            "Correct! AWS CodeCommit supports Git, allowing developers to clone, "
            "commit, branch, and merge code. Would you like the next question?"
        ),
        "incorrect_response": (
            "Incorrect. The correct answer is A) Git. AWS CodeCommit is designed "
            "to work with Git repositories and standard Git tools. Would you like "
            "the next question?"
        ),
    },
    "3": {
        "question": (
            "Question 3: Which AWS service is commonly used to manage permissions "
            "for CodeCommit repositories?\n"
            "A) Amazon S3\n"
            "B) AWS IAM\n"
            "C) Amazon EC2\n"
            "Choose A, B, or C."
        ),
        "correct": "B",
        "correct_response": (
            "Correct! AWS IAM is used to manage users, roles, policies, and "
            "permissions for CodeCommit. Would you like the next question?"
        ),
        "incorrect_response": (
            "Incorrect. The correct answer is B) AWS IAM. IAM policies control "
            "who can access CodeCommit repositories. Would you like the next question?"
        ),
    },
    "4": {
        "question": (
            "Question 4: What command is used to copy a CodeCommit repository "
            "to your local computer?\n"
            "A) git clone\n"
            "B) git delete\n"
            "C) git monitor\n"
            "Choose A, B, or C."
        ),
        "correct": "A",
        "correct_response": (
            "Correct! The git clone command copies a repository to your local "
            "computer. Would you like the final question?"
        ),
        "incorrect_response": (
            "Incorrect. The correct answer is A) git clone. This command downloads "
            "a copy of the repository to your computer. Would you like the final question?"
        ),
    },
    "5": {
        "question": (
            "Question 5: What type of repositories does AWS CodeCommit host?\n"
            "A) Secure private Git repositories\n"
            "B) Physical storage drives\n"
            "C) Virtual machines\n"
            "Choose A, B, or C."
        ),
        "correct": "A",
        "correct_response": (
            "Correct! AWS CodeCommit hosts secure private Git repositories. "
            "Thanks for participating in the quiz!"
        ),
        "incorrect_response": (
            "Incorrect. The correct answer is A) Secure private Git repositories. "
            "Thanks for participating in the quiz!"
        ),
    },
}


def lambda_handler(event, context):
    intent_name = event["sessionState"]["intent"]["name"]
    session_attributes = event.get("sessionState", {}).get("sessionAttributes") or {}
    transcript = (event.get("inputTranscript") or "").strip()

    if intent_name in INFO_RESPONSES:
        return close(event, INFO_RESPONSES[intent_name], session_attributes)

    if intent_name == "CodeCommitQuiz":
        return handle_quiz(event, transcript, session_attributes)

    return close(
        event,
        "I can help with AWS CodeCommit repositories, cloning, permissions, or a CodeCommit quiz.",
        session_attributes,
    )


def handle_quiz(event, transcript, session_attributes):
    answer = transcript.upper()
    current_question = session_attributes.get("quizQuestion", "start")

    # Start the quiz
    if current_question == "start":
        session_attributes["quizQuestion"] = "1"
        return elicit_intent(event, QUIZ_QUESTIONS["1"]["question"], session_attributes)

    # Process answer for questions 1–5
    if current_question in ["1", "2", "3", "4", "5"]:
        if answer not in ["A", "B", "C"]:
            return elicit_intent(event, "Please choose A, B, or C.", session_attributes)

        question = QUIZ_QUESTIONS[current_question]
        message = (
            question["correct_response"]
            if answer == question["correct"]
            else question["incorrect_response"]
        )

        # End quiz after question 5
        if current_question == "5":
            session_attributes.pop("quizQuestion", None)
            return close(event, message, session_attributes)

        # Wait for user to confirm next question
        session_attributes["quizQuestion"] = f"awaiting_next_{current_question}"
        return elicit_intent(event, message, session_attributes)

    # Handle "next question" confirmation
    if current_question.startswith("awaiting_next_"):
        if answer in ["YES", "Y", "NEXT", "CONTINUE", "OK", "SURE"]:
            previous_question = current_question.replace("awaiting_next_", "")
            next_question = str(int(previous_question) + 1)
            session_attributes["quizQuestion"] = next_question
            return elicit_intent(event, QUIZ_QUESTIONS[next_question]["question"], session_attributes)

        if answer in ["NO", "N"]:
            session_attributes.pop("quizQuestion", None)
            return close(event, "No problem. Thanks for trying the CodeCommit quiz!", session_attributes)

        return elicit_intent(event, "Please type yes for the next question, or no to stop.", session_attributes)

    # Fallback: restart quiz
    session_attributes["quizQuestion"] = "1"
    return elicit_intent(event, QUIZ_QUESTIONS["1"]["question"], session_attributes)


def close(event, message, session_attributes):
    """End the conversation."""
    return response(event, "Close", message, session_attributes)


def elicit_intent(event, message, session_attributes):
    """Keep the conversation open for the next user input."""
    return response(event, "ElicitIntent", message, session_attributes)


def response(event, dialog_action_type, message, session_attributes):
    """Build the Lex V2 response structure."""
    intent = event["sessionState"]["intent"]
    intent["state"] = "Fulfilled" if dialog_action_type == "Close" else "InProgress"

    return {
        "sessionState": {
            "sessionAttributes": session_attributes,
            "dialogAction": {"type": dialog_action_type},
            "intent": intent,
        },
        "messages": [{"contentType": "PlainText", "content": message}],
    }
```

### 10.5 Deploy the Function

Click **Deploy**.

>  **Critical:** If you forget to deploy, Lex will use the old (default) version of the code. Always deploy after making changes.

---

## 11. Step 6: Lambda Code Deep Dive

Understanding the Lambda code helps with debugging and customization.

### 11.1 `INFO_RESPONSES` Dictionary

Stores static responses for the three information intents. When Lex sends an intent name that matches a key, Lambda returns the corresponding value.

```python
"CreateRepository": "To create a repository..."
```

### 11.2 `QUIZ_QUESTIONS` Dictionary

Each question is a nested dictionary containing:

| Key | Purpose |
|-----|---------|
| `question` | The question text + multiple-choice options |
| `correct` | The correct answer letter (A, B, or C) |
| `correct_response` | Feedback when the user answers correctly |
| `incorrect_response` | Feedback + correct answer when the user is wrong |

### 11.3 `handle_quiz()` Function

The core quiz logic uses a **state machine** pattern:

```
start ──▶ Question 1 ──▶ awaiting_next_1 ──▶ Question 2 ──▶ ... ──▶ Question 5 ──▶ END
            │                │
            ▼                ▼
         Check A/B/C     Check yes/no
         Give feedback   Move forward or stop
```

**State tracking via `quizQuestion` session attribute:**

| Value | Meaning |
|-------|---------|
| `start` | Quiz hasn't started yet |
| `1`–`5` | Currently on that question |
| `awaiting_next_1`–`awaiting_next_4` | Waiting for user to continue |

### 11.4 Response Helpers

| Function | Dialog Action | Use Case |
|----------|---------------|----------|
| `close()` | `Close` | End the conversation |
| `elicit_intent()` | `ElicitIntent` | Keep conversation open, wait for next input |

---

## 12. Step 7: Grant Lex Permission to Invoke Lambda

Amazon Lex must be explicitly allowed to call your Lambda function.

### Option A: Via the Lambda Console

1. Open the Lambda function: `CodeCommitLexFulfillment`
2. Click **Configuration** → **Permissions**
3. Under **Resource-based policy statements**, check for a statement with principal: `lexv2.amazonaws.com`
4. If it exists, you're done. If not, proceed to Option B.

![imagine](https://github.com/MrPhadagi-bit/ppppp1/blob/main/amazon%20lex%20screenshot/Screenshot%202026-07-04%20130915.png?raw=true)

### Option B: Via AWS CloudShell

1. In the AWS Console, open **CloudShell** (icon in the top navigation bar)
2. Run the following command:

```bash
aws lambda add-permission \
  --function-name CodeCommitLexFulfillment \
  --statement-id AllowLexInvoke \
  --action lambda:InvokeFunction \
  --principal lexv2.amazonaws.com
```

> If you see a message that the statement already exists, that's fine — permission was already granted.

---

## 13. Step 8: Create the Quiz Intent in Amazon Lex

### 13.1 Open Your Bot

1. Open **Amazon Lex**
2. Open: `CodeCommitLearningBot`
3. Open your language (e.g., English (US) or English (ZA))
4. Click **Intents**
![imagine](https://github.com/MrPhadagi-bit/ppppp1/blob/main/amazon%20lex%20screenshot/Screenshot%202026-07-04%20131041.png?raw=true)   

### 13.2 Add Empty Intent

Create a new intent named: `CodeCommitQuiz`

### 13.3 Add Quiz Utterances

Add these sample utterances to start the quiz:

```text
Start quiz
Quiz me on CodeCommit
I am ready for the quiz
Begin CodeCommit quiz
Start CodeCommit quiz
I want to take the quiz
Can I take the CodeCommit quiz?
Ask me CodeCommit questions
```

### 13.4 Add Answer Utterances

**Critical:** Also add these short responses as utterances. The learner will use these during the quiz.

```text
A
B
C
yes
no
next
continue
sure
ok
```

> Without these, Lex may fail to recognize short quiz answers.

### 13.5 Enable Fulfillment

![imagine](https://github.com/MrPhadagi-bit/ppppp1/blob/main/amazon%20lex%20screenshot/Screenshot%202026-07-04%20131149.png?raw=true)

1. Scroll to **Fulfillment**
2. Turn **Active** on
3. Select **Use a Lambda function for fulfillment**
4. Click **Save intent**

---

## 14. Step 9: Connect Lambda to the Lex Alias

The intent can have fulfillment enabled, but the **bot alias** must also know which Lambda function to call.

### 14.1 Build the Bot

1. In Amazon Lex, click **Build**
2. Wait for the build to complete (status will show success)

![imagine](https://github.com/MrPhadagi-bit/ppppp1/blob/main/amazon%20lex%20screenshot/Screenshot%202026-07-04%20131355.png?raw=true)

### 14.2 Open the Alias

1. In the left menu, click **Aliases**
2. Open: `TestBotAlias`

![imagine](https://github.com/MrPhadagi-bit/ppppp1/blob/main/amazon%20lex%20screenshot/Screenshot%202026-07-04%20131419.png?raw=true)   

### 14.3 Select Lambda Function

![imagine](https://github.com/MrPhadagi-bit/ppppp1/blob/main/amazon%20lex%20screenshot/Screenshot%202026-07-04%20131442.png?raw=true)
1. Find the language section for your bot language
2. Under **Lambda function**, select: `CodeCommitLexFulfillment`
3. For **Lambda version or alias**, choose: `$LATEST`
4. Click **Save**

![imagine](https://github.com/MrPhadagi-bit/ppppp1/blob/main/amazon%20lex%20screenshot/Screenshot%202026-07-04%20131455.png?raw=true)

---

## 15. Step 10: Build & Test

### 15.1 Build the Bot Again

After changing intents or Lambda settings, always rebuild:

1. Go back to the bot language page
2. Click **Build**
3. Wait until Lex confirms the build is complete

![imagine](https://github.com/MrPhadagi-bit/ppppp1/blob/main/amazon%20lex%20screenshot/Screenshot%202026-07-04%20131537.png?raw=true)

### 15.2 Test Information Intents

Open the Lex **Test** window and run these tests:

#### Test 1: Create Repository

```
User: How do I create a repository in CodeCommit?
Bot:  To create a repository, run: aws codecommit create-repository 
      --repository-name {RepoName} --repository-description 'description'. 
      You can also do this from the AWS Console under CodeCommit > 
      Repositories > Create repository.
```

#### Test 2: Clone Repository

```
User: How do I clone a CodeCommit repo?
Bot:  You can clone your repository using: git clone 
      https://git-codecommit.{region}.amazonaws.com/v1/repos/{RepoName}. 
      Make sure you have configured Git credentials, SSH, HTTPS, or the 
      credential helper first.
```

#### Test 3: Manage Permissions

```
User: How do I give someone access to a repository?
Bot:  Repository access is managed through IAM policies. Attach a policy 
      granting codecommit actions to the user or role, scoped to the 
      repository ARN. You can also use AWS IAM Identity Center for 
      federated access.
```

### 15.3 Test the Quiz

#### Start the Quiz

```
User: Start quiz
Bot:  Welcome to the AWS CodeCommit Quiz!
      Question 1: What is AWS CodeCommit primarily used for?
      A) Hosting private Git repositories
      B) Running virtual machines
      C) Monitoring application performance
      Choose A, B, or C.
```

#### Answer Correctly

```
User: A
Bot:  Correct! AWS CodeCommit is a fully managed source control service 
      that hosts secure private Git repositories. Would you like the next question?
```

#### Continue

```
User: yes
Bot:  Question 2: Which version control system does AWS CodeCommit support?
      A) Git
      B) SVN
      C) Mercurial
      Choose A, B, or C.
```

#### Answer Incorrectly

```
User: C
Bot:  Incorrect. The correct answer is A) Git. AWS CodeCommit is designed 
      to work with Git repositories and standard Git tools. Would you like 
      the next question?
```

Continue through all 5 questions using `yes` to proceed.

---

## 16. Quiz Question Bank

| # | Question | A | B | C |  Correct |
|---|----------|---|---|---|-----------|
| 1 | What is AWS CodeCommit primarily used for? | Hosting private Git repositories | Running virtual machines | Monitoring application performance | **A** |
| 2 | Which version control system does AWS CodeCommit support? | Git | SVN | Mercurial | **A** |
| 3 | Which AWS service manages permissions for CodeCommit repositories? | Amazon S3 | AWS IAM | Amazon EC2 | **B** |
| 4 | What command copies a CodeCommit repository to your local computer? | git clone | git delete | git monitor | **A** |
| 5 | What type of repositories does AWS CodeCommit host? | Secure private Git repositories | Physical storage drives | Virtual machines | **A** |

---

## 17. Complete Testing Matrix

Use this matrix to verify all functionality before your demonstration:

| # | Test Case | User Input | Expected Result |
|---|-----------|------------|-----------------|
| 1 | Information — Create | `How do I create a repository in CodeCommit?` | Bot explains repository creation |
| 2 | Information — Clone | `How do I clone a CodeCommit repo?` | Bot explains git clone command |
| 3 | Information — Permissions | `How do I give someone access to a repository?` | Bot explains IAM permissions |
| 4 | Quiz start | `Start quiz` | Bot asks Question 1 |
| 5 | Correct answer | `A` (Q1) | Bot says "Correct!" and asks to continue |
| 6 | Continue quiz | `yes` | Bot asks next question |
| 7 | Incorrect answer | `C` (Q2) | Bot gives correct answer + explanation |
| 8 | Stop quiz | `no` | Bot ends quiz politely |
| 9 | Invalid input | `hello` during quiz | Bot asks to choose A, B, or C |
| 10 | Fallback | Unrecognized input | Bot offers help options |

---

## 18. Live Demo Script

Use this script during your presentation to ensure a smooth, professional demonstration.

### 18.1 Opening (30 seconds)

> *"This is my AWS Lex CodeCommit chatbot demo. The chatbot was created for Cloud Learners Inc. It teaches learners about AWS CodeCommit and includes a short quiz to check their understanding."*

### 18.2 Show the Bot Structure (1 minute)

1. Open **Amazon Lex** in the AWS Console
2. Show the bot: `CodeCommitLearningBot`
3. Show the four intents:
   - `CreateRepository`
   - `CloneRepository`
   - `ManagePermissions`
   - `CodeCommitQuiz`
4. Briefly mention sample utterances and closing responses

### 18.3 Demonstrate Information Responses (1 minute)

Type in the test window:

```
How do I create a repository in CodeCommit?
```

Then type:

```
How do I clone a CodeCommit repo?
```

### 18.4 Demonstrate the Quiz (2 minutes)

Type:

```
Start quiz
```

Answer:

```
A
```

Continue:

```
yes
```

Answer incorrectly to show feedback:

```
C
```

Continue to the end.

### 18.5 Explain the Technical Approach (1 minute)

> *"The bot uses intents to identify what the learner wants. Sample utterances train Lex to recognize different ways a learner might ask the same question. For the quiz, I used AWS Lambda because the conversation needs to remember which question the learner is answering. Lambda stores the current question in a session attribute called `quizQuestion`."*

### 18.6 Closing (30 seconds)

> *"This solution meets the client requirement because it provides educational explanations, interactive quiz questions, and clear feedback for both correct and incorrect answers."*

---

## 19. Troubleshooting Guide

### Problem 1: The Bot Does Not Call Lambda

**Symptoms:** Quiz intent returns a static response or error.

**Possible Causes:**
- Lambda fulfillment is not enabled on the quiz intent
- The Lambda function is not connected to `TestBotAlias`
- The bot was not rebuilt after changes
- Lex does not have permission to invoke Lambda

**Fix:**
1. Open the `CodeCommitQuiz` intent → confirm **Fulfillment** is active
2. Open `TestBotAlias` → confirm `CodeCommitLexFulfillment` is selected
3. Click **Build** and wait for completion
4. Verify Lambda permission via CloudShell (see Step 7)

---

### Problem 2: The Bot Does Not Understand A, B, or C

**Symptoms:** Bot responds with fallback or asks to repeat during quiz.

**Possible Cause:** The quiz intent is missing short answer utterances.

**Fix:**
Add these utterances to `CodeCommitQuiz`:

```text
A
B
C
yes
no
next
continue
sure
ok
```

Then **Save intent** and **Build** again.

---

### Problem 3: Lambda Shows an Error

**Symptoms:** Test window shows an error or no response.

**Fix:**
1. Open **AWS Lambda** → `CodeCommitLexFulfillment`
2. Click **Monitor** → **View CloudWatch logs**
3. Find the latest log stream and look for error messages
4. Check that the Lambda code was copied correctly (especially indentation)
5. Click **Deploy** after fixing the code
6. Rebuild the Lex bot

---

### Problem 4: Bot Gives Old Answers

**Symptoms:** Responses don't match recent code changes.

**Possible Causes:**
- Lambda code was changed but not deployed
- Lex was changed but not rebuilt
- Alias is pointing to the wrong Lambda version

**Fix:**
1. In Lambda, click **Deploy**
2. In Lex, click **Build**
3. In `TestBotAlias`, ensure `$LATEST` is selected
4. Test again

---

### Problem 5: The Quiz Starts Again Unexpectedly

**Symptoms:** Bot asks Question 1 again mid-quiz.

**Possible Cause:** The Lex session timed out or the test window was reset.

**Fix:**
Sessions expire after the idle timeout (5 minutes). Simply type:

```
Start quiz
```

and continue from the beginning.

---

## 19. Project Checklist

Before presenting, confirm every item is complete:

- [ ] AWS Lex bot created with name `CodeCommitLearningBot`
- [ ] Language added (English US or ZA)
- [ ] Intent `CreateRepository` created with utterances and closing response
- [ ] Intent `CloneRepository` created with utterances and closing response
- [ ] Intent `ManagePermissions` created with utterances and closing response
- [ ] Intent `CodeCommitQuiz` created with all utterances (including A/B/C/yes/no)
- [ ] Lambda function `CodeCommitLexFulfillment` created with Python runtime
- [ ] Lambda code pasted correctly into `lambda_function.py`
- [ ] Lambda function **deployed**
- [ ] Lex has permission to invoke Lambda (`lexv2.amazonaws.com` principal)
- [ ] Lambda connected to `TestBotAlias` with `$LATEST` version
- [ ] Quiz fulfillment enabled on `CodeCommitQuiz` intent
- [ ] Bot built successfully (no errors)
- [ ] Information intents tested and working
- [ ] Quiz tested with a correct answer
- [ ] Quiz tested with an incorrect answer
- [ ] Quiz tested with `no` to stop mid-quiz
- [ ] Demo script practiced

---

## 20. Technical Summary for Reviewers

If asked to explain how the project works, use this concise summary:

> *"This project uses Amazon Lex to create an educational chatbot for AWS CodeCommit. The bot has three information intents for repository creation, cloning, and permissions. It also has a quiz intent that uses AWS Lambda for branching logic. Lambda checks the learner's answer, gives feedback, and stores the quiz progress in Lex session attributes. This allows the chatbot to guide the learner through multiple questions in a smooth, stateful conversation."*

### Key Technical Decisions

| Decision | Rationale |
|----------|-----------|
| **Lex V2** | Latest version with improved intent classification |
| **Lambda for quiz only** | Information intents are static; quiz requires stateful branching |
| **Session attributes** | Lightweight, serverless state management without external databases |
| **Python runtime** | Readable, maintainable code with clear dictionary-based quiz structure |
| `$LATEST` alias | Simplifies development; for production, use versioned aliases |

---

## Appendix A: Suggested Demo Conversation Flow

For a clean, predictable live demonstration, use this exact flow:

```
User: How do I create a repository in CodeCommit?
Bot:  To create a repository, run: aws codecommit create-repository...

User: How do I clone a CodeCommit repo?
Bot:  You can clone your repository using: git clone...

User: Start quiz
Bot:  Welcome to the AWS CodeCommit Quiz! Question 1...

User: A
Bot:  Correct! AWS CodeCommit is a fully managed source control service...

User: yes
Bot:  Question 2: Which version control system does AWS CodeCommit support?

User: C
Bot:  Incorrect. The correct answer is A) Git...

User: yes
Bot:  Question 3: Which AWS service is commonly used to manage permissions...

User: B
Bot:  Correct! AWS IAM is used to manage users, roles, policies...

User: yes
Bot:  Question 4: What command is used to copy a CodeCommit repository...

User: A
Bot:  Correct! The git clone command copies a repository...

User: yes
Bot:  Question 5: What type of repositories does AWS CodeCommit host?

User: A
Bot:  Correct! AWS CodeCommit hosts secure private Git repositories. 
      Thanks for participating in the quiz!
```

---

## Appendix B: File Structure Reference

```
CodeCommitLearningBot/
├── Intents/
│   ├── CreateRepository/          # Static Q&A
│   │   ├── SampleUtterances/
│   │   └── ClosingResponse/
│   ├── CloneRepository/           # Static Q&A
│   │   ├── SampleUtterances/
│   │   └── ClosingResponse/
│   ├── ManagePermissions/         # Static Q&A
│   │   ├── SampleUtterances/
│   │   └── ClosingResponse/
│   └── CodeCommitQuiz/            # Lambda fulfillment
│       ├── SampleUtterances/
│       └── Fulfillment/
│           └── Lambda: CodeCommitLexFulfillment
├── Aliases/
│   └── TestBotAlias/
│       └── Language → Lambda mapping
└── Build/
    └── (Rebuild after any change)
```

---

*Document Version: 1.0 | Last Updated: July 2026*
*Based on AWS Lex V2 Console interface as of 2026*
