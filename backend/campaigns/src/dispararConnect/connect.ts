import { Connect, ConnectServiceException } from "@aws-sdk/client-connect";
import { ConnectResponse } from "./errors";

const connectClient = new Connect({ region: process.env.AWS_REGION });

const CONNECT_ARN_PER_SERVICE = JSON.parse(
  process.env.CONNECT_ARN_PER_SERVICE ?? "{}",
);

export const invokeConnect = async (
  phoneNumber: string,
  userName: string,
): Promise<ConnectResponse> => {
  try {
    const response = await connectClient.startOutboundVoiceContact({
      InstanceId: "",
      ContactFlowId: "",
      QueueId: "",
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
