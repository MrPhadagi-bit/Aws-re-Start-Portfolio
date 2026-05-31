#  Static Website Hosting on AWS S3 Guide

> A complete, step-by-step guide for hosting static websites on Amazon S3 using only the **AWS Management Console** (web interface). No command line required.
> 
---

##  Overview

This guide walks you through hosting a **static website** on **Amazon S3** using exclusively the **AWS Management Console** — AWS's web-based graphical interface. Perfect for beginners, visual learners, or anyone who prefers point-and-click configuration over command-line tools.

### What You'll Build

| Component | AWS Service | Purpose |
|-----------|-------------|---------|
|  **Storage** | Amazon S3 | Hosts HTML, CSS, JS, images |
|  **CDN** | CloudFront | Global edge caching + HTTPS |
|  **DNS** | Route 53 | Custom domain routing |
|  **SSL/TLS** | AWS Certificate Manager | Free HTTPS certificates |

---

##  Architecture

```
┌─────────────────┐
│   User Browser  │
│                 │
│  Types:         │
│  your-domain.com│
└────────┬────────┘
         │
         ▼ HTTPS
┌─────────────────┐     ┌─────────────────┐
│   Route 53      │────▶│   CloudFront    │
│   (DNS Console) │     │   (CDN Console) │
│                 │     │                 │
│  A Record ──────┼────▶│  HTTPS Terminate│
│  Alias Target   │     │  Edge Cache     │
└─────────────────┘     └────────┬────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │   Amazon S3     │
                        │   (S3 Console)  │
                        │                 │
                        │  Static Website │
                        │  Hosting: ON    │
                        │  Bucket Policy  │
                        │  Public Access  │
                        └─────────────────┘
```

---

##  Prerequisites

Before starting, ensure you have:

### Required Accounts & Access

