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
        exclude: [
          "lambdas/habeasData/**",
          "lambdas/estadoAfiliacion/**",
          "lambdas/categoriaAfiliacion/**",
          "lambdas/subsidioPendiente/**",
        ],
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
        exclude: [
          "lambdas/verificarContacto/**",
          "lambdas/estadoAfiliacion/**",
          "lambdas/categoriaAfiliacion/**",
          "lambdas/subsidioPendiente/**",
        ],
      },
    ),
  },
  {
    name: "EstadoAfiliacionFunction",
    description: "Lambda para retornar el estado del afiliado",
    runtime: aws_lambda.Runtime.NODEJS_22_X,
    handler: "lambdas/estadoAfiliacion/index.handler",
    code: aws_lambda.Code.fromAsset(
      path.join(__dirname, "../../../../backend/build/"),
      {
        exclude: [
          "lambdas/verificarContacto/**",
          "lambdas/habeasData/**",
          "lambdas/categoriaAfiliacion/**",
          "lambdas/subsidioPendiente/**",
        ],
      },
    ),
  },
  {
    name: "CategoriaAfiliacionFunction",
    description: "Lambda para retornar la categoria del afiliado",
    runtime: aws_lambda.Runtime.NODEJS_22_X,
    handler: "lambdas/categoriaAfiliacion/index.handler",
    code: aws_lambda.Code.fromAsset(
      path.join(__dirname, "../../../../backend/build/"),
      {
        exclude: [
          "lambdas/verificarContacto/**",
          "lambdas/habeasData/**",
          "lambdas/estadoAfiliacion/**",
          "lambdas/subsidioPendiente/**",
        ],
      },
    ),
  },
  {
    name: "SubsidiosPendientesFunction",
    description: "Lambda para retornar la categoria del afiliado",
    runtime: aws_lambda.Runtime.NODEJS_22_X,
    handler: "lambdas/subsidioPendiente/index.handler",
    code: aws_lambda.Code.fromAsset(
      path.join(__dirname, "../../../../backend/build/"),
      {
        exclude: [
          "lambdas/verificarContacto/**",
          "lambdas/habeasData/**",
          "lambdas/estadoAfiliacion/**",
          "lambdas/categoriaAfiliacion/**",
        ],
      },
    ),
  },
];
