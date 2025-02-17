import { CustomError } from "../class/customError";

export const errorResponse = (error: Error | unknown) => {
  console.error("Error en el handler:", error);

  const statusCode = error instanceof CustomError ? error.statusCode : 500;
  const message = error instanceof CustomError ? error.message : "Error desconocido";

  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ok: false,
      message,
    }),
  };
};
