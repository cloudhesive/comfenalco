import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";

// Función reutilizable para agregar Policies a una Lambda
export function addPolicyToLambda(
  lambdaFunction: lambda.Function,
  actions: string[],
  resources: string[]
) {
  const policyStatement = new iam.PolicyStatement({
    actions,
    resources,
  });

  // Agregar la Policy al Role de la Lambda
  lambdaFunction.role?.addToPrincipalPolicy(policyStatement);
}
