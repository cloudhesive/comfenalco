import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { globalEnv } from "../../../utils/globalEnv";
import { CustomError } from "../../../class/customError";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const verifiedMessage = async (phone: string, otp: string) => {
  try {
    const { dynamoDbTable } = globalEnv();
    const command = new GetCommand({
      TableName: dynamoDbTable!,
      Key: {
        phoneNumber: phone,
      },
    });

    const response = await docClient.send(command);
    if (response.Item?.verifiedStatus === "true") {
      throw new CustomError("El número ya ha sido verificado", 400);
    }
    const commandUpdate = new UpdateCommand({
      TableName: dynamoDbTable!,
      Key: { phoneNumber: phone },
      UpdateExpression: "set verifiedStatus = :verifiedStatus",
      ExpressionAttributeValues: { ":verifiedStatus": "true" },
    });
    await docClient.send(commandUpdate);
    return { message: "Número verificado exitosamente" };
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError("Error al verificar el número", 500);
  }
};
