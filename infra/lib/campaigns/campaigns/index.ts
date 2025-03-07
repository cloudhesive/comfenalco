import { Construct } from "constructs";
import { Function as LambdaFunction } from "aws-cdk-lib/aws-lambda";
import { aws_lambda, Duration } from "aws-cdk-lib";
import * as path from "node:path";
import { commonRootPath } from "../shared/common";
import { S3EventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { Bucket, EventType } from "aws-cdk-lib/aws-s3";
import { Queue } from "aws-cdk-lib/aws-sqs";

type Props = {
  loadBucket: Bucket;
  queueToSend: Queue;
};

export class CampaignsFlow extends Construct {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    const procesarCsvS3 = new LambdaFunction(this, `${id}ProcesarCsvLambda`, {
      runtime: aws_lambda.Runtime.NODEJS_22_X,
      description:
        "Lambda que procesa el listado de campañas y las encola para ser ejecutadas las encuestas",
      functionName: `${id}ProcesarCsvFromS3`,
      handler: "index.handler",
      code: aws_lambda.Code.fromAsset(
        path.join(__dirname, commonRootPath, "procesarCsvS3/"),
      ),
      memorySize: 128,
      timeout: Duration.seconds(10),
      environment: {
        SQS_URL: props.queueToSend.queueUrl,
      },
    });

    procesarCsvS3.addEventSource(
      new S3EventSource(props.loadBucket, {
        events: [EventType.OBJECT_CREATED],
        filters: [
          {
            prefix: "campaigns",
          },
        ],
      }),
    );

    if (procesarCsvS3.role) {
      props.loadBucket.grantRead(procesarCsvS3.role);
      props.queueToSend.grantSendMessages(procesarCsvS3.role);
    }
  }
}
