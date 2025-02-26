import { SQSServiceException, SQS } from "@aws-sdk/client-sqs";
import { SqsResponse } from "./errors";

const sqsClient = new SQS({ region: process.env.AWS_REGION });
const SQS_URL = process.env.SQS_URL;

export const sendToQueue = async (msg: string): Promise<SqsResponse> => {
  try {
    if (SQS_URL === undefined) {
      throw new Error("The url of the queue is undefined", { cause: "SQS" });
    }

    const response = await sqsClient.sendMessage({
      QueueUrl: SQS_URL,
      MessageBody: msg,
    });

    if (response.MessageId === undefined) {
      throw new Error("The response comes with msg id undefined", {
        cause: "SQS",
      });
    }

    return { res: response.MessageId };
  } catch (error: unknown) {
    if (error instanceof SQSServiceException) {
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
