# Managing Services - Monitoring

> **Note**: All labs rely on previous courseware and lab information.

---

## Objectives

In this lab, you will:

-  Check the status of the `httpd` service to ensure that it is running, and that you can make an HTTP connection to the local host IP address.
-  Learn how to monitor your Amazon Linux 2 EC2 instance using:
  - The Linux `top` command
  - AWS CloudWatch

---

## Duration

 **Estimated Time**: 30 minutes

---

## Task 1: Use SSH to Connect to an Amazon Linux EC2 Instance

In this task, you will connect to an Amazon Linux EC2 instance using an SSH utility. The following instructions vary slightly depending on your operating system.

---

###  Windows Users: Using SSH to Connect

> **If you are using macOS or Linux, [skip to the next section](#-macos--linux-users-using-ssh-to-connect).**

#### Step 1: Retrieve Credentials

1. Select the **Details** drop-down menu above these instructions.
2. Select **Show**. A Credentials window will be presented.
3. Select the **Download PPK** button and save the `labsuser.ppk` file.
   - Typically, your browser will save it to the `Downloads` directory.
4. Make a note of the **PublicIP** address.
5. Exit the Details panel by selecting the **X**.

#### Step 2: Install PuTTY (if needed)

- Download [PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html) to SSH into the Amazon EC2 instance.
- If you do not have PuTTY installed, download it from the official site above.

#### Step 3: Configure PuTTY Session

1. Open `putty.exe`
2. Configure your session following the official AWS guide:  
    [Connect to your Linux instance using PuTTY](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/putty.html)

| Setting | Value |
|---------|-------|
| **Host Name (or IP address)** | `<PublicIP>` (from Step 1) |
| **Port** | `22` |
| **Connection type** | SSH |
| **Private key file** | `labsuser.ppk` |

3. Click **Open** to initiate the SSH session.
4. When prompted, log in as: `ec2-user`

---

###  macOS / Linux Users: Using SSH to Connect

#### Step 1: Retrieve Credentials

1. Select the **Details** drop-down menu above these instructions.
2. Select **Show**. A Credentials window will be presented.
3. Select the **Download PEM** button and save the `labsuser.pem` file.
   - Typically saved to the `Downloads` directory.
4. Make a note of the **PublicIP** address.
5. Exit the Details panel by selecting the **X**.

#### Step 2: Set File Permissions

Open a terminal and restrict permissions on your private key file:

```bash
chmod 400 ~/Downloads/labsuser.pem
```

>  **Security Note**: The private key file must have permissions of `400` (read-only for owner) or SSH will refuse to use it.

#### Step 3: Connect via SSH

```bash
ssh -i ~/Downloads/labsuser.pem ec2-user@<PublicIP>
```

Replace `<PublicIP>` with the actual public IP address noted in Step 1.

**Example:**
```bash
ssh -i ~/Downloads/labsuser.pem ec2-user@3.91.27.42
```

When prompted with the following message, type `yes` and press **Enter**:

```
The authenticity of host '3.91.27.42 (3.91.27.42)' can't be established.
ECDSA key fingerprint is SHA256:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.
Are you sure you want to continue connecting (yes/no)? yes
```

---

## Task 2: Check the Status of the `httpd` Service

Once connected to your EC2 instance, verify that the Apache HTTP server (`httpd`) is installed and running.

### Step 1: Check Service Status

```bash
sudo systemctl status httpd
```

**Expected Output (if running):**
```
● httpd.service - The Apache HTTP Server
   Loaded: loaded (/usr/lib/systemd/system/httpd.service; enabled; vendor preset: disabled)
   Active: active (running) since Mon 2024-01-15 10:30:00 UTC; 2h 15min ago
 Main PID: 1234 (httpd)
   Status: "Total requests: 0; Current requests/sec: 0; Current traffic:   0 B/sec"
    Tasks: 213
   Memory: 14.2M
   CGroup: /system.slice/httpd.service
           ├─1234 /usr/sbin/httpd -DFOREGROUND
           └─1235 /usr/sbin/httpd -DFOREGROUND
```

### Step 2: Start the Service (if not running)

If the service is **inactive** or **failed**, start it manually:

```bash
sudo systemctl start httpd
```

Enable it to start on boot:

```bash
sudo systemctl enable httpd
```

Verify it started successfully:

```bash
sudo systemctl status httpd
```

---

## Task 3: Test HTTP Connectivity

Verify that you can make an HTTP connection to the local host IP address.

### Step 1: Test Local Connection

```bash
curl http://localhost
```

**Expected Output:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Amazon Linux Test Page</title>
</head>
<body>
    <h1>It works!</h1>
</body>
</html>
```

### Step 2: Test Using Local IP Address

```bash
curl http://127.0.0.1
```

### Step 3: Test Using Instance Public IP (from within the instance)

```bash
curl http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
```

>  **Tip**: The command `curl http://169.254.169.254/latest/meta-data/public-ipv4` retrieves the instance's public IP from the EC2 instance metadata service (IMDS).

### Step 4: Verify from External Browser (Optional)

Open your local web browser and navigate to:

```
http://<PublicIP>
```

You should see the default Amazon Linux test page.

---

## Task 4: Monitor with Linux `top` Command

The `top` command provides a dynamic, real-time view of running system processes and resource usage.

### Step 1: Launch `top`

```bash
top
```

### Step 2: Understand the `top` Interface

```
top - 14:32:01 up  2:15,  1 user,  load average: 0.00, 0.01, 0.05
Tasks:  96 total,   1 running,  95 sleeping,   0 stopped,   0 zombie
%Cpu(s):  0.3 us,  0.3 sy,  0.0 ni, 99.3 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
KiB Mem :  1014752 total,   720000 free,   145000 used,   149752 buff/cache
KiB Swap:        0 total,        0 free,        0 used.   780000 avail Mem

  PID USER      PR  NI    VIRT    RES    SHR S %CPU %MEM     TIME+ COMMAND
 1234 root      20   0  215000   4500   3200 S  0.0  0.4   0:01.23 httpd
 1235 root      20   0  215000   4500   3200 S  0.0  0.4   0:00.89 httpd
 ...
```

| Field | Description |
|-------|-------------|
| `PID` | Process ID |
| `USER` | Process owner |
| `%CPU` | CPU usage percentage |
| `%MEM` | Memory usage percentage |
| `VIRT` | Virtual memory size (KB) |
| `RES` | Resident memory size (KB) |
| `COMMAND` | Command name |

### Step 3: Interactive Commands in `top`

| Key | Action |
|-----|--------|
| `q` | Quit `top` |
| `k` | Kill a process (enter PID) |
| `M` | Sort by memory usage |
| `P` | Sort by CPU usage |
| `1` | Toggle CPU core view |
| `h` | Help |

### Step 4: Monitor `httpd` Processes Specifically

Filter for `httpd` processes while in `top`:

1. Press `o` (letter o)
2. Enter filter: `COMMAND=httpd`

Or use `pgrep` from the command line:

```bash
pgrep -a httpd
```

### Step 5: Alternative Monitoring Tools

```bash
# Htop - enhanced interactive process viewer (if installed)
htop

# Free memory overview
free -h

# Disk usage
df -h

# Check httpd process count
ps aux | grep httpd | wc -l
```

---

## Task 5: Monitor with AWS CloudWatch

AWS CloudWatch provides monitoring for AWS cloud resources and applications. You can view metrics, set alarms, and analyze logs.

### Step 1: Access CloudWatch Console

1. Open the [AWS Management Console](https://console.aws.amazon.com/).
2. In the search bar, type **CloudWatch** and select it.
3. Ensure you are in the same **Region** as your EC2 instance.

### Step 2: View EC2 Metrics

1. In the CloudWatch navigation pane, select **Metrics**.
2. Select **EC2** under **AWS Namespaces**.
3. Select **Per-Instance Metrics**.

### Step 3: Key Metrics to Monitor

| Metric | Description | Typical Threshold |
|--------|-------------|-------------------|
| `CPUUtilization` | Percentage of allocated EC2 compute units | > 80% for sustained periods |
| `NetworkIn` | Bytes received on all network interfaces | Baseline varies |
| `NetworkOut` | Bytes sent out on all network interfaces | Baseline varies |
| `StatusCheckFailed` | Combined status check failure | 1 = failed |

### Step 4: Create a CloudWatch Alarm (Optional)

1. Select a metric (e.g., `CPUUtilization` for your instance).
2. Click the **Graphed metrics** tab.
3. Click the **Alarm** icon (bell symbol) next to the metric.
4. Configure the alarm:
   - **Threshold type**: Static
   - **Whenever CPUUtilization is...**: Greater than 80
   - **For**: 2 consecutive periods of 5 minutes
5. Configure **Notification**:
   - Select or create an SNS topic for email alerts.
6. Click **Create alarm**.

### Step 5: View CloudWatch Dashboard

1. Navigate to **Dashboards** in the CloudWatch console.
2. Click **Create dashboard**.
3. Name your dashboard (e.g., `EC2-Monitoring-Lab`).
4. Add widgets for:
   - Line graph: `CPUUtilization`
   - Number: `StatusCheckFailed`
   - Bar chart: `NetworkIn` / `NetworkOut`

### Step 6: Install CloudWatch Agent (Advanced)

For custom metrics (memory, disk usage), install the CloudWatch agent:

```bash
# Download CloudWatch Agent package
wget https://s3.amazonaws.com/amazoncloudwatch-agent/amazon_linux/amd64/latest/amazon-cloudwatch-agent.rpm

# Install the package
sudo rpm -U ./amazon-cloudwatch-agent.rpm

# Configure the agent
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard

# Start the agent
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -s -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json
```

---

## Troubleshooting

### Issue: `httpd` service not found

```bash
# Check if Apache is installed
which httpd

# If not installed, install it
sudo yum update -y
sudo yum install -y httpd
sudo systemctl start httpd
sudo systemctl enable httpd
```

### Issue: Cannot connect via SSH

| Symptom | Solution |
|---------|----------|
| `Permission denied (publickey)` | Verify `.pem` permissions are `400` (macOS/Linux) or correct PPK file is loaded (Windows) |
| `Connection timed out` | Check Security Group allows inbound SSH (port 22) from your IP |
| `No supported authentication methods` | Ensure you are using the correct username (`ec2-user` for Amazon Linux) |

### Issue: HTTP connection refused

```bash
# Verify httpd is listening on port 80
sudo ss -tlnp | grep :80

# Check Security Group allows inbound HTTP (port 80)
# Verify httpd is running
sudo systemctl status httpd
```

### Issue: CloudWatch metrics not visible

- Ensure the instance has the **CloudWatchFullAccess** or appropriate IAM role attached.
- Verify you are in the correct AWS Region.
- Allow a few minutes for metrics to populate after instance launch.

---

## Cleanup

>  **Important**: To avoid incurring unnecessary charges, terminate your EC2 instance after completing the lab.

### Step 1: Terminate EC2 Instance

1. Navigate to the **EC2 Dashboard**.
2. Select your instance.
3. Click **Instance state** → **Terminate instance**.
4. Confirm the termination.

### Step 2: Delete CloudWatch Alarms (Optional)

1. Navigate to **CloudWatch** → **Alarms**.
2. Select any alarms created during this lab.
3. Click **Delete**.

### Step 3: Delete CloudWatch Dashboard (Optional)

1. Navigate to **CloudWatch** → **Dashboards**.
2. Select your dashboard.
3. Click **Delete**.

---

##  Additional Resources

- [Amazon EC2 User Guide - Connect to your instance](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)
- [Amazon CloudWatch Documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/)
- [Apache HTTP Server Documentation](https://httpd.apache.org/docs/)
- [Linux `top` Command Manual](https://man7.org/linux/man-pages/man1/top.1.html)

---

##  Lab Completion Checklist

- [ ] Connected to EC2 instance via SSH
- [ ] Verified `httpd` service is running
- [ ] Successfully made HTTP connection to localhost
- [ ] Monitored processes using `top` command
- [ ] Viewed EC2 metrics in AWS CloudWatch
- [ ] (Optional) Created CloudWatch alarm
- [ ] Terminated EC2 instance to clean up resources

---

*Lab version: 1.0*  
*Last updated: 2026-05-25*
