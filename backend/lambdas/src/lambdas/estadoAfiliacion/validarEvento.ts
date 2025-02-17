import type { APIGatewayProxyEvent } from "aws-lambda";
import { CustomError } from "../../class/customError";

export const validarEvento = (event: APIGatewayProxyEvent) => {
  const body = JSON.parse(event.body || "{}");
  if (!body.AfiliadoNumeroIdentificacion || !body.AfiliadoTipoIdentificacion) {
    throw new CustomError("Faltan datos", 400);
  }
  return body;
};
