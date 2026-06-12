# Networking Labs

## About This Folder

This folder contains my AWS re/Start networking labs and notes. The labs focus on how networks are designed, configured, secured, and troubleshot in AWS.

The work in this section includes IP addressing, public and private networking, subnet planning, Amazon VPC resources, routing, internet connectivity, troubleshooting commands, and real-world cloud support scenarios.

## Lab Index

| Lab | Focus Area |
|---|---|
| [Internet Protocols - Public and Private IP Addresses](./Internet_Protocols_Public_and_Private_IP_Addresses.md) | Understanding the difference between public and private IP addresses in customer support scenarios |
| [Internet Protocols - Static and Dynamic Addresses](./Internet_Protocols_Static_and_Dynamic_Addresses_Lab.md) | Investigating why EC2 public IP addresses change and when to use static addressing |
| [Internet Protocol Troubleshooting Commands](./Internet_Protocol_Troubleshooting_Commands.md) | Using commands such as `ping`, `traceroute`, `netstat`, `telnet`, and `curl` to diagnose network issues |
| [Create Subnets and Allocate IP Addresses in Amazon VPC](./Create_Subnets_and_Allocate_IP_Addresses_in_Amazon_VPC.md) | Planning VPC CIDR ranges and creating public and private subnets |
| [Creating Networking Resources in Amazon VPC](./Creating_Networking_Resources_in_Amazon_VPC.md) | Building VPC networking resources for internet connectivity |
| [Build Your VPC and Launch a Web Server](./Build_Your_VPC_and_Launch_a_Web_Server.md) | Creating a custom VPC, configuring subnets and security groups, and launching a web server |
| [Troubleshooting a Network Issue](./Troubleshooting_Network_Issue_Lab.md) | Diagnosing and fixing VPC connectivity issues using a cloud support workflow |

## Topics Covered

| Area | What I Practised |
|---|---|
| IP Addressing | Public IPs, private IPs, static addresses, dynamic addresses, and address planning |
| CIDR and Subnetting | Choosing CIDR blocks and allocating subnet IP ranges |
| Amazon VPC | Creating isolated cloud networks and adding network components |
| Routing | Working with route tables and internet connectivity paths |
| Internet Access | Using internet gateways and public subnets |
| Security | Configuring security groups and understanding network access rules |
| Troubleshooting | Using command-line tools and AWS configuration checks to find connectivity problems |
| Cloud Support Scenarios | Reading customer tickets, identifying root causes, and documenting solutions |

## AWS Services and Tools Used

- Amazon VPC
- Amazon EC2
- Subnets
- Route tables
- Internet gateways
- Security groups
- Network ACL concepts
- Public and private IP addressing
- Linux networking commands
- Web server testing tools

## Skills Practised

- Explaining the difference between public and private IP addresses
- Understanding when a static IP address is needed
- Planning VPC and subnet CIDR ranges
- Creating VPC networking resources
- Launching EC2 instances into a custom network
- Configuring security groups for web access
- Testing connectivity with network troubleshooting commands
- Investigating broken network paths
- Reading support-style customer scenarios and documenting findings

## Suggested Learning Path

1. Start with public, private, static, and dynamic IP address labs.
2. Practise troubleshooting commands and map them to network layers.
3. Move into VPC CIDR planning and subnet creation.
4. Build networking resources such as route tables and internet gateways.
5. Launch a web server inside a custom VPC.
6. Finish with the VPC troubleshooting lab to practise diagnosing real issues.

## Why This Section Matters

Networking is a foundation for almost every AWS workload. These labs helped me understand how cloud resources communicate, how traffic is controlled, and how to troubleshoot connectivity issues in a structured way.
