"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificarContacto = void 0;
const customError_js_1 = require("../../class/customError.mjs");
const verificarContacto = async ({ AfiliadoCelular, AfiliadoNumeroIdentificacion, AfiliadoTipoIdentificacion, token }) => {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        redirect: "follow",
    };
    try {
        const reponse = await fetch(`https://comfenalcoquindio.online:9090/api/comfenalco/verificar_contacto?celular=${AfiliadoCelular}&identificacion=${AfiliadoNumeroIdentificacion}&tipo_identificacion=${AfiliadoTipoIdentificacion}`, requestOptions);
        const verificado = await reponse.json();
        if (!verificado) {
            throw new customError_js_1.CustomError("Contacto no verificado", 404);
        }
        return verificado;
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
exports.verificarContacto = verificarContacto;
