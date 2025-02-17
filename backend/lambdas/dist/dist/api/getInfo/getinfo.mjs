"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInfo = void 0;
const customError_js_1 = require("../../class/customError.mjs");
const getInfo = async ({ parametros, token }) => {
    const URL = process.env.URL || "example.api/";
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        redirect: "follow",
    };
    try {
        const reponse = await fetch(`${URL}?consulta=Afiliados&parametros=${parametros}`, requestOptions);
        const data = await reponse.json();
        const { AfiliadoCelular, AfiliadoNumeroIdentificacion, AfiliadoTipoIdentificacion } = data[0];
        if (!AfiliadoCelular || !AfiliadoNumeroIdentificacion || !AfiliadoTipoIdentificacion) {
            throw new customError_js_1.CustomError("Afiliado no existe ", 404);
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
    }
    catch (error) {
        console.log(error);
        if (error instanceof customError_js_1.CustomError) {
            throw new customError_js_1.CustomError(error.message, error.statusCode);
        }
        else {
            throw new customError_js_1.CustomError("Fallo en el servidor de login", 500);
        }
    }
};
exports.getInfo = getInfo;
