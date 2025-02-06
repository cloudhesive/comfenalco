import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "path";

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const myLambda = new lambda.Function(this, "MyLambdaFunction", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "habeasData/index.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "./../../backend/dist/")),
      memorySize: 128,
      timeout: cdk.Duration.seconds(10),
      environment: {
        URL: "https://comfenalcoquindio.online:9090/api/comfenalco/",
      },
    });
    console.log(path.join(__dirname, "./../../backend/dist/"));

    new cdk.CfnOutput(this, "LambdaARN", { value: myLambda.functionArn });
  }
}
