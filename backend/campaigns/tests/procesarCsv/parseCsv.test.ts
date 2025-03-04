import { parseCsv } from "../../src/procesarCsv/utils";
import fs from "node:fs";
import * as path from "node:path";
import dataExpected from "./fileExpected";

describe("Parsing csv ...", () => {
  test("Parse csv correctly", async () => {
    const buff = fs.readFileSync(path.join(__dirname, "fileExample.csv"), {
      encoding: "utf8",
      flag: "r",
    });

    const dataReceived: { [key: string]: string }[] = [];

    await parseCsv(
      buff,
      async () => {},
      async (lineObj, _) => {
        dataReceived.push(lineObj);
      },
    );

    expect(dataReceived).toEqual(dataExpected);
  });
});
