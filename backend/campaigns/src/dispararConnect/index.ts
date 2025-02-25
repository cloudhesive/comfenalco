import type { SQSEvent } from "aws-lambda";

export const handler = async (event: SQSEvent): Promise<any> => {
  const errorListRecords = [];
  console.log("Records to process: %d", event.Records.length);
  for (let recordIndex = 0; recordIndex < event.Records.length; recordIndex++) {
    const record = event.Records[recordIndex];
    console.log("Processing record ... (%d)", recordIndex + 1);
    try {
      const dataObj: { [key: string]: string } = JSON.parse(record.body);
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
