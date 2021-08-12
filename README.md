# Authorizer API Gateway with AWS Lambda & AWS SSM Parameter Store - Sample
Use JWT + Nodejs + AWS Lambda + Serverless framework + AWS SSM for API Gateway Authorizer

Created by Quan Le Trong (https://github.com/quanltsimple)
# Solution Description
## System Architecture

## Architecture diagram

This solution can be deployed in the AWS (Tokyo) region, or in other AWS overseas regions.

![](images/apigw-auth-lambda.png)

## Components

### AWS Lambda

- This solution runs on the AWS Lambda function, which is a serverless computing service for functions. With AWS Lambda, you don't need to on-premises and manage servers, and you can assign and pay for resources for each application and improve security by designing to isolate applications.
- To ensure high system availability, With AWS Lambda, the default limit is 1000 requests at a time. If your system has concurrent traffic >=1000 requests, ask AWS to upgrade it to the amount you want.
- Amazon Lambda supports Java, Go, PowerShell, Node.js, C#, Python and Ruby and Docker. With this solution we use NodeJS 14.x

### AWS Systems Manager Parameter Store
- AWS Systems Manager, provides secure, hierarchical storage for configuration data management and secrets management.
- With this solution we will use this service to store the Public Key of JWT.

### Serverless framwork
- The Serverless Framework is a free and open-source web framework written using Node.js. Serverless is the first framework developed for building applications on AWS Lambda, a serverless computing platform provided by Amazon as a part of Amazon Web Services

## Deployment Instructions

### Deployment prerequisites
- First you need to install AWS CLI

```
Install refer: https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html
```

- Install Node.JS
```
Download Node.JS in https://nodejs.org/en/
```

- Install Serverless framwork via NPM installed
```
npm install -g serverless
```

- Using AWS account with permission: CloudFormation, S3, API Gateway & AWS Lambda

- Setting profile AWS CLI in your computer with Access Key from AWS account

```
Running: aws configure
AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Default region name [None]: ap-northeast-1 (your region)
Default output format [None]: json
```

- Create role for AWS Lambda function with permission put logs & get parameter from AWS SSM:
Example

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor1",
            "Effect": "Allow",
            "Action": [
                "logs:*",
                "ssm:DescribeParameters"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "ssm:GetParameters",
                "ssm:GetParameter"
            ],
            "Resource": "arn:aws:ssm:your-region:xxxx:parameter/your-name-parameter"
        }
    ]
}
```
- Modify config in serverless.yml
```
All variables with a value with the word "yourapp" need to be replaced as appropriate for your application
```

- Add your JWT Public Key to AWS SSM

First, log in to the ACM console & access to Parameter Store console (refer: https://console.aws.amazon.com/systems-manager/parameters/).

Click Create Parameter

![](images/ssm-01.png)

Fill your Parameter Name & Choose SecureString option

![](images/ssm-02.png)

Fill your JWT Public Key to Value -> Click Create parameter

![](images/ssm-03.png)

- Modify source code in authHandler.js

Change your name parameter & your algorithms

![](images/source-code-01.png)

## Deploy to AWS

- Install dependency from NPM in folder project
```
npm install
```

- New Deploy (or Update) to AWS (in folder project)
```
serverless deploy
```

- Deploy to AWS (in folder project) with region or stage custom
```
serverless deploy --region yourregion --stage yourstage
```

## Check result on AWS

- Access to API Gateway console -> Choose your API Gateway -> Click Authorizers

![](images/api-gw-auth-01.png)