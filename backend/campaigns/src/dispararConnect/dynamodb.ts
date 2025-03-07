import { DynamoResponse } from "./errors";
import { DynamoDB, DynamoDBServiceException } from "@aws-sdk/client-dynamodb";

const DYNAMO_TABLE_NAME = process.env.DYNAMO_TABLE_NAME;
const DYNAMO_TABLE_PK_NAME = process.env.DYNAMO_TABLE_PK_NAME ?? "";

const dynamodbClient = new DynamoDB({ region: process.env.AWS_REGION });

export const getItem = async (key: string): Promise<DynamoResponse> => {
  try {
    console.debug(
      "Quering to table [%s], and key [%s]",
      DYNAMO_TABLE_NAME,
      DYNAMO_TABLE_PK_NAME,
    );
    const commandInput = {
      TableName: DYNAMO_TABLE_NAME,
      Key: {
        [DYNAMO_TABLE_PK_NAME]: {
          S: key,
        },
      },
    };
    console.debug(
      "Object sent to get item command: %s",
      JSON.stringify(commandInput, null, 4),
    );
    const response = await dynamodbClient.getItem(commandInput);

    console.debug(
      "Response from dynamo object: %s",
      JSON.stringify(response, null, 4),
    );
    if (response.Item === undefined) {
      return { res: null };
    }

    const item = [];
    for (const key in response.Item) {
      item.push([key, response.Item[key].S]);
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
          stack: error.stack,
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
