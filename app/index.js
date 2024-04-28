"use strict";
const pulumi = require("@pulumi/pulumi");
const aws = require("@pulumi/aws");
const awsx = require("@pulumi/awsx");
// you need to add the stack reference that refers to the infr resources
const stack_ref = "Abdullahtheauthor/infrastructure/dev"
const outputs= new pulumi.StackReference(stack_ref);
const privateSubnetIds = outputs.getOutput("privateSubnetIds");


const publicSubnetIds = outputs.getOutput("publicSubnetIds");

const SecurityGroupId = outputs.getOutput("SgId");
const tg= outputs.getOutput("tg")


// ecr
const repository = new awsx.ecr.Repository("repository", {
    name: "nginx_server",
    forceDelete: true,
});

const image = new awsx.ecr.Image("image", {
    repositoryUrl: repository.url,
    context: "../web/.",
    platform: "linux/amd64",
    imageName: "1",

});



// // esc
const cluster = new aws.ecs.Cluster("cluster");
const service = new awsx.ecs.FargateService("service", {
    cluster: cluster.arn,
    networkConfiguration: {
        subnets: privateSubnetIds,
        securityGroups: [SecurityGroupId.id],
    },
    desiredCount: 2,
    taskDefinitionArgs: {
        container: {
            name: "my-service",
            image: image.imageUri,
            cpu: 128,
            memory: 512,
            essential: true,
            portMappings: [
                {
                    containerPort: 80,
                    targetGroup: tg,
                },
            ],
        },
    },
});
exports.url = repository.url;
// exports.endpoint = lb.loadBalancer.dnsName;
// exports.url = pulumi.interpolate`http://${lb.loadBalancer.dnsName}`;

