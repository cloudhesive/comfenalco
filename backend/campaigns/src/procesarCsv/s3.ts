import { S3, InvalidObjectState } from "@aws-sdk/client-s3";
import { S3Response } from "./errors";

const s3Client = new S3({ region: process.env.AWS_REGION });

export const getFile = async (
  bucket: string,
  key: string,
): Promise<S3Response> => {
  try {
    const listaUsuariosFile = await s3Client.getObject({
      Bucket: bucket,
      Key: key,
    });

    if (listaUsuariosFile.Body === undefined) {
      throw new Error("Error reading body of object, is undefined", {
        cause: "Reading object body",
      });
    }

    const fileString = await listaUsuariosFile.Body.transformToString();
    console.debug("Contenido del archivo: %s", fileString);
    return { res: fileString };
  } catch (error: unknown) {
    if (error instanceof InvalidObjectState) {
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
