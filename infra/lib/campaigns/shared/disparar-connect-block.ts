import { Bucket, EventType } from "aws-cdk-lib/aws-s3";
import { Function as LambdaFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { aws_lambda, Duration } from "aws-cdk-lib";
import * as path from "node:path";
import {
  S3EventSource,
  SqsEventSource,
} from "aws-cdk-lib/aws-lambda-event-sources";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { commonRootPath, toDashCase } from "./common";

type Props = {
  encuestasResultsDB: { tableName: string; pkName: string };
  lambdaConnect?: {
    batchSize?: number;
    // NOTE: Value in seconds
    // Max value: 300
    maxBatchingWindow?: number;
  };
  connectArnPerService: { [key: string]: string };
};

export class DispararConnectBlock extends Construct {
  public cargarListadoBucketName: string;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    const cargaListado = new Bucket(this, `${id}CargaListadoCampaignBucket`, {
      bucketName: `${toDashCase(id)}-carga-listado-campaign`,
    });
    this.cargarListadoBucketName = cargaListado.bucketName;

    const campaignSQS = new Queue(this, `${id}ProcessAndWaitSQS`, {
      // NOTE: Max delay 15 min
      deliveryDelay: Duration.minutes(5),
    });

    const procesarCsv = new LambdaFunction(this, `${id}ProcesarCsvLambda`, {
      runtime: aws_lambda.Runtime.NODEJS_22_X,
      description:
        "Lambda que procesa el listado de campañas y las encola para ser ejecutadas las encuestas",
      functionName: `${id}ProcesarCsv`,
      handler: "index.handler",
      code: aws_lambda.Code.fromAsset(
        path.join(__dirname, commonRootPath, "procesarCsv/"),
      ),
      memorySize: 128,
      timeout: Duration.seconds(10),
      environment: {
        SQS_URL: campaignSQS.queueUrl,
      },
    });

    procesarCsv.addEventSource(
      new S3EventSource(cargaListado, {
        events: [EventType.OBJECT_CREATED],
      }),
    );

    const disparaConnect = new LambdaFunction(
      this,
      `${id}DispararFlujoConnectLambda`,
      {
        runtime: aws_lambda.Runtime.NODEJS_22_X,
        description:
          "Lambda que envia la peticion a connect segun el usuario o usuarios (batch) que este procesando",
        functionName: `${id}DispararFlujoConnect`,
        handler: "index.handler",
        code: aws_lambda.Code.fromAsset(
          path.join(__dirname, commonRootPath, "dispararConnect/"),
        ),
        memorySize: 128,
        timeout: Duration.seconds(10),
        environment: {
          CONNECT_ARN_PER_SERVICE: JSON.stringify(props.connectArnPerService),
          DYNAMO_TABLE_NAME: props.encuestasResultsDB.tableName,
          DYNAMO_TABLE_PK_NAME: props.encuestasResultsDB.pkName,
        },
      },
    );

    disparaConnect.addEventSource(
      new SqsEventSource(campaignSQS, {
        batchSize: props?.lambdaConnect?.batchSize ?? 10,
        reportBatchItemFailures: true,
        maxBatchingWindow:
          props?.lambdaConnect?.maxBatchingWindow !== undefined
            ? Duration.seconds(
                Math.min(props?.lambdaConnect?.maxBatchingWindow, 300),
              )
            : undefined,
      }),
    );
  }
}
