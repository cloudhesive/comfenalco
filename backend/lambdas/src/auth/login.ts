import { CustomError } from "../class/customError.js";

interface loginResponseSuccess {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  "not-before-policy": number;
  session_state: string;
  scope: string;
}
interface loginResponseFailed {
  error: string;
  error_description: string;
}

export const login = async () => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("client_id", "api_comfenalco");
  urlencoded.append("username", "amazon-test");
  urlencoded.append("password", "Bxvw97StWs");
  urlencoded.append("grant_type", "password");
  urlencoded.append("client_secret", "aDSisgYBUhQTnwynF5nvaivPy2LXtAgn");
  urlencoded.append("", "");

  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow",
  };
  try {
    const response = await fetch(
      "https://comfenalcoquindio.online:8181/api/oauth2_pruebas/ext/login",
      requestOptions
    );
    const autenticado: loginResponseSuccess | loginResponseFailed = await response.json();
    if ("error" in autenticado) {
      throw new CustomError("Fallo en la autentificacion", 401);
    }
    return autenticado;
  } catch (error) {
    if (error instanceof CustomError) {
      throw new CustomError(error.message, error.statusCode);
    }
    throw new CustomError("Fallo en el servidor de login", 500);
  }
};
