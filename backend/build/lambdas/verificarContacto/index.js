"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.validarEvento = void 0;
const customError_1 = require("../../class/customError");
const login_1 = require("../../auth/login");
const verificarContacto_1 = require("../../api/verificarContacto/verificarContacto");
const errorResponse_1 = require("../../utils/errorResponse");
const validarEvento = (event) => {
    const body = JSON.parse(event.body || "{}");
    if (!body.AfiliadoCelular ||
        !body.AfiliadoNumeroIdentificacion ||
        !body.AfiliadoTipoIdentificacion) {
        throw new customError_1.CustomError("Faltan datos", 400);
    }
    return body;
};
exports.validarEvento = validarEvento;
const handler = async (event) => {
    try {
        const body = (0, exports.validarEvento)(event);
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
