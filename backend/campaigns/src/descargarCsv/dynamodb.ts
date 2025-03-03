import { DynamoResponse } from "./errors";
import { DynamoDB, DynamoDBServiceException } from "@aws-sdk/client-dynamodb";

const DYNAMO_TABLE_NAME = process.env.CONNECT_ARN_PER_SERVICE;

const dynamodbClient = new DynamoDB({ region: process.env.AWS_REGION });

export const getAllItemsDb = async (): Promise<DynamoResponse> => {
  try {
    const response = await dynamodbClient.scan({
      TableName: DYNAMO_TABLE_NAME,
    });

    if (response.Items === undefined) {
      return { res: null };
    }

    const items = response.Items.map((oldItem) => {
      const item: [string, string][] = [];
      for (const key in oldItem) {
        item.push([key, oldItem[key].S || ""]);
      }
      return Object.fromEntries(item);
    });
    console.debug("Found items: %s", JSON.stringify(items, null, 4));
    return { res: items };
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
