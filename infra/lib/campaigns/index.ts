import type { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import { CampaignsFlow } from "./campaigns";
import { SharedResourcesBlock } from "./shared";
import config from "./config/shared";

export class CampaingStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const sharedResources = new SharedResourcesBlock(this, `${id}SharedBlock`, {
      connectArnPerService: config.connectArnPerService,
      lambdaConnect: {
        // NOTE: Valid Range: Minimum value of 1. Maximum value of 10.
        // If maxBatchingWindow is configured, this value can go up to 10,000.
        batchSize: 10,
        // NOTE: Valid Range: Minimum value of 0. Maximum value of 300 (5 min in seconds).
        maxBatchingWindow: undefined,
      },
      pkName: config.pkName,
    });

    new CampaignsFlow(this, `${id}CampaignsFlow`, {
      sqsUrl: sharedResources.sqsUrl,
      loadBucket: sharedResources.cargarListadoBucket,
    });
  }
}
