const csvSeparator = process.env.CSV_SEPARATOR ?? ";";

export const parseCsv = async (
  file: string,
  checkFormat: (_: { [key: string]: string }, __: number) => Promise<void>,
  finishProcess: (_: { [key: string]: string }, __: number) => Promise<void>,
) => {
  console.debug("File string: %s", file);

  const listaUsuarios = file.trim().split("\n");
  console.debug("Lista de lineas: %s", JSON.stringify(listaUsuarios, null, 4));

  const headers = listaUsuarios.shift();
  if (headers === undefined) {
    throw new Error("Error first line of file (headers), file might be empty", {
      cause: "Reading header of file",
    });
  }

  const headersList = headers.trim().split(csvSeparator);

  console.info("Usuarios encontrados en el archivo: %d", listaUsuarios.length);
  for (let idx = 0; idx < listaUsuarios.length; idx++) {
    console.info("Procesando linea ... (%d)", idx + 1);
    const line = listaUsuarios[idx];
    const lineObj = Object.fromEntries(
      line
        .trim()
        .split(csvSeparator)
        .map((item, indx) => [
          headersList.at(indx) ?? `Header ${indx}`,
          item.trim(),
        ]),
    );
    console.debug("Objeto recibido: %s", JSON.stringify(lineObj, null, 4));
    // NOTE: Check format
    await checkFormat(lineObj, idx);
    // NOTE: End: Check format
    await finishProcess(lineObj, idx);
  }
};
