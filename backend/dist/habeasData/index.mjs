import { habeasData } from "./habeasData.mjs";
export const handler = async (event, context) => {
    const response = await habeasData(event);
    return {
        statusCode: response.statusCode,
        body: JSON.stringify(response.message),
    };
};
