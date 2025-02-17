import * as aws_lambda from "aws-cdk-lib/aws-lambda";
import * as path from "node:path";

interface LambdaConfig extends aws_lambda.FunctionProps {
  name: string;
}

export const lambdas: LambdaConfig[] = [
  {
    name: "VerificarContactoFunction",
    description: "Lambda para verificar el contacto",
    runtime: aws_lambda.Runtime.NODEJS_LATEST,
    handler: "lambdas/verificarContacto/index.handler",
    code: aws_lambda.Code.fromAsset(path.join(__dirname, "../../../../backend/build/"), {
      exclude: ["lambdas/habeasData/**"],
    }),
  },
  {
    name: "VerificarContactoFunction",
    description: "Lambda para verificar el contacto",
    runtime: aws_lambda.Runtime.NODEJS_LATEST,
    handler: "lambdas/verificarContacto/index.handler",
    code: aws_lambda.Code.fromAsset(path.join(__dirname, "../../../../backend/build/"), {
      exclude: ["lambdas/habeasData/**"],
    }),
  },
];
