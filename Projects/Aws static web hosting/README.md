# Project Static Website AWS

## About This Folder

This folder contains my AWS static website hosting project for the AWS re/Start portfolio. It includes the website source files, project documentation, and supporting presentation materials used to show how a static website can be hosted on AWS.

The project focuses on deploying a front-end website to Amazon S3 and explaining the cloud services, configuration steps, and migration benefits involved in the solution.

## Folder Contents

| Item | Description |
|---|---|
| `AWS_re-Start_S3_WebHosting_Project-main/` | Static website source files, including HTML, CSS, JavaScript, images, and menu data |
| `Static Website Hosting on AWS S3.md` | Written notes for hosting the website using Amazon S3 |
| `Project 1 - Praesignis AWS Special - Building a Static Website and Presenting AWS Migration Benefits.pdf` | Project brief or presentation material for the static website task |
| `Zani-Eatery-AWS-Backend-Migration-Comprehensive.pdf` | Supporting documentation about AWS migration benefits and backend modernization |
| `README.md` | This overview file explaining the purpose and structure of the folder |

## Project Summary

The project is based on a restaurant-style website called Zani Eatery. The website files are designed as static front-end assets that can be uploaded to Amazon S3 and served through S3 static website hosting.

This demonstrates how a business can move simple web content to AWS without needing to manage a traditional physical server or full web hosting environment.

## Main Objectives

- Organize and document the static website project files
- Host a static website using Amazon S3
- Configure S3 static website hosting
- Upload HTML, CSS, JavaScript, images, and data files
- Test that the website is accessible through the S3 website endpoint
- Explain AWS migration benefits for a small business use case

## AWS Services Covered

| AWS Service | Purpose in This Project |
|---|---|
| Amazon S3 | Stores and hosts the static website files |
| AWS IAM | Helps manage permissions and secure access |
| Amazon CloudFront | Possible improvement for HTTPS, caching, and global delivery |
| Amazon Route 53 | Possible improvement for custom domain configuration |

## Website Files

The source website is stored in:

```text
AWS_re-Start_S3_WebHosting_Project-main/
```

Important parts of the website include:

- `index.html` - main landing page
- `pages/` - additional website pages such as menu, cart, checkout, login, and orders
- `styles/` - CSS styling files
- `scripts/` - JavaScript files for website behaviour
- `resources/images/` - website images
- `data/menu.json` - sample menu data

## What This Project Shows

- Basic static website deployment on AWS
- How Amazon S3 can be used for website hosting
- How static website files are structured
- How cloud hosting can support a small business website
- How to document a cloud project clearly for a portfolio

## Skills Practised

- AWS S3 bucket setup
- Static website hosting configuration
- Website file organization
- HTML, CSS, and JavaScript project structure
- Cloud permissions awareness
- Technical documentation
- Presenting AWS migration benefits

## Future Improvements

- Add a custom domain with Amazon Route 53
- Add HTTPS and caching with Amazon CloudFront
- Use AWS Certificate Manager for SSL/TLS
- Automate uploads using the AWS CLI
- Add screenshots of the deployed website and S3 configuration

## Project Status

Completed as part of my AWS re/Start portfolio.
