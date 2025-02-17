"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const habeasData_js_1 = require("./habeasData.mjs");
const handler = async (event, context) => {
    const response = await (0, habeasData_js_1.habeasData)(event);
    return {
        statusCode: response.statusCode,
        body: JSON.stringify(response.message),
    };
};
exports.handler = handler;
