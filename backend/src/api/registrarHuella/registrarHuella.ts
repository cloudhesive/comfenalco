export const registrarHuella = async () => {
  const raw = JSON.stringify({
    id_llamada: "string",
    identificacion: "string",
    menu_id: 0,
    tipo_identificacion: "string",
    tratamiento_dato_id: 0,
  });

  const requestOptions: RequestInit = {
    method: "POST",
    body: raw,
    redirect: "follow",
  };
  try {
    const registrado = await fetch("https://comfenalcoquindio.online:9090/api/comfenalco/registrar_huella", requestOptions);
  } catch (error) {}
};
