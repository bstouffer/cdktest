import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import {Tag} from "@aws-cdk/core";

export class CdkStack extends cdk.Stack {
	constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		let hostingBucket = new s3.Bucket(this, 'HostingBucket');
		Tag.add(hostingBucket, 'test', 'bryan');

		const resource = hostingBucket.node.findChild('Resource') as cdk.CfnResource;
		resource.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);


		// The code that defines your stack goes here
	}
}
