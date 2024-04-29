# Create Infrastructure and Deplotin a simple ngnix app on ECS using Pulumi javascript
Configure your AWS credentials and region environment variables to be able to build the infrasrtrucure.

This repo offers a solution of automating the creation of simple infra and deplying tha a simpe nginx app in AWS ECS using Pulumi javascript. The infra includes the following:
-  ECS: To deploy the app too.
-  Application Load Balancer
-  ECR: To store the image in private repo.
  
# Overview:
The solution is divided into three folders:
- Stack (Pulumi js) in ./infra, which deploys the basic infrastructure of the solution. It includes VPC, security groups and a Application Loadbalancer.
- Stack (Pulumi js) in ./app, which deploys the ecr, builds, and push the image to private repo. Then, it deploys the container from that image into ECS.
- Workflow file (Github actions), to deploy the app to ECS depending on the conditions required.

# Architecture:
1. A VPC that has the two security groups. One for the Loadbalancer(ALB), and the other is for AWS ECS (In stack, ./infra).
2. A LoadBalancer (ALB), which only allow access to an IP that you can set in a variable; for security measurments (In stack, ./infra).
3. ECR, Where we push our image to (In stack, ./app).
4. ECS, Where the app is deployed to as a container (In stack, ./app).

![Image](arch.drawio)

# Using this repo in details:
1. you need to set uo your aws profile in your terminal using Env variables:
   `export AWS_PROFILE=<ypu-aws-profile-name>`
2. change dir to the first stack in dir (infra). 
   - Build it after changing the stack yaml file to the specific region you want to deploy the app to.
3. change dir to you second stack (app). 
   - Build it after changing the stack yaml file to the specific region you want to deploy the app to.
4. If you changed the index.html file and pushed your changed to your repo, it'd automatically deploy it to your AWS ECS created in step 2.



