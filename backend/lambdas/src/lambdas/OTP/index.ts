import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { errorResponse } from "../../utils/errorResponse";
import { createOtpItem } from "./createIdbtem";
import { sendMessage } from "./sendMessage";

const validateEvent = (event: APIGatewayProxyEvent) => {
  const { phone } = JSON.parse(event.body || "{}");
  if (!phone) {
    return { statusCode: 400, body: JSON.stringify({ message: "Phone and message are required" }) };
  }
  return { phone };
};

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    const { phone } = validateEvent(event);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await createOtpItem(phone, otp);
    await sendMessage(phone, otp);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Message sent successfully" }),
    };
  } catch (error) {
    return errorResponse(error);
  }
};
