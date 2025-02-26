import type { ConnectContactFlowEvent } from "aws-lambda";
import { RecordError } from "./errors";
import { putItem } from "./dynamodb";

export const handler = async (event: ConnectContactFlowEvent): Promise<any> => {
  let errorInHandler: RecordError | undefined;
  console.info("Processing event ... (%s)", event.Name);
  console.debug("Event info: %s", JSON.stringify(event, null, 4));
  try {
    // TODO: De donde vienen los resultados de la encuesta
    const item = {};
    console.debug("Item to add %s", JSON.stringify(item, null, 4));
    const { err } = await putItem(item);
    if (err) {
      console.error(
        "Error adding item to dynamodb: %s",
        JSON.stringify(err, null, 4),
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
      "Error processing connect event (%s): %s",
      event.Name,
      JSON.stringify(errorInHandler, null, 4),
    );
  }
};
