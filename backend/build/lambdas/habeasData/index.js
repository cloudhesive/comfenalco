"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const customError_1 = require("../../class/customError");
const errorResponse_1 = require("../../utils/errorResponse");
const login_1 = require("../../auth/login");
const registrarHuella_1 = require("../../api/registrarHuella/registrarHuella");
const validarEvento = (event) => {
    const { id_llamada, identificacion, menu_id, tipo_identificacion, tratamiento_dato_id } = JSON.parse(event.body || "{}");
    if (!id_llamada || !identificacion || !menu_id || !tipo_identificacion || !tratamiento_dato_id) {
        throw new customError_1.CustomError("Faltan datos", 400);
    }
    return { id_llamada, identificacion, menu_id, tipo_identificacion, tratamiento_dato_id };
};
const handler = async (event, context) => {
    try {
        const { id_llamada, identificacion, menu_id, tipo_identificacion, tratamiento_dato_id } = validarEvento(event);
        const { access_token } = await (0, login_1.login)();
        const registroHuella = await (0, registrarHuella_1.registrarHuella)({
            id_llamada,
            identificacion,
            menu_id,
            tipo_identificacion,
            tratamiento_dato_id,
            token: access_token,
        });
        return {
            statusCode: 200,
            body: JSON.stringify({ registroHuella }),
        };
    }
    catch (error) {
        return (0, errorResponse_1.errorResponse)(error);
    }
};
exports.handler = handler;
