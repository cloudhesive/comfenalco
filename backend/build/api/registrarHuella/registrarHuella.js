"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrarHuella = void 0;
const customError_1 = require("../../class/customError");
const registrarHuella = async ({ id_llamada, identificacion, menu_id, tipo_identificacion, tratamiento_dato_id, token, }) => {
    const raw = JSON.stringify({
        id_llamada,
        identificacion,
        menu_id,
        tipo_identificacion,
        tratamiento_dato_id,
    });
    const requestOptions = {
        method: "POST",
        body: raw,
        redirect: "follow",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };
    try {
        const response = await fetch("https://comfenalcoquindio.online:9090/api/comfenalco/registrar_huella", requestOptions);
        if (!response.ok) {
            throw new customError_1.CustomError("Error al registrar huella", 400);
        }
        return true;
    }
    catch (error) {
        console.error(error);
        if (error instanceof customError_1.CustomError) {
            throw new customError_1.CustomError(error.message, error.statusCode);
        }
        throw new customError_1.CustomError("Error al registrar huella", 500);
    }
};
exports.registrarHuella = registrarHuella;
