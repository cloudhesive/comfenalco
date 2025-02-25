import type { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import { LambdaStack } from "./lambdas/lambda-stack";
import { DynamoDBStack } from "./dynamodb/dynamodb-stack";
import { CampaingStack } from "./campaigns";

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dynamoDBStack = new DynamoDBStack(this, "DynamoDBStack");
    new LambdaStack(this, "LambdaStack", {
      dynamoDBTableName: dynamoDBStack.tableName,
    });

    new CampaingStack(this, `${id}CampaingStack`);
  }
}
