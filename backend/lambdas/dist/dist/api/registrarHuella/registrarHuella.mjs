"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrarHuella = void 0;
const registrarHuella = async () => {
    const raw = JSON.stringify({
        id_llamada: "string",
        identificacion: "string",
        menu_id: 0,
        tipo_identificacion: "string",
        tratamiento_dato_id: 0,
    });
    const requestOptions = {
        method: "POST",
        body: raw,
        redirect: "follow",
    };
    try {
        const registrado = await fetch("https://comfenalcoquindio.online:9090/api/comfenalco/registrar_huella", requestOptions);
    }
    catch (error) { }
};
exports.registrarHuella = registrarHuella;
