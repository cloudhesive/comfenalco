import { CustomError } from "../class/customError.mjs";
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
    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow",
    };
    try {
        const response = await fetch("https://comfenalcoquindio.online:8181/api/oauth2_pruebas/ext/login", requestOptions);
        const autenticado = await response.json();
        if ("error" in autenticado) {
            throw new CustomError("Fallo en la autentificacion", 401);
        }
        return autenticado;
    }
    catch (error) {
        if (error instanceof CustomError) {
            throw new CustomError(error.message, error.statusCode);
        }
        else {
            throw new CustomError("Fallo en el servidor de login", 500);
        }
    }
};
