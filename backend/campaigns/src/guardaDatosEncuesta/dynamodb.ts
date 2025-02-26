import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoResponse } from "./errors";
import { DynamoDB, DynamoDBServiceException } from "@aws-sdk/client-dynamodb";

const DYNAMO_TABLE_NAME = process.env.CONNECT_ARN_PER_SERVICE;

const dynamodbClient = new DynamoDB({ region: process.env.AWS_REGION });

export const putItem = async (new_values: {
  [key: string]: string;
}): Promise<DynamoResponse> => {
  try {
    const response = await dynamodbClient.send(
      new PutCommand({
        TableName: DYNAMO_TABLE_NAME,
        Item: new_values,
      }),
    );

    if (response.Attributes === undefined) {
      return { res: null };
    }

    const item = [];
    for (const key in response.Attributes) {
      item.push([key, response.Attributes[key].S]);
    }
    console.debug("Item's updated content: %s", JSON.stringify(item, null, 4));
    return { res: Object.fromEntries(item) };
  } catch (error: unknown) {
    if (error instanceof DynamoDBServiceException) {
      return {
        err: {
          error: error.name,
          msg: error.message,
        },
      };
    }
    if (error instanceof Error) {
      if (error.cause != null) {
        return {
          err: {
            error: `Error with ${error.cause}`,
            msg: error.message,
          },
        };
      }
      return {
        err: {
          error: "Unhandled Error",
          msg: error.message,
        },
      };
    }
    return {
      err: {
        error: "Unknown Error",
        msg: "Something went wrong",
      },
    };
  }
};
