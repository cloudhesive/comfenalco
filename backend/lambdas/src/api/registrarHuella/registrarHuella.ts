import { CustomError } from "../../class/customError";

interface RegistrarHuellaParams {
  id_llamada: string;
  identificacion: string;
  menu_id: number;
  tipo_identificacion: string;
  tratamiento_dato_id: number;
  token: string;
}

export const registrarHuella = async ({
  id_llamada,
  identificacion,
  menu_id,
  tipo_identificacion,
  tratamiento_dato_id,
  token,
}: RegistrarHuellaParams) => {
  const raw = JSON.stringify({
    id_llamada,
    identificacion,
    menu_id,
    tipo_identificacion,
    tratamiento_dato_id,
  });

  const requestOptions: RequestInit = {
    method: "POST",
    body: raw,
    redirect: "follow",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await fetch(
      "https://comfenalcoquindio.online:9090/api/comfenalco/registrar_huella",
      requestOptions
    );
    if (!response.ok) {
      throw new CustomError("Error al registrar huella", 400);
    }
    return true;
  } catch (error) {
    console.error(error);
    if (error instanceof CustomError) {
      throw new CustomError(error.message, error.statusCode);
    }
    throw new CustomError("Error al registrar huella", 500);
  }
};
