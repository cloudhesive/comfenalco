import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { CustomError } from "../../class/customError";
import { login } from "../../auth/login";
import { verificarContacto } from "../../api/verificarContacto/verificarContacto";
import { errorResponse } from "../../utils/errorResponse";
import { validarEvento } from "./validarEvento";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body = validarEvento(event);
    const { AfiliadoCelular, AfiliadoNumeroIdentificacion, AfiliadoTipoIdentificacion } = body;
    const { access_token } = await login();
    const verificado = await verificarContacto({
      AfiliadoCelular,
      AfiliadoNumeroIdentificacion,
      AfiliadoTipoIdentificacion,
      token: access_token,
    });
    return {
      statusCode: 200,
      body: JSON.stringify({ verificado }),
    };
  } catch (error) {
    return errorResponse(error);
  }
};
