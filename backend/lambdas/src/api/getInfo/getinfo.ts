import { CustomError } from "../../class/customError.js";

interface getInfoRequest {
  parametros: string;
  token: string;
}
export interface Afiliado {
  AfiliadoApellido1: string;
  AfiliadoApellido2: string;
  AfiliadoCategoria: string;
  AfiliadoCelular: string;
  AfiliadoEmail: string;
  AfiliadoFechaNacimiento: string;
  AfiliadoMunicipioResidencia: string;
  AfiliadoNombre1: string;
  AfiliadoNombre2: string;
  AfiliadoNumeroIdentificacion: string;
  AfiliadoSexo: string;
  AfiliadoTelefono: string;
  AfiliadoTipoIdentificacion: string;
  BeneficiarioApellido1: string;
  BeneficiarioApellido2: string;
  Beneficiariocategoria: string;
  BeneficiarioNombre1: string;
  BeneficiarioNombre2: string;
  BeneficiarioNumeroIdentificacion: string;
  BeneficiarioSexo: string;
  BeneficiarioTipoIdentificacion: string;
  EmpresaNumeroId: string;
  EmpresaTipoId: string;
}

export const getInfo = async ({ parametros, token }: getInfoRequest) => {
  const URL = process.env.URL || "example.api/";
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
      `${URL}?consulta=Afiliados&parametros=${parametros}`,
      requestOptions
    );
    const data: Afiliado[] = await reponse.json();

    const { AfiliadoCelular, AfiliadoNumeroIdentificacion, AfiliadoTipoIdentificacion } = data[0];

    if (!AfiliadoCelular || !AfiliadoNumeroIdentificacion || !AfiliadoTipoIdentificacion) {
      throw new CustomError("Afiliado no existe ", 404);
    }
    return {
      ok: true,
      statusCode: 200,
      body: {
        AfiliadoCelular,
        AfiliadoNumeroIdentificacion,
        AfiliadoTipoIdentificacion,
      },
    };
  } catch (error) {
    console.log(error);
    if (error instanceof CustomError) {
      throw new CustomError(error.message, error.statusCode);
    }
    throw new CustomError("Fallo en el servidor de login", 500);
  }
};
