import * as aws_lambda from "aws-cdk-lib/aws-lambda";
import * as path from "node:path";

interface LambdaConfig extends aws_lambda.FunctionProps {
  name: string;
}

export const lambdas: LambdaConfig[] = [
  {
    name: "VerificarContactoFunction",
    description: "Lambda para verificar el contacto",
    runtime: aws_lambda.Runtime.NODEJS_22_X,
    handler: "lambdas/verificarContacto/index.handler",
    code: aws_lambda.Code.fromAsset(
      path.join(__dirname, "../../../../backend/build/"),
      {
        exclude: ["lambdas/habeasData/**"],
      },
    ),
  },
  {
    name: "HabeasDataFunction",
    description: "Lambda para Registro de llamadas",
    runtime: aws_lambda.Runtime.NODEJS_22_X,
    handler: "lambdas/habeasData/index.handler",
    code: aws_lambda.Code.fromAsset(
      path.join(__dirname, "../../../../backend/build/"),
      {
        exclude: ["lambdas/verificarContacto/**"],
      },
    ),
  },
  {
    name: "EstadoAfiliacioFunction",
    description: "Lambda para retornar el estado del afiliado",
    runtime: aws_lambda.Runtime.NODEJS_22_X,
    handler: "lambdas/estadoAfiliacion/index.handler",
    code: aws_lambda.Code.fromAsset(
      path.join(__dirname, "../../../../backend/build/"),
      {
        exclude: ["lambdas/verificarContacto/**", "lambdas/habeasData/**"],
      },
    ),
  },
];
