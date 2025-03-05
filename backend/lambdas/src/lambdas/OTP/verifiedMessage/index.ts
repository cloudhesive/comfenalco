import { APIGatewayProxyEvent } from "aws-lambda";
import { verifiedMessage } from "./verifiedMessage";
import { errorResponse } from "../../../utils/errorResponse";

const validateEvent = (event: APIGatewayProxyEvent) => {
  const { phone, otp } = JSON.parse(event.body || "{}");
  if (!phone || !otp) {
    return { statusCode: 400, body: JSON.stringify({ message: "Phone and otp are required" }) };
  }
  return { phone, otp };
};

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    console.log("Evento recibido:", event);
    const { phone, otp } = validateEvent(event);
    const response = await verifiedMessage(phone, otp);
    console.log("Respuesta:", response);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Mensaje verificado exitosamente" }),
    };
  } catch (error) {
    return errorResponse(error);
  }
};
