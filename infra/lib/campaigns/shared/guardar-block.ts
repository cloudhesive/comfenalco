import { Function as LambdaFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { aws_lambda, Duration } from "aws-cdk-lib";
import * as path from "node:path";
import { commonRootPath } from "./common";

type Props = {
  encuestasResultsDB: { tableName: string; pkName: string };
};

export class GuardarLambdaBlock extends Construct {
  public guardarLambdaArn: string;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

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
          DYNAMO_TABLE_NAME: props.encuestasResultsDB.tableName,
          DYNAMO_TABLE_PK_NAME: props.encuestasResultsDB.pkName,
        },
      },
    );
    this.guardarLambdaArn = guardaDatosEncuesta.functionArn;
  }
}
