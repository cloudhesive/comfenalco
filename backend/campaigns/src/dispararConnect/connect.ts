import { Connect, ConnectServiceException } from "@aws-sdk/client-connect";
import { ConnectResponse } from "./errors";
import { getSecret } from "./secrets";

const connectClient = new Connect({ region: process.env.AWS_REGION });

// const INSTANCE_ID = "7b753c00-ae4c-4fd8-94db-aabf34d535ed";

export const invokeConnect = async (
  contactFlowId: string,
  phoneNumber: string,
  userName: string,
): Promise<ConnectResponse> => {
  try {
    const { res: INSTANCE_ID, err } = await getSecret("", "INSTANCE_ID");
    if (err) {
      return { err };
    }
    const response = await connectClient.startOutboundVoiceContact({
      // NOTE: Se mantiene constante segun el flujo
      InstanceId: INSTANCE_ID,
      // NOTE: Cambia segun el flujo
      ContactFlowId: contactFlowId,
      DestinationPhoneNumber: phoneNumber,
      Attributes: {
        nombre_completo: userName,
      },
    });

    if (response.ContactId === undefined) {
      return {
        err: {
          error: "Error invoking amazon connect",
          msg: "No ContactId returned",
        },
      };
    }

    console.debug("ContactId: %s", response.ContactId);
    return { res: response.ContactId };
  } catch (error: unknown) {
    if (error instanceof ConnectServiceException) {
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
