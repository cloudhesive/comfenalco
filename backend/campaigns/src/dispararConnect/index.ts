import type {
  SQSBatchItemFailure,
  SQSBatchResponse,
  SQSEvent,
} from "aws-lambda";
import { getItem } from "./dynamodb";
import { invokeConnect } from "./connect";

const DYNAMO_TABLE_PK_NAME = process.env.DYNAMO_TABLE_PK_NAME ?? "";

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
      console.debug("Mensaje recibido %s", JSON.stringify(dataObj, null, 4));
      if (!Object.keys(dataObj).includes(DYNAMO_TABLE_PK_NAME)) {
        console.error(
          "Key [%s], not present in obj: (%s)",
          DYNAMO_TABLE_PK_NAME,
          JSON.stringify(dataObj, null, 4),
        );
        continue;
      }
      const { res: item, err } = await getItem(dataObj[DYNAMO_TABLE_PK_NAME]);
      if (err) {
        console.error(
          "Error processing record (%d), while getting item from dynamodb:\nName: %s\nDescription: %s\nStack: %s",
          recordIndex + 1,
          err.error,
          err.msg,
          err.stack ?? "Empty",
        );
        batchItemFailures.push({ itemIdentifier: record.messageId });
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
      "Error processing multiple requests (Not handled) (%d): %s",
      errorListRecords.length,
      JSON.stringify(errorListRecords, null, 4),
    );
  }
  return { batchItemFailures };
};
