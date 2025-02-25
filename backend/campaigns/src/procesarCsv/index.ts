import type { S3Event } from "aws-lambda";
import { getFile } from "./s3";
import { sendToQueue } from "./sqs";

const csvSeparator = process.env.CSV_SEPARATOR ?? ";";

export const handler = async (event: S3Event): Promise<any> => {
  const errorListRecords = [];
  console.log("Records to process: %d", event.Records.length);
  for (let recordIndex = 0; recordIndex < event.Records.length; recordIndex++) {
    const record = event.Records[recordIndex];
    console.log("Processing record ... (%d)", recordIndex + 1);
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
      const listaUsuarios = fileString.split("\n");

      const headers = listaUsuarios.shift();
      if (headers === undefined) {
        throw new Error(
          "Error first line of file (headers), file might be empty",
          {
            cause: "Reading header of file",
          },
        );
      }

      const headersList = headers.trim().split(csvSeparator);

      const errorListSending = [];
      console.log(
        "Usuarios encontrados en el archivo: %d",
        event.Records.length,
      );
      for (let idx = 0; idx < listaUsuarios.length; idx++) {
        console.log("Enviando a la cola ... (%d)", idx + 1);
        const line = listaUsuarios[idx];
        const lineObj = Object.fromEntries(
          line
            .trim()
            .split(csvSeparator)
            .map((item, indx) => [
              headersList.at(indx) ?? `Header ${indx}`,
              item.trim(),
            ]),
        );
        console.debug("Objeto recibido: %s", JSON.stringify(lineObj, null, 4));
        // NOTE: Check format
        // NOTE: End: Check format
        const { err } = await sendToQueue(JSON.stringify(lineObj));
        if (err !== undefined) {
          errorListSending.push({ ...err, line: idx + 1 });
        }
      }

      if (errorListSending.length) {
        console.error(
          "Error enviando a la cola (%d): %s",
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
