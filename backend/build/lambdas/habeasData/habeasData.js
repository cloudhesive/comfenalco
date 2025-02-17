"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.habeasData = void 0;
const customError_1 = require("../../class/customError");
const login_1 = require("../../auth/login");
const getinfo_1 = require("../../api/getInfo/getinfo");
const verificarContacto_1 = require("../../api/verificarContacto/verificarContacto");
const habeasData = async ({ body }) => {
    try {
        const { parametros } = body;
        if (!parametros) {
            throw new customError_1.CustomError("Falta los parametros", 400);
        }
        const { access_token } = await (0, login_1.login)();
        const infoObtenida = await (0, getinfo_1.getInfo)({ parametros, token: access_token });
        const { AfiliadoCelular, AfiliadoNumeroIdentificacion, AfiliadoTipoIdentificacion } = infoObtenida.body;
        await (0, verificarContacto_1.verificarContacto)({
            AfiliadoCelular,
            AfiliadoNumeroIdentificacion,
            AfiliadoTipoIdentificacion,
            token: access_token,
        });
        return {
            ok: true,
            statusCode: 200,
            message: "Mensaje Enviado Correctamente",
        };
    }
    catch (error) {
        if (error instanceof customError_1.CustomError) {
            console.error(`Error ${error.statusCode}: ${error.message}`);
            return {
                ok: false,
                statusCode: error.statusCode,
                message: error.message,
            };
        }
        console.error("Error desconocido", error);
        return {
            ok: false,
            statusCode: 500,
            message: "Error inesperado",
        };
    }
};
exports.habeasData = habeasData;
