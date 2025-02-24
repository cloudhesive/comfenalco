import { InvalidObjectState, S3 } from "@aws-sdk/client-s3";
import type { S3Event } from "aws-lambda";

const s3Client = new S3({ region: process.env.AWS_REGION });
const csvSeparator = process.env.CSV_SEPARATOR ?? ";";

export const handler = async (event: S3Event): Promise<any> => {
  const errorList = [];
  for (const record of event.Records) {
    try {
      // NOTE: Get file from s3
      const listaUsuariosFile = await s3Client.getObject({
        Bucket: record.s3.bucket.name,
        Key: record.s3.object.key,
      });

      if (listaUsuariosFile.Body === undefined) {
        throw new Error("Error reading body of object, is undefined", {
          cause: "Reading object body",
        });
      }

      const listaUsuarios = (
        await listaUsuariosFile.Body.transformToString()
      ).split("\n");

      const headers = listaUsuarios.shift();
      if (headers === undefined) {
        throw new Error("Error first line of file (headers), file might be empty", {
          cause: "Reading header of file",
        });
      }

      const headersList = headers.trim().split(csvSeparator);
      
    } catch (error: unknown) {
      if (error instanceof InvalidObjectState) {
        errorList.push({ error: error.name, msg: error.message });
      } else if (error instanceof Error) {
        if (error.cause != null) {
          errorList.push({
            error: `Error with ${error.cause}`,
            msg: error.message,
          });
        } else {
          errorList.push({ error: "Unhandled Error", msg: error.message });
        }
      } else {
        errorList.push({ error: "Unknown Error", msg: "Something went wrong" });
      }
    }
  }
};
