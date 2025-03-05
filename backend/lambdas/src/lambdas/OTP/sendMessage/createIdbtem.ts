import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { CustomError } from "../../../class/customError";
import { globalEnv } from "../../../utils/globalEnv";

interface OtpItem {
  phoneNumber: string;
  otp: string;
  verifiedStatus: "true" | "false"; // Ahora es STRING ("true" / "false")
}

export const createOtpItem = async (phoneNumber: string, otp: string): Promise<void> => {
  try {
    const client = new DynamoDBClient({});
    const docClient = DynamoDBDocumentClient.from(client);
    const { dynamoDbTable } = globalEnv();

    // Verificar si el número ya está verificado
    const existingItem = await docClient.send(
      new GetCommand({
        TableName: dynamoDbTable,
        Key: { phoneNumber },
      })
    );

    if (existingItem.Item?.verifiedStatus === "true") {
      throw new CustomError("Este número ya ha sido verificado", 400);
    }

    // Crear nuevo OTP y sobrescribir si no ha sido verificado
    const item: OtpItem = {
      phoneNumber,
      otp,
      verifiedStatus: "false", // Siempre inicia como "false"
    };

    await docClient.send(
      new PutCommand({
        TableName: dynamoDbTable,
        Item: item,
      })
    );
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError("Error al crear el item", 500);
  }
};
