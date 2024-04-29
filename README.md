# Create Infrastructure and Deplotin a simple ngnix app on ECS using Pulumi javascript
Configure your AWS credentials and region environment variables to be able to build the infrasrtrucure.

This repo offers a solution of automating the creation of simple infra and deplying tha a simpe nginx app in AWS ECS using Pulumi javascript. The infra includes the following:
-  ECS: To deploy the app too.
-  Application Load Balancer
-  ECR: To store the image in private repo
  
# Overview:
The solution is divided into three folders:
- Stack (Pulumi js) in ./infra, which deploys the basic infrastructure of the solution. It includes VPC, security groups and a Application Loadbalancer.
- Stack (Pulumi js) in ./app, which deploys the ecr, builds

# TODO
 - Github Workflow for packaging --> in progress
 - Populate API Documentation for Devs --> in progress
 - Data sorces
 - API Gateway, add dynamic API body instead of importing the json code
 - How properly handle package versioning?
- Mandatory tags should be added to all resources automatically --> done
- Add env variables for envisronment and project name --> done
- The CI pipeline can use https://github.com/dorny/paths-filter to create path-filter for changed packages. Tested the matrix sample but there was a known unresolved issue with checkout step
- put variables for lables in claim files instead of hardcoded values --> done
- research: metrics object to get metrics for prometheus 

# Notes
- In current setup we are not using s3 as static webhosting because public access is blocked from higher leveles. Even though the S3-website folder consists of working webhosting composition

# Packaging
- Packages will be created automatically as part of CI. 
- The package should be installed on cluster using package-config.yaml file
- For the Crossplane to access a private Repository a secret is required as imagePullRequest 

```
kubectl create secret docker-registry package-pull-secret --docker-server=https://artifactory.vodafone.com \
        --docker-username=jfrog_user --docker-password=jfrog_token \
        --docker-email=jfrog_email -n crossplane-system
```

# Resources
https://github.com/upbound/upjet/blob/main/docs/sizing-guide.md

https://github.com/upbound/platform-ref-aws/

https://github.com/upbound/universal-crossplane#upgrade-from-upstream-crossplane
