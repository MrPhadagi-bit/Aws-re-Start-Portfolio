# Internet Protocol Troubleshooting Commands

## Lab Overview

This lab provides hands-on practice with essential network troubleshooting commands mapped to the OSI model layers. You will learn to diagnose connectivity issues using `ping`, `traceroute`, `netstat`, `telnet`, and `curl` in real-world AWS customer scenarios.

---

## Objectives

After completing this lab, you should be able to:

- Practice troubleshooting commands
- Identify how you can use these commands in customer scenarios
- Map troubleshooting commands to their corresponding OSI model layers
- Diagnose Layer 3, Layer 4, and Layer 7 network issues

---

## Duration

This lab requires approximately **30 minutes** to complete.

---

## Prerequisites

- An AWS account with access to EC2
- Basic familiarity with Linux terminal commands
- SSH client installed (PuTTY for Windows, OpenSSH for macOS/Linux)

---

## Task 1: Use SSH to Connect to an Amazon Linux EC2 Instance

In this task, you will connect to an Amazon Linux EC2 instance. You will use an SSH utility to perform all subsequent operations. The following instructions vary slightly depending on whether you are using Windows or macOS/Linux.

### Windows Users: Using SSH to Connect

> These instructions are specifically for Windows users. If you are using macOS or Linux, skip to the [macOS/Linux section](#macoslinux-users-using-ssh-to-connect).

1. Select the **Details** drop-down menu above these instructions, and then select **Show**. A Credentials window will be presented.

2. Select the **Download PPK** button and save the `labsuser.ppk` file. Typically your browser will save it to the Downloads directory.

3. Make a note of the **PublicIP** address.

4. Exit the Details panel by selecting the **X**.

5. Download **PuTTY** to SSH into the Amazon EC2 instance. If you do not have PuTTY installed on your computer, [download it here](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html).

6. Open `putty.exe`

7. Configure your PuTTY session by following the directions in the [AWS documentation: Connect to your Linux instance using PuTTY](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/putty.html).

8. Once connected, proceed to [Task 2](#task-2-practice-troubleshooting-commands).

### macOS/Linux Users: Using SSH to Connect

> These instructions are specifically for macOS and Linux users.

1. Select the **Details** drop-down menu above these instructions, and then select **Show**. A Credentials window will be presented.

2. Select the **Download PEM** button and save the `labsuser.pem` file.

3. Make a note of the **PublicIP** address.

4. Exit the Details panel by selecting the **X**.

5. Open a terminal and navigate to the directory where you saved the `.pem` file:

   ```bash
   cd ~/Downloads
   ```

6. Set the correct permissions on the private key file:

   ```bash
   chmod 400 labsuser.pem
   ```

7. Connect to the EC2 instance using SSH:

   ```bash
   ssh -i labsuser.pem ec2-user@<PublicIP>
   ```

   Replace `<PublicIP>` with the Public IP address you noted earlier.

8. When prompted, type `yes` to confirm the host's authenticity.

9. Once connected, proceed to [Task 2](#task-2-practice-troubleshooting-commands).

---

## Task 2: Practice Troubleshooting Commands

### Understanding the OSI Model and Troubleshooting Commands

Some layers of the OSI (Open Systems Interconnection) model have specific commands related to them that help with troubleshooting. The following diagram illustrates how troubleshooting commands align with the OSI model layers:

```
┌─────────────────────────────────────────────────────────────┐
│  OSI Layer 7 (Application)  │  curl                         │
├─────────────────────────────────────────────────────────────┤
│  OSI Layer 6 (Presentation) │  (Encryption/Encoding)        │
├─────────────────────────────────────────────────────────────┤
│  OSI Layer 5 (Session)      │  (Session Management)         │
├─────────────────────────────────────────────────────────────┤
│  OSI Layer 4 (Transport)    │  netstat, telnet              │
├─────────────────────────────────────────────────────────────┤
│  OSI Layer 3 (Network)      │  ping, traceroute             │
├─────────────────────────────────────────────────────────────┤
│  OSI Layer 2 (Data Link)    │  (MAC Addressing)             │
├─────────────────────────────────────────────────────────────┤
│  OSI Layer 1 (Physical)     │  (Cables, Signals)              │
└─────────────────────────────────────────────────────────────┘
```

---

### Layer 3 (Network): The `ping` and `traceroute` Commands

#### `ping` Command

**Customer Scenario:** The customer has launched an EC2 instance. To test connectivity to and from it, you can run the `ping` command. This command tests connectivity and ensures that ICMP requests are allowed at the security level (security groups and network ACLs).

**Command:**

```bash
ping 8.8.8.8 -c 5
```

**Explanation:**
- `ping`: The command used to test IP connectivity
- `8.8.8.8`: The target IP address (Google's public DNS server)
- `-c 5`: Option where `-c` stands for **count**, and `5` specifies the number of echo requests to send

**Expected Output:**

```
PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.
64 bytes from 8.8.8.8: icmp_seq=1 ttl=117 time=15.2 ms
64 bytes from 8.8.8.8: icmp_seq=2 ttl=117 time=14.8 ms
64 bytes from 8.8.8.8: icmp_seq=3 ttl=117 time=15.1 ms
64 bytes from 8.8.8.8: icmp_seq=4 ttl=117 time=14.9 ms
64 bytes from 8.8.8.8: icmp_seq=5 ttl=117 time=15.0 ms

--- 8.8.8.8 ping statistics ---
5 packets transmitted, 5 received, 0% packet loss, time 4005ms
rtt min/avg/max/mdev = 14.8/15.0/15.2/0.14 ms
```

**Key Use Cases:**
- Test basic IP connectivity to a server or resource
- Verify reachability to a specific target
- Troubleshoot connectivity issues
- Bring up a network interface by generating continuous traffic (continuous ping)
- Verify that security groups and NACLs allow ICMP traffic

> **Note:** If `ping` fails with "Request timed out," check security group rules to ensure ICMP (Type 0, Code 0) is allowed inbound.

---

#### `traceroute` Command

**Customer Scenario:** The customer is experiencing latency issues. Their connection is slow, and they are having packet loss. They aren't sure if the issue is related to AWS or their internet service provider (ISP). To investigate, you run `traceroute` from their AWS resource to the target server.

- If loss happens **toward the server**, the issue is most likely the **ISP**.
- If loss is **toward AWS**, investigate other factors limiting networking connectivity.

**Command:**

```bash
traceroute 8.8.8.8
```

**Explanation:**
- `traceroute`: Displays the route and latency of packets to a destination
- `8.8.8.8`: The target IP address

**Expected Output:**

```
traceroute to 8.8.8.8 (8.8.8.8), 30 hops max, 60 byte packets
 1  ip-172-31-16-1.us-east-2.compute.internal (172.31.16.1)  0.5 ms  0.4 ms  0.4 ms
 2  216.182.224.78 (216.182.224.78)  1.2 ms  1.1 ms  1.1 ms
 3  100.66.12.146 (100.66.12.146)  1.5 ms  1.4 ms  1.4 ms
 ...
 8  dns.google (8.8.8.8)  15.2 ms  15.1 ms  15.0 ms
```

**Interpreting Results:**

| Symbol | Meaning |
|--------|---------|
| `***` | Failed hop (timeout — no response from that router) |
| `ms` | Milliseconds — round-trip time for that hop |
| Packet loss % | Indicates congestion or filtering at that hop |

**Key Use Cases:**
- Identify where packet loss or latency begins
- Determine if an issue is with the local network, ISP, or destination server
- Pinpoint routing issues across multiple hops
- Diagnose asymmetric routing problems

> **Tip:** Three asterisks (`***`) indicate a failed hop. Check the hostnames and IP addresses on either side of the failed jump to isolate the problem.

---

### Layer 4 (Transport): The `netstat` and `telnet` Commands

#### `netstat` Command

**Customer Scenario:** Your company is running a routine security scan and found that one of the ports on a certain subnet is compromised. To confirm, you run `netstat` on a local host on that subnet to verify if the port is listening when it shouldn't be.

**Common Commands:**

```bash
# Confirm established connections
netstat -tp

# Output listening services
netstat -tlp

# Output listening services without resolving port numbers to service names
netstat -ntlp
```

**Option Breakdown:**

| Option | Description |
|--------|-------------|
| `-t` | Show TCP connections |
| `-u` | Show UDP connections |
| `-p` | Show the process using the socket |
| `-l` | Show only listening sockets |
| `-n` | Show numeric addresses and port numbers (don't resolve names) |

**Expected Output (`netstat -tp`):**

```
Active Internet connections (w/o servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 ip-172-31-16-10:ssh     203.0.113.45:54321      ESTABLISHED 1234/sshd: ec2-user
tcp        0      0 ip-172-31-16-10:https   198.51.100.22:45678     ESTABLISHED 5678/httpd
```

**Key Use Cases:**
- View current established TCP connections
- Identify which ports are listening on the host
- Determine which processes are using specific ports
- Troubleshoot port conflicts
- Verify that expected services are running and accessible

> **Best Practice:** Start troubleshooting from the host machine and work outward. `netstat` provides a snapshot of Layer 4 connectivity, saving time when narrowing down large networking issues.

---

#### `telnet` Command

**Customer Scenario:** The customer has a secure web server with custom security group rules and network ACL rules configured. However, they are concerned that port 80 is open even though their security settings indicate that their security group is blocking this port. You can run `telnet` to ensure that the connection is refused.

**Prerequisite — Install telnet:**

```bash
sudo yum install telnet -y
```

**Command:**

```bash
telnet www.google.com 80
```

**Explanation:**
- `telnet`: Tests TCP connectivity to a specific port
- `www.google.com`: The target host
- `80`: The port number to connect to

**Expected Output (Successful Connection):**

```
Trying 142.250.80.100...
Connected to www.google.com.
Escape character is '^]'.
```

**Interpreting Connection Results:**

| Result | Likely Cause |
|--------|--------------|
| `Connected to...` | Nothing is blocking the connection |
| `Connection refused` | Firewall or security group is blocking the port |
| `Connection timed out` | No network route or connectivity to the target |

**Key Use Cases:**
- Verify if a specific TCP port is open and reachable
- Test security group and NACL rule effectiveness
- Confirm that a service is listening on a specific port
- Troubleshoot firewall and connectivity issues at the transport layer

> **Note:** `telnet` is useful at both Layer 4 (transport) and Layer 7 (application). For HTTP (port 80), you can manually send HTTP requests after connecting.

---

### Layer 7 (Application): The `curl` Command

**Customer Scenario:** The customer has an Apache server running, and they want to test if they are getting a successful request (`200 OK`), which indicates that their website is running successfully. You run a `curl` request to verify the server's response.

**Command:**

```bash
curl -vLo /dev/null https://aws.com
```

**Option Breakdown:**

| Option | Description |
|--------|-------------|
| `-I` | Provides header information only; uses HEAD request method |
| `-i` | Includes headers in the output; uses GET request method |
| `-k` | Ignores SSL certificate errors (insecure mode) |
| `-v` | Verbose mode — shows detailed connection and request information |
| `-o /dev/null` | Sends the response body to `/dev/null` (discards HTML/CSS output) |
| `-L` | Follows redirects automatically |

**Expected Output:**

```
*   Trying 99.86.38.17:443...
* Connected to aws.com (99.86.38.17) port 443 (#0)
* ALPN, offering h2
* TLS 1.2 connection using TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
* Server certificate: aws.com
> GET / HTTP/2
> Host: aws.com
> User-Agent: curl/7.88.1
>
< HTTP/2 200
< content-type: text/html;charset=UTF-8
< date: Mon, 01 Jan 2024 00:00:00 GMT
<
{ [0 bytes data]
* Connection #0 to host aws.com left intact
```

**Key Use Cases:**
- Test HTTP/HTTPS connectivity and response codes
- Verify web server functionality (e.g., Apache, Nginx)
- Check SSL/TLS certificate validity
- Inspect HTTP headers and response details
- Transfer data between client and server using various protocols

> **HTTP Status Codes to Know:**
> - `200 OK` — Request succeeded
> - `301/302` — Redirects
> - `403 Forbidden` — Access denied
> - `404 Not Found` — Resource not found
> - `500 Internal Server Error` — Server-side error

---

## Command Reference Summary

| OSI Layer | Command | Primary Use |
|-----------|---------|-------------|
| **Layer 3 (Network)** | `ping` | Test IP connectivity and reachability |
| **Layer 3 (Network)** | `traceroute` | Trace packet path and identify latency/packet loss |
| **Layer 4 (Transport)** | `netstat` | View active connections and listening ports |
| **Layer 4 (Transport)** | `telnet` | Test TCP port connectivity |
| **Layer 7 (Application)** | `curl` | Test HTTP/HTTPS requests and application responses |

---

## Troubleshooting Decision Tree

```
Start Troubleshooting
        │
        ▼
┌─────────────────┐
│ Can you reach   │──No──▶ Check security groups, NACLs, routing tables
│ the IP address? │        Run: ping <target>
│                 │
└────────┬────────┘
         │ Yes
         ▼
┌─────────────────┐
│ Where is the    │──ISP──▶ Contact ISP or check local network
│ latency/packet  │
│ loss occurring? │──AWS──▶ Investigate AWS networking components
│                 │        Run: traceroute <target>
└────────┬────────┘
         │ No issues
         ▼
┌─────────────────┐
│ Is the port     │──No──▶ Check security groups, NACLs, local firewall
│ listening?      │        Run: netstat -tlp
│                 │        Run: telnet <target> <port>
└────────┬────────┘
         │ Yes
         ▼
┌─────────────────┐
│ Is the app      │──No──▶ Check web server logs, application config
│ responding      │        Run: curl -v <url>
│ correctly?      │
└────────┬────────┘
         │ Yes
         ▼
    Issue Resolved!
```

---

## Lab Complete

You have successfully completed the Internet Protocol Troubleshooting Commands lab. You should now be able to:

- Use `ping` and `traceroute` to diagnose Layer 3 network connectivity issues
- Use `netstat` and `telnet` to troubleshoot Layer 4 transport layer problems
- Use `curl` to verify Layer 7 application layer functionality
- Apply these commands in real-world AWS customer scenarios

---

## Additional Resources

- [AWS Documentation: Connect to Your Linux Instance](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)
- [AWS Documentation: Troubleshoot Instance Connection Issues](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/TroubleshootingInstancesConnecting.html)
- [Linux man pages](https://man7.org/linux/man-pages/)
- [OSI Model Explained](https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/)

---

*Lab version: 1.0 | Last updated: June 2026*
