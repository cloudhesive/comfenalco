import {
  SecretsManagerServiceException,
  SecretsManager,
} from "@aws-sdk/client-secrets-manager";

const secrectsClient = new SecretsManager({ region: process.env.AWS_REGION });

const getJsonPath = (obj: any, path: string) => {
  const result = path.split(".").reduce((o, k) => o && o[k], obj);
  if (result === undefined) {
    return null;
  }
  return result;
};

export const getSecret = async (secretName: string, path: string) => {
  console.debug("Obteniendo secreto: %s", secretName);

  try {
    const response = await secrectsClient.getSecretValue({
      SecretId: secretName,
      VersionStage: "AWSCURRENT",
    });

    console.debug(
      "Response from secrets manager object: %s",
      JSON.stringify(response, null, 4),
    );

    if (response.SecretString === undefined) {
      return { res: null };
    }

    const paramsObj = JSON.parse(response.SecretString);

    return { res: getJsonPath(paramsObj, path) };
  } catch (error) {
    {
      if (error instanceof SecretsManagerServiceException) {
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
            stack: error.stack,
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
  }
};
