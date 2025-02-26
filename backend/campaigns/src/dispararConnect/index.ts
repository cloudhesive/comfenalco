import type {
  SQSBatchItemFailure,
  SQSBatchResponse,
  SQSEvent,
} from "aws-lambda";
import { getItem } from "./dynamodb";
import { invokeConnect } from "./connect";

const DYNAMO_TABLE_PK_NAME = process.env.CONNECT_ARN_PER_SERVICE ?? "";

const NAME_TABLE_MAPPING = JSON.parse(
  process.env.NAME_TABLE_MAPPING ?? "null",
) ?? {
  phoneNumber: "phoneNumber",
  userName: "userName",
};

export const handler = async (event: SQSEvent): Promise<SQSBatchResponse> => {
  const batchItemFailures: SQSBatchItemFailure[] = [];
  const errorListRecords = [];
  console.info("Records to process: %d", event.Records.length);
  for (let recordIndex = 0; recordIndex < event.Records.length; recordIndex++) {
    const record = event.Records[recordIndex];
    console.info("Processing record ... (%d)", recordIndex + 1);
    try {
      const dataObj: { [key: string]: string } = JSON.parse(record.body);
      const { res: item, err } = await getItem(dataObj[DYNAMO_TABLE_PK_NAME]);
      if (err) {
        console.error(
          "Error processing record (%d), while getting item from dynamodb: %s",
          recordIndex + 1,
          JSON.stringify(err, null, 4),
        );
        batchItemFailures.push({ itemIdentifier: record.messageId });
        errorListRecords.push({
          error: err.error,
          msg: err.msg,
          messageId: record.messageId,
        });
        continue;
      }

      if (item !== null) continue;

      const { err: errConnect } = await invokeConnect(
        dataObj[NAME_TABLE_MAPPING["phoneNumber"]],
        dataObj[NAME_TABLE_MAPPING["userName"]],
      );
      if (errConnect) {
        console.error(
          "Error processing record (%d), while invoking amazon connect: %s",
          recordIndex + 1,
          JSON.stringify(err, null, 4),
        );
        batchItemFailures.push({ itemIdentifier: record.messageId });
        errorListRecords.push({
          error: errConnect.error,
          msg: errConnect.msg,
          messageId: record.messageId,
        });
        continue;
      }
    } catch (error: unknown) {
      batchItemFailures.push({ itemIdentifier: record.messageId });
      if (error instanceof Error) {
        if (error.cause != null) {
          errorListRecords.push({
            error: `Error with ${error.cause}`,
            msg: error.message,
            messageId: record.messageId,
          });
        } else {
          errorListRecords.push({
            error: "Unhandled Error",
            msg: error.message,
            messageId: record.messageId,
          });
        }
      } else {
        errorListRecords.push({
          error: "Unknown Error",
          msg: "Something went wrong",
          messageId: record.messageId,
        });
      }
    }
  }
  if (errorListRecords.length) {
    console.error(
      "Error processing multiple requests (%d): %s",
      errorListRecords.length,
      JSON.stringify(errorListRecords, null, 4),
    );
  }
  return { batchItemFailures };
};
