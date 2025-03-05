import { Bucket } from "aws-cdk-lib/aws-s3";
import { Function as LambdaFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { aws_lambda, CfnOutput, Duration } from "aws-cdk-lib";
import * as path from "node:path";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { commonRootPath, toDashCase } from "./common";
import { AttributeType, TableV2 } from "aws-cdk-lib/aws-dynamodb";

type Props = {
  // encuestasResultsDB: { tableName: string; pkName: string };
  lambdaConnect?: {
    batchSize?: number;
    // NOTE: Value in seconds
    // Max value: 300
    maxBatchingWindow?: number;
  };
  connectArnPerService: {
    surveys: { [key: string]: string };
    campaigns: { [key: string]: string };
  };
  pkName: string;
};

export class SharedResourcesBlock extends Construct {
  public guardarDatosLambdaArn: string;
  public descargarCsvLambdaArn: string;
  public cargarListadoBucketName: string;
  public sqsUrl: string;
  public pkName: string;
  public tableName: string;

  public cargarListadoBucket: Bucket;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    const cargaListado = new Bucket(this, `${id}CargaListadoCampaignBucket`, {
      bucketName: `${toDashCase(id)}-carga-listado-campaign`,
    });

    const campaignSQS = new Queue(this, `${id}ProcessAndWaitSQS`, {
      // NOTE: Max delay 15 min
      deliveryDelay: Duration.minutes(5),
    });

    const resultsDB = new TableV2(this, `${id}ResultadosEncuestaDynamodb`, {
      partitionKey: { name: this.pkName, type: AttributeType.STRING },
      tableName: `${id}ResultadosEncuesta`,
    });

    const disparaConnect = new LambdaFunction(
      this,
      `${id}DispararFlujoConnectLambda`,
      {
        runtime: aws_lambda.Runtime.NODEJS_22_X,
        description:
          "Lambda que envia la peticion a connect segun el usuario o usuarios (batch) que este procesando",
        functionName: `${id}DispararConnect`,
        handler: "index.handler",
        code: aws_lambda.Code.fromAsset(
          path.join(__dirname, commonRootPath, "dispararConnect/"),
        ),
        memorySize: 128,
        timeout: Duration.seconds(10),
        environment: {
          CONNECT_ARN_PER_SERVICE: JSON.stringify(props.connectArnPerService),
          DYNAMO_TABLE_NAME: resultsDB.tableName,
          DYNAMO_TABLE_PK_NAME: props.pkName,
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

    const guardaDatosEncuesta = new LambdaFunction(
      this,
      `${id}GuardarDatosEncuestaLambda`,
      {
        runtime: aws_lambda.Runtime.NODEJS_22_X,
        description: "Lambda que guarda los datos de la encuesta en dynamo",
        functionName: `${id}GuardarDatos`,
        handler: "index.handler",
        code: aws_lambda.Code.fromAsset(
          path.join(__dirname, commonRootPath, "guardaDatosEncuesta/"),
        ),
        memorySize: 128,
        timeout: Duration.seconds(10),
        environment: {
          DYNAMO_TABLE_NAME: resultsDB.tableName,
          DYNAMO_TABLE_PK_NAME: props.pkName,
        },
      },
    );

    const resultadosEncuestas = new Bucket(
      this,
      `${id}ResultadosEncuestasBucket`,
      {
        bucketName: `${toDashCase(id)}-resultados-encuestas-campaign`,
      },
    );

    const descargarCsv = new LambdaFunction(this, `${id}DescargarCsvLambda`, {
      runtime: aws_lambda.Runtime.NODEJS_22_X,
      description:
        "Lambda que genera el archivo csv con los resultados de las encuestas",
      functionName: `${id}DescargarCsv`,
      handler: "index.handler",
      code: aws_lambda.Code.fromAsset(
        path.join(__dirname, commonRootPath, "descargarCsv/"),
      ),
      memorySize: 128,
      timeout: Duration.seconds(10),
      environment: {
        BUCKET_NAME: resultadosEncuestas.bucketName,
        DYNAMO_TABLE_NAME: resultsDB.tableName,
        DYNAMO_TABLE_PK_NAME: this.pkName,
      },
    });

    this.guardarDatosLambdaArn = guardaDatosEncuesta.functionArn;
    this.descargarCsvLambdaArn = descargarCsv.functionArn;
    this.cargarListadoBucketName = cargaListado.bucketName;
    this.cargarListadoBucket = cargaListado;
    this.sqsUrl = campaignSQS.queueUrl;
    this.pkName = props.pkName;
    this.tableName = resultsDB.tableName;

    new CfnOutput(this, `${id}GuardarDatosLambdaArn`, {
      value: this.guardarDatosLambdaArn,
    });
    new CfnOutput(this, `${id}DescargarCsvLambdaArn`, {
      value: this.descargarCsvLambdaArn,
    });
    new CfnOutput(this, `${id}ArchivosResultadosBucketName`, {
      value: resultadosEncuestas.bucketName,
    });
    new CfnOutput(this, `${id}CargarListadoBucketName`, {
      value: this.cargarListadoBucketName,
    });
  }
}
