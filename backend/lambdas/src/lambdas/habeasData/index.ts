import type { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { CustomError } from "../../class/customError";
import { errorResponse } from "../../utils/errorResponse";
import { login } from "../../auth/login";
import { registrarHuella } from "../../api/registrarHuella/registrarHuella";

const validarEvento = (event: APIGatewayProxyEvent) => {
  const data = JSON.parse(event.body || "{}");

  const requiredFields = [
    "id_llamada",
    "identificacion",
    "menu_id",
    "tipo_identificacion",
    "tratamiento_dato_id",
  ];

  if (requiredFields.some((field) => data[field] === undefined || data[field] === null)) {
    throw new CustomError("Faltan datos", 400);
  }

  return data;
};

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    const { id_llamada, identificacion, menu_id, tipo_identificacion, tratamiento_dato_id } =
      validarEvento(event);
    const { access_token } = await login();
    const registroHuella = await registrarHuella({
      id_llamada,
      identificacion,
      menu_id,
      tipo_identificacion,
      tratamiento_dato_id,
      token: access_token,
    });
    return {
      statusCode: 200,
      body: JSON.stringify({ registroHuella }),
    };
  } catch (error) {
    console.error(error);
    return errorResponse(error);
  }
};
