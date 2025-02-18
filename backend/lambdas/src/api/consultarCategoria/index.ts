import { CustomError } from "../../class/customError.js";

interface consultarCategoriaI {
  AfiliadoNumeroIdentificacion: string;
  AfiliadoTipoIdentificacion: string;
  token: string;
}

interface consultarCategoriaResponseI {
  trb_codigo: string;
  trb_estado: string;
  trb_estado_texto: string;
  trb_identificacion: string;
}

const URL =
  process.env.URL || "https://comfenalcoquindio.online:9090/api/comfenalco/";

export const consultarCategoria = async ({
  AfiliadoNumeroIdentificacion,
  AfiliadoTipoIdentificacion,
  token,
}: consultarCategoriaI) => {
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
      `${URL}consultar_categoria?identificacion=${AfiliadoNumeroIdentificacion}&tipo_identificacion=${AfiliadoTipoIdentificacion}`,
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
    const categoria_trabajador: consultarCategoriaResponseI = await response.json();
    if (!categoria_trabajador) {
      throw new CustomError(
        "No se retorno los datos de estado del trabajador",
        404,
      );
    }
    return categoria_trabajador;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError("Fallo en el servidor de login", 500);
  }
};
