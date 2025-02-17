import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { login } from "../../auth/login";
import { trabajadorEstado } from "../../api/trabajadorEstado";
import { errorResponse } from "../../utils/errorResponse";
import { validarEvento } from "./validarEvento";

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const body = validarEvento(event);
    const { AfiliadoNumeroIdentificacion, AfiliadoTipoIdentificacion } = body;
    const { access_token } = await login();
    const { status, data } = await trabajadorEstado({
      AfiliadoNumeroIdentificacion,
      AfiliadoTipoIdentificacion,
      token: access_token,
    });
    return {
      statusCode: status,
      body: JSON.stringify({ data }),
    };
  } catch (error) {
    return errorResponse(error);
  }
};
