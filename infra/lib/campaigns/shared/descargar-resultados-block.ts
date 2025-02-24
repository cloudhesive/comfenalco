import { Bucket } from "aws-cdk-lib/aws-s3";
import { Function as LambdaFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { aws_lambda, Duration } from "aws-cdk-lib";
import * as path from "node:path";
import { commonRootPath } from "./common";

type Props = {};

export class DescargarResultadosBlock extends Construct {
  public descargarCsvLambdaArn: string;
  public archivosResultadosBucketName: string;

  constructor(scope: Construct, id: string, props?: Props) {
    super(scope, id);

    const resultadosEncuestas = new Bucket(
      this,
      `${id}resultadosEncuestasBucket`,
      {
        bucketName: `${id}-resultados-encuestas-campaign`,
      },
    );

    const descargarCsv = new LambdaFunction(this, `${id}DescargarCsvLambda`, {
      runtime: aws_lambda.Runtime.NODEJS_22_X,
      description:
        "Lambda que procesa el listado de campañas y las encola para ser ejecutadas las encuestas",
      functionName: `${id}DescargarCsv`,
      handler: "index.handler",
      code: aws_lambda.Code.fromAsset(
        path.join(__dirname, commonRootPath, "descargarCsv/"),
      ),
      memorySize: 128,
      timeout: Duration.seconds(10),
      environment: {
        BUCKET_NAME: resultadosEncuestas.bucketName,
      },
    });

    this.descargarCsvLambdaArn = descargarCsv.functionArn;
    this.archivosResultadosBucketName = resultadosEncuestas.bucketArn;
  }
}
