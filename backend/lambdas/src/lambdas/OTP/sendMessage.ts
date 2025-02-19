import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { CustomError } from "../../class/customError";

export const sendMessage = async (phone: string, message: string) => {
  try {
    const sns = new SNSClient({ region: "us-east-1" });
    const params = {
      Message: `Por favor verifique su número con el siguiente código OTP: ${message}`,
      PhoneNumber: phone,
    };
    const command = new PublishCommand(params);
    const response = await sns.send(command);
    console.log("Message sent successfully", response);
    return response;
  } catch (error) {
    console.error("Error sending message:", error);
    throw new CustomError("Error sending message", 500);
  }
};
