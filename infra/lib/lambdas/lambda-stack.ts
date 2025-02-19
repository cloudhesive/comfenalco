import type { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { lambdas } from "./lambdas";
import { addPolicyToLambda } from "./lambdas/policy";

interface LambdaStackProps extends cdk.StackProps {
  dynamoDBTableName: string;
}

export class LambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    const lambdaConfigs = lambdas({ dynamoDBTableName: props.dynamoDBTableName });
    lambdaConfigs.forEach((lambdaConfig) => {
      const lambdaFunction = new lambda.Function(this, lambdaConfig.name, {
        runtime: lambdaConfig.runtime,
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
      if (lambdaConfig.environment) {
        Object.entries(lambdaConfig.environment).forEach(([key, value]) => {
          lambdaFunction.addEnvironment(key, value);
        });
      }

      if (lambdaConfig.resources && lambdaConfig.actions) {
        addPolicyToLambda(lambdaFunction, lambdaConfig.actions, lambdaConfig.resources);
      }
    });
  }
}
