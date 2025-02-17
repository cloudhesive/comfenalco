"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const customError_js_1 = require("../class/customError.js");
const login = async () => {
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
            throw new customError_js_1.CustomError("Fallo en la autentificacion", 401);
        }
        return autenticado;
    }
    catch (error) {
        if (error instanceof customError_js_1.CustomError) {
            throw new customError_js_1.CustomError(error.message, error.statusCode);
        }
        else {
            throw new customError_js_1.CustomError("Fallo en el servidor de login", 500);
        }
    }
};
exports.login = login;
