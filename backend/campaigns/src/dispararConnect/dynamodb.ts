import { DynamoResponse } from "./errors";
import { DynamoDB, DynamoDBServiceException } from "@aws-sdk/client-dynamodb";

const DYNAMO_TABLE_NAME = process.env.CONNECT_ARN_PER_SERVICE;
const DYNAMO_TABLE_PK_NAME = process.env.CONNECT_ARN_PER_SERVICE ?? "";

const dynamodbClient = new DynamoDB({ region: process.env.AWS_REGION });

export const getItem = async (value: string): Promise<DynamoResponse> => {
  try {
    const response = await dynamodbClient.getItem({
      TableName: DYNAMO_TABLE_NAME,
      Key: {
        [DYNAMO_TABLE_PK_NAME]: {
          S: value,
        },
      },
    });

    if (response.Item === undefined) {
      return { res: null };
    }

    const item = [];
    for (const key in response.Item) {
      item.push([key, response.Item[key]]);
    }
    console.debug("Item's content: %s", JSON.stringify(item, null, 4));
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
