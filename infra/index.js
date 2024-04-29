"use strict";
const pulumi = require("@pulumi/pulumi");
const aws = require("@pulumi/aws");
const awsx = require("@pulumi/awsx");

const myip="154.180.63.67";



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



// SG
const securityGroup = new aws.ec2.SecurityGroup("elb_sg", {
    vpcId: vpc.vpcId,
    ingress: [
        {
            fromPort: 80,
            toPort: 80,
            protocol: "tcp",
            cidrBlocks: [`${myip}/32`],
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

console.log(vpc.vpcId);


//Loadbalancer
const lb = new awsx.lb.ApplicationLoadBalancer("lb", {
    
    listener: {
        port: 80,
    },
    securityGroups: [securityGroup.id],

    // Associate the load balancer with the VPC's `public` or `private` subnet.
    subnetIds: vpc.publicSubnetIds,
});

exports.vpcId = vpc.vpcId;
exports.privateSubnetIds = vpc.privateSubnetIds;
exports.publicSubnetIds = vpc.publicSubnetIds;
exports.SgId = securityGroup.id 
exports.tg =lb.defaultTargetGroup
// // // export const vpcId = vpc.id;
// // // export const publicSubnetId = publicSubnet.id;
// // // export const privateSubnetId = privateSubnet.id;