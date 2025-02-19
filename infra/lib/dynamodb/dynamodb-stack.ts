import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export class DynamoDBStack extends cdk.Stack {
  public readonly tableName: string; // Propiedad pública para acceder al nombre de la tabla

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Definir la tabla DynamoDB
    const table = new dynamodb.Table(this, "phoneNumberTable", {
      tableName: "phoneNumberTable",
      partitionKey: { name: "phoneNumber", type: dynamodb.AttributeType.STRING }, // Clave primaria corregida
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN, // No borrar la tabla al eliminar el stack
    });

    // **Índice Secundario Global (GSI) basado en 'verified'**
    table.addGlobalSecondaryIndex({
      indexName: "VerifiedIndex",
      partitionKey: { name: "verifiedStatus", type: dynamodb.AttributeType.STRING }, // Convertimos BOOLEAN a STRING
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // Guardar el nombre de la tabla en una variable pública
    this.tableName = table.tableName;

    // Exportar el nombre de la tabla como output para que pueda usarse en las Lambdas
    new cdk.CfnOutput(this, "DynamoDBTableName", {
      value: this.tableName,
      exportName: "DynamoDBTableName", // Nombre para acceder en otros stacks
    });
  }
}
