# Linux Editing Files Lab - AWS Academy

> **Lab:** [LX]-Lab - Editing Files  
> **Platform:** Amazon Linux EC2 instance  
> **Focus:** SSH access, Vim, nano, file creation, editing, saving, and command-line text editing workflow

---

## Overview

This lab introduces command-line text editing on an Amazon Linux EC2 instance.

In this lab, I practiced how to:

- Connect to an Amazon Linux EC2 instance using SSH.
- Run the Vim tutorial with `vimtutor`.
- Create and edit files using Vim.
- Save changes and exit Vim using commands such as `:wq` and `:q!`.
- Create and edit files using nano.
- Compare the editing workflow in Vim and nano.

---

## Task 1 - SSH Connection to EC2

This task covers connecting to an Amazon Linux EC2 instance using SSH.

### Windows Users - PuTTY

1. Select the **Details** drop-down menu above the lab instructions.
2. Choose **Show** to view the credentials window.
3. Note the **PublicIP** address.
4. Choose **Download PPK** and save the `labsuser.ppk` file.
5. Close the Details panel.
6. Download and open [PuTTY](https://the.earth.li/~sgtatham/putty/latest/w64/putty.exe) if it is not already installed.
7. Configure the PuTTY session using the Public IP address and `labsuser.ppk` file.

Reference guide:

- [Connect to your Linux instance from Windows](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/connect-linux-inst-from-windows.html)

---

## Task 2 - Run the Vim Tutorial

`vimtutor` is a built-in tutorial that teaches the basics of Vim, one of the main text editors used in Linux environments.

### Start vimtutor

```bash
vimtutor
```

Press **Enter** to begin the tutorial.

If `vimtutor` is not available, install Vim:

```bash
sudo yum install vim
```

### Complete Lessons 1-3

The first three lessons cover essential Vim skills, including:

- Moving around inside a file.
- Entering insert mode.
- Deleting text.
- Saving changes.
- Exiting Vim.

### Exit vimtutor

```vim
:q!
```

Press **Enter** to close the tutorial without saving changes.

---

## Task 3 - Edit a File in Vim

In this task, I created and edited a file named `helloworld` using Vim.

### Create and Open the File

```bash
vim helloworld
```

Press **Enter** to create and open the file.

### Enter Insert Mode

Press `i` to enter insert mode.

When Vim is in insert mode, text typed on the keyboard is added to the file.

### Add Text

```text
Hello World!
This is my first file in Linux and I am editing it in Vim!
```

### Save and Quit

1. Press `Esc` to exit insert mode.
2. Type the save-and-quit command:

```vim
:wq
```

3. Press **Enter**.

The `:wq` command writes the file changes and exits Vim.

---

## Task 4 - Reopen and Edit the File in Vim

### Reopen the File

```bash
vim helloworld
```

Tip: Use the up arrow key to recall the previous command.

### Add Another Line

Press `i` to enter insert mode, then add:

```text
I learned how to create a file, edit and save them too!
```

### Exit Without Saving

1. Press `Esc` to exit insert mode.
2. Type:

```vim
:q!
```

3. Press **Enter**.

The `:q!` command quits Vim without saving the latest changes.

### Difference Between `:wq` and `:q!`

| Command | Meaning | Result |
|---|---|---|
| `:wq` | Write and quit | Saves changes and exits Vim. |
| `:q!` | Quit forcefully | Exits Vim without saving changes. |

---

## Task 5 - Edit a File in Nano

`nano` is a command-line text editor that is more beginner-friendly than Vim because it does not require insert mode.

### Create and Open a File

```bash
nano cloudworld
```

### Add Text

```text
We are using nano this time! We can simply start typing! No insert mode needed.
```

### Save Changes

1. Press `Ctrl + O`.
2. Press **Enter** to confirm the file name.

### Exit nano

Press `Ctrl + X`.

### Verify the File

Reopen the file:

```bash
nano cloudworld
```

Confirm that the text was saved, then press `Ctrl + X` to exit.

---

## Additional Vim Practice

### Delete the Current Line

```vim
dd
```

Move the cursor to a line and press `d` twice to delete the entire line.

### Undo the Last Command

```vim
u
```

Press `u` to undo the last action.

### Save Without Quitting

```vim
:w
```

The `:w` command saves the file without closing Vim.

---

## Key Differences Between Vim and Nano

| Feature | Vim | nano |
|---|---|---|
| Insert mode required | Yes, press `i`. | No. |
| Save command | `:w` | `Ctrl + O` |
| Quit command | `:q` | `Ctrl + X` |
| Learning curve | Steeper | Easier for beginners |
| Flexibility | Very high | Moderate |

---

## Vim Quick Reference

| Command | Action |
|---|---|
| `i` | Enter insert mode. |
| `Esc` | Exit insert mode. |
| `:w` | Save file. |
| `:q` | Quit if there are no unsaved changes. |
| `:wq` | Save and quit. |
| `:q!` | Quit without saving. |
| `dd` | Delete the current line. |
| `u` | Undo the last action. |
| `h` | Move left. |
| `j` | Move down. |
| `k` | Move up. |
| `l` | Move right. |

---

## Nano Quick Reference

| Shortcut | Action |
|---|---|
| `Ctrl + O` | Save file. |
| `Ctrl + X` | Exit editor. |
| `Ctrl + K` | Cut line. |
| `Ctrl + U` | Paste line. |
| `Ctrl + W` | Search for text. |

---

## Troubleshooting

### `vimtutor` Not Found

Install Vim:

```bash
sudo yum install vim
```

### Commands Require Elevated Permissions

Some systems may require `sudo` for editing protected files:

```bash
sudo vim helloworld
sudo nano cloudworld
```

### Changes Not Saved in Vim

Use `:wq` to save and quit. The command `:q!` quits without saving changes.

---

## Key Concepts Learned

| Concept | Description |
|---|---|
| Vim | Powerful command-line text editor with modes and command shortcuts. |
| nano | Beginner-friendly command-line text editor. |
| Insert Mode | Vim mode used for typing text into a file. |
| Write | Saving changes to a file. |
| Quit Without Saving | Exiting an editor while discarding unsaved changes. |
| SSH | Secure way to connect to a remote Linux instance. |

---

## Reflection

This lab helped me practice editing files directly from the Linux terminal. I learned the difference between Vim and nano, how to create files, how to save changes, and how to exit an editor without saving.

These skills are important for cloud and systems administration because configuration files, scripts, logs, and documentation are often edited from the command line.

---

## Additional Resources

- [Vim Official Documentation](https://www.vim.org/docs.php)
- [nano Editor Manual](https://www.nano-editor.org/docs.php)
- [AWS EC2 Connection Guide](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)
- [Linux Command Line Basics](https://ubuntu.com/tutorials/command-line-for-beginners)

---

*Lab completed as part of the AWS re/Start Programme.*