| Requirement | How to Get It |
|-------------|---------------|
| **AWS Account** | [Sign up at aws.amazon.com](https://aws.amazon.com/free/) — Free Tier eligible for 12 months |
| **Console Access** | Sign in at [console.aws.amazon.com](https://console.aws.amazon.com/) with your email and password |
| **IAM Permissions** | Your account needs permission to create S3 buckets, CloudFront distributions, Route 53 records, and ACM certificates. If you're the root account owner, you have all permissions. |

### What You'll Need Ready

- [ ] Your **website files** (HTML, CSS, JS, images) in a folder on your computer
- [ ] A **domain name** (e.g., `your-domain.com`) — optional for basic setup, required for custom domain
- [ ] Approximately **30 minutes** for full setup

### Browser Recommendations

- **Chrome** or **Firefox** (latest version)
- Enable pop-ups for AWS console domains
- Screen resolution of at least 1280×800 for best experience

---

##  Step 1: Sign In to AWS Management Console

### 1.1 Navigate to the Console

1. Open your web browser
2. Go to: **https://console.aws.amazon.com/**
3. Click **Sign In** (top right)

### 1.2 Enter Your Credentials

| Field | What to Enter |
|-------|---------------|
| **Account ID / Email** | Your AWS account email address |
| **IAM User Name** | (If using IAM user) Your username |
| **Password** | Your account password |

### 1.3 Access the AWS Console Home

After signing in, you'll see the **AWS Console Home** dashboard:

```
┌─────────────────────────────────────────────────────────────┐
│  AWS Console Home                                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   S3        │  │ CloudFront  │  │  Route 53   │         │
│  │  [Icon]     │  │   [Icon]    │  │   [Icon]    │         │
│  │             │  │             │  │             │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
│  Recently visited: S3, CloudFront, Route 53                   │
│                                                             │
│  Search services: [________________________]               │
└─────────────────────────────────────────────────────────────┘
```

> **Tip:** Use the **Search bar** at the top to quickly find any AWS service. Type "S3" and press Enter.

---

##  Step 2: Create Your S3 Bucket

### 2.1 Open the S3 Console

1. In the AWS Console, click the **Services** menu (top left, hamburger icon ☰)
2. Under **Storage**, click **S3**
   - Or type "S3" in the search bar and press Enter

You'll arrive at the **S3 Console** showing your existing buckets (if any).

### 2.2 Click "Create Bucket"

1. Click the orange **Create bucket** button (top right)

### 2.3 Configure General Settings

In the **Create bucket** wizard, fill in the following:

#### Section: General configuration

| Setting | Value | Example |
|---------|-------|---------|
| **AWS Region** | Choose closest to your audience | `Africa (Cape Town) af-south-1` |
| **Bucket name** | Globally unique name (lowercase, no spaces) | `your-domain-com-static-website` |

>  **Important:** Bucket names must be **globally unique** across all AWS accounts worldwide. If `your-domain-com-static-website` is taken, try `your-domain-com-static-site-2024` or add your initials.

#### Section: Object Ownership

| Setting | Recommended Value | Why |
|---------|-------------------|-----|
| **ACLs enabled** |  **Enable** | Required for public read access |

#### Section: Block Public Access settings for this bucket

| Setting | Value | Why |
|---------|-------|-----|
| **Block all public access** | ☐ **Uncheck** | Static websites must be publicly readable |
| Acknowledge warning |  **Check the box** | Confirms you understand the risk |

>  **Security Note:** Only uncheck this for the specific bucket hosting your public website. Keep other buckets private.

#### Section: Bucket Versioning

| Setting | Recommended Value | Why |
|---------|-------------------|-----|
| **Bucket Versioning** | **Enable** | Protects against accidental file overwrites |

#### Section: Tags (Optional)

| Tag Key | Tag Value |
|---------|-----------|
| `Project` | `StaticWebsite` |
| `Environment` | `Production` |
| `Owner` | `YourName` |

### 2.4 Create the Bucket

1. Scroll down and review your settings
2. Click **Create bucket** (bottom of page)
3. You'll see a green success message: **"Successfully created bucket"**

### 2.5 Verify Bucket Creation

Your new bucket appears in the S3 bucket list:

```
┌─────────────────────────────────────────────────────────────┐
│  Buckets                                                    │
│                                                             │
│  Name                              │ Region       │ Created │
│  ──────────────────────────────────┼──────────────┼─────────│
│  your-domain-com-static-website    │ af-south-1   │ Just now│
│                                                             │
│  [Click bucket name to open]                                │
└─────────────────────────────────────────────────────────────┘
```

---

##  Step 3: Configure Bucket for Static Website Hosting

### 3.1 Open Your Bucket

1. Click on your bucket name (`your-domain-com-static-website`) in the list
2. You're now inside the bucket view

### 3.2 Navigate to Properties Tab

1. Click the **Properties** tab (next to Objects, Permissions, Metrics)
2. Scroll down to the **Static website hosting** section

### 3.3 Enable Static Website Hosting

| Action | Setting |
|--------|---------|
| Click | **Edit** (right side of Static website hosting) |
| Select | **Enable** |

#### Configure Index Document

| Field | Value | Description |
|-------|-------|-------------|
| **Index document** | `index.html` | The default page served when visitors access your site |

#### Configure Error Document (Optional but Recommended)

| Field | Value | Description |
|-------|-------|-------------|
| **Error document** | `error.html` | Page shown when a file is not found (404) |

### 3.4 Save Changes

1. Click **Save changes** (bottom of section)
2. You'll see a green confirmation banner

### 3.5 Note Your Website Endpoint

After saving, the **Static website hosting** section now shows:

```
Static website hosting
─────────────────────────────────────────
Bucket website endpoint:
http://your-domain-com-static-website.s3-website-af-south-1.amazonaws.com
─────────────────────────────────────────
```

>  **Copy this URL** — you'll test it later. Note it uses **HTTP**, not HTTPS yet.

---

##  Step 4: Upload Your Website Files

### 4.1 Go to the Objects Tab

1. Click the **Objects** tab (top of bucket view)
2. You'll see: **"This bucket is empty"**

### 4.2 Upload Files

#### Option A: Drag and Drop (Fastest)

1. Open your computer's file explorer
2. Select your website files/folder
3. **Drag and drop** them into the S3 console browser window
4. A upload dialog appears

#### Option B: Upload Button

1. Click the **Upload** button (top right)
2. Click **Add files** or **Add folder**
3. Select your website files from your computer
4. Click **Open**

### 4.3 Configure Upload Settings

In the upload dialog, review these settings:

| Setting | Recommended Value | Why |
|---------|-------------------|-----|
| **Storage class** | **Standard** | For frequently accessed website files |
| **Server-side encryption** | **Enable** → **Amazon S3 key (SSE-S3)** | Encrypts files at rest |
| **Permissions** | Leave default | We'll set bucket-level permissions next |

### 4.4 Complete Upload

1. Click **Upload** (bottom right)
2. Wait for the green **"Upload succeeded"** message
3. Click **Close**

### 4.5 Verify Uploaded Files

Your **Objects** tab now shows:

```
┌─────────────────────────────────────────────────────────────┐
│  Objects                                                    │
│                                                             │
│  Name              │ Type      │ Size    │ Last modified   │
│  ──────────────────┼───────────┼─────────┼─────────────────│
│  index.html        │ text/html │ 2.4 KB  │ Just now        │
│  css/              │ Folder    │ -       │ Just now        │
│  ├── styles.css    │ text/css  │ 1.8 KB  │ Just now        │
│  js/               │ Folder    │ -       │ Just now        │
│  ├── app.js        │ text/js   │ 3.2 KB  │ Just now        │
│  images/           │ Folder    │ -       │ Just now        │
│  ├── logo.png      │ image/png │ 45 KB   │ Just now        │
│  error.html        │ text/html │ 1.1 KB  │ Just now        │
└─────────────────────────────────────────────────────────────┘
```

> **Tip:** Click on any file to view its details, preview images, or download it.

---

##  Step 5: Set Bucket Permissions (Public Access)

### 5.1 Navigate to Permissions Tab

1. Click the **Permissions** tab (top of bucket view)

### 5.2 Configure Bucket Policy

#### 5.2.1 Scroll to "Bucket policy" Section

1. Find the **Bucket policy** section
2. Click **Edit**

#### 5.2.2 Enter Bucket Policy

Copy and paste this policy into the **Policy** text box:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::your-domain-com-static-website/*"
        }
    ]
}
```

>  **Replace `your-domain-com-static-website`** with your actual bucket name in the `Resource` line.

#### 5.2.3 Save Policy

1. Click **Save changes**
2. If you see a warning about public access, confirm it's intentional

### 5.3 Verify Access Block Settings

#### 5.3.1 Scroll to "Block public access (bucket settings)"

Ensure these are **unchecked** (disabled):

| Setting | Status |
|---------|--------|
| Block all public access | ☐ **Unchecked** |
| Block public access to buckets and objects granted through new access control lists (ACLs) | ☐ **Unchecked** |
| Block public access to buckets and objects granted through any access control lists (ACLs) | ☐ **Unchecked** |
| Block public access to buckets and objects granted through new public bucket or access point policies | ☐ **Unchecked** |
| Block public and cross-account access to buckets and objects through any public bucket or access point policies | ☐ **Unchecked** |

If any are checked, click **Edit** and uncheck them, then save.

---

##  Step 6: Test Your Website

### 6.1 Copy the Website Endpoint

1. Go back to the **Properties** tab
2. Scroll to **Static website hosting**
3. Copy the **Bucket website endpoint** URL:
   ```
   http://your-domain-com-static-website.s3-website-af-south-1.amazonaws.com
   ```

### 6.2 Test in Browser

1. Open a new browser tab
2. Paste the URL and press Enter
3. Your website should load! 🎉

### 6.3 What You Should See

```
 Your index.html page loads correctly
 CSS styles are applied (colors, fonts, layout)
 JavaScript functions work (buttons, forms)
 Images display properly
 Clicking a non-existent page shows your error.html (if configured)
```

### 6.4 Common Issues at This Stage

| Problem | Cause | Fix via Console |
|---------|-------|-----------------|
| **403 Forbidden** | Bucket policy missing | Go to Permissions → Bucket policy → Add public read policy |
| **404 Not Found** | Wrong index document name | Go to Properties → Static website hosting → Check index document spelling |
| **Page loads but no CSS/JS** | Wrong file paths | Check file names in S3 match your HTML references (case-sensitive!) |
| **Images broken** | Wrong image path or missing file | Verify images uploaded to S3 and paths in HTML are correct |

---

##  Step 7: Set Up CloudFront CDN (HTTPS + Custom Domain)

CloudFront makes your website faster and adds HTTPS. We'll configure it entirely through the console.

### 7.1 Navigate to CloudFront Console

1. Click **Services** ☰ (top left)
2. Under **Networking & Content Delivery**, click **CloudFront**
   - Or search "CloudFront" in the search bar

### 7.2 Create Distribution

1. Click **Create distribution** (orange button, top right)

### 7.3 Configure Origin Settings

#### Origin Domain

| Field | Value | How to Fill |
|-------|-------|-------------|
| **Origin domain** | Your S3 website endpoint | Click in the field, select your bucket from the dropdown, **BUT** — see note below |

>  **CRITICAL:** The dropdown shows the **S3 REST API endpoint** (e.g., `your-domain-com-static-website.s3.af-south-1.amazonaws.com`). You must change this to the **S3 website endpoint**:
>
> **Correct format:** `your-domain-com-static-website.s3-website-af-south-1.amazonaws.com`
>
> **How to fix:** After selecting from dropdown, **manually edit** the field to replace `.s3.` with `.s3-website-` and remove the region dot before `amazonaws`.

#### Origin Name

| Field | Value |
|-------|-------|
| **Origin name** | `S3-website-your-domain` (auto-filled, can edit) |

#### Protocol

| Field | Value | Why |
|-------|-------|-----|
| **Origin protocol policy** | **HTTP only** | S3 website endpoints don't support HTTPS |

### 7.4 Configure Default Cache Behavior

| Setting | Recommended Value | Why |
|---------|-------------------|-----|
| **Viewer protocol policy** | **Redirect HTTP to HTTPS** | Forces secure connections |
| **Allowed HTTP methods** | **GET, HEAD, OPTIONS** | Standard for static sites |
| **Cache key and origin requests** | **Cache policy and origin request policy (recommended)** | Better performance |
| **Cache policy** | **Managed-CachingOptimized** | AWS-optimized for static content |

### 7.5 Configure Settings

| Setting | Value | Why |
|---------|-------|-----|
| **Price class** | **Use all edge locations (best performance)** | Or choose cheaper option for regional sites |
| **Alternate domain name (CNAME)** | `your-domain.com` | Your custom domain (optional at this stage) |
| **Custom SSL certificate** | Leave default for now | We'll configure in Step 9 |
| **Default root object** | `index.html` | Serves index.html for root requests |
| **Standard logging** | **Off** (enable later if needed) | Saves costs |

### 7.6 Create Distribution

1. Scroll to bottom
2. Click **Create distribution**
3. You'll see: **"Distribution is being created"** — this takes 5-10 minutes

### 7.7 Note Your CloudFront Domain

After creation, your distribution appears in the list:

```
┌─────────────────────────────────────────────────────────────┐
│  CloudFront Distributions                                   │
│                                                             │
│  ID           │ Domain name                    │ Status     │
│  ─────────────┼────────────────────────────────┼────────────│
│  EDFDVBD6...  │ d1234abcd5678.cloudfront.net   │ Deployed   │
│                                                             │
│  [Click ID to view details]                                 │
└─────────────────────────────────────────────────────────────┘
```

>  **Copy the Domain name** (e.g., `d1234abcd5678.cloudfront.net`) — you'll need it for Route 53.

### 7.8 Test CloudFront URL

1. Wait for **Status** to change from **"In Progress"** to **"Deployed"** (refresh the page)
2. Open a new tab
3. Go to: `https://d1234abcd5678.cloudfront.net`
4. Your website loads with HTTPS! 

---

##  Step 8: Configure Route 53 Custom Domain

> **Prerequisite:** You must own a domain name and have it registered (can be with Route 53 or another registrar like GoDaddy, Namecheap, etc.)

### 8.1 Navigate to Route 53 Console

1. Click **Services** ☰
2. Under **Networking & Content Delivery**, click **Route 53**

### 8.2 Create Hosted Zone (If New Domain)

If your domain is registered with Route 53, a hosted zone may already exist. If not:

1. In the left sidebar, click **Hosted zones**
2. Click **Create hosted zone**
3. **Domain name:** `your-domain.com`
4. **Type:** Public hosted zone
5. Click **Create hosted zone**

### 8.3 Create A Record (Alias)

1. Click on your domain name in the hosted zone list
2. Click **Create record**

#### Record Configuration

| Field | Value | Notes |
|-------|-------|-------|
| **Record name** | Leave blank (or `www` for subdomain) | Blank = root domain |
| **Record type** | **A** — Routes traffic to an IPv4 address and some AWS resources | |
| **Alias** |  **Turn on** | Required for CloudFront |
| **Route traffic to** | **Alias to CloudFront distribution** | From dropdown |
| **Choose distribution** | Select your distribution | Should match the domain you entered in CloudFront |
| **Routing policy** | **Simple routing** | Standard for single endpoint |
| **Evaluate target health** | **No** | CloudFront handles health checks |

### 8.4 Create Record

1. Click **Create records**
2. The record appears in your hosted zone list

### 8.5 If Using External Domain Registrar

If you bought your domain from GoDaddy, Namecheap, etc.:

1. Log in to your registrar's control panel
2. Find **DNS Management** or **Nameservers**
3. Create a **CNAME record**:
   - **Name:** `www` (or `@` for root, if supported)
   - **Value:** `d1234abcd5678.cloudfront.net`
   - **TTL:** 3600 (1 hour)
4. For root domain (`your-domain.com` without `www`), some registrars support **ALIAS** or **ANAME** records. If not, use Route 53 as your DNS provider by updating nameservers.

---

##  Step 9: Enable HTTPS with AWS Certificate Manager

### 9.1 Navigate to ACM Console

1. Click **Services** ☰
2. Under **Security, Identity, & Compliance**, click **Certificate Manager**
   - Or search "Certificate Manager"

>  **Important:** For CloudFront, certificates **must** be requested in the **US East (N. Virginia)** region (`us-east-1`). Make sure the console region selector (top right) shows **N. Virginia**.

### 9.2 Request Certificate

1. Click **Request** (orange button)
2. Select **Request a public certificate**
3. Click **Next**

### 9.3 Add Domain Names

| Field | Value |
|-------|-------|
| **Fully qualified domain name** | `your-domain.com` |
| Click **Add another name to this certificate** | |
| **Fully qualified domain name** | `www.your-domain.com` (optional, for www redirect) |

### 9.4 Select Validation Method

| Option | Selection | Why |
|--------|-----------|-----|
| **Validation method** | **DNS validation — recommended** | Automatic if using Route 53 |

### 9.5 Request Certificate

1. Click **Request**
2. Certificate appears in list with **Status: Pending validation**

### 9.6 Validate Certificate (DNS Method)

#### If Using Route 53 (Automatic)

1. Click on the **Certificate ID** to open details
2. In the **Domains** section, click **Create records in Route 53**
3. ACM automatically adds the validation CNAME record
4. Wait 5-30 minutes for validation
5. Status changes to **Issued** 

#### If Using External DNS (Manual)

1. Click on the **Certificate ID**
2. In **Domains**, copy the **CNAME name** and **CNAME value**
3. Go to your DNS provider
4. Add a **CNAME record**:
   - **Name:** `_abc123def456.your-domain.com` (the CNAME name)
   - **Value:** `_xyz789uvw012.acm-validations.aws` (the CNAME value)
5. Return to ACM and click **Refresh** status

### 9.7 Attach Certificate to CloudFront

1. Go back to **CloudFront Console**
2. Click your **Distribution ID**
3. Click **Edit** (top right of the General tab)
4. Scroll to **Settings**

#### Update SSL Certificate

| Field | Value |
|-------|-------|
| **Custom SSL certificate** |  **Change to** → Select your certificate from dropdown |
| **Security policy** | **TLSv1.2_2021** (recommended) |

5. Click **Save changes**
6. Distribution status changes to **"In Progress"** — wait 5-10 minutes

### 9.8 Test HTTPS Custom Domain

1. Open browser tab
2. Go to: `https://your-domain.com`
3. You should see:
   -  **Lock icon** in address bar (secure connection)
   - Your website content
   - No certificate warnings

---

##  Security Best Practices (Console Configuration)

### Enable Default Encryption on S3 Bucket

1. Go to **S3 Console** → Your bucket → **Properties** tab
2. Scroll to **Default encryption**
3. Click **Edit**
4. Select **Server-side encryption with Amazon S3 managed keys (SSE-S3)**
5. Click **Save changes**

### Enable S3 Block Public Access at Account Level (For Other Buckets)

1. Go to **S3 Console** → left sidebar → **Block Public Access settings for this account**
2. Ensure **Block all public access** is **ON** at account level
3. Your website bucket is the only exception (configured at bucket level)

### Enable CloudFront Access Logging

1. Go to **CloudFront Console** → Your distribution → **Edit**
2. Scroll to **Standard logging**
3. Select **On**
4. Choose an S3 bucket for logs (or create one)
5. Click **Save changes**

### Enable Origin Access Control (OAC) — Advanced

Instead of making your S3 bucket public, use OAC so only CloudFront can access it:

1. **CloudFront Console** → Your distribution → **Origins** tab
2. Select your origin → **Edit**
3. **Origin access** → Select **Origin access control settings (recommended)**
4. Click **Create control setting**:
   - **Signing behavior:** Sign requests (recommended)
   - **Origin type:** S3
5. Save and copy the **Bucket policy** provided
6. Go to **S3 Console** → Your bucket → **Permissions** → **Bucket policy**
7. Paste the policy (replaces the public access policy)
8. Save

---

##  Monitoring via Console

### S3 Metrics

1. Go to **S3 Console** → Your bucket → **Metrics** tab
2. View:
   - **Storage metrics** — Total size, object count
   - **Request metrics** — GET, PUT, DELETE counts
   - **Data transfer** — Bytes downloaded

### CloudFront Metrics

1. Go to **CloudFront Console** → Your distribution → **Monitoring** tab
2. View:
   - **Total requests** — Hits and misses
   - **Cache hit rate** — Percentage served from edge (higher = better)
   - **Error rate** — 4xx and 5xx errors
   - **Data transfer** — GB transferred

### CloudWatch Dashboard

1. Go to **CloudWatch Console** (search in services)
2. Click **Dashboards** → **Create dashboard**
3. Add widgets for S3 and CloudFront metrics
4. Name it "Static Website Monitoring"

---

##  Cost Management

### View Costs in Billing Console

1. Go to **Billing Console** (search "Billing" in services)
2. Click **Bills** in left sidebar
3. View charges by service:
   - **S3** — Storage + requests + data transfer
   - **CloudFront** — Data transfer + requests
   - **Route 53** — Hosted zone + queries
   - **ACM** — **Free** for public certificates

### Set Up Billing Alerts

1. Go to **Billing Console** → **Budgets**
2. Click **Create budget**
3. Select **Cost budget**
4. Set **Budget amount** (e.g., $20/month)
5. Add **Alert threshold** at 80% ($16)
6. Enter your email for notifications
7. Click **Create budget**

### Cost Optimization Tips

| Action | Where in Console | Savings |
|--------|------------------|---------|
| Use S3 Intelligent-Tiering | S3 → Bucket → Properties → Default storage class | Automatic cost optimization |
| Enable CloudFront caching | CloudFront → Distribution → Cache behaviors | Reduces S3 request costs |
| Compress files before upload | Your computer (gzip) | Lower storage and transfer |
| Use shorter cache for HTML | CloudFront → Cache policy | Balance freshness vs. cost |

---

##  Troubleshooting Console Issues

### Can't Find a Service?

| Problem | Solution |
|---------|----------|
| Service not in menu | Use **Search bar** at top of console |
| Wrong region | Check region selector (top right, e.g., "Ohio") — switch to correct region |
| Page won't load | Clear browser cache, try incognito mode, or check AWS Service Health Dashboard |

### Common Error Messages

| Error Message | Meaning | Console Fix |
|---------------|---------|-------------|
| **"Access Denied"** | IAM permissions insufficient | Ask account admin to attach `AmazonS3FullAccess`, `CloudFrontFullAccess`, `AmazonRoute53FullAccess`, `AWSCertificateManagerFullAccess` |
| **"Bucket name already exists"** | Name taken globally | Try a different, more unique name |
| **"Invalid principal in policy"** | Typo in bucket policy | Go to S3 → Permissions → Bucket policy → Check ARN format |
| **"CNAMEAlreadyExists"** | Domain used on another distribution | Remove old CloudFront distribution or contact AWS support |
| **"Certificate not found"** | ACM cert in wrong region | Ensure you're in **us-east-1** (N. Virginia) when viewing ACM |

### Console Tips & Tricks

| Tip | How |
|-----|-----|
| **Pin favorite services** | Click the ☰ icon → click the  next to services you use often |
| **Open multiple services** | Right-click service names → "Open in new tab" |
| **Use the CloudShell** | Click the terminal icon (top right) for a browser-based AWS CLI |
| **View recent changes** | Many services show "Recent changes" or "Activity" in the sidebar |
| **Get help** | Click the **?** icon (top right) → **Documentation** or **Support** |

---

##  Cleanup via Console

To avoid ongoing charges, delete resources in this order:

### Step 1: Delete CloudFront Distribution

1. **CloudFront Console** → Select your distribution
2. Click **Disable** (must disable before deleting)
3. Wait for status to change to **"Disabled"** (refresh page)
4. Click **Delete**
5. Confirm deletion

### Step 2: Delete Route 53 Records

1. **Route 53 Console** → **Hosted zones**
2. Click your domain
3. Select the A record (alias to CloudFront)
4. Click **Delete record**
5. Confirm

> **Note:** Keep the hosted zone if you still own the domain and use it elsewhere.

### Step 3: Delete ACM Certificate

1. **ACM Console** (ensure region is **us-east-1**)
2. Select your certificate
3. Click **Delete**
4. Confirm

### Step 4: Delete S3 Bucket

1. **S3 Console** → Select your bucket
2. Click **Empty** (must delete all objects first)
3. Type `permanently delete` to confirm
4. Wait for emptying to complete
5. Select bucket again → Click **Delete**
6. Type bucket name to confirm

### Step 5: Verify No Charges

1. **Billing Console** → **Bills**
2. Check next month's bill shows $0 or minimal charges

---

##  References

### AWS Console Documentation

| Service | Console URL | Documentation |
|---------|-------------|---------------|
| **S3 Console** | [console.aws.amazon.com/s3](https://s3.console.aws.amazon.com/) | [S3 User Guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html) |
| **CloudFront Console** | [console.aws.amazon.com/cloudfront](https://console.aws.amazon.com/cloudfront/) | [CloudFront Developer Guide](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html) |
| **Route 53 Console** | [console.aws.amazon.com/route53](https://console.aws.amazon.com/route53/) | [Route 53 Developer Guide](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html) |
| **ACM Console** | [console.aws.amazon.com/acm](https://console.aws.amazon.com/acm/) | [ACM User Guide](https://docs.aws.amazon.com/acm/latest/userguide/acm-overview.html) |
| **Billing Console** | [console.aws.amazon.com/billing](https://console.aws.amazon.com/billing/) | [AWS Billing Docs](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/billing-what-is.html) |

### Step-by-Step AWS Tutorials

- [Tutorial: Configuring a static website on Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/HostingWebsiteOnS3Setup.html)
- [Tutorial: Creating a CloudFront distribution](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/GettingStarted.SimpleDistribution.html)
- [Tutorial: Using ACM with CloudFront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/https-settings.html#https-settings-console)

### Related Projects

- [Zani's Eatery AWS Architecture](https://github.com/yourusername/zani-eatery) — Full serverless backend with S3 static hosting, Cognito auth, API Gateway, Lambda, and RDS

---

##  Acknowledgments

- AWS Management Console team for continuous UI improvements
- [Zani's Eatery](https://github.com/yourusername/zani-eatery) project for architecture inspiration
- The AWS community for detailed documentation and tutorials

---

<div align="center">

**Built entirely in the  AWS Management Console**

[⬆ Back to Top](#-static-website-hosting-on-aws-s3--management-console-guide)

</div>
