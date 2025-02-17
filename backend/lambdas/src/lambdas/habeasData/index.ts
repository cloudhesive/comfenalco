import type { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { CustomError } from "../../class/customError";
import { errorResponse } from "../../utils/errorResponse";
import { login } from "../../auth/login";
import { registrarHuella } from "../../api/registrarHuella/registrarHuella";

const validarEvento = (event: APIGatewayProxyEvent) => {
  const { id_llamada, identificacion, menu_id, tipo_identificacion, tratamiento_dato_id } = JSON.parse(event.body || "{}");
  if (!id_llamada || !identificacion || !menu_id || !tipo_identificacion || !tratamiento_dato_id) {
    throw new CustomError("Faltan datos", 400);
  }
  return { id_llamada, identificacion, menu_id, tipo_identificacion, tratamiento_dato_id };
};

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  try {
    const { id_llamada, identificacion, menu_id, tipo_identificacion, tratamiento_dato_id } = validarEvento(event);
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
      body: JSON.stringify({ registrarHuella }),
    };
  } catch (error) {
    return errorResponse(error);
  }
};
