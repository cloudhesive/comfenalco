import { S3Response } from "./errors";
import { S3, S3ServiceException } from "@aws-sdk/client-s3";

const BUCKET_NAME = process.env.BUCKET_NAME;

const s3Client = new S3({ region: process.env.AWS_REGION });

export const putFile = async (
  filename_s3: string,
  filename: string,
): Promise<S3Response> => {
  try {
    const response = await s3Client.putObject({
      Bucket: BUCKET_NAME,
      Key: filename_s3,
      Body: filename,
    });

    if (response.VersionId === undefined) {
      return { res: null };
    }

    console.debug("File's version: %s", response.VersionId);
    return { res: response.VersionId };
  } catch (error: unknown) {
    if (error instanceof S3ServiceException) {
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
