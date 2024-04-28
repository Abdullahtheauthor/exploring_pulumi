"use strict";
const pulumi = require("@pulumi/pulumi");
const aws = require("@pulumi/aws");
const awsx = require("@pulumi/awsx");

// Allocate a new VPC with the default settings.
const vpc = new awsx.ec2.Vpc("vpc",{
    subnetSpecs: [
        {
            type: awsx.ec2.SubnetType.Public,
            cidrMask: 22,
        },
        {
            type: awsx.ec2.SubnetType.Private,
            cidrMask: 20,
        },
    ],
});

exports.vpcId = vpc.vpcId;
exports.privateSubnetIds = vpc.privateSubnetIds;
exports.publicSubnetIds = vpc.publicSubnetIds;

// // Create an Internet Gateway and attach it to the Default VPC.
// const gateway = new aws.ec2.InternetGateway("gateway", {
//     vpcId: vpc.vpcId,
// });

// // Create a public Subnet. AWS selects an available CIDR block in the VPC range.
// const publicSubnet = new aws.ec2.Subnet("publicSubnet", {
//     vpcId: vpc.vpcId,
//     mapPublicIpOnLaunch: true, // ensures instances receive a public IP
//     availabilityZone: "eu-central-1a", // choose an appropriate availability zone
// });

// // Create a Route Table for the public Subnet, including a route to the Internet Gateway.
// const publicRouteTable = new aws.ec2.RouteTable("publicRouteTable", {
//     vpcId: vpc.vpcId,
//     routes: [{
//         cidrBlock: "0.0.0.0/0",
//         gatewayId: gateway.id,
//     }],
// });

// // Associate the public Route Table with the public Subnet.
// const publicRouteTableAssociation = new aws.ec2.RouteTableAssociation("publicRouteTableAssociation", {
//     subnetId: publicSubnet.id,
//     routeTableId: publicRouteTable.id,
// });


// // Create a private Subnet in the same way, without mapping public IPs.
// const privateSubnet = new aws.ec2.Subnet("privateSubnet", {
//     vpcId: vpc.vpcId,
//     availabilityZone: "eu-central-2b", // another availability zone for the private subnet
// });

// // Create a private Route Table. Do not add a route to the Internet Gateway, as this is a private subnet.
// const privateRouteTable = new aws.ec2.RouteTable("privateRouteTable", {
//     vpcId: vpc.vpcId,
// });

// // Associate the private Route Table with the private Subnet.
// const privateRouteTableAssociation = new aws.ec2.RouteTableAssociation("privateRouteTableAssociation", {
//     subnetId: privateSubnet.id,
//     routeTableId: privateRouteTable.id,
// });





// SG
const securityGroup = new aws.ec2.SecurityGroup("group", {
    vpcId: vpc.vpcId,
    ingress: [
        {
            fromPort: 80,
            toPort: 80,
            protocol: "tcp",
            cidrBlocks: ["0.0.0.0/0"],
        },

    ],
    egress: [
        {
            fromPort: 0,
            toPort: 0,
            protocol: "-1",
            cidrBlocks: ["0.0.0.0/0"],
        },
    ],
});




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

// Loadbalancer

const lb = new awsx.lb.ApplicationLoadBalancer("lb", {
    
    listener: {
        port: 80,
    },
    securityGroups: [securityGroup.id],

    // Associate the load balancer with the VPC's `public` or `private` subnet.
    subnetIds: vpc.publicSubnetIds,
});

// // esc
const cluster = new aws.ecs.Cluster("cluster");
const service = new awsx.ecs.FargateService("service", {
    cluster: cluster.arn,
    networkConfiguration: {
        subnets: vpc.privateSubnetIds,
        securityGroups: [securityGroup.id],
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
                    targetGroup: lb.defaultTargetGroup,
                },
            ],
        },
    },
});
exports.url = repository.url;
exports.endpoint = lb.loadBalancer.dnsName;
exports.url = pulumi.interpolate`http://${lb.loadBalancer.dnsName}`;
// // // export const vpcId = vpc.id;
// // // export const publicSubnetId = publicSubnet.id;
// // // export const privateSubnetId = privateSubnet.id;