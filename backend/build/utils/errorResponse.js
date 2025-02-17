"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = void 0;
const customError_1 = require("../class/customError");
const errorResponse = (error) => {
    console.error("Error en el handler:", error);
    const statusCode = error instanceof customError_1.CustomError ? error.statusCode : 500;
    const message = error instanceof customError_1.CustomError ? error.message : "Error desconocido";
    return {
        statusCode,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ok: false,
            message,
        }),
    };
};
exports.errorResponse = errorResponse;
