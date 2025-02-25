import { Function as LambdaFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { aws_lambda, Duration } from "aws-cdk-lib";
import * as path from "node:path";
import { commonRootPath, toDashCase } from "./common";
import { AttributeType, TableV2 } from "aws-cdk-lib/aws-dynamodb";
import { Bucket } from "aws-cdk-lib/aws-s3";

type Props = {
  pkName: string;
};

export class GuardarDescargaDatosBlock extends Construct {
  public guardarDatosLambdaArn: string;
  public pkName: string;
  public tableName: string;
  public descargarCsvLambdaArn: string;
  public archivosResultadosBucketName: string;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    const resultsDB = new TableV2(this, `${id}ResultadosEncuestaDynamodb`, {
      partitionKey: { name: this.pkName, type: AttributeType.STRING },
      tableName: `${id}ResultadosEncuesta`,
    });

    const guardaDatosEncuesta = new LambdaFunction(
      this,
      `${id}GuardarDatosEncuestaLambda`,
      {
        runtime: aws_lambda.Runtime.NODEJS_22_X,
        description: "Lambda que guarda los datos de la encuesta en dynamo",
        functionName: `${id}GuardarDatosEncuesta`,
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
    this.archivosResultadosBucketName = resultadosEncuestas.bucketArn;
    this.pkName = props.pkName;
    this.tableName = resultsDB.tableName;
  }
}
