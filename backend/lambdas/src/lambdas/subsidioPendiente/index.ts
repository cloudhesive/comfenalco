import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { login } from "../../auth/login";
import { errorResponse } from "../../utils/errorResponse";
import { validarEvento } from "./validarEvento";
import { subsidioPendiente } from "../../api/subsidioPendiente";

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const body = validarEvento(event);
    const { AfiliadoNumeroIdentificacion, AfiliadoTipoIdentificacion } = body;
    const { access_token } = await login();
    const dataTrabajador = await subsidioPendiente({
      AfiliadoNumeroIdentificacion,
      AfiliadoTipoIdentificacion,
      token: access_token,
    });
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataTrabajador),
    };
  } catch (error) {
    return errorResponse(error);
  }
};
