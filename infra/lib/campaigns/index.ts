import type { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import { MultiConnectFlow } from "./multi-connect";
import { SingleConnectFlow } from "./single-connect";
import { SaveOnlyFlow } from "./save-only-connect";

export class CampaingStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new MultiConnectFlow(this, `${id}MultiConnectFlow`);
    new SingleConnectFlow(this, `${id}SingleConnectFlow`);
    new SaveOnlyFlow(this, `${id}SaveOnlyFlow`);
  }
}

