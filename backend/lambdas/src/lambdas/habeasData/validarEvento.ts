import type { APIGatewayProxyEvent } from "aws-lambda";
import { CustomError } from "../../class/customError";

export const validarEvento = (event: APIGatewayProxyEvent) => {
  const { id_llamada, identificacion, menu_id, tipo_identificacion, tratamiento_dato_id } =
    JSON.parse(event.body || "{}");
  if (!id_llamada || !identificacion || !menu_id || !tipo_identificacion || !tratamiento_dato_id) {
    throw new CustomError("Faltan datos", 400);
  }
  return { id_llamada, identificacion, menu_id, tipo_identificacion, tratamiento_dato_id };
};
