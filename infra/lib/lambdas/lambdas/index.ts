import * as aws_lambda from "aws-cdk-lib/aws-lambda";
import * as path from "node:path";
import { DynamoDBStack } from "../../dynamodb/dynamodb-stack";

interface LambdaConfig extends aws_lambda.FunctionProps {
  name: string;
  resources?: string[];
  actions?: string[];
}
interface LambdaConfigProps {
  dynamoDBTableName: string;
}

export const lambdas = ({ dynamoDBTableName }: LambdaConfigProps): LambdaConfig[] => [
  {
    name: "VerificarContactoFunction",
    description: "Lambda para verificar el contacto",
    runtime: aws_lambda.Runtime.NODEJS_22_X,
    handler: "lambdas/verificarContacto/index.handler",
    code: aws_lambda.Code.fromAsset(path.join(__dirname, "../../../../backend/build/"), {
      exclude: [
        "lambdas/habeasData/**",
        "lambdas/estadoAfiliacion/**",
        "lambdas/categoriaAfiliacion/**",
        "lambdas/subsidioPendiente/**",
        "lambdas/OTP/**",
      ],
    }),
  },
  {
    name: "HabeasDataFunction",
    description: "Lambda para Registro de llamadas",
    runtime: aws_lambda.Runtime.NODEJS_22_X,
    handler: "lambdas/habeasData/index.handler",
    code: aws_lambda.Code.fromAsset(path.join(__dirname, "../../../../backend/build/"), {
      exclude: [
        "lambdas/verificarContacto/**",
        "lambdas/estadoAfiliacion/**",
        "lambdas/categoriaAfiliacion/**",
        "lambdas/subsidioPendiente/**",
        "lambdas/OTP/**",
      ],
    }),
  },
  {
    name: "EstadoAfiliacionFunction",
    description: "Lambda para retornar el estado del afiliado",
    runtime: aws_lambda.Runtime.NODEJS_22_X,
    handler: "lambdas/estadoAfiliacion/index.handler",
    code: aws_lambda.Code.fromAsset(path.join(__dirname, "../../../../backend/build/"), {
      exclude: [
        "lambdas/verificarContacto/**",
        "lambdas/habeasData/**",
        "lambdas/categoriaAfiliacion/**",
        "lambdas/subsidioPendiente/**",
        "lambdas/OTP/**",
      ],
    }),
  },
  {
    name: "CategoriaAfiliacionFunction",
    description: "Lambda para retornar la categoria del afiliado",
    runtime: aws_lambda.Runtime.NODEJS_22_X,
    handler: "lambdas/categoriaAfiliacion/index.handler",
    code: aws_lambda.Code.fromAsset(path.join(__dirname, "../../../../backend/build/"), {
      exclude: [
        "lambdas/verificarContacto/**",
        "lambdas/habeasData/**",
        "lambdas/estadoAfiliacion/**",
        "lambdas/subsidioPendiente/**",
        "lambdas/OTP/**",
      ],
    }),
  },
  {
    name: "SubsidiosPendientesFunction",
    description: "Lambda para retornar la categoria del afiliado",
    runtime: aws_lambda.Runtime.NODEJS_22_X,
    handler: "lambdas/subsidioPendiente/index.handler",
    code: aws_lambda.Code.fromAsset(path.join(__dirname, "../../../../backend/build/"), {
      exclude: [
        "lambdas/verificarContacto/**",
        "lambdas/habeasData/**",
        "lambdas/estadoAfiliacion/**",
        "lambdas/categoriaAfiliacion/**",
        "lambdas/OTP/**",
      ],
    }),
  },
  {
    name: "OTPFunction",
    description: "Lambda para envio de OTP",
    runtime: aws_lambda.Runtime.NODEJS_22_X,
    handler: "lambdas/OTP/index.handler",
    code: aws_lambda.Code.fromAsset(path.join(__dirname, "../../../../backend/build/"), {
      exclude: [
        "lambdas/verificarContacto/**",
        "lambdas/habeasData/**",
        "lambdas/estadoAfiliacion/**",
        "lambdas/categoriaAfiliacion/**",
        "lambdas/subsidioPendiente/**",
      ],
    }),
    resources: ["*"],
    actions: ["dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:UpdateItem", "sns:Publish"],
    environment: {
      DYNAMO_DB_TABLE: dynamoDBTableName,
    },
  },
];
