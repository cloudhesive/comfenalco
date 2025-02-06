import { getInfo } from "../api/getInfo/getinfo.js";
import { verificarContacto } from "../api/verificarContacto/verificarContacto.js";
import { login } from "../auth/login.js";
import { CustomError } from "../class/customError.js";

interface habeasDataI {
  body: {
    parametros?: string;
  };
}

export const habeasData = async ({ body }: habeasDataI) => {
  try {
    const { parametros } = body;
    if (!parametros) {
      throw new CustomError("Falta los parametros", 400);
    }
    const { access_token } = await login();
    const infoObtenida = await getInfo({ parametros, token: access_token });
    const { AfiliadoCelular, AfiliadoNumeroIdentificacion, AfiliadoTipoIdentificacion } = infoObtenida.body;
    await verificarContacto({ AfiliadoCelular, AfiliadoNumeroIdentificacion, AfiliadoTipoIdentificacion, token: access_token });
    return {
      ok: true,
      statusCode: 200,
      message: "Mensaje Enviado Correctamente",
    };
  } catch (error) {
    if (error instanceof CustomError) {
      console.error(`Error ${error.statusCode}: ${error.message}`);
      return {
        ok: false,
        statusCode: error.statusCode,
        message: error.message,
      };
    } else {
      console.error("Error desconocido", error);
      return {
        ok: false,
        statusCode: 500,
        message: "Error inesperado",
      };
    }
  }
};
