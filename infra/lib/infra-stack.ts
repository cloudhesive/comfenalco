import type { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import { LambdaStack } from "./lambdas/lambda-stack";

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new LambdaStack(this, "LambdaStack");
  }
}
