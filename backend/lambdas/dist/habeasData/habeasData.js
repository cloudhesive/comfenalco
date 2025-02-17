"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.habeasData = void 0;
const getinfo_js_1 = require("../api/getInfo/getinfo.js");
const verificarContacto_js_1 = require("../api/verificarContacto/verificarContacto.js");
const login_js_1 = require("../auth/login.js");
const customError_js_1 = require("../class/customError.js");
const habeasData = async ({ body }) => {
    try {
        const { parametros } = body;
        if (!parametros) {
            throw new customError_js_1.CustomError("Falta los parametros", 400);
        }
        const { access_token } = await (0, login_js_1.login)();
        const infoObtenida = await (0, getinfo_js_1.getInfo)({ parametros, token: access_token });
        const { AfiliadoCelular, AfiliadoNumeroIdentificacion, AfiliadoTipoIdentificacion } = infoObtenida.body;
        await (0, verificarContacto_js_1.verificarContacto)({ AfiliadoCelular, AfiliadoNumeroIdentificacion, AfiliadoTipoIdentificacion, token: access_token });
        return {
            ok: true,
            statusCode: 200,
            message: "Mensaje Enviado Correctamente",
        };
    }
    catch (error) {
        if (error instanceof customError_js_1.CustomError) {
            console.error(`Error ${error.statusCode}: ${error.message}`);
            return {
                ok: false,
                statusCode: error.statusCode,
                message: error.message,
            };
        }
        else {
            console.error("Error desconocido", error);
            return {
                ok: false,
                statusCode: 500,
                message: "Error inesperado",
            };
        }
    }
};
exports.habeasData = habeasData;
