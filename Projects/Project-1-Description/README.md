# Project 1: Hosting a Portfolio Website on AWS

## Project Overview

This project demonstrates how to deploy a personal portfolio website using AWS cloud services. The aim was to practise the full process of preparing website files, hosting them in the cloud, configuring access, and testing that the site can be reached from a browser.

The project helped me understand how AWS can be used to host simple web content reliably without needing to manage a full traditional server environment.

## Scenario

A personal portfolio website needs to be hosted online so that it can be accessed publicly. The solution should be simple, cost-aware, and suitable for static content such as HTML, CSS, images, and project documentation.

## Objectives

- Host a static portfolio website on AWS
- Store website files in an Amazon S3 bucket
- Enable static website hosting
- Configure public access permissions
- Test the website endpoint
- Document the deployment process clearly

## Services and Tools Used

| Service or Tool | Purpose |
|---|---|
| Amazon S3 | Stores and hosts the website files |
| AWS IAM | Helps manage access and permissions |
| AWS Management Console | Used to create and configure AWS resources |
| HTML and CSS | Used for the website structure and styling |
| Web browser | Used to test the deployed website |

## Architecture

```text
User
 |
 v
Web Browser
 |
 v
Amazon S3 Static Website Endpoint
 |
 v
Portfolio Website Files
```

## Implementation Steps

### 1. Prepared the Website Files

The website files were prepared locally before deployment. These files can include:

- `index.html`
- CSS files
- Images
- Supporting website assets

### 2. Created an S3 Bucket

An Amazon S3 bucket was created to store the website files. The bucket name needed to be unique because S3 bucket names are globally unique across AWS.

### 3. Uploaded Website Files

The static website files were uploaded into the S3 bucket. The main homepage file was named `index.html` so that S3 could use it as the default page.

### 4. Enabled Static Website Hosting

Static website hosting was enabled in the S3 bucket properties. The index document was set to:

```text
index.html
```

### 5. Configured Public Access

The bucket permissions were updated so that the website files could be viewed publicly through the S3 website endpoint.

### 6. Tested the Website

The S3 static website endpoint was opened in a browser to confirm that the portfolio website loaded successfully.

## Challenges Faced

| Challenge | How I Solved It |
|---|---|
| The website did not load at first | Checked that static website hosting was enabled and that `index.html` was configured correctly |
| Access was denied when opening the endpoint | Reviewed the bucket public access settings and permissions |
| S3 permissions were confusing | Compared bucket-level permissions with object-level access to understand the difference |

## Key Skills Demonstrated

- AWS S3 bucket creation
- Static website hosting
- Cloud storage configuration
- Basic IAM and permission awareness
- Troubleshooting access issues
- Writing technical documentation

## What I Learned

This project taught me how AWS S3 can be used for more than file storage. I learned that S3 can also host static websites and provide a public endpoint for users to access web content.

I also learned the importance of permissions in cloud environments. A website can be configured correctly but still fail to load if access settings are not properly configured.

## Possible Improvements

- Add a custom domain using Amazon Route 53
- Add HTTPS using Amazon CloudFront and AWS Certificate Manager
- Use AWS CLI commands to automate deployment
- Add screenshots of the S3 bucket configuration and live website
- Add a simple architecture diagram image

## Project Status

Completed as part of my AWS re/Start portfolio.
