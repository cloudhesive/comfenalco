import type { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { lambdas } from "./lambdas";

export class LambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    for (const lambdaConfig of lambdas) {
      const lambdaFunction = new lambda.Function(this, lambdaConfig.name, {
        runtime: lambda.Runtime.NODEJS_LATEST,
        description: lambdaConfig.description,
        functionName: lambdaConfig.name,
        handler: lambdaConfig.handler,
        code: lambdaConfig.code,
        memorySize: 128,
        timeout: cdk.Duration.seconds(10),
        environment: {
          URL: "https://comfenalcoquindio.online:9090/api/comfenalco/",
        },
      });
    }
  }
}
