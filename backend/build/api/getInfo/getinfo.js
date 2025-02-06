import { CustomError } from "../../class/customError.js";
export const getInfo = async ({ parametros, token }) => {
    const URL = process.env.URL || "example.api/";
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        redirect: "follow",
    };
    try {
        const reponse = await fetch(`${URL}?consulta=Afiliados&parametros=${parametros}`, requestOptions);
        const data = await reponse.json();
        const { AfiliadoCelular, AfiliadoNumeroIdentificacion, AfiliadoTipoIdentificacion } = data[0];
        if (!AfiliadoCelular || !AfiliadoNumeroIdentificacion || !AfiliadoTipoIdentificacion) {
            throw new CustomError("Afiliado no existe ", 404);
        }
        return {
            ok: true,
            statusCode: 200,
            body: {
                AfiliadoCelular,
                AfiliadoNumeroIdentificacion,
                AfiliadoTipoIdentificacion,
            },
        };
    }
    catch (error) {
        console.log(error);
        if (error instanceof CustomError) {
            throw new CustomError(error.message, error.statusCode);
        }
        else {
            throw new CustomError("Fallo en el servidor de login", 500);
        }
    }
};
