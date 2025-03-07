import { CustomError } from "../../class/customError.js";

interface verificarContactoI {
  AfiliadoCelular: string;
  AfiliadoNumeroIdentificacion: string;
  AfiliadoTipoIdentificacion: string;
  token: string;
}
export const verificarContacto = async ({
  AfiliadoCelular,
  AfiliadoNumeroIdentificacion,
  AfiliadoTipoIdentificacion,
  token,
}: verificarContactoI) => {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    redirect: "follow",
  };
  try {
    const reponse = await fetch(
      `https://comfenalcoquindio.online:9090/api/comfenalco/verificar_contacto?celular=${AfiliadoCelular}&identificacion=${AfiliadoNumeroIdentificacion}&tipo_identificacion=${AfiliadoTipoIdentificacion}`,
      requestOptions
    );
    const verificado: boolean = await reponse.json();
    if (!verificado) {
      throw new CustomError("Contacto no verificado", 404);
    }
    return verificado;
  } catch (error) {
    if (error instanceof CustomError) {
      throw new CustomError(error.message, error.statusCode);
    }
    throw new CustomError("Fallo en el servidor de login", 500);
  }
};
