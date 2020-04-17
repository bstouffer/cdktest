import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3Deployment from '@aws-cdk/aws-s3-deployment';
import lambda = require('@aws-cdk/aws-lambda');
import path = require('path');
import {Tag} from "@aws-cdk/core";

export class CdkStack extends cdk.Stack {
	constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		let hostingBucket = new s3.Bucket(this, 'HostingBucket', {
			websiteIndexDocument: 'index.html',
			publicReadAccess: true
		});
		Tag.add(hostingBucket, 'test', 'bryan');

		const resource = hostingBucket.node.findChild('Resource') as cdk.CfnResource;
		resource.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

		new s3Deployment.BucketDeployment(this, 'DeployWebsite', {
			sources: [s3Deployment.Source.asset('./vue-build')],
			destinationBucket: hostingBucket,
			destinationKeyPrefix: 'web/static' // optional prefix in destination bucket
		});

		const lambdaTest = new lambda.Function(this, 'LambdaTest', {
			runtime: lambda.Runtime.NODEJS_10_X,
			handler: 'index.handler',
			code: lambda.Code.fromAsset(path.join(__dirname, '../lambdaTest')),
		});
	}
}
