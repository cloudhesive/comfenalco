import { CustomError } from "../../class/customError.js";

interface trabajadorEstadoI {
  AfiliadoNumeroIdentificacion: string;
  AfiliadoTipoIdentificacion: string;
  token: string;
}

interface trabajadorEstadoResponseI {
  trb_codigo: string;
  trb_estado: string;
  trb_estado_texto: string;
  trb_identificacion: string;
}

export const trabajadorEstado = async ({
  AfiliadoNumeroIdentificacion,
  AfiliadoTipoIdentificacion,
  token,
}: trabajadorEstadoI) => {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    redirect: "follow",
  };
  try {
    const response = await fetch(
      `https://comfenalcoquindio.online:9090/api/comfenalco/trabajador_estado?identificacion=${AfiliadoNumeroIdentificacion}&tipo_identificacion=${AfiliadoTipoIdentificacion}`,
      requestOptions,
    );
    const estado_trabajador: trabajadorEstadoResponseI = await response.json();
    if (!estado_trabajador) {
      throw new CustomError(
        "No se retorno los datos de estado del trabajador",
        404,
      );
    }
    return { status: response.status, data: estado_trabajador };
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError("Fallo en el servidor de login", 500);
  }
};
