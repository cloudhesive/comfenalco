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
  //VerificarContactoFunction
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
  //HabeasDataFunction
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
  //EstadoAfiliacionFunction
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
  //CategoriaAfiliacionFunction
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
  //SubsidiosPendientesFunction
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
  //OTPFunction
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
        "lambdas/OTP/verifiedMessage/**",
      ],
    }),
    resources: ["*"],
    actions: ["dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:UpdateItem", "sns:Publish"],
    environment: {
      DYNAMO_DB_TABLE: dynamoDBTableName,
    },
  },
  //VerifiedOTPFunction
  {
    name: "VerifiedOTPFunction",
    description: "Lambda para verificar el OTP",
    runtime: aws_lambda.Runtime.NODEJS_22_X,
    handler: "lambdas/OTP/verifiedMessage/index.handler",
    code: aws_lambda.Code.fromAsset(path.join(__dirname, "../../../../backend/build/"), {
      exclude: [
        "lambdas/verificarContacto/**",
        "lambdas/habeasData/**",
        "lambdas/estadoAfiliacion/**",
        "lambdas/categoriaAfiliacion/**",
        "lambdas/subsidioPendiente/**",
        "lambdas/OTP/sendMessage/**",
      ],
    }),
    resources: ["*"],
    actions: ["dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:UpdateItem", "sns:Publish"],
    environment: {
      DYNAMO_DB_TABLE: dynamoDBTableName,
    },
  },
];
