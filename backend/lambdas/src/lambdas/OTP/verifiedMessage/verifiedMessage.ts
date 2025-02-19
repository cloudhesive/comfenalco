import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { globalEnv } from "../../../utils/globalEnv";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const verifiedMessage = async (phone: string, otp: string) => {
  const { dynamoDbTable } = globalEnv();
  const command = new GetCommand({
    TableName: dynamoDbTable!,
    Key: {
      phoneNumber: phone,
    },
  });

  const response = await docClient.send(command);
  console.log(response);
  return response;
};
