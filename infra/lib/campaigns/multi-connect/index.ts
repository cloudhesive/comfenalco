import { Bucket, EventType } from "aws-cdk-lib/aws-s3";
import { Function as LambdaFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
// import config from "./config";
import { aws_lambda, Duration } from "aws-cdk-lib";
import * as path from "node:path";
import {
  S3EventSource,
  SqsEventSource,
} from "aws-cdk-lib/aws-lambda-event-sources";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { AttributeType, TableV2 } from "aws-cdk-lib/aws-dynamodb";

type Props = {};

export class SecureBucket extends Construct {
  constructor(scope: Construct, id: string, props?: Props) {
    super(scope, id);

    const cargaListado = new Bucket(this, `${id}-carga-listado-bucket`, {
      bucketName: `${id}-carga-listado-campaña`,
    });

    const campaignsSQS = new Queue(this, `${id}-to-process-sqs`, {
      // NOTE: Max delay 15 min
      deliveryDelay: Duration.minutes(5),
    });

    const procesarCsv = new LambdaFunction(this, `${id}-procesar-csv-lambda`, {
      runtime: aws_lambda.Runtime.NODEJS_22_X,
      description:
        "Lambda que procesa el listado de campañas y las encola para ser ejecutadas las encuestas",
      functionName: "ProcesarCsv",
      handler: "lambdas/procesarCsv/index.handler",
      code: aws_lambda.Code.fromAsset(
        path.join(__dirname, "../../../../backend/build-campaigns/"),
        {
          exclude: [
            "lambdas/dispararConnect/**",
            "lambdas/guardaDatosEncuesta/**",
          ],
        },
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

    const pk_name = "numero_contacto";
    const resultsDB = new TableV2(this, `${id}-resultados-encuesta-dynamodb`, {
      partitionKey: { name: pk_name, type: AttributeType.STRING },
      tableName: `${id}-resultados-encuesta`,
    });

    const disparaConnect = new LambdaFunction(
      this,
      `${id}-dispara-connect-lambda`,
      {
        runtime: aws_lambda.Runtime.NODEJS_22_X,
        description:
          "Lambda que envia la peticion a connect segun el usuario o usuarios (batch) que este procesando",
        functionName: "DispararConnect",
        handler: "lambdas/dispararConnect/index.handler",
        code: aws_lambda.Code.fromAsset(
          path.join(__dirname, "../../../../backend/build-campaigns/"),
          {
            exclude: [
              "lambdas/procesarCsv/**",
              "lambdas/guardaDatosEncuesta/**",
            ],
          },
        ),
        memorySize: 128,
        timeout: Duration.seconds(10),
        environment: {
          CONNECT_NAME: "multi",
          DYNAMO_TABLE_NAME: resultsDB.tableName,
          DYNAMO_TABLE_PK_NAME: pk_name,
        },
      },
    );

    disparaConnect.addEventSource(
      new SqsEventSource(campaignSQS, { batchSize: 10 }),
    );

    const guardaDatosEncuesta = new LambdaFunction(
      this,
      `${id}-guarda-datos-lambda`,
      {
        runtime: aws_lambda.Runtime.NODEJS_22_X,
        description: "Lambda que guarda los datos de la encuesta en dynamo",
        functionName: "GuardaDatosEncuesta",
        handler: "lambdas/guardaDatosEncuesta/index.handler",
        code: aws_lambda.Code.fromAsset(
          path.join(__dirname, "../../../../backend/build-campaigns/"),
          {
            exclude: ["lambdas/procesarCsv/**", "lambdas/dispararConnect/**"],
          },
        ),
        memorySize: 128,
        timeout: Duration.seconds(10),
        environment: {
          DYNAMO_TABLE_NAME: resultsDB.tableName,
          DYNAMO_TABLE_PK_NAME: pk_name,
        },
      },
    );
  }
}
