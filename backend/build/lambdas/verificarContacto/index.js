"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const login_1 = require("../../auth/login");
const verificarContacto_1 = require("../../api/verificarContacto/verificarContacto");
const errorResponse_1 = require("../../utils/errorResponse");
const validarEvento_1 = require("./validarEvento");
const handler = async (event) => {
    try {
        const body = (0, validarEvento_1.validarEvento)(event);
        const { AfiliadoCelular, AfiliadoNumeroIdentificacion, AfiliadoTipoIdentificacion } = body;
        const { access_token } = await (0, login_1.login)();
        const verificado = await (0, verificarContacto_1.verificarContacto)({
            AfiliadoCelular,
            AfiliadoNumeroIdentificacion,
            AfiliadoTipoIdentificacion,
            token: access_token,
        });
        return {
            statusCode: 200,
            body: JSON.stringify({ verificado }),
        };
    }
    catch (error) {
        return (0, errorResponse_1.errorResponse)(error);
    }
};
exports.handler = handler;
