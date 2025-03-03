import type { ConnectContactFlowEvent } from "aws-lambda";
import { RecordError } from "./errors";
import { getAllItemsDb } from "./dynamodb";
import { buildFile } from "./utils";
import { putFile } from "./s3";

export const handler = async (event: ConnectContactFlowEvent): Promise<any> => {
  let errorInHandler: RecordError | undefined;
  console.info("Creating csv report (%s)", new Date().toISOString());
  try {
    const { res: items, err } = await getAllItemsDb();
    if (err) {
      console.error(
        "Error scaning dynamodb table: %s",
        JSON.stringify(err, null, 4),
      );
      return;
    }
    if (items === null) {
      console.warn("No data returned in items object");
      return;
    }

    const filename = "report.csv";
    buildFile(items, filename);

    const { err: errS3 } = await putFile("reporte_s3/reporte.csv", filename);
    if (errS3) {
      console.error(
        "Error with file upload to s3: %s",
        JSON.stringify(errS3, null, 4),
      );
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.cause != null) {
        errorInHandler = {
          error: `Error with ${error.cause}`,
          msg: error.message,
        };
      } else {
        errorInHandler = {
          error: "Unhandled Error",
          msg: error.message,
        };
      }
    } else {
      errorInHandler = {
        error: "Unknown Error",
        msg: "Something went wrong",
      };
    }
  }
  if (errorInHandler !== undefined) {
    console.error(
      "Error processing download event (%s): %s",
      event.Name,
      JSON.stringify(errorInHandler, null, 4),
    );
  }
};
