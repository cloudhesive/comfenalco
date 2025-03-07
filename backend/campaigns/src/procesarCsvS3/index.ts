import type { S3Event } from "aws-lambda";
import { getFile } from "./s3";
import { sendToQueue } from "./sqs";
import { parseCsv } from "./utils";
import { LineError } from "./errors";

export const handler = async (event: S3Event): Promise<any> => {
  const errorListRecords = [];
  console.info("Records to process: %d", event.Records.length);
  for (let recordIndex = 0; recordIndex < event.Records.length; recordIndex++) {
    const record = event.Records[recordIndex];
    console.info("Processing record ... (%d)", recordIndex + 1);
    try {
      const { res: fileString, err: fileError } = await getFile(
        record.s3.bucket.name,
        record.s3.object.key,
      );
      if (fileError) {
        console.error(
          "Error obteniendo el archivo de S3 [%s]: %s",
          fileError.error,
          fileError.msg,
        );
        continue;
      }
      const errorListSending: LineError[] = [];
      await parseCsv(
        fileString,
        async () => {},
        async (lineObj, idx) => {
          const { err } = await sendToQueue(JSON.stringify(lineObj));
          if (err !== undefined) {
            errorListSending.push({ ...err, line: idx + 1 });
          } else {
            console.info("Objeto (%d) enviado a la cola", idx);
          }
        },
      );

      if (errorListSending.length) {
        console.error(
          "Error enviando a la cola (count: %d): %s",
          errorListSending.length,
          JSON.stringify(errorListSending, null, 4),
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.cause != null) {
          errorListRecords.push({
            error: `Error with ${error.cause}`,
            msg: error.message,
          });
        } else {
          errorListRecords.push({
            error: "Unhandled Error",
            msg: error.message,
          });
        }
      } else {
        errorListRecords.push({
          error: "Unknown Error",
          msg: "Something went wrong",
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
};
