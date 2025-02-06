import { APIGatewayProxyResult, Context } from "aws-lambda";
import { habeasData } from "./habeasData.js";

interface event {
  body: {
    parametros: string; // ?'AfiliadoNumeroIdentificacion=numero' ? 'BeneficiarioNumeroIdentificacion=numero' s
  };
}

export const handler = async (event: event, context: Context): Promise<APIGatewayProxyResult> => {
  const response = await habeasData(event);
  return {
    statusCode: response.statusCode,
    body: JSON.stringify(response.message),
  };
};
