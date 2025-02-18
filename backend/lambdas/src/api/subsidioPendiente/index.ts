import { CustomError } from "../../class/customError.js";

interface subsidioPendienteI {
  AfiliadoNumeroIdentificacion: string;
  AfiliadoTipoIdentificacion: string;
  token: string;
}

interface subsidioPendienteResponseI {
  lugares_de_pago: string[];
  subsidio_pendiente: boolean;
}

const URL =
  process.env.URL || "https://comfenalcoquindio.online:9090/api/comfenalco/";

export const subsidioPendiente = async ({
  AfiliadoNumeroIdentificacion,
  AfiliadoTipoIdentificacion,
  token,
}: subsidioPendienteI) => {
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
      `${URL}subsidio_pendiente?identificacion=${AfiliadoNumeroIdentificacion}&tipo_identificacion=${AfiliadoTipoIdentificacion}`,
      requestOptions,
    );
    if (response.status === 204) {
      throw new CustomError("No existe trabajador con tipo y número", 400);
    }
    if (response.status === 401) {
      throw new CustomError("Error autenticando con el servicio", 500);
    }
    if (response.status === 403) {
      throw new CustomError("Error faltan permisos para la peticion", 500);
    }
    if (response.status === 404) {
      throw new CustomError("No existe trabajador con tipo y número", 400);
    }
    if (response.status === 500) {
      throw new CustomError("Error en el servidor de tercero", 500);
    }
    const subsidio_pendiente: subsidioPendienteResponseI = await response.json();
    if (!subsidio_pendiente) {
      throw new CustomError(
        "No se retorno los datos de estado del trabajador",
        404,
      );
    }
    return subsidio_pendiente;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError("Fallo en el servidor de login", 500);
  }
};
